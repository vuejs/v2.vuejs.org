---
title: Funções "render" (Renderização)
type: guide
order: 15
---

## Introdução

<<<<<<< HEAD:src/guide/render-function.md
Vue recomenda que templates sejam utilizados para construir seu HTML na grande maioria dos casos. Haverá situações, no entanto, em que você irá realmente precisar de todo o poder de programação do JavaScript. É quando você pode usar a **função "render"**, uma alternativa aos templates que é mais ligada ao compilador.
=======
Vue recommends using templates to build your HTML in the vast majority of cases. There are situations however, where you really need the full programmatic power of JavaScript. That's where you can use the **render function**, a closer-to-the-compiler alternative to templates.
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/render-function.md

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

Esse template não está bom. Não somente é prolixo, mas também estamos duplicando `<slot></slot>` para cada nível de cabeçalho, e teremos que fazer o mesmo quando incluirmos o elemento `<a>` para o link. E tudo está dentro de um elemento `div` inútil, somente porque componentes devem possuir exatamente um único elemento raiz (root).

Enquanto templates funcionam muito bem para a maioria dos componentes, está claro que este caso é uma exceção. Então vamos tentar re-escrever este componente usando uma função `render`:

``` js
Vue.component('linked-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.nivel,   // nome do elemento (tag)
      this.$slots.default // array de elementos filhos (children)
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

<<<<<<< HEAD:src/guide/render-function.md
Muito mais simples! Mais ou menos. O código é menor, mas requer maior familiaridade com as propriedades de uma instância Vue. Neste caso, você precisa saber que quando você inclui elementos filhos (children) em seu componente sem especificar um atributo `slot`, como o `Alô Mundo!` dentro de `linked-heading`, esses elementos estão acessíveis na instância do componente em `$slots.default`. Se você ainda não leu, **é recomendado que leia a seção [API - propriedades da instância](/api/#vm-slots) antes de se aprofundar em funções "render".**
=======
Much simpler! Sort of. The code is shorter, but also requires greater familiarity with Vue instance properties. In this case, you have to know that when you pass children without a `slot` attribute into a component, like the `Hello world!` inside of `anchored-heading`, those children are stored on the component instance at `$slots.default`. If you haven't already, **it's recommended to read through the [instance properties API](../api/#vm-slots) before diving into render functions.**
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/render-function.md

## Parâmetros para `createElement`

A segunda coisa com a qual você precisa se familiarizar é como utilizar as funcionalidades disponíveis em templates na função `createElement`. Estes são os parâmetros que `createElement` aceita:

``` js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // Um nome de elemento (tag) HTML, um objeto com opções de componente,
  // ou uma função retornando um dentre os anteriores. Requerido.
  'div',

  // {Object}
  // Um objeto de dados correspondendo aos atributos
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
<<<<<<< HEAD:src/guide/render-function.md
  // Diretivas customizadas. Veja que como o bind de 
  // oldValue não pode ser setado, o Vue contina continua mantendo
  // o valor dele para você
=======
  // Custom directives. Note that the binding's
  // oldValue cannot be set, as Vue keeps track
  // of it for you.
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/render-function.md
  directives: [
    {
      name: 'my-custom-directive',
      value: '2'
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
<<<<<<< HEAD:src/guide/render-function.md
  // O nome do slot (se o elemento for filho de um componente)
=======
  // Scoped slots in the form of
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // The name of the slot, if this component is the
  // child of another component
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/render-function.md
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
    nivel: {
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
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'oi')
    })
  )
}
```

## Substituindo Funcionalidades de Templates por Código JavaScript

<<<<<<< HEAD:src/guide/render-function.md
Sempre que algo possa ser facilmente realizado em código JavaScript, as funções de renderização do Vue não oferecerão uma alternativa específica. Por exemplo, em templates usando `v-if` e `v-for`:
=======
### `v-if` and `v-for`

Wherever something can be easily accomplished in plain JavaScript, Vue render functions do not provide a proprietary alternative. For example, in a template using `v-if` and `v-for`:
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/render-function.md

``` html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>Nenhum item encontrado.</p>
```

Isto poderia ser re-escrito com `if`/`else` e `map` do JavaScript, em uma função `render`:

``` js
render: function (createElement) {
  if (this.items.length) {
    return createElement('ul', this.items.map(function (item) {
      return createElement('li', item.name)
    }))
  } else {
    return createElement('p', 'Nenhum item encontrado.')
  }
}
```

### `v-model`

There is no direct `v-model` counterpart in render functions - you will have to implement the logic yourself:

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

This is the cost of going lower-level, but it also gives you much more control over the interaction details compared to `v-model`.

### Event & Key Modifiers

For the `.capture` and `.once` event modifiers, Vue offers prefixes that can be used with `on`:

| Modifier(s) | Prefix |
| ------ | ------ |
| `.capture` | `!` |
| `.once` | `~` |
| `.capture.once` or<br>`.once.capture` | `~!` |

For example:

```javascript
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  `~!mouseover`: this.doThisOnceInCapturingMode
}
```

For all other event and key modifiers, no proprietary prefix is necessary, because you can simply use event methods in the handler:

| Modifier(s) | Equivalent in Handler |
| ------ | ------ |
| `.stop` | `event.stopPropagation()` |
| `.prevent` | `event.preventDefault()` |
| `.self` | `if (event.target !== event.currentTarget) return` |
| Keys:<br>`.enter`, `.13` | `if (event.keyCode !== 13) return` (change `13` to [another key code](http://keycode.info/) for other key modifiers) |
| Modifiers Keys:<br>`.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return` (change `ctrlKey` to `altKey`, `shiftKey`, or `metaKey`, respectively) |

Here's an example with all of these modifiers used together:

```javascript
on: {
  keyup: function (event) {
    // Abort if the element emitting the event is not
    // the element the event is bound to
    if (event.target !== event.currentTarget) return
    // Abort if the key that went up is not the enter
    // key (13) and the shift key was not held down
    // at the same time
    if (!event.shiftKey || event.keyCode !== 13) return
    // Stop event propagation
    event.stopPropagation()
    // Prevent the default keyup handler for this element
    event.preventDefault()
    // ...
  }
}
```

### Slots

You can access static slot contents as Arrays of VNodes from [`this.$slots`](../api/#vm-slots):

``` js
render: function (createElement) {
  // <div><slot></slot></div>
  return createElement('div', this.$slots.default)
}
```

And access scoped slots as functions that return VNodes from [`this.$scopedSlots`](../api/#vm-scopedSlots):

``` js
render: function (createElement) {
  // <div><slot :text="msg"></slot></div>
  return createElement('div', [
    this.$scopedSlots.default({
      text: this.msg
    })
  ])
}
```

To pass scoped slots to a child component using render functions, use the `scopedSlots` field in VNode data:

``` js
render (createElement) {
  return createElement('div', [
    createElement('child', {
      // pass scopedSlots in the data object
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

Se você estiver escrevendo muitas funções `render`, pode se tornar penoso escrever muitas linhas de código dessa maneira:

``` js
createElement(
  'linked-heading', {
    props: {
      nivel: 1
    }
  }, [
    createElement('span', 'Alô'),
    ' Mundo!'
  ]
)
```

Especialmente quando a versão usando template é tão simples em comparação:

``` html
<linked-heading :nivel="1">
  <span>Alô</span> Mundo!
</linked-heading>
```

Por isso há um [plugin para o Babel](https://github.com/vuejs/babel-plugin-transform-vue-jsx) para utilização de JSX com o Vue, nos trazendo de volta a uma sintaxe mais semelhante à utilizada em templates:

``` js
import LinkedHeading from './LinkedHeading.vue'

new Vue({
  el: '#demo',
  render (h) {
    return (
      <LinkedHeading nivel={1}>
        <span>Alô</span> Mundo!
      </LinkedHeading>
    )
  }
})
```

<p class="tip">Apelidar `createElement` como `h` é uma convenção comum que você verá na comunidade Vue e é necessária para o JSX. Se `h` não estiver disponível no escopo, sua aplicação irá gerar um erro.</p>

Para mais informações sobre como JSX é mapeado para JavaScript, veja a [documentação de utilização](https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage).

## Componentes Funcionais

O componente de cabeçalho com link que criamos anteriormente é relativamente simples. Ele não gerencia nenhum estado (state), não observa nenhum estado passado para si, e não tem nenhum método ligado ao ciclo de vida da instância. Realmente, é apenas uma função com algumas propriedades (props).

Em casos como este, nós podemos marcar componentes como `functional`, que significa que eles são *stateless* (sem estado, ou seja, sem a propriedade `data`) e são *instanceless* (sem instância, ou seja, sem uso do contexto `this`). Um **componente funcional** se parece assim:

``` js
Vue.component('meu-componente', {
  functional: true,
  // Para a compensar a inexistência de uma instância,
  // é providenciado um segundo argumento: "context".
  render: function (createElement, context) {
    // ...
  },
  // Props são opcionais
  props: {
    // ...
  }
})
```

Tudo o que um componente funcional necessita é passado através de `context`, o qual é um objeto contendo:

- `props`: Um objeto com as "props" providenciadas
- `children`: Uma matriz (array) de elementos VNode filhos
- `slots`: Uma função retornando um objeto "slots"
- `data`: Todo o objeto `data` passado para o componente
- `parent`: Uma referência ao componente pai

Após acrescentar `functional: true`, adaptar a função `render` do nosso componente de cabeçalho com link iria requerer somente acrescentar o parâmetro `context`, e atualizar `this.$slots.default` para `context.children`, e por fim atualizar `this.level` para `context.props.level`.

<<<<<<< HEAD
Como componentes funcionais são apenas funções, eles são muito mais leves para renderizar. Eles também são muito úteis como componentes *wrapper*. Por exemplo, quando você precisa:
=======
Since functional components are just functions, they're much cheaper to render. However, this also mean that functional components don't show up in VueJS Chrome dev tools component tree.

They're also very useful as wrapper components.  For example, when you need to:
>>>>>>> refs/remotes/vuejs/master

- Programaticamente escolher um entre vários outros componentes para delegar
- Manipular *children*, *props*, ou *data* antes de passá-los a componentes filhos

Aqui está um exemplo de um componente `smart-list` que delega para componentes mais específicos, dependendo das propriedades (props) passadas a ele:

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

### `slots()` versus `children`

Você pode ser perguntar por que nós precisamos de ambos -  `slots()` e `children`. Não seria `slots().default` o mesmo que `children`? Em alguns casos, sim - mas o que aconteceria se você tivesse um componente funcional contendo os seguintes elementos filhos?

``` html
<meu-componente-funcional>
  <p slot="foo">
    first
  </p>
  <p>second</p>
</meu-componente-funcional>
```

Para este componente, `children` lhe fornecerá ambos os parágrafos, enquanto `slots().default` lhe fornecerá apenas o segundo, e `slots().foo` lhe fornecerá apenas o primeiro. Tendo tanto `children` quanto `slots()` lhe proporciona escolher se este componente precisa saber sobre os slots ou talvez apenas delegar tal responsabilidade para outro componente simplesmente passando adiante `children`.

## Compilação de Templates

Você pode estar interessado em saber que templates do Vue são compilados para funções `render`. Este é um detalhe de implementação que você não necessita saber, mas se você quiser ver como templates específicos ficam quando compilados, você pode achar interessante. Abaixo temos uma pequena demonstração usando `Vue.compile` para compilar ao vivo um string de template:

{% raw %}
<div id="vue-compile-demo" class="demo">
  <textarea v-model="templateText" rows="10"></textarea>
  <div v-if="typeof result === 'object'">
    <label>render:</label>
    <pre><code>{{ result.render }}</code></pre>
    <label>staticRenderFns:</label>
    <pre v-for="(fn, index) in result.staticRenderFns"><code>_m({{ index }}): {{ fn }}</code></pre>
    <pre v-if="!result.staticRenderFns.length"><code>{{ result.staticRenderFns }}</code></pre>
  </div>
  <div v-else>
    <label>Erro de Compilação:</label>
    <pre><code>{{ result }}</code></pre>
  </div>
</div>
<script>
new Vue({
  el: '#vue-compile-demo',
  data: {
    templateText: '\
<div>\n\
<<<<<<< HEAD:src/guide/render-function.md
  <h1>Sou um template!</h1>\n\
=======
  <header>\n\
    <h1>I\'m a template!</h1>\n\
  </header>\n\
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/render-function.md
  <p v-if="message">\n\
    {{ message }}\n\
  </p>\n\
  <p v-else>\n\
    Nenhuma mensagem.\n\
  </p>\n\
</div>\
    ',
  },
  computed: {
    result: function () {
      if (!this.templateText) {
        return 'Entre um template válido acima'
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
  font-family: monospace;
}
</style>
{% endraw %}
