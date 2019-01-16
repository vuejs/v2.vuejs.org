---
title: Publicación en Producción
type: guide
order: 401
---

## Activar el modo de Producción

Durante el desarrollo, Vue proporciona una gran cantidad de advertencias para ayudarle con errores y problemas comunes. Sin embargo, estas advertencia se vuelven inútiles en producción y aumentan el tamaño de la carga de su aplicación. Además, algunas de estas verificaciones tienen costos de tiempo de ejecución pequeños que pueden evitarse en el modo de producción.

### Sin Herramientas de Compilación

Si está utilizando la compilación completa, es decir, que incluye directamente Vue a través de una etiqueta de _script_ sin una herramienta de compilación, asegúrese de usar la versión minificada (`vue.min.js`) para producción. Ambas versiones se pueden encontrar en la [Guía de instalación](installation.html#Direct-lt-script-gt-Include).

### Con Herramientas de Compilación

Al usar una herramienta de compilación como Webpack o Browserify, el modo de producción estará determinado por `process.env.NODE_ENV` dentro del código fuente de Vue, y estará en modo de desarrollo de forma predeterminada. Ambas herramientas de compilación proporcionan formas de sobrescribir esta variable para habilitar el modo de producción de Vue, y las advertencias serán eliminadas por los minificadores durante la compilación. Todos los _templates_ de proyecto de `vue-cli` tienen esto preconfigurado para usted, pero sería beneficioso saber cómo se hace:

#### Webpack

En Webpack 4+, puede usar la opación `mode`:

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
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}
```
#### Browserify

- Ejecutar su comando de bundling con la variable `NODE_ENV` definida para `"production"`. Esto avisará a `vueify` para evitar incluir _hot-reload_ y código de desarrollo.

- Aplique una transformación [envify](https://github.com/hughsk/envify) global en su paquete. Esto permite al minificador quitar todas las advertencias incorporadas al código fuente de Vue. Por ejemplo:

  ``` bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
  ```

- O, usando [envify](https://github.com/hughsk/envify) con Gulp:

  ``` js
  // Utilice el módulo personalizado envify para especificar variables de entorno
  var envify = require('envify/custom')

  browserify(browserifyOptions)
    .transform(vueify)
    .transform(
      // Requerido para procesar archivos node_modules
      { global: true },
      envify({ NODE_ENV: 'production' })
    )
    .bundle()
  ```

- O, usando [envify](https://github.com/hughsk/envify) con Grunt y [grunt-browserify](https://github.com/jmreidy/grunt-browserify):

  ``` js
  // Utilice el módulo personalizado envify para especificar variables de entorno
  var envify = require('envify/custom')

  browserify: {
    dist: {
      options: {
        // Función para desviarse del orden predeterminado de grunt-browserify
        configure: b => b
          .transform('vueify')
          .transform(
            // Requerido para procesar archivos node_modules
            { global: true },
            envify({ NODE_ENV: 'production' })
          )
          .bundle()
      }
    }
  }
  ```

#### Rollup

Utilizar [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

``` js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
}).then(...)
```

## Templates de Precompilación

Cuando está utilizando _templates_ in-DOM o _template strings_ in-JavaScript, la transformación de las funciones de render se produce en tiempo real. Esto es generalmente bastante rápido en la mayoría de los casos, pero es mejor evitarlo si su aplicación es muy sensible a las variaciones de rendimiento.

La forma más fácil de compilar previamente los _templates_ es usando [Componentes Single-File](single-file-components.html): los procesos de compilación asociados realizan la pre-compilación automáticamente, de esta forma el código final ya contiene las funciones de render en lugar de _template strings_ puras.

Si está utilizando Webpack y prefiere separar JavaScript de los archivos de templates, puede utilizar [vue-template-loader] (https://github.com/ktsn/vue-template-loader), que también transforma los archivos de _template_ independientes en funciones render de JavaScript durante el proceso de compilación.

## Extrayendo CSS de Componentes

Cuando se utilizan componentes Single-File, los componentes internos de CSS se inyectan dinámicamente como etiquetas `<style>` a través de JavaScript. Esto tiene un costo de tiempo de ejecución pequeño, y si está utilizando la renderización del lado del servidor causará un "flash de contenido sin estilo". Extraer el CSS de todos los componentes e incluirlos en un mismo archivo puede evitar estos problemas, además de resultar en una mejor minificación de CSS y mejor caché.

Acceda a la documentación de la respectiva herramienta de compilación para ver cómo se realiza:

- [Webpack + vue-loader](https://vue-loader.vuejs.org/en/configurations/extract-css.html) (el _template_ webpack del `vue-cli` ya tiene esto preconfigurado)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://vuejs.github.io/rollup-plugin-vue/#/en/2.3/?id=custom-handler)

## Seguimiento de Errores en Tiempo de Ejecución

Si se produce un error en tiempo de ejecución durante el procesamiento de un componente, se pasará a la función de configuración global `Vue.config.errorHandler` si así fue configurado. Podría ser una buena idea aprovechar este _hook_ junto con un servicio de seguimiento de errores como [Sentry](https://sentry.io), que proporciona [una integración oficial](https://sentry.io/for/vue/) para Vue.