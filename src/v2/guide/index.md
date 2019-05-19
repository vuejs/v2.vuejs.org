---
title: Giriş
type: guide
order: 2
---

## Vue.js nedir?

Vue (/viyuv/ şeklinde telaffuz edilir, İngilizcedeki view kelimesi gibi) kullanıcı arayüzleri oluşturmayı sağlayan kademeli bir uygulama çerçevesidir (framework). Yazılım geliştirme ortamının her alanına nüfus eden diğer uygulama çerçevelerinin aksine Vue, basit bir temel üzerine inşa edildiğinden kademeli olarak kullanılabilir. Ana kütüphane yalnızca görüntüleme katmanına odaklanmaktadır. Öğrenmesi kolay olup diğer kütüphanelere ve mevcut projelere entegre edilebilir. Diğer taraftan, Vue [modern dosya yönetimi](single-file-components.html) ve [destekleyici kütüphaneler](https://github.com/vuejs/awesome-vue#components--libraries) eşliğinde sofistike Tek Sayfa Uygulamalar yaratmak için tamamen uygundur.

Eğer Vue öğrenmeye başlamadan önce daha fazla bilgi edinmek isterseniz, bu teknolojinin temel prensiplerinin dile getirildiği ve örnek bir projenin sunulduğu <a id="modal-player"  href="#">bir video hazırladık</a>.

Eğer kullanıcı arayüzü programcılığı alanında deneyimli iseniz ve Vue'nin diğer kütüphaneler/uygulama çerçevelerine göre bir karşılaştırmasını görmek istiyorsanız [Diğer Uygulama Çerçeveleri ile Karşılaştırma](comparison.html) sayfasına bakınız.

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="noopener" title="Ücretsiz Vue.js Dersi">Vue Mastery’de ücretsiz bir ders videosu izleyebilirsiniz</a></div>

## İlk Adımlar

<a class="button" href="installation.html">Kurulum</a>

<p class="tip">Sitemiz üzerinde sunulan kılavuz HTML, CSS ve JavaScript alanlarında orta seviye bilgiye sahip olduğunuzu varsaymaktadır. Eğer kullanıcı arayüzü programcılığına yeni giriş yapıyorsanız ilk adım olarak bir uygulama çerçevesi öğrenmeye çalışmak doğru olmayabilir. Öncelikle o alanlardaki temel bilgileri öğrenin. Ardından bu kılavuza geri dönebilirsiniz!  Diğer uygulama çerçeveleri alanında deneyim işinize yarayacaktır ancak zorunlu değildir.</p>

Vue.js'i denemenin en kolay yolu [JSFiddle Hello World örneği](https://jsfiddle.net/chrisvfritz/50wL7mdz/).'ne bakmaktır. Bu sayfayı başka bir sekmede açarsanız değineceğimiz birtakım basit örneklere daha yakından göz atabilirsiniz. Veya bir <a href="https://gist.githubusercontent.com/chrisvfritz/7f8d7d63000b48493c336e48b3db3e52/raw/ed60c4e5d5c6fec48b0921edaed0cb60be30e87c/index.html" target="_blank" download="index.html" rel="noopener noreferrer"><code>index.html</code> sayfası oluşturduktan</a> sonra Vue'yi aşağıdaki bağlantı ile projeye dâhil edebilirsiniz:

``` html
<!-- geliştirme versiyonu, yardımcı konsol uyarıları içerir -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

veya:

``` html
<!-- son kullanıcı versiyonu, boyut ve hız açısından optimize edilmiştir -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

[Kurulum](installation.html) sayfası Vue'nin kurulumuna dair ilave seçenekleri açıklar. Not: Özellikle Node.js bazlı proje kurma araçlarına henüz alışkın değilseniz başlangıç seviyesinde `vue-cli` kullanmanızı tavsiye **etmiyoruz**.

Eğer daha etkileşimli bir ortamı tercih ederseniz, bir taraftan ekran paylaşımlı ders diğer taraftan dilediğiniz anda durdurup kodu değiştirebileceğiniz bir deney ortamı sunan [şu Scrimba ders serisine](https://scrimba.com/playlist/pXKqta) göz atabilirsiniz.

## Beyansal Görüntüleme

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cQ3QVcr" target="_blank" rel="noopener noreferrer">Bu derse Scrimba üzerinde göz atın</a></div>

Verileri basit bir şablon sentaksı kullanarak DOM'a beyansal olarak yansıtmayı sağlayan bir sistem Vue.js'nin kalbinde yatmaktadır:

``` html
<div id="app">
  {{ message }}
</div>
```
``` js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Merhaba Vue!'
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
    message: 'Merhaba Vue!'
  }
})
</script>
{% endraw %}

Bu şekilde ilk Vue uygulamamızı yaratmış olduk! Bu teknik, bir dizgi şablonunun ekrana yansıtılmasına oldukça benzemektedir fakat Vue arka planda birçok şey gerçekleştirmektedir. Şu anda veriler ve DOM arasında bir bağlantı kurulmuş ve her şey **reaktif** bir hale gelmiş durumda. Kendi gözlerinizle görmeye ne dersiniz? Tarayıcınızın JavaScript konsolunu açın (doğrudan bu sayfaya ait konsol) ve `app.message` değişkenine farklı bir değer verin. Yukarıda ekrana yansıtılmış olan örneğin girdiğiniz değere göre değiştiğini göreceksiniz.

Metin değerlerinin takibine ek olarak aşağıda görebileceğiniz şekilde HTML öğesi niteliklerini de değişkenlere bağlayabilirsiniz:

``` html
<div id="app-2">
  <span v-bind:title="message">
    Fare imlecini üzerimde birkaç saniye bekleterek dinamik
    bir şekilde bağlanmış "title" niteliğini görebilirsin!
  </span>
</div>
```
``` js
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: Bu sayfayı şu zamanda yüklediniz: ' + new Date().toLocaleString()
  }
})
```
{% raw %}
<div id="app-2" class="demo">
  <span v-bind:title="message">
    Fare imlecini üzerimde bekleterek dinamik bir şekilde bağlanmış "title" niteliğini görebilirsin!
  </span>
</div>
<script>
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: Bu sayfayı şu zamanda yüklediniz: ' + new Date().toLocaleString()
  }
})
</script>
{% endraw %}

Burada yeni bir şeye tanıklık ediyoruz. Bu kod parçasında kullanılan `v-bind` niteliğine **direktif** denilir. Direktifler, Vue çerçevesinde özel bir nitelik olduğunu belirten `v-` ifadesi ile başlar ve sizin de tahmin edebileceğiniz gibi ekrana yansıtılan DOM mimarisi üzerinde özel bir reaktivite tesis eder. Yukarıda görmekte olduğunuz kullanım "söz konusu HTML elementinin `title` niteliğini Vue örneğindeki (Vue instance) `message` özelliği ile birebir aynı tut" anlamına geliyor.

Eğer yine JavaScript konsolunu açarsanız ve `app2.message = 'dilediğiniz yeni bir mesaj'` komutunu girerseniz bağlanmış olan HTML elementinin - bu durumda `title` niteliğinin - güncelleneceğini göreceksiniz.

## Koşullar ve Döngüler

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQe4SJ" target="_blank" rel="noopener noreferrer">Bu derse Scrimba üzerinde göz atın</a></div>

Bir elementin görünürlüğünü değiştirmek de son derece kolay:

``` html
<div id="app-3">
  <span v-if="seen">Şu an beni görüyorsun</span>
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
  <span v-if="seen">Şu an beni görüyorsun</span>
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

Şimdi konsolu açın ve `app3.seen = false` komutunu girin. Mesajın kaybolacağını göreceksiniz.

Bu örnek yalnızca metin ve niteliklerin değil, aynı zamanda bütün DOM **yapısının** değişkenlere bağlanabileceğini göstermektedir. Vue aynı zamanda HTML elementlerinin Vue tarafından eklenmesi/güncellenmesi/kaldırılması sırasında otomatik olarak [geçiş efektlerinin](transitions.html) uygulanmasını sağlayan güçlü bir geçiş sistemi temin etmektedir.

Her biri farklı bir işleve bir dizi direktif mevcuttur. Örneğin, `v-for` direktifi bir Veri Dizisi içerisindeki verileri kullanarak ekranda bir liste görüntülemek için kullanılabilir:  

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
      { text: 'JavaScript Öğren' },
      { text: 'Vue Öğren' },
      { text: 'Harika bir proje gerçekleştir' }
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
      { text: 'JavaScript Öğren' },
      { text: 'Vue Öğren' },
      { text: 'Harika bir proje gerçekleştir' }
    ]
  }
})
</script>
{% endraw %}

Konsolu açıp `app4.todos.push({ text:  'Yeni liste elemanı' })` yazın. Yeni liste elemanının listeye eklendiğini göreceksiniz.

## Kullanıcı Girdilerini Yönetmek

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/czPNaUr" target="_blank" rel="noopener noreferrer">Bu derse Scrimba üzerinde göz atın</a></div>

Kullanıcıların uygulamanız ile etkileşim gerçekleştirmesini sağlamak için Vue örneklerimize ait yöntemleri çağıran olay dinleyicilerini entegre etmek için `v-on` direktifini kullanabiliriz:

``` html
<div id="app-5">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Mesajı Tersine Çevir</button>
</div>
```
``` js
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Merhaba Vue.js!'
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
  <button v-on:click="reverseMessage">Mesajı Tersine Çevir</button>
</div>
<script>
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Merhaba Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Dikkat ederseniz yukarıdaki bu yöntem sayesinde DOM'a dokunma ihtiyacı duymadan uygulamamızın durumunu güncelleyebildik; DOM ile gerçekleştirilmesi gereken tüm etkileşimler Vue tarafından yönetiliyor ve sizin yazdığınız kod da uygulamanızın altında yatan mantığa odaklanıyor.

Vue aynı zamanda form girdileri ile uygulamanızın durumu arasında iki yönlü etkileşimi çocuk oyuncağı haline getiren `v-model` direktifini de size sunuyor:

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
    message: 'Merhaba Vue!'
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
    message: 'Merhaba Vue!'
  }
})
</script>
{% endraw %}

## Bileşenler ile Proje İnşası

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQVkA3" target="_blank" rel="noopener noreferrer">Bu derse Scrimba üzerinde göz atın</a></div>

Bileşen sistemi Vue içerisinde önem taşıyan bir diğer konsepttir. Bu soyutlama yaklaşımı küçük, kendine yeten ve çoğu zaman yeniden kullanılabilen bileşenleri bir araya getirerek büyük çaplı uygulamalar inşa etmeyi sağlar. Düşünecek olursak her türden uygulama bir bileşenler ağacı olarak soyutlanabilir:

![Bileşen Ağacı](/images/components.png)

Vue çerçevesinde bir bileşen, önceden belirlenmiş seçeneklere sahip bir Vue örneğidir. Vue içerisinde bir bileşen oluşturmak son derece basit:

``` js
// todo-item isimli yeni bir bileşen belirlemek
Vue.component('todo-item', {
  template: ‘<li>Yapılacaklar listesi elemanı</li>'
})
```

Bunun ardından bir başka bileşenin şablon metni içerisinde bu bileşeni dahil edebilirsiniz:

``` html
<ol>
  <!-- todo-item bileşeninin bir örneğini oluşturmak -->
  <todo-item></todo-item>
</ol>
```

Fakat bu örnek her kullanımda aynı metni ekrana yansıtacağından çok yararlı olmayacaktır. Bizim amacımız bir üst kademeden bu bileşene veri aktarabilmektir. Bileşen beyanını biraz değiştirerek bir [prop](components.html#Props) kabul etmesini sağlayalım:

``` js
Vue.component('todo-item', {
  // todo-item bileşeni şu anda bizim belirlediğimiz bir HTML 
  // niteliği olarak hareket edecek olan bir "prop" kabul ediyor.
  // Bu prop'a todo adını verdik.
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

Şimdi `v-bind` direktifini kullanarak tekrar eden her bileşen içerisinde todo niteliğini tayin edebiliriz:

``` html
<div id="app-7">
  <ol>
    <!--
      Aşağıda her todo-item'a temsil etmekte olduğu todo nesnesini     
      aktarıyoruz. Böylece todo-item dinamik bir hale geliyor.
      Aynı zamanda her bileşene bir "key" (anahtar) veriyoruz.
      Bu işlemin amacını daha sonra açıklayacağız.
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
      { id: 0, text: 'Sebze' },
      { id: 1, text: 'Peynir' },
      { id: 2, text: 'İnsanların yiyebileceği diğer herhangi bir şey' }
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
      { id: 0, text: 'Sebze' },
      { id: 1, text: 'Peynir' },
      { id: 2, text: 'İnsanların yiyebileceği diğer herhangi bir şey' }
    ]
  }
})
</script>
{% endraw %}

Bu çok gerçekçi bir örnek olmasa da uygulamamızı iki parçaya ayırabildik ve alt konumdaki bileşen üst kademeden prop arayüzü sayesinde yeterli ölçüde ayrılmış durumda. Bu sayede üst kademedeki uygulamayı etkilemeden `<todo-item>` bileşenimizi daha kompleks bir şablon ve mantık ile geliştirebiliriz.

Büyük çaplı bir uygulamada geliştirme sürecini daha kolay yönetebilmek amacıyla bütün uygulamayı farklı bileşenlere bölmek önem taşır. [Kılavuzun ilerleyen kısımlarında](components.html) bileşenlere daha yakından göz atacağız fakat bir uygulama şablonunun bileşenler aracılığı ile nasıl inşa edilebileceğine dair (teorik) bir örneği aşağıda bulabilirsiniz:

``` html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### Özel HTML Elementlerine Benzerlik

Vue bileşenlerinin, [Web Bileşenleri Standartları](https://www.w3.org/wiki/WebComponents/)nın bir parçası olan **Özel HTML Elementleri**ne son derece benzer olduğunu fark etmiş olabilirsiniz. Bunun sebebi Vue'nin bileşen sentaksının kabaca söz konusu standart baz alınarak modellenmiş olmasıdır. Örneğin Vue bileşenleri [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md)'yi ve `is` özel niteliğini desteklemektedir. Fakat birtakım kilit farklılıklar da mevcuttur:

1. Web Bileşenleri Standartları tamamlanmış olsa da her tarayıcıda otomatik olarak desteklenmemektedir. Web bileşenlerini otomatik olarak destekleyen tarayıcılar Safari 10.1 ve üstü, Chrome 54 ve üstü, Firefox 63 ve üstüdür. Buna karşılık, Vue bileşenleri polyfill uygulanmasını gerektirmez ve bütün tarayıcılarda desteklenmektedir (IE9 ve üstü). Gerek olduğunda Vue bileşenleri özel HTML elementi içerisine yerleştirilebilir.

2. Vue bileşenleri sıradan özel elementlerde yer almayan birçok önemli özelliğe sahiptir. Bunların başında ise bileşenlerarası veri akışı, kendi olay iletişimini tasarlama imkanı ve proje kurma araçlarının entegrasyonu geliyor.

Vue, özel HTML elementlerini kendi içerisinde kullanmasa da, özel HTML elementi olarak tüketim ve dağıtım gerçekleştirme açısından [güçlü bir çapraz kullanım kapasitesine](https://custom-elements-everywhere.com/#vue) sahiptir. Aynı zamanda Vue CLI, gerçek bir özel HTML elementi olarak tanımlanan Vue bileşenlerinin tasarlanmasına müsaade etmektedir.

## Daha fazlası için hazır mısınız?

Bu yazı içerisinde ana Vue.js kütüphanesinin en temel özelliklerine değindik. Bu kılavuzun geri kalan kısımlarında bu konseptler ve diğer ileri düzey özellikler çok daha detaylı bir şekilde ele alınacak. Bu kılavuzun tamamını okumanızı tavsiye ederiz!

<div id="video-modal" class="modal"><div class="video-space" style="padding: 56.25% 0 0 0; position: relative;"><iframe src="https://player.vimeo.com/video/247494684" style="height: 100%; left: 0; position: absolute; top: 0; width: 100%; margin: 0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script><p class="modal-text"><a href="https://www.vuemastery.com" target="_blank" rel="noopener" title="Vue Mastery’deki Vue.js Dersleri">Vue Mastery</a> videosu. Vue Mastery’nin ücretsiz <a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="noopener" title="Vue.js Courses on Vue Mastery">Vue’ye giriş dersi</a>ni izleyin.</div>
