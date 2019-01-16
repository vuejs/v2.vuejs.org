---
title: Administración del Estado
type: guide
order: 502
---

## Implementacion Official Como-Flux

Grandes aplicaciones a menudo pueden crecer en complejidad, debido a múltiples partes de estado dispersas en muchos componentes y las interacciones entre ellos. Para resolver este problema, Vue ofrece [vuex](https://github.com/vuejs/vuex): nuestra propia biblioteca de administración de estado inspirada en Elm. Incluso se integra en [vue-devtools](https://github.com/vuejs/vue-devtools), proporcionando acceso de cerp configuración a la [depuración de viajes en el tiempo](https://raw.githubusercontent.com/vuejs/vue-devtools/master/media/demo.gif).

### Informacion para desarrolladores React

Si viene de React, puede que se esté preguntando cómo se compara vuex con [redux](https://github.com/reactjs/redux), la implementación de Flux más popular en ese ecosistema. Redux es en realidad agnóstico en la capa de vista, por lo que se puede usar fácilmente con Vue a través de [enlaces simples](https://yarnpkg.com/en/packages?q=redux%20vue&p=1). Vuex es diferente porque _sabe_ que está en una aplicación Vue. Esto le permite integrarse mejor con Vue, ofreciendo una API más intuitiva y una mejor experiencia de desarrollo.

##  Gestión de estado simple desde cero

A menudo se pasa por alto que la fuente de la verdad en las aplicaciones de Vue es el objeto de datos en bruto, una instancia de Vue solo le permite acceder a él. Por lo tanto, si tiene un estado que debe ser compartido por varias instancias, puede compartirlo por identidad:
I
``` js
const sourceOfTruth = {}

const vmA = new Vue({
  data: sourceOfTruth
})

const vmB = new Vue({
  data: sourceOfTruth
})
```

Ahora, siempre que se mute `sourceOfTruth`, tanto `vmA` como `vmB` actualizarán sus vistas automáticamente. Los subcomponentes dentro de cada una de estas instancias también tendrían acceso a través de `this.$root.$data` 
Ahora tenemos una única fuente de verdad, pero la depuración sería una pesadilla. Cualquier parte de los datos puede ser modificada por cualquier parte de nuestra aplicación en cualquier momento, sin dejar rastro.

Para ayudar a resolver este problema, podemos adoptar un **patrón de tienda**:

``` js
var store = {
  debug: true,
  state: {
    message: 'Hello!'
  },
  setMessageAction (newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    if (this.debug) console.log('clearMessageAction triggered')
    this.state.message = ''
  }
}
```

Observe que todas las acciones que mutan el estado de la tienda se colocan dentro de la misma tienda. Este tipo de administración de estatado centralizado facilita la comprensión de qué tipo de mutaciones podrían ocurrir y cómo se activan. Ahora, cuando algo sale mal, también tendremos un registro de lo que sucedió antes del error.

Además, cada instancia/componente todavía puede poseer y administrar su propio estado privado:

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

<p class="tip">Es importante tener en cuenta que nunca debe reemplazar el objeto de estado original en sus acciones: los componentes y la tienda deben compartir la referencia al mismo objeto para que se observen las mutaciones.</p>

A medida que continuamos desarrollando la convención donde los componentes nunca pueden mutar directamente el estado que pertenece a una tienda, sino que deben enviar eventos que notifiquen a la tienda para realizar acciones, finalmente llegamos a la arquitectura [Flux](https://facebook.github.io/flux/). El beneficio de esta convención es que podemos registrar todas las mutaciones de estado que ocurren en la tienda e implementar ayudantes de depuración avanzados, como registros de mutación, instantáneas y repeticiones de historial/viajes en el tiempo.

Esto nos lleva de vuelta a [vuex](https://github.com/vuejs/vuex), así que si has leído hasta aquí es probable que sea el momento de probarlo!