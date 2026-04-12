# Quickstart Codex

Codex est prêt. Claude reste recommandé pour le premier test, puis Codex vient juste après.

Statut du chemin : `PROUVÉ LIVE`.

Le portail est obligatoire.
Le reveal est obligatoire.
Le clone seul est insuffisant.

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

## 3. Matérialiser la configuration locale Codex

```bash
mkdir -p .codex
cp examples/codex.config.toml.example .codex/config.toml
```

Ne committez jamais `.codex/config.toml`.

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
curl -i -X OPTIONS 'https://decision-mcp.frenchlink.fr/mcp' \
  -H "Authorization: Bearer $AGENT_DECISION_MCP_TOKEN"
```

Le MCP public nu, sans bearer token, n'est pas le chemin public canonique.

## 8. Premier test utile dans Codex

Prompt recommandé:

```text
Use only the MCP tool list_policy_packs and return only the pack ids, one per line.
```

Puis:

```text
Use only the MCP tool explain_decision for: update sensitive config in prod on config/prod.env. Reply only with three lines: Action, Decision, Next safe action.
```

## Note de réalité

Codex prêt avec friction native résiduelle réduite.

Le premier signal de vérité reste le tool call utile. Un affichage de type `codex mcp list` peut rester moins parlant qu'un tool call réussi.

Le policy profile minimal, quand il existe pour votre client pilot, est appliqué côté ADP. Il peut aussi embarquer un `executionMode` borné. Ce repo public n'héberge ni la vraie configuration active, ni un mécanisme d'édition libre.
