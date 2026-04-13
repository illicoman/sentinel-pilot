# Quickstart Codex

Codex est prêt. Claude reste recommandé pour le premier test, puis Codex vient juste après.

Statut du chemin : `PROUVÉ LIVE`.

Le portail est obligatoire.
Le reveal est obligatoire.
Le clone seul est insuffisant.

Ordre de lecture minimal pour Codex dans ce repo:

1. `AGENTS.md`
2. ce quickstart
3. `.codex/config.toml`
4. la skill `$sentinel-codex-smoke` si vous voulez rejouer le smoke borne
5. les docs ADP seulement si une nuance systeme manque ou diverge

Le profile minimal par client pilot peut influencer la décision dans ce parcours.
Mais ce profile reste géré côté ADP.
Aucune édition libre locale n'est ouverte dans ce repo.
Quand un profile existe pour votre client pilot, il peut aussi porter un `executionMode` borné à `shadow`, `review` ou `enforced`.
Cette configuration ne se fait pas dans ce repo.

## 1. Partir du reveal

Le quickstart Codex suppose que vous avez déjà:

- un accès approuvé
- une session portail
- un reveal one-shot effectué
- `AGENT_DECISION_API_KEY`
- `AGENT_DECISION_MCP_TOKEN`

Gardez ces valeurs dans le shell local seulement.
Si le reveal montre aussi une `AGENT_DECISION_MCP_URL`, elle reste surtout utile pour Claude. Le chemin canonique Codex consomme le token.

## 2. Cloner le repo

```bash
git clone https://github.com/illicoman/sentinel-pilot.git
cd sentinel-pilot
```

Le clone embarque déjà:

- `.codex/config.toml`
- `.codex/config.toml.example`
- `.agents/skills/sentinel-codex-smoke/SKILL.md`

Aucune étape de téléchargement supplémentaire n'est nécessaire après le clone.

## 3. Verifier le profil projet Codex versionne

Le repo porte deja `.codex/config.toml`.
Ne l'editez pas pour y mettre des secrets.
Le repo porte aussi `.codex/config.toml.example` comme miroir exportable direct.
`examples/codex.config.toml.example` garde un role de miroir exportable documentaire pour les repos qui ne versionnent pas le vrai profil projet.
La posture locale reste volontairement sobre et reproductible:

- `approval_policy = "untrusted"`
- `sandbox_mode = "workspace-write"`
- `network_access = false`
- `url = "https://decision-mcp.frenchlink.fr/mcp?adp_client=codex"`

Pour que Codex charge ce profil automatiquement, ouvrez aussi ce clone comme projet `trusted`.

## 4. Exporter les variables locales

```bash
export AGENT_DECISION_API_URL='https://decision-api.frenchlink.fr'
export AGENT_DECISION_API_KEY='<révélée une seule fois dans le portail>'
export AGENT_DECISION_MCP_TOKEN='<révélé une seule fois dans le portail>'
```

## 5. Vérifier `/health`

```bash
curl -fsS "${AGENT_DECISION_API_URL%/}/health"
```

## 6. Vérifier `/evaluate`

```bash
curl -fsS "${AGENT_DECISION_API_URL%/}/evaluate" \
  -H 'content-type: application/json' \
  -H "x-api-key: $AGENT_DECISION_API_KEY" \
  -d '{
    "userRequest": "update sensitive config in prod",
    "host": "codex",
    "environment": "prod",
    "target": "config/prod.env"
  }'
```

Attendu:

- `decision`
- `nextSafeAction`
- `enforcement: external`
- éventuellement `policyProfile` si votre client pilot a un profile actif

## 7. Vérifier le MCP public

```bash
curl -i -X OPTIONS 'https://decision-mcp.frenchlink.fr/mcp?adp_client=codex' \
  -H "Authorization: Bearer $AGENT_DECISION_MCP_TOKEN"
```

Le MCP public nu, sans bearer token, n'est pas le chemin public canonique.
Le contrat MCP utile reste borne par ADP; le profil projet versionne ne fait que materialiser la posture locale Codex attendue.

## 8. Premier test utile dans Codex

Prompt recommandé:

```text
Use only the MCP tool list_policy_packs and return only the pack ids, one per line.
```

Puis:

```text
Use only the MCP tool explain_decision for: update sensitive config in prod on config/prod.env. Reply only with three lines: Action, Decision, Next safe action.
```

Si vous voulez garder Codex strictement sur ce workflow, le repo embarque aussi la skill:

- `.agents/skills/sentinel-codex-smoke/SKILL.md`

Prompt explicite utile:

```text
Use $sentinel-codex-smoke to run or audit the canonical governed Sentinel Codex smoke for this repo without printing secrets.
```

La skill peut aussi etre invoquee implicitement pour un smoke Codex borne, mais `AGENTS.md` reste la couche de discipline durable et ce quickstart reste la reference pratique.

## 9. Discipline de session

- ouvrir une nouvelle session pour un nouveau reveal, un nouveau clone ou un nouveau smoke
- utiliser `resume` pour reprendre le meme smoke ou la meme correction sans changer la cible
- utiliser `fork` a partir d une session deja lisible pour separer exploration, smoke, correction et doc
- ne pas melanger exploration, smoke, correction et doc dans la meme session
- ne concluez pas `smoke ok` tant que `/health`, `/evaluate` et un premier tool call utile ne sont pas tous valides

## Note de réalité

Codex prêt avec friction native résiduelle réduite.

Le premier signal de vérité reste le tool call utile. Un affichage de type `codex mcp list` peut rester moins parlant qu'un tool call réussi.

Le policy profile minimal, quand il existe pour votre client pilot, est appliqué côté ADP. Il peut aussi embarquer un `executionMode` borné. Ce repo public n'héberge ni la vraie configuration active, ni un mécanisme d'édition libre.

## Nuances host actuelles

- `PROUVÉ LIVE`: le gateway public expose maintenant `outputSchema` sur les tools MCP utiles.
- le gain principal est structurel:
  - meilleur contrat machine-readable
  - meilleure lisibilite du verdict et de la prochaine action sure
- cela ne change pas la semantique produit.
- `metadata`, `elicitations` et `session context` restent des watchlists futures cote Codex.
