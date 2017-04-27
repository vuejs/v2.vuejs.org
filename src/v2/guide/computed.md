---
title: Dados Computados e Observadores
type: guide
order: 5
---

## Dados Computados

Expressões dentro de _templates_ são convenientes, mas elas deveriam ser utilizadas somente para operações. De fato, _templates_ são destinados a descrever a estrutura da sua _view_. Colocar muita lógica neles pode fazer com que fiquem inchados e que a sua manutenção fique mais complicada. Por exemplo:

``` html
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```

Neste ponto, o _template_ não é mais tão simples e declarativo. Você tem que olhá-lo por alguns segundos antes de entender que ele exibe o valor de `message` na ordem reversa. O problema é agravado quando se deseja incluir uma mensagem na ordem reversa em mais algum lugar do _template_, gerando-se repetições de código.

Por isso que, para qualquer lógica mais complexa, deve-se usar **dados computados** (_computed properties_ no inglês, traduzidos como "dados" pois efetivamente durante sua utilização nos _templates_, se parecem com as propriedades definidas em `data`).

### Exemplo Básico

``` html
<div id="example">
  <p>Mensagem original: "{{ message }}"</p>
  <p>Mensagem ao contrário: "{{ reversedMessage }}"</p>
</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // uma função "getter" computada (computed getter)
    reversedMessage: function () {
      // `this` aponta para a instância vm
      return this.message.split('').reverse().join('')
    }
  }
})
```

Resultado:

{% raw %}
<div id="example" class="demo">
  <p>Mensagem original: "{{ message }}"</p>
  <p>Mensagem ao contrário: "{{ reversedMessage }}"</p>
</div>
<script>
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    reversedMessage: function () {
      return this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Aqui nós declaramos um dado computado denominado `reversedMessage`. A função que fornecemos será usada como uma função _getter_ para a propriedade `vm.reversedMessage`.

``` js
console.log(vm.reversedMessage) // -> 'olleH'
vm.message = 'Goodbye'
console.log(vm.reversedMessage) // -> 'eybdooG'
```

Pode-se abrir o console e testar o exemplo você mesmo. O valor de `vm.reversedMessage` sempre dependerá do valor de `vm.message`


Você pode relacionar as propriedades computadas em templates como se fosse uma propriedade normal. Vue sabe que `vm.reversedMessage` depende de `vm.message`, então ele irá atualizar qualquer relação que dependa de `vm.reversedMessage` quando `vm.message` for alterado. E a melhor parte é que nós criamos esta relação de dependência de forma declarativa: A variável calculada é pura e não tem efeitos colaterais, o que torna fácil fazer testes e relações.

### Cache das variáveis computadas versus métodos

Você deve ter notado que podemos alcançar o mesmo resultado chamando um método:

``` html
<p>Reversed message: "{{ reverseMessage() }}"</p>
```

``` js
// no componente
methods: {
  reverseMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
```

Ao invés de uma propriedade calculada, nós podemos definir a mesma funcionalidade como um método. Para o resultado final, as duas abordagens possuem o mesmo resultado. Entretanto, a diferença é que **propriedades computadas são cacheadas baseadas em suas dependências**. Uma propriedade calculada somente será re-calculada quando alguma de suas dependências for alterada. Isso significa que enquanto `message` não tiver alterações, múltiplos acessos a propriedade calculada `reversedMessage` irão retornar o último valor calculado sem executar a função novamente.

Isto significa que a seguinte propriedade calculada nunca será alterada, porque `Date.now()` nao faz parte da dependência reativa do Vue.

``` js
computed: {
  now: function () {
    return Date.now()
  }
}
```

Em comparação, a chamada a função de um método sempre será executada, sempre quando for chamada.

Porque nós preciamos de cachear? Imagine que uma propriedade computada extensa chamada **A**, na qual requer um loop através de um enorme Array e realizando vários cálculos. Então podemos ter outras propriedades computadas que por sua vez dependam de **A** também. Sem o cache, estaremos executando **A** mais vezes que o necessário. Nos casos em que você não necessita de cache, use métodos

Então podemos ter outras propriedades computadas que por sua vez dependam de **A**. Sem cache, estaríamos executando **A** quantas vezes fossem necessárias. Nos casos em que você não precisa deseja usar cache, use métodos.

### Propriedades Computadas vs Observadores

Vue oferece uma forma mais genérica para observar e reagir as mudanças de dados em uma instância do Vue: **propriedades observadas** (observers). Quando se tem alguns dados que necessitam mudar com base na alteração de outros dados, é tentador usar de forma excessiva o `watch` - especialmente se você está vindo do AngularJS. No entanto, muitas vezes é melhor usar uma propriedade computada em vez do callback `watch`. Considere este exemplo:

``` html
<div id="demo">{{ fullName }}</div>
```

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})
```

O código acima é imperativo e repetitivo. Compare-o com uma versão com propriedades computadas:

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

NMuito melhor, não é mesmo ?

### Setter computado

Propriedades computadas são por padrão *getter-only* (somente retornam um valor, somente um get), mas você pode também fornecer um *set* quando precisar dele:

``` js
// ...
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

Quando você executa `vm.fullName = 'John Doe'`, o setter será chamado and `vm.firstName` e `vm.lastName` serão atualizados corretamente.

## Watchers (observadores)

Enquanto propriedades computadas são mais adequadas na maioria dos casos, há momentos em que um observador customizado é necessário. É por isso que o Vue fornece uma maneira mais genérica para reagir a alterações de dados através da opção `watch`. Isto é mais útil quando você precisa executar operações assíncronas ou operações complexas para responder a uma alteração de dados.

Por exemplo:

``` html
<div id="watch-example">
  <p>
    Fazer uma pergunta sim / não:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
```

``` html
<!-- Como já existe um rico ecossistema de bibliotecas ajax    -->
<!-- e coleções de métodos utilitários com o mesmo propósito geral,  -->
<!-- o núcleo Vue permanece pequeno por não reinventá-los. Isto também -->
<!-- lhe dá a liberdade de usar apenas o que você está familiarizado. -->
<script src="https://unpkg.com/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'Eu não posso lhe dar uma resposta até que você faça uma pergunta!'
  },
  watch: {
    // sempre que a pergunta muda, essa função será executada
    question: function (newQuestion) {
      this.answer = 'Esperando você parar de escrever ...'
      this.getAnswer()
    }
  },
  methods: {
    // _.debounce é uma função fornecida pelo lodash para limitar como
    // a frequência de uma operação complexa pode ser executada
    // Neste caso, queremos limitar a frequencia com que acessamos
    // a api yesno.wtf., esperando que o usuário termine completamente
    // a digitação antes de realizar achamada ajax. Para aprender
    // mais sobre a função _.debounce (e seu primo
    // _.throttle), visite: https://lodash.com/docs#debounce
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (this.question.indexOf('?') === -1) {
          vm.answer = 'Perguntas geralmente contêm um ponto de interrogação. ;-)'
          return
        }
        vm.answer = 'Pensando...'
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = 'Erro! Não pode executar a API. ' + error
          })
      },
      // Este é o número de milissegundos aguardados após o usuário
      // parar de digitar
      500
    )
  }
})
</script>
```

Resultado:

{% raw %}
<div id="watch-example" class="demo">
  <p>
    Fazer uma pergunta sim / não:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
<script src="https://unpkg.com/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'Eu não posso lhe dar uma resposta até que você faça uma pergunta!'
  },
  watch: {
    question: function (newQuestion) {
      this.answer = 'Esperando você parar de escrever ...'
      this.getAnswer()
    }
  },
  methods: {
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (this.question.indexOf('?') === -1) {
          vm.answer = 'Perguntas geralmente contêm um ponto de interrogação. ;-)'
          return
        }
        vm.answer = 'Pesando...'
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = 'Erro! Não pode executar a API. ' + error
          })
      },
      500
    )
  }
})
</script>
{% endraw %}

Neste caso, usar a opção `watch`, nos permite realizar uma operação assíncrona (acessar uma API), limitar a frequência com que se realiza essa operação, e definir os estados intermediários até que se obtenha a resposta final. Nada disso é possível com uma propriedade computada.


Além da opção `watch`, você também pode usar a [API vm.$watch](../api/#vm-watch).
