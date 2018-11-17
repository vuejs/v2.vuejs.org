---
title: Créer une directive de défilement personnalisée
type: cookbook
order: 7
---

## Exemple de base

Plus d'une fois nous avons besoin d'introduire un comportement, en particulier d'animation, lors du défilement d'un site. Il y a plusieurs façons d'y parvenir mais le plus simple, en évitant d'accumuler les dépendances, est d'utiliser une [Directive personnalisée](https://fr.vuejs.org/v2/guide/custom-directive.html) pour créer un « hook » qui sera déclenché lors du défilement.

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

// main app
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
  <h1 class="centered">Faites-moi défiler</h1>
  <div
    v-scroll="handleScroll"
    class="box"
  >
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque amet harum aut ab veritatis earum porro praesentium ut corporis. Quasi provident dolorem officia iure fugiat, eius mollitia sequi quisquam.</p>
  </div>
</div>
```

<p class="tip">N'oubliez pas ! La directive doit être enregistrée avant la création de l'instance de Vue.</p>

Nous avons également besoin d'une propriété pour calculer les valeurs intermédiaires lors de la transition, dans notre cas :

```css
.box {
  transition: 1.5s all cubic-bezier(0.39, 0.575, 0.565, 1);
}
```

<p data-height="450" data-theme-id="5162" data-slug-hash="983220ed949ac670dff96bdcaf9d3338" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Custom Scroll Directive- CSS Transition" class="codepen">See the Pen <a href="https://codepen.io/sdras/pen/983220ed949ac670dff96bdcaf9d3338/">Custom Scroll Directive- CSS Transition</a> by Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Ou, avec GreenSock(GSAP) ou toute autre librairie d'animation JavaScript, le code devient encore plus simple :

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

// main app
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

Nous devons retirer la transition CSS de l'exemple précédent puisque dans cette implémentation, tout est calculé directement avec JavaScript.

## Le bénéfice de l'utilisation des directives personnalisées

Vue est riche en option pour les directives, ce qui permet de couvrir la majorité des cas d'utilisation, ce qui permet d'améliorer la production et l'expérience de développement. Mais pour certains « cas limite » qui ne seraient pas couverts par le framework, ce sera à vous de réaliser la directive qui répondra parfaitement à vos besoins.

Ajouter et retirer des « évènements de défilement/scroll » sur un élément est un bon cas d'utilisation de cette technique, parce qu'à l'image des autres directives, elle est nécessairement liée à un élément sinon, il faudrait trouver l'élément dans le DOM. Ce modèle évite d'avoir besoin de parcourir le DOM et conserve une logique évènementielle avec le noeud auquel il fait référence.

## Exemple concret : Utiliser une directive de défilement personnalisée pour animer en cascade

Au cours de la création de vos sites, vous constaterez que vous réutilisez régulièrement les mêmes logiques d'animation à plusieurs endroits. C'est simple, nous allons créer une directive super spécifique ? Et bien, typiquement si nous souhaitons pouvoir la réutiliser, nous devons la rendre _légèrement_ personnalisable pour chaque cas d'utilisation.

Afin de conserver un code concis et lisible, nous allons transmettre des arguments prédéfinis, tels que le point de départ et de fin d'animation au fur et à mesure que nous parcourons la page.

**Cet exemple est plus visuel [en plein écran](https://s.codepen.io/sdras/debug/078c19f5b3ed7f7d28584da450296cd0).**

<p data-height="500" data-theme-id="5162" data-slug-hash="c8c55e3e0bba997350551dd747119100" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Scrolling Example- Using Custom Directives in Vue" class="codepen">See the Pen <a href="https://codepen.io/sdras/pen/c8c55e3e0bba997350551dd747119100/">Scrolling Example- Using Custom Directives in Vue</a> by Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Dans la démo ci-dessus, chacune des sections comporte deux différents types d'animations déclenchés lors du défilement : Une animation type « morphing » et une animation type « dessin » qui anime individuellement chacun des `<path>` du SVG. Réutilisons ces deux animation pour créer une directive personnalisée pour chaqu'un des cas. Les arguments qui seront transmis vont nous aider à garder l'ensemble simple et réutilisable.

Pour analyser l'exemple de l'animation « morphing », nous aurons besoin d'indiquer ou l'animation commence et termine ainsi que la valeur du `<path>` qui va permettre le calcul du morphing. Ces arguments sont définis via `binding.value.foo` :

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

Nous pouvons alors utiliser cette animation directement dans le `<template>`, en attachant la directive à l'élément `<path>` tout en transmettant les arguments de la directive dans un `Object`

```html
<clipPath id="clip-path">
  <path
    v-clipscroll="{ start: '50', end: '100', toPath: 'M0.39 0.34H15.99V22.44H0.39z' }"
    id="poly-shapemorph"
    d="M12.46 20.76L7.34 22.04 3.67 18.25 5.12 13.18 10.24 11.9 13.91 15.69 12.46 20.76z"
  />
</clipPath>
```

## Alternative

Les directives personnalisées sont extrêmement utiles, mais vous pouvez trouver des situations dans lesquelles vous aurez besoin de quelque chose de très spécifique, qui existe déjà dans des librairies de défilement et que vous ne souhaitez pas réécrire totalement vous-même.  

[Scrollmagic](http://scrollmagic.io/) est doté d'un écosysteme très riche, une très bonne documentation ainsi que des démos à explorer. Cela inclus de façon non exhaustive, des cas comme [l'effet parallax](http://scrollmagic.io/examples/advanced/parallax_scrolling.html), [Épingler en cascade](http://scrollmagic.io/examples/expert/cascading_pins.html), [Recouvrement de section](http://scrollmagic.io/examples/basic/section_wipes_natural.html), et [responsive duration](http://scrollmagic.io/examples/basic/responsive_duration.html).
