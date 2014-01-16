index: true
---

**HTML**

``` html
<div id="app">
    <h1>&#123;&#123;title&#125;&#125;</h1>
    <ul>
        <li v-repeat="todos" class="&#123;&#123;done ? 'done' : ''&#125;&#125;">
            &#123;&#123;content&#125;&#125;
        </li>
    </ul>
</div>
```

**JavaScript**

``` js
var demo = new Vue({
    el: '#demo',
    data: {
        title: 'Todos',
        todos: [
            {
                done: true,
                content: 'Learn JavaScript'
            },
            {
                done: false,
                content: 'Learn vue.js'
            }
        ]
    }
})
```

**Result**

<div id="demo"><h1>&#123;&#123;title&#125;&#125;</h1><ul><li v-repeat="todos" class="&#123;&#123;done ? 'done' : ''&#125;&#125;">&#123;&#123;content&#125;&#125;</li></ul></div>
<script src="/js/vue.min.js"></script>
<script>
var demo = new Vue({
    el: '#demo',
    data: {
        title: 'Todos',
        todos: [
            {
                done: true,
                content: 'Learn JavaScript'
            },
            {
                done: false,
                content: 'Learn vue.js'
            }
        ]
    }
})
</script>

Now open your console and play with `demo` - for example, change `demo.title`, push a new object into `demo.todos`, or toggle a todo's `done` state.

<p id="learn-more"><a class="button" href="/guide/getting-started.html">Learn More</a></p>