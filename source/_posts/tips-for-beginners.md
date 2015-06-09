title: Tips for beginners
date: 2015-06-10 03:05:00
tags: tips
---

This blog posts comes with some useful tips and advices for beginners. 

<!-- more -->

## Data

Initializing your data properties in Vue Model is safe and good for performance. Suppose you have following template:

``` html
<div id="demo">
  <p v-class="green: validation.valid">{{message}}</p>
  <input v-model="message">
</div>
```

Recommended approach would be initializing data properties in you ViewModel, even if you need them to be empty/falsy:

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

## Scope

Every Vue.js component is a separate Vue child instance with it's own scope. It's important to understand how scopes work in Vue.js, especially when referring to ViewModel properties, methods from templates. Beginning from version 0.11, thumb of rule for scope in template is: 

<p class="tip">if something appears in the parent template, it will be compiled in parent scope; if it appears in child template, it will be compiled in child scope.</p>

Following snippets demonstrate *wrong* and *right* scope usage:

``` js
new Vue({
  el: '#demo',

  methods: {
    parentMethod: function() {
      return console.log('parent')
    }
  },

  components: {
    child: {
      template: '<a v-on="click: parentMethod">click here</a>' // WRONG: you cannot access `parentMethod` from child instance (child component)
      methods: {
        childMethod: function() {
          return console.log('child')
        }
      }
    }
  }
})
```

``` html
<div id="demo">
  <!-- works, because this is parent template -->
  <a v-on="click: parentMethod">click here</a>

  <!-- does NOT work, because childMethod does not exist in this scope -->
  <a v-on="click: childMethod"></a>
</div>
```

## Communication between instances

In Vue.js, recommended parent-child and cross-component communication is mainly done using [Vue.js Events](/api/instance-methods.html#Events). Following snippet shows how child instance can call event, that is registered in parent scope:

``` html
<div id="demo">
  <child-component></child-component>
  <p v-if="wordOfChild.length">Child says: {{wordOfChild}}</p>
</div>
```

``` js
new Vue({
  el: '#demo',

  data: {
    wordOfChild: ''
  },

  // http://vuejs.org/api/options.html#events
  events: {
    'child-say': function(what) {
      return this.wordOfChild = what
    }
  },

  components: {
    'child-component': {
      template: '<a href="" v-on="click: say($event, \'Yeah!\')">Say Yeah!</a>',
      methods: {
        say: function(event, what) {
          event.preventDefault()

          // http://vuejs.org/api/instance-methods.html#vm-\$dispatch\(_event\,_\[args…\]_\)
          this.$dispatch('child-say', what)
        }
      }
    }
  }
})
```

**Result:**

<div id="demo"><child-component></child-component><p v-if="wordOfChild.length">Child says: {&#123;wordOfChild&#125;}</p></div>

<script>
  new Vue({
    el: '#demo',

    data: {
      wordOfChild: ''
    },

    // http://vuejs.org/api/options.html#events
    events: {
      'child-say': function(what) {
        return this.wordOfChild = what
      }
    },

    components: {
      'child-component': {
        template: '<a href="" v-on="click: say($event, \'Yeah!\')">Say Yeah!</a>',
        methods: {
          say: function(event, what) {
            event.preventDefault()

            // http://vuejs.org/api/instance-methods.html#vm-\$dispatch\(_event\,_\[args…\]_\)
            this.$dispatch('child-say', what)
          }
        }
      }
    }
  })
</script>


In following demo, you can see how parent ViewModel instance broadcasts event to all children:

<iframe width="100%" height="300" src="//jsfiddle.net/azamatsharapov/dxpvb3n3/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Adding data properties

<p class="tip">In ECMAScript 5 there is no way to detect when a new property is added to an Object, or when a property is deleted from an Object. To deal with that, observed objects will be augmented with three methods: $add(key, value), $set(key, value) and $delete(key). These methods can be used to add / delete properties from observed objects while triggering the desired View updates. The difference between $add and $set is that $add will return early if the key already exists on the object, so just calling obj.$add(key) won’t overwrite the existing value with undefined.</p>

The quote above is taken from guide and is important to mention, because many beginners run into issues with it. If you need to add new or delete existing data properties, use augmented methods as mentioned above. Another important thing you should know is, when you change data-bound Array directly using indices, Vue.js will not pick your changes and so View will not be updated. Again, you can use augmented methods to notify Vue.js about those changes. Also, augmented methods can take path as a first argument, which is useful. See example below.

``` js
new Vue({
  el: '#demo',
  
  data: {
    arrayItems: [],
    objectItems: {}
  },

  ready: function() {
    // adds new item and sets 'value' of it
    this.arrayItems.$add(0, 'someValue')
    
    // Head Up! This will *not* change arrayItems[0], use $set() for that
    // arrayItems[0] will still have 'someValue' as value
    this.arrayItems.$add(0, 'newValue')

    // using path! so objectItems becomes
    // {a: { b: 'value' } }
    this.objectItems.$add('a.b', 'value')
    
    // will change objectItems to {}
    this.$delete('objectItems.a')
  }
})
```

## Props availability

As you are probably already aware, Vue.js allows [passing data to child](/guide/components.html#Explicit_Data_Passing) instances using `props`. It should be also noted, that props are available *after* template compilation. You can see details in following snippet:

``` html
<div id="demo">
  <child parent-msg="msg"></child>
</div>
```

``` js
new Vue({
  el: '#demo',

  data: {
    msg: ''
  },

  components: {
    child: {
      props: ['parentMsg'],
      template: '<p>{{ parentMsg }}</p>',
      
      created: function() {
        // WRONG: because 'created' hooks is fired before compilation
        this.parentMsg = 'newValue'
      },
      compiled: function() {
        // Works! because 'compiled' hook is fired after compilation
        this.parentMsg = 'newValue'
      }
    }
  }
})
```

For more info about hook orders, see [Lifecycle of ViewModel instances](/api/options.html#Lifecycle).

## Async rendering

By default, Vue.js renders Views asynchronously. It means, when you change some data in your Model, Vue.js doesn't update DOM immediately, but buffers View changes to fire in a right moment, which is good for performance. If you need to run something, that depends on DOM changes, you can use `Vue.$nextTick()`. For example, say you want to bind some kind of "datepicker" jQuery UI plugin to input element, which is hidden/shown using `v-if` directive:

``` html
<div id="demo">
  <button v-on="click: showDatepicker">Choose date</button>
  <input v-if="show" class="datepicker" type="text">
</div>
```

Assuming that `show` data property is falsy, this input will not exist in DOM until `show` is truthy. After changing `show` property value, you should use `Vue.$nextTick()` to run "datepicker" related code:

``` js
new Vue({
  el: '#demo',

  data: {
    show: false
  },

  methods: {
    showDatepicker: function() {
      this.show = true

      Vue.nextTick(function() {
        $('.datepicker').datepicker()
      })
    }
  }
})
```

[Here is the demo](http://jsfiddle.net/azamatsharapov/hpgd5n8j/).

There is also `vm.$nextTick()` instance method, which is especially handy when using in components, because it doesn't need global `Vue` and it's callback's `this` will be bound to the current ViewModel instance.

If your application depends on DOM changes much and you don't want to use `$nextTick`, you can configure Vue.js to run in synchronous mode by default: `Vue.config.async = false`.


We strongly recommend you reading [whole guide](/guide) if you haven't done so, because it is currently best place to learn about all possibilities of Vue.js.