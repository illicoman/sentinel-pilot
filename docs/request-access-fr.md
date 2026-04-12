# Demander un accès

Le flux d'accès est unique pour tous les hosts. Vous ne demandez pas un accès Claude, un accès Codex et un accès Vibe séparément.

## Flux

1. Remplir une demande d'accès sur la surface publique Sentinel.
2. Attendre la revue et l'approbation.
3. Recevoir un magic link.
4. Ouvrir le portail avec ce lien public, de la forme `portail.html#magic_link=...`.
5. Faire le reveal one-shot.
6. Choisir ensuite Claude ou Codex comme chemins canoniques. Vibe reste secondaire.

## Ce que fait le portail

- confirmer votre état de testeur
- ouvrir le reveal au bon moment
- remettre les credentials une seule fois
- garder ensuite une vue utile sans réafficher les secrets

Le portail est obligatoire.
Le reveal est obligatoire.

## Ce que donne le reveal

Le reveal remet les valeurs locales utiles une seule fois.

- `AGENT_DECISION_API_KEY` pour `/evaluate`
- `AGENT_DECISION_MCP_URL` pour le chemin canonique Claude
- `AGENT_DECISION_MCP_TOKEN` pour le chemin canonique Codex
- un snippet d'onboarding lisible

Le repo public ne devient jamais la source de vérité de ces valeurs.

## Ce que le repo ne contient pas

- aucun secret
- aucun token réel
- aucune URL tokenisée réelle
- aucun chemin interne d'exploitation

Le clone seul est insuffisant.

## Pourquoi le reveal est one-shot

Le reveal ne sert pas à transformer le repo en coffre de secrets. Il sert à copier une configuration locale une seule fois, puis à fermer la lecture des secrets.

## Point important

Le choix du host vient après le reveal.

- Claude consomme l'URL MCP révélée.
- Codex consomme le token MCP révélé contre l'URL MCP publique stable.
- Le portail et le backend restent obligatoires dans les deux cas.
