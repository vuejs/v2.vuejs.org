---
title: Usando Axios para consumir APIs
type: cookbook
order: 9
---

## Ejemplo Base

En muchas ocasiones, al construir una aplicación web, se quiere consumir y mostrar datos de un API. Existen diversas formas de hacerlo, pero un enfoque muy popular es utilizar [axios](https://github.com/axios/axios), un client HTTP basado en promesas.

En este ejercicio, se utilizara la [API CoinDesk](https://www.coindesk.com/api/) para mostrar los precios de Bitcoin, que se actualizan minuto a minuto. Primero, instalaremos axios mediante npm/yarn o a través de un enlace CDN.

Hay distintas formas de solicitar información del API, pero es conveniente conocer primero la forma de los datos en pos de entender que mostrar. Para ello, realizaremos una llamada al endpoint en la API y mostraremos la respuesta, con tal de analizarla. Podemos comprobar en la documentación del API de CoinDesk, que esta llamada se realizara a `https://api.coindesk.com/v1/bpi/currentprice.json`. Comenzamos creando una propiedad data que eventualmente almacenara la información deseada. A continuación, realizamos el pedido y asignamos la respuesta utilizando el lifecycle hook `mounted`:

```js
new Vue({
  el: '#app',
  data () {
    return {
      info: null
    }
  },
  mounted () {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => (this.info = response))
  }
})
```

```html
<div id="app">
  {{ info }}
</div>
```

Obtenemos lo siguiente:

<p data-height="350" data-theme-id="32763" data-slug-hash="80043dfdb7b90f138f5585ade1a5286f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Primeros pasos Axios y Vue" class="codepen">See the pen <a href="https://codepen.io/team/Vue/pen/80043dfdb7b90f138f5585ade1a5286f/">Primeros pasos Axios y Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Excelente! Tenemos algunos datos pero lucen bien desordenados, asi que mostremoslos apropiadamente. Además incluyamos manejo de errores en caso de que las cosas no funcionen o demoren en obtener la información más de lo esperado.

## Ejemplo del mundo real: Trabajando con los datos

### Mostrando datos de un API

Es bastante común que la información que necesitamos se encuentre dentro de la respuesta y tengamos que recorrer el objeto que recién almacenamos, con tal de acceder a ella apropiadamente. En nuestro caso, notemos que la información de precios se encuentra en `response.data.bpi`. Si utilizamos esto, en su lugar, obtenemos lo siguiente:


```js
axios
  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(response => (this.info = response.data.bpi))
```

<p data-height="200" data-theme-id="32763" data-slug-hash="6100b10f1b4ac2961208643560ba7d11" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Segundo paso con Axios y Vue" class="codepen">See the pen <a href="https://codepen.io/team/Vue/pen/6100b10f1b4ac2961208643560ba7d11/">Segundo paso con Axios y Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Esto es mucho mas sencillo de utilizar, por tanto ahora podemos actualizar nuestro HTML para mostrar solo la información que necesitamos de los datos recibidos. Crearemos, además, un [filtro](../api/#Vue-filter) para asegurar que el decimal se encuentre en el lugar apropiado.

```html
<div id="app">
  <h1>Listado de Precio de Bitcoin</h1>
  <div
    v-for="currency in info"
    class="currency"
  >
    {{ currency.description }}:
    <span class="lighten">
      <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
    </span>
  </div>
</div>
```

```js
filters: {
  currencydecimal (value) {
    return value.toFixed(2)
  }
},
```

<p data-height="300" data-theme-id="32763" data-slug-hash="9d59319c09eaccfaf35d9e9f11990f0f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Tercer paso con Axios y Vue" class="codepen">See the pen <a href="https://codepen.io/team/Vue/pen/9d59319c09eaccfaf35d9e9f11990f0f/">Tercer paso con Axios y Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### Manejando errores

Hay ocasiones en las que no obtendremos los datos que necesitamos del API. Existen múltiples razones por las cuales nuestra llamada axios puede fallar, incluyendo pero no limitadas a:

* El API esta fuera de servicio.
* La llamada se realizo incorrectamente.
* El API no devuelve la información en el formato que anticipamos.

Cuando realizamos esta llamada debemos, comprobar la ocurrencia de tales circunstancias y, proporcionar información en cada caso, de forma tal que sepamos como manejar el problema. En una llamada axios, ello se logra utilizando `catch`.

```js
axios
  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(response => (this.info = response.data.bpi))
  .catch(error => console.log(error))
```

Esto nos permitirá saber si algo fallo durante la llamada a la API, pero que ocurre si los datos están estropeados o la API esta fuera de servicio? Por ahora, el usuario simplemente no vera nada. Por ello quisieramos incluir un cargador y notificar al usuario si no somos capaces de obtener datos en lo absoluto.

```js
new Vue({
  el: '#app',
  data () {
    return {
      info: null,
      loading: true,
      errored: false
    }
  },
  filters: {
    currencydecimal (value) {
      return value.toFixed(2)
    }
  },
  mounted () {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => {
        this.info = response.data.bpi
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.loading = false)
  }
})
```

```html
<div id="app">
  <h1>Listado de Precio de Bitcoin</h1>

  <section v-if="errored">
    <p>Lo sentimos, no es posible obtener la información en este momento, por favor intente nuevamente mas tarde</p>
  </section>

  <section v-else>
    <div v-if="loading">Cargando...</div>

    <div
      v-else
      v-for="currency in info"
      class="currency"
    >
      {{ currency.description }}:
      <span class="lighten">
        <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
      </span>
    </div>

  </section>
</div>
```

Puedes accionar el botón rerun en esta nota para ver el estado de cargando brevemente, mientras se solicitan los datos al API:

<p data-height="300" data-theme-id="32763" data-slug-hash="6c01922c9af3883890fd7393e8147ec4" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Cuarto paso con Axiosy Vue" class="codepen">See the pen <a href="https://codepen.io/team/Vue/pen/6c01922c9af3883890fd7393e8147ec4/">Cuarto paso con Axios y Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Esto puede ser mejorado, utilizando componentes para las diferentes secciones y mas errores distintos, en dependencia del API utiliza y la complejidad de la aplicación.

## Patrones alternativos

### API Fetch

La [API Fetch](https://developers.google.com/web/updates/2015/03/introduction-to-fetch) es una potente API nativa para este tipo de llamadas. Puede que hayas escuchado que uno de los beneficios del API Fetch es que no necesitas cargar un recurso externo para utilizarla, lo cual es cierto! Excepto que... no es totalmente soportada aun, por tanto todavía necesitas utilizar un polyfill. Existen además otros gotchas cuando trabajas con esta API, por lo cual muchos prefieres usar axios por ahora. Esto bien que podría cambiar en el futuro.

Si estas interesado en utilizar la API Fetch, hay algunos [muy buenos artículos](https://scotch.io/@bedakb/lets-build-type-ahead-component-with-vuejs-2-and-fetch-api) que explican como hacerlo.

## Resumiendo

Existen muchas formas de trabajar con Vue y Axios mas allá de consumir y mostrar datos de un API. También puedes comunicar con Serverless Functions, post/edit/delete en un API donde tengas permisos de escritura, y muchas otras. Debido a la sencilla integración entre estas dos librerías, se ha vuelto una elección muy común para desarrolladores que necesitan incluir clientes HTTP en su flujo de trabajo.
