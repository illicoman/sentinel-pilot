# ExecPlan - sentinel-pilot-claude-codex-pack-sync-v1

## But

- rendre `sentinel-pilot` autonome comme pack public local de bootstrap et de guidage pour Claude + Codex
- embarquer les surfaces projet utiles sans secret, sans download post-clone et sans dependance filesystem a FrenchLink

## Frontiere

- `sentinel-pilot` = pack public local
- `FrenchLink` = shell UX et surface publique
- `ADP` = verite des acces, secrets, reveal, decision, feedback, revocation
- `repo-exec-middleware` = enforcement externe, hors sujet

## Phases

1. auditer les surfaces Claude/Codex exportables
2. embarquer le pack Claude projet
3. realigner le pack Codex projet
4. mettre a jour les quickstarts et la doc canonique
5. ajouter les tests de pack et valider l absence de dependances cachees

## Done Criteria

- `.claude/settings.json` et les hooks utiles sont embarques
- `.codex/config.toml` et `.codex/config.toml.example` sont embarques sans secret
- la skill Codex Sentinel reste embarquee et coherente avec ADP
- aucune fuite de secret ou de chemin absolu interne n est presente
- la doc explique clairement le pilot assiste, le reveal obligatoire et les chemins canoniques Claude / Codex
