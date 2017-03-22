---
title: Bindings Class e Style
type: guide
order: 6
---

Uma necessidade comum de data binding é manipular uma lista de classe dos elementos e seus estilos inline. Uma vez que ambos são atributos, podemos usar v-bind para lidar com eles: Precisamos calcular uma string final com nossas expressões. No entanto, mexer com concatenação é irritante e propenso a erros. Por esta razão, Vue fornece aprimoramentos especiais quando `v-bind` é usado com `class` e `style`. Além de strings as expressões também podem avaliar objetos ou arrays.

## Binding em Classes HTML

### Sintaxe do objeto

Podemos passar um objeto para `v-bind:class` para alternar classes dinamicamente:

``` html
<div v-bind:class="{ active: isActive }"></div>
```

A sintaxe acima significa que a presença da classe `active` será determinada pela [veracidade](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) dos dados da propriedade de `isActive`.

Você pode ter múltiplas classes alternadas por ter mais campos no objeto. Além disso, a diretiva `v-bind:class` também pode co-existir com um atributo de classe ' simples'. Veja o exemplo:

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

Quando `isActive`ou `hasError`mudam, a lista de classes sera atualizada correspondentemente. Por exemplo, se `hasError` é `true`, a lista de classes será `"static active text-danger"`.

O objeto vinculado não precisa ser embutido.

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

Isto irá renderizar o mesmo resultado. Podemos também ligar a uma [computed property](computed.html) que retorne um objeto. Este é um padrão comum e poderoso.

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
      'text-danger': this.error && this.error.type === 'fatal',
    }
  }
}
```

### Array Sintaxe

Podemos passar um array para `v-bind:class` para aplicar uma lista de classess:

``` html
<div v-bind:class="[activeClass, errorClass]">
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

Se você preferir também alternar entre uma classe na lista condicionalmente, faça issoo com uma expressão Ternária:

``` html
<div v-bind:class="[isActive ? activeClass : '', errorClass]">
```

Isso semple aplicará `errorClass`, mas somente aplicará `activeClass` quando `isActive` for `true`.

No entanto, isso pode ser um tanto verboso se você tiver várias classes condicionais.Por isso também é possível usar a sintaxe de objeto dentro da sintaxe de array:

``` html
<div v-bind:class="[{ active: isActive }, errorClass]">
```

### With Components

> This section assumes knowledge of [Vue Components](components.html). Feel free to skip it and come back later.

When you use the `class` attribute on a custom component, those classes will be added to the component's root element. Existing classes on this element will not be overwritten.

For example, if you declare this component:

``` js
Vue.component('my-component', {
  template: '<p class="foo bar">Hi</p>'
})
```

Then add some classes when using it:

``` html
<my-component class="baz boo"></my-component>
```

The rendered HTML will be:

``` html
<p class="foo bar baz boo">Hi</p>
```

The same is true for class bindings:

``` html
<my-component v-bind:class="{ active: isActive }"></my-component>
```

When `isActive` is truthy, the rendered HTML will be:

``` html
<p class="foo bar active">Hi</p>
```

## Binding Inline Styles

### Sintaxe de Objeto

<<<<<<< HEAD:src/guide/class-and-style.md
A sintaxe de objeto para `v-bind:style` é bastante simples - parece quase CSS, só que é um objeto JavaScript. Você pode usar camelCase ou kebab-case para o nome da propriedade CSS.
=======
The object syntax for `v-bind:style` is pretty straightforward - it looks almost like CSS, except it's a JavaScript object. You can use either camelCase or kebab-case (use quotes with kebab-case) for the CSS property names:
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/class-and-style.md

``` html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```
``` js
data: {
  activeColor: 'red',
  fontSize: 30
}
```

Muitas vezes é uma boa ideia vincular um objeto diretamente no template para que o modelo fique mais limpo.

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

Novamente, a sintaxe de objeto é frequentemente usada em conjunto com propriedades computadas que retornam objetos.

### Sintaxe array

A sintaxe array para `v-bind:style` permite que você aplique múltiplos objetos de estilo para o mesmo elemento:

``` html
<div v-bind:style="[baseStyles, overridingStyles]">
```

### Auto prefixação

Quando você usa uma propriedade CSS que requerem vendor prefixos vendor, em  `v-bind:style`, por exemplo,  `transform`, o Vue irá automaticamente detectar e adicionar os prefixos apropriados para os estilos aplicados.
