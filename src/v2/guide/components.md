---
title: Componentes
type: guide
order: 11
---

## ¿Qué son los Componentes?

Los componentes son una de las características más poderosas de Vue. Ayudan a extener elementos básicos de HTML para encapsular código re-usable. En un nivel alto, los componentes son elementos personalizados a los cuales el compilador de Vue les agrega comportamiento. En algunos casos, también pueden verse como un elemento HTML nativo extendido con el atributo especial `is`.

## Usando los Componentes

### Registro

En las secciones anteriores hemos aprendido que podemos crear una instancia de Vue con:

``` js
new Vue({
  el: '#some-element',
  // opciones
})
```

Para registrar un componente global, puede usar `Vue.component(tagName, options)`. Por ejemplo:

``` js
Vue.component('my-component', {
  // opciones
})
```

<p class="tip">Note que Vue no obliga usar las [reglas W3C](http://www.w3.org/TR/custom-elements/#concepts) para los nombres personalizados de etiquetas (sólo minúsculas, deben contener un guión), pero seguir esta convención se considera una buena práctica.</p>

Una vez registrado, un componente puede ser usado en la plantilla de una instancia como elemento personalizado, `<my-component></my-component>`. Sólo asegúrese que el componente sea registrado **antes** que cree la instancia Vue raíz. Aquí hay un ejemplo completo:

``` html
<div id="example">
  <my-component></my-component>
</div>
```

``` js
// registro
Vue.component('my-component', {
  template: '<div>A custom component!</div>'
})

// creación de una instancia raíz
new Vue({
  el: '#example'
})
```

La cual renderizará:

``` html
<div id="example">
  <div>A custom component!</div>
</div>
```

{% raw %}
<div id="example" class="demo">
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<div>A custom component!</div>'
})
new Vue({ el: '#example' })
</script>
{% endraw %}

### Registro Local

No tiene que registrar globalmente todos los componentes. Puede hacer que un componente esté disponible únicamente en el ámbito de otro componente/instancia registrándolo con la opción `components` de la instancia: 

``` js
var Child = {
  template: '<div>A custom component!</div>'
}

new Vue({
  // ...
  components: {
    // <my-component> sólo estará disponible para la plantilla del padre
    'my-component': Child
  }
})
```

El mismo tipo de encapsulamiento aplica para otras características de Vue, como las directivas.

### Inconvenientes en el Análisis de Plantillas DOM

Cuando se usa el DOM como su plantilla (p.e. usando la opción `el` para montar un elemento con contenido existente), estará sujeto a ciertas restricciones que son inherentes a cómo funciona HTML, ya que Vue solo puede obtener el contenido de la plantilla **después** que el navegador lo haya analizado y normalizado. Notablemente, algunos elementos como `ul`, `<ol>`, `<table>` y `<select>` tienen restricciones sobre qué elementos pueden aparecer dentro de ellos, y algunos elementos como `<option>` únicamente pueden aparecer dentro de ciertos elementos.

Ésto puede causar problemas cuando se usan componentes personalizados con elementos que tienen dichas restricciones, por ejemplo:

``` html
<table>
  <my-row>...</my-row>
</table>
```

El componente `<my-row>` será marcado como contenido inválido, y asi, causará errores en la eventual renderización. Una solución sería usar el atributo especial `is`:

``` html
<table>
  <tr is="my-row"></tr>
</table>
```

**Debe ser recordado que éstas limitaciones no aplican si estamos usando plantillas string de algunas de las siguientes fuentes**:

- `<script type="text/x-template">`
- Plantillas string JavaScript en línea
- Componentes `.vue`

De modo que es preferible usar plantillas string siempre que sea posible.

### `data` Debe ser una Función

Muchas de las opciones que pueden ser enviadas al constructor de Vue pueden ser usadas en un componente, con un caso especial: `data` debe ser una función. De hecho, si usted intenta ésto:

``` js
Vue.component('my-component', {
  template: '<span>{{ message }}</span>',
  data: {
    message: 'hello'
  }
})
```

Vue se detendrá y emitirá advertencias en la consola, informando que `data` debe ser una función para instancias de componentes. Es bueno comprender por qué esta regla existe, así que hagamos trampa.

``` html
<div id="example-2">
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
</div>
```

``` js
var data = { counter: 0 }

Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  // data es técnicamente una función, de modo que Vue
  // no se quejará, pero estamos retornando la misma referencia
  // de objeto por cada instancia del componente
  data: function () {
    return data
  }
})

new Vue({
  el: '#example-2'
})
```

{% raw %}
<div id="example-2" class="demo">
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
</div>
<script>
var data = { counter: 0 }
Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  data: function () {
    return data
  }
})
new Vue({
  el: '#example-2'
})
</script>
{% endraw %}

Como las tres instancias de componente comparten el mismo objeto `data`, ¡incrementar un contador hace que todos sean incrementados!. Arreglemos ésto retornando un objeto de datos nuevo en cada caso:

``` js
data: function () {
  return {
    counter: 0
  }
}
```

Ahora cada uno de nuestros contadores cuenta con su propio estado interno:

{% raw %}
<div id="example-2-5" class="demo">
  <my-component></my-component>
  <my-component></my-component>
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  }
})
new Vue({
  el: '#example-2-5'
})
</script>
{% endraw %}

### Componiendo Componentes

Los componentes son pensados para ser usados juntos, de forma más común en relaciones padre-hijo: el componente A puede usar al componente B en su propia plantilla. Ellos inevitablemente necesitarán comunicarse el uno con el otro: el padre puede necesitar enviar datos hacia el hijo, y el hijo puede necesitar informar al padre de algo que ha sucedido en el hijo. Sin embargo, también es muy importante mantener al padre y al hijo tan desacoplados como sea posible usando interfaces claramente definidas. Esto asegura que el código de cada componente pueda ser escrito y pensado en un aislamiento relativo, así logrando ser más mantenibles y potencialmente más fáciles de usar.

En Vue.js, la relación de componentes padre-hijo puede ser resumida como **props bajan, eventos suben**. El padre envía datos "hacia abajo" al hijo usando **props**, y el hijo envía mensajes al padre "hacia arriba" usando **eventos**. Veamos como funciona a continuación:

<p style="text-align: center">
  <img style="width:300px" src="/images/props-events.png" alt="props bajan, eventos suben">
</p>

## Props

### Enviando datos con Props

Cada instancia de componente tiene su propio **ámbito aislado**. Ésto quiere decir que usted no puede (y no debe) referenciar directamente datos de un padre en la plantilla de sus componentes hijo. Los datos pueden ser enviados a los componentes hijo usando **props**.

Un prop es un atributo personalizado para enviar información desde los componente padres. Un componente hijo necesita declarar explícitamente los props que espera recibir usando la [opción `props`](../api/#props):

``` js
Vue.component('child', {
  // declare los props
  props: ['message'],
  // como cualquier dato, el prop puede ser usado dentro de plantillas
  // y también está disponible en el vm como this.message
  template: '<span>{{ message }}</span>'
})
```

Ahora podemos enviar un string sencillo de la siguiente forma:

``` html
<child message="hello!"></child>
```

Resultado:

{% raw %}
<div id="prop-example-1" class="demo">
  <child message="hello!"></child>
</div>
<script>
new Vue({
  el: '#prop-example-1',
  components: {
    child: {
      props: ['message'],
      template: '<span>{{ message }}</span>'
    }
  }
})
</script>
{% endraw %}

### camelCase versus kebab-case

Los atributos HTML no diferencian mayúsculas de minúsculas, de modo que cuando se usen en plantillas no-string, los nombres de prop en camelCase necesitan usar sus equivalentes kebab-case (delimitados por guión):

``` js
Vue.component('child', {
  // camelCase en JavaScript
  props: ['myMessage'],
  template: '<span>{{ myMessage }}</span>'
})
```

``` html
<!-- kebab-case en HTML -->
<child my-message="hello!"></child>
```

Para recordar, si está usando plantillas string, entonces esta limitación no aplica.

### Props dinámicos

Similar a cómo se asignan expresiones a atributos normales, también podemos usar `v-bind` para asignar dinámicamente props a datos en el padre. Siempre que los datos sean modificados en el padre, serán enviados también al hijo:

``` html
<div>
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
```

Es preferible usar la sintaxis corta para `v-bind`:

``` html
<child :my-message="parentMsg"></child>
```

Resultado:

{% raw %}
<div id="demo-2" class="demo">
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
<script>
new Vue({
  el: '#demo-2',
  data: {
    parentMsg: 'Message from parent'
  },
  components: {
    child: {
      props: ['myMessage'],
      template: '<span>{{myMessage}}</span>'
    }
  }
})
</script>
{% endraw %}

### Literal vs Dinámico

Un error común que cometen los principiantes es intentar enviar un número usando la sintaxis literal:

``` html
<!-- esto envía un string "1" -->
<comp some-prop="1"></comp>
```

Sin embargo, como es un prop literal, su valor es enviado como un string `"1"` en vez de un número. Si queremos enviar un número JavaScript, necesitamos usar `v-bind` de modo que su valor sea evaluado como una expresión JavaScript:

``` html
<!-- esto envía un número -->
<comp v-bind:some-prop="1"></comp>
```

### Flujo de datos en Una Dirección

Todos los props conforman una asignación **de una dirección** entre la propiedad hijo y la propiedad padre: cuando la propiedad padre se actualiza, los datos fluyen hacia el hijo, pero esto no sucede en caso contrario. Esto impide que los componentes hijo transformen accidentalmente el estado del padre, lo cual puede causar que el flujo de datos de su aplicación sea más difícil de entender.  

Adicionalmente, cada vez que el componente padre sea actualizado, todos los props en el componente hijo serán refrescados con el valor más actual. Esto quiere decir que usted **no debe** intentar transformar un prop dentro de un componente hijo. Si lo hace, Vue le hará una advertencia en la consola.

Usualmente existen dos casos donde es tentador transformar un prop:

1. El prop es usado únicamente para pasar un valor inicial, y el componente hijo quiere usarlo como una propiedad de datos depués de eso;

2. El prop es envíado como un valor básico que necesita ser transformado.

Las formas correctas de acercarse a éstos casos son:

1. Defina una propiedad de datos local que use el valor inicial del prop como su valor inicial.

  ``` js
  props: ['initialCounter'],
  data: function () {
    return { counter: this.initialCounter }
  }
  ```

2. Defina una propiedad calculada que se calcule usando el valor del prop:

  ``` js
  props: ['size'],
  computed: {
    normalizedSize: function () {
      return this.size.trim().toLowerCase()
    }
  }
  ```

<p class="tip">Tenga en cuenta que los objetos y los arrays en JavaScript son enviados por referencia, de modo que si el prop es un array o un objeto, transformarlo dentro del componente hijo **afectará** el estado del padre.</p>

### Validación de Props

Para un componente es posible especificar los requerimientos de los props que serán recibidos. Si un requerimiento no se cumple, Vue emitirá advertencias. Esto es especialmente útil cuando está creando un componente que pueda ser usado por otros.

En vez de definir los props como un array de strings, puede usar un objeto con requerimientos de validación:

``` js
Vue.component('example', {
  props: {
    // verificación de tipos básica (`null` significa que acepta 
    // cualquier tipo)
    propA: Number,
    // múltiples tipos posibles
    propB: [String, Number],
    // un string requerido
    propC: {
      type: String,
      required: true
    },
    // un número con un valor por defecto
    propD: {
      type: Number,
      default: 100
    },
    // objetos/arrays por defecto deben ser obtenidos de
    // una función generadora
    propE: {
      type: Object,
      default: function () {
        return { message: 'hello' }
      }
    },
    // función validadora personalizada
    propF: {
      validator: function (value) {
        return value > 10
      }
    }
  }
})
```

El  `type` puede ser uno de los siguientes constructores nativos:

- String
- Number
- Boolean
- Function
- Object
- Array

Adicionalmente, `type` puede ser también una función constructora y la verificación puede ser hecha con un `instanceof`.

Cuando la validación de un prop falla, Vue producirá una advertencia en la consola (si se usa la versión de desarrollo).

## Eventos Personalizados

Hemos aprendido que el padre puede enviar datos al hijo usando props, pero ¿cómo nos comunicamos de vuelta al padre cuando algo suceda? En este caso es cuando usamos el sistema de eventos personalizados de Vue.

### Usando `v-on` con Eventos Personalizados

Cada instancia Vue implementa una [interfaz de eventos](../api/#Intance-Methos-Events), lo cual quiere decir que puede:

- Escuchar un evento usando `$on(eventName)`
- Activar un evento usando `$emit(eventName)`

<p class="tip">Tenga en cuenta que el sistema de eventos de Vue es diferente al [API de EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget). Aunque funcionan de forma similar, `$on` y `$emit` __no son__ alias para `addEventListener` y `dispatchEvent`.</p>

Adicionalmente, un componente padre puede escuchar los eventos emitidos por un componente hijo usando directamente `v-on` en la plantilla donde el componente hijo es usado.

Aquí hay un ejemplo:

``` html
<div id="counter-event-example">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>
```

``` js
Vue.component('button-counter', {
  template: '<button v-on:click="increment">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    increment: function () {
      this.counter += 1
      this.$emit('increment')
    }
  },
})

new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})
```

{% raw %}
<div id="counter-event-example" class="demo">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>
<script>
Vue.component('button-counter', {
  template: '<button v-on:click="increment">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    increment: function () {
      this.counter += 1
      this.$emit('increment')
    }
  },
})
new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})
</script>
{% endraw %}

En este ejemplo, es importante notar que el componente hijo está todavía completamente desacoplado de lo que sucede fuera de él. Todo lo que hace es reportar información sobre su propia actividad, solo en caso que un padre pueda estar interesado.

#### Asignando Eventos Nativos a Componentes

Pueden haber momentos en que usted quiera escuchar un evento nativo en el elemento raíz de un componente. En estos casos, puede usar el modificador `.native` en `v-on`. Por ejemplo:

``` html
<my-component v-on:click.native="doTheThing"></my-component>
```

### Componentes de Campos de Formulario usando Eventos Personalizados

Los eventos personalizados también pueden ser usados para crear campos de ingreso personalizados que funcionan con `v-model`. Recuerde:

``` html
<input v-model="something">
```

Es sólo un adorno sintáctico para:

``` html
<input v-bind:value="something" v-on:input="something = $event.target.value">
```

Cuando es usado con un componente, se simplifica a:

``` html
<custom-input v-bind:value="something" v-on:input="something = arguments[0]"></custom-input>
```

De modo que para que un componente funcione con `v-model`, éste debe:

- aceptar un prop `value`
- emitir un evento `input` con el nuevo valor

Veamos ésto en acción con un campo de moneda muy sencillo:

``` html
<currency-input v-model="price"></currency-input>
```

``` js
Vue.component('currency-input', {
  template: '\
    <span>\
      $\
      <input\
        ref="input"\
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)"\
      >\
    </span>\
  ',
  props: ['value'],
  methods: {
    // En vez de actualizar el valor directamente, este
    // método es usado para darle formato y poner 
    // restricciones al valor del campo
    updateValue: function (value) {
      var formattedValue = value
        // Eliminar espacios en blanco de los extremos
        .trim()
        // Aproximar a dos dígitos decimales
        .slice(0, value.indexOf('.') + 3)
      // Si el valor no estaba normalizado,
      // sobreescríbalo manualmente para que concuerde
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      // Emita el valor numérico a través del evento input
      this.$emit('input', Number(formattedValue))
    }
  }
})
```

{% raw %}
<div id="currency-input-example" class="demo">
  <currency-input v-model="price"></currency-input>
</div>
<script>
Vue.component('currency-input', {
  template: '\
    <span>\
      $\
      <input\
        ref="input"\
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)"\
      >\
    </span>\
  ',
  props: ['value'],
  methods: {
    updateValue: function (value) {
      var formattedValue = value
        .trim()
        .slice(0, value.indexOf('.') + 3)
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      this.$emit('input', Number(formattedValue))
    }
  }
})
new Vue({ el: '#currency-input-example' })
</script>
{% endraw %}

La anterior implementación es bastante sencilla. Por ejemplo, permite a los usuarios ingresar múltiples puntos e incluso letras - ¡nada deseable! De modo que para aquellos que quieran ver un ejemplo nada trivial, aquí hay un filtro de moneda más robusto:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/1oqjojjx/embedded/result,html,js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

La interfaz de eventos también puede ser usada para crear más campos inusuales. Por ejemplo, imagine las posibilidades:

``` html
<voice-recognizer v-model="question"></voice-recognizer>
<webcam-gesture-reader v-model="gesture"></webcam-gesture-reader>
<webcam-retinal-scanner v-model="retinalImage"></webcam-retinal-scanner>
```

### Comunicación fuera de la relación Padre-Hijo

A veces dos componentes necesitan comunicarse entre ellos, pero no son padre/hijo uno del otro. En escenarios simples, puede usar una instancia Vue vacía como un bus de eventos central:

``` js
var bus = new Vue()
```
``` js
// en el método del componente A
bus.$emit('id-selected', 1)
```
``` js
// en el hook creado en el componente B
bus.$on('id-selected', function (id) {
  // ...
})
```

En casos más complejos, considere usar un [patrón de control de estado](state-management.html).

## Distribución de Contenido con Slots

Cuando se usan componentes, a menudo es requerido componerlos de la siguiente forma:

``` html
<app>
  <app-header></app-header>
  <app-footer></app-footer>
</app>
```

Hay dos cosas a tener en cuenta aquí:

1. El componente `<app>` no sabe cuál contenido estará presente dentro de su espacio de montaje. Es decidido por quien quiera que sea el componente padre que está usando `<app>`.

2. El componente `<app>` probablemente tiene su propia plantilla.

Para hacer que esta composición funcione, necesitamos una forma de entrelazar el "contenido" del padre con la plantilla del componente. Esto es un proceso llamado **distribución de contenido** (o "transclusión" si está familiarizado con Angular). Vue.js implementa un API de distribución de contenido que se modela a partir del actual [borrador de especificación de Componentes Web](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md), usando el elemento especial `<slot>` como salida de distribución para el contenido original.

### Ámbito de Compilación

Antes que nos sumerjamos en el API, primero aclaremos en cuál ámbito son compilados los contenidos. Imagine una plantilla como la siguiente:

``` html
<child-component>
  {{ message }}
</child-component>
```

¿Debería `message` estar asignado a los datos del padre? ¿O a los datos del hijo? La respuesta es en el padre. Una regla sencilla para el ámbito de componente es:

> Todo lo que se encuentre en la plantilla del padre es compilado en el ámbito del padre; todo lo que se encuentre en la plantilla del hijo es compilado en el ámbito del hijo.

Un error común es intentar asignar una directiva a una propiedad/método del hijo en la plantilla del padre:

``` html
<!-- NO funciona -->
<child-component v-show="someChildProperty"></child-component>
```

Asumiendo que `someChildProperty` sea una propiedad en el componente hijo, el ejemplo anterior no funcionará. La plantilla del padre no tiene conocimiento del estado de un componente hijo.

Si necesita asignar directivas de ámbito de hijos al nodo raíz de un componente, debe hacerlo en la propia plantilla del hijo:

``` js
Vue.component('child-component', {
  // Esto funciona ya que estamos en el ámbito correcto
  template: '<div v-show="someChildProperty">Child</div>',
  data: function () {
    return {
      someChildProperty: true
    }
  }
})
```

Similarmente, contenido distribuído será compilado en el ámbito del padre.

### Slot Único

El contenido padre será **desechado** a menos que la plantilla del componente hijo contenga al menos un elemento `<slot>`. Cuando sólo hay un slot sin atributos, el fragmento de contenido entero será insertado en su posición en el DOM, reemplazando dicho slot.

Cualquier cosa originalmente contenida dentro de etiquetas `<slot>` es considerada **contenido de recuperación**. El contenido de recuperación es compilado en el componente hijo y será mostrado únicamente si el elemento contenedor está vacío y no tiene contenido para ser insertado.

Suponga que tenemos un componente llamado `my-component` con la siguiente plantilla:

``` html
<div>
  <h2>Soy el título del hijo</h2>
  <slot>
    Ésto será mostrado sólo si no hay contenido
    para distribuir.
  </slot>
</div>
```

Y un padre que use el componente:

``` html
<div>
  <h1>Soy el título del padre</h1>
  <my-component>
    <p>Ésto es contenido original</p>
    <p>Ésto es más contenido original</p>
  </my-component>
</div>
```

El resultado renderizado será:

``` html
<div>
  <h1>Soy el título del padre</h1>
  <div>
    <h2>Soy el título del hijo</h2>
    <p>Ésto es contenido original</p>
    <p>Ésto es más contenido original</p>
  </div>
</div>
```

### Slots con Nombre

Los elementos `<slot>` tienen un atributo especial, `name`, el cual puede ser usado para personalizar aún más cómo el contenido debe ser distribuído. Puede tener múltiples slots con nombres diferentes. Un slot nombrado se va a emparejar con cualquier elemento que tenga el correspondiente atributo `slot` en el fragmento de contenido.

Todavía puede haber un slot sin nombre, el cual se considera el **slot por defecto** que funciona como una salida que captura todo contenido que no sea emparejado con nombre. Si no hay un slot por defecto, contenido sin nombre será desechado.

Por ejemplo, suponga que tenemos un componente `app-layout` con la siguiente plantilla:

``` html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

Markup del padre:

``` html
<app-layout>
  <h1 slot="header">Aquí puede haber un título</h1>

  <p>Un párrafo para el contenido principal.</p>
  <p>Y otro más.</p>

  <p slot="footer">Aquí hay información de contacto.</p>
</app-layout>
```

El resultado renderizado será:

``` html
<div class="container">
  <header>
    <h1>Aquí puede haber un título</h1>
  </header>
  <main>
    <p>Un párrafo para el contenido principal.</p>
    <p>Y otro más.</p>
  </main>
  <footer>
    <p>Aquí hay información de contacto.</p>
  </footer>
</div>
```

El API de distribución de contenido es un mecanismo múy útil cuando se desean componentes que deban ir juntos.

### Slots de ámbito

> Nuevo en 2.1.0

Un slot de ámbito es un tipo especial de slot que funciona como una plantilla reusable (a la que se puede enviar datos) en vez de elementos-ya-renderizados.

En un componente hijo, simplemente envíe datos a un slot como si estuviera enviando props a un componente:

``` html
<div class="child">
  <slot text="hello from child"></slot>
</div>
```

En un padre, un elemento `<template>` con un atributo especial `scope` indica que es una plantilla para un slot de ámbito. El valor de `scope` es el nombre de la variable temporal que contiene el objeto props enviado desde el hijo:

``` html
<div class="parent">
  <child>
    <template scope="props">
      <span>hello from parent</span>
      <span>{{ props.text }}</span>
    </template>
  </child>
</div>
```

Si renderizamos lo anterior, la salida será:

``` html
<div class="parent">
  <div class="child">
    <span>hello from parent</span>
    <span>hello from child</span>
  </div>
</div>
```

Un uso más típico para slots de ámbito podría ser un componente de lista que permita al consumidor del componente personalizar cómo debe ser renderizado cada elemento de la lista:

``` html
<my-awesome-list :items="items">
  <!-- los slots de ámbito pueden ser nombrados también -->
  <template slot="item" scope="props">
    <li class="my-fancy-item">{{ props.text }}</li>
  </template>
</my-awesome-list>
```

Y la plantilla para el componente lista:

``` html
<ul>
  <slot name="item"
    v-for="item in items"
    :text="item.text">
    <!-- contenido de recuperación aquí -->
  </slot>
</ul>
```

## Componentes Dinámicos

Puede usar el mismo punto de montura y dinámicamente cambiar entre varios componentes usando el elemento reservado `<componente>` y asignarlo dinámicamente a su atributo `is`:

``` js
var vm = new Vue({
  el: '#example',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})
```

``` html
<component v-bind:is="currentView">
  <!-- ¡el componente cambia siempre que vm.currentView cambie! -->
</component>
```

Si lo prefiere, también puede asignar directamente a objetos componente:

``` js
var Home = {
  template: '<p>Welcome home!</p>'
}

var vm = new Vue({
  el: '#example',
  data: {
    currentView: Home
  }
})
```

### `keep-alive`

Si usted desea mantener los componentes no visibles en la memoria para que pueda preservar su estado o evitar una re-renderización, puede envolver un componente dinámico en un elemento `<keep-alive>`:

``` html
<keep-alive>
  <component :is="currentView">
    <!-- ¡los componentes inactivos serán guardados en caché! -->
  </component>
</keep-alive>
```

Conozca más detalles sobre `<keep-alive>` en la [referencia API](../api/#keep-alive).

## Misceláneos

### Escribiendo Componentes Reusables

Cuando esté escribiendo componentes, es bueno tener en mente si desea reusarlo en algún otro lugar después. Está bien para componentes de un solo uso estar fuertemente acoplados, pero componentes reusables deben definir una interfaz pública limpia y no deben asumir sobre el contexto donde serán usados.

El API para un componente Vue viene en tres partes - props, eventos, y slots:

- **Props** permiten al ambiente externo enviar datos hacia el componente

- **Eventos** permiten al componente activar efectos secundarios en el ambiente externo

- **Slots** permiten al ambiente externo introducir contenido adicional al componente.

Con sintaxis cortas dedicadas para `v-bind` y `v-on`, las intenciones son claramente expresadas en la plantilla:

``` html
<my-component
  :foo="baz"
  :bar="qux"
  @event-a="doThis"
  @event-b="doThat"
>
  <img slot="icon" src="...">
  <p slot="main-text">Hello!</p>
</my-component>
```

### Referencias a Componentes Hijo

A pesar de la existencia de props y eventos, algunas veces usted querrá acceder a un componente hijo en JavaScript. Para lograr esto debe asignar un ID de referencia al componente hijo usando `ref`. Por ejemplo: 

``` html
<div id="parent">
  <user-profile ref="profile"></user-profile>
</div>
```

``` js
var parent = new Vue({ el: '#parent' })
// acceder a la instancia hijo
var child = parent.$refs.profile
```

Cuando `ref` es usada junto con `v-for`, la referencia que obtendrá será un array u objeto conteniendo lo componentes hijos reflejando la fuente de datos.

<p class="tip">Los `$refs` son poblados después que el componente haya sido renderizado, y no sea reactivo. Sólo se quiere que sea un mecanismo de emergencia para manipulación directa del hijo - debe evitar usar '$refs' en plantillas o propiedades calculadas.</p>

### Componentes Asíncronos

En aplicaciones grandes, podemos tener la necesidad de dividir la aplicación en pedazos más pequeños y sólo cargar un componente desde el servidor cuando sea requerido. Para facilitar dicho proceso, Vue le permite definir su componente como una función generadora que resuelve asíncronamente la definición de su componente. Vue sólo activará la función generadora cuando el componente efectivamente necesite ser renderizado y guardará en el caché su resultado para futuras re-renderizaciones. Por ejemplo:

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // Pase la definición del componente al callback de resolución
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

La función generadora recibe un callback `resolve`, el cual debe ser llamado cuando haya obtenido la definición de su componente desde el servidor. También puede llamar `reject(reason)` para indicar que la carga ha fallado. El `setTimeout` aquí presente es simplmente para una demostración; Cómo recibir correctamente el componente depende de usted. Un acercamiento recomendado es usar componentes asíncronos junto a la [división de código de Webpack](http://webpack.github.io/docs/code-splitting.html):

``` js
Vue.component('async-webpack-example', function (resolve) {
  // Esta sintaxis de require especial va a indicar a Webpack
  // que automáticamente divida su código compilado en paquetes
  // que serán cargados usando peticiones Ajax.
  require(['./my-async-component'], resolve)
})
```

Usted también puede retornar un `Promise` en la función de resolución, de modo que junto a Webpack 2 y sintaxis ES2015 puede hacer lo siguiente: 

``` js
Vue.component(
  'async-webpack-example',
  () => System.import('./my-async-component')
)
```

<p class="tip">Si usted es un fuerte usuario de <strong>Browserify</strong> que quisiera usar componentes asíncronos, su creador desafortunadamente ha [sido claro](https://github.com/substack/node-browserify/issues/58#issuecomment-21978224) que la carga asíncrona "no es algo que Browserify soportará en algún momento". Oficialmente, al menos. La comunidad de Browserify ha encontrado [algunas soluciones](https://github.com/vuejs/vuejs.org/issues/620), que pueden ser útiles para aplicaciones existentes y complejas. Para todos los otros escenarios, recomendamos sencillamente usar Webpack para obtener un soporte a carga asíncrona ya incluído y de primera.</p>

### Convenciones para Nombramiento de Componentes

Cuando registre componentes (o props), puede usar kebab-case, camelCase, o TitleCase. Para Vue no es realmente importante.

``` js
// en una definición de componente
components: {
  // registre usando kebab-case
  'kebab-cased-component': { /* ... */ },
  // registre usando camelCase
  'camelCasedComponent': { /* ... */ },
  // registre usando TitleCase
  'TitleCasedComponent': { /* ... */ }
}
```

Pero dentro de plantillas HTML, debe usar los equivalentes en kebab-case:

``` html
<!-- siempre use kebab-case en planitllas HTML -->
<kebab-cased-component></kebab-cased-component>
<camel-cased-component></camel-cased-component>
<title-cased-component></title-cased-component>
```

Sin embargo, cuando usamos plantillas _string_, no estamos limitados por las restricciones de mayúsculas/minúsculas del HTML. Esto quiere decir que puede referenciar sus componentes y props usando camelCase, TitleCase, o kebab-case incluso en las plantillas.

``` html
<!-- ¡use la forma que quiera en plantillas string! -->
<my-component></my-component>
<myComponent></myComponent>
<MyComponent></MyComponent>
```

Si a su componente no se le está enviando contenido a través de elementos `slot`, puede incluso cerrarlos con un `/` después del nombre:

``` html
<my-component/>
```

De nuevo, esto _únicamente_ funciona con plantillas string, ya que los elementos personalizados auto-cerrados no son HTML válido, y el analizador sintáctico nativo de su navegador no los podrá interpretar.

### Componentes Recursivos

Los componentes pueden invocarse a sí mismos recursivamente en su propia plantilla. Sin embargo, sólo puede hacerlo mediante la opción `name`:

``` js
name: 'unique-name-of-my-component'
```

Cuando registre un componente global usando `Vue.component`, el ID global es automáticamente asignado como la opción `name` del componente.

``` js
Vue.component('unique-name-of-my-component', {
  // ...
})
```

Pero si usted no es cuidadoso, los componentes recursivos pueden conducir a ciclos infinitos:

``` js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

Un componente como el anterior resultará en un error "tamaño máximo de la pila ha sido excedido", de modo que asegúrese que la invocación recursiva es condicional (p.e. use un `v-if` el cual eventualmente será `false`).

### Referencias Circulares entre Componentes

Digamos también que estamos construyendo un árbol de directorios, como el Finder o Explorador de Archivos. Usted puede tener un componente `tree-folder` con la siguiente plantilla:

``` html
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
```

Luego un componente `tree-folder-contents` con la siguiente plantilla:

``` html
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
```

Si observa cuidadosamente, verá que estos componentes serán al mismo tiempo descendientes _y_ ancestros el uno del otro en el árbol renderizado - ¡una paradoja! Cuando registramos componentes globalmente con `Vue.component`, dicha paradoja se resuelve automáticamente. Si ése es su caso, puede dejar de leer aquí.

Sin embargo, si está requiriendo/importando componentes usando un __sistema de módulos__, p.e. usando Webpack o Browserify, obtendrá un error:

```
Fallo al montar el componente: la plantilla o función de renderizado no está definida
```

Para explicar qué está sucediendo, llamaré nuestros componentes A y B. El sistema de módulos verá que necesita a A, pero primero necesita a B, pero B necesita a A, pero A necesita a B, etc, etc. Está atorado en un ciclo, sin saber como resolver completamente alguno de los dos componentes sin primero resolver el otro. Para arreglar ésto, necesitamos darle al sistema de módulos un punto donde pueda decir, "A necesita a B _eventualmente_, pero no hay necesidad de resolver a B primero."

En nuestro caso, haré que ése punto sea el componente `tree-folder`. Sabemos que el hijo que crea la paradoja es el componente `tree-folder-contents`, de modo que esperaremos hasta el hook de ciclo de vida `beforeCreate` para registrarlo:

``` js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue')
}
```

¡Problema resuelto!

### Plantillas En Línea

Cuando el atributo especial `inline-template` está presente en un componente hijo, el componente usará su contenido interno como su plantilla, en lugar de tratarlo como contenido distribuido. Esto permite una mayor flexibilidad en la creación de plantillas.

``` html
<my-component inline-template>
  <div>
    <p>Estos son compilados como la propia plantilla del componente.</p>
    <p>No contenido de transclusión del padre.</p>
  </div>
</my-component>
```

Sin embargo, `inline-template` hace que el ámbito de su plantilla sea más difícil de entender. Como buena práctica, es preferible definir plantillas dentro del componente usando la opción `template` o en un elemento `template` en un archivo `.vue`.

### X-Templates

Otra forma de definir plantillas es dentro de un elemento `script` con el tipo `text/x-template`, luego referenciar la plantilla con un id. Por ejemplo:

``` html
<script type="text/x-template" id="hello-world-template">
  <p>Hello hello hello</p>
</script>
```

``` js
Vue.component('hello-world', {
  template: '#hello-world-template'
})
```

Esto puede ser útil para demos con plantillas muy grandes o en aplicaciones extremadamente pequeñas, pero en otro caso debe ser evitado, ya que separan las plantillas del resto de la definición del componente.

### Componentes Estáticos Rápidos con `v-once`

Renderizar elementos HTML simples es muy rápido en Vue, pero a veces querrá tener un componente que incluya **mucho** contenido estático. En esos casos, puede asegurarse que sólo sea evaluado una única vez y luego guardado en caché usando la directiva `v-once` en el elemento raíz, de la siguiente forma:

``` js
Vue.component('terms-of-service', {
  template: '\
    <div v-once>\
      <h1>Terms of Service</h1>\
      ... mucho contenido estático ...\
    </div>\
  '
})
```
