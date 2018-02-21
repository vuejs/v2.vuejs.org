---
title: Custom Directives
type: guide
order: 302
---

## Introducción

Además del conjunto predeterminado de directivos que vienen acompañados con el núcleo (`v-model` y `v-show`), Vue también permite registrar sus propios directivos.

En Vue 2.0 la forma principal de reusar código y de aplicar abstracción es mediante de la abstacción y reusabilidad de componentes, de igual forma existen casos donde nos veremos en la necesidad de acceder al DOM a bajo nivel a elementos regulares, es aqui donde tomamos ventaja de el uso de *Directivos Propios*. Un ejemplo de este uso será tomando en consideración un elemento de entrada de texto (**input**) como el mostrado a continuación:

```javascript
<div id="simplest-directive-example" class="demo">
  <input v-focus>
</div>
<script>
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})
new Vue({
  el: '#simplest-directive-example'
})
</script>
```

Para el momento en que la página carga, ese elemento obtiene enfoque (**Nota**: El enfoque automático (autofocus) no funcionara en la version móvil de Safari). También, de se que no se lleva a cabo un clic en algun otro elemento desde que se visita esta pagina en la sección actual, el elemento de entrada (**input**) permanecerá enfocado. 

A continuación el desarrollo de un directivo que nos permite llevar a cabo la premisa anteriormente mencionada.

``` javascript
// Registro de una directiva propia llamada v-focus
Vue.directive('focus', {
  // Reaccion para el momento en que se inserta el elemento en el DOM
  inserted: function (el) {
    // Directiva focus que brinda autofoco al elemento "el"
    el.focus()
  }
})
```

Si se quiere registrar una directiva de forma local, los componentes tambien pueden tomar la opción `directives`:

``` javascript
directives: {
  focus: {
    // Definicion de la directiva
  }
}
```

Luego en ua plantilla, se puede usar el nuevo atributo `v-focus` en cualquier elemento, de la siguiente forma:

``` html
<input v-focus>
```

## Anclar Funciones

Un objeto de definición de directiva puede contener funciones propias del mismo (todas opcionales): 

- `bind`: Se hace el llamado una sola vez, cuando la directiva es por primera vez unida al elemento. Es aqui donde se puede hacer un ajuste de una sola vez.

- `inserted`: Llamado cuando el elemento unido ha sido insertado como hijo de su elemento padre. Esto solo es garantizado si existe la presencia de un elemento padre, no necesariamente en el documento en sí.

- `update`: Llamado luego de que el contendedor de el componente VNodeha sido actualizado, __pero posiblemente antes de que su componente hijo sea actualizado__. 
El valor de la directiva puedo como puede no cambiar, se pueden evitar actualizaciones inecesarias comparando los valores unidos actuales y los anteriores. (Más información en la sección de `Argumentos para Anclar (Hook Arguments)`).

- `componentUpdated`: Llamado luego de que el componente contenedor VNode __y los componentes VNode hijos__ sean actualizados.

- `unbind`: Se hace el llamado una sola vez, cuando el directivo es separado del elemento.

Exploraremos los argumentos pasados las anclas (Por Ejemplo: `el`, `binding`, `vnode` y `oldVnode`) en la próxima sección.

## Argumentos para Anclas de Directivos

Los siguientes argumentos pueden ser pasados a las anclas de los directivos:

- **el**: Elemento al cual esta unido el directivo. Puede ser usado para manipular el DOM de forma directa.
- **binding**: Un objeto que hereda las propiedades.
  - **name**: El nombre de el directivo sin el prefijo `v-`.
  - **value**: Valor pasado al directivo. Por ejemplo: En `v-my-directive="1 + 1"`, el valor será `2`.
  - **oldValue**: El valor anterior, solo disponible en `update` y `componentUpdated`. Se encuentra disponible mientras que el valor no haya sido cambiado.
  - **expression**: La expresión unida como string. Por ejemplo: En el caso de `v-my-directive:foo`, el argumento será `"foo"`.
  Para el caso de `v-my-directive.foo.bar`, los valores del objeto serán `{ foo: true, bar: true }`.
  - **arg**: El argumento pasado al directivo, si existe alguno. Por ejemplo, en el caso de `v-my-directive:foo`, el argumento será `"foo"`.
  - **modifiers**: Un objeto que contiene los modificadores, si exite alguno. Por ejemplo en el caso de: `v-my-directive.foo.bar`, los modificadores seran un objeto como el siguiente `{ foo: true, bar: true }`.
- **vnode**: El nodo virtual producido por el compilador de Vue. Para ver más visite [VNode API](../api/#VNode-Interface).
- **oldVnode**: El nodo virtual anterior, solo disponibles en `update` y `componentUpdated`.

A excepción de `el`, los demás argumentos deben de ser tratados como *solo lectura*. Si se quiere intercambiar información entre anclas, es recomendado hacerlo a través del elemento [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset).

Ejemplo de un directivo propio usando algunas de las propiedades:

``` html
<div id="hook-arguments-example" v-demo:foo.a.b="message"></div>
```

``` javascript
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})

new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
```

```javascript
<div id="hook-arguments-example" v-demo:foo.a.b="message" class="demo"></div>
<script>
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})
new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
</script>
```

## Atajaos de Funciones

En algunos casos, se espera el mismo comportamiento en `bind` y `update`, sin necesitar de las otras anclas:

``` javascript
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

## Objetos

Si tu directivo necesita valores arbitrarios, también es posible pasar un objeto de JavaScript. Importante, los directivos pueden tomar cualquier expresión valida de JavaScript.

``` html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

``` javascript
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})
```
