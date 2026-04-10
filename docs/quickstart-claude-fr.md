# Quickstart Claude

Claude est le chemin principal recommandé pour un premier test Sentinel.

Le portail est obligatoire.
Le reveal est obligatoire.
Le clone seul est insuffisant.

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

## 3. Cloner le repo

```bash
git clone https://github.com/illicoman/sentinel-pilot.git
cd sentinel-pilot
```

## 4. Matérialiser la configuration Claude

```bash
cp examples/mcp.json.example .mcp.json
```

Remplacez `__REVEAL_MCP_URL__` dans `.mcp.json` par l'URL MCP révélée dans le portail.

Ce fichier d'exemple n'est pas prêt à l'emploi.

## 5. Vérifier `/health`

```bash
export AGENT_DECISION_API_URL='https://decision-api.frenchlink.fr'
curl -fsS "${AGENT_DECISION_API_URL%/}/health"
```

## 6. Vérifier `/evaluate`

```bash
export AGENT_DECISION_API_KEY='<révélée une seule fois dans le portail>'

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
- `shadowOnly: true`
- `enforcement: external`

## 7. Vérifier la connexion MCP

```bash
claude --mcp-config .mcp.json --strict-mcp-config mcp list
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

