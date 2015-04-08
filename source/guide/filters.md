title: Filters
type: guide
order: 4
---

## 要約

Vue.jsのフィルタは、本質的には「値を取り、加工し、加工した値を返す」関数です。マークアップでは、シングルパイプ(`|`)で表され 、一つ以上の引数を続けることができます。

``` html
<element directive="expression | filterId [args...]"></element>
```

## 例

フィルタは、 ディレクティブの値の最後に位置しなければなりません。

``` html
<span v-text="message | capitalize"></span>
```

mustache スタイルのバインディング内でも利用することができます。

``` html
<span>{{message | uppercase}}</span>
```

複数のフィルタはお互いに連結できます。

``` html
<span>{{message | lowercase | reverse}}</span>
```

## 引数

いくつかのフィルタはオプションの引数を取ることができます。単純に、スペース区切りの引数を追加してください。

``` html
<span>{{order | pluralize st nd rd th}}</span>
```

``` html
<input v-on="keyup: submitForm | key enter">
```

上記の例の明確な利用方法は、[full list of built-in filters](/api/filters.html) を参照してください。

これで、ディレクティブとフィルタについて知ることができました。では、実際に手を動かして[display a list of items](/guide/list.html)をやってみましょう。
