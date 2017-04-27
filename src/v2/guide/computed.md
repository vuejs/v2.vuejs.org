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

Por isso que, para qualquer lógica mais complexa, usamos **dados computados** (_computed properties_ no inglês, traduzidos como "dados" pois, durante a utilização em _templates_, se parecem efetivamente com propriedades definidas em `data`).

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
    message: 'Olá Vue'
  },
  computed: {
    // uma função "getter" computada (computed getter)
    reversedMessage: function () {
      // `this` aponta para a instância Vue da variável `vm`
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
    message: 'Olá Vue'
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

Pode abrir o _console_ e testar o exemplo você mesmo. O valor de `vm.reversedMessage` sempre dependerá do valor em `vm.message`.

É possível vincular os dados computados em _templates_ como se fossem dados comuns. Vue sabe que `vm.reversedMessage` depende de `vm.message`, então ele irá atualizar qualquer ligação que dependa de `vm.reversedMessage` sempre que `vm.message` for alterado. E o melhor é que criamos tal relação de dependência de forma declarativa: a função _getter_ computada é pura e sem efeitos colaterais, o que a torna fácil de testar e de compreender.

### Cache de `computed` vs. Métodos

Você pode ter notado que é possível obter o mesmo resultado chamando um método:

``` html
<p>Mensagem ao contrário: "{{ reverseMessage() }}"</p>
```

``` js
// no componente
methods: {
  reverseMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
```

Ao invés de um dado computado, podemos definir a mesma funcionalidade como um método. Como resultado final, ambas abordagens têm o mesmo efeito. No entanto, a diferença é que **dados computados são cacheados de acordo com suas dependências**. Um dado computado somente será reavaliado quando alguma de suas dependências for alterada. Isso significa que enquanto `message` não sofrer alterações, múltiplos acessos ao `reversedMessage` retornarão o último valor calculado sem precisar executar a função novamente.

Isto inclusive significa que o seguinte dado computado nunca se alterará, pois `Date.now()` não é uma dependência reativa por natureza:

``` js
computed: {
  now: function () {
    return Date.now()
  }
}
```

Em comparação, a invocação de um método **sempre** irá rodar a função, toda vez que uma nova renderização ocorrer.

Porque realmente precisamos de cache? Imagine que temos um dado computado **A** muito pesado ao ser processado, exigindo um laço por um Array enorme e fazendo diversos cálculos a cada iteração. Aí temos outros dados computados que dependem de **A** para processar. Sem cache, nós acabaríamos executando o _getter_ de **A** muito mais vezes do que o necessário! Em casos em que você realmente não deseje cache, simplesmente use um método no lugar.

### Dados Computados vs. Observadores

Vue oferece uma forma mais genérica para observar e reagir a mudanças de dados em uma instância: **observadores** (em inglês, _watchers_). Quando se tem alguns dados que necessitam mudar com base na alteração de outros dados, é tentador usar excessivamente o `watch` - especialmente se você está vindo do AngularJS. No entanto, frequentemente é melhor usar um dado computado em vez do `watch`. Considere este exemplo:

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

O código acima é imperativo e repetitivo. Compare-o com a versão com dados computados:

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

Muito melhor, não é mesmo?

### Atribuição em Dados Computados

Dados computados são por padrão _getter-only_ (somente retornam valor), mas é possível fornecer um _setter_ se precisar dele:

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
      this.firstName = names.shift()
      this.lastName = names.pop()
    }
  }
}
// ...
```

Se você executar `vm.fullName = 'John Doe'`, o _setter_ será automaticamente executado, fazendo com que `vm.firstName` e `vm.lastName` sejam atribuídos corretamente.

## Observadores

Enquanto dados computados são mais adequados na maioria dos casos, há momentos em que um observador personalizado é necessário. Por isso o Vue fornece uma maneira mais genérica para reagir a alterações de dados, o `watch`. Isto é particularmente útil quando se precisa executar operações assíncronas ou operações complexas antes de responder a uma alteração de dados.

Por exemplo:

``` html
<div id="watch-example">
  <p>
    Faça uma pergunta do tipo sim/não:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
```

``` html
<!-- Como já existe um rico ecossistema de bibliotecas para Ajax    -->
<!-- e de coleções de métodos utilitários com propósitos gerais, o  -->
<!-- núcleo Vue permanece pequeno não os reinventando. Isto também  -->
<!-- lhe dá a liberdade de usar apenas o que estiver familiarizado. -->
<script src="https://unpkg.com/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'Eu não posso responder até que você faça uma pergunta!'
  },
  watch: {
    // sempre que a pergunta mudar, essa função será executada
    question: function (newQuestion) {
      this.answer = 'Esperando você parar de escrever...'
      this.getAnswer()
    }
  },
  methods: {
    // _.debounce é uma função fornecida pelo lodash para limitar
    // a frequência que uma operação complexa pode ser executada.
    // Neste caso, queremos limitar a frequencia com que acessamos
    // a yesno.wtf/api, esperando que o usuário termine completamente
    // a digitação antes de realizar a chamada Ajax. Para aprender
    // mais sobre a função _.debounce (e sua prima _.throttle),
    // visite: https://lodash.com/docs#debounce
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (vm.question.indexOf('?') === -1) {
          vm.answer = 'Perguntas geralmente têm uma interrogação. ;-)'
          return
        }
        vm.answer = 'Pensando...'
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = response.data.answer === 'yes' ? 'Sim.' :
              response.data.answer === 'no' ? 'Não.' : 'Talvez!'
          })
          .catch(function (error) {
            vm.answer = 'Erro! Não pode executar a API. ' + error
          })
      },
      // Este é o número de milissegundos que aguardamos para
      // que o usuário pare de digitar
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
    Faça uma pergunta do tipo sim/não:
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
    answer: 'Eu não posso responder até que você faça uma pergunta!'
  },
  watch: {
    question: function (newQuestion) {
      this.answer = 'Esperando você parar de escrever...'
      this.getAnswer()
    }
  },
  methods: {
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (vm.question.indexOf('?') === -1) {
          vm.answer = 'Perguntas geralmente têm uma interrogação. ;-)'
          return
        }
        vm.answer = 'Pensando...'
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = response.data.answer === 'yes' ? 'Sim.' :
              response.data.answer === 'no' ? 'Não.' : 'Talvez!'
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

Neste caso, utilizar a opção `watch` nos permitiu realizar uma operação assíncrona (acessar uma API), limitar a frequência com que realizamos essa operação, e definir estados intermediários até que se obtenha a resposta final. Nada disso seria possível com um dado computado.

Além da opção `watch`, também é possível utilizar a API imperativa [vm.$watch](../api/#vm-watch).
