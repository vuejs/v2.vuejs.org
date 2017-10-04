---
title: Testes Unitários
type: guide
order: 403
---

## Configuração

<<<<<<< HEAD
Qualquer coisa compatível com um sistema de build à base de módulos irá funcionar, mas se você está procurando uma recomendação específica, tente o test runner [Karma](http://karma-runner.github.io). Ele tem vários plugins disponibilizados pela comunidade, incluindo suporte para [Webpack](https://github.com/webpack/karma-webpack) e [Browserify](https://github.com/Nikku/karma-browserify). Para uma configuração detalhada, consulte a respectiva documentação de cada plugin, embora estes exemplos de configurações do Karma para [Webpack](https://github.com/vuejs/vue-loader-example/blob/master/build/karma.conf.js) e [Browserify](https://github.com/vuejs/vueify-example/blob/master/karma.conf.js) possam ajudar você a começar.
=======
Anything compatible with a module-based build system will work, but if you're looking for a specific recommendation try the [Karma](http://karma-runner.github.io) test runner. It has a lot of community plugins, including support for [Webpack](https://github.com/webpack/karma-webpack) and [Browserify](https://github.com/Nikku/karma-browserify). For detailed setup please refer to each project's respective documentation. These example Karma configurations for [Webpack](https://github.com/vuejs-templates/webpack/blob/master/template/test/unit/karma.conf.js) and [Browserify](https://github.com/vuejs-templates/browserify/blob/master/template/karma.conf.js) can help you get started.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

## Declarações Simples

<<<<<<< HEAD
Em termos de estrutura de código para o teste, você não precisa fazer nada de especial em seus componentes para torná-los testáveis. Basta exportar as opções do código:
=======
You don't have to do anything special in your components to make them testable. Export the raw options:
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

``` html
<template>
  <span>{{ message }}</span>
</template>

<script>
  export default {
    data () {
      return {
        message: 'hello!'
      }
    },
    created () {
      this.message = 'bye!'
    }
  }
</script>
```

<<<<<<< HEAD
Quando você for testar esse componente, tudo que você deve fazer é importar o objeto juntamente com o Vue para fazer muitas declarações comuns:
=======
Then import the component options along with Vue, and you can make many common assertions:
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

``` js
// Importando o Vue e o componente a ser testado
import Vue from 'vue'
import MyComponent from 'path/to/MyComponent.vue'

// Alguns testes do Jasmine 2.0, apesar de que você pode usar
// qualquer test runner / assertion library combo que você preferir
describe('MyComponent', () => {
  // Inspeciona as opções do componente
  it('has a created hook', () => {
    expect(typeof MyComponent.created).toBe('function')
  })

  // Avalia os resultados das funções
  // nas opções do componente
  it('sets the correct default data', () => {
    expect(typeof MyComponent.data).toBe('function')
    const defaultData = MyComponent.data()
    expect(defaultData.message).toBe('hello!')
  })

  // Inspeciona a instância do componente ao montar
  it('correctly sets the message when created', () => {
    const vm = new Vue(MyComponent).$mount()
    expect(vm.message).toBe('bye!')
  })

  // Monta uma instância e inpeciona a saída de renderização
  it('renders the correct message', () => {
    const Ctor = Vue.extend(MyComponent)
    const vm = new Ctor().$mount()
    expect(vm.$el.textContent).toBe('bye!')
  })
})
```

## Escrevendo Componentes Testáveis

<<<<<<< HEAD

Várias saídas de renderização dos componentes são determinadas, principalmente, pelas propriedades que recebem. Na verdade, se a saída de renderização de um componente depender unicamente das suas propriedades, torna-se bastante simples para testar, semelhante a afirmar o valor de retorno de uma função pura com diferentes argumentos. Tome um exemplo artificial:
=======
A component's render output is primarily determined by the props they receive. If a component's render output solely depends on its props it becomes straightforward to test, similar to asserting the return value of a pure function with different arguments. Take a simplified example:
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

``` html
<template>
  <p>{{ msg }}</p>
</template>

<script>
  export default {
    props: ['msg']
  }
</script>
```
Você pode definir a sua saída de renderização com diferentes propriedades, usando a opção `propsData`:

``` js
import Vue from 'vue'
import MyComponent from './MyComponent.vue'

// helper function that mounts and returns the rendered text
function getRenderedText (Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData: propsData }).$mount()
  return vm.$el.textContent
}

describe('MyComponent', () => {
  it('renders correctly with different props', () => {
    expect(getRenderedText(MyComponent, {
      msg: 'Hello'
    })).toBe('Hello')

    expect(getRenderedText(MyComponent, {
      msg: 'Bye'
    })).toBe('Bye')
  })
})
```

## Definindo atualizações assíncronas


Desde que o Vue [executa atualizações do DOM de forma assíncrona](reactivity.html#Async-Update-Queue), as definições sobre atualizações do DOM resultantes da mudança de estado deverão ser feitas em um callback `Vue.nextTick`:

``` js
// Inspect the generated HTML after a state update
it('updates the rendered message when vm.message updates', done => {
  const vm = new Vue(MyComponent).$mount()
  vm.message = 'foo'

  // wait a "tick" after state change before asserting DOM updates
  Vue.nextTick(() => {
    expect(vm.$el.textContent).toBe('foo')
    done()
  })
})
```

<<<<<<< HEAD
Estamos planejando trabalhar em um conjunto de helpers de teste que fazem com que seja ainda mais simples processar componentes com diferentes restrições (por exemplo, processamento superficial que ignora componentes filhos) e definir a sua saída.
=======
We are planning to work on a collection of common test helpers to make it easier to render components with different constraints (e.g. shallow rendering that ignores child components) and assert their output.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454
