---
title: Création de composants
type: guide
order: 101
---

> Cette page suppose que vous avez déjà lu les principes de base des [composants](components.html). Lisez-les en premier si les composants sont quelque chose de nouveau pour vous.

## Noms de composant

Lors de la création de composants, il faudra toujours spécifier un nom. Par exemple, la déclaration se fera comme suit :

```js
Vue.component('my-component-name', { /* ... */ })
```

Le nom du composant est le premier argument de `Vue.component`.

Le nom que vous donnez à un composant peut dépendre de l'endroit où vous avez l'intention de l'utiliser. Lorsque vous utilisez un composant directement dans le DOM (par opposition à une chaine ou un [composant monofichiers](single-file-components.html)), nous vous recommandons fortement de suivre [les règles du W3C](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) pour les noms de balises personnalisées (tout en minuscules, contenir un trait d'union). Cela vous permet d'éviter les conflits avec les éléments HTML actuels et futurs.

Vous pouvez voir d'autres recommandations pour les noms de composants dans le guide des [Conventions](../style-guide/#Base-component-names-strongly-recommended).

### Casse des noms

Vous avez deux options pour définir vos noms de composant :

#### En kebab-case

```js
Vue.component('my-component-name', { /* ... */ })
```

Lors de la définition d'un composant en kebab-case, vous devez également utiliser kebab-case lors du référencement de l'élément, comme ceci `<my-component-name>`.

#### En PascalCase

```js
Vue.component('MyComponentName', { /* ... */ })
```

Lors de la définition d'un composant en PascalCase, vous pouvez utiliser l'un ou l'autre cas lors du référencement de l'élément. Cela signifie que `<my-component-name>` et `<MyComponentName>` sont acceptables. À noter, cependant, que seuls les noms en kebab-case sont directement valides dans le DOM (c.-à-d. la forme non-chaine).

## Création globale

Jusque là, nous avons créé des composants seulement avec la manière suivante `Vue.component` : 

```js
Vue.component('my-component-name', {
  // ... options ...
})
```

Ces composants sont **enregistrés globalement**. Cela signifie qu'ils peuvent être utilisés dans le template de n'importe quelle instance Vue (`new Vue`) créée ultérieurement. Par exemple : 

```js
Vue.component('component-a', { /* ... */ })
Vue.component('component-b', { /* ... */ })
Vue.component('component-c', { /* ... */ })

new Vue({ el: '#app' })
```

```html
<div id="app">
  <component-a></component-a>
  <component-b></component-b>
  <component-c></component-c>
</div>
```

Cela s'applique même à tous les sous-composants, ce qui signifie que ces trois composants seront également disponibles _les uns des autres_.

## Création locale

La création globale n'est souvent pas idéale. Par exemple, si vous utilisez un système de build comme webpack, la création globale de composants signifie que même si vous arrêtez d'utiliser un composant, il peut toujours être inclus dans votre build final. Cela augmente inutilement la quantité de JavaScript que vos utilisateurs doivent télécharger.

Dans ce cas, vous pouvez définir vos composants en tant qu'objets JavaScript simples :

```js
var ComponentA = { /* ... */ }
var ComponentB = { /* ... */ }
var ComponentC = { /* ... */ }
```

Puis définissez les composants que vous souhaitez utiliser dans l'option `components` : 

```js
new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})
```

Pour chaque propriété de l'objet `components`, la clé sera le nom de l'élément personnalisé, tandis que la valeur contiendra l'objet d'options du composant.

Notez que **les composants créés localement ne sont _pas_ disponibles dans les sous-composants**. Par exemple, si vous voulez que `ComponentA` soit disponible dans `ComponentB`, vous devez utiliser :

```js
var ComponentA = { /* ... */ }

var ComponentB = {
  components: {
    'component-a': ComponentA
  },
  // ...
}
```

Ou si vous utilisez des modules ES2015, tels que Babel et webpack, cela pourrait plus ressembler à :

```js
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  },
  // ...
}
```

Notez que dans ES2015+, placer un nom de variable comme `ComponentA` dans un objet est un raccourci à `ComponentA: ComponentA`, signifiant que le nom de la variable est à la fois :

- le nom de l'élément personnalisé à utiliser dans le template et
- le nom de la variable contenant les options du composant

## Systèmes de module

Si vous n'utilisez pas un système de module avec `import`/`require`, vous pouvez probablement ignorer cette section pour l'instant. Si oui, nous avons quelques instructions spéciales et conseils pour vous.

### Création locale dans un système de module

Si vous êtes toujours là, il est probable que vous utilisiez un système de modules, comme avec Babel et webpack. Dans ces cas, nous recommandons de créer un répertoire `components`, avec chaque composant dans son propre fichier.

Ensuite, vous devrez importer chaque composant que vous souhaitez utiliser avant de l'enregistrer localement. Par exemple, dans un fichier hypothétique `ComponentB.js` ou `ComponentB.vue` :

```js
import ComponentA from './ComponentA'
import ComponentC from './ComponentC'

export default {
  components: {
    ComponentA,
    ComponentC
  },
  // ...
}
```

Maintenant, et `ComponentA` et `ComponentC` peuvent être utilisés dans le template du composant `ComponentB`.

### Enregistrement global automatique des composants de base

La plupart de vos composants seront relativement génériques, ce qui ne fera qu'englober un élément comme un champ ou un bouton. Nous nous référons parfois à ces [composants de base](../style-guide/#Base-de-nom-de-composant-fortement-recommande) et ils ont tendance à être utilisés très fréquemment à travers vos composants.

Le résultat est que de nombreux composants peuvent inclure de longues listes de composants de base :

```js
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'
import BaseInput from './BaseInput.vue'

export default {
  components: {
    BaseButton,
    BaseIcon,
    BaseInput
  }
}
```

Juste pour supporter relativement peu de balise dans un template :

```html
<BaseInput
  v-model="searchText"
  @keydown.enter="search"
/>
<BaseButton @click="search">
  <BaseIcon name="search"/>
</BaseButton>
```

Heureusement, si vous utilisez webpack (ou [Vue CLI 3+](https://github.com/vuejs/vue-cli), qui utilise webpack en interne), vous pouvez utiliser `require.context` pour enregistrer globalement précisément ces composants de base très courants. Voici un exemple de code que vous pouvez utiliser pour importer globalement des composants de base dans le fichier d'entrée de votre application. (ex. `src/main.js`) :

```js
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  // Le chemin relatif du dossier composants
  './components',
  // Suivre ou non les sous-dossiers
  false,
  // L'expression régulière utilisée pour faire concorder les noms de fichiers de composant de base
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // Récupérer la configuration du composant
  const componentConfig = requireComponent(fileName)

  // Récupérer le nom du composant en PascalCase
  const componentName = upperFirst(
    camelCase(
      // Retrouver le nom du fichier indépendemment de la profondeur de dossier
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  // Créer un composant global
  Vue.component(
    componentName,
    // Chercher les options du composant dans `.default`, qui
    // existera si le composant a été exporté avec `export default`,
    // sinon revenez à la racine du module.
    componentConfig.default || componentConfig
  )
})
```

N'oubliez pas que **la création globale doit avoir lieu avant la création de l'instance racine Vue (avec `new Vue`)**. [Voici un exemple](https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js) de ce modèle dans un contexte de projet réel.
