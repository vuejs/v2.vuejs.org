---
title: Directivas Personalizadas
type: guide
order: 302
---

## Introducción

Además del conjunto predeterminado de directivas incluidas en el núcleo (`v-model` y `v-show`), Vue también le permite registrar sus propias directivas personalizadas. Note que en Vue 2.0, la forma primaria de reutilización y abstracción del código son los componentes; sin embargo, puede haber casos en los que necesite un acceso al bajo nivel al DOM en elementos simples, y aquí es donde las directivas personalizadas seguirían siendo útiles. Un ejemplo sería enfocarse en un elemento _input_, como este:

{% raw %}
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
{% endraw %}

Cuando se carga la página, este elemento se enfoca (nota: el atributo nativo `autofocus` no funciona en Safari para dispositivos mobiles). De hecho, si no ha hecho clic en nada más desde que visitó esta página, el _input_ de arriba debería estar enfocada ahora. Ahora vamos a construir la directiva que realiza esto:

``` js
// Registra una directiva personalizada global llamada `v-focus`
Vue.directive('focus', {
  // Cuando el elemento enlazado se inserta en el DOM...
  inserted: function (el) {
    // Enfoca el elemento
    el.focus()
  }
})
```

Si desea registrar una directiva localmente en lugar de lo anterior, los componentes también aceptan una opción `directives`:

``` js
directives: {
  focus: {
    // Definición de directiva
    inserted: function (el) {
      el.focus()
    }
  }
}
```

Luego, en un _template_, puede usar el nuevo atributo `v-focus` en cualquier elemento, como este:

``` html
<input v-focus>
```

## Funciones Hook

Un objeto de definición de directiva puede proveer algunas funciones _hook_, todas opcionales:

- `bind`: se llama solo una vez, cuando la directiva se enlaza por primera vez con el elemento. Aquí es donde puede hacer un trabajo de configuración inicial.

- `inserted`: se llama cuando el elemento enlazado se ha insertado en el nodo padre (esto solo garantiza la presencia en el nodo padre, no necesariamente en el documento).

- `update`: se llama después de actualizar el VNode que contiene el componente, __pero posiblemente antes de la actualización de sus hijos__. El valor de la directiva puede o no haber cambiado, pero usted puede evitar actualizaciones innecesarias comparando los valores actuales con los antiguos (ver abajo, en argumentos en _hooks_).

- `componentUpdated`: se llama después de que el VNodo del componente que contiene __y los VNodos de sus hijos__ se han actualizado.

- `unbind`: se llama solo una vez, cuando la directiva es desvinculada del elemento.

Exploraremos los argumentos pasados en estas funciones _hook_ (`el`, `binding`, `vnode`, and `oldVnode`) en la siguiente sección.

## Argumentos en Hooks

Los siguientes argumentos se esperan en las funciones de _hook_ de directivas:

- `el`: El elemento al que está dirigida la directiva. Esto se puede utilizar para manipular directamente el DOM.
- `binding`: Un objeto que contiene las siguientes propiedades.
  - `name`: El nombre de la directiva, sin el prefijo `v-`.
  - `value`: El valor pasado a la directiva. Por ejemplo en `v-my-directive="1 + 1"`, el valor sería `2`.
  - `oldValue`: El valor anterior, solo disponible en `update` y `componentUpdated`. Está disponible si el valor fue cambiado o no.
  - `expression`: La expresión del enlace como un _string_. Por ejemplo en `v-my-directive="1 + 1"`, la expresión sería `"1 + 1"`.
  - `arg`: El argumento pasado a la directiva, si hay alguno. Por ejemplo en `v-my-directive:foo`, el argumento sería `"foo"`.
  - `modifiers`: Un objeto que contiene modificadores, si los hay. Por ejemplo en `v-my-directive.foo.bar`, los modificadores serían `{ foo: true, bar: true }`.
- `vnode`: El nodo virtual producido por el compilador de Vue. Ver el [VNode API](../api/#VNode-Interface) para más detalles.
- `oldVnode`: El nodo virtual anterior, solo disponible en `update` y `componentUpdated`.

<p class="tip">Excepto `el`, usted debe tratar los otros argumentos como de sólo lectura y nunca modificarlos. Si necesita compartir información entre _hooks_, es aconsejable utilizar un atributo [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset).</p>

Un ejemplo de una directiva personalizada que usa algunas de estas propiedades:

``` html
<div id="hook-arguments-example" v-demo:foo.a.b="message"></div>
```

``` js
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
    message: 'Hola!'
  }
})
```

{% raw %}
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
    message: 'Hola!'
  }
})
</script>
{% endraw %}

## Forma Abreviada de Funciones

En muchos casos, es posible que desee el mismo comportamiento en `bind` y `update`, pero no se preocupe por los otros _hooks_. Por ejemplo:

``` js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

## Objetos Literales

Si su directiva necesita varios valores, también puede pasar un objeto literal de JavaScript. Recuerde, las directivas pueden tomar cualquier expresión válida de JavaScript.

``` html
<div v-demo="{ color: 'white', text: 'Hola!' }"></div>
```

``` js
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "Hola!"
})
```
