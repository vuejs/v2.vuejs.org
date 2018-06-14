---
title: Test Unitaire des Composants Vue
type: cookbook
order: 6
---

## Exemple de base

<p>Les tests unitaires sont une étape fondamentale du développement de logiciel. Ces tests permettent d'exécuter chaque unité de code isolée du reste du logiciel. Ils facilitent l'ajout de nouvelles fonctionnalités, la détection et la correction de bugs. Les [composants monofichiers](../guide/single-file-components.html) de Vue rendent ce processus de test relativement facile. Cela vous permet d'ajouter des fonctionnalités sans risquer de casser l'existant. De plus, cela aide les autres développeurs à comprendre votre composant.</p>

Cet exemple simple vérifie qu'un texte est affiché :

```html
<template>
  <div>
    <input v-model="username">
    <div
      v-if="error"
      class="error"
    >
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hello',
  data () {
    return {
      username: ''
    }
  },

  computed: {
    error () {
      return this.username.trim().length < 7
        ? 'Veuillez entrez un nom plus long'
        : ''
    }
  }
}
</script>
```

```js
import { shallowMount } from '@vue/test-utils'

test("Foo", () => {
  // render the component
  const wrapper = shallowMount(Hello)

  // should not allow for `username` less than 7 characters, excludes whitespace
  wrapper.setData({ username: " ".repeat(7) });

  // assert the error is rendered
  expect(wrapper.find(".error").exists()).toBe(true);

  // update the name to be long enough
  wrapper.setData({
    username: "Lachlan"
  });

  // assert the error has gone away
  expect(wrapper.find(".error").exists()).toBe(false);
});
```

Le code ci-dessus montre comment tester l'apparition d'un message d'erreur si le username n'est pas assez long. Il nous donne une idée de ce en quoi consistent les tests unitaires de composants VueJs : On render le composant, on lui fournit des données, puis on vérifie que le rendu correspond au données.

## Pourquoi tester?

Quelques-un des avantages à tester ses composants :

* Les tests documentent comment le composant doit fonctionner
* Ils évitent d'avoir à re-tester manuellement après chaque changement du code
* Ils réduisent le risque de régression quand on ajoute des fonctionnalités
* Ils améliorent l'architecture du code
* Ils facilitent le refactoring

Dans les équipes où les développeurs sont nombreux, les tests automatiques permettent de maintenir une codebase volumineuse à moindre effort.

#### Pour commencer

Le package officiel pour tester les composants Vue est [Vue Test Utils](https://github.com/vuejs/vue-test-utils). Le template `webpack` pour [vue-cli](https://github.com/vuejs/vue-cli) contient soit Karma soit Jest. Ces deux test runners sont très bien supportés par Vue.js. On peut trouver quelques [guides](https://vue-test-utils.vuejs.org/fr/guides/) dans la documentation de Vue Test Utils.

## Exemple concret

Un bon test unitaire se doit d'être :

* Rapide à l'exécution
* Facile à comprendre
* Tester un _seul comportement à la fois_

Reprenons l'exemple précédent, et ajoutons y le concept de <a href="https://en.wikipedia.org/wiki/Factory_(object-oriented_programming)">factory function</a> pour rendre nos tests plus compacts et plus clairs. Le composant devra donc :

* Afficher un message 'Bienvenue sur le tutoriel VueJs'.
* Demander à l'utilisateur son username
* Afficher une erreur si le username fait moins de 7 caractères

Voyons d'abord le code du composant :

```html
<template>
  <div>
    <div class="message">
      {{ message }}
    </div>
    Entrez un username : <input v-model="username">
    <div
      v-if="error"
      class="error"
    >
      Choisissez un username de plus de 7 characteres.
    </div>
  </div>
</template>

<script>
export default {
  name: 'Foo',

  data () {
    return {
      message: 'Bienvenue sur le tutoriel VueJs',
      username: ''
    }
  },

  computed: {
    error () {
      return this.username.trim().length < 7
    }
  }
}
</script>
```

Ce que l'on doit tester :

* le `message` est il affiché?
* si `error` est `true`, `<div class="error">` devrait être visible
* si `error` est `false`, `<div class="error">` ne devrait pas être présent

Et enfin la version naïve de nos tests

```js
import { shallowMount } from '@vue/test-utils'

describe('Foo', () => {
  it('restitue un message et répond correctement à la saisie de l\'utilisateur', () => {
      const wrapper = shallowMount(Foo, {
    data: {
      message: 'Hello World',
      username: ''
    }
  })

  // vérifie si le message est restitué
  expect(wrapper.find('.message').text()).toEqual('Hello World')

  // vérifie que `error` est rendue
  expect(wrapper.find('.error').exists()).toBeTruthy()

  // met à jour `username` et vérifie que `error` n'est plus rendu
  wrapper.setData({ username: 'Lachlan' })
  expect(wrapper.find('.error').exists()).toBeFalsy()
  })
})
```

Ce premier test n'est pas parfait. On peut y voir plusieurs problèmes :

* Un seul test vérifie plusieurs comportements
* Difficile de distinguer different statuts et ce qui devrait être affiché

L'exemple ci-dessous rend ce test un peu meilleur :

* ne fait qu'un seul test par `it`
* a une description claire et concise de chaque test
* ne fournit que le minimum de données nécessaires au test
* rassemble le code dupliqué (création du `wrapper` et mise à jour du `username`) dans une fonction `factory`

_Test amelioré_ :

```js
import { shallowMount } from '@vue/test-utils'
import Foo from './Foo'

const factory = (values = {}) => {
  return shallowMount(Foo, {
    data: { ...values  }
  })
}

describe("Foo", () => {
  it("renders a welcome message", () => {
    const wrapper = factory();

    expect(wrapper.find(".message").text()).toEqual(
      "Welcome to the Vue.js cookbook"
    );
  });

  it("renders an error when username is less than 7 characters", () => {
    const wrapper = factory({ username: "" });

    expect(wrapper.find(".error").exists()).toBeTruthy();
  });

  it("renders an error when username is whitespace", () => {
    const wrapper = factory({ username: " ".repeat(7) });

    expect(wrapper.find(".error").exists()).toBeTruthy();
  });

  it("does not render an error when username is 7 characters or more", () => {
    const wrapper = factory({ username: "Lachlan" });

    expect(wrapper.find(".error").exists()).toBeFalsy();
  });
});
```

À noter :

Au début du code, on déclare la fonction `factory` qui prend l'objet `values` et en construit le `data` pour renvoyer une nouvelle instance de `wrapper`. Du coup, plus besoin de dupliquer `const wrapper = shallowMount(Foo)` dans chaque test. Un autre avantage important : quand des composants plus complexes vont devoir être testés, le `mock` ou le `stub` d'une méthode ou d'une propriété calculée pourront facilement être mutualisés dans cette `factory`.

## Pour aller plus loin

Le test précédent est assez simple. En pratique on souhaitera souvent vérifier d'autres comportements comme :

* appeler une API
* faire des `commit` ou des `dispatch` de mutations ou d'actions a un store `Vuex`
* tester l'interactivité

Il existe des exemples plus complets illustrant ce genre de tests dans les [guides](https://vue-test-utils.vuejs.org/guides/) de Vue Test Utils.

Vue Test Utils et le gigantesque ecosystème JavaScript fournissant plein d’outils facilitant une couverture de test proche de 100%. Mais les tests unitaires ne sont qu’une partie de la pyramide de tests. On peut y inclure des tests d’intégration (e2e ou end to end), et du snapshot testing. Les tests unitaires sont les plus petits et les plus simples des tests - Ils vérifient les plus petites unités de travail, isolant ainsi chaque partie d’un même composant.

Le snapshot testing permet de sauvegarder le rendu HTML d’un composant Vue, et de le comparer au rendu généré chaque fois que les tests passent. Si quelque chose change dans le rendu, le développeur est averti et peut décider si le changement est intentionnel (le composant a été mis à jour) ou involontaire (le composant ne se comporte pas comme prévu).

Les tests d’intégration testent l’interaction de plusieurs composants. Il s’agit de tests plus haut niveau. Par exemple tester si un utilisateur peut s’enregistrer se logger et changer son `username`. Ils peuvent être plus lent et plus long a exécuter que les tests unitaires ou snapshot.

Les tests unitaires sont souvent utilisés lors du développement, soit pour aider le développeur à concevoir l’architecture d’un composant, soit pour l’aider a refactorer un composant existant. Ils sont souvent exécutés après chaque changement du code.

Les test de plus haut niveau comme les tests d’intégration son plus lent a l’exécution. Ces tests sont plutôt lancés avant de déployer une mise à jour en production, pour s’assurer que chaque partie du logiciel fonctionne correctement.

Plus d’info sur comment tester des composants VueJs dans le livre de [Edd Yerburgh](https://eddyerburgh.me/) membre de la core team de VueJs : [Testing Vue.js Applications](https://www.manning.com/books/testing-vuejs-applications) (en anglais).

## Quand éviter ce pattern

Les tests unitaires sont une part importante de toute application sérieuse. Au début, quand l’application commence et que la vision complète n’est pas très claire, les tests unitaires peuvent ralentir un peu le développement, mais une fois l’architecture établie et que des utilisateurs réels utilisent l’application, les tests unitaires (et tous types de tests automatiques) sont essentiel à la stabilité et la scalabilité.
