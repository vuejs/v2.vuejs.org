---
title: La Instancia Vue
type: guide
order: 3
---

## Constructor

Cada vm de Vue es inicializado creando una **instancia Vue raíz** con la función constructora `Vue`:

``` js
var vm = new Vue({
  // opciones
})
```

Aunque estrictamente no está asociado con el [patrón MVVM](https://en.wikipedia.org/wiki/Model_View_ViewModel), el diseño de Vue ha sido sin duda inspirado por él. Como convención, a menudo usamos la variable `vm` (versión se refiere a ViewModel) para referirnos a nuestras instancias Vue.

Cuando crea una instancia Vue, necesita pasarle un **objeto de opciones** el cual puede contener opciones para datos, plantilla, elemento donde ser montado, métodos, callbacks de ciclo de vida y más. La lista completa de opciones puede ser hallada en la [refefencia de API](../api).

El constructor `Vue` puede ser extendido para crear **constructores de componente** con opciones predefinidas:

``` js
var MyComponent = Vue.extend({
  // opciones de extensión
})

// todas las instancias de `MyComponent` serán creadas con
// las opciones pre-definidas de extensión.
var myComponentInstance = new MyComponent()
```

Aunque es posible crear instancias extensivas imperativamente, la mayoría de veces es recomendado componerlas declarativamente en plantillas como elementos personalizados. Hablaremos del [sistema de componentes](components.html) en detalle más adelante. Por ahora, sólo necesita saber que todos los componentes Vue son esencialmente instancias Vue extendidas.

## Propiedades y Métodos

Cada instancia Vue **expone** todas las propiedades halladas en su objeto `data`:

``` js
var data = { a: 1 }
var vm = new Vue({
  data: data
})

vm.a === data.a // -> true

// asignando un valor a la propiedad también afecta sus datos originales
vm.a = 2
data.a // -> 2

// ... y viceversa
data.a = 3
vm.a // -> 3
```

Debe ser dicho que únicamente dichas propiedades expuestas son **reactivas**. Si agrega una nueva propiedad a la instancia después de haberla creado, no activará actualizaciones de vista. Vamos a discutir el sistema de reactividad en detalle más adelante.

En adición a propiedades de datos, las instancias Vue exponen un número de propiedades de instancia y métodos útiles. Estas propiedades y métodos tienen el prefijo `$` para diferenciarlos de propiedades de `data` expuestas. Por ejemplo:

``` js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // -> true
vm.$el === document.getElementById('example') // -> true

// $watch es un método de instancia
vm.$watch('a', function (newVal, oldVal) {
  // este callback será llamado cuando `vm.a` cambie
})
```

<p class="tip">No use las [funciones flecha](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) en una propiedad de instancia o callback (p.e. `vm.$watch('a', newVal => this.myMethod())`). Como las funciones flecha están sujetas al contexto de su padre, `this` no será la instancia Vue como esperaría y `this.myMethod` será indefinido.</p>

Consulte la [referencia API](../api) para la lista completa de propiedades de instancia y métodos.

## Hooks de ciclo de vida de Instancia

Cada instancia Vue pasa por una serie de pasos de inicialización cuando es creada - por ejemplo, necesita preparar los datos para observación, compilar la plantilla, montar la instancia en el DOM, y actualizar el DOM siempre que los datos cambien. A lo largo del camino, también irá llamando algunos **hooks de ciclo de vida**, los cuales nos dan la oportunidad de ejecutar lógica personalizada. Por ejemplo, el hook `created` es llamado después que la instancia es creada:

``` js
var vm = new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` apunta a la instancia vue
    console.log('a is: ' + this.a)
  }
})
// -> "a es: 1"
```

Existen también otros hooks que serán llamados en diferentes puntos del ciclo de vida de la instancia, por ejemplo `mounted`, `updated`, y `destroyed`. Todos los hooks son llamados con su contexto `this` apuntando a la instancia Vue que los invoca. Puede estar preguntándose dónde se encuentra el concepto de "controladores" en el mundo Vue y la respuesta es: no hay controladores. Su lógica personalizada para un componente estará repartida entre estos hooks de ciclo de vida.

## Diagrama de ciclo de vida

El siguiente es un diagrama del ciclo de vida de la instancia. No necesita comprender ahora mismo en totalidad todo lo que está pasando, pero este diagrama puede serle útil en el futuro.

![Ciclo de vida](/images/lifecycle.png)
