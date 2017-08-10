---
title: Fonctions de rendu
type: guide
order: 15
---

## Les bases

Vue vous recommande l'utilisation de templates pour construire votre HTML dans la grande majorité des cas. Il y a cependant des situations où vous aurez réellement besoin de toute la puissance programmatique de JavaScript. C'est là que vous pouvez utiliser les **fonctions de rendu**, une alternative aux templates qui est plus proche du compilateur.

Examinons un exemple simple où une fonction `render` serait plus pratique. Imaginons que nous souhaitons générer des titres avec une ancre :

``` html
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world !
  </a>
</h1>
```

Pour le HTML ci-dessus, vous décidez d'utiliser cette interface de composant :

``` html
<anchored-heading :level="1">Hello world!</anchored-heading>
```

Quand vous commencez avec un composant se basant sur la prop `level` pour simplement générer des niveaux de titre, vous arrivez rapidement à cela :

``` html
<script type="text/x-template" id="anchored-heading-template">
  <h1 v-if="level === 1">
    <slot></slot>
  </h1>
  <h2 v-else-if="level === 2">
    <slot></slot>
  </h2>
  <h3 v-else-if="level === 3">
    <slot></slot>
  </h3>
  <h4 v-else-if="level === 4">
    <slot></slot>
  </h4>
  <h5 v-else-if="level === 5">
    <slot></slot>
  </h5>
  <h6 v-else-if="level === 6">
    <slot></slot>
  </h6>
</script>
```

``` js
Vue.component('anchored-heading', {
  template: '#anchored-heading-template',
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

Ce template ne semble pas génial. Il n'est pas uniquement verbeux, il duplique `<slot></slot>` dans tous les niveaux de titre et nous allons devoir refaire la même chose quand nous ajouterons l'élément ancre.

Alors que les templates fonctionnent bien pour la plupart des composants, il est clair que celui-là n'est pas l'un d'entre eux. Aussi essayons de le réécrire avec une fonction `render` :

``` js
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // nom de balise
      this.$slots.default // tableau des enfants
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

C'est bien plus simple ! Le code est plus court mais demande une plus grande familiarité avec les propriétés d'une instance de Vue. Dans ce cas, vous devez savoir que lorsque vous passez des enfants dans attribut `slot` dans un composant, comme le `Hello world !` à l'intérieur de `anchored-heading`, ces enfants sont stockés dans l'instance du composant via la propriété `$slots.default`. Si vous ne l'avez pas encore fait, **il est recommandé d'en lire plus sur les [propriétés d'instance de l'API](../api/#Proprietes-dinstance) avant d'entrer plus en profondeur dans les fonctions de rendu.**

## Les arguments de `createElement`

La seconde chose à laquelle vous allez devoir vous familiariser est la manière d'utiliser les fonctionnalités des templates avec la fonction `createElement`. Voici les arguments que la fonction `createElement` accepte :

``` js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // Un nom de balise HTML, des options de composant, ou une fonction
  // retournant l'un des deux. Requis.
  'div',

  // {Object}
  // Un objet de données correspondant aux attributs
  // que vous souhaitez utiliser dans le template. Optionnel.
  {
    // (vu en détails dans la prochaine section)
  },

  // {String | Array}
  // Des VNodes enfants, construit en utilisant `createElement()`,
  // ou en utilisant des chaîne de caractère pour créer des 'text VNodes'. Optionnel.
  [
    'Some text comes first.',
    createElement('h1', 'A headline'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```

### L'objet de données dans le détail

Une chose est à noter : de la même manière que `v-bind:class` et `v-bind:style` ont un traitement spécial dans les templates, ils ont leurs propres champs dans les objets de données VNode. Cet objet vous permet également d'insérer des attributs HTML normaux ainsi que des propriétés du DOM comme `innerHTML` (cela remplace la directive `v-html`) :

``` js
{
  // Même API que `v-bind:class`
  'class': {
    foo: true,
    bar: false
  },
  // Même API que `v-bind:style`
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // Attributs HTML normaux
  attrs: {
    id: 'foo'
  },
  // Props des composants
  props: {
    myProp: 'bar'
  },
  // Propriétés du DOM
  domProps: {
    innerHTML: 'baz'
  },
  // La gestion d'évènements est regroupée sous `on` cependant
  // les modificateurs comme `v-on:keyup.enter` ne sont pas
  // supportés. Vous devez vérifier manuellement le code de touche
  // dans le gestionnaire à la place.
  on: {
    click: this.clickHandler
  },
  // Pour les composants seulement. Vous permet d'écouter les
  // évènements natifs, plutôt que ceux émis par
  // le composant via `vm.$emit`.
  nativeOn: {
    click: this.nativeClickHandler
  },
  // Directives personnalisées. Notez que la valeur `oldValue`
  // de la liaison ne peut pas être affectée, car Vue la conserve
  // pour vous.
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // Slots internes sous la forme
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // Le nom du slot, si ce composant est
  // l'enfant d'un autre composant
  slot: 'name-of-slot',
  // Autres propriétés spéciales de premier niveau
  key: 'myKey',
  ref: 'myRef'
}
```

### Exemple complet

Avec toutes ces informations, nous pouvons finir le composant que nous avons commencé :

``` js
var getChildrenTextContent = function (children) {
  return children.map(function (node) {
    return node.children
      ? getChildrenTextContent(node.children)
      : node.text
  }).join('')
}

Vue.component('anchored-heading', {
  render: function (createElement) {
    // créer un identifiant avec la kebab-case
    var headingId = getChildrenTextContent(this.$slots.default)
      .toLowerCase()
      .replace(/\W+/g, '-')
      .replace(/(^\-|\-$)/g, '')

    return createElement(
      'h' + this.level,
      [
        createElement('a', {
          attrs: {
            name: headingId,
            href: '#' + headingId
          }
        }, this.$slots.default)
      ]
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

### Contraintes

#### Les VNodes doivent être uniques

Tous les VNodes dans l'arbre des composants doivent être uniques. Cela signifie que les fonctions suivantes sont invalides :

``` js
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // Aïe - VNodes dupliqués !
    myParagraphVNode, myParagraphVNode
  ])
}
```

Si vous souhaitez réellement dupliquer le même élément/composant plusieurs fois, vous pouvez le faire avec une fonction fabrique. Par exemple, la fonction de rendu suivante est parfaitement valide pour faire le rendu de 20 paragraphes identiques :

``` js
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```

## Remplacer les fonctionnalités de template en pur JavaScript

### `v-if` et `v-for`

Partout où quelque chose peut être accompli simplement en JavaScript, les fonctions de rendu de Vue ne fournissent pas d'alternative propriétaire. Par exemple, un template utilisant `v-if` et `v-for` :

``` html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>Aucun élément trouvé.</p>
```

Cela pourrait être réécrit avec les `if`/`else` et `map` du JavaScript dans une fonction de rendu

``` js
render: function (createElement) {
  if (this.items.length) {
    return createElement('ul', this.items.map(function (item) {
      return createElement('li', item.name)
    }))
  } else {
    return createElement('p', 'Aucun élément trouvé.')
  }
}
```

### `v-model`

Il n'y a pas d'équivalent à `v-model` dans les fonctions de rendu. Vous devez implémenter la logique vous-même :

``` js
render: function (createElement) {
  var self = this
  return createElement('input', {
    domProps: {
      value: self.value
    },
    on: {
      input: function (event) {
        self.value = event.target.value
        self.$emit('input', event.target.value)
      }
    }
  })
}
```

C'est le prix à payer pour travailler au plus bas niveau, mais cela vous donne un meilleur contrôle sur le détail des interactions comparé à `v-model`.

### Modificateurs d'évènement et de code de touche

Pour les modificateurs d'évènement `.passive`, `.capture` et `.once`, Vue offre des préfixes pouvant être utilisés dans `on`:

| Modificateur(s) | Préfixes |
| ------ | ------ |
| `.passive` | `&` |
| `.capture` | `!` |
| `.once` | `~` |
| `.capture.once` ou<br>`.once.capture` | `~!` |

Par exemple :

```javascript
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  `~!mouseover`: this.doThisOnceInCapturingMode
}
```

Pour tous les autres modificateurs d'évènement et de code de touche, aucun préfixe propriétaire n'est nécessaire car il suffit d'utiliser des méthodes d'évènement dans le gestionnaire :

| Modificateur(s) | Équivalence dans le gestionnaire |
| ------ | ------ |
| `.stop` | `event.stopPropagation()` |
| `.prevent` | `event.preventDefault()` |
| `.self` | `if (event.target !== event.currentTarget) return` |
| Touches :<br>`.enter`, `.13` | `if (event.keyCode !== 13) return` (changez `13` en un [autre code de touche](http://keycode.info/) pour les autres modificateurs de code de touche) |
| Modificateurs de Clés :<br>`.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return` (changez respectivement `ctrlKey` par `altKey`, `shiftKey`, ou `metaKey`) |

Voici un exemple avec tous ces modificateurs utilisés ensemble :

```javascript
on: {
  keyup: function (event) {
    // Annuler si l'élément qui émet l'évènement n'est pas
    // l'élément auquel l'évènement est lié
    if (event.target !== event.currentTarget) return
    // Annuler si la touche relâchée n'est pas la touche
    // Entrée (13) et si la touche `shift` n'est pas maintenue
    // en même temps
    if (!event.shiftKey || event.keyCode !== 13) return
    // Arrêter la propagation d'évènement
    event.stopPropagation()
    // Éviter la gestion par défaut de cet évènement pour cet élément
    event.preventDefault()
    // ...
  }
}
```

### Slots

Vous pouvez accéder aux contenus des slots statiques en tant que tableaux de VNodes depuis [`this.$slots`](../api/#vm-slots) :

``` js
render: function (createElement) {
  // `<div><slot></slot></div>`
  return createElement('div', this.$slots.default)
}
```

Et accéder aux slots de portée en tant que fonctions qui retournent des VNodes via [`this.$scopedSlots`](../api/#vm-scopedSlots) :

``` js
render: function (createElement) {
  // `<div><slot :text="msg"></slot></div>`
  return createElement('div', [
    this.$scopedSlots.default({
      text: this.msg
    })
  ])
}
```

Pour passer des slots internes à un composant enfant en utilisant des fonctions de rendu, utilisez la propriété `scopedSlots` dans les données du VNode :

``` js
render (createElement) {
  return createElement('div', [
    createElement('child', {
      // passer `scopedSlots` dans l'objet de données
      // in the form of { name: props => VNode | Array<VNode> }
      scopedSlots: {
        default: function (props) {
          return createElement('span', props.text)
        }
      }
    })
  ])
}
```

## JSX

Si vous écrivez beaucoup de fonctions `render`, cela pourra vous sembler fatiguant d'écrire des choses comme ça :

``` js
createElement(
  'anchored-heading', {
    props: {
      level: 1
    }
  }, [
    createElement('span', 'Hello'),
    ' world!'
  ]
)
```

Et d'autant plus quand la version template est vraiment simple en comparaison :

``` html
<anchored-heading :level="1">
  <span>Hello</span> world !
</anchored-heading>
```

C'est pourquoi il y a un [plugin Babel](https://github.com/vuejs/babel-plugin-transform-vue-jsx) pour utiliser JSX avec Vue, nous permettant l'utilisation d'une syntaxe plus proche de celle des templates :

``` js
import AnchoredHeading from './AnchoredHeading.vue'

new Vue({
  el: '#demo',
  render (h) {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world !
      </AnchoredHeading>
    )
  }
})
```

<p class="tip">Utiliser `h` comme alias de `createElement` est une convention courante que vous verrez dans l'écosystème Vue et qui est en faite requise pour JSX. Si `h` n'est pas disponible dans votre portée courante, votre application va lever une erreur.</p>

Pour plus d'informations sur comment utiliser JSX dans du JavaScript, référez-vous à la [documentation d'utilisation](https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage).

## Composants fonctionnels

Le composant de titre ancré que nous avons créé plus tôt était relativement simple. Il ne gère aucun état, n'observe aucun état qu'on lui passe, et il n'a pas de méthodes de cycle de vie. Non, ce n'est qu'une simple fonction avec quelques props.

Dans des cas comme celui-ci, nous pouvons marquer les composants comme `functional`, ce qui signifie qu'ils sont sans état (« stateless » c.-à-d. sans `data`) et sans instance (« instanceless » c.-à-d. sans contexte `this`). Un composant fonctionnel ressemble à ça :

``` js
Vue.component('my-component', {
  functional: true,
  // Pour compenser le manque d'instance,
  // nous pouvons maintenant fournir en second argument un contexte.
  render: function (createElement, context) {
    // ...
  },
  // Les props sont optionnelles
  props: {
    // ...
  }
})
```

> Note : dans les versions avant 2.3.0, l'option `props` est requise si vous souhaitez accepter des props dans un composant fonctionnel. Dans les versions 2.3.0+ vous pouvez omettre l'option `props` et tous les attributs trouvés dans le nœud composant seront implicitement extraits comme des props.

Tout ce dont le composant a besoin est passé dans l'objet `context`, qui est un objet contenant :

- `props` : un objet avec les props fournies,
- `children` : un tableau de VNode enfants,
- `slots` : une fonction retournant un objet de slots,
- `data` : l'objet de données (`data`) complet passé au composant,
- `parent` : une référence au composant parent,
- `listeners` : (2.3.0+) un objet contenant les écouteurs d'évènement enregistrés dans le parent. C'est un simple alias de `data.on`,
- `injections` : (2.3.0+) si vous utilisez l'option [`inject`](../api/#provide-inject), cela va contenir les injections résolues.

Après avoir ajouté `functional: true`, mettre à jour la fonction de rendu de notre composant de titres avec ancres va simplement nécessiter d'ajouter l'argument `context`, en remplaçant `this.$slots.default` par `context.children`, puis `this.level` par `context.props.level`.

Puisque les composants fonctionnels ne sont que des fonctions, leur rendu est plus rapide. Cependant, cela signifie également que les composants fonctionnels n'apparaissent pas dans l'arbre des composants de l'outil de développement [Vue devtools](https://github.com/vuejs/vue-devtools).

Ils sont également très utiles en tant que composants enveloppes. Par exemple, quand vous avez besoin de :

- Programmatiquement choisir un composant parmi plusieurs autres composants pour de la délégation ou
- Manipuler les enfants, props, ou données avant de les passer au composant enfant.

Voici un exemple d'un composant `smart-list` qui délègue à des composants plus spécifiques en fonction des props qui lui sont passées :

``` js
var EmptyList = { /* ... */ }
var TableList = { /* ... */ }
var OrderedList = { /* ... */ }
var UnorderedList = { /* ... */ }

Vue.component('smart-list', {
  functional: true,
  render: function (createElement, context) {
    function appropriateListComponent () {
      var items = context.props.items

      if (items.length === 0)           return EmptyList
      if (typeof items[0] === 'object') return TableList
      if (context.props.isOrdered)      return OrderedList

      return UnorderedList
    }

    return createElement(
      appropriateListComponent(),
      context.data,
      context.children
    )
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    isOrdered: Boolean
  }
})
```

### `slots()` vs. `children`

Vous vous demandez peut-être l'utilité d'avoir `slot()` et `children` en même temps. `slots().default` n'est-il pas la même chose que `children` ? Dans la majorité des cas, oui. Mais que faire si vous avez un composant fonctionnel avec les enfants suivants ?

``` html
<my-functional-component>
  <p slot="foo">
    premier
  </p>
  <p>second</p>
</my-functional-component>
```

Pour ce composant, `children` va vous donner les deux paragraphes, `slots().default` ne vous donnera que le second, et `slots().foo` ne vous donnera que le premier. Avoir le choix entre `children` et `slots()` vous permet donc de choisir ce que le composant sait à propos du système de slot ou si vous déléguez peut-être la responsabilité à un autre composant en passant simplement `children`.

## Compilation de template

Vous serez peut-être intéressé de savoir que les templates Vue sont en fait compilés en fonctions de rendu. C'est un détail d'implémentation dont vous n'avez en général pas à vous soucier, mais si vous souhaitez savoir comment un template spécifique est compilé, vous pourrez trouver cela intéressant. Vous trouverez ci-dessous une petite démo utilisant `Vue.compile` pour voir en live le rendu d'une chaîne de template :

{% raw %}
<div id="vue-compile-demo" class="demo">
  <textarea v-model="templateText" rows="10"></textarea>
  <div v-if="typeof result === 'object'">
    <label>rendu :</label>
    <pre><code>{{ result.render }}</code></pre>
    <label>staticRenderFns :</label>
    <pre v-for="(fn, index) in result.staticRenderFns"><code>_m({{ index }}): {{ fn }}</code></pre>
    <pre v-if="!result.staticRenderFns.length"><code>{{ result.staticRenderFns }}</code></pre>
  </div>
  <div v-else>
    <label>Erreur de compilation :</label>
    <pre><code>{{ result }}</code></pre>
  </div>
</div>
<script>
new Vue({
  el: '#vue-compile-demo',
  data: {
    templateText: '\
<div>\n\
  <header>\n\
    <h1>Je suis un template !</h1>\n\
  </header>\n\
  <p v-if="message">\n\
    {{ message }}\n\
  </p>\n\
  <p v-else>\n\
    Pas de message.\n\
  </p>\n\
</div>\
    ',
  },
  computed: {
    result: function () {
      if (!this.templateText) {
        return 'Entrez ci-dessous un template valide'
      }
      try {
        var result = Vue.compile(this.templateText.replace(/\s{2,}/g, ''))
        return {
          render: this.formatFunction(result.render),
          staticRenderFns: result.staticRenderFns.map(this.formatFunction)
        }
      } catch (error) {
        return error.message
      }
    }
  },
  methods: {
    formatFunction: function (fn) {
      return fn.toString().replace(/(\{\n)(\S)/, '$1  $2')
    }
  }
})
console.error = function (error) {
  throw new Error(error)
}
</script>
<style>
#vue-compile-demo {
  -webkit-user-select: inherit;
  user-select: inherit;
}
#vue-compile-demo pre {
  padding: 10px;
  overflow-x: auto;
}
#vue-compile-demo code {
  white-space: pre;
  padding: 0
}
#vue-compile-demo textarea {
  width: 100%;
  font-family: monospace;
}
</style>
{% endraw %}
