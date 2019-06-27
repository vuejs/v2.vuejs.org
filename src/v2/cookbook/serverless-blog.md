---
title: Crear un Blog en base a un CMS
type: cookbook
order: 5
---

Así que acaba de lanzar su sitio web Vue.js, felicidades! Ahora usted desea agregar un blog que se conecte rápidamente a su sitio web y no quiere tener que activar un servidor completo solo para alojar una instancia de Wordpress (o cualquier CMS con DB). ¿Quiere simplemente poder agregar algunos componentes del blog Vue.js y algunas rutas y hacer que todo funcione, verdad? Lo que está buscando es un blog que esté completamente basado en API y que pueda consumir directamente desde su aplicación Vue.js. Este tutorial le enseñará a usted cómo hacerlo, ¡Comencemos!

Vamos a construir rápidamente un blog basado en CMS con Vue.js. Utilizaremos [ButterCMS](https://buttercms.com/), un CMS que le permite administrar contenido usando el panel de control de ButterCMS e integrar nuestra API de contenido en su aplicación Vue.js. Puede utilizar ButterCMS para proyectos Vue.js nuevos o existentes.

![Tablero Butter](https://user-images.githubusercontent.com/160873/36677285-648798e4-1ad3-11e8-9454-d22fca8280b7.png "Tablero Butter")

## Instalar

Ejecuta esto en tu línea de comando:

```bash
npm install buttercms --save
```

Butter también se puede cargar utilizando un CDN:

```html
<script src="https://cdnjs.buttercms.com/buttercms-1.1.0.min.js"></script>
```

## Inicio rápido

Configure su token API:

```javascript
var butter = require('buttercms')('su_api_token');
```

Usando ES6:

```javascript
import Butter from 'buttercms';
const butter = Butter('su_api_token');
```

Usando CDN:

```html
<script src="https://cdnjs.buttercms.com/buttercms-1.1.0.min.js"></script>
<script>
  var butter = Butter('su_api_token');
</script>
```

Importe este archivo en cualquier componente que desee utilizar ButterCMS. Luego desde la consola ejecute:

```javascript
butter.post.list({page: 1, page_size: 10}).then(function(response) {
  console.log(response)
})
```

Esta solicitud de API recupera sus publicaciones del blog. Su cuenta viene con una publicación de ejemplo que verá en la respuesta.

## Mostrar las publicaciones

Para mostrar las publicaciones, creamos una ruta `/blog` (usando Vue Router) en nuestra aplicación y obtenemos las publicaciones del blog desde la API de Butter, así como una ruta `/ blog/:slug` para manejar las publicaciones individuales.

Consulte la [Referencia de API](https://buttercms.com/docs/api/?javascript#blog-posts) de ButterCMS para ver opciones adicionales, como filtrar por categoría o por autor. La respuesta también incluye algunos metadatos que usaremos para la paginación.

`router/index.js:`

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import BlogHome from '@/components/BlogHome'
import BlogPost from '@/components/BlogPost'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/blog/',
      name: 'blog-home',
      component: BlogHome
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: BlogPost
    }
  ]
})
```

Luego cree `components/BlogHome.vue` que será la página de inicio de su blog que enumera sus publicaciones más recientes.

```html
<script>
  import { butter } from '@/buttercms'
  export default {
    name: 'blog-home',
    data() {
      return {
        page_title: 'Blog',
        posts: []
      }
    },
    methods: {
      getPosts() {
        butter.post.list({
          page: 1,
          page_size: 10
        }).then(res => {
          this.posts = res.data.data
        })
      }
    },
    created() {
      this.getPosts()
    }
  }
</script>

<template>
  <div id="blog-home">
      <h1>{{ page_title }}</h1>
      <!-- Cree `v-for` y aplique una `key` para Vue. Aquí estamos usando una combinación del `slug` y el índice. -->
      <div
        v-for="(post,index) in posts"
        :key="post.slug + '_' + index"
      >
        <router-link :to="'/blog/' + post.slug">
          <article class="media">
            <figure>
              <!-- Enlazar resultados usando un `:` -->
              <!-- Use un `v-if`/`else` si es un `featured_image` -->
              <img
                v-if="post.featured_image"
                :src="post.featured_image"
                alt=""
              >
              <img
                v-else
                src="http://via.placeholder.com/250x250"
                alt=""
              >
            </figure>
            <h2>{{ post.title }}</h2>
            <p>{{ post.summary }}</p>
          </article>
        </router-link>
      </div>
  </div>
</template>
```

Así es como se ve (note que agregamos CSS de https://bulma.io/ para dar un estilo rápido):

![buttercms-bloglist](https://user-images.githubusercontent.com/160873/36868500-1b22e374-1d5e-11e8-82a0-20c8dc312716.png)

Ahora cree `components/BlogPost.vue` que será su página de publicación de blog para listar una sola publicación.

```html
<script>
  import { butter } from '@/buttercms'
  export default {
    name: 'blog-post',
    data() {
      return {
        post: {}
      }
    },
    methods: {
      getPost() {
        butter.post.retrieve(this.$route.params.slug)
          .then(res => {
            this.post = res.data
          }).catch(res => {
            console.log(res)
          })
      }
    },
    created() {
      this.getPost()
    }
  }
</script>

<template>
  <div id="blog-post">
    <h1>{{ post.data.title }}</h1>
    <h4>{{ post.data.author.first_name }} {{ post.data.author.last_name }}</h4>
    <div v-html="post.data.body"></div>

    <router-link
      v-if="post.meta.previous_post"
      :to="/blog/ + post.meta.previous_post.slug"
      class="button"
    >
      {{ post.meta.previous_post.title }}
    </router-link>
    <router-link
      v-if="post.meta.next_post"
      :to="/blog/ + post.meta.next_post.slug"
      class="button"
    >
      {{ post.meta.next_post.title }}
    </router-link>
  </div>
</template>
```

Aquí hay una vista previa:

![buttercms-detallesblog](https://user-images.githubusercontent.com/160873/36868506-218c86b6-1d5e-11e8-8691-0409d91366d6.png)

Ahora nuestra aplicación está trayendo todas las publicaciones del blog y podemos navegar a las publicaciones individuales. Sin embargo, nuestros botones de publicación siguiente/anterior no funcionan.

Una cosa a tener en cuenta cuando se usan rutas con parámetros es que cuando el usuario navega desde `/blog/foo` a `/blog/bar`, se reutilizará la misma instancia de componente. Dado que ambas rutas representan el mismo componente, esto es más eficiente que destruir la instancia anterior y luego crear una nueva.

<p class="tip">Tenga en cuenta que utilizar el componente de esta manera significará que no se llamarán los hooks del ciclo de vida del componente. Visite los documentos de Vue Router para obtener más información sobre [Coincidencia dinámica de rutas](https://router.vuejs.org/en/essentials/dynamic-matching.html)</p>

Para arreglar esto necesitamos ver el objeto `$route` y llamar `getPost()` cuando la ruta cambia.

Sección `<script>` actualizada en `components/BlogPost.vue`:

```html
<script>
  import { butter } from '@/buttercms'
  export default {
    name: 'blog-post',
    data() {
      return {
        post: null
      }
    },
    methods: {
      getPost() {
        butter.post.retrieve(this.$route.params.slug)
          .then(res => {
            this.post = res.data
          }).catch(res => {
            console.log(res)
          })
      }
    },
    watch: {
      $route(to, from) {
        this.getPost()
      }
    },
    created() {
      this.getPost()
    }
  }
</script>
```

Ahora su aplicación tiene un blog en funcionamiento que se puede actualizar fácilmente en el panel de ButterCMS.

## Categorías, Etiquetas y Autores

Use las API de Butter para categorías, etiquetas y autores para mostrar y filtrar contenido en su blog.

Consulte la referencia de la API ButterCMS para obtener más información sobre estos objetos:

* [Categorías](https://buttercms.com/docs/api/?ruby#categories)
* [Etiquetas](https://buttercms.com/docs/api/?ruby#tags)
* [Autores](https://buttercms.com/docs/api/?ruby#authors)

Aquí hay un ejemplo sobre como enumerar todas las categorías y obtener publicaciones por categoría. Invoque a estos métodos en el hook de ciclo de vida `created()`:

```javascript
methods: {
  // ...
  getCategories() {
    butter.category.list()
      .then(res => {
        console.log('Lista de Categorías:')
        console.log(res.data.data)
      })
  },
  getPostsByCategory() {
    butter.category.retrieve('example-category', {
        include: 'recent_posts'
      })
      .then(res => {
        console.log('Publicaciones con una categoría específica:')
        console.log(res)
      })
  }
},
created() {
  // ...
  this.getCategories()
  this.getPostsByCategory()
}
```

## Patrones alternativos

Un patrón alternativo a considerar, especialmente si usted prefiere escribir solo en Markdown, es usar algo como [Nuxtent](https://nuxtent.now.sh/guide/writing#async-components). Nuxtent le permite usar `Vue Component` dentro de los archivos de Markdown. Este enfoque sería similar a un enfoque de sitio estático (es decir, Jekyll) en el que compones las publicaciones de tu blog en archivos Markdown. Nuxtent agrega una buena integración entre Vue.js y Markdown, lo que le permite vivir en un mundo 100% Vue.js.

## En resumen

¡Eso es todo! Ahora usted tiene un blog completamente funcional con CMS que se ejecuta en su aplicación. Esperamos que este tutorial le haya sido útil y que su experiencia de desarrollo con Vue.js sea aún más agradable :)
