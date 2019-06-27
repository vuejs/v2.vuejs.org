---
title: Creando Directivas de Desplazamiento
type: cookbook
order: 7
---

## Ejemplo Base

Hay ocasiones en las que querríamos añadir algo de comportamiento, en especial animación, a un evento de desplazamiento en un sitio. Existen varias maneras de lograrlo, pero el camino con la menor cantidad de codigo y dependencias es quizás usar una [directiva personalizada](https://vuejs.org/v2/guide/custom-directive.html) para crear un hook a cualquier cosa que dispare un determinado evento de desplazamiento.

```js
Vue.directive('scroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})

// app principal
new Vue({
  el: '#app',
  methods: {
    handleScroll: function (evt, el) {
      if (window.scrollY > 50) {
        el.setAttribute(
          'style',
          'opacity: 1; transform: translate3d(0, -10px, 0)'
        )
      }
      return window.scrollY > 100
    }
  }
})
```

```html
<div id="app">
  <h1 class="centered">Scroll me</h1>
  <div
    v-scroll="handleScroll"
    class="box"
  >
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque amet harum aut ab veritatis earum porro praesentium ut corporis. Quasi provident dolorem officia iure fugiat, eius mollitia sequi quisquam.</p>
  </div>
</div>
```

<p class="tip">¡Recuerde! La directiva debe estar registrada antes que la instancia de Vue.</p>

También necesitaríamos una propiedad de estilo que haria la transición entre los valores intermedios aquí, en éste caso:

```css
.box {
  transition: 1.5s all cubic-bezier(0.39, 0.575, 0.565, 1);
}
```

<p data-height="450" data-theme-id="5162" data-slug-hash="983220ed949ac670dff96bdcaf9d3338" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Custom Scroll Directive- CSS Transition" class="codepen">See the Pen <a href="https://codepen.io/sdras/pen/983220ed949ac670dff96bdcaf9d3338/">Custom Scroll Directive- CSS Transition</a> by Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

O, con GreenSock(GSAP) o cualquier otra librería de animacion de JavaScript, el codigo se vuelve aúm mas simple:

```js
Vue.directive('scroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})

// app principal
new Vue({
  el: '#app',
  methods: {
    handleScroll: function (evt, el) {
      if (window.scrollY > 50) {
        TweenMax.to(el, 1.5, {
          y: -10,
          opacity: 1,
          ease: Sine.easeOut
        })
      }
      return window.scrollY > 100
    }
  }
})
```
Aunque tendríamos que remover la transición de CSS de la implementación anterior, porque ahora es manejada con JavaScript.

## El Beneficio de Usar Directivas Personalizadas

Vue es rico en opciones de directivas, las cuales en su mayoria cubren casos de uso comunes que pueden crear una experiencia de desarrollo muy productiva. Pero incluso si tiene un escenario borde no cubierto por el framework, esta cubierto en ese caso también, porque puede crear de manera sencilla una directiva personalizada que se ajuste a sus necesitades.

Añadir y remover eventos de desplazamiento a elementos es verdaderamente un buen caso de uso para esta técnica, porque al igual que con otras directivas que usamos, estan vinculadas necesariamente al elemento, de otra forma tendriamos que encontrar la referencia del mismo en el DOM. Este patron evita la necesidad de buscar el elemento en el DOM, y mantiene la lógica emparejada con el nodo en el que esta referenciado.

## Ejemplo del Mundo Real: Usando una Directiva de Desplazamiento Personalizada para Animaciones en Cascada

En el transcurso de crear un sitio cohesivo, se podrá encontrar con que está usando el mismo tipo de lógica de animación en varias áreas. Se ve secillo, entonces crearíamos una directiva personalizada muy especifica, ¿cierto? Bueno, tipicamente, si la estamos reusando deberemos cambiarla _apenas_ un poco para cada uso.

Para ayudar a mantener nuestro codigo conciso y legible, querriamos pasar algunos argumentos predefinidos, tales como los puntos de inicio y fin de la animacion mientras nos desplazamos por la página.

**Este ejemplo puede verse mejor en la [versión de pantalla completa](https://s.codepen.io/sdras/debug/078c19f5b3ed7f7d28584da450296cd0).**

<p data-height="500" data-theme-id="5162" data-slug-hash="c8c55e3e0bba997350551dd747119100" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Scrolling Example- Using Custom Directives in Vue" class="codepen">Ver el Pen <a href="https://codepen.io/sdras/pen/c8c55e3e0bba997350551dd747119100/">Ejemplo de Desplazamiento - Usando Directivas Personalizadas en Vue. </a> por Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) en <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

En el demo anterior, cada una de las secciones tiene 2 tipos diferentes de animación disparados por el desplazamiento: una animacion de transformacion, y una animación  que anima cada path individual en el SVG. Reusamos esas dos animaciones, por lo que podemos crear una directiva personalizada para cada una. Los argumentos que pasaremos nos ayudaran a mantener todo siple y reusable.

Para demostrar como se hace, miraremos al ejemplo de la figura transformandose, en donde necesitaremos declarar el inicio y el final, y pasar un valor del path al que haremos la transformacion. Cada uno de estos argumentos estan definidos como `binding.value.foo`:

```js
Vue.directive('clipscroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      var hasRun = false
      if (!hasRun && window.scrollY > binding.value.start) {
        hasRun = true
        TweenMax.to(el, 2, {
          morphSVG: binding.value.toPath,
          ease: Sine.easeIn
        })
      }
      if (window.scrollY > binding.value.end) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})
```
Podemos entonces usar esta animación en nuestro template, en este caso estamos añadiendo la directiva al elemento `clipPath`, y pasando todos nuestros argumentos a las directivas en un objeto.

```html
<clipPath id="clip-path">
  <path
    v-clipscroll="{ start: '50', end: '100', toPath: 'M0.39 0.34H15.99V22.44H0.39z' }"
    id="poly-shapemorph"
    d="M12.46 20.76L7.34 22.04 3.67 18.25 5.12 13.18 10.24 11.9 13.91 15.69 12.46 20.76z"
  />
</clipPath>
```

## Patrones Alternativos

Las directivas personalizadas son extremandamente útiles, pero podrá encontrar algunas situaciones en donde necesite algo muy especifico que ya existe en librerias de Desplazamiento que no quisiera rehacer desde cero usted mismo.

[Scrollmagic](http://scrollmagic.io/) tiene un ecosistema rico en opciones con las que trabajar, al igual que buena documentación y demos para explorar. Esto icluye, pero no está limitado a cosas como [parallax](http://scrollmagic.io/examples/advanced/parallax_scrolling.html), [pineado en cascada](http://scrollmagic.io/examples/expert/cascading_pins.html), [limpieza de secciones](http://scrollmagic.io/examples/basic/section_wipes_natural.html), y [duración responsiva](http://scrollmagic.io/examples/basic/responsive_duration.html).
