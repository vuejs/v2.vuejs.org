---
title: A Instância Vue
type: guide
order: 3
---

## Construtor

Todo objeto `vm` é iniciado através de uma **instância raiz do Vue** com a função construtora:

``` js
var vm = new Vue({
  // opções
})
```

Embora não seja estritamente associado com o [padrão MVVM](https://en.wikipedia.org/wiki/Model_View_ViewModel), o _design_ do Vue foi sem dúvida inspirado por ele. Como convenção, muitas vezes usamos a variável `vm` (abreviação de _ViewModel_) para se referir à instância Vue.

Quando você cria uma instância, é necessário passar um **objeto** que contém opções para dados, elementos, métodos, ciclos de vida, dentre outros. A lista completa de opções pode ser encontrada na [API](/api).

O construtor `Vue` pode ser estendido para a criação de **contrutores de componentes** reutilizáveis com opções pré-definidas:

``` js
var MyComponent = Vue.extend({
  // opções da extensão
})

// todas as instâncias de `MyComponent` são criadas
// com as definições pré definidas pelas opções
var myComponentInstance = new MyComponent()
```

Embora seja possível criar instâncias repetidamente, na maioria das vezes é recomendado compô-las declarativamente em _templates_ com elementos personalizados. Vamos falar sobre [o sistema de componentes](components.html) com mais detalhes depois. Por enquanto, você precisa apenas saber que todos os componentes Vue são essencialmente extensões da instância Vue.

## Propriedades e Métodos

Cada instância Vue conecta todas as propriedades encontradas no objeto `data`.

``` js
var data = { a: 1 }
var vm = new Vue({
  data: data
})

vm.a === data.a // -> true

// atribuindo à propriedade também afeta os dados originais
vm.a = 2
data.a // -> 2

// ... e vice-versa
data.a = 3
vm.a // -> 3
```

Deve-se notar que somente estas propriedades relacionadas são **reativas**. Se você definir uma nova propriedade para a instância após ela ser criada, ela não irá provocar nenhuma atualização na _view_. Vamos discutir o sistema de reatividade em detalhes mais tarde.

Além das propriedade `data`, a instância Vue expõe uma variedade de propriedades e métodos muito úteis. Estas propriedades e métodos são prefixadas com `$` para se diferenciar das propriedades que foram definidas pelo desenvolvedor. Por exemplo:

``` js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // -> true
vm.$el === document.getElementById('example') // -> true

// $watch é um método da instância
vm.$watch('a', function (newVal, oldVal) {
  // este callback será chamado quando `vm.a` mudar
})
```

<p class="tip">
Não utilize [arrow functions](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) em uma propriedade de instância ou _callback_ (ex: `vm.$watch('a', (newVal, oldVal) => this.myMethod())`). Como as _arrow functions_ são vinculadas ao contexto pai, o `this` não representará a instância Vue como você espera, ou seja, `this.myMethod` estará indefinida.
</p>

Consulte a [API](../api) para a lista completa de propriedades e métodos.

## Ciclo de Vida da Instância

Cada instância Vue passa por uma série de etapas em sua inicialização - por exemplo, é necessário configurar o observador do `data`, compilar o _template_, montar a instância no DOM, atualizar o DOM quando os dados forem alterados.

Ao longo do caminho, Vue irá também invocar alguns **gatilhos de ciclo-de-vida**, nos quais você terá oportunidade de executar uma lógicas personalizadas. Por exemplo, `created` é chamado após a instancia do Vue ser criada:

``` js
var vm = new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` aponta para a instância vm
    console.log('a é ' + this.a)
  }
})
// -> "a é 1"
```

Existem outros gatilhos (em inglês, _hooks_) chamados em diferentes etapas do ciclo de vida, por exemplo `mounted`, `updated`, e `destroyed`. Todas as etapas do ciclo de vida são chamadas com o `this` no contexto da instância Vue sendo invocada. Alguns usuários podem se questionar se o conceito de _controllers_ está presente no mundo Vue, e a resposta é: não existem _controllers_. Sua lógica personalizada para um componente estará nestes _hooks_ do ciclo de vida.

## Diagrama do Ciclo de Vida

Abaixo está um diagrama para o ciclo de vida de uma instância Vue. Você não precisa entender completamente tudo o que está acontecendo no ciclo, mas este diagrama poderá ser útil no futuro.

![Ciclo de vida](/images/lifecycle.png)
