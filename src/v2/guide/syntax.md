---
title: Sintaxis de Template
type: guide
order: 4
---

Vue.js utiliza una sintaxis de template basada en HTML que le permite vincular de forma declarativa el DOM renderizado a los datos de la instancia de Vue subyacente. Todas las templates de Vue.js son HTML válidas que pueden analizarse mediante navegadores compatibles con especificaciones y analizadores de HTML.

Bajo el capó, Vue compila las templates en funciones de renderizado del DOM virtual. Combinado con el sistema de reactividad, Vue puede averiguar de manera inteligente el número mínimo de componentes para volver a renderizar y aplicar la cantidad mínima de manipulacion del DOM cuando el estado de la aplicacion cambia.

Si está familiarizado con los conceptos de DOM virtual y prefiere la potencia bruta de JavaScript, también puede [escribir directamente funciones de procesamiento](render-function.html) en lugar de plantillas, con soporte opcional de JSX.

## Interpolationes

### Texto

La forma más básica de enlace de datos es la interpolación de texto usando la sintaxis de "Bigote" (llaves dobles):

``` html
<span>Message: {{ msg }}</span>
```

La etiqueta del bigote se reemplazará con el valor de la propiedad `msg` en el objeto de datos correspondiente. También se actualizará cada vez que cambie la propiedad `msg` del objeto de datos.

También puede realizar interpolaciones únicas que no se actualizan en el cambio de datos usando la [directiva v-once](../api/#v-once), pero tenga en cuenta que esto también afectará a cualquier otro enlace en el mismo nodo:

``` html
<span v-once>Esto nunca cambiara: {{ msg }}</span>
```

### HTML Puro

Los bigotes dobles interpretan los datos como texto plano, no HTML. Para generar HTML real, deberá utilizar la directiva `v-html`:

``` html
<p>Using mustaches: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

{% raw %}
<div id="example1" class="demo">
  <p>Using mustaches: {{ rawHtml }}</p>
  <p>Using v-html directive: <span v-html="rawHtml"></span></p>
</div>
<script>
new Vue({
  el: '#example1',
  data: function () {
  	return {
  	  rawHtml: '<span style="color: red">This should be red.</span>'
  	}
  }
})
</script>
{% endraw %}

El contenido del `span` se reemplazará con el valor de la propiedad `rawHtml`, interpretado como HTML simple: se ignoran los enlaces de datos. Tenga en cuenta que no puede utilizar `v-html` para componer pantillas parciales, porque Vue no es un motor de plantillas basado en cadenas. En cambio, se prefieren los componentes como la unidad fundamental para la reutilización y la composición de la interfaz de usuario.

<p class="tip">La ejecución dinámica de HTML arbitrario en su sitio web puede ser muy peligrosa porque puede conducir fácilmente a [vulnerabilidades de XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). Utilice solo la interpolación HTML en contenido de confianza y **nunca** en contenido proporcionado por usuario.</p>

### Attributos

Los bigotes no se pueden utilizar dentro de los atributos HTML. En su lugar, use una [directiva v-bind](../api/#v-bind):

``` html
<div v-bind:id="dynamicId"></div>
```

En el caso de los atributos booleanos, donde su mera existencia implica `true`, `v-bind` funciona de manera un poco diferente. En este ejemplo:

``` html
<button v-bind:disabled="isButtonDisabled">Button</button>
```

Si `isButtonDisabled` tiene el valor de `null`, `undefined` o `false`, el atributo `desabled` ni siquiera se incluirá en el elemento `<button>` representado.

### Usindo Expresiones JavaScript 

Hasta ahora solo hemos estado vinculando a simples claves de propiedad en nuestras template. Pero Vue.js realmente admite el poder completo de las expresiones de JavaScript dentro de todos los enlaces de datos:

``` html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

Estas expresiones se evaluarán como JavaScript en el ámbito de datos de la instancia de Vue del propietario. Una restricción es que cada enlace solo puede contener **una expresión**, por lo que lo siguiente **NO** funcionará:

``` html
<!-- esto es una declaración, no una expresión -->
{{ var a = 1 }}

<!-- El control de flujo tampoco funcionará, use expresiones ternarias -->
{{ if (ok) { return message } }}
```

<p class="tip">Las expresiones de template están en un espacio aislado y solo tienen acceso a una lista blanca de elementos globales como `Matemáticas` y `Fecha`. No debe intentar acceder a globales definidos por el usuario en expresiones de template.</p>

## Directivas

Las directivas son atributos especiales con el prefijo `v-`. Se espera que los valores de atributo de la directiva sean **una única expresión de JavaScript** (con la excepción de `v-for`, que se tratará más adelante). El trabajo de una directiva es aplicar reactivamente efectos secundarios al DOM cuando cambia el valor de su expresión. Repasemos el ejemplo que vimos en la introducción:

``` html
<p v-if="seen">Now you see me</p>
```
Aquí, la directiva `v-if` insertaría/eliminaría el elemento <p> basándose en la veracidad del valor de la expresión `seen`.

### Argumentos

Algunas directivas pueden tomar un "argumento", denotado por dos puntos después del nombre de la directiva. Por ejemplo, la directiva `v-bind` se usa para actualizar de forma reactiva un atributo HTML:

``` html
<a v-bind:href="url"> ... </a>
```

Aquí href es el argumento, que le dice a la directiva `v-bind` que vincule el atributo `href` del elemento al valor de la expresión `url`.

Otro ejemplo es la directiva `v-on`, que escucha los eventos DOM:

``` html
<a v-on:click="doSomething"> ... </a>
```

Aquí el argumento es el nombre del evento a escuchar. Hablaremos sobre el manejo de eventos con más detalle también.

### Modificadores

Los modificadores son postfijos especiales indicados por un punto, que indican que una directiva debe estar vinculada de alguna manera especial. Por ejemplo, el modificador `.prevent` le dice a la directiva `v-on` que llame a `event.preventDefault()` en el evento activado:

``` html
<form v-on:submit.prevent="onSubmit"> ... </form>
```

Más adelante veremos otros ejemplos de modificadores, [para `v-on`](events.html#Modificadores-de-eventos) y [para `v-model`](forms.html#Modificadores), cuando exploremos esas características.

## Modo abreviado

El prefijo `v-` sirve como una señal visual para identificar atributos específicos de Vue en sus templates. Esto es útil cuando está utilizando Vue.js para aplicar un comportamiento dinámico a algún marcado existente, pero puede sentirse detallado para algunas directivas de uso frecuente. Al mismo tiempo, la necesidad del prefijo `v-` es menos importante cuando se está construyendo un [SPA](https://en.wikipedia.org/wiki/Single-page_application) donde Vue.js administra cada template. Por lo tanto, Vue.js proporciona abreviaturas especiales para dos de las directivas más utilizadas, `v-bind` y `v-on`:

### `v-bind` Abreciado

``` html
<!-- full syntax -->
<a v-bind:href="url"> ... </a>

<!-- abreviado -->
<a :href="url"> ... </a>
```

### `v-on` Abreviado

``` html
<!-- full syntax -->
<a v-on:click="doSomething"> ... </a>

<!-- abreviado -->
<a @click="doSomething"> ... </a>
```

Pueden parecer un poco diferentes del HTML normal, pero `:` y `@` son caracteres válidos para los nombres de atributos y todos los navegadores compatibles con Vue.js pueden analizarlo correctamente. Además, no aparecen en el marcado final renderizado. La sintaxis abreviada es totalmente opcional, pero es probable que la aprecie cuando sepa más sobre su uso más adelante.
