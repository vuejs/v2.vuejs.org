---
title: Paquete de Componentes de Vue para npm
type: cookbook
order: 12
---

## Ejemplo base

Los componentes de Vue están destinados a ser reusados. Es sencillo cuando el componente solo es usado dentro de una aplicación sencilla. ¿Pero, cómo se puede escribir un componente una vez y usarlo en múltiples sitios/aplicaciones? Quizá la solución más fácil es via npm.

Al empaquetar su componente para ser compartido vía npm, este se puede importar/requerir en un proceso de compilación para su uso en aplicaciones web completamente desarrolladas.

```js
import MyComponent from 'my-component';

export default {
  components: {
    MyComponent,
  },
  // resto del componente
}
```

O incluso usados via etiqueta `<script>` directamente en el navegador:

```html
  <script src="https://unpkg.com/vue"></script>
  <script src="https://unpkg.com/my-component"></script>
  ...
  <my-component></my-component>
  ...
```

No solo hacer esto ayuda a evitar a copiar/pegar componentes, sino que también nos permite devolver a la comunidad de Vue! 

## ¿No puedo simplemente compartir archivos `.vue` directamente?

Vue ya permite que los componentes sean escritos como un único archivo. Porque un Componente de Archivo Único <i>(SFC siglas en inglés para Single File Component)</i> es ahora mismo solo un archivo y usted puede preguntar:

> "¿Porque no se puede usar los archivos `.vue` directamente? ¿No es la forma más simple de compartir componentes?"

Es verdad, usted puede compartir archivos `.vue` directamente y cualquiera usando un [Compilado de Vue](https://vuejs.org/v2/guide/installation.html#Explanation-of-Different-Builds) conteniendo el compilador de Vue puede consumirlo inmediatamente. También, el compilado SSR <i>(Server-side Rendering)</i> usa la concatenación de string como una optimización, así el archivo `.vue` pudiera ser preferido en este escenario (ver [Empaquetando Componentes para npm > Uso SSR](#Uso-SSR) para los detalles). Sin embargo, este excluye a cualquiera que desee usar el componente directamente en el navegador vía etiqueta `<script>`, cualquiera que use un compilado solo en tiempo de ejecución, o procesos de compilación los cuales no entiendan que hacer con los archivos `.vue` 

El empaquetado adecuado de su SFC para su distribución a través de npm permite que su componente se comparta de una manera que está lista para usar en cualquier lugar.

## Empaquetando Componentes para npm

Para los propósitos de esta sección, asuma la siguiente estructura de archivo:

```
package.json
build/
   rollup.config.js
src/
   wrapper.js
   my-component.vue
dist/
```

<p class="tip">A través de este documento, las referencias están echas al package.json listado arriba. El archivo usado en estos ejemplos fue generado a mano, e incluirá la configuración mínima requerida par la discusión/tarea del momento. Es posible que su propio package.json contenga mucho más de lo que se expone acá</p>

### ¿Cómo sabe npm cuál versión servir al navegador/proceso de compilación?

El archivo package.json usado por npm realmente solo requiere una versión (`main`), sin embargo, no estamos limitados a eso. Podemos direccionar el caso de uso más común especificando dos versiones adicionales (`module` y `unpkg`), y proveer acceso al archivo `.vue` en sí mismo usando el campo `browser`. Un ejemplo de package.json pudiera lucir así:

```json
{
  "name": "my-component",
  "version": "1.2.3",
  "main": "dist/my-component.umd.js",
  "module": "dist/my-component.esm.js",
  "unpkg": "dist/my-component.min.js",
  "browser": {
    "./sfc": "src/my-component.vue"
  },
  ...
}
```

Cuando webpack 2+, Rollup, u otras herramientas modernas de compilación son usadas, levantan sobre el compilado de `module`. Aplicaciones <i>Legacy</i> pudieran usar el compilado de `main`, y el compilado de `unpkg` puede ser usado directamente en el navegador. De echo el [unpkg](https://unpkg.com) cdn automáticamente usa esto cuando alguien ingresa la URL para tu módulo dentro su servicio.

### Uso SSR

Es posible que hayas notado algo interesante - los navegadores no van a usar la versión `browser`. Esto es porque este campo está realmente destinado a permitir a los autores proveer una [sugerencia a un bundler](https://github.com/defunctzombie/package-browser-field-spec#spec) en la cuál se generan sus propios paquetes para uso del lado del cliente. Con un poco de creatividad, este campo nos permite mapear un alias para el archivo `.vue` en sí. Por ejemplo:


```js
import MyComponent from 'my-component/sfc'; // Note the '/sfc'
```

Los bundlers compatibles ven la definición de `browser` en el package.json y traducen la petición para `my-component/` dentro de `my-component/src/my-component.vue`, resultando en el archivo original `.vue` siendo usado en su lugar.

<p class="tip">Nota: Cuando use los componentes `.vue` directamente, preste atención a cualquier tipo de procesamiento requerido por las etiquetas `script` y `style`. Esas dependencias serán pasadas a los usuarios. Considere proporcionar SFCs 'planos' para mantener las cosas lo más clara posibles.</p>

### How do I make multiple versions of my component?

There is no need to write your module multiple times. It is possible to prepare all 3 versions of your module in one step, in a matter of seconds. The example here uses [Rollup](https://rollupjs.org) due to its minimal configuration, but similar configuration is possible with other build tools - more details on this decision can be found [here](https://medium.com/webpack/webpack-and-rollup-the-same-but-different-a41ad427058c). The package.json `scripts` section can be updated with a single entry for each build target, and a more generic `build` script that runs them all in one pass. The sample package.json file now looks like this:

```json
{
  "name": "my-component",
  "version": "1.2.3",
  "main": "dist/my-component.umd.js",
  "module": "dist/my-component.esm.js",
  "unpkg": "dist/my-component.min.js",
  "browser": {
    "./sfc": "src/my-component.vue"
  },
  "scripts": {
    "build": "npm run build:umd & npm run build:es & npm run build:unpkg",
    "build:umd": "rollup --config build/rollup.config.js --format umd --file dist/my-component.umd.js",
    "build:es": "rollup --config build/rollup.config.js --format es --file dist/my-component.esm.js",
    "build:unpkg": "rollup --config build/rollup.config.js --format iife --file dist/my-component.min.js"
  },
  "devDependencies": {
    "rollup": "^0.57.1",
    "rollup-plugin-buble": "^0.19.2",
    "rollup-plugin-vue": "^3.0.0",
    "vue": "^2.5.16",
    "vue-template-compiler": "^2.5.16",
    ...
  },
  ...
}
```

<p class="tip">Remember, if you have an existing package.json file, it will likely contain a lot more than this one does. This merely illustrates a starting point. Also, the <i>packages</i> listed in devDependencies (not their versions) are the minimum requirements for rollup to create the three separate builds (umd, es, and unpkg) mentioned. As newer versions become available, they should be updated as necessary.</p>

Our changes to package.json are complete. Next, we need a small wrapper to export/auto-install the actual SFC, plus a minimal Rollup configuration, and we're set!

### What does my packaged component look like?

Depending on how your component is being used, it needs to be exposed as either a [CommonJS/UMD](https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc#c33a) javascript module, an [ES6 javascript](https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc#4f5e) module, or in the case of a `<script>` tag, it will be automatically loaded into Vue via `Vue.use(...)` so it's immediately available to the page. This is accomplished by a simple wrapper.js file which handles the module export and auto-install. That wrapper, in its entirety, looks like this:

```js
// Import vue component
import component from './my-component.vue';

// Declare install function executed by Vue.use()
export function install(Vue) {
	if (install.installed) return;
	install.installed = true;
	Vue.component('MyComponent', component);
}

// Create module definition for Vue.use()
const plugin = {
	install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

// To allow use as module (npm/webpack/etc.) export component
export default component;
```

Notice the first line directly imports your SFC, and the last line exports it unchanged. As indicated by the comments in the rest of the code, the wrapper provides an `install` function for Vue, then attempts to detect Vue and automatically install the component. With 90% of the work done, it's time to sprint to the finish!

### How do I configure the Rollup build?

With the package.json `scripts` section ready and the SFC wrapper in place, all that is left is to ensure Rollup is properly configured. Fortunately, this can be done with a small 16 line rollup.config.js file:

```js
import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import buble from 'rollup-plugin-buble'; // Transpile/polyfill with reasonable browser support
export default {
    input: 'src/wrapper.js', // Path relative to package.json
    output: {
        name: 'MyComponent',
        exports: 'named',
    },
    plugins: [
        vue({
            css: true, // Dynamically inject css as a <style> tag
            compileTemplate: true, // Explicitly convert template to render function
        }),
        buble(), // Transpile to ES5
    ],
};
```

This sample config file contains the minimum settings to package your SFC for npm. There is room for customization, such as extracting CSS to a separate file, using a CSS preprocessor, uglifying the JS output, etc.

Also, it is worth noting the `name` given the component here. This is a PascalCase name that the component will be given, and should correspond with the kebab-case name used elsewhere throughout this recipe.

### Will this replace my current development process?

The configuration here is not meant to replace the development process that you currently use. If you currently have a webpack setup with hot module reloading (HMR), keep using it! If you're starting from scratch, feel free to install [Vue CLI 3](https://github.com/vuejs/vue-cli/), which will give you the whole HMR experience config free:

```bash
vue serve --open src/my-component.vue
```

In other words, do all of your development in whatever way you are comfortable. The things outlined in this recipe are more like 'finishing touches' than a full dev process.

## When to Avoid this Pattern

Packaging SFCs in this manner might not be a good idea in certain scenarios. This recipe doesn't go into detail on how the components themselves are written. Some components might provide side effects like directives, or extend other libraries with additional functionality. In those cases, you will need to evaluate whether or not the changes required to this recipe are too extensive.

In addition, pay attention to any dependencies that your SFC might have. For example, if you require a third party library for sorting or communication with an API, Rollup might roll those packages into the final code if not properly configured. To continue using this recipe, you would need to configure Rollup to exclude those files from the output, then update your documentation to inform your users about these dependencies.

## Alternative Patterns

At the time this recipe was written, Vue CLI 3 was itself in beta. This version of the CLI comes with a built-in `library` build mode, which creates CommonJS and UMD versions of a component. This might be adequate for your use cases, though you will still need to make sure your package.json file points to `main` and `unpkg` properly. Also, there will be no ES6 `module` output unless that capability is added to the CLI before its release or via plugin.

## Acknowledgements

This recipe is the result of a lightning talk given by [Mike Dodge](https://twitter.com/mgdodgeycode) at VueConf.us in March 2018. He has published a utility to npm which will quickly scaffold a sample SFC using this recipe. You can download the utility, [vue-sfc-rollup](https://www.npmjs.com/package/vue-sfc-rollup), from npm. You can also [clone the repo](https://github.com/team-innovation/vue-sfc-rollup) and customize it.
