---
title: Usando Axios para consumir APIs
type: cookbook
order: 9
---

## Ejemplo Base

En muchas ocasiones, al construir una aplicación web, se quiere consumir y mostrar datos de un API. Existen diversas formas de hacerlo, pero un enfoque muy popular es utilizar [axios](https://github.com/axios/axios), un client HTTP basado en promesas.

En este ejercicio, se utilizará la [API CoinDesk](https://www.coindesk.com/api/) para mostrar los precios de Bitcoin, que se actualizan minuto a minuto. Primero, se instalará axios mediante npm/yarn o a través de un enlace CDN.

Hay distintas formas de solicitar información del API, pero es conveniente conocer primero la forma de los datos en pos de entender que mostrar. Para ello, se realizará una llamada al endpoint en la API y se mostrará la respuesta, con tal de analizarla. Podrá comprobar en la documentación del API de CoinDesk, que esta llamada se realizará a `https://api.coindesk.com/v1/bpi/currentprice.json`. Comience creando una propiedad data que eventualmente almacenará la información deseada. A continuación, se realiza el pedido y asigna la respuesta utilizando el lifecycle hook `mounted`:

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

Se obtiene lo siguiente:

<p data-height="350" data-theme-id="32763" data-slug-hash="80043dfdb7b90f138f5585ade1a5286f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Primeros pasos Axios y Vue" class="codepen">See the pen <a href="https://codepen.io/team/Vue/pen/80043dfdb7b90f138f5585ade1a5286f/">Primeros pasos Axios y Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Excelente! Tiene algunos datos pero lucen bien desordenados, así que a continuación los mostrará apropiadamente. Además incluirá manejo de errores en caso de que las cosas no funcionen o demoren en obtener la información más de lo esperado.

## Ejemplo del mundo real: Trabajando con los datos

### Mostrando datos de un API

Es bastante común que la información buscada se encuentre dentro de la respuesta y sea necesario recorrer el objeto recién almacenado, con tal de acceder a ella apropiadamente. En este caso, note que la información de precios se encuentra en `response.data.bpi`. Si utiliza esta propiedad, en su lugar, obtiene lo siguiente:


```js
axios
  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(response => (this.info = response.data.bpi))
```

<p data-height="200" data-theme-id="32763" data-slug-hash="6100b10f1b4ac2961208643560ba7d11" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Segundo paso con Axios y Vue" class="codepen">See the pen <a href="https://codepen.io/team/Vue/pen/6100b10f1b4ac2961208643560ba7d11/">Segundo paso con Axios y Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Esto es mucho más sencillo de utilizar, por tanto ahora podrá actualizar el HTML para mostrar solo la información necesaria de los datos recibidos. Creará, además, un [filtro](../api/#Vue-filter) para asegurar que el decimal se encuentre en el lugar apropiado.

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

Hay ocasiones en las que no obtendrá los datos necesarios del API. Existen múltiples razones por las cuales la llamada axios puede fallar, incluyendo pero no limitadas a:

* El API esta fuera de servicio.
* La llamada se realizó incorrectamente.
* El API no devuelve la información en el formato anticipado.

Cuando realiza esta llamada debe, comprobar la ocurrencia de tales circunstancias y, proporcionar información en cada caso, de forma tal que sepa como manejar el problema. En una llamada axios, ello se logra utilizando `catch`.

```js
axios
  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(response => (this.info = response.data.bpi))
  .catch(error => console.log(error))
```

Esto permitirá saber si algo fallo durante la llamada a la API, pero que ocurre si los datos están estropeados o la API está fuera de servicio? Por ahora, el usuario simplemente no verá nada. Por ello se quisiera incluir un cargador y notificar al usuario si no es factible obtener datos en lo absoluto.

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

Puede accionar el botón rerun en esta nota para ver el estado de cargando brevemente, mientras se solicitan los datos al API:

<p data-height="300" data-theme-id="32763" data-slug-hash="6c01922c9af3883890fd7393e8147ec4" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Cuarto paso con Axiosy Vue" class="codepen">See the pen <a href="https://codepen.io/team/Vue/pen/6c01922c9af3883890fd7393e8147ec4/">Cuarto paso con Axios y Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Esto puede ser mejorado, utilizando componentes para las diferentes secciones y más errores distintos, en dependencia del API empleada y la complejidad de la aplicación.

## Patrones alternativos

### API Fetch

La [API Fetch](https://developers.google.com/web/updates/2015/03/introduction-to-fetch) es una potente API nativa para este tipo de llamadas. Puede que haya escuchado que uno de los beneficios del API Fetch es que no necesita cargar un recurso externo para utilizarla, lo cual es cierto! Excepto que... no es totalmente soportada aún, por tanto todavía necesita utilizar un polyfill. Existen además otros gotchas al trabajar con esta API, por lo cual muchos prefieren usar axios por ahora. Esto bien que podría cambiar en el futuro.

Si esta interesado en utilizar la API Fetch, hay algunos [muy buenos artículos](https://scotch.io/@bedakb/lets-build-type-ahead-component-with-vuejs-2-and-fetch-api) que explican como hacerlo.

## Resumiendo

Existen muchas formas de trabajar con Vue y Axios más allá de consumir y mostrar datos de un API. También puede comunicar con Serverless Functions, post/edit/delete en un API donde tenga permisos de escritura, y muchas otras. Debido a la sencilla integración entre estas dos librerías, se ha vuelto una elección muy común para desarrolladores que necesitan incluir clientes HTTP en su flujo de trabajo.
