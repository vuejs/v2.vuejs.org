---
title: Pruebas unitarias de componentes Vue
type: cookbook
order: 6
---

## Ejemplo Básico

Las pruebas unitarias son una parte fundamental del desarrollo de software. Las pruebas unitarias ejecutan las unidades de código más pequeñas en forma aislada, para aumentar la facilidad de agregar nuevas funciones y rastrear errores. Los [componentes de un solo archivo](../guide/single-file-components.html) de Vue facilitan la escritura de pruebas unitarias para componentes aislados. Esto le permite desarrollar nuevas funciones con la confianza de que no está rompiendo las existentes, y ayuda a otros desarrolladores a comprender qué hace su componente.

Este ejemplo simple prueba si se muestra algún texto:

```html
<template>
  <div>
    <input v-model="username">
    <div
      v-if="error"
      class="error"
    >
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hello',
  data () {
    return {
      username: ''
    }
  },

  computed: {
    error () {
      return this.username.trim().length < 7
        ? 'Por favor ingrese un nombre de usuario más largo'
        : ''
    }
  }
}
</script>
```

```js
import { shallowMount } from '@vue/test-utils'

test('Foo', () => {
  // renderiza el componente
  const wrapper = shallowMount(Hello)

  // no debe permitir que `username` tenga menos de 7 caracteres, excluye los espacios en blanco
  wrapper.setData({ username: ' '.repeat(7) })

  // verificar que se muestra el error
  expect(wrapper.find('.error').exists()).toBe(true)

  // actualiza el nombre para que sea lo suficientemente largo
  wrapper.setData({ username: 'Lachlan' })

  // verificar que el error ha desaparecido.
  expect(wrapper.find('.error').exists()).toBe(false)
})
```

El fragmento de código anterior muestra cómo probar si un mensaje de error se muestra según la longitud del nombre de usuario. Demuestra la idea general de prueba unitaria en los componentes de Vue: renderizar el componente y verificar que el HTML coincide con el estado del componente.

## ¿Por qué hacer pruebas unitarias?

Las pruebas de unitarias de componentes tienen muchos beneficios:

- Proporcionan documentación sobre cómo debe comportarse el componente.
- Ahorrar tiempo en pruebas manuales.
- Reducir errores en nuevas funcionalidades.
- Mejorar el diseño.
- Facilitar la refactorización.

Las pruebas automatizadas permiten que grandes equipos de desarrolladores mantengan bases de código complejas.

#### Empezando

[Vue Test Utils](https://github.com/vuejs/vue-test-utils) es la librería oficial para probar componentes de Vue. La plantilla del paquete [vue-cli](https://github.com/vuejs/vue-cli) viene con Karma o Jest, dos paquetes que permiten ejecutar pruebas con muy buen soporte, además hay algunas [guías](https://vue-test-utils.vuejs.org/guides/) en la documentación de Vue Test Utils.

## Ejemplo del mundo real

Las pruebas unitarias deberían:

- Ser rápidas de ejecutar.
- Ser fáciles de entender.
- Y solamente testear _unidades de comportamiento_.

Continuemos con el ejemplo anterior, y al mismo tiempo presentaremos la idea de una <a href="https://en.wikipedia.org/wiki/Factory_(object-oriented_programming)">función fábrica</a> para que nuestra prueba sea más compacta y legible. El componente debe:

- mostrar un saludo 'Bienvenido al libro de recetas de Vue.js'.
- pedir al usuario que ingrese su nombre de usuario.
- mostrar un error si el nombre de usuario ingresado tiene menos de siete letras.

Veamos primero el código del componente:

```html
<template>
  <div>
    <div class="message">
      {{ message }}
    </div>
    Ingrese su nombre de usuario: <input v-model="username">
    <div
      v-if="error"
      class="error"
    >
      Por favor ingrese un nombre de usuario con al menos siete letras.
    </div>
  </div>
</template>

<script>
export default {
  name: 'Foo',

  data () {
    return {
      message: 'Bienvenido al libro de recetas de Vue.js',
      username: ''
    }
  },

  computed: {
    error () {
      return this.username.trim().length < 7
    }
  }
}
</script>
```

Las cosas que debemos probar son:

- ¿Se muestra `message`?
- Si `error` es `true`, entonces `<div class =" error ">` debería estar presente.
- Si `error` es` false`, entonces `<div class =" error ">` no debería estar presente.

Nuestro primera versión de prueba:

```js
import { shallowMount } from '@vue/test-utils'

describe('Foo', () => {
  it('muestra un mensaje y reacciona correctamente a la entrada del usuario', () => {
    const wrapper = shallowMount(Foo, {
      data: {
        message: 'Hola Mundo',
        username: ''
      }
    })

    // verificar que el mensaje se muestra
    expect(wrapper.find('.message').text()).toEqual('Hola Mundo')

    // verificar que el error se muestra
    expect(wrapper.find('.error').exists()).toBeTruthy()

    // actualizar `username` y verificar que el error no se muestra más
    wrapper.setData({ username: 'Lachlan' })
    expect(wrapper.find('.error').exists()).toBeFalsy()
  })
})
```

Hay algunos problemas con lo anterior:

- Una sola prueba hace verificaciones sobre diferentes cosas.
- Es difícil distinguir los diferentes estados en los que puede estar el componente y qué se debe mostrar.

El siguiente ejemplo mejora la prueba mediante:

- Solo verificar una cosa por bloque `it`.
- Tener descripciones de prueba cortas y claras.
- Proporcionando sólo los datos mínimos requeridos para la prueba.
- Refactorizando la lógica duplicada (creando el `wrapper` y moviendo la variable `username`) a una función fábrica.

*Prueba actualizada*:
```js
import { shallowMount } from '@vue/test-utils'
import Foo from './Foo'

const factory = (values = {}) => {
  return shallowMount(Foo, {
    data: { ...values  }
  })
}

describe('Foo', () => {
  it('muestra el mensaje de bienvenida', () => {
    const wrapper = factory()

    expect(wrapper.find('.message').text()).toEqual("Bienvenido al libro de recetas de Vue.js")
  })

  it('muestra un error cuando el nombre de usuario es menor a 7 caracteres', () => {
    const wrapper = factory({ username: ''  })

    expect(wrapper.find('.error').exists()).toBeTruthy()
  })

  it('muestra un error cuando el nombre de usuario está en blanco', () => {
    const wrapper = factory({ username: ' '.repeat(7) })

    expect(wrapper.find('.error').exists()).toBeTruthy()
  })

  it('no muestra el error cuando el nombre de usuario tiene 7 o más caracteres', () => {
    const wrapper = factory({ username: 'Lachlan'  })

    expect(wrapper.find('.error').exists()).toBeFalsy()
  })
})
```

Puntos a destacar:

En la parte superior, declaramos una función fábrica que fusiona el objeto de `values` en `data` y devuelve una nueva instancia de `wrapper`. De esta manera, no necesitamos duplicar `const wrapper = shallowMount(Foo)` en cada prueba. Otro gran beneficio de esto es que cuando los componentes son más complejos y tienen un método o una propiedad computada y se quiere simular o fingir algo, entonces solo se lo tiene que hacer una vez.

## Contexto adicional

La prueba anterior es bastante simple, pero en la práctica los componentes de Vue a menudo tienen otros comportamientos que se desea probar, como:

- Hacer llamadas a la API.
- Hacer _commit_ o ejecutar mutaciones o acciones en el almacenamiento de `Vuex`.
- Probar interacciones de usuario.

Hay ejemplos más completos que muestran tales pruebas en las [guías](https://vue-test-utils.vuejs.org/guides/) de Vue Test Utils.

Vue Test Utils y el enorme ecosistema de JavaScript proporcionan una gran cantidad de herramientas para facilitar la obtención de la cobertura código y acercarlo al 100%. Sin embargo, las pruebas unitarias son solo una parte de la pirámide de pruebas. Algunos otros tipos de pruebas incluyen pruebas e2e (extremo a extremo) y pruebas visuales. Las pruebas unitarias son las pruebas más pequeñas y sencillas: realizan chequeos sobre las unidades de código más pequeñas, aislando cada parte de un solo componente.

Las pruebas visuales guardan el HTML de su componente Vue y lo comparan con el nuevo generado cada vez que se ejecuta la prueba. Si algo cambia, el desarrollador recibe una notificación y puede decidir si el cambio fue intencional (el componente se actualizó) o fue accidental (el componente se está comportando de manera incorrecta).

Las pruebas de extremo a extremo aseguran que una serie de componentes interactúan bien juntos. Son de nivel más alto. Algunos pruebas podrían estar chequeando si un usuario puede registrarse, iniciar sesión y actualizar su nombre de usuario. Estas pruebas son más lentas de ejecutar que las pruebas unitarias o las pruebas visuales.

Las pruebas unitarias son más útiles durante el desarrollo, ya sea para ayudar a un desarrollador a pensar cómo diseñar un componente, o refactorizar un componente existente, y se ejecutan a menudo cada vez que se cambia el código.

Las pruebas alto nivel, como las pruebas de extremo a extremo, se ejecutan mucho más lentamente. Por lo general, estos se ejecutan antes de la salida a producción, para garantizar que cada parte del sistema funcione correctamente.

Puede encontrar más información acerca de cómo probar los componentes de Vue en [Probando aplicaciones Vue.js ](https://www.manning.com/books/testing-vuejs-applications) escrito por el miembro del equipo de Vue [Edd Yerburgh](https://eddyerburgh.me/).

## Cuándo evitar este patrón

Las pruebas unitarias son una parte importante de cualquier aplicación seria. Al principio, cuando la visión de una aplicación no es clara, las pruebas unitarias pueden ralentizar el desarrollo, pero una vez que se establece una visión y los usuarios reales interactúan con la aplicación, las pruebas unitarias (y otros tipos de pruebas automatizadas) son absolutamente esenciales para asegúrese de que el código sea mantenible y escalable.
