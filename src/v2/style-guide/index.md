---
title: Guía de Estilo
type: style-guide
---

Esta es la guía de estilo oficial para el código específico de Vue. Si usa Vue en un proyecto, es una excelente referencia para evitar errores, "bikeshedding" y antipatrones. Sin embargo, no creemos que ninguna guía de estilo sea ideal para todos los equipos o proyectos, por lo que las desviaciones conscientes se fomentan en función de la experiencia pasada, la tecnología acumulada y los valores personales.

También evitamos las sugerencias sobre JavaScript o HTML en general. No nos importa si usa punto y coma o comas finales. No nos importa si su HTML utiliza comillas simples o comillas dobles para los valores de los atributos. Sin embargo, algunas excepciones existirán cuando descubramos que un patrón particular es útil en el contexto de Vue.

> **Próximamente, también proporcionaremos consejos para su ejecución.** A veces simplemente tendrá que ser disciplinado, pero siempre que sea posible, trataremos de mostrarle cómo usar ESLint y otros procesos automatizados para simplificar el cumplimiento.

Finalmente, hemos dividido las reglas en cuatro categorías:


## Categorías

### Prioridad A: Esencial

Estas reglas ayudan a prevenir errores, así que apréndalas y cumpla con ellas a toda costa. Pueden existir excepciones, pero deben ser muy raras y sólo las deben realizar aquellas personas con conocimientos de JavaScript y Vue.

### Prioridad B: Muy recomendable

Se ha descubierto que estas reglas mejoran la legibilidad y/o la experiencia del desarrollador en la mayoría de los proyectos. Su código aún se ejecutará si no las respeta, pero estas excepciones deben ser raras y estar bien justificadas.

### Prioridad C: Recomendado

Donde existen opciones múltiples e igualmente buenas, se puede hacer una elección arbitraria para garantizar la coherencia. En estas reglas, describimos cada opción aceptable y sugerimos una opción predeterminada. Eso significa que puede sentirse libre de hacer una elección diferente en su propia base de código, siempre que sea coherente y tenga una buena razón para ello. Por favor, justifique su elección! Al adaptarse al estándar de la comunidad, usted:

1. Entrena su cerebro para analizar más fácilmente la mayoría del código de comunidad que encuentre
2. Será capaz de copiar y pegar la mayoría de los ejemplos de código de comunidad sin modificación
3. A menudo descubrirá que las nuevas convenciones ya están amoldadas a su estilo de codificación preferido, al menos en lo que respecta a Vue

### Prioridad D: Usar con precaución

Algunas características de Vue existen para adaptarse a casos excepcionales o migraciones menos "agresivas" desde una base de código heredada. Sin embargo, cuando se usan en exceso, pueden hacer que su código sea más difícil de mantener o incluso convertirse en una fuente de errores. Estas reglas arrojan luz sobre las características potencialmente riesgosas, y describen cuándo y por qué deberían evitarse.


## Reglas de prioridad A: Esencial (prevención de errores)


### Nombres de componentes de varias palabras <sup data-p="a">esencial</sup>

** Los nombres de los componentes siempre deben ser de varias palabras, a excepción de los componentes raíz de la "App" **.

Esto [evita conflictos](http://w3c.github.io/webcomponents/spec/custom/#valid-custom-element-name) con elementos HTML existentes y futuros, ya que todos los elementos HTML son una sola palabra.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` js
Vue.component('todo', {
  // ...
})
```

``` js
export default {
  name: 'Todo',
  // ...
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` js
Vue.component('todo-item', {
  // ...
})
```

``` js
export default {
  name: 'TodoItem',
  // ...
}
```
{% raw %}</div>{% endraw %}



### Componente data <sup data-p="a">esencial</sup>

**El componente `data` debe ser una función.**

Al usar la propiedad `data` en un componente (es decir, en cualquier lugar excepto en` new Vue`), el valor debe ser una función que devuelve un objeto.

{% raw %}
<details>
<summary>
  <h4>Explicación Detallada</h4>
</summary>
{% endraw %}

Cuando el valor de `data` es un objeto, se comparte en todas las instancias de un componente. Imagine, por ejemplo, un componente `TodoList` con estos datos:

``` js
data: {
  listTitle: '',
  todos: []
}
```

Es posible que deseemos reutilizar este componente, lo que permite a los usuarios mantener listas múltiples (por ejemplo, para comprar, listas de regalos, tareas diarias, etc.). Sin embargo, hay un problema. Como cada instancia del componente hace referencia al mismo objeto de datos, cambiar el título de una lista también cambiará el título de cada otra lista. Lo mismo es cierto para agregar / editar / eliminar un "ToDo".

En cambio, queremos que cada instancia de componente sólo administre sus propios datos. Para que eso suceda, cada instancia debe generar un objeto de datos único. En JavaScript, esto se puede lograr devolviendo el objeto en una función:

``` js
data: function () {
  return {
    listTitle: '',
    todos: []
  }
}
```
{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` js
Vue.component('some-comp', {
  data: {
    foo: 'bar'
  }
})
```

``` js
export default {
  data: {
    foo: 'bar'
  }
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto
``` js
Vue.component('some-comp', {
  data: function () {
    return {
      foo: 'bar'
    }
  }
})
```

``` js
// En un archivo .vue
export default {
  data () {
    return {
      foo: 'bar'
    }
  }
}
```

``` js
// Está bien usar un objeto directamente
// en una instancia raíz de Vue,
// ya que solo existirá esa única instancia.
new Vue({
  data: {
    foo: 'bar'
  }
})
```
{% raw %}</div>{% endraw %}



### Definiciones de Props  <sup data-p="a">esencial</sup>

**Las definiciones de Props deben ser lo mas detalladas posible.**

En el código "commiteado", las definiciones de props siempre deben ser lo más detalladas posible, especificando al menos su(s) tipo(s).

{% raw %}
<details>
<summary>
  <h4>Explicación Detallada</h4>
</summary>
{% endraw %}

Las [definiciones detalladas de props](https://vuejs.org/v2/guide/components.html#Prop-Validation) tienen dos ventajas:

- Documentan la API del componente, de modo que es fácil ver cómo se debe usar el componente.
- En desarrollo, Vue le advertirá si algún componente se proporciona con props formateados incorrectamente, ayudándole a detectar posibles fuentes de error.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` js
// Esto esta bien solo cuando se prototipa
props: ['status']
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` js
props: {
  status: String
}
```

``` js
// Mucho mejor!
props: {
  status: {
    type: String,
    required: true,
    validator: function (value) {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].indexOf(value) !== -1
    }
  }
}
```
{% raw %}</div>{% endraw %}



### Key + `v-for` <sup data-p="a">esencial</sup>

**Siempre use `key` con `v-for`.**

`key` con `v-for` es un requisito _perenne_ en componentes, para mantener el estado del componente interno en el subárbol. Sin embargo, incluso para los elementos, es una buena práctica mantener un comportamiento predecible, como [constancia del objeto](https://bost.ocks.org/mike/constancy/) en las animaciones.

{% raw %}
<details>
<summary>
  <h4>Explicación Detallada</h4>
</summary>
{% endraw %}

Digamos que tiene una lista de "ToDos":

``` js
data: function () {
  return {
    todos: [
      {
        id: 1,
        text: 'Learn to use v-for'
      },
      {
        id: 2,
        text: 'Learn to use key'
      }
    ]
  }
}
```

Luego los ordena alfabéticamente. Al actualizar el DOM, Vue optimizará la representación para realizar las mutaciones de DOM más efectivas en lo posible. Eso podría significar eliminar el primer elemento del "ToDo" y luego agregarlo nuevamente al final de la lista.

El problema es que hay casos en los que es importante no eliminar elementos que permanecerán en el DOM. Por ejemplo, puede usar `<transition-group>` para animar el orden de las listas, o mantener el foco si el elemento renderizado es `<input>`. En estos casos, agregar una clave única para cada elemento (por ejemplo, `:key="todo.id"`) le indicará a Vue cómo comportarse de manera más predecible.

En nuestra experiencia, es mejor agregar siempre una clave única, para que usted y su equipo simplemente nunca tengan que preocuparse por estos casos extremos. Luego, en los raros escenarios de rendimiento crítico donde la constancia del objeto no es necesaria, puede hacer una excepción consciente.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```
{% raw %}</div>{% endraw %}



### Evitar `v-if` con `v-for` <sup data-p="a">esencial</sup>

**Nunca use `v-if` en el mismo elemento que `v-for`.**

Hay dos casos comunes en los que esto puede ser tentador:

- Para filtrar elementos en una lista (por ejemplo, `v-for="user in users" v-if="user.isActive"`). En estos casos, reemplace `users` con una nueva propiedad calculada que devuelva su lista filtrada (por ejemplo `activeUsers`).

- Para evitar renderizar una lista si debe estar oculta (por ejemplo, `v-for="user in users" v-if="shouldShowUsers"`). En estos casos, mueva el `v-if` a un elemento contenedor (por ejemplo,`ul`, `ol`).

{% raw %}
<details>
<summary>
  <h4>Explicación Detallada</h4>
</summary>
{% endraw %}

Cuando Vue procesa directivas, `v-for` tiene mayor prioridad que `v-if`, entonces esta plantilla:

``` html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

Será evaluada de manera similar que:

``` js
this.users.map(function (user) {
  if (user.isActive) {
    return user.name
  }
})
```

Por lo tanto, aunque solo rendericemos elementos para una pequeña fracción de usuarios, debemos iterar sobre la lista completa cada vez que volvemos a renderizar, independientemente de si el conjunto de usuarios activos ha cambiado o no.

Al iterar sobre una propiedad calculada en su lugar, de esta manera:

``` js
computed: {
  activeUsers: function () {
    return this.users.filter(function (user) {
      return user.isActive
    })
  }
}
```

``` html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

Obtenemos los siguientes beneficios:

- La lista filtrada _sólo_ se volverá a evaluar si hay cambios relevantes en el arreglo `users`, lo que hace que el filtrado sea mucho más eficiente.
- Usando `v-for="user in activeUsers"`, _sólo_ iteramos sobre usuarios activos durante el renderizado, haciendo que el renderizado sea mucho más eficiente.
- La lógica ahora está desacoplada de la capa de presentación, por lo que el mantenimiento (cambio / extensión de la lógica) es mucho más fácil.

Obtenemos beneficios similares de la actualización:

``` html
<ul>
  <li
    v-for="user in users"
    v-if="shouldShowUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

a:

``` html
<ul v-if="shouldShowUsers">
  <li
    v-for="user in users"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

Al mover el `v-if` a un elemento contenedor, ya no estamos comprobando `shouldShowUsers` para _cada uno_ de los usuarios de la lista. En cambio, lo revisamos una vez y ni siquiera evaluamos el `v-for` si `shouldShowUsers` es falso.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

``` html
<ul>
  <li
    v-for="user in users"
    v-if="shouldShowUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```

``` html
<ul v-if="shouldShowUsers">
  <li
    v-for="user in users"
    :key="user.id"
  >
    {{ user.name }}
  <li>
</ul>
```
{% raw %}</div>{% endraw %}



### Scoping de Estilos de Componentes <sup data-p="a">esencial</sup>

**Para las aplicaciones, los estilos, en un componente `App` de nivel superior y en los componentes de "layout" pueden ser globales, pero todos los demás componentes siempre deben ser _scoped_**

Esto es relevante sólo a [componentes single-file](../guide/single-file-components.html). _No_ requiere que se use el atributo [`scoped`](https://vue-loader.vuejs.org/en/features/scoped-css.html). El "scoping" podría ser a través de [CSS modules](https://vue-loader.vuejs.org/en/features/css-modules.html), una estrategia basada en clases como [BEM](http://getbem.com/), ú otra biblioteca/convención.

**Para las bibliotecas de componentes, sin embargo, se debería implementar una estrategia basada en clases en vez de usar el atributo `scoped`.**

Esto hace que el "overriding" de los estilos internos sea más fácil, con nombres de clase legibles que no tienen una especificidad demasiado alta, y menos probable que generen conflictos.

{% raw %}
<details>
<summary>
  <h4>Explicación Detallada</h4>
</summary>
{% endraw %}

Si está desarrollando un proyecto grande, trabajando con otros desarrolladores o, a veces, incluye HTML / CSS de terceros (por ejemplo, de Auth0), el "consistent scoping" garantizará que sus estilos solo se apliquen a los componentes para los que están diseñados.

Más allá del atributo `scoped`, el uso de nombres de clase únicos puede ayudar a garantizar que el CSS de terceros no se aplique a su propio HTML. Por ejemplo, muchos proyectos usan los nombres de las clases `button`,` btn` o `icon`, por lo que incluso si no usan una estrategia como BEM, agregan un prefijo específico de la aplicación y / o componente específico (por ejemplo,`ButtonClose-icon`) puede proporcionar cierta protección.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` html
<template>
  <button class="btn btn-close">X</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` html
<template>
  <button class="button button-close">X</button>
</template>

<!-- Usando el atributo `scoped` -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

``` html
<template>
  <button :class="[$style.button, $style.buttonClose]">X</button>
</template>

<!-- Usando CSS modules -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

``` html
<template>
  <button class="c-Button c-Button--close">X</button>
</template>

<!-- Usando la convención BEM -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}



### Nombres de propiedades privadas <sup data-p="a">esencial</sup>

**Siempre use el prefijo `$_` para propiedades privadas en un plugin, mixin, etc. Luego, para evitar conflictos con código de otros desarrolladores, también incluya un _scope_ (ej. `$_yourPluginName_`).**

{% raw %}
<details>
<summary>
  <h4>Explicación Detallada</h4>
</summary>
{% endraw %}

Vue utiliza el prefijo `_` para definir sus propias propiedades privadas, entonces, utilizar el mismo prefijo (ej. `_update`) puede causar que una propiedad privada sea sobreescrita. Incluso si usted verifica y Vue no esta haciendo uso de dicho nombre, no hay garantía de que este conflicto no surja en una versión futura.

En cuanto al prefijo `$`, su propósito en el ecosistema de Vue es identificar las propiedades especiales de instancia que están expuestas al usuario, por lo tanto, utilizarlo para propiedades privadas no sería apropiado.

En su lugar, recomendamos combinar ambos prefijos en `$_`, como una convención para propiedades privadas, definidas por el usuario para que no haya conflicto con Vue.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` js
var myGreatMixin = {
  // ...
  methods: {
    update: function () {
      // ...
    }
  }
}
```

``` js
var myGreatMixin = {
  // ...
  methods: {
    _update: function () {
      // ...
    }
  }
}
```

``` js
var myGreatMixin = {
  // ...
  methods: {
    $update: function () {
      // ...
    }
  }
}
```

``` js
var myGreatMixin = {
  // ...
  methods: {
    $_update: function () {
      // ...
    }
  }
}
```

{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` js
var myGreatMixin = {
  // ...
  methods: {
    $_myGreatMixin_update: function () {
      // ...
    }
  }
}
```
{% raw %}</div>{% endraw %}


## Reglas de prioridad B: Altamente Recomendadas (Mejorar la legibilidad)

### Cada componente es un archivo <sup data-p="b">altamente recomendado</sup>

**Siempre que un compilador pueda concatenar archivos, cada componente debería estar en su propio archivo.**

Esto lo ayudará a usted a encontrar de una manera más rápida un componente cuando precise editarlo o verificar como se utiliza.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` js
Vue.component('TodoList', {
  // ...
})

Vue.component('TodoItem', {
  // ...
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```
{% raw %}</div>{% endraw %}



### Notación de nombres de componentes single-file <sup data-p="b">altamente recomendado</sup>

**Los nombres de los archivos de los [componentes single-file](../guide/single-file-components.html) deben ser siempre PascalCase o siempre kebab-case.**

El autocompletado de los editores de código funciona mejor cuando se utiliza PascalCase, ya que esta es consistente con la forma en que referenciamos componenten en JS(X) y plantillas, dónde sea posible. Sin embargo, nombres de archivos mixtos pueden crear problemas en sistemas de archivos insensibles a las mayúsculas y minúsculas, es por esto que utilizar kebab-case es perfectamente aceptable.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```
{% raw %}</div>{% endraw %}



### Nombre de componentes base <sup data-p="b">altamente recomendado</sup>

**Los componentes base (también conocidos como componentes de presentación, "tontos", o puros) que aplican estilos y convenciones específicas de la aplicación, deben comenzar con un prefijo específico, tal como `Base`, `App` o `V`.**

{% raw %}
<details>
<summary>
  <h4>Explicación Detallada</h4>
</summary>
{% endraw %}

Estos componentes son la base para la definición de estilos y comportamientos consistentes en la aplicación. Estos **solamente** deben contener:

- elementos HTML,
- otros componentes base, y
- elementos UI de terceros.

Pero, **nunca** deben contener estado global (como una _store_ Vuex por ejemplo).

Sus nombres generalmente incluyen el nombre del elemento que envuelven (por ejemplo `BaseButton`, `BaseTable`), a menos que no exista un elemento para su propósito específico (por ejemplo `BaseIcon`). Si usted construye componentes similares para un contexto más específico, casi siempre consumirán estos componentes (por ejemplo `BaseButton` podría ser consumido en `ButtonSubmit`).

Algunas ventajas de esta convención:

- Cuando están organizados alfabéticamente en los editores, los componentes base serán listados todos juntos, volviéndose más fácil de identificar.

- Dado que los nombres de los componentes siempre deben ser multi-palabras, esta convención impide tener que elegir un prefijo arbitrario para componentes base simples (por ejemplo `MyButton`, `VueButton`).

- Dado que estos componentes se utilizan con frecuencia, es posible que simplemente desee hacerlos globales en vez de importarlos en todos lados. Un prefijo hace esto posible con Webpack:

  ``` js
  var requireComponent = require.context("./src", true, /^Base[A-Z]/)
  requireComponent.keys().forEach(function (fileName) {
    var baseComponentConfig = requireComponent(fileName)
    baseComponentConfig = baseComponentConfig.default || baseComponentConfig
    var baseComponentName = baseComponentConfig.name || (
      fileName
        .replace(/^.+\//, '')
        .replace(/\.\w+$/, '')
    )
    Vue.component(baseComponentName, baseComponentConfig)
  })
  ```

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```
{% raw %}</div>{% endraw %}



### Nombres de componentes de instancia única <sup data-p="b">altamente recomendado</sup>

**Componentes que deben tener solamente una única instancia activa deben comenzar con el prefijo `The`, para denotar que solo puede haber una.**

Esto no quiere decir que el componente solamente se utiliza en una única página, sino que solamente será utilizado una vez _por página_. Este tipo de componente nunca aceptan propiedades, dado que son específicas para la aplicación, no del contexto de la misma. Si usted encuentra la necesidad de añadir propiedades, puede ser un buen indicio de que se trata de un componente reusable que solamente se utiliza una vez por página, _por ahora_.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

```
components/
|- Heading.vue
|- MySidebar.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```
{% raw %}</div>{% endraw %}



### Nombres de componentes fuertemente acoplados <sup data-p="b">altamente recomendado</sup>

**Los componentes hijo que están fuertemente acoplados a su padre deben incluir el nombre del componente padre como prefijo.**

Si un componente solo tiene sentido en el contetxo de un componente padre, dicha relación debe ser evidente en su nombre. Dado que usualmente los editores organizan los archivos alfabéticamente, esto también deja ambos archivos cerca visualmente.

{% raw %}
<details>
<summary>
  <h4>Explicación Detallada</h4>
</summary>
{% endraw %}

Usted puede verse tentado a resolver este problema colocando los componentes hijo en directorios nombrados como su componente padre. Por ejemplo:

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

or:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

Esto no es recomendado, ya que resulta en:

- Muchos archivos con nombres similares, haciendo difícil cambiar entre archivos en un editor de código.
- Muchos subdirectorios anidados, lo cual incrementa el tiempo que toma buscar un componente específico en un editor.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```
{% raw %}</div>{% endraw %}



### Orden de las palabras en el nombre de los componentes <sup data-p="b">altamente recomendado</sup>

**Los nombres de los componentes deben comenzar con la palabra de más alto nivel (muchas veces la más general) y terminar con palabras descriptivas.**

{% raw %}
<details>
<summary>
  <h4>Explicación Detallada</h4>
</summary>
{% endraw %}

Usted se debe estar preguntando:

> "¿Por qué forzar un lenguaje menos natural al nombrar componentes?"

En inglés, adjetivos y otros descriptores aparecen típicamente antes de los sustantivos, mientras que excepciones requieren conectores. Por ejemplo:

- Café _con_ leche
- Sopa _del_ día
- Visitante _del_ museo

Usted puede definitivamente incluir estos conectores en el nombre de los componentes si así lo desea, pero el orden de las palabras sigue siendo importante.


También observe que **lo que es considerado "de más alto nivel" será contextual a su aplicación**. Por ejemplo, imagine una aplicación con un formulario de búsqueda. Este puede incluir componentes como:

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

Como puede ver, es un poco difícil ver que componentes son específicas para el formulario de búsqueda. Ahora, renombremos los componentes de acuerdo a la regla:

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

Ya que los editores organizan los archivos alfabéticamente, todos los componentes que se relacionan quedan evidentes por el propio nombre.

Usted puede verse tentado a resolver este problema de una forma diferente, anidando todos los componentes del formulario de búsqueda bajo un directorio llamado "search", y todos los componentes de configuración bajo otro directorio llamado "settings". Solo recomendamos este enfoque en aplicaciones de gran porte (por ejemplo, con más de 100 componentes), por las siguientes razones:

- Generalmente lleva más tiempo navegador a través de subdirectorios anidados que recorrer un simple directorio `components`.
- Conflictos de nombres (por ejemplo, múltiples componentes `ButtonDelete.vue`) dificultan la navegación rápida a un componente específico en un editor de código.
- La refactorización se vuelve más difícil, ya que buscar-y-sustituir no siempre será suficiente para actualizar las referencias relativas al componente movido.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```
{% raw %}</div>{% endraw %}



### Componentes con cierre automático <sup data-p="b">altamente recomendado</sup>

**Componentes sin contenido deben cerrarse automáticamenete en [componentes single-file](../guide/single-file-components.html), plantillas basadas en _strings_, y [JSX](../guide/render-function.html#JSX) - pero nunca en plantillas del DOM.**

Los componentes que se cierran automáticamente no solo comunican que no tienen contenido, sino que garantizan que no deben tener contenido. Es la diferencia entre una página en blanco en un libro y una con el texto "Está página fue intencionalmente dejada en blanco". También, su código es más limpio sin la _tag_ de cerrado innecesaria.

Desafortunadamente, HTML no permite que los elementos personalizados se cierren automáticamente - sólo los [official "void" elements](https://www.w3.org/TR/html/syntax.html#void-elements). Es por eso que esta estrategia solo es posible cuando las plantillas Vue son compiladas antes de estar en el DOM, por lo que pueden servir HTML compatible con la especifiación.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` html
<!-- En componentes de un solo archivo, templates basados en string, y JSX -->
<MyComponent></MyComponent>
```

``` html
<!-- En plantillas del DOM -->
<my-component/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` html
<!-- En componentes de un solo archivo, templates basados en string, y JSX -->
<MyComponent/>
```

``` html
<!-- En plantillas del DOM -->
<my-component></my-component>
```
{% raw %}</div>{% endraw %}



### Notación de nombres de componentes en templates <sup data-p="b">altamente recomendado</sup>

**En la mayoría de los proyectos, los nombres de los componentes deben ser siempre PascalCase en [componentes single-file](../guide/single-file-components.html) y plantillas basadas en _string_ - pero kebab-case en plantillas del DOM.**

PascalCase tiene algunas ventajas sobre kebab-case:

- Editores pueden autocompletar nombres de componentes en plantillas, ya que en JavaScript también se utiliza PascalCase.
- `<MyComponent>` es más distintivo visualmente que un elemento HTML simple que `<my-component>`, porque hay dos caracteres distintos (las dos mayúsculas), en lugar de solo uno (el guión).
- Si usted utiliza cualquier elemento no Vue en sus plantillas, como un componente web, PascalCase asegura que sus componente Vue se mantendrán distinguibles visualmente.

Desafortunadamente, como HTML es insensible a las mayúsculas y minúsculas, plantillas del DOM deben utilizar kebab-case.

También tenga en cuenta que si usted ya ha invertido fuertemente en kebab-case, la consistencia con las convenciones de HTLM y la posibilidad de utilizar ese mismo enfoque en todos sus proyectos puede ser más importante que las ventajas mencionadas anteriormente. En dichos casos, **utilizar kebab-case en todos lados también es aceptable**.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` html
<!-- En componentes single-file y templates basados en string -->
<mycomponent/>
```

``` html
<!-- En componentes single-file y templates basados en string -->
<myComponent/>
```

``` html
<!-- En DOM templates -->
<MyComponent></MyComponent>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` html
<!-- En componentes single-file y templates basados en string -->
<MyComponent/>
```

``` html
<!-- En DOM templates -->
<my-component></my-component>
```

OR

``` html
<!-- En todos lados -->
<my-component></my-component>
```
{% raw %}</div>{% endraw %}



### Notación de nombres de componentes en JS/JSX <sup data-p="b">altamente recomendado</sup>

**Los nombres de los componentes en JS/[JSX](../guide/render-function.html#JSX) siempre deben ser PascalCase, aunque pueden ser kebab-case dentro de _strings_ en aplicaciones más simples, que solo utilizan registro global de componentes a través de `Vue.component`.**

{% raw %}
<details>
<summary>
  <h4>Explicación Detallada</h4>
</summary>
{% endraw %}

En JavaScript, PascalCase es la convención para clases y constructores - esencialmente, cualquier cosa que pueda tener instancias diferentes. Los componentes de Vue también tienen instancias, así que tiene sentido utilizar PascalCase. Como un beneficio agregado, utilizar PascalCase en JSX (y plantillas) nos permite distinguir de una manera más fácil entre componentes y elementos HTML.

Sin embargo, para aplicaciones que **solo** utilizen definiciones globales vía `Vue.component`, nosotros recomendamos utilizar kebab-case. Las razones son las siguientes:

- Es raro que los componentes globales sean referenciados en JavaScript, entonces adoptar una convención para Javascript no tiene sentido.
- Estas aplicaciones siempre incluyen muchas plantillas del DOM donde [kebab-case **debe** ser utilizada](#Notacion-de-nombres-de-componentes-en-templates-altamente-recomendado).

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` js
Vue.component('myComponent', {
  // ...
})
```

``` js
import myComponent from './MyComponent.vue'
```

``` js
export default {
  name: 'myComponent',
  // ...
}
```

``` js
export default {
  name: 'my-component',
  // ...
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` js
Vue.component('MyComponent', {
  // ...
})
```

``` js
Vue.component('my-component', {
  // ...
})
```

``` js
import MyComponent from './MyComponent.vue'
```

``` js
export default {
  name: 'MyComponent',
  // ...
}
```
{% raw %}</div>{% endraw %}



### Componentes con nombres completos <sup data-p="b">altamente recomendado</sup>

**Nombres de componentes deben tener palabras completas, en vez de abreviaciones.**

El autocompletado automático en los editores hace que el costo de escribir nombres largos muy bajo, mientras que la claridad que estos proveen es invaluable. En particular, las abreviaciones poco comunes debe ser evitadas.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```
{% raw %}</div>{% endraw %}



### Notación de nombres de propiedades <sup data-p="b">altamente recomendado</sup>

**Los nombres de propiedades siempre deben utilizar camelCase al declararse, pero kebab-case en plantillas y [JSX](../guide/render-function.html#JSX).**

Simplemente estamos siguiendo las convenciones de cada lenguaje. En Javascript, camelCase es más natural, mientras que HTML, kebab-case lo es.


{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` js
props: {
  'greeting-text': String
}
```

``` html
<WelcomeMessage greetingText="hi"/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` js
props: {
  greetingText: String
}
```

``` html
<WelcomeMessage greeting-text="hi"/>
```
{% raw %}</div>{% endraw %}



### Elementos multi-atriubto <sup data-p="b">altamente recomendado</sup>

**Elementos con múltiples atributos deben ocupar múltiples líneas, con un atributo por línea.**

En Javascript, dividir objetos que poseen múltiples propiedades en varias líneas es considerado una buena práctica, porque es mucho más fácil de leer. Nuestras plantillas y [JSX](../guide/render-function.html#JSX) merecen la misma consideración.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

``` html
<MyComponent foo="a" bar="b" baz="c"/>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

``` html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```
{% raw %}</div>{% endraw %}



### Expresiones simples en tempaltes <sup data-p="b">altamente recomendado</sup>

**Plantillas de componentes deben incluir expresiones simples, con expresiones más complejas refactorizadas en propiedades computadas o métodos.**

Las expresiones complejas en sus plantillas los tornan menos declarativos. Debemos enfocarnos en escribir _qué_ debe aparecer, no en _cómo_ estamos computando dicho valor. También, las propiedades computadas y métodos permite que el código sea reutilizado.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` html
{{
  fullName.split(' ').map(function (word) {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` html
<!-- En un template -->
{{ normalizedFullName }}
```

``` js
// La expresión compleja ha sido movida a una propiedad computada
computed: {
  normalizedFullName: function () {
    return this.fullName.split(' ').map(function (word) {
      return word[0].toUpperCase() + word.slice(1)
    }).join(' ')
  }
}
```
{% raw %}</div>{% endraw %}



### Propiedades computadas simples <sup data-p="b">altamente recomendado</sup>

**Propiedades computadas complejas deben ser separadar en propiedades más simples, siempre que sea posible.**

{% raw %}
<details>
<summary>
  <h4>Explicación Detallada</h4>
</summary>
{% endraw %}

Propiedades computadas simples y bien nombradas son:

- __Fácil de testear__

  Cuando cada propiedad computada contiene solo una expresión simple, con pocas dependencias, es más fácil escribir _tests_ confirmando que esta funciona correctamente.

- __Fácil de leer__

  Simplificar las propiedades computadas le obliga a darle un nombre descriptivo a cada valor, incluso si no es reutilizado. Esto facilita a otros desarrolladores (y en el futuro, a usted) enfocarse en el código que les importa y descubrir lo que este hace.

- __Más adaptable al cambio en requirimientos__

  Cualquier valor que pueda ser nombrado puede ser útil para la vista. Por ejemplo, podemos decidir mostrar un mensaje al usuario diciendo cuanto dinero ahorró. Podemos también decidir calcular los impuestos sobre las ventas, pero quizás mostrar estos valores separados y no como parte del precio final.

  Las propiedades computadas son pequeñas y enfocadas hacen menos suposiciones sobre como se utilizará la información, por lo que requieren una menor refactorización a medida que cambian los requerimientos.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` js
computed: {
  price: function () {
    var basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` js
computed: {
  basePrice: function () {
    return this.manufactureCost / (1 - this.profitMargin)
  },
  discount: function () {
    return this.basePrice * (this.discountPercent || 0)
  },
  finalPrice: function () {
    return this.basePrice - this.discount
  }
}
```
{% raw %}</div>{% endraw %}



### Comillas en los valores de los atributos <sup data-p="b">altamente recomendado</sup>

**Los valores de atributos HTML no vacíos siempre deben estar dentro de comillas (simples o dobles, la que no sea utilizada en  JS).**

Si bien los valores de atributos sin espacios no requiren comillas en HTML, esta práctica usualmente conduce a _evitar_ espacios, lo que causa que los valores de los atributos sean menos legibles.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` html
<input type=text>
```

``` html
<AppSidebar :style={width:sidebarWidth+'px'}>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` html
<input type="text">
```

``` html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```
{% raw %}</div>{% endraw %}



### Abreviación de directivas <sup data-p="b">altamente recomendado</sup>

**Las abreviación de directivas (`:` para `v-bind` y `@` para `v-on:`) deben ser utilizadas siempre o nunca.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

``` html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

``` html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

``` html
<input
  @input="onInput"
  @focus="onFocus"
>
```

``` html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```
{% raw %}</div>{% endraw %}




## Reglas de prioridad C: Recomendadas (Minimizando Elecciones Arbitrarias y Sobrecarga Cognitiva)


### Orden de las opciones en un componente/instancia <sup data-p="c">recomendado</sup>

**Opciones de componentes/instancias deben ser ordenadas consistentemente.**

Este es el orden que recomendamos para las opciones de los componentes. Estas están separadas en categorías, así usted sabe donde agregar nuevas propiedades de _plugins_.

1. **Efectos colaterales** (desencadenan efectos fuera del componente)
  - `el`

2. **Consciencia Global** (requiere conocimiento más allá del componente)
  - `name`
  - `parent`

3. **Tipo de componente** (cambia el tipo del componente)
  - `functional`

4. **Modificadores de template** (cambia la forma en que el template es compilado)
  - `delimiters`
  - `comments`

5. **Dependencias de template** (_assets_ utilizados en el template)
  - `components`
  - `directives`
  - `filters`

6. **Composición** (mezcla propiedades en las opciones)
  - `extends`
  - `mixins`

7. **Interfaz** (la interfaz del componente)
  - `inheritAttrs`
  - `model`
  - `props`/`propsData`

8. **Estado Local** (propiedades reactivas locales)
  - `data`
  - `computed`

9. **Eventos** (_callbacks_ disparados por eventos reactivos)
  - `watch`
  - Eventos del ciclo de vida (en el orden que son invocados)
    - `beforeCreate`
    - `created`
    - `beforeMount`
    - `mounted`
    - `beforeUpdate`
    - `updated`
    - `activated`
    - `deactivated`
    - `beforeDestroy`
    - `destroyed`

10. **Propiedades no reactivas** (propiedades de isntancia independientes del sistema de reactividad)
  - `methods`

11. **Renderización** (la descripción declarativa de la salida del componente)
  - `template`/`render`
  - `renderError`



### Order de los atributos en un elemento <sup data-p="c">recomendado</sup>


**Orden de los atributos de elementos (incluyendo componentes) deben ser ordenadas consistentemente.**

Este es el orden que recomendamos para las opciones de los componentes. Estas están separadas en categorías, así usted sabe donde agregar nuevos atributos y directivas.

1. **Definición** (provee las opciones del componente)
  - `is`

2. **Renderización de Listas** (crea múltiples variaciones del mismo elemento)
  - `v-for`

3. **Condicionales** (sí el elemento es renderizado/mostrado)
  - `v-if`
  - `v-else-if`
  - `v-else`
  - `v-show`
  - `v-cloak`

4. **Modificadores de renderizado** (cambia la forma en la que el elemento se renderiza)
  - `v-pre`
  - `v-once`

5. **Consciencia Global** (requiere conocimiento más allá del componente)
  - `id`

6. **Atributos Únicos** (atributos que requieren valores únicos)
  - `ref`
  - `key`
  - `slot`

7. **Vinculación Bidireccional** (combinación de vinculación y eventos)
  - `v-model`

8. **Otros Atributos** (todos los no especificados)

9. **Eventos** (_event listeners_ del componentes)
  - `v-on`

10. **Contenido** (sobreescribe el contenido del elemento)
  - `v-html`
  - `v-text`



### Líneas vacías en las opciones de un componente/instancia <sup data-p="c">recomendado</sup>

**Usted puede añadir una línea vacía entre propiedades que se extienden en múltiples líneas, particularmente si las opciones no entrar en la pantalla sin _scrollear_.**

Cuando un componente comienza a sentirse apretado o difícil de leer, añadir espacios entre propiedades que se extienden en múltiples líneas puede mejorar la legibilidad. En algunos editores, como Vim, opciones de formateo como esta pueden facilitar la navegación con el teclado.

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue: function () {
    // ...
  },

  inputClasses: function () {
    // ...
  }
}
```

``` js
// No tener espacios también es correcto, siempre y cuando
// el componente siga siendo fácil de leer y navegar.
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue: function () {
    // ...
  },
  inputClasses: function () {
    // ...
  }
}
```
{% raw %}</div>{% endraw %}



### Orden de los elementos de nivel superior de un componente single-file <sup data-p="c">recomendado</sup>

**[Componentes single-file](../guide/single-file-components.html) siempre deben ordenar las etiquetas `<script>`, `<template>`, y `<style>` consistentemente, con `<style>` por último, ya que al menos una de las otras dos siempre es necesaria.**

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` html
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

``` html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

``` html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
{% raw %}</div>{% endraw %}



## Priority D Rules: Use with Caution (Potentially Dangerous Patterns)



### `v-if`/`v-else-if`/`v-else` without `key` <sup data-p="d">use with caution</sup>

**It's usually best to use `key` with `v-if` + `v-else`, if they are the same element type (e.g. both `<div>` elements).**

By default, Vue updates the DOM as efficiently as possible. That means when switching between elements of the same type, it simply patches the existing element, rather than removing it and adding a new one in its place. This can have [unintended side effects](https://jsfiddle.net/chrisvfritz/bh8fLeds/) if these elements should not actually be considered the same.

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` html
<div v-if="error">
  Error: {{ error }}
</div>
<div v-else>
  {{ results }}
</div>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` html
<div
  v-if="error"
  key="search-status"
>
  Error: {{ error }}
</div>
<div
  v-else
  key="search-results"
>
  {{ results }}
</div>
```

``` html
<p v-if="error">
  Error: {{ error }}
</p>
<div v-else>
  {{ results }}
</div>
```
{% raw %}</div>{% endraw %}



### Element selectors with `scoped` <sup data-p="d">use with caution</sup>

**Element selectors should be avoided with `scoped`.**

Prefer class selectors over element selectors in `scoped` styles, because large numbers of element selectors are slow.

{% raw %}
<details>
<summary>
  <h4>Explicación Detallada</h4>
</summary>
{% endraw %}

To scope styles, Vue adds a unique attribute to component elements, such as `data-v-f3f3eg9`. Then selectors are modified so that only matching elements with this attribute are selected (e.g. `button[data-v-f3f3eg9]`).

The problem is that large numbers of [element-attribute selectors](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=a%5Bhref%5D&body=background%3A+%23CFD&ne=1000) (e.g. `button[data-v-f3f3eg9]`) will be considerably slower than [class-attribute selectors](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=.class%5Bhref%5D&body=background%3A+%23CFD&ne=1000) (e.g. `.btn-close[data-v-f3f3eg9]`), so class selectors should be preferred whenever possible.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` html
<template>
  <button>X</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` html
<template>
  <button class="btn btn-close">X</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```
{% raw %}</div>{% endraw %}



### Implicit parent-child communication <sup data-p="d">use with caution</sup>

**Props and events should be preferred for parent-child component communication, instead of `this.$parent` or mutating props.**

An ideal Vue application is props down, events up. Sticking to this convention makes your components much easier to understand. However, there are edge cases where prop mutation or `this.$parent` can simplify two components that are already deeply coupled.

The problem is, there are also many _simple_ cases where these patterns may offer convenience. Beware: do not be seduced into trading simplicity (being able to understand the flow of your state) for short-term convenience (writing less code).

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: '<input v-model="todo.text">'
})
```

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeTodo () {
      var vm = this
      vm.$parent.todos = vm.$parent.todos.filter(function (todo) {
        return todo.id !== vm.todo.id
      })
    }
  },
  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        X
      </button>
    </span>
  `
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

``` js
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        X
      </button>
    </span>
  `
})
```
{% raw %}</div>{% endraw %}



### Non-flux state management <sup data-p="d">use with caution</sup>

**[Vuex](https://github.com/vuejs/vuex) should be preferred for global state management, instead of `this.$root` or a global event bus.**

Managing state on `this.$root` and/or using a [global event bus](https://vuejs.org/v2/guide/migration.html#dispatch-and-broadcast-replaced) can be convenient for very simple cases, but are not appropriate for most applications. Vuex offers not only a central place to manage state, but also tools for organizing, tracking, and debugging state changes.

{% raw %}</details>{% endraw %}

{% raw %}<div class="style-example example-bad">{% endraw %}
#### Incorrecto

``` js
// main.js
new Vue({
  data: {
    todos: []
  },
  created: function () {
    this.$on('remove-todo', this.removeTodo)
  },
  methods: {
    removeTodo: function (todo) {
      var todoIdToRemove = todo.id
      this.todos = this.todos.filter(function (todo) {
        return todo.id !== todoIdToRemove
      })
    }
  }
})
```
{% raw %}</div>{% endraw %}

{% raw %}<div class="style-example example-good">{% endraw %}
#### Correcto

``` js
// store/modules/todos.js
export default {
  state: {
    list: []
  },
  mutations: {
    REMOVE_TODO (state, todoId) {
      state.list = state.list.filter(todo => todo.id !== todoId)
    }
  },
  actions: {
    removeTodo ({ commit, state }, todo) {
      commit('REMOVE_TODO', todo.id)
    }
  }
}
```

``` html
<!-- TodoItem.vue -->
<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo(todo)">
      X
    </button>
  </span>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: mapActions(['removeTodo'])
}
</script>
```
{% raw %}</div>{% endraw %}



{% raw %}
<script>
(function () {
  var enforcementTypes = {
    none: '<span title="There is unfortunately no way to automatically enforce this rule.">self-discipline</span>',
    runtime: 'runtime error',
    linter: '<a href="https://github.com/vuejs/eslint-plugin-vue#eslint-plugin-vue" target="_blank">plugin:vue/recommended</a>'
  }
  Vue.component('sg-enforcement', {
    template: '\
      <span>\
        <strong>Enforcement</strong>:\
        <span class="style-rule-tag" v-html="humanType"/>\
      </span>\
    ',
    props: {
      type: {
        type: String,
        required: true,
        validate: function (value) {
          Object.keys(enforcementTypes).indexOf(value) !== -1
        }
      }
    },
    computed: {
      humanType: function () {
        return enforcementTypes[this.type]
      }
    }
  })

  // new Vue({
  //  el: '#main'
  // })
})()
</script>
{% endraw %}
