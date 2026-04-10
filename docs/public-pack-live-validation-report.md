# Public Pack Live Validation Report

Date du lot: `2026-04-10`

## Portée

Valider le repo public `sentinel-pilot` comme surface testeur minimale, pas corriger le produit.

Repos sources laissés intacts:

- `/var/www/frenchlink`
- `/var/www/agent-decision-plane`
- `/var/www/repo-exec-middleware`

## Résumé exécutif

Le lot produit deux conclusions différentes:

1. le pack local candidat dans `/var/www/sentinel-pilot` est lisible et raconte honnêtement le bon chemin
2. le repo GitHub public réellement clonable par un testeur externe n'est pas encore aligné avec ce pack local candidat

Au moment du test:

- HEAD local candidat: `c16d18e`
- HEAD GitHub public: `006e76b`

Le clone live de `https://github.com/illicoman/sentinel-pilot.git` ne contenait que `LICENSE`.

Conclusion immédiate:

- le README local candidat est un bon point d'entrée
- le README public réellement disponible ne l'est pas encore, car il n'est pas publié

## Phase A - Revalidation minimale du runtime

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

Résultats:

- `decision-api`: vivant, `ok: true`, `configMode = registry-api-key-required`
- `decision-mcp`: vivant, `ok: true`, `configMode = registry-mcp-token-required`
- portail sans session: `401 portal_session_invalid`
- `request-access`: vivant, `accepted: true`, `state = ACCESS_REQUESTED`

Verdict:

- runtime vivant
- auth attendue
- portail cohérent

## Phase B - Vérification repo public avant recette

Relu comme un testeur:

- [README.md](/var/www/sentinel-pilot/README.md)
- [docs/request-access-fr.md](/var/www/sentinel-pilot/docs/request-access-fr.md)
- [docs/what-you-can-test-fr.md](/var/www/sentinel-pilot/docs/what-you-can-test-fr.md)
- [docs/quickstart-claude-fr.md](/var/www/sentinel-pilot/docs/quickstart-claude-fr.md)
- [docs/quickstart-codex-fr.md](/var/www/sentinel-pilot/docs/quickstart-codex-fr.md)
- [examples/mcp.json.example](/var/www/sentinel-pilot/examples/mcp.json.example)
- [examples/codex.config.toml.example](/var/www/sentinel-pilot/examples/codex.config.toml.example)
- [examples/vibe.config.toml.example](/var/www/sentinel-pilot/examples/vibe.config.toml.example)
- [AGENTS.md](/var/www/sentinel-pilot/AGENTS.md)

Réponses:

- chemin canonique clair: `oui`, dans le repo local candidat
- portail explicitement obligatoire: `oui`
- reveal explicitement obligatoire: `oui`
- clone seul explicitement insuffisant: `oui`
- Vibe bien borné: `oui`

## Phase C/D - Claude

Voir [docs/live-validation-claude-fr.md](/var/www/sentinel-pilot/docs/live-validation-claude-fr.md).

Verdict Claude:

- `request-access`: prouvé
- portail sans session: prouvé
- reveal utilisé: `non prouvé dans ce lot`
- `/health` Claude post-reveal: `non prouvé dans ce lot`
- `/evaluate` Claude avec secret frais: `non prouvé dans ce lot`
- MCP Claude: `non prouvé dans ce lot`
- premier call utile Claude: `non prouvé dans ce lot`

Blocage exact:

- attente d'approbation admin
- attente de réception d'un magic link frais

## Phase E/F - Codex

Voir [docs/live-validation-codex-fr.md](/var/www/sentinel-pilot/docs/live-validation-codex-fr.md).

Verdict Codex:

- préconditions documentaires Codex: prouvées
- `/health` depuis environnement propre: prouvé
- reveal utilisé: `non prouvé dans ce lot`
- `/evaluate` Codex avec secret frais: `non prouvé dans ce lot`
- MCP Codex: `non prouvé dans ce lot`
- premier call utile Codex: `non prouvé dans ce lot`

Blocage exact:

- identique à Claude jusqu'au reveal

## Phase G - Vérité du repo public

### 1. Le README est-il un vrai point d'entrée ?

- repo local candidat: `oui`
- repo GitHub public réellement clonable: `non`

### 2. Le chemin Claude est-il lisible et suffisant ?

- lisible: `oui`
- suffisant pour une recette complète dans ce tour: `non`, faute de magic link frais approuvé

### 3. Le chemin Codex est-il lisible et suffisant ?

- lisible: `oui`
- suffisant pour une recette complète dans ce tour: `non`, pour la même raison

### 4. Y a-t-il encore une ambiguïté importante ?

Oui:

- un testeur externe qui clone aujourd'hui le repo GitHub public n'obtient pas encore le pack documenté

### 5. Le repo contient-il encore un faux chemin implicite ?

Dans le pack local candidat: `non` observé.

Dans le système global visible par un testeur externe: `oui`, tant que le remote GitHub public reste vide ou quasi vide; le clone public donne alors un faux signal de disponibilité.

### 6. Le pack public est-il suffisamment propre pour être partagé sans babysitting ?

- pack local candidat: `presque oui`
- repo GitHub public réellement partagé aujourd'hui: `non`, car non synchronisé

## Phase H - Nettoyage et sécurité

Mesures prises:

- workspaces jetables créés sous `/tmp`
- aucun secret révélé
- aucune config locale finale matérialisée
- aucun token stocké dans le repo
- aucun artefact sensible laissé dans les rapports

Nettoyage effectué:

- suppression des clones jetables
- suppression des cookies temporaires

## Conclusion produit honnête

Le produit live derrière le repo est cohérent sur la partie publique minimale observée:

- accès testeur: visible et vivant
- portail: vivant
- reveal one-shot: toujours borné par la session
- Claude prêt: non rejoué jusqu'au tool call dans ce lot
- Codex prêt avec caveat: non rejoué jusqu'au tool call dans ce lot
- Vibe: non rouvert

La vérité la plus importante de ce lot n'est pas un bug produit. C'est un écart de publication:

- le pack local candidat est prêt à être lu
- le remote GitHub public ne l'expose pas encore
