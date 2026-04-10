const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

const essentialFiles = [
  'README.md',
  'AGENTS.md',
  'LICENSE',
  '.gitignore',
  'docs/what-you-can-test-fr.md',
  'docs/request-access-fr.md',
  'docs/quickstart-claude-fr.md',
  'docs/quickstart-codex-fr.md',
  'docs/quickstart-vibe-fr.md',
  'docs/policy-profile-fr.md',
  'docs/faq-fr.md',
  'docs/deep-tech-fr.md',
  'examples/mcp.json.example',
  'examples/codex.config.toml.example',
  'examples/vibe.config.toml.example',
  'examples/policy-profile.schema.json',
  'examples/policy-profile.example.json',
  'scripts/smoke-health.sh',
  'scripts/smoke-evaluate.sh',
  'tests/public-pack-safety.test.js',
];

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function listFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === '.git') {
      continue;
    }

    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...listFiles(absolutePath));
      continue;
    }

    files.push(absolutePath);
  }

  return files;
}

const combinedText = [
  read('README.md'),
  read('AGENTS.md'),
  read('docs/what-you-can-test-fr.md'),
  read('docs/request-access-fr.md'),
  read('docs/quickstart-claude-fr.md'),
  read('docs/quickstart-codex-fr.md'),
  read('docs/quickstart-vibe-fr.md'),
  read('docs/policy-profile-fr.md'),
  read('docs/faq-fr.md'),
  read('docs/deep-tech-fr.md'),
  read('examples/policy-profile.schema.json'),
  read('examples/policy-profile.example.json'),
].join('\n');

test('essential public pack files exist', () => {
  for (const relativePath of essentialFiles) {
    assert.ok(fs.existsSync(path.join(repoRoot, relativePath)), `${relativePath} is missing`);
  }

  const readme = read('README.md');
  assert.match(readme, /\[Demander un accès\]\(docs\/request-access-fr\.md\)/);
  assert.match(readme, /\[Quickstart Claude\]\(docs\/quickstart-claude-fr\.md\)/);
  assert.match(readme, /\[Quickstart Codex\]\(docs\/quickstart-codex-fr\.md\)/);
  assert.match(readme, /\[Policy profile minimal\]\(docs\/policy-profile-fr\.md\)/);
  assert.match(readme, /\[FAQ\]\(docs\/faq-fr\.md\)/);
  assert.match(readme, /\[Deep tech\]\(docs\/deep-tech-fr\.md\)/);
});

test('no obvious secret material or forbidden file types are versioned', () => {
  const allFiles = listFiles(repoRoot).map((absolutePath) => path.relative(repoRoot, absolutePath));
  const publicSurfaceFiles = allFiles.filter((relativePath) => !relativePath.startsWith('tests/'));
  const forbiddenFilePatterns = [
    /(^|\/)\.env(\.|$)/,
    /\.htpasswd$/i,
    /\.pem$/i,
    /\.key$/i,
    /\.p12$/i,
    /\.pfx$/i,
    /(^|\/)\.ssh(\/|$)/,
    /id_rsa$/i,
    /id_ed25519$/i,
  ];

  for (const relativePath of allFiles) {
    for (const pattern of forbiddenFilePatterns) {
      assert.doesNotMatch(relativePath, pattern, `${relativePath} must not be versioned`);
    }
  }

  const internalPathPrefix = ['/var', 'www', ''].join('/');

  for (const relativePath of publicSurfaceFiles) {
    const content = read(relativePath);
    const forbiddenContentPatterns = [
      /BEGIN [A-Z ]*PRIVATE KEY/,
      /ghp_[A-Za-z0-9]{10,}/,
      /glpat-[A-Za-z0-9_-]{10,}/,
      /sk-[A-Za-z0-9]{16,}/,
      /xox[baprs]-[A-Za-z0-9-]{10,}/,
      /AKIA[0-9A-Z]{16}/,
      /https:\/\/[^\s"'`]*mcp_token=[A-Za-z0-9][^\s"'`]*/,
      /Authorization:\s*Bearer\s+[A-Za-z0-9._-]{16,}/,
    ];

    for (const pattern of forbiddenContentPatterns) {
      assert.doesNotMatch(content, pattern, `${relativePath} contains forbidden secret-like content`);
    }

    assert.ok(!content.includes(`${internalPathPrefix}/`), `${relativePath} exposes an internal filesystem path`);
  }
});

test('host statuses stay coherent and explicit', () => {
  assert.match(combinedText, /Claude prêt/);
  assert.match(combinedText, /Codex prêt/);
  assert.match(combinedText, /Codex prêt avec friction native résiduelle réduite/);
  assert.match(combinedText, /Vibe expérimental \/ limité/);
  assert.match(combinedText, /policy profile minimal par client pilot/i);
});

test('canonical warnings remain explicit', () => {
  assert.match(combinedText, /Le portail est obligatoire\./);
  assert.match(combinedText, /Le reveal est obligatoire\./);
  assert.match(combinedText, /Le clone seul est insuffisant\./);
  assert.match(combinedText, /La vraie configuration active d'un policy profile ne vit pas dans ce dépôt public\./);
  assert.match(combinedText, /La vraie configuration active vit côté ADP\./);
  assert.match(combinedText, /Ce repo public ne contient jamais la vraie configuration(?: active)? d[' ]un client pilot\./);
  assert.match(combinedText, /Ce repo public ne suffit pas à activer un profile\./);
  assert.match(combinedText, /Ce n'est pas du policy authoring libre\./);
});

test('the repo does not suggest a false canonical path', () => {
  const forbiddenClaims = [
    /le clone seul suffit/i,
    /Vibe est prêt/i,
    /Vibe est pret/i,
    /Vibe prêt/i,
    /Vibe pret/i,
    /self-serve large est ouvert/i,
    /édition libre des policies est ouverte/i,
  ];

  for (const pattern of forbiddenClaims) {
    assert.doesNotMatch(combinedText, pattern);
  }
});

test('public policy profile schema stays minimal and excludes internal or inactive fields', () => {
  const schema = JSON.parse(read('examples/policy-profile.schema.json'));
  const example = JSON.parse(read('examples/policy-profile.example.json'));
  const schemaText = JSON.stringify(schema);
  const exampleText = JSON.stringify(example);

  assert.deepEqual(Object.keys(schema.properties).sort(), [
    'approvalRequiredFor',
    'profile',
    'protectedBranches',
  ]);
  assert.ok(Array.isArray(schema.anyOf));
  assert.match(schemaText, /NETWORK_ACCESS/);

  [
    'disabledPolicies',
    'override',
    'riskThreshold',
    'allowTools',
    'denyTools',
    'hostMode',
    'sandboxAvailable',
    'executionMode',
    'protectedPaths',
    'sandboxRequiredFor',
    'enabledBasePack',
  ].forEach((fieldName) => {
    assert.doesNotMatch(schemaText, new RegExp(fieldName));
    assert.doesNotMatch(exampleText, new RegExp(fieldName));
  });

  assert.equal(typeof example.profile, 'string');
  assert.ok(Array.isArray(example.protectedBranches));
  assert.ok(Array.isArray(example.approvalRequiredFor));
});
