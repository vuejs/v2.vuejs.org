---
title: Reatividade em Profundidade
type: guide
order: 12
---

Cobrimos a maioria das noções básicas - agora é hora de dar um mergulho profundo! Uma das características mais distintas do Vue é o sistema de reatividade não obstrutivo. Modelos são simplesmente objetos JavaScript. Quando você os modifica, a visualização é atualizada. Isso torna o gerenciamento de estado muito simples e intuitivo, mas também é importante entender como isso funciona para evitar algumas armadilhas comuns. Nesta seção, vamos cavar alguns dos detalhes de baixo nível do sistema de reatividade do Vue.

## Como as Alterações são Monitoradas

Quando você passa um objeto JavaScript simples para uma instância do Vue, como a opção `data`, o Vue irá percorrer todas as suas propriedades e convertê-las para getter/setters usando [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). Esta é uma característica un-shimmable encontrada somente a partir do ES5, razão pela qual o Vue não suporta o IE8 e versões anteriores.

Os getter/setters são invisíveis para o usuário, mas debaixo do capô, eles permitem ao Vue executar o rastreamento de dependência e notificações de alteração quando propriedades são acessadas ou modificadas. Uma ressalva é que consoles de browsers formatam getter/setters diferentemente quando alteram objetos de dados, então você pode querer instalar o [vue-devtools](https://github.com/vuejs/vue-devtools)  para ter uma interface de inspeção mais amigável.

Cada instância de componente tem um observador de instância, **watcher**, correspondente, que registra todas as propriedades "tocadas" durante a renderização do componente e depedências. Mais tarde, quando o setter de uma dependência é acionado, ele notifica o watcher que então faz com que o componente seja re-renderizado.

![Reactivity Cycle](/images/data.png)

## Resalva sobre a detecção de alterações

Devido às limitações do JavaScript moderno (e ao abandono do `Object.observe`), o Vue **não pode detectar adicão ou exclusão**. O Vue executa o processo de conversão de getter/setter na inicialização da instância; uma propriedade deve estar presente no objeto `data` nesse momento para que o Vue faça sua conversão e o torne reativo. Por exemplo:

``` js
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` is now reactive

vm.b = 2
// `vm.b` is NOT reactive
```

O Vue não permite adicionar dinamicamente novas propriedades reativas para uma instância já criada. No entanto, é possível adicionar propriedades reativas a um objeto utilizando o método `Vue.set(object, key, value)`:

``` js
Vue.set(vm.someObject, 'b', 2)
```

Você pode também usar o método de instância `vm.$set` que é simplesmente um atalho para o método global `Vue.set`:

``` js
this.$set(this.someObject, 'b', 2)
```

Às vezes você pode querer atribuir uma série de propriedades a um objeto existente, por exemplo, usando `Object.assign()` ou `_.extend()`. No entanto, novas propriedades adicionadas ao objeto não acionaram mudanças. Em tais casos, crie um novo objeto com as propriedades do objeto original e junte a um objeto vazio:

``` js
// ao invés de `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```


Existem também algumas ressalvas relacionadas com arrays, que foram discutidas anteriormente na [seção sobre renderização de listas](list.html#Caveats).

## Declarando Propriedades Reativas


Como o Vue não permite adicionar dinamicamente Propriedades reativas de nível root, você precisa inicializar instâncias Vue declarando todas as propriedades de nível root com dados iniciais, apenas um valor vazio:

``` js
var vm = new Vue({
  data: {
    // declare message with an empty value
    message: ''
  },
  template: '<div>{{ message }}</div>'
})
// set `message` later
vm.message = 'Hello!'
```

Se a propriedade `message` não for declarada em `data`, o Vue irá avisar que a função de renderização está tentando acessar uma propriedade que não existe.

Há razões técnicas por trás dessa restrição - elimina uma classe em _edge cases_ ou casos de borda (Quando ocorrem em um parâmetro de operação extrema) no sistema de rastreamento de dependências, e também faz com que as instâncias do Vue funcionem melhor com os sistemas de verificação de tipos. Mas há também uma consideração importante em termos de capacidade de manutenção do código: O objeto `data` é como o esquema para o estado do seu componente. Declarar todas as propriedades reativas antecipadamente faz o código do componente mais fácil de entender quando revisitado posteriormente ou lido por outro desenvolvedor.

## Fila de atualização assíncrona

Caso você não tenha notado ainda, o Vue executa atualizações de DOM **assincronamente**. Sempre que uma alteração de dados é observada, serão abertos uma fila e o buffer de todas as alterações de dados que acontecem no mesmo event loop. Se o mesmo observador é acionado várias vezes, ele será empurrado na fila de uma só vez. Esta ação é importante para evitar cálculos e manipulações do DOM desnecessários. Então, no próximo ciclo de eventos "tick", o Vue libera a fila e executa o trabalho atual. Internamente, Vue tenta utilizar os nativos `Promise.then` e `MutationObserver` para o enfileiramento de mensagens assíncronas e volta para `setTimeout (fn, 0)`.


Por exemplo, quando você define `vm.someData = 'new value'`, o componente não será renderizado imediatamente. Ele será atualizado no próximo "tick", quando a file for liberada. Na maioria das vezes não precisamos nos preocupar com isso, mas a situação pode se complicar quando você quer fazer algo que depende do estado do DOM pós-atualização. Embora o Vue.js geralmente encoraje os desenvolvedores a pensar de uma forma de "data-driven" e evitar tocar o DOM diretamente, às vezes pode ser necessário sujar as mãos. Para aguardar até que o Vue.js tenha terminado de atualizar o DOM após uma alteração de dados, você pode usar o `Vue.nextTick(callback)` imediatamente após a alteração dos dados. A função callback será chamada após o DOM ser atualizado. Por exemplo:

``` html
<div id="example">{{ message }}</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // change data
vm.$el.textContent === 'new message' // false
Vue.nextTick(function () {
  vm.$el.textContent === 'new message' // true
})
```

Há também o método de instância de `vm.$nextTick()`, que é especialmente útil no interior de componentes, porque não precisa da variável global `Vue` e o contexto do `this` do seu callback será automaticamente ligado à instância atual do Vue:

``` js
Vue.component('example', {
  template: '<span>{{ message }}</span>',
  data: function () {
    return {
      message: 'not updated'
    }
  },
  methods: {
    updateMessage: function () {
      this.message = 'updated'
      console.log(this.$el.textContent) // => 'not updated'
      this.$nextTick(function () {
        console.log(this.$el.textContent) // => 'updated'
      })
    }
  }
})
```
