# Ce que vous pouvez tester aujourd'hui

Ce pack public raconte une seule histoire: comprendre Sentinel, demander un accès, ouvrir le portail, faire le reveal, choisir un host, puis jouer un premier test utile.

## Ce qui est testable maintenant

- Comprendre le produit en quelques minutes.
- Demander un accès testeur.
- Ouvrir un portail après approbation.
- Faire un reveal one-shot.
- Vérifier `GET /health`.
- Vérifier `POST /evaluate`.
- Constater qu'un profile minimal par client pilot peut influencer la décision dans un cadre borné.
- Constater que ce profile supporte trois modes explicites : `shadow`, `review`, `enforced`.
- Configurer Claude localement.
- Configurer Codex localement.
- Envoyer un feedback corrélé après un test.
- Comprendre qu'un chemin gouverné minimal `WRITE_FILE` est déjà prouvé.

## Statut des hosts

- Claude prêt.
- Codex prêt avec friction native résiduelle réduite.
- Vibe expérimental / limité.

## Ce que vous devez lire honnêtement

- Claude est le chemin principal recommandé.
- Codex est disponible proprement après reveal.
- Le profile minimal par client pilot est prouvé dans un cadre borné sur `/evaluate`, Claude et Codex.
- `shadow` sert à observer et calibrer sans changer le verdict final.
- `review` et `enforced` restent monotones : ils peuvent rehausser, jamais relaxer.
- `review` et `enforced` peuvent parfois donner le même verdict visible sur le sous-ensemble v1 actuel.
- La vraie configuration active d'un profile vit côté ADP, pas dans ce repo public.
- Vibe reste visible pour montrer la direction produit, pas pour annoncer une parité de maturité.
- Le portail est obligatoire.
- Le reveal est obligatoire.
- Le clone seul est insuffisant.
- Ce repo public ne suffit pas à activer un profile.
- Pas de self-serve large.

## Ce qui reste en exploration

- Vibe comme chemin plus large et plus stable
- self-serve large pour les policy profiles
- édition libre des policies
- Agents IA non-code
- multi-host large
- plateforme générale
