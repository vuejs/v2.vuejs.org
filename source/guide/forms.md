title: Handling Forms
type: guide
order: 7
---

You can use the `v-model` directive to create two-way data bindings on form input elements and elements with `contenteditable` attribute. It automatically picks the correct way to update the element based on the input type.

**Example**

``` html
<form id="demo">
    <!-- text -->
    <p><input type="text" v-model="msg"> {&#123;msg&#125;}</p>
    <!-- checkbox -->
    <p><input type="checkbox" v-model="checked"> {&#123;checked ? &quot;yes&quot; : &quot;no&quot;&#125;}</p>
    <!-- radio buttons -->
    <p>
        <input type="radio" name="picked" value="one" v-model="picked">
        <input type="radio" name="picked" value="two" v-model="picked">
        {&#123;picked&#125;}
    </p>
    <!-- select -->
    <p>
        <select v-model="selected">
            <option>one</option>
            <option>two</option>
        </select>
        {&#123;selected&#125;}
    </p>
    <!-- multiple select -->
    <p>
        <select v-model="multiSelect" multiple>
            <option>one</option>
            <option>two</option>
            <option>three</option>
        </select>
        {&#123;multiSelect&#125;}
    </p>
    <p>data: {&#123;$data&#125;}</p>
</form>
```

``` js
new Vue({
    el: '#demo',
    data: {
        msg      : 'hi!',
        checked  : true,
        picked   : 'one',
        selected : 'two',
        multiSelect: ['one', 'three']
    }
})
```

**Result**

<form id="demo"><p><input type="text" v-model="msg"> {&#123;msg&#125;}</p><p><input type="checkbox" v-model="checked"> {&#123;checked ? &quot;yes&quot; : &quot;no&quot;&#125;}</p><p><input type="radio" v-model="picked" name="picked" value="one"><input type="radio" v-model="picked" name="picked" value="two"> {&#123;picked&#125;}</p><p><select v-model="selected"><option>one</option><option>two</option></select> {&#123;selected&#125;}</p><p><select v-model="multiSelect" multiple><option>one</option><option>two</option><option>three</option></select>{&#123;multiSelect&#125;}</p><p>data: {&#123;$data&#125;}</p></form>
<script>
new Vue({
    el: '#demo',
    data: {
        msg      : 'hi!',
        checked  : true,
        picked   : 'one',
        selected : 'two',
        multiSelect: ['one', 'three']
    }
})
</script>

Next: [Computed Properties](/guide/computed.html).