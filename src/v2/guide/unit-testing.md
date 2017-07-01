---
title: Tests unitaires
type: guide
order: 23
---

## Outils et mise en place

N'importe quoi de compatible avec un module basé sur un système de build va fonctionner. Mais si vous hésitez sur le choix d'un outil en particulier, essayez le lanceur de tests [Karma](http://karma-runner.github.io). Il y a beaucoup de plugins communautaires, incluant le support de [webpack](https://github.com/webpack/karma-webpack) et [Browserify](https://github.com/Nikku/karma-browserify). Pour une mise en place détaillée, référez-vous à la documentation respective de chaque projet. Ces exemples de configuration de Karma pour [webpack](https://github.com/vuejs-templates/webpack/blob/master/template/test/unit/karma.conf.js) et [Browserify](https://github.com/vuejs-templates/browserify/blob/master/template/karma.conf.js) pourront vous aider à démarrer.

## De simples assertions

En terme de structure de test de code, vous n'avez rien de spécial à faire dans vos composants pour les rendre testables. Exportez simplement son objet d'options :

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

Quand vous testez ce composant, tout ce que vous avez à faire est d'importer l'objet d'options avec un objet Vue pour faire des assertions communes :

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
  it('rend le message correcte', () => {
    const Ctor = Vue.extend(MyComponent)
    const vm = new Ctor().$mount()
    expect(vm.$el.textContent).toBe('au revoir !')
  })
})
```

## Écrire des composants testables

Beaucoup de sortie de rendu de composants sont principalement déterminées selon les props que les composants reçoivent. En fait, si une sortie de rendu de composant dépend uniquement de ses props, il devient très rapide de le tester. Exactement de la même manière qu'on ferrait des assertions sur la valeur de retour d'une fonction standard avec différents arguments. Voici un exemple :

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
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData: propsData }).$mount()
  return vm.$el.textContent
}

describe('MyComponent', () => {
  it('rendre correctement le message avec différentes props', () => {
    expect(getRenderedText(MyComponent, {
      msg: 'Bonjour'
    })).toBe('Bonjour')

    expect(getRenderedText(MyComponent, {
      msg: 'Au revoir'
    })).toBe('Au revoir')
  })
})
```

## Assertions de mise à jour asynchrones

Parce que Vue [fait les mises à jour du DOM de manière asynchrone](reactivity.html#File-d’attente-de-mise-a-jour-asynchrone), les assertions sur les mises à jour du DOM dû à un changement d'état doivent être faites dans une fonction de rappel `Vue.nextTick` :

``` js
// Inspecter le HTML généré après une mise à jour d'état
it('mettre à jour le message rendu quand `vm.message` est mis à jour', done => {
  const vm = new Vue(MyComponent).$mount()
  vm.message = 'foo'

  // attendre une boucle (« tick ») après le changement d'état avant de faire l'assertion des mises à jour du DOM
  Vue.nextTick(() => {
    expect(vm.$el.textContent).toBe('foo')
    done()
  })
})
```

Nous avons planifié de travailler sur une collection de fonctions utilitaires de tests communs pour rendre encore plus simple les tests de composant de rendu avec différentes contraintes (par ex. des rendus peu profonds ignorant les composants enfants) et faire des assertions de leur sortie.
