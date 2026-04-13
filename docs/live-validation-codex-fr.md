# Live Validation Codex

Date de validation: `2026-04-10`

## Périmètre

Valider si le repo public `sentinel-pilot` guide correctement un testeur vers le chemin canonique `README -> portal -> reveal -> Codex -> premier test utile`, en gardant la lecture honnête suivante:

- Codex prêt
- friction native résiduelle réduite
- pas de parité artificielle avec Claude

## Verdict court

- Runtime public: vivant.
- Quickstart Codex local candidat: clair et sobre.
- Blocage partagé avec Claude: pas de session portail, donc pas de reveal.
- Friction native Codex résiduelle: non mesurée live dans ce lot, car le flux n'a pas atteint l'étape Codex spécifique.

## Environnement propre

Workspace jetable utilisé:

- `/tmp/sentinel-pilot-codex-live`

Définition retenue pour `propre`:

- clone jetable recréé depuis zéro
- aucun `.codex/config.toml`
- aucun `.mcp.json`
- aucun `.vibe/config.toml`
- aucun `AGENT_DECISION_*` dans le shell
- aucun cookie portail préexistant

Comme pour Claude:

- le remote GitHub public n'était pas exploitable pour une vraie validation externe, car le clone live ne contenait encore que `LICENSE`
- le workspace jetable a donc été créé depuis le repo local candidat pour juger le chemin documentaire candidat

## Chemin réellement joué

1. Lire [README.md](../README.md).
2. Lire [docs/quickstart-codex-fr.md](./quickstart-codex-fr.md).
3. Vérifier qu'aucune config locale Codex n'existe au départ.
4. Rejouer l'état portail sans magic link approuvé.
5. Vérifier `GET /health` depuis l'environnement propre.

## PROUVÉ live

- le quickstart Codex dit explicitement qu'il faut partir du reveal
- le quickstart dit explicitement que le portail est obligatoire
- le quickstart dit explicitement que le reveal est obligatoire
- le quickstart dit explicitement que le clone seul est insuffisant
- `GET /health` répond bien depuis un environnement propre
- l'honnêteté produit est préservée: `Codex prêt avec friction native résiduelle réduite`

## NON PROUVÉ dans ce lot

- ouverture d'une session portail côté Codex
- reveal one-shot
- copie de `examples/codex.config.toml.example` vers `.codex/config.toml` à partir d'un reveal frais
- `POST /evaluate` avec une API key fraîche
- `OPTIONS https://decision-mcp.frenchlink.fr/mcp` avec un token MCP frais
- premier tool call utile Codex
- mesure réelle de la friction native résiduelle après reveal

## Blocage réel

Le blocage Codex n'est pas une contradiction du quickstart. Le blocage est antérieur:

- le flux d'accès est partagé avec Claude
- sans approbation admin ni magic link frais, il n'y a pas de session portail
- sans session portail, il n'y a pas de reveal
- sans reveal, il n'y a ni `AGENT_DECISION_API_KEY`, ni `AGENT_DECISION_MCP_TOKEN`

## Frictions observées

- friction majeure: le remote GitHub public n'est pas encore aligné; un testeur externe qui clone aujourd'hui n'obtient pas le quickstart Codex
- friction majeure: l'étape asynchrone `request-access -> approval -> magic link` empêche la recette live complète dans ce tour
- friction honnête non mesurée: la friction native Codex résiduelle documentée n'a pas pu être rejouée car le flux n'a pas atteint le premier tool call

## Temps et étapes

- compréhension du chemin candidat local: environ `2` minutes
- temps jusqu'au blocage partagé d'accès: environ `2` à `3` minutes
- étapes Codex réellement jouées: `5`
- étapes manuelles restantes pour une vraie recette Codex:
  - approbation admin
  - réception du magic link
  - ouverture du portail
  - reveal one-shot
  - matérialisation de `.codex/config.toml`
  - `/evaluate`
  - vérification MCP
  - premier tool call utile
