---
title: Vue Örneği
type: guide
order: 3
---

## Bir Vue Örneği Oluşturmak

Her Vue uygulaması `Vue` fonksiyonu kullanılarak yeni bir **Vue örneğinin** oluşturulması ile başlar:

```js
var vm = new Vue({
  // seçenekler
})
```

Her ne kadar [MVVM deseni](https://en.wikipedia.org/wiki/Model_View_ViewModel)'ni sıkı sıkıya takip etmese de Vue'nin tasarımı kısmen bu desenden ilham almıştır. Teknik jargon olarak Vue örneğine hitap etmek için genellikle `vm` (ViewModel'in kısaltması) değişkenini kullanılırız.

Bir Vue örneği oluşturduğunuzda bir **seçenekler nesnesi** parametre olarak girilir. Bu kılavuzun büyük bir çoğunluğu söz konusu bu seçenekleri arzu ettiğiniz davranışı elde etmek üzere nasıl kullanabileceğinizi tarif eder. Referans olarak kullanmak üzere seçeneklerin tam bir listesini [API referansı](../api/#Options-Data)nda bulabilirsiniz.

Bir Vue uygulaması `new Vue` komutu ile yaratılan bir **ana Vue örneğinden** oluşur ve arzu edildiği takdirde birbiri içerisinde ve farklı projelerde kullanılabilen bileşenler halinde organize edilebilir. Örneğin bir yapılacaklar listesi uygulamasının bileşen ağacı şuna benzeyebilir:

```
Ana Örnek
└─ TodoList
   ├─ TodoItem
   │  ├─ DeleteTodoButton
   │  └─ EditTodoButton
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
```

[Bileşenler sistemine](components.html) ileride daha detaylı bir şekilde değineceğiz. Şimdilik her Vue bileşeninin aynı zamanda bir Vue örneği olduğunu ve dolayısıyla aynı seçenekler nesnesini (ana örneğe özgü birkaç seçenek dışında) kabul ettiğini aklınızda bulundurun.

## Veriler ve Metodlar

Bir Vue örneği oluşturulduğunda `data` nesnesi içerisindeki tüm nitelikler Vue'nin **otomatik tepki sistemine** eklenir. Bu niteliklerin değeri değiştiğinde ekrana yansıtılan görüntü "tepki gösterecek" ve yeni değerleri yansıtmak üzere kendisini güncelleyecektir.  

```js
// Data nesnemiz
var data = { a: 1 }

// Nesneyi, Vue örneğine ekliyoruz 
var vm = new Vue({
  data: data
})

// Örnek içerisindeki niteliği kullanmak 
// aşağıdaki ifade orijinal data nesnesindeki veriyi gönderir
vm.a == data.a // => true

// Örnek içerisinde niteliği tayin etmek 
// orijinal data nesnesini de etkiler 
vm.a = 2
data.a // => 2

// ... bunun tam tersi de geçerlidir
data.a = 3
vm.a // => 3
```

Bu veri nesnesi ne zaman değişirse ekrana yansıtılan görüntü de güncellenecektir. `data` içerisindeki niteliklerin **otomatik tepki** gösterebilmesi için söz konusu örnek yaratıldığı sırada mevcut olmaları gerektiğini unutmayın. Mesela aşağıdaki şekilde yeni bir nitelik eklediğimizi farz edelim:

```js
vm.b = 'selam'
```

Bu durumda `b` üzerinde gerçekleştirilen değişiklikler herhangi bir görüntü güncellemesini tetiklemeyecektir. Eğer ileride bir niteliğe ihtiyaç duyacağınızı biliyorsanız fakat bu niteliğin başlangıçta boş olması veya mevcut olmaması gerekiyorsa bir başlangıç değeri belirlemeniz gerekecektir. Örneğin:

```js
data: {
  newTodoText: '',
  visitCount: 0,
  hideCompletedTodos: false,
  todos: [],
  error: null
}
```

Bunun tek istisnası `Object.freeze()` komutunun kullanılmasıdır. Bu durumda mevcut niteliklerdeki değişimler engellenir ve otomatik tepki sistemi değişiklikleri _takip edemez_.

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
  <!-- aşağıdaki işlem `foo`yu güncelleyemecektir! -->
  <button v-on:click="foo = 'baz'">Değiştir</button>
</div>
```

Veri niteliklerine ek olarak Vue örnekleri birçok farklı örnek niteliklerine ve metodlarını kullanıma sunar. Kullanıcı tarafından belirlenen niteliklerden ayırt edilmeleri amacıyla `$` ön eki ile kullanılırlar. Örneğin:

```js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // => true
vm.$el === document.getElementById('example') // => true

// $watch bir örnek metodudur
vm.$watch('a', function (newValue, oldValue) {
  // Bu callback metodu `vm.a` değiştiğinde çağrılacaktır
})
```

İhtiyaç duyduğunuzda [API referansı](../api/#Instance-Properties) sayfasında örnek niteliklerinin ve metodlarının tam bir listesini bulabilirsiniz.

## Örnek Yaşam Döngüsü Kancaları  

Her Vue örneği yaratıldığı sırada bir dizi başlatma adımlarından geçer - Örneğin veri gözlem mekanizmasını kurar, şablon derlemesini gerçekleştirir, örneği DOM'a enjekte eder ve veri değiştiğinde DOM'u günceller. Bu sırada kullanıcıların belirli aşamalarda kendi kodlarını ekleyebilmesi için **yaşam döngüsü kancaları** adı verilen fonksiyonları yerine getirir.

Örneğin [`created`](../api/#created) kancası belirli bir kodun bir örnek yaratıldıktan sonra işleme alınması için kullanılabilir:

```js
new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` ıfadesi mevcut vm örneğini temsil eder
    console.log('a\'nın değeri: ' + this.a)
  }
})
// => "a'nın değeri: 1"
```

Örneğin yaşam döngüsünün farklı aşamalarında çağrılan diğer birçok kanca mevcuttur. Örneğin [`mounted`](../api/#mounted), [`updated`](../api/#updated), ve [`destroyed`](../api/#destroyed). Bütün yaşam döngüsü kancaları ait oldukları Vue örneğini temsil eden `this` bağlamı ile çağrılır.

<p class="tip">Seçenek nitelikleri ve callback metodları üzerinde `created: () => console.log(this.a)` veya `vm.$watch('a', newValue => this.myMethod())` gibi [ok fonksiyonları](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) kullanmayın. Ok fonksiyonları bir üst seviyedeki bağlama ait olduklarından `this` ifadesi umduğunuz gibi Vue örneğine karşılık gelmeyecektir ve sık sık `Uncaught TypeError: Cannot read property of undefined` ve `Uncaught TypeError: this.myMethod is not a function` gibi hatalara neden olacaktır.</p>

## Yaşam Döngüsü Şeması

Aşağıda örnek yaşam döngüsüne ait bir şema bulabilirsiniz. Burada olup biten her şeyi tam olarak anlamız gerekiyor. Fakat öğrenme sürecinizde ve projelerinizde yararlı bir referans olacaktır.

![Vue Örneği Yaşam Döngüsü](/images/lifecycle.png)
