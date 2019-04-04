---
title: Agregando Propiedades de Instancia
type: cookbook
order: 2
---

## Ejemplo Básico

Podrían existir datos o funciones utilitarias las cuales nos gustaría utilizar en muchos componentes, pero no quisiéramos [ensuciar el scope global](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch3.md). En esos casos, se puede exponer estos datos o funciones en cada instancia de Vue definiéndolos en el prototipo.

```js
Vue.prototype.$appName = 'Mi aplicación'
```

Ahora `$appName` está disponible en todas las instancias de Vue, incluso antes de su creación. Si ejecutamos:

```js
new Vue({
  beforeCreate: function() {
    console.log(this.$appName)
  }
})
```

Entonces `"Mi aplicación"` será mostrado en la consola!

## La importancia de contextualizar las propiedades de instancia

Quizás se esté preguntando:

> "¿Por qué `appName` comienza con `$`? ¿Es eso importante? ¿Qué es lo que hace?"

No hay nada mágico aquí.`$` es una convención usada por Vue para indicar que una propiedad estará disponible en todas las instancias. Esto evita conflictos entre datos definidos, propiedades computadas o métodos.

> "¿Conflictos? ¿A qué se refiere?"

Otra gran pregunta! Si definimos:

```js
Vue.prototype.appName = 'Mi aplicación'
```

¿Qué esperaría que se imprima en la consola en el siguiente ejemplo?

```js
new Vue({
  data: {
    // Oh no - appName es *también* el nombre de una
    // propiedad de instancia que hemos definido!
    appName: 'Nombre de otra aplicación'
  },
  beforeCreate: function() {
    console.log(this.appName)
  },
  created: function() {
    console.log(this.appName)
  }
})
```

El valor seria `"Mi aplicación"`, y luego `"Nombre de otra aplicación"`, porque `this.appName` se sobrescribe ([o algo así](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch5.md)) con el valor de `data` cuando la instancia es creada. Por este motivo utilizamos `$` para evitar este problema. Usted podría usar su propia nomenclatura de ser necesario, por ejemplo `$_appName` o `ΩappName`, para prevenir los conflictos con otras librerías o nuevas funcionalidades.

## Ejemplo del mundo real: Remplazar Vue Resource con Axios

Supongamos que se quiere remplazar la librería retirada [Vue Resource](https://medium.com/the-vue-point/retiring-vue-resource-871a82880af4). Anteriormente era de su agrado acceder a los métodos a través de `this.$http` y le gustaría poder hacer lo mismo con Axios.

Para lograrlo, solamente debe incluir axios en su proyecto:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.15.2/axios.js"></script>

<div id="app">
  <ul>
    <li v-for="user in users">{{ user.name }}</li>
  </ul>
</div>
```

Luego crear un alias de `Vue.prototype.$http` a `axios`:

```js
Vue.prototype.$http = axios
```

Y así usted será capaz de acceder a métodos como `this.$http.get` en cualquier instancia de Vue:

```js
new Vue({
  el: '#app',
  data: {
    users: []
  },
  created() {
    var vm = this
    this.$http
      .get('https://jsonplaceholder.typicode.com/users')
      .then(function(response) {
        vm.users = response.data
      })
  }
})
```

## El contexto de los métodos en el prototipo

En caso de que usted no lo sepa, los métodos agregados al prototipo de JavaScript tienen el contexto de la instancia. Eso significa que se puede usar `this` para acceder datos, propiedades computadas, métodos o cualquier otra cosa que esté definida en la instancia.

Veamos un ejemplo que aprovecha esta característica en un método `$reverseText`:

```js
Vue.prototype.$reverseText = function(propertyName) {
  this[propertyName] = this[propertyName]
    .split('')
    .reverse()
    .join('')
}

new Vue({
  data: {
    message: 'Hola'
  },
  created: function() {
    console.log(this.message) // => "Hola"
    this.$reverseText('message')
    console.log(this.message) // => "aloH"
  }
})
```

Es importante destacar que el contexto del método no será el correcto, y por lo tanto no funcionará, si usted utiliza las funciones flecha de ES6/2015, dado que esta clase de funciones utilizan el contexto del objeto padre implícitamente.

```js
Vue.prototype.$reverseText = propertyName => {
  this[propertyName] = this[propertyName]
    .split('')
    .reverse()
    .join('')
}
```

Esto lanzaría un error:

```log
Uncaught TypeError: Cannot read property 'split' of undefined
```

## Cuando debemos evitar este patrón

Mientras esté atento a la propiedades presentes en el contexto del prototipo, este patrón debería ser razonablemente seguro y en general no debería ser fuente de muchos errores.

Sin embargo, este patrón puede causar confusión entre desarrolladores. Estos podrían ver `this.$http` y pensar que se trata de una funcionalidad de Vue, cuando realmente no lo es, incluso podrían intentar usar `this.$http` y obtener valores inesperados como `undefined`, o simplemente hacer búsquedas en Google sobre como usar esa funcionalidad cuando en realidad deberían buscar como usar Axios porque por debajo están utilizando un alias.

**En este caso la conveniencia y facilidad de uso se obtienen a costa del ser explícito.** Al mirar el código del componente es imposible saber de donde proviene `$http`. ¿Proviene de Vue? ¿De una librería? ¿De otro desarrollador?

Entonces, ¿cuáles son las alternativas?

## Patrones alternativos

### Si no usamos un sistema de módulos

En aplicaciones donde **no** se cuenta con un sistema de módulos (por ejemplo con Webpack o Browserify), se puede utilizar un patrón que es usualmente usado en muchas aplicaciones con interfaces "mejoradas" con JavaScript: el objeto global `App`.

Si lo que usted desea agregar es algo totalmente no relacionado con Vue, entonces esto podría ser una buena alternativa a considerar. A continuación se puede ver un ejemplo:

```js
var App = Object.freeze({
  name: 'Mi aplicación',
  version: '2.1.4',
  helpers: {
    // Esto es una versión puramente funcional
    // del método $reverseText que vimos anteriormente
    reverseText: function(text) {
      return text
        .split('')
        .reverse()
        .join('')
    }
  }
})
```

<p class="tip">Si usted noto el uso `Object.freeze` y le pareció raro, lo que este hace es prevenir que el objeto sea modificado. Así se puede asegurar que todas las propiedades son constantes, protegiéndonos así de potenciales futuros errores.</p>

Ahora el origen este estas propiedades compartidas es más obvio, provienen de algún objeto `App` definido en la aplicación! Para encontrar su definición solo basta con hacer una búsqueda global en el proyecto.

La otra ventaja es que `App` se puede usar _en cualquier parte_ de su código, sin importar si es algo relacionado a Vue o no. Esto incluye agregar valores directamente a las opciones de las instancias en lugar de tener usar una función para acceder a la propiedades en `this`:

```js
new Vue({
  data: {
    appVersion: App.version
  },
  methods: {
    reverseText: App.helpers.reverseText
  }
})
```

### Si usamos un sistema de módulos

Cuando contamos con un sistema de módulos se puede fácilmente organizar el código compartido en módulos y luego importarlos usando `require`/`import` cuando sea necesario. Esto provee un gran nivel de explicitud, ya que en cada archivo se puede contar con la lista completa de dependencias y se sabe exactamente de donde proviene cada una.

A pesar de que es un enfoque muy explícito, es sin dudas más fácil de mantener en el futuro, especialmente cuando se trabaja en equipo construyendo un aplicación de gran tamaño.
