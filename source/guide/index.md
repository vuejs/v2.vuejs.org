title: 시작하기
type: guide
order: 2
---

## 소개

Vue.js는 인터렉티브 웹 인터페이스를 만들기위한 라이브러리입니다.

기술적으로 말하자면, Vue.js는 MVVM 패턴의 [ViewModel](#ViewModel)층에 초점을 두고 있습니다. Vue.js는 [View](#View)와 [Model](#Model)을 양방향 바인딩으로 연결합니다. 실제 DOM 조작과 출력 포멧팅은 [Directives](#Directives)와 [Filters](#Filters)로 추상화됩니다.

원칙적으로, 목표는 가능한한 간단한 API로 반응적 데이터 바인딩과 조합가능한 뷰 컴포넌트의 이점을 제공하는 것입니다. Vue.js는 거대한 프레임워크가 아닙니다. Vue.js는 간단하고 유연한 뷰 층이 되도록 설계되었습니다. Vue.js는 단독으로 빠른 프로토타이핑에 사용하거나, 다른 라이브러리와 조합해 독자적인 프론트엔드 스택으로 사용할 수 있습니다. Vue.js는 Firebase같은 백엔드가 없는 서비스와도 잘 어울립니다.

Vue.js API는 [AngularJS], [KnockoutJS], [Ractive.js], [Rivets.js]에 영향을 많이 받았습니다. 비슷함에도 불구하고, Vue.js가 기존 라이브러리의 단순함과 기능성의 조화를 이룬 가치있는 대안이 되리라 믿습니다.

이런 용어에 이미 익숙하다하더레도, 밑에 있는 개념의 개요를 읽어보시는 것을 추천합니다. 왜냐하면, 당신이 알고 있는 용어와 Vue.js 의 문맥안에서의 의미가 다를 수 있기 때문입니다.

## Concepts Overview

![MVVM](/images/mvvm.png)

### ViewModel

모델과 뷰를 동기화하는 객체입니다. Vue.js에서는 모든 Vue 객체는 ViewModel입니다. `Vue` 생성자나 그 하위 클래스로 객체화할 수 있습니다.

```js
var vm = new Vue({ /* options */ })
```

This is the primary object that you will be interacting with as a developer when using Vue.js. For more details see [The Vue Constructor](/api/).

### View

The actual DOM that is managed by Vue instances.

```js
vm.$el // The View
```

Vue.js uses DOM-based templating. Each Vue instance is associated with a corresponding DOM element. When a Vue instance is created, it recursively walks all child nodes of its root element while setting up the necessary data bindings. After the View is compiled, it becomes reactive to data changes.

When using Vue.js, you rarely have to touch the DOM yourself except in custom directives (explained later). View updates will be automatically triggered when the data changes. These view updates are highly granular with the precision down to a textNode. They are also batched and executed asynchronously for greater performance.

### Model

A slightly modified plain JavaScript object.

```js
vm.$data // The Model
```

In Vue.js, models are simply plain JavaScript objects, or **data objects**. Once an object is used as data inside a Vue instance, it becomes **reactive**. You can manipulate their properties and Vue instances that are observing them will be notified of the changes. Vue.js achieves transparent reactivity by converting the properties on data objects into ES5 getter/setters. There's no need for dirty checking, nor do you have to explicitly signal Vue to update the View. Whenever the data changes, the View is updated on the next frame.

Vue instances proxy all properties on data objects they observe. So once an object `{ a: 1 }` has been observed, both `vm.$data.a` and `vm.a` will return the same value, and setting `vm.a = 2` will modify `vm.$data`.

The data objects are mutated in place, so modifying it by reference has the same effects as modifying `vm.$data`. This makes it possible for multiple Vue instances to observe the same piece of data. In larger applications it is also recommended to treat Vue instances as pure views, and externalize the data manipulation logic into a more discrete store layer.

One caveat here is that once the observation has been initiated, Vue.js will not be able to detect newly added or deleted properties. To get around that, observed objects are augmented with `$add`, `$set` and `$delete` methods.

Below is a high-level overview of how reactive updates are implemented in Vue.js:

![Data Observation](/images/data.png)

### Directives

Prefixed HTML attributes that tell Vue.js to do something about a DOM element.

```html
<div v-text="message"></div>
```

Here the div element has a `v-text` directive with the value `message`. This tells Vue.js to keep the div's textContent in sync with the Vue instance's `message` property.

Directives can encapsulate arbitrary DOM manipulations. For example `v-attr` manipulates an element's attributes, `v-repeat` clones an element based on an Array, `v-on` attaches event listeners... we will cover them later.

### Mustache Bindings

You can also use mustache-style bindings, both in text and in attributes. They are translated into `v-text` and `v-attr` directives under the hood. For example:

```html
<div id="person-{{id}}">Hello {{name}}!</div>
```

Although it is convenient, there are a few things you need to be aware of:

<p class="tip">The `src` attribute on an `<image>` element makes an HTTP request when a value is set, so when the template is first parsed it will result in a 404. In this case `v-attr` is preferred.</p>

<p class="tip">Internet Explorer will remove invalid inline `style` attributes when parsing HTML, so always use `v-style` when binding inline CSS if you want to support IE.</p>

You can use triple mustaches for unescaped HTML, which translates to `v-html` internally:

``` html
{{{ safeHTMLString }}}
```

However, this can open up windows for potential XSS attacks, therefore it is suggested that you only use triple mustaches when you are absolutely sure about the security of the data source, or pipe it through a custom filter that sanitizes untrusted HTML.

Finally, you can add `*` to your mustache bindings to indicate a one-time only interpolation, which does not react to data changes:

``` html
{{* onlyOnce }}
```

### Filters

Filters are functions used to process the raw values before updating the View. They are denoted by a "pipe" inside directives or bindings:

```html
<div>{{message | capitalize}}</div>
```

Now before the div's textContent is updated, the `message` value will first be passed through the `capitalize` function. For more details see [Filters in Depth](/guide/filters.html).

### Components

![Component Tree](/images/components.png)

In Vue.js, every component is simply a Vue instance. Components form a nested tree-like hierarchy that represents your application interface. They can be instantiated by a custom constructor returned from `Vue.extend`, but a more declarative approach is registering them with `Vue.component(id, constructor)`. Once registered, they can be declaratively nested in other Vue instance's templates in the form of custom elements:

``` html
<my-component>
  <!-- internals handled by my-component -->
</my-component>
```

This simple mechanism enables declarative reuse and composition of Vue instances in a fashion similar to [Web Components](http://www.w3.org/TR/components-intro/), without the need for latest browsers or heavy polyfills. By breaking an application into smaller components, the result is a highly decoupled and maintainable codebase. For more details, see [Component System](/guide/components.html).

## A Quick Example

``` html
<div id="demo">
  <h1>{{title | uppercase}}</h1>
  <ul>
    <li
      v-repeat="todos"
      v-on="click: done = !done"
      class="{{done ? 'done' : ''}}">
      {{content}}
    </li>
  </ul>
</div>
```

``` js
var demo = new Vue({
  el: '#demo',
  data: {
    title: 'todos',
    todos: [
      {
        done: true,
        content: 'Learn JavaScript'
      },
      {
        done: false,
        content: 'Learn Vue.js'
      }
    ]
  }
})
```

**Result**

<div id="demo"><h1>&#123;&#123;title | uppercase&#125;&#125;</h1><ul><li v-repeat="todos" v-on="click: done = !done" class="&#123;&#123;done ? 'done' : ''&#125;&#125;">&#123;&#123;content&#125;&#125;</li></ul></div>
<script>
var demo = new Vue({
  el: '#demo',
  data: {
    title: 'todos',
    todos: [
      {
        done: true,
        content: 'Learn JavaScript'
      },
      {
        done: false,
        content: 'Learn Vue.js'
      }
    ]
  }
})
</script>

Also available on [jsfiddle](http://jsfiddle.net/yyx990803/yMv7y/).

You can click on a todo to toggle it, or you can open your Browser's console and play with the `demo` object - for example, change `demo.title`, push a new object into `demo.todos`, or toggle a todo's `done` state.

You probably have a few questions in mind now - don't worry, we'll cover them soon. 

Next up: [Directives in Depth](/guide/directives.html).

[AngularJS]: http://angularjs.org
[KnockoutJS]: http://knockoutjs.com
[Ractive.js]: http://ractivejs.org
[Rivets.js]: http://www.rivetsjs.com
