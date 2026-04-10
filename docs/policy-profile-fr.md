# Policy profile minimal

## Ce que c est

Un `policy profile` minimal permet de borner une partie de la gouvernance pour un client pilot donne.

Aujourd hui, ce profile :

- existe reellement
- est valide par schema
- est applique cote ADP
- est compile en overlay interne borne
- agit reellement sur la decision
- fonctionne dans le perimetre prouve sur Claude et Codex

Ce profile ne vit pas dans ce repo.

La vraie configuration active d un client pilot vit cote ADP, pas dans GitHub.

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

## Ce que ce profile permet vraiment aujourd hui

PROUVE :

- un profile minimal par client pilot existe
- il est valide
- il est applique cote ADP
- il change reellement la decision
- il fonctionne aujourd hui sur Claude et Codex dans le perimetre prouve

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

Ce profile minimal n est pas un editeur de policies.

## Pourquoi ce repo public reste volontairement limite

Ce repo sert a :

- comprendre le produit
- demander un acces
- preparer un test
- voir un schema et un exemple publics bornes

Ce repo ne sert pas a :

- heberger la vraie configuration active
- piloter directement le runtime
- remplacer le portail
- remplacer le reveal
- ouvrir un self-serve large
