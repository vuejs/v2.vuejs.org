---
title: Vue екземпляр
type: guide
order: 3
---

## Створення екземпляру Vue

Кожен додаток на Vue починається із створення **Vue екземпляру** через функцію `Vue`:

```js
var vm = new Vue({
  // налаштування
})
```

Хоч Vue фреймворк не суворо асоціюється з [патерном MVVM](https://en.wikipedia.org/wiki/Model_View_ViewModel), він частково натхненний цим патерном. Як конвенція, ми часво використовуємо змінну `vm` (ViewModel скорочено) для звернення до екземпляру Vue.

Створюючи екземпляр Vue, Ви передаєте **об'єкт налаштувань**. Більша частина цього посібника пояснює як можна використовувати ці налаштування для створення потрібної Вам поведінки. Для довідки, Ви також можете переглянути весь список властивостей цього об'єкту у [довідці по API](../api/#Options-Data).

Додаток Vue складається з **кореневого екземпляру Vue** створеного за допомогою конструкції `new Vue`, та необов'язково організованого як дерево вкладених, повторно використовуваних компонентів. Для прикладу, ось як може виглядати таке дерево нашого тестового додатку для керування списком справ "ToDo":

```
Кореневий екземпляр
└─ TodoList
   ├─ TodoItem
   │  ├─ DeleteTodoButton
   │  └─ EditTodoButton
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
```

Ми ще поговоримо про [систему компонентів](components.html) в деталях пізніше. А зараз, просто знайте, що всі компоненти Vue є також екземплярами Vue, тому вони так само можуть об'єкт налаштувань (крім деяких, що стосуються лише кореневого екземпляру).

## Властивості Data та Methods

Коли екземпляр Vue створено, це додає всі властивості, що знаходяться в об'єкті `data` до так званої **системи реагування** Vue. Коли значення цих властивостей змінюються, вигляд "відреагує" на це, оновлюючись з новими значеннями цих властивостей.

```js
// Наш об'єкт data
var data = { a: 1 }

// Об'єкт додано до екземрляру Vue
var vm = new Vue({
  data: data
})

// При отриманні властивості екземпляру,
// повертається той, що знаходиться в початковому об'єкті data
vm.a == data.a // => true

// Встановлення значення властивості екземпляру
// також впливає на початковий об'єкт data
vm.a = 2
data.a // => 2

// ... і навпаки
data.a = 3
vm.a // => 3
```

When this data changes, the view will re-render. It should be noted that properties in `data` are only **reactive** if they existed when the instance was created. That means if you add a new property, like:

```js
vm.b = 'hi'
```

Then changes to `b` will not trigger any view updates. If you know you'll need a property later, but it starts out empty or non-existent, you'll need to set some initial value. For example:

```js
data: {
  newTodoText: '',
  visitCount: 0,
  hideCompletedTodos: false,
  todos: [],
  error: null
}
```

The only exception to this being the use of `Object.freeze()`, which prevents existing properties from being changed, which also means the reactivity system can't _track_ changes.

```js
var obj = {
  foo: 'bar'
}

Object.freeze(obj)

new Vue({
  el: '#app',
  data: obj
})
```

```html
<div id="app">
  <p>{{ foo }}</p>
  <!-- this will no longer update `foo`! -->
  <button v-on:click="foo = 'baz'">Change it</button>
</div>
```

In addition to data properties, Vue instances expose a number of useful instance properties and methods. These are prefixed with `$` to differentiate them from user-defined properties. For example:

```js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // => true
vm.$el === document.getElementById('example') // => true

// $watch is an instance method
vm.$watch('a', function (newValue, oldValue) {
  // This callback will be called when `vm.a` changes
})
```

In the future, you can consult the [API reference](../api/#Instance-Properties) for a full list of instance properties and methods.

## Instance Lifecycle Hooks

<div class="vueschool"><a href="https://vueschool.io/lessons/understanding-the-vuejs-lifecycle-hooks?friend=vuejs" target="_blank" rel="sponsored noopener" title="Free Vue.js Lifecycle Hooks Lesson">Watch a free lesson on Vue School</a></div>

Each Vue instance goes through a series of initialization steps when it's created - for example, it needs to set up data observation, compile the template, mount the instance to the DOM, and update the DOM when data changes. Along the way, it also runs functions called **lifecycle hooks**, giving users the opportunity to add their own code at specific stages.

For example, the [`created`](../api/#created) hook can be used to run code after an instance is created:

```js
new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` points to the vm instance
    console.log('a is: ' + this.a)
  }
})
// => "a is: 1"
```

There are also other hooks which will be called at different stages of the instance's lifecycle, such as [`mounted`](../api/#mounted), [`updated`](../api/#updated), and [`destroyed`](../api/#destroyed). All lifecycle hooks are called with their `this` context pointing to the Vue instance invoking it.

<p class="tip">Don't use [arrow functions](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) on an options property or callback, such as `created: () => console.log(this.a)` or `vm.$watch('a', newValue => this.myMethod())`. Since an arrow function doesn't have a `this`, `this` will be treated as any other variable and lexically looked up through parent scopes until found, often resulting in errors such as `Uncaught TypeError: Cannot read property of undefined` or `Uncaught TypeError: this.myMethod is not a function`.</p>

## Lifecycle Diagram

Below is a diagram for the instance lifecycle. You don't need to fully understand everything going on right now, but as you learn and build more, it will be a useful reference.

![The Vue Instance Lifecycle](/images/lifecycle.png)
