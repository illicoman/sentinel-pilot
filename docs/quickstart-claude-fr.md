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

Le clone embarque déjà:

- `CLAUDE.md`
- `.claude/settings.json`
- `.claude/settings.local.json.example`
- `.claude/hooks/`
- `.claude/lib/`

Aucun téléchargement supplémentaire n'est nécessaire après le clone.

## 4. Matérialiser l'aide locale non secrète

Optionnel:

```bash
cp .claude/settings.local.json.example .claude/settings.local.json
```

Ce fichier local ne doit porter que des valeurs non secrètes.
Gardez `AGENT_DECISION_API_KEY` et `AGENT_DECISION_MCP_URL` dans le shell local seulement.

## 5. Exporter les valeurs locales

```bash
export AGENT_DECISION_API_URL='https://decision-api.frenchlink.fr'
export AGENT_DECISION_API_KEY='<révélée une seule fois dans le portail>'
export AGENT_DECISION_MCP_URL='<URL MCP révélée une seule fois dans le portail>'
```

## 6. Vérifier `/health`

```bash
curl -fsS "${AGENT_DECISION_API_URL%/}/health"
```

## 7. Vérifier `/evaluate`

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

## 8. Vérifier la connexion MCP

```bash
claude mcp add --scope local --transport http \
  agent_decision_plane_public \
  "$AGENT_DECISION_MCP_URL"
claude mcp list
```

## 9. Laisser les hooks projet s'activer

Les hooks projet sont déjà embarqués via `.claude/settings.json`.
Ils restent shadow-only et ne déplacent ni l'enforcement ni la décision profonde hors ADP.
Ils ajoutent seulement une guidance locale sur `ConfigChange`, `UserPromptSubmit`, `PreToolUse` et `PostToolUseFailure`.

## 10. Premier test utile

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

## Nuances host actuelles

- `PROUVÉ LIVE`: le gateway public expose maintenant `_meta["anthropic/maxResultSizeChars"] = 24000` sur les tools utiles.
- `PROUVÉ LIVE`: un `PermissionDenied` natif Claude peut etre corrige avec une evidence Sentinel sur le meme geste.
- ces deux points ameliorent surtout la robustesse et la preuve ; ils ne changent pas le sens des decisions.
- `computer use` n est pas couvert dans le pilot canonique v1.
- `defer` reste une watchlist future, pas une capacite prouvee dans ce pack.

## Note de vérité

Le chemin canonique Claude reste le snippet révélé puis `claude mcp add`, avec les hooks projet déjà embarqués dans le clone.

`examples/mcp.json.example` reste une aide locale possible, pas la vérité runtime ni le chemin public principal.
