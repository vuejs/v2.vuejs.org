---
title: A Instância Vue
type: guide
order: 3
---

## Construtor

Todo vm do Vue é iniciado pela criação da **instância raiz do Vue** com a função construtora do Vue:

``` js
var vm = new Vue({
  // opções
})
```

Embora não seja estritamente associado com o [padrão MVVM](https://en.wikipedia.org/wiki/Model_View_ViewModel), o design do Vue foi sem dúvida inspirado por ele. Como convenção, muitas vezes usamos a variável `vm` (abreviação de ViewModel) para se referir à instância Vue.

Quando você criar uma instância do Vue, é necessário repassar um **objeto** que contém opções para dados, elementos, métodos, ciclos de vida e mais. A lista completa de opções pode ser encontrada na [API](/api).

O construtor `Vue` pode ser estendido para a criação de **contrutores de componentes** reutilizáveis com opções pré definidas:

``` js
var MyComponent = Vue.extend({
  // opções da extensão
})

// todas as instâncias de `MyComponent` são criadas com
// as definições pré definidas pelas opções
var myComponentInstance = new MyComponent()
```

Embora seja possível criar instâncias repetidamente, na maioria das vezes é recomendado compô-los declarativamente em templates com elementos customizáveis. Vamos falar sobre [o sistema de componentes](components.html) com mais detalhes depois. Por enquanto, você precisa apenas saber que todos os componentes Vue são essencialmente extensões da instância Vue.

## Propriedades e Métodos

Cada instância Vue conecta todas as propriedades encontradas no objeto `data`.

``` js
var data = { a: 1 }
var vm = new Vue({
  data: data
})

vm.a === data.a // -> true

// definido a propriedade também afeta os dados originais
vm.a = 2
data.a // -> 2

// ... e vice-versa
data.a = 3
vm.a // -> 3
```

Deve-se notar que somente estas propriedades relacionadas são **reativas**. Se você definir uma nova propriedade para a instância após ela ser criada, ela não irá provocar nenhuma atualização na view. Vamos discutir o sistema de reatividade em detalhes mais tarde.

Além das propriedade data, a instância Vue expõe um número de propriedades e métodos muito úteis. Estas propriedades e métodos são prefixadas com `$` para se diferenciar das propriedades que foram conectadas. Por exemplo:

``` js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // -> true
vm.$el === document.getElementById('example') // -> true

// $watch é um método de instância
vm.$watch('a', function (newVal, oldVal) {
  // este callback será chamado quando `vm.a` muda
})
```

<p class="tip">
Não use [arrow functions](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) em uma propriedade de instância ou callback (ex: `vm.$watch('a', newVal => this.myMethod())`). Como as arrow functions estão vinculadas ao contexto pai, então `this` não será a instância Vue como você espera, e `this.myMethod` será indefinida.
</p>

Consulte a [API](../api) para a lista completa de propriedades e métodos.

## Ciclo de vida da instância

Cada instância Vue passa por uma série de etapas na sua inicialização - por exemplo, é necessário configurar o observador do data, compilar o template, montar a instância na DOM, e atualizar a DOM quando os dados forem alterados.

Ao longo do caminho, Vue irá também invocar alguns **lifecycle hooks**, no qual lhe dá algumas oportunidades para executar uma lógica customizada. Por exemplo, `created` é chamado após a instancia do Vue ser criada:

``` js
var vm = new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` aponta para a instância vm
    console.log('a is: ' + this.a)
  }
})
// -> "a is: 1"
```

Existem outros hooks no qual serão chamados em diferentes etapas do ciclo de vida, como por exemplo `mounted`, `updated`, e `destroyed`. Todos os ciclos de vida são chamados com o seu `this` no contexto da instância Vue sendo invocada. Alguns usuários podem se questionar se o conceito de "controllers" está presente no mundo Vue, e a resposta é: não existem controllers. Sua lógica personalizada para um componente deverá fazer parte destes hooks do ciclo de vida.

## Diagrama do ciclo de vida

Abaixo está um diagrama para o ciclo de vida do uma instância do Vue. Você não precisa entender completamente tudo do que está acontecendo no ciclo, mas este diagrama será útil no futuro.

![Ciclo de vida](/images/lifecycle.png)
