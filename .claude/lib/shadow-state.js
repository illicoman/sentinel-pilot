'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_SHADOW_STATE_DIR = '/tmp/sentinel-pilot-claude-shadow-state';

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
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

function appendPreToolUseShadowRecord(payload = {}, result = {}, options = {}) {
  const normalizedPayload = normalizeHookPayload(payload);
  const statePath = buildSessionShadowStatePath(normalizedPayload.sessionId, options);

  if (!statePath || !normalizedPayload.toolName || !result || !result.decision) {
    return null;
  }

  const directory = path.dirname(statePath);
  const record = {
    recordedAt: new Date().toISOString(),
    sessionId: normalizedPayload.sessionId,
    toolName: normalizedPayload.toolName,
    toolFingerprint: buildToolFingerprint(normalizedPayload.toolName, normalizedPayload.toolInput),
    decision: normalizeNonEmptyString(result.decision),
    nextSafeAction: normalizeNonEmptyString(result.nextSafeAction),
    hostActionSummary: normalizeNonEmptyString(result.hostActionSummary),
  };

  fs.mkdirSync(directory, { recursive: true });
  fs.appendFileSync(statePath, JSON.stringify(record) + '\n', 'utf8');
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
  buildSessionShadowStatePath,
  buildToolFingerprint,
  findLatestPreToolUseShadowRecord,
  normalizeHookPayload,
  resolveShadowStateDir,
};
