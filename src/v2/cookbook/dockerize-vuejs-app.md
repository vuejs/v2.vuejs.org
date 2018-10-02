---
title: Dockeriser une app Vue.js
type: cookbook
order: 13
---

## Exemple

Vous avez construit votre app Vue.js en utilisant le magnifique [Vue.js webpack template](https://github.com/vuejs-templates/webpack) et maintenant vous voulez vraiment impressionner vos collègues en montrant que vous pouvez aussi l'exécuter dans un container Docker.

Commençons par créer un `Dockerfile` dans le dossier racine de notre projet.

```docker
FROM node:9.11.1-alpine

# installe un simple serveur http pour servir un contenu statique
RUN npm install -g http-server

# définit le dossier 'app' comme dossier de travail
WORKDIR /app

# copie 'package.json' et 'package-lock.json' (si disponible)
COPY package*.json ./

# installe les dépendances du projet
RUN npm install

# copie les fichiers et dossiers du projet dans le dossier de travail (par exemple : le dossier 'app')
COPY . .

# construit l'app pour la production en la minifiant
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]
```

Il peut sembler redondant de copier `package.json` et `package-lock.json` et ensuite tous les fichiers et dossiers du projet en deux étapes différentes mais il y a [une très bonne raison pour ça](http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/) (résumé : ça nous permet de prendre avantage de la mise en cache des `Docker layers`)

Maintenant on peut construire l'image Docker de notre app Vue.js :

```bash
docker build -t vuejs-cookbook/dockerize-vuejs-app .
```

Finalement, lançons notre app Vue.js dans un container Docker :

```bash
docker run -it -p 8080:8080 --rm --name dockerize-vuejs-app-1 vuejs-cookbook/dockerize-vuejs-app
```

On devrait pouvoir avoir accès à notre app sur `localhost:8080`.

## Exemple réel

Dans l'exemple précédant, on a utilisé la ligne de commande [http-server](https://github.com/indexzero/http-server) sans configuration pour servir notre app Vue.js qui est parfaitement suffisent pour du prototypage rapide et pourrait même suffire pour de simples scénarios de production. Après tout, la documentation dit :

> C'est assez puissant pour être utilisé en production, mais c'est assez simple et facile à détourner pour être utilisable pour les tests, le développement local et l’apprentissage.

Néanmoins, pour un réel et complexe cas de production, il serait plus sage de se reposer sur les épaules de géants comme [NGINX](https://www.nginx.com/) ou [Apache](https://httpd.apache.org/) et c'est exactement ce que l'on va faire : on va utilisé NGINX pour servir notre app Vue.js parce qu'il est considéré comme une des solutions les plus performants et testées.

Modifions notre `Dockerfile` pour utiliser NGINX:

 ```docker
# étape de build
FROM node:9.11.1-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# étape de production
FROM nginx:1.13.12-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Regardons ce qu'il se passe ici :
* nous avons fragmenté notre `Dockerfile` original en plusieurs étapes en utilisant la fonction [multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/) de Docker;
* la première étape est responsable de la création d'un artéfact prêt pour la production de notre app Vue.js;
* la deuxième étape est responsable du service de notre artéfact en utilisant NGINX.

Maintenant, construisons l'image Docker de notre app Vue.js :

```bash
docker build -t vuejs-cookbook/dockerize-vuejs-app .
```

Finalement, lançons notre app Vue.js dans un container Docker :

```bash
docker run -it -p 8080:80 --rm --name dockerize-vuejs-app-1 vuejs-cookbook/dockerize-vuejs-app
```

On devrait avoir accès à notre app sur `localhost:8080`.

## Contexte additionnel

Si vous lisez ce tutoriel, il y a des chances que vous savez déjà pourquoi vous avez décidé de dockeriser votre app Vue.js. Mais si vous avez simplement atterri sur cette page après avoir cliqué sur le bouton `j'ai de la chance` de Google, laissez-moi partager quelques bonnes raisons de le faire.

La tendance actuelle est de créer des applications en utilisant l'approche [Cloud-Native](https://pivotal.io/cloud-native) qui tourne autour des mots suivant :
* Microservices
* DevOps (Développement opérationnel)
* Continuous Delivery

Regardons comment ces concepts affectent notre décision de dockeriser notre app Vue.js.

### Les effets des microservices

En adoptant le [style d'architectural des microservices](https://martinfowler.com/microservices/), on finit par construire une seule application comme une suite de petits services, chaque service est lancé de manière indépendante et communique avec des mécanismes légers. Ces services sont construits autour des besoins du métier et sont déployés indépendamment via des méthodes de déploiement automatisées.

Alors, utiliser cette approche architecturale implique dans la plupart des cas de développer et livrer notre front-end comme un service indépendant.

### Les effets du DevOps

L'adoption de la culture, des outils et des pratiques d’ingénierie agile [DevOps](https://martinfowler.com/bliki/DevOpsCulture.html) a, entre autres, le bon effet d'augmenter la collaboration entre les rôles de développement et des opérations. Un des principaux problèmes dans le passé (et encore aujourd'hui parfois) est que l'équipe de développement tend à être intéressée par les opérations et la maintenance du système une fois que ça a été donné à l'équipe d'intégration (DevOps), et cette dernière tend à ne pas être vraiment au courant du but du système, et donc est réticente à satisfaire les besoins opérationnels du système (aussi appelé « les caprices des développeurs »).

Livrer notre app Vue.js avec une image Docker aide à réduire, sinon supprimer totalement, les différences entre lancer le service sur l'ordinateur d'un développeur, un environnement de production ou n'importe quel autre environnement.

### Les effets du déploiement continu (Continuous Delivery)

En utilisant le [déploiement continu](https://martinfowler.com/bliki/ContinuousDelivery.html) on construit nos logiciels de manière à ce qu'ils puissent potentiellement être déployés en production n'importe quand. Ces pratiques d'ingénierie sont permises grâce à ce qui est normalement appelé le [pipeline de déploiement continu](https://martinfowler.com/bliki/DeploymentPipeline.html). Le but d'un pipeline de déploiement continu est de fragmenter notre build en plusieurs étapes (par exemple : la compilation, les tests unitaires, les tests d’intégration, les tests de performance, etc.) et laisser chaque étape vérifier notre artéfact de build quand notre logiciel change. Chaque étape augmente notre confiance dans la stabilité du build de notre artéfact, et donc, réduit le risque de casser quelque chose en production (ou n'importe quel autre environnement).

Alors, créer une image Docker pour notre app Vue.js est une bonne chose car ça représente notre artéfact de build final, le même artéfact qui va être utilisé localement pour le développement et qui peut être utilisé pour le déploiement en production avec confiance.

## Modèles alternatifs

Si votre entreprise n'est pas encore intéressée par Docker et Kubernetes ou que vous voulez simplement déployer votre MVP, peut être que dockeriser votre app Vue.js n'est pas ce qu'il vous faut.

Il existe d'autres alternatives comme :
* utiliser une plateforme tout-en-un comme [Netlify](https://www.netlify.com/);
* héberger votre SPA sur [Amazon S3](https://aws.amazon.com/s3/) et la servir avec [Amazon CloudFront](https://aws.amazon.com/cloudfront/) (voir [ici](https://serverless-stack.com/chapters/deploy-the-frontend.html) pour un guide détaillé).
