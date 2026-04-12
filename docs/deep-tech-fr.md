# Deep tech

Sentinel traite un problème simple à formuler et difficile à fermer: décider assez tôt si une action sensible d'agent peut partir, sans dissoudre cette décision dans le host et sans confondre décision, accès et enforcement.

Ce dépôt public ne porte qu'un sous-ensemble public borné de cette histoire. La vérité système détaillée reste dans `agent-decision-plane`.

## Problème

Les prompts et la revue après coup arrivent souvent trop tard quand un agent veut toucher à de la production, de l'auth ou à une écriture sensible.

## Différenciation

- la décision arrive avant l'exécution
- l'enforcement reste externe
- le même produit garde une vérité lisible derrière plusieurs hosts réels

## Verrous technologiques

- relier accès testeur, portail et reveal sans remettre les secrets dans le repo public
- garder une même grammaire de décision malgré des hosts différents
- comparer des preuves hétérogènes sans survendre une parité inexistante

## Apport recherche

Sentinel ouvre un terrain d'étude sur la gouvernance d'agents avant exécution, la séparation des couches et la comparaison honnête entre hosts réels à maturités différentes.

## Socle de vérification déjà présent

Le produit porte déjà côté ADP une petite pile de vérification bornée :

- trace canonique v0
- policy verifier offline v0
- decision-quality-checker v0 mini

Statut :

- `PROUVÉ OFFLINE`

Cette pile :

- améliore la comparabilité des traces
- rend certaines claims plus défendables
- ne modifie pas le hot path
- ne transforme pas Sentinel en plateforme générale de model checking

## Portée publique de ce repo

Ce dépôt ne prétend pas exposer toute la plateforme. Il rend seulement testable le chemin public minimal: accès, portail, reveal, config locale et premier test utile.

Site public utile:

- `https://frenchlink.fr/agent-decision-plane-testeurs/`
