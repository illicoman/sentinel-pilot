# Policy profile minimal

## Ce que c est

Un `policy profile` minimal permet de borner une partie de la gouvernance pour un client pilot donne.

Aujourd hui, ce profile :

- existe reellement
- est valide par schema
- est applique cote ADP
- est compile en overlay interne borne
- agit reellement sur la decision
- fonctionne dans le perimetre prouve sur `/evaluate`, Claude MCP et Codex
- supporte trois modes explicites :
  - `shadow`
  - `review`
  - `enforced`

Ce profile ne vit pas dans ce repo.

La vraie configuration active d un client pilot vit cote ADP, pas dans GitHub.

## Statut de preuve

### PROUVÉ LIVE

- le profile minimal existe
- il est valide cote ADP
- il est compile cote ADP
- il agit reellement sur la decision
- il fonctionne aujourd hui sur `/evaluate`, Claude MCP et Codex
- `executionMode` fonctionne aujourd hui sur ce meme perimetre
- la monotonie est respectee

### PROUVÉ LOCAL

- le schema public de ce repo existe
- l exemple public de ce repo existe

### HORS SCOPE

- Vibe
- self-serve large
- edition libre des policies
- objets internes du moteur

## A quoi il sert aujourd hui

Le profile minimal sert a exprimer un petit nombre de bornes de gouvernance stables au-dessus de packs deja existants.

Exemples de ce qu il peut faire aujourd hui :

- demander une approbation sur certaines branches protegees
- demander une approbation sur certains types d action deja connus, par exemple `NETWORK_ACCESS`

Le sens produit reste le meme :

- la decision est toujours rendue cote ADP
- l enforcement reste externe
- `permit / verify` ne bougent pas

## Champs publics exposes

Sous-ensemble public strictement borne aujourd hui :

- `profile`
- `executionMode`
- `protectedBranches`
- `approvalRequiredFor`

Le schema public minimal est ici :

- [examples/policy-profile.schema.json](../examples/policy-profile.schema.json)

L exemple public minimal est ici :

- [examples/policy-profile.example.json](../examples/policy-profile.example.json)

Important :

- ce schema et cet exemple sont documentaires
- ce ne sont pas des configurations actives
- ce repo ne contient jamais la vraie configuration d un client pilot

`executionMode` est borne a :

- `shadow`
- `review`
- `enforced`

## Ce que signifient les trois modes

### `shadow`

- le profile est lu
- le match est calcule
- la decision suggeree du profile est exposee
- le verdict final reste celui du moteur de base

Ce mode sert a :

- apprendre
- calibrer
- prouver un effet sans rendre la contrainte executoire

### `review`

- le profile est lu
- s il matche, il peut rehausser la decision finale vers `REQUIRE_APPROVAL`
- il ne peut jamais assouplir une decision existante
- si le moteur est deja plus strict, le verdict le plus strict reste le verdict final

Ce mode sert a :

- rendre explicite une validation humaine
- sans detendre le moteur

### `enforced`

- le profile est lu
- s il matche, son effet est bindant dans la decision finale
- il reste monotone
- il ne peut jamais relaxer une decision existante

Ce mode sert a :

- poser une contrainte reelle avant execution
- sans ouvrir un moteur de regles libre

Important :

- sur le sous-ensemble v1 actuel, `review` et `enforced` peuvent parfois produire le meme verdict observable
- la difference reste visible dans le mode, l audit et l effet applique
- ce n est pas un bug

## Pourquoi la monotonie compte

Ici, monotone signifie :

- le profile peut annoter
- le profile peut rehausser
- le profile peut rendre plus strict
- le profile ne peut jamais relaxer une decision plus stricte du moteur

Le client ne peut donc pas :

- enlever un `DENY`
- enlever un `REQUIRE_SANDBOX`
- produire un `ALLOW` libre contre une decision plus stricte
- modifier `permit / verify`
- desactiver le fail-closed

## Comment il est valide et applique

Le chemin reel est :

1. un profile minimal est defini cote ADP pour un client pilot
2. ce JSON est valide par schema
3. il est compile en overlay interne borne
4. cet overlay est ajoute au chemin de decision
5. la decision reste rendue par ADP

Donc :

- le moteur ne lit pas directement un fichier JSON de ce repo
- le portail reste obligatoire
- le reveal reste obligatoire
- le backend reste obligatoire
- le repo public ne suffit pas a activer un profile

## Ce que ce profile permet vraiment aujourd hui

PROUVE :

- un profile minimal par client pilot existe
- il est valide
- il est applique cote ADP
- il change reellement la decision
- il fonctionne aujourd hui sur `/evaluate`, Claude et Codex dans le perimetre prouve
- il supporte `shadow`, `review`, `enforced`
- la monotonie est respectee

NON OUVERT / HORS SCOPE :

- Vibe
- nouveaux champs
- self-serve large
- UI riche d edition
- multi-host large
- configuration libre du moteur

## Ce que le client ne peut pas faire

Le client ne peut pas :

- ecrire des regles libres
- deposer librement des policies dans ce repo et s attendre a une activation automatique
- desactiver le fail-closed
- modifier l enforcement
- acceder aux objets internes du moteur
- modifier `permit / verify`
- ouvrir Vibe via ce profile

Le client peut aujourd hui :

- avoir un profile minimal par client pilot
- demander quelques bornes validees
- choisir un `executionMode` borne

Le client ne peut pas transformer Sentinel en policy engine self-serve.

Ce profile minimal n est pas un editeur de policies.

## Pourquoi ce repo public reste volontairement limite

Ce repo sert a :

- comprendre le produit
- demander un acces
- preparer un test
- voir un schema et un exemple publics bornes
  - localement et documentairement seulement

Ce repo ne sert pas a :

- heberger la vraie configuration active
- piloter directement le runtime
- remplacer le portail
- remplacer le reveal
- ouvrir un self-serve large
