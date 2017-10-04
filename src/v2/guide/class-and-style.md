---
title: Interligações em Classes e Estilos
type: guide
order: 6
---

<<<<<<< HEAD
Uma necessidade comum de interligação de dados com _templates_ é manipular as classes dos elementos e/ou seus estilos _inline_. Uma vez que ambos são atributos, podemos usar `v-bind` para lidar com eles, mas precisaríamos montar uma String final com nossas expressões. No entanto, mexer com concatenação é irritante e propenso a erros. Por esta razão, Vue fornece aprimoramentos especiais quando `v-bind` é usado com `class` e `style`. Além de Strings, as expressões também podem avaliar Objetos ou Arrays.
=======
A common need for data binding is manipulating an element's class list and its inline styles. Since they are both attributes, we can use `v-bind` to handle them: we only need to calculate a final string with our expressions. However, meddling with string concatenation is annoying and error-prone. For this reason, Vue provides special enhancements when `v-bind` is used with `class` and `style`. In addition to strings, the expressions can also evaluate to objects or arrays.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

## Vinculando em Classes HTML

### Sintaxe do Objeto

Podemos passar um objeto para `v-bind:class` para alternar classes dinamicamente:

``` html
<div v-bind:class="{ active: isActive }"></div>
```

A sintaxe acima significa que a presença da classe `active` será determinada pela [veracidade](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) do valor do dado `isActive`.

Você pode ter múltiplas classes alternadas por ter mais campos no objeto. Além disso, a diretiva `v-bind:class` também pode coexistir com um atributo de classe "normal". Veja o exemplo:

``` html
<div class="static"
     v-bind:class="{ active: isActive, 'text-danger': hasError }">
</div>
```

Com os seguintes dados:

``` js
data: {
  isActive: true,
  hasError: false
}
```

Isso irá renderizar como:

``` html
<div class="static active"></div>
```

Quando `isActive` ou `hasError` mudar, a lista de classes será atualizada correspondentemente. Por exemplo, se `hasError` é `true`, a lista de classes será `"static active text-danger"`.

O objeto vinculado não precisa estar diretamente no _template_:

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```

Isto irá renderizar o mesmo resultado. Podemos também ligar a um [dado computado](computed.html) que retorne um objeto. Esta é uma prática comum mas poderosa.

``` html
<div v-bind:class="classObject"></div>
```
``` js
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

### Sintaxe de Array

Podemos passar um Array para `v-bind:class` para aplicar uma lista de classes:

``` html
<div v-bind:class="[activeClass, errorClass]"></div>
```
``` js
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```

Que renderizará:

``` html
<div class="active text-danger"></div>
```

Se você preferir também alternar entre uma classe na lista condicionalmente, use uma expressão ternária:

``` html
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
```

Isso semple aplicará `errorClass`, mas somente aplicará `activeClass` quando `isActive` for `true`.

No entanto, isso pode ser um tanto prolixo se você tiver várias classes condicionais. Por isso também é possível usar a sintaxe de objeto dentro da sintaxe de Array:

``` html
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```

### Em Componentes

> Esta seção assume conhecimento sobre [Componentes](components.html). Pode pular esta parte e voltar depois.

Quando você utiliza o atributo `class` em um componente personalizado, estas classes serão adicionadas ao elemento raiz. Classes que já existam neste elemento não serão removidas.

Por exemplo, se você declarar este componente:

``` js
Vue.component('my-component', {
  template: '<p class="foo bar">Oi</p>'
})
```

E então adicionar mais classes quando for utilizá-lo:

``` html
<my-component class="baz boo"></my-component>
```

O HTML resultante será:

``` html
<p class="foo bar baz boo">Oi</p>
```

O mesmo vale para v-bind de classe:

``` html
<my-component v-bind:class="{ active: isActive }"></my-component>
```

Quando `isActive` for verdadeiro, o HTML resultante será:

``` html
<p class="foo bar active">Oi</p>
```

## Vinculando em Estilos Inline

### Sintaxe de Objeto

A sintaxe de objeto para `v-bind:style` é bastante simples - parece quase CSS, mas em um objeto JavaScript. Você pode usar _camelCase_ ou _kebab-case_ para o nome da propriedade CSS.

``` html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```
``` js
data: {
  activeColor: 'red',
  fontSize: 30
}
```

Muitas vezes é uma boa ideia vincular um objeto diretamente no _template_ para que fique mais limpo.

``` html
<div v-bind:style="styleObject"></div>
```
``` js
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```

Novamente, a sintaxe de objeto é frequentemente usada em conjunto com dados computados que retornam objetos.

### Sintaxe de Array

A sintaxe Array para `v-bind:style` permite que você aplique múltiplos objetos de estilo para o mesmo elemento:

``` html
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

### Auto-Prefixação

Quando você usa uma propriedade CSS que requer [prefixos de fabricantes](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) em `v-bind:style`, por exemplo `transform`, Vue irá automaticamente detectar e adicionar os prefixos apropriados para os estilos aplicados.

### Valores Múltiplos

> A partir de 2.3.0+

Nas versões 2.3.0+ você pode prover um Array com múltiplos valores (prefixados) para estilizar um atributo, por exemplo:

``` html
<div v-bind:style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

Isto irá renderizar apenas o último valor do Array que o navegador suportar. Neste exemplo, irá renderizar `display: flex` nos navegadores que suportam a versão sem prefixo do módulo Flexbox.
