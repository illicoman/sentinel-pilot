# Sentinel Pilot AGENTS

## Ce repo est

- un pack public minimal pour testeurs Sentinel
- une surface documentaire pour Claude, Codex et Vibe
- un repo sans secret, sans portail embarqué et sans logique interne d'accès

## Ce repo n'est pas

- le portail
- la source de vérité des sessions ou des credentials
- la couche d'enforcement
- un clone qui suffit à lui seul

## Ordre de lecture Codex

1. lire `AGENTS.md`
2. lire `docs/quickstart-codex-fr.md`
3. verifier `.codex/config.toml`
4. invoquer `$sentinel-codex-smoke` seulement pour rejouer ou auditer le smoke borne
5. si un detail systeme manque ou diverge, remonter a la doc canonique ADP

## Ordre de lecture Claude

1. lire `CLAUDE.md`
2. lire `docs/quickstart-claude-fr.md`
3. verifier `.claude/settings.json`
4. utiliser `.claude/settings.local.json.example` seulement comme aide locale non secrete
5. si un detail systeme manque ou diverge, remonter a la doc canonique ADP

Frontiere des couches:

- `AGENTS.md` = discipline durable et garde-fous de session
- `CLAUDE.md` = invariants projet Claude
- skill `sentinel-codex-smoke` = workflow reutilisable
- MCP public = decision et evidence externes
- docs ADP = verite systeme

Ne jamais faire porter a la skill ce qui releve de la verite systeme ADP.

## Chemin testeur à respecter

1. demander un accès
2. ouvrir le portail après approbation
3. faire le reveal one-shot
4. choisir le host
5. matérialiser la config locale non versionnée
6. vérifier `/health`
7. vérifier `/evaluate`
8. jouer un premier tool call utile

Le portail est obligatoire.
Le reveal est obligatoire.
Le clone seul est insuffisant.
Aucun download post-clone supplementaire n est requis pour charger les surfaces projet Claude et Codex.

Avant de conclure qu un smoke Codex est bon, exiger:

- reveal one-shot deja fait
- token shell local present
- repo ouvert comme projet `trusted`
- `/health` sain
- `/evaluate` sain avec `host = codex`
- au moins un tool call utile reussi

`codex mcp list` seul ne suffit pas comme preuve.
Un hook Claude shadow utile n est jamais une preuve d enforcement.

## Discipline de session

- nouvelle session pour un nouveau reveal, un nouveau clone ou un nouveau smoke
- `resume` pour reprendre le meme smoke ou le meme blocage sans changer la cible
- `fork` a partir d une base deja lisible pour separer exploration, smoke, correction et doc
- ne pas melanger exploration, smoke, correction et doc dans une seule session
- ne jamais coller un token, un snippet ou un magic link dans la session

## Statut des hosts

- Claude prêt. C'est le chemin recommandé.
- Codex prêt avec friction native résiduelle réduite.
- Vibe expérimental / limité.

Ne jamais présenter ces statuts comme équivalents.

## Ce qui est prouvé

- accès testeur
- portail
- reveal one-shot
- Claude prêt
- Codex prêt
- feedback corrélé
- un chemin gouverné minimal `WRITE_FILE` prouvé

## Ce qui reste borné

- Codex garde une friction native résiduelle
- Vibe ne doit pas être présenté comme un chemin de départ canonique
- le clone seul ne prouve rien sans portail ni reveal

## Règles de contribution

- ne jamais versionner de secret
- ne jamais ajouter de `.env`, `.ssh`, `.htpasswd` ou token réel
- ne jamais fabriquer un faux quickstart prêt sans reveal
- ne jamais faire croire que tous les hosts sont au même niveau
