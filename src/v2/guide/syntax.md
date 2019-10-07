---
title: Þablon Sentaksý
type: guide
order: 4
---

Vue.js, ekrana yansýtýlan DOM modelini arka plandaki Vue örneðine ait verilere beyansal olarak baðlamayý saðlayan HTML tabanlý bir þablon sentaksý kullanýr. Her Vue.js þablonu geçerli bir HTML kodu olup standartlara uyum gösteren tarayýcýlar ve HTML derleyiciler tarafýndan okunabilir.

Vue, þablonlarý kendiliðinden Sanal DOM modelleme fonksiyonlarý aracýlýðýyla derler. Otomatik tepki sisteminin de yardýmýyla Vue yeniden modellenmesi gereken minimum sayýdaki bileþeni akýllýca tespit edebilir ve uygulamanýn durumu deðiþtiðinde mümkün olan en az sayýda DOM deðiþikliðini gerçekleþtirir.

Eðer Sanal DOM kavramlarýna alýþýksanýz ve saf JavaScript’in gücünden yararlanmayý tercih ederseniz isteðe baðlý JSX desteði sayesinde þablona gerek olmaksýzýn [doðrudan modelleme fonksiyonlarý](render-function.html) yazabilirsiniz.

## Deðiþken deðer takibi

### Metin

Veri baðlamanýn en basit þekli “Býyýk” sentaksý (ikiþer adet süslü parantez) ile yazýlan metin deðerlerinin takibidir.

``` html
<span>Mesaj: {{ msg }}</span>
```

Býyýk etiketiyle çevrili kýsým ilgili bileþenin veri nesnesi içerisinde yer alan `msg` özelliðinin deðeri ile deðiþtirilecektir. Söz konusu veri nesnesinin `msg` özelliði ne zaman deðiþirse bu metin de güncellenir.

Ayrýca [v-once direktifini](../api/#v-once) kullanarak deðiþken deðerinin yalnýzca bir defa kullanýlmasýný saðlayabilirsiniz. Fakat bu iþlemin ayný HTML düðümü üzerindeki tüm baðlar üzerinde etkili olacaðýný unutmayýn.

``` html
<span v-once>Bu asla deðiþmeyecektir: {{ msg }}</span>
```

### Saf HTML

Çift býyýk sentaksý verileri düz metin olarak yorumlar. HTML olarak deðil. Gerçek HTML yazabilmek için `v-html` direktifini kullanmalýsýnýz:

``` html
<p>Býyýk ile kullaným: {{ safHtml }}</p>
<p>v-html direktifi ile kullaným: <span v-html="safHtml"></span></p>
```

{% raw %}
<div id="example1" class="demo">
  <p>Býyýk ile kullaným: {{ rawHtml }}</p>
  <p>v-html direktifi ile kullaným: <span v-html="safHtml"></span></p>
</div>
<script>
new Vue({
  el: '#example1',
  data: function () {
    return {
      safHtml: ‘<span style="color: red">Bu metnin rengi kýrmýzý olmalý.</span>'
    }
  }
})
</script>
{% endraw %}

`span` içerisindeki metin `rawHtml` özelliðinin deðeri ile deðiþtirilecektir ve bu metin saf HTML olarak yorumlanacak olup veri baðlarý dikkate alýnmayacaktýr. `v-html` direktifi içerisinde dinamik þablon oluþturmak mümkün deðildir zira Vue, dizgi tabanlý bir þablon motoru deðildir. Bunun yerine kullanýcý arayüzü elemanlarýnýn yeniden kullanýmý ve birlikte kullanýmýna yönelik temel birim olarak bileþenler kullanýlmaktadýr.

<p class="tip">Ýçeriði belirsiz HTML girdilerinin internet sitenizde dinamik olarak modellenmesi son derece tehlikeli olabilir zira kolayca [XSS zafiyetleri](https://tr.wikipedia.org/wiki/Siteler_aras%C4%B1_betik_%C3%A7al%C4%B1%C5%9Ft%C4%B1rma) ile sonuçlanabilir. HTML deðerlerinin takibi iþlevini yalnýzca güvenilir içerikler üzerinde kullanýn ve **asla** kullanýcý tarafýndan temin edilen içerik üzerinde kullanmayýn.<Çp>

### HTML Nitelikleri

HTML nitelikleri içerisinde býyýk sentaksý kullanýlamaz. Bunun yerine [v-bind direktifini](../api/#v-bind) kullanýn:

``` html
<div v-bind:id="dinamikId"></div>
```

Mevcut olmalarý `true` anlamýna gelen boole nitelikleri için `v-bind` biraz farklý faaliyet göstermektedir. Aþaðýdaki örneðe bakalým:

``` html
<button v-bind:disabled="butonAktifDegil">Buton</button>
```

Eðer `butonAktifDeðil` deðiþkeninin deðeri `null`, `undefined` veya `false olursa `disabled` niteliði, modellenen `<button>` elementine dahil bile edilmeyecektir.

### JavaScript Ýfadelerinin Kullanýmý

Þu ana kadar þablonlarýmýzda basit özellik anahtarlarý üzerinde bað gerçekleþtirdik. Halbuki Vue.js veri baðlarý üzerinde JavaScript ifadelerinin sunduðu tüm gücü kullanmayý mümkün kýlýyor:

``` html
{{ sayi + 1 }}

{{ ok ? 'EVET' : 'HAYIR' }}

{{ mesaj.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

Bu ifadeler baðlý olduklarý Vue örneðinin veri kapsamý içerisinde JavaScript olarak deðerlendirilecektir. Bu açýdan tek sýnýrlama her bað içerisinde **yalnýzca bir ifadenin** kullanýlma zorunluluðudur. Yani aþaðýdaki ifade **ÇALIÞMAYACAKTIR**:

``` html
<!-- Aþaðýdaki kod bir ifade deðil bir beyandýr: -->
{{ var a = 1 }}

<!-- akýþ kontrolü de çalýþmayacaktýr, bunun yerine üç terimli ifadeleri kullanýn -->
{{ if (ok) { return mesaj } }}
```

<p class="tip">Þablon ifadeleri dýþ ortamdan ayrýlmýþ olup yalnýzca `Math` ve `Date` gibi global deðiþkenleri içeren sýnýrlý bir listeye eriþim sunar. Þablon ifadeleri içerisinde kullanýcý tarafýndan belirlenen global deðiþkenlere eriþim gerçekleþtirmeye çalýþmayýn.</p>

## Direktifler

Direktifler `v-` ön ekini kullanan özel niteliklerdir. Direktif nitelikleri, **tek bir JavaScript ifadesine** karþýlýk gelen bir deðer içermelidir (`v-for` bu açýdan bir istisna olup buna aþaðýda deðineceðiz). Direktiflerin görevi, içerisindeki ifadenin deðeri deðiþtiðinde bunun yan etkilerini DOM modeline reaktif olarak yansýtmaktýr. Giriþ bölümünde gördüðümüz örneði yeniden inceleyelim:

``` html
<p v-if="seen">Þu an beni görüyorsun</p>
```

Burada `v-if` direktifi, `<p>` elementini `seen` ifadesine ait deðerin doðru olup olmadýðýný göre DOM’a ekler veya kaldýrýr.

### Argümanlar

Bazý direktifler, direktif adýndan sonra iki nokta ile iþaret edilen bir “argüman” alabilir. Örneðin `v-bind` direktifi bir HTML niteliðini reaktif olarak güncellemek üzere kullanýlýr:

``` html
<a v-bind:href="url"> ... </a>
```

Burada `href`, `v-bind`’ýn argümaný olarak kullanýlýyor ve söz konusu elementin `href` niteliðini `url` ifadesinin deðerine baðlýyor.

Bir diðer örnek DOM olaylarýný dinleyen `v-on` direktifidir:

``` html
<a v-on:click="birSeyYap"> ... </a>
```

Burada argüman dinlenilecek olan olayýn adýdýr. Olay yönetimine ileride daha yakýndan deðineceðiz.

### Dinamik Argümanlar

> 2.6.0+’dan itibaren

2.6.0 versiyonundan itibaren bir direktif argümaný içerisinde JavaScript ifadelerini köþeli bir parantez içerisinde kullanmak mümkün:

``` html
<a v-bind:[nitelikAdi]="url"> ... </a>
```

Burada `nitelikAdi` dinamik bir þekilde JavaScript ifadesi olarak deðerlendirilecek ve tespit edilen deðer bu argümanýn nihai deðeri olarak kullanýlacak. Örneðin eðer Vue örneðiniz `"href"` deðerine sahip `nitelikAdi` þeklindeki bir data niteliðine sahipse yukarýdaki bað `v-bind:href`e denk olacaktýr.

Ayný þekilde dinamik argümanlar sayesinde bir olay yöneticisini dinamik bir olay adýna baðlayabilirsiniz:

``` html
<a v-on:[olayAdý]="birSeyYap"> ... </a>
```

Yine yukarýdaki gibi `olayAdi`'nýn deðeri `"focus"` ise `v-on:[eventName]` ifadesi `v-on:focus`a karþýlýk gelecektir.

#### Dinamik Argüman Deðeri Kýsýtlamalarý

Dinamik argümanlar `null` dýþýnda yalnýzca dizgi olarak deðerlendirilmesi beklenir. Söz konusu baðý kaldýrabilmek için istinai olarak `null` kullanýlmasýna müsaade edilir. Bunun dýþýnda dizgi olmayan tüm deðerler bir uyarý verecektir.

#### Dinamik Argüman Ýfadesi Kýsýtlamalarý

<p class="tip">Dinamik argüman ifadeleri üzerinde bir takým sentaks kýsýtlamalarý mevcuttur zira HTML nitelik isimleri içerisinde boþluk veya týrnak gibi bazý karakterlerin kullanýlmasý mümkün deðildir. Ayrýca DOM içerisinde kullanýlan þablonlarda büyük harf kullanýlmamasýna da dikkat etmelisiniz.</p>

Örneðin aþaðýdaki ifade geçersizdir:

``` html
<!-- Bu bir derleyici uyarýsýný tetikleyecektir. -->
<a v-bind:['foo' + bar]="deger"> ... </a>
```

Bu uyarýnýn ortaya çýkmasýný engellemek için boþluk veya týrnak kullanmayýn veya karmaþýk ifadeleri hesaplanmýþ bir nitelik ile deðiþtirin.

Buna ek olarak DOM içerisinde þablon kullanýyorsanýz (þablonunuzu doðrudan bir HTML dosyasý içerisinde yazýyorsanýz) tarayýcýlarýn nitelik isimlerini küçük harf olarak düzelteceðini unutmayýn:

``` html
<!-- Aþaðýdaki ifade DOM içi þablonda v-bind:[birnitelik] þeklinde dönüþtürülecektir. -->
<a v-bind:[birNitelik]="deger"> ... </a>
```

### Deðiþtiriciler

Deðiþtiriciler bir nokta ile gösterilen özel eklerdir ve bir direktifin özel bir þekilde baðlanmasý gerektiðini ifade eder. Örneðin `.prevent` deðiþtiricisi `v-on` direktifine tetiklenen olay üzerinde `event.preventDefault()` ifadesini çaðýrmasýný söyler:

``` html
<form v-on:submit.prevent="onSubmit"> ... </form>
```

Söz konusu bölümlere geldiðimizde [`v-on`a](events.html#Event-Modifiers) ve [`v-model`e](forms.html#Modifiers) yönelik baþka deðiþtirici örneklerini göreceksiniz.

## Kýsaltmalar

`v-` ön eki þablonlarýnýzdaki Vue’ye özgü nitelikleri kolayca tespit edebilmeyi saðlayan görsel bir ipucu görevi görür. Hali hazýrda yazýlmýþ olan biçimli metinlere dinamik davranýþlar eklemek için Vue.js’nin kullanýlmasý sýrasýnda yararlý olsa da direktiflerin sýkça kullanýldýðý durumlarda metin kalabalýðý yaratabilir. Ayný zamanda her þeyin Vue tarafýndan yönetildiði bir [SPA](https://tr.wikipedia.org/wiki/Tek_sayfa_uygulamas%C4%B1) geliþtirdiðiniz sýrada `v-` ön eki önemini kaybeder. Bu nedenle Vue en çok kullanýlan iki direktif olan `v-bind` ve `v-on` için özel kýsaltmalar sunar:

### `v-bind` Kýsaltmasý

``` html
<!-- uzun sentaks -->
<a v-bind:href="url"> ... </a>

<!-- kýsaltma -->
<a :href="url"> ... </a>

<!-- dinamik argümanlý kýsatma (2.6.0+) -->
<a :[key]="url"> ... </a>
```

### `v-on` Kýsaltmasý

``` html
<!-- uzun sentaks -->
<a v-on:click="birSeyYap"> ... </a>

<!-- kýsaltma -->
<a @click="birSeyYap"> ... </a>

<!-- dinamik argümanlý kýsatma (2.6.0+) -->
<a @[olay]="birSeyYap"> ... </a>
```

Bu kullaným normal HTML’den biraz farklý görünebilir ama `:` ve `@` karakterleri geçerli nitelik isimleri arasýndadýr ve Vue’nün desteklendiði tüm tarayýcýlar tarafýndan doðru bir þekilde okunabilir. Ayrýca bunlar ekrana yansýtýlan nihai biçimli metin içerisinde görüntülenmez. Kýsaltma sentaksý isteðe baðlý olmakla beraber kullanýmýný daha yakýndan öðrendikçe hoþunuza gideceðini düþünüyoruz.
