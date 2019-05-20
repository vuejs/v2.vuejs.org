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
  <button v-on:click="reverseMessage">Мэссэжийг урвуугаар харуулах</button>
</div>
```
``` js
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Сайн уу Vue.js!'
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
  <button v-on:click="reverseMessage">Мэссэжийг урвуугаар харуулах</button>
</div>
<script>
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Сайн уу Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Энэ аргын хувьд бид DOM-тэй холбогдохгүйгээр манай аппликешны төлөвийг шинэчилдэг. DOM-ийн бүх үйлдлүүд нь Vue-аар зохицуулдаг бөгөөд таны бичих код нь үндсэн логик дээр төвлөрдөг.

Vue нь `v-model` directive зааж өгдөг бөгөөд энэ нь form input болон app state хоорондын холболтыг зохицуулдаг.

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
    message: 'Сайн уу Vue!'
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
    message: 'Сайн уу Vue!'
  }
})
</script>
{% endraw %}

## Composing with Components

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQVkA3" target="_blank" rel="noopener noreferrer">Scrimba дээрх хичээлийг үзнэ үү</a></div>

Component систем нь Vue-д бас нэг чухал ойлголт юм. Энэ нь жижиг, бие даасан, дахин ашиглагдах боломжтой бүрэлдэхүүн хэсгүүдээс бүрдсэн томоохон хэмжээний програмуудыг бий болгох боломжийг олгодог хийсвэрлэл юм. Энэ бүх төрлийн програмын интерфейсийг жижиг бүрэлдэхүүн хэсгүүд болгон хөгжүүлэх боломж олгоно:

![Component Tree](/images/components.png)

Vue-д component хэсэг нь шинж чанарууд болон нөхцөлүүдийг нь урьдчилан тодорхойлсон загварууд юм. Vue апп дээрээ component-уудыг шууд дуудаж ашиглаж болно:

``` js
// todo-item нэртэй шинэ component үүсгэе
Vue.component('todo-item', {
  template: '<li>Энэ бол todo</li>'
})
```

Одоо та өөр component эсвэл template дээр ашиглаж болно:

``` html
<ol>
  <!-- todo-item component-ийг үүсгэх -->
  <todo-item></todo-item>
</ol>
```

Гэвч энэ нь бүх todo дээр ижил текст харуулна. Бид parent scope-оос child component-уудад өгөгдөл дамжуулах чадвартай байх ёстой. Бид component-уудаа өөрчилж [prop](components.html#Props) шинж чанарыг тодорхойлж өгөх ёстой:

``` js
Vue.component('todo-item', {
  // Энэхүү todo-item component одоо "prop" авах боломжтой боллоо
  // Энэ нь дурын онцлог шинж чанарыг тодорхойлж өгөх боломжтой.
  // Доорх prop-ийг todo гэж дуудая.
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

Одоо бид `v-bind` хэмээх тодорхойлолт ашиглан component дуудагдах бүрт todo дамжуулах боломжтой:

``` html
<div id="app-7">
  <ol>
    <!--
      Одоо бид todo-item бүрт todo объект тодорхойлж өгч болно. 
      Ингэснээр өгөгдөл нь динамик байх боломжтой болно. 
      Бид бүр component бүрийг "key" -ээр хангах хэрэгтэй 
      бөгөөд үүнийг дараа тайлбарлах болно.
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
      { id: 0, text: 'Байцаа' },
      { id: 1, text: 'Бяслаг' },
      { id: 2, text: 'Идэх зүйл' }
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
      { id: 0, text: 'Байцаа' },
      { id: 1, text: 'Бяслаг' },
      { id: 2, text: 'Идэх зүйл' }
    ]
  }
})
</script>
{% endraw %}

Дээрх жишээ нь зохиомол жишээ бөгөөд, бид өөрсдийн аппаа хоёр жижиг нэгж болгон нь салгаж чадсан, child нь props interface-ээр дамжуулан parent component-тэй харилцах боломжтой. Бид одоо parent app-г сайжруулахгүйгээр `<todo-item>` component-ийг илүү боловсронгуй загвар, логикоор сайжруулах боломжтой.

Том хэмжээний програмуудын хөгжүүлэлтийг илүү уян хатан сайжруулахад хялбар байлгахын тулд олон жижиг хэсэгүүд болгон хуваах хэрэгтэй болдог. Бид component-ийн тухай олон ярилцах болно [энэхүү тодорхойлолтыг харна уу](components.html), дараах апп нь олон жижиг component болгох задалсан үед ямар харагдахыг харуулсан жишээ юм:

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

Vue component-ууд нь [Web Components Spec](https://www.w3.org/wiki/WebComponents/)-ийн хэсэг болох **Custom Elements**-тэй төстэй. Vue's component syntax нь spec-ийн дараагаар загварчлагдсан байдаг. Жишээ нь, Vue component-ууд [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) болон `is` албан ёсны attribute ашигладаг. Гэсэн хэдий ч хэд хэдэн гол ялгаа байдаг:

1. The Web Components Spec дууссан боловч, бүх хөтөч дээр хэрэгжүүлэх боломжгүй байна. Safari 10.1+, Chrome 54+ болон Firefox 63+ web component дэмждэг. Харьцуулбал, Vue component нь ямар нэг polyfill шаардлагагүй ба (IE9 болон түүнээс дээш) бүх хөтөч дээр ажиллах боломжтой. Шаардлагатай бол, Vue component-ийг native custom element дотор ашиглаж болно.

2. Vue component-ууд нь энгийн custom element-үүдэд байдаггүй олон чухал боломжуудыг өөртөө агуулдаг, өгөгдөл дамжуулах, custom event-тэй харилцах болон build tool integration хийх.

Vue тодроо custom element ашигладаггүй, гэвч [great interoperability](https://custom-elements-everywhere.com/#vue) custom elements ашиглах үед. Vue CLI нь custom elements-ийг Vue component болгон бүртгэдэг.

## Дэлгэрэнгүй мэдээлэл авах?

Бид Vue.js core-ийн хамгийн чухал үндсэн функцуудыг товч танилцуулсан - энэхүү гарын авлагын үлдсэн хэсэг нь эдгээр болон бусад дэвшилтэт функцуудыг илүү нарийвчилсан мэдээлэлтэй хамрах бөгөөд тэдгээрийг бүгдийг нь уншихаа мартуузай!

<div id="video-modal" class="modal"><div class="video-space" style="padding: 56.25% 0 0 0; position: relative;"><iframe src="https://player.vimeo.com/video/247494684" style="height: 100%; left: 0; position: absolute; top: 0; width: 100%; margin: 0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script><p class="modal-text">Video by <a href="https://www.vuemastery.com" target="_blank" rel="noopener" title="Vue.js Courses on Vue Mastery">Vue Mastery</a>. Watch Vue Mastery’s free <a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="noopener" title="Vue.js Courses on Vue Mastery">Intro to Vue course</a>.</div>
