---
title: Composants dynamiques et asynchrones
type: guide
order: 105
---

> Cette page suppose que vous avez déjà lu les principes de base des [composants](components.html). Lisez-les en premier si les composants sont quelque chose de nouveau pour vous.

## `keep-alive` avec les composants dynamiques

Précédemment, nous avons utilisé l'attribut `is` pour basculer entre des composants dans une interface avec des onglets :

```html
<component v-bind:is="composantOngletActuel"></component>
```

Toutefois, lors de la bascule d'un composant à l'autre, vous voudrez parfois maintenir leur état ou éviter de refaire leur rendu pour des raisons de performance. Par exemple, en détaillant un peu plus notre interface avec onglets :

{% raw %}
<div id="dynamic-component-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    v-bind:class="['dynamic-component-demo-tab-button', { 'dynamic-component-demo-active': currentTab === tab }]"
    v-on:click="currentTab = tab"
  >{{ tab }}</button>
  <component
    v-bind:is="composantOngletActuel"
    class="dynamic-component-demo-tab"
  ></component>
</div>
<script>
Vue.component('tab-posts', {
  data: function () {
    return {
      posts: [
        {
          id: 1,
          title: 'Cat Ipsum',
          content: '<p>Dont wait for the storm to pass, dance in the rain kick up litter decide to want nothing to do with my owner today demand to be let outside at once, and expect owner to wait for me as i think about it cat cat moo moo lick ears lick paws so make meme, make cute face but lick the other cats. Kitty poochy chase imaginary bugs, but stand in front of the computer screen. Sweet beast cat dog hate mouse eat string barf pillow no baths hate everything stare at guinea pigs. My left donut is missing, as is my right loved it, hated it, loved it, hated it scoot butt on the rug cat not kitten around</p>'
        },
        {
          id: 2,
          title: 'Hipster Ipsum',
          content: '<p>Bushwick blue bottle scenester helvetica ugh, meh four loko. Put a bird on it lumbersexual franzen shabby chic, street art knausgaard trust fund shaman scenester live-edge mixtape taxidermy viral yuccie succulents. Keytar poke bicycle rights, crucifix street art neutra air plant PBR&B hoodie plaid venmo. Tilde swag art party fanny pack vinyl letterpress venmo jean shorts offal mumblecore. Vice blog gentrify mlkshk tattooed occupy snackwave, hoodie craft beer next level migas 8-bit chartreuse. Trust fund food truck drinking vinegar gochujang.</p>'
        },
        {
          id: 3,
          title: 'Cupcake Ipsum',
          content: '<p>Icing dessert soufflé lollipop chocolate bar sweet tart cake chupa chups. Soufflé marzipan jelly beans croissant toffee marzipan cupcake icing fruitcake. Muffin cake pudding soufflé wafer jelly bear claw sesame snaps marshmallow. Marzipan soufflé croissant lemon drops gingerbread sugar plum lemon drops apple pie gummies. Sweet roll donut oat cake toffee cake. Liquorice candy macaroon toffee cookie marzipan.</p>'
        }
      ],
      selectedPost: null
    }
  },
  template: '\
    <div class="dynamic-component-demo-posts-tab">\
      <ul class="dynamic-component-demo-posts-sidebar">\
        <li\
          v-for="post in posts"\
          v-bind:key="post.id"\
          v-bind:class="{ \'dynamic-component-demo-active\': post === selectedPost }"\
          v-on:click="selectedPost = post"\
        >\
          {{ post.title }}\
        </li>\
      </ul>\
      <div class="dynamic-component-demo-post-container">\
        <div \
          v-if="selectedPost"\
          class="dynamic-component-demo-post"\
        >\
          <h3>{{ selectedPost.title }}</h3>\
          <div v-html="selectedPost.content"></div>\
        </div>\
        <strong v-else>\
          Cliquez sur un titre du blog à gauche pour le consulter.\
        </strong>\
      </div>\
    </div>\
  '
})
Vue.component('tab-archive', {
  template: '<div>Composant archive</div>'
})
new Vue({
  el: '#dynamic-component-demo',
  data: {
    currentTab: 'Posts',
    tabs: ['Posts', 'Archive']
  },
  computed: {
    composantOngletActuel: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
})
</script>
<style>
.dynamic-component-demo-tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.dynamic-component-demo-tab-button:hover {
  background: #e0e0e0;
}
.dynamic-component-demo-tab-button.dynamic-component-demo-active {
  background: #e0e0e0;
}
.dynamic-component-demo-tab {
  border: 1px solid #ccc;
  padding: 10px;
}
.dynamic-component-demo-posts-tab {
  display: flex;
}
.dynamic-component-demo-posts-sidebar {
  max-width: 40vw;
  margin: 0 !important;
  padding: 0 10px 0 0 !important;
  list-style-type: none;
  border-right: 1px solid #ccc;
}
.dynamic-component-demo-posts-sidebar li {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}
.dynamic-component-demo-posts-sidebar li:hover {
  background: #eee;
}
.dynamic-component-demo-posts-sidebar li.dynamic-component-demo-active {
  background: lightblue;
}
.dynamic-component-demo-post-container {
  padding-left: 10px;
}
.dynamic-component-demo-post > :first-child {
  margin-top: 0 !important;
  padding-top: 0 !important;
}
</style>
{% endraw %}

Vous remarquerez que si vous sélectionnez un post, puis basculez sur l'onglet _Archive_, puis rebasculer à nouveau sur _Posts_, il n'affiche plus le post que vous avez initialement sélectionné. En effet, chaque fois que vous basculez vers un nouvel onglet, Vue crée une nouvelle instance du `composantOngletActuel`.

Recréer des composants dynamiques est d'habitude un comportement utile, mais dans ce cas précis, nous aimerions bien que ces instances de composants onglets soient mises en cache après qu'elles aient été créées pour la première fois. Pour résoudre ce problème, nous pouvons envelopper notre composant dynamique dans un élément `<keep-alive>` :

``` html
<!-- Les composants inactifs seront mis en cache ! -->
<keep-alive>
  <component v-bind:is="composantOngletActuel"></component>
</keep-alive>
```

Observez le résultat ci-dessous :

{% raw %}
<div id="dynamic-component-keep-alive-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    v-bind:class="['dynamic-component-demo-tab-button', { 'dynamic-component-demo-active': currentTab === tab }]"
    v-on:click="currentTab = tab"
  >{{ tab }}</button>
  <keep-alive>
    <component
      v-bind:is="composantOngletActuel"
      class="dynamic-component-demo-tab"
    ></component>
  </keep-alive>
</div>
<script>
new Vue({
  el: '#dynamic-component-keep-alive-demo',
  data: {
    currentTab: 'Posts',
    tabs: ['Posts', 'Archive']
  },
  computed: {
    composantOngletActuel: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
})
</script>
{% endraw %}

Désormais, l'onglet _Posts_ conserve son état (le post sélectionné) même lorsqu'il n'est pas dessiné. Consultez [ce fiddle](https://jsfiddle.net/chrisvfritz/Lp20op9o/) pour le code complet.

<p class="tip">Notez que `<keep-alive>` requiert que tous les sous-composants aient un nom, soit via l'option `name` des composants, soit via une inscription locale/globale de ces composants.</p>

Pour plus de détails sur `<keep-alive>`, consultez la [référence API](../api/#keep-alive).

## Composants asynchrones

Dans de grosses applications, nous pouvons avoir besoin de diviser l'application en morceaux plus petits et charger un composant depuis le serveur seulement lorsque celui-ci est requis. Pour rendre cela plus facile, Vue vous permet de définir un composant en tant que fonction usine qui va résoudre de façon asynchrone la définition de votre composant. Vue déclenchera la fonction usine seulement lorsque le rendu du composant est nécessaire, et mettra en cache le résultat pour les futurs nouveaux rendus. Par exemple :

``` js
Vue.component('exemple-async', function (resolve, reject) {
  setTimeout(function () {
    // Passe la définition du composant à la fonction de rappel `resolve`
    resolve({
      template: '<div>Je suis asynchrone !</div>'
    })
  }, 1000)
})
```

Comme vous pouvez le voir, la fonction usine reçoit en paramètre `resolve`, une fonction de rappel (*callback*) qui sera appelée lorsque vous aurez récupéré la définition du composant depuis le serveur. Vous pouvez également appeler `reject(raison)` pour indiquer que le chargement a échoué pour une certaine raison. Le `setTimeout` est là en guise de démonstration ; à vous de décider comment vous souhaitez récupérer le composant. Une approche recommandée est d'utiliser les composants asynchrones conjointement avec la [fonctionnalité de découpage de code de webpack](https://webpack.js.org/guides/code-splitting/):

``` js
Vue.component('exemple-webpack-async', function (resolve) {
  // Cette syntaxe spéciale `require` indique à webpack de
  // diviser automatiquement votre code en sortie en paquets
  // qui seront chargés via des requêtes AJAX.
  require(['./mon-composant-async'], resolve)
})
```

Vous pouvez également retourner une `Promise` dans la fonction usine, ainsi avec webpack 2 et la syntaxe ES2015 vous pourrez écrire :

``` js
Vue.component(
  'exemple-webpack-async',
  // La fonction `import` retourne une `Promise`.
  () => import('./mon-composant-async')
)
```

Quand vous utilisez [l'inscription locale](components.html#Local-Registration) de composant, vous pouvez aussi fournir directement une fonction qui retourne une `Promise` :

``` js
new Vue({
  // ...
  components: {
    'mon-composant': () => import('./mon-composant-async')
  }
})
```

<p class="tip">Si vous êtes un utilisateur de <strong>Browserify</strong> et souhaitez utiliser les composants asynchrones, son créateur a malheureusement [été très clair](https://github.com/substack/node-browserify/issues/58#issuecomment-21978224) sur le fait que le chargement asynchrone n'est pas quelque-chose que Browserify supportera un jour. Officiellement du moins. La communauté Browserify a trouvé [quelques solutions de contournement](https://github.com/vuejs/vuejs.org/issues/620), qui peuvent s'avérer utiles pour les applications complexes existantes. Pour tous les autres scénarios, nous recommandons d'utiliser webpack pour un support natif et de première classe de l'asynchrone.</p>

### Gérer l'état de chargement

> Nouveauté de la 2.3.0+

La fabrique de composants asynchrones peut aussi retourner un objet avec le format suivant :

``` js
const AsyncComponent = () => ({
  // Le composant à charger (doit être une `Promise`)
  component: import('./MonComposant.vue'),
  // Un composant à utiliser pendant que le composant asynchrone se charge
  loading: LoadingComponent,
  // Un composant d'erreur à utiliser au cas où le chargement échoue
  error: ErrorComponent,
  // Le délai à patienter avant d'afficher le composant de chargement. Par défaut : 200ms.
  delay: 200,
  // Le composant d'erreur sera affiché si un délai de timeout est fourni et dépassé.
  // Par défaut: délai infini.
  timeout: 3000
})
```

> Notez que vous devez utiliser [Vue Router](https://github.com/vuejs/vue-router) en version 2.4.0+ si vous souhaitez utiliser la syntaxe ci-dessus pour des composants de routes.
