---
title: Depurando en VS Code
type: cookbook
order: 8
---

Toda aplicación alcanza un punto donde es necesario entender los errores, desde
los más chicos a los más grandes. En esta receta, exploraremos algunos flujos de
trabajo para usuarios de VS Code a quienes les gustaría depurar su aplicación
en el navegador.

Esta receta muestra como depurar aplicaciones [Vue CLI](https://github.com/vuejs/vue-cli)
en VS Code mientras ejecutan en el browser.

<p class="tip">
  Nota: Esta receta cubre Chrome and Firefox. Si tu sabes como
  configurar la depuración en VS Code con otros navegadores, por favor
  considera compartir tus percepciones (ver al final de la página).
</p>

## Prerequisitos

Asegúrate de tener VS Code y el navegador de tu preferencia instalado,
así como también la última versión de la extensión de depuración que corresponda instalada y habilitada:

* [Depurador para Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
* [Depurador para Firefox](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-firefox-debug)

Instala y crea un proyecto con [vue-cli](https://github.com/vuejs/vue-cli), siguiendo las instrucciones en [Guía Vue CLI](https://cli.vuejs.org/).
Muévete dentro del directorio de la aplicación recientemente creada y abre VS Code.

### Mostrando código fuente en el Navegador

Antes de que puedas depurar tus componentes Vue desde VS Code, necesitarás
actualizar la configuración de Webpack generada para poder construir los
sourcemaps. Hacemos esto para que nuestro depurador tenga una forma de
correlacionar el código del archivo comprimido con la posición en el archivo
original. Esto asegura que puedas depurar una aplicación incluso luego de
que tus assets hayan sido optimizados por Webpack.

Si usas Vue CLI 2, configura o actualiza la propiedad `devtool` dentro de
`index.js`:

```json
devtool: 'source-map',
```

Si usas Vue CLI 3, configura o actualiza la propiedad `devtool` dentro de
`vue.config.js`:

```js
module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  }
}
```

### Lanzando la aplicación desde VS Code

Haz clic en el icono Debugging en la Barra de Actividad para to cargar la vista
de Depuración. Luego haz clic en el icono engranaje para configurar el archivo
`launch.json`, seleccionando **Chrome/Firefox: Launch** como el entorno. Reemplaza
el contenido del archivo `launch.json` generado con la configuración correspondiente:

![Agrega Configuración Chrome](/images/config_add.png)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "vuejs: chrome",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    },
    {
      "type": "firefox",
      "request": "launch",
      "name": "vuejs: firefox",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "pathMappings": [{ "url": "webpack:///src/", "path": "${webRoot}/" }]
    }
  ]
}
```

## Poniendo un Breakpoint

1. Pone un breakpoint en **src/components/HolaMundo.vue** en la `linea 90` donde
la función `data` devuelve una cadena de texto.

  ![Renderizador de Breakpoint](/images/breakpoint_set.png)

2. Abre tu terminal favorita en la carpeta raíz
y corre tu aplicación usando Vue CLI:

  ```
  npm start
  ```

3. Vé a la vista Debug, selecciona la configuración **'vuejs: chrome/firefox'**,
luego presiona F5 o haz click en el botón verde de reproducir.

4. Tu breakpoint debería ser alcanzado una vez que la nueva instancia de tu navegador
se abra: `http://localhost:8080`.

  ![Breakpoint Alcanzado](/images/breakpoint_hit.png)

## Patrones Alternativos

### Vue Devtools

Hay otros modelos de depuración, variando en complejidad. El más simple y popular
es usar el excelente Vue.js devtools [para Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) y [para Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/).
Algunos de los beneficios de trabajar con las devtools es que te permite editar
las propiedades y ver los cambios reflejados en tiempo real. El otro gran
beneficio es la habilidad de depurar viajando en el tiempo para Vuex.

![Devtools Depurador viajando en el tiempo](/images/devtools-timetravel.gif)

<p class="tip">
  Por favor ten presente que si la página usa una compilación minificada de producción
  de Vue.js (como ser el link estándar del CDN), la inspección de devtools estará
  deshabilitada por defecto lo cual no mostrará el panel de Vue. Si te cambias a
  una versión no minificada, quizás sea necesario que recargues la página forzadamente
  para poder verlo.
</p>

### Vuetron

[Vuetron](http://vuetron.io/) is a really nice project that extends some of the work that vue-devtools has done. In addition to the normal devtools workflow, you are able to:

* Quickly view API Request/Response: if you're using the fetch API for requests, this event is displayed for any request sent. The expanded card displays the request data as well as the response data.
* Subscribe to specific parts of your application’s state for faster debugging
* Visualize component hierarchy, and an animation allows you to collapse or expand the tree for specific hierarchy views.

![Vuetron Hierarchy](/images/vuetron-hierarchy.gif)

### Simple Sentencia Debugger

El ejemplo anterior tiene un gran flujo de trabajo. Sin embargo, hay una
opción alternativa donde puedes usar la [sentencia nativa debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger)
directamente en tu código. Si eliges trabajar de esta forma, es importante que
recuerdes remover las sentencias una vez hayas terminado.

```js
<script>
export default {
  data() {
    return {
      message: ''
    }
  },
  mounted() {
    const hello = 'Hola Mundo!'
    debugger
    this.message = hello
  }
};
</script>
```

## Expresiones de gratitud

Esta receta se basa en una contribución de [Kenneth Auchenberg](https://twitter.com/auchenberg), [disponible aquí](https://github.com/Microsoft/VSCode-recipes/tree/master/vuejs-cli).
