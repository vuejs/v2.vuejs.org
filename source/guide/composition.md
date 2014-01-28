title: Composing ViewModels
type: guide
order: 10
---

# {{title}}

## Registering a Component

Vue.js allows you to treat registered ViewModel constructors as reusable components. To register a component, use the global `Vue.component()` method:

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

If you prefer, all registered components can also be used in the form of a custom element tag:

``` html
<my-component></my-component>
```

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
    transitions: {
        // ...
    },
    partials: {
        // ...
    }
})
```

## Inheriting Data

A child component can inherit Objects in its parent's data by combining `v-component` with `v-with`. For Arrays you can combine `v-component` with `v-repeat`.

``` js
Vue.component('user-profile', {
    template: '{&#123;name&#125;}<br>{&#123;email&#125;}'
})
var parent = new Vue({
    el: '#demo',
    data: {
        user: {
            name: 'Foo Bar',
            email: 'foo@bar.com'
        },
        users: [
            {
                name: 'Chuck Norris',
                email: 'chuck@norris.com'
            },
            {
                name: 'Bruce Lee',
                email: 'burce@lee.com'
            }
        ]
    }
})
```

``` html
<div id="demo">
    <p v-with="user" v-component="user-profile"></p>
    <ul>
        <li v-repeat="users" v-component="user-profile"></li>
    </ul>
</div>
```

**Result:**

<div id="demo"><p v-with="user" v-component="user-profile"></p><ul><li v-repeat="users" v-component="user-profile"></li></ul></div>
<script src="/js/vue.min.js"></script>
<script>
    Vue.component('user-profile', {
        template: '{&#123;name&#125;}<br>{&#123;email&#125;}'
    })
    var parent = new Vue({
        el: '#demo',
        data: {
            user: {
                name: 'Foo Bar',
                email: 'foo@bar.com'
            },
            users: [
                {
                    name: 'Chuck Norris',
                    email: 'chuck@norris.com'
                },
                {
                    name: 'Bruce Lee',
                    email: 'burce@lee.com'
                }
            ]
        }
    })
</script>

Next: [App Architecture](/guide/architecture.html).