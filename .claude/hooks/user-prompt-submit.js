#!/usr/bin/env node
'use strict';

const {
  readJsonFromStdin,
  writeJsonToStdout,
} = require('../lib/json-stdio');
const {
  buildUserPromptSubmitHookOutput,
} = require('../lib/user-prompt-preclassification');

async function main() {
  const payload = await readJsonFromStdin();
  const source = typeof payload.prompt === 'string' ? payload.prompt : payload;
  writeJsonToStdout(buildUserPromptSubmitHookOutput(source));
}

main().catch(function onError(error) {
  const message = error && error.message ? error.message : 'unknown sentinel pilot UserPromptSubmit hook error';
  process.stderr.write('[sentinel-pilot-claude-user-prompt-submit] ' + message + '\n');
  process.exit(1);
});
