---
title: Support de TypeScript
type: guide
order: 404
---

> Dans Vue 2.5.0+ nous avons grandement amélioré nos déclarations de types pour fonctionner avec l'API par défaut basée sur les objets. Cela a également introduit quelques changements qui requièrent une intervention manuelle. Lisez [ce billet de blog](https://medium.com/@OrchardID/changements-typescript-%C3%A0-venir-dans-vue-2-5-1a5568402b5b) pour plus de détails.

## Déclaration officielle dans les packages npm

Un système de typage statique peut aider à prévenir des erreurs d'exécutions potentielles, et particulièrement quand les applications grandissent. C'est pourquoi Vue est fourni avec des déclarations de types officielles]((https://github.com/vuejs/vue/tree/dev/types) pour [TypeScript](https://www.typescriptlang.org/), et pas seulement pour le cœur de Vue, mais aussi pour [vue-router](https://github.com/vuejs/vue-router/tree/dev/types) et [vuex](https://github.com/vuejs/vuex/tree/dev/types).

Puisque ceux-ci sont [publiés sur npm](https://cdn.jsdelivr.net/npm/vue/types/), et que la dernière version de TypeScript sait comment résoudre des déclarations de type dans des packages npm, cela signifie qu'installer ceux-ci via npm ne requiert aucun outil supplémentaire pour utiliser TypeScript avec Vue.

Nous avons également planifié de fournir prochainement une option dans `vue-cli` pour installer un projet Vue + TypeScript prêt à l'emploi.

## Configuration recommandée

``` js
// tsconfig.json
{
  "compilerOptions": {
    // alignement avec le support navigateur de Vue
    "target": "es5",
    // activation de la déduction stricte pour les propriétés de données sur `this`
    "strict": true,
    // si vous utilisez webpack 2+ ou rollup, permettre le tree shaking :
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

Notez que vous devez inclure `strict: true` (ou au moins `noImplicitThis: true` qui est une partie de `strict`) pour activer la vérification de type de `this` dans les méthodes de composant, autrement il sera toujours traiter comme un type `any`.

Voir [les options de compilation TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html) pour plus de détails.

## Outils de développement

Pour développer des applications Vue avec TypeScript, nous recommandons fortement d'utiliser [Visual Studio Code](https://code.visualstudio.com/) qui fournit un support de TypeScript nativement.

Si vous utilisez des [composants monofichiers](./single-file-components.html), utilisez la super [extension Vetur](https://github.com/vuejs/vetur) qui fournit des déductions TypeScript à l'intérieur de vos composants monofichiers et bien d'autres fonctionnalités extras.

## Utilisation de base

Pour laisser TypeScript déduire proprement les types dans les options des composants Vue, vous devez définir vos composants avec `Vue.component` ou `Vue.extend` :

``` ts
import Vue from 'vue'

const Component = Vue.extend({
  // déduction de type activée
})

const Component = {
  // ceci N'aura PAS la déduction de type,
  // car TypeScript ne peut pas savoir qu'il s'agit d'options pour un composant Vue.
}
```

Notez qu'en utilisant Vetur avec les composants monofichiers, la déduction de type va automatiquement appliquer un export par défaut. Il n'y a donc pas besoin d'encadrement avec `Vue.extend` :

``` html
<template>
  ...
</template>

<script lang="ts">
export default {
  // déduction de type activée
}
</script>
```

## Composants Vue basés sur les classes

Si vous préférez une API basée sur les classes quand vous déclarez des composants, vous pouvez utiliser le décorateur officiel [vue-class-component](https://github.com/vuejs/vue-class-component) :

``` ts
import Vue from 'vue'
import Component from 'vue-class-component'

// Le décorateur @Component indique que la classe est un composant Vue
@Component({
  // Toutes les options de composant sont autorisées ici.
  template: '<button @click="onClick">Click!</button>'
})
export default class MyComponent extends Vue {
  // Les données initiales peuvent être déclarées comme des propriétés de l'instance
  message: string = 'Bonjour !'

  // Les méthodes peuvent être déclarées comme des méthodes d'instance
  onClick (): void {
    window.alert(this.message)
  }
}
```

## Déclaration des types des plugins Vue

Les plugins peuvent ajouter des propriétés d'instance de Vue, des propriétés globales de Vue et des options de composant de Vue. Dans ces cas, les déclarations de type sont nécessaires pour permettre aux plugins de compiler en TypeScript. Fort heureusement, il y a une fonctionnalité TypeScript pour augmenter les types existants appelée [module d'augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

Par exemple, pour déclarer une propriété d'instance `$myProperty` avec le type `string` :

``` ts
// 1. Assurez-vous d'importer `vue` avant de déclarer les types augmentés
import Vue from 'vue'

// 2. Spécifiez un fichier avec les types que vous voulez augmenter
//    Vue a le type de constructeur dans types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Déclarez l'augmentation pour Vue
  interface Vue {
    $myProperty: string
  }
}
```

Après inclusion du code ci-dessus en tant que déclaration de fichier (comme `my-property.d.ts`) dans votre projet, vous pouvez utiliser `$myProperty` dans une instance de Vue.

```ts
var vm = new Vue()
console.log(vm.$myProperty) // Ceci sera compilé avec succès
```

Vous pouvez aussi déclarer des propriétés globales additionnelles et des options de composant :

```ts
import Vue from 'vue'

declare module 'vue/types/vue' {
  // Les propriétés globales peuvent être déclarées
  // sur l'interface `VueConstructor`
  interface VueConstructor {
    $myGlobal: string
  }
}

// `ComponentOptions` est déclarée dans types/options.d.ts
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    myOption?: string
  }
}
```

La déclaration ci-dessus permet au code suivant de compiler :

```ts
// Propriété globale
console.log(Vue.$myGlobal)

// Option additionnelle de composant
var vm = new Vue({
  myOption: 'Hello'
})
```
