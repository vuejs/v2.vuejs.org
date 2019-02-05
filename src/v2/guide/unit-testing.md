---
title: Tests unitaires
type: guide
order: 402
---

> [Vue CLI](https://cli.vuejs.org/) possède des options intégrées pour les tests unitaires avec [Jest](https://github.com/facebook/jest) ou [Mocha](https://mochajs.org/) qui fonctionne dès démarrage. Nous avons également le [Vue Test Utils](https://vue-test-utils.vuejs.org/) officiel qui fournit un guide plus détaillé pour des configurations personnalisées.

## Des assertions simples

En termes de structure de code pour les tests, vous n'avez rien de spécial à faire dans vos composants pour les rendre testables. Exportez juste les options en l'état :

``` html
<template>
  <span>{{ message }}</span>
</template>

<script>
  export default {
    data () {
      return {
        message: 'bonjour !'
      }
    },
    created () {
      this.message = 'au revoir !'
    }
  }
</script>
```

Puis importez les options de composant aux côtés de Vue et vous pourrez faire une série d'assertions communes (ici nous utilisons le style Jasmine/Jest avec l'assertions `expect` en tant qu'exemple) :

``` js
// Importer Vue et le composant à tester
import Vue from 'vue'
import MyComponent from 'path/to/MyComponent.vue'

// Ici nous avons plusieurs tests avec Jasmine 2.0, cependant vous pouvez utiliser
// n'importe quel combo de lanceur de tests / bibliothèque d'assertions que vous préférez
describe('MyComponent', () => {
  // Inspecter l'objet d'options du composant
  it('a le hook `created`', () => {
    expect(typeof MyComponent.created).toBe('function')
  })

  // Évaluer les résultats des fonctions dans
  // l'objet d'options du composant
  it('contient les données par défaut', () => {
    expect(typeof MyComponent.data).toBe('function')
    const defaultData = MyComponent.data()
    expect(defaultData.message).toBe('bonjour !')
  })

  // Inspecter l'instance au montage du composant
  it('affecte correctement les messages à la création', () => {
    const vm = new Vue(MyComponent).$mount()
    expect(vm.message).toBe('au revoir !')
  })

  // Monter une instance et inspecter le résultat en sortie
  it('rend le message correct', () => {
    const Constructor = Vue.extend(MyComponent)
    const vm = new Constructor().$mount()
    expect(vm.$el.textContent).toBe('au revoir !')
  })
})
```

## Écrire des composants testables

Une bonne partie du code en sortie du rendu d'un composant est principalement déterminée par les props qu'il reçoit. Si le rendu d'un composant dépend uniquement de ses props, il devient assez facile à tester, de la même manière que l'on ferait une assertion sur la valeur de retour d'une fonction pure avec différents arguments. Voici un exemple :

``` html
<template>
  <p>{{ msg }}</p>
</template>

<script>
  export default {
    props: ['msg']
  }
</script>
```

Vous pouvez faire des assertions sur le rendu en sortie avec différentes props en utilisant l'option `propsData` :

``` js
import Vue from 'vue'
import MyComponent from './MyComponent.vue'

// Fonction utilitaire qui monte et retourne le texte rendu
function getRenderedText (Component, propsData) {
  const Constructor = Vue.extend(Component)
  const vm = new Constructor({ propsData: propsData }).$mount()
  return vm.$el.textContent
}

describe('MyComponent', () => {
  it('donne un rendu correct avec différentes props', () => {
    expect(getRenderedText(MyComponent, {
      msg: 'Bonjour'
    })).toBe('Bonjour')

    expect(getRenderedText(MyComponent, {
      msg: 'Au revoir'
    })).toBe('Au revoir')
  })
})
```

## Assertions sur des mises à jour asynchrones

Parce que Vue [fait les mises à jour du DOM de manière asynchrone](reactivity.html#File-d’attente-de-mise-a-jour-asynchrone), les assertions sur les mises à jour du DOM résultant d'un changement d'état doivent être faites dans une fonction de rappel `Vue.nextTick` :

``` js
// Inspecter le HTML généré après une mise à jour d'état
it('met à jour le message rendu quand `vm.message` est mis à jour', done => {
  const vm = new Vue(MyComponent).$mount()
  vm.message = 'foo'

  // attendre une boucle (« tick ») après le changement d'état avant de faire l'assertion des mises à jour du DOM
  Vue.nextTick(() => {
    expect(vm.$el.textContent).toBe('foo')
    done()
  })
})
```

Nous prévoyons de travailler sur une collection de fonctions utilitaires de tests communs pour rendre encore plus simple le rendu de composants avec différentes contraintes (par ex. des rendus peu profonds ignorant les composants enfants) et faire des assertions sur le code en sortie.

Pour des informations plus pointues sur les tests unitaires avec Vue, jeter un œil à [Vue Test Utils](https://vue-test-utils.vuejs.org/) et notre entrée des tutoriels à propos des [tests unitaires de composants Vue](https://vuejs.org/v2/cookbook/unit-testing-vue-components.html).
