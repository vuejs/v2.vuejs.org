---
title: Funções "render" (Renderização)
type: guide
order: 14
---

## Introdução

Vue recomenda que templates sejam utilizados para construir seu HTML na grande maioria dos casos. Haverá situações, no entanto, em que você irá realmente precisar de todo o poder de programação do JavaScript. É quando você pode usar a **função "render"**, uma alternativa aos templates que é mais próxima ao compilador.

Vamos mergulhar em um simples exemplo onde a função `render` seria prática. Digamos que você quer gerar links em cabeçalhos (headings):

``` html
<h1>
  <a name="alo-mundo" href="#alo-mundo">
    Alô Mundo!
  </a>
</h1>
```

Para o código HTML acima, você decide que quer esta interface para o seu componente:

``` html
<linked-heading :nivel="1">Alô Mundo!</linked-heading>
```

Quando você começar a criar o componente de modo que gere os cabeçalhos de acordo com a propriedade (prop) `nivel`, você rapidamente chegará a algo assim:

``` html
<script type="text/x-template" id="linked-heading-template">
  <div>
    <h1 v-if="nivel === 1">
      <slot></slot>
    </h1>
    <h2 v-if="nivel === 2">
      <slot></slot>
    </h2>
    <h3 v-if="nivel === 3">
      <slot></slot>
    </h3>
    <h4 v-if="nivel === 4">
      <slot></slot>
    </h4>
    <h5 v-if="nivel === 5">
      <slot></slot>
    </h5>
    <h6 v-if="nivel === 6">
      <slot></slot>
    </h6>
  </div>
</script>
```

``` js
Vue.component('linked-heading', {
  template: '#linked-heading-template',
  props: {
    nivel: {
      type: Number,
      required: true
    }
  }
})
```

Esse template não está bom. Não somente é prolixo, mas também estamos duplicando `<slot></slot>` para cada nível de cabeçalho, e termos que fazer o mesmo quando incluirmos o elemento `<a>` para o link. E tudo está dentro de um elemento `div` inútil, somente porque componentes devem possuir exatamente um único elemento raiz (root).

Enquanto templates funcionam muito bem para a maioria dos componentes, está claro que este caso é uma exceção. Então vamos tentar re-escrever este componente usando uma função `render`:

``` js
Vue.component('linked-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.nivel,   // nome do elemento (tag)
      this.$slots.default // array de elementos-filho (children)
    )
  },
  props: {
    nivel: {
      type: Number,
      required: true
    }
  }
})
```

Muito mais simples! Mais ou menos. O código é menor, mas requer maior familiaridade com as propriedades de uma instância Vue. Neste caso, você precisa saber que quando você inclui elementos-filho (children) em seu componente sem especificar um atributo `slot`, como o `Alô Mundo!` dentro de `linked-heading`, esses elementos estão acessíveis na instância do componente em `$slots.default`. Se você ainda não leu, **é altamente recomendado que leia a seção [API - propriedades da instância](/api/#vm-slots) antes de se aprofundar em funções "render".**

## Parâmetros para `createElement`

A segunda coisa com a qual você precisa se familiarizar é como utilizar as features disponíveis em templates na função `createElement`. Estes são os parâmetros que `createElement` aceita:

``` js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // Um nome de elemento (tag) HTML, um objeto com opções de componente,
  // ou uma função retornando um dentre os anteriores. Requerido.
  'div',

  // {Object}
  // Um objeto de dados (chave: valor) correspondendo aos atributos
  // que você usaria em template. Opcional.
  {
    // (veja detalhes na próxima seção, abaixo)
  },

  // {String | Array}
  // VNodes filhos. Opcional.
  [
    createElement('h1', 'alô mundo')
    createElement(MyComponent, {
      props: {
        umaProp: 'foo'
      }
    }),
    'bar'
  ]
)
```

### O Objeto de Dados em Detalhes

Importante observar: assim como `v-bind:class` e `v-bind:style` têm tratamento especial em templates, eles têm suas respectivas propriedades no primeiro nível de um objeto de dados VNode.

``` js
{
  // Mesma API que `v-bind:class`
  'class': {
    foo: true,
    bar: false
  },
  // Mesma API que `v-bind:style`
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // Atributos HTML comuns
  attrs: {
    id: 'foo'
  },
  // Propriedades (props) de componente
  props: {
    myProp: 'bar'
  },
  // Propriedades DOM
  domProps: {
    innerHTML: 'baz'
  },
  // Manipuladores de evento (event handlers) devem
  // ser declarados dentro do objeto "on".
  // Modificadores como ".enter" em "v-on:keyup.enter"
  // não são suportados. Neste exemplo, você teria
  // que verificar manualmente o "keyCode" do
  // evento no código do handler.
  on: {
    click: this.clickHandler
  },
  // Somente para componentes. Permite que você escute
  // a eventos nativos, ao invés de eventos emitidos
  // pelo componente usando vm.$emit.
  nativeOn: {
    click: this.nativeClickHandler
  },
  // O nome do slot (se o elemento for filho de um componente)
  slot: 'name-of-slot'
  // Outras propriedades especiais no primeiro nível
  key: 'myKey',
  ref: 'myRef'
}
```

### Exemplo Completo

Com este conhecimento, nós agora podemos finalizar o componente que começamos:

``` js
var getChildrenTextContent = function (children) {
  return children.map(function (node) {
    return node.children
      ? getChildrenTextContent(node.children)
      : node.text
  }).join('')
}

Vue.component('linked-heading', {
  render: function (createElement) {
    // criar id em kebabCase
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

### Restrições

#### VNodes Têm Que Ser Únicos

Todos os VNodes na árvore do componente têm que ser únicos. Isso significa que a seguinte função `render` é inválida:

``` js
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'oi')
  return createElement('div', [
    // Oh não! - VNodes em duplicidade!
    myParagraphVNode, myParagraphVNode
  ])
}
```

Se você realmente quiser duplicar o mesmo elemento ou componente várias vezes, você pode fazê-lo com uma função fábrica (factory). Por exemplo, a seguinte função `render` contém uma forma perfeitamente válida de renderizar 20 parágrafos idênticos:

``` js
render: function (createElement) {
  var myParagraph =
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'oi')
    })
  )
}
```

## Replacing Template Features with Plain JavaScript

Wherever something can be easily accomplished in plain JavaScript, Vue render functions do not provide a proprietary alternative. For example, in a template using `v-if` and `v-for`:

``` html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>No items found.</p>
```

This could be rewritten with JavaScript's `if`/`else` and `map` in a render function:

``` js
render: function (createElement) {
  if (this.items.length) {
    return createElement('ul', this.items.map(function (item) {
      return createElement('li', item.name)
    }))
  } else {
    return createElement('p', 'No items found.')
  }
}
```

## JSX

If you're writing a lot of `render` functions, it might feel painful that we're using 14 lines above in place of this much simpler and arguably more readable template:

``` html
<anchored-heading :level="1">
  <span>Hello</span> world!
</anchored-heading>
```

That's why there's a [Babel plugin](https://github.com/vuejs/babel-plugin-transform-vue-jsx) to use JSX with Vue, getting us back to a syntax that's closer to templates:

``` js
import AnchoredHeading from './AnchoredHeading.vue'

new Vue({
  el: '#demo',
  render (h) {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})
```

<p class="tip">Aliasing `createElement` to `h` is a common convention you'll see in the Vue ecosystem and is actually required for JSX. If `h` is not available in the scope, your app will throw an error.</p>

For more on how JSX maps to JavaScript, see the [usage docs](https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage).

## Functional Components

The anchored heading component we created earlier is relatively simple. It doesn't manage any state, watch any state passed to it, and it has no lifecycle methods. Really, it's just a function with some props.

In cases like this, we can mark components as `functional`, which means that they're stateless (no `data`) and instanceless (no `this` context). A **functional component** looks like this:

``` js
Vue.component('my-component', {
  functional: true,
  // To compensate for the lack of an instance,
  // we are now provided a 2nd context argument.
  render: function (createElement, context) {
    // ...
  },
  // Props are optional
  props: {
    // ...
  }
})
```

Everything the component needs is passed through `context`, which is an object containing:

- `props`: An object of the provided props
- `children`: An array of the VNode children
- `slots`: A function returning a slots object
- `data`: The entire data object passed to the component
- `parent`: A reference to the parent component

After adding `functional: true`, updating the render function of our anchored heading component would simply require adding the `context` argument, updating `this.$slots.default` to `context.children`, then updating `this.level` to `context.props.level`.

Since functional components are just functions, they're much cheaper to render. They're also very useful as wrapper components. For example, when you need to:

- Programmatically choose one of several other components to delegate to
- Manipulate children, props, or data before passing them on to a child component

Here's an example of a `smart-list` component that delegates to more specific components, depending on the props passed to it:

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

### `slots()` vs `children`

You may wonder why we need both `slots()` and `children`. Wouldn't `slots().default` be the same as `children`? In some cases, yes - but what if you have a functional component with the following children?

``` html
<my-functional-component>
  <p slot="foo">
    first
  </p>
  <p>second</p>
</my-functional-component>
```

For this component, `children` will give you both paragraphs, `slots().default` will give you only the second, and `slots().foo` will give you only the first. Having both `children` and `slots()` therefore allows you to choose whether this component knows about a slot system or perhaps delegates that responsibility to another component by simply passing along `children`.

## Template Compilation

You may be interested to know that Vue's templates actually compile to render functions. This is an implementation detail you usually don't need to know about, but if you'd like to see how specific template features are compiled, you may find it interesting. Below is a little demo using `Vue.compile` to live-compile a template string:

{% raw %}
<div id="vue-compile-demo" class="demo">
  <textarea v-model="templateText" rows="10"></textarea>
  <div v-if="typeof result === 'object'">
    <label>render:</label>
    <pre><code>{{ result.render }}</code></pre>
    <label>staticRenderFns:</label>
    <pre v-for="(fn, index) in result.staticRenderFns"><code>_m({{ index }}): {{ fn }}</code></pre>
  </div>
  <div v-else>
    <label>Compilation Error:</label>
    <pre><code>{{ result }}</code></pre>
  </div>
</div>
<script>
new Vue({
  el: '#vue-compile-demo',
  data: {
    templateText: '\
<div>\n\
  <h1>I\'m a template!</h1>\n\
  <p v-if="message">\n\
    {{ message }}\n\
  </p>\n\
  <p v-else>\n\
    No message.\n\
  </p>\n\
</div>\
    ',
  },
  computed: {
    result: function () {
      if (!this.templateText) {
        return 'Enter a valid template above'
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

}
</style>
{% endraw %}
