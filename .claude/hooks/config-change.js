#!/usr/bin/env node
'use strict';

const {
  readJsonFromStdin,
  writeJsonToStdout,
} = require('../lib/json-stdio');
const {
  buildConfigChangeHookOutput,
} = require('../lib/config-change-guard');

async function main() {
  const payload = await readJsonFromStdin();
  writeJsonToStdout(buildConfigChangeHookOutput(payload));
}

main().catch(function onError(error) {
  const message = error && error.message ? error.message : 'unknown sentinel pilot ConfigChange hook error';
  process.stderr.write('[sentinel-pilot-claude-config-change] ' + message + '\n');
  process.exit(1);
});
