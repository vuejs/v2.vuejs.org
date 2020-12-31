---
title: Təqdimat
type: guide
order: 2
---

## Vue.js nədir?

Vue (tələffüzü /vyuː/, ingilis sözü **view** kimi oxunur) istifadəçi interfeysi yaratmaq üçün **mütərəqqi freymvork-dur** .Digər monolitik freymworklardan fəqli olaraq , Vue sadə təməl üzərində inşa edildiyi üçün layihələrdə nisbətən (müyəən bir hissədə) istifadə edilə bilər.Ana kitabxana yalnız görüntü qatına fokuslanır, bu isə digər kitabxanalara və ya hazır layihələrə inteqrasiyanı asanlaşdırır.Digər tərəfdən,Vue [müasir alətlər](single-file-components.html) və [dəstəklənən kitabxanalar](https://github.com/vuejs/awesome-vue#components--libraries) ilə birlikdə istifadə edildikdə Tək Səhifəlik Tətbiqetmələr (Single-Page-Application) üçün mükəmməl yenilikci gücə malikdir.

Əgər Vue öyrənməyə başlamadan öncə Vue haqqında daha çox öyrənmək istəyirsinizsə, Biz əsas prinsipləri və nümunə layihələri əhatə edən <a id="modal-player"  href="#">video hazırlamışıq</a> baxa bilərsiniz.

Əgər siz daha profissional frontend-developersinizsə və Vue-nin digər kitabxana/framevorklarla müqayiyəsini görmək istiyirsinizsə, baxa bilərsiniz  [Digər framevorklar ilə müqayisə](comparison.html).

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="sponsored noopener" title="Free Vue.js Course">Vue Mastery-də ödənişsiz video kurs izlə</a></div>

## Başlayaq

<a class="button" href="installation.html">Quraşdırma</a>

<p class="tip">The official guide assumes intermediate level knowledge of HTML, CSS, and JavaScript. If you are totally new to frontend development, it might not be the best idea to jump right into a framework as your first step - grasp the basics then come back! Prior experience with other frameworks helps, but is not required.</p>

Vue.js-i yoxlamaq üçün ən rahat yol  [Salam Dünya Nümunəsini (Hello World example)](https://codesandbox.io/s/github/vuejs/vuejs.org/tree/master/src/v2/examples/vue-20-hello-world) istifadə etməkdir. Bu linki digər tabda açıb, mövzuladan bəhs etdikcə kod nümunələrinə nəzər yetirə bilərsiniz.  Və ya, yeni <a href="https://github.com/vuejs/vuejs.org/blob/master/src/v2/examples/vue-20-hello-world/index.html" target="_blank" download="index.html" rel="noopener noreferrer"> <code>index.html</code> faylı yaradın</a> yaradın və Vue-ni aşağıda qeyd edilən script vasitəsi ilə çağırın :

``` html
<!-- İnkişaf etdirmə mühitindədir , yardımçı konsol xəbərdarlıqları var -->
<script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
```

və ya:

``` html
<!-- İstehsalat mühitindədir, ölçü və sürət optimizasiya edilib -->
<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
```

[Quraşdırma](installation.html) səhifəsi Vue üçün başqa quraşdırma üsulları təqdim edir. Qeyd: Yeni başlayanlar üçün `vue-cli` istifadə etməyi **məsləhət görümürük**,xüsusi ilə əgər hələdə Node.js əsaslı quraşdırma alətləri ilə tanış deyilsinizsə.

Əgər siz daha interaktiv yolu seçmək istəsəniz. [bu video dərsələrə Scrimbada yerləşmiş](https://scrimba.com/g/gvuedocs) versiyada baxa bilərsiniz,Scrimbada screencast və kod ilə işləmə imkanı verir bununla siz istədiyiniz anda dayandırıb testlər edə bilərsiniz.

## Görüntünü bəyanatlaşdırmaq

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cQ3QVcr" target="_blank" rel="noopener noreferrer">Bu dərsdə Scimba isitfadə et</a></div>

Vue.js tərəfindən verilənləri sadə şablon sintaksisi ilə DOM'a bəyan edib əks etdirən sistem mövcuddur:

``` html
<div id="app">
  {{ message }}
</div>
```
``` js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
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
    message: 'Hello Vue!'
  }
})
</script>
{% endraw %}

Biz artıq ilk Vue tətbiq etməmizi yaratdıq! Bu hissə dəyişənin mətin şablonunda əvəzlənməsinə oxşayır, əslində isə Vue bu görüntünün arxasında bir çox iş yerinə yetirir. Hazırda data və DOM bir biri ilə əlaqələnib, və hər şey indi **reaktivdir**. Bunu əyani necə görək? İnternet bələdçinizin Javascipt konsolunu açin (cari səhifədə tətbiq edə bilərsiniz) açın və `app.message` əmri ilə yeni dəyər əlavə edin.Əmrə uyğun olaraq siz yenilənmiş dəyəri görəcəksiniz.
Qeyd etmək lazımdır ki, artıq HTML ilə bir başa əlaqəli yaratmamalıyıq.Vue özünu DOM elementi (bizim situasiyamızda `#app`) kimi əlavə edir və özü idarə edir. HTML bizim başlanğıc nöqtəmizdir, lakin qalan işlər yeni yaradılmış VUE xətti ilə həyatə keçir.

Mətinlərin əvəzlənməsinəndən əlavə olaraq,biz həmçinin HTML attributlarıda qeyd edilən kimi əlaqələndirə bilirik:

``` html
<div id="app-2">
  <span v-bind:title="message">
    Hover your mouse over me for a few seconds
    to see my dynamically bound title!
  </span>
</div>
```
``` js
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'You loaded this page on ' + new Date().toLocaleString()
  }
})
```
{% raw %}
<div id="app-2" class="demo">
  <span v-bind:title="message">
    Hover your mouse over me for a few seconds to see my dynamically bound title!
  </span>
</div>
<script>
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'You loaded this page on ' + new Date().toLocaleString()
  }
})
</script>
{% endraw %}

Burada biz yeniliklə qarşılaşırıq.Gördüyümüz `v-bind` atributu **direktiv** adlanır.Direktivlər `v-` başlanğıcı (prefiks) ilə başlanır ki,Vue tərəfindən xüsusi atribut olunduğu təyin edilsin,təxmin edildiyiz kimi,DOM üzərindən xüsusi bir aktivlik başlanır .Qısaca burda deyilir,"cari Vue nümunəsində (Vue instance) bu elementin `title` atributunun dəyərini `message` dəyişəni ilə eyni saxla".

Əgər siz yenidən Javascript konsolu açıb  `app2.message = 'some new message'` - bu kodu daxil etsəniz,siz görəcəksiniz ki `title` atributu daxil edilmiş verilənə uyğun yenilənib.

## Şərtlər və döngülər

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQe4SJ" target="_blank" rel="noopener noreferrer">Dərsə Scrimba ilə bax</a></div>

Elementin görünüb/görünməməyini dəyişmək çox rahatdır :

``` html
<div id="app-3">
  <span v-if="seen">Siz məni görürsüz</span>
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
  <span v-if="seen">Siz məni görürsünüz</span>
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

Başa qayıdaq və konsol ekran daxil edək `app3.seen = false` .Mətnin gizləndiyini görməlisiniz.

Bu nümunədən aydın olur ki, biz datanı mətin və attributlardan başqa  DOM-un **strukturu** ilədə bağlaya bilərik. Bununla yanaşı, Vue, HTML elementlərinin Vue tərəfindən əlavə edilməsi/yenilənməsi/silinməsi əməliyyatlarında [keçid effektlərini](transitions.html) təmin etmək üçün güclü sistemə malikdir.

Fərqli funksionallıqlara malik başqa direktivlərdə mövcuddur.Nümunə,  `v-for` direktivi massivdə olan məlumatların list kimi görünməsində istifadə edilir :

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
      { text: 'Javascritp öyrən' },
      { text: 'Vue öyrən' },
      { text: 'Gözəl layihələr yarat' }
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
      { text: 'Javascritp öyrən' },
      { text: 'Vue öyrən' },
      { text: 'Gözəl layihələr yarat' }
    ]
  }
})
</script>
{% endraw %}

Konsolda daxil edin : `app4.todos.push({ text: 'Yeni əşya' })`. Yeni elementin əlavə edildiyini görməlisiniz.

## Handling User Input

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/czPNaUr" target="_blank" rel="noopener noreferrer">Try this lesson on Scrimba</a></div>

To let users interact with your app, we can use the `v-on` directive to attach event listeners that invoke methods on our Vue instances:

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

var app = new Vue(...)
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

<div id="video-modal" class="modal"><div class="video-space" style="padding: 56.25% 0 0 0; position: relative;"><iframe src="https://player.vimeo.com/video/247494684?dnt=1" style="height: 100%; left: 0; position: absolute; top: 0; width: 100%; margin: 0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script><p class="modal-text">Video by <a href="https://www.vuemastery.com" target="_blank" rel="sponsored noopener" title="Vue.js Courses on Vue Mastery">Vue Mastery</a>. Watch Vue Mastery’s free <a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="sponsored noopener" title="Vue.js Courses on Vue Mastery">Intro to Vue course</a>.</div>
