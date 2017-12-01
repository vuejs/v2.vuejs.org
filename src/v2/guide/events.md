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
  <p>Quantas vezes o botão acima foi clicado: {{ counter }}</p>
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
  <p>Quantas vezes o botão acima foi clicado: {{ counter }}</p>
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

A lógica para muitos manipuladores de evento será mais complexa, sendo assim manter diretamente código JavaScript no valor do atributo `v-on` não é viável. É por isso que `v-on` também pode aceitar o nome de um método que você gostaria de chamar.

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
example2.greet() // => 'Olá Vue.js!'
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
  <button v-on:click="say('tchau')">Diga tchau</button>
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
  <button v-on:click="say('tchau')">Diga tchau</button>
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

Às vezes, também precisamos acessar o evento original do DOM em um manipulador. Você pode passá-lo a um método usando a variável especial `$event`:

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

<p class="tip">A ordem importa quando utilizar modificadores, pois o código é gerado na mesma ordem. Desta forma, `@click.prevent.self` irá previnir **todos os cliques**, enquanto `@click.self.prevent` irá previnir apenas cliques no próprio elemento.</p>

> Novo em 2.1.4+

``` html
<!-- o evento click será disparado apenas uma vez -->
<a v-on:click.once="doThis"></a>
```

Diferente dos outros modificadores, exclusivos para eventos nativos, o `.once` também pode ser usado em [eventos de componentes](components.html#Usando-v-on-com-Eventos-Personalizados). Se você ainda não leu sobre componentes, não se preocupe com isso neste momento.

## Modificadores de Teclado

Quando escutamos eventos do teclado, precisamos muitas vezes verificar a ocorrência de códigos de teclas comuns. O Vue também permite a adição de modificadores `v-on` ao escutar eventos de teclado:

``` html
<!-- só chama `vm.submit()` quando o `keyCode` é 13 -->
<input v-on:keyup.13="submit">
```

Se lembrar de todos os `keyCode` é uma chatice, então o Vue fornece apelidos para as teclas mais usadas:

``` html
<!-- igual o acima -->
<input v-on:keyup.enter="submit">

<!-- também funciona com abreviações -->
<input @keyup.enter="submit">
```

Lista completa dos apelidos de modificadores de tecla:

- `.enter`
- `.tab`
- `.delete` (captura tanto "Delete" quanto "Backspace")
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

Se necessário, defina [apelidos personalizados](../api/#keyCodes) através do objeto global `config.keyCodes`:

``` js
// habilita `v-on:keyup.f1`
Vue.config.keyCodes.f1 = 112
```

### Modificadores de Tecla Automáticos

> Novo em 2.5.0+

Você também pode diretamente utilizar qualquer nome de chave válido exposto via [`KeyboardEvent.key`](https://developer.mozilla.org/pt-BR/docs/Web/API/KeyboardEvent/key/Key_Values) como modificador convertendo-o para _kebab-case_:

``` html
<input @keyup.page-down="onPageDown">
```

No exemplo acima, o gatilho será chamado se `$event.key === 'PageDown'`.

<p class="tip">Algumas teclas (`.esc` e teclas de setas) tem valores `key` inconsistentes no IE9, os apelidos pré-definidos do Vue devem ser preferidos se você precisar suportar IE9.</p>

## Teclas Modificadoras de Sistema

> Novo em 2.1.0+

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

<p class="tip">Teclas modificadoras são diferentes de teclas comuns, e quando utilizadas com eventos `keyup`, precisam estar pressionadas quando o evento é emitido. Em outras palavras, `keyup.ctrl` só vai disparar se você soltar alguma tecla enquanto ainda estiver segurando `ctrl`. E não irá disparar se você soltar a tecla `ctrl` sozinha.</p>

### Modificar `.exact`

> Novo em 2.5.0+

O modificador `.exact` mdeve ser utilizado combinado com outros modificadores de sistema para indicar que aquela combinação exata de modificadores deve ser pressionada para que o gatilho dispare.

``` html
<!-- irá disparar mesmo se Alt ou Shift também estiverem pressionados -->
<button @click.ctrl="onClick">A</button>

<!-- irá disparar somente quando Ctrl estiver pressionado -->
<button @click.ctrl.exact="onCtrlClick">A</button>
```

### Modificadores de Mouse

> Novo em 2.2.0+

- `.left`
- `.right`
- `.middle`

Estes modificadores restrigem o manipulador a eventos disparados por um botão específico do _mouse_, respectivamente o botão da esqueda, o da direita e o central (quando existente).

## Por Que Escutas no HTML?

Você pode estar pensando que esta abordagem de escutas de evento viola as boas e velhas práticas sobre "separação de responsabilidades". Fique tranquilo - como todas as funções de manipuladores e expressões Vue são estritamente ligadas ao _ViewModel_ que está manipulando o modo de exibição atual, essa abordagem não causará qualquer dificuldade de manutenção. Na verdade, há vários benefícios em usar `v-on` no _template_:

1. É mais fácil localizar as implementações de função de manipulador dentro de seu código JS deslizando sobre o _template_ HTML.

2. Como você não tem que manualmente anexar escutas a eventos em JS, seu código de _ViewModel_ pode conter apenas a lógica pura e está livre de manipulação DOM. Isto torna mais fácil de testar.

3. Quando um _ViewModel_ é destruído, todas escutas a eventos são removidas automaticamente. Você não precisa se preocupar em removê-las explicitamente.
