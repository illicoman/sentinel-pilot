'use strict';

const ANTI_GOVERNANCE_PATTERN =
  /\b(?:ignore|disable|desactive|desactivez|désactive|désactivez|bypass|bypasse|contourne|remove|turn off|skip)\b[\s\S]{0,80}\b(?:sentinel|governance|hook|approval|sandbox|guard|verify|permit|reveal)\b/i;
const SECRET_EXPOSURE_VERB_PATTERN =
  /\b(?:affiche|montre|revele|révèle|print|dump|export|expose|copy|copie|send|envoie|give me|donne-moi|leak)\b/i;
const SECRET_EXPOSURE_TARGET_PATTERN =
  /\b(?:magic link|lien magique|reveal|credential|credentials|secret|secrets|token|tokens|api key|mcp token|session cookie|cookie|\.env|agent_decision_[a-z_]+)\b/i;
const SECRET_BYPASS_PATTERN =
  /\b(?:bypass|contourne|ignore|disable|desactive|désactive|skip)\b[\s\S]{0,80}\b(?:reveal|magic link|lien magique|credential|credentials|secret|token|\.env)\b/i;
const OUT_OF_SCOPE_PATTERN =
  /\b(?:computer use|computer-use|desktop automation|browser automation|mistral vibe|vibe)\b/i;
const SENSITIVE_CONTEXT_PATTERN =
  /\b(?:prod|production|main|release|billing|facturation|payment|paiement|auth|authentication|permission|credential|credentials|secret|config|sandbox|approval)\b/i;

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeUserPromptInput(value) {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (isPlainObject(value) && typeof value.prompt === 'string') {
    return value.prompt.trim();
  }

  return '';
}

function buildAdditionalContext(category) {
  if (category === 'sensitive_context') {
    return [
      'Preclassification locale: sensitive_context.',
      'Session gouvernee Sentinel: gardez les actions sensibles bornees, n exposez aucun secret et laissez ADP qualifier la decision finale.'
    ].join(' ');
  }

  if (category === 'out_of_scope') {
    return [
      'Preclassification locale: out_of_scope.',
      'Le pilot canonique assiste couvre surtout Claude puis Codex. Computer use et Vibe restent hors chemin prouve ici; traitez-les comme exploratoires ou documentaires.'
    ].join(' ');
  }

  return null;
}

function classifyUserPrompt(value) {
  const prompt = normalizeUserPromptInput(value);

  if (prompt.length === 0) {
    return {
      prompt,
      category: 'normal',
      shouldBlock: false,
      additionalContext: null,
      reason: null,
    };
  }

  if ((SECRET_EXPOSURE_VERB_PATTERN.test(prompt) && SECRET_EXPOSURE_TARGET_PATTERN.test(prompt)) ||
    SECRET_BYPASS_PATTERN.test(prompt)) {
    return {
      prompt,
      category: 'secret_exposure',
      shouldBlock: true,
      additionalContext: null,
      reason: 'Prompt incompatible avec le pilot gouverne: demande explicite d exposition de secrets, de magic link ou de bypass du reveal.',
    };
  }

  if (ANTI_GOVERNANCE_PATTERN.test(prompt)) {
    return {
      prompt,
      category: 'anti_governance',
      shouldBlock: true,
      additionalContext: null,
      reason: 'Prompt incompatible avec le pilot gouverne: tentative explicite de desactivation ou de contournement de Sentinel.',
    };
  }

  if (OUT_OF_SCOPE_PATTERN.test(prompt)) {
    return {
      prompt,
      category: 'out_of_scope',
      shouldBlock: false,
      additionalContext: buildAdditionalContext('out_of_scope'),
      reason: null,
    };
  }

  if (SENSITIVE_CONTEXT_PATTERN.test(prompt)) {
    return {
      prompt,
      category: 'sensitive_context',
      shouldBlock: false,
      additionalContext: buildAdditionalContext('sensitive_context'),
      reason: null,
    };
  }

  return {
    prompt,
    category: 'normal',
    shouldBlock: false,
    additionalContext: null,
    reason: null,
  };
}

function buildUserPromptSubmitHookOutput(value) {
  const classification = classifyUserPrompt(value);

  if (classification.shouldBlock) {
    return {
      decision: 'block',
      reason: classification.reason,
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
      },
    };
  }

  if (!classification.additionalContext) {
    return null;
  }

  return {
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: classification.additionalContext,
    },
  };
}

module.exports = {
  buildUserPromptSubmitHookOutput,
  classifyUserPrompt,
  normalizeUserPromptInput,
};
