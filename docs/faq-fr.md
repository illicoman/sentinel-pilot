# FAQ

## Qu'est-ce que Sentinel ?

Sentinel décide avant l'exécution d'une action sensible puis renvoie une sortie lisible: `Action -> Decision -> Next safe action`.

## Que puis-je tester aujourd'hui ?

Claude prêt. Codex prêt avec friction native résiduelle réduite. Vibe expérimental / limité. Vous pouvez aussi tester le flux d'accès, le portail, le reveal one-shot, `/health`, `/evaluate` et un policy profile minimal par client pilot dans un cadre borné.

## Le pack embarque-t-il déjà Claude et Codex ?

Oui. Le clone embarque déjà les hooks projet Claude via `CLAUDE.md` et `.claude/settings.json`, ainsi que le profil projet Codex via `.codex/config.toml`, `.codex/config.toml.example` et la skill `.agents/skills/sentinel-codex-smoke`.

## Faut-il un portail ?

Oui. Le portail est obligatoire.

## Pourquoi le reveal est one-shot ?

Pour copier les credentials une seule fois puis éviter tout réaffichage des secrets.

## Le clone suffit-il ?

Non. Le clone seul est insuffisant.

## Pourquoi n'y a-t-il pas de download post-clone ?

Parce que le pilot assisté actuel privilégie un pack public simple et déjà lisible après clone. Le reveal reste obligatoire, mais les surfaces projet Claude et Codex sont déjà embarquées sans secret.

## Claude, Codex et Vibe: quelle différence ?

Claude est le chemin recommandé et prêt aujourd'hui. Codex est prêt aussi, avec une friction native résiduelle réduite. Vibe reste expérimental / limité et ne doit pas être traité comme un point de départ canonique.

## Les secrets sont-ils dans le repo ?

Non. Aucun secret n'est versionné ici. Les valeurs locales viennent du portail puis du reveal one-shot.

## Où vit la vraie configuration ?

La vraie configuration active vit côté ADP. Ce repo public ne contient qu'un schéma, un exemple documentaire et les surfaces locales de bootstrap.

## Le repo public contient-il la vraie policy active ?

Non. Ce repo public ne contient jamais la vraie configuration active d'un client pilot.

## Peut-on configurer Sentinel pour chaque client pilot ?

Oui, dans un cadre minimal et borné. Un profile minimal par client pilot existe aujourd'hui côté ADP. Il ne s'agit pas d'un éditeur libre de policies.

## Que signifie `executionMode` ?

`executionMode` fixe la manière dont le profile minimal agit sur la décision. Aujourd'hui, il est borné à trois valeurs :

- `shadow`
- `review`
- `enforced`

## Quelle différence entre shadow, review et enforced ?

- `shadow` lit le profile et expose une décision suggérée, mais ne change pas le verdict final.
- `review` peut rehausser le verdict final vers `REQUIRE_APPROVAL` quand le profile matche.
- `enforced` rend l'effet du profile bindant dans la décision finale, sans jamais relaxer le moteur.

## Pourquoi review et enforced peuvent-ils parfois donner le même verdict visible ?

Parce que le sous-ensemble v1 actuel reste volontairement étroit. Aujourd'hui, les overlays publics prouvés relèvent surtout vers `REQUIRE_APPROVAL`. Dans ce cadre, `review` et `enforced` peuvent partager le même verdict observable. La différence reste réelle dans le mode, l'audit et l'effet appliqué. Ce n'est pas un bug.

## Peut-on éditer librement les policies ?

Non. Ce n'est pas du policy authoring libre. Vous ne pouvez pas écrire des règles libres, exposer des objets internes du moteur ou modifier l'enforcement depuis ce repo.

## Le profile peut-il relaxer une décision plus stricte du moteur ?

Non. Le profile minimal public reste monotone. Il peut annoter ou rehausser, mais il ne peut jamais assouplir une décision plus stricte du moteur.

## Quels hosts sont couverts aujourd'hui par ce profile minimal ?

Le périmètre public prouvé aujourd'hui est `/evaluate`, Claude et Codex. Vibe reste hors scope pour ce profile minimal public.

## Le produit a-t-il déjà une couche de trace et de vérification ?

Oui, côté ADP.

Aujourd'hui, le produit porte déjà :

- une trace canonique v0
- un policy verifier offline v0
- un decision-quality-checker v0 mini

Cette couche est `PROUVÉ OFFLINE`.
Elle améliore l'audit et la défendabilité.
Elle n'est pas exposée ici comme un service self-serve.

## Que change `maxResultSizeChars` pour Claude ?

Le gateway public peut maintenant annoncer a Claude un budget de resultat plus large sur les tools utiles. Cela ameliore surtout le headroom des reponses riches. Cela ne change ni le verdict, ni la semantique produit.

## Que signifie la corrélation `PermissionDenied` côté Claude ?

Un refus natif Claude `PermissionDenied` peut maintenant etre lu avec une evidence Sentinel sur le meme geste. Cela ameliore surtout la preuve et la lisibilite de la demo. Cela ne transforme pas Sentinel en enforcement interne du host Claude.

## Que change `outputSchema` pour Codex ?

`outputSchema` rend les reponses MCP utiles plus machine-readable cote Codex. Le gain principal est structurel: verdict, raison et prochaine action sure sont mieux typés. Cela ne change pas la semantique produit.

## `computer use` est-il couvert ?

Non. `computer use` n est pas couvert dans le pilot canonique v1.

## `defer` est-il déjà ouvert ?

Non. `defer` reste une opportunite future discutable cote Claude. Ce n est pas une capacite prouvee actuelle.

## Vibe est-il concerné ?

Vibe reste expérimental / limité et hors scope canonique. Il existe quelques signaux techniques intéressants, mais cela ne suffit pas à en faire un chemin pilote primaire ni une promesse produit publique.

## Est-ce du self-serve ?

Non. Le portail reste obligatoire. Le reveal reste obligatoire. Le backend reste obligatoire. Ce repo public ne suffit pas à activer un profile.

## Comment demander l'accès ?

Commencez par la demande d'accès sur la surface publique Sentinel, attendez l'approbation, ouvrez le magic link, puis le portail. Le choix du host vient après le reveal.
