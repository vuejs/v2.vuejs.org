---
title: Uso práctico de scoped slots con GoogleMaps
type: cookbook
order: 14
---

## Ejemplo Base

Hay situaciones en la que usted querrá que el _template_ dentro del _slot_ acceda a los datos del componente hijo que es responsable de renderizar el contenido del _slot_. Esto es particularmente útil cuando usted necesita libertad al crear _templates_ personalizados que utilizen los datos y propiedades del componente hijo. Este es un caso típico para el uso de _scoped slots_.

Imagine un componente que configura y prepara una API externa para ser usada en otra componente, pero no esta fuertemente acoplada a un _template_ específico. Tal componente puede ser reusado en muchos lugares renderizando diferentes _templates_ pero usando el mismo objeto con la API específica.

Crearemos un componente (`GoogleMapLoader.vue`) que:
1. Inicializará la [API de Google Maps](https://developers.google.com/maps/documentation/javascript/reference/)
2. Creará los objetos `google` y `map`
3. Expondrá estos objetos a su componente padre donde `GoogleMapLoader` es utilizada

Debajo hay un ejemplo de como se puede lograr esto. Analizaremos el código pieza por pieza y veremos que es lo que realmente está sucediendo en la siguiente sección.

Pero primero, declaramos el _template_ para `GoogleMapLoader.vue`:

```html
<template>
  <div>
    <div class="google-map" ref="googleMap"></div>
    <template v-if="Boolean(this.google) && Boolean(this.map)">
      <slot
        :google="google"
        :map="map"
      />
    </template>
  </div>
</template>
```

Ahora, nuestro _script_ necesita pasar algunas _props_ a el componente que nos permita setear la [API de Google Maps](https://developers.google.com/maps/documentation/javascript/reference/) y el [objeto Map](https://developers.google.com/maps/documentation/javascript/reference/map#Map):

```js
import GoogleMapsApiLoader from 'google-maps-api-loader'

export default {
  props: {
    mapConfig: Object,
    apiKey: String,
  },

  data() {
    return {
      google: null,
      map: null
    }
  },

  async mounted() {
    const googleMapApi = await GoogleMapsApiLoader({
      apiKey: this.apiKey
    })
    this.google = googleMapApi
    this.initializeMap()
  },

  methods: {
    initializeMap() {
      const mapContainer = this.$refs.googleMap
      this.map = new this.google.maps.Map(
        mapContainer, this.mapConfig
      )
    }
  }
}
```

Este es simplemente un ejemplo funcional, usted puede encontrar el ejemplo completo abajo.

<iframe src="https://codesandbox.io/embed/1o45zvxk0q" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Ejemplo en el mundo real: creando un componente que inicialize Google Map

### 1. Crear un componente que inicialize nuestro mapa

`GoogleMapLoader.vue`

En este _template_, creamos un contenedor para el mapa, el cuál será utilizado para montar el objeco [Map](https://developers.google.com/maps/documentation/javascript/reference/map#Map) extraído desde la API de Google Maps. 

```html
<template>
  <div>
    <div class="google-map" ref="googleMap"></div>
  </div>
</template>
```

Luego, nuestro _script_ necesita recibir _props_ desde su componente padre, esto nos permitirá setear el Google Map. Estas _props_ consisten en:

- [mapConfig](https://developers.google.com/maps/documentation/javascript/reference/3/map#MapOptions): objeto de configuración de  Google Maps
- [apiKey](https://developers.google.com/maps/documentation/javascript/get-api-key): nuestra clave personal requerida por la API de Google Maps

```js
import GoogleMapsApiLoader from 'google-maps-api-loader'

export default {
  props: {
    mapConfig: Object,
    apiKey: String,
  },
```

Después, inicializamos _google_ y _map_ como _null_:

```js
  data() {
    return {
      google: null,
      map: null
    }
  },
```

En el método `mounted` instanciamos los objetos `googleMapApi` y `Map` desde `googleMapsApi` y asignamos nuestras propiedades `google` y `map` con los de la instancia creada:

```js
  async mounted() {
    const googleMapApi = await GoogleMapsApiLoader({
      apiKey: this.apiKey
    })
    this.google = googleMapApi
    this.initializeMap()
  },

  methods: {
    initializeMap() {
      const mapContainer = this.$refs.googleMap
      this.map = new this.google.maps.Map(mapContainer, this.mapConfig)
    }
  }
}
```

Hasta ahora todo bien. Podríamos continuar añandiendole objetos al mapa (Marcadores, Líneas Polígonales, etc.) y usarla como si fuera un componente ordinario.

Pero lo que queremos es usar nuestro componente `GoogleMapLoader` solamente como un inicializador que prepara el mapa - no queremos renderizar nada en ella.

Para lograrlo, tenemos que permitir que la componente padre que utilizará `GoogleMapLoader` acceda a `this.google` y `this.map`, los cuáles se encuentran definidos dentro de nuestro componente `GoogleMapLoader`. Aquí es donde los [scoped slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) realmente brillan. Los _scoped slots_ nos permiten exponer propiedades definidas en el componente hijo al componente padre. Esto podria parecer magia, pero no lo es,  a continuación veremos como funciona.

### 2. Crear un componente que use nuestro componente inicializador

`TravelMap.vue`

En el _template_, renderizamos la componente `GoogleMapLoader` y le pasamos las _props_ requeridas para inicializar el mapa.

```html
<template>
  <GoogleMapLoader
    :mapConfig="mapConfig"
    apiKey="yourApiKey"
  />
</template>
```

Nuestra _script tag_ se verá de la siguiente forma:

```js
<script>
import GoogleMapLoader from './GoogleMapLoader'
import { mapSettings } from '@/constants/mapSettings'

export default {
  components: {
    GoogleMapLoader
  },
  computed: {
    mapConfig () {
      return {
        ...mapSettings,
        center: { lat: 0, lng: 0 }
      }
    },
  },
}
</script>
```

Aún no hay _scoped slots_, así que añadamos uno.

### 3. Exponer las propiedades `google` y `map` a el componente padre añadiendo un _scoped slot_

Finalmente, podemos añadir un _scoped slot_ que hará el trabajo de permitirnos acceder a las propiedades del componente hijo desde el componente padre. Logramos esto añadiendo una _tag_ `<slot>` en el componente hijo y pasandole las _props_ que queremos exponer (usando la directiva `v-bind` o el modo abreviado `:propName`). No difiere en pasar _props_ a un componente hijo, pero realizarlo en la _tag_ `<slot>` va a revertir la dirección del flujo de información.

`GoogleMapLoader.vue`

```html
<template>
  <div>
    <div class="google-map" ref="googleMap"></div>
    <template v-if="Boolean(this.google) && Boolean(this.map)">
      <slot
        :google="google"
        :map="map"
      />
    </template>
  </div>
</template>
```

Ahora, cuando tenemos el _slot_ en el componente hijo, en el componente padre tenemos que recibir y consumir las propiedas expuestas.

### 4. Recibir en el componente padre las propiedades expuestas utilizando el atributo `slot-scope`

Para recibir las propiedad en el componente padre, declaramos un _template_ y utilizamos el atributo `slot-scope`. Este atributo tiene acceso al objeto que contiene todas las propiedades expuestas por el componente hijo. Podemos acceder a todo el objeto o podemos [desestructurar este objeto](https://vuejs.org/v2/guide/components-slots.html#Destructuring-slot-scope) y sólo acceder a lo que necesitamos.

Desestructurémoslo y obtengamos lo que necesitamos.

`TravelMap.vue`

```html
<GoogleMapLoader
  :mapConfig="mapConfig"
  apiKey="yourApiKey"
>
  <template slot-scope="{ google, map }">
  	{{ map }}
  	{{ google }}
  </template>
</GoogleMapLoader>
```

Aunque las propiedades `google` y `map` no existen en el el _scope_ de `TravelMap`, la componente tiene acceso a ellas y pueden ser usadas en el _template_.

Puede estar pensando ¿porque haría cosas como esta? y ¿cuál es el uso de todo esto?

Los _scoped slots_ nos permiten pasar un _template_ al _slot_ en vez de un elemento renderizado. Se le llama `scoped` _slot_ porque tendrá acceso a ciertos datos del componente hijo aunque este _template_ sea renderizado en el _scope_ del componente padre. Eso nos da la libertad de elegir el contenido del _template_ desde el componente padre.

### 5. Crear un componente factory para Marcadores y Líneas Poligonales

Ahora que nuestro mapa está pronto, crearmos dos componentes _factory_ que usaramos para añadir elementos a `TravelMal`.

`GoogleMapMarker.vue`

```js
import { POINT_MARKER_ICON_CONFIG } from '@/constants/mapSettings'

export default {
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    marker: {
      type: Object,
      required: true
    }
  },

  mounted() {
    new this.google.maps.Marker({
      position: this.marker.position,
      marker: this.marker,
      map: this.map,
      icon: POINT_MARKER_ICON_CONFIG
    })
  }
}
```

`GoogleMapLine.vue`

```js
import { LINE_PATH_CONFIG } from '@/constants/mapSettings'

export default {
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    path: {
      type: Array,
      required: true
    }
  },

  mounted() {
    new this.google.maps.Polyline({
      path: this.path,
      map: this.map,
      ...LINE_PATH_CONFIG
    })
  }
}
```

Ambos reciben la propiedad `google` que usamos para extraer el objeto deseado (Marcadores o Líneas Poligonales) así como `map`, la cuál da referencia al mapa en el que queremos poner nuestro elemento.

Cada componente también acepta una _prop_ extra para crear el elemnto correspondiente. En este caso tenemos `marker` y `path` respectivamente.

En el método `mounted` del ciclo de vida, creamos un element (Marcador/Línea Polígonal) y lo añadimos a nuestro mapa pasando la propiedad `map` al constructor del objeto.

Aún queda un paso más por hacer...

### 6. Añadir elementos al mapa

Utilicemos nuestros componentes _factory_ para añadir elementos al mapa. Debemos renderizar la componente _factory_ y pasarle los objetos `google` y `map` así la información fluye al lugar correcto.

También debemos proveer la información que requiere el elemento. En nuestro caso, este es el objeto `marker` con la posición del marcador y el objeto `path` con las coordenadas de la Línea Poligonal.

Integremos la información directamente en el _template_:

```html
<GoogleMapLoader
  :mapConfig="mapConfig"
  apiKey="yourApiKey"
>
  <template slot-scope="{ google, map }">
    <GoogleMapMarker
      v-for="marker in markers"
      :key="marker.id"
      :marker="marker"
      :google="google"
      :map="map"
    />
    <GoogleMapLine
      v-for="line in lines"
      :key="line.id"
      :path.sync="line.path"
      :google="google"
      :map="map"
    />
  </template>
</GoogleMapLoader>
```

Necesitamos importar los componentes _factory_ en nuestro _script_ y luego preparar la información que luego le pasaremos a los marcadores y líneas:

```js
import { mapSettings } from '@/constants/mapSettings'

export default {
  components: {
    GoogleMapLoader,
    GoogleMapMarker,
    GoogleMapLine
  },

  data () {
    return {
      markers: [
        { id: 'a', position: { lat: 3, lng: 101 } },
        { id: 'b', position: { lat: 5, lng: 99 } },
        { id: 'c', position: { lat: 6, lng: 97 } }
      ],
      lines: [
        { id: '1', path: [{ lat: 3, lng: 101 }, { lat: 5, lng: 99 }] },
        { id: '2', path: [{ lat: 5, lng: 99 }, { lat: 6, lng: 97 }] }
      ],
    }
  },

  computed: {
    mapConfig () {
      return {
        ...mapSettings,
        center: this.mapCenter
      }
    },

    mapCenter () {
      return this.markers[1].position
    }
  },
}
```

## Cuando evitar este patrón

Puede parecer muy tentador crear una solución muy compleja basada en este ejemplo, pero en cierto punto podemos llegar a la situación en la que esta abstracción se convierte en una parte independiente de código viviendo en el proyecto. Si llegamos a tal punto, puede valer la pena considerar extraer está abstracción a un componente que no utilize _scoped slots_.

## Resumiendo

Esto es todo. Ahora podemos reusar la componente `GoogleMapLoader` como base para todos nuestros mapa pasando diferentes template a cada uno de ellos. Imagine que necesita crear otro mapa con diferentes marcador o simplemente marcadores sin líneas poligonales. Usando este patrón se vuelve muy fácil, ya que sólo se requiere pasar un contenido diferente a el componente `GoogleMapLoader`.

Este patrón no está estrictamente connectado con Google Maps; puede ser utilizado en un componente base con cualquier librería para luego exponer la API de la misma, que luego puede ser utilizada por el componente que invoca dicho componente base.
