title: Tips & Best Practices
type: guide
order: 15
---

## Data Initialization

Vue's data observation model favors deterministic data models. It is recommended to initialize all the data properties that needs to be reactive upfront in the `data` option. For example, given the following template:

``` html
<div id="demo">
  <p v-class="green: validation.valid">{{message}}</p>
  <input v-model="message">
</div>
```

It's recommended to initialize your data like this instead of an empty object:

``` js
new Vue({
  el: '#demo',
  data: {
    message: '',
    validation: {
      valid: false
    }
  }
})
```

The reason for this is that Vue observes data changes by recursively walking the data object and convert existing properties into reactive getters and setters using `Object.defineProperty`. If a property is not present when the instance is created, Vue will not be able to track it.

You don't have to set every nested properties in your data though. It is ok to initialize a field as an empty object, and set it to a new object with nested structures later, because Vue will be able to walk the nested properties of this new object and observe them.

## Adding and Deleting Properties

As mentioned above, Vue observes data by converting properties with `Object.defineProperty`. However, in ECMAScript 5 there is no way to detect when a new property is added to an Object, or when a property is deleted from an Object. To deal with this constraint, observed Objects are augmented with three methods:

- `obj.$add(key, value)`
- `obj.$set(key, value)`
- `obj.$delete(key)`

These methods can be used to add / delete properties from observed objects while triggering the desired DOM updates. The difference between `$add` and `$set` is that `$add` will return early if the key already exists on the object, so just calling `obj.$add(key)` won’t overwrite the existing value with `undefined`.

A related note is that when you change a data-bound Array directly by setting indices (e.g. `arr[1] = value`), Vue will not be able to pick up the change. Again, you can use augmented methods to notify Vue.js about those changes. Observerd Arrays are augmented with two methods:

- `arr.$set(index, value)`
- `arr.$remove(index | value)`

Vue component instances also have corresponding instance methods:

- `vm.$get(path)`
- `vm.$set(path, value)`
- `vm.$add(key, value)`
- `vm.$delete(key, value)`

Note that `vm.$get` and `vm.$set` both accept paths.

<p class="tip">Despite the existence of these methods, make sure to only add observed fields when necessary. It's helpful to think of the `data` option as the schema for your component state. Explicitly listing possiblely-present properties in the component definition makes it easy to understand what a component may contain when you look at it later.</p>

## Understanding Async Updates

It is important to know that by default Vue performs view updates **asynchronously**. Instead, whenever a data change is observed, Vue will create a queue and buffer all the data changes that happened in the same event loop. If the same watcher is triggered multiple times, it will be pushed into the queue only once. Then, in the next event loop "tick", Vue flushes the queue and performs only the necessary DOM updates. Internally Vue uses `MutationObserver` if available for the asynchronous queueing and falls back to `setTimeout(fn, 0)`.

For example, when you set `vm.someData = 'new value'`, the DOM will not update immediately. It will update in the next "tick", when the queue is flushed. This behavior can be tricky when you want to do something that depends on the updated DOM state. Although Vue.js generally encourages developers to think in a "data-driven" way and avoid touching the DOM directly, sometimes you might just want to use that handy jQuery plugin you've always been using. In order to wait until Vue.js has finished updating the DOM after a data change, you can use `Vue.nextTick(callback)` immediately after the data is changed - when the callback is called, the DOM would have been updated. For example:

``` html
<div id="example">{{msg}}</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    msg: '123'
  }
})
vm.msg = 'new message' // change data
vm.$el.textContent === 'new message' // false
Vue.nextTick(function () {
  vm.$el.textContent === 'new message' // true
})
```

There is also the `vm.$nextTick()` instance method, which is especially handy inside components, because it doesn't need global `Vue` and its callback's `this` context will be automatically bound to the current Vue instance:

``` js
Vue.component('example', {
  template: '{{msg}}',
  data: {
    msg: 'not updated'
  },
  methods: {
    updateMessage: function () {
      this.msg = 'updated'
      console.log(this.$el.textContent) // => 'not updated'
      this.$nextTick(function () {
        console.log(this.$el.textContent) // => 'updated'
      })
    }
  }
})
```

## Component Scope

Every Vue.js component is a separate Vue instance with its own scope. It's important to understand how scopes work when using components. The rule of thumb is:

> If something appears in the parent template, it will be compiled in parent scope; if it appears in child template, it will be compiled in child scope.

A common mistake is trying to bind a directive to a child property/method in the parent template:

``` html
<div id="demo">
  <!-- does NOT work -->
  <child-component v-on="click: childMethod"></child-component>
</div>
```

If you need to bind child-scope directives on a component root node, you should use the `replace: true` option, and include the root node in the child's template:

``` js
Vue.component('child-component', {
  // make the component template replace its container node
  replace: true,
  // this does work, because we are in the right scope
  template: '<div v-on="click: childMethod">Child</div>',
  methods: {
    childMethod: function () {
      console.log('child method invoked!')
    }
  }
})
```

Note this pattern also applies to `$index` when using a component with `v-repeat`.

## Communication Between Instances

A common pattern for parent-child communication in Vue is passing down a parent method as a callback to the child using `props`. This allows the communication to be defined inside the template (where composition happens) while keeping the JavaScript implementation details decoupled:

``` html
<div id="demo">
  <p>Child says: {{msg}}</p>
  <child-component send-message="{{onChildMsg}}"></child-component>
</div>
```

``` js
new Vue({
  el: '#demo',
  data: {
    msg: ''
  },
  methods: {
    onChildMsg: function(msg) {
      this.msg = msg
      return 'Got it!'
    }
  },
  components: {
    'child-component': {
      props: ['send-message'],
      // props with hyphens are auto-camelized
      template:
        '<button v-on="click:onClick">Say Yeah!</button>' +
        '<p>Parent responds: {{response}}</p>',
      // component `data` option must be a function
      data: function () {
        return {
          response: ''
        }
      },
      methods: {
        onClick: function () {
          this.response = this.sendMessage('Yeah!')
        }
      }
    }
  }
})
```

**Result:**

<div id="demo"><p>Child says: {&#123;msg&#125;}</p><child-component send-message="{&#123;onChildMsg&#125;}"></child-component></div>

<script>
new Vue({
  el: '#demo',
  data: {
    msg: ''
  },
  methods: {
    onChildMsg: function(msg) {
      this.msg = msg
      return 'Got it!'
    }
  },
  components: {
    'child-component': {
      props: ['send-message'],
      data: function () {
        return {
          fromParent: ''
        }
      },
      template:
        '<button v-on="click:onClick">Say Yeah!</button>' +
        '<p>Parent responds: <span v-text="fromParent"></span></p>',
      methods: {
        onClick: function () {
          this.fromParent = this.sendMessage('Yeah!')
        }
      }
    }
  }
})
</script>

When you need to communicate across multiple nested components, you can use the [Event System](/api/instance-methods.html#Events). In addition, it is also quite feasible to implement a [Flux](https://facebook.github.io/flux/docs/overview.html)-like architecture with Vue, which you may want to consider for larger-scale applications.

## Props Availability

If you've ever tried to access a component's props in the `created` hook, you'd find them as `undefined`. This is because the `created` hook is called before any DOM compilation happens for the instance, thus props are not processed yet. Props are initialized with the parent values *after* template compilation. Similarly, two-way-bound props can only trigger parent changes after compilation.
