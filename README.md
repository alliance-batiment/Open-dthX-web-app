![Open-dthX-web-app](./AllianceBatiment.jpeg "Open-dthX-web-app")

## Sommaire

- [Mise en route](#installations)
- [Webpack Federation](#federation)
- [Documentation API](#api)
- [Communauté & Assistance](#assistance)
- [License](#license)


## <a name="installations"></a>Mise en route

### Cloner le kit de développement

Commençons par cloner le <a href="https://github.com/alliance-batiment/Open-dthX-web-app.git" target="_blank">Open dthX Web App</a> grâce à **git** dans le repertoire ou nous souhaitons :
```shell
$ git clone https://github.com/alliance-batiment/Open-dthX-web-app.git
```

### Démarrage

Cette application utilise la version `16.14.0` de **Node.js**.
Puis, entrez dans votre dossier, lancez l'installation des modules **Node.js** via la commande `npm install` et enfin démarrez l'application avec `npm start`:

```shell
$ cd ./Open-dthX-web-app
$ npm install
$ npm start
```
Notez que notre application a dû s'ouvrir automatiquement dans notre navigateur (si ce n'est pas le cas, ouvrez un nouvel onglet dans votre navigateur et saisissez l'URL indiquée par la commande dans le terminal, normalement  http://localhost:3000/ ).


## <a name="federation"></a>Webpack federation

Une fois dans **Open-dthX-web-app**, afin de faire fonctionner l'application avec Webpack Federation:
```shell
$ cd ./module-federation
$ npm install
```
Puis revenez à la racine du projet:
```shell
$ cd ./module-federation
$ npm run start:federation
```

## <a name="api"></a>Documentation API

Lien vers la documentation de l'API:
<a href="https://rest-api-rw.datbim.com/api/doc" target="_blank">https://rest-api-rw.datbim.com/api/doc</a>


## <a name="assistance"></a>Communauté & Assistance

Afin de pouvoir échanger sur le sujet et répondre à vos questions, vous pouvez rejoindre notre serveur <a href="https://discord.gg/b9xy9zVpTB" target="_blank">Discord</a> et suivre nos développements sur notre <a href="https://github.com/alliance-batiment?tab=repositories" target="_blank">Github</a>.

Vous pouvez également nous contacter par email: <a href="contact@alliance-batiment.org" target="_blank">contact@alliance-batiment.org</a>.


A bientôt sur <a href="https://alliance-batiment.org/">Alliance du Batiment</a>!!

## <a name="license"></a>## License

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

- **[GNU license](https://www.gnu.org/licenses/gpl-3.0.html)**
- Copyright 2022 © <a href="https://alliance-batiment.org/" target="_blank">Alliance du Batiment</a>.