---
title: 'Efeitos de Transição'
type: guide
order: 13
---

## Visão Geral

Vue disponibiliza uma variedade de maneiras para a aplicação de efeitos de transição quando itens são inseridos, atualizados, ou removidos do DOM. Isto inclue ferramentas para:

- aplicar automaticamente as classes para as transições e animações CSS
- integrar bibliotecas de terceiros para animação CSS, como Animate.css
- utilizar JavaScript para manipular diretamente o DOM durante os hooks transitions (ganchos de transição)
- integrar bibliotecas de animação JavaScript de terceiros, como o Velocity.js

Nesta página, nós apenas falaremos sobre transições de entrada, saída, e de lista, mas você pode ver a próxima seção para [transição de estados](transitioning-state.html).

## Transição individual de Elementos/Componentes

Vue disponibiliza um componente encapsulador (wrapper) `transition` , permitindo que você adicione transição de entrada/saída para qualquer elemento ou componente dentro do seguinte contexto:

- Renderização condicional (usando `v-if`)
- Exibição condicional (usando `v-show`)
- Componentes dinâmicos
- Componentesde nós de raíz

Isto é o como um simples exemplo deve parecer em ação:

``` html
<div id="demo">
  <button v-on:click="show = !show">
    Alternar
  </button>
  <transition name="fade">
    <p v-if="show">olá</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
```

``` css
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
```

{% raw %}
<div id="demo">
  <button v-on:click="show = !show">
    Alternar
  </button>
  <transition name="demo-transition">
    <p v-if="show">olá</p>
  </transition>
</div>
<script>
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
</script>
<style>
.demo-transition-enter-active, .demo-transition-leave-active {
  transition: opacity .5s
}
.demo-transition-enter, .demo-transition-leave-to {
  opacity: 0
}
</style>
{% endraw %}

Quando um elemento dentro de um componente `transition` é inserido ou removido, eis o que acontece:

1. Vue irá automaticamente procurar se o elemento alvo tem transições CSS ou animações aplicadas. Caso positivo, as classes de transições CSS serão adicionadas/removidas nos momentos apropriados.

2. Se o componente de transição fornece [JavaScript hooks](#JavaScript-Hooks), estes ganchos (hooks) serão invocados nos momentos apropriados.

3. Se nenhuma transição/animação CSS é detectada e nenhum JavaScript hook é fornecido, as operações de inserção e/ou remoção no DOM serão executadas imediatamente no próximo frame (Nota: isto é uma animação de frame do browser, diferente do conceito de `nextTick` do Vue).

### Classes de Transição

Existem seis classes aplicadas para transição de entrada/saída.

1. `v-enter`: Inicia o estado de entrada. Aplicado antes do elemento ser inserido, removido depois de um frame.

2. `v-enter-active`: Ativa e termina o estado de entrada. Aplicado antes do elemento ser inserido, removido quando a transição/animação termina.

3. `v-enter-to`: **Disponível apenas nas versões >=2.1.8.** Estado final de entrada. Adicionado no frame após o elemento ser inserido (ao mesmo tempo que `v-enter` é removido), removido quando a transição/animação terminar.

4. `v-leave`: Ativa o estado de saída. Aplicado quando a transição de saída é acionada, removido depois de um frame.

5. `v-leave-active`: Estado ativo de saída. Aplicado duranto toda a fase de saída. Adicionado imediatamente quando a transição de saída é disparada, removido quando a transição/animação termina. Esta clase pode ser usada para definir a duração, atraso e a curva da transição de saída.

6. `v-leave-to`: **Disponível apenas nas versões >=2.1.8.** Estado final da saída. Adicionado um frame após a transição de saída for disparada (ao mesmo tempo que `v-leave` é removido), removida quando a transição/animação termina.

![Diagrama de Transição](/images/transition.png)

Cada uma destas classes serão prefixadas com o nome da transição. Aqui, o prefixo `v-` é padrão quando você utiliza o elemento `<transition>` sem nome. Se você, por exemplo, utilizar `<transition name="my-transition">` a classe `v-enter` seria, no entanto, `my-transition-enter`.

`v-enter-active` e `v-leave-active` permitem especificar diferentes progressões de curvas para transição de entrada/saída, a qual você verá um exemplo na seção seguinte.

### Transição CSS

Um dos tipos mais comum de transição utiliza CSS transitions. Segue um exemplo simples:

``` html
<div id="exemplo-1">
  <button @click="show = !show">
    Alterna renderização
  </button>
  <transition name="slide-fade">
    <p v-if="show">olá</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#exemplo-1',
  data: {
    show: true
  }
})
```

``` css
/* Animações de entrada e saída podem utilizar diferentes  */
/* funções de duração e de tempo.              */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
```

{% raw %}
<div id="exemplo-1" class="demo">
  <button @click="show = !show">
    Alterna renderização
  </button>
  <transition name="slide-fade">
    <p v-if="show">olá</p>
  </transition>
</div>
<script>
new Vue({
  el: '#exemplo-1',
  data: {
    show: true
  }
})
</script>
<style>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
{% endraw %}

### Animações CSS

Animações CSS são aplicadas da mesma forma que as transições CSS, sendo que a diferença é que `v-enter` não é removido imediatamente após o elemento ser inserido, mas sim no evento `animationend`.

Aqui segue um exemplo, omitindo as regras de prefixo CSS, por uma questão de brevidade:

``` html
<div id="exemplo-2">
  <button @click="show = !show">Alternar visualização</button>
  <transition name="bounce">
    <p v-if="show">Look at me!</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#exemplo-2',
  data: {
    show: true
  }
})
```

``` css
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
```

{% raw %}
<div id="exemplo-2" class="demo">
  <button @click="show = !show">Alternar visualização</button>
  <transition name="bounce">
    <p v-show="show">Olhe para mim!</p>
  </transition>
</div>

<style>
  .bounce-enter-active {
    -webkit-animation: bounce-in .5s;
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    -webkit-animation: bounce-in .5s reverse;
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  @-webkit-keyframes bounce-in {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
</style>
<script>
new Vue({
  el: '#exemplo-2',
  data: {
    show: true
  }
})
</script>
{% endraw %}

### Classes de Transição Customizada

Você também pode especificar uma classe de transição customizada fornecendo os seguintes atributos:

- `enter-class`
- `enter-active-class`
- `enter-to-class` (>= 2.1.8 only)
- `leave-class`
- `leave-active-class`
- `leave-to-class` (>= 2.1.8 only)

Estes irão sobrescrever os nomes convencionais das classes. Isso é especialmente útil quando você quer combinar o sistema de transição do Vue com outra biblioteca CSS de animação já existente. como  [Animate.css](https://daneden.github.io/animate.css/).

Aqui segue um exemplo:

``` html
<link href="https://unpkg.com/animate.css@3.5.1/animate.min.css" rel="stylesheet" type="text/css">

<div id="example-3">
  <button @click="show = !show">
    Alterna renderização
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">olá</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#exemplo-3',
  data: {
    show: true
  }
})
```

{% raw %}
<link href="https://unpkg.com/animate.css@3.5.1" rel="stylesheet" type="text/css">
<div id="exemplo-3" class="demo">
  <button @click="show = !show">
    Alterna renderização
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">olá</p>
  </transition>
</div>
<script>
new Vue({
  el: '#exemplo-3',
  data: {
    show: true
  }
})
</script>
{% endraw %}

### Usando Transição e Animação juntos

Vue necessida escutar eventos para que consiga saber quando uma transição acabou. Os eventos podem ser  `transitionend` ou `animationend`, dependendo do tipo de regra CSS aplicada. Se você utilizar apenas uma ou outra, Vue detectará automaticamente o tipo correto.  

No entanto, em alguns casos, você poderá usar os dois tipos em um só elemento, como por exemplo, ter uma animação CSS que será acionada pelo Vue, juntamente com um efeito de transição CSS acionado pelo hover. Nestes casos, você terá que declarar explicitamente o tipo de evento que você gostaria que o Vue utilizasse em um atributo `type`, com o valor `animation` ou `transition`.

### Duração Explícita de Transição

> Novo em 2.2.0

Na maioria dos casos, Vue consegue automaticamente detectar quando a animação terminou. Por padrão, Vue aguarda pelo primeiro evento `transitionend` ou `animationend` no elemento raiz da transição. Porém, nem sempre isso é o desejado - por exemplo, nós podemos ter uma transição coreografada onde alguns dos elementos filhos tem tempos diferentes em relação ao elemento raiz.

Nestes casos você pode especificar uma duração (em milisegundos) usando a propriedade `duration` no component `<transition>`:

``` html
<transition :duration="1000">...</transition>
```

Você também pode especificar valores separados para a duração de entrada e saída:

``` html
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

### JavaScript Hooks ( Ganchos JavaScript )

Você também pode definir os JavaScript hooks ( ganchos JavaScript ) nos atributos:

``` html
<transition
  v-on:before-enter="beforeEnter"
  v-on:enter="enter"
  v-on:after-enter="afterEnter"
  v-on:enter-cancelled="enterCancelled"

  v-on:before-leave="beforeLeave"
  v-on:leave="leave"
  v-on:after-leave="afterLeave"
  v-on:leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>
```

``` js
// ...
methods: {
  // --------
  // ENTRANDO
  // --------

  beforeEnter: function (el) {
    // ...
  },
  // o callback de finalização é opcional quando
  // utilizado em combinação com CSS
  enter: function (el, done) {
    // ...
    done()
  },
  afterEnter: function (el) {
    // ...
  },
  enterCancelled: function (el) {
    // ...
  },

  // --------
  // SAINDO
  // --------

  beforeLeave: function (el) {
    // ...
  },
  // o callback de finalização é opcional quando
  // utilizado em combinação com CSS
  leave: function (el, done) {
    // ...
    done()
  },
  afterLeave: function (el) {
    // ...
  },
  // leaveCancelled apenas disponível com v-show
  leaveCancelled: function (el) {
    // ...
  }
}
```

Estes ganchos (hooks) podem ser utilizados em combinação com transição/animação CSS ou sozinhos.

<p class="tip">Utilizando transição JavaScript apenas, **os callbacks `done` são necessários para os ganchos (hooks) `enter` e o `leave` **. Caso contrário, eles serão invocados de forma síncrona, e a transição terá seu fim imediato.</p>

<p class="tip">Para transição de JavaScript apenas, é uma boa ideia adicionar explicitamente `v-bind:css="false"` para que o Vue possa pular a detecção de CSS. Isso também previne que regras CSS interfiram acidentalmente na transição.</p>

Agora vamos analisar um exemplo. Segue uma simples transição JavaScript utilizando Velocity.js:

``` html
<!--
Velocity funciona muito parecido com o jQuery.animate e é uma excelente opção para animações JavaScript
-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="exemplo-4">
  <button @click="show = !show">
    Alternar
  </button>
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
    v-bind:css="false"
  >
    <p v-if="show">
      Demo
    </p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#exemplo-4',
  data: {
    show: false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
      Velocity(el, { fontSize: '1em' }, { complete: done })
    },
    leave: function (el, done) {
      Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      Velocity(el, {
        rotateZ: '45deg',
        translateY: '30px',
        translateX: '30px',
        opacity: 0
      }, { complete: done })
    }
  }
})
```

{% raw %}
<div id="exemplo-4" class="demo">
  <button @click="show = !show">
    Alternar
  </button>
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">
      Demo
    </p>
  </transition>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<script>
new Vue({
  el: '#exemplo-4',
  data: {
    show: false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.transformOrigin = 'left'
    },
    enter: function (el, done) {
      Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
      Velocity(el, { fontSize: '1em' }, { complete: done })
    },
    leave: function (el, done) {
      Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      Velocity(el, {
        rotateZ: '45deg',
        translateY: '30px',
        translateX: '30px',
        opacity: 0
      }, { complete: done })
    }
  }
})
</script>
{% endraw %}

## Transição na  Renderização Inicial

Se você quiser aplicar a transição na renderização inicial de um nó, basta adicionar o atributo `appear`:

``` html
<transition appear>
  <!-- ... -->
</transition>
```

Por padrão, isso utilizará a transição especificada para entrada e saída. Se você desejar, poderá ainda especificar classes CSS específicas:

``` html
<transition
  appear
  appear-class="custom-appear-class"
  appear-to-class="custom-appear-to-class" (>= 2.1.8 only)
  appear-active-class="custom-appear-active-class"
>
  <!-- ... -->
</transition>
```

e ganchos JavaScript customizados

``` html
<transition
  appear
  v-on:before-appear="customBeforeAppearHook"
  v-on:appear="customAppearHook"
  v-on:after-appear="customAfterAppearHook"
  v-on:appear-cancelled="customAppearCancelledHook"
>
  <!-- ... -->
</transition>
```

## Transição entre Elementos

Nós discutiremos sobre [transição entre Componentes](#Transitioning-Between-Components) em breve, mas você pode realizar transição entre elementos puros utilizando `v-if`/`v-else`. Uma das transições de dois elementos mais comum é entre um recipiente de lista e uma mensagem descrevendo uma lista vazia:

``` html
<transition>
  <table v-if="items.length > 0">
    <!-- ... -->
  </table>
  <p v-else>Desculpe, nenhum item encontrado.</p>
</transition>
```

Isso funciona bem, mas existe uma ressalva a qual precisamos estar atentos:

<p class="tip">Quando alternamos entre elementos com a **mesma tag**, você precisa informar o Vue que eles são elementos distintos por meio do atributo único `key`. Caso contrário, o compilador do Vue irá substituir apenas o conteúdo do elemento por questões de eficiência. Mesmo quando tecnicamente não necessário, **é considerado uma boa prática sempre utilizar o atributo `key` nos múltiplos itens dentro de um componente `<transition>`**</p>

Por exemplo:

``` html
<transition>
  <button v-if="isEditing" key="save">
    Salvar
  </button>
  <button v-else key="edit">
    Editar
  </button>
</transition>
```

Nestes casos você também poderá usar o atributo `key` para realizar transições entre diferentes estados de um mesmo elemento. Ao invés de utilizar `v-if` e `v-else`, o exemplo a seguir pode ser reescrito da seguinte forma:

``` html
<transition>
  <button v-bind:key="isEditing">
    {{ isEditing ? 'Salvar' : 'Editar' }}
  </button>
</transition>
```

Também é possível realizar transições entre qualquer número de elementos, utilizando múltiplos `v-if` ou vinculando um elemento único à uma propriedade dinâmica. Por exemplo:

``` html
<transition>
  <button v-if="docState === 'saved'" key="saved">
    Editar
  </button>
  <button v-if="docState === 'edited'" key="edited">
    Salvar
  </button>
  <button v-if="docState === 'editing'" key="editing">
    Cancelar
  </button>
</transition>
```

Which could also be written as:

``` html
<transition>
  <button v-bind:key="docState">
    {{ buttonMessage }}
  </button>
</transition>
```

``` js
// ...
computed: {
  buttonMessage: function () {
    switch (docState) {
      case 'saved': return 'Editar'
      case 'edited': return 'Salvar'
      case 'editing': return 'Cancelar'
    }
  }
}
```

### Modos de Transição

Ainda temos um problema no entanto. Tente clicar no botão abaixo:

{% raw %}
<div id="no-mode-demo" class="demo">
  <transition name="no-mode-fade">
    <button v-if="on" key="on" @click="on = false">
      ligado
    </button>
    <button v-else key="off" @click="on = true">
      desligado
    </button>
  </transition>
</div>
<script>
new Vue({
  el: '#no-mode-demo',
  data: {
    on: false
  }
})
</script>
<style>
.no-mode-fade-enter-active, .no-mode-fade-leave-active {
  transition: opacity .5s
}
.no-mode-fade-enter, .no-mode-fade-leave-active {
  opacity: 0
}
</style>
{% endraw %}

Por estarem transicionando entre o botão "ligar" e o botão "desligar", ambos os botões são renderizados - uma transição sai enquanto a outra transição entra. Este é o comportamento padrão do `<transition>` - entrada e saída acontecem simultaneamente.

Às vezes isso funciona perfeitamente, como quando realizamos transições de itens que são absolutamente posicionados no topo uns dos outros:

{% raw %}
<div id="no-mode-absolute-demo" class="demo">
  <div class="no-mode-absolute-demo-wrapper">
    <transition name="no-mode-absolute-fade">
      <button v-if="on" key="on" @click="on = false">
        ligado
      </button>
      <button v-else key="off" @click="on = true">
        desligado
      </button>
    </transition>
  </div>
</div>
<script>
new Vue({
  el: '#no-mode-absolute-demo',
  data: {
    on: false
  }
})
</script>
<style>
.no-mode-absolute-demo-wrapper {
  position: relative;
  height: 18px;
}
.no-mode-absolute-demo-wrapper button {
  position: absolute;
}
.no-mode-absolute-fade-enter-active, .no-mode-absolute-fade-leave-active {
  transition: opacity .5s;
}
.no-mode-absolute-fade-enter, .no-mode-absolute-fade-leave-active {
  opacity: 0;
}
</style>
{% endraw %}

E também utilizar translate para que se pareça com uma transição slide:

{% raw %}
<div id="no-mode-translate-demo" class="demo">
  <div class="no-mode-translate-demo-wrapper">
    <transition name="no-mode-translate-fade">
      <button v-if="on" key="on" @click="on = false">
        ligado
      </button>
      <button v-else key="off" @click="on = true">
        desligado
      </button>
    </transition>
  </div>
</div>
<script>
new Vue({
  el: '#no-mode-translate-demo',
  data: {
    on: false
  }
})
</script>
<style>
.no-mode-translate-demo-wrapper {
  position: relative;
  height: 18px;
}
.no-mode-translate-demo-wrapper button {
  position: absolute;
}
.no-mode-translate-fade-enter-active, .no-mode-translate-fade-leave-active {
  transition: all 1s;
}
.no-mode-translate-fade-enter, .no-mode-translate-fade-leave-active {
  opacity: 0;
}
.no-mode-translate-fade-enter {
  transform: translateX(31px);
}
.no-mode-translate-fade-leave-active {
  transform: translateX(-31px);
}
</style>
{% endraw %}

No entanto, transição de entrada e saída simultânea nem sempre são desejadas, neste caso, o Vue oferece uma alternativa **modos de transição**:

- `in-out`: Novo elemento realiza a transição de entrada primeiro, quando completada, o elemento atual realiza a transição de saída.

- `out-in`: Elemento atual realiza a transição de saída primeiro, quando completada, o novo elemento realiza a transição de entrada.

Agora vamos atualizar a transição para os nossos botões ligar/desligar com `out-in`:

``` html
<transition name="fade" mode="out-in">
  <!-- ... the buttons ... -->
</transition>
```

{% raw %}
<div id="with-mode-demo" class="demo">
  <transition name="with-mode-fade" mode="out-in">
    <button v-if="on" key="on" @click="on = false">
      ligar
    </button>
    <button v-else key="off" @click="on = true">
      desligar
    </button>
  </transition>
</div>
<script>
new Vue({
  el: '#with-mode-demo',
  data: {
    on: false
  }
})
</script>
<style>
.with-mode-fade-enter-active, .with-mode-fade-leave-active {
  transition: opacity .5s
}
.with-mode-fade-enter, .with-mode-fade-leave-active {
  opacity: 0
}
</style>
{% endraw %}

Com a adição de um simples atributo, nós corrigimos nossa transição original sem a necessidade de adicionar nenhum estilo especial.

O modo `in-out` não é utilizado com frequência, mas às vezes pode ser útil para um efeito de transição ligeiramente diferente. Vamos tentar combiná-lo com a transição slide-fade que trabalhamos anteriormente:

{% raw %}
<div id="in-out-translate-demo" class="demo">
  <div class="in-out-translate-demo-wrapper">
    <transition name="in-out-translate-fade" mode="in-out">
      <button v-if="on" key="on" @click="on = false">
        ligado
      </button>
      <button v-else key="off" @click="on = true">
        desligado
      </button>
    </transition>
  </div>
</div>
<script>
new Vue({
  el: '#in-out-translate-demo',
  data: {
    on: false
  }
})
</script>
<style>
.in-out-translate-demo-wrapper {
  position: relative;
  height: 18px;
}
.in-out-translate-demo-wrapper button {
  position: absolute;
}
.in-out-translate-fade-enter-active, .in-out-translate-fade-leave-active {
  transition: all .5s;
}
.in-out-translate-fade-enter, .in-out-translate-fade-leave-active {
  opacity: 0;
}
.in-out-translate-fade-enter {
  transform: translateX(31px);
}
.in-out-translate-fade-leave-active {
  transform: translateX(-31px);
}
</style>
{% endraw %}

Bem legal, certo?

## Transições Entre Componentes

Transições entre Componentes é ainda mais simples - nós não precisamos do atributo `key`.
Nós apenas o encapsulamos em um [componente dinâmico](components.html#Dynamic-Components):

``` html
<transition name="component-fade" mode="out-in">
  <component v-bind:is="view"></component>
</transition>
```

``` js
new Vue({
  el: '#transition-components-demo',
  data: {
    view: 'v-a'
  },
  components: {
    'v-a': {
      template: '<div>Component A</div>'
    },
    'v-b': {
      template: '<div>Component B</div>'
    }
  }
})
```

``` css
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active for <2.1.8 */ {
  opacity: 0;
}
```

{% raw %}
<div id="transition-components-demo" class="demo">
  <input v-model="view" type="radio" value="v-a" id="a" name="view"><label for="a">A</label>
  <input v-model="view" type="radio" value="v-b" id="b" name="view"><label for="b">B</label>
  <transition name="component-fade" mode="out-in">
    <component v-bind:is="view"></component>
  </transition>
</div>
<style>
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to {
  opacity: 0;
}
</style>
<script>
new Vue({
  el: '#transition-components-demo',
  data: {
    view: 'v-a'
  },
  components: {
    'v-a': {
      template: '<div>Componente A</div>'
    },
    'v-b': {
      template: '<div>Componente B</div>'
    }
  }
})
</script>
{% endraw %}

## Lista de Transições

Até agora, nós temos transições para:

- Nós individuais
- Múltiplos nós onde apenas 1 é renderizado por vez

Então que tal ter uma lista de itens e renderizá-los simultaneamente com o `v-for`, por exemplo? Neste caso, utilizaremos o componente `<transition-group>`. Antes de entrarmos em um exemplo, existem algumas coisas que são importantes saber sobre este componente:

- Diferentemente do `<transition>`, ele renderiza um elemento por padrão: o `<span>`. Você pode mudar o elemento que é renderizado com o atributo `tag`.
- Elementos dentro são **sempre necessários** que tenham um atributo `key` único.

### Transição de Entrada/Saída de Lista

Agora vamos analisar um exemplo simples, utilizando as mesmas classes CSS que utilizamos anteriormente para transições de entrada e saída:

``` html
<div id="list-demo" class="demo">
  <button v-on:click="add">Adicionar</button>
  <button v-on:click="remove">Remover</button>
  <transition-group name="list" tag="p">
    <span v-for="item in items" v-bind:key="item" class="list-item">
      {{ item }}
    </span>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
  }
})
```

``` css
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
```

{% raw %}
<div id="list-demo" class="demo">
  <button v-on:click="add">Adicionar</button>
  <button v-on:click="remove">Remover</button>
  <transition-group name="list" tag="p">
    <span v-for="item in items" :key="item" class="list-item">
      {{ item }}
    </span>
  </transition-group>
</div>
<script>
new Vue({
  el: '#list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
  }
})
</script>
<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
{% endraw %}

Existe um problema com este exemplo. Quando você adiciona ou remove um item, aqueles em torno dele se encaixam instantaneamente ao invés de fazer a transição suavemente. Nós iremos corrigir isto mais tarde.

### Transições de Movimento de Lista

O componente `<transition-group>` tem outro truque na manga. Ele não só tem animação de entrada e saída, como também na mudança de posição. O único conceito novo que você precisa saber para usar esta feature é a adição de **da classe `v-move`**, a qual é inserida quando os itens estão mudando suas posições. Assim como outras classes, elas serão prefixadas com o valor fornecido pelo atributo `name` e você poderá especificar manualmente uma classe com o atributo `move-class`.

Esta classe é útil para especificar o tempo de transição ou a suavidade da curva, como você pode ver adiante:

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>

<div id="flip-list-demo" class="demo">
  <button v-on:click="shuffle">Misturar</button>
  <transition-group name="flip-list" tag="ul">
    <li v-for="item in items" v-bind:key="item">
      {{ item }}
    </li>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#flip-list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9]
  },
  methods: {
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
```

``` css
.flip-list-move {
  transition: transform 1s;
}
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>
<div id="flip-list-demo" class="demo">
  <button v-on:click="shuffle">Misturar</button>
  <transition-group name="flip-list" tag="ul">
    <li v-for="item in items" :key="item">
      {{ item }}
    </li>
  </transition-group>
</div>
<script>
new Vue({
  el: '#flip-list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9]
  },
  methods: {
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
</script>
<style>
.flip-list-move {
  transition: transform 1s;
}
</style>
{% endraw %}

Isto pode parecer mágica, mas por trás das cortinas, Vue está apenas utilizando uma simples técnica de animação chamada  [FLIP](https://aerotwist.com/blog/flip-your-animations/) para realizar a transição suave da posição antiga para a posição atual dos elementos, utilizando transforms.

Nós podemos combinar esta técnica com a nossa implementação anterior para animar qualquer mudança na nossa lista!

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>

<div id="list-complete-demo" class="demo">
  <button v-on:click="shuffle">Misturar</button>
  <button v-on:click="add">Adicionar</button>
  <button v-on:click="remove">Remover</button>
  <transition-group name="list-complete" tag="p">
    <span
      v-for="item in items"
      v-bind:key="item"
      class="list-complete-item"
    >
      {{ item }}
    </span>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#list-complete-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
```

``` css
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>
<div id="list-complete-demo" class="demo">
  <button v-on:click="shuffle">Misturar</button>
  <button v-on:click="add">Adicionar</button>
  <button v-on:click="remove">Remover</button>
  <transition-group name="list-complete" tag="p">
    <span v-for="item in items" :key="item" class="list-complete-item">
      {{ item }}
    </span>
  </transition-group>
</div>
<script>
new Vue({
  el: '#list-complete-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
</script>
<style>
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
{% endraw %}

<p class="tip">É importante notar que as transições FLIP não funcionam com elementos `display: inline`. Como alternativa, você pode usar `display: inline-block` ou colocar os elementos dentro de um contexto flex.</p>

Estas animações FLIP também não são limitadas à um único eixo. Itens em um grid multidimensional pode ser transicionados [facilmente](https://jsfiddle.net/chrisvfritz/sLrhk1bc/):

{% raw %}
<div id="sudoku-demo" class="demo">
  <strong>Sudoku para preguiçosos</strong>
  <p>Clique no botão misturar até ganhar.</p>
  <button @click="shuffle">
    Misturar
  </button>
  <transition-group name="cell" tag="div" class="sudoku-container">
    <div v-for="cell in cells" :key="cell.id" class="cell">
      {{ cell.number }}
    </div>
  </transition-group>
</div>
<script>
new Vue({
  el: '#sudoku-demo',
  data: {
    cells: Array.apply(null, { length: 81 })
      .map(function (_, index) {
        return {
          id: index,
          number: index % 9 + 1
        }
      })
  },
  methods: {
    shuffle: function () {
      this.cells = _.shuffle(this.cells)
    }
  }
})
</script>
<style>
.sudoku-container {
  display: flex;
  flex-wrap: wrap;
  width: 238px;
  margin-top: 10px;
}
.cell {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 25px;
  height: 25px;
  border: 1px solid #aaa;
  margin-right: -1px;
  margin-bottom: -1px;
}
.cell:nth-child(3n) {
  margin-right: 0;
}
.cell:nth-child(27n) {
  margin-bottom: 0;
}
.cell-move {
  transition: transform 1s;
}
</style>
{% endraw %}

### Escalonamento de Transições de Lista

Ao comunicar com transições JavaScript por meio de atributos de dados, também é possível escalonar as transições em uma lista:

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="staggered-list-demo">
  <input v-model="query">
  <transition-group
    name="staggered-fade"
    tag="ul"
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <li
      v-for="(item, index) in computedList"
      v-bind:key="item.msg"
      v-bind:data-index="index"
    >{{ item.msg }}</li>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#staggered-list-demo',
  data: {
    query: '',
    list: [
      { msg: 'Bruce Lee' },
      { msg: 'Jackie Chan' },
      { msg: 'Chuck Norris' },
      { msg: 'Jet Li' },
      { msg: 'Kung Fury' }
    ]
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    }
  }
})
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<div id="example-5" class="demo">
  <input v-model="query">
  <transition-group
    name="staggered-fade"
    tag="ul"
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <li
      v-for="(item, index) in computedList"
      v-bind:key="item.msg"
      v-bind:data-index="index"
    >{{ item.msg }}</li>
  </transition-group>
</div>
<script>
new Vue({
  el: '#example-5',
  data: {
    query: '',
    list: [
      { msg: 'Bruce Lee' },
      { msg: 'Jackie Chan' },
      { msg: 'Chuck Norris' },
      { msg: 'Jet Li' },
      { msg: 'Kung Fury' }
    ]
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    }
  }
})
</script>
{% endraw %}

## Transições Reutilizáveis

Transições podem ser reutilizadas por meio do sistema de componentes do Vue. Para criar uma transição reutilizável, tudo o que você precisa fazer é inserir um componente `<transition>` ou `<transition-group>` em sua raíz, e então adicionar qualquer child dentro do componente de transição.

Aqui segue um exemplo utilizando um modelo de componente:

``` js
Vue.component('my-special-transition', {
  template: '\
    <transition\
      name="very-special-transition"\
      mode="out-in"\
      v-on:before-enter="beforeEnter"\
      v-on:after-enter="afterEnter"\
    >\
      <slot></slot>\
    </transition>\
  ',
  methods: {
    beforeEnter: function (el) {
      // ...
    },
    afterEnter: function (el) {
      // ...
    }
  }
})
```

E componentes funcionais são especialmente bem adequado para esta tarefa:

``` js
Vue.component('my-special-transition', {
  functional: true,
  render: function (createElement, context) {
    var data = {
      props: {
        name: 'very-special-transition'
        mode: 'out-in'
      },
      on: {
        beforeEnter: function (el) {
          // ...
        },
        afterEnter: function (el) {
          // ...
        }
      }
    }
    return createElement('transition', data, context.children)
  }
})
```

## Transições Dinâmicas

Sim, até as transições no Vue são orientadas a dados (data-driven)! O exemplo mais básico de uma transição dinâmica vincula o atributo `name` à uma propriedade dinâmica.

```html
<transition v-bind:name="transitionName">
  <!-- ... -->
</transition>
```

Isto pode ser útil quando você define as transições/animações CSS utilizando as classes de transições do Vue e simplesmente queira alternar entre elas.

No entanto, qualquer atributo de transição pode ser vinculado de forma dinâmica. E não são apenas atributos. Já que os ganchos de eventos são apenas métodos, eles têm acesso a quaisquer dados no contexto. Isso significa que, dependendo do estado do seu componente, suas transições JavaScript podem se comportar de forma diferente.

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="dynamic-fade-demo">
  Fade In: <input type="range" v-model="fadeInDuration" min="0" v-bind:max="maxFadeDuration">
  Fade Out: <input type="range" v-model="fadeOutDuration" min="0" v-bind:max="maxFadeDuration">
  <transition
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">olá</p>
  </transition>
  <button v-on:click="stop = true">Pare!</button>
</div>
```

``` js
new Vue({
  el: '#dynamic-fade-demo',
  data: {
    show: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
    maxFadeDuration: 1500,
    stop: false
  },
  mounted: function () {
    this.show = false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 1 },
        {
          duration: this.fadeInDuration,
          complete: function () {
            done()
            if (!vm.stop) vm.show = false
          }
        }
      )
    },
    leave: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 0 },
        {
          duration: this.fadeOutDuration,
          complete: function () {
            done()
            vm.show = true
          }
        }
      )
    }
  }
})
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<div id="dynamic-fade-demo" class="demo">
  Fade In: <input type="range" v-model="fadeInDuration" min="0" v-bind:max="maxFadeDuration">
  Fade Out: <input type="range" v-model="fadeOutDuration" min="0" v-bind:max="maxFadeDuration">
  <transition
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">olá</p>
  </transition>
  <button v-on:click="stop = true">Pare!</button>
</div>
<script>
new Vue({
  el: '#dynamic-fade-demo',
  data: {
    show: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
    maxFadeDuration: 1500,
    stop: false
  },
  mounted: function () {
    this.show = false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 1 },
        {
          duration: this.fadeInDuration,
          complete: function () {
            done()
            if (!vm.stop) vm.show = false
          }
        }
      )
    },
    leave: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 0 },
        {
          duration: this.fadeOutDuration,
          complete: function () {
            done()
            vm.show = true
          }
        }
      )
    }
  }
})
</script>
{% endraw %}

Finalmente, a última forma para a criação de transições dinâmicas é por meio de componentes que aceitam que os props possam mudar a natureza da transição a ser utilizada. Pode parecer clichê, mas o único limite é sua imaginação.
