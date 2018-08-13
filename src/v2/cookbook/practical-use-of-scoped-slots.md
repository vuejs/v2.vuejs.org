---
title: Practical use of scoped slots with GoogleMaps
type: cookbook
order: 11
---

## Base Example

There are situations when you want the template inside the slot to be able to access data from the child component that hosts the slot content. This is particularly useful when you need freedom in creating custom templates that uses the child component data properties. That is a typical use case for scoped slots.

We will concentrate on a non-typical variation of that use case.

Imagine a component that configures and prepares an external API to be used in another component, but is not tightly coupled with any specific template. That component could then be reused in multiple places rendering different templates but using the same base object with specific API.

We'll create a component (`GoogleMapLoader.vue`) that initialize `Google Maps API`, creates a `google` and `map` objects and exposes those objects in the parent component in which the `GoogleMapLoader` is used.

This is how our template will look like.

```html
<template>
  <div>
    <div id="map" :style="{ height: mapHeight }"></div>
    <template v-if="!!this.google && !!this.map">
      <slot
        :google="google"
        :map="map"
      />
    </template>
  </div>
</template>
```

And our script will look like this, we'll have some props passed to the component that allows us to set the `Google Map API` and `map` object:

```js
import GoogleMapsApiLoader from "google-maps-api-loader";

export default {
  props: {
    mapConfig: Object,
    apiKey: String,
    mapHeight: String
  },

  data() {
    return {
      google: null,
      map: null
    };
  },

  async mounted() {
    const googleMapApi = await GoogleMapsApiLoader({
      apiKey: this.apiKey
    });
    this.google = googleMapApi;
    this.initializeMap();
  },

  methods: {
    initializeMap() {
      const mapContainer = this.$el.querySelector("#map");
      const { Map } = this.google.maps;
      this.map = new Map(mapContainer, this.mapConfig);
    }
  }
};
```

## Real-World Example: Creating a Google Map Loader component

Let's analyze the code piece by piece and see what is actually happening.

### Create a component that initialize our map.

`GoogleMapLoader.vue`

In the template we create a container for the map that will be used to mount the Map object extracted from the Google Maps API.

```html
<template>
  <div>
    <div id="map" :style="{ height: mapHeight }"></div>
  </div>
</template>
```

Inside the script part:

- we receive a props from the parent component that will allows us to set the Google Map:

  - `mapConfig` - Google Maps config object [(go to documentation)](https://developers.google.com/maps/documentation/javascript/reference/3/map#MapOptions])

  - `apiKey` - our personal api key required by Google Maps

  - `mapHeight` - value used to set the height of the map with inline styles


```js
import GoogleMapsApiLoader from "google-maps-api-loader";

export default {
  props: {
    mapConfig: Object,
    apiKey: String,
    mapHeight: String
  },
```
- we set the initial values of `google` and `map` to `null`

```js
  data() {
    return {
      google: null,
      map: null
    };
  },
```

- on `mounted` hook we create an instance of `GoogleMapsApi` and `Map` object from the `GoogleMapsApi`
- we set the values of `google` and `map` to the created instances

```js
  async mounted() {
    const googleMapApi = await GoogleMapsApiLoader({
      apiKey: this.apiKey
    });
    this.google = googleMapApi;
    this.initializeMap();
  },

  methods: {
    initializeMap() {
      const mapContainer = this.$el.querySelector("#map");
      const { Map } = this.google.maps;
      this.map = new Map(mapContainer, this.mapConfig);
    }
  }
};
```

So far so good, with that prepared we could continue adding the other objects to the map (Markers, Lines, etc.) and using it as a ordinary map component. But we want to use our `GoogleMapLoader` component only as a loader that prepares the map, not renders anything on it.

To achieve that we need to allow parent component that will use our `GoogleMapLoader` to access `this.google` and `this.map` that are set inside the loader component. That's where `scoped slots` do their magic. Scoped slots allows us to expose the properties set in a child component to the parent component. It may sound like an inception, but bear with me one more minute.

### Create component that uses our initializer component.

`VesselsGoogleMap.vue`

In the template we render the `GoogleMapLoader` component and pass the props that are required to initialize the map.

```html
<template>
  <div class="google-map">
    <GoogleMapLoader
      class="google-map__map"
      :mapConfig="mapConfig"
      mapHeight="460px"
      apiKey="yourApiKey"
    />
  </div>
</template>
```

Our script tag looks like that at this stage

```js
<script>
import GoogleMapLoader from './GoogleMapLoader'

import {
  mapSettings
} from '@/constants/mapSettings'

export default {
  components: {
    GoogleMapLoader
  },

  data () {
    return {
      mapSettings,
    }
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

<style scoped lang='scss'>
  .google-map {
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid 1px #FFF;

    &__map {
      height: 460px;
      width: 100%;
    }
  }
</style>
```

Still no scoped slots yet. Let's add one.

### Expose `google` and `map` properties to the parent component by adding a scoped slot.

So finally we can add a scoped slot that will do the job and allow us to access the child component props in the parent component. We do that by adding the `<slot>` tag in the child component and passing the props that we want to expose (using `v-bind` directive or `:propName` shorthand). It does not differ from passing the props down to the child component, but by doing it in the `<slot>` tag reverse the direction of data flow.

`GoogleMapLoader.vue`

```html
<template>
  <div>
    <div
      id="map"
      :style="{ height: mapHeight }"
    ></div>
    <template v-if="!!this.google && !!this.map">
      <slot
        :google="google"
        :map="map"
      />
    </template>
  </div>
</template>
```

Now when we have the slot in the child component we need to receive and consume the exposed object in the parent component.

### Receive exposed props in the parent component using `slot-scope` attribute.

To receive the props in the parent component we declare a template element and use `slot-scope` attribute. The attribute has access to the object carrying all props exposed from the child component. We can grab the whole object or we can destructure that object and get the required props. Let's proceed with the second option.

`VesselsGoogleMap.vue`

```html
<GoogleMapLoader
  class="google-map__map"
  :mapConfig="mapConfig"
  mapHeight="460px"
  apiKey="yourApiKey"
>
  <template slot-scope="{ google, map }">
  	{{ map }}
  	{{ google }}
  </template>
</GoogleMapLoader>
```

After doing that even though the `google` and `map` props does not exist in the `VesselsGoogleMap` scope, the component has access to them and we can use them in the template.

Yeah, ok, but why would I do things like that, what is the use of all that?

Scoped slots allows us to pass a template to the slot instead of passing a rendered element. It’s called a “scoped” slot because although the template is rendered in the parent component scope, it will have access to certain child component data. That gives us a freedom to fill the template with custom content from the parent component.

### Create factory components for Markers and Polylines

We will now create two factory components that will be used to create elements in the `VesselsGoogleMap`

`GoogleMapMarker.vue`

```js
import { POINT_MARKER_ICON_CONFIG } from "@/constants/mapSettings";

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
    const { Marker } = this.google.maps;

    new Marker({
      position: this.marker.position,
      marker: this.marker,
      map: this.map,
      icon: POINT_MARKER_ICON_CONFIG
    });
  }
};
```

`GoogleMapLine.vue`

```js
import { LINE_PATH_CONFIG } from "@/constants/mapSettings";

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
    const { Polyline } = this.google.maps;

    new Polyline({
      path: this.path,
      map: this.map,
      ...LINE_PATH_CONFIG
    });
  }
};
```

- both of them receive `google` from which we extract required object (Marker or Polyline) and `map` which gives as a reference to the map on which we want to place our elements.

- each receive also a prop with data required to create a corresponding element.

- on `mounted` hook we create an element (Marker / Polyline) and attach it to our `map` by passing the `map` property to the object constructor.


### Add elements to map

`VesselsGoogleMap.vue`

```html
<GoogleMapLoader
  class="google-map__map"
  :mapConfig="mapConfig"
  mapHeight="460px"
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

To add elements to our map we render the factory component and pass the `google` and `map` objects.

We also need to provide data required by the element itself (in our case `marker` object with position of the marker, `path` object with polyline co-ordinates.

```js
import {
  mapSettings
} from '@/constants/mapSettings'

export default {
  components: {
    GoogleMapLoader,
    GoogleMapMarker,
    GoogleMapLine
  },

  data () {
    return {
      mapSettings,
      markers: [
      { id: "a", position: { lat: 3, lng: 101 } },
      { id: "b", position: { lat: 5, lng: 99 } },
      { id: "c", position: { lat: 6, lng: 97 } },
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

In our script we need to import the required factory components and set data that will be passed to the markers and lines.

## When To Avoid This Pattern:
It might be tempting to create a very complex solutions based on the example, but at some point we can get to the situation where this abstraction becomes an independent part of the code living in our codebase. If we get to that point it might be worth considering extraction to an add-on.
