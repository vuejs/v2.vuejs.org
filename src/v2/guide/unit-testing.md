---
title: Testes Unitários
type: guide
order: 403
---

## Configuração

Qualquer coisa compatível com um sistema de _build_ baseado em módulos irá funcionar, mas se está procurando uma recomendação específica, tente o [Karma](http://karma-runner.github.io). Ele possui uma gama de _plugins_ disponibilizados pela comunidade, incluindo suporte para [Webpack](https://github.com/webpack/karma-webpack) e [Browserify](https://github.com/Nikku/karma-browserify). Para detalhes sobre a configuração, consulte as respectivas documentações. Estes exemplos de configurações do Karma para [Webpack](https://github.com/vuejs-templates/webpack/blob/master/template/test/unit/karma.conf.js) e [Browserify](https://github.com/vuejs-templates/browserify/blob/master/template/karma.conf.js) podem te ajudar a começar.

## Declarações Simples

Você não precisa fazer nada especial em seus componentes para torná-los testáveis. A exportação padrão de opções basta:

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

Importe o componente juntamente com o Vue, e você pode fazer quaisquer verificações comuns:

``` js
// Importando o Vue e o componente a ser testado
import Vue from 'vue'
import MyComponent from 'path/to/MyComponent.vue'

// Alguns testes do Jasmine 2.0, apesar de que você pode usar
// qualquer test runner / assertion library que preferir
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
    const Constructor = Vue.extend(MyComponent)
    const vm = new Constructor().$mount()
    expect(vm.$el.textContent).toBe('bye!')
  })
})
```

## Escrevendo Componentes Testáveis

O resultado da renderização de componentes é primariamente determinado pelas `props` que recebem. Se a renderização de um componente somente depender disto, torna-se bem direto para testar, similar a garantir o valor de retorno de uma função usando diferentes argumentos. Tome um exemplo simplificado:

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
  const Constructor = Vue.extend(Component)
  const vm = new Constructor({ propsData: propsData }).$mount()
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

## Definindo Atualizações Assíncronas

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

Estamos planejando trabalhar em um conjunto com uma coleção de _helpers_ de teste para tornar mais fácil renderizar componentes com diferentes restrições (por exemplo, processamento superficial que ignora componentes filhos) e garantir os valores de suas saídas.
