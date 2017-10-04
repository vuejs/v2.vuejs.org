---
title: Renderização Condicional
type: guide
order: 7
---

## `v-if`

Em _templates_ estilo Handlebars, poderíamos escrever blocos condicionais como este:

``` html
<!-- Handlebars template -->
{{#if ok}}
  <h1>Sim</h1>
{{/if}}
```

No Vue, usamos a diretiva `v-if` para atingir o mesmo resultado:

``` html
<h1 v-if="ok">Sim</h1>
```

Também é possível adicionar um bloco "senão" usando `v-else`:

``` html
<h1 v-if="ok">Sim</h1>
<h1 v-else>Não</h1>
```

### Grupos Condicionais com `<template>`

Como `v-if` é uma diretiva, deve ser anexado a um único elemento. E se quisermos alternar mais de um elemento? Podemos usar `v-if` em um elemento `<template>`, que serve como um invólucro invisível. O resultado final processado não incluirá o elemento `<template>`.

``` html
<template v-if="ok">
  <h1>Título</h1>
  <p>Parágrafo 1</p>
  <p>Parágrafo 2</p>
</template>
```

### `v-else`

É possível utilizar a diretiva `v-else` para indicar um "bloco _else_" para o `v-if`:

``` html
<div v-if="Math.random() > 0.5">
  Agora você me vê
</div>
<div v-else>
  Agora você não me vê
</div>
```

Um elemento `v-else` deve seguir imediatamente um elemento `v-if` ou `v-else-if`, caso contrário não será reconhecido.

### `v-else-if`

> Novo em 2.1.0+

O `v-else-if`, como o nome sugere, serve como um "bloco _else if_" ao `v-if`. Pode inclusive ser encadeado várias vezes:

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Não é A, B ou C
</div>
```

Similar ao `v-else`, um `v-else-if` deve seguir imediatamente um elemento `v-if` ou um elemento `v-else-if`.

### Controlando Reutilização com `key`

Vue busca renderizar elementos com a maior eficiência possível, os reutilizando ao invés de renderizar do zero. Além de ajudar o Vue a ser mais rápido, isto também traz vantagens úteis. Por exemplo, se você permite a seus usuários alternar entre múltiplos tipos de _login_:

``` html
<template v-if="loginType === 'username'">
  <label>Usuário</label>
  <input placeholder="Informe o nome de usuário">
</template>
<template v-else>
  <label>E-mail</label>
  <input placeholder="Informe o endereço de e-mail">
</template>
```

Alternar o `loginType` do código acima não irá limpar o que o usuário já tiver informado. Uma vez que ambos os _templates_ usam os mesmos elementos, o `<input>` não é substituído, apenas seu `placeholder`.

Veja isto em ação, preenchendo com algum texto e pressionando o botão para alternar:

{% raw %}
<div id="no-key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Usuário</label>
      <input placeholder="Informe o nome de usuário">
    </template>
    <template v-else>
      <label>E-mail</label>
      <input placeholder="Informe o endereço de e-mail">
    </template>
  </div>
  <button @click="toggleLoginType">Alternar tipo de Login</button>
</div>
<script>
new Vue({
  el: '#no-key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

<<<<<<< HEAD
Nem sempre este comportamento é desejado. Vue oferece um jeito de dizer "estes elementos são completamente separados, não os reutilize". É só usar atributos `key` com valores únicos:
=======
This isn't always desirable though, so Vue offers a way for you to say, "These two elements are completely separate - don't re-use them." Add a `key` attribute with unique values:
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

``` html
<template v-if="loginType === 'username'">
  <label>Usuário</label>
  <input placeholder="Informe o nome de usuário" key="username-input">
</template>
<template v-else>
  <label>E-mail</label>
  <input placeholder="Informe o endereço de e-mail" key="email-input">
</template>
```

Agora estes _inputs_ serão renderizados do zero cada vez que você alternar. Veja em ação:

{% raw %}
<div id="key-example" class="demo">
  <div>
    <template v-if="loginType === 'username'">
      <label>Usuário</label>
      <input placeholder="Informe o nome de usuário" key="username-input">
    </template>
    <template v-else>
      <label>E-mail</label>
      <input placeholder="Informe o endereço de e-mail" key="email-input">
    </template>
  </div>
  <button @click="toggleLoginType">Alternar tipo de Login</button>
</div>
<script>
new Vue({
  el: '#key-example',
  data: {
    loginType: 'username'
  },
  methods: {
    toggleLoginType: function () {
      return this.loginType = this.loginType === 'username' ? 'email' : 'username'
    }
  }
})
</script>
{% endraw %}

Observe que os elementos `<label>` ainda são eficientemente reutilizados, uma vez que não possuem atributos `key`.

## `v-show`

Outra opção para mostrar condicionalmente um elemento é a diretiva `v-show`. A utilização é basicamente a mesma.

``` html
<h1 v-show="ok">Olá!</h1>
```

<<<<<<< HEAD
A diferença é que um elemento com `v-show` sempre será renderizado e incluído no DOM; `v-show` simplesmente alterna a propriedade CSS `display` do elemento.
=======
The difference is that an element with `v-show` will always be rendered and remain in the DOM; `v-show` only toggles the `display` CSS property of the element.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

<p class="tip">Observe que `v-show` não oferece suporte à utilização em `<template>`, nem funciona com `v-else`.</p>

## `v-if` vs. `v-show`

`v-if` é a renderização condicional "real", pois garante que eventos e componentes filhos dentro do bloco condicional sejam devidamente destruídos e recriados durante a alternância.

`v-if` também é **preguiçoso**: se a condição for _false_ na renderização inicial, nada será feito - o bloco condicional não será processado até que a condição se torne _true_ pela primeira vez.

<<<<<<< HEAD
Em comparação, `v-show` é muito mais simples - o elemento sempre será renderizado independetemente da condição inicial, com alternância baseada simplesmente em CSS.
=======
In comparison, `v-show` is much simpler - the element is always rendered regardless of initial condition, with CSS-based toggling.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

De modo geral, `v-if` tem custo maior durante alternâncias de visibilidade, enquanto `v-show` tem custo maior na renderização inicial. Então prefira `v-show` se precisar alternar a visibilidade de algo com muita frequencia; e prefira `v-if` se a condição não tem tanta probabilidade de se modificar durante a execução.

## `v-if` com `v-for`

Quando utilizado em conjunto com `v-for`, este possui maior prioridade do que o `v-if`. Veja o guia de <a href="../guide/list.html#v-for-com-v-if">renderização de listas</a> para mais detalhes.
