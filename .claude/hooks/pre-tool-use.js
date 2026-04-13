#!/usr/bin/env node
'use strict';

const {
  readJsonFromStdin,
  writeJsonToStdout,
} = require('../lib/json-stdio');
const {
  appendPreToolUseShadowRecord,
} = require('../lib/shadow-state');
const {
  evaluateClaudePreToolUseShadow,
} = require('../lib/pre-tool-use-shadow');

async function main() {
  const payload = await readJsonFromStdin();
  const evaluation = await evaluateClaudePreToolUseShadow(payload);

  if (evaluation.skipped || !evaluation.hookOutput) {
    return;
  }

  try {
    appendPreToolUseShadowRecord(payload, evaluation.result);
  } catch (error) {
    // Best effort only: local shadow evidence must never break the stable hook path.
  }

  writeJsonToStdout(evaluation.hookOutput);
}

main().catch(function onError(error) {
  const message = error && error.message ? error.message : 'unknown sentinel pilot PreToolUse hook error';
  process.stderr.write('[sentinel-pilot-claude-pre-tool-use] ' + message + '\n');
  process.exit(1);
});
