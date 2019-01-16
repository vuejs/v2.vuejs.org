---
title: Filtros
type: guide
order: 305
---

Vue.js le permite definir filtros que pueden usarse para aplicar formato de texto común. Se puede utilizar filtros en dos lugares: **interpolaciones mustache y expresiones `v-bind`** (siendo esta última, soportada en 2.1.0+). Los filtros se deben agregar al final de la expresión de JavaScript, denotados por símbolo _"pipe"_:

``` html
<!-- en mustaches -->
{{ message | capitalize }}

<!-- en v-bind -->
<div v-bind:id="rawId | formatId"></div>
```

Puede definir filtros locales en las opciones de un componente:

``` js
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

o establecer filtros globalmente antes de crear la instancia de Vue:

``` js
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  // ...
})
```

A continuación, se muestra un ejemplo de nuestro filtro `capitalize` siendo utilizado:

{% raw %}
<div id="example_1" class="demo">
  <input type="text" v-model="message">
  <p>{{ message | capitalize }}</p>
</div>
<script>
  new Vue({
    el: '#example_1',
    data: function () {
      return {
        message: 'john'
      }
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
  })
</script>
{% endraw %}

La función del filtro siempre recibe el valor de la expresión (el resultado de la cadena anterior) como su primer argumento. En el ejemplo anterior, la función del filtro `capitalize` recibirá el valor de `message` como su argumento.

Los filtros pueden ser encadenados:

``` html
{{ message | filterA | filterB }}
```

En este caso, `filterA`, definido con un solo argumento, recibirá el valor de `message`, y luego se llamará a la función `filterB` con el resultado de `filterA` pasado al argumento único de `filterB`.

Los filtros son funciones de JavaScript, por lo tanto pueden tomar argumentos:

``` html
{{ message | filterA('arg1', arg2) }}
```

Aquí `filterA` se define como una función que toma tres argumentos. El valor de `message` se pasará al primer argumento. La cadena simple `'arg1'` se pasará al `filterA` como segundo argumento, y el valor de la expresión `arg2` se evaluará y pasará como el tercer argumento.
