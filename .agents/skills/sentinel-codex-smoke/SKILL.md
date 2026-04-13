---
name: sentinel-codex-smoke
description: "Rejouer ou auditer le smoke Codex gouverne Sentinel dans `sentinel-pilot` apres un reveal portail. Utiliser quand Codex doit preparer, verifier ou resumer le chemin canonique Codex: repo `trusted`, `.codex/config.toml` versionne, secrets seulement dans le shell local, `/health`, `/evaluate`, endpoint MCP public avec bearer token, puis un premier tool call utile (`list_policy_packs` puis `explain_decision`). Utiliser aussi pour classifier un blocage du flux en `reveal_missing`, `repo_not_trusted`, `mcp_auth_boundary` ou `runtime_or_product_boundary`. Ne pas utiliser pour Claude, Vibe, authoring de policy profile, changement runtime ou exploration produit large."
---

# Sentinel Codex Smoke

## But

Rejouer ou auditer le premier workflow Codex Sentinel deja prouve, sans inventer de nouveau chemin produit.

## Workflow

1. Partir d un pilot assiste deja ouvert.
   Exiger:
   - acces approuve
   - session portail
   - reveal one-shot deja fait
   - `AGENT_DECISION_API_KEY` dans le shell local
   - `AGENT_DECISION_MCP_TOKEN` dans le shell local

2. Garder les frontieres visibles.
   Rappeler:
   - ADP reste la verite des credentials, de la decision et du reveal
   - ce repo public ne stocke aucun secret actif
   - le pilot n est pas self-serve
   - Vibe reste hors scope canonique
   - aucune edition libre des policy profiles n est ouverte ici

3. Verifier la posture locale Codex.
   Controler:
   - repo ouvert comme projet `trusted`
   - `.codex/config.toml` versionne intact
   - ne jamais ecrire un secret dans `.codex/config.toml`
   - ne jamais afficher ou persister les valeurs revelees

4. Verifier les surfaces dans cet ordre.
   Faire:
   - `/health`
   - `/evaluate` avec `host = codex`
   - endpoint MCP public `?adp_client=codex` avec `Authorization: Bearer ...`

5. Jouer le premier tool call utile.
   Preferer:
   - `list_policy_packs`
   - puis `explain_decision`
   Traiter le tool call utile comme signal de verite plus fort que `codex mcp list` seul.

6. Classifier tout blocage avec un seul label.
   Utiliser uniquement:
   - `reveal_missing`
   - `repo_not_trusted`
   - `mcp_auth_boundary`
   - `runtime_or_product_boundary`

7. Si un smoke utile aboutit, proposer ensuite le feedback portail.
   Ne pas remplacer le portail, ADP ou la doc canonique.

## Ne pas faire

- ne pas ouvrir Claude ou Vibe avec cette skill
- ne pas transformer cette skill en exploration produit large
- ne pas traiter `mcpUrlWithToken` ou un query token comme chemin Codex canonique
- ne pas promettre d enforcement natif Codex
- ne pas ouvrir un chantier runtime, moteur ou middleware

## Si un detail exact manque

Lire seulement:
- `docs/quickstart-codex-fr.md`
- `docs/request-access-fr.md`
- `README.md`
