---
title: A Instância Vue
type: guide
order: 3
---

## Construtor

Todo vm do Vue é iniciado pela criação da **instância raiz do Vue** com a função construtora do Vue:

``` js
var vm = new Vue({
  // opções
})
```

Embora não seja estritamente associado com o [padrão MVVM](https://en.wikipedia.org/wiki/Model_View_ViewModel), o design do Vue foi sem dúvida inspirado por ele. Como convenção, muitas vezes usamos a variável `vm` (abreviação de ViewModel) para se referir à instância Vue.

Quando você criar uma instância do Vue, é necessário repassar um **objeto** que contém opções para dados, elementos, métodos, ciclos de vida e mais. A lista completa de opções pode ser encontrada na [API](/api).

o construtor `Vue` pode ser estendido para a criação de **contrutores de componentes** reutilizáveis com opções pré definidas:

``` js
var MyComponent = Vue.extend({
  // opções da extensão
})

// todas as instâncias de `MyComponent` são criadas com
// as definições pré definidas pelas opções
var myComponentInstance = new MyComponent()
```

Embora seja possível criar instâncias repetidamente, na maioria das vezes é recomendado compô-los declarativamente em templates com elementos customizáveis. Vamos falar sobre [o sistema de componentes](components.html) com mais detalhes depois. Por enquanto, você precisa apenas saber que todos os componentes Vue são essencialmente extensões da instância Vue.

## Propriedades e Métodos

Cada instância Vue

Each Vue instance **proxies** all the properties found in its `data` object:

``` js
var data = { a: 1 }
var vm = new Vue({
  data: data
})

vm.a === data.a // -> true

// setting the property also affects original data
vm.a = 2
data.a // -> 2

// ... and vice-versa
data.a = 3
vm.a // -> 3
```

It should be noted that only these proxied properties are **reactive**. If you attach a new property to the instance after it has been created, it will not trigger any view updates. We will discuss the reactivity system in detail later.

In addition to data properties, Vue instances expose a number of useful instance properties and methods. These properties and methods are prefixed with `$` to differentiate them from proxied data properties. For example:

``` js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // -> true
vm.$el === document.getElementById('example') // -> true

// $watch is an instance method
vm.$watch('a', function (newVal, oldVal) {
  // this callback will be called when `vm.a` changes
})
```

<p class="tip">Don't use [arrow functions](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) on an instance property or callback (e.g. `vm.$watch('a', newVal => this.myMethod())`). As arrow functions are bound to the parent context, `this` will not be the Vue instance as you'd expect and `this.myMethod` will be undefined.</p>

Consult the [API reference](../api) for the full list of instance properties and methods.

## Instance Lifecycle Hooks

Each Vue instance goes through a series of initialization steps when it is created - for example, it needs to set up data observation, compile the template, mount the instance to the DOM, and update the DOM when data changes. Along the way, it will also invoke some **lifecycle hooks**, which give us the opportunity to execute custom logic. For example, the [`created`](../api/#created) hook is called after the instance is created:

``` js
var vm = new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` points to the vm instance
    console.log('a is: ' + this.a)
  }
})
// -> "a is: 1"
```

There are also other hooks which will be called at different stages of the instance's lifecycle, for example [`mounted`](../api/#mounted), [`updated`](../api/#updated), and [`destroyed`](../api/#destroyed). All lifecycle hooks are called with their `this` context pointing to the Vue instance invoking it. You may have been wondering where the concept of "controllers" lives in the Vue world and the answer is: there are no controllers. Your custom logic for a component would be split among these lifecycle hooks.

## Lifecycle Diagram

Below is a diagram for the instance lifecycle. You don't need to fully understand everything going on right now, but this diagram will be helpful in the future.

![Lifecycle](/images/lifecycle.png)
