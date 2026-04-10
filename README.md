# Sentinel Pilot

Sentinel aide une équipe à décider avant l'exécution d'une action sensible. La sortie utile reste simple: `Action -> Decision -> Next safe action`.

Ce dépôt public est un pack testeur minimal. Il sert à comprendre le produit, demander un accès, préparer une configuration locale et jouer un premier test utile. Il n'est ni le portail, ni la couche d'enforcement, ni une réserve de secrets.

## Ce que vous pouvez tester aujourd'hui

- Claude prêt.
- Codex prêt avec friction native résiduelle réduite.
- Vibe expérimental / limité.
- Accès testeur, portail, reveal one-shot, feedback corrélé et un chemin gouverné minimal `WRITE_FILE` prouvé.
- Un policy profile minimal par client pilot, appliqué côté ADP, dans un cadre strictement borné.

## Flux d'accès

1. Demander un accès.
2. Attendre l'approbation.
3. Ouvrir le magic link.
4. Ouvrir le portail.
5. Faire le reveal one-shot.
6. Choisir un host.
7. Matérialiser la configuration locale.
8. Vérifier `/health`, `/evaluate`, puis jouer un premier test utile.

Le portail est obligatoire.
Le reveal est obligatoire.
Le clone seul est insuffisant.
Aucun secret n'est versionné dans ce dépôt.
La vraie configuration active d'un policy profile ne vit pas dans ce dépôt public.

## Policy profile minimal

Vous pouvez aujourd'hui tester l'existence d'un profile minimal propre à un client pilot.

Ce profile :

- vit côté ADP
- est validé par schéma
- est compilé en overlay interne borné
- agit réellement sur la décision
- fonctionne aujourd'hui dans le périmètre prouvé sur Claude et Codex

Ce profile n'est pas :

- un éditeur libre de policies
- une configuration active stockée dans ce repo
- un self-serve large
- une ouverture Vibe

Le portail reste obligatoire.
Le reveal reste obligatoire.
Le backend reste obligatoire.

## Quel host choisir

- Claude: chemin recommandé pour le premier test.
- Codex: chemin prêt et propre après reveal, avec une friction native résiduelle documentée.
- Vibe: piste visible mais secondaire. Ne commencez pas ici.

## Ce dépôt n'est pas

- une version nettoyée d'un monolithe interne
- un portail self-serve complet
- un repo prêt sans reveal
- une promesse de parité entre tous les hosts

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

### Prouvé

- accès testeur
- portail
- reveal one-shot
- Claude prêt
- Codex prêt
- policy profile minimal par client pilot
- feedback corrélé
- un chemin gouverné minimal `WRITE_FILE` prouvé

### Prouvé avec caveat

- Codex prêt avec friction native résiduelle réduite

### Expérimental / limité

- Vibe
- self-serve large policy profile
- édition libre des policies

### À venir / conditionnel

- Agents IA non-code
- multi-host large
- self-serve complet
- plateforme générale
