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

Para los propósitos de esta sección, asume la siguiente estructura de archivo:

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

## ¿Cómo sabe npm cuál versión servir al navegador/proceso de compilación?

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

## Uso SSR

Es posible que hayas notado algo interesante - los navegadores no van a usar la versión `browser`. Esto es porque este campo está realmente destinado a permitir a los autores proveer una [sugerencia a un bundler](https://github.com/defunctzombie/package-browser-field-spec#spec) en la cuál se generan sus propios paquetes para uso del lado del cliente. Con un poco de creatividad, este campo nos permite mapear un alias para el archivo `.vue` en sí. Por ejemplo:


```js
import MyComponent from 'my-component/sfc'; // Note the '/sfc'
```

Los bundlers compatibles ven la definición de `browser` en el package.json y traducen la petición para `my-component/` dentro de `my-component/src/my-component.vue`, resultando en el archivo original `.vue` siendo usado en su lugar.

<p class="tip">Nota: Cuando use los componentes `.vue` directamente, preste atención a cualquier tipo de procesamiento requerido por las etiquetas `script` y `style`. Esas dependencias serán pasadas a los usuarios. Considere proporcionar SFCs 'planos' para mantener las cosas lo más clara posibles.</p>

## ¿Cómo hacer mútiples versiones de mi componente?

No hay necesidad de escribir tus módulos varias veces. Es posible preparar tres versiones de tu módulo en en solo paso, en cuestión de segundos. Este ejemplo usa [Rollup](https://rollupjs.org) debido a su configuración mínima, pero esa comfiguración es posible con otras herramientas de compilación - para más detalles de esta desición [aquí](https://medium.com/webpack/webpack-and-rollup-the-same-but-different-a41ad427058c). La sección de `scripts` del package.json puede ser actualizada con una entrada única por cada objetivo de compilación, y un script `build` más genérico que los ejecute a todos en un solo paso. El package.json de ejemplo luce así:

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

<p class="tip">Recuerda, si ya tienes un archivo package.json, es probable que contenga mucha más información. Este apenas muestra un punto de partida. También, los <i>paquetes</i> listados en devDependencies (no sus versiones) son los requerimientos mínimos en rollup para crear las tres compilaciones mencionadas de manera aislada (umd, es, and unpkg)</p>

Nuestros cambios al package.json están completos. Ahora, necesitamos un pequeño wrapper para exportar/auto-instalar el SFC real, más una configuración mínima de Rollup y estamos listos.

## ¿Qué aspecto tiene mi componente empaquetado?

Dependiendo de como se use tu componente, este necesita ser expuesto como un [CommonJS/UMD](https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc#c33a) módulo de javascript, un módulo [ES6 javascript](https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc#4f5e), o en el caso de una etiqueta `<script>`, será cargada automáticamente en Vue a través de `Vue.use(...)` estando inmediatamente disponible para la página. Esto se logra con un simple archivo wrapper.js que maneja la exportación del módulo y la auto-instalación. Ese wrapper, en su totalidad luce así: 

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

Nota que la primera línea importa directamente tu SFC, y que la última línea de exports está sin alterar. Como ha sido indicado por los comentarios en el resto del código, el wrapper provee una función `install` para Vue, entonces intenta detectar Vue y automáticamente instala el componente. Con el 90% del trabajo hecho es hora de acelerar hasta el final!

## ¿Cómo configuro la compilación de Rollup?

Con la sección de `scripts` del package.json lista el wrapper de SFC en su lugar, lo que queda es asegurarnos que Rollup está bien configurado. Afortunadamente, esto se puede hacer con 16 pequeñas líneas en el archivo rollup.config.js:

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

Este archivo de ejemplo contiene la congiguración mínima para empaquetar tu SFC para npm. Hay un espacio para la personalización, como extraer CSS para un archivo aparte, usando un preprocesador de CSS, uglificando la salida JS, etc. 

Además, vale la pena señalar el `name` dado al componente aquí. Es un nombre en PascalCase que se dará al componente, y debería corresponder con el nombre kebab-case usado en otros lugares a lo largo de esta receta.

## ¿Esto remplazará mi proceso de desarrollo actual?

Esta configuración no está destinada a remplazar el proceso de desarrollo que uses actualmente. Si ahora mismo tienes un setup de webpack con un módulo de recarga en caliente (HMR) <em>Hot Module Reloading</em>, sigue usándolo! Si estás comenzando desde cero, siéntete libre de instalar [Vue CLI 3](https://github.com/vuejs/vue-cli/), la cuál te dará toda la experiencia para cofigurar libremente HRM.

```bash
vue serve --open src/my-component.vue
```

En otras palabras, haz todos tus desarrollos de la forma que te sientas cómodo. Lo aspectos delineados en esta receta son más como 'toques finales' y no el proceso de desarrollo completo.

## Cuando evitar este Patrón

Los empaquetados de SFC en esta forma pueden no ser una buena idea en ciertos escenarios. Esta receta no va al detalle sobre como los componentes deben ser escritos en sí. Algunos componentes pueden proporcionar efectos colaterales como directivas, o extender de otras librerías con funcionalidades adicionales. En esos casos necesitarás evaluar si los cambios necesarios para esta receta son muy extensos.

Además, presta atención a cualquier dependencia que tu SFC pueda tener. Por ejemplo, si necesitas una librería de terceros para ordenamiento o comunicación con una API, Rollup puede hacer funcionar esos paquetes dentro del código final sin estar bien configurados. Para continuar usando esta receta, necesitarías Rollup para excluir esos archivos desde la salida, entonces actualizar tu documantación para informar a tus usuarios acerca de esas dependencias. 

## Patrones Alternativos

Cuando esta receta fue escrita, Vue CLI 3 estaba en beta. Esta versión del CLI viene con una `library` construida en modo de compilación, la cuál crea un CommonJS y versiones UMD de un componente. Esto puede ser adecuado para tus casos de uso, aunque aún necesitarás asegurarte que tu archivo package.json apunta al `main` y al `unpkg` correctamente. Además, no habrá un ES6 `module` de salida al menos que esa capacidad se agregue al CLI antes de su lanzamiento o a través de npm.

## Agradecimientos

Esta receta es el resultado de una charla relámpago dada por [Mike Dodge](https://twitter.com/mgdodgeycode) en VueConf.us en Marzo del 2018. Él ha publicado una utilidad para npm que arma ágilmente un ejemplo de SFC usando esta receta. Se puede descargar dicha utilidad, [vue-sfc-rollup](https://www.npmjs.com/package/vue-sfc-rollup), desde npm. También se puede [clonar el repositorio](https://github.com/team-innovation/vue-sfc-rollup) y personalizarlo.
