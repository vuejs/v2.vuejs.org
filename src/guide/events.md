---
title: Manipulação de Eventos
type: guide
order: 9
---

## Ouvindo Eventos

Você pode usar a diretiva `v-on` para escutar eventos do DOM e rodar algum JavaScript quando tal evento for disparado.

Por exemplo:

``` html
<div id="example-1">
  <button v-on:click="counter += 1">Add 1</button>
  <p>The button above has been clicked {{ counter }} times.</p>
</div>
```
``` js
var example1 = new Vue({
  el: '#example-1',
  data: {
    counter: 0
  }
})
```

Resultado:

{% raw %}
<div id="example-1" class="demo">
  <button v-on:click="counter += 1">Add 1</button>
  <p>The button above has been clicked {{ counter }} times.</p>
</div>
<script>
var example1 = new Vue({
  el: '#example-1',
  data: {
    counter: 0
  }
})
</script>
{% endraw %}

## Métodos Manipuladores de Eventos.

A lógica para muitos manipuladores de evento é mais complexa, assim manter seu JavaScript no valor do atributo `v-on` simplesmente não é viável. É por isso que `v-on` também pode aceitar o nome de um método que você gostaria de chamar.

Por exemplo:

``` html
<div id="example-2">
  <!-- `greet` is the name of a method defined below -->
  <button v-on:click="greet">Greet</button>
</div>
```

``` js
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  // define methods under the `methods` object
  methods: {
    greet: function (event) {
      // `this` inside methods points to the Vue instance
      alert('Hello ' + this.name + '!')
      // `event` is the native DOM event
      alert(event.target.tagName)
    }
  }
})

// you can invoke methods in JavaScript too
example2.greet() // -> 'Hello Vue.js!'
```

Resultado:

{% raw %}
<div id="example-2" class="demo">
  <button v-on:click="greet">Greet</button>
</div>
<script>
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  methods: {
    greet: function (event) {
      alert('Hello ' + this.name + '!')
      alert(event.target.tagName)
    }
  }
})
</script>
{% endraw %}

## Métodos em Manipuladores de Eventos Inline

Em vez de fazer uma ligação ao nome de um método, também podemos usar métodos em uma instrução JavaScript inline:

``` html
<div id="example-3">
  <button v-on:click="say('hi')">Say hi</button>
  <button v-on:click="say('what')">Say what</button>
</div>
```
``` js
new Vue({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
```

Resultado:
{% raw %}
<div id="example-3" class="demo">
  <button v-on:click="say('hi')">Say hi</button>
  <button v-on:click="say('what')">Say what</button>
</div>
<script>
new Vue({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
</script>
{% endraw %}

Às vezes, também precisamos acessar o evento original do DOM  em um manipulador com declaração inline. Você pode passá-lo em um método usando a variável especial `$event`:

``` html
<button v-on:click="warn('Form cannot be submitted yet.', $event)">Submit</button>
```

``` js
// ...
methods: {
  warn: function (message, event) {
    // now we have access to the native event
    if (event) event.preventDefault()
    alert(message)
  }
}
```

## Modificadores de Evento

É muito comum precisar chamar `event.preventDefault()` ou `Event` dentro de manipuladores de eventos. Embora possamos fazer isto facilmente dentro de métodos, seria melhor se os métodos pudessem lidas apenas com a lógica dos dados, ao invés de ter que lidar com detalhes de evento DOM.

Para resolver esse problema, o Vue fornece **modificadores de evento** para 'v-on'. Lembre-se que modificadores são sufixos da directiva indicados por um ponto.

- `.stop`
- `.prevent`
- `.capture`
- `.self`

``` html
<!-- the click event's propagation will be stopped -->
<a v-on:click.stop="doThis"></a>

<!-- the submit event will no longer reload the page -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- modifiers can be chained -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- just the modifier -->
<form v-on:submit.prevent></form>

<!-- use capture mode when adding the event listener -->
<div v-on:click.capture="doThis">...</div>

<!-- only trigger handler if event.target is the element itself -->
<!-- i.e. not from a child element -->
<div v-on:click.self="doThat">...</div>
```

## Modificadores de Tecla

Quando escutamos eventos do teclado, precisamos muitas vezes verificar se há códigos de teclas comuns. O Vue também permite a adição de modificadores de tecla para 'v-on' quando escuta  eventos de tecla:

``` html
<!-- only call vm.submit() when the keyCode is 13 -->
<input v-on:keyup.13="submit">
```

Lembrar o código de todas as teclas é uma chatice, então o Vue fornece aliases para as teclas mais comumente usadas:

``` html
<!-- same as above -->
<input v-on:keyup.enter="submit">

<!-- also works for shorthand -->
<input @keyup.enter="submit">
```

Aqui está a lista completa dos aliases de modificadores de tecla:

- enter
- tab
- delete (pega ambas as teclas, "Delete" e "Backspace" )
- esc
- space
- up
- down
- left
- right

Aliases de tecla única também são suportados.


``` html
<input v-on:keyup.v="say('That is the first letter in Vue')">
```

Se necessário, você pode até mesmo definir aliases personalizados para modificadores de tecla:

``` js
// enable v-on:keyup.f1
Vue.config.keyCodes.f1 = 112
```

## Por que Listeners in HTML?

Você pode estar pensando que esta abordagem de escuta de evento viola as boas e velhas práticas sobre "separação de objetivos". Fique descansado - como todas as funções do manipulador de Vue e expressões são estritamente ligados a ViewModel que está manipulando o modo de exibição atual, essa abordagem não causará qualquer dificuldade de manutenção. Na verdade, há vários benefícios em usar `v-on`:

1. É mais fácil de localizar as implementações de função de manipulador dentro de seu código JS simplesmente deslizando o dedo sobre o template HTML.

2. Como você não tem que manualmente anexar  event listeners em JS, seu código de ViewModel pode conter apenas a lógica pura e  está livre de DOM. Isto torna mais fácil de testar.

3. Quando um ViewModel é destruído, todos os event listeners são removidos automaticamente. Você não precisa se preocupar em removê-los explicitamente.
