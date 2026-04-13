# Live Validation Claude

Date de validation: `2026-04-10`

## Périmètre

Valider si le repo public `sentinel-pilot` guide correctement un testeur vers le chemin canonique `README -> request access -> portal -> reveal -> Claude -> premier test utile`, sans modifier le produit ni contourner le portail.

## Verdict court

- Runtime public: vivant.
- `request-access`: vivant.
- Portail sans session: cohérent.
- Repo local candidat: lisible et honnête.
- Repo GitHub public: non aligné avec le candidat local au moment du test.
- Recette Claude complète: non jouée jusqu'au premier tool call utile.

## Revalidation live minimale

Commandes rejouées:

```bash
curl -sS https://decision-api.frenchlink.fr/health
curl -sS https://decision-mcp.frenchlink.fr/health
curl -i -sS "https://frenchlink.fr/agent-decision-plane-testeurs/api/access.php?action=session"
curl -sS -X POST \
  "https://frenchlink.fr/agent-decision-plane-testeurs/api/access.php?action=request-access" \
  -H 'content-type: application/json' \
  -d '{...}'
```

Résultats observés:

- `decision-api` répond `ok: true` avec `configMode = registry-api-key-required`.
- `decision-mcp` répond `ok: true` avec `configMode = registry-mcp-token-required`.
- `action=session` sans session valide répond `401 portal_session_invalid`.
- `action=request-access` accepte la demande et retourne `state = ACCESS_REQUESTED` avec un identifiant opaque.

## Environnement propre

Workspace jetable utilisé:

- `/tmp/sentinel-pilot-claude-live`

Définition retenue pour `propre`:

- clone jetable recréé depuis zéro
- aucun `.mcp.json`
- aucun `.codex/config.toml`
- aucun `.vibe/config.toml`
- aucun `AGENT_DECISION_*` dans le shell
- aucune session portail réutilisée
- aucun cookie de portail préexistant

Important:

- le clone GitHub public n'était pas utilisable pour ce test car le remote public ne contenait encore que `LICENSE`
- le clone jetable a donc été créé depuis le repo local candidat, uniquement pour valider le chemin documentaire candidat

## Chemin réellement joué

1. Lire [README.md](../README.md).
2. Lire [docs/request-access-fr.md](./request-access-fr.md).
3. Créer un workspace jetable propre.
4. Soumettre une demande `request-access` via la surface publique.
5. Vérifier que le portail reste sans session tant qu'aucun magic link approuvé n'a été consommé.

## PROUVÉ live

- le runtime public répond bien
- `GET /health` est prouvé live globalement en phase A
- le portail exige bien une session
- le reveal reste bien inaccessible sans magic link consommé
- le message `le portail est obligatoire` est vrai
- le message `le reveal est obligatoire` est vrai
- le message `le clone seul est insuffisant` est vrai
- le repo local candidat raconte un chemin Claude lisible

## NON PROUVÉ dans ce lot

- ouverture d'une session portail via un magic link frais
- reveal one-shot
- matérialisation de `.mcp.json` depuis un reveal frais
- `GET /health` rejoué après reveal dans le flux Claude exact
- `POST /evaluate` avec une API key fraîchement révélée
- `claude --mcp-config .mcp.json --strict-mcp-config mcp list`
- premier tool call utile Claude
- feedback corrélé après session portail

## Blocage réel

Le blocage n'est pas dans le README local candidat. Le blocage est dans les préconditions live du flux public:

- la demande d'accès passe bien en `ACCESS_REQUESTED`
- la suite du chemin dépend d'une approbation admin puis d'un magic link email
- dans ce tour, aucun magic link frais approuvé n'était disponible par un chemin public documenté
- contourner ce point via un chemin interne aurait violé le scope

## Frictions observées

- friction majeure: le GitHub public `https://github.com/illicoman/sentinel-pilot.git` n'est pas encore aligné avec le pack local candidat; le clone externe actuel ne contient pas le README ni les docs
- friction majeure: la recette publique complète reste asynchrone dès `request-access`; sans approbation et sans magic link frais, Claude ne peut pas atteindre le reveal
- friction mineure: le repo local candidat est compréhensible vite, mais cette clarté n'est pas encore disponible sur le remote public

## Temps et étapes

- compréhension du chemin candidat local: environ `2` minutes
- soumission `request-access`: immédiate
- temps jusqu'au premier blocage dur: environ `3` minutes
- étapes jouées avant blocage: `5`
- étapes manuelles restantes pour une vraie recette Claude:
  - approbation admin
  - réception du magic link
  - ouverture du portail
  - reveal one-shot
  - copie de la config locale
  - `/evaluate`
  - MCP Claude
  - premier tool call utile
