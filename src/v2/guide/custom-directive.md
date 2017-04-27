---
title: Diretivas Personalizadas
type: guide
order: 16
---

## Introdução

Adicionalmente ao conjunto de diretivas incluídas no core, o Vue lhe permite registrar suas próprias diretivas personalizadas. Note que no Vue 2.0, a forma primária de abstração e reuso de código são componentes, no entanto, pode haver casos em que você só precisa de um acesso de baixo nível ao DOM em elementos simples, e aí diretivas personalizadas seriam úteis.
Um exemplo seria dar o foco a uma elemento input como este:


{% raw %}
<div id="simplest-directive-example" class="demo">
  <input v-focus>
</div>
<script>
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})
new Vue({
  el: '#simplest-directive-example'
})
</script>
{% endraw %}

Quando a página carrega, o elemento ganha o foco. Na verdade, se você ainda não clicou em nada desde que visitou esta página, o input acima deverá estar com o foco. Agora vamos construir a diretiva que faz isso:

``` js
// Register a global custom directive called v-focus
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.focus()
  }
})
```

Se você deseja registrar uma diretiva localmente em vez disso, os componentes também aceitam uma opção `directives`:

``` js
directives: {
  focus: {
    // directive definition
  }
}
```

Então, em um template você pode usar o novo atributo `v-focus` em qualquer elemento, como isto:


``` html
<input v-focus>
```

## Funções Hook

Um objeto de definição de diretiva pode prover algumas funções Hook (todas opcionais):

- `bind`: chamada apenas uma vez, quando a directiva é ligada pela primeira vez ao elemento. Aí é onde você pode fazer o trabalho de configuração uma vez.

- `inserted`: chamada quando o elemento foi inserido no nó pai(isso apenas garante a presença no nó pai, não necessariamente no documento).

- `update`: chamada após a atualização do componente container, __mas possivelmente antes da atualização de seus filhos__. O valor da diretiva pode ou não ter mudado, mas você pode ignorar atualizações desnecessárias, comparando os valores atuais e os antigos da vinculação (veja abaixo em hook arguments).

- `componentUpdated`: chamada após a atualização do componente container __e seus filhos__.

- `unbind`: chamada somente uma vez, quando a diretiva é desvinculada do elemento.

Iremos explorar os argumentos passados nessas funções hook (`el`, `binding`, `vnode`, e `oldVnode`) na próxima seção.

## Argumentos das funções Hook das diretivas

Os seguintes argumentos são passados nas funções hooks das diretivas

- **el**: O elemento a que a diretiva está vinculada. Isso pode ser usado para manipular o DOM diretamente.
- **binding**: Um objeto contendo as seguintes propriedades.
  - **name**: O nome da diretiva, sem o prefixo `v-`.
  - **value**: O valor passado para a diretiva. Por exemplo em `v-my-directive="1 + 1"`, o valor passado é `2`.
  - **oldValue**: O valor anterior, somente disponível em `update` e `componentUpdated`. Está presente se o valor foi alterado ou não.
  - **expression**: A expressão de vinculação como uma string. Por exemplo em `v-my-directive="1 + 1"`, a expressão seria `"1 + 1"`.
  - **arg**: O argumento passado para a diretiva, se algum. Por exemplo em `v-my-directive:foo`, o argumento seria `"foo"`.
  - **modifiers**: Um objeto contendo modificadores, se algum. Por exemplo em `v-my-directive.foo.bar`, o objeto seria `{ foo: true, bar: true }`.
- **vnode**: O nó virtual produzido pelo compilador do Vue. Veja [VNode API](/api/#VNode-Interface) para mais detalhes.
- **oldVnode**: O nó virtual anterior, somente disponível em hooks `update` e `componentUpdated`.

<p class="tip">Tirando `el`, você deve tratar esses argumentos como **somente leitura** e nunca modificá-los. Se você precisa compartilhar informações entre hooks, é aconselhável fazê-lo através do elemento [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset).</p>

Um exemplo de diretiva personalizada utilizando algumas dessas propriedades:

``` html
<div id="hook-arguments-example" v-demo:foo.a.b="message"></div>
```

``` js
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})

new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
```

{% raw %}
<div id="hook-arguments-example" v-demo:foo.a.b="message" class="demo"></div>
<script>
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})
new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
</script>
{% endraw %}

## Forma Abreviada de Funções

Em muitos casos, você pode querer ter o mesmo comportamento em `bind` e `update`, mas sem se importar com outros hooks. Por exemplo:


``` js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

## Objetos Literais

Se sua diretiva precisa de múltiplos valores, você pode passados em um objeto literal JavaScript. Lembre-se de que as diretivas podem ter qualquer objeto JavaScript válido.

``` html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

``` js
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})
```
