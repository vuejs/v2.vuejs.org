---
title: Renderização Condicional
type: guide
order: 7
---



## v-if

Em string templates, Handlebars por exemplo, escreveríamos um bloco condicional como este:

``` html
<!-- Handlebars template -->
{{#if ok}}
  <h1>Yes</h1>
{{/if}}
```

No Vue, usamos a diretiva `v-if` para conseguir o mesmo:

``` html
<h1 v-if="ok">Yes</h1>
```

Também é possível adicionar um bloco "else" com `v-else`:

``` html
<h1 v-if="ok">Yes</h1>
<h1 v-else>No</h1>
```

### Template v-if

Como `v-if` é uma diretiva, precisa ser anexado a um único elemento. Mas e se quisermos alternar entre mais de um elemento? Neste caso podemos usar `v-if` em um elemento `<template>`, que serve como um invólucro invisível. O resultado final processado não incluirá o elemento `<template>`.

``` html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

### v-else

Você pode usar a diretiva `v-else` para indicar um "bloco else" para `v-if`:

``` html
<div v-if="Math.random() > 0.5">
  Now you see me
</div>
<div v-else>
  Now you don't
</div>
```

O elemento `v-else` deve seguir imediatamente o `v-if` - caso contrário `v-else` não será reconhecido.

## v-show

Outra opção para mostrar condicionalmente um elemento é a diretiva `v-show`. O que é basicamente o mesmo.

``` html
<h1 v-show="ok">Hello!</h1>
```

A diferença é que um elemento com `v-show` sempre será renderizado e incluído no DOM; `v-show` simplesmente alterna a propriedade CSS `display` do elemento.

<p class="tip">Observe que `v-show` não oferece suporte a sintaxe de   `<template>`, nem funciona com `v-else`.</p>

## v-if vs. v-show

`v-if` é a renderização condicional "real", pois garante que event listeners e  componentes child dentro do bloco condicional sejam devidamente destruídos e recriados durante a alternância.

`v-if` também é **preguiçoso**: se a condição for false na renderização inicial, `v-if` não fará nada - o bloco condicional não vai ser processado até que a condição se torne verdadeira pela primeira vez.

Em comparação, `v-show` é muito mais simples - o elemento é sempre processado independentemente da condição inicial, a visibilidade do elemento se basea simplesmente na alteração do CSS.

De um modo geral, `v-if` tem um custo maior de alternância, enquanto `v-show` tem um custo maior na renderização inicial. Então prefira `v-show`, se você precisa alternar alguma coisa muito frequentemente; e prefira `v-if` se é mais improvável que a condição mude em tempo de execução.