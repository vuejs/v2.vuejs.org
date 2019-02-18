---
title: Utiliser Axios pour consommer des API
type: cookbook
order: 9
---

## Exemple simple
Lors de la création d'une application Web, il est fréquent que vous souhaitiez utiliser et afficher les données provenant d'une API. Il existe plusieurs manières de le faire, mais une approche très populaire consiste à utiliser [axios](https://github.com/axios/axios), un client HTTP basé sur les Promesses.</p>

Dans cet exemple, nous allons utiliser l'[API CoinDesk](https://www.coindesk.com/api/) pour afficher les prix du Bitcoin qui sont mis à jour toutes les minutes. Premièrement, nous devons installer axios avec npm/yarn ou à partir d'un lien CDN.

Il existe plusieurs manières d'interroger une API, mais il est préférable de d'abord connaitre la structure des données qu'elle renvoie afin de savoir ce qu'elle va afficher. Pour ce faire, nous allons appeler le point de terminaison de l'API et afficher le résultat afin que nous puissions connaître sa structure et son contenu. Nous pouvons voir dans la documentation de l'API de CoinDesk que l'appel doit être effectué à l'adresse `https://api.coindesk.com/v1/bpi/currentprice.json`. Nous allons donc commencer par créer une donnée qui gardera nos informations, puis nous récupérerons les données et les attribuerons à l'aide de l'étape `mounted` du cycle de vie :

```js
new Vue({
  el: '#app',
  data () {
    return {
      info: null
    }
  },
  mounted () {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => (this.info = response))
  }
})
```

```html
<div id="app">
  {{ info }}
</div>
```

Nous obtenons ceci :

<p data-height="350" data-theme-id="32763" data-slug-hash="80043dfdb7b90f138f5585ade1a5286f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Premiere étape Axios et Vue" class="codepen">Voir l'exemple <a href="https://codepen.io/team/Vue/pen/80043dfdb7b90f138f5585ade1a5286f/">Premiere étape Axios et Vue</a> par Vue (<a href="https://codepen.io/Vue">@Vue</a>) sur <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Parfait ! Nous avons des données. Mais cela semble assez désordonné pour le moment, alors affichons-les correctement et ajoutons un traitement d'erreur si les choses ne fonctionnent pas comme prévu, ou s'il faut plus de temps que nécessaire pour obtenir les informations.

## Exemple concret : l'utilisation des données

### Affichage des données d'une API

Il est assez courant que les informations dont nous avons besoin se trouvent dans la réponse. Nous devons parcourir ce que nous venons de stocker pour y accéder correctement. Dans notre cas, nous pouvons voir que les informations de prix dont nous avons besoin sont stockées dans `response.data.bpi`. Si nous l'utilisons, notre sortie sera :

```js
axios
  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(response => (this.info = response.data.bpi))
```

<p data-height="200" data-theme-id="32763" data-slug-hash="6100b10f1b4ac2961208643560ba7d11" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Deuxième étape Axios et Vue" class="codepen">Voir l'exemple <a href="https://codepen.io/team/Vue/pen/6100b10f1b4ac2961208643560ba7d11/">Premiere étape Axios et Vue</a> par Vue (<a href="https://codepen.io/Vue">@Vue</a>) sur <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

C'est beaucoup plus facile à afficher ; nous pouvons donc mettre à jour notre code HTML pour n'afficher que les informations dont nous avons besoin à partir des données reçues. Pour ce faire, nous allons créer un [filtre](../api/#Vue-filter) pour nous assurer que la décimale se trouve également à la place appropriée.

```html
<div id="app">
  <h1>Bitcoin Price Index</h1>
  <div
    v-for="currency in info"
    class="currency"
  >
    {{ currency.description }}:
    <span class="lighten">
      <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
    </span>
  </div>
</div>
```

```js
filters: {
  currencydecimal (value) {
    return value.toFixed(2)
  }
},
```

<p data-height="300" data-theme-id="32763" data-slug-hash="9d59319c09eaccfaf35d9e9f11990f0f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Troisieme étape Axios et Vue" class="codepen">Voir l'exemple <a href="https://codepen.io/team/Vue/pen/9d59319c09eaccfaf35d9e9f11990f0f/">Troisieme étape Axios et Vue</a> par Vue (<a href="https://codepen.io/Vue">@Vue</a>) sur <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### Travailler avec des erreurs

Parfois, nous ne pouvons pas recevoir de données de l'API. Il peut y avoir de nombreuses raisons pour qu'un appel puisse échouer. Par exemple :  

* L'API est hors-service.
* La requête a mal été réalisée.
* L'API ne nous donne pas les informations dans le format attendu.

Quand nous créons cette requête, nous devrions vérifier si de tels cas se produisent et nous informer pour traiter ce problème. Dans un appel axios, nous pouvons le faire en utilisant `catch`.

```js
axios
  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(response => (this.info = response.data.bpi))
  .catch(error => console.log(error))
```

Cela nous permettra de savoir si quelque chose a échoué lors de la requête à l'API, mais que se passerait-il si les données sont endommagées ou si l'API est en panne ? Pour l'instant, l'utilisateur ne verra rien. Nous devrions peut-être créer un loader pour ce cas, puis informer l'utilisateur si nous ne pouvons pas obtenir les données.

```js
new Vue({
  el: '#app',
  data () {
    return {
      info: null,
      loading: true,
      errored: false
    }
  },
  filters: {
    currencydecimal (value) {
      return value.toFixed(2)
    }
  },
  mounted () {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => {
        this.info = response.data.bpi
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.loading = false)
  }
})
```

```html
<div id="app">
  <h1>Bitcoin Price Index</h1>

  <section v-if="errored">
    <p>Nous sommes désolés, nous ne sommes pas en mesure de récupérer ces informations pour le moment. Veuillez réessayer ultérieurement.</p>
  </section>

  <section v-else>
    <div v-if="loading">Chargement...</div>

    <div
      v-else
      v-for="currency in info"
      class="currency"
    >
      {{ currency.description }}:
      <span class="lighten">
        <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
      </span>
    </div>

  </section>
</div>
```

Vous pouvez appuyer sur le bouton de réexécution de cet exemple pour connaitre brièvement l'état du chargement pendant la collecte des données à partir de l'API :

<p data-height="300" data-theme-id="32763" data-slug-hash="6c01922c9af3883890fd7393e8147ec4" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Quatrième étape Axios et Vue" class="codepen">Voir l'exemple <a href="https://codepen.io/team/Vue/pen/6c01922c9af3883890fd7393e8147ec4/">Quatrième étape Axios et Vue</a> par Vue (<a href="https://codepen.io/Vue">@Vue</a>) sur <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Cela peut encore être amélioré avec l'utilisation de composants pour différentes sections et un rapport d'erreurs plus distinct, en fonction de l'API utilisée et de la complexité de votre application.

## Modèles alternatifs

### Fetch API

L'[API Fetch](https://developers.google.com/web/updates/2015/03/introduction-to-fetch) est une API native puissante pour ces types de demandes. Vous avez peut-être entendu dire que l'un des avantages de l'API Fetch est qu'il n'est pas nécessaire de charger une ressource externe pour l'utiliser, ce qui est vrai ! Sauf que… ce n'est pas encore complètement supporté, vous aurez donc toujours besoin d'utiliser un polyfill. Il y a aussi quelques pièges à éviter avec cette API, raison pour laquelle beaucoup préfèrent utiliser axios pour le moment. Cela pourrait cependant très bien changer dans le futur.

Si vous êtes intéressé par l’utilisation de l’API Fetch vous trouverez de [très bons articles](https://scotch.io/@bedakb/lets-build-type-ahead-component-with-vuejs-2-and-fetch-api) expliquant comment faire.

## Aller plus loin

Il existe de nombreuses façons de travailler avec Vue et axios au-delà de la consommation et de l'affichage d'une API. Vous pouvez également communiquer avec des Fonctions Sans Serveur, publier / éditer / supprimer à partir d'une API où vous disposez d'un accès en écriture, et de nombreux autres avantages. En raison de l’intégration directe de ces deux bibliothèques, c'est devenu un choix très courant pour les développeurs qui doivent intégrer des clients HTTP à leur workflow.
