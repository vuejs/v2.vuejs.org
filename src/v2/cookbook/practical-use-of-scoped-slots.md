---
title: Practical use of scoped slots with GoogleMaps
type: cookbook
order: 14
---

## Base Example

There are situations when you want the template inside the slot to be able to access data from the child component that is responsible for rendering the slot content. This is particularly useful when you need freedom in creating custom templates that use the child component's data properties. That is a typical use case for scoped slots.

Imagine a component that configures and prepares an external API to be used in another component, but is not tightly coupled with any specific template. Such a component could then be reused in multiple places rendering different templates but using the same base object with specific API.

We'll create a component (`GoogleMapLoader.vue`) that:
1. Initializes the [Google Maps API](https://developers.google.com/maps/documentation/javascript/reference/)
2. Creates `google` and `map` objects
3. Exposes those objects to the parent component in which the `GoogleMapLoader` is used

Below is an example of how this can be achieved. We will analyze the code piece-by-piece and see what is actually happening in the next section.

Let’s first establish our `GoogleMapLoader.vue` template:

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

Now, our script needs to pass some props to the component which allows us to set the [Google Maps API](https://developers.google.com/maps/documentation/javascript/reference/) and [Map object](https://developers.google.com/maps/documentation/javascript/reference/map#Map):

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

This is just part of a working example, you can find the whole example in the Codesandbox below.

<iframe src="https://codesandbox.io/embed/1o45zvxk0q" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Real-World Example: Creating a Google Map Loader component

### 1. Create a component that initializes our map

`GoogleMapLoader.vue`

In the template, we create a container for the map which will be used to mount the [Map](https://developers.google.com/maps/documentation/javascript/reference/map#Map) object extracted from the Google Maps API.

```html
<template>
  <div>
    <div class="google-map" ref="googleMap"></div>
  </div>
</template>
```

Next up, our script needs to receive props from the parent component which will allow us to set the Google Map. Those props consist of:

- [mapConfig](https://developers.google.com/maps/documentation/javascript/reference/3/map#MapOptions): Google Maps config object
- [apiKey](https://developers.google.com/maps/documentation/javascript/get-api-key): Our personal api key required by Google Maps

```js
import GoogleMapsApiLoader from 'google-maps-api-loader'

export default {
  props: {
    mapConfig: Object,
    apiKey: String,
  },
```
Then, we set the initial values of google and map to null:

```js
  data() {
    return {
      google: null,
      map: null
    }
  },
```

On `mounted` hook we instantiate a `googleMapApi` and `Map` objects from the `GoogleMapsApi` and we set the values of `google` and `map` to the created instances:

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

So far, so good. With all that done, we could continue adding the other objects to the map (Markers, Polylines, etc.) and use it as an ordinary map component.

But, we want to use our `GoogleMapLoader` component only as a loader that prepares the map — we don’t want to render anything on it.

To achieve that, we need to allow the parent component that will use our `GoogleMapLoader` to access `this.google` and `this.map` that are set inside the `GoogleMapLoader` component. That’s where [scoped slots](/v2/guide/components-slots.html#Scoped-Slots) really shine. Scoped slots allow us to expose the properties set in a child component to the parent component. It may sound like Inception, but bear with me one more minute as we break that down further.

### 2. Create component that uses our initializer component.

`TravelMap.vue`

In the template, we render the `GoogleMapLoader` component and pass props that are required to initialize the map.

```html
<template>
  <GoogleMapLoader
    :mapConfig="mapConfig"
    apiKey="yourApiKey"
  />
</template>
```

Our script tag will look like this:

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

Still no scoped slots, so let's add one.

### 3. Expose `google` and `map` properties to the parent component by adding a scoped slot.

Finally, we can add a scoped slot that will do the job and allow us to access the child component props in the parent component. We do that by adding the `<slot>` tag in the child component and passing the props that we want to expose (using `v-bind` directive or `:propName` shorthand). It does not differ from passing the props down to the child component, but doing it in the `<slot>` tag will reverse the direction of data flow.

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

Now, when we have the slot in the child component, we need to receive and consume the exposed props in the parent component.

### 4. Receive exposed props in the parent component using `slot-scope` attribute.

To receive the props in the parent component, we declare a template element and use the `slot-scope` attribute. This attribute has access to the object carrying all the props exposed from the child component. We can grab the whole object or we can [de-structure that object](/v2/guide/components-slots.html#Destructuring-slot-scope) and only what we need.

Let’s de-structure this thing to get what we need.

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

Even though the `google` and `map` props do not exist in the `TravelMap` scope, the component has access to them and we can use them in the template.

You might wonder why would we do things like that and what is the use of all that?

Scoped slots allow us to pass a template to the slot instead of a rendered element. It’s called a `scoped` slot because it will have access to certain child component data even though the template is rendered in the parent component scope. This gives us the freedom to fill the template with custom content from the parent component.

### 5. Create factory components for Markers and Polylines

Now when we have our map ready we will create two factory components that will be used to add elements to the `TravelMap`.

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

Both of these receive `google` that we use to extract the required object (Marker or Polyline) as well as `map` which gives as a reference to the map on which we want to place our element.

Each component also expects an extra prop to create a corresponding element. In this case, we have `marker` and `path`, respectively.

On the mounted hook, we create an element (Marker/Polyline) and attach it to our map by passing the `map` property to the object constructor.

There’s still one more step to go...

### 6. Add elements to map

Let’s use our factory components to add elements to our map. We must render the factory component and pass the `google` and `map` objects so data flows to the right places.

We also need to provide the data that’s required by the element itself. In our case, that’s the `marker` object with the position of the marker and the `path` object with Polyline coordinates.

Here we go, integrating the data points directly into the template:

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

We need to import the required factory components in our script and set the data that will be passed to the markers and lines:

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
      { id: 'c', position: { lat: 6, lng: 97 } },
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

## When To Avoid This Pattern
It might be tempting to create a very complex solution based on the example, but at some point we can get to the situation where this abstraction becomes an independent part of the code living in our codebase. If we get to that point it might be worth considering extraction to an add-on.

## Wrapping Up
That's it. With all those bits and pieces created we can now re-use the `GoogleMapLoader` component as a base for all our maps by passing different templates to each one of them. Imagine that you need to create another map with different Markers or just Markers without Polylines. By using the above pattern it becomes very easy as we just need to pass different content to the `GoogleMapLoader` component.

This pattern is not strictly connected to Google Maps; it can be used with any library to set the base component and expose the library's API that might be then used in the component that summoned the base component.
