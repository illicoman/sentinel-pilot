# Quickstart Vibe

Vibe est expérimental / limité.

Ne commencez pas ici. Commencez par Claude, puis Codex.

Le portail est obligatoire.
Le reveal est obligatoire.
Le clone seul est insuffisant.

## Ce que cette page est

Une piste bornée pour comprendre l'état actuel de Vibe, pas un guide de démarrage grand public équivalent à Claude ou Codex.

## Ce qui est vrai aujourd'hui

- le même flux d'accès existe
- le même portail existe
- le reveal one-shot reste la source des valeurs locales
- le seul chemin Vibe borné prouvé passe par une URL MCP tokenisée issue du reveal

## Ce qui n'est pas promis

- pas de parité avec Claude ou Codex
- pas de smoke complet grand public
- pas de Bearer public présenté comme stable pour Vibe
- pas de mode interactif présenté comme prouvé

## Si vous allez quand même plus loin

1. Faites d'abord un succès Claude ou Codex.
2. Faites le reveal.
3. Gardez `MISTRAL_API_KEY` en local seulement.
4. Copiez `examples/vibe.config.toml.example` vers `.vibe/config.toml`.
5. Remplacez `__REVEAL_MCP_URL__` par l'URL MCP tokenisée issue du reveal.
6. Vérifiez `/health` et `/evaluate` avant toute tentative Vibe.

```bash
export MISTRAL_API_KEY='<locale, jamais commitée>'
export AGENT_DECISION_API_URL='https://decision-api.frenchlink.fr'
export AGENT_DECISION_API_KEY='<révélée une seule fois dans le portail>'

curl -fsS "${AGENT_DECISION_API_URL%/}/health"
```

## Conclusion honnête

Vibe expérimental / limité.

Le seul chemin canonique prouvé ici reste un chemin borné et local issu du reveal. Ce repo ne doit pas être lu comme un feu vert large pour Vibe.

