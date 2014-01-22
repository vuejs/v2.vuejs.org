title: Displaying a List
type: guide
order: 3
---

# {{title}}

You can use the `v-repeat` directive to repeat a template element based on an Array of objects on the ViewModel. For every object in the Array, the directive will create a child ViewModel using that object as the data object. On and inside the template element you have access to properties of both the child ViewModel and the parent ViewModel. In addition, you also have access to the current child ViewModel's `$index` property, which is the index of its data object in the Array.

**Example:**

``` html
<ul id="demo">
    <li v-repeat="items" class="item-{&#123;$index&#125;}">
        {&#123;$index&#125;} - {&#123;parentMsg&#125;} {&#123;childMsg&#125;}
    </li>
</ul>
```

``` js
new Vue({
    el: '#demo',
    data: {
        parentMsg: 'Hello',
        items: [
            { childMsg: 'Foo' },
            { childMsg: 'Bar' }
        ]
    }
})
```

Result:

<ul id="demo"><li v-repeat="items" class="item-{&#123;$index&#125;}">{&#123;$index&#125;} - {&#123;parentMsg&#125;} {&#123;childMsg&#125;}</li></ul>
<script src="/js/vue.min.js"></script>
<script>
new Vue({
    el: '#demo',
    data: {
        parentMsg: 'Hello',
        items: [
            { childMsg: 'Foo' },
            { childMsg: 'Bar' }
        ]
    }
})
</script>