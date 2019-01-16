---
title: Instalación
type: guide
order: 1
vue_version: 2.5.16
gz_size: "30.90"
---

### Nota de compatibilidad

Vue **no** es compatible con IE8 y versiones anteriores, ya que utiliza las características de ECMAScript 5 que son incompatibles en IE8. Sin embargo, admite todos los [navegadores compatibles con ECMAScript 5](https://caniuse.com/#feat=es5).

### Notas de lanzamiento

Última versión estable: {{vue_version}}

Las notas de lanzamiento detalladas para cada versión están disponibles en [GitHub](https://github.com/vuejs/vue/releases).

## Vue Devtools

Cuando use Vue, le recomendamos que también instale [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools) en su navegador, lo que le permite inspeccionar y depurar sus aplicaciones de Vue de una manera más amigable.

## Inclusión Directa con `<script>`

Simplemente descargue e incluya la etiqueta _script_ con la ruta correcta. `Vue` será registrado como una variable global.

<p class="tip">No utilice la versión minificada (de producción) durante el desarrollo. Usted perderá todas las advertencias interesantes para los errores más comunes!</p>

<div id="downloads">
<a class="button" href="/js/vue.js" download>Versión de Desarrollo</a><span class="light info">Mensajes de error completos y modo de depuración</span>

<a class="button" href="/js/vue.min.js" download>Versión de Producción</a><span class="light info">Sin mensajes de error, {{gz_size}}KB min+gzip</span>
</div>

### CDN

Es recomendable vincular a un número específico de versión que pueda actualizar manualmente:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.js"></script>
```

Puede examinar el código fuente del paquete NPM en [cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue/).

Vue también está disponible en [unpkg](https://unpkg.com/vue@{{vue_version}}/dist/vue.js) y [cdnjs](https://cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js) (cdnjs tarda un poco en sincronizarse, por lo que es posible que la última versión aún no esté disponible).

Asegúrese de leer acerca de [las diferentes compilaciones de Vue](#Explicación de diferentes compilaciones) y use la **versión de producción** en su sitio publicado, reemplazando `vue.js` con `vue.min.js`. Esta es una versión más pequeña optimizada para la velocidad en lugar de la experiencia de desarrollo.

## NPM

NPM es el método de instalación recomendado para construir aplicaciones a gran escala con Vue. Este combina perfectamente con empaquetadores de módulos, tales como [Webpack](https://webpack.js.org/) o [Browserify](http://browserify.org/). Vue también ofrece herramientas para la creación de componentes de un solo archivo (en inglés [Single-File Components](single-file-components.html)).

``` bash
# latest stable
$ npm install vue
```

## CLI

Vue proporciona un [CLI oficial](https://github.com/vuejs/vue-cli) para rapidamente construir ambiciosas _Single Page Applications_. Proporciona configuraciones de _build_ prontas para un proceso de trabajo de _front-end_ moderno. Sólo tarda unos minutos para estar listo y ejecutándose con _hot-reload_, _lint_ al guardar cambios y empaquetado listo para la distribución en producción. Consulte [los documentos de Vue CLI](https://cli.vuejs.org) para obtener más detalles.

<p class="tip">Este tema presupone conocimiento previo en Node.js y herramientas de _build_ asociadas. Si usted es nuevo en Vue o en este tipo de herramienta, le recomendamos encarecidamente que pase por toda <a href="./">la guía</a> antes de intentar utilizar el CLI.</p>

## Explicación de las Diferentes Compilaciones

En el [directorio `dist/` del paquete NPM](https://cdn.jsdelivr.net/npm/vue/dist/) usted encontrará muchas compilaciones o distribuciones diferentes de Vue.js. Una descripción de la diferencia entre ellas:

| | UMD | CommonJS | ES Module |
| --- | --- | --- | --- |
| **Completa** | vue.js | vue.common.js | vue.esm.js |
| **Runtime** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js |
| **Completa (producción)** | vue.min.js | - | - |
| **Runtime (producción)** | vue.runtime.min.js | - | - |

### Términos

- **Completa**: compilaciones que contienen tanto el compilador como el motor de tiempo de ejecución (en inglés, _runtime_).

- **Compilador**: código que es responsable de compilar _template strings_ en las funciones de _render_ de JavaScript.

- **Runtime**: código que es responsable de crear instancias de Vue, renderizado y actualización del DOM virtual, etc. Básicamente todo menos el compilador.

- **[UMD](https://github.com/umdjs/umd)**: las compilaciones UMD se pueden utilizar directamente en el navegador a través de un tag `<script>`. El archivo predeterminado de jsDelivr CDN en [https://cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue) es la distribución Compilador + Runtime en formato UMD (`vue.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: formato destinado a empaquetadores antiguos como [browserify](http://browserify.org/) or [webpack 1](https://webpack.github.io). El archivo predeterminado para estos empaquetadores (`pkg.main`) es la distribución Runtime en formato CommonJS (`vue.runtime.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: formato de módulos ECMAScript destinado a empaquetadores modernos como [webpack 2](https://webpack.js.org) o [rollup](https://rollupjs.org/). El archivo predeterminado para estos empaquetadores (`pkg.module`) es la distribución Runtime en formato ES Module (`vue.runtime.esm.js`).

### Runtime + Compilador vs. Runtime

Si necesita compilar _templates_ en tiempo real en el cliente (por ejemplo: pasando un _String_ en la opción `template`, o usando elementos preexistentes en el DOM a través del HTML como _template_), necesitará el compilador y por lo tanto la distribución completa:

``` js
// esto requiere el compilador
new Vue({
  template: '<div>{{ hi }}</div>'
})

// esto no
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

Cuando se usa `vue-loader` o `vueify`, los _templates_ dentro de los archivos `*.vue` se compilan previamente en JavaScript en el momento de la compilación. Realmente no necesita el compilador en el paquete final y, por lo tanto, puede usar la distribución Runtime.

Dado que las distribuciones solo con el código de Runtime son aproximadamente un 30% más ligeras que las distribuciones completas, debe usarlas siempre que pueda. Si aún desea utilizar la distribución completa, debe configurar un alias en su empaquetador:

#### Webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' para webpack 1
    }
  }
}
```

#### Rollup

``` js
const alias = require('rollup-plugin-alias')

rollup({
  // ...
  plugins: [
    alias({
      'vue': 'vue/dist/vue.esm.js'
    })
  ]
})
```

#### Browserify

Agregue a su proyecto `package.json`:

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

#### Parcel

Agregue a su proyecto  `package.json`:

``` js
{
  // ...
  "alias": {
    "vue" : "./node_modules/vue/dist/vue.common.js"
  }
}
```

### Desarrollo vs. Producción

Los modos de desarrollo/producción están codificados para las compilaciones de UMD: los archivos no minimizados son para desarrollo y los archivos minificados para producción.

Las distribuciones de módulos de CommonJS y ES están destinadas a empaquetadores, por lo tanto, no proporcionamos versiones mínimas para ellos. Usted será responsable de minimizar el paquete final usted mismo.

Estas distribuciones también preservan chequeos a la variable `process.env.NODE_ENV` para determinar el modo en que deben ejecutarse. Debe configurar apropiadamente su empaquetador para cambiar estas variables de entorno correctamente para controlar el modo en que Vue se ejecutará. Cambiar `process.env.NODE_ENV` usando _Strings_ literales también permite que minificadores como UglifyJS eliminen completamente los bloques de código de desarrollo, reduciendo el tamaño del archivo final.

#### Webpack

En Webpack 4+, puede usar la opción `mode`:

``` js
module.exports = {
  mode: 'production'
}
```

Pero en Webpack 3 y anteriores, es necesario usar [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}
```

#### Rollup

Utilice el [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

``` js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}).then(...)
```

#### Browserify

Aplique una transformación [envify](https://github.com/hughsk/envify) global en su paquete.

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

Vea también [Consejos de Publicación para Producción](deployment.html).

### Ambientes CSP

Algunos entornos, como Google Chrome Apps, aplican la Política de seguridad de contenido (CSP), que prohíbe el uso de `new Function()` para evaluar expresiones. La distribución completa depende de esta característica para compilar _templates_, por lo que no se puede utilizar en estos entornos.

Por otro lado, la distribución Runtime es totalmente compatible con CSP. Cuando se utiliza la distribución Runtime con [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) o [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), sus _templates_ serán precompilados en funciones `render` que funcionan perfectamente en entornos CSP.

## Compilación de Desarrollo

**Importante**: los archivos compilados en la carpeta `/dist` de GitHub solo se crean durante los lanzamientos de nuevas versiones. Para usar Vue desde el último código fuente de GitHub, ¡tendrás que crearlo tú mismo!

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

Solo las compilaciones UMD están disponibles en Bower.

``` bash
# última versión estable
$ bower install vue
```

## Cargadores de Módulos AMD

Todas las compilaciones UMD se pueden utilizar directamente como un módulo AMD.
