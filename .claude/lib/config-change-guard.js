'use strict';

function normalizeNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function normalizePath(value) {
  const normalized = normalizeNonEmptyString(value);
  return normalized ? normalized.replace(/\\/g, '/') : null;
}

function normalizeConfigChangePayload(payload = {}) {
  return {
    source: normalizeNonEmptyString(payload.source),
    filePath: normalizePath(payload.file_path || payload.filePath),
    hookEventName: normalizeNonEmptyString(payload.hook_event_name || payload.hookEventName),
  };
}

function buildBlockReason(label) {
  return [
    'Changement de configuration locale critique bloque pendant une session Sentinel gouvernee:',
    label + '.',
    'Terminez la session puis faites ce changement explicitement hors session si vous devez reconfigurer le pack Claude.'
  ].join(' ');
}

function classifyConfigChange(payload = {}) {
  const normalized = normalizeConfigChangePayload(payload);
  const filePath = normalized.filePath || '';

  if (normalized.source === 'project_settings' || filePath.endsWith('/.claude/settings.json')) {
    return Object.assign({}, normalized, {
      category: 'critical_project_settings',
      shouldBlock: true,
      reason: buildBlockReason('.claude/settings.json'),
    });
  }

  if (normalized.source === 'local_settings' || filePath.endsWith('/.claude/settings.local.json')) {
    return Object.assign({}, normalized, {
      category: 'critical_local_settings',
      shouldBlock: true,
      reason: buildBlockReason('.claude/settings.local.json'),
    });
  }

  if (normalized.source === 'skills') {
    return Object.assign({}, normalized, {
      category: 'skills_audit_only',
      shouldBlock: false,
      reason: null,
    });
  }

  return Object.assign({}, normalized, {
    category: 'ignored',
    shouldBlock: false,
    reason: null,
  });
}

function buildConfigChangeHookOutput(payload = {}) {
  const classification = classifyConfigChange(payload);

  if (!classification.shouldBlock) {
    return null;
  }

  return {
    decision: 'block',
    reason: classification.reason,
    hookSpecificOutput: {
      hookEventName: 'ConfigChange',
    },
  };
}

module.exports = {
  buildConfigChangeHookOutput,
  classifyConfigChange,
  normalizeConfigChangePayload,
};
