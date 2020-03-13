---
title: Registro de Componente
type: guide
order: 101
---

> Esta pagina asume que usted ya ha leído [Componentes: Lo básico](components.html). Léalo primero si usted es nuevo con componentes.

## Nombre del Componente

Cuando registramos un componente, siempre se le asignará un nombre. Por ejemplo, en el registro global hemos visto hasta ahora:

```js
Vue.component('my-component-name', { /* ... */ })
```

El nombre del componentes es el primer argumento de `Vue.component`.

El nombre que le dé a un componente puede depender de dónde pretenda utilizarlo. Cuando use un componente directamente en el DOM (a diferencia de en una string template o [componente de un solo archivo](single-file-components.html)), recomendamos encarecidamente seguir las [reglas de W3C](https://www.w3.org/TR/custom-elements/#concepts) para nombres de tags personalizados (todo en minúsculas, debe contener un guión). Esto le ayuda a evitar conflictos con los elementos HTML actuales y futuros.

Usted puede ver otras recomenaciones para nombres de componentes en la [Guía de Estilo](../style-guide/#Base-component-names-strongly-recommended).

### Nomenclatura

Tiene dos opciones cuando define el nombre de un componente:

#### Con kebab-case

```js
Vue.component('my-component-name', { /* ... */ })
```

Al definir un componente con kebab-case, también debe usar kebab-case al hacer referencia a su elemento personalizado, como en `<my-component-name>`.

#### Con PascalCase

```js
Vue.component('MyComponentName', { /* ... */ })
```

Cuando define un componente con PascalCase, puede usar cualquiera de los dos casos al hacer referencia a su elemento personalizado. Eso significa que tanto `<my-component-name>` como `<MyComponentName>` son aceptables. Sin embargo, tenga en cuenta que solo los nombres de casos de kebab son válidos directamente en el DOM (es decir, en las plantillas que no son string-template).

## Registro Global

Hasta ahora, solo hemos creado componentes usando `Vue.component`:

```js
Vue.component('my-component-name', {
  // ... options ...
})
```

Estos componentes son **registrados globalmente**. Lo que significa que ellos pueden ser usado en la plantilla de cual instancia raíz de Vue(`new Vue`) creada después del registro. Por ejemplo:

```js
Vue.component('component-a', { /* ... */ })
Vue.component('component-b', { /* ... */ })
Vue.component('component-c', { /* ... */ })

new Vue({ el: '#app' })
```

```html
<div id="app">
  <component-a></component-a>
  <component-b></component-b>
  <component-c></component-c>
</div>
```

Esto se aplica incluso a todos los subcomponentes, lo que significa que los tres componentes también estarán disponibles _dentro de cada uno_.

## Registro local

El registro global a menudo no es ideal. Por ejemplo, si estás usando un empaquetador de módulos como Webpack, el registro global de todos los componentes significa que, incluso si dejas de usar un componente, podría ser incluido en tu compilación final. Esto aumenta innecesariamente la cantidad de JavaScript que sus usuarios tienen que descargar

En estos casos, puede definir sus componentes como objetos JavaScript simples:

```js
var ComponentA = { /* ... */ }
var ComponentB = { /* ... */ }
var ComponentC = { /* ... */ }
```

Entonces, defina los componentes que le gustaría usar en una opción de `components`:

```js
new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})
```

Para cada propiedad del objeto `components`, la clave será el nombre del elemento personalizado, mientras que el valor contendrá el objeto de opciones del componente.

Note que los **componentes registrados localmente _no_ están tampoco disponibles en los subcomponentes**. Por ejemplo, si quisieras que el `ComponentA` estuviera disponible en el `ComponentB`, tendrías que usar:

```js
var ComponentA = { /* ... */ }

var ComponentB = {
  components: {
    'component-a': ComponentA
  },
  // ...
}
```

O si está usando módulos ES2015, como por ejemplo a través de Babel y Webpack, podría parecerse más a:

```js
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  },
  // ...
}
```

Note que en ES2015+, colocar un nombre de variable como `ComponentA` dentro de un objeto es la abreviatura de `ComponentA: ComponentA`, lo que significa que el nombre de la variable es ambos:

- el nombre del elemento personalizado para usar en la plantilla, y
- el nombre de la variable que contiene las opciones de componente

## Sistemas de módulos

Si no estás usando un sistema de módulos con `importar` o `requerir`, probablemente puedes saltarte esta sección por ahora. Si lo estás, tenemos algunas instrucciones y consejos especiales sólo para ti.

### Registro local en un Sistema de Módulos

Si todavía estás aquí, es probable que estés usando un sistema de módulos, como con Babel y Webpack. En estos casos, recomendamos crear un directorio de `components`, con cada componente en su propio archivo.

Entonces tendrás que importar cada componente que quieras usar, antes de registrarlo localmente. Por ejemplo, en un hipotético fichero `ComponentB.js` o `ComponentB.vue`:

```js
import ComponentA from './ComponentA'
import ComponentC from './ComponentC'

export default {
  components: {
    ComponentA,
    ComponentC
  },
  // ...
}
```

Ahora ambos `ComponentA` y `ComponentC` pueden ser usados dentro de la plantilla del `ComponentB`.

### Registro global automático de los componentes básicos

Muchos de sus componentes serán relativamente genéricos, posiblemente sólo envolviendo un elemento como un input o un botón. A veces nos referimos a ellos como [componentes base](../style-guide/#Base-component-names-strongly-recommended) y tienden a ser usados muy frecuentemente a través de sus componentes.

El resultado es que muchos componentes pueden incluir largas listas de componentes básicos:

```js
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'
import BaseInput from './BaseInput.vue'

export default {
  components: {
    BaseButton,
    BaseIcon,
    BaseInput
  }
}
```

Sólo para soportar relativamente poco markup en una plantilla:

```html
<BaseInput
  v-model="searchText"
  @keydown.enter="search"
/>
<BaseButton @click="search">
  <BaseIcon name="search"/>
</BaseButton>
```

Afortunadamente, si usas Webpack (o [Vue CLI 3+](https://github.com/vuejs/vue-cli), que usa Webpack internamente), puedes usar `require.context` para registrar globalmente sólo estos componentes base muy comunes. Aquí tienes un ejemplo del código que puedes usar para importar globalmente los componentes base en el archivo de entrada de tu aplicación (por ejemplo, `src/main.js`):

```js
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  // La ruta relativa de la carpeta de componentes
  './components',
  // Si mirar o no en las subcarpetas
  false,
  // La expresión regular utilizada para hacer coincidir los nombres de los componentes básicos de los ficheros
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // Obtener la configuración de los componentes
  const componentConfig = requireComponent(fileName)

  // Obtener el nombre PascalCase del componente
  const componentName = upperFirst(
    camelCase(
      // Strip the leading `./` and extension from the filename
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  )

  // Registrar el componente a nivel global
  Vue.component(
    componentName,
    // Busca las opciones de componentes en `.default`, que
    // existen si el componente fue exportado con `export default`,
    // de lo contrario volver a la raíz del módulo.
    componentConfig.default || componentConfig
  )
})
```

Recuerda que **el registro global debe tener lugar antes de que se cree la instancia raíz de Vue (con `new Vue`)**. [Aquí hay un ejemplo](https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js) de este patrón en un contexto de proyecto real.
