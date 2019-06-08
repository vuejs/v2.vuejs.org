---
title: Funciones de renderizado & JSX
type: guide
order: 303
---

## Lo esencial

Vue recomienda utilizar plantillas para construir su HTML en la gran mayoría de los casos. Sin embargo, hay situaciones en las que usted realmente necesita el poder programático completo de JavaScript. Ahí es donde puede usar la **función render**, una alternativa más cercana al compilador para las plantillas.

Vayamos a un ejemplo simple donde una función `render` sería práctica. Digamos que usted quiere generar encabezados anclados:

``` html
<h1>
  <a name="hello-world" href="#hello-world">
    Hola mundo!
  </a>
</h1>
```

Para el código HTML anterior, usted decide que desea esta interfaz de componente:

``` html
<anchored-heading :level="1">Hola mundo!</anchored-heading>
```

Cuando usted comienza con un componente que solo genera un encabezado basado en la prop `level`, rápidamente llega a esto:

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

Esa plantilla no se siente muy bien. No solo es detallado, sino que estamos duplicando `<slot></slot>` para cada nivel de encabezado y tendremos que hacer lo mismo cuando agreguemos el elemento delimitador.

Si bien las plantillas funcionan bien para la mayoría de los componentes, está claro que este no es uno de ellos. Así que intentemos reescribirlo con una función `render`:

``` js
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // nombre de etiqueta
      this.$slots.default // arreglo de hijos
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

¡Mucho más simple! El código es más corto, pero también requiere una mayor familiaridad con las propiedades de la instancia de Vue. En este caso, debe saber que cuando pasa hijos sin un atributo `slot` a un componente, como el `¡Hola mundo!` dentro de `anchored-heading`, esos hijos se almacenan en la instancia del componente en `$slots.default`. Si no usted no lo ha hecho ya, **es recomendable que lea [API de propiedades de instancia](../api/#Instance-Properties) antes de ahondar en las funciones render.**

## Nodos, árboles y el DOM virtual

Antes de sumergirnos en las funciones de render, es importante saber un poco sobre cómo funcionan los navegadores. Tome este HTML por ejemplo:

```html
<div>
  <h1>Mi titulo</h1>
  Cierto texto de contenido
  <!-- TODO: Añadir lema  -->
</div>
```

Cuando un navegador lee este código, construye un [árbol de "nodos DOM"](https://javascript.info/dom-nodes) para ayudarlo a realizar un seguimiento de todo, tal como podría crear un árbol genealógico para realizar un seguimiento de su familia completa.

El árbol de nodos del DOM para el HTML anterior se ve así:

![Visualización del árbol DOM](/images/dom-tree.png)

Cada elemento es un nodo. Cada pieza de texto es un nodo. Incluso los comentarios son nodos! Un nodo es solo una parte de la página. Y como en un árbol genealógico, cada nodo puede tener hijos (es decir, cada pieza puede contener otras piezas).

Actualizar todos estos nodos de manera eficiente puede ser difícil, pero afortunadamente, nunca tiene que hacerlo manualmente. En cambio, le dices a Vue qué HTML quieres en la página, en una plantilla:

```html
<h1>{{ blogTitle }}</h1>
```

O una función render:

``` js
render: function (createElement) {
  return createElement('h1', this.blogTitle)
}
```

En ambos casos, Vue mantiene la página actualizada automáticamente, incluso cuando `blogTitle` cambie.

### El Virtual DOM

Vue logra esto al crear un **DOM virtual** para realizar un seguimiento de los cambios que debe realizar en el DOM real. Mirando de cerca esta línea:

``` js
return createElement('h1', this.blogTitle)
```

¿Qué está devolviendo `createElement`? No es _exactamente_ un elemento DOM real. Tal vez podría llamarse con más precisión `createNodeDescription`, ya que contiene información que describe a Vue qué tipo de nodo debe representar en la página, incluidas las descripciones de los nodos hijos. Llamamos a esta descripción de nodo "nodo virtual", generalmente abreviado a **VNode**. "DOM virtual" es lo que llamamos el árbol completo de `VNodes`, construido por un árbol de componentes de Vue.

## Argumentos `createElement`

Lo siguiente con lo que tendrá que familiarizarse es cómo usar las características de la plantilla en la función `createElement`. Aquí están los argumentos que `createElement` acepta:

``` js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // Un nombre de etiqueta HTML, opciones de componente o asíncrono
  // función resolviendo a uno de estos. Necesario.
  'div',

  // {Object}
  // Un objeto de datos correspondiente a los atributos
  // que usaría en una plantilla. Opcional.
  {
    // (Vea los detalles en la siguiente sección a continuación.)
  },

  // {String | Array}
  // VNodes hijos, construidos usando `createElement ()`,
  // o usando cadenas de texto para obtener 'VNodes de texto'. Opcional.
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

### El objeto de datos en profundidad

Una cosa a tener en cuenta: similar a cómo `v-bind:class` y` v-bind:style` tienen un tratamiento especial en las plantillas, tienen sus propios campos de nivel superior en los objetos de datos VNode. Este objeto también le permite enlazar atributos HTML normales así como propiedades del DOM como `innerHTML` (esto reemplazaría la directiva `v-html`):

``` js
{
  // La misma API que `v-bind:class`, aceptando cualquiera
  // una cadena de texto, objeto, o arreglo de cadenas de texto y objetos.
  class: {
    foo: true,
    bar: false
  },
  // La misma API que `v-bind:style`, aceptando cualquiera
  // una cadena de texto, objeto o arreglo de objetos.
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // Atributos normales de HTML
  attrs: {
    id: 'foo'
  },
  // props del componente
  props: {
    myProp: 'bar'
  },
  // propiedades DOM
  domProps: {
    innerHTML: 'baz'
  },
  // Los controladores de eventos están anidados bajo `on`, aunque
  // los modificadores como en `v-on:keyup.enter` no son
  // soportados. Usted tendrá que revisar manualmente la
  // keyCode en el controlador en su lugar.
  on: {
    click: this.clickHandler
  },
  // Sólo para componentes. Te permite escuchar
  // eventos nativos, en lugar de eventos emitidos desde
  // el componente usando `vm.$emit`.
  nativeOn: {
    click: this.nativeClickHandler
  },
  // Directivas personalizadas. Tenga en cuenta que la 'vinculación'
  // `oldValue` no se puede configurar, ya que Vue realiza un seguimiento
  // de eso para usted.
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
  // Slots acotados en la forma
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // El nombre del slot, si este componente es el
  // hijo de otro componente
  slot: 'name-of-slot',
  // Otras propiedades especiales de nivel superior
  key: 'myKey',
  ref: 'myRef',
  // Si está aplicando el mismo nombre de referencia a múltiples
  // elementos en la función de render. Esto hará que `$refs.myRef` se convierta en un
  // arreglo
  refInFor: true
}
```

### Ejemplo Completo

Con este conocimiento, ahora podemos terminar el componente que comenzamos:

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
    // cree un id en formato kebab
    var headingId = getChildrenTextContent(this.$slots.default)
      .toLowerCase()
      .replace(/\W+/g, '-')
      .replace(/(^-|-$)/g, '')

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

### Restricciones

#### VNodes Deben ser únicos

Todos los VNodes en el árbol de componentes deben ser únicos. Eso significa que la siguiente función de render no es válida:

``` js
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // Atención - VNodes duplicados!
    myParagraphVNode, myParagraphVNode
  ])
}
```

Si realmente quiere duplicar el mismo elemento/componente muchas veces, puede hacerlo con una función de fábrica. Por ejemplo, la siguiente función de representación es una forma perfectamente válida de representar 20 párrafos idénticos:

``` js
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```

## Reemplazando las funcionalidades de la plantilla con JavaScript plano

### `v-if` y `v-for`

Donde sea que se pueda lograr algo fácilmente en JavaScript simple, las funciones de renderización de Vue no proporcionan una alternativa propietaria. Por ejemplo, en una plantilla usando `v-if` y `v-for`:

``` html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>No se encontraron ítems.</p>
```

Esto podría ser reescrito con los `if`/`else` y `map` de JavaScript en una función de renderización:

``` js
props: ['items'],
render: function (createElement) {
  if (this.items.length) {
    return createElement('ul', this.items.map(function (item) {
      return createElement('li', item.name)
    }))
  } else {
    return createElement('p', 'No se encontraron ítems.')
  }
}
```

### `v-model`

No hay una contraparte directa de `v-model` en las funciones de renderización, tendrá que implementar la lógica usted mismo:

``` js
props: ['value'],
render: function (createElement) {
  var self = this
  return createElement('input', {
    domProps: {
      value: self.value
    },
    on: {
      input: function (event) {
        self.$emit('input', event.target.value)
      }
    }
  })
}
```

Este es el costo de ir a un nivel inferior, pero también le da mucho más control sobre los detalles de interacción en comparación con el `v-model`.

### Modificadores de eventos y claves

Para los modificadores de eventos `.passive`,` .capture` y `.once`, Vue ofrece prefijos que se pueden usar con` on`:

| Modificador(es) | Prefijo |
| ------ | ------ |
| `.passive` | `&` |
| `.capture` | `!` |
| `.once` | `~` |
| `.capture.once` or<br>`.once.capture` | `~!` |

Por ejemplo:

```javascript
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  '~!mouseover': this.doThisOnceInCapturingMode
}
```

Para todos los demás modificadores de evento y clave, no es necesario ningún prefijo propietario, porque puede usar métodos de evento en el controlador:

| Modificador(es) | Equivalente en el Manejador |
| ------ | ------ |
| `.stop` | `event.stopPropagation()` |
| `.prevent` | `event.preventDefault()` |
| `.self` | `if (event.target !== event.currentTarget) return` |
| claves:<br>`.enter`, `.13` | `if (event.keyCode !== 13) return` (cambia `13` a [otro código clave](http://keycode.info/) para otros modificadores clave) |
| Teclas modificadoras:<br>`.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return` (cambia `ctrlKey` a `altKey`, `shiftKey`, o `metaKey`, respectivamente) |

Aquí hay un ejemplo con todos estos modificadores usados juntos:

```javascript
on: {
  keyup: function (event) {
    // Cancelar si el elemento que emite el evento no es
    // el elemento al que está vinculado el evento
    if (event.target !== event.currentTarget) return
    // Abortar si la clave que subió no es el `enter`.
    // tecla (13) y la tecla `shift` no se mantuvo presionada
    // al mismo tiempo
    if (!event.shiftKey || event.keyCode !== 13) return
    // Detener la propagación del evento
    event.stopPropagation()
    // Impedir el manejador de teclas predeterminado para este elemento
    event.preventDefault()
    // ...
  }
}
```

### Slots

Puede acceder a los contenidos de las ranuras estáticas como Arrays de VNodes desde [`this.$slots`](../api/#vm-slots):

``` js
render: function (createElement) {
  // `<div><slot></slot></div>`
  return createElement('div', this.$slots.default)
}
```

Y acceder a los slots con alcance como funciones que devuelven VNodes desde  [`this.$scopedSlots`](../api/#vm-scopedSlots):

``` js
props: ['message'],
render: function (createElement) {
  // `<div><slot :text="message"></slot></div>`
  return createElement('div', [
    this.$scopedSlots.default({
      text: this.message
    })
  ])
}
```

Para pasar slots con alcance a un componente secundario utilizando funciones de representación, use el campo `scopedSlots` en los datos de un VNode:

``` js
render: function (createElement) {
  return createElement('div', [
    createElement('child', {
      // pasar `scopedSlots` en el objeto de datos
      // en la forma de { name: props => VNode | Array<VNode> }
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

If you're writing a lot of `render` functions, it might feel painful to write something like this:

Si estás escribiendo muchas funciones `render`, puede que te resulte doloroso escribir algo como esto:

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

Especialmente cuando la versión de la plantilla es tan simple en comparación:

``` html
<anchored-heading :level="1">
  <span>Hola</span> mundo!
</anchored-heading>
```

Es por eso que hay una [librería Babel](https://github.com/vuejs/babel-plugin-transform-vue-jsx) para utilizar JSX con Vue, lo que nos permite volver a una sintaxis más cercana a las plantillas:

``` js
import AnchoredHeading from './AnchoredHeading.vue'

new Vue({
  el: '#demo',
  render: function (h) {
    return (
      <AnchoredHeading level={1}>
        <span>Hola</span> mundo!
      </AnchoredHeading>
    )
  }
})
```

<p class="tip">Generar el alias `createElement` a `h` es una convención común que verá en el ecosistema Vue y en realidad es necesaria para JSX. Si `h` no está disponible en el alcance, su aplicación arrojará un error.</p>

Para obtener más información sobre cómo JSX se asigna a JavaScript, consulte la [documentación de uso](https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage).

## Componentes Functionales

El componente de encabezado anclado que creamos anteriormente es relativamente simple. No gestiona ningún estado, observa cómo se le pasa ningún estado y no tiene métodos de ciclo de vida. En realidad, es solo una función con algunas propiedades.

En casos como este, podemos marcar los componentes como "funcionales", lo que significa que no tienen estado (no [datos reactivos](../api/#Options-Data)) y sin instancia (no hay contexto `this`). Un **componente funcional** se ve así:

``` js
Vue.component('my-component', {
  functional: true,
  // Las props son opcionalews
  props: {
    // ...
  },
  // Para compensar la falta de una instancia,
  // ahora se nos proporciona un segundo argumento de contexto.
  render: function (createElement, context) {
    // ...
  }
})
```

> Nota: en las versiones anteriores a 2.3.0, la opción `props` es necesaria si desea aceptar props en un componente funcional. En 2.3.0+ puede omitir la opción `props` y todos los atributos encontrados en el nodo componente se extraerán implícitamente como props.

En 2.5.0+, si está utilizando [componentes de un solo archivo](single-file-components.html), los componentes funcionales basados en plantillas se pueden declarar con:

``` html
<template functional>
</template>
```

Todo lo que necesita el componente se pasa a través de `contexto`, que es un objeto que contiene:

- `props`: Un objeto de las propiedades proporcionadas
- `children`: Un arreglo de los VNode hijos
- `slots`: Una función retornando un objeto slots
- `data`: El objeto entero [objecto data](#The-Data-Object-In-Depth), pasado al  componente como segundo argumento de `createElement`
- `parent`: Una referencia al componente padre
- `listeners`: (2.3.0+) Un objeto que contiene listeners de eventos registrados por los padres. Este es un alias de `data.on`
- `injections`: (2.3.0+) si está usando la opción [`inject`](../api/#provide-inject) esto contendrá inyecciones resueltas.

Después de agregar `function: true`, actualizar la función de procesamiento de nuestro componente de encabezado anclado requeriría agregar el argumento` context`, actualizar `this.$Slots.default` a` context.children`, luego actualizar `this.level` a `context.props.level`.

Dado que los componentes funcionales son solo funciones, son mucho más baratos de representar. Sin embargo, la falta de una instancia persistente significa que no se mostrarán en el árbol de componentes [Vue devtools](https://github.com/vuejs/vue-devtools).

También son muy útiles como componentes de envoltura. Por ejemplo, cuando necesitas:

- Elija programáticamente uno de varios otros componentes para delegar a
- Manipule hijos, propiedades o datos antes de pasarlos a un componente hijo.

Aquí hay un ejemplo de un componente de `lista-inteligente` (`smart-list`) que delega en componentes más específicos, dependiendo de las propiedades que se le pasen:

``` js
var EmptyList = { /* ... */ }
var TableList = { /* ... */ }
var OrderedList = { /* ... */ }
var UnorderedList = { /* ... */ }

Vue.component('smart-list', {
  functional: true,
  props: {
    items: {
      type: Array,
      required: true
    },
    isOrdered: Boolean
  },
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
  }
})
```

### Pasar atributos y eventos a elementos/componentes hijos

En los componentes normales, los atributos no definidos como props se agregan automáticamente al elemento raíz del componente, reemplazando o [fusionando inteligentemente con](class-and-style.html) cualquier atributo existente del mismo nombre.

Sin embargo, los componentes funcionales requieren que se defina explícitamente este comportamiento:

```js
Vue.component('my-functional-button', {
  functional: true,
  render: function (createElement, context) {
    // Transparentemente pase cualquier atributo, listeners de eventos, hijos, etc.
    return createElement('button', context.data, context.children)
  }
})
```

Al pasar `context.data` como segundo argumento a `createElement`, estamos transmitiendo los atributos o listeners de eventos utilizados en `my-function-button`. De hecho, es tan transparente que los eventos ni siquiera requieren el modificador `.native`.

Si está utilizando componentes funcionales basados en plantillas, también tendrá que agregar atributos y listeners manualmente. Ya que tenemos acceso a los contenidos de contexto individuales, podemos usar `data.attrs` para pasar cualquier atributo HTML y` listeners` _(el alias para `data.on`)_ para pasar a lo largo de cualquier evento.

```html
<template functional>
  <button
    class="btn btn-primary"
    v-bind="data.attrs"
    v-on="listeners"
  >
    <slot/>
  </button>
</template>
```

### `slots()` vs `children`

Quizás se pregunte por qué necesitamos tanto `slots()` como `children`. ¿No sería `slots().default` igual que `children`? En algunos casos, sí, pero ¿qué sucede si tiene un componente funcional con los siguientes hijos?

``` html
<my-functional-component>
  <p slot="foo">
    Primero
  </p>
  <p>segundo</p>
</my-functional-component>
```

Para este componente, `children` le dará ambos párrafos,` slots().default` le dará solo el segundo, y `slots ().foo` le dará solo el primero. Por lo tanto, tener `children` y `slots()` le permite elegir si este componente conoce un sistema de tragamonedas o tal vez delegue esa responsabilidad a otro componente al transmitir `children`.

## Compilación de plantillas

You may be interested to know that Vue's templates actually compile to render functions. This is an implementation detail you usually don't need to know about, but if you'd like to see how specific template features are compiled, you may find it interesting. Below is a little demo using `Vue.compile` to live-compile a template string:

Tal vez le interese saber que las plantillas de Vue realmente se compilan para representar funciones. Este es un detalle de implementación que normalmente no necesita conocer, pero si desea ver cómo se compilan las funcionalidades específicas de la plantilla, puede que le resulte interesante. A continuación se muestra una pequeña demostración que usa `Vue.compile` para compilar en vivo una cadena de plantilla

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
    <label>Error de compilación:</label>
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
    <h1>I\'m a template!</h1>\n\
  </header>\n\
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
