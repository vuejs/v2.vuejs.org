---
title: Gerenciamento de Estado
type: guide
order: 22
---

## Implementação Oficial Estilo Flux

Aplicações grandes podem também crescer em complexidade, principalmente devido a múltiplos dados de estado da aplicação espalhados entre diversos componentes e interações entre eles. Para resolver este problema, Vue oferece [vuex](https://github.com/vuejs/vuex): nossa própria biblioteca de gerenciamento de estado inspirada em Elm. Além disso, ela se integra ao [vue-devtools](https://github.com/vuejs/vue-devtools), permitindo viajar pelo histórico de mudanças de estado (*time travel*) sem precisar de nenhuma configuração adicional.

### Informação para Desenvolvedores React

Se você vem do React, é possível que esteja se perguntando como vuex se compara ao [redux](https://github.com/reactjs/redux), a mais popular implementação Flux naquele ecossistema. Redux é agnóstico em relação à camada *view*, podendo ser facilmente utilizado com Vue através de alguns [bindings simples](https://github.com/egoist/revue). Vuex é diferente, uma vez que ele **sabe** que está em uma aplicação Vue. Isto permite melhor integração com o Vue, oferecendo uma API mais intuitiva e uma experiência de desenvolvimento otimizada.

## Gerenciamento de Estado do Zero

Muitas vezes as pessoas se esquecem que a "fonte da verdade" em aplicações Vue são os próprios objetos `data` - uma instância Vue simplesmente faz uma referência a eles. Sendo assim, se você tiver um trecho de estado que deve ser compartilhado entre múltiplas instâncias, pode simplesmente compartilhar o mesmo objeto de dados:

``` js
const sourceOfTruth = {}

const vmA = new Vue({
  data: sourceOfTruth
})

const vmB = new Vue({
  data: sourceOfTruth
})
```

Agora, a qualquer momento que `sourceOfTruth` for modificado, tanto `vmA` quanto `vmB` atualizarão suas interfaces automaticamente. Subcomponentes dentro de cada uma destas instâncias também poderão acessar estes dados através de `this.$root.$data`. Temos, portanto, uma fonte da verdade única, mas depurar seria um pesadelo. Qualquer parte dos dados poderia ser modificada por qualquer parte da aplicação a qualquer momento, sem deixar nenhum rastro.

Para ajudar a resolver, podemos adotar um **store pattern** simples:

``` js
var store = {
  debug: true,
  state: {
    message: 'Hello!'
  },
  setMessageAction (newValue) {
    this.debug && console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    this.debug && console.log('clearMessageAction triggered')
    this.state.message = ''
  }
}
```


Observe que todas as ações que modificam o estado do *store* são colocadas dentro do próprio. Este tipo de gerenciamento de estado centralizado torna mais fácil compreender quais tipos de mutação poderiam acontecer e como poderiam ser disparadas. Se algo der errado, teremos registros no console sobre cada passo realizado para rastrearmos o *bug*.


Adicionalmente, cada instância/componente ainda pode gerenciar e manter seus próprios dados privados:

``` js
var vmA = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})

var vmB = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})
```

![State Management](/images/state.png)

<p class="tip">É importante observar que você nunca deveria substituir o objeto de estado original em suas ações - os componentes e o *store* precisam compartilhar a referência ao mesmo objeto para que as mutações possam ser observadas.</p>

Conforme continuamos desenvolvendo esta convenção onde componentes nunca são autorizados a diretamente modificar o estado que percente ao *store*, ao invés disso devendo despachar eventos que notificam o *store* sobre ações que este deve realizar, eventualmente chegamos à arquitetura [Flux](https://facebook.github.io/flux/). O benefício desta convenção é que podemos gravar todas as mutações de estado que acontecem ao *store* e implementar depuração avançada, como *logs* das mutações, *snapshots*, e até mesmo reversões no histórico / viagens no tempo.

Isto nos leva em círculo de volta ao [vuex](https://github.com/vuejs/vuex). Então, se você leu tudo até aqui, provavelmente é hora de colocar as mãos na massa e testá-lo!
