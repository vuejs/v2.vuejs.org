---
title: Single File Components (Componentes de un solo archivo)
type: guide
order: 402
---

## Introducción

En muchos proyectos de Vue, los componentes globales serán definidos usando `Vue.component`, seguido de `new Vue({ el: '#container' })` para apuntar a un elemento contenedor en el body de cada página.

Esto puede funcionar muy bien para proyectos de tamaño pequeño a mediano, donde JavaScript es usado solamente para mejorar algunas vistas. Sin embargo, en proyectos con mayor complejidad, or donde tu front-end es enteramente basado conducido por JavaScript, estas desventajas se hacen evidentes:

- **Definiciones globales** fuerza a nombres unicos para cada componente
- **Plantilla de texto** carecen de resaltado de sintaxis y requieren el uso de barras para HTML multilínea
- **Sin soporte CSS** significa que mientras el HTML y JavaScript son modularizados en componentes, el CSS es omitido
- **Sin compilación** nos restringe a HTML y ES5 JavaScript, en lugar de preprocesadores como Pug (anteriormente Jade) y Babel

Todos estos puntos estan resueltos por **single-file components** con extensión `.vue`, lo cual es posible con herramientas como Webpack or Browserify.

Aquí tenemos un ejemplo de un archivo que llamaremos `Hello.vue`:

<a href="https://gist.github.com/chrisvfritz/e2b6a6110e0829d78fa4aedf7cf6b235" target="_blank"><img src="/images/vue-component.png" alt="Single-file component example (click for code as text)" style="display: block; margin: 30px auto;"></a>

Ahora tenemos:

- [Resaltado completo de la sintaxis](https://github.com/vuejs/awesome-vue#source-code-editing)
- [Módulos CommonJSCommonJS modules](https://webpack.js.org/concepts/modules/#what-is-a-webpack-module)
- [Definición de alcance del CSS por Component](https://vue-loader.vuejs.org/en/features/scoped-css.html)

Como prometimos, podemos también usar preprocesadores como Pug, Babel (con módulos ES2015), y Stylus para componentes más limpios y con más características.

<a href="https://gist.github.com/chrisvfritz/1c9f2daea9bc078dcb47e9a82e5f7587" target="_blank"><img src="/images/vue-component-with-preprocessors.png" alt="Single-file component example with preprocessors (click for code as text)" style="display: block; margin: 30px auto;"></a>

Estos lenguajes específicos son solo ejemplos. Usted podrías usar facilmente Bublé, TypeScript, SCSS, PostCSS - o cualquier otro preprocesador que le ayude a ser productivo. Si utiliza Webpack con `vue-loader`, esto también tiene soporte de primera clase para módulos CSS.

### Qué sobre la separación de

Una cosa importante a notar es que **la separación de concerns no es igual a la separación de tipos de archivo.** En el desarrollo moderno de UI, nos encontramos que en lugar de dividir el codigo base dentro de 3 capaz enormes que se entrelazan entre si, tiene mucho más sentido dividirlas dentro de componentes más livianos y componerlos entre sí.  Dentro de un componente, está su plantilla, lógica y los estilos son inherentemente acoplados, y su implementación hace que el componente sea más cohesivo y mantenible.

Incluso si no le gusta la idea de utilizar Single-File Components, usted puede aprovechar las características de hot-reloading y pre-compilación separando su JavaScript y CSS en archivos diferentes:

``` html
<!-- my-component.vue -->
<template>
  <div>This will be pre-compiled</div>
</template>
<script src="./my-component.js"></script>
<style src="./my-component.css"></style>
```

## Empezando

### Ejemplo con Sandbox

Si quieres profundizar y comenzar a jugar con single-file components, visita [esta aplicación to-do de ejemplo ](https://codesandbox.io/s/o29j95wx9) en CodeSandbox.

### Para usuarios nuevos en Sistemas de Construcción de Módulos en JavaScript

Con componentes `.vue`, estamos entrando en el reino de aplicaciones JavaScript avanzadas. Eso significa aprender a usar algunas herramientas adicionales si aún no lo ha hecho:

- **Node Package Manager (NPM)**: Lea la [Guía para comenzar](https://docs.npmjs.com/getting-started/what-is-npm) a través de a sección _10: Uninstalling global packages_.

- **Modern JavaScript with ES2015/16**: Lea la guía de Babel [Learn ES2015](https://babeljs.io/docs/learn-es2015/). Usted no tiene que memorizar cada característica ahora mismo, pero mantenga esta pagina como una referencia a la cual pueda regresar.

Despues de que usted haya tomado un día para profundizar en estos recursos, le recomendamos revisar la plantilla [webpack](https://vuejs-templates.github.io/webpack). Sigue las instrucciones y debería tener un proyecto Vue con componentes `.vue`, ES2015, y hot-reloading en un instante.

Para aprender más sobre Webpack, visite [su documentación oficial](https://webpack.js.org/configuration/) y [Webpack Academy](https://webpack.academy/p/the-core-concepts). En Webpack, cada archivo puede ser transformado por un "loader" antes de ser incluido en el the bundle, y Vue ofrece el plugin [vue-loader](https://vue-loader.vuejs.org) para traducir single file componentes (`.vue`).

### Para Usuarios Avanzados

Ya sea que usted prefiera Webpack o Browserify, hemos documentado plantillas para ambos, tanto para proyectos simples como más complejos. Recomendamos visitar [github.com/vuejs-templates](https://github.com/vuejs-templates), tomando la plantilla correcta para usted, entonces siga las instrucciones en el README para generar un nuevo proyecto con [vue-cli](https://github.com/vuejs/vue-cli).
