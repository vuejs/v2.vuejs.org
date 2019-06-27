---
title: Sistema de Íconos SVG Editables
type: cookbook
order: 4
---

## Ejemplo Base

Existen muchas maneras de crear un sistema de íconos SVG, pero un método que se aprovecha de las capacidades de Vue es crear íconos _inline_ editables como componentes. Algunas de las ventajas de esta forma de trabajar son:

* Son faciles de editar en tiempo real
* Son animables
* Puede usar `props` comunes para modificar el tamaño
* Son _inline_, por lo que no se necesitan llamados HTTP
* Pueden volverse accesibles dinamicamente

Primero, crearemos una carpeta para todos los íconos, y los nombraremos de forma estandarizada para facilidad de acceso:

> components/icons/IconBox.vue
> components/icons/IconCalendar.vue
> components/icons/IconEnvelope.vue

Aquí esta un repo de ejemplo, donde puede ver toda la organización: [https://github.com/sdras/vue-sample-svg-icons/](https://github.com/sdras/vue-sample-svg-icons/)


![Documentation site](https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/screendocs.jpg 'Docs demo')

Crearemos un componente de icono base base (`IconBase.vue`) que use un `slot`.

```html
<template>
  <svg xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 18 18"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <title
      :id="iconName"
      lang="en"
    >{{ iconName }} icon</title>
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>
```
Puede usar este ícono base tal cual está, lo único que puede tener que cambiar es el `viewBox`  dependiendo del `viewBox` de sus íconos. En la base, estamos haciendo `width`, `height`, `iconColor`, y el nombre del ícono `props`, de tal manera que puedan ser actualizados dinamicamente. El nombre será usado para el contenido del `<title>` y su `id` para accesibilidad.

Nuestro `script` se verá de la siguiente manera, tendremos algunos valores por defecto para que nuestro ícono sea mostrado de manera consistente, a menos que se defina lo contrario.

```js
export default {
  props: {
    iconName: {
      type: String,
      default: 'box'
    },
    width: {
      type: [Number, String],
      default: 18
    },
    height: {
      type: [Number, String],
      default: 18
    },
    iconColor: {
      type: String,
      default: 'currentColor'
    }
  }
}
```
La propiedad `currentColor` que es el valor por defecto en el `fill` hará que el ícono herede el color de el texto que lo rodea. Tambien podríamos pasar un color diferente como `prop` si así quisieramos.

Lo podemos usar de la siguiente manera, siendo el contenido de `IconWrite.vue` los `paths` dentro del ícono.

```html
<icon-base icon-name="write"><icon-write /></icon-base>
```

Ahora, si quisieramos hacer varios tamaños para el ícono, podriamos hacerlo facilmente:

```html
<p>
  <!-- Puede pasar valores mas pequeños para `width` y `height` como props -->
  <icon-base
    width="12"
    height="12"
    icon-name="write"
  ><icon-write /></icon-base>
  <!-- O puede usar el default, que es 18 -->
  <icon-base icon-name="write"><icon-write /></icon-base>
  <!-- O hacerlo un poco mas grade:) -->
  <icon-base
    width="30"
    height="30"
    icon-name="write"
  ><icon-write /></icon-base>
</p>
```

<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/Screen%20Shot%202018-01-01%20at%204.51.40%20PM.png" width="450" />

## Íconos Animables

Mantener los íconos en los componentes es muy útil cuando desea animarlos, especialmente en una interacción. Los SVG `inline` tienen el mayor soporte para interacciones de cualquier método. Aquí hay un ejemplo muy básico de un ícono que está animado al hacer clic:

```html
<template>
  <svg
    @click="startScissors"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="100"
    height="100"
    aria-labelledby="scissors"
    role="presentation"
  >
    <title
      id="scissors"
      lang="en"
    >Scissors Animated Icon</title>
    <path
      id="bk"
      fill="#fff"
      d="M0 0h100v100H0z"/>
    <g ref="leftscissor">
      <path d="M..."/>
      ...
    </g>
    <g ref="rightscissor">
      <path d="M..."/>
      ...
    </g>
  </svg>
</template>
```

```js
import { TweenMax, Sine } from 'gsap'

export default {
  methods: {
    startScissors() {
      this.scissorAnim(this.$refs.rightscissor, 30)
      this.scissorAnim(this.$refs.leftscissor, -30)
    },
    scissorAnim(el, rot) {
      TweenMax.to(el, 0.25, {
        rotation: rot,
        repeat: 3,
        yoyo: true,
        svgOrigin: '50 45',
        ease: Sine.easeInOut
      })
    }
  }
}
```

Estamos aplicando `refs` a los grupos de `paths` que necesitamos mover, y como ambos lados de las tijeras tienen que moverse en tándem, crearemos una función que podemos reutilizar donde pasaremos los` refs`. El uso de GreenSock ayuda a resolver el soporte de animación y los problemas de `transform-origin` en los navegadores.

<p data-height="300" data-theme-id="0" data-slug-hash="dJRpgY" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Editable SVG Icon System: Animated icon" class="codepen">Ver el Pen <a href="https://codepen.io/team/Vue/pen/dJRpgY/">Sistema de Íconos SVG Editables: Iconos Animados</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p><script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

<p style="margin-top:-30px">¡Logrado de manera secilla! Y facil de modificar en tiempo real.</p>

Puede ver mas ejemplos animados en el repo [aquí](https://github.com/sdras/vue-sample-svg-icons/)

## Notas Adicionales

Los diseñadores pueden cambiar de opinión. Los requisitos del producto cambian. Mantener la lógica de todo el sistema de iconos en un componente base significa que puede actualizar rápidamente todos sus iconos y hacer que se propague a través de todo el sistema. Incluso con el uso de un cargador de iconos, algunas situaciones requieren que vuelva a crear o editar cada SVG para realizar cambios globales. Este método puede ahorrarle tiempo y esfuerzo.

## Cuando Evitar Este Patrón

Este tipo de sistema de iconos SVG es realmente útil cuando tiene varios iconos que se utilizan de diferentes maneras en todo su sitio. Si está repitiendo el mismo icono muchas veces en una página (por ejemplo, una tabla gigante y un icono de eliminar en cada fila), podría tener más sentido que todos los `sprites` se compilen en una hoja aparte, y utilicen las etiquetas `<use>` para cargarlos.

## Patrones Alternativos

Otras herramientas para ayudar a manejar iconos svg son:

* [svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader)
* [svgo-loader](https://github.com/rpominov/svgo-loader)

Estas herramientas agrupan SVGs en tiempo de compilación, pero las hacen un poco más difíciles de editar durante el tiempo de ejecución, porque las etiquetas `<use>` pueden tener problemas extraños en varios navegadores cuando se hace algo más complejo. También dejan dos propiedades anidadas de `viewBox` y por lo tanto dos sistemas de coordenadas. Esto hace que la implementación sea un poco más compleja.
