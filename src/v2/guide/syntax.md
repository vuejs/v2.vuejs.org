---
title: Şablon Sentaksı
type: guide
order: 4
---

Vue.js, ekrana yansıtılan DOM modelini arka plandaki Vue örneğine ait verilere beyansal olarak bağlamayı sağlayan HTML tabanlı bir şablon sentaksı kullanır. Her Vue.js şablonu geçerli bir HTML kodu olup standartlara uyum gösteren tarayıcılar ve HTML derleyiciler tarafından okunabilir.

Vue, şablonları kendiliğinden Sanal DOM modelleme fonksiyonları aracılığıyla derler. Otomatik tepki sisteminin de yardımıyla Vue yeniden modellenmesi gereken minimum sayıdaki bileşeni akıllıca tespit edebilir ve uygulamanın durumu değiştiğinde mümkün olan en az sayıda DOM değişikliğini gerçekleştirir.

Eğer Sanal DOM kavramlarına alışıksanız ve saf JavaScript’in gücünden yararlanmayı tercih ederseniz isteğe bağlı JSX desteği sayesinde şablona gerek olmaksızın [doğrudan modelleme fonksiyonları](render-function.html) yazabilirsiniz.

## Değişken değer takibi

### Metin

Veri bağlamanın en basit şekli “Bıyık” sentaksı (ikişer adet süslü parantez) ile yazılan metin değerlerinin takibidir.

``` html
<span>Mesaj: {{ msg }}</span>
```

Bıyık etiketiyle çevrili kısım ilgili bileşenin veri nesnesi içerisinde yer alan `msg` özelliğinin değeri ile değiştirilecektir. Söz konusu veri nesnesinin `msg` özelliği ne zaman değişirse bu metin de güncellenir.

Ayrıca [v-once direktifini](../api/#v-once) kullanarak değişken değerinin yalnızca bir defa kullanılmasını sağlayabilirsiniz. Fakat bu işlemin aynı HTML düğümü üzerindeki tüm bağlar üzerinde etkili olacağını unutmayın.

``` html
<span v-once>Bu asla değişmeyecektir: {{ msg }}</span>
```

### Saf HTML

Çift bıyık sentaksı verileri düz metin olarak yorumlar. HTML olarak değil. Gerçek HTML yazabilmek için `v-html` direktifini kullanmalısınız:

``` html
<p>Bıyık ile kullanım: {{ safHtml }}</p>
<p>v-html direktifi ile kullanım: <span v-html="safHtml"></span></p>
```

{% raw %}
<div id="example1" class="demo">
  <p>Bıyık ile kullanım: {{ rawHtml }}</p>
  <p>v-html direktifi ile kullanım: <span v-html="safHtml"></span></p>
</div>
<script>
new Vue({
  el: '#example1',
  data: function () {
    return {
      safHtml: ‘<span style="color: red">Bu metnin rengi kırmızı olmalı.</span>'
    }
  }
})
</script>
{% endraw %}

`span` içerisindeki metin `rawHtml` özelliğinin değeri ile değiştirilecektir ve bu metin saf HTML olarak yorumlanacak olup veri bağları dikkate alınmayacaktır. `v-html` direktifi içerisinde dinamik şablon oluşturmak mümkün değildir zira Vue, dizgi tabanlı bir şablon motoru değildir. Bunun yerine kullanıcı arayüzü elemanlarının yeniden kullanımı ve birlikte kullanımına yönelik temel birim olarak bileşenler kullanılmaktadır.

<p class="tip">İçeriği belirsiz HTML girdilerinin internet sitenizde dinamik olarak modellenmesi son derece tehlikeli olabilir zira kolayca [XSS zafiyetleri](https://tr.wikipedia.org/wiki/Siteler_aras%C4%B1_betik_%C3%A7al%C4%B1%C5%9Ft%C4%B1rma) ile sonuçlanabilir. HTML değerlerinin takibi işlevini yalnızca güvenilir içerikler üzerinde kullanın ve **asla** kullanıcı tarafından temin edilen içerik üzerinde kullanmayın.<Çp>

### HTML Nitelikleri

HTML nitelikleri içerisinde bıyık sentaksı kullanılamaz. Bunun yerine [v-bind direktifini](../api/#v-bind) kullanın:

``` html
<div v-bind:id="dinamikId"></div>
```

Mevcut olmaları `true` anlamına gelen boole nitelikleri için `v-bind` biraz farklı faaliyet göstermektedir. Aşağıdaki örneğe bakalım:

``` html
<button v-bind:disabled="butonAktifDegil">Buton</button>
```

Eğer `butonAktifDeğil` değişkeninin değeri `null`, `undefined` veya `false` olursa `disabled` niteliği, modellenen `<button>` elementine dahil bile edilmeyecektir.

### JavaScript İfadelerinin Kullanımı

Şu ana kadar şablonlarımızda basit özellik anahtarları üzerinde bağ gerçekleştirdik. Halbuki Vue.js veri bağları üzerinde JavaScript ifadelerinin sunduğu tüm gücü kullanmayı mümkün kılıyor:

``` html
{{ sayi + 1 }}

{{ ok ? 'EVET' : 'HAYIR' }}

{{ mesaj.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

Bu ifadeler bağlı oldukları Vue örneğinin veri kapsamı içerisinde JavaScript olarak değerlendirilecektir. Bu açıdan tek sınırlama her bağ içerisinde **yalnızca bir ifadenin** kullanılma zorunluluğudur. Yani aşağıdaki ifade **ÇALIŞMAYACAKTIR**:

``` html
<!-- Aşağıdaki kod bir ifade değil bir beyandır: -->
{{ var a = 1 }}

<!-- akış kontrolü de çalışmayacaktır, bunun yerine üç terimli ifadeleri kullanın -->
{{ if (ok) { return mesaj } }}
```

<p class="tip">Şablon ifadeleri dış ortamdan ayrılmış olup yalnızca `Math` ve `Date` gibi global değişkenleri içeren sınırlı bir listeye erişim sunar. Şablon ifadeleri içerisinde kullanıcı tarafından belirlenen global değişkenlere erişim gerçekleştirmeye çalışmayın.</p>

## Direktifler

Direktifler `v-` ön ekini kullanan özel niteliklerdir. Direktif nitelikleri, **tek bir JavaScript ifadesine** karşılık gelen bir değer içermelidir (`v-for` bu açıdan bir istisna olup buna aşağıda değineceğiz). Direktiflerin görevi, içerisindeki ifadenin değeri değiştiğinde bunun yan etkilerini DOM modeline reaktif olarak yansıtmaktır. Giriş bölümünde gördüğümüz örneği yeniden inceleyelim:

``` html
<p v-if="seen">Şu an beni görüyorsun</p>
```

Burada `v-if` direktifi, `<p>` elementini `seen` ifadesine ait değerin doğru olup olmadığını göre DOM’a ekler veya kaldırır.

### Argümanlar

Bazı direktifler, direktif adından sonra iki nokta ile işaret edilen bir “argüman” alabilir. Örneğin `v-bind` direktifi bir HTML niteliğini reaktif olarak güncellemek üzere kullanılır:

``` html
<a v-bind:href="url"> ... </a>
```

Burada `href`, `v-bind`’ın argümanı olarak kullanılıyor ve söz konusu elementin `href` niteliğini `url` ifadesinin değerine bağlıyor.

Bir diğer örnek DOM olaylarını dinleyen `v-on` direktifidir:

``` html
<a v-on:click="birSeyYap"> ... </a>
```

Burada argüman dinlenilecek olan olayın adıdır. Olay yönetimine ileride daha yakından değineceğiz.

### Dinamik Argümanlar

> 2.6.0+’dan itibaren

2.6.0 versiyonundan itibaren bir direktif argümanı içerisinde JavaScript ifadelerini köşeli bir parantez içerisinde kullanmak mümkün:

``` html
<a v-bind:[nitelikAdi]="url"> ... </a>
```

Burada `nitelikAdi` dinamik bir şekilde JavaScript ifadesi olarak değerlendirilecek ve tespit edilen değer bu argümanın nihai değeri olarak kullanılacak. Örneğin eğer Vue örneğiniz `"href"` değerine sahip `nitelikAdi` şeklindeki bir data niteliğine sahipse yukarıdaki bağ `v-bind:href`e denk olacaktır.

Aynı şekilde dinamik argümanlar sayesinde bir olay yöneticisini dinamik bir olay adına bağlayabilirsiniz:

``` html
<a v-on:[olayAdı]="birSeyYap"> ... </a>
```

Yine yukarıdaki gibi `olayAdi`'nın değeri `"focus"` ise `v-on:[eventName]` ifadesi `v-on:focus`a karşılık gelecektir.

#### Dinamik Argüman Değeri Kısıtlamaları

Dinamik argümanlar `null` dışında yalnızca dizgi olarak değerlendirilmesi beklenir. Söz konusu bağı kaldırabilmek için istinai olarak `null` kullanılmasına müsaade edilir. Bunun dışında dizgi olmayan tüm değerler bir uyarı verecektir.

#### Dinamik Argüman İfadesi Kısıtlamaları

<p class="tip">Dinamik argüman ifadeleri üzerinde bir takım sentaks kısıtlamaları mevcuttur zira HTML nitelik isimleri içerisinde boşluk veya tırnak gibi bazı karakterlerin kullanılması mümkün değildir. Ayrıca DOM içerisinde kullanılan şablonlarda büyük harf kullanılmamasına da dikkat etmelisiniz.</p>

Örneğin aşağıdaki ifade geçersizdir:

``` html
<!-- Bu bir derleyici uyarısını tetikleyecektir. -->
<a v-bind:['foo' + bar]="deger"> ... </a>
```

Bu uyarının ortaya çıkmasını engellemek için boşluk veya tırnak kullanmayın veya karmaşık ifadeleri hesaplanmış bir nitelik ile değiştirin.

Buna ek olarak DOM içerisinde şablon kullanıyorsanız (şablonunuzu doğrudan bir HTML dosyası içerisinde yazıyorsanız) tarayıcıların nitelik isimlerini küçük harf olarak düzelteceğini unutmayın:

``` html
<!-- Aşağıdaki ifade DOM içi şablonda v-bind:[birnitelik] şeklinde dönüştürülecektir. -->
<a v-bind:[birNitelik]="deger"> ... </a>
```

### Değiştiriciler

Değiştiriciler bir nokta ile gösterilen özel eklerdir ve bir direktifin özel bir şekilde bağlanması gerektiğini ifade eder. Örneğin `.prevent` değiştiricisi `v-on` direktifine tetiklenen olay üzerinde `event.preventDefault()` ifadesini çağırmasını söyler:

``` html
<form v-on:submit.prevent="onSubmit"> ... </form>
```

Söz konusu bölümlere geldiğimizde [`v-on`a](events.html#Event-Modifiers) ve [`v-model`e](forms.html#Modifiers) yönelik başka değiştirici örneklerini göreceksiniz.

## Kısaltmalar

`v-` ön eki şablonlarınızdaki Vue’ye özgü nitelikleri kolayca tespit edebilmeyi sağlayan görsel bir ipucu görevi görür. Hali hazırda yazılmış olan biçimli metinlere dinamik davranışlar eklemek için Vue.js’nin kullanılması sırasında yararlı olsa da direktiflerin sıkça kullanıldığı durumlarda metin kalabalığı yaratabilir. Aynı zamanda her şeyin Vue tarafından yönetildiği bir [SPA](https://tr.wikipedia.org/wiki/Tek_sayfa_uygulamas%C4%B1) geliştirdiğiniz sırada `v-` ön eki önemini kaybeder. Bu nedenle Vue en çok kullanılan iki direktif olan `v-bind` ve `v-on` için özel kısaltmalar sunar:

### `v-bind` Kısaltması

``` html
<!-- uzun sentaks -->
<a v-bind:href="url"> ... </a>

<!-- kısaltma -->
<a :href="url"> ... </a>

<!-- dinamik argümanlı kısatma (2.6.0+) -->
<a :[key]="url"> ... </a>
```

### `v-on` Kısaltması

``` html
<!-- uzun sentaks -->
<a v-on:click="birSeyYap"> ... </a>

<!-- kısaltma -->
<a @click="birSeyYap"> ... </a>

<!-- dinamik argümanlı kısatma (2.6.0+) -->
<a @[olay]="birSeyYap"> ... </a>
```

Bu kullanım normal HTML’den biraz farklı görünebilir ama `:` ve `@` karakterleri geçerli nitelik isimleri arasındadır ve Vue’nün desteklendiği tüm tarayıcılar tarafından doğru bir şekilde okunabilir. Ayrıca bunlar ekrana yansıtılan nihai biçimli metin içerisinde görüntülenmez. Kısaltma sentaksı isteğe bağlı olmakla beraber kullanımını daha yakından öğrendikçe hoşunuza gideceğini düşünüyoruz.
