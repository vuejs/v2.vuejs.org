---
title: Testing Unitario
type: guide
order: 402
---

> [Vue CLI](https://cli.vuejs.org/) tiene opciones integradas para testing unitario con [Jest](https://github.com/facebook/jest) o [Mocha](https://mochajs.org/) que funcionan de manera inmediata. También tenemos el paquete oficial [Vue Test Utils](https://vue-test-utils.vuejs.org/), que proporciona una guía más detallada para configuraciones personalizadas.

## Afirmaciones Simples

No tiene que hacer nada especial en sus componentes para hacerlos testables. Exportar las opciones en bruto:

``` html
<template>
  <span>{{ message }}</span>
</template>

<script>
  export default {
    data () {
      return {
        message: 'Hola!'
      }
    },
    created () {
      this.message = 'Chau!'
    }
  }
</script>
```

Luego importe las opciones de los componentes junto con Vue, y puede hacer muchas aserciones comunes (aquí estamos usando Jasmine/Jest estilo aserciones `expect` solo como un ejemplo):

``` js
// Importar Vue y el componente que se está probando.
import Vue from 'vue'
import MyComponent from 'path/to/MyComponent.vue'

// Aquí hay algunas pruebas de Jasmine 2.0, aunque puede
// usar cualquier libreria que prefiera
describe('MyComponent', () => {
  // Inspeccionar las opciones de componentes en bruto
  it('tiene un hook creado', () => {
    expect(typeof MyComponent.created).toBe('function')
  })

  // Evaluar los resultados de las funciones en
  // las opciones de componentes en bruto
  it('establece los datos correctos por defecto', () => {
    expect(typeof MyComponent.data).toBe('function')
    const defaultData = MyComponent.data()
    expect(defaultData.message).toBe('Hola!')
  })

  // Inspeccionar la instancia del componente en el montaje
  it('establece correctamente el mensaje cuando se crea', () => {
    const vm = new Vue(MyComponent).$mount()
    expect(vm.message).toBe('Chau!')
  })

  // Montar una instancia e inspeccionar la salida del render
  it('emite el mensaje correcto', () => {
    const Constructor = Vue.extend(MyComponent)
    const vm = new Constructor().$mount()
    expect(vm.$el.textContent).toBe('Chau!')
  })
})
```

## Creación de Componentes Testeables

La salida del render de un componente está determinada principalmente por las *props* que recibe. Si la salida de renderización de un componente depende únicamente de sus propiedades, se convierte en una prueba sencilla, similar a la de afirmar el valor de retorno de una función pura con diferentes argumentos. Tomemos un ejemplo simplificado:

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

Puede afirmar la salida del render con diferentes *props* usando la opción `propsData`:

``` js
import Vue from 'vue'
import MyComponent from './MyComponent.vue'

// Función auxiliar que monta y devuelve el texto representado.
function getRenderedText (Component, propsData) {
  const Constructor = Vue.extend(Component)
  const vm = new Constructor({ propsData: propsData }).$mount()
  return vm.$el.textContent
}

describe('MyComponent', () => {
  it('renderiza correctamente con diferentes props', () => {
    expect(getRenderedText(MyComponent, {
      msg: 'Hola'
    })).toBe('Hola')

    expect(getRenderedText(MyComponent, {
      msg: 'Chau'
    })).toBe('Chau')
  })
})
```

## Afirmando Actualizaciones Asíncronas

Dado que Vue [realiza las actualizaciones de DOM de forma asíncrona](reactivity.html#Async-Update-Queue), las afirmaciones (*asserts* en inglés) sobre las actualizaciones de DOM resultantes del cambio de estado, deberán realizarse en un *callback* `Vue.nextTick`:

``` js
// Inspeccionar el HTML generado después de una actualización de estado
it('actualiza el mensaje renderizado cuando vm.message se actualiza', done => {
  const vm = new Vue(MyComponent).$mount()
  vm.message = 'foo'

  // Espere un "tick" después del cambio de estado antes de afirmar las actualizaciones de DOM
  Vue.nextTick(() => {
    expect(vm.$el.textContent).toBe('foo')
    done()
  })
})
```

Para obtener información más detallada sobre las pruebas de unidad en Vue, consulte [Vue Test Utils](https://vue-test-utils.vuejs.org/) y nuestro *cookbook* sobre [testing unitario en componentes vue](https://vuejs.org/v2/cookbook/unit-testing-vue-components.html).
