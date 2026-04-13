const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('sentinel-codex-smoke skill reste etroite et alignee sur le workflow Codex prouve', () => {
  const skill = read('.agents/skills/sentinel-codex-smoke/SKILL.md');
  const openaiYaml = read('.agents/skills/sentinel-codex-smoke/agents/openai.yaml');

  assert.match(skill, /^---[\s\S]*name: sentinel-codex-smoke/m);
  assert.match(skill, /smoke Codex gouverne Sentinel/i);
  assert.match(skill, /reveal one-shot/i);
  assert.match(skill, /AGENT_DECISION_API_KEY/);
  assert.match(skill, /AGENT_DECISION_MCP_TOKEN/);
  assert.match(skill, /ADP reste la verite/i);
  assert.match(skill, /repo `trusted`/i);
  assert.match(skill, /`\/health`/);
  assert.match(skill, /`\/evaluate`/);
  assert.match(skill, /list_policy_packs/);
  assert.match(skill, /explain_decision/);
  assert.match(skill, /reveal_missing/);
  assert.match(skill, /repo_not_trusted/);
  assert.match(skill, /mcp_auth_boundary/);
  assert.match(skill, /runtime_or_product_boundary/);
  assert.match(skill, /Vibe reste hors scope canonique/i);
  assert.doesNotMatch(skill, /defer/i);
  assert.doesNotMatch(skill, /nouveau tool MCP/i);

  assert.match(openaiYaml, /display_name: "Sentinel Codex Smoke"/);
  assert.match(openaiYaml, /short_description: "Rejouer le smoke Codex gouverne\."/);
  assert.match(openaiYaml, /Use \$sentinel-codex-smoke/);
  assert.match(openaiYaml, /allow_implicit_invocation: true/);
});

test('AGENTS, quickstart et skill gardent une frontiere claire pour Codex', () => {
  const agents = read('AGENTS.md');
  const quickstart = read('docs/quickstart-codex-fr.md');
  const skill = read('.agents/skills/sentinel-codex-smoke/SKILL.md');

  assert.match(agents, /Ordre de lecture Codex/i);
  assert.match(agents, /AGENTS\.md.*discipline durable/i);
  assert.match(agents, /skill `sentinel-codex-smoke` = workflow reutilisable/i);
  assert.match(agents, /MCP public = decision et evidence externes/i);
  assert.match(agents, /docs ADP = verite systeme/i);
  assert.match(agents, /nouvelle session/i);
  assert.match(agents, /`resume`/i);
  assert.match(agents, /`fork`/i);
  assert.match(agents, /repo ouvert comme projet `trusted`/i);
  assert.match(agents, /`codex mcp list` seul ne suffit pas comme preuve/i);

  assert.match(quickstart, /Ordre de lecture minimal pour Codex dans ce repo/i);
  assert.match(quickstart, /\$sentinel-codex-smoke/);
  assert.match(quickstart, /AGENTS\.md.*discipline durable/i);
  assert.match(quickstart, /## 9\. Discipline de session/);
  assert.match(quickstart, /`resume`/i);
  assert.match(quickstart, /`fork`/i);

  assert.match(skill, /reveal one-shot/i);
  assert.match(skill, /repo `trusted`/i);
  assert.match(skill, /list_policy_packs/);
  assert.match(skill, /explain_decision/);
});
