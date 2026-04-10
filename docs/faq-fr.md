# FAQ

## Qu'est-ce que Sentinel ?

Sentinel décide avant l'exécution d'une action sensible puis renvoie une sortie lisible: `Action -> Decision -> Next safe action`.

## Que puis-je tester aujourd'hui ?

Claude prêt. Codex prêt avec friction native résiduelle réduite. Vibe expérimental / limité. Vous pouvez aussi tester le flux d'accès, le portail, le reveal one-shot, `/health`, `/evaluate` et un policy profile minimal par client pilot dans un cadre borné.

## Faut-il un portail ?

Oui. Le portail est obligatoire.

## Pourquoi le reveal est one-shot ?

Pour copier les credentials une seule fois puis éviter tout réaffichage des secrets.

## Le clone suffit-il ?

Non. Le clone seul est insuffisant.

## Claude, Codex et Vibe: quelle différence ?

Claude est le chemin recommandé et prêt aujourd'hui. Codex est prêt aussi, avec une friction native résiduelle réduite. Vibe reste expérimental / limité et ne doit pas être traité comme un point de départ canonique.

## Peut-on configurer Sentinel pour chaque client pilot ?

Oui, dans un cadre minimal et borné. Un profile minimal par client pilot existe aujourd'hui côté ADP. Il ne s'agit pas d'un éditeur libre de policies.

## Où vit la vraie configuration ?

La vraie configuration active vit côté ADP. Ce repo public ne contient qu'un schéma et un exemple documentaires.

## Le repo public contient-il la vraie policy active ?

Non. Ce repo public ne contient jamais la vraie configuration active d'un client pilot.

## Peut-on éditer librement les policies ?

Non. Ce n'est pas du policy authoring libre. Vous ne pouvez pas écrire des règles libres, exposer des objets internes du moteur ou modifier l'enforcement depuis ce repo.

## Quels hosts sont couverts aujourd'hui par ce profile minimal ?

Le périmètre public prouvé aujourd'hui est Claude et Codex. Vibe reste hors scope pour ce profile minimal public.

## Vibe est-il concerné ?

Non. Vibe reste expérimental / limité et n'est pas couvert par ce profile minimal public.

## Est-ce du self-serve ?

Non. Le portail reste obligatoire. Le reveal reste obligatoire. Le backend reste obligatoire. Ce repo public ne suffit pas à activer un profile.

## Où sont les secrets ?

Ils ne sont pas dans ce repo. Aucun secret n'est versionné ici. Les valeurs locales viennent du portail puis du reveal one-shot.

## Comment demander l'accès ?

Commencez par la demande d'accès sur la surface publique Sentinel, attendez l'approbation, ouvrez le magic link, puis le portail. Le choix du host vient après le reveal.
