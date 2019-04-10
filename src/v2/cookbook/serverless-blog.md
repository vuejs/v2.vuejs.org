---
title: Create a CMS-Powered Blog
type: cookbook
order: 5
---

So you've just launched your Vue.js website, congrats! Now you want to add a blog that quickly plugs into your website and you don't want to have to spin up a whole server just to host a Wordpress instance (or any DB-powered CMS for that matter). You want to just be able to add a few Vue.js blog components and some routes and have it all just work, right? What you're looking for is a blog that's powered entirely by API's you can consume directly from your Vue.js application. This tutorial will teach you how to do just that, let's dive in!

We're going to quickly build a CMS-powered blog with Vue.js. It uses [ButterCMS](https://buttercms.com/), an API-first CMS that lets you manage content using the ButterCMS dashboard and integrate our content API into your Vue.js app. You can use ButterCMS for new or existing Vue.js projects.

![Butter Dashboard](https://user-images.githubusercontent.com/160873/36677285-648798e4-1ad3-11e8-9454-d22fca8280b7.png "Butter Dashboard")

## Install

Run this in your commandline:

```bash
npm install buttercms --save
```

Butter can also be loaded using a CDN:

```html
<script src="https://cdnjs.buttercms.com/buttercms-1.1.0.min.js"></script>
```

## Quickstart

Set your API token:

```javascript
var butter = require('buttercms')('your_api_token');
```

Using ES6:

```javascript
import Butter from 'buttercms';
const butter = Butter('your_api_token');
```

Using CDN:

```html
<script src="https://cdnjs.buttercms.com/buttercms-1.1.0.min.js"></script>
<script>
  var butter = Butter('your_api_token');
</script>
```

Import this file into any component you want to use ButterCMS. Then from the console run:

```javascript
butter.post.list({page: 1, page_size: 10}).then(function(response) {
  console.log(response)
})
```

This API request fetches your blog posts. Your account comes with one example post which you'll see in the response.

## Display posts

To display posts we create a `/blog` route (using Vue Router) in our app and fetch blog posts from the Butter API, as well as a `/blog/:slug` route to handle individual posts.

See the ButterCMS [API reference](https://buttercms.com/docs/api/?javascript#blog-posts) for additional options such as filtering by category or author. The response also includes some metadata we'll use for pagination.

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

Then create `components/BlogHome.vue` which will be your blog homepage that lists your most recent posts.

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
              <!-- Use a `v-if`/`else` if there is a `featured_image` -->
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

Here's what it looks like (note we added CSS from https://bulma.io/ for quick styling):

![buttercms-bloglist](https://user-images.githubusercontent.com/160873/36868500-1b22e374-1d5e-11e8-82a0-20c8dc312716.png)

Now create `components/BlogPost.vue` which will be your Blog Post page to list a single post.

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

Here's a preview:

![buttercms-blogdetail](https://user-images.githubusercontent.com/160873/36868506-218c86b6-1d5e-11e8-8691-0409d91366d6.png)

Now our app is pulling all blog posts and we can navigate to individual posts. However, our next/previous post buttons are not working.

One thing to note when using routes with params is that when the user navigates from `/blog/foo` to `/blog/bar`, the same component instance will be reused. Since both routes render the same component, this is more efficient than destroying the old instance and then creating a new one.

<p class="tip">Be aware, that using the component this way will mean that the lifecycle hooks of the component will not be called. Visit the Vue Router's docs to learn more about [Dynamic Route Matching](https://router.vuejs.org/en/essentials/dynamic-matching.html)</p>

To fix this we need to watch the `$route` object and call `getPost()` when the route changes.

Updated `<script>` section in `components/BlogPost.vue`:

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
      $route: {
        immediate: true,
        handler(to, from) {
          this.getPost()
        }
      }
    }
  }
</script>
```

Now your app has a working blog that can be updated easily in the ButterCMS dashboard.

## Categories, Tags, and Authors

Use Butter's APIs for categories, tags, and authors to feature and filter content on your blog.

See the ButterCMS API reference for more information about these objects:

* [Categories](https://buttercms.com/docs/api/?ruby#categories)
* [Tags](https://buttercms.com/docs/api/?ruby#tags)
* [Authors](https://buttercms.com/docs/api/?ruby#authors)

Here's an example of listing all categories and getting posts by category. Call these methods on the `created()` lifecycle hook:

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

## Alternative Patterns

An alternative pattern to consider, especially if you prefer writing only in Markdown, is using something like [Nuxtent](https://nuxtent-module.netlify.com/guide/writing/#async-components). Nuxtent allows you to use `Vue Component` inside of Markdown files. This approach would be akin to a static site approach (i.e. Jekyll) where you compose your blog posts in Markdown files. Nuxtent adds a nice integration between Vue.js and Markdown allowing you to live in a 100% Vue.js world.

## Wrap up

That's it! You now have a fully functional CMS-powered blog running in your app. We hope this tutorial was helpful and made your development experience with Vue.js even more enjoyable :)
