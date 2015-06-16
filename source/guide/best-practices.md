title: Best Practices for Beginners
type: guide
order: 15
---

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

Every Vue.js component is a separate Vue child instance with it's own scope. It's important to understand [how scopes work in Vue.js](/guide/components.html#A_Note_on_Scope), especially when referring to ViewModel properties, methods from templates. Beginning from version 0.11, thumb of rule for scope in template is: 

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

In Vue.js, parent-child communication is mainly done with `props`. Using `props` you can call parent method from child:

``` html
<div id="demo">
  <child-component say="{{listenToChild}}"></child-component>
  <p v-if="wordOfChild.length">Child says: {{wordOfChild}}</p>
</div>
```

``` js
new Vue({
  el: '#demo',

  data: {
    wordOfChild: ''
  },

  methods: {
    listenToChild: function(what) {
      return this.wordOfChild = what
    }
  },

  components: {
    'child-component': {
      props: ['say'],
      template: '<button type="button" v-on="click: say(\'Yeah!\')">Say Yeah!</button>'
    }
  }
})
```

**Result:**

<div id="demo"><child-component say="{{listenToChild}}"></child-component><p v-if="wordOfChild.length">Child says: {&#123;wordOfChild&#125;}</p></div>

<script>
  new Vue({
    el: '#demo',

    data: {
      wordOfChild: ''
    },

    methods: {
      listenToChild: function(what) {
        return this.wordOfChild = what
      }
    },

    components: {
      'child-component': {
        props: ['say'],
        template: '<button type="button" v-on="click: say(\'Yeah!\')">Say Yeah!</button>'
      }
    }
  })
</script>

Instances can also communicate using [Events](/api/instance-methods.html#Events), but this is mostly for more complex use cases, where `props` can't get the job done. In following demo, you can see how parent ViewModel broadcasts event to all children:

<iframe width="100%" height="300" src="//jsfiddle.net/azamatsharapov/dxpvb3n3/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Adding data properties

As it's already mentioned in [Guide](/guide/list.html#Iterating_Throught_An_Object):

"In ECMAScript 5 there is no way to detect when a new property is added to an Object, or when a property is deleted from an Object. To deal with that, observed objects will be augmented with three methods: $add(key, value), $set(key, value) and $delete(key). These methods can be used to add / delete properties from observed objects while triggering the desired View updates. The difference between $add and $set is that $add will return early if the key already exists on the object, so just calling obj.$add(key) won’t overwrite the existing value with undefined."

Another important thing you should know is, when you change data-bound Array directly using indices, Vue.js will not pick your changes and so View will not be updated. Again, you can use augmented methods to notify Vue.js about those changes.

ViewModel instances have following augmented methods available: `$get`, `$set`, `$add` and `$delete`. Among those, `$get` and `$set` can take paths as a first argument, which is useful in some cases.

Observed objects (e.g. data property of ViewModel) have `$add`, `$set` and `$delete` methods. 

Observed arrays have `$set` and `$remove` methods.
 
``` js
new Vue({
  el: '#demo',
  
  data: {
    arrayItems: [],
    objectItems: {}
  },

  ready: function() {
    // adds new item and sets 'value' of it
    this.arrayItems.$set(0, 'someValue')

    // removes arrayItems[0]
    this.arrayItems.$remove(0)
  
    // adding key to observed object
    this.objectItems.$add('a', {})

    // using path!
    this.$set('objectItems.a.b', 'value')
    
    // will change objectItems to {}
    this.objectItems.$delete('a')
  }
})
```

## Props availability

As you are probably already aware, Vue.js allows [passing data to child](/guide/components.html#Explicit_Data_Passing) instances using `props`. It should be also noted, that props are available *after* template compilation. You can see details in following snippet:

``` html
<div id="demo">
  <child parent-msg="{{@ msg}}"></child>
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

Note, that we are using `@` before prop name in template. It is special syntax, that bounds prop *two-way*, meaning changes from both parent and child will be synced back to other. Otherwise, without `@` symbol, props are bound *one-way-down*, which means once you pass prop using `childProp="{{parentProp}}"` syntax, changes made by child instance will not be synced back to parent instance. See [Prop Binding Types](/guide/components.html#Prop_Binding_Types) for detailed info.

For more info about instance hook orders, see [Lifecycle of ViewModel instances](/api/options.html#Lifecycle).

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
