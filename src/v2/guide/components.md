---
title: Composants
type: guide
order: 11
---

## Exemple de base

Voici un exemple de composant Vue :

``` js
// Définition d'un nouveau composant appelé `button-counter`
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">Vous m\'avez cliquez {{ count }} fois.</button>'
})
```

Les composants sont des instances de Vue réutilisables avec un nom : dans notre cas `<button-counter>`. Nous pouvons utiliser ce composant en tant qu'élément personnalisé à l'intérieure d'une instance de Vue racine créée avec `new Vue` :

```html
<div id="components-demo">
  <button-counter></button-counter>
</div>
```

```js
new Vue({ el: '#components-demo' })
```

{% raw %}
<div id="components-demo" class="demo">
  <button-counter></button-counter>
</div>
<script>
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count += 1">Vous m\'avez cliquez {{ count }} fois.</button>'
})
new Vue({ el: '#components-demo' })
</script>
{% endraw %}

Puisque les composants sont des instances de Vue réutilisables, ils acceptent les mêmes options que `new Vue` comme `data`, `computed`, `watch`, `methods`, et les hooks du cycle de vie. Les seules exceptions sont quelques options spécifiques à la racine comme `el`.

## Réutilisation de composants

Les composants peuvent être réutilisés autant de fois que souhaité :

```html
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

{% raw %}
<div id="components-demo2" class="demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
<script>
new Vue({ el: '#components-demo2' })
</script>
{% endraw %}

Notez que lors du clique sur les boutons, chacun d'entre eux maintient son propre compteur séparé des autres. C'est parce que chaque fois que vous utilisez un composant, une nouvelle **instance** est créée.

### `data` doit être une fonction

Quand vous définissez le composant `<button-counter>`, vous devez faire attention que `data` ne soit pas directement fourni en tant qu'objet, comme ceci :

```js
data: {
  count: 0
}
```

À la place, **la propriété du composant `data` doit être une fonction**, afin que chaque instance puisse conserver une copie indépendante de l'objet retourné :

```js
data: function () {
  return {
    count: 0
  }
}
```

Si Vue n'avait pas cette règle, cliquer sur un bouton affecterait les données de _toutes les autres instances_, comme ci-dessous :

{% raw %}
<div id="components-demo3" class="demo">
  <button-counter2></button-counter2>
  <button-counter2></button-counter2>
  <button-counter2></button-counter2>
</div>
<script>
var buttonCounter2Data = {
  count: 0
}
Vue.component('button-counter2', {
  data: function () {
    return buttonCounter2Data
  },
  template: '<button v-on:click="count++">Vous m\'avez cliquez {{ count }} fois.</button>'
})
new Vue({ el: '#components-demo3' })
</script>
{% endraw %}

## Organisation des composants

Il est commun pour une application d'être organisée en un arbre de composants imbriqués :

![Arbre de composant](/images/components.png)

Par exemple, vous pouvez avoir des composants pour l'entête, la barre latérale, la zone de contenu ; chacun contenant lui aussi d'autres composants pour la navigation, les liens, les billets de blog, etc.

Pour utiliser ces composants dans des templates, ils doivent être enregistrés pour que Vue les connaissent. Il y a deux types d'enregistrement de composant : **global** et **local**. Jusqu'ici, nous avons uniquement enregistré des composants globalement en utilisant `Vue.component` :

```js
Vue.component('my-component-name', {
  // ... options ...
})
```

Les composants enregistrés globalement peuvent être utilisés dans le template de n'importe quelle instance racine de Vue (`new Vue`) créée après coup, ainsi que dans les sous-composants de l'arbre des composants de cette instance de Vue.

C'est tout ce que vous avez besoin de savoir à propos de l'enregistrement pour le moment, mais une fois que vous aurez fini de lire cette page et que vous vous sentirez à l'aise avec son contenu, nous vous recommandons de revenir pour lire le guide complet à propos de l'[Enregistrement de composant](components-registration.html).

## Passer des données aux composants enfants avec les props

Plus tôt, nous avons mentionné la création d'un composant pour des billets de blog. Le problème est que ce composant ne sera utile que si l'on peut lui passer des données, comme le titre ou le contenu pour un billet spécifique à afficher. C'est ici que les props interviennent.

Les props sont des attributs personnalisables que vous pouvez enregistrer dans un composant. Quand une valeur est passée à un attribut prop, elle devient une propriété de l'instance du composant. Pour passer un titre à notre billet de blog, nous devons l'inclure dans une liste de props que ce composant accepte, en utilisant l'option `props` :

```js
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
```

Un composant peut avoir autant de props que vous le souhaitez et par défaut, n'importe quelle valeur peut être passée à une prop. Dans le template ci-dessus, vous devriez voir cette valeur dans l'instance du composant, comme pour `data`.

Une fois une prop enregistrée, vous pouvez lui passer des données en tant qu'attribut personnalisé comme ceci :

```html
<blog-post title="Mon initiation avec Vue"></blog-post>
<blog-post title="Blogger avec Vue"></blog-post>
<blog-post title="Pourquoi Vue est tellement cool"></blog-post>
```

{% raw %}
<div id="blog-post-demo" class="demo">
  <blog-post1 title="Mon initiation avec Vue"></blog-post1>
  <blog-post1 title="Blogger avec Vue"></blog-post1>
  <blog-post1 title="Pourquoi Vue est tellement cool"></blog-post1>
</div>
<script>
Vue.component('blog-post1', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
new Vue({ el: '#blog-post-demo' })
</script>
{% endraw %}

Dans une application typique, cependant, vous préfèreriez avoir un tableau de billets dans `data` :

```js
new Vue({
  el: '#blog-post-demo',
  data: {
    posts: [
      { id: 1, title: 'Mon initiation avec Vue' },
      { id: 2, title: 'Blogger avec Vue' },
      { id: 3, title: 'Pourquoi Vue est tellement cool' },
    ]
  }
})
```

Maintenant, faisons le rendu d'un composant pour chacun :

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:title="post.title"
></blog-post>
```

Vous voyez au-dessus que nous pouvons utiliser `v-bind` pour dynamiquement passer des props. Cela est particulièrement utile quand vous ne connaissez pas exactement le contenu dont vous êtes en train de faire le rendu à l'avance, comme dans le cas de [récupération de billets depuis une API](https://jsfiddle.net/chrisvfritz/sbLgr0ad).

C'est tout ce que vous avez besoin de savoir à propos des props pour le moment, mais une fois que vous aurez fini de lire cette page et que vous vous sentirez à l'aise avec son contenu, nous vous recommandons de revenir pour lire le guide complet à propos des [props](components-props.html).

## Un élément racine unique

Quand nous réalisons un composant `<blog-post>`, votre template va éventuellement contenir plus que juste le titre :

```html
<h3>{{ title }}</h3>
```

Vous allez au moins vouloir inclure le contenu du billet :

```html
<h3>{{ title }}</h3>
<div v-html="content"></div>
```

Si vous essayez cela dans votre template cependant, Vue va afficher une erreur, expliquant que **tout composant doit avoir un unique élément racine**. Vous pouvez fixer cette erreur en imbriquant le template dans un élément parent comme :

```html
<div class="blog-post">
  <h3>{{ title }}</h3>
  <div v-html="content"></div>
</div>
```

À mesure que nos composants grandissent, il ne sera plus question uniquement d'un titre et d'un contenu pour le billet, mais également de la date de publication, des commentaires et bien plus. Définir une prop indépendamment pour chaque information pourrait devenir gênant :

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:title="post.title"
  v-bind:content="post.content"
  v-bind:publishedAt="post.publishedAt"
  v-bind:comments="post.comments"
></blog-post>
```

Le temps sera alors venu de refactoriser le composant `<blog-post>` pour accepter une propriété `post` unique à la place :

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:post="post"
></blog-post>
```

```js
Vue.component('blog-post', {
  props: ['post'],
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <div v-html="post.content"></div>
    </div>
  `
})
```

<p class="tip">L'exemple ci-dessus et plusieurs exemples par la suite utilisent une chaîne de caractères JavaScript appelée [modèles de libellés](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) (« template string ») permettant des templates multilignes plus lisibles. Ceux-ci ne sont pas supportés dans Internet Explorer (IE), aussi, si vous souhaitez supporter IE sans utiliser de transpilateur (p. ex. Babel ou TypeScript), [ajoutez un caractère d'échappement à chaque nouvelle ligne](https://css-tricks.com/snippets/javascript/multiline-string-variables-in-javascript) à la place.</p>

Maintenant, chaque fois qu'une nouvelle propriété sera ajoutée à l'objet `post`, elle sera automatiquement disponible dans `<blog-post>`.

## Envoyer des messages aux parents avec les évènements

Lors de notre développement du composant `<blog-post>`, plusieurs fonctionnalités vont demander de communiquer des informations au parent. Par exemple, nous pourrions décider d'inclure une fonctionnalité d'accessibilité pour élargir le texte du billet de blog, alors que le reste de la page resterait dans sa taille par défaut :

Dans le parent, nous pouvons supporter cette fonctionnalité en ajoutant une propriété de donnée `postFontSize` :

```js
new Vue({
  el: '#blog-posts-events-demo',
  data: {
    posts: [/* ... */],
    postFontSize: 1
  }
})
```

Qui pourrait être utilisé dans un template pour contrôler la taille de la police de tous les billets de blog :

```html
<div id="blog-posts-events-demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      v-bind:key="post.id"
      v-bind:post="post"
    ></blog-post>
  </div>
</div>
```

Maintenant, ajoutons un bouton pour élargir le texte juste avant le contenu de chaque billet :

```js
Vue.component('blog-post', {
  props: ['post'],
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <button>
        Enlarge text
      </button>
      <div v-html="post.content"></div>
    </div>
  `
})
```

Le problème est que le bouton ne fait rien du tout :

```html
<button>
  Élargir le texte
</button>
```

Quand nous cliquons sur le bouton, nous avons besoin de communiquer au parent qu'il devrait élargir le texte de tous les billets. Heureusement, l'instance de Vue fournit un système d'évènements personnalisables pour résoudre ce problème. Pour émettre un évènement au parent, nous devons appeler la [méthode préconçue **`$emit`**](../api/#Methodes-et-Evenements-d’Instance), en lui passant le nom de l'évènement :

```html
<button v-on:click="$emit('enlarge-text')">
  Élargir le texte
</button>
```

Quand nous somme sur notre billet de blog, nous pouvons écouter cet évènement avec `v-on`, exactement comme nous le ferrions avec un évènement natif du DOM :

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += 0.1"
></blog-post>
```

{% raw %}
<div id="blog-posts-events-demo" class="demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      v-bind:key="post.id"
      v-bind:post="post"
      v-on:enlarge-text="postFontSize += 0.1"
    ></blog-post>
  </div>
</div>
<script>
Vue.component('blog-post', {
  props: ['post'],
  template: '\
    <div class="blog-post">\
      <h3>{{ post.title }}</h3>\
      <button v-on:click="$emit(\'enlarge-text\')">\
        Élargir le texte\
      </button>\
      <div v-html="post.content"></div>\
    </div>\
  '
})
new Vue({
  el: '#blog-posts-events-demo',
  data: {
    posts: [
      { id: 1, title: 'Mon initiation avec Vue', content: '...content...' },
      { id: 2, title: 'Blogger avec Vue', content: '...content...' },
      { id: 3, title: 'Pourquoi Vue est tellement cool', content: '...content...' }
    ],
    postFontSize: 1
  }
})
</script>
{% endraw %}

### Émettre une valeur avec un évènement

Il est parfois utile d'émettre une valeur spécifique avec un évènement. Par exemple, nous pourrions vouloir que le composant `<blog-post>` soit en charge de comment élargir le texte. Dans ce cas, nous pouvons utiliser `$emit` en second paramètre pour fournir cette valeur :

```html
<button v-on:click="$emit('enlarge-text', 0.1)">
  Élargir le texte
</button>
```

Puis quand nous écoutons l'évènement dans le parent, nous pouvons accéder à la valeur de l'évènement émise avec `$event` :

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += $event"
></blog-post>
```

Ou, si le gestionnaire d'évènement est une méthode :

```html
<blog-post
  ...
  v-on:enlarge-text="onEnlargeText"
></blog-post>
```

Puis la valeur sera fournie en tant que premier argument de cette méthode :

```js
methods: {
  onEnlargeText: function (enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

### Utiliser `v-model` sur les composants

Les évènements personnalisés peuvent aussi être utilisés pour créer des champs qui fonctionnent avec `v-model`. Rappelez-vous cela :

```html
<input v-model="searchText">
```

réalise la même chose que :

```html
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```

Quand il est utilisé sur un composant, `v-model` fait plutôt cela :

``` html
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
```

Pour que cela puisse fonctionner, la balise `<input>` à l'intérieur du composant doit :

- Lier l'attribut `value` à la prop `value`
- Et sur l'`input`, émettre son propre évènement personnalisé `input` avec la nouvelle valeur

Voici un exemple en action :

```js
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})
```

Maintenant `v-model` fonctionnera parfaitement avec le composant :

```html
<custom-input v-model="searchText"></custom-input>
```

C'est tout ce que vous avez besoin de savoir à propos des évènements pour le moment, mais une fois que vous aurez fini de lire cette page et que vous vous sentirez à l'aise avec son contenu, nous vous recommandons de revenir pour lire le guide complet à propos des [évènements personnalisés](components-custom-events.html).

## Distribution de contenu avec les slots

Exactement comme les éléments HTML, il est souvent utile de passer du contenu à un composant comme ceci :

``` html
<alert-box>
  Quelque chose s'est mal passé.
</alert-box>
```

Qui pourrait faire le rendu de quelque chose comme :

{% raw %}
<div id="slots-demo" class="demo">
  <alert-box>
    Quelque chose s'est mal passé.
  </alert-box>
</div>
<script>
Vue.component('alert-box', {
  template: '\
    <div class="demo-alert-box">\
      <strong>Erreur !</strong>\
      <slot></slot>\
    </div>\
  '
})
new Vue({ el: '#slots-demo' })
</script>
<style>
.demo-alert-box {
  padding: 10px 20px;
  background: #f3beb8;
  border: 1px solid #f09898;
}
</style>
{% endraw %}

Heureusement, cette tâche est vraiment simple avec l'élément personnalisé `<slot>` de Vue :

```js
Vue.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Erreur !</strong>
      <slot></slot>
    </div>
  `
})
```

Comme vous pouvez le constater plus haut, nous avons seulement ajouté un slot là où nous souhaitions faire atterrir le contenu - et c'est tout. C'est fait !

C'est tout ce que vous avez besoin de savoir à propos des slots pour le moment, mais une fois que vous aurez fini de lire cette page et que vous vous sentirez à l'aise avec son contenu, nous vous recommandons de revenir plus tard pour lire le guide complet à propos des [slots](components-slots.html).

## Composants dynamiques

Parfois, il est utile de dynamiquement interchanger des composants, comme dans une interface à onglet :

{% raw %}
<div id="dynamic-component-demo" class="demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    class="dynamic-component-demo-tab-button"
    v-bind:class="{ 'dynamic-component-demo-tab-button-active': tab === currentTab }"
    v-on:click="currentTab = tab"
  >
    {{ tab }}
  </button>
  <component
    v-bind:is="currentTabComponent"
    class="dynamic-component-demo-tab"
  ></component>
</div>
<script>
Vue.component('tab-home', { template: '<div>Home component</div>' })
Vue.component('tab-posts', { template: '<div>Posts component</div>' })
Vue.component('tab-archive', { template: '<div>Archive component</div>' })
new Vue({
  el: '#dynamic-component-demo',
  data: {
    currentTab: 'Home',
    tabs: ['Home', 'Posts', 'Archive']
  },
  computed: {
    currentTabComponent: function () {
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
.dynamic-component-demo-tab-button-active {
  background: #e0e0e0;
}
.dynamic-component-demo-tab {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
{% endraw %}

Ce qu'il y a ci-dessus est rendu possible grâce à l'élément `<component>` de Vue avec l'attribut spécial `is` :

```html
<!-- Component changes when currentTabComponent changes -->
<component v-bind:is="currentTabComponent"></component>
```

Dans l'exemple ci-dessus, `currentTabComponent` peut contenir soit :

- le nom du composant enregistré, ou
- un objet d'option de composant

Regardez [ce fiddle](https://jsfiddle.net/chrisvfritz/o3nycadu/) pour expérimenter cela avec un code complet, ou [cette version](https://jsfiddle.net/chrisvfritz/b2qj69o1/) pour un exemple lié à un objet d'option de composant plutôt qu'à un nom enregistré.

C'est tout ce que vous avez besoin de savoir à propos des slot pour le moment, mais une fois que vous aurez fini de lire cette page et que vous vous sentirez à l'aise avec son contenu, nous vous recommandons de revenir pour lire le guide complet à propos des [Composants dynamiques et asynchrones](components-dynamic-async.html).

## Cas particuliers de l'analyse des templates de DOM

Plusieurs éléments HTML, comme `<ul>`, `<ol>`, `<table>` et `<select>` ont des restrictions en ce qui concerne les éléments à l'intérieur desquels ils apparaissent. D'autres éléments quant à eux, tel que `<li>`, `<tr>`, ou `<option>` peuvent uniquement être placés à l'intérieur de certains éléments parents uniquement.

Cela mène à des problèmes quand vous utilisez des composants avec des éléments qui ont ces restrictions. Par exemple :

``` html
<table>
  <blog-post-row></blog-post-row>
</table>
```

Le composant personnalisé `<blog-post-row>` sera considéré comme un contenu invalide, causant des erreurs dans les rendus éventuels en sortie. Heureusement, l'attribut spécial `is` offre un moyen de contournement :

``` html
<table>
  <tr is="blog-post-row"></tr>
</table>
```

Il doit être noté que **cette limitation _n'_affecte _pas_ les templates sous forme de chaine de caractères provenant d'une des sources suivantes** :

- Un template de chaine de caractères (par ex. `template: '...'`),
- [Les composants monofichier (`.vue`)](single-file-components.html)
- [`<script type="text/x-template">`](components-edge-cases.html#X-Templates)

C'est tout ce que vous avez besoin de savoir à propos des cas particuliers pour le moment. Vous voilà arrivé à la fin de l'_Essentiel_ de Vue. Félicitation ! Il reste encore beaucoup à apprendre, mais d'abord, nous vous recommandons de faire une pause pour jouer avec Vue par vous même et construire quelque chose d'amusant.

Une fois que vous vous sentirez à l'aise avec les connaissances que vous venez fraichement d’acquérir, nous vous recommandons de revenir pour lire le guide complet à propos des [Composants dynamiques et asynchrones](components-dynamic-async.html) ainsi que les autres pages dans la partie Au cœur des composants de la barre de navigation latérale.
