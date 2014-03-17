title: Composing Components
type: guide
order: 10
---

## Registering a Component

Vue.js allows you to treat registered ViewModel constructors as reusable components that is conceptually similar to [Web Components](http://www.w3.org/TR/components-intro/), without requiring any polyfills. To register a component, use the global `Vue.component()` method:

``` js
var MyComponent = Vue.extend({
    template: 'A custom component!'
})
Vue.component('my-component', MyComponent)
```

To make things easier, you can also directly pass in the option object instead of an actual constructor:

``` js
Vue.component('my-component', {
    template: 'A custom component!'
})
```

Then you can use it in a parent ViewModel's template:

``` html
<div v-component="my-component"></div>
```

If you prefer, components can also be used in the form of a custom element tag:

``` html
<my-component></my-component>
```

<p class="tip">To avoid naming collisions with native elements and stay consistent with the W3C Custom Elements specification, the component's ID **must** contain a hyphen `-` to be usable as a custom tag.</p>

It is important to understand the difference between `Vue.extend()` and `Vue.component()`. Since `Vue` itself is a constructor, `Vue.extend()` is a **class inheritance method**. Its task is to create a sub-class of `Vue` and return the constructor. `Vue.component()`, on the other hand, is an **asset registration method** similar to `Vue.directive()` and `Vue.filter()`. Its task is to associate a given constructor with a string ID so Vue.js can pick it up in templates. When directly passing in options to `Vue.component()`, it calls `Vue.extend()` under the hood.

Vue.js supports two different API paradigms: the class-based, imperative, Backbone style API, and the markup-based, declarative, Web Components style API. If you are confused, think about how you can create an image element with `new Image()`, or with an `<img>` tag. Both are useful in its own right and Vue.js tries to provide both for maximum flexibility.

## Partials and {&#123;>yield&#125;}

You can use partials in templates with {&#123;>partial-id&#125;}, which inserts the partial registered via `Vue.partial('partial-id', '...')`. But there is a special reserved partial ID: `yield`. Basically, the `yield` partial inside a template serves as a insertion point for the original, pre-compile content inside the element. This syntax allows components to be easily nested and composed while maintaining their custom markup. For example:

Top level markup:

``` html
<div v-component="my-component">
    <p>original content</p>
</div>
```

Template for `my-component`:

``` html
<div class="wrapper">
    <h1>This is my component!</h1>
    {&#123;> yield&#125;}
</div>
```

When the component element is compiled, its content will be replaced with the component's template, but the original content will be preserved and inserted into the `yield` position. If no `yield` outlet is found in the template, the original content will be wiped away.

<p class="tip">If needed, you can get access to the original content DocumentFragment in the component's `created` hook as a `this.$compiler.rawContent`.</p>

## Encapsulating Private Assets

Sometimes a component needs to use assets such as directives, filters and its own child components, but might want to keep these assets encapsulated so the component itself can be reused elsewhere. You can do that using the private assets instantiation options. Private assets will only be accessible by the instances of the owner component and its child components.

``` js
// All 5 types of assets
var MyComponent = Vue.extend({
    directives: {
        // id : definition pairs same with the global methods
        'private-directive': function () {
            // ...
        }
    },
    filters: {
        // ...
    },
    components: {
        // ...
    },
    partials: {
        // ...
    },
    effects: {
        // ...
    }
})
```

Alternatively, you can add private assets to an existing Component constructor using a chaining API similar to the global asset registeration methods:

``` js
MyComponent
    .directive('...', {})
    .filter('...', function () {})
    .component('...', {})
    // ...
```

## Data Inheritance

### Inheriting Objects from Parent as `$data`

A child component can inherit data from its parent's data by combining `v-component` with `v-with`. When given a single keypath without an argument, the child Component will use that value as its `$data` (hence that value must be an Object):

``` html
<div id="demo-1">
    <p v-component="user-profile" v-with="user"></p>
</div>
```

``` js
// registering the component first
Vue.component('user-profile', {
    template: '{&#123;name&#125;}<br>{&#123;email&#125;}'
})
// the `user` object will be passed to the child
// component as its $data
var parent = new Vue({
    el: '#demo-1',
    data: {
        user: {
            name: 'Foo Bar',
            email: 'foo@bar.com'
        }
    }
})
```

**Result:**

<div id="demo-1" class="demo"><p v-component="user-profile" v-with="user"></p></div>
<script>
    Vue.component('user-profile', {
        template: '{&#123;name&#125;}<br>{&#123;email&#125;}'
    })
    var parent = new Vue({
        el: '#demo-1',
        data: {
            user: {
                name: 'Foo Bar',
                email: 'foo@bar.com'
            }
        }
    })
</script>

### Inheriting Properties with `v-with`

When `v-with` is given an argument, it will create a property on the child Component's `$data` using the argument as the key. That property will be kept in sync with the bound value on the parent:

``` html
<div id="parent">
    <p>{&#123;parentMsg&#125;}</p>
    <p v-component="child" v-with="childMsg : parentMsg">
        <!-- essentially means "bind `parentMsg` on me as `childMsg`" -->
    </p>
</div>
```

``` js
new Vue({
    el: '#parent',
    data: {
        parentMsg: 'Shared message'
    },
    components: {
        child: {
            template: '<input v-model="childMsg">'
        }
    }
})
```

**Result:**

<div id="parent" class="demo"><p>{&#123;parentMsg&#125;}</p><p v-component="child" v-with="childMsg : parentMsg"></p></div>
<script>
new Vue({
    el: '#parent',
    data: {
        parentMsg: 'Shared message'
    },
    components: {
        child: {
            template: '<input v-model="childMsg">'
        }
    }
})
</script>

### Using `v-component` with `v-repeat`

For an Array of Objects, you can combine `v-component` with `v-repeat`. In this case, for each Object in the Array, a child ViewModel will be created using that Object as data, and the specified component as the constructor.

``` html
<ul id="demo-2">
    <!-- reusing the user-profile component we registered before -->
    <li v-repeat="users" v-component="user-profile"></li>
</ul>
```

``` js
var parent2 = new Vue({
    el: '#demo-2',
    data: {
        users: [
            {
                name: 'Chuck Norris',
                email: 'chuck@norris.com'
            },
            {
                name: 'Bruce Lee',
                email: 'bruce@lee.com'
            }
        ]
    }
})
```

**Result:**

<ul id="demo-2" class="demo"><li v-repeat="users" v-component="user-profile"></li></ul>
<script>
var parent2 = new Vue({
    el: '#demo-2',
    data: {
        users: [
            {
                name: 'Chuck Norris',
                email: 'chuck@norris.com'
            },
            {
                name: 'Bruce Lee',
                email: 'bruce@lee.com'
            }
        ]
    }
})
</script>

## Accessing Child Components

Sometimes you might need to access nested child components in JavaScript. To enable that you have to assign a reference ID to the child component using `v-ref`. For example:

``` html
<div id="parent">
    <div v-component="user-profile" v-ref="profile"></div>
</div>
```

``` js
var parent = new Vue({ el: '#parent' })
// access child component
var child = parent.$.profile
```

When `v-ref` is used together with `v-repeat`, the value you get will be an Array containing the child components mirroring the data Array.

## Event Communication Between Nested Components

Although you can directly access a ViewModels children and parent, it is more convenient to use the built-in event system for cross-component communication. It also makes your code less coupled and easier to maintain. Once a parent-child relationship is established, you can dispatch and trigger events using each ViewModel's [event instance methods](/api/instance-methods.html#cross-viewmodel-events).

``` js
var Child = Vue.extend({
    created: function () {
        this.$dispatch('child-created', this)
    }
})

var parent = new Vue({
    template: '<div v-component="child"></div>',
    components: {
        child: Child
    },
    created: function () {
        this.$on('child-created', function (child) {
            console.log('new child created: ')
            console.log(child)
        })
    }
})
```

<script>
var Child = Vue.extend({
    created: function () {
        this.$dispatch('child-created', this)
    }
})

var parent = new Vue({
    template: '<div v-component="child"></div>',
    components: {
        child: Child
    },
    created: function () {
        this.$on('child-created', function (child) {
            console.log('new child created: ')
            console.log(child)
        })
    }
})
</script>

Next: [Building Larger Apps](/guide/application.html).
