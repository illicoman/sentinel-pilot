'use strict';

const http = require('node:http');
const https = require('node:https');
const path = require('node:path');

const DEFAULT_DECISION_API_URL = 'https://decision-api.frenchlink.fr';
const SUPPORTED_TOOL_NAMES = new Set(['Bash', 'Edit', 'MultiEdit', 'Write']);
const PROD_PATTERN = /\b(prod|production)\b/i;
const STAGING_PATTERN = /\b(staging|pre-?prod)\b/i;
const AUTH_PATTERN = /\b(auth|login|oauth|session|token|credential)\b/i;
const BILLING_PATTERN = /\b(payment|billing|invoice|facturation|paiement)\b/i;
const SENSITIVE_CONFIG_PATTERN = /\b(config|configuration|secret|\.env|credential|credentials)\b/i;
const DESTRUCTIVE_BASH_PATTERN = /\b(rm\s+-r[fF]?|del\s+\/|unlink|mkfs|dd|shutdown)\b/i;
const DEPLOY_PATTERN = /\bdeploy\b/i;
const DRY_RUN_PATTERN = /\b(--dry-run|dry-run)\b/i;

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function collectTextFragments(payload = {}) {
  const toolInput = isPlainObject(payload.tool_input) ? payload.tool_input : {};

  return [
    payload.cwd,
    toolInput.command,
    toolInput.description,
    toolInput.file_path,
    toolInput.old_string,
    toolInput.new_string,
    toolInput.content,
    Array.isArray(toolInput.file_paths) ? toolInput.file_paths.join(' ') : null,
  ].filter(function keepNonEmpty(value) {
    return typeof value === 'string' && value.trim().length > 0;
  });
}

function detectEnvironment(payload = {}) {
  const command = normalizeString(payload.tool_input && payload.tool_input.command);
  const corpus = collectTextFragments(payload).join(' ');

  if (/git\s+push\b/i.test(command) && /\bmain\b/i.test(command)) {
    return 'prod';
  }

  if (PROD_PATTERN.test(corpus)) {
    return 'prod';
  }

  if (STAGING_PATTERN.test(corpus)) {
    return 'staging';
  }

  return 'dev';
}

function detectBranch(payload = {}) {
  const command = normalizeString(payload.tool_input && payload.tool_input.command);

  if (/HEAD:main\b/.test(command) || /\borigin\/main\b/.test(command) || /\bmain\b/.test(command)) {
    return 'main';
  }

  return null;
}

function collectRequestedScope(payload = {}, branch) {
  const toolInput = isPlainObject(payload.tool_input) ? payload.tool_input : {};

  if (payload.tool_name === 'Bash') {
    if (branch === 'main') {
      return ['origin/main'];
    }

    return [normalizeString(payload.cwd) || 'workspace'];
  }

  if (typeof toolInput.file_path === 'string' && toolInput.file_path.trim().length > 0) {
    return [toolInput.file_path.trim()];
  }

  if (Array.isArray(toolInput.file_paths) && toolInput.file_paths.length > 0) {
    return toolInput.file_paths
      .filter(function keepPath(entry) {
        return typeof entry === 'string' && entry.trim().length > 0;
      })
      .map(function normalizePath(entry) {
        return entry.trim();
      });
  }

  return [normalizeString(payload.cwd) || 'workspace'];
}

function detectRequestedAction(payload = {}, environment, branch) {
  const toolInput = isPlainObject(payload.tool_input) ? payload.tool_input : {};
  const command = normalizeString(toolInput.command);
  const corpus = collectTextFragments(payload).join(' ');

  if (payload.tool_name === 'Bash') {
    if (/git\s+push\b/i.test(command) && branch === 'main') {
      return 'push_main';
    }

    if (DESTRUCTIVE_BASH_PATTERN.test(command)) {
      return 'delete_files';
    }

    if (DEPLOY_PATTERN.test(command) && environment === 'prod') {
      return 'deploy_prod';
    }

    if (DRY_RUN_PATTERN.test(command)) {
      return 'run_dry_run';
    }

    return 'run_command';
  }

  if (AUTH_PATTERN.test(corpus)) {
    return 'modify_auth';
  }

  if (BILLING_PATTERN.test(corpus)) {
    return 'billing_change';
  }

  if (SENSITIVE_CONFIG_PATTERN.test(corpus)) {
    return 'write_sensitive_config';
  }

  return 'write_file';
}

function detectObservedActionType(payload = {}) {
  const toolInput = isPlainObject(payload.tool_input) ? payload.tool_input : {};
  const command = normalizeString(toolInput.command);

  if (payload.tool_name === 'Bash') {
    return DESTRUCTIVE_BASH_PATTERN.test(command) ? 'delete' : null;
  }

  if (payload.tool_name === 'Write') {
    return 'write_file';
  }

  if (payload.tool_name === 'Edit' || payload.tool_name === 'MultiEdit') {
    return 'edit_file';
  }

  return null;
}

function detectTarget(payload = {}, requestedScope, branch) {
  const toolInput = isPlainObject(payload.tool_input) ? payload.tool_input : {};

  if (payload.tool_name === 'Bash' && branch === 'main') {
    return 'origin/main';
  }

  if (typeof toolInput.file_path === 'string' && toolInput.file_path.trim().length > 0) {
    return path.basename(toolInput.file_path.trim());
  }

  if (Array.isArray(requestedScope) && requestedScope.length > 0) {
    return requestedScope[0];
  }

  return path.basename(normalizeString(payload.cwd) || 'workspace');
}

function detectResourceSensitivity(payload = {}, environment, branch) {
  const toolInput = isPlainObject(payload.tool_input) ? payload.tool_input : {};
  const corpus = collectTextFragments(payload).join(' ');
  const command = normalizeString(toolInput.command);

  if (DESTRUCTIVE_BASH_PATTERN.test(command)) {
    return 'critical';
  }

  if (AUTH_PATTERN.test(corpus) || BILLING_PATTERN.test(corpus) || SENSITIVE_CONFIG_PATTERN.test(corpus) || branch === 'main' || environment === 'prod') {
    return 'high';
  }

  if (SUPPORTED_TOOL_NAMES.has(payload.tool_name)) {
    return 'medium';
  }

  return 'low';
}

function detectCriticality(payload = {}, environment, branch) {
  const toolInput = isPlainObject(payload.tool_input) ? payload.tool_input : {};
  const command = normalizeString(toolInput.command);

  if (DESTRUCTIVE_BASH_PATTERN.test(command)) {
    return 'critical';
  }

  if (branch === 'main' || environment === 'prod') {
    return 'high';
  }

  if (payload.tool_name === 'Edit' || payload.tool_name === 'MultiEdit' || payload.tool_name === 'Write') {
    return 'medium';
  }

  return 'low';
}

function inferBackupAvailability(payload = {}, environment) {
  const corpus = collectTextFragments(payload).join(' ');
  const command = normalizeString(payload.tool_input && payload.tool_input.command);

  if (DESTRUCTIVE_BASH_PATTERN.test(command)) {
    return false;
  }

  if (environment === 'prod' && (AUTH_PATTERN.test(corpus) || SENSITIVE_CONFIG_PATTERN.test(corpus))) {
    return false;
  }

  return true;
}

function inferRecentIncident(payload = {}, environment) {
  return environment === 'prod' && AUTH_PATTERN.test(collectTextFragments(payload).join(' '));
}

function inferApprovalPathAvailability(payload = {}) {
  const command = normalizeString(payload.tool_input && payload.tool_input.command);
  return !DESTRUCTIVE_BASH_PATTERN.test(command);
}

function inferTrustLevel(payload = {}) {
  return payload.permission_mode === 'bypassPermissions' ? 'low' : 'standard';
}

function summarizeHostAction(payload = {}) {
  const toolInput = isPlainObject(payload.tool_input) ? payload.tool_input : {};

  if (payload.tool_name === 'Bash') {
    return 'Claude runs "' + (normalizeString(toolInput.command) || 'unknown command') + '"';
  }

  if (payload.tool_name === 'Write') {
    return 'Claude writes ' + (normalizeString(toolInput.file_path) || 'a file');
  }

  if (payload.tool_name === 'Edit' || payload.tool_name === 'MultiEdit') {
    return 'Claude edits ' + (normalizeString(toolInput.file_path) || 'a file');
  }

  return 'Claude tries a governed action';
}

function inferServiceOrRepo(payload = {}, target) {
  const cwd = normalizeString(payload.cwd);
  return cwd.length > 0 ? path.basename(cwd) : (target || 'workspace');
}

function buildShadowEventFromClaudePreToolUse(payload = {}) {
  if (!SUPPORTED_TOOL_NAMES.has(payload.tool_name)) {
    return null;
  }

  const environment = detectEnvironment(payload);
  const branch = detectBranch(payload);
  const requestedScope = collectRequestedScope(payload, branch);
  const target = detectTarget(payload, requestedScope, branch);
  const toolInput = isPlainObject(payload.tool_input) ? payload.tool_input : {};
  const observedActionType = detectObservedActionType(payload);
  const command = normalizeString(toolInput.command) || null;
  const hostActionSummary = summarizeHostAction(payload);
  const observedAction = observedActionType
    ? {
      type: observedActionType,
      files: requestedScope.filter(function keepFile(entry) {
        return entry !== 'workspace' && entry !== 'origin/main';
      }),
      branch,
      command,
    }
    : null;

  return {
    eventType: 'pre_tool_use',
    host: 'claude-code',
    toolName: payload.tool_name,
    hostActionSummary,
    userRequest: 'Evaluate this Claude action in shadow: ' + hostActionSummary + '.',
    requestedAction: detectRequestedAction(payload, environment, branch),
    target,
    requestedScope,
    environment,
    branch,
    command,
    serviceOrRepo: inferServiceOrRepo(payload, target),
    resourceSensitivity: detectResourceSensitivity(payload, environment, branch),
    criticality: detectCriticality(payload, environment, branch),
    backupAvailable: inferBackupAvailability(payload, environment),
    recentIncident: inferRecentIncident(payload, environment),
    approvalPathAvailable: inferApprovalPathAvailability(payload),
    trustLevel: inferTrustLevel(payload),
    observedAction,
    hostMetadata: {
      toolName: payload.tool_name,
      hookEventName: payload.hook_event_name || 'PreToolUse',
      permissionMode: payload.permission_mode || null,
      transcriptPath: payload.transcript_path || null,
      toolUseId: payload.tool_use_id || null,
    },
  };
}

function compactObject(value) {
  return Object.keys(value).reduce(function assign(accumulator, key) {
    if (value[key] === undefined || value[key] === null || value[key] === '') {
      return accumulator;
    }

    if (Array.isArray(value[key]) && value[key].length === 0) {
      return accumulator;
    }

    accumulator[key] = value[key];
    return accumulator;
  }, {});
}

function buildEvaluateRequestFromShadowEvent(event = {}) {
  return compactObject({
    userRequest: event.userRequest || event.hostActionSummary,
    host: event.host,
    environment: event.environment,
    target: event.target,
    serviceOrRepo: event.serviceOrRepo,
    resourceSensitivity: event.resourceSensitivity,
    criticality: event.criticality,
    requestedAction: event.requestedAction,
    requestedScope: event.requestedScope,
    approvalPathAvailable: event.approvalPathAvailable,
    backupAvailable: event.backupAvailable,
    trustLevel: event.trustLevel,
    recentIncident: event.recentIncident,
    branch: event.branch,
    command: event.command,
    observedAction: event.observedAction,
  });
}

function resolveEvaluateUrl(value) {
  const normalized = normalizeString(value || DEFAULT_DECISION_API_URL).replace(/\/+$/, '');
  return normalized.endsWith('/evaluate') ? normalized : normalized + '/evaluate';
}

function requestJson(urlString, body, options = {}, dependencies = {}) {
  if (typeof dependencies.requestJson === 'function') {
    return dependencies.requestJson(urlString, body, options);
  }

  return new Promise(function executeRequest(resolve, reject) {
    const url = new URL(urlString);
    const payload = JSON.stringify(body);
    const transport = url.protocol === 'https:' ? https : http;
    const request = transport.request(url, {
      method: 'POST',
      headers: Object.assign({
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(payload),
      }, options.headers || {}),
      timeout: options.timeoutMs || 10000,
    }, function onResponse(response) {
      const chunks = [];

      response.on('data', function onData(chunk) {
        chunks.push(chunk);
      });

      response.on('end', function onEnd() {
        try {
          const raw = Buffer.concat(chunks).toString('utf8');
          const text = raw.trim();
          const parsed = text.length === 0 ? {} : JSON.parse(text);

          if (response.statusCode >= 400) {
            const error = new Error('decision_api_error_' + response.statusCode);
            error.statusCode = response.statusCode;
            error.responseBody = parsed;
            reject(error);
            return;
          }

          resolve(parsed);
        } catch (error) {
          reject(error);
        }
      });
    });

    request.on('timeout', function onTimeout() {
      request.destroy(new Error('decision_api_timeout'));
    });
    request.on('error', reject);
    request.write(payload);
    request.end();
  });
}

async function evaluateShadowEvent(event = {}, options = {}, dependencies = {}) {
  const apiKey = normalizeString(options.apiKey);

  if (!apiKey) {
    return {
      hostActionSummary: event.hostActionSummary,
      decision: null,
      nextSafeAction: 'reveal_api_key_then_retry_shadow',
      summary: null,
      explanation: null,
      shadowOnly: true,
      enforcement: 'external',
    };
  }

  try {
    const response = await requestJson(resolveEvaluateUrl(options.url), buildEvaluateRequestFromShadowEvent(event), {
      headers: {
        'x-api-key': apiKey,
      },
      timeoutMs: options.timeoutMs,
    }, dependencies);

    return {
      hostActionSummary: event.hostActionSummary,
      decision: normalizeString(response.decision) || null,
      nextSafeAction: normalizeString(response.nextSafeAction) || 'review_decision',
      summary: normalizeString(response.summary) || null,
      explanation: normalizeString(response.explanation) || null,
      shadowOnly: response.shadowOnly === true || normalizeString(response.enforcement) === 'external',
      enforcement: normalizeString(response.enforcement) || null,
    };
  } catch (error) {
    return {
      hostActionSummary: event.hostActionSummary,
      decision: null,
      nextSafeAction: 'verify_public_decision_api_then_retry_shadow',
      summary: null,
      explanation: normalizeString(error && error.message) || null,
      shadowOnly: true,
      enforcement: 'external',
    };
  }
}

function formatShadowDecisionForClaudePreToolUse(result = {}) {
  return [
    'Action: ' + (result.hostActionSummary || 'Claude tries a governed action'),
    'Decision: ' + (result.decision || 'NON_PROUVE'),
    'Next safe action: ' + (result.nextSafeAction || 'review_decision'),
  ].join('\n');
}

function buildClaudePreToolUseHookOutput(result = {}) {
  const summary = formatShadowDecisionForClaudePreToolUse(result);

  return {
    systemMessage: summary,
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      additionalContext: 'Shadow governance result before tool execution.\n' + summary,
    },
  };
}

async function evaluateClaudePreToolUseShadow(payload = {}, options = {}, dependencies = {}) {
  const shadowEvent = buildShadowEventFromClaudePreToolUse(payload);

  if (!shadowEvent) {
    return {
      skipped: true,
      reason: 'unsupported_tool',
      shadowEvent: null,
      result: null,
      hookOutput: null,
    };
  }

  const evaluate = typeof dependencies.evaluateShadow === 'function'
    ? dependencies.evaluateShadow
    : evaluateShadowEvent;
  const result = await evaluate(shadowEvent, {
    url: options.url || process.env.AGENT_DECISION_API_URL || DEFAULT_DECISION_API_URL,
    apiKey: options.apiKey || process.env.AGENT_DECISION_API_KEY,
    timeoutMs: options.timeoutMs,
  }, dependencies);

  return {
    skipped: false,
    reason: null,
    shadowEvent,
    result,
    hookOutput: buildClaudePreToolUseHookOutput(result),
  };
}

module.exports = {
  DEFAULT_DECISION_API_URL,
  SUPPORTED_TOOL_NAMES,
  buildClaudePreToolUseHookOutput,
  buildEvaluateRequestFromShadowEvent,
  buildShadowEventFromClaudePreToolUse,
  evaluateClaudePreToolUseShadow,
  evaluateShadowEvent,
  formatShadowDecisionForClaudePreToolUse,
  resolveEvaluateUrl,
};
