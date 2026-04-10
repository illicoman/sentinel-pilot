# Demander un accès

Le flux d'accès est unique pour tous les hosts. Vous ne demandez pas un accès Claude, un accès Codex et un accès Vibe séparément.

## Flux

1. Remplir une demande d'accès sur la surface publique Sentinel.
2. Attendre la revue et l'approbation.
3. Recevoir un magic link.
4. Ouvrir le portail avec ce lien.
5. Faire le reveal one-shot.
6. Choisir ensuite Claude, Codex ou Vibe selon votre objectif.

## Ce que fait le portail

- confirmer votre état de testeur
- ouvrir le reveal au bon moment
- remettre les credentials une seule fois
- garder ensuite une vue utile sans réafficher les secrets

Le portail est obligatoire.
Le reveal est obligatoire.

## Ce que le repo ne contient pas

- aucun secret
- aucun token réel
- aucune URL tokenisée réelle
- aucun chemin interne d'exploitation

Le clone seul est insuffisant.

## Pourquoi le reveal est one-shot

Le reveal ne sert pas à transformer le repo en coffre de secrets. Il sert à copier une configuration locale une seule fois, puis à fermer la lecture des secrets.

## Point important

Le choix du host vient après le reveal. Le flux d'accès ne change pas entre Claude, Codex et Vibe.

