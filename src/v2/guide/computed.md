---
title: Propiedades calculadas y Watchers
type: guide
order: 5
---

## Propiedades Calculadas (Computed)

Las expresiones en plantillas son muy convenientes, pero realmente se deberían usar sólo para operaciones simples. Poner mucha lógica en sus plantillas puede hacerlas complicadas y difíciles de mantener. Por ejemplo:

``` html
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```

En este instante, la plantilla ya no es sencilla y declarativa. Tiene que verla por un segundo para entender que sólo muestra `message` invertido. El problema empeora si decide incluir el mensaje invertido en su plantilla más de una vez.

Por eso es que para cualquier lógica compleja, debe usar una **propiedad calculada**.

### Ejemplo Básico

``` html
<div id="example">
  <p>Original message: "{{ message }}"</p>
  <p>Computed reversed message: "{{ reversedMessage }}"</p>
</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // un getter calculado
    reversedMessage: function () {
      // `this` apunta a la instancia vm
      return this.message.split('').reverse().join('')
    }
  }
})
```

Resultado:

{% raw %}
<div id="example" class="demo">
  <p>Original message: "{{ message }}"</p>
  <p>Computed reversed message: "{{ reversedMessage }}"</p>
</div>
<script>
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    reversedMessage: function () {
      return this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Aquí hemos declarado una propiedad calculada `reversedMessage`. La función que proveemos será usada como la función getter para la propiedad `vm.reversedMessage`: 

``` js
console.log(vm.reversedMessage) // -> 'olleH'
vm.message = 'Goodbye'
console.log(vm.reversedMessage) // -> 'eybdooG'
```

Puede abrir la consola y jugar con el ejemplo usted mismo. El valor de `vm.reversedMessage` siempre es dependiente del valor de `vm.message`.

Puede enlazar datos a propiedades calculadas en las plantillas justo como una propiedad normal. Vue es consciente que `vm.reversedMessage` depende de `vm.message`, así que actualizará cualquier enlace que dependa de `vm.reversedMessage` siempre que `vm.message` cambie. Y la mejor parte es que hemos creado esta relación de dependencia de forma declarativa: la función getter calculada es pura y no tiene efectos secundarios, lo cual la hace muy fácil de probar y analizar.

### Cacheo Calculado versus Métodos

Puede haberse dado cuenta que podemos obtener el mismo resultado invocando un método en la expresión:

``` html
<p>Reversed message: "{{ reverseMessage() }}"</p>
```

``` js
// en componente
methods: {
  reverseMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
```

En vez de una propiedad calculada, podemos definir la misma función como un método. Para el resultado final, las dos formas son sin duda exactamente iguales. Sin embargo, la diferencia es que **las propiedades calculadas son cacheadas en base a sus dependencias.** Una propiedad calculada sólo será re-evaluada cuando alguna de sus dependencias haya cambiado. Esto quiere decir que mientras `message` no cambie, accesos múltiples a la propiedad calculada `reversedMessage` va a retornar inmediatamente el resultado calculado anteriormente sin tener que evaluar la función de nuevo.

Esto también quiere decir que la siguiente propiedad calculada nunca será actualizada, por que `Date.now()` no es una dependencia reactiva.

``` js
computed: {
  now: function () {
    return Date.now()
  }
}
```

En comparación, una invocación a un método **siempre** ejecutará la función cuando un re-render ocurra.

Por qué necesitamos cacheo? Imagine que tenemos una costosa propiedad calculada **A**, la cual requiere iterar sobre un enorme array mientras realiza muchos cálculos. Luego podríamos tener otras propiedades calculadas que a su vez dependen de **A**. Sin caché, estaríamos ejecutando el getter de **A** muchas veces más de las necesarias! En casos donde no requiera caché, use un método.

### Propiedad Calculada versus Watcher

Vue de hecho provee una forma más genérica de observar y reaccionar a cambios de datos en una instancia Vue: **observar propiedades**. Cuando tiene datos que necesitan cambiar en base a otros datos, es tentador usar `watch`, especialmente si viene de un trasfondo de AngularJS. Sin embargo, es a menudo una mejor idea usar una propiedad calculada en vez de un callback `watch` imperativo. Considere el siguiente ejemplo:

``` html
<div id="demo">{{ fullName }}</div>
```

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})
```

El anterior código es imperativo y repetitivo. Compárelo con una versión usando propiedades calculadas:

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

Mucho mejor, ¿no es cierto?

### Setter calculado

Las propiedades calculadas por defecto son de sólo lectura, pero también puede proveer un setter si lo necesita:

``` js
// ...
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

Ahora cuando ejecute `vm.fullName = 'John Doe'`, el setter será invocado y `vm.firstName` y `vm.lastName` serán actualizados acordemente.

## Watchers

Aunque las propiedades calculadas son más apropiadas en la mayoría de los casos, existen ocasiones donde un watcher hecho a medida es necesario. Para esos casos Vue provee una forma más genérica de reaccionar a cambios de datos usando la opción `watch`. Esto es muy útil cuando quiere realizar operaciones asíncronas o complicadas en respuesta a un cambio en los datos.

Por ejemplo:

``` html
<div id="watch-example">
  <p>
    Ask a yes/no question:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
```

``` html
<!-- Como ya existe un rico ecosistema de librerías ajax  -->
<!-- y colecciones de métodos de propósito general, Vue core -->
<!-- es capaz de permanecer pequeño al no reinventarlos. Esto también -->
<!-- le da la libertad de usar el que le sea más familiar. -->
<script src="https://unpkg.com/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'I cannot give you an answer until you ask a question!'
  },
  watch: {
    // siempre que question cambie, ésta función será ejecutada
    question: function (newQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.getAnswer()
    }
  },
  methods: {
    // _.debounce  es una función ofrecida por lodash para limitar
    // que tan a menudo una operación costosa puede ser ejecutada.
    // En este caso, queremos limitar que tan a menudo accesamos 
    // yesno.wtf/api, esperando hasta que el usuario haya terminado
    // completamente de escribir antes de realizar el llamado ajax. 
    // Para aprender más sobre la función _.debounce function 
    // (y su prima _.throttle), visite: https://lodash.com/docs#debounce
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (this.question.indexOf('?') === -1) {
          vm.answer = 'Questions usually contain a question mark. ;-)'
          return
        }
        vm.answer = 'Thinking...'
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = 'Error! Could not reach the API. ' + error
          })
      },
      // Este es el número de milisegundos que esperamos a que el usuario
      // termine de escribir.
      500
    )
  }
})
</script>
```

Resultado:

{% raw %}
<div id="watch-example" class="demo">
  <p>
    Ask a yes/no question:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
<script src="https://unpkg.com/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'I cannot give you an answer until you ask a question!'
  },
  watch: {
    question: function (newQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.getAnswer()
    }
  },
  methods: {
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (this.question.indexOf('?') === -1) {
          vm.answer = 'Questions usually contain a question mark. ;-)'
          return
        }
        vm.answer = 'Thinking...'
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = 'Error! Could not reach the API. ' + error
          })
      },
      500
    )
  }
})
</script>
{% endraw %}

En este caso, usar la opción `watch` nos permite relizar una operación asíncrona (acceder un API), limitar qué tan a menudo realizamos dicha operación, y definir estados intermedios hasta que obtenemos una respuesta final. Nada de eso sería posible usando una propiedad calculada.

En adición a la opción `watch`, también puede usar el imperativo [vm.$watch API](../api/#vm-watch).
