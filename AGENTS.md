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

