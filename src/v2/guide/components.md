---
title: Componentes
type: guide
order: 11
---

## O que são componentes?

Os componentes são um dos recursos mais poderosos do Vue. Eles lhe ajudam a estender os elementos HTML para encapsular um código de forma reusável. Em um alto nível, componentes são elementos personalizados que o Vue compila e anexa a sua instância. Em alguns casos, eles podem aparecer como um HTML nativo que estende do atributo especial `is`

## Usando Componentes

### Registro

Nós aprendemos nas seções anteriores que podemos criar uma nova instância do Vue com:

``` js
new Vue({
  el: '#some-element',
  // opções
})
```

Para registrar um componente global, você pode usar `Vue.component(tagName, options)`. Por exemplo:


``` js
Vue.component('my-component', {
  // opções
})
```

<p class="tip">Observe que o Vue não segue as regras da [W3C](http://www.w3.org/TR/custom-elements/#custom-elements-core-concepts) para tags personalizadas (letras minúsculas, precisa ter um hífen) embora seguir essa convenção seja considerada uma boa prática</p>

Uma vez registrado, um componente pode ser usado em uma instância como um elemento personalizado `<my-component></my-component>`. Tenha certeza que o elemento é registrado **antes** de ser instanciado na raiz do Vue. Aqui está um exemplo completo:


``` html
<div id="example">
  <my-component></my-component>
</div>
```

``` js
// registro
Vue.component('my-component', {
  template: '<div>Um elemento personalizado!</div>'
})

// cria a instância raiz
new Vue({
  el: '#example'
})
```

No qual irá renderizar:

``` html
<div id="example">
  <div>Um elemento personalizado!</div>
</div>
```

{% raw %}
<div id="example" class="demo">
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<div>Um elemento personalizado!</div>'
})
new Vue({ el: '#example' })
</script>
{% endraw %}

### Registro Local

Você não tem que registrar todo componente globalmente. Você pode fazer um componente disponível somente no escopo de outra instância/componente, o registrando com a opção `components`:


``` js
var Child = {
  template: '<div>Um elemento personalizado!</div>'
}

new Vue({
  // ...
  components: {
    // <my-component> só estará disponível no template pai
    'my-component': Child
  }
})
```

O mesmo encapsulamento se aplica para outros recursos registráveis do Vue, como as diretivas.

### Cuidados no Uso de Template DOM

Quando usar o DOM como seu _template_ (isto é, usar a opção `el` para montar um elemento em um conteúdo existente), você estará sujeito a algumas restrições inerentes a como o HTML funciona, pois o Vue só pode recuperar o conteúdo do _template_ **depois** que o navegador o analisou e o normalizou. De maneira mais perceptível, alguns elementos como `<ul>`, `<ol>`, `<table>` e `<select>` têm restrições de quais elementos podem aparecer dentro deles, e alguns elementos como `<option>` podem aparecer somente dentro de certos outros elementos.

Isso levará a problemas quando usar componentes personalizados com elementos que possuem tais restrições, por exemplo:


``` html
<table>
  <my-row>...</my-row>
</table>
```

O componente personalizado `<my-row>` será içado para fora como um conteúdo inválido, causando erros na eventual renderização. Uma solução de contorno seria usar o atributo especial `is`:


``` html
<table>
  <tr is="my-row"></tr>
</table>
```

**Deve-se notar que essas limitações não se aplicam se você estiver usando string templates de uma das seguintes fontes**:

- `<script type="text/x-template">`
- _String templates_ JavaScript de mesma linha
- Componentes `.vue`

Portanto, prefira usar _string templates_ sempre que for possível.

### `data` Deve Ser uma Função

A maioria das opções que podem ser passadas para o construtor do Vue podem ser usadas em um componente, com um caso em especial: `data` deve ser uma função. Na verdade, se você tentar isso:

``` js
Vue.component('my-component', {
  template: '<span>{{ message }}</span>',
  data: {
    message: 'olá'
  }
})
```

Então o Vue irá parar e emitirá avisos no console, te informando que `data` deve ser uma função para instâncias de componente. É bom entender o por que as regras existem, então vamos trapacear.

``` html
<div id="example-2">
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
</div>
```

``` js
var data = { counter: 0 }

Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  // data é tecnicamente uma função, então o Vue não vai
  // reclamar, mas nós retornamos a mesma referência
  // do objeto para cada instância do componente
  data: function () {
    return data
  }
})

new Vue({
  el: '#example-2'
})
```

{% raw %}
<div id="example-2" class="demo">
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
  <simple-counter></simple-counter>
</div>
<script>
var data = { counter: 0 }
Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  data: function () {
    return data
  }
})
new Vue({
  el: '#example-2'
})
</script>
{% endraw %}

Uma vez que todas as três instâncias do componente compartilham o mesmo objeto `data`, incrementando um contador incrementa todos eles! Ai. Vamos corrigir isso, em vez disso, retornando um novo objeto de dados:

``` js
data: function () {
  return {
    counter: 0
  }
}
```

Agora cada um dos nossos contadores tem seu próprio estado interno:

{% raw %}
<div id="example-2-5" class="demo">
  <my-component></my-component>
  <my-component></my-component>
  <my-component></my-component>
</div>
<script>
Vue.component('my-component', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  }
})
new Vue({
  el: '#example-2-5'
})
</script>
{% endraw %}

### Compondo Componentes

Componentes são feitos para serem usados juntos, de maneira mais comum em relacionamentos pai-filho: o componente A deve usar o componente B no seu próprio _template_. Eles inevitavelmente precisam se comunicar entre si: o pai pode precisar passar dados para baixo, para seu próprio filho, e o filho pode precisar informar seu pai de alguma coisa que aconteceu nele. Entretanto, também é muito importante manter o pai e o filho o mais desacoplados possível por meio de uma interface clara e definida. Isso garante que o código de cada componente possa ser escrito e entendido de forma relativamente isolada, os tornando mais fáceis de manter e potencialmente mais fáceis de reusar.

No Vue.js, o relacionamento pai-filho do componente pode ser resumido como **propriedades para baixo, eventos para cima**. O pai passa os dados para baixo para o filho por meio de **propriedades**, e o o filho envia mensagens para o pai por meio de **eventos**. Vamos ver como eles funcionam a seguir.

<p style="text-align: center">
  <img style="width:300px" src="/images/props-events.png" alt="propriedades para baixo, eventos para cima">
</p>

## Propriedades

### Passando Dados com Propriedades

Toda instância de componente tem seu próprio **escopo isolado**. Isso significa que você não pode (e não deveria) referenciar diretamente dados do pai no _template_ de um componente filho. Dados podem ser passados para baixo para componentes filho usando **propriedades**.

Uma propriedade é um atributo personalizado para passar informação do pai do componente. Um componente filho precisa declarar explicitamente as propriedades que ele espera receber usando a [opção `props`](../api/#props)

``` js
Vue.component('child', {
  // declara as propriedades
  props: ['message'],
  // assim como os dados, a propriedade pode ser usada dentro de templates
  // e também se torna disponível na vm como this.message
  template: '<span>{{ message }}</span>'
})
```

Então nós podemos passar uma _string_ simples para ela como:

``` html
<child message="olá!"></child>
```

Resultado:

{% raw %}
<div id="prop-example-1" class="demo">
  <child message="olá!"></child>
</div>
<script>
new Vue({
  el: '#prop-example-1',
  components: {
    child: {
      props: ['message'],
      template: '<span>{{ message }}</span>'
    }
  }
})
</script>
{% endraw %}

### camelCase vs. kebab-case

Atributos HTML são _case-insensitive_, então quando usar _templates_ que não são do tipo _strings templates_, nomes de propriedade _camelCased_ precisam usar sua equivalente em _kebab-case_ (delimitado por hífen):


``` js
Vue.component('child', {
  // camelCase em JavaScript
  props: ['myMessage'],
  template: '<span>{{ myMessage }}</span>'
})
```

``` html
<!-- kebab-case em HTML -->
<child my-message="olá!"></child>
```

De novo, se você estiver usando _string templates_, então essa limitação não se aplica.

### Propriedades Dinâmicas

Semelhante à ligação de um atributo normal a uma expressão, nós podemos também usar o `v-bind` para dinamicamente ligar propriedades a dados no pai. Sempre que os dados forem atualizados no pai, isso fluirá também para o filho:

``` html
<div>
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
```

Muitas vezes, é mais simples usar a sintaxe abreviada para o `v-bind`:

``` html
<child :my-message="parentMsg"></child>
```

Resultado:

{% raw %}
<div id="demo-2" class="demo">
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
<script>
new Vue({
  el: '#demo-2',
  data: {
    parentMsg: 'Mensagem do pai'
  },
  components: {
    child: {
      props: ['myMessage'],
      template: '<span>{{myMessage}}</span>'
    }
  }
})
</script>
{% endraw %}

### Literal vs. Dinâmico

Um erro comum que iniciantes tendem a fazer é tentar passar um número usando a sintaxe literal:

``` html
<!-- isto passa a string "1" -->
<comp some-prop="1"></comp>
```

No entanto, uma vez que isso é uma propriedade literal, seu valor é passado como uma string `"1"` ao invés de um número real. Se quisermos passar um número JavaScript real, nós precisamos usar o `v-bind` para que o seu valor seja avaliado como uma expressão JavaScript:

``` html
<!-- isto passa um número real -->
<comp v-bind:some-prop="1"></comp>
```

### Fluxo de Dados Unidirecional

Todas as propriedades formam uma ligação **unidirecional** entre a propriedade do filho e a do pai: quando a propriedade do pai é atualizada, isso irá fluir para o filho, mas não o caminho de volta. Isso previne os componentes filhos de acidentalmente alterarem o estado dos pais, o que pode dificultar o entendimento dos dados na sua aplicação.

Além disso, sempre que o componente pai é atualizado, todas as propriedades do componente filho serão atualizadas com o último valor. Isto significa que você **não** deveria tentar alterar uma propriedade dentro do componente filho. Se fizer isso, o Vue irá te avisar no console.

Geralmente há dois casos em que é tentador alterar uma propriedade:

1. A propriedade é usada só para passar um valor inicial, o componente filho simplesmente quer usá-la como uma propriedade de dado local posteriormente;

2. A propriedade é passada como um valor bruto que precisa ser transformado.

A resposta apropriada para esses casos de uso são:

1. Defina uma propriedade de dado local que usa o valor da propriedade inicial como o seu valor inicial:

  ``` js
  props: ['initialCounter'],
  data: function () {
    return { counter: this.initialCounter }
  }
  ```

2. Defina uma propriedade computada que é computada a partir do valor da propriedade inicial:

  ``` js
  props: ['size'],
  computed: {
    normalizedSize: function () {
      return this.size.trim().toLowerCase()
    }
  }
  ```

<p class="tip">Observe que objetos e _arrays_ em JavaScript são passados como referência, então, se uma propriedade é um _array_ ou um objeto, alterar o objeto ou o _array_ dentro do próprio filho **afetará** o estado do pai.</p>

### Validação de Propriedades

É possível para um componente especificar requisitos para as propriedades que ele está recebendo. Se um requisito não é atendido, o Vue emitirá avisos. Isto é especialmente útil quando você está criando um componente que tem a intenção de ser usado por outros.

Em vez de definir as propriedades como um _array_ de _strings_, você pode usar um objeto com requisitos de validação:

``` js
Vue.component('example', {
  props: {
    // verificação de tipo básico (`null` significa aceitar qualquer tipo)
    propA: Number,
    // vários tipos possíveis
    propB: [String, Number],
    // uma string é obrigatória
    propC: {
      type: String,
      required: true
    },
    // um número com valor padrão
    propD: {
      type: Number,
      default: 100
    },
    // objeto/array padrão deveria ser retornado de uma
    // função de fábrica
    propE: {
      type: Object,
      default: function () {
        return { message: 'hello' }
      }
    },
    // função de validação personalizada
    propF: {
      validator: function (value) {
        return value > 10
      }
    }
  }
})
```

O `type` pode ser um dos seguintes construtores nativos:

- String
- Number
- Boolean
- Function
- Object
- Array
- Symbol

Além disso, `type` também pode ser uma função de construtor personalizada e a asserção será feita com uma verificação `instanceof`.

Quando a validação de propriedade falha, Vue produz um aviso no _console_ (se estiver utilizando uma compilação de desenvolvimento). Observe que propriedades são validadas __antes__ da instância do componente ser criada, portanto em funções `default` ou `validator`, propriedades da instância como `data`, `computed` ou `methods` não estarão disponíveis.

## Atributo Não-Prop

Um atributo não-prop é um atributo passado a um componente, mas que não tem uma propriedade correspondente definida através de `props`.

Enquanto explicitamente definir `props` é a forma recomendada de passar informações a componentes filhos, autores de bibliotecas de componentes não podem sempre prever o contexto no qual seus componentes poderão ser utilizados. Por isso componentes podem aceitar atributos arbitrários, os quais são adicionados ao elemento raiz do componente.

Por exemplo, imagine que estamos usando um componente `bs-date-input` de terceiros, com um _plugin_ Bootstrap que exige um atributo `data-3d-date-picker` no `input`. Nós podemos adicionar este atributo à nossa instância do componente:

``` html
<bs-date-input data-3d-date-picker="true"></bs-date-input>
```

E o atributo `data-3d-date-picker="true"` será automaticamente adicionado ao elemento raiz do `bs-date-input`.

### Substituindo/Mesclando Atributos Existentes

Imagine que este é o template do `bs-date-input`:

``` html
<input type="date" class="form-control">
```

Para especificar um tema para nosso _plugin_ de seleção de datas, precisaríamos adicionar uma classe específica, como essa:

``` html
<bs-date-input
  data-3d-date-picker="true"
  class="date-picker-theme-dark"
></bs-date-input>
```

Neste caso, dois valores diferentes para `class` estão definidos:

- `form-control`, configurado pelo próprio componente em seu _template_
- `date-picker-theme-dark`, passado ao componente através de seu _parent_

Para mais atributos, o valor provido ao componente irá substituir o valor previamente definido no componente. Por exemplo, passar `type="large"` irá sobreescrever `type="date"` e provavelmente quebrar a funcionalidade! Por sorte, os atributos `class` e `style` são um pouco mais inteligentes e os valores podem ser mesclados, tornando o valor final: `form-control date-picker-theme-dark`.

## Eventos Personalizados

Nós aprendemos que o pai pode passar dados para o filho usando propriedades, mas como nós comunicamos de volta para o pai quando alguma coisa acontece? É aí que o sistema de eventos personalizados do Vue entra.

### Usando `v-on` com Eventos Personalizados

Toda instância Vue implementa uma [interface de eventos](../api/#Instance-Methods-Events), o que significa que ela pode:

- Ouvir um evento usando `$on(eventName)`
- Disparar um evento usando `$emit(eventName)`

<p class="tip">Observe que o sistema de eventos do Vue é separado da [EventTarget API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) do navegador. Embora eles funcionem de maneira semelhante, o `$on` e o `$emit` __não__ são apelidos para o `addEventListener` e o `dispatchEvent`.</p>

Além disso, um componente pai pode ouvir eventos emitidos do componente filho usando o `v-on` diretamente no _template_ onde o componente filho é usado.

<p class="tip">Você não pode usar o `$on` para ouvir eventos emitidos pelo filho. Você deve usar o `v-on` diretamente no _template_, como no exemplo abaixo.</p>

Aqui está um exemplo:

``` html
<div id="counter-event-example">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>
```

``` js
Vue.component('button-counter', {
  template: '<button v-on:click="increment">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    increment: function () {
      this.counter += 1
      this.$emit('increment')
    }
  },
})

new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})
```

{% raw %}
<div id="counter-event-example" class="demo">
  <p>{{ total }}</p>
  <button-counter v-on:increment="incrementTotal"></button-counter>
  <button-counter v-on:increment="incrementTotal"></button-counter>
</div>
<script>
Vue.component('button-counter', {
  template: '<button v-on:click="increment">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    increment: function () {
      this.counter += 1
      this.$emit('increment')
    }
  }
})
new Vue({
  el: '#counter-event-example',
  data: {
    total: 0
  },
  methods: {
    incrementTotal: function () {
      this.total += 1
    }
  }
})
</script>
{% endraw %}

Neste exemplo, é importante notar que o componente filho ainda é completamente desacoplado do que acontece fora dele. Tudo o que ele faz é reportar informações sobre sua própria atividade, no caso de um componente pai se importar.

#### Ligando Eventos Nativos a Componentes

Pode haver momentos em que você deseja ouvir um evento nativo no elemento raiz de um componente. Nesses casos, você pode usar o modificador `.native` para o `v-on`. Por exemplo:

``` html
<my-component v-on:click.native="doTheThing"></my-component>
```

### O Modificador `.sync`

> 2.3.0+

Em alguns casos nós podemos precisar de uma "ligação bidirecional" para uma propriedade - na verdade, no Vue 1.x isto é exatamente o que o modificador `.sync` fornecia. Quando um componente filho altera a propriedade que tem `.sync`, a mudança de valor refletirá no pai. Isto é conveniente, no entanto isso leva a problemas de manutenção a longo prazo porque quebra a suposição de fluxo de dados unidirecional: o código que altera propriedades do filho está implicitamente afetando o estado do pai.

Este é o motivo pelo qual removemos o modificador `.sync` quando a versão 2.0 foi lançada. No entanto, descobrimos que, de fato, existem casos em que isso pode ser útil, especialmente quando enviando componentes reutilizáveis. O que nós precisamos mudar é **fazer um código no filho que afeta o estado do pai de forma mais consistente e explícita.**

Na 2.3 nós re-introduzimos o modificador `.sync` para propriedades, mas desta vez ele é só um açúcar sintático que automaticamente se expande para uma escuta `v-on` adicional:

O seguinte

``` html
<comp :foo.sync="bar"></comp>
```

é expandido para:

``` html
<comp :foo="bar" @update:foo="val => bar = val"></comp>
```

Para o componente filho atualizar o valor de `foo`, ele precisa explicitamente emitir um evento em vez de alterar a propriedade:

``` js
this.$emit('update:foo', newValue)
```

### Componentes de Input em Formulário usando Eventos Personalizados

Eventos personalizados também podem ser usados para criar inputs personalizados que funcionam com `v-model`. Lembre-se:

``` html
<input v-model="something">
```

é só um açúcar sintático para:

``` html
<input
  v-bind:value="something"
  v-on:input="something = $event.target.value">
```

Quando usado com um componente, isto é simplificado para:

``` html
<custom-input
  :value="something"
  @input="value => { something = value }">
</custom-input>
```

Então, para um componente funcionar com o `v-model`, ele deveria (estes podem ser configurados em 2.2.0+):

- aceitar uma propriedade `value`
- emitir um evento `input` com um novo valor

Vamos vê-lo em ação com um input monetário muito simples:

``` html
<currency-input v-model="price"></currency-input>
```

``` js
Vue.component('currency-input', {
  template: '\
    <span>\
      $\
      <input\
        ref="input"\
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)">\
    </span>\
  ',
  props: ['value'],
  methods: {
    // Em vez de atualizar o valor diretamente, este
    // método é usado para formatar e colocar restrições
    // no valor do input
    updateValue: function (value) {
      var formattedValue = value
        // Remove espaços em branco de ambos os lados
        .trim()
        // Reduz para 2 casas decimais
        .slice(
          0,
          value.indexOf('.') === -1
            ? value.length
            : value.indexOf('.') + 3
        )
      // Se o valor não foi normalizado ainda,
      // o substitui manualmente para acertar
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      // Emite o valor do número através do evento de input
      this.$emit('input', Number(formattedValue))
    }
  }
})
```

{% raw %}
<div id="currency-input-example" class="demo">
  <currency-input v-model="price"></currency-input>
</div>
<script>
Vue.component('currency-input', {
  template: '\
    <span>\
      $\
      <input\
        ref="input"\
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)"\
      >\
    </span>\
  ',
  props: ['value'],
  methods: {
    updateValue: function (value) {
      var formattedValue = value
        .trim()
        .slice(
          0,
          value.indexOf('.') === -1
            ? value.length
            : value.indexOf('.') + 3
        )
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      this.$emit('input', Number(formattedValue))
    }
  }
})
new Vue({
  el: '#currency-input-example',
  data: { price: '' }
})
</script>
{% endraw %}

A implementação acima, no entanto, é bem ingênua. Por exemplo, é permitido aos usuários entrarem com múltiplos pontos e até letras algumas vezes - urgh! Então para aqueles que querem ver um exemplo não trivial, aqui está um filtro monetário mais robusto:

<iframe width="100%" height="300" src="https://jsfiddle.net/chrisvfritz/1oqjojjx/embedded/result,html,js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Personalizando o Componente `v-model`

> Novo na 2.2.0

Por padrão, o `v-model` em um componente usa `value` como a propriedade e `input` como o evento, mas alguns tipos de _input_ como os _checkboxes_ e os botões _radio_ podem querer usar a propriedade `value` para um propósito diferente. Usar a opção `model` pode evitar o conflito nesses casos:

``` js
Vue.component('my-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean,
    // isto permite usar a propriedade `value` para um propósito diferente
    value: String
  },
  // ...
})
```

``` html
<my-checkbox v-model="foo" value="algum valor"></my-checkbox>
```

O acima será equivalente a:

``` html
<my-checkbox
  :checked="foo"
  @change="val => { foo = val }"
  value="algum valor">
</my-checkbox>
```

<p class="tip">Observe que você ainda terá que declarar a propriedade `checked` explicitamente.</p>

### Comunicação Não Pai-Filho

Algumas vezes dois componentes podem precisar se comunicar sem serem pai/filho um do outro. Em cenários simples, você pode usar uma instância vazia do Vue como uma central de ônibus de eventos:

``` js
var bus = new Vue()
```
``` js
// no método do componente A
bus.$emit('id-selected', 1)
```
``` js
// no hook created do componente B
bus.$on('id-selected', function (id) {
  // ...
})
```

Em casos mais complexos, você deveria considerar empregar um [padrão de gerenciamento de estado](state-management.html) dedicado.

## Distribuição de Conteúdo com Slots

Ao usar componentes, muitas vezes é desejado compô-los assim:

``` html
<app>
  <app-header></app-header>
  <app-footer></app-footer>
</app>
```

Há duas coisas para observar aqui:

1. O componente `<app>` não sabe qual conteúdo ele irá receber. Isso é decidido pelo componente pai que estiver usando `<app>`.

2. O componente `<app>` provavelmente possui seu próprio _template_.

Para que a composição funcione, precisamos de um jeito de entreleçar o "conteúdo" do pai e o _template_ do próprio componente. Este é um processo chamado de **distribuição de conteúdo** (ou "transclusão" se você estiver familiarizado com Angular). Vue.js implementa uma API de distribuição de conteúdo que é modelada após o atual [rascunho de especificação de Web Components](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md), usando o elemento especial `<slot>` para servir como pontos de distribuição para o conteúdo original.

### Escopo de Compilação

Antes de nos aprofundarmos para dentro da API, vamos primeiro esclarecer em qual escopo os conteúdos são compilados. Imagine um _template_ assim:

``` html
<child-component>
  {{ message }}
</child-component>
```

A `message` deveria ser ligada aos dados do pai ou aos dados do filho? A resposta é do pai. Uma regra simples para o escopo do componente é:

> Tudo que estiver no _template_ do pai é compilado no escopo do pai; tudo que estiver no _template_ do filho é compilado no escopo do filho.

Um erro comum é tentar ligar uma diretiva a uma propriedade/método do filho no _template_ do pai:

``` html
<!-- NÃO funciona -->
<child-component v-show="someChildProperty"></child-component>
```

Assumindo que `someChildProperty` é uma propriedade no componente filho, o exemplo acima não funcionaria. O _template_ do pai não tem conhecimento do estado do componente filho.

Se você precisa ligar diretivas do escopo-filho a um nó de um componente raiz, você deveria fazer isso no próprio _template_ do componente filho:

``` js
Vue.component('child-component', {
  // isto funciona, pois nós estamos no escopo correto
  template: '<div v-show="someChildProperty">Child</div>',
  data: function () {
    return {
      someChildProperty: true
    }
  }
})
```

Da mesma forma, conteúdo distribuído será compilado no escopo dos pais.

### Slot Único

O conteúdo do pai será **descartado** a menos que o _template_ do componente filho contenha pelo menos um elemento `<slot>`. Quando há apenas um slot sem atributos, todo o fragmento de conteúdo será inserido em sua posição no DOM, substituindo o próprio slot.

Qualquer coisa originalmente dentro das tags `<slot>` é considerado **conteúdo reserva**. O conteúdo reserva é compilado no escopo do filho e só será exibido se o elemento hospedeiro estiver vazio e não tiver conteúdo a ser inserido.

Suponha que nós temos um componente chamado `my-component` com o seguinte _template_:

``` html
<div>
  <h2>Eu sou o título do filho</h2>
  <slot>
    Isto só será exibido se não há conteúdo a ser
    distribuído.
  </slot>
</div>
```

E um pai que usa o componente:

``` html
<div>
  <h1>Eu sou o título do pai</h1>
  <my-component>
    <p>Este é um conteúdo original</p>
    <p>Este é mais um conteúdo original</p>
  </my-component>
</div>
```

O resultado renderizado será:

``` html
<div>
  <h1>Eu sou o título do pai</h1>
  <div>
    <h2>Eu sou o título do filho</h2>
    <p>Este é um conteúdo original</p>
    <p>Este é mais um conteúdo original</p>
  </div>
</div>
```

### Slots Nomeados

Elementos `<slot>` têm um atributo especial `name`, que pode ser usado para personalizar ainda mais o conteúdo a ser distribuído. Você pode ter múltiplos slots com nomes diferentes. Um slot nomeado combinará qualquer elemento que tenha um atributo `<slot>` correspondente no fragmento de conteúdo.

Ainda pode haver um slot sem nome, que é o **slot padrão** que serve como saída para quando não há combinação de conteúdo. Se não houver nenhum slot padrão, o conteúdo não combinado será descartado.

Por exemplo, suponha que tenhamos um componente `app-layout` com o seguinte _template_:

``` html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

Código do pai:

``` html
<app-layout>
  <h1 slot="header">Aqui pode ser um título da página</h1>

  <p>Um parágrafo para o conteúdo principal.</p>
  <p>E aqui outro.</p>

  <p slot="footer">Aqui vai alguma informação de contato</p>
</app-layout>
```

O resultado renderizado será:

``` html
<div class="container">
  <header>
    <h1>Aqui pode ser um título da página</h1>
  </header>
  <main>
    <p>Um parágrafo para o conteúdo principal.</p>
    <p>E aqui outro.</p>
  </main>
  <footer>
    <p>Aqui vai alguma informação de contato</p>
  </footer>
</div>
```

A API de distribuição de conteúdo é um mecanismo muito útil ao projetar componentes que devem ser compostos juntos.

### Slots Escopo

> Novo em 2.1.0

Um slot escopo é um tipo especial de slot que funciona como um _template_ reusável (em que podemos passar dados para ele) em vez de elementos já renderizados.

Em um componente filho, simplesmente passe os dados para um slot como se você estivesse passando propriedades para um componente:

``` html
<div class="child">
  <slot text="olá do filho"></slot>
</div>
```

No pai, um elemento `<template>` com um atributo especial `scope` deve existir, indicando que ele é um _template_ para um _slot_ com escopo. O valor do `scope` é o nome de uma variável temporária que guarda o objeto de propriedades passado do filho:

``` html
<div class="parent">
  <child>
    <template scope="props">
      <span>olá do pai</span>
      <span>{{ props.text }}</span>
    </template>
  </child>
</div>
```

Se nós renderizarmos o código acima, a saída será:

``` html
<div class="parent">
  <div class="child">
    <span>olá do pai</span>
    <span>olá do filho</span>
  </div>
</div>
```

Um caso de uso mais típico para slots escopo seria um componente de lista que permite que o consumidor do componente personalize como cada item na lista deveria ser renderizado:

``` html
<my-awesome-list :items="items">
  <!-- slot escopo pode ser nomeado também -->
  <template slot="item" scope="props">
    <li class="my-fancy-item">{{ props.text }}</li>
  </template>
</my-awesome-list>
```

E o _template_ para o componente de lista:

``` html
<ul>
  <slot name="item"
    v-for="item in items"
    :text="item.text">
    <!-- conteúdo reserva aqui -->
  </slot>
</ul>
```

## Componentes Dinâmicos

Você pode usar o mesmo ponto de montagem e dinamicamente alternar entre vários componentes usando o elemento reservado `<component>` e ligar dinamicamente ao seu atributo `is`:

``` js
var vm = new Vue({
  el: '#example',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})
```

``` html
<component v-bind:is="currentView">
  <!-- o componente muda quando vm.currentView muda! -->
</component>
```

Se você preferir, você também pode ligar diretamente aos objetos de componente:

``` js
var Home = {
  template: '<p>Welcome home!</p>'
}

var vm = new Vue({
  el: '#example',
  data: {
    currentView: Home
  }
})
```

### `keep-alive`

Se você quiser manter os componentes na memória para que você possa preservar seu estado ou evitar a re-renderização, você pode envolver um componente dinâmico em um elemento `<keep-alive>`:

``` html
<keep-alive>
  <component :is="currentView">
    <!-- componentes inativos serão cacheados! -->
  </component>
</keep-alive>
```

Confira mais detalhes do `<keep-alive>` na [referência da API](../api/#keep-alive).

## Misc

### Criando Componentes Reutilizáveis

Ao criar componentes, é bom manter em mente se você pretende reutilizá-lo em algum outro lugar mais tarde. É bom que os componentes únicos sejam fortemente acoplados, mas os componentes reutilizáveis devem definir uma interface pública limpa e não fazer suposições sobre o contexto em que é usado.

A API para um componente Vue vem em três partes - propriedades, eventos e slots:

- **Propriedades** permitem que o ambiente externo passe dados para o componente

- **Eventos** permitem que o componente desencadeie efeitos colaterais no ambiente externo

- **Slots** permitem que o ambiente externo componha o componente com conteúdo extra

Com as sintaxes abreviadas para `v-bind` e `v-on`, as intenções podem ser transmitidas de forma clara e sucinta no _template_:

``` html
<my-component
  :foo="baz"
  :bar="qux"
  @event-a="doThis"
  @event-b="doThat"
>
  <img slot="icon" src="...">
  <p slot="main-text">Olá!</p>
</my-component>
```

### Referências ao Componente Filho

Apesar da existência de propriedades e eventos, algumas vezes você ainda pode precisar acessar diretamente um componente filho em JavaScript. Para conseguir isso você tem que atribuir um ID de referência para o componente filho usando `ref`. Por exemplo:

``` html
<div id="parent">
  <user-profile ref="profile"></user-profile>
</div>
```

``` js
var parent = new Vue({ el: '#parent' })
// acessa a instância do componente filho
var child = parent.$refs.profile
```

Quando `ref` é usada junto com `v-for`, a referência que você obtém será um _array_ contendo os componentes filhos que espelham a fonte de dados.

<p class="tip">`$refs` são populadas somente depois que o componente é renderizado, e isso não é reativo. Elas servem apenas como válvula de escape para a manipulação direta do filho - você deveria evitar o uso de `$refs` nos _templates_ ou nas propriedades computadas.</p>

### Componentes Assíncronos

Em grandes aplicações, podemos precisar dividir o aplicativo em pedaços menores e carregar apenas o componente do servidor quando ele é realmente necessário. Para facilitar isso, o Vue permite que você defina seu componente como uma função de fábrica que resolva de forma assíncra sua definição de componente. O Vue só acionará a função de fábrica quando o componente realmente precisar ser renderizado e armazenará em _cache_ o resultado para futuras re-renderizações. Por exemplo:

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // Passa a definição do componente para a callback de resolução
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

A função de fábrica recebe uma _callback_ `resolve`, que deve ser chamada quando você recuperar a definição do componente do servidor. Você também pode chamar `reject(reason)` para indicar que o carregamento falhou. O `setTimeout` aqui é simplesmente para demonstração; Como recuperar o componente está totalmente por sua conta. Uma abordagem recomendada é usar componentes assíncronos juntamente com a [função de divisão de código do Webpack](https://webpack.js.org/guides/code-splitting/):

``` js
Vue.component('async-webpack-example', function (resolve) {
  // Essa sintaxe especial instruirá o Webpack a
  // automaticamente dividir seu código compilado em
  // pacotes que são carregados por requisições Ajax.
  require(['./my-async-component'], resolve)
})
```

Você também pode retornar uma `Promise` na função de fábrica, então com a sintaxe do Webpack 2 + ES2015 você pode fazer:

``` js
Vue.component(
  'async-webpack-example',
  () => import('./my-async-component')
)
```

Ao usar [registro local](components.html#Local-Registration), você também pode fornecer diretamente uma função que retorne uma `Promise`:

``` js
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```

<p class="tip">Se você é um usuário de <strong>Browserify</strong> que gostaria de usar componentes assíncronos, seu criador infelizmente [deixou claro ](https://github.com/substack/node-browserify/issues/58#issuecomment-21978224) que carregamento assíncrono "não é algo que o Browserify irá suportar". Oficialmente, pelo menos. A comunidade Browserify encontrou [algumas soluções de contorno](https://github.com/vuejs/vuejs.org/issues/620), que podem ser úteis para aplicações existentes e complexas. Para todos os outros cenários, nós recomendamos simplesmente usar o Webpack, com um suporte assíncrono de primeira classe.</p>

### Componentes Assíncronos Avançados

> Novo na 2.3.0

A partir da 2.3 a fábrica de componente assíncrono também pode retornar um objeto do seguinte formato:

``` js
const AsyncComp = () => ({
  // O componente para carregar. Deve ser uma Promise
  component: import('./MyComp.vue'),
  // Um componente para usar enquanto o componente assíncrono está carregando
  loading: LoadingComp,
  // Um componente para usar se o carregamento falhar
  error: ErrorComp,
  // Tempo de espera antes de mostrar o componente em loading. Padrão: 200ms.
  delay: 200,
  // O componente de erro será exibido se um timeout é
  // fornecido e seu tempo é excedido. Padrão: Infinity.
  timeout: 3000
})
```

Observe que, quando usado como um componente de rota em `vue-router`, essas propriedades serão ignoradas porque os componentes assíncronos são resolvidos antecipadamente, antes que a navegação da rota ocorra. Você também precisa usar `vue-router` 2.4.0+ se você deseja usar a sintaxe acima para componentes de rota.

### Convenções para Nomeação de Componentes

Ao registrar componentes (ou propriedades), você pode usar _kebab-case_, _camelCase_, ou _PascalCase_.

``` js
// na definição de um componente
components: {
  // registra usando kebab-case
  'kebab-cased-component': { /* ... */ },
  // registra usando camelCase
  'camelCasedComponent': { /* ... */ },
  // registra usando PascalCase
  'PascalCasedComponent': { /* ... */ }
}
```

Dentro de _templates_ HTML no entanto, você tem que usar os _kebab-case_ equivalentes:

``` html
<!-- sempre use kebab-case em templates HTML -->
<kebab-cased-component></kebab-cased-component>
<camel-cased-component></camel-cased-component>
<pascal-cased-component></pascal-cased-component>
```

Entretanto, ao usar _string templates_, nós não estamos ligados pelas restrições _case-insensitive_ do HTML. Isso significa que mesmo no _template_, você pode referenciar seus componentes usando:

- _kebab-case_
- _camelCase_ ou _kebab-case_ se o componente foi definido usando _camelCase_
- _kebab-case_, _camelCase_ ou _PascalCase_ se o componente foi definido usando _PascalCase_

``` js
components: {
  'kebab-cased-component': { /* ... */ },
  camelCasedComponent: { /* ... */ },
  PascalCasedComponent: { /* ... */ }
}
```

``` html
<kebab-cased-component></kebab-cased-component>

<camel-cased-component></camel-cased-component>
<camelCasedComponent></camelCasedComponent>

<pascal-cased-component></pascal-cased-component>
<pascalCasedComponent></pascalCasedComponent>
<PascalCasedComponent></PascalCasedComponent>
```

Isto significa que o _PascalCase_ é a _convenção de declaração_ universal e o _kebab-case_ é a _convenção de uso_ universal.

Se o seu componente não passa conteúdo via elementos `slot`, você pode fechá-lo com uma `/` depois do nome:

``` html
<my-component/>
```

De novo, isto _somente_ funciona dentro de _string templates_, pois elementos personalizados auto-fechados não são HTML válidos e seu navegador nativo não irá entendê-los.

### Componentes Recursivos

Componentes podem recursivamente invocar a si mesmos no seu próprio _template_. No entanto, eles só podem fazer isso com a opção `name`:

``` js
name: 'unique-name-of-my-component'
```

Quando você registra globalmente um componente usando `Vue.component`, o ID global é automaticamente atribuído com o nome na opção `name`.

``` js
Vue.component('unique-name-of-my-component', {
  // ...
})
```

Se você não tomar cuidado, componentes recursivos podem também gerar _loops_ infinitos:

``` js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

Um componente como o de cima resultará em um erro de "tamanho máximo da pilha excedido", então tenha certeza que a sua invocação recursiva é condicional (isto é, usa um `v-id` que irá eventualmente ser `false`).

### Referências Circulares Entre Componentes

Vamos dizer que você está construindo uma árvore de arquivos de diretório, como um Finder ou um File Explorer. Você pode ter um componente `tree-folder` com este _template_:

``` html
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
```

Então um componente `tree-folder-contents` com este _template_:

``` html
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
```

Ao olhar mais de perto, você verá que esses componentes serão na verdade seus descendentes _e_ antepassados uns dos outros na árvore de renderização - um paradoxo! Ao registrar globalmente um componente com `Vue.component`, este paradoxo é resolvido para você automaticamente. Se esse é você, você pode parar de ler aqui.

Entretanto, se você está pegando/importando componentes usando um __sistem de módulos__, isto é, via Webpack ou Browserify, você terá um erro:

```
Failed to mount component: template or render function not defined.
```

Para explicar o que está acontecendo, irei chamar nossos componentes de A e B. O sistema de módulos enxerga que precisa de A, mas primeiro A precisa de B, mas B precisa de A, mas A precisa de B, etc, etc. Ele fica preso em um _loop_, não sabendo completamente como resolver nenhum dos componentes sem primeiro resolver o outro. Para consertar isso, nós precisamos dar ao sistema de módulos um ponto em que ele possa dizer, "A precisa de B _eventualmente_, mas não há necessidade de resolver o B primeiro."

No nosso caso, irei fazer esse ponto o componente `tree-folder`. Nós sabemos que o filho que cria o paradoxo é o componente `tree-folder-contents`, então esperaremos até que o hook de ciclo de vida `beforeCreate` o registre:

``` js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue')
}
```

Problema resolvido!

### Templates de mesma linha

Quando o atributo especial `inline-template` está presente em um componente filho, o componente usará seu conteúdo interno como seu _template_, ao invés de tratá-lo como um conteúdo distribuído. Isto permite mais flexibilidade na criação de _templates_.

``` html
<my-component inline-template>
  <div>
    <p>Esses são compilados como o próprio template do componente.</p>
    <p>Não é o conteúdo de transclusão do pai.</p>
  </div>
</my-component>
```

Porém, os `inline-template` dificultam o entendimento do escopo dos seus _templates_. Como uma melhor prática, prefira definir _templates_ dentro do componente usando a opção `template` ou em um elemento `template` em um arquivo `.vue`.

### X-Templates

Outro jeito de definir _templates_ é dentro de um elemento script com o tipo `text/x-template`, e então referenciando o _template_ por um id. Por exemplo:

``` html
<script type="text/x-template" id="hello-world-template">
  <p>Olá olá olá</p>
</script>
```

``` js
Vue.component('hello-world', {
  template: '#hello-world-template'
})
```

Estes podem ser utéis para demonstrações com grandes _templates_ ou em aplicações extremamente pequenas, mas devem ser evitados, pois eles separam os _templates_ do resto da definição do componente.

### Componentes Estáticos Baratos com `v-once`

Renderizar elementos HTML é muito fácil com o Vue, mas algumas vezes você pode ter um componente que contém **muito** conteúdo estático. Nestes casos, você pode garantir que ele seja avaliado somente uma vez, e então armazenado no cache, adicionando a diretiva `v-once` na raiz do elemento, assim:

``` js
Vue.component('terms-of-service', {
  template: '\
    <div v-once>\
      <h1>Termos de Serviço</h1>\
      ... um monte de conteúdo estático ...\
    </div>\
  '
})
```
