# Sentinel Pilot

Sentinel aide une équipe à décider avant l'exécution d'une action sensible. La sortie utile reste simple: `Action -> Decision -> Next safe action`.

Ce dépôt public est un pack testeur minimal. Il sert à comprendre le produit, demander un accès, préparer une configuration locale et jouer un premier test utile. Il n'est ni le portail, ni la couche d'enforcement, ni une réserve de secrets.

## Source de vérité documentaire

- `agent-decision-plane` porte la vérité système, architecture, preuves, policy profile et pile de vérification.
- `sentinel-pilot` reste un pack public minimal.
- `frenchlink` reste la surface UX et le site public.
- `repo-exec-middleware` reste la boundary `permit / verify` fail-closed.

Ce dépôt ne doit jamais être lu comme la vérité runtime.

## Ce que vous pouvez tester aujourd'hui

- Claude prêt.
- Codex prêt avec friction native résiduelle réduite.
- Vibe expérimental / limité.
- Accès testeur, portail, reveal one-shot, feedback corrélé et un chemin gouverné minimal `WRITE_FILE` prouvé.
- Un policy profile minimal par client pilot, appliqué côté ADP, avec `executionMode` borné à `shadow`, `review`, `enforced`.
- Une couche de vérification offline existe déjà côté ADP :
  - trace canonique v0
  - policy verifier offline v0
  - decision-quality-checker v0 mini

## Flux d'accès

1. Demander un accès.
2. Attendre l'approbation.
3. Ouvrir le magic link public `portail.html#magic_link=...`.
4. Ouvrir le portail.
5. Faire le reveal one-shot.
6. Choisir un host canonique.
7. Matérialiser la configuration locale.
8. Vérifier `/health`, `/evaluate`, puis jouer un premier test utile.

Le portail est obligatoire.
Le reveal est obligatoire.
Le clone seul est insuffisant.
Aucun secret n'est versionné dans ce dépôt.
La vraie configuration active d'un policy profile ne vit pas dans ce dépôt public.
La vérité des credentials, des sessions et du reveal vit côté ADP.

Chemins canoniques aujourd'hui :

- Claude : URL MCP révélée `AGENT_DECISION_MCP_URL`, puis `claude mcp add`.
- Codex : token révélé `AGENT_DECISION_MCP_TOKEN`, puis repo trusted avec `.codex/config.toml` versionné, miroir du profil projet canonique ADP.
- Vibe : visible, mais pas chemin canonique public.

## Policy profile minimal

Vous pouvez aujourd'hui tester l'existence d'un profile minimal propre à un client pilot.

Ce profile :

- vit côté ADP
- est validé par schéma
- est compilé en overlay interne borné
- agit réellement sur la décision
- fonctionne aujourd'hui dans le périmètre prouvé sur Claude et Codex
- supporte aujourd'hui trois modes explicites :
  - `shadow`
  - `review`
  - `enforced`
- reste monotone :
  - il peut annoter ou rehausser
  - il ne peut jamais relaxer une décision plus stricte du moteur

Ce profile n'est pas :

- un éditeur libre de policies
- une configuration active stockée dans ce repo
- un self-serve large
- une ouverture Vibe

Le portail reste obligatoire.
Le reveal reste obligatoire.
Le backend reste obligatoire.
Pas de self-serve large.
`review` et `enforced` peuvent parfois produire le même verdict observable sur le sous-ensemble v1 actuel.
Ce n'est pas un bug.

## Quel host choisir

- Claude: chemin recommandé pour le premier test, avec `maxResultSizeChars` live sur les tools utiles et une corrélation bornée `PermissionDenied` -> evidence Sentinel qui améliore surtout la preuve.
- Codex: chemin canonique juste après Claude, avec `outputSchema` live sur les tools utiles pour un contrat plus machine-readable.
- Vibe: experimental / limité et hors scope canonique. Ne commencez pas ici.

Nuances importantes:

- `computer use` n est pas couvert dans le pilot canonique v1.
- `defer` cote Claude reste une opportunite future, pas une capacite prouvee.
- `metadata`, `elicitations` et `session context` cote Codex restent des watchlists, pas des capacites ouvertes.

## Ce dépôt n'est pas

- une version nettoyée d'un monolithe interne
- un portail self-serve complet
- un repo prêt sans reveal
- une promesse de parité entre tous les hosts
- la source de vérité système ou runtime

## Commencer

- [Comprendre ce que vous pouvez tester](docs/what-you-can-test-fr.md)
- [Demander un accès](docs/request-access-fr.md)
- [Quickstart Claude](docs/quickstart-claude-fr.md)
- [Quickstart Codex](docs/quickstart-codex-fr.md)
- [Quickstart Vibe](docs/quickstart-vibe-fr.md)
- [Policy profile minimal](docs/policy-profile-fr.md)
- [FAQ](docs/faq-fr.md)
- [Deep tech](docs/deep-tech-fr.md)

## Vérité produit de ce pack

### PROUVÉ LIVE

- accès testeur
- portail
- reveal one-shot
- `/health`
- `/evaluate`
- Claude prêt
- Codex prêt
- policy profile minimal par client pilot
- modes `shadow / review / enforced`
- monotonie du policy profile
- feedback corrélé
- un chemin gouverné minimal `WRITE_FILE` prouvé

### PROUVÉ LOCAL

- schéma public du policy profile
- exemple public du policy profile

### PROUVÉ OFFLINE

- trace canonique v0
- policy verifier offline v0
- decision-quality-checker v0 mini

Cette couche améliore l'audit et la défendabilité.
Elle ne transforme pas ce repo public en outil de vérification self-serve.

### INFÉRÉ

- ce pack public suffit pour comprendre rapidement le pilot avant reveal

### NON PROUVÉ

- un chemin Vibe utile au niveau Claude / Codex
- un multi-host large
- une plateforme générale déjà industrialisée

### HORS SCOPE

- self-serve large policy profile
- édition libre des policies
- Vibe comme chemin canonique de départ
- moteur configurable par le client

Vibe reste visible comme direction produit, pas comme chemin canonique prouvé.
