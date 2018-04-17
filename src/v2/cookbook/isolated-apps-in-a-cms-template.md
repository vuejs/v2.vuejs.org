
---
title: Isolated Apps in a CMS Template
type: cookbook
order: 10
---
## Base Example

Creating complex JavaScript-driven Content Management System (CMS) template modules often presents various challenges when using JavaScript without a user interface (UI) framework. Typically, these type of modules need to be rendered in HTML by the CMS, with authored content and configuration options affecting the rendered HTML. Complex JavaScript driven modules need to be able to scan the rendered HTML and store the authored content and configuration options in JavaScript directly. This often proves to be challenging without a UI framework as these types of modules require regular updating of the DOM which is expensive and difficult to achieve with minimal defects.

Vue is easy to pick up and integrate with existing projects, making it simple to incrementally adopt across different modules in CMS templates to handle complex UI functionality. Vue is great at dynamically rendering HTML, making use of its [virtual DOM](https://medium.com/js-dojo/whats-new-in-vue-js-2-0-virtual-dom-dc4b5b827f40) to perform relatively cheap DOM updates. It is also great at rendering conditional HTML based on configurable options defined in HTML.

Let's have a look at an example of Vue being leveraged to dynamically render a simple user profile module:

`profile.html`
``` html
<div id="profile" data-user-name="John Doe"></div>

<script src="index.js"></script>
```
`index.js`
``` javascript
import Vue from 'vue';
import Profile from './Profile.vue';

const el = document.querySelector('#profile');

if (el) {
  new Vue({
    el,
    render: h => h(Profile, { props: el.dataset })
  });
}
```
`Profile.vue`
``` html
<template>
  <div class="profile">
    {{ userName }}
  </div>
</template>

<script>
  export default {
    props: ['userName']
  }
</script>
```

This example creates an empty `<div>` for the profile module with configurable options derived from the CMS able to be passed to the module via `data-*` attributes on the `<div>`. For example, the user name can be defined in the `data-user-name` attribute. Vue is then initialised for this module and converts the `data-*` attributes into props for the `Profile` Vue app, which can then dynamically render the profile module.

## Details about the Value

This method of using Vue does not adopt the Single Page Application (SPA) approach to using Vue, it adopts the mindset that Vue can be dropped into specific areas of an existing HTML build project to enhance functionality.

> Why does a CMS need to pass configurable options to a client module?

The purpose of a CMS is to enable a user to manage content. This means that a content author can change the value of some option and have that value reflected in the site's presentation layer. This can range from configuring modules to be shown on a page to configuring a label of a specific module, for example.

A CMS template therefore needs to be able to derive a configuration option from a data store and render it in HTML. If this configuration option is specific to a module, the CMS template need to be able to tell the module's JavaScript the value of the configuration option.

> Why should we use `data-*` attributes?

To enable a CMS template to tell a module's JavaScript the value of a configuration option, we need to render the value in HTML and let JavaScript scan the module's HTML and pickup that value. A great way to do this is to pass configuration options via a module's `data-*` attributes as we can easily access these values in JavaScript through a [HTML element's `.dataset` property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) which converts an element's `data-*` attributes to a JavaScript object.

> Can I populate content within the module's `<div>`?

This approach assumes that all DOM rendering for a module will be executed dynamically by Vue. This is a good approach as it ensures a separation of concerns between the module's JavaScript and HTML; the HTML feeds configuration options to the JavaScript which then renders the module dynamically based on these options. When Vue is initialised, it will replace the `el` passed into the `new Vue` instance with the Vue template. Therefore, any content within the initial element will be removed and replaced with the Vue template.

If there is content that you would like to render within the module, the best practice is to pass in any configuration options via the module's `data-*` attributes and render the content in the Vue template, with any options rendered via interpolations.

> Won't the module be blank before the JavaScript initialises?

Yes, it will be. It definitely is not the best experience for a user to see a blank part of the screen initially and then suddenly see the module once it is initialised in Vue. A good way to provide a better user experience is to have some sort of temporary state indicator present on page load that will be removed once the Vue app is initialised. A simple example of this can be achieved in HTML and CSS:

`profile.html`
``` html
<div id="profile" data-user-name="John Doe"></div>
```
`profile.css`
``` css
#vue_profile {
  background-image: url(http://samherbert.net/svg-loaders/svg-loaders/oval.svg);
}
```
This CSS will cause the module to show a loader before Vue is initialised. This will ensure that on page load the module will not be an empty element that will abruptly change once Vue is initialised.

## Real-World Example

In practice, there can be several requirements we have to cater for when implementing Vue in a CMS template:

 - Handling multiple instances of a module on a template
 - Providing several module configuration options
 - Handling interactivity of a module

To demonstrate how we can cater to these requirements, let's have a look at building a simple data table that lists Star Wars films. The requirements for this module are:

 1. The table needs to list, at most, a film’s title, episode number, director, and release date.
 2. The user should be able to search by film title.
 3. A content author can set any column to be hidden.
 4. A content author can toggle whether a user can search.
 5. A content author can set a default search criteria to show a subset of films.

For this example we're going to use [SWAPI](https://swapi.co/) to fetch the Star Wars films via AJAX calls. To find out more about how we're going to make API calls, you can read the [Using Axios to Consume APIs](https://vuejs.org/v2/cookbook/using-axios-to-consume-apis.html) recipe.

### Scaffolding the HTML

The first step is to set up our HTML with our configuration options so we can understand how a content author should be able to configure our module.

To provide configuration options, we can either opt for multiple `data-*` attributes, or we can parse JSON in a single `data-*` attribute. Parsing JSON may be more robust as it is easy for the JavaScript to consume and it is future proof in that it can accomodate any changes to the configuration options schema.

``` html
<div
  class='js-films'
  data-config='{
    "hiddenAttributes": [],
    "showSearch": true,
    "defaultSearch": null
  }'
></div>
```

Here we've set up two attributes on our module's element:

 - `class="js-films"`: Used as the element selector that will instantiate the Vue app.
 - `data-config="..."`: A JSON object that contains all of the content author configuration options
   for this module.
   - `hiddenAttributes`: An array that can be populated with string(s) of the attributes that the content author has chosen to omit from the table.
   - `showSearch`: A boolean that indicates whether the search field should be shown or hidden.
   - `defaultSearch`: An optional string that acts as the default search term on the initial API request.

### Bootstrapping the component

Now that we have a clear definition of what the markup will look like on page render, we can construct the bootstrapping logic to instantiate a Vue app for instances of our module.

``` javascript
import Vue from 'vue';
import FilmsContainer from './FilmsContainer.vue';

const getProps = data => {
  let props = {};
  
  if (data.config) {
    props = JSON.parse(data.config);
  }
  
  return props;
};


const filmElements = document.querySelectorAll('.js-films');

filmElements.forEach(el => {
  new Vue({
    el,
    render: h => h(FilmsContainer, { props: getProps(el.dataset) })
  });
});
```
This is a pretty simple bootstrapper, but it's all we really need thanks to our props being passed from the CMS via JSON in the `data-config` attribute.

Let's break down the boostrapping logic:

 - We select all instances of the module in the DOM via `document.querySelectorAll` to allow for one or more isolated instances of the module rendered by the CMS.
 - For each instance we create a new Vue app. This ensures that each instance is completely decoupled from other instances.
 - We pass a render function to the Vue app which renders our `FilmsContainer` and passes `props` to it.
 - To get the instance's props, we call out `getProps` function and pass it the module instance's element `data-*` attributes via `dataset`.
 - Our `getProps` function takes the `dataset` object as a parameter and will check if the element has a `data-config` attribute. If it does, it'll parse the JSON via `JSON.parse` and that is all it needs to convert the JSON string into a JavaScript object. If the element doesn't have a `data-config` attribute, the function will return an empty object. We use this function as opposed to simply passing `JSON.parse(el.dataset.config)` to the `props` of the container to ensure that if the `data-config` attribute is omitted, nothing will go wrong in the front end.

### What are container components?

Before we dive into developing the Vue component, you might have noticed we used the file name `FilmsContainer` for our component. This is simply an opinionated standard choice inspired by the different types of components; Presentational and Container components. This [article](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) written primarily for React introduces these concepts and proposes a neat way of structuring components in a Javascript application.

TL;DR

 - Presentational components: Components that are concerned with _how things look_. They are written as functional components as they have no dependencies on the rest of the app and usually don't have their own state.
 - Container components: Components that are concerned with _how things work_. They have an understanding of their context within the app and thus have dependencies on the rest of the app and are stateful.

For our example, we treat container components as the first level component that is rendered by the Vue app instance. So whatever component is passed into the Vue app's `render` function is our container component. However, we need to keep these concepts in mind when architecting our modules as a container component can be rendered by another container component.

### Constructing our component

To construct the component, let's break down our requirements so we can plan how to structure the component.

Requirements:
 1. The table needs to list, at most, a film’s title, episode number, director, and release date.
 2. The user should be able to search by film title.
 3. A content author can set any column to be hidden.
 4. A content author can toggle whether a user can search.
 5. A content author can set a default search criteria to show a subset of films.

So, based on these requirements, we need to think about a few things

 1. How do we render our table, and how do we conditionally render different columns?
 2. How do we conditionally render a search field?
 3. How do we interface with our API, including passing a search term on a request?

#### Basic template

First, let's scaffold the basic template without any interactivity.

``` html
<template>
  <div class="films-container">
    <form>
      <input type="text" name="search" placeholder="Search for a film" v-model="search">
      <button type="submit" name="submit">Search</button>
    </form>
    <table>
      <thead>
        <tr>
          <th v-for="(column, i) in columns" :key="i">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(film, i) in films" :key="i">
          <td>{{ film.title }}</td>
          <td>{{ film.episode_id }}</td>
          <td>{{ film.director }}</td>
          <td>{{ film.release_date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        search: this.defaultSearch,
        columns: ['Title', 'Episode #', 'Director', 'Release Date'],
        films: []
      };
    },
    props: {
      hiddenAttributes: {
        type: Array,
        default: []
      },
      showSearch: {
        type: Boolean,
        default: true
      },
      defaultSearch: {
        type: String,
        default: null
      }
    }
  }
</script>
```

Our basic template already does a lot, failing interfacing with the API and supporting some of our requirements that deal with conditional functionality.

 - The template has a root `<div>` with the class `films-container`. For the purposes of keeping this example as simple as possible, we will not be including any CSS, however, we would use this class as the root for this component when applying styles.
 - We have a `form` with a single text input and a submit button. The text input has a `v-model` that binds it to the `search` property returned as part of the component's `data`. For more information on `v-model` please see the Vue [documentation](https://vuejs.org/v2/guide/forms.html#ad).
 - We have a `table` that loops through the `columns` returned as part of the component's `data` and renders the column headings. It also loops through the `films` and renders the film rows. We have chosen to render the template from data stored in JavaScript. This is better practice than simply hard coding each table column in the `<template>` as we can easily manipulate the JavaScript data and let the template render what we define, rather than embedding too much logic in the template.

#### Interfacing with the API

Having a look at the [SWAPI](https://swapi.co/) API specification, we can see that we need to use the `https://swapi.co/api/films/` endpoint. Looking at the [documentation](https://swapi.co/documentation#films) for this resource, we can see that the resource schema includes the attributes `title`, `episode_id`, `director`, and `release_date`. Looking at the API [documentation](https://swapi.co/documentation#search), we can see that we can pass a `search` parameter that will filter results returned from the API.

Based on this information, we can construct our API interfacing functionality.

``` html
<template>
  <div class="films-container">
    <form @submit.prevent="syncFilms">
      <input type="text" name="search" placeholder="Search for a film" v-model="search">
      <button type="submit" name="submit">Search</button>
    </form>
    <div v-if="isSyncing"><img src="http://samherbert.net/svg-loaders/svg-loaders/oval.svg" /></div>
    <div v-else-if="showError">I sense a disturbance in the API.</div>
    <div v-else-if="showNoResults">If it's not in the archives, it doesn't exist!</div>
    <table v-else>
      <thead>
        <tr>
          <th v-for="(column, i) in columns" :key="i">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(film, i) in films" :key="i">
          <td>{{ film.title }}</td>
          <td>{{ film.episode_id }}</td>
          <td>{{ film.director }}</td>
          <td>{{ film.release_date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        search: this.defaultSearch,
        columns: ['Title', 'Episode #', 'Director', 'Release Date'],
        films: [],
        
        isSyncing: false,
        syncError: null
      };
    },
    computed: {
      params() {
        return {
          search: this.search
        };
      },
      showError() {
        return !!(!this.isSyncing && this.syncError);
      },
      showNoResults() {
        return !this.isSyncing && !this.syncError && this.films.length === 0;
      }
    },
    watch: {
      films() {
        this.isSyncing = false;
      },
      syncError() {
        this.isSyncing = false;
      }
    },
    methods: {
      syncFilms() {
        this.isSyncing = true;
        
        return axios.get('https://swapi.co/api/films/', {
          params: this.params
        })
        .then(response => {
          this.films = response.data.results;
        })
        .catch(error => {
          this.syncError = error;
        });
      }
    },
    mounted() {
      this.syncFilms();
    },
    props: {
      hiddenAttributes: {
        type: Array,
        default: []
      },
      showSearch: {
        type: Boolean,
        default: true
      },
      defaultSearch: {
        type: String,
        default: null
      }
    }
  }
</script>
```
Now this looks better! There's a bit to talk about for this one, so let's run through how we're getting results from the API.

 - When the component is mounted, we call the `syncFilms` method to get the initial films to render.
 - The `syncFilms` method is responsible for calling the API. We use [Axios](https://github.com/axios/axios) to call the API and pass in `params`.
 - `params` is a computed property that returns an object with one a `search` key that is the value of the `search` `data` property.
 - The `syncFilms` method returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that has a success and fail path (`.then` and `.catch`, respectively). Before it calls the API, the method sets the component's `isSyncing` property to `true`. This is a flag that is used to indicate that we've sent an API request and we're waiting for a response.
   - The `syncFilms` success path sets the component's `films` array to the `results` of the API response. To get a better understanding of the API response, take a look at an [example response](https://swapi.co/api/films/) and note that it has a `results` key which is an array of the results returned from the resource.
   - The `syncFilms` fail path sets the component's `syncError` property to the error the API returns.
   - We have registered two watchers on this component, one for `films` and another for `syncError`. If either of these values change, it means we are no longer waiting for the API to respond, and therefore `isSyncing` should be set to `false`.
 - The template has been updated to include a few more `<div>`s for the different states of an API call. We have a `<div>` for the loading state, followed by a `<div>` for the error state, followed by a `<div>` for the no results state (when the API returns 0 results), followed by the `table` that renders the results. We've used the `v-if`, `v-else-if`, and `v-else` directives to conditionally render only _one_ of these elements based on the state of the API call. In addition to this we've added two computed properties. `showError` checks if we should show the error element by checking that the API is not syncing and that a `syncError` exists. `showNoResults` checks if the API is not syncing, no `syncError` exists and that the films returned from the API is an empty array.
 - On the `<form>` we have an event callback for `@submit` with the `.prevent` modifier to ensure that `event.preventDefault` is invoked when the callback is invoked. This is to ensure the form doesn't actually submit. The callback is registered as the `syncFilms` method. As the `v-model="search"` attribute on the `input` updates the value of `search`, when the user submits the form, we can derive the search value from the `params` computed property as it will be up to date with the search value the user has entered. We should try to avoid passing the same value around to different methods and instead try to use derived values (eg. computed properties) wherever we can.

#### Conditional search and columns

The next step is to conditionally show the search form and the columns.

``` html
<template>
  <div class="films-container">
    <form v-if="showSearch" @submit.prevent="syncFilms">
      <input type="text" name="search" placeholder="Search for a film" v-model="search">
      <button type="submit" name="submit">Search</button>
    </form>
    <div v-if="isSyncing"><img src="http://samherbert.net/svg-loaders/svg-loaders/oval.svg" /></div>
    <div v-else-if="showError">I sense a disturbance in the API.</div>
    <div v-else-if="showNoResults">If it's not in the archives, it doesn't exist!</div>
    <table v-else>
      <thead>
        <tr>
          <th v-for="(column, i) in columns" :key="i">{{ column.heading }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(film, i) in films" :key="i">
          <td v-for="(column, i) in columns" :key="i">{{ film[column.id] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      const defaultColumns = [{
        id: 'title',
        heading: 'Title'
      }, {
        id: 'episode_id',
        heading: 'Episode #'
      }, {
        id: 'director',
        heading: 'Director'
      }, {
        id: 'release_date',
        heading: 'Release Date'
      }];
      
      const columns = defaultColumns.filter(column => {
        return !this.hiddenAttributes.find(attribute => column.id === attribute);
      });
      
      return {
        search: this.defaultSearch,
        columns,
        films: [],
        
        isSyncing: false,
        syncError: null
      };
    },
    computed: {
      params() {
        return {
          search: this.search
        };
      },
      showError() {
        return !!(!this.isSyncing && this.syncError);
      },
      showNoResults() {
        return !this.isSyncing && !this.syncError && this.films.length === 0;
      }
    },
    watch: {
      films() {
        this.isSyncing = false;
      },
      syncError() {
        this.isSyncing = false;
      }
    },
    methods: {
      syncFilms() {
        this.isSyncing = true;
        
        return axios.get('https://swapi.co/api/films/', {
          params: this.params
        })
        .then(response => {
          this.films = response.data.results;
        })
        .catch(error => {
          this.syncError = error;
        });
      }
    },
    mounted() {
      this.syncFilms();
    },
    props: {
      hiddenAttributes: {
        type: Array,
        default: []
      },
      showSearch: {
        type: Boolean,
        default: true
      },
      defaultSearch: {
        type: String,
        default: null
      }
    }
  }
</script>
```

Adding a bit of conditional logic to our component makes it much more configurable. Let's discuss what we did to our component.

 - Our form now has a `v-if` directive that ensures it will only show if the `showSearch` property is `true`. If a content author sets `showSearch` to `false`, it will not show.
 - In our `data` method, we set the `defaultColumns` constant to an array of all of the columns that can be shown. Each array element is an object with an `id` and a `heading`. The `id` maps to the attribute the API responds with, so that we can access these attributes on each resource (eg. `film.release_date`). We then set the `columns` constant to a filtered `defaultColumns` array. The filter checks if any of the column `id`s exist in the `hiddenAttributes` property, and if a column does exist, it excludes it from the component's `columns` property.
 - In our `<template>` `<tbody>` we now render each film's columns conditionally (as opposed to being hard coded like before). For each film we loop through the `columns` property and render a `<td>` for each of the columns. This means that if we excluded the `director` column, for instance, it will not be rendered in our template for each film.
 

<p class="tip">Our component sets the `search` property to the `defaultSearch` by default. `defaultSearch` will either be `null` or a string value defined by the CMS. The `data` method on the component is invoked _after_ the properties are passed through, so this means that if the CMS defines a `defaultSearch` to 'A New Hope', the initial API request will pass this value as the search parameter by default. This means a content author can filter the results to show and set `showSearch` to `false`, allowing them to render a pre-defined list of results with no user interactivity.</p>

### Result

And that's it! We have our entire component structure, from DOM to Vue. Here's a reference of the final code.

`films.html`
``` html
<div
  class='js-films'
  data-config='{
    "hiddenAttributes": [],
    "showSearch": true,
    "defaultSearch": null
  }'
></div>
```

`index.js`
``` javascript
import Vue from 'vue';
import FilmsContainer from './FilmsContainer.vue';

const getProps = data => {
  let props = {};
  
  if (data.config) {
    props = JSON.parse(data.config);
  }
  
  return props;
};


const filmElements = document.querySelectorAll('.js-films');

filmElements.forEach(el => {
  new Vue({
    el,
    render: h => h(FilmsContainer, { props: getProps(el.dataset) })
  });
});
```

`FilmsContainer.vue`
``` html
<template>
  <div class="films-container">
    <form v-if="showSearch" @submit.prevent="syncFilms">
      <input type="text" name="search" placeholder="Search for a film" v-model="search">
      <button type="submit" name="submit">Search</button>
    </form>
    <div v-if="isSyncing"><img src="http://samherbert.net/svg-loaders/svg-loaders/oval.svg" /></div>
    <div v-else-if="showError">I sense a disturbance in the API.</div>
    <div v-else-if="showNoResults">If it's not in the archives, it doesn't exist!</div>
    <table v-else>
      <thead>
        <tr>
          <th v-for="(column, i) in columns" :key="i">{{ column.heading }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(film, i) in films" :key="i">
          <td v-for="(column, i) in columns" :key="i">{{ film[column.id] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      const defaultColumns = [{
        id: 'title',
        heading: 'Title'
      }, {
        id: 'episode_id',
        heading: 'Episode #'
      }, {
        id: 'director',
        heading: 'Director'
      }, {
        id: 'release_date',
        heading: 'Release Date'
      }];
      
      const columns = defaultColumns.filter(column => {
        return !this.hiddenAttributes.find(attribute => column.id === attribute);
      });
      
      return {
        search: this.defaultSearch,
        columns,
        films: [],
        
        isSyncing: false,
        syncError: null
      };
    },
    computed: {
      params() {
        return {
          search: this.search
        };
      },
      showError() {
        return !!(!this.isSyncing && this.syncError);
      },
      showNoResults() {
        return !this.isSyncing && !this.syncError && this.films.length === 0;
      }
    },
    watch: {
      films() {
        this.isSyncing = false;
      },
      syncError() {
        this.isSyncing = false;
      }
    },
    methods: {
      syncFilms() {
        this.isSyncing = true;
        
        return axios.get('https://swapi.co/api/films/', {
          params: this.params
        })
        .then(response => {
          this.films = response.data.results;
        })
        .catch(error => {
          this.syncError = error;
        });
      }
    },
    mounted() {
      this.syncFilms();
    },
    props: {
      hiddenAttributes: {
        type: Array,
        default: []
      },
      showSearch: {
        type: Boolean,
        default: true
      },
      defaultSearch: {
        type: String,
        default: null
      }
    }
  }
</script>
```

### Example configurations

Let's see an example of each type of configuration and make sure that we've met all of the requirements.

#### 1. The table needs to list, at most, a film’s title, episode number, director, and release date.

This is satisfied out of the box in `FilmsContainer.vue`

Example configuration:
``` html
<div
  class='js-films'
  data-config='{
    "hiddenAttributes": [],
    "showSearch": true,
    "defaultSearch": null
  }'
></div>
```

#### 2. The user should be able to search by film title.

This is satisfied only if `showSearch` is `true`.

Example configuration:
``` html
<div
  class='js-films'
  data-config='{
    "hiddenAttributes": [],
    "showSearch": true,
    "defaultSearch": null
  }'
></div>
```

#### 3. A content author can set any column to be hidden.

This is satisfied if column `id`s are passed into `hiddenAttributes`.

Example configuration:
``` html
<div
  class='js-films'
  data-config='{
    "hiddenAttributes": ["director", "release_date"],
    "showSearch": true,
    "defaultSearch": null
  }'
></div>
```

#### 4. A content author can toggle whether a user can search.

This is satisfied if a value is passed into `showSearch`.

Example configuration:
``` html
<div
  class='js-films'
  data-config='{
    "hiddenAttributes": [],
    "showSearch": false,
    "defaultSearch": null
  }'
></div>
```

#### 5. A content author can set a default search criteria to show a subset of films.

This is satisfied if a value is passed into `defaultSearch`. Optionally, we can also hide the search by passing `false` into `showSearch`.

Example configuration:
``` html
<div
  class='js-films'
  data-config='{
    "hiddenAttributes": [],
    "showSearch": false,
    "defaultSearch": "A New Hope"
  }'
></div>
```


## Alternative Patterns

### DOM Vue templates

If a `<template>` is not defined for a Vue app, it will use the element's markup as the template. Because of this, it is possible to provide a Vue template in plain HTML that is rendered by the CMS. This can provide additional flexibility for a CMS rendered template, such as making use of slots. Let's see an example.


`profile.html`
``` html
<div id="profile">
  <Profile>
    <template slot>
      <b>John Doe</b>
    </template>
  </Profile>
</div>

<script src="index.js"></script>
```
`index.js`
``` javascript
import Vue from 'vue';
import Profile from './Profile.vue';

const el = document.querySelector('#profile');

if (el) {
  new Vue({
    el,
    components: {
      Profile
    }
  });
}
```
`Profile.vue`
``` html
<template>
  <div class="profile">
    <slot></slot>
  </div>
</template>

<script>
  export default {}
</script>
```

In this example, the HTML renders the Vue template with the `Profile` component. It also makes use of a `slot` to render custom HTML. This is powerful for a CMS as it can render any HTML in the `slot` and Vue will render register it in the virtual DOM node tree.

The drawbacks of this approach is that this level of flexibility may not ensure a separation of concerns and could lead to side effects that we can't foresee in the front end. Another drawback is that this approach render invalid HTML markup and can thus impact the SEO performance of the website. A cleaner approach is to provide configuration options as JavaScript data types and handle the rendering of the template in JavaScript based on these options.

## Wrapping Up

Now that we've explored a simple example of a content manageable Vue component, we can expand on these fundamental concepts and create more complex components. Exploring features such as state management with Vuex, component dependencies, mixins for common component functionalities, presentational components, and reusable boostrapping frameworks will expand the amount of functionality the front end can support. The fundamental concepts of CMS configuration via DOM attributes, bootstrapping Vue instances from query selectors, and component rendering through props all remain at the core of this approach and act as a great demonstration of the versatility of Vue.