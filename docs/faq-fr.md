# FAQ

## Qu'est-ce que Sentinel ?

Sentinel décide avant l'exécution d'une action sensible puis renvoie une sortie lisible: `Action -> Decision -> Next safe action`.

## Que puis-je tester aujourd'hui ?

Claude prêt. Codex prêt avec friction native résiduelle réduite. Vibe expérimental / limité. Vous pouvez aussi tester le flux d'accès, le portail, le reveal one-shot, `/health` et `/evaluate`.

## Faut-il un portail ?

Oui. Le portail est obligatoire.

## Pourquoi le reveal est one-shot ?

Pour copier les credentials une seule fois puis éviter tout réaffichage des secrets.

## Le clone suffit-il ?

Non. Le clone seul est insuffisant.

## Claude, Codex et Vibe: quelle différence ?

Claude est le chemin recommandé et prêt aujourd'hui. Codex est prêt aussi, avec une friction native résiduelle réduite. Vibe reste expérimental / limité et ne doit pas être traité comme un point de départ canonique.

## Où sont les secrets ?

Ils ne sont pas dans ce repo. Aucun secret n'est versionné ici. Les valeurs locales viennent du portail puis du reveal one-shot.

## Comment demander l'accès ?

Commencez par la demande d'accès sur la surface publique Sentinel, attendez l'approbation, ouvrez le magic link, puis le portail. Le choix du host vient après le reveal.

