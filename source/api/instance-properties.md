title: 实例属性
type: api
order: 3
---

### vm.$el

- **Type:** `HTMLElement`
- **只读**

返回Vue实例正在管理的Dom元素。

### vm.$data

- **Type:** `Object`

返回Vue实例正在监视的数据对象(data object)。当然你可以用新的对象去替换它。Vue实例通过代理方法访问他们的$data对象的属性。

### vm.$options

- **Type:** `Object`

返回当前Vue实例所使用的实例化选项。当你想要添加自定义的属性到实例化选项里面的时候，这个属性是很有用的:

``` js
new Vue({
  customOption: 'foo',
  created: function () {
    console.log(this.$options.customOption) // -> 'foo'
  }
})
```

### vm.$parent

- **Type:** `Vue`
- **只读**

如果当前Vue实例有父实例(parent instance)，将返回父实例。

### vm.$root

- **Type:** `Vue`
- **只读**

返回当前Vue结构树(component tree)的根Vue实例。如果当前的 `vm` 已经没有父实例的话将会返回它自己。

### vm.$

- **Type:** `Object`
- **只读**

返回一个对象，这个对象管理着有着 `v-ref` 指令的子组件。更多细节请查看 [v-ref](../api/directives.html#v-ref).

### vm.$$

- **Type:** `Object`
- **Read only**

返回一个对象，这个对象管理所有有着 `v-el` 指令的DOM元素。更多细节请查看 [v-el](../api/directives.html#v-el).

### Meta Properties

被 `v-repeat` 创建出来的实例也会拥有一些元属性(Meta properties)。例如 `vm.$index`, `vm.$key` 和 `vm.$value` 等。更多细节请查看 [the guide on using `v-repeat`](../guide/list.html).