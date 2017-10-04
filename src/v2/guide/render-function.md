---
title: Funções de Renderização & JSX
type: guide
order: 303
---

## Introdução

Vue recomenda que _templates_ sejam utilizados para construir seu HTML na grande maioria dos casos. Haverá situações, no entanto, em que você irá realmente precisar de todo o poder de programação do JavaScript. É quando você pode usar a **função `render`**, uma alternativa aos _templates_ que é mais diretamente vinculada ao compilador.

Vamos mergulhar em um simples exemplo onde a função `render` seria prática. Digamos que você quer gerar links em cabeçalhos (_headings_):

``` html
<h1>
  <a name="alo-mundo" href="#alo-mundo">
    Olá Mundo!
  </a>
</h1>
```

Para o código HTML acima, você decide que quer esta interface para o seu componente:

``` html
<anchored-heading :nivel="1">Olá Mundo!</anchored-heading>
```

<<<<<<< HEAD
Quando você começar a criar o componente de modo que gere os cabeçalhos de acordo com a propriedade `nivel`, rapidamente chegará a algo assim:
=======
When you get started with a component that only generates a heading based on the `level` prop, you quickly arrive at this:
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

``` html
<script type="text/x-template" id="anchored-heading-template">
  <h1 v-if="nivel === 1">
    <slot></slot>
  </h1>
  <h2 v-else-if="nivel === 2">
    <slot></slot>
  </h2>
  <h3 v-else-if="nivel === 3">
    <slot></slot>
  </h3>
  <h4 v-else-if="nivel === 4">
    <slot></slot>
  </h4>
  <h5 v-else-if="nivel === 5">
    <slot></slot>
  </h5>
  <h6 v-else-if="nivel === 6">
    <slot></slot>
  </h6>
</script>
```

``` js
Vue.component('anchored-heading', {
  template: '#anchored-heading-template',
  props: {
    nivel: {
      type: Number,
      required: true
    }
  }
})
```

Esse _template_ não está passando uma boa sensação. Não é apenas extenso, ele inclusive duplica `<slot></slot>` para cada nível de cabeçalho, e teríamos que fazer o mesmo ao incluirmos um elemento `<a>`.

Enquanto _templates_ funcionam muito bem para a maioria dos componentes, está claro que este caso é uma exceção. Então vamos tentar reescrevê-lo usando uma função `render`:

``` js
Vue.component('anchored-heading', {
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

Muito mais simples! Mais ou menos. O código é menor, mas requer maior familiaridade com as propriedades de uma instância Vue. Neste caso, você precisa saber que quando você inclui elementos filho em seu componente, sem especificar um atributo `slot`, como o `Olá Mundo!` dentro de `anchored-heading`, esses elementos estão acessíveis na instância do componente através de `$slots.default`. Se você ainda não leu, **é altamente recomendado que leia a seção da API de [propriedades da instância](../api/#Instance-Properties) antes de se aprofundar em funções `render`**.

## Nós, Árvores e DOM Virtual

Antes de nos aprofundarmos nas funções de renderização, é importante saber um pouco sobre como os navegadores trabalham. Considere este HTML como exemplo:

```html
<div>
  <h1>My title</h1>
  Some text content
  <!-- TODO: Add tagline -->
</div>
```

Quando um navegador lê esse código, ele compila uma [árvore de "nós DOM"](https://javascript.info/dom-nodes) para ajudar a manter o controle sobre todas as coisas, assim como você poderia querer construir uma árvore genealógica para manter o controle sobre a estensão de sua família.

A árvore de nós DOM para o HTML acima aparentaria isso:

![Visualização da Árvore DOM](/images/dom-tree.png)

<<<<<<< HEAD
Cada elemento é um nó. Cada pedaço de texto é um nó. Até mesmo comentários são nós! Um nó é simplesmente um pedaço da página. E assim como na árvore genealógica, cada nó tem filhos (ou seja, cada pedaço pode conter outros pedaços dentro).

Atualizar todos esses nós eficientemente pode ser difícil, mas por sorte você nunca precisará fazer isso manualmente. Você apenas avisa o Vue qual HTML você quer em uma página, através de um _template_:
=======
Every element is a node. Every piece of text is a node. Even comments are nodes! A node is just a piece of the page. And as in a family tree, each node can have children (i.e. each piece can contain other pieces).

Updating all these nodes efficiently can be difficult, but thankfully, you never have to do it manually. Instead, you tell Vue what HTML you want on the page, in a template:
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

```html
<h1>{{ blogTitle }}</h1>
```

Ou uma função de renderização:

``` js
render: function (createElement) {
  return createElement('h1', this.blogTitle)
}
```

E em ambos os casos, Vue automaticamente mantém a página atualizada, mesmo se `blogTitle` mudar.

### DOM Virtual

Vue realiza isto través da construção de um **DOM Virtual** para manter o controle das mudanças que ele precisa aplicar no DOM real. Dê uma olhada mais de perto nesta linha:

``` js
return createElement('h1', this.blogTitle)
```

O que a função `createElement` retornará? Não é _exatamente_ um elemento DOM real. Poderíamos chamar mais precisamente de `createNodeDescription`, uma vez que conterá a descrição para o Vue do tipo de nó a renderizar na página, incluindo as descrições de quaisquer nós filhos. Nós chamamos esta descrição de "nó virtual", usualmente abreviado em inglês como **VNode**. "DOM Virtual" é como nós chamamos a árvore de VNodes completa, construída através da árvore de componentes Vue.

## Parâmetros para `createElement`

A próxima coisa com a qual você precisa se familiarizar é como utilizar os recursos disponíveis em _templates_ na função `createElement`. Estes são os parâmetros que `createElement` aceita:

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
<<<<<<< HEAD
  // VNodes filhos, mas usando `createElement()`,
  // ou apenas Strings para 'VNodes textuais'. Opcional.
=======
  // Children VNodes, built using `createElement()`,
  // or using strings to get 'text VNodes'. Optional.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454
  [
    'Algum texto vem primeiro.',
    createElement('h1', 'Um título')
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```

### O Objeto de Dados em Detalhes

Importante observar: assim como `v-bind:class` e `v-bind:style` têm tratamento especial em _templates_, eles têm suas respectivas propriedades no primeiro nível de um objeto de dados VNode.

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
  // Manipuladores de eventos são declarados dentro de
  // `on`, porém modificadores como em `v-on:keyup.enter`
  // não são suportados. Você terá que verificar
  // manualmente o keyCode do evento no código.
  on: {
    click: this.clickHandler
  },
  // Somente para componentes. Permite a escuta a
  // eventos nativos, ao invés de eventos emitidos
  // pelo componente através de `vm.$emit`.
  nativeOn: {
    click: this.nativeClickHandler
  },
  // Diretivas customizadas. Veja que como o bind de
  // oldValue não pode ser setado, o Vue continua mantendo
  // o valor dele para você
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
  // Slot na forma de
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // O nome do slot, se este componente é
  // filho de outro componente
  slot: 'name-of-slot'
  // Outras propriedades especiais de primeiro nível
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

Vue.component('anchored-heading', {
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

Se você realmente quiser duplicar o mesmo elemento ou componente várias vezes, você pode fazê-lo com uma função _factory_. Por exemplo, a seguinte função `render` contém uma forma perfeitamente válida de renderizar 20 parágrafos idênticos:

``` js
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'oi')
    })
  )
}
```

## Substituindo _templates_ por Código JavaScript

### `v-if` e `v-for`

Sempre que algo possa ser facilmente realizado em código JavaScript tradicional, as funções de renderização não oferecerão alternativas específicas. Por exemplo, em _templates_ usando `v-if` e `v-for`:

``` html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>Nenhum item encontrado.</p>
```

Isto poderia ser reescrito com `if`/`else` e `map` do JavaScript, em uma função `render`:

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

Não existe contrapartida direta de `v-model` em funções de renderização - você terá que implementar a lógica por si próprio:

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

Este é o custo de ir para um nível mais baixo, mas também oferece muito mais controle sobre os detalhes da interação em comparação ao `v-model`.

### Eventos e Modificadores

Para modificadores de eventos `.passive`, `.capture` e `.once`, Vue oferece prefixos que podem ser usandos em conjunto com `on`:

| Modificador | Prefixo |
| ------ | ------ |
| `.passive` | `&` |
| `.capture` | `!` |
| `.once` | `~` |
| `.capture.once` ou<br>`.once.capture` | `~!` |

Por exemplo:

```javascript
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  `~!mouseover`: this.doThisOnceInCapturingMode
}
```

<<<<<<< HEAD
Para todos os outros eventos e modificadores de teclado, nenhum prefixo proprietário é necessário, pois você pode simplesmente usar métodos do objeto `event` no código.
=======
For all other event and key modifiers, no proprietary prefix is necessary, because you can use event methods in the handler:
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

| Modificador | Equivalente no Código |
| ------ | ------ |
| `.stop` | `event.stopPropagation()` |
| `.prevent` | `event.preventDefault()` |
| `.self` | `if (event.target !== event.currentTarget) return` |
| Teclas:<br>`.enter`, `.13` | `if (event.keyCode !== 13) return` (troque `13` por [outro key code](http://keycode.info/) para outros modificadores) |
| Especiais:<br>`.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return` (troque `ctrlKey` por `altKey`, `shiftKey`, ou `metaKey`) |

Aqui está um exemplo com todos estes modificadores em conjunto:

```javascript
on: {
  keyup: function (event) {
    // Aborta se o elemento emitindo o evento não é
    // o elemento no qual o evento está vinculado
    if (event.target !== event.currentTarget) return
    // Aborta se a tecla acionada não foi o Enter (13)
    // e a tecla Shift não foi pressionada ao mesmo tempo
    if (!event.shiftKey || event.keyCode !== 13) return
    // Para a propagação do evento
    event.stopPropagation()
    // Previne a execução padrão do keyup para o elemento
    event.preventDefault()
    // ...
  }
}
```

### Slots

Você pode acessar conteúdo estáticos de _slots_ como Arrays de VNodes a partir de [`this.$slots`](../api/#vm-slots):

``` js
render: function (createElement) {
  // `<div><slot></slot></div>`
  return createElement('div', this.$slots.default)
}
```

E acessar _slots_ com escopo como funções que retornar VNodes a partir de [`this.$scopedSlots`](../api/#vm-scopedSlots):

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

Para passar _slots_ a um componente filho usando funções de renderização, use o campo `scopedSlots` nos dados do VNode:

``` js
render (createElement) {
  return createElement('div', [
    createElement('child', {
      // passe `scopedSlots` no objeto de dados
      // na forma de { name: props => VNode | Array<VNode> }
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

Se você estiver escrevendo muitas funções `render`, pode se tornar cansativo e passível de erros escrever muitas linhas de código como essas:

``` js
createElement(
  'anchored-heading', {
    props: {
      nivel: 1
    }
  }, [
    createElement('span', 'Alô'),
    ' Mundo!'
  ]
)
```

Especialmente quando a versão usando _template_ é tão simples em comparação:

``` html
<anchored-heading :nivel="1">
  <span>Alô</span> Mundo!
</anchored-heading>
```

Por isso há um [plugin para Babel](https://github.com/vuejs/babel-plugin-transform-vue-jsx) destinado à utilização de JSX com o Vue, nos trazendo de volta a uma sintaxe mais semelhante à utilizada em _templates_:

``` js
import AnchoredHeading from './AnchoredHeading.vue'

new Vue({
  el: '#demo',
  render (h) {
    return (
      <AnchoredHeading nivel={1}>
        <span>Alô</span> Mundo!
      </AnchoredHeading>
    )
  }
})
```

<p class="tip">Apelidar `createElement` como `h` é uma convenção comum que você verá na comunidade Vue e é necessária para o uso de JSX. Se `h` não estiver disponível no escopo, sua aplicação irá gerar um erro.</p>

Para mais informações sobre como JSX é mapeado para JavaScript, veja a [documentação de utilização](https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage).

## Componentes Funcionais

<<<<<<< HEAD
O componente de cabeçalho com _link_ que criamos anteriormente é relativamente simples. Ele não gerencia nenhum estado próprio, não observa nenhum estado passado para si, e não tem nenhum método ligado ao ciclo de vida da instância. Realmente, é apenas uma função com algumas propriedades.
=======
The anchored heading component we created earlier is relatively simple. It doesn't manage any state, watch any state passed to it, and it has no lifecycle methods. Really, it's only a function with some props.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

Em casos como este, nós podemos marcar componentes como `functional`, o que significa que eles são _stateless_ (sem estado, ou seja, sem `data`) e são _instanceless_ (sem instância, ou seja, sem o contexto `this`). Um **componente funcional** tem este formato:

``` js
Vue.component('meu-componente', {
  functional: true,
  // Para compensar a inexistência de uma instância,
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
> Nota: em versões anteriores a 2.3.0, a opção `props` é obrigatória se você deseja aceitar propriedades em um componente funcional. Em 2.3.0+ você pode omitir `props` e todos os atributos encontrados no nó do componente serão implicitamente extraídos como propriedades.

Tudo que um componente funcional necessitar é passado através de `context`, o qual é um objeto contendo:

- `props`: Um objeto com as propriedades
- `children`: Um Array de elementos VNode filhos
- `slots`: Uma função retornando um objeto _slots_
- `data`: Todo o objeto `data` passado ao componente
- `parent`: Uma referência ao componente pai
- `listeners`: (2.3.0+) Um objeto contendo escutas a eventos registradas pelo pai. É simplesmente um atalho para `data.on`
- `injections`: (2.3.0+) Se estiver usando a opção [`inject`](../api/#provide-inject), aqui estarão as injeções resolvidas

<<<<<<< HEAD
Após acrescentar `functional: true`, adaptar a função `render` do nosso componente de cabeçalho com _link_ iria requerer somente acrescentar o parâmetro `context`, e atualizar `this.$slots.default` para `context.children`, e por fim atualizar `this.level` para `context.props.level`.

Como componentes funcionais são apenas funções, eles são muito mais leves para renderizar. Entretanto, por carecer de uma instância persistente, eles não são exibidos na árvore de componentes do [Vue devtools](https://github.com/vuejs/vue-devtools).
=======
- `props`: An object of the provided props
- `children`: An array of the VNode children
- `slots`: A function returning a slots object
- `data`: The entire data object passed to the component
- `parent`: A reference to the parent component
- `listeners`: (2.3.0+) An object containing parent-registered event listeners. This is an alias to `data.on`
- `injections`: (2.3.0+) if using the [`inject`](../api/#provide-inject) option, this will contain resolved injections.

After adding `functional: true`, updating the render function of our anchored heading component would require adding the `context` argument, updating `this.$slots.default` to `context.children`, then updating `this.level` to `context.props.level`.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

Eles também são muito úteis como componentes encapsuladores. Por exemplo, quando você precisa:

- Programaticamente escolher um entre vários outros componentes para delegar
- Manipular _children_, _props_, ou _data_ antes de passá-los a componentes filhos

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

      if (items.length === 0) return EmptyList
      if (typeof items[0] === 'object') return TableList
      if (context.props.isOrdered) return OrderedList

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

Você pode ser perguntar por que nós precisamos de ambos - `slots()` e `children`. Não seria `slots().default` o mesmo que `children`? Em alguns casos, sim - mas o que aconteceria se você tivesse um componente funcional contendo os seguintes elementos filhos?

``` html
<meu-componente-funcional>
  <p slot="foo">primeiro</p>
  <p>segundo</p>
</meu-componente-funcional>
```

<<<<<<< HEAD
Para este componente, `children` lhe fornecerá ambos os parágrafos, enquanto `slots().default` lhe fornecerá apenas o segundo, e `slots().foo` lhe fornecerá apenas o primeiro. Tendo tanto `children` quanto `slots()` lhe permite escolher se este componente precisa saber sobre os _slots_ ou talvez apenas delegar tal responsabilidade para outro componente simplesmente passando adiante `children`.
=======
For this component, `children` will give you both paragraphs, `slots().default` will give you only the second, and `slots().foo` will give you only the first. Having both `children` and `slots()` therefore allows you to choose whether this component knows about a slot system or perhaps delegates that responsibility to another component by passing along `children`.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

## Compilação de Templates

Você pode estar interessado em saber que _templates_ do Vue são compilados para funções `render`. Este é um detalhe de implementação que você não necessita saber, mas se você quiser ver como _templates_ específicos ficam quando compilados, pode ser interessante. Abaixo uma pequena demonstração usando `Vue.compile` para compilar ao vivo uma String de _template_:

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
    <label>Erro de compilação:</label>
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
    <h1>Sou um template!</h1>\n\
  </header>\n\
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
        return 'Infome um template válido acima'
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
