title: コンポーネントシステム
type: guide
order: 11
---

## コンポーネントの使用

Vue.js では [Web Components](http://www.w3.org/TR/components-intro/) と類似した概念を持つ再利用可能なコンポーネントとして、polyfill 無しで、拡張された Vue サブクラスを扱うことができます。コンポーネントを作るためには、 `Vue.extend()` を用いて Vue のサブクラスコンストラクタを生成します:

``` js
// 再利用可能なコンストラクタを取得するために Vue を拡張します
var MyComponent = Vue.extend({
  template: 'A custom component!'
})
```

Vue のコンストラクタに渡すことができるほとんどのオプションは `Vue.extend()` で利用可能です。しかし、 `data` と `el` は例外ケースです。各 Vue インスタンスは `$data` と `$el` をそれぞれが持つべきであるため、 `Vue.extend()` に渡され、コンストラクタを通じて作られる全てのインスタンスを横断して共有されることは好ましくありません。したがって、コンポーネントを定義する際にデフォルトの data や element を初期化したい場合は、代わりに関数を渡しましょう:


``` js
var ComponentWithDefaultData = Vue.extend({
  data: function () {
    return {
      title: 'Hello!'
    }
  }
})
```

次に、 `Vue.component()` を使ってコンストラクタを **登録** しましょう:

``` js
// my-component という id でコンストラクタを登録する
Vue.component('my-component', MyComponent)
```

より物事を簡単にするために、コンストラクタの代わりにオプションのオブジェクトを直接渡すこともできます。`Vue.component()` はオブジェクトを受け取った場合、暗黙的に `Vue.extend()` を呼び出します:

``` js
// Note: この関数はグローバルな Vue を返し、
// 登録されたコンストラクタを返すものではありません。
Vue.component('my-component', {
  template: 'A custom component!'
})
```

また、登録したコンポーネントを親インスタンスのテンプレート内で使用することもできます（ルートの Vue インスタンスを初期化する **前に** そのコンポーネントが登録されていることを確認してください）:

``` html
<!-- inside parent template -->
<div v-component="my-component"></div>
```

任意で、カスタムエレメントのタグ形式でコンポーネントを使用することもできます:

``` html
<my-component></my-component>
```

<p class="tip">
W3Cのカスタムエレメントの仕様に沿ってネイティブのエレメントと名前の衝突を避けるために、コンポーネントのIDには **必ず** ハイフン `-` を含める必要があります。</p>

`Vue.extend()` と `Vue.component()` の違いを理解することは重要です。`Vue` 自身はコンストラクタであるため、`Vue.extend()` は **クラス継承メソッド** です。そのタスクは `Vue` のサブクラスを生成して、そのコンストラクタを返すものです。一方、 `Vue.component()` は **アセット登録メソッド** であり、`Vue.directive()` や `Vue.filter()` と類似しています。そのタスクは与えられたコンストラクタに文字列のIDを関連付けて、 Vue.js がそれをテンプレートの中で利用できるようにするものです。直接 `Vue.component()` にオプションを渡した時は、内部的に `Vue.extend()` が呼ばれます。

Vue.js は二つの異なる API パラダイムをサポートしています: クラスベースの命令的な Backbone スタイルの API とマークアップベースで宣言的な Web Components スタイルの API です。もし混同してしまう場合は、image エレメントを `new Image()` を作るか、 `<img>` タグで作るかということを考えてみてください。どちらもそれ自体で有効的であり、Vue.js は最大限の柔軟性のためにどちらの方式も提供しています。


## Data Inheritance

### 明示的な Data の受け渡し

デフォルトでは、コンポーネントは **isolated scope** を持ちます。これが意味するところは、子コンポーネントのテンプレートの中で親データの参照ができないということです。データを isolated scope で明示的に子コンポーネントに渡す場合は、`v-with` ディレクティブを使用することができます。


#### 子の `$data` への伝達

引数なしで一つの keypath を与えた場合、親の対応する値が子の `$data` へ受け渡されます。受け渡しされる値はオブジェクトでなくてはなりません。そして、子コンポーネントが既に持っているかもしれない `$data` はそのオブジェクトによって上書きされます。

**例:**

``` html
<div id="demo-1">
  <p v-component="user-profile" v-with="user"></p>
</div>
```

``` js
// 先にコンポーネントを登録します
Vue.component('user-profile', {
  template: '{{name}}<br>{{email}}'
})
// この `user` オブジェクトは子に渡されます
// 子コンポーネントの $data として扱われます
var parent = new Vue({
  el: '#demo-1',
  data: {
    user: {
      name: 'Foo Bar',
      email: 'foo@bar.com'
    }
  }
})
```

**結果:**

<div id="demo-1" class="demo"><p v-component="user-profile" v-with="user"></p></div>
<script>
  Vue.component('user-profile', {
    template: '{&#123;name&#125;}<br>{&#123;email&#125;}'
  })
  var parent = new Vue({
    el: '#demo-1',
    data: {
      user: {
        name: 'Foo Bar',
        email: 'foo@bar.com'
      }
    }
  })
</script>

#### 個別のプロパティの受け渡し

`v-with` は `v-with="childProp: parentProp"` という形式で、一つの引数を渡して使用することもできます。これは、 `parent[parentProp]` を `child[childProp]` として、双方向バインディング (0.11.5時点) で子に渡すということです。

**例:**

``` html
<div id="demo-2">
  <input v-model="parentMsg">
  <p v-component="child" v-with="childMsg : parentMsg">
    <!-- 基本的には "自身の `parentMsg` を `childMsg` としてバインドするということです" -->
  </p>
</div>
```

``` js
new Vue({
  el: '#demo-2',
  data: {
    parentMsg: 'Inherited message'
  },
  components: {
    child: {
      template: '<span>{{childMsg}}</span>'
    }
  }
})
```

**結果:**

<div id="demo-2" class="demo"><input v-model="parentMsg"><p v-component="child" v-with="childMsg:parentMsg"></p></div>
<script>
new Vue({
  el: '#demo-2',
  data: {
    parentMsg: 'Inherited message'
  },
  components: {
    child: {
      template: '<span v-text="childMsg"></span>'
    }
  }
})
</script>

#### `paramAttributes` の使用

[`paramAttributes`](/api/options.html#paramAttributes) というオプションを使用することもできます。それは、 `v-with` にコンパイルされるもので、カスタムエレメントのようなインターフェースを外部公開するためのものです:

``` html
<div id="demo-3">
  <input v-model="parentMsg">
  <child-component child-msg="parentMsg"></p>
</div>
```

``` js
new Vue({
  el: '#demo-3',
  data: {
    parentMsg: 'Inherited message'
  },
  components: {
    'child-component': {
      paramAttributes: ['child-msg'],
      // ハイフンによる属性が camel 形式になったもの,
      // したがって、 'child-msg' は 'this.childMsg' になります
      template: '<span>{{childMsg}}</span>'
    }
  }
})
```

### スコープの継承

もし必要な場合は `inherit: true` オプションを使用して子コンポーネントに対して、親の全てのプロパティをプロトタイプ継承させることができます:

``` js
var parent = new Vue({
  data: {
    a: 1
  }
})
// $addChild() はインスタンスメソッドで
// プログラムで子インスタンスを生成することができます
var child = parent.$addChild({
  inherit: true,
  data: {
    b: 2
  }
})
console.log(child.a) // -> 1
console.log(child.b) // -> 2
parent.a = 3
console.log(child.a) // -> 3
```

注意点: Vue インスタンスにおける各 data プロパティは getter / setter であるため、`child.a = 2` とセットすることは、親のプロパティをコピーして子に新規プロパティを作成する代わりに、 `parent.a` を変更します:

``` js
child.a = 4
console.log(parent.a) // -> 4
console.log(child.hasOwnProperty('a')) // -> false
```

### スコープに関する注釈

コンポーネントが親テンプレートの中で使用される時、e.g.:

``` html
<!-- 親テンプレート -->
<div v-component v-show="active" v-on="click:onClick"></div>
```

このディレクティブ (`v-show` と `v-on`) は親のスコープでコンパイルされます。そのため、 `active` という値と `onClick` は親で解決されます。子テンプレート内のいかなるディレクティブや挿入句は子のスコープでコンパイルされます。これによって、親と子のコンポーネント間のクリーンな住み分けが実現できます。

このルールはこのガイドで後述する [content insertion](#Content_Insertion) についても適用されます。

## コンポーネントライフサイクル

全てのコンポーネントや Vue インスタンスは自身のライフサイクルを持ちます: created, compiled, attached, detached, と最後に destroyed です。それぞれのキーとなるタイミングでインスタンスは対応したイベントを emit します。また、インスタンスの生成やコンポーネント定義の際に、それぞれのイベントに反応するためのライフサイクル hook 関数を渡すことができます。例えば:

``` js
var MyComponent = Vue.extend({
  created: function () {
    console.log('An instance of MyComponent has been created!')
  }
})
```

[full list of lifecycle hooks](/api/options.html#Lifecycle) で利用可能な API リファレンスを確認してください。

## 動的コンポーネント

`v-component` ディレクティブの中にある Mustache タグを使ってコンポーネントを動的に切り替える仕組みがあります。それは "ページの切り替え" を実現するルーターと共に使用することができます:

``` js
new Vue({
  el: 'body',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})
```

``` html
<div v-component="{{currentView}}">
  <!-- vm.currentview が変更されると、中身が変更されます! -->
</div>
```

ステートを保持したりや再レンダリングを避けたりするために、もし切り替えられたコンポーネントを活性化された状態で保持したい場合は、ディレクティブのパラメーター `keep-alive` を追加することができます:

``` html
<div v-component="{{currentView}}" keep-alive>
  <!-- 非活性になったコンポーネントをキャッシュします! -->
</div>
```

### トランジション操作

２つの追加の属性パラメーターにより、動的コンポーネントが一方からもう一方へどのようにトランジションするかの高度な操作が可能になります。

#### `wait-for`

現在のコンポーネントと切り替えられる前に、挿入される子コンポーネントを待つためのイベント名です。空白による望ましくないちらつきを回避するために、トランジションの開始の前に非同期なデータのロードを待つことが可能になります。

**例:**

``` html
<div v-component="{{view}}" wait-for="data-loaded"></div>
```
``` js
// コンポーネントの定義
{
  // compiled フックの中で非同期にデータを取得してイベントを発火します。
  // 例として jQuery を使っています。
  compiled: function () {
    var self = this
    $.ajax({
      // ...
      success: function (data) {
        self.$data = data
        self.$emit('data-loaded')
      }
    })
  }
}
```

#### `transition-mode`

デフォルトでは、入ってくるコンポーネントと出て行くコンポーネントのトランジションが同時に起こります。このパラメーターによって、２つの他のモードを設定することができます:

- `in-out`: 新しいコンポーネントのトランジションが初めに起こり、そのトランジションが完了した後に現在のコンポーネントの出て行くトランジションが開始します。
- `out-in`: 現在のコンポーネントが出て行くトランジションが初めに起こり、そのトランジションが完了した後に新しいコンポーネントのトランジションが開始します。

**例**

``` html
<!-- 先にフェードアウトし, その後フェードインします -->
<div v-component="{{view}}"
  v-transition="fade"
  transition-mode="out-in">
</div>
```

## リストとコンポーネント

オブジェクトの配列に対して、`v-component` と `v-repeat` を併用することができます。その場合、配列の中にあるそれぞれのオブジェクトに対して、そのオブジェクトを dataとして、また、指定されたコンポーネントをコンストラクタとして扱う子 ViewModel が生成されます。


``` html
<ul id="demo-4">
  <!-- 事前に登録した user-profile コンポーネントを再利用します -->
  <li v-repeat="users" v-component="user-profile"></li>
</ul>
```

``` js
var parent2 = new Vue({
  el: '#demo-4',
  data: {
    users: [
      {
        name: 'Chuck Norris',
        email: 'chuck@norris.com'
      },
      {
        name: 'Bruce Lee',
        email: 'bruce@lee.com'
      }
    ]
  }
})
```

**結果:**

<ul id="demo-4" class="demo"><li v-repeat="users" v-component="user-profile"></li></ul>
<script>
var parent2 = new Vue({
  el: '#demo-4',
  data: {
    users: [
      {
        name: 'Chuck Norris',
        email: 'chuck@norris.com'
      },
      {
        name: 'Bruce Lee',
        email: 'bruce@lee.com'
      }
    ]
  }
})
</script>

## 子の参照

時々、JavaScript でネストした子コンポーネントへのアクセスが必要になる場合があります。それを実現するためには `v-ref` を用いて子コンポーネントに対して参照 ID を割り当てる必要があります。例:

``` html
<div id="parent">
  <div v-component="user-profile" v-ref="profile"></div>
</div>
```

``` js
var parent = new Vue({ el: '#parent' })
// 子コンポーネントへのアクセス
var child = parent.$.profile
```

`v-ref` が `v-repeat` と共に使用された時は、得られる値はその data の配列をミラーリングした子コンポーネントが格納されている配列になります。

## イベントシステム

ViewModel の子や親に直接アクセスすることもできますが、コンポーネント間通信のためのビルトインのイベントシステムを使用した方が便利です。また、この仕組みによってコードの依存性を減らし、メンテナンスし易くなります。一度親子の関係が確立されれば、それぞれの ViewModel の [event instance methods](/api/instance-methods.html#Events) を使ったイベントのディスパッチやトリガーが可能になります。

``` js
var Child = Vue.extend({
  created: function () {
    this.$dispatch('child-created', this)
  }
})

var parent = new Vue({
  template: '<div v-component="child"></div>',
  components: {
    child: Child
  },
  created: function () {
    this.$on('child-created', function (child) {
      console.log('new child created: ')
      console.log(child)
    })
  }
})
```

<script>
var Child = Vue.extend({
  created: function () {
    this.$dispatch('child-created', this)
  }
})

var parent = new Vue({
  el: document.createElement('div'),
  template: '<div v-component="child"></div>',
  components: {
    child: Child
  },
  created: function () {
    this.$on('child-created', function (child) {
      console.log('new child created: ')
      console.log(child)
    })
  }
})
</script>

## プライベートアセット

時々、ディレクティブ、フィルタ、子コンポーネントなどのアセットをコンポーネントが使う必要がでてきます。しかし、コンポーネント自体を他のところでも再利用できるように、カプセル化されたそれらのアセットを保持したいと思うかもしれません。それはインスタンス化時にプライベートアセットのオプションを使用することによって実現できます。プライベートアセットは所有者であるコンポーネントとその子コンポーネントのインスタンスからのみアクセス可能なものになります。

``` js
// 全5種類のアセット
var MyComponent = Vue.extend({
  directives: {
    // id : グローバルメソッドと同じ定義のペア
    'private-directive': function () {
      // ...
    }
  },
  filters: {
    // ...
  },
  components: {
    // ...
  },
  partials: {
    // ...
  },
  effects: {
    // ...
  }
})
```

別の方法として、グローバルなアセットの登録メソッドと類似したチェーンするAPIを使用して、プライベートアセットを既存のコンポーネントのコンストラクタに追加することもできます:

``` js
MyComponent
  .directive('...', {})
  .filter('...', function () {})
  .component('...', {})
  // ...
```

## Content Insertion

再利用可能なコンポーネントを作るときに、コンポーネントの一部ではないホストしている要素 (Angular の "transclusion" の概念に類似したものです。) の中にある元のコンテンツへのアクセスや再利用がしばしば必要です。Vue.jsは現在の Web Components の仕様ドラフトと互換性のある content insertion の仕組みを実装しています。元のコンテンツに対する挿入ポイントとして機能する特別な `<content>` 要素を使用します。

<p class="tip">注釈: "transcluded" されたコンテンツは親コンポーネントのスコープの中でコンパイルされます。</p>

### Single Insertion Point

何も属性の無い一つの `<content>` タグしか存在しない時は、元のコンテンツ全体が DOM の中のその位置に挿入され、置換します。元々の `<content>` タグの内側のものは全て **fallback content** として解釈されます。Fallback content はホストしている要素が空で挿入されるべきコンテンツがない時にだけ表示されます。

`my-component` のテンプレート:

``` html
<h1>This is my component!</h1>
<content>This will only be displayed if no content is inserted</content>
```

このコンポーネントを使用した親のマークアップ:

``` html
<div v-component="my-component">
  <p>This is some original content</p>
  <p>This is some more original content</p>
</div>
```

レンダリングされる結果:

``` html
<div>
  <h1>This is my component!</h1>
  <p>This is some original content</p>
  <p>This is some more original content</p>
</div>
```

### Multiple Insertion Points

`<content>` 要素は CSS セレクタを期待する `select` という特殊な属性を持ちます。異なる `select` 属性を用いて複数の  `<content>` の挿入位置を指定することができます。それぞれは元のコンテンツの中でそのセレクタにマッチした要素によって置換されます。

`multi-insertion-component` のテンプレート:

``` html
<content select="p:nth-child(3)"></content>
<content select="p:nth-child(2)"></content>
<content select="p:nth-child(1)"></content>
```

親のマークアップ:

``` html
<div v-component="multi-insertion-component">
  <p>One</p>
  <p>Two</p>
  <p>Three</p>
</div>
```

レンダリングされる結果:

``` html
<div>
  <p>Three</p>
  <p>Two</p>
  <p>One</p>
</div>
```

content insertion の仕組みは、元のコンテンツがどのように組み替えられ、表示されるべきか、という点に関して素晴らしい管理機能を提供します。これによってコンポーネントが非常に柔軟性と再利用性が高いものになります。

次: [Applying Transition Effects](/guide/transitions.html).
