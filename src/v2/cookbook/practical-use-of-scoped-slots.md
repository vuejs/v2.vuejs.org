---
title: Penggunaan praktis dari slot scoped dengan GoogleMaps
type: cookbook
order: 14
---

## Contoh Dasar

Ada beberapa situasi ketika Anda menginginkan templat dalam slot untuk bisa mengakses data dari _child component_ yang bertanggung jawab untuk menrender slot konten. Sebagian ini berguna ketika Anda membutuhkan kebebasan dalam membuat templat khusus yang menggunakan beberapa properti data _child component_. Kasus penggunaan umum untuk slot _scoped_.

Bayangkan sebuah komponen yang terkonfigurasi dan menyiapkan API eksternal untuk digunakan di komponen lain, tapi tidak tergabung erat dengan templat spesifik manapun. Seperti sebuah komponen dapat diguna-ulang dalam banyak tempat merender templat berbeda tapi menggunakan obyek dasar yang sama dengan API spesifik.

Kita akan membuat sebuah komponen (`GoogleMapLoader.vue`):
1. Inisialisasi [Google Maps API](https://developers.google.com/maps/documentation/javascript/reference/)
2. Buat obyek `google` dan `map`
3. Buka obyek tersebut untuk _parent component_ yang menggunakan `GoogleMapLoader`

Di bawah adalah contoh bagaimana ini bisa dicapai. Kita akan menganalisis kode sepotong-sepotong dan melihat apa yang sebenarnya terjadi dalam seksi berikutnya.

Pertama-tama buat `GoogleMapLoader.vue` templat kita

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

Sekarang, kebutuhan skrip kita untuk mengoper beberapa props ke komponen yang mengizinkan kita untuk menetapkan [Google Maps API](https://developers.google.com/maps/documentation/javascript/reference/) dan [Map object](https://developers.google.com/maps/documentation/javascript/reference/map#Map):

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

Ini hanyalah bagian dari contoh kerja, Anda dapat mencari seluruh contoh di Codesandbox di bawah.

<iframe src="https://codesandbox.io/embed/1o45zvxk0q" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Contoh Nyata: Membuat sebuah komponen Pemuat Google Map

### 1. Buat sebuah komponen yang menginisialisasi map kita

`GoogleMapLoader.vue`

Dalam templat, kita membuat sebuah kontainer untuk peta yang akan digunakan untuk memasang [Map](https://developers.google.com/maps/documentation/javascript/reference/map#Map) obyek yang diekstraksi dari API Google Maps.

```html
<template>
  <div>
    <div class="google-map" ref="googleMap"></div>
  </div>
</template>
```

Berikutnya, skrip kita butuh untuk menerima props dari _parent component_ yang akan mengizinkan kita untuk menetapkan Google Map. Props tersebut terdiri dari:

- [mapConfig](https://developers.google.com/maps/documentation/javascript/reference/3/map#MapOptions): Obyek konfigurasi Google Maps
- [apiKey](https://developers.google.com/maps/documentation/javascript/get-api-key): _Api key_ personal kita dibutuhkan oleh Google Maps

```js
import GoogleMapsApiLoader from 'google-maps-api-loader'

export default {
  props: {
    mapConfig: Object,
    apiKey: String,
  },
```
Lalu, kita menetapkan nilai inisial dari google dan map menjadi null:

```js
  data() {
    return {
      google: null,
      map: null
    }
  },
```

Dalam kait `mounted` kita _instantiate_ sebuah `googleMapApi` dan obyek `Map` dari `GoogleMapsApi` dan kita menetapkan nilai dari `google` dan `map` untuk membuat _instance_:

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

Sejauh ini bagus. Dengan semua yang telah selesai, kita bisa melanjutkan menambahkan ke obyek lain ke dalam peta (Marker, _Polyline_, dll.) dan gunakan sebagai komponen peta biasa.

Tapi, kita ingin menggunakan komponen `GoogleMapLoaded` kita saja sebagai pemuat yang menyiapkan peta — kita tidak ingin merender apapun didalamnya.

Untuk mencapai itu, kita perlu mengizinkan _parent component_ yang akan menggunakan `GoogleMapLoader` kita untuk mengakses `this.google` dan `this.map` yang ditetapkan dalam komponen `GoogleMapLoader`. Itulah dimana _[slot scoped](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots)_ terlihat bersinar. Slot _scoped_ mengizinkan kita untuk membuka pengaturan properti di sebuah _child component_ ke _parent component_. Ini terdengar seperti permulaan, tapi bertahanlah beberapa menit untuk
kita urai lebih dalam.

### 2. Membuat komponen yang menggunakan penginisialisasi komponen kita.

`TravelMap.vue`

Dalam templat, kita merender komponen `GoogleMapLoader` dan mengoper props yang dibutuhkan untuk menginisialisasi peta.

```html
<template>
  <GoogleMapLoader
    :mapConfig="mapConfig"
    apiKey="yourApiKey"
  />
</template>
```

Tag skrip kita akan terlihat seperti ini:

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

Masih tanpa slot _scoped_, jadi mari tambahkan satu.

### 3. Membuka properti `google` dan `map` ke _parent component_ dengan menambahkan slot _scoped_.

Akhirnya, kita akan menambahkan slot _scoped_ yang akan melakukan pekerjaannya dan mengizinkan kita untuk mengakses props _child component_ di _parent component_. Kita melakukannya dengan menambahkan tag `<slot>` dalam _child component_ dan mengoper props yang kita inginkan untuk dibuka (menggunakan _directive_ `v-bind` atau tulisan cepat `:propName`). Ini tidak berbeda dari mengoper props turuh ke _child component_, tapi dengan melakukan ini dalam tag `<slot>` akan membalikan arah
dari aliran data.

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

Sekarang, ketika kita memiliki slot dalam _child component_, kita perlu menerima dan mengkonsumsi props yang dibuka di _parent component_.

### 4. Menerima props yang dibuka di _parent component_ menggunakan atribut `slot-scope`.

Untuk menerima props di _parent component_, kita mendeklarasikan sebuauh elemen templat dan menggunakan atribut `slot-scope`. Atribut ini memiliki akses ke obyek yang membawa semua props yang dibuka dari _child component_. Kita bisa mengambil seluruh obyek atau kita bisa [menghancurkan obyek tersebut](https://vuejs.org/v2/guide/components-slots.html#Destructuring-slot-scope) dan hanya apa yang kita butuhkan

Mari hancurkan benda ini untuk mendapatkan apa yang kita butuhkan.

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

Meskipun props `google` dan `map` tidak ada di _scope_ `TravelMap`, komponen masih memiliki akses ke props (props dari `google` dan `map`) dan kita dapat menggunakannya dalam templat.

Anda mungkin takjub mengapa kita mau melakukan hal seperti itu dan apa gunanya semua itu?

Slot _scoped_ mengizinkan kita untuk mengoper templat ke slot sebagai ganti dari elemen yang telah dirender. Itu disebut slot `scoped` karena itu akan memiliki akses ke data _child component_ tertentu meskipun templat telah dirender dalam _scope_ _parent component_. Ini memberikan kita kebebasan untuk mengisi templat dengan konten khusu dari _parent component_.

### 5. Membuat komponen pabrik dari _Marker_ dan _Polyline_

Sekarang ketika kita memiliki peta kita siap kita akan membuat 2 komponen pabrik yang akan digunakan untuk menambah elemen ke `TravelMap`.

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

Keduanya menerima `google` yang kita gunakan untuk mengekstraksi obyek yang dibutuhkan (_Marker_ atau _Polyline_) sebaik `map` yang diberikan sebagai referensi ke peta di mana kita ingin menempatkan elemen kita.

Masing-masing komponen juga berekspektasi prop tambahan untuk membuat elemen yang sesuai. Dalam kasus ini, kita memiliki `marker` dan `path`, masing-masing.

Dalam kait yang terpasang, kita membuat sebuah elemen (_Marker_/_Polyline_) dan melampirkannya ke peta kita dengan mengoper properti `map` untuk konstruktor obyek.

Masih ada satu langkah lagi...

### 6. Menambah elemen ke peta

Mari gunakan komponen pabrik kita untuk menambah elemen ke peta kita. Kita harus merender komponen pabrik dan mengoper obyek `google` dan `peta` jadi aliran data menuju ke tempat yang tepat.

Kita juga perlu menyediakan data yang dibutuhkan oleh elemen itu sendiri. Dalam kasus kita adalah obyek `marker` dengan posisi dari marker dan obyek `path` dengan koordinat _Polyline_/

Kita mulai, mengintegrasi poin data langsung ke templat:

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

Kita perlu mengimpor komponen pabrik yang dibutuhkan di skrip kita dan menetapkan data yang akan dioper ke marker dan garis:

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

## Kapan Untuk Menghindari Pola Ini
Ini mungkin menggoda untuk membuat solusi yang sangat kompleks berdasarkan contoh, tapi dalam beberapa poin kita dapat sampai pada situasi dimana abstraksi ini menjadi bagian yang mandiri dari kode yang berada dalam basis kode.

## Kesimpulan
Jadi itu saja. Dengan semua bit-bit itu dan bagian-bagian yang telah dibuat sekarang kita dapat menguna-ulang komponen `GoogleMapLoader` sebagai dasar untuk semua peta kita dengan mengoper tempat berbeda ke masing-masing templat tersebut. Bayangkan Anda perlu membuat peta lain dengan Marker yang berbeda atau hanya Marker tanpa _Polyline_. Dengan menggunakan pola di atas itu menjadi sangat mudah seperti kita hanya perlu mengoper konten yang berbeda ke komponen `GoogleMapLoader`.

Pola ini tidak ketat terkoneksi ke _Google Maps_; ini dapat digunakan dengan pustaka apapun untuk menetapkan dasar komponen dan membuka pustaka API yang mungkin digunakan dalam komponen yang dipanggil komponen dasar.
