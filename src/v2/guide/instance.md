---
title: A Instância Vue
type: guide
order: 3
---

## Criando a Instância Vue

Toda aplicação Vue é inicializada através da criação de uma nova **instância Vue** com a função `Vue`:

``` js
var vm = new Vue({
  // opções
})
```

Embora não seja estritamente associado com o [padrão MVVM](https://en.wikipedia.org/wiki/Model_View_ViewModel), o _design_ do Vue foi parcialmente inspirado por ele. Como convenção, muitas vezes usamos a variável `vm` (abreviação de _ViewModel_) para se referir à instância Vue.

Quando você cria uma instância Vue, é necessário passar um **objeto de opções**. A maior parte deste guia descreve como você pode utilizar estas opções para criar os comportamentos desejados. Para referência, você também pode navegar pela lista completa de opções na [documentação da API](../api/#Opcoes-Dados).

Uma aplicação Vue consiste em uma **instância Vue raiz** criada com `new Vue`, opcionalmente organizada em uma árvore de componentes reutilizáveis aninhados. Por exemplo, um aplicativo de tarefas a realizar (do tipo _todo list_) poderia ter uma árvore de componentes como esta:

```
Instância Raiz
|- TodoList
   |- TodoItem
      |- DeleteTodoButton
      |- EditTodoButton
   |- TodoListFooter
      |- ClearTodosButton
      |- TodoListStatistics
```

Falaremos sobre o [sistema de componentes](components.html) em detalhes futuramente. Por enquanto, saiba apenas que todos os componentes Vue também são instâncias, e aceitam o mesmo esquema de opções (exceto por algumas poucas opções específicas da raiz).

## Dados e Métodos

Quando uma instância Vue é criada,  ela adiciona todas as propriedades encontradas no objeto `data` ao **sistema de reatividade** do Vue. Quando os valores de qualquer destas propriedades muda, a camada visual "reage", atualizando-se para condizer com os novos valores. 

``` js
// Nosso objeto de dados
var data = { a: 1 }

// O objeto é adicionado à instância Vue
var vm = new Vue({
  data: data
})

// É uma referência ao mesmo objeto!
vm.a === data.a // => true

// Atribuir à propriedade na instância
// também afeta o dado original
vm.a = 2
data.a // => 2

// ... e vice-versa
data.a = 3
vm.a // => 3
```

Quando este dado for modificado, a camada visual irá re-renderizar. Deve-se observar que propriedades em `data` são **reativas** somente se já existem desde quando a instância foi criada. Significa que se você adicionar uma nova propriedade, como:

``` js
vm.b = 'hi'
```

Então as mudanças em `b` não irão disparar qualquer atualização na interface. Se você sabe que precisará de uma propriedade no futuro, mas ela inicia vazia ou não existente, apenas especifique algum valor inicial para ela. Por exemplo:

``` js
data: {
  newTodoText: '',
  visitCount: 0,
  hideCompletedTodos: false,
  todos: [],
  error: null
}
```

Em adição às propriedades de dados, instâncias Vue expõem uma quantidade relevante de propriedades e métodos. Estas são diferenciadas pelo prefixo `$` para não confundí-las com propriedades definidas pelo usuário. Por exemplo:

``` js
var data = { a: 1 }
var vm = new Vue({
  el: '#exemplo',
  data: data
})

vm.$data === data // => true
vm.$el === document.getElementById('exemplo') // => true

// $watch é um método da instância
vm.$watch('a', function (newValue, oldValue) {
  // Esta função será executada quando `vm.a` mudar
})
```

No futuro, você pode consultar a [documentação da API](../api/#Propriedades-de-Instancia) para a lista completa de propriedades e métodos da instância.

## Ciclo de Vida da Instância

Cada instância Vue passa por uma série de etapas em sua inicialização - por exemplo, é necessário configurar a observação de dados, compilar o _template_, montar a instância no DOM, atualizar o DOM quando os dados forem alterados. Ao longo do caminho, ocorrerá a invocação de alguns **gatilhos de ciclo de vida**, oferecendo a oportunidade de executar lógicas personalizadas em etapas específicas.

Por exemplo, o gatilho [`created`](../api/#created) pode ser utilizado para executar código logo após a instância ser criada:

``` js
new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` aponta para a instância
    console.log('a é: ' + this.a)
  }
})
// => "a é: 1"
```

Existem outros gatilhos (em inglês, _hooks_) chamados em diferentes etapas do ciclo de vida da instância, como [`mounted`](../api/#mounted), [`updated`](../api/#updated) e [`destroyed`](../api/#destroyed). Qualquer gatilho de ciclo de vida é executado com seu contexto `this` apontando para a instância Vue que o invocou.

<p class="tip">
Não utilize [arrow functions](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Functions/Arrow_functions) em propriedades de opções ou _callback_, como em `created: () => console.log(this.a)` ou `vm.$watch('a', newValue => this.myMethod())`. Como as _arrow functions_ são vinculadas ao contexto pai, `this` não representará a instância Vue como você pode esperar, ou seja, `this.a` ou `this.myMethod` estarão indefinidos.
</p>

## Diagrama do Ciclo de Vida

Abaixo está um diagrama para o ciclo de vida da instância. Você não precisa entender completamente tudo o que está acontecendo neste momento, mas conforme você aprender e construir mais coisas, este diagrama será uma referência útil.

![Ciclo de Vida da Instância Vue](/images/lifecycle.png)
