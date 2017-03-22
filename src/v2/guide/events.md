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
  <button v-on:click="counter += 1">Adiciona 1</button>
  <p>O botão acima foi clicado {{ counter }} vezes.</p>
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
  <button v-on:click="counter += 1">Adiciona 1</button>
  <p>O botão acima foi clicado {{ counter }} vezes.</p>
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
  <!-- `greet` é o nome de um método definido abaixo -->
  <button v-on:click="greet">Cumprimentar</button>
</div>
```

``` js
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  // define métodos dentro do objeto `methods`
  methods: {
    greet: function (event) {
<<<<<<< HEAD:src/guide/events.md
      // `this` dentro de métodos aponta para a instância Vue
      alert('Olá ' + this.name + '!')
      // `event` é o evento DOM nativo
      alert(event.target.tagName)
=======
      // `this` inside methods points to the Vue instance
      alert('Hello ' + this.name + '!')
      // `event` is the native DOM event
      if (event) {
        alert(event.target.tagName)
      }
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/events.md
    }
  }
})

// você pode invocar métodos no JavaScript também
example2.greet() // -> 'Olá Vue.js!'
```

Resultado:

{% raw %}
<div id="example-2" class="demo">
  <button v-on:click="greet">Cumprimentar</button>
</div>
<script>
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  methods: {
    greet: function (event) {
<<<<<<< HEAD:src/guide/events.md
      alert('Olá ' + this.name + '!')
      alert(event.target.tagName)
=======
      alert('Hello ' + this.name + '!')
      if (event) {
        alert(event.target.tagName)
      }
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/events.md
    }
  }
})
</script>
{% endraw %}

## Métodos em Manipuladores de Eventos Inline

Em vez de fazer uma ligação ao nome de um método, também podemos usar métodos em uma instrução JavaScript inline:

``` html
<div id="example-3">
  <button v-on:click="say('oi')">Diga oi</button>
  <button v-on:click="say('que')">Diga que</button>
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
  <button v-on:click="say('oi')">Diga oi</button>
  <button v-on:click="say('que')">Diga que</button>
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
<button v-on:click="warn('Form cannot be submitted yet.', $event)">Enviar</button>
```

``` js
// ...
methods: {
  warn: function (message, event) {
    // agora temos acesso ao evento nativo
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
- `.once`

``` html
<!-- a propagação do evento clique será interrompida -->
<a v-on:click.stop="doThis"></a>

<!-- o evento submit deixará de recarregar a página -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- modificadores podem ser encadeadas -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- apenas o modificador -->
<form v-on:submit.prevent></form>

<!-- usar modo de captura ao adicionar o event listener -->
<div v-on:click.capture="doThis">...</div>

<!-- só aciona o manipulador se event.target é o próprio elemento -->
<!-- isto é, não a partir de um elemento filho -->
<div v-on:click.self="doThat">...</div>
```

<<<<<<< HEAD:src/guide/events.md
## Modificadores de Tecla
=======
> New in 2.1.4

``` html
<!-- the click event will be triggered at most once -->
<a v-on:click.once="doThis"></a>
```

Unlike the other modifiers, which are exclusive to native DOM events, the `.once` modifier can also be used on [component events](components.html#Using-v-on-with-Custom-Events). If you haven't read about components yet, don't worry about this for now.

## Key Modifiers
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/events.md

Quando escutamos eventos do teclado, precisamos muitas vezes verificar se há códigos de teclas comuns. O Vue também permite a adição de modificadores de tecla para 'v-on' quando escuta  eventos de tecla:

``` html
<!-- só chama vm.submit() quando o keyCode é 13 -->
<input v-on:keyup.13="submit">
```

Lembrar o código de todas as teclas é uma chatice, então o Vue fornece aliases para as teclas mais comumente usadas:

``` html
<!-- igual o acima -->
<input v-on:keyup.enter="submit">

<!-- também funciona com abreviações -->
<input @keyup.enter="submit">
```

Aqui está a lista completa dos aliases de modificadores de tecla:

<<<<<<< HEAD:src/guide/events.md
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
<input v-on:keyup.v="say('Essa é a primeira letra de Vue')">
```

Se necessário, você pode até mesmo definir aliases personalizados para modificadores de tecla:
=======
- `.enter`
- `.tab`
- `.delete` (captures both "Delete" and "Backspace" keys)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

You can also [define custom key modifier aliases](../api/#keyCodes) via the global `config.keyCodes` object:
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/events.md

``` js
// Permitir v-on:keyup.f1
Vue.config.keyCodes.f1 = 112
```

<<<<<<< HEAD:src/guide/events.md
## Por que Listeners in HTML?
=======
## Modifier Keys

> New in 2.1.0

You can use the following modifiers to trigger mouse or keyboard event listeners only when the corresponding modifier key is pressed:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

> Note: On Macintosh keyboards, meta is the command key (⌘). On Windows keyboards, meta is the windows key (⊞). On Sun Microsystems keyboards, meta is marked as a solid diamond (◆). On certain keyboards, specifically MIT and Lisp machine keyboards and successors, such as the Knight keyboard, space-cadet keyboard, meta is labeled “META”. On Symbolics keyboards, meta is labeled “META” or “Meta”.

For example:

```html
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

<p class="tip">Note that modifier keys are different from regular keys and when used with `keyup` events, they have to be pressed when the event is emitted. In other words, `keyup.ctrl` will only trigger if you release a key while holding down `ctrl`. It won't trigger if you release the `ctrl` key alone.</p>

### Mouse Button Modifiers

> New in 2.2.0

- `.left`
- `.right`
- `.middle`

These modifiers restrict the handler to events triggered by a specific mouse button.

## Why Listeners in HTML?
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/events.md

Você pode estar pensando que esta abordagem de escuta de evento viola as boas e velhas práticas sobre "separação de objetivos". Fique descansado - como todas as funções do manipulador de Vue e expressões são estritamente ligados a ViewModel que está manipulando o modo de exibição atual, essa abordagem não causará qualquer dificuldade de manutenção. Na verdade, há vários benefícios em usar `v-on`:

1. É mais fácil de localizar as implementações de função de manipulador dentro de seu código JS simplesmente deslizando o dedo sobre o template HTML.

2. Como você não tem que manualmente anexar  event listeners em JS, seu código de ViewModel pode conter apenas a lógica pura e  está livre de DOM. Isto torna mais fácil de testar.

3. Quando um ViewModel é destruído, todos os event listeners são removidos automaticamente. Você não precisa se preocupar em removê-los explicitamente.
