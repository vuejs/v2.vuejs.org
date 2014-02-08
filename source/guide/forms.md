title: Handling Forms
type: guide
order: 7
---

You can use the `v-model` directive to create two-way data bindings on form input elements and elements with `contenteditable` attribute. It automatically picks the correct way to update the element based on the input type.

**Example**

``` html
<form id="demo">
    <p><input type="text" v-model="msg"> {&#123;msg&#125;}</p>
    <p><input type="checkbox" v-model="checked"> {&#123;checked ? &quot;yes&quot; : &quot;no&quot;&#125;}</p>
    <p>
        <input type="radio" name="picked" value="one" v-model="picked">
        <input type="radio" name="picked" value="two" v-model="picked">
        {&#123;picked&#125;}
    </p>
    <p>
        <select v-model="selected">
            <option>one</option>
            <option>two</option>
        </select>
        {&#123;selected&#125;}
    </p>
</form>
```

``` js
new Vue({
    el: '#demo',
    data: {
        msg      : 'hi!',
        checked  : true,
        picked   : 'one',
        selected : 'two'
    }
})
```

**Result**

<form id="demo"><p><input type="text" v-model="msg"> {&#123;msg&#125;}</p><p><input type="checkbox" v-model="checked"> {&#123;checked ? &quot;yes&quot; : &quot;no&quot;&#125;}</p><p><input type="radio" v-model="picked" name="picked" value="one"><input type="radio" v-model="picked" name="picked" value="two"> {&#123;picked&#125;}</p><p><select v-model="selected"><option>one</option><option>two</option></select> {&#123;selected&#125;}</p><p>data: {&#123;serialized&#125;}</p></form>
<script>
    new Vue({
        el: '#demo',
        data: {
            msg: 'hi!',
            checked: true,
            picked: 'one',
            selected: 'two'
        },
        computed: {
            serialized: {$get: function () {
                return JSON.stringify(this.$data)
            }}
        }
    })
</script>

Next: [Computed Properties](/guide/computed.html).