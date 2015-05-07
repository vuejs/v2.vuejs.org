title: カスタムフィルタ
type: guide
order: 10
---

## 基本

カスタムディレクティブと同様に、グローバルな `Vue.filter()` を使用してカスタマイズしたフィルタを登録することができます。引数には **filterID** と **filter function** を渡します。このフィルタの関数は引数として値を受け取って、変換した値を返します:

``` js
Vue.filter('reverse', function (value) {
  return value.split('').reverse().join('')
})
```

``` html
<!-- 'abc' => 'cba' -->
<span v-text="message | reverse"></span>
```

フィルタ関数はインラインの引数を受け取ることもできます:

``` js
Vue.filter('wrap', function (value, begin, end) {
  return begin + value + end
})
```

``` html
<!-- 'hello' => 'before hello after' -->
<span v-text="message | wrap before after"></span>
```

## 双方向フィルタ

これまでフィルタはモデルから渡される値をビューに表示される前に変換するために使用していました。しかし、input 要素などのビューからモデルに書き込みがされる前に値を変換するフィルタの定義も可能です。

``` js
Vue.filter('check-email', {
  // read は任意のもので、
  // ここではデモ用に記載します
  read: function (val) {
    return val
  },
  // モデルへの書き出しが行われる前に
  // 呼び出されます
  write: function (val, oldVal) {
    return isEmail(val) ? val : oldVal
  }
})
```

## フィルタコンテキスト

フィルタが呼び出される時、`this` のコンテキストにはそれを呼び出している Vue インスタンスがセットされます。これによって、その所有者である Vue インスタンスの状態に応じて動的な結果を出力することが可能になります。

例:

``` js
Vue.filter('concat', function (value, key) {
  // `this` はフィルタを呼び出す Vue インスタンスを指します
  return value + this[key]
})
```
``` html
<input v-model="userInput">
<span>{{msg | concat userInput}}</span>
```

上記の簡単な例では、 expression をそのまま記述した時と同じ結果が得られます。しかし、複数のステートメントが必要な複雑な処理においては、Computed Property もしくは カスタムフィルタが必要になります。

ビルトインの `filterBy` と `orderBy` フィルタは共に渡された配列に対して重要な変更を行うものであり、所有者である Vue インスタンスの現在の状態に依存するものです。

以上！これで次は [Component System](/guide/components.html) がどのように動作するか学ぶ時間です。