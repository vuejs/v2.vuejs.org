---
title: Depurando en VS Code
type: cookbook
order: 8
---

Toda aplicación alcanza un punto donde es necesario entender los errores, desde
los más chicos a los más grandes. En esta receta, se exploran algunos flujos de
trabajo para usuarios de VS Code a quienes les gustaría depurar su aplicación en
el navegador.

Esta receta muestra como depurar aplicaciones [Vue CLI](https://github.com/vuejs/vue-cli) en VS Code mientras ejecutan en el navegador.

<p class="tip">
  Nota: Esta receta cubre Chrome y Firefox. Si ud sabe como configurar la
  depuración en VS Code con otros navegadores, por favor considere compartir sus percepciones (vea al final de la página).
</p>

## Prerequisitos

Asegúrese de tener VS Code y el navegador de su preferencia instalado,
así como también la última versión de la extensión de depuración que corresponda instalada y habilitada:

* [Depurador para Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
* [Depurador para Firefox](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-firefox-debug)

Instale y cree un proyecto con [vue-cli](https://github.com/vuejs/vue-cli), siguiendo las instrucciones en [Guía Vue CLI](https://cli.vuejs.org/).
Muévase dentro del directorio de la aplicación recientemente creada y abra VS Code.

### Mostrando código fuente en el Navegador

Antes de que pueda depurar sus componentes Vue desde VS Code, necesitará
actualizar la configuración de Webpack generada para poder construir los
sourcemaps. Haremos esto para que nuestro depurador tenga una forma de
correlacionar el código del archivo comprimido con la posición en el archivo
original. Esto asegura que pueda depurar una aplicación incluso luego de
que sus assets hayan sido optimizados por Webpack.

Si usa Vue CLI 2, configure o actualice la propiedad `devtool` dentro de
`index.js`:

```json
devtool: 'source-map',
```

Si usa Vue CLI 3, configure o actualice la propiedad `devtool` dentro de
`vue.config.js`:

```js
module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  }
}
```

### Lanzando la aplicación desde VS Code

Haga clic en el icono Depurar en la Barra de Actividad para cargar la vista de
Depuración. Luego haga clic en el icono Engranaje para configurar el archivo
`launch.json`, seleccione **Chrome/Firefox: Launch** como el entorno. Reemplace
el contenido del archivo `launch.json` generado con la configuración correspondiente:

![Agregar Configuración Chrome](/images/config_add.png)

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

1. Ponga un breakpoint en **src/components/HolaMundo.vue** en la `linea 90` donde
la función `data` devuelve una cadena de texto.

  ![Renderizador de Breakpoint](/images/breakpoint_set.png)

2. Abra su terminal favorita en la carpeta raíz y corra su aplicación usando Vue CLI:

  ```
  npm start
  ```

3. Vaya a la vista de Depuración, seleccione la configuración **'vuejs: chrome/firefox'**,
luego presione F5 o haga clic en el botón verde de reproducir.

4. Su breakpoint debería ser alcanzado una vez que la nueva instancia de su navegador
se abra: `http://localhost:8080`.

  ![Breakpoint Alcanzado](/images/breakpoint_hit.png)

## Patrones Alternativos

### Vue Devtools

Hay otros modelos de depuración, variando en complejidad. El más simple y popular
es usar el excelente Vue.js devtools [para Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) y [para Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/).
Algunos de los beneficios de trabajar con las devtools es que le permite editar
las propiedades y ver los cambios reflejados en tiempo real. El otro gran
beneficio es la habilidad de depurar viajando en el tiempo para Vuex.

![Devtools Depurador viajando en el tiempo](/images/devtools-timetravel.gif)

<p class="tip">
  Por favor tenga presente que si la página usa una compilación minificada de
  producción de Vue.js (como ser el link estándar del CDN), la inspección de
  devtools estará deshabilitada por defecto lo cual no mostrará el panel de Vue.
  Si se cambia a una versión no minificada, quizás sea necesario que recargue la
  página forzadamente para poder verlo.
</p>

### Simple Sentencia Debugger

El ejemplo anterior tiene un gran flujo de trabajo. Sin embargo, hay una
opción alternativa donde puede usar la [sentencia nativa debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger)
directamente en su código. Si elige trabajar de esta forma, es importante que
recuerde remover las sentencias una vez haya terminado.

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
