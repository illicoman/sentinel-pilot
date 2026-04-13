#!/usr/bin/env node
'use strict';

const {
  readJsonFromStdin,
  writeJsonToStdout,
} = require('../lib/json-stdio');
const {
  buildPostToolUseFailureHookOutput,
} = require('../lib/post-tool-use-failure-guidance');

async function main() {
  const payload = await readJsonFromStdin();
  writeJsonToStdout(buildPostToolUseFailureHookOutput(payload));
}

main().catch(function onError(error) {
  const message = error && error.message ? error.message : 'unknown sentinel pilot PostToolUseFailure hook error';
  process.stderr.write('[sentinel-pilot-claude-post-tool-use-failure] ' + message + '\n');
  process.exit(1);
});
