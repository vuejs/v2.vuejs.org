---
title: Componentes de un Solo Archivo (Single File Components)
type: guide
order: 402
---

## Introducción

En muchos proyectos de Vue los componentes globales son definidos usando `Vue.component`, seguido de `new Vue({ el: '#container' })` para apuntar a un elemento contenedor en el cuerpo de cada página.

Esto puede funcionar muy bien para proyectos pequeños y medianos, donde JavaScript solo se usa para mejorar ciertas vistas. Sin embargo, en proyectos más complejos, o cuando la interfaz está exclusivamente impulsada por JavaScript, varias desventajas se hacen evidentes:

- Las **definiciones globales** nos obligan a usar nombres únicos para cada componente
- Las **plantillas de texto** carecen de resaltado de sintaxis y requieren feas barras para generar HTML multilínea
- La **ausencia de soporte para CSS** significa que, en tanto HTML y JavaScript son modularizados en componentes, el CSS queda visiblemente fuera
- **Sin una etapa de compilación** nos vemos restringidos a HTML y ES5, en lugar de pre-procesadores como Pug (anteriormente Jade) y Babel

Todo esto se resuelve mediante Componentes de un Solo Archivo con extensión .vue, que pueden usarse con herramientas de compilación como Webpack o Browserify.

Aquí tenemos un ejemplo de un archivo que llamaremos `Hello.vue`:

<a href="https://gist.github.com/chrisvfritz/e2b6a6110e0829d78fa4aedf7cf6b235" target="_blank"><img src="/images/vue-component.png" alt="Ejemplo de Componente de un Solo Archivo (click para ver código como texto)" style="display: block; margin: 30px auto;"></a>

Ahora tenemos:

- [Resaltado completo de la sintaxis](https://github.com/vuejs/awesome-vue#source-code-editing)
- [Módulos CommonJS](https://webpack.js.org/concepts/modules/#what-is-a-webpack-module)
- [CSS con alcance de componente](https://vue-loader.vuejs.org/en/features/scoped-css.html)

Como prometimos, podemos también usar pre-procesadores como Pug, Babel (con módulos ES2015) y Stylus para obtener componentes más limpios y con más funcionalidades.

<a href="https://gist.github.com/chrisvfritz/1c9f2daea9bc078dcb47e9a82e5f7587" target="_blank"><img src="/images/vue-component-with-preprocessors.png" alt="Ejemplo de Componente de un Solo Archivo con pre-procesadores (click para ver código como texto)" style="display: block; margin: 30px auto;"></a>

Estos lenguajes específicos son solo ejemplos. Usted podría usar, con la misma facilidad, Bublé, TypeScript, SCSS, PostCSS, o cualquier otro pre-procesador que le ayude a ser productivo. Si utiliza Webpack con `vue-loader`, también le ofrece soporte de primera clase para módulos CSS.

### ¿Qué sucede con la separación de intereses?

Es importante notar que **la separación de intereses no equivale a la separación de tipos de archivo.** En el desarrollo moderno de UI nos encontramos con que, en lugar de dividir el código base dentro de 3 capas enormes que se entrelazan entre sí, tiene mucho más sentido dividirlas dentro de componentes más livianos, y componer las capas entre sí. Dentro de un componente, su plantilla, lógica y estilos están inherentemente acoplados; ubicándolos en un mismo lugar logramos que el componente sea más coherente y mantenible.

Incluso si no le gusta la idea de utilizar Componentes de un Solo Archivo, puede aprovechar las características de hot-reload y compilación previa, separando su JavaScript y CSS en archivos diferentes:

``` html
<!-- my-component.vue -->
<template>
  <div>Esto será precompilado</div>
</template>
<script src="./my-component.js"></script>
<style src="./my-component.css"></style>
```

## Empezando

### Ejemplo con Sandbox

Si quiere profundizar y comenzar a jugar con Componentes de un Solo Archivo, visite [esta aplicación to-do de ejemplo](https://codesandbox.io/s/o29j95wx9) en CodeSandbox.

### Para usuarios nuevos en Sistemas de Compilación de Módulos en JavaScript

Con los componentes `.vue` entramos en el reino de las aplicaciones JavaScript avanzadas. Esto significa aprender a usar algunas herramientas adicionales, si es que usted aún no lo ha hecho:

- **Manejador de Paquetes de Node** (Node Package Manager, NPM): Lea la Sección 10 de la [Guía para comenzar](https://docs.npmjs.com/getting-started/what-is-npm): _Desinstalando paquetes globales_ (_Uninstalling global packages_).

- **JavaScript moderno con ES2015/16** (Modern JavaScript with ES2015/16): Lea la guía de Babel [Aprende ES2015](https://babeljs.io/docs/learn-es2015/). No es necesario memorizar cada característica, pero mantenga esta página como una referencia a la cual regresar.

Luego de tomarse un día para profundizar en estos recursos, le recomendamos consultar [Vue CLI 3](https://cli.vuejs.org/). Siga las instrucciones y debería tener un proyecto Vue con componentes `.vue`, ES2015, y hot-reload en unos pocos minutos!

### Para Usuarios Avanzados

La Interfaz de Línea de Comandos (CLI) se encarga de la mayoría de las configuraciones de herramientas para usted, pero también permite una personalización detallada a través de sus propias opciones de configuración.

En caso de que prefiera definir su configuración de compilación desde cero, deberá configurar manualmente Webpack con [vue-loader](https://vue-loader.vuejs.org/). Para obtener más información sobre Webpack, consulte su [Documentación Oficial](https://webpack.js.org/configuration/) y la [Academia Webpack](https://webpack.academy/p/the-core-concepts).

Ya sea que prefiera Webpack o Browserify, hemos documentado plantillas para ambos, tanto para proyectos simples como otros más complejos. Le recomendamos visitar [github.com/vuejs-templates](https://github.com/vuejs-templates), eligiendo la plantilla correcta para usted, y seguir las instrucciones en el archivo README para generar un nuevo proyecto con [vue-cli](https://github.com/vuejs/vue-cli).
