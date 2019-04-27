---
title: Танилцуулга
type: guide
order: 2
---

## Vue.js гэж юу вэ?

Vue (дуудлага нь / vjuː /, **view** шиг) нь хэрэглэгчийн интерфэйсийг бүтээхэд зориулсан **дэвшилтэт framework** юм. Бусад monolotic framework-уудаас ялгаатай нь Vue нь жижиг хэсгүүдээс бага багаар өргөтгөж хэрэглэх зорилготой байна. Үндсэн сан нь зөвхөн view layer дээр төвлөрч байгаа бөгөөд бусад сангууд болон,  төслүүдтэй хамтарч, нэгтгэх боломжтой. Нөгөөтэйгүүр, Vue нь [орчин үеийн багаж хэрэгсэл](single-file-components.html) болон [нэмэлт сангууд](https://github.com/vuejs/awesome-vue#components--libraries) тай хослуулан Single-Page Application-уудыг маш сайн хөгжүүлэх боломжтой.

Хэрэв та Vue ашиглахаасаа өмнө илүү ихийг мэдэхийг хүсч байвал, бид үндсэн ойлголтууд болон жишээ төслүүдийг багтаасан <a id="modal-player"  href="#">бичлэг бэлдсэн байгаа.</a> 

Та frontend хөгжүүлэгчээр ажилладаг туршлагатай бол Vue болон бусад libraries/framework-ийг харьцуулж хараарай [Бусад Framework-уудтай харьцуулсан](comparison.html).

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="noopener" title="Free Vue.js Course">Vue Mastery үнэгүй видео хичээл үзээрэй</a></div>

## Эхлэх

<a class="button" href="installation.html">Суулгах</a>

<p class="tip">Энэхүү албан ёсны заавруудтай танилцахын тулд HTML, CSS, болон JavaScript-ийн анхан шатны мэдлэгтэй байх хэрэгтэй. Хэрэв шинээр frontend хөгжүүлэлт сурах гэж байгаа бол, шууд framework ашиглах нь тохиромжгүй бөгөөд, эхлээд анхан шатны үндсэн ойлголтуудыг судалсаны дараа эргэж ирэхийг хүсч байна! Өмнө нь бусад framework ашиглаж байсан туршлага хэрэг болох хэдий ч тийм ч чухал биш.</p>

Vue.js туршиж үзэх хамгийн хялбар арга нь [JSFiddle Hello World жишээ](https://jsfiddle.net/chrisvfritz/50wL7mdz/) ашиглах. Өөр таб нээж бусад энгийн жишээнүүд болон заавруудыг дагаж турших бүрэн боломжтой. Мөн <a href="https://gist.githubusercontent.com/chrisvfritz/7f8d7d63000b48493c336e48b3db3e52/raw/ed60c4e5d5c6fec48b0921edaed0cb60be30e87c/index.html" target="_blank" download="index.html" rel="noopener noreferrer">шинээр <code>index.html</code> файл </a> үүсгэж Vue-ийг оруулж болно.

``` html
<!-- хөгжүүлэлтийн хувилбар, хэрэгтэй console анхааруулгуудыг багтаасан -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

болон:

``` html
<!-- production хувилбар, хэмжээг нь багасгасан илүү хурдтай -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Vue хэрхэн суулгах талаар дэлгэрэнгүй мэдээллийг [Суулгах](installation.html) хуудаснаас харна уу . Тэмдэглэл: Бид анхлан сурж эхлэж байгаа хүмүүст `vue-cli` **ашиглахгүй** байхыг зөвлөж байна, Ялангуяа Node.js дээр суурьласан хөгжүүлэлтэнд ашигладаг багаж хэрэгсэлүүд ашиглаж байгаагүй бол.

Хэрэв та илүү интерактив зүйл сонирхож байвал, [энэхүү цуврал хичээлийг Scrimba дээр](https://scrimba.com/playlist/pXKqta) дээр үзэж болно, олон төрлийн видео хичээлүүд байгаа бөгөөд хүссэн үедээ ухрааж зогсоож үзэх боломжтой.

## Declarative Rendering

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cQ3QVcr" target="_blank" rel="noopener noreferrer">Scrimba дээр энэ хичээлийг туршиж үзээрэй</a></div>

Vue.js core нь бидэнд энгийн template syntax ашиглаж илэрхийлэл болон өгөгдлийг DOM руу рэндэр хийх боломжийг олгодог систем юм:

``` html
<div id="app">
  {{ message }}
</div>
```
``` js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Сайн уу Vue!'
  }
})
```
{% raw %}
<div id="app" class="demo">
  {{ message }}
</div>
<script>
var app = new Vue({
  el: '#app',
  data: {
    message: 'Сайн уу Vue!'
  }
})
</script>
{% endraw %}

Бид анхны Vue апп үүсгэсэн! Энэ энгийн string template рэндэр хийсэн мэт харагдаж байна, гэвч Vue цаана нь маш их ажил амжуулсан байгаа. Одоо DOM болон өгөгдөл холбогдсон, мөн бүх зүйл **reactive** ажиллаж байгаа. Бид яаж мэдэх вэ? Өөрийнхөө вэб хөтөчийг нээж JavaScript console (яг одоо, энэ хуудас дээр) нээж `app.message`-д өөр утга өгнө үү. Та дээр дурдсан өөрчлөгдсөн жишээ харах болно.

Текст засч оруулахаас гадна, дараах байдлаар элементүүдийн шинж чанарыг тодорхойлж болно:

``` html
<div id="app-2">
  <span v-bind:title="message">
    Намайг хулганаараа hover хийж гарч ирэх гарчигийг хараарай!
  </span>
</div>
```
``` js
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Та энэ хуудсыг ' + new Date().toLocaleString() + '-д дуудсан байна'
  }
})
```
{% raw %}
<div id="app-2" class="demo">
  <span v-bind:title="message">
    Намайг хулганаараа hover хийж гарч ирэх гарчигийг хараарай!
  </span>
</div>
<script>
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Та энэ хуудсыг ' + new Date().toLocaleString() + '-д дуудсан байна'
  }
})
</script>
{% endraw %}

Энд бид шинэ зүйлтэй уулзаж байна. Дээрх `v-bind` шинж чанар нь **directive** гэж нэрлэгддэг. Directive-ууд нь урдаа `v-` гэсэн албан ёсны шинж чанар авах боломжыг Vue хангаж өгсөн байдаг, энэ нь таны бодож байгаагаар энэ нь reactive шинж чанарыг rendered DOM дээр хэрэглэдэг. Энд үндсэндээ "энэ элементийн `гарчиг` шинж чанарыг Vue жишээн дээрх `message` шинж чанараар байнга шинэчилж байна гэсэн үг юм.

Хэрэв та өөрийн JavaScript консолоо дахин нээгээд `app2.message = 'зарим шинэ мессеж'` - г оруулбал, та энэ үед bound HTML дээр `title` атрибут шинэчлэгдсэн байгааг харах болно.

## Conditionals болон Loops

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQe4SJ" target="_blank" rel="noopener noreferrer">Scrimba дээр хичээл үзэх</a></div>

Элементийн идэвхитэй харагдах үгүйг зохицуулах амархан:

``` html
<div id="app-3">
  <span v-if="seen">Та одоо намайг харж байна</span>
</div>
```

``` js
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
```

{% raw %}
<div id="app-3" class="demo">
  <span v-if="seen">Та одоо намайг харж байна</span>
</div>
<script>
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
</script>
{% endraw %}

Одоо console дээр `app3.seen = false` болгоод enter товч дарна уу. Та мессежийг харах боломжгүй болно.

Энэ жишээ нь бид зөвхөн текст болон шинж чанарууд бус, DOM-ийн **бүтэц** уруу өгөгдөл холбох боломжтой гэдгийг харуулж байна. Үүнээс гадна, Vue өгөгдөл болон элемент нэмэх/устгах/засах үед автоматаар систем дээр өөрчлөлт хийдэг хүчирхэг [transition effects](transitions.html)-ээр хангадаг.

Өөрийн тусгай үүрэг бүхий хэд хэдэн directives байдаг. Жишээ нь, `v-for` directive Array-ийн өгөгдөлийн ашиглан өгөгдлийн жагсаалт харуулахад ашигладаг:

``` html
<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```
``` js
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'JavaScript сурах' },
      { text: 'Vue сурах' },
      { text: 'Ямар нэг юм хийх' }
    ]
  }
})
```
{% raw %}
<div id="app-4" class="demo">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
<script>
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'JavaScript сурах' },
      { text: 'Vue сурах' },
      { text: 'Ямар нэг юм хийх' }
    ]
  }
})
</script>
{% endraw %}

Console дээр `app4.todos.push({ text: 'Шинэ өгөгдөл' })` оруулна уу. Та жагсаалтад шинэ өгөгдөл орсон байгааг харж болно.

## Handling User Input

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/czPNaUr" target="_blank" rel="noopener noreferrer">Scrimba дээр хичээл үзэх</a></div>

Хэрэглэгчид таны апп-тай харилцах боломжийг олгохын тулд бид `v-on` directive ашиглан Vue instance бүрт event listeners болон method-уудтай нь хавсаргаж ашиглаж болно:

``` html
<div id="app-5">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Reverse Message</button>
</div>
```
``` js
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hello Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
```
{% raw %}
<div id="app-5" class="demo">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Reverse Message</button>
</div>
<script>
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hello Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Note that in this method we update the state of our app without touching the DOM - all DOM manipulations are handled by Vue, and the code you write is focused on the underlying logic.

Vue also provides the `v-model` directive that makes two-way binding between form input and app state a breeze:

``` html
<div id="app-6">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
```
``` js
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Hello Vue!'
  }
})
```
{% raw %}
<div id="app-6" class="demo">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
<script>
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Hello Vue!'
  }
})
</script>
{% endraw %}

## Composing with Components

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQVkA3" target="_blank" rel="noopener noreferrer">Try this lesson on Scrimba</a></div>

The component system is another important concept in Vue, because it's an abstraction that allows us to build large-scale applications composed of small, self-contained, and often reusable components. If we think about it, almost any type of application interface can be abstracted into a tree of components:

![Component Tree](/images/components.png)

In Vue, a component is essentially a Vue instance with pre-defined options. Registering a component in Vue is straightforward:

``` js
// Define a new component called todo-item
Vue.component('todo-item', {
  template: '<li>This is a todo</li>'
})
```

Now you can compose it in another component's template:

``` html
<ol>
  <!-- Create an instance of the todo-item component -->
  <todo-item></todo-item>
</ol>
```

But this would render the same text for every todo, which is not super interesting. We should be able to pass data from the parent scope into child components. Let's modify the component definition to make it accept a [prop](components.html#Props):

``` js
Vue.component('todo-item', {
  // The todo-item component now accepts a
  // "prop", which is like a custom attribute.
  // This prop is called todo.
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

Now we can pass the todo into each repeated component using `v-bind`:

``` html
<div id="app-7">
  <ol>
    <!--
      Now we provide each todo-item with the todo object
      it's representing, so that its content can be dynamic.
      We also need to provide each component with a "key",
      which will be explained later.
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id"
    ></todo-item>
  </ol>
</div>
```
``` js
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})

var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: 'Vegetables' },
      { id: 1, text: 'Cheese' },
      { id: 2, text: 'Whatever else humans are supposed to eat' }
    ]
  }
})
```
{% raw %}
<div id="app-7" class="demo">
  <ol>
    <todo-item v-for="item in groceryList" v-bind:todo="item" :key="item.id"></todo-item>
  </ol>
</div>
<script>
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: 'Vegetables' },
      { id: 1, text: 'Cheese' },
      { id: 2, text: 'Whatever else humans are supposed to eat' }
    ]
  }
})
</script>
{% endraw %}

This is a contrived example, but we have managed to separate our app into two smaller units, and the child is reasonably well-decoupled from the parent via the props interface. We can now further improve our `<todo-item>` component with more complex template and logic without affecting the parent app.

In a large application, it is necessary to divide the whole app into components to make development manageable. We will talk a lot more about components [later in the guide](components.html), but here's an (imaginary) example of what an app's template might look like with components:

``` html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### Relation to Custom Elements

You may have noticed that Vue components are very similar to **Custom Elements**, which are part of the [Web Components Spec](https://www.w3.org/wiki/WebComponents/). That's because Vue's component syntax is loosely modeled after the spec. For example, Vue components implement the [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) and the `is` special attribute. However, there are a few key differences:

1. The Web Components Spec has been finalized, but is not natively implemented in every browser. Safari 10.1+, Chrome 54+ and Firefox 63+ natively support web components. In comparison, Vue components don't require any polyfills and work consistently in all supported browsers (IE9 and above). When needed, Vue components can also be wrapped inside a native custom element.

2. Vue components provide important features that are not available in plain custom elements, most notably cross-component data flow, custom event communication and build tool integrations.

Although Vue doesn't use custom elements internally, it has [great interoperability](https://custom-elements-everywhere.com/#vue) when it comes to consuming or distributing as custom elements. Vue CLI also supports building Vue components that register themselves as native custom elements.

## Ready for More?

We've briefly introduced the most basic features of Vue.js core - the rest of this guide will cover them and other advanced features with much finer details, so make sure to read through it all!

<div id="video-modal" class="modal"><div class="video-space" style="padding: 56.25% 0 0 0; position: relative;"><iframe src="https://player.vimeo.com/video/247494684" style="height: 100%; left: 0; position: absolute; top: 0; width: 100%; margin: 0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script><p class="modal-text">Video by <a href="https://www.vuemastery.com" target="_blank" rel="noopener" title="Vue.js Courses on Vue Mastery">Vue Mastery</a>. Watch Vue Mastery’s free <a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="noopener" title="Vue.js Courses on Vue Mastery">Intro to Vue course</a>.</div>
