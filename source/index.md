index: true
---

## Quick Example

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
var data = {
    title: 'todos',
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

var app = new Vue({
    el: '#app',
    data: data
})
```

<p id="learn-more"><a class="button" href="/guide/getting-started.html">Learn More</a></p>