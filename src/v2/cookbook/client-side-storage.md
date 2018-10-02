---
title: Stockage côté client
type: cookbook
order: 11
---

## Exemple de base

Le stockage côté client est un excellent moyen de rapidement ajouter un gain de performance à une application. En stockant les données sur le navigateur, on peut récupérer ces données sans passer par le serveur chaque fois que l'utilisateur en a besoin. Bien que très utile hors-ligne, même en ligne les utilisateurs peuvent bénéficier d'une utilisation locale plutôt que d'utiliser un serveur distant. Le stockage côté client peut être fait avec les [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), le [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) (techniquement "Web Storage"), une [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), et [WebSQL](https://www.w3.org/TR/webdatabase/) (une méthode périmée qui ne devrait plus être utilisée dans de nouveaux projets).

Dans ce tutoriel on se concentrera sur le Local Storage, le moyen de stockage le plus simple. Le Local Storage utilise un système de clé/valeur pour stocker les données. Il est limité au stockage de simples valeurs mais des données plus complexes peuvent être stockées si on est prêt à encoder et décoder les valeurs en JSON. En général, le Local Storage est approprié pour des petits groupes de données qu'on voudrait garder en mémoire, comme des préférences ou les informations d'un formulaire. De plus grosses données avec une structure plus complexe feraient mieux d'être stockées sur une IndexedDB.

Commençons par un simple exemple basé sur un formulaire :

``` html
<div id="app">
  Mon nom est <input v-model="name">
</div>
```

Cet exemple a un champ lié à une valeur Vue appelée `name`. Voici le JavaScript :

``` js
const app = new Vue({
  el: '#app',
  data: {
    name: ''
  },
  mounted() {
    if (localStorage.name) {
      this.name = localStorage.name;
    }
  },
  watch: {
    name(newName) {
      localStorage.name = newName;
    }
  }
});
```

Concentrons-nous sur les parties `mounted` et `watch`. On utilise `mounted` pour récupérer la valeur depuis le localStorage. Pour garder les données en mémoire, on observe la valeur `name` et à chaque changement, on l'écrit dans le localStorage.

Vous pouvez le tester vous-même ici :

<p data-height="265" data-theme-id="0" data-slug-hash="KodaKb" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="testing localstorage" class="codepen">Voir le Pen <a href="https://codepen.io/cfjedimaster/pen/KodaKb/">test du localstorage</a> par Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) sur <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Écrivez quelque chose dans le formulaire et rechargez la page. Vous remarquerez que la valeur que vous aviez écrite s'affichera automatiquement. N'oubliez pas que votre navigateur a d'excellents outils de développement pour inspecter le stockage côté client. Voici un exemple sur Firefox :

![Stockage devtools sur Firefox](/images/devtools-storage.png)

Ici sur Chrome :

![Stockage devtools sur Chrome](/images/devtools-storage-chrome.png)

Finalement, un exemple sur Microsoft Edge. Notez que vous pouvez trouver les valeurs stockées sous l'onglet Debugger.

![Stockage devtools sur Edge](/images/devtools-storage-edge.png)

<p class="tip">Ces outils de développement permettent aussi de supprimer les données stockées. Ça peut être très utile pour faire des tests.</p>

Stocker immédiatement une valeur peut ne pas être recommandé. Considérons un exemple un peu plus avancé. Premièrement, le formulaire mis à jour.

``` html
<div id="app">
  <p>
    Mon nom est <input v-model="name">
    et j'ai <input v-model="age"> ans.
  </p>
  <p>
    <button @click="persist">Sauver</button>
  </p>
</div>
```

Maintenant on a deux champs (encore, liés à une instance de Vue) mais maintenant il y a un bouton en plus qui lance une fonction `persist`. Regardons le JavaScript.

``` js
const app = new Vue({
  el: '#app',
  data: {
    name: '',
    age: 0
  },
  mounted() {
    if (localStorage.name) {
      this.name = localStorage.name;
    }
    if (localStorage.age) {
      this.age = localStorage.age;
    }
  },
  methods: {
    persist() {
      localStorage.name = this.name;
      localStorage.age = this.age;
      console.log('now pretend I did more stuff...');
    }
  }
})
```

Comme avant, `mounted` est utilisé pour charger les données, si elles existent. Cette fois, les données sont sauvées seulement si le bouton est cliqué. On pourrait aussi faire des validations ou transformations ici avant de stocker les données. On pourrait aussi stocker une date représentant le moment ou les données ont été sauvées. Avec ces métadonnées, la fonction `mounted` pourrait vérifier si il faut encore stocker les valeurs. Vous pouvez essayer cette version ci-dessous.

<p data-height="265" data-theme-id="0" data-slug-hash="rdOjLN" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="testing localstorage 2" class="codepen">Voir le Pen <a href="https://codepen.io/cfjedimaster/pen/rdOjLN/">test du localstorage 2</a> par Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) sur <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Travailler avec des valeurs complexes

Comme mentionné plus haut, le Local Storage marche seulement avec de simples valeurs. Pour stocker des valeurs plus complexes, comme un objet ou une liste, on doit sérialiser et désérialiser les valeurs avec JSON. Voici un exemple plus avancé qui sauvegarde une liste de chats (le meilleur type de liste possible).

``` html
<div id="app">
  <h2>Chats</h2>
  <div v-for="(cat, n) in cats">
    <p>
      <span class="cat">{{ cat }}</span>
      <button @click="removeCat(n)">Enlever</button>
    </p>
  </div>

  <p>
    <input v-model="newCat">
    <button @click="addCat">Ajouter un chat</button>
  </p>
</div>
```

Cette "app" contient une simple liste (avec un bouton pour enlever un chat) et un petit formulaire pour ajouter un nouveau chat. Maintenant regardons le JavaScript.

``` js
const app = new Vue({
  el: '#app',
  data: {
    cats: [],
    newCat: null
  },
  mounted() {
    if (localStorage.getItem('cats')) {
      try {
        this.cats = JSON.parse(localStorage.getItem('cats'));
      } catch(e) {
        localStorage.removeItem('cats');
      }
    }
  },
  methods: {
    addCat() {
      // s'assurer que l'utilisateur a entré quelque chose
      if (!this.newCat) {
        return;
      }

      this.cats.push(this.newCat);
      this.newCat = '';
      this.saveCats();
    },
    removeCat(x) {
      this.cats.splice(x, 1);
      this.saveCats();
    },
    saveCats() {
      const parsed = JSON.stringify(this.cats);
      localStorage.setItem('cats', parsed);
    }
  }
})
```

Dans cette application, on a utilisé l'API Local Storage à la place d'un accès "direct". Les deux marchent mais utiliser l'API est généralement la méthode préférée. `mounted` doit récupérer et parser la valeur en JSON. S'il y a un problème, on peut assumer que les données sont corrompues et les supprimer. (N'oubliez pas, quand votre application utilise le stockage côté client, l'utilisateur y a accès et peut les modifier à volonté.)

Nous avons trois méthodes pour s'occuper de nos chats. `addCat` et `removeCat` s'occupent de mettre à jour les données de Vue stockées dans `this.cats`. Ensuite elles appellent `saveCats` qui s'occupe de sérialiser et sauver les données. Vous pouvez vous amuser avec la version ci-dessous :

<p data-height="265" data-theme-id="0" data-slug-hash="qoYbyW" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="localstorage, complex" class="codepen">Voir le Pen <a href="https://codepen.io/cfjedimaster/pen/qoYbyW/">localstorage, complexe</a> par Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) sur <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Modèles alternatifs

Bien que l'API Local Storage est relativement simple, il manque quelques fonctions basiques qui seraient utiles dans beaucoup d'applications. Les plugins suivants utilisent le Local Storage et facilitent son utilisation, tout en ajoutant quelques fonctionnalités comme les valeurs par défaut.

* [vue-local-storage](https://github.com/pinguinjkeke/vue-local-storage)
* [vue-reactive-storage](https://github.com/ropbla9/vue-reactive-storage)
* [vue2-storage](https://github.com/yarkovaleksei/vue2-storage)

## Conclusion

Bien que le navigateur ne remplacera jamais un système de stockage de données sur serveur, avoir plusieurs possibilités de sauver ces données localement peut être un énorme boost de performance pour votre application. Travailler avec dans Vue.js le rend encore plus puissant.
