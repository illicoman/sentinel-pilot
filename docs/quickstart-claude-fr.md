# Quickstart Claude

Claude est le chemin principal recommandé pour un premier test Sentinel.

Statut du chemin : `PROUVÉ LIVE`.

Le portail est obligatoire.
Le reveal est obligatoire.
Le clone seul est insuffisant.

Le profile minimal par client pilot peut influencer la décision dans ce parcours.
Mais ce profile reste géré côté ADP.
Aucune édition libre locale n'est ouverte dans ce repo.
Quand un profile existe pour votre client pilot, il peut aussi porter un `executionMode` borné à `shadow`, `review` ou `enforced`.
Cette configuration ne se fait pas dans ce repo.

## 1. Obtenir l'accès

1. Demandez un accès.
2. Attendez l'approbation.
3. Ouvrez le magic link.
4. Ouvrez le portail.
5. Faites le reveal one-shot.

## 2. Récupérer les valeurs locales

Depuis le reveal, récupérez seulement en local:

- `AGENT_DECISION_API_KEY`
- `AGENT_DECISION_MCP_URL`

Ne versionnez jamais ces valeurs.

Le chemin canonique Claude ne part pas d'un MCP public nu.
`AGENT_DECISION_MCP_URL` est l'URL MCP révélée, déjà liée à votre token de testeur.

## 3. Cloner le repo

```bash
git clone https://github.com/illicoman/sentinel-pilot.git
cd sentinel-pilot
```

## 4. Exporter les valeurs locales

```bash
export AGENT_DECISION_API_URL='https://decision-api.frenchlink.fr'
export AGENT_DECISION_API_KEY='<révélée une seule fois dans le portail>'
export AGENT_DECISION_MCP_URL='<URL MCP révélée une seule fois dans le portail>'
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
    "host": "claude-code",
    "environment": "prod",
    "target": "config/prod.env"
  }'
```

Attendu:

- `decision`
- `nextSafeAction`
- `enforcement: external`
- éventuellement `policyProfile` si votre client pilot a un profile actif

## 7. Vérifier la connexion MCP

```bash
claude mcp add --scope local --transport http \
  agent_decision_plane_public \
  "$AGENT_DECISION_MCP_URL"
claude mcp list
```

## 8. Premier test utile

```bash
claude --print \
  --allowedTools mcp__agent_decision_plane_public__list_policy_packs \
  "Use only the MCP tool list_policy_packs and return only the pack ids, one per line."
```

Puis:

```bash
claude --print \
  --allowedTools mcp__agent_decision_plane_public__explain_decision \
  "Use only the MCP tool explain_decision for: update sensitive config in prod on config/prod.env. Reply only with three lines: Action, Decision, Next safe action."
```

## Ce que ce chemin prouve

- Claude prêt
- un flux public lisible
- un premier appel utile après reveal
- un profile minimal par client pilot peut influencer la décision, y compris avec `executionMode`, sans ouvrir un éditeur libre de policies

## Note de vérité

Le chemin canonique Claude reste le snippet révélé puis `claude mcp add`.

`examples/mcp.json.example` reste une aide locale possible, pas la vérité runtime ni le chemin public principal.
