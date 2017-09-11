---
title: Sintaxis de Plantilla
type: guide
order: 4
---

Vue.js usa una sintaxis de plantilla basadas en HTML que le permite asignar declarativamente el DOM renderizado a los datos de la instancia de Vue. Todas las plantillas de Vue.js son HTML válido que puede ser interpretado por navegadores que cumplen las especificaciones, y por intérpretes de HTML.

Bajo el capó, Vue compila las plantillas en funciones de renderizado de DOM virtual. Combinado con el sistema de ractividad, Vue es capaz de encontrar inteligentemente la cantidad mínima de componentes que debe renderizar de nuevo y aplicar la mínima cantidad de manipulaciones al DOM cuando el estado de la aplicación cambie.

Si usted está familiarizado con los conceptos de DOM Virtual y prefiere el poder básico de JavaScript, también puede [directamente escribir las funciones de renderizado](render-function.html) en vez de plantillas, con soporte opcional a JSX.

## Interpolaciones

### Texto

La forma más básica de asignación de datos es la interpolación de texto usando la sintaxis "Mustache" (doble corchetes):

``` html
<span>Message: {{ msg }}</span>
```

La etiqueta mustache será reemplazada con el valor de la propiedad `msg` en el correspondiente objeto de datos. También será actualizada siempre que dicha propiedad cambie de valor.

Usted también puede realizar interpolaciones que no se actualizan cuando los datos cambian si usa la [directiva v-once](../api/#v-once), pero tenga en cuenta que esto también afectará otras asignaciones dentro del mismo nodo:

``` html
<span v-once>Esto nunca cambiará: {{ msg }}</span>
```

### HTML Básico

Los corchetes dobles interpretan los datos como texto plano, no HTML. Para poder mostrar HTML real, necesita usar la directiva `v-html`:

``` html
<div v-html="rawHtml"></div>
```

Los contenidos son insertados como HTML plano - las asignaciones de datos son ingnoradas. Note que no puede usar `v-html` para componer parciales de plantilla, ya que Vue no es un motor de plantillas basadas en string. En vez de eso, los componentes son la unidad fundamental preferida para reutilización y composición de interfaces de usuarios.

<p class="tip">Renderizar dinámicamente HTML arbitrario en su sitio web puede ser muy peligroso, ya que fácilmente puede conducir a [ataques XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). Sólo use interpolación HTML con contenido de confianza y **nunca** con contenido obtenido de los usuarios.</p>

### Atributos

Los corchetes no pueden ser usados dentro de atributos HTML, en su lugar, use una [directiva v-bind](../api/#v-bind):

``` html
<div v-bind:id="dynamicId"></div>
```

También funciona para atributos *booleanos* - el atributo será eliminado si la condición se resuelve en un valor *falsy*:

``` html
<button v-bind:disabled="algunaCondicionDinamica">Button</button>
```

### Usando Expresiones de JavaScript

Hasta ahora hemos asignado propiedades sencillas en nuestras plantillas. Pero Vue.js soporta el poder completo de las expresiones JavaScript dentro de todas sus asignaciones de datos: 

``` html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

Estas expresiones serán evaluadas como JavaScript en el ámbito de la instancia Vue. Una restricción es que cada asignación puede contener únicamente **una expresión individual**, de modo que el siguiente ejemplo **no** funcionará:

``` html
<!-- esto es una instrucción, no una expresión: -->
{{ var a = 1 }}

<!-- el control de flujos no funcionará tampoco 
     use expresiones ternarias -->
{{ if (ok) { return message } }}
```

<p class="tip">Las expresiones de plantilla son controladas y sólo tienen acceso a una lista curada de expresiones globales como `Math` y `Date`. Usted no debe intentar acceder globales definidas por usuarios en expresiones de plantilla.</p>

## Directivas

Las Directivas son atributos especiales con el prefijo `v-`. Los valores de las directivas deben ser **una expresión individual de JavaScript** (exceptuando a `v-for`, la cual será discutida más adelante). El trabajo de una directiva es aplicar efectos secundarios reactivamente al DOM cuando el valor de su expresión cambie. Revisemos el ejemplo que vimos en la introducción:

``` html
<p v-if="seen">Now you see me</p>
```

Aquí, la directiva `v-if` eliminará/insertará el elemento `<p>` basado en el valor de la expresión `seen`.

### Argumentos

Algunas directivas pueden tomar un "argumento", denotado con el carácter de dos puntos después del nombre de la directiva. Por ejemplo, la directiva `v-bind` es usada para actualizar reactivamente un atributo HTML: 

``` html
<a v-bind:href="url"></a>
```

Aquí, el argumento es `href`, el cual le dice a la directiva `v-bind` que asigne el valor de la expresión `url` al atributo `href` del elemento.

Otro ejemplo es la directiva `v-on`, la cual escucha eventos del DOM:

``` html
<a v-on:click="doSomething">
```

Aquí el argumento es el nombre del evento a escuchar. Hablaremos con más detalle sobre control de eventos más adelante.

### Modificadores

Los Modificadores son sufijos especiales denotados con un punto, los cuales indican que una directiva deba ser asignada de una forma especial. Por ejemplo, el modificador `.prevent` le dice a la directiva `v-on` que llame a `event.preventDefault()` en el evento activado.

``` html
<form v-on:submit.prevent="onSubmit"></form>
```

Veremos más usos de los modificadores más adelante cuando repasemos con más detalle a `v-on` y `v-model`.

## Filtros

Vue.js le permite definir filtros que pueden ser usados para aplicar formatos de texto comunes. Los filtros pueden ser usados en dos lugares: **interpolaciones de corchete y expresiones `v-bind`**. Los filtros deben ser adicionados al final de una expresión JavaScript, denotados con el caracter barra vertical "|": 

``` html
<!-- en corchetes -->
{{ message | capitalize }}

<!-- en v-bind -->
<div v-bind:id="rawId | formatId"></div>
```

<p class="tip">Los filtros de Vue 2.x únicamente pueden ser usados dentro de interpolaciones de corchete y expresiones `v-bind` (ésto último soportado desde 2.1.0), ya que los filtros son principalmente diseñados para transformaciones de texto. Para transformaciones de datos más completos en otras directivas, usted debe usar [propiedades calculadas](computed.html).</p>

Las funciones filtro siempre reciben el valor de la expresión como primer argumento.

``` js
new Vue({
  // ...
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
})
```

Los filtros pueden ser encadenados:

``` html
{{ message | filterA | filterB }}
```

Los filtros son funciones de JavaScript, de modo que pueden tomar argumentos:

``` html
{{ message | filterA('arg1', arg2) }}
```

Aquí, el string plano `'arg1'` será pasado al filtro como el segundo argumento, y el valor de la expresión `arg2` será evaluada y pasada al filtro como el tercer argumento.

## Versiones Cortas

El prefijo `v-` funciona como una guía visual para identificar atributos específicos de Vue en sus plantillas. Esto es útil cuando usa Vue.js para aplicar comportamiento dinámico a algún código existente, pero a veces puede ser engorroso para algunas directivas de frecuente uso. Al mismo tiempo, la necesidad para el prefijo `v-` se vuelve menos importante cuando está construyendo una [SPA](https://en.wikipedia.org/wiki/Single-page_application) donde Vue.js controla cada plantilla. De modo que Vue.js ofrece versiones cortas para dos de las directivas más usadas, `v-bind` y `v-on`:

### Versión Corta Para `v-bind` 

``` html
<!-- sintaxis completa -->
<a v-bind:href="url"></a>

<!-- acortada -->
<a :href="url"></a>
```


### Versión Corta Para `v-on`

``` html
<!-- sintaxis completa -->
<a v-on:click="doSomething"></a>

<!-- acortada -->
<a @click="doSomething"></a>
```

Pueden parecer algo diferente a HTML normal, pero `:` y `@` son carácteres válidos para nombres de atributos, y todos los navegadores soportados por Vue.js pueden interpretarlos correctamente. Adicionalmente, no aparecen en el código renderizado final. La sintaxis corta es completamente opcional, pero usted seguramente la apreciará cuando aprenda más sobre su uso.
