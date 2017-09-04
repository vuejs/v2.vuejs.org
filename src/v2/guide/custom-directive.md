---
title: Diretivas Personalizadas
type: guide
order: 302
---

## Introdução

Adicionalmente ao conjunto de diretivas incluídas em seu núcleo, Vue permite registrar suas próprias diretivas personalizadas. Note que no Vue 2.0+, a forma primária de abstração e reuso de código são componentes, no entanto, pode haver casos em que você só precisa de um acesso de baixo nível ao DOM em elementos simples, e aí diretivas personalizadas seriam úteis. Um exemplo seria colocar o foco a um elemento _input_ como este:

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

Quando a página carrega, o elemento ganha o foco. Na verdade, se você ainda não clicou em nada desde que visitou esta página do guia, o _input_ acima deverá estar com o foco. Agora vamos construir esta diretiva:

``` js
// Registra a diretiva personalizada global chamada v-focus
Vue.directive('focus', {
  // Quando o elemento vinculado é inserido no DOM...
  inserted: function (el) {
    // Coloque o foco no elemento
    el.focus()
  }
})
```

Se você deseja registrar uma diretiva localmente em vez disso, os componentes também aceitam uma opção `directives`:

``` js
directives: {
  focus: {
    // Definição da diretiva
  }
}
```

Então, em um _template_ você pode usar o novo atributo `v-focus` para qualquer elemento, por exemplo:

``` html
<input v-focus>
```

## Funções de Gatilhos

Um objeto de definição de diretiva pode prover algumas funções de gatilhos (todas opcionais):

- `bind`: chamada apenas uma vez, quando a directiva é interligada pela primeira vez ao elemento. Aí é onde você pode fazer o trabalho de configuração inicial.

- `inserted`: chamada quando o elemento for inserido no nó pai (garante a presença no nó pai, mas não necessariamente no documento).

- `update`: chamada após a atualização do VNode que contém o componente, __mas possivelmente antes da atualização de seus filhos__. O valor da diretiva pode ou não ter mudado, mas você pode evitar atualizações desnecessárias comparando os valores atuais com os antigos (veja abaixo, em argumentos dos gatilhos).

- `componentUpdated`: chamada após a atualização do Vnode que contém o componente, __inclusive de seus filhos__.

- `unbind`: chamada somente uma vez, quando a diretiva é desvinculada do elemento.

Iremos a seguir explorar os argumentos que podem ser passados nessas funções de gatilho (`el`, `binding`, `vnode`, e `oldVnode`).

## Argumentos nos Gatilhos

Os seguintes argumentos são esperados nas funções de gatilho das diretivas:

- **el**: O elemento a que a diretiva está vinculada. Isso pode ser usado para manipular o DOM diretamente.
- **binding**: Um objeto contendo as seguintes propriedades:
  - **name**: O nome da diretiva, sem o prefixo `v-`.
  - **value**: O valor passado para a diretiva. Por exemplo em `v-my-directive="1 + 1"`, o valor passado é `2`.
  - **oldValue**: O valor anterior, somente disponível em `update` e `componentUpdated`. Está presente tanto se o valor foi alterado quanto não alterado.
  - **expression**: A expressão de vinculação como uma string. Por exemplo em `v-my-directive="1 + 1"`, a expressão seria `"1 + 1"`.
  - **arg**: O argumento passado para a diretiva, se houver algum. Por exemplo em `v-my-directive:foo`, o argumento seria `"foo"`.
  - **modifiers**: Um objeto contendo modificadores, se houver algum. Por exemplo em `v-my-directive.foo.bar`, o objeto seria `{ foo: true, bar: true }`.
- **vnode**: O nó virtual produzido pelo compilador do Vue. Veja [VNode API](/api/#VNode-Interface) para mais detalhes.
- **oldVnode**: O nó virtual anterior, somente disponível em `update` e `componentUpdated`.

<p class="tip">Exceto `el`, você deve tratar os outros argumentos como **somente leitura** e nunca modificá-los. Se você precisar compartilhar informações entre gatilhos, é aconselhável utilizar um atributo [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset).</p>

Eis um exemplo de diretiva personalizada utilizando algumas dessas propriedades:

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
    message: 'Olá!'
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
    message: 'Olá!'
  }
})
</script>
{% endraw %}

## Forma Abreviada de Funções

Em muitos casos, você pode querer ter o mesmo comportamento nos gatilhos `bind` e `update`, e não se importar com os outros gatilhos. Por exemplo:

``` js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

## Objetos Literais

Se sua diretiva precisa de múltiplos valores, você pode passá-los em um objeto literal JavaScript. Lembre-se que as diretivas podem ter qualquer objeto JavaScript válido.

``` html
<div v-demo="{ color: 'white', text: 'Olá!' }"></div>
```

``` js
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "Olá!"
})
```
