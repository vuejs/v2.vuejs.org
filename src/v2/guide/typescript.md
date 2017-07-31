---
title: Support de TypeScript
type: guide
order: 25
---

## Changements importants dans la 2.2.0+ pour les utilisateurs TS + webpack 2

Dans Vue 2.2.0+ nous avons introduit des fichiers de distribution en tant que modules ES, qui seront utilisés par défaut par webpack 2. Malheureusement, cela a introduit un changement de non retrocompatiblilité non souhaité car avec TypeScript + webpack 2, `import Vue = require('vue')` retourne maintenant un objet module ES synthétique au lieu de Vue lui-même.

Nous avons prévu de bouger toutes les déclarations officielles d'export dans le style ES dans le futur. Veuillez consulter [la configuration recommandée](#Configuration-recommandee) ci-dessous qui est parée pour les évolutions futures.

## Déclaration officielle dans les packages npm

Un système de typage statique peut aider à prévenir des erreurs d'exécutions potentielles, et particulièrement quand les applications grandissent. C'est pourquoi Vue est fourni avec des déclarations de types officielles]((https://github.com/vuejs/vue/tree/dev/types) pour [TypeScript](https://www.typescriptlang.org/), et pas seulement pour le cœur de Vue, mais aussi pour [vue-router](https://github.com/vuejs/vue-router/tree/dev/types) et [vuex](https://github.com/vuejs/vuex/tree/dev/types).

Puisque ceux-ci sont [publiés sur npm](https://unpkg.com/vue/types/), et que la dernière version de TypeScript sait comment résoudre des déclarations de type dans des packages npm, cela signifie qu'installer ceux-ci via npm ne requiert aucun outil supplémentaire pour utiliser TypeScript avec Vue.

## Configuration recommandée

``` js
// tsconfig.json
{
  "compilerOptions": {
    // ... les autres options sont omises
    "allowSyntheticDefaultImports": true,
    "lib": [
      "dom",
      "es5",
      "es2015.promise"
    ]
  }
}
```

Notez que l'option `allowSyntheticDefaultImports` nous permet d'utiliser l'import comme ceci :

``` js
import Vue from 'vue'
```

plutôt que comme cela :

``` js
import Vue = require('vue')
```

La premiere (syntaxe de module ES) est recommandée car elle est cohérente avec les recommandations d'usage ES. Nous planifions à l'avenir de changer toutes les déclarations officielles pour utiliser les exports dans le style ES.

De plus, si vous utilisez TypeScript avec webpack 2, les options suivantes sont également recommandées :

``` js
{
  "compilerOptions": {
    // ... les autres options sont omises
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

Ceci demande à TypeScript de laisser les instructions d'import de modules ES intactes, ce qui permet à webpack 2 de tirer parti du *tree-shaking* basé sur les modules ES.

Voir [les options de compilation TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html) pour plus de détails.

## Utiliser la déclaration de type Vue

La définition de type de Vue exporte de nombreuses [déclarations de type](https://github.com/vuejs/vue/blob/dev/types/index.d.ts) utiles. Par exemple, pour annoter l'objet d'options d'un composant exporté (par ex. dans un fichier `.vue`) :

``` ts
import Vue, { ComponentOptions } from 'vue'

export default {
  props: ['message'],
  template: '<span>{{ message }}</span>'
} as ComponentOptions<Vue>
```

## Composants Vue sous forme de classe

Les options de composant Vue peuvent facilement être annotées avec des types :

``` ts
import Vue, { ComponentOptions }  from 'vue'

// Déclarer le type de composant
interface MyComponent extends Vue {
  message: string
  onClick (): void
}

export default {
  template: '<button @click="onClick">Click!</button>',
  data: function () {
    return {
      message: 'Bonjour !'
    }
  },
  methods: {
    onClick: function () {
      // TypeScript sait que `this` est de type `MyComponentTypeScript`
      // et que `this.message` sera une chaîne de caractères
      window.alert(this.message)
    }
  }
// Nous devons explicitement annoter l'objet d'options exporté
// avec le type `MyComponent`
} as ComponentOptions<MyComponent>
```

Malheureusement, il y a quelques limitations ici :

- __TypeScript ne peut pas déduire tous les types de l'API de Vue__ Par exemple, il ne sait pas que la propriété `message` renvoyée dans notre fonction `data` sera ajoutée à l'instance `MyComponent`. Cela signifie que si nous attribuons un nombre ou une valeur booléenne à `message`, les linters et les compilateurs ne seraient pas en mesure d'émettre une erreur, en pointant le fait qu'il s'agit normalement d'une chaîne de caractères.

- À cause de la précédente limitation, __l'annotation de types peut être verbeuse__. La seule raison pour laquelle nous devons déclarer manuellement `message` en tant que chaîne de caractères est parce que TypeScript ne peut pas déduire le type dans ce cas.

Fort heureusement, [vue-class-component](https://github.com/vuejs/vue-class-component) peut résoudre ses deux problèmes. C'est une bibliothèque de support officielle qui permet de déclarer les composants comme des classes natives en JavaScript, avec le décorateur `@Component`. Pour l'exemple, ré-écrivons le composant ci-dessus :

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

Avec cette syntaxe alternative, nos définitions de composant ne sont pas seulement plus courtes, mais TypeScript peut aussi connaître les types de `message` et `onClick` avec des interfaces de déclarations explicites. Cette stratégie peut même vous permettre de gérer des types pour les propriétés calculées, les hooks de cycle de vie et les fonctions de rendu. Pour une utilisation plus détaillée, référez-vous à [la documentation de vue-class-component](https://github.com/vuejs/vue-class-component#vue-class-component).

## Déclaration des types des plugins Vue

Les plugins peuvent ajouter des propriétés d'instance de Vue, des propriétés globales de Vue et des options de composant de Vue. Dans ces cas, les déclarations de type sont nécessaire pour permettre aux plugins de compiler en TypeScript. Fort heureusement, il y a une fonctionnalité TypeScript pour augmenter les types existant appelée [module d'augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

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
  // en utilisant `namespace` au lieu de `interface`
  namespace Vue {
    const $myGlobal: string
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
