'use strict';

const {
  findLatestPreToolUseShadowRecord,
} = require('./shadow-state');

const PERMISSION_DENIED_PATTERN = /\b(permission denied|requested permissions)\b/i;

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function normalizePostToolUseFailurePayload(payload = {}) {
  return {
    sessionId: normalizeNonEmptyString(payload.session_id || payload.sessionId),
    toolName: normalizeNonEmptyString(payload.tool_name || payload.toolName),
    toolInput: isPlainObject(payload.tool_input) ? payload.tool_input : (isPlainObject(payload.toolInput) ? payload.toolInput : null),
    hookEventName: normalizeNonEmptyString(payload.hook_event_name || payload.hookEventName),
    error: normalizeNonEmptyString(payload.error),
    isInterrupt: payload.is_interrupt === true || payload.isInterrupt === true,
  };
}

function buildGuidanceAdditionalContext(nextSafeAction, toolName, sawPermissionDenied) {
  const prefix = sawPermissionDenied
    ? 'Guidance locale apres PermissionDenied natif Claude sur ' + toolName + '.'
    : 'Guidance locale apres echec tool-side sur ' + toolName + '.';

  if (nextSafeAction === 'run_in_sandbox') {
    return [
      prefix,
      'La guidance shadow Sentinel la plus proche pour cette action est run_in_sandbox.',
      'Preferez relancer dans un sandbox borne plutot que retenter a l identique.',
    ].join(' ');
  }

  if (nextSafeAction === 'request_human_approval') {
    return [
      prefix,
      'La guidance shadow Sentinel la plus proche pour cette action est request_human_approval.',
      'Demandez une approbation humaine avant toute nouvelle tentative.',
    ].join(' ');
  }

  if (nextSafeAction === 'open_pull_request') {
    return [
      prefix,
      'La guidance shadow Sentinel la plus proche pour cette action est open_pull_request.',
      'Preferez un chemin PR borne plutot qu une nouvelle tentative directe.',
    ].join(' ');
  }

  if (nextSafeAction === 'narrow_scope') {
    return [
      prefix,
      'La guidance shadow Sentinel la plus proche pour cette action est narrow_scope.',
      'Reduisez le scope de la tentative avant de relancer.',
    ].join(' ');
  }

  if (nextSafeAction === 'reformulate_request') {
    return [
      prefix,
      'La guidance shadow Sentinel la plus proche pour cette action est reformulate_request.',
      'Reformulez la demande au lieu de relancer a l identique.',
    ].join(' ');
  }

  return null;
}

function buildPostToolUseFailureHookOutput(payload = {}, options = {}) {
  const normalized = normalizePostToolUseFailurePayload(payload);

  if (normalized.isInterrupt || !normalized.sessionId || !normalized.toolName || !normalized.error) {
    return null;
  }

  const record = findLatestPreToolUseShadowRecord({
    session_id: normalized.sessionId,
    tool_name: normalized.toolName,
    tool_input: normalized.toolInput,
  }, options);

  if (!record || !record.nextSafeAction) {
    return null;
  }

  const additionalContext = buildGuidanceAdditionalContext(
    record.nextSafeAction,
    normalized.toolName,
    PERMISSION_DENIED_PATTERN.test(normalized.error)
  );

  if (!additionalContext) {
    return null;
  }

  return {
    hookSpecificOutput: {
      hookEventName: 'PostToolUseFailure',
      additionalContext,
    },
  };
}

module.exports = {
  buildPostToolUseFailureHookOutput,
  buildGuidanceAdditionalContext,
  normalizePostToolUseFailurePayload,
};
