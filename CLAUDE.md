# Sentinel Pilot CLAUDE

## Role du repo

- pack public minimal pour le pilot assiste Sentinel
- surface locale Claude + Codex deja embarquee dans le clone
- documentation et garde-fous projet, sans secret et sans portail embarque

## Chemin Claude a respecter

1. demander un acces
2. ouvrir le portail apres approbation
3. faire le reveal one-shot
4. exporter seulement les valeurs locales revelees
5. laisser Claude charger `CLAUDE.md` puis `.claude/settings.json`
6. configurer le MCP avec `AGENT_DECISION_MCP_URL`
7. verifier `/health`, `/evaluate`, puis un premier tool call utile

Le portail reste obligatoire.
Le reveal reste obligatoire.
Le clone seul reste insuffisant.

## Pack Claude embarque

- `CLAUDE.md`
- `.claude/settings.json`
- `.claude/settings.local.json.example`
- `.claude/hooks/`
- `.claude/lib/`

Les hooks projet sont deja partages dans le repo.
`.claude/settings.local.json` reste local et gitignore.
Aucun secret ne doit y etre stocke.

## Frontieres non negociables

- ne jamais presenter un hook Claude comme une frontiere de securite
- ne jamais deplacer reveal, secrets, revocation, rotation ou decision profonde hors ADP
- ne jamais dependre d un chemin absolu interne ou d un helper FrenchLink local
- ne jamais faire croire que ce clone suffit sans portail ni reveal
- ne jamais ouvrir Vibe comme chemin canonique ici

## Ce que font les hooks

- `ConfigChange` bloque les changements de configuration projet critiques pendant une session gouvernee
- `UserPromptSubmit` bloque les demandes explicites d exposition de secret ou de contournement
- `PreToolUse` appelle `POST /evaluate` en shadow pour `Bash|Edit|MultiEdit|Write`
- `PostToolUseFailure` rappelle la guidance shadow la plus proche apres un echec tool-side

Ces hooks restent shadow-only.
Ils n ajoutent ni enforcement, ni policy locale, ni bypass des permissions natives.

## Verite systeme

- `FrenchLink` reste la surface UX et le parcours portail / reveal
- `agent-decision-plane` reste la verite systeme
- `repo-exec-middleware` reste la boundary d enforcement externe

## Discipline

- ne jamais coller un token, un magic link ou un snippet revele dans une session
- ne jamais versionner de secret
- ne pas conclure qu un smoke est bon sans reveal, `/health`, `/evaluate` et un tool call utile
- Claude est le chemin recommande; Codex vient juste apres; Vibe reste experimental / limite
