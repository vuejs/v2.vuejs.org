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

## İstifadəçinin daxil etdiyini məlumatlar

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/czPNaUr" target="_blank" rel="noopener noreferrer">Dərsə Scrimba ilə bax</a></div>

İstifadəçi hərəkətlərinin tətbiq ilə əlaqə qurmasını təmin etmək üçün `v-on` direktivi istifadə edilir cari direktiv bizim Vue nümunəmizdəki eventlərlə onların dinləyicilərini əlaqələnidirir :

``` html
<div id="app-5">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Mətni tərsinə çevir</button>
</div>
```
``` js
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Salam Vue.js!'
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
  <button v-on:click="reverseMessage">Mətni tərsinə çevir</button>
</div>
<script>
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Salam Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Qeyd edək ki, nümunədəki dəyişim DOM-a toxunulmadan yerinə yetirilmişdir.DOM-a aid işlər Vue tərəfindən həll edilir və sizin yazdığınız kodlar bu məqsədə yönəlir.

Vue istifadəçi girişi və state arasında iki tərəfli bağlantını təmin etmək üçün `v-model` direktivini təmin edir:

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
    message: 'Salam Vue!'
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
    message: 'Salam Vue!'
  }
})
</script>
{% endraw %}

## Komponentlərlə işləmək

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQVkA3" target="_blank" rel="noopener noreferrer">Dərsə Scrimba ilə bax</a></div>

Komponent sistemi Vue-də vacib mövzulardan biridir,komponentlər kiçik,müstəqil və yenidən istifadə edilən hissələrdir, böyük layihələrlə işləməyə imkan verir.Bu haqda düşünsək, demək olar bütün növ tətbiqlərin ön görüntüsü komponent ağacı kimi təsəvvür oluna bilər :

![Komponent ağacı](/images/components.png)

Vue-də komponentlər öncədən seçimlərlə təmin edilmiş Vue nümunəsidir. Vue-də komponenti qeydiyyata almaq çox rahatdır:

``` js
// todo-item adında yeni komponent əlavə edirik
Vue.component('todo-item', {
  template: '<li>This is a todo</li>'
})

var app = new Vue(...)
```

İndi həmin komponenti başqa şablonda istifadə edə bilərik:

``` html
<ol>
  <!-- todo-item komponentinin nümunəsini yaradaq -->
  <todo-item></todo-item>
</ol>
```

Lakin bu addım hər bir komponent üçün eyni mətni göstərəcək, hansıkı bu istənilməyə bilər. İstəsək ana şablondan uşaq komponentə data ötürə bilərik.Kodlarımızı [prop](components.html#Props) qəbul etməyə uyğunlaşdıraq:

``` js
Vue.component('todo-item', {
  // todo-item komponent indi "props" qebul edir.
  // prop elementi öz attributu kimi tanıyır
  // istifadə etdiyimi prop todo adlanır.
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

İndi təkar istifadə etdiyimiz komponentlərə `v-bind` istifadə edərək məlumat ötürə bilərik:

``` html
<div id="app-7">
  <ol>
    <!--
      Artıq hər todo-item üçün todo obyektini ötürə bilərik
      bununla kontent dinamik hal alır
      Həmçninin hər komponent "key" (vacib açar söz) ilə
      təmin edilməlidir.
      Bu haqda sonradan danışılacaq.
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
      { id: 0, text: 'Tərəvəzlər' },
      { id: 1, text: 'Pendir' },
      { id: 2, text: 'İnsanların yeyə bildiyi başqa nələrsə' }
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
      { id: 0, text: 'Tərəvəzlər' },
      { id: 1, text: 'Pendir' },
      { id: 2, text: 'İnsanların yeyə bildiyi başqa nələrsə' }
    ]
  }
})
</script>
{% endraw %}

Bu gerçək nümunə olmasada tətbiqimizi iki hissəyə ayrılmış halda idarə edə bildik və propsun köməyi ilə alt hissə üstdən ayrılmış vəziyyətdədir.Bununla `<todo-item>` komponentini üst komponentdən asılı olmadan daha mürəkkəb şablon kimi inkişaf etdirə bilərik.

Böyük layihələrdə layihəni idarə etmək üçün layihəni kiçik komponentlərə bölmək zəruridir.Komponentlər haqqında daha sonra [bu mövzuda](components.html) danışacayıq, Aşağıda tətbiqin şablonda komponentlərlə necə işlədiyini nümunə kimi görə bilərik :

``` html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### Xüsusi elementlərlə əlaqə (HTML elementlər nəzərdə tutulub)

Biz artıq bilirik ki Vue komponentləri [Veb elementləri standartlarının](https://www.w3.org/wiki/WebComponents/) parçası olan **Xüsusi elemetlərə**  çox oxşayır.Bu ona görədir ki, Vuenin komponent sintaksisi həmin elemntlərdən sonra nümunə olaraq modelləşib. Nümunə, Vue komponentləri [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) və `is` xüsusi elementini dəstəkləməkdədir.Lakin, fərqliliklər mövcuddur:

1. Veb elementləri standartları yekunlaşıb lakin hələdə bir sira veb bələdçisi tərəfindən dəstəklənmir.Safari 10.1+, Chrome 54+ və Firefox 63+ veb komponentləri dəstəkləyir.Bunun əksi olaraq Vue komponentləri polyfill tələb etmir və bütün veb bələdçiləri dəstəkləyir (IE9 ve üstü). Ehtiyac olduqda Vue komponentləri xüsusi elementlərin içindədə yerləşə bilər.

2.Vue komponentləri adi elementlərin dəstəkləmədiyi bir çox funksionallığa malikdir.bunlardan vurğulanması ən lazımlılar kimi komponentlər arasında məlumat ötürülməsi,event/listener sistemi və layihə tikmə alətlərini göstərə bilərik.

Baxmayaraq ki Vue komponentləri hər yerdə istifadə edilə bilmir,Xüsusi element kimi tədarük edilməsi lazım olduqda o [çarpaz işləmə mexanizminə](https://custom-elements-everywhere.com/#vue) malikdir.VUE CLI(Command-Line-Interface / Əmrlər ilə idarəetmə interfeysi) Vue komponentlərin xüsusi element kimi qeydiyyata alınmasını dəstəkləyir.

## Daha çox öyrənməyə hazırsan ?

Qısaca Vue.js-in ən əsas xüsusiyyətlərini təqdim etdik  - bu bələdçinin davamı həmin mövzuları detallı şəkildə və digər üst səviyyə mövzularlı əhatə edəcək, əmin olun ki onların hamısını oxumusunuz!

<div id="video-modal" class="modal"><div class="video-space" style="padding: 56.25% 0 0 0; position: relative;"><iframe src="https://player.vimeo.com/video/247494684?dnt=1" style="height: 100%; left: 0; position: absolute; top: 0; width: 100%; margin: 0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script><p class="modal-text">Video by <a href="https://www.vuemastery.com" target="_blank" rel="sponsored noopener" title="Vue.js Courses on Vue Mastery">Vue Mastery</a>. Watch Vue Mastery’s free <a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="sponsored noopener" title="Vue.js Courses on Vue Mastery">Intro to Vue course</a>.</div>
