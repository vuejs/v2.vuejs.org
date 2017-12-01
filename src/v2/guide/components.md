---
title: Componentes
type: guide
order: 11
---

## Entendendo Componentes

Os componentes são um dos recursos mais poderosos do Vue. Eles ajudam a estender os elementos HTML para encapsular código de forma reusável. Em um alto nível, componentes são elementos personalizados que o Vue compila e anexa à sua instância. Em alguns casos, eles podem aparecer como um HTML nativo estendido com o atributo especial `is`.

Todos os componentes Vue também são instância Vue, e portanto aceitam o mesmo objeto de opções (exceto para algumas poucas opções específicas de nível raiz) e oferecem os mesmos gatilhos de ciclo de vida.

## Usando Componentes

### Registrando Globalmente

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

<p class="tip">Observe que o Vue não força as regras da [W3C](https://www.w3.org/TR/custom-elements/#concepts) para nomes de _tags_ personalizadas (tudo minúsculo, obrigatoriamente com hífen entre palavras) embora seguir essa convenção seja considerado uma boa prática.</p>

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

O resultado renderizado será:

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

### Registrando Localmente

Você não é obrigado a registrar todo componente globalmente. É possível disponibilizar um componente somente no escopo de outra instância/componente, registrando-o com a opção `components`:

``` js
var Child = {
  template: '<div>Um elemento personalizado!</div>'
}

new Vue({
  // ...
  components: {
    // <my-component> só estará disponível no _template_ pai
    'my-component': Child
  }
})
```

De fato, a mesma regra de encapsulamento se aplica para outros recursos registráveis do Vue, como as diretivas e os filtros.

### Cuidados com o Uso no DOM

Quando usar o próprio DOM como seu _template_ (isto é, usar a opção `el` para montar a instância Vue em um conteúdo HTML já existente), você estará sujeito a algumas restrições inerentes a como o HTML funciona, pois o Vue só pode recuperar o conteúdo do _template_ **depois** que o navegador o analisou e o normalizou. De maneira mais perceptível, alguns elementos como `<ul>`, `<ol>`, `<table>` e `<select>` têm restrições de quais elementos podem aparecer dentro deles, e alguns elementos como `<option>` podem aparecer somente dentro de certos outros elementos.

Isso levará a problemas quando usar componentes personalizados no lugar de elementos que possuem tais restrições, por exemplo:

``` html
<table>
  <my-row>...</my-row>
</table>
```

O componente personalizado `<my-row>` será jogado para fora da tabela como um conteúdo inválido, causando erros na renderização. Uma solução seria usar o atributo especial `is`:

``` html
<table>
  <tr is="my-row"></tr>
</table>
```

**Note que essas limitações não se aplicam se estiver usando _templates_ baseados em Strings, de uma das seguintes maneiras:**:

- `<script type="text/x-template">`
- _Templates Strings_ do próprio JavaScript
- Componentes `.vue`

Portanto, para casos simples, prefira usar _Template Strings_ sempre que for possível.

### Opção `data` Deve Ser uma Função

A maioria das opções que podem ser informadas no construtor de uma instância Vue também podem ser usadas em um componente, com um caso em especial: a opção `data` deve ser uma função. De fato, se você tentar isso:

``` js
Vue.component('my-component', {
  template: '<span>{{ message }}</span>',
  data: {
    message: 'olá'
  }
})
```

Você será interrompido com avisos no _console_, informando que `data` deve ser uma função para instâncias de componentes. É bom entender por que as regras existem: vamos trapacear!

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
  // data é tecnicamente uma função, assim o Vue não vai
  // reclamar, mas nós retornamos a mesma referência ao
  // mesmo objeto para qualquer instância do componente
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

Uma vez que todas as três instâncias do componente compartilham o mesmo objeto `data`, incrementar o contador no objeto reflete em todos eles! Ah não... Vamos corrigir isso, retornando um novo objeto de dados para cada instância do componente:

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

Componentes existem para serem usados em conjunto, comumente em relacionamentos pai-filho: o componente A deve usar o componente B no seu próprio _template_. Eles inevitavelmente precisam se comunicar: o pai pode precisar passar dados para baixo ao seu próprio filho, e o filho pode precisar informar a seu pai sobre alguma coisa que aconteceu nele. Entretanto, também é muito importante manter o pai e o filho o mais desacoplados possível por meio de uma comunicação clara e definida. Isso garante que o código de cada componente possa ser escrito e entendido de forma relativamente isolada, os tornando mais fáceis de manter e potencialmente mais fáceis de reutilizar.

No Vue, o relacionamento pai-filho pode ser resumido como **propriedades para baixo, eventos para cima**. O pai passa dados para baixo por meio de **propriedades**, e o filho envia mensagens para o pai por meio de **eventos**. Vamos ver como eles funcionam a seguir.

<p style="text-align: center;">
  <img style="width: 300px;" src="/images/props-events.png" alt="propriedades para baixo, eventos para cima">
</p>

## Propriedades

### Passando Dados com Propriedades

Toda instância de componente tem seu próprio **escopo isolado**. Isso significa que você não pode (e não deveria) referenciar diretamente dados do pai no _template_ de um componente filho. Dados podem ser passados para componentes filhos usando **propriedades**.

Uma propriedade é um atributo personalizado para passar informação a partir do pai. Um filho deve declarar explicitamente o que ele espera receber usando a [opção `props`](../api/#props):

``` js
Vue.component('child', {
  // declara as propriedades
  props: ['message'],
  // assim como os dados, a propriedade pode ser usada dentro de templates
  // e também se torna disponível na instância como this.message
  template: '<span>{{ message }}</span>'
})
```

Então nós podemos passar uma _string_ simples para ela como:

``` html
<child message="Olá!"></child>
```

Resultado:

{% raw %}
<div id="prop-example-1" class="demo">
  <child message="Olá!"></child>
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

Atributos HTML são _case-insensitive_. Quando usar _templates_ não baseados em Strings, nomes de propriedades _camelCased_ precisam do equivalente em _kebab-case_ (delimitado por hífen):


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

De novo, se você estiver usando _string templates_, essa limitação não se aplica.

### Propriedades Dinâmicas

Semelhante à ligação de um atributo normal a uma expressão, nós podemos também usar o `v-bind` para dinamicamente ligar propriedades a dados no pai. Sempre que os dados forem atualizados no pai, isso fluirá também para o filho:

``` html
<div>
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
```

Você também pode usar a sintaxe abreviada para o `v-bind`:

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

Se você quiser passar todas as propriedades em um objeto como `props`, pode usar `v-bind` sem informar um argumento (`v-bind` ao invés de `v-bind:prop-name`). Por exemplo, dado o objeto `todo` a seguir:

``` js
todo: {
  text: 'Aprenda Vue',
  isComplete: false
}
```

Então:

``` html
<todo-item v-bind="todo"></todo-item>
```

Será equivalente a:

``` html
<todo-item
  v-bind:text="todo.text"
  v-bind:is-complete="todo.isComplete"
></todo-item>
```

### Literal vs. Dinâmico

Um erro comum que iniciantes costumam fazer é tentar passar um valor numérico usando a sintaxe literal:

``` html
<!-- isto passa a String "1" -->
<comp some-prop="1"></comp>
```

No entanto, como isso é uma propriedade literal, o valor é passado como uma String `"1"` ao invés de um número. Se quisermos passar um número JavaScript real, nós precisamos usar o `v-bind` para que o seu valor seja avaliado como uma expressão JavaScript:

``` html
<!-- isto passa um número de verdade -->
<comp v-bind:some-prop="1"></comp>
```

### Fluxo de Dados Unidirecional

Todas as propriedades formam uma ligação **unidirecional** entre a propriedade do filho e o dado do pai: quando o pai é atualizado, o valor irá fluir para o filho, mas não o caminho inverso. Isso previne os componentes filhos de acidentalmente alterarem o estado dos pais, o que pode dificultar o entendimento dos dados de sua aplicação.

Além disso, sempre que o componente pai é atualizado, as propriedades do componente filho estarão atualizadas com o valor mais recente. Você **não** deveria tentar alterar uma propriedade dentro do componente filho. Se fizer isso, o Vue irá te avisar no _console_.

Geralmente há dois casos em que é tentador alterar uma propriedade:

1. A propriedade é usada para passar um valor inicial; o componente filho simplesmente quer usá-la como um dado local posteriormente.

2. A propriedade é passada como um valor bruto que precisa ser transformado.

A resposta apropriada para esses casos de uso são:

1. Defina um dado local que usa o valor da propriedade como o seu valor inicial:

  ``` js
  props: ['initialCounter'],
  data: function () {
    return { counter: this.initialCounter }
  }
  ```

2. Defina um dado computado que é calculado a partir do valor da propriedade:

  ``` js
  props: ['size'],
  computed: {
    normalizedSize: function () {
      return this.size.trim().toLowerCase()
    }
  }
  ```

<p class="tip">Observe que objetos e Arrays em JavaScript são passados como referência, ou seja, se uma propriedade é um Array ou um objeto, alterá-la dentro do próprio filho **irá** afetar inadivertidamente o estado do pai.</p>

### Validação de Propriedades

É possível para um componente especificar requisitos para as propriedades que ele está recebendo. Se um requisito não é atendido, Vue emitirá avisos. É especialmente útil quando se está criando um componente com a intenção de que seja usado por outros desenvolvedores.

Em vez de definir as propriedades como um Array de Strings, você pode usar um objeto com os requisitos de validação:

``` js
Vue.component('example', {
  props: {
    // verificação de tipo básico (`null` para aceitar qualquer tipo)
    propA: Number,
    // vários tipos possíveis
    propB: [String, Number],
    // uma String é obrigatória
    propC: {
      type: String,
      required: true
    },
    // um número com valor padrão
    propD: {
      type: Number,
      default: 100
    },
    // Object/Array padrão precisa ser retornado
    // por uma função de fábrica
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

Quando a validação de propriedade falha, Vue produz um aviso no _console_ (se estiver utilizando uma compilação de desenvolvimento). Note que propriedades são validadas __antes__ da instância do componente ser criada, portanto em funções `default` ou `validator`, propriedades da instância como `data`, `computed` ou `methods` não estarão disponíveis.

## Atributo Não-Prop

Um atributo não-prop é um atributo passado a um componente, mas que não tem uma propriedade correspondente definida através de `props`.

Enquanto explicitamente definir `props` é a forma recomendada de passar informações a componentes filhos, autores de bibliotecas de componentes não podem sempre prever o contexto no qual seus componentes poderão ser utilizados. Por isso componentes podem aceitar atributos arbitrários, os quais são adicionados ao elemento raiz do componente.

Por exemplo, imagine que estamos usando um componente `bs-date-input` de terceiros, com um _plugin_ Bootstrap que exige um atributo `data-3d-date-picker` no `input`. Nós podemos adicionar este atributo à nossa instância do componente:

``` html
<bs-date-input data-3d-date-picker="true"></bs-date-input>
```

E o atributo `data-3d-date-picker="true"` será automaticamente adicionado ao elemento raiz do `bs-date-input`.

### Substituindo/Mesclando Atributos

Imagine que este é o _template_ do `bs-date-input`:

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

Para mais atributos, o valor provido ao componente irá substituir o valor previamente definido no componente. Por exemplo, passar `type="large"` irá sobreescrever `type="date"` e provavelmente quebrar a funcionalidade! Por sorte, os atributos `class` e `style` são um pouco mais inteligentes e seus valores são mesclados automaticamente, tornando o valor final: `form-control date-picker-theme-dark`.

## Eventos Personalizados

Nós aprendemos que o pai pode passar dados para o filho usando propriedades, mas como nós comunicamos de volta para o pai quando alguma coisa acontece? É aí que o sistema de eventos personalizados do Vue entra.

### Usando `v-on` com Eventos Personalizados

Toda instância Vue implementa uma [interface de eventos](../api/#Metodos-da-Instancia-Eventos), o que significa que ela pode:

- Ouvir um evento usando `$on(eventName)`
- Disparar um evento usando `$emit(eventName)`

<p class="tip">Observe que o sistema de eventos do Vue é separado da [EventTarget API](https://developer.mozilla.org/pt-BR/docs/Web/API/EventTarget) do navegador. Embora eles funcionem de maneira semelhante, o `$on` e o `$emit` __não__ são apelidos para o `addEventListener` e o `dispatchEvent`.</p>

Além disso, um componente pai pode ouvir eventos emitidos do componente filho usando o `v-on` diretamente no _template_ onde o componente filho é usado.

<p class="tip">Você não pode usar o `$on` para ouvir eventos emitidos pelo filho. Você deve usar o `v-on` diretamente no _template_ pai, como no exemplo abaixo.</p>

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
  template: '<button v-on:click="incrementCounter">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    incrementCounter: function () {
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
  template: '<button v-on:click="incrementCounter">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    incrementCounter: function () {
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

### Ligando Eventos Nativos a Componentes

Pode haver momentos em que você deseja escutar um evento nativo ocorrido no elemento raiz de um componente. Nesses casos, use o modificador `.native` para o `v-on`:

``` html
<my-component v-on:click.native="doTheThing"></my-component>
```

### O Modificador `.sync`

> 2.3.0+

Em alguns casos nós podemos precisar de uma "ligação bidirecional" para uma propriedade - na verdade, no Vue 1.x era exatamente o que o modificador `.sync` fornecia. Quando um componente filho altera uma propriedade que possui `.sync`, a mudança de valor refletirá no pai. Isto é conveniente, no entanto leva a problemas de manutenção a longo prazo porque quebra a suposição de fluxo de dados unidirecional: o código que altera propriedades do filho está implicitamente afetando o estado do pai.

Por isso removemos o modificador `.sync` quando a versão 2.0 foi lançada. No entanto, descobrimos que, de fato, existem casos em que isso pode ser útil, especialmente quando publicando componentes reutilizáveis. O que precisamos mudar é **fazer um código no filho que afeta o estado do pai de forma mais consistente e explícita.**

Na versão 2.3.0+ re-introduzimos o modificador `.sync` para propriedades, mas desta vez ele é só "açúcar sintático", o qual automaticamente se expande para uma escuta `v-on` adicional.

Por exemplo, o seguinte:

``` html
<comp :foo.sync="bar"></comp>
```

É expandido para:

``` html
<comp :foo="bar" @update:foo="val => bar = val"></comp>
```

Para o componente filho atualizar o valor de `foo`, ele precisa explicitamente emitir um evento em vez de alterar a propriedade diretamente:

``` js
this.$emit('update:foo', newValue)
```

### Componentes Suportando v-model

Eventos personalizados também podem ser usados para criar _inputs_ personalizados que funcionam com `v-model`. Lembre-se:

``` html
<input v-model="something">
```

É "açúcar sintático" para:

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

Então, para funcionar com o `v-model`, ele deveria (pode ser configurado em 2.2.0+):

- aceitar uma propriedade `value`
- emitir um evento `input` com um novo valor

Vamos vê-lo em ação com um _input_ monetário simples:

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

No entanto, a implementação acima é bem ingênua. Por exemplo, é permitido aos usuários entrarem com múltiplos pontos e até letras algumas vezes - eca! Então, para aqueles que querem ver um exemplo não trivial, aqui está um componente monetário mais robusto:

<iframe width="100%" height="300" src="https://jsfiddle.net/ErickPetru/vbs2yynj/1/embedded/result,html,js" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Personalizando o Suporte ao `v-model`

> Novo em 2.2.0+

Por padrão, o `v-model` em um componente usa `value` como propriedade e `input` como evento, mas alguns tipos de _input_ como _checkboxes_ e _radio buttons_ podem necessitar usar a propriedade `value` para um propósito diferente. A opção `model` pode evitar tal conflito:

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

Algumas vezes, componentes podem precisar se comunicar sem serem pai/filho um do outro. Em casos simples, pode-se usar uma instância Vue vazia como barramento de eventos central:

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

Para casos mais complexos, considere empregar um [padrão de gerenciamento de estado](state-management.html).

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

Para que a composição funcione, precisamos de um jeito de entreleçar o "conteúdo" do pai e o _template_ do próprio componente. Este é um processo chamado de **distribuição de conteúdo** (ou "transclusão" se você estiver familiarizado com Angular). Vue.js implementa uma API de distribuição de conteúdo que é modelada a partir do atual [rascunho de especificação de Web Components](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md), usando o elemento especial `<slot>` para servir como ponto de distribuição para o conteúdo original.

### Escopo de Compilação

Antes de nos aprofundarmos para dentro da API, vamos primeiro esclarecer em qual escopo os conteúdos são compilados. Imagine um _template_ assim:

``` html
<child-component>
  {{ message }}
</child-component>
```

A `message` deveria ser ligada aos dados do pai ou aos dados do filho? A resposta é do pai. Uma regra simples para o escopo do componente é:

> Tudo que estiver no _template_ do pai é compilado no escopo do pai; tudo que estiver no _template_ do filho é compilado no escopo do filho.

Um erro comum é tentar ligar uma diretiva a um dado do filho no _template_ do pai:

``` html
<!-- NÃO funciona -->
<child-component v-show="someChildProperty"></child-component>
```

Assumindo que `someChildProperty` é uma propriedade no componente filho, o exemplo acima não funcionaria. O _template_ do pai não tem conhecimento do estado do filho.

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

### Slot Simples

O conteúdo do pai será **descartado** a menos que o _template_ do componente filho contenha pelo menos um elemento `<slot>`. Quando há apenas um _slot_ sem atributos, todo o fragmento de conteúdo será inserido em sua posição no DOM, substituindo o próprio _slot_.

Qualquer coisa originalmente dentro das tags `<slot>` é considerado **conteúdo reserva**. O conteúdo reserva é compilado no escopo do filho e será exibido somente se o elemento hospedeiro estiver vazio e não tiver conteúdo a ser inserido.

Suponha que nós temos um componente chamado `my-component` com o seguinte _template_:

``` html
<div>
  <h2>Eu sou o título do filho</h2>
  <slot>
    Isto só será exibido se não há conteúdo a ser distribuído.
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

Elementos `<slot>` têm um atributo especial `name`, que pode ser usado para personalizar ainda mais o conteúdo a ser distribuído. Você pode ter múltiplos _slots_ com nomes diferentes. Um _slot_ nomeado combinará qualquer elemento que tenha um atributo `<slot>` correspondente no fragmento de conteúdo.

Ainda pode haver um _slot_ sem nome, que é o **slot padrão** que serve como saída para quando não há combinação de conteúdo. Se não houver nenhum _slot_ padrão, o conteúdo não combinado será descartado.

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

### Slot com Escopo

> Novo em 2.1.0+

Um _slot_ com escopo é um tipo especial de _slot_ que funciona como um _template_ reusável (em que podemos passar dados para ele) em vez de elementos já renderizados.

Em um componente filho, passe os dados para um _slot_ como se você estivesse passando propriedades para um componente:

``` html
<div class="child">
  <slot text="olá do filho"></slot>
</div>
```

No pai, um elemento `<template>` com um atributo especial `slot-scope` deve existir, indicando que ele é um _template_ para um _slot_ com escopo. O valor de `slot-scope` será usado como o nome de uma variável temporária que guardará o objeto de propriedades passado pelo filho:

``` html
<div class="parent">
  <child>
    <template slot-scope="props">
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

> No 2.5.0+, `slot-scope` não é mais limitado a `<template>` e pode ser usado em qualquer elemento ou componente.

Um caso de uso mais típico para _slots_ com escopo seria um componente de lista que permite que o consumidor do componente personalize como cada item deveria ser renderizado:

``` html
<my-awesome-list :items="items">
  <!-- slot com escopo pode ser nomeado também -->
  <li
    slot="item"
    slot-scope="props"
    class="my-fancy-item">
    {{ props.text }}
  </li>
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

#### Desestruturação

O valor de `slot-scope` é, de fato, uma expressão JavaScript válida que possa aparecer na posição de argumentos na assinatura de uma função. Isto significa que, em ambientes com suporte (em Componentes Single-File ou em navegadores modernos), você também pode utilizar a desestruturação do ES2015 na expressão:

``` html
<child>
  <span slot-scope="{ text }">{{ text }}</span>
</child>
```

## Componentes Dinâmicos

Você pode usar o mesmo ponto de montagem e alternar dinamicamente entre componentes usando o elemento `<component>` e ligando dinamicamente seu atributo `is`:

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

Se você preferir, você também pode ligar diretamente ao objeto do componente:

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

Se você quiser manter componentes na memória para que você possa preservar seu estado ou evitar "re-renderização", envolva um componente dinâmico em um elemento `<keep-alive>`:

``` html
<keep-alive>
  <component :is="currentView">
    <!-- componentes inativos serão cacheados! -->
  </component>
</keep-alive>
```

Confira mais detalhes do `<keep-alive>` na [referência da API](../api/#keep-alive).

## Outros Assuntos

### Criando Componentes Reutilizáveis

Ao criar componentes, é bom pensar se você pretende reutilizá-lo em algum outro lugar mais tarde. É interessante que componentes únicos sejam fortemente acoplados, mas componentes reutilizáveis devem definir uma interface pública limpa e não fazer suposições sobre o contexto em que são usados.

A API para um componente Vue vem em três partes - propriedades, eventos e _slots_:

- **Propriedades** permitem que o ambiente externo passe dados para o componente

- **Eventos** permitem que o componente desencadeie efeitos colaterais no ambiente externo

- **Slots** permitem que o ambiente externo componha o componente com conteúdo extra

Com as sintaxes abreviadas para `v-bind` e `v-on`, as intenções podem ser transmitidas de forma clara e sucinta no _template_:

``` html
<my-component
  :foo="baz"
  :bar="qux"
  @event-a="doThis"
  @event-b="doThat">
  <img slot="icon" src="...">
  <p slot="main-text">Olá!</p>
</my-component>
```

### Referências a Componentes Filhos

Apesar da existência de propriedades e eventos, algumas vezes você ainda pode precisar acessar diretamente um componente filho no JavaScript. Para conseguir isso, você tem que atribuir um identificador de referência para o componente filho, usando `ref`. Por exemplo:

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

Quando se utiliza `ref` em conjunto com `v-for`, a referência obtida será um Array contendo os componentes filhos que espelham a fonte de dados.

<p class="tip">`$refs` são populadas somente após o componente ser renderizado, e isso não é reativo. Servem apenas como válvula de escape para a manipulação direta - você deveria evitar o uso de `$refs` nos _templates_ ou nas propriedades computadas.</p>

### Componentes Assíncronos

Em grandes aplicações, podemos precisar dividir o aplicativo em pedaços menores e carregar o componente do servidor apenas quando for realmente necessário. Para facilitar, Vue permite que você defina seu componente como uma função de fábrica, desde que resolva de forma assíncra sua definição de componente. Vue só acionará a função de fábrica quando o componente realmente precisar ser renderizado e armazenará em _cache_ o resultado para futuras "re-renderizações". Por exemplo:

``` js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // Passa a definição do componente para a função de resolução
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

A função de fábrica recebe uma função _callback_ `resolve`, que deve ser chamada quando você recuperar a definição do componente do servidor. Você também pode chamar `reject(reason)` para indicar que o carregamento falhou. O `setTimeout` aqui é simplesmente para demonstração: como recuperar o componente fica totalmente por sua conta. Uma abordagem recomendada é usar juntamente com a [ferramenta de divisão de código do Webpack](https://webpack.js.org/guides/code-splitting/):

``` js
Vue.component('async-webpack-example', function (resolve) {
  // Essa sintaxe especial instruirá o Webpack a
  // automaticamente dividir seu código compilado em
  // pacotes que serão carregados por requisições Ajax.
  require(['./my-async-component'], resolve)
})
```

Você também pode retornar uma `Promise` na função de fábrica. Então, com a sintaxe do Webpack 2 + ES2015 você pode fazer:

``` js
Vue.component(
  'async-webpack-example',
  // The `import` function returns a `Promise`.
  () => import('./my-async-component')
)
```

Ao usar [registro local](components.html#Registrando-Localmente), também pode fornecer diretamente uma função que retorna `Promise`:

``` js
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```

<p class="tip">Se você é usuário de <strong>Browserify</strong> e gostaria de usar componentes assíncronos, seu criador infelizmente [deixou claro](https://github.com/substack/node-browserify/issues/58#issuecomment-21978224) que carregamento assíncrono "não é algo que o Browserify irá algum dia suportar". Oficialmente, pelo menos. A comunidade Browserify encontrou [algumas soluções alternativas](https://github.com/vuejs/vuejs.org/issues/620), que podem ser úteis para aplicações existentes e complexas. Para todos os outros cenários, nós recomendamos usar o Webpack, com um suporte assíncrono de primeira classe por padrão.</p>

### Componentes Assíncronos Avançados

> Novo em 2.3.0+

A partir da versão 2.3.0+ a função de fábrica de componente assíncrono também pode retornar um objeto no seguinte formato:

``` js
const AsyncComp = () => ({
  // O componente a carregar, na forma de uma Promise
  component: import('./MyComp.vue'),
  // Um componente para usar enquanto o componente assíncrono está carregando
  loading: LoadingComp,
  // Um componente para usar se o carregamento falhar
  error: ErrorComp,
  // Tempo de espera antes de mostrar o "carregando". Padrão: 200ms
  delay: 200,
  // O componente de erro será exibido se um limite de tempo é
  // fornecido e este for excedido. Padrão: Infinity
  timeout: 3000
})
```

Observe que, quando usado como um componente de rota em `vue-router`, essas propriedades serão ignoradas porque os componentes assíncronos são resolvidos antecipadamente, antes que a navegação da rota ocorra. Você também precisa usar `vue-router` 2.4.0+ se você deseja usar a sintaxe acima para componentes de rota.

### Convenções para Nomeação de Componentes

Ao registrar componentes (assim como ao registrar propriedades), você pode usar _kebab-case_, _camelCase_, ou _PascalCase_.

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

Dentro de _templates_ HTML, no entanto, você tem que usar os _kebab-case_ equivalentes:

``` html
<!-- sempre use kebab-case em templates HTML -->
<kebab-cased-component></kebab-cased-component>
<camel-cased-component></camel-cased-component>
<pascal-cased-component></pascal-cased-component>
```

Entretanto, ao usar _templates_ baseados em Strings, nós não estamos ligados pelas restrições _case-insensitive_ do HTML. Isso significa que mesmo no _template_ você poderá referenciar seus componentes usando:

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

Isto significa que, pela sua flexibilidade, o _PascalCase_ é a _convenção de declaração_ universal e o _kebab-case_ é a _convenção de uso_ universal.

Se o componente não compõe conteúdo via `slot`, você pode representá-lo como uma _tag_ auto-contida usando uma `/` depois do nome:

``` html
<my-component/>
```

Novamente, isto funciona _somente_ dentro de _templates_ baseados em Strings, pois elementos personalizados auto-contidos não é um HTML válido e seu navegador não irá entendê-los.

### Componentes Recursivos

Componentes podem recursivamente invocar a si mesmos em seus próprios _templates_. No entanto, eles só podem fazer isso se tiverem a opção `name` definida:

``` js
name: 'unique-name-of-my-component'
```

Quando você registra globalmente um componente usando `Vue.component`, o identificador global é automaticamente atribuído como nome na opção `name`.

``` js
Vue.component('unique-name-of-my-component', {
  // ...
})
```

Se você não tomar cuidado, componentes recursivos podem gerar _loops_ infinitos:

``` js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

Um componente como acima resultará em um erro de "tamanho máximo da pilha excedido", então tenha certeza que a sua invocação recursiva é condicional (isto é, usa um `v-if` que eventualmente será `false`).

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

Ao olhar mais de perto, você verá que esses componentes serão na verdade tanto seus descendentes _quanto_ seus antepassados na árvore de renderização - um paradoxo! Ao registrar globalmente um componente com `Vue.component`, este paradoxo é resolvido para você automaticamente. Se é este o seu caso, pode parar de ler aqui.

Entretanto, se você está pegando/importando componentes usando um __sistem de módulos__, por exemplo, via Webpack ou Browserify, você terá um erro:

```
Failed to mount component: template or render function not defined.
```

Para explicar o que está acontecendo, chamaremos nossos componentes de A e B. O sistema de módulos enxerga que precisa de A, mas primeiro A precisa de B, mas B precisa de A, mas A precisa de B, etc, etc. Ele fica preso em um _loop_, não sabendo como resolver completamente nenhum dos componentes sem primeiro resolver o outro. Para consertar isso, nós precisamos dar ao sistema de módulos um ponto em que ele possa dizer, "A precisa de B _eventualmente_, mas não há necessidade de resolver o B primeiro."

No nosso caso, faremos esse ponto no componente `tree-folder`. Nós sabemos que o filho que cria o paradoxo é o componente `tree-folder-contents`, então esperaremos até que o gatilho de ciclo de vida `beforeCreate` o registre:

``` js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue')
}
```

Problema resolvido!

### Templates Inline

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

Outro jeito é definir _templates_ dentro de um elemento _script_ com o tipo `text/x-template`, e então referenciar o _template_ por um `id`. Por exemplo:

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

Este cenário pode ser útil para demonstrações com _templates_ muito grandes ou em aplicações extremamente pequenas, mas deve ser evitado por separar os _templates_ do resto da definição do componente.

### Componentes Estáticos Leves com `v-once`

Renderizar elementos HTML é muito fácil com Vue, mas algumas vezes você pode ter um componente que contém **muito** conteúdo estático. Nestes casos, é possível garantir que ele seja avaliado somente uma vez e então armazenado no _cache_, através da diretiva `v-once` no elemento raiz, assim:

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
