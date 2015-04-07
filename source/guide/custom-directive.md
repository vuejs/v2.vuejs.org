title: カスタムディレクティブ
type: guide
order: 9
---

## 基本

Vue.js ではカスタムディレクティブを登録する仕組みが用意されています。カスタムディレクティブはデータの変更に伴い DOM がどのように変更されるかを定義することができる仕組みです。**directive id** とそれに続く **definition object** を`Vue.directive(id, definition)`メソッドに渡して、グローバルにカスタムディレクティブを登録することができます。この definition object はいくつかの hook 関数(全て任意)を提供します:

- **bind**: ディレクティブが初めて対象のエレメントに紐付いた時に一度だけ呼ばれる
- **update**: 初めの一度は bind の直後に初期値とともに呼ばれ、以降、バインディングされている値が変更される度に呼ばれる。引数には新しい値と以前の値が渡される
- **unbind**: ディレクティブが紐付いているエレメントから取り除かれた時に一度だけ呼ばれる

**例**

``` js
Vue.directive('my-directive', {
  bind: function () {
    // 準備のための作業をします
    // e.g. イベントリスナーを追加したり、一回だけ実行が必要なコストのかかる処理を行う
  },
  update: function (newValue, oldValue) {
    // 更新された値に何か処理をします
    // この部分は初期値に対しても呼ばれます
  },
  unbind: function () {
    // クリーンアップのための処理を行います
    // e.g. bind()の中で追加されたイベントリスナーの削除
  }
})
```

一度登録された後は、以下のように Vue.js のテンプレート内で使用することができます (Vue.js の prefix が必要です):

``` html
<div v-my-directive="someValue"></div>
```

`update`関数のみが必要な場合は、definition object の代わりに関数を一つ渡すこともできます:


``` js
Vue.directive('my-directive', function (value) {
  // この関数は update() として使用される
})
```

全ての hook 関数は実際の **directive object** にコピーされます。directive object は hook 関数の内側で `this` のコンテキストとしてアクセスすることができます。この directive object はいくつかの便利なプロパティを持っています:

- **el**: ディレクティブが紐づく要素
- **vm**: このディレクティブを所有する ViewModel
- **expression**: 引数とフィルタ以外のバインディングの expression
- **arg**: 引数(もしある場合)
- **raw**: 元のパースされる前の expression
- **name**: prefix 無しのディレクティブの名前

<p class="tip">これらの全てのプロパティは read-only で変更しないものとして扱わなくてはいけません。カスタムプロパティを directive object に追加することができますが、意図せずに既存のインターナルなプロパティを上書きしないように注意が必要です。</p>

いくつかのプロパティを使用したカスタムディレクティブの例:

``` html
<div id="demo" v-demo="LightSlateGray : msg"></div>
```

``` js
Vue.directive('demo', {
  bind: function () {
    this.el.style.color = '#fff'
    this.el.style.backgroundColor = this.arg
  },
  update: function (value) {
    this.el.innerHTML =
      'name - '       + this.name + '<br>' +
      'raw - '        + this.raw + '<br>' +
      'expression - ' + this.expression + '<br>' +
      'argument - '   + this.arg + '<br>' +
      'value - '      + value
  }
})
var demo = new Vue({
  el: '#demo',
  data: {
    msg: 'hello!'
  }
})
```

**結果**

<div id="demo" v-demo="LightSlateGray : msg"></div>
<script>
Vue.directive('demo', {
  bind: function () {
    this.el.style.color = '#fff'
    this.el.style.backgroundColor = this.arg
  },
  update: function (value) {
    this.el.innerHTML =
      'name - ' + this.name + '<br>' +
      'raw - ' + this.raw + '<br>' +
      'expression - ' + this.expression + '<br>' +
      'argument - ' + this.arg + '<br>' +
      'value - ' + value
  }
})
var demo = new Vue({
  el: '#demo',
  data: {
    msg: 'hello!'
  }
})
</script>

## リテラルディレクティブ

もしカスタムディレクティブを作成するときに `isLiteral: true` を渡した場合は、その属性値は文字列 string として扱われ、そのディレクティブの `expression` として割り当てられます。リテラルディレクティブはデータの監視の準備はしません。

Example:

``` html
<div v-literal-dir="foo"></div>
```

``` js
Vue.directive('literal-dir', {
  isLiteral: true,
  bind: function () {
    console.log(this.expression) // 'foo'
  }
})
```

### 動的リテラル

しかし、リテラルディレクティブに mustache タグを含んでいる場合は、以下のような挙動になります: 


- ディレクティブインスタンスは `this._isDynamicLiteral` というフラグを `true` にセットします。

- もし `update` function が提供されていない場合、 mustache 表現は一度だけ評価され、 `this.expression` に割り当てられます。データ監視は行われません。

- もし `update` function が提供される場合、ディレクティブはその expression に対するデータ監視をセットアップし、評価された結果が変更される度に `update` が呼ばれます。

## 双方向ディレクティブ


もしディレクティブが受け取ったデータを Vue インスタンスに書き戻したい場合は `twoWay: true` を渡す必要があります。このオプションはディレクティブの `this.set(value)` で使用することができます。


``` js
Vue.directive('example', {
  twoWay: true,
  bind: function () {
    this.handler = function () {
      // vm にデータをセットします
      // もしディレクティブが v-example="a.b.c" と紐付いている場合,
      // 与えられた値を `vm.a.b.c` に
      // セットしようと試みます
      this.set(this.el.value)
    }.bind(this)
    this.el.addEventListener('input', this.handler)
  },
  unbind: function () {
    this.el.removeEventListener('input', this.handler)
  }
})
```

## インラインステートメント

 `acceptStatement:true` を渡すことでカスタムディレクティブが `v-on` が行っているようなインラインステートメントを使用できるようになります: 

``` html
<div v-my-directive="a++"></div>
```

``` js
Vue.directive('my-directive', {
  acceptStatement: true,
  update: function (fn) {
    // 呼び出される際に渡される値は function です
    // function は "a++" ステートメントを
    // 所有者の vm　のスコープで実行します
  }
})
```

ただし、テンプレート内のサイドエフェクトを避けるためにも、賢く使いましょう。

## ディープ監視

もしカスタムディレクティブでオブジェクトを扱いたい場合で、オブジェクトの内側のネストされたプロパティが変更された時に `update` をトリガーしたい場合は、ディレクティブの定義に `deep: true` を渡す必要があります。

``` html
<div v-my-directive="obj"></div>
```

``` js
Vue.directive('my-directive', {
  deep: true,
  update: function (obj) {
    // `obj` の中のネストされたプロパティが
    // 変更された時に呼ばれる
  }
})
```

## ディレクティブの優先度

ディレクティブには任意で優先度の数値 (デフォルトは0) を与えることができます。同じ要素上で高い優先度をもつディレクティブは他のディレクティブより早く処理されます。同じ優先度をもつディレクティブは要素上の属性のリストに出現する順番で処理されますが、ブラウザが異なる場合、一貫した順番になることは保証されません。

いくつかのビルトインディレクティブに関する優先度は [API reference](/api/directives.html) で確認できます。さらに `v-repeat` と `v-if` と `v-component` は "ターミナルディレクティブ" として扱われ、コンパイル処理の中で常に最も高い優先度を持ちます。

次は [カスタムフィルタ](/guide/custom-filter.html) をどのように書くか見ていきましょう。