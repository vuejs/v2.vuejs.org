---
title: Props Computadas e Observadores
type: guide
order: 5
---

## Propriedades Computadas

Expressões dentro de templates são convenientes, mas elas deveriam ser utilizadas somente para operações. Templates são destinados para descrever a estrutura da sua view. Colocar muita lógica nos seus templates pode fazer que com eles fiquem inchados e com que a sua manutenção fique mais complicada. Por exemplo:

``` html
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```

Neste ponto, o template não é mais tão simples e declarativo. Você tem que olhá-lo por alguns segundos antes de entender que ele exibe a palavra `message`na ordem reversa. O problema é agravado quando se deseja incluir uma mensagem na ordem reversa em mais algum lugar do template.

É por isso que, para qualquer lógica mais complexa, você deve usar uma **propriedade calculada** (computed properties, no inglês).

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
    // um getter calculado (computed getter)
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
  <p>Mensagem Original: "{{ message }}"</p>
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

Aqui nós declaramos uma propriedade calculada `reversedMessage`. A função

Here we have declared a computed property `reversedMessage`. A função que fornecemos será usada como uma função getter para a propriedade `vm.reversedMessage`.

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

Then we may have other computed properties that in turn depend on **A**. Without caching, we would be executing **A**’s getter many more times than necessary! In cases where you do not want caching, use métodos.

### Computed vs Watched Property

Vue does provide a more generic way to observe and react to data changes on a Vue instance: **watch properties**. When you have some data that needs to change based on some other data, it is tempting to overuse `watch` - especially if you are coming from an AngularJS background. However, it is often a better idea to use a computed property rather than an imperative `watch` callback. Consider this example:

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

The above code is imperative and repetitive. Compare it with a computed property version:

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

Much better, isn't it?

### Computed Setter

Computed properties are by default getter-only, but you can also provide a setter when you need it:

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

Now when you run `vm.fullName = 'John Doe'`, the setter will be invoked and `vm.firstName` and `vm.lastName` will be updated accordingly.

## Watchers

While computed properties are more appropriate in most cases, there are times when a custom watcher is necessary. That's why Vue provides a more generic way to react to data changes through the `watch` option. This is most useful when you want to perform asynchronous or expensive operations in response to changing data.

For example:

``` html
<div id="watch-example">
  <p>
    Ask a yes/no question:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
```

``` html
<!-- Since there is already a rich ecosystem of ajax libraries    -->
<!-- and collections of general-purpose utility methods, Vue core -->
<!-- is able to remain small by not reinventing them. This also   -->
<!-- gives you the freedom to just use what you're familiar with. -->
<script src="https://unpkg.com/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'I cannot give you an answer until you ask a question!'
  },
  watch: {
    // whenever question changes, this function will run
    question: function (newQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.getAnswer()
    }
  },
  methods: {
    // _.debounce is a function provided by lodash to limit how
    // often a particularly expensive operation can be run.
    // In this case, we want to limit how often we access
    // yesno.wtf/api, waiting until the user has completely
    // finished typing before making the ajax request. To learn
    // more about the _.debounce function (and its cousin
    // _.throttle), visit: https://lodash.com/docs#debounce
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (this.question.indexOf('?') === -1) {
          vm.answer = 'Questions usually contain a question mark. ;-)'
          return
        }
        vm.answer = 'Thinking...'
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = 'Error! Could not reach the API. ' + error
          })
      },
      // This is the number of milliseconds we wait for the
      // user to stop typing.
      500
    )
  }
})
</script>
```

Result:

{% raw %}
<div id="watch-example" class="demo">
  <p>
    Ask a yes/no question:
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
    answer: 'I cannot give you an answer until you ask a question!'
  },
  watch: {
    question: function (newQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.getAnswer()
    }
  },
  methods: {
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (this.question.indexOf('?') === -1) {
          vm.answer = 'Questions usually contain a question mark. ;-)'
          return
        }
        vm.answer = 'Thinking...'
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = 'Error! Could not reach the API. ' + error
          })
      },
      500
    )
  }
})
</script>
{% endraw %}

In this case, using the `watch` option allows us to perform an asynchronous operation (accessing an API), limit how often we perform that operation, and set intermediary states until we get a final answer. None of that would be possible with a computed property.

In addition to the `watch` option, you can also use the imperative [vm.$watch API](/api/#vm-watch).
