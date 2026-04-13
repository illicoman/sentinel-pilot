'use strict';

async function readJsonFromStdin() {
  const chunks = [];

  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();
  return raw.length === 0 ? {} : JSON.parse(raw);
}

function writeJsonToStdout(value) {
  if (!value) {
    return;
  }

  process.stdout.write(JSON.stringify(value));
}

module.exports = {
  readJsonFromStdin,
  writeJsonToStdout,
};
