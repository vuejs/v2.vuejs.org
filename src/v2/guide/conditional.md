---
title: Renderización Condicional
type: guide
order: 7
---

## `v-if`

En los _string templates_, como por ejemplo, Handlebars, escribiríamos un bloque condicional como este:

``` html
<!-- template de Handlebars -->
{{#if ok}}
  <h1>Sí</h1>
{{/if}}
```

En Vue, usamos la directiva `v-if` para lograr lo mismo:

``` html
<h1 v-if="ok">Sí</h1>
```
También es posible agregar un "bloque _else_" con `v-else`:

``` html
<h1 v-if="ok">Sí</h1>
<h1 v-else>No</h1>
```

### Grupos Condicionales con `v-if` en `<template>`

Debido a que `v-if` es una directiva, debe adjuntarse a un solo elemento. Pero, ¿y si queremos cambiar más de un elemento? En este caso, podemos usar `v-if` en un elemento` <template>`, que sirve como un envoltorio invisible. El resultado final procesado no incluirá el elemento `<template>`.

``` html
<template v-if="ok">
  <h1>Título</h1>
  <p>Párrafo 1</p>
  <p>Párrafo 2</p>
</template>
```

### `v-else`

Puede usar la directiva `v-else` para indicar un "bloque _else_" para `v-if`:

``` html
<div v-if="Math.random() > 0.5">
  Ahora me ves
</div>
<div v-else>
  Ahora no
</div>
```

Un elemento `v-else` debe seguir inmediatamente a un elemento `v-if` o `v-else-if`, de lo contrario, no será reconocido.

### `v-else-if`

> Nuevo en 2.1.0+

El `v-else-if`, como su nombre lo indica, sirve como "bloque _else if_" para `v-if`. También puede ser encadenado varias veces:

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Si no es A, B o C
</div>
```

Similar a `v-else`, un elemento` v-else-if` debe seguir inmediatamente a un elemento `v-if` o `v-else-if`.

### Controlando Elementos Reutilizables con `key`

Vue intenta representar los elementos de la manera más eficiente posible, a menudo reutilizándolos en lugar de renderizarlos desde cero. Más allá de ayudar a hacer Vue muy rápido, esto puede tener algunas ventajas útiles. Por ejemplo, si permite a los usuarios alternar entre varios tipos de inicio de sesión:

``` html
<template v-if="loginType === 'username'">
  <label>Nombre de Usuario</label>
  <input placeholder="Ingrese su nombre de usuario">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Ingrese su email">
</template>
```

Luego, cambiando el `loginType` en el código anterior no borrará lo que el usuario ya ha ingresado. Dado que ambos _templates_ utilizan los mismos elementos, el `<input>` no se reemplaza, solo su `placeholder`.

Compruébelo usted mismo ingresando un texto en la entrada, luego presione el botón para alternar:

{% raw %}
<div id="no-key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Nombre de Usuario</label>
      <input placeholder="Ingrese su nombre de usuario">
    </template>
    <template v-else>
      <label>Email</label>
      <input placeholder="Ingrese su email">
    </template>
  </div>
  <button @click="toggleLoginType">Alternar tipo de Login</button>
</div>
<script>
new Vue({
  el: '#no-key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

Sin embargo, esto no siempre es deseable, por lo que Vue le ofrece una manera de decir: "Estos dos elementos están completamente separados, no los reutilice". Agregue un atributo `key` con valores únicos:

``` html
<template v-if="loginType === 'username'">
  <label>Nombre de Usuario</label>
  <input placeholder="Ingrese su nombre de usuario" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Ingrese su nombre de usuario" key="email-input">
</template>
```

Now those inputs will be rendered from scratch each time you toggle. See for yourself:
Ahora estas entradas se procesarán desde cero cada vez que presione alternar. Ver por ti mismo:

{% raw %}
<div id="key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Nombre de Usuario</label>
      <input placeholder="Ingrese su nombre de usuario" key="username-input">
    </template>
    <template v-else>
      <label>Email</label>
      <input placeholder="Ingrese su nombre de usuario" key="email-input">
    </template>
  </div>
  <button @click="toggleLoginType">Alternar tipo de Login</button>
</div>
<script>
new Vue({
  el: '#key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

Observe que los elementos `<label>` son todavía reutilizables, porque no tienen atributos `key`.

## `v-show`

Otra opción para mostrar un elemento condicionalmente es la directiva `v-show`. La utlización es basicamente la mismo:

``` html
<h1 v-show="ok">Hola!</h1>
```

La diferencia es que un elemento con `v-show` siempre se renderizará y permanecerá en el DOM; `v-show` simplemente alterna la propiedad CSS `display` del elemento.

<p class="tip">Observe que el uso de `v-show` no es compatible con elementos `<template>`, ni tampoco funciona con `v-else`.</p>

## `v-if` vs `v-show`

`v-if` es una renderización condicional "real" ya que garantiza que los eventos y componentes secundarios dentro del bloque condicional sean debidamente destruidos y recreados durante la alternancia.

`v-if` también es **lazy**: si la condición es falsa en la representación inicial, no se hará nada. El bloque condicional no se procesará hasta que la condición se convierta en true por primera vez.

En comparación, `v-show` es mucho más simple: el elemento siempre se representa independientemente de la condición inicial, con alternancia basada en CSS.

En general, `v-if` tiene costos de alternancia más altos, mientras que` v-show` tiene costos de renderización iniciales más altos. Por lo tanto, prefiera `v-show` si necesita cambiar algo muy a menudo, y prefiera` v-if` si es poco probable que la condición cambie en el tiempo de ejecución.

## `v-if` con `v-for`

<p class="tip">Usando `v-if` y `v-for` juntos **no es recomendado**. Vea la [guía de estilo](/v2/style-guide/#Avoid-v-if-with-v-for-essential) para mayor información.</p>

Cuando es utilizado junto con `v-for`, este tiene una prioridad más alta que `v-if`. Consulte la <a href="../guide/list.html#V-for-and-v-if"> guía de renderización de listas </a> para obtener más información.
