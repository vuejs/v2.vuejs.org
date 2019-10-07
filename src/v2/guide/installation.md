---
title: Kurulum
type: guide
order: 1
vue_version: 2.06.2010
gz_size: "33.30"
---

### Uyumluluk

Vue, IE8 ve daha önceki versiyonları **desteklememektedir** zira ECMAScript 5’in IE8 için ayar katmanı gerçekleştirilemeyecek özelliklerini kullanır. Fakat [ECMAScript 5 ile uyumlu tarayıcıların](https://caniuse.com/#feat=es5) tamamını desteklemektedir.

### Sürüm Detayları

En son stabil versiyon: {{vue_version}}

Her versiyona ait detaylı sürüm detayları [GitHub](https://github.com/vuejs/vue/releases) üzerinde bulunabilir.

## Vue Devtools

Vue’yi kullanırken aynı zamanda Vue uygulamalarınızı daha kullanıcı-dostu bir arayüz ile incelemenizi ve hata gidermenizi sağlamak üzere tarayıcınıza [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools) eklentisini eklemenizi tavsiye ederiz.

## Doğrudan `<script>` Etiketiyle Kullanma

Bilgisayarınıza indirin ve bir script HTML etiketi ile basit bir şekilde projelerinize dahil edin. `Vue` global bir değişken olarak kaydedilecektir.

<p class="tip">Geliştirme sürecinde küçültülmüş versiyonu kullanmayın. Aksi takdirde sıkça rastlanan hatalara yönelik yararlı ikazları göremeyeceksiniz!</p>

<div id="downloads">
  <a class="button" href="/js/vue.js" download>Geliştirme Versiyonu</a><span class="light info">Tüm ikazlar ve hata giderme modu ile birlikte</span>

  <a class="button" href="/js/vue.min.js" download>Son Kullanıcı Versiyonu</a><span class="light info">İkazlar çıkarılmış olarak, {{gz_size}}KB min+gzip</span>
</div>

### CDN

Prototip geliştirme veya öğrenim amacıyla Vue’nin en güncel versiyonunu aşağıdaki şekilde kullanabilirsiniz:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Son kullanıcı ortamında belirli bir versiyon numarasını ve sürümünü hedefleyen bir bağlantı kullanmanızı tavsiye ederiz:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js"></script>
```

Eğer natif ES Modülleri kullanıyorsanız ES Modüllerine uyumlu bir sürüm de mevcuttur:

``` html
<script type="module">
  import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.esm.browser.js'
</script>
```

NPM paketinin içeriğini [cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue/) adresinde inceleyebilirsiniz.

Vue aynı zamanda [unpkg](https://unpkg.com/vue@{{vue_version}}/dist/vue.js) ve [cdnjs](https://cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js) üzerinde de sunulmaktadır (cdnjs senkronizasyonu biraz zaman aldığından en son versiyon orada olmayabilir).

[Vue’nin farklı sürümleri](#Explanation-of-Different-Builds) hakkında daha fazla bilgi edinmeyi ve kullanıcılara
 sunduğunuz site üzerinde `vue.js`yi `vue.min.js` ile değiştirerek **son kullanıcı versiyonunu** kullanmayı ihmal etmeyin. Bu, geliştirme deneyimi yerine hız sunmak üzere optimize edilmiş daha küçük bir sürümdür.

## NPM

Vue ile büyük çaplı uygulamalar inşa etmeniz durumunda NPM ile kurulumu tavsiye ederiz. [Webpack](https://webpack.js.org/) ve [Browserify](http://browserify.org/) gibi modül paketleyicileri ile gayet uyumludur. Vue aynı zamanda [Tek Sayfa Bileşenler](single-file-components.html) oluşturmak için yardımcı araçlar temin etmektedir.

``` bash
# stabil en güncel versiyon
$ npm install vue
```

## CLI

Vue, büyük çaplı Tek Sayfa Uygulamaları hızlı bir şekilde inşa etmeyi sağlayan [resmi bir CLI](https://github.com/vuejs/vue-cli)’yi (Komut Satırı Arayüzü) kullanıma sunar. Bu arayüz modern bir kullanıcı arayüzü geliştirme akışı sağlamaya yönelik kendisine yeten proje kurma seçenekleri temin eder. Otomatik güncellemeli, her kayıtta lint kontrollü ve son kullanıcı için hazır sürümleri hazırlayıp yürütmek yalnızca birkaç dakikanızı alacak. Detaylar için [Vue CLI dokümantasyonuna](https://cli.vuejs.org) bakın.

<p class="tip">CLI, Node.js ve ilişkili proje kurma araçları hakkında bilgiye sahip olduğunuzu var sayar. Eğer Vue veya genel olarak kullanıcı arayüzüne yönelik proje kurma araçları sizin için yeni bir konsept ise CLI’yi kullanmadan önce herhangi bir proje kurma aracı kullanmadan <a href="./">kılavuzu</a> kılavuzu baştan sona okumanızı şiddetle tavsiye ederiz.</p>

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/real-world-vue-js/vue-cli" target="_blank" rel="noopener" title="Vue CLI">Vue Mastery’de bu konuyu açıklayan bir video izleyebilirsiniz</a></div>

## Farklı Sürümlere dair Açıklamalar

[NPM paketinin `dist/` klasöründe](https://cdn.jsdelivr.net/npm/vue/dist/) Vue.js’nin birçok farklı sürümünü bulabilirsiniz. Bu sürümler arasındaki farkların bir özetini aşağıda bulabilirsiniz:

| | UMD | CommonJS | ES Module (paketleyiciler için) | ES Module (tarayıcılar için) |
| --- | --- | --- | --- | --- |
| **Tam** | vue.js | vue.common.js | vue.esm.js | vue.esm.browser.js |
| **Yalnızca yürütme** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js | - |
| **Tam (son kullanıcı için)** | vue.min.js | - | - | vue.esm.browser.min.js |
| **Yalnızca yürütme (son kullanıcı için)** | vue.runtime.min.js | - | - | - |

### Terimler

- **Tam**: İçeriğinde hem derleyiciyi hem de yürütme ortamını barındıran sürümler.

- **Derleyici**: Şablon dizgilerinin JavaScript modelleme fonksiyonlarına dönüştürmekten sorumlu kod.

- **Yürütme ortamı**: Vue örneklerinin oluşturulmasından, sanal DOM’un modellenmesi ve güncellenmesinden, vs. sorumlu kod. Bir başka deyişle derleyici hariç her şey.

- **[UMD](https://github.com/umdjs/umd)**: UMD sürümleri tarayıcı içerisinde `<script>` etiketi aracılığıyla doğrudan kullanılabilir. jsDelivr CDN üzerinde [Https://cdn.jsdelivr.net/npm/vue](https://cdn.jsdelivr.net/npm/vue) adresinde varsayılan seçenek olarak sunulan sürüm Yürütme ortamı + Derleyici UMD sürümüdür (`vue.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS sürümleri [browserify](http://browserify.org/) ve [webpack 1](https://webpack.github.io) gibi daha eski paketleyiciler ile birlikte kullanıma yöneliktir. Bu sürümlere ait varsayılan dosya (`pkg.main`), yalnızca Yürütme ortamını içeren CommonJS sürümüdür (`vue.runtime.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: 2.6 versiyonundan itibaren Vue, iki farklı ES Module (ESM) sürümü sunmaktadır:

  - Paketleyiciler için ESM: [webpack 2](https://webpack.js.org) ve [Rollup](https://rollupjs.org/) gibi modern paketleyiciler ile kullanıma yöneliktir. ESM formatı, paketleyicilerin “tree-shaking” işlemini gerçekleştirerek nihai paketinizden kullanılmayan kodların çıkarılabilmesi için istatistiksel olarak analiz edilebilir şekilde tasarlanmıştır. Bu paketleyicilere yönelik varsayılan dosya (`pkg.module`), yalnızca Yürütme ortamını içeren ES Module sürümüdür (`vue.runtime.esm.js`).

  - Tarayıcılar için ESM (yalnızca 2.6+): Modern tarayıcılarda `<script type="module">` aracılığıyla doğrudan import gerçekleştirmeye yöneliktir.

### Yürütme Ortamı + Derleyici ile Yalnızca Yürütme Ortamı karşılaştırması

Eğer şablonları istemcinin sisteminde derlemeniz gerekiyorsa (örn. `template` seçeneğine bir dizgi eklenmesi veya DOM içerisindeki HTML değerini şablon olarak kullanmak üzere bir elemente bağlanmak) derleyiciye ve dolayısıyla tam sürüme ihtiyacınız olacaktır:

``` js
// aşağıdaki derleyici gerektirir
new Vue({
  template: '<div>{{ selam }}</div>'
})

// aşağıdaki gerektirmez
new Vue({
  render (h) {
    return h('div', this.selam)
  }
})
```

`vue-loader` veya `vueify` kullanıldığında `*.vue` dosyaları içerisindeki şablonlar yürütme zamanında JavaScript olarak bir önderleme sürecinden geçer. Bu durumda nihai paketinizde derleyiciye gerçekten ihtiyacınız yoktur ve yalnızca yürütme ortamı sürümünü kullanabilirsiniz.

Yalnızca yürütme ortamı sürümleri tam sürüm versiyonlarına oranla yaklaşık %30 daha hafif olduğundan mümkün olan tüm durumlarda yalnızca yürütme ortamı sürümünü kullanmalısınız. Fakat yine de tam sürümü kullanmak isterseniz paketleyiciniz içerisinde bir alias belirlemeniz gerekecektir:

#### Webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // webpack 1 için 'vue/dist/vue.common.js'
    }
  }
}
```

#### Rollup

``` js
const alias = require('rollup-plugin-alias')

rollup({
  // ...
  plugins: [
    alias({
      'vue': require.resolve('vue/dist/vue.esm.js')
    })
  ]
})
```

#### Browserify

Projenizin `package.json` dosyasını ekleyin:

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

#### Parcel

Projenizin `package.json` dosyasını ekleyin:

``` js
{
  // ...
  "alias": {
    "vue" : "./node_modules/vue/dist/vue.common.js"
  }
}
```

### Geliştirme ve Son Kullanıcı Modları

Geliştirme/son kullanıcı modları UMD sürümlerinde doğrudan kodlanmıştır. Geliştirme süreci için küçültülmemiş dosyaları, son kullanıcı ortamı için küçültülmüş dosyaları kullanın.

CommonJS ve ES Module sürümleri paketleyicilere yönelik olduğundan bu sürümler için küçültülmüş versiyon temin etmiyoruz. Nihai paketinizi kendiniz küçültmeniz gerekecek.

CommonJS ve ES Module sürümleri `process.env.NODE_ENV`e yönelik ham kontrolleri de bünyesinde tutarak hangi modda olmaları gerektiğini tespit edebilirler. Vue’nin hangi modda faaliyet göstereceğini kontrol etmek üzere bu ortam değişkenlerini değiştirmek için uygun paket ayarlarını kullanmalısınız. `process.env.NODE_ENV`in harf dizileriyle değiştirilmesi UglifyJS gibi küçültücülerin yalnızca kod geliştirmeye yönelik kod parçalarını ayıklayarak nihai dosya boyutunu küçültmeye olanak tanır.

#### Webpack

Webpack 4+’da, `mode` seçeneğini kullanabilirsiniz:

``` js
module.exports = {
  mode: 'production'
}
```

Fakat Webpack 3 ve önceki versiyonlarında [DefinePlugin](https://webpack.js.org/plugins/define-plugin/)i kullanmanız gerekecek:

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}
```

#### Rollup

[Rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace)yi kullanın:

``` js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}).then(...)
```

#### Browserify

Paketinize global bir [envify](https://github.com/hughsk/envify) transformu uygulayın.

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

Ayrıca bkz: [Son Kullanıcı Versiyonunu Kullanıma Sürme Tavsiyeleri](deployment.html).

### CSP ortamları

Chrome Apps gibi bazı ortamlar İçerik Güvenlik Politikasını (Content Security Policy - CSP) uygulamaya almıştır. Bu politika ifadelerin değerlendirilmesi sırasında `new Function()` gerçekleştirilmesini yasaklar. Tam sürüm şablonları derlemek için bu özelliği kullandığından bu tür ortamlarda kullanılmaları mümkün değildir.

Fakat yalnızca yürütme ortamı sürümü CSP ile tamamen uyumludur. Yalnızca yürütme ortamı sürümünü [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) veya [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple) ile birlikte kullanırken şablonlarınız önderleme sürecinde CSP ortamlarında sorunsuz bir şekilde çalışan `render` fonksiyonlarına dönüşecektir.

## Vue Geliştirme Sürümü

**Dikkat**: GitHub üzerindeki `/dist` dosyası yalnızca sürüm dağıtımları sırasında güncellenir. Vue’nin GitHub üzerindeki en güncel kaynak kodunu kullanmak için Vue’yi yerel ortamınızda tekrar kurmanız gerekecek!

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

Bower ile yalnızca UMD sürümlerine erişim sağlayabilirsiniz.

``` bash
# stabil en güncel versiyon
$ bower install vue
```

## AMD Modül Yükleyicileri

Bütün UMD sürümleri doğrudan bir AMD modülü olarak kullanılabilir.
