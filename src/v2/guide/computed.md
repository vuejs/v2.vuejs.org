---
title: Propiedades Computadas y Observadores
type: guide
order: 5
---

## Propiedades Computadas

Las expresiones en el *template* son muy convenientes, pero están diseñadas para operaciones simples. Poner demasiada lógica en sus *templates* puede hacerlos grandes, complejos y difíciles de mantener. Por ejemplo:

``` html
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```
En este punto, el *template* ya no es simple y declarativo. Debe mirarlo por un segundo antes de darse cuenta de que muestra `message` al revés. El problema se agrava cuando desea incluir el mensaje invertido en su *template* más de una vez.

Es por eso que para cualquier lógica compleja, deberia usar una **propiedad computada**.

### Ejemplo Básico

``` html
<div id="example">
  <p>Mensaje original: "{{ message }}"</p>
  <p>Mensaje invertido computado: "{{ reversedMessage }}"</p>
</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hola'
  },
  computed: {
    // un getter computado
    reversedMessage: function () {
      // `this` apunta a la instancia vm
      return this.message.split('').reverse().join('')
    }
  }
})
```

Result:

{% raw %}
<div id="example" class="demo">
  <p>Mensaje original: "{{ message }}"</p>
  <p>Mensaje invertido computado: "{{ reversedMessage }}"</p>
</div>
<script>
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hola'
  },
  computed: {
    reversedMessage: function () {
      return this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Aquí hemos declarado una propiedad computada `reversedMessage`. La función que
proporcionemos se utilizará como la función getter para la propiedad `vm.reversedMessage`:

``` js
console.log(vm.reversedMessage) // => 'aloH'
vm.message = 'Adios'
console.log(vm.reversedMessage) // => 'soidA'
```

Puede abrir la consola y jugar con el ejemplo vm usted mismo. El valor de `vm.reversedMessage` siempre depende del valor de `vm.message`.

Puede enlazar datos a propiedades computadas en el *template* al igual que una propiedad normal. Vue es consciente de que `vm.reversedMessage` depende de `vm.message`, por lo cual actualizará todos los enlaces que dependan de `vm.reversedMessage` cuando `vm.message` cambie. Y lo mejor de todo es que hemos creado esta relación de dependencia de manera declarativa: la función computada getter no tiene efectos secundarios, lo que facilita la prueba y la comprensión.

### Caching computado vs Métodos

Es posible que haya notado que podemos lograr el mismo resultado al invocar un método en la expresión:

``` html
<p>Mensaje Invertido: "{{ reverseMessage() }}"</p>
```

``` js
// en componente
methods: {
  reverseMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
```

En lugar de una propiedad computada, podemos definir la misma función como un método en su lugar. Para el resultado final, los dos enfoques son exactamente los mismos. Sin embargo, la diferencia es que las **propiedades computadas se almacenan en caché según sus dependencias.** Una propiedad computada solo se volverá a evaluar cuando alguna de sus dependencias haya cambiado. Esto significa que mientras `message` no haya cambiado, el acceso múltiple a la propiedad computada de `reverseMessage` regresará inmediatamente el resultado previamente calculado sin tener que ejecutar la función de nuevo.

Esto también significa que la siguiente propiedad computada nunca se actualizará, porque `Date.now()` no es una dependencia reactiva:

``` js
computed: {
  now: function () {
    return Date.now()
  }
}
```
En comparación, una invocación de método **siempre** ejecutará la función cada vez que ocurre una re-renderizacion.

¿Por qué necesitamos caché? Imagina que tenemos una costosa propiedad computada **A**, que requiere hacer un bucle a través de una gran matriz y hace muchos cálculos. Entonces podemos tener otras propiedades computadas que a su vez dependen de **A**. Sin caché, estaríamos ejecutando el captador de **A** muchas veces más de lo necesario. En los casos en que no desee el almacenamiento en caché, utilice un método en su lugar.

### Propiedad Computada vs Watched

Vue proporciona una forma más genérica de observar y reaccionar a los cambios de datos en una instancia de Vue: **propiedad watch**. Cuando tiene algunos datos que necesitan cambiarse en función de otros datos, es tentador utilizar `watch` en exceso, especialmente si proviene de tener experiencia en AngularJS. Sin embargo, a menudo es una mejor idea usar una propiedad computada en lugar de una imperativa llamada a `watch` . Considera este ejemplo:

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
El código anterior es imperativo y repetitivo. Compáralo con una versión de propiedad computada:

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
Mucho mejor, ¿no?

### Setter Computado

Las propiedades calculadas son, de forma predeterminada solo get, pero también puede proporcionar un set cuando lo necesite:

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

Ahora, cuando ejecute `vm.fullName = 'John Doe'`, se invocará el definidor y `vm.firstName` y `vm.lastName` se actualizarán en consecuencia.

## Watchers

Si bien las propiedades computadas son más apropiadas en la mayoría de los casos, hay ocasiones en que es necesario un observador personalizado. Es por eso que Vue proporciona una forma más genérica de reaccionar a los cambios de datos a través de la opción `watch`. Esto es más útil cuando desea realizar operaciones asíncronas o costosas en respuesta al cambio de datos.

por ejemplo:

``` html
<div id="watch-example">
  <p>
    Haz una pregunta de sí/no:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
```

``` html
<!-- Dado que ya existe un rico ecosistema de bibliotecas ajax         -->
<!-- y colecciones de métodos de utilidad de uso general, Vue core     -->
<!-- es capaz de permanecer pequeño al no reinventarlos. Esto también  -->
<!-- te da la libertad de usar aquello con lo que estás familiarizado. -->
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'No puedo darte una respuesta hasta que hagas una pregunta!'
  },
  watch: {
    // whenever question changes, this function will run
    question: function (newQuestion, oldQuestion) {
      this.answer = 'Esperando que deje de escribir...'
      this.debouncedGetAnswer()
    }
  },
  created: function () {
    // _.debounce es una función proporcionada por lodash para limitar cuan
    // a menudo se puede ejecutar una operación particularmente costosa.
    // En este caso, queremos limitar la frecuencia con la que accedemos.
    // yesno.wtf/api, esperando hasta que el usuario tenga completamente
    // Terminé de escribir antes de realizar la solicitud ajax. Aprender
    // más sobre la función _.debounce (y su primo
    // _.throttle), visite: https://lodash.com/docs#debounce
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
  },
  methods: {
    getAnswer:  function () {
      if (this.question.indexOf('?') === -1) {
        this.answer = 'Las preguntas suelen contener un signo de interrogación. ;-)'
        return
      }
      this.answer = 'Pensando...'
      var vm = this
      axios.get('https://yesno.wtf/api')
        .then(function (response) {
          vm.answer = _.capitalize(response.data.answer)
        })
        .catch(function (error) {
          vm.answer = '¡Error! No se pudo alcanzar la API. ' + error
        })
    }
  }
})
</script>
```

Result:

{% raw %}
<div id="watch-example" class="demo">
  <p>
    Haz una pregunta de sí/no:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'No puedo darte una respuesta hasta que hagas una pregunta!!'
  },
  watch: {
    question: function (newQuestion, oldQuestion) {
      this.answer = 'Esperando que deje de escribir......'
      this.debouncedGetAnswer()
    }
  },
  created: function () {
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
  },
  methods: {
    getAnswer:  function () {
      if (this.question.indexOf('?') === -1) {
        this.answer = 'Las preguntas suelen contener un signo de interrogación. ;-)'
        return
      }
      this.answer = 'Pensando...'
      var vm = this
      axios.get('https://yesno.wtf/api')
        .then(function (response) {
          vm.answer = _.capitalize(response.data.answer)
        })
        .catch(function (error) {
          vm.answer = '¡Error! No se pudo alcanzar la API. ' + error
        })
    }
  }
})
</script>
{% endraw %}

En este caso, el uso de la opción `watch` nos permite realizar una operación asíncrona (acceder a una API), limita la frecuencia con la que realizamos esa operación y establece estados intermedios hasta que obtengamos una respuesta final. Nada de eso sería posible con una propiedad computada.

Además de la opción `watch`, también puede usar el imperativo [vm.$Watch API](../api/#vm-watch).
