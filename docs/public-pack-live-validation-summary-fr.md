# Résumé live validation

Date: `2026-04-10`

## Résultat court

- Runtime public: vivant.
- `request-access`: vivant.
- Portail sans session: cohérent.
- Pack local candidat: lisible.
- GitHub public: non synchronisé avec le pack candidat.
- Claude: recette complète non jouée.
- Codex: recette complète non jouée.

## Ce qui a été réellement prouvé

- `decision-api` et `decision-mcp` répondent en live
- le portail exige bien une session
- `request-access` retourne bien `ACCESS_REQUESTED`
- le repo local candidat dit clairement:
  - portail obligatoire
  - reveal obligatoire
  - clone seul insuffisant
  - Claude d'abord
  - Codex ensuite
  - Vibe expérimental / limité

## Ce qui a bloqué

- le remote GitHub public ne contient pas encore le pack local candidat
- la recette publique complète dépend d'une approbation admin puis d'un magic link frais
- sans magic link frais, pas de session portail
- sans session portail, pas de reveal
- sans reveal, pas de `/evaluate`, pas de MCP, pas de premier tool call

## Lecture honnête

- README local candidat: bon point d'entrée
- README public réellement clonable: pas encore disponible
- chemin Claude: clair mais pas rejoué jusqu'au bout
- chemin Codex: clair mais pas rejoué jusqu'au bout
- Vibe: resté borné

## Prochain usage légitime

1. pousser le pack local candidat sur le remote GitHub public
2. rejouer une recette avec un magic link frais approuvé
3. valider Claude jusqu'au premier tool call utile
4. valider Codex jusqu'au premier tool call utile

