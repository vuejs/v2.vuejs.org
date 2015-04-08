title: Directives
type: guide
order: 3
---

## 概要

もし AngularJS を以前使ったことがないのであれば、あなたはおそらくディレクティブ( Directive )とは何であるか知らないでしょう。ディレクティブとは、 DOM 要素に対して何かを実行することをライブラリに伝達する、マークアップ中の特別なトークンです。Angular のものと比べ、 Vue.js でのディレクティブのコンセプトは徹底的にシンプルです。Vue.jsのディレクティブは、下記のフォーマットのように、接頭辞のついた HTML 属性の形でのみ表されます。

``` html
<element
  prefix-directiveId="[argument:] expression [| filters...]">
</element>
```

## シンプルな例

``` html
<div v-text="message"></div>
```

このように、接頭辞はデフォルトで `v` です。このディレクティブ ID は `text` で、expression は `message` です。Vue インスタンス上の `message` プロパティが変更される時は常に、このディレクティブは Vue.js にdivの `textContent` を更新させます。

## インライン表現

``` html
<div v-text="'hello ' + user.firstName + ' ' + user.lastName"></div>
```

このように、私達は単一のプロパティキーの代わりに、 computed expression を使用します。Vue.jsは expression が依存しているプロパティを自動的に監視し、変更があったときは常にディレクティブを更新します。非同期バッチ更新のおかげで、もし複数の依存関係に変更があったとしても、 expression はイベントループ毎に一度だけ更新されます。

特に副作用（イベントリスナ expression を除く）のある statement の場合には、テンプレート内でロジックが過多になるのを避けるため、 expression を賢く利用してください。テンプレート内でロジックの使いすぎを防止するため、 Vue.js でのインライン expression は **１ statement のみ** に制限されています。更に複雑な操作を要するバインディングには、代わりに　[Computed Properties](/guide/computed.html) を利用してください。

<p class="tip">セキュリティ上の事由のため、インライン expression では、現在のコンテキストの Vue インスタンスおよび、親のプロパティとメソッドにのみアクセスできます。</p>

## 引数

``` html
<div v-on="click : clickHandler"></div>
```

いくつかのディレクティブでは、キーパスまたは expression の前に引数が必要です。この例での `click` 引数は、`v-on` ディレクティブによって click イベントを監視し、そして ViewModel インスタンスの `clickHandler` メソッドを呼び出すことを表します。

## フィルタ

DOM の更新前に値をさらに加工するために、フィルタをディレクティブ・キーパスもしくは expression に追加することができます。フィルタは、シェルスクリプトに見られるような単一のパイプ(`|`)で表されます。詳しくは [Filters in Depth](/guide/filters.html) を参照してください。

## 複数のクラス

カンマで区切ることで、一つの属性内の同じディレクティブ内に、複数のバインディングを定義することができます。これらは、内部では複数のディレクティブ・インスタンスにバインドされます。

``` html
<div v-on="
  click   : onClick,
  keyup   : onKeyup,
  keydown : onKeydown
">
</div>
```

## リテラルディレクティブ

いくつかのディレクティブはデータバインディングを生成せず、単に文字列リテラルを属性値として取ります。例えば、`v-component` ディレクティブでは下記のようになります。

``` html
<div v-component="my-component"></div>
```

このように、 `"my-component"` はデータプロパティではなく、対応するコンポーネントコンストラクタの検索に利用される文字列IDです。

また、リテラルディレクティブの内部では mustache expression を利用できます。例えば、以下のコードで、利用したいコンポーネントのタイプを動的に解決できます。

``` html
<div v-component="{&#123; isOwner ? 'owner-panel' : 'guest-panel' &#125;}"></div>
```

mustache 内部の expression が変更されるのに応じて、レンダリングされたコンポーネントもまた変更されます！

しかしながら、この種の反応的な振る舞いを持っているリテラルディレクティブは、`v-component` と `v-partial` だけであることに留意してください。他のリテラルディレクティブ（例：`v-ref`）内の Mustache expression は、 **一度だけ** 評価されます。ディレクティブのコンパイル実行後、値の変化に反応することはありません。

リテラルディレクティブの全リストは [API reference](/api/directives.html#Literal_Directives) 内にあります。

## 空のディレクティブ

いくつかのディレクティブは、属性値すら期待せず、単純にその要素に何かを一度きり行います。例えば `v-pre` ディレクティブでは下記のようになります。

``` html
<div v-pre>
  <!-- この内部のマークアップはコンパイルされません -->
</div>
```

空のディレクティブの全リストは[API reference](/api/directives.html#Empty_Directives) 内にあります。

では次に、[Filters](/guide/filters.html)について説明しましょう。
