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

This even applies to all subcomponents, meaning all three of these components will also be available _inside each other_.

## Local Registration

Global registration often isn't ideal. For example, if you're using a build system like Webpack, globally registering all components means that even if you stop using a component, it could still be included in your final build. This unnecessarily increases the amount of JavaScript your users have to download.

In these cases, you can define your components as plain JavaScript objects:

```js
var ComponentA = { /* ... */ }
var ComponentB = { /* ... */ }
var ComponentC = { /* ... */ }
```

Then define the components you'd like to use in a `components` option:

```js
new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})
```

For each property in the `components` object, the key will be the name of the custom element, while the value will contain the options object for the component.

Note that **locally registered components are _not_ also available in subcomponents**. For example, if you wanted `ComponentA` to be available in `ComponentB`, you'd have to use:

```js
var ComponentA = { /* ... */ }

var ComponentB = {
  components: {
    'component-a': ComponentA
  },
  // ...
}
```

Or if you're using ES2015 modules, such as through Babel and Webpack, that might look more like:

```js
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  },
  // ...
}
```

Note that in ES2015+, placing a variable name like `ComponentA` inside an object is shorthand for `ComponentA: ComponentA`, meaning the name of the variable is both:

- the custom element name to use in the template, and
- the name of the variable containing the component options

## Module Systems

If you're not using a module system with `import`/`require`, you can probably skip this section for now. If you are, we have some special instructions and tips just for you.

### Local Registration in a Module System

If you're still here, then it's likely you're using a module system, such as with Babel and Webpack. In these cases, we recommend creating a `components` directory, with each component in its own file.

Then you'll need to import each component you'd like to use, before you locally register it. For example, in a hypothetical `ComponentB.js` or `ComponentB.vue` file:

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

Now both `ComponentA` and `ComponentC` can be used inside `ComponentB`'s template.

### Automatic Global Registration of Base Components

Many of your components will be relatively generic, possibly only wrapping an element like an input or a button. We sometimes refer to these as [base components](../style-guide/#Base-component-names-strongly-recommended) and they tend to be used very frequently across your components.

The result is that many components may include long lists of base components:

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

Just to support relatively little markup in a template:

```html
<BaseInput
  v-model="searchText"
  @keydown.enter="search"
/>
<BaseButton @click="search">
  <BaseIcon name="search"/>
</BaseButton>
```

Fortunately, if you're using Webpack (or [Vue CLI 3+](https://github.com/vuejs/vue-cli), which uses Webpack internally), you can use `require.context` to globally register only these very common base components. Here's an example of the code you might use to globally import base components in your app's entry file (e.g. `src/main.js`):

```js
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  // The relative path of the components folder
  './components',
  // Whether or not to look in subfolders
  false,
  // The regular expression used to match base component filenames
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // Get component config
  const componentConfig = requireComponent(fileName)

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Strip the leading `./` and extension from the filename
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  )

  // Register component globally
  Vue.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  )
})
```

Remember that **global registration must take place before the root Vue instance is created (with `new Vue`)**. [Here's an example](https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js) of this pattern in a real project context.
