---
title: Sintaxe de Templates
type: guide
order: 4
---

O Vue.js utiliza uma sintaxe de _templates_ baseada em HTML, permitindo que você vincule declarativamente o DOM renderizado aos dados da instância Vue. Todos os _templates_ do Vue.js são compostos por HTML válido que pode ser compilado por navegadores compatíveis com as especificações e também por compiladores HTML.

Internamente, o Vue compila os _templates_ dentro de funções de renderização do DOM. Combinado com o sistema de reatividade, o Vue é capaz de identificar a menor quantidade possível de componentes para serem "re-renderizados" e aplica o mínimo possível de manipulações do DOM ao perceber uma mudança no estado da aplicação.

Se você é familiarizado com os conceitos de Virtual DOM e prefere o poder do JavaScript puro, também é possível [escrever diretamente funções de renderização](/guide/render-function.html) ao invés de utilizar _templates_, inclusive podendo contar com o suporte opcional para JSX nestas funções.

## Interpolações

### Texto

O mais básico _data binding_, interpolando texto com a sintaxe "Mustache" (chaves duplas):

``` html
<span>Mensagem: {{ msg }}</span>
```

A _tag mustache_ vai ser trocada pelo valor da propriedade `msg` do objeto de dados correspondente. Esse texto também reagirá sempre que a propriedade `msg` for modificada.

Você também pode realizar interpolações únicas (não são atualizadas se o objeto é modificado no futuro) através da [diretiva v-once](/api/#v-once), mas lembre-se que esse comportamento afetará qualquer _binding_ realizado no mesmo nó:

``` html
<span v-once>Esse valor nunca será modificado: {{ msg }}</span>
```

### HTML

As chaves duplas interpretam os dados como texto simples, e não HTML. Para que você exiba HTML, utilize a diretiva `v-html`:

``` html
<div v-html="rawHtml"></div>
```

Os conteúdos deste `div` serão substituídos com o valor da propriedade `rawHtml`, interpretada como HTML puro - _data bindings_ são ignorados. Note que você não pode utilizar a diretiva `v-html` para compor _templates_ parciais, porque o Vue não é uma _engine_ baseada em _templates_ através de String. Ao invés disso, componentes são a maneira indicada para a composição e reutilização de elementos de UI.

<p class="tip">Dinamicamente renderizar HTML sem preocauções pode ser muito perigoso, pois pode levar a [ataques XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). Utilize a interpolação de HTML apenas em conteúdos que você confia e **nunca** em conteúdos enviados por seus usuários.</p>

### Atributos

Chaves duplas não podem ser usadas em atributos HTML. Para isso, utilize a [diretiva v-bind](/api/#v-bind):

``` html
<div v-bind:id="dynamicId"></div>
```

Isso também funciona com atributos Boolean - neste caso, o atributo só é renderizado se a condição gerar um valor verdadeiro:

``` html
<button v-bind:disabled="someDynamicCondition">Botão</button>
```

### Expressões JavaScript

Até aqui nós apenas estivemos vinculando propriedades simples diretamente em nossos _templates_. Mas o Vue.js suporta todo o poder das expressões JavaScript dentro de qualquer tipo de _data binding_:

``` html
{{ number + 1 }}

{{ ok ? 'SIM' : 'NÃO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

Essas expressões serão compiladas como JavaScript no escopo de dados da instância do Vue. A única restrição é que cada _binding_ pode conter **apenas uma expressão**, então os códigos a seguir são exemplos de coisas que **NÃO** funcionarão:

``` html
<!-- isso é uma atribuição, e não uma expressão -->
{{ var a = 1 }}

<!-- controle de fluxo também não funciona, utilize expressões ternárias -->
{{ if (ok) { return message } }}
```

<p class="tip">Expressões em _templates_ são restritas a um ambiente controlado e somente possuem acesso a uma lista de variáveis globais permitidas, como `Math` e `Date`. Você não deve tentar acessar variáveis globais definidas pelo usuário em uma expressão de _template_.</p>

## Diretivas

Diretivas são atributos especiais com o prefixo `v-`. Espera-se que os valores atribuídos às diretivas sejam **uma simples expressão Javascript** (com a excessão do `v-for`, que será discutido posteriormente). O trabalho de uma diretiva é aplicar reativamente efeitos colaterais ao DOM, ou seja, realizar algum efeito quando o valor da expressão é modificado. Vamos revisar o simples exemplo que vimos na introdução:

``` html
<p v-if="seen">Agora você me viu</p>
```

Aqui, a diretiva `v-if` irá remover/inserir o elemento `<p>` baseado na veracidade do valor da expressão `seen`.

### Parâmetros

Algumas diretivas podem aceitar um "parâmetro", denotado pelo símbolo de dois pontos após a diretiva. Por exemplo, a diretiva `v-bind` é utilizada para atualizar um atributo HTML reativamente:

``` html
<a v-bind:href="url"></a>
```

Aqui `href` é o parâmetro, que informará à diretiva `v-bind` para interligar o atributo `href` do elemento ao valor da expressão `url` de forma reativa.

Outro simples exemplo é a diretiva `v-on`, que observa eventos do DOM:

``` html
<a v-on:click="doSomething">
```

Aqui o valor é o nome do evento DOM que ela está escutando. Falaremos sobre gerenciamento de eventos com mais detalhes em breve.

### Modificadores

Modificadores são sufixos especiais denotados por um ponto, que indicam que aquela diretiva deve ser vinculada de alguma maneira especial. Por exemplo, o modificador `.prevent` indica que o `v-on` chamará a função `event.preventDefault()` quando o evento for disparado:

``` html
<form v-on:submit.prevent="onSubmit"></form>
```

Veremos mais casos de uso de modificadores quando explorarmos mais `v-on` e `v-model`.

### Filtros

O Vue.js permite que se defina filtros utilizáveis para aplicar formatações em textos. Filtros são permitidos em dois lugares: **interpolações de chaves duplas ou expressões `v-bind`**. Filtros devem ser acrescidos ao final de uma expressão JavaScript, denotados pelo símbolo _"pipe"_:

``` html
<!-- em chaves duplas -->
{{ message | capitalize }}

<!-- em v-bind -->
<div v-bind:id="rawId | formatId"></div>
```

<p class="tip">Filtros no Vue 2.x podem ser utilizados somente em interpolações _mustache_ e expressões `v-bind` (estas suportadas desde 2.1.0), pois foram projetados com o propósito de formatações textuais comuns. Cenários mais complexos de transformações em outras diretivas dependem de [dados Computados](/guide/computed.html), e não filtros.</p>

A função de filtro sempre recebe o valor da expressão como o primeiro parâmetro.

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

Filtros são funções Javascript, então eles podem aceitar parâmetros:

``` html
{{ message | filterA('arg1', arg2) }}
```

Aqui, a String literal `'arg1'` será passada para o filtro como o segundo parâmetro, e o valor da expressão `arg2` será calculado e passado como terceiro parâmetro.

## Abreviações

O prefixo `v-` serve como dica visual para identificar atributos específicos do Vue nos _templates_. Isso é útil quando se está utilizando o Vue para aplicar comportamento dinâmico em HTML existente, mas você pode achar um pouco verboso se precisar usar frequentemente. Em casos como no desenvolvimento de uma [SPA](https://en.wikipedia.org/wiki/Single-page_application), o uso desse prefixo é menos importante, já que o Vue efetivamente gerencia todos os _templates_. Assim, podemos utilizar abreviações especiais para as duas diretivas mais utilizadas, que são o `v-bind` e o `v-on`:

### Abreviação para `v-bind`

``` html
<!-- sintaxe completa -->
<a v-bind:href="url"></a>

<!-- abreviação -->
<a :href="url"></a>
```

### Abreviação para `v-on`

``` html
<!-- sintaxe completa -->
<a v-on:click="doSomething"></a>

<!-- abreviação -->
<a @click="doSomething"></a>
```

Essas abreviações podem parecer um pouco diferentes do HTML normalmente utilizado, mas os caracteres `:` e `@` são válidos para nomes de atributos em todos os navegadores que o Vue.js suporta. Além disso, não aparecerão no código renderizado. Essa sintaxe é totalmente opcional, mas você provavelmente vai apreciar quando utilizar diretivas frequentemente.
