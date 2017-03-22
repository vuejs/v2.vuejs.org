---
title: Template Syntax
type: guide
order: 4
---

O Vue.js utiliza uma sintaxe de templates baseada em HTML que permite que você vincule declarativamente o DOM renderizado aos dados da instância Vue. Todos os templates do Vue.js são compostos por HTML válido que pode ser compilado por navegadores compatíveis com as especificações e também por compiladores HTML.

Internamente, o Vue compila os templates dentro de funções de renderização do DOM. Combinado com o sistema de reatividade, o Vue é capaz de identificar a menor quantidade possível de componentes para serem re-renderizados e aplica o mínimo possível de manipulações do DOM ao perceber uma mudança no estado da aplicação.

<<<<<<< HEAD:src/guide/syntax.md
Se você é familiarizado com os conceitos do Virtual DOM mas prefere o poder "puro" do JavaScript, você também pode [escrever funções de renderização diretamente](/guide/render-function.html) ao invés de utilizar templates, além de contar com suporte opcional para JSX.
=======
If you are familiar with Virtual DOM concepts and prefer the raw power of JavaScript, you can also [directly write render functions](render-function.html) instead of templates, with optional JSX support.
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/syntax.md

## Interpolações

### Texto

A forma mais básica de data binding é interpolar texto utilizando a sintaxe "Mustache" (com chaves duplas):

``` html
<span>Mensagem: {{ msg }}</span>
```

A tag mustache vai ser trocada pelo valor da propriedade `msg` do objeto de dados correspondente. Esse texto também será sempre atualizado quando a propriedade `msg` for modificada.

<<<<<<< HEAD:src/guide/syntax.md
Você também pode realizar interpolações únicas (não são atualizadas quando o objeto é modificado) utilizando a [diretiva v-once](/api/#v-once), mas não se esqueça que esse comportamento vai afetar qualquer binding realizado no mesmo nó::
=======
You can also perform one-time interpolations that do not update on data change by using the [v-once directive](../api/#v-once), but keep in mind this will also affect any binding on the same node:
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/syntax.md

``` html
<span v-once>Esse valor nunca será modificado: {{ msg }}</span>
```

### Código HTML

As chaves duplas interpretam os dados como texto simples, e não html. Para que você exiba HTML, você precisa utilizar a diretiva `v-html`:

``` html
<div v-html="rawHtml"></div>
```

Os conteúdos são inseridos como HTML simples - todos data bindings são ignorados. Note que você não pode utilizar a diretiva `v-html` para compor templates parciais, porque o Vue não possui uma engine baseada em templates no formato de string. Ao invés disso, os componentes são a maneira sugerida para a composição e reutilização de componentes de UI.

<<<<<<< HEAD:src/guide/syntax.md
<p class="tip">Renderizar html dinâmico sem preocauções pode ser muito perigoso porque pode levar à [ataques XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). Utilize a interpolação de HTML apenas em conteúdos que você confia e **nunca** em conteúdos enviados por seus usuários.</p>
=======
<p class="tip">Dynamically rendering arbitrary HTML on your website can be very dangerous because it can easily lead to [XSS vulnerabilities](https://en.wikipedia.org/wiki/Cross-site_scripting). Only use HTML interpolation on trusted content and **never** on user-provided content.</p>
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/syntax.md

### Atributos

<<<<<<< HEAD:src/guide/syntax.md
Chaves duplas (mustaches) não podem ser utilizadas dentro de atributos HTML. Para isso, utilize a [diretiva v-bind](/api/#v-bind):
=======
Mustaches cannot be used inside HTML attributes, instead use a [v-bind directive](../api/#v-bind):
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/syntax.md

``` html
<div v-bind:id="dynamicId"></div>
```

Isso também funciona com atributos booleanos - o atributo será removido se a condição gerar um valor falso::

``` html
<button v-bind:disabled="someDynamicCondition">Botão</button>
```

### Utilizando Expressões JavaScript

Até aqui nós apenas vinculamos propriedades simples em nossos templates. Mas o Vue.js suporta todo o poder das expressões JavaScript dentro de todos data bindings:

``` html
{{ number + 1 }}

{{ ok ? 'SIM' : 'NÃO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

Essas expressões serão compiladas como JavaScript no escopo data da instância do Vue. A única restrição é que cada binding pode conter **apenas uma expressão**, então o código a seguir **NÃO** funcionará:

``` html
<!-- isso é uma atribuição, e não uma expressão: -->
{{ var a = 1 }}

<!-- controle de flow também não funciona, utilize expressões ternárias -->
{{ if (ok) { return message } }}
```

<p class="tip">As expressões de template são calculadas em um ambiente controlado e somente possuem acesso a uma lista de variáveis globais permitidas, como `Math` e `Date`. Você não deve tentar acessar as variáveis globais definidas pelo usuário em uma expressão de template.</p>

<<<<<<< HEAD:src/guide/syntax.md
### Filtros

O Vue.js permite que você defina filtros que possam ser utilizados para aplicar formatações de textos comuns. Os filtros devem ser anexados no fim de uma **interpolação mustache**, denotados pelo símbolo "pipe":

``` html
{{ message | capitalize }}
```

<p class="tip">Os filtros do Vue 2.x só podem ser utilizados dentro de mustache bindings. Para conseguir o mesmo comportamento dentro de bindings de diretivas, você deve utilizar [Computed properties](/guide/computed.html)</p>

A função do filtro sempre recebe o valor da expressão como o primeiro argumento.

``` js
new Vue({
  // ...
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
})
```

Filtros podem ser encadeados:

``` html
{{ message | filterA | filterB }}
```

Filtros são funções JavaScript, então eles podem aceitar parâmetros:

``` html
{{ message | filterA('arg1', arg2) }}
```

Aqui, a string simples `'arg1'` será passada para o filtro como o segundo parâmetro, e o valor da expressão `arg2` será calculado e passado como terceiro parâmetro.

## Diretivas
=======
## Directives
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/syntax.md

Diretivas são atributos especiais com o prefixo `v-`. Espera-se que os valores atribuídos às diretivas sejam **uma simples expressão JavaScript** (com a excessão para o `v-for`, que será discutido posteriormente). O trabalho de uma diretiva é aplicar efeitos colaterais ao DOM reativamente, ou seja, quando o valor de sua expressão é modificado. Vamos revisar o simples exemplo que vimos na introdução:

``` html
<p v-if="seen">Agora você me vê</p>
```

Aqui, a diretiva `v-if` irá remover/inserir o elemento `<p>` baseado na veracidade do valor da expressão `seen`.

### Parâmetros

Algumas diretivas podem aceitar um "parâmetro", denotado pelo símbolo de dois pontos após seu nome. Por exemplo, a diretiva `v-bind` é utilizada para atualizar um atributo HTML reativamente:

``` html
<a v-bind:href="url"></a>
```

Aqui `href` é o parâmetro, que dirá para a diretiva `v-bind` para vincular o atributo `href` do elemento ao valor da expressão `url`.

Outro simples exemplo é a diretiva `v-on`, que observa eventos do DOM:

``` html
<a v-on:click="doSomething">
```

Aqui o valor é o nome do evento que ela está ouvindo/observando. Nós iremos falar sobre o gerenciamento de eventos com mais detalhes em breve.

### Modificadores

Modificadores são sufixos especiais denotados por um ponto, que indicam que aquela diretiva deve ser vinculada de uma maneira especial. Por exemplo, o modificador `.prevent` indica para a diretiva `v-on` chamar a função `event.preventDefault()` quando esse evento for disparado:

``` html
<form v-on:submit.prevent="onSubmit"></form>
```

Nós veremos mais casos de uso de modificadores quando discutirmos mais sobre `v-on` e `v-model`.

<<<<<<< HEAD:src/guide/syntax.md
## Abreviações
=======
## Filters

Vue.js allows you to define filters that can be used to apply common text formatting. Filters are usable in two places: **mustache interpolations and `v-bind` expressions**. Filters should be appended to the end of the JavaScript expression, denoted by the "pipe" symbol:

``` html
<!-- in mustaches -->
{{ message | capitalize }}

<!-- in v-bind -->
<div v-bind:id="rawId | formatId"></div>
```

<p class="tip">Vue 2.x filters can only be used inside mustache interpolations and `v-bind` expressions (the latter supported since 2.1.0), because filters are primarily designed for text transformation purposes. For more complex data transforms in other directives, you should use [Computed properties](computed.html) instead.</p>

The filter function always receives the expression's value as the first argument.

``` js
new Vue({
  // ...
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
})
```

Filters can be chained:

``` html
{{ message | filterA | filterB }}
```

Filters are JavaScript functions, therefore they can take arguments:

``` html
{{ message | filterA('arg1', arg2) }}
```

Here, the plain string `'arg1'` will be passed into the filter as the second argument, and the value of expression `arg2` will be evaluated and passed in as the third argument.

## Shorthands
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/syntax.md

O prefixo `v-` serve como uma dica visual para identificar atributos específicos do Vue em seus templates. Isso é útil quando você está utilizando o Vue.js para aplicar comportamento dinâmico em um código existente, mas você pode achar esse comportamento um pouco verboso quando você o utiliza frequentemente. Em casos como no desenvolvimento de uma [SPA](https://en.wikipedia.org/wiki/Single-page_application), o uso desse prefixo fica menos importante, já que o Vue gerencia todos os templates. Assim, o Vue nos permite utilizar abreviações especiais para as duas diretivas mais utilizadas, que são o `v-bind` e o `v-on`:

### Abreviação para o `v-bind`

``` html
<!-- sintaxe completa -->
<a v-bind:href="url"></a>

<!-- abreviação -->
<a :href="url"></a>
```


### Abreviação para o `v-on`

``` html
<!-- sintaxe completa -->
<a v-on:click="doSomething"></a>

<!-- abreviação -->
<a @click="doSomething"></a>
```

Essas abreviações podem parecer um pouco diferentes do formato normal do HTML, mas os caracteres `:` e `@` são válidos para nomes de atributos em todos os navegadores que o Vue.js funciona. Além disso, eles não aparecem no código renderizado. Essa sintaxe é totalmente opcional, mas você provavelmente vai apreciar seu uso quando utilizar mais frequentemente.
