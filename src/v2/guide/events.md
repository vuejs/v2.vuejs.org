---
title: Manipulação de Eventos
type: guide
order: 9
---

## Escutando Eventos

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

## Métodos em Manipuladores

A lógica para muitos manipuladores de evento será mais complexa, assim manter seu JavaScript no valor do atributo `v-on` simplesmente não é viável. É por isso que `v-on` também pode aceitar o nome de um método que você gostaria de chamar.

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
      // `this` dentro de métodos aponta para a instância Vue
      alert('Olá ' + this.name + '!')
      // `event` é o evento DOM nativo
      if (event) {
        alert(event.target.tagName)
      }
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
      alert('Olá ' + this.name + '!')
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})
</script>
{% endraw %}

## Chamada Direta de Métodos

Ao invés de fazer uma ligação apenas ao nome de um método, também podemos chamar métodos com uma instrução JavaScript diretamente no `v-on`:

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

Às vezes, também precisamos acessar o evento original do DOM  em um manipulador com declaração local. Você pode passá-lo em um método usando a variável especial `$event`:

``` html
<button v-on:click="warn('Form cannot be submitted yet.', $event)">
  Enviar
</button>
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

É muito comum precisar chamar `event.preventDefault()` ou `event.stopPropagation()` em manipuladores de eventos. Embora possamos fazer isto facilmente dentro de métodos, seria melhor se os métodos pudessem lidar apenas com a lógica dos dados, ao invés de ter que lidar com detalhes de eventos DOM.

Para resolver esse problema, o Vue fornece **modificadores de evento** para `v-on`. É só se lembrar que modificadores são sufixos da diretiva, indicados após um ponto.

- `.stop`
- `.prevent`
- `.capture`
- `.self`
- `.once`

``` html
<!-- a propagação do evento click será interrompida -->
<a v-on:click.stop="doThis"></a>

<!-- o evento submit deixará de recarregar a página -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- modificadores podem ser encadeados -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- é possível utilizar apenas o modificador -->
<form v-on:submit.prevent></form>

<!-- usar modo de captura ao adicionar o evento -->
<!-- ou seja, um evento ocorrido em um elemento interno é tratato aqui mesmo -->
<div v-on:click.capture="doThis">...</div>

<!-- só aciona o manipulador se event.target é o próprio elemento -->
<!-- isto é, não aciona a partir de um elemento filho -->
<div v-on:click.self="doThat">...</div>
```

<p class="tip">A ordem importa quando estiver utilizando modificadores, pois o código relevante é gerado na mesma ordem em que forem informados. Desta forma, utilizar `@click.prevent.self` irá previnir **todos os clicks** inclusive em elementos filhos, enquanto `@click.self.prevent` irá previnir apenas clicks no próprio elemento.</p>

> Novo em 2.1.4

``` html
<!-- o evento click será disparado apenas uma vez -->
<a v-on:click.once="doThis"></a>
```

Diferente dos outros modificadores, que são exclusivos para eventos nativos, o modificador `.once` também pode ser usado em [eventos de componentes](components.html#Usando-v-on-com-Eventos-Personalizados). Se você ainda não leu sobre componentes, não se preocupe com isso neste momento.

## Modificadores de Tecla

Quando escutamos eventos do teclado, precisamos muitas vezes verificar a ocorrência de códigos de teclas comuns. O Vue também permite a adição de modificadores de tecla para `v-on` ao escutar eventos de teclado:

``` html
<!-- só chama vm.submit() quando o keyCode é 13 -->
<input v-on:keyup.13="submit">
```

Se lembrar do código de todas as teclas é uma chatice, então o Vue fornece apelidos para as teclas mais usadas:

``` html
<!-- igual o acima -->
<input v-on:keyup.enter="submit">

<!-- também funciona com abreviações -->
<input @keyup.enter="submit">
```

Lista completa dos apelidos de modificadores de tecla:

- enter
- tab
- delete (captura tanto teclas "Delete" e "Backspace")
- esc
- space
- up
- down
- left
- right

Se necessário, você pode [definir apelidos personalizados](../api/#keyCodes) através do objeto global `config.keyCodes`:

``` js
// habilita v-on:keyup.f1
Vue.config.keyCodes.f1 = 112
```

## Teclas Modificadoras

> Novo em 2.1.0

Você pode utilizar os modificadores a seguir para acionar eventos de _mouse_ ou teclado apenas quando o modificador correspondente estiver acionado:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

> Nota: Nos teclados Macintosh, meta é a tecla de comando (⌘). Nos teclados Windows, meta é a tecla Windows (⊞). Nos teclados Sun Microsystems, meta é marcada como um diamante sólido (◆). Em alguns teclados, especificamente em máquinas MIT e Lisp, como o teclado Knight e teclados space-cadet, meta é descritivamente marcada como “META”. Em teclados Symbolics, meta é descritivamente marcada como “META” ou “Meta”.

Por exemplo:

```html
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

<p class="tip">Observe que teclas modificadoras são diferentes de teclas comuns, e quando utilizadas com eventos `keyup`, precisam estar pressionadas quando o evento é emitido. Em outras palavras, `keyup.ctrl` só vai disparar se você soltar a tecla enquanto ainda estiver segurando `ctrl`. E não irá disparar se você soltar a tecla `ctrl` sozinha.</p>

### Modificadores de Mouse

> Novo em 2.2.0

- `.left`
- `.right`
- `.middle`

Estes modificadores restrigem o manipulador a eventos disparados por um botão específico do _mouse_.

## Por Que Escutas no HTML?

Você pode estar pensando que esta abordagem de escutas de evento viola as boas e velhas práticas sobre "separação de responsabilidades". Fique descansado - como todas as funções do manipulador de Vue e expressões são estritamente ligados a ViewModel que está manipulando o modo de exibição atual, essa abordagem não causará qualquer dificuldade de manutenção. Na verdade, há vários benefícios em usar `v-on` no _template_:

1. É mais fácil de localizar as implementações de função de manipulador dentro de seu código JS simplesmente deslizando o dedo sobre o _template_ HTML.

2. Como você não tem que manualmente anexar escutas a eventos em JS, seu código de ViewModel pode conter apenas a lógica pura e está livre de manipulação DOM. Isto torna mais fácil de testar.

3. Quando um ViewModel é destruído, todas escutas a eventos são removidas automaticamente. Você não precisa se preocupar em removê-los explicitamente.
