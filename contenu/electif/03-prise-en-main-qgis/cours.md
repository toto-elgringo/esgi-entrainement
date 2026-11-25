# Prise en main de QGIS

## Installer QGIS

Le logiciel se télécharge sur **qgis.org/download**. L'installation est longue : prévois du temps avant le cours.

## Les extensions

Une **extension** (plugin) ajoute des fonctions à QGIS, comme une application qu'on installe sur un téléphone. Menu **Extensions > Installer/Gérer les extensions**, puis on cherche par nom.

Une extension n'est pas faite pour changer le format d'un fichier, sauvegarder ou supprimer une couche : ces actions existent déjà dans QGIS. Elle **ajoute** quelque chose qui manque.

Deux extensions ont été demandées en cours :

| Extension | Usage | Ce qu'on obtient |
|---|---|---|
| **QuickMapServices** | ajouter un fond de carte (dont OpenStreetMap) en quelques clics | une **image** sous les couches, juste pour se repérer |
| **QuickOSM** | télécharger des données OpenStreetMap (restaurants, gares…) directement dans QGIS | une vraie **couche** d'objets, avec leurs attributs |

**Exemple résolu : tu veux compter les gares d'une ville. Quelle extension ?**

1. Compter demande des **objets** qu'on peut sélectionner, un par un, avec leurs informations.
2. QuickMapServices ne donne qu'une image : on voit les gares dessinées sur le fond, mais on ne peut ni les cliquer ni les compter.
3. QuickOSM télécharge les gares comme une couche de points, avec une table d'attributs : on peut les compter.

Réponse : **QuickOSM**. Piège : son nom ressemble à OSM, mais ce n'est pas lui qui affiche le fond OpenStreetMap ; c'est QuickMapServices.

**À retenir :** pour **voir** un fond → QuickMapServices ; pour **récupérer des objets** OSM → QuickOSM.

> [!info] À savoir
> Si tu ne trouves pas une extension, vérifie l'orthographe dans la barre de recherche et que l'onglet « Toutes » est sélectionné. Les noms exacts sont dans les supports du cours.

## Un fond de carte

Un **fond de carte** est une image (carte ou photo) placée **sous** tes couches pour te repérer. OpenStreetMap est le plus courant. Ce n'est qu'une image : on ne peut pas interroger ses objets.

> [!warning] Piège
> Si un message **« API key required »** apparaît sur la carte, le fond choisi demande une clé d'accès. Prends un fond libre comme **OpenStreetMap standard**, ou ouvre un autre fond.

Une **clé d'API** est un mot de passe que certains services de cartes demandent pour livrer leurs images (souvent après inscription, parfois payante). Le message vient donc **du fond de carte**, pas de tes données ni de QGIS.

**Exemple résolu : « API key required » s'affiche partout sur la carte.**

1. Qui affiche ce message ? Le service du fond de carte, qui refuse de donner ses images sans clé.
2. Est-ce que réinstaller QGIS, supprimer le projet ou changer de projection y change quelque chose ? Non : le service demande toujours sa clé.
3. Solution : retirer ce fond et en ajouter un libre (OpenStreetMap standard) avec QuickMapServices.

**À retenir :** « API key required » = changer de fond de carte pour un fond libre.

## Le système de coordonnées du projet

Le fond de carte web est en **EPSG:3857** (mètres, projection du web), les données de la BD TOPO en **EPSG:2154**. QGIS les superpose en les convertissant « à la volée », mais pour **mesurer** (distances, zones tampons) il faut des couches en **mètres** : travaille en EPSG:2154.

Une **zone tampon** (*buffer*) est la zone qui entoure un objet jusqu'à une certaine distance : par exemple, tout ce qui est à moins de 300 m d'un arrêt de bus. On donne la distance dans **l'unité de la couche**.

**Exemple résolu : tampon de 300 m autour d'arrêts de bus à Lyon. Quel système ?**

1. On donne la distance « 300 » à QGIS : il la lit dans l'unité de la couche.
2. En EPSG:2154 (Lambert 93), l'unité est le **mètre** : 300 = 300 m. C'est ce qu'on veut, et c'est la projection officielle de la France métropolitaine.
3. En EPSG:4326 (WGS 84, GPS), l'unité est le **degré** : 300 voudrait dire 300 degrés, presque un tour complet de la Terre (360 degrés). Absurde.

Ce n'est pas que le WGS 84 soit trop précis, ancien ou réservé à un usage : il existe toujours (c'est celui du GPS). Le problème, c'est **son unité**.

**À retenir :** pour mesurer en France, couches en EPSG:2154 (mètres) ; jamais de tampon en EPSG:4326 (degrés).

## La table d'attributs

Clic droit sur la couche > **Ouvrir la table d'attributs**. Chaque ligne est un objet. On peut trier, sélectionner, filtrer et calculer des champs.

## Couleurs et symbologie

Clic droit sur la couche > **Propriétés > Symbologie**. On peut colorer tous les objets pareil, ou par catégorie d'un champ.

> [!info] À savoir
> En cours, la question a été posée : existe-t-il des conventions de couleur (comme « toujours rouge pour x, bleu pour y ») ? Pour une carte, les conventions courantes sont : **bleu pour l'eau, vert pour la végétation, gris pour le bâti, rouge ou orange pour les axes routiers principaux**. Pour les couleurs d'une variable qui augmente, on utilise un **dégradé d'une seule teinte**.

| Élément | Couleur habituelle | Pourquoi |
|---|---|---|
| eau (cours d'eau, lacs) | bleu | la couleur de l'eau |
| végétation (parcs, forêts) | vert | la couleur des plantes |
| bâti | gris | neutre, ne gêne pas les autres couches |
| grands axes routiers | rouge ou orange | doivent se voir tout de suite |
| relief | marron | la couleur de la terre |

**Exemple résolu : quelle couleur pour les plans d'eau et pour les cimetières (souvent arborés) ?**

1. Plans d'eau : de l'eau, donc **bleu**. Le lecteur comprend sans légende.
2. Cimetières : c'est du bâti et des allées ; en gris (bâti) ou en vert clair s'ils sont arborés. Surtout pas bleu : on croirait à de l'eau.

Une couleur « inattendue » (vert vif pour des bâtiments, jaune fluo, rose pour l'eau) oblige le lecteur à lire la légende et risque de le tromper.

**À retenir :** une carte se lit sans légende pour l'évident : bleu = eau, vert = végétation, gris = bâti.

## Quand ça ne répond plus

- La **couche vecteur peut cesser de répondre** si elle est énorme (BATIMENT) : ferme les couches inutiles, attends la fin du chargement, ou filtre la couche.
- Si l'affichage est vide, vérifie la **case cochée** de la couche et le **système de coordonnées** du projet.
- Si les couches ne se **superposent pas bien** (décalées, ou très loin l'une de l'autre) : c'est presque toujours le **système de coordonnées**. Vérifie celui du projet (en bas à droite) et celui de chaque couche. Ne supprime surtout pas le `.prj` : sans lui, QGIS ne saurait plus du tout où placer la couche.
- Enregistre souvent le projet (`.qgz`) : il garde l'ordre des couches et leur style, mais **pas les données**. Garde donc les fichiers de données au même endroit.

Le fichier `.qgz` contient en fait le **chemin** vers chaque fichier de données. Si tu déplaces ou renommes les fichiers de données, le projet ne les retrouve plus.

**Exemple résolu : trois problèmes, trois causes.**

| Ce que tu vois | Cause probable | Ce que tu fais |
|---|---|---|
| QGIS se fige quand tu affiches BATIMENT | trop de données à dessiner | fermer les couches inutiles, attendre, filtrer la couche |
| la carte est vide | couche décochée ou mauvais système | cocher la couche, vérifier l'EPSG du projet |
| les routes sont décalées par rapport aux bâtiments | systèmes de coordonnées différents | vérifier l'EPSG du projet et des couches |

Ce qui ne sert à rien : renommer un fichier ou changer de couleur ne rend pas une couche plus légère ; redémarrer ou agrandir la fenêtre ne corrige pas un mauvais système de coordonnées.

**À retenir :** couche lente → moins de données ; couches décalées → système de coordonnées ; projet `.qgz` → garde les données au même endroit.
