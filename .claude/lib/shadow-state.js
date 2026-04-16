'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_SHADOW_STATE_DIR = '/tmp/sentinel-pilot-claude-shadow-state';
const CANONICAL_EVENT_SOURCE = 'sentinel-shadow';

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function normalizeDecision(value) {
  const normalized = normalizeNonEmptyString(value);
  return normalized ? normalized.toUpperCase() : null;
}

function normalizeHookPayload(payload = {}) {
  return {
    sessionId: normalizeNonEmptyString(payload.session_id || payload.sessionId),
    toolName: normalizeNonEmptyString(payload.tool_name || payload.toolName),
    toolInput: isPlainObject(payload.tool_input) ? payload.tool_input : (isPlainObject(payload.toolInput) ? payload.toolInput : null),
  };
}

function stableSerialize(value) {
  if (Array.isArray(value)) {
    return value.map(stableSerialize);
  }

  if (!isPlainObject(value)) {
    return value;
  }

  return Object.keys(value).sort().reduce(function assignSorted(accumulator, key) {
    accumulator[key] = stableSerialize(value[key]);
    return accumulator;
  }, {});
}

function buildToolFingerprint(toolName, toolInput) {
  return crypto.createHash('sha256')
    .update(JSON.stringify({
      toolName: toolName || null,
      toolInput: stableSerialize(toolInput || null),
    }))
    .digest('hex');
}

function resolveShadowStateDir(options = {}) {
  return normalizeNonEmptyString(options.shadowStateDir) ||
    normalizeNonEmptyString(process.env.SENTINEL_CLAUDE_SHADOW_STATE_DIR) ||
    DEFAULT_SHADOW_STATE_DIR;
}

function buildSessionShadowStatePath(sessionId, options = {}) {
  const normalizedSessionId = normalizeNonEmptyString(sessionId);

  if (!normalizedSessionId) {
    return null;
  }

  return path.join(resolveShadowStateDir(options), normalizedSessionId + '.jsonl');
}

function buildSessionCanonicalEventsPath(sessionId, options = {}) {
  const normalizedSessionId = normalizeNonEmptyString(sessionId);

  if (!normalizedSessionId) {
    return null;
  }

  return path.join(resolveShadowStateDir(options), normalizedSessionId + '.canonical.jsonl');
}

function compactObject(value) {
  return Object.keys(value).reduce(function assign(accumulator, key) {
    if (value[key] === undefined || value[key] === null || value[key] === '') {
      return accumulator;
    }

    accumulator[key] = value[key];
    return accumulator;
  }, {});
}

function buildShadowInputSummary(toolName, toolInput) {
  if (!isPlainObject(toolInput)) {
    return null;
  }

  if (toolName === 'Bash') {
    return normalizeNonEmptyString(toolInput.command);
  }

  if (toolName === 'Edit' || toolName === 'MultiEdit' || toolName === 'Write') {
    if (typeof toolInput.file_path === 'string' && toolInput.file_path.trim().length > 0) {
      return toolInput.file_path.trim();
    }

    if (Array.isArray(toolInput.file_paths) && toolInput.file_paths.length > 0) {
      return toolInput.file_paths
        .filter(function keepNonEmptyString(value) {
          return typeof value === 'string' && value.trim().length > 0;
        })
        .map(function normalizePath(value) {
          return value.trim();
        })
        .join(', ');
    }
  }

  return null;
}

function mapDecisionToCanonicalEventName(decision) {
  if (decision === 'ALLOW') {
    return 'decision.allow';
  }

  if (decision === 'DENY') {
    return 'decision.deny';
  }

  if (decision === 'REQUIRE_APPROVAL') {
    return 'decision.require_approval';
  }

  if (decision === 'MODIFY') {
    return 'decision.modify';
  }

  return null;
}

function buildCanonicalEventsFromPreToolUse(payload = {}, result = {}, options = {}) {
  const normalizedPayload = normalizeHookPayload(payload);

  if (!normalizedPayload.toolName) {
    return [];
  }

  const timestamp = normalizeNonEmptyString(options.timestamp) || new Date().toISOString();
  const tool = normalizedPayload.toolName;
  const input = buildShadowInputSummary(tool, normalizedPayload.toolInput);
  const decision = normalizeDecision(result && result.decision);
  const decisionEventName = mapDecisionToCanonicalEventName(decision);
  const actionEvent = compactObject({
    event: 'action.proposed',
    tool,
    input,
    source: CANONICAL_EVENT_SOURCE,
    timestamp,
  });

  if (!decisionEventName) {
    return [actionEvent];
  }

  return [
    actionEvent,
    compactObject({
      event: decisionEventName,
      tool,
      decision,
      source: CANONICAL_EVENT_SOURCE,
      timestamp,
    }),
  ];
}

function appendJsonLines(filePath, records) {
  if (!filePath || !Array.isArray(records) || records.length === 0) {
    return;
  }

  const directory = path.dirname(filePath);
  const serialized = records.map(function serialize(record) {
    return JSON.stringify(record);
  }).join('\n') + '\n';

  fs.mkdirSync(directory, { recursive: true });
  fs.appendFileSync(filePath, serialized, 'utf8');
}

function appendPreToolUseCanonicalEvents(payload = {}, result = {}, options = {}) {
  const normalizedPayload = normalizeHookPayload(payload);
  const statePath = buildSessionCanonicalEventsPath(normalizedPayload.sessionId, options);
  const events = buildCanonicalEventsFromPreToolUse(payload, result, options);

  if (!statePath || events.length === 0) {
    return [];
  }

  appendJsonLines(statePath, events);
  return events;
}

function appendPreToolUseShadowRecord(payload = {}, result = {}, options = {}) {
  const normalizedPayload = normalizeHookPayload(payload);
  const statePath = buildSessionShadowStatePath(normalizedPayload.sessionId, options);

  appendPreToolUseCanonicalEvents(payload, result, options);

  if (!statePath || !normalizedPayload.toolName || !result || !result.decision) {
    return null;
  }

  const record = {
    recordedAt: new Date().toISOString(),
    sessionId: normalizedPayload.sessionId,
    toolName: normalizedPayload.toolName,
    toolFingerprint: buildToolFingerprint(normalizedPayload.toolName, normalizedPayload.toolInput),
    decision: normalizeNonEmptyString(result.decision),
    nextSafeAction: normalizeNonEmptyString(result.nextSafeAction),
    hostActionSummary: normalizeNonEmptyString(result.hostActionSummary),
  };

  appendJsonLines(statePath, [record]);
  return record;
}

function findLatestPreToolUseShadowRecord(payload = {}, options = {}) {
  const normalizedPayload = normalizeHookPayload(payload);
  const statePath = buildSessionShadowStatePath(normalizedPayload.sessionId, options);

  if (!statePath || !normalizedPayload.toolName || !fs.existsSync(statePath)) {
    return null;
  }

  const expectedFingerprint = buildToolFingerprint(normalizedPayload.toolName, normalizedPayload.toolInput);
  const lines = fs.readFileSync(statePath, 'utf8')
    .split(/\r?\n/)
    .filter(function keepNonEmpty(line) {
      return line.trim().length > 0;
    });

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    let record = null;

    try {
      record = JSON.parse(lines[index]);
    } catch (error) {
      continue;
    }

    if (!isPlainObject(record) || record.toolFingerprint !== expectedFingerprint) {
      continue;
    }

    return record;
  }

  return null;
}

module.exports = {
  appendPreToolUseShadowRecord,
  appendPreToolUseCanonicalEvents,
  buildCanonicalEventsFromPreToolUse,
  buildSessionCanonicalEventsPath,
  buildSessionShadowStatePath,
  buildShadowInputSummary,
  buildToolFingerprint,
  findLatestPreToolUseShadowRecord,
  mapDecisionToCanonicalEventName,
  normalizeHookPayload,
  normalizeDecision,
  resolveShadowStateDir,
};
