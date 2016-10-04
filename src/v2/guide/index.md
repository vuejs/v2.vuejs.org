---
title: Introdução
type: guide
order: 2
---

## O que é Vue.js?

Vue (pronuncia-se /vjuː/, como **view**, em inglês) é um **framework progressivo** para a construção de interfaces de usuário. Ao contrário de outros frameworks monolíticos, Vue foi projetado desde sua concepção para ser adotável incrementalmente. A biblioteca principal é focada exclusivamente na camada visual (*view layer*), sendo muito fácil escolher e integrar com outras bibliotecas ou projetos existentes. Por outro lado, Vue também é perfeitamente capaz de dar poder a sofiticadas SPA (Single-Page Applications) quando usado em conjunto com [ferramentas modernas](single-file-components.html) e [bibliotecas adicionais](https://github.com/vuejs/awesome-vue#libraries--plugins).

Se você é um desenvolvedor *frontend* experiente e quer saber como Vue se compara a outras bibliotecas/frameworks, confira a [Comparação com Outros Frameworks](comparison.html).

## Primeiros Passos

<p class="tip">O guia oficinal assume nível intermediário de conhecimento em HTML, CSS, e JavaScript. Caso você seja totalmente novo em desenvolvimento frontend, talvez não seja uma boa idéia pular direto em um framework no seu primeiro passo - aprenda o báscio e depois retorne aqui! Conhecimento prévio de outros frameworks ajuda, mas não é obrigatório.</p>

A forma mais simples de testar Vue.js é usando o [exemplo de Olá Mundo no JSFiddle](https://jsfiddle.net/ErickPetru/rpko63o0/). Sinta-se à vontade para abrí-lo em outra aba e acompanhar junto enquanto seguimos por alguns exemplos básicos. Ou, você pode simplesmente criar um arquivo `.html` e incluir o Vue com:

``` html
<script src="https://unpkg.com/vue"></script>
```

A página de [Instalação](installation.html) oferece mais opções. **Não** recomendamos iniciantes começar com `vue-cli`, especialmente se você não é familiarizado com ferramentas de build do Node.js.

## Renderização Declarativa

No núcleo do Vue.js está um sistema que nos permite declarativamente renderizar dados no DOM (Document Object Model) usando uma sintaxe de *template* simples:

``` html
<div id="app">
  {{ message }}
</div>
```
``` js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Olá Vue!'
  }
})
```
{% raw %}
<div id="app" class="demo">
  {{ message }}
</div>
<script>
var app = new Vue({
  el: '#app',
  data: {
    message: 'Olá Vue!'
  }
})
</script>
{% endraw %}

Nós acabamos de criar nosso primeiro aplicativo Vue! Isso parece muito similar a simplesmente renderizar uma *template string*, mas Vue fez bastante trabalho por debaixo dos panos. Os dados e o DOM estão agora interligados e tudo se tornou **reativo**. Como podemos ter certeza? Apenas abra o console JavaScript de seu navegador e coloque um valor diferente em `app.message`. Você verá o exemplo renderizado acima se atualizando apropriadamente.

Adicionalmente, além de interpolação de texto, podemos interligar atributos de elementos:

``` html
<div id="app-2">
  <span v-bind:title="message">
    Pare o mouse sobre mim e veja a dica interligada dinamicamente!
  </span>
</div>
```
``` js
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Você carregou esta página em ' + new Date()
  }
})
```
{% raw %}
<div id="app-2" class="demo">
  <span v-bind:title="message">
    Pare o mouse sobre mim e veja a dica interligada dinamicamente!
  </span>
</div>
<script>
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Você carregou esta página em ' + new Date()
  }
})
</script>
{% endraw %}

Aqui estamos nos deparando com algo novo. O atributo `v-bind` que você está vendo é chamado de **diretiva**. Diretivas são prefixadas com `v-` para indicar que são atributos especiais providos pelo Vue, e como você deve ter percebido, aplicam comportamento especial de reatividade ao DOM renderizado. Neste caso, basicamente está sendo dito: "mantenha o atributo `title` do elemento sempre atualizado em relação à propriedade `message` da instância Vue".

Se você abrir seu console JavaScript novamente e informar `app2.message = 'alguma nova mensagem'`, novamente poderá ver que o HTML vinculado - neste caso, o atributo `title` - foi atualizado imediatamente.

## Condicionais e Laços

Também é muito simples alternar a presença de um elemento:

``` html
<div id="app-3">
  <p v-if="seen">Agora você me viu</p>
</div>
```
``` js
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
```

{% raw %}
<div id="app-3" class="demo">
  <span v-if="seen">Agora você me viu</span>
</div>
<script>
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
</script>
{% endraw %}

Vá em frente e informe `app3.seen = false` no console. Você verá a mensagem desaparecer.

Este exemplo demonstra que nós podemos interligar dados não apenas ao texto e aos atributos, mas também à **estrutura** do DOM. Mais do que isso, Vue também provê um poderoso sistema de transições que pode automaticamente aplicar [efeitos de transição](transitions.html) quando elementos são inseridos/atualizados/removidos pelo Vue.

Existem mais algumas diretivas, cada uma com sua própria funcionalidade. Por exemplo, a diretiva `v-for` pode ser usada para exibir uma lista de itens usando dados de um Array:

``` html
<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```
``` js
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Aprender JavaScript' },
      { text: 'Aprender Vue' },
      { text: 'Criar algo incrível' }
    ]
  }
})
```
{% raw %}
<div id="app-4" class="demo">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
<script>
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Aprender JavaScript' },
      { text: 'Aprender Vue' },
      { text: 'Criar algo incrível' }
    ]
  }
})
</script>
{% endraw %}

No console, informe `app4.todos.push({ text: 'Novo item' })`. Você verá um novo item ser acrescentado dinamicamente à lista.

## Tratando Interação do Usuário

Para permitir aos usuários interagir com o aplicativo, podemos usar a diretiva `v-on` para anexar escutas a eventos (*event listeners*) que invocam métodos em nossas instâncias Vue:

``` html
<div id="app-5">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Inverter Mensagem</button>
</div>
```
``` js
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Olá Vue!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
```
{% raw %}
<div id="app-5" class="demo">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Inverter Mensagem</button>
</div>
<script>
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Olá Vue!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Note que no método nós simplesmente atualizamos o estado de nossa aplicação sem tocar no DOM - todas as manipulações do documento são tratadas pelo Vue, o código que você escreve é focado na lógica fundamental.

Vue também provê a diretiva `v-model`, que torna a interligação de mão dupla (*two-way binding*) entre a caixa de texto e o estado da aplicação uma moleza:

``` html
<div id="app-6">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
```
``` js
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Olá Vue!'
  }
})
```
{% raw %}
<div id="app-6" class="demo">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
<script>
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Olá Vue!'
  }
})
</script>
{% endraw %}

## Composição com Componentes

O sistema de componentes também é outro importante conceito no Vue, por ser uma abstração que proporciona a construção de aplicações de larga escala compostas por pequenos componentes, auto-contidos e frequentemente reutilizáveis. Se nós pensarmos sobre isso, quase qualquer tipo de interface de uma aplicação pode ser abstraída em uma árvore de componentes:

![Árvore de Componentes](/images/components.png)

No Vue, um componente é essencialmente uma instância Vue com opções predefinidas. Registrar um componente no Vue é simples:

``` js
// Define um novo componente chamado todo-item
Vue.component('todo-item', {
  template: '<li>Isso é um item</li>'
})
```

Agora você pode compor com isto no *template* de outro componente:

``` html
<ul>
  <!--
  Cria uma instância de um componente todo-item
  para cada item "todo" de um Array de "todos"
  -->
  <todo-item v-for="todo in todos"></todo-item>
</ul>
```

Mas certamente isto renderizaria o mesmo texto em cada item, o que não é lá muito interessante. Nós devemos passar dados do escopo superior (*parent*) para os componentes filhos. Vamos modificar a definição do componente para fazê-lo aceitar uma [prop](/guide/components.html#Props):

``` js
Vue.component('todo-item', {
  // O componente todo-item agora aceita uma
  // "prop", que é como um atributo customizado.
  // Esta propriedade foi chamada de "todo".
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

Agora podemos passar o dado `todo` em cada repetição de componente usando `v-bind`:

``` html
<div id="app-7">
  <ol>
    <!-- Agora provemos a cada todo-item o objeto todo que ele    -->
    <!-- representa, de forma que seu conteúdo se tornou dinâmico -->
    <todo-item v-for="item in groceryList" v-bind:todo="item"></todo-item>
  </ol>
</div>
```
``` js
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})

var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { text: 'Vegetais' },
      { text: 'Queijo' },
      { text: 'Qualquer outra coisa que o ser humano consegue comer' }
    ]
  }
})
```
{% raw %}
<div id="app-7" class="demo">
  <ol>
    <todo-item v-for="item in groceryList" v-bind:todo="item"></todo-item>
  </ol>
</div>
<script>
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { text: 'Vegetais' },
      { text: 'Queijo' },
      { text: 'Qualquer outra coisa que o ser humano consegue comer' }
    ]
  }
})
</script>
{% endraw %}

Este é apenas um exemplo fictício, mas nós conseguimos separar nossa aplicação em duas pequenas unidades, sendo que o componente filho está razoavelmente bem desacoplado do componente pai graças à funcionalidade de propriedades. É possível melhor ainda mais nosso componente `<todo-item>` com *template* e lógica mais complexos sem afetar a aplicação pai.

Em uma aplicação grande, é essencial dividir todo o aplicativo em componentes para tornar o desenvolvimento gerenciável. Falaremos mais sobre componentes [futuramente neste guia](/guide/components.html), mas aqui está um exemplo (imaginário) da aparência que o *template* de um aplicativo poderia ter com o uso de componentes:

``` html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### Relação com Elementos Customizados

Você pode ter notado como componentes Vue são similares aos **Elementos Customizados**, os quais fazem parte da [Especificação de Web Components](http://www.w3.org/wiki/WebComponents/). Isto ocorre pois a sintaxe de componentes Vue foi vagamente modelada a partir da especificação. Por exemplo, eles implementam a [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) e o atributo especial `is`. Entretanto, existem diferenças marcantes:

1. A Especificação de Web Components ainda é um rascunho (*draft status*), não estando nativamente implementada em todos os navegadores. Em comparação, componentes Vue não requerem qualquer tipo de *polyfill* e funcionam consistentemente em todos os navegadores suportados (IE9 e superiores). Quando necessário, componentes Vue também podem ser envolvidos dentro de um elemento customizado nativo.

2. Componentes Vue oferecem importantes recursos não disponíveis em elementos customizados tradicionais, mais notavelmente: fluxo de dados entre componentes, comunicação com eventos customizados e integração com ferramentas para *build*.

## Pronto para Mais?

Nós apenas introduzimos brevemente os recursos mais básicos do núcleo do Vue.js - o resto deste guia se aprofundará neles e em outros recursos avançados em um nível muito maior de detalhes, portanto certifique-se de ler tudo!
