---
title: Create a CMS-Powered Blog (EN)
type: cookbook
order: 5
---

<p>Donc vous venez juste de lancer votre site web en Vue.js, félicitations ! Maintenant vous voulez lui ajouter un blog qui va s'intégrer rapidement sans avoir à mettre en place un serveur complet pour héberger une instance de Wordpress (or tout autre CMS utilisant une base de données). Vous voulez seulement ajouter quelques composants Vue.js et des routes pour que votre blog fonctionne, n'est-ce pas ? Ce que vous recherchez, c'est un blog qui fonctionne entièrement sur des interfaces de programmation directement consommées par votre application Vue.js. Ce tutoriel va vous apprendre à le faire, lançons-nous !</p>
Nous allons rapidement construire un blog en nous basant sur un CMS avec Vue.js. Ce CMS c'est [ButterCMS](https://buttercms.com/), un CMS implémentant le patron de conception API-first qui vous permet de gérer le contenu au travers du panneau d'administration de ButterCMS et de consommer les interfaces de programmation du contenu dans votre application Vue.js. Vous pouvez utiliser ButterCMS pour de nouveaux projets Vuejs ou pour des projets existants.

![Butter Dashboard](https://user-images.githubusercontent.com/160873/36677285-648798e4-1ad3-11e8-9454-d22fca8280b7.png "Butter Dashboard")

## Installation

Exécutez cette ligne de commande:

```bash
npm install buttercms --save
```

Butter peut aussi être chargé en utilisant un CDN:

```html
<script src="https://cdnjs.buttercms.com/buttercms-1.1.0.min.js"></script>
```

## Démarrage rapide

Renseignez votre jeton d'identification:

```javascript
var butter = require('buttercms')('votre_jeton');
```

En utilisant ES6:

```javascript
import Butter from 'buttercms';
const butter = Butter('votre_jeton');
```

En utilisant le CDN:

```html
<script src="https://cdnjs.buttercms.com/buttercms-1.1.0.min.js"></script>
<script>
  var butter = Butter('your_api_token');
</script>
```

Importez ce fichier dans chaque composant utilisant ButterCMS. Puis dans la console, exécutez:

```javascript
butter.post.list({page: 1, page_size: 10}).then(function(response) {
  console.log(response)
})
```

Cette requête sur l'interface de programmation récupère les articles du blog. Votre compte propose par défaut un article en exemple que vous verrez dans la réponse à cette requête.

## Afficher les articles

Afin d'afficher les articles, nous créons une route `/blog` (en utilisant Vue Router) dans notre application et nous récupérons tous les articles grâce à l'interface de programmation de Butter, et de la même manière nous créons la route `/blog/:slug` afin d'afficher récupérer les articles de manière individuelle.

Référez-vous à la [documentation de l'interface de programmation](https://buttercms.com/docs/api/?javascript#blog-posts) de ButterCMS pour prendre connaissance des options supplémentaires disponibles telles que le filtrage par catégorie ou par auteur. La réponse inclut aussi des métadonnées que nous utiliserons pour la pagination.

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

Ensuite créez le fichier `components/BlogHome.vue` qui sera la page d'accueil de notre blog et qui listera vos plus récents articles.

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
      <!-- Create `v-for` and apply a `key` for Vue. Here we are using a combination of the slug and index. -->
      <div
        v-for="(post,index) in posts"
        :key="post.slug + '_' + index"
      >
        <router-link :to="'/blog/' + post.slug">
          <article class="media">
            <figure>
              <!-- Bind results using a `:` -->
              <!-- Use a `v-if`/`else` if their is a `featured_image` -->
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

Voici à quoi cela ressemblera (notez que nous avons ajouté du CSS à partir de https://bulma.io/ pour un style rapide):

![buttercms-bloglist](https://user-images.githubusercontent.com/160873/36868500-1b22e374-1d5e-11e8-82a0-20c8dc312716.png)

Maintenant créons le composant `components/BlogPost.vue` qui sera notre page pour afficher un article.

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

Voici un aperçu:

![buttercms-blogdetail](https://user-images.githubusercontent.com/160873/36868506-218c86b6-1d5e-11e8-8691-0409d91366d6.png)

Maintenant notre application récupère tous les articles et nous pouvons afficher chaque post individuellement. Cependant, les boutons article suivant/précédent ne fonctionnent pas.

Une chose à noter lorsque l'on utilise les routes avec des paramètres, c'est que quand l'utilisateur navigue de `blog/foo` à `blog/bar`, la même instance du composant va être utilisée. Comme chaque route correspond au même composant, c'est plus efficace que de détruire l'instance et d'en recréer une.

<p class="tip">Soyez conscient qu'utiliser un composant de cette manière signifie que les connecteurs du cycle de vie du composant ne seront pas appelés. Consultez la documentation de Vue Router pour en apprendre plus sur la [recherche de route dynamique](https://router.vuejs.org/en/essentials/dynamic-matching.html)</p>

Pour palier à  cela nous devons surveiller l'objet `$route` et appeler `getPost()` quand la route change.

Section `<script>` mise à jour dans `components/BlogPost.vue`:

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

Maintenant, votre application possède un blog fonctionnel qui peut être mis à jour facilement dans le panneau d'administration de ButterCMS.

## Catégories, mots-clés et auteurs

Utilisez les interfaces de programmation dédiées aux catégories, aux mots-clés et aux auteurs pour mettre en valeur et filtrer le contenu de votre blog.

Consultez la référence des interfaces de programmation de ButterCMS pour plus d'information sur ces objets:

 * [Catégories](https://buttercms.com/docs/api/?ruby#categories)
* [Mots-clés](https://buttercms.com/docs/api/?ruby#tags)
* [Auteurs](https://buttercms.com/docs/api/?ruby#authors)

Voici un exemple dans lequel on liste toutes les catégories et où l'on récupère tous les articles par catégorie. Appelez ces méthodes sur le connecteur `created()` du cycle de vie du composant:

```javascript
methods: {
  // ...
  getCategories() {
    butter.category.list()
      .then(res => {
        console.log('List of Categories:')
        console.log(res.data.data)
      })
  },
  getPostsByCategory() {
    butter.category.retrieve('example-category', {
        include: 'recent_posts'
      })
      .then(res => {
        console.log('Posts with specific category:')
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

## Pattern alternatif

Une alternative à considérer, surtout si vous préférez écrire seulement en Markdown, est d'utiliser par exemple [Nuxtent](https://nuxtent.now.sh/guide/writing#async-components). Nuxtent vous permet d'utiliser un composant Vue à l'intérieur de fichiers Markdown. Cette approche pourrait être apparentée à celle utilisée par les sites statiques (c'est-à-dire Jekyll) dans laquelle vous écrivez les articles dans des fichiers Markdown. Nuxtent permet une bonne intégration entre Vue.js et Markdown vous permettant de vivre dans un monde à 100% Vue.js.

## Conclusion

Et voilà ! Maintenant vous avez un blog basé sur un CMS totalement fonctionnel qui s'exécute dans votre application. Nous espérons que ce tutoriel vous a été utile et a rendu votre expérience du développement avec Vue.js encore plus appréciable.
