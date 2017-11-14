---
title: Transitions d'entrée, de sortie et de liste
type: guide
order: 201
---

## Vue d'ensemble

Vue fournit plusieurs façons d'appliquer des effets de transition lorsque des éléments sont insérés, mis à jour ou supprimés du DOM. Cela inclut des outils pour :

- appliquer automatiquement des classes pour les transitions et les animations CSS
- intégrer des bibliothèques d'animation CSS tierces, comme Animate.css
- utiliser JavaScript pour manipuler directement le DOM durant les hooks de transition
- intégrer des bibliothèques d'animation JavaScript tierces, comme Velocity.js

Sur cette page, nous ne traiterons que des transitions entrantes, sortantes et de liste, mais vous pouvez consulter la section suivante pour la [gestion des transitions d'état](transitioning-state.html).

## Transition d'éléments/composants simples

Vue fournit un composant conteneur `transition`, vous permettant d'ajouter des transitions entrantes/sortantes pour n'importe quel élément ou composant dans les contextes suivants :

- Le rendu conditionnel (en utilisant `v-if`)
- L'affichage conditionnel (en utilisant `v-show`)
- Les composants dynamiques
- Les nœuds racines de composant

Voilà à quoi ressemble un exemple très simple en action :

``` html
<div id="demo">
  <button v-on:click="show = !show">
    Permuter
  </button>
  <transition name="fade">
    <p v-if="show">bonjour</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
```

``` css
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}
```

{% raw %}
<div id="demo">
  <button v-on:click="show = !show">
    Permuter
  </button>
  <transition name="demo-transition">
    <p v-if="show">bonjour</p>
  </transition>
</div>
<script>
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
</script>
<style>
.demo-transition-enter-active, .demo-transition-leave-active {
  transition: opacity .5s
}
.demo-transition-enter, .demo-transition-leave-to {
  opacity: 0
}
</style>
{% endraw %}

Quand un élément, encapsulé dans un composant `transition`, est inséré ou enlevé, voilà ce qui arrive :

1. Vue recherchera automatiquement si l'élément cible a des transitions CSS ou des animations appliquées. Si c'est le cas, les classes de transition CSS seront ajoutées/supprimées aux moments appropriés.

2. Si le composant de transition possède des [hooks JavaScript](#Hooks-JavaScript), ces hooks seront appelés aux moments appropriés.

3. Si aucune transition/animation CSS n'est détectée et qu'aucun hook JavaScript n'est fourni, les opérations du DOM pour l'insertion et/ou la suppression seront exécutées immédiatement à la frame suivante (Remarque : il s'agit d'une frame d'animation du navigateur, différente du concept de `nextTick`).

### Classes de transition

Il y a six classes appliquées pour les transitions entrantes/sortantes.

1. `v-enter`: c'est l'état de départ pour *enter*. Il est ajouté avant que l'élément soit inséré, il est supprimé une fois que l'élément est inséré.

2. `v-enter-active`: c'est l'état actif pour *enter*. Il est appliqué pendant toute la phase *enter*. Il est ajouté avant que l'élément soit inséré, il est supprimé lorsque la transition/animation est terminée. Cette classe peut être utilisée pour définir la durée, le retard et la courbe d'accélération pour la transition entrante.

3. `v-enter-to`: **seulement disponible pour les versions 2.1.8+.** C'est l'état de fin pour *enter*. Il est ajouté une fois que l'élément est inséré (au même moment que `v-enter` est supprimé), il est supprimé lorsque la transition/animation est terminée.

4. `v-leave`: c'est l'état de départ pour *leave*. Il est ajouté dès qu'une transition sortante est déclenchée, il est supprimé après une frame.

5. `v-leave-active`: c'est l'état actif pour *leave*. Il est appliqué pendant toute la phase *leave*. Il est ajouté dès qu'une transition sortante est déclenchée, il est supprimé lorsque la transition/animation est terminée. Cette classe peut être utilisée pour définir la durée, le retard et la courbe d'accélération pour la transition de sortie.

6. `v-leave-to`: **seulement disponible pour les versions 2.1.8+.** C'est l'état de fin pour *leave*. Il est ajouté après que la transition sortante soit déclenchée (au même moment que `v-leave` est supprimé), il est supprimé lorsque la transition/animation est terminée.

![Diagramme de transition](/images/transition.png)

Chacune de ces classes sera préfixée avec le nom de la transition. Ici le préfixe `v-` est celui par défaut lorsque vous utilisez l'élément `<transition>` sans nom. Si vous utilisez par exemple `<transition name="ma-transition">`, alors la classe `v-enter` sera nommé `ma-transition-enter`.

`v-enter-active` et `v-leave-active` vous donnent la possibilité de spécifier des courbes d'accélération pour les transitions entrantes/sortantes, ce que nous verrons en exemple dans la section suivante.

### Transitions CSS

L'un des types de transition les plus courants utilise les transitions CSS. Voici un exemple simple :

``` html
<div id="example-1">
  <button @click="show = !show">
    Permuter
  </button>
  <transition name="slide-fade">
    <p v-if="show">bonjour</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-1',
  data: {
    show: true
  }
})
```

``` css
/* Les animations d'entrée (« enter ») et de sortie (« leave »)  */
/* peuvent utiliser différentes fonctions de durée et de temps.  */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
```

{% raw %}
<div id="example-1" class="demo">
  <button @click="show = !show">
    Permuter
  </button>
  <transition name="slide-fade">
    <p v-if="show">bonjour</p>
  </transition>
</div>
<script>
new Vue({
  el: '#example-1',
  data: {
    show: true
  }
})
</script>
<style>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
{% endraw %}

### CSS Animations

Les animations CSS sont appliquées de la même manière que les transitions CSS, la différence étant que `v-enter` n'est pas supprimé immédiatement après l'insertion de l'élément, mais par un évènement `animationend`.

Voici un exemple, en supprimant les règles CSS préfixées pour des raisons de concision :

``` html
<div id="example-2">
  <button @click="show = !show">Permuter l'affichage</button>
  <transition name="bounce">
    <p v-if="show">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis enim libero, at lacinia diam fermentum id. Pellentesque habitant morbi tristique senectus et netus.</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-2',
  data: {
    show: true
  }
})
```

``` css
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
```

{% raw %}
<div id="example-2" class="demo">
  <button @click="show = !show">Permuter l'affichage</button>
  <transition name="bounce">
    <p v-show="show">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis enim libero, at lacinia diam fermentum id. Pellentesque habitant morbi tristique senectus et netus.</p>
  </transition>
</div>

<style>
  .bounce-enter-active {
    -webkit-animation: bounce-in .5s;
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    -webkit-animation: bounce-in .5s reverse;
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  @-webkit-keyframes bounce-in {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
</style>
<script>
new Vue({
  el: '#example-2',
  data: {
    show: true
  }
})
</script>
{% endraw %}

### Classes de transition personnalisées

Vous pouvez également spécifier des classes de transition personnalisées en fournissant les attributs suivants :

- `enter-class`
- `enter-active-class`
- `enter-to-class` (2.1.8+)
- `leave-class`
- `leave-active-class`
- `leave-to-class` (2.1.8+)

Celles-ci remplacent les noms de classes habituelles. C'est surtout utile quand vous voulez combiner le système de transition de Vue avec une bibliothèque d'animation CSS existante, comme [Animate.css](https://daneden.github.io/animate.css/).

Voici un exemple :

``` html
<link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">

<div id="example-3">
  <button @click="show = !show">
    Permuter
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">bonjour</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-3',
  data: {
    show: true
  }
})
```

{% raw %}
<link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
<div id="example-3" class="demo">
  <button @click="show = !show">
    Permuter
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">bonjour</p>
  </transition>
</div>
<script>
new Vue({
  el: '#example-3',
  data: {
    show: true
  }
})
</script>
{% endraw %}

### Utilisation simultanée des transitions et animations

Vue a besoin d'attacher des écouteurs d'évènement pour savoir quand une transition est terminée. Cela peut être `transitionend` ou `animationend`, selon le type de règles CSS appliquées. Si vous utilisez seulement l'une ou l'autre, Vue peut automatiquement déterminer le type correct.

Toutefois, dans certains cas, vous pouvez les avoir tous les deux sur le même élément, par exemple avoir une animation CSS déclenchée par Vue, ainsi qu'un effet de transition CSS lors du survol. Dans ces cas, vous devez explicitement déclarer le type dont vous voulez que Vue se soucie dans un attribut `type`, avec une valeur à `animation` ou `transition`.

### Durées de transition explicites

> Nouveau dans 2.2.0+

Dans la plupart des cas, Vue peut automatiquement déterminer quand la transition est terminée. Par défaut, Vue attend le premier évènement `transitionend` ou `animationend` sur l'élément de transition racine. Cependant, cela peut ne pas toujours être souhaité (par exemple, nous pouvons avoir une séquence de transition chorégraphiée où certains éléments internes imbriqués ont une transition retardée ou une durée de transition plus longue que l'élément de transition racine).

Dans ce cas, vous pouvez spécifier une durée de transition explicite (en millisecondes) en utilisant le prop `duration` sur le composant `<transition>` :

``` html
<transition :duration="1000">...</transition>
```

Vous pouvez également spécifier des valeurs séparées pour les durées de *enter* et *leave* :

``` html
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

### hooks JavaScript

Vous pouvez définir des hooks JavaScript dans les attributs :

``` html
<transition
  v-on:before-enter="beforeEnter"
  v-on:enter="enter"
  v-on:after-enter="afterEnter"
  v-on:enter-cancelled="enterCancelled"

  v-on:before-leave="beforeLeave"
  v-on:leave="leave"
  v-on:after-leave="afterLeave"
  v-on:leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>
```

``` js
// ...
methods: {
  // ----------
  // EN ENTRANT
  // ----------

  beforeEnter: function (el) {
    // ...
  },
  // la fonction de rappel done est facultative quand
  // utilisée en combinaison avec du CSS
  enter: function (el, done) {
    // ...
    done()
  },
  afterEnter: function (el) {
    // ...
  },
  enterCancelled: function (el) {
    // ...
  },

  // ----------
  // EN SORTANT
  // ----------

  beforeLeave: function (el) {
    // ...
  },
  // la fonction de rappel done est facultative quand
  // utilisée en combinaison avec du CSS
  leave: function (el, done) {
    // ...
    done()
  },
  afterLeave: function (el) {
    // ...
  },
  // leaveCancelled est uniquement disponible avec v-show
  leaveCancelled: function (el) {
    // ...
  }
}
```

Ces hooks peuvent être utilisés en combinaison avec des transitions/animations CSS ou sur eux-mêmes.

<p class="tip">Lors de l'utilisation de transitions uniquement JavaScript, **les fonctions de rappel `done` sont obligatoires pour les hooks `enter` et `leave`**. Dans le cas contraire, elles seront appelées de façon synchrone et la transition se terminera immédiatement.</p>

<p class="tip">C'est aussi une bonne idée d'ajouter explicitement `v-bind:css="false"` pour les transitions uniquement JavaScript afin que Vue puisse ignorer la détection CSS. Cela empêche également les règles CSS d'interférer accidentellement avec la transition.</p>

Maintenant, nous allons plonger dans un exemple. Voici une simple transition JavaScript à l'aide de Velocity.js :

``` html
<!--
Velocity fonctionne aussi bien que jQuery.animate et est
une excellente option pour les animations
-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="example-4">
  <button @click="show = !show">
    Permuter
  </button>
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
    v-bind:css="false"
  >
    <p v-if="show">
      Démo
    </p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-4',
  data: {
    show: false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
      Velocity(el, { fontSize: '1em' }, { complete: done })
    },
    leave: function (el, done) {
      Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      Velocity(el, {
        rotateZ: '45deg',
        translateY: '30px',
        translateX: '30px',
        opacity: 0
      }, { complete: done })
    }
  }
})
```

{% raw %}
<div id="example-4" class="demo">
  <button @click="show = !show">
    Permuter
  </button>
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">
      Démo
    </p>
  </transition>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<script>
new Vue({
  el: '#example-4',
  data: {
    show: false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.transformOrigin = 'left'
    },
    enter: function (el, done) {
      Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
      Velocity(el, { fontSize: '1em' }, { complete: done })
    },
    leave: function (el, done) {
      Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      Velocity(el, {
        rotateZ: '45deg',
        translateY: '30px',
        translateX: '30px',
        opacity: 0
      }, { complete: done })
    }
  }
})
</script>
{% endraw %}

## Transitions sur le rendu initial

Si vous souhaitez également appliquer une transition sur le rendu initial d'un nœud, vous pouvez ajouter l'attribut `appear` :

``` html
<transition appear>
  <!-- ... -->
</transition>
```

Par défaut, cela utilisera les transitions spécifiées pour l'entrée et la sortie. Si vous le souhaitez, vous pouvez également spécifier des classes CSS personnalisées :

``` html
<transition
  appear
  appear-class="custom-appear-class"
  appear-to-class="custom-appear-to-class" (2.1.8+)
  appear-active-class="custom-appear-active-class"
>
  <!-- ... -->
</transition>
```

et des hooks JavaScript personnalisés :

``` html
<transition
  appear
  v-on:before-appear="customBeforeAppearHook"
  v-on:appear="customAppearHook"
  v-on:after-appear="customAfterAppearHook"
  v-on:appear-cancelled="customAppearCancelledHook"
>
  <!-- ... -->
</transition>
```

## Transition entre éléments

Plus loin, nous parlons de [transition entre les composants](#transition-entre-les-composants), mais vous pouvez également faire une transition entre des éléments bruts en utilisant `v-if`/`v-else`.  L'une des transitions les plus courantes sur deux éléments est entre un conteneur de liste et un message décrivant une liste vide :

``` html
<transition>
  <table v-if="items.length > 0">
    <!-- ... -->
  </table>
  <p v-else>Désolé, aucun élément trouvé.</p>
</transition>
```

Cela fonctionne bien, mais il y a une mise en garde à connaitre :

<p class="tip">Lors de la permutation entre des éléments qui ont **le même nom de balise**, vous devez indiquer à Vue qu'ils sont des éléments distincts en lui donnant des attributs `key` uniques.  Sinon, le compilateur de Vue ne remplacera que le contenu de l'élément dans le but d'être efficace. Cependant, même si c'est techniquement inutile, **c'est considéré comme une bonne pratique de toujours avoir une clé pour chaque élément dans un composant `<transition>`.**</p>

Par exemple :

``` html
<transition>
  <button v-if="isEditing" key="save">
    Sauver
  </button>
  <button v-else key="edit">
    Modifier
  </button>
</transition>
```

Dans ces cas, vous pouvez aussi utiliser l'attribut `key` pour effectuer une transition entre différents états du même élément. Au lieu d'utiliser `v-if` et `v-else`, l'exemple ci-dessus pourrait être réécrit ainsi :

``` html
<transition>
  <button v-bind:key="isEditing">
    {{ isEditing ? 'Sauver' : 'Modifier' }}
  </button>
</transition>
```

Il est effectivement possible de faire une transition entre un nombre indéfini d'éléments, soit en utilisant plusieurs `v-if` ou soit en liant un élément unique à une propriété dynamique. Par exemple :

``` html
<transition>
  <button v-if="docState === 'saved'" key="saved">
    Modifier
  </button>
  <button v-if="docState === 'edited'" key="edited">
    Sauver
  </button>
  <button v-if="docState === 'editing'" key="editing">
    Annuler
  </button>
</transition>
```

Qui pourrait aussi s'écrire ainsi :

``` html
<transition>
  <button v-bind:key="docState">
    {{ buttonMessage }}
  </button>
</transition>
```

``` js
// ...
computed: {
  buttonMessage: function () {
    switch (this.docState) {
      case 'saved': return 'Modifier'
      case 'edited': return 'Sauver'
      case 'editing': return 'Annuler'
    }
  }
}
```

### Les modes de transition

Cependant, il existe encore un problème. Essayez de cliquer sur le bouton ci-dessous :

{% raw %}
<div id="no-mode-demo" class="demo">
  <transition name="no-mode-fade">
    <button v-if="on" key="on" @click="on = false">
      on
    </button>
    <button v-else key="off" @click="on = true">
      off
    </button>
  </transition>
</div>
<script>
new Vue({
  el: '#no-mode-demo',
  data: {
    on: false
  }
})
</script>
<style>
.no-mode-fade-enter-active, .no-mode-fade-leave-active {
  transition: opacity .5s
}
.no-mode-fade-enter, .no-mode-fade-leave-active {
  opacity: 0
}
</style>
{% endraw %}

Comme c'est une transition entre le bouton « on » et le bouton « off », les deux boutons sont rendus (l'un est en transition sortante pendant que l'autre est en transition entrante). Il s'agit du comportement par défaut de `<transition>` (l'entrée et la sortie se font simultanément).

Parfois, cela fonctionne très bien, comme lorsque des éléments de transition sont absolument positionnés l'un sur l'autre :

{% raw %}
<div id="no-mode-absolute-demo" class="demo">
  <div class="no-mode-absolute-demo-wrapper">
    <transition name="no-mode-absolute-fade">
      <button v-if="on" key="on" @click="on = false">
        on
      </button>
      <button v-else key="off" @click="on = true">
        off
      </button>
    </transition>
  </div>
</div>
<script>
new Vue({
  el: '#no-mode-absolute-demo',
  data: {
    on: false
  }
})
</script>
<style>
.no-mode-absolute-demo-wrapper {
  position: relative;
  height: 18px;
}
.no-mode-absolute-demo-wrapper button {
  position: absolute;
}
.no-mode-absolute-fade-enter-active, .no-mode-absolute-fade-leave-active {
  transition: opacity .5s;
}
.no-mode-absolute-fade-enter, .no-mode-absolute-fade-leave-active {
  opacity: 0;
}
</style>
{% endraw %}

Et puis cela peut être interprété comme des transitions de diapositives.

{% raw %}
<div id="no-mode-translate-demo" class="demo">
  <div class="no-mode-translate-demo-wrapper">
    <transition name="no-mode-translate-fade">
      <button v-if="on" key="on" @click="on = false">
        on
      </button>
      <button v-else key="off" @click="on = true">
        off
      </button>
    </transition>
  </div>
</div>
<script>
new Vue({
  el: '#no-mode-translate-demo',
  data: {
    on: false
  }
})
</script>
<style>
.no-mode-translate-demo-wrapper {
  position: relative;
  height: 18px;
}
.no-mode-translate-demo-wrapper button {
  position: absolute;
}
.no-mode-translate-fade-enter-active, .no-mode-translate-fade-leave-active {
  transition: all 1s;
}
.no-mode-translate-fade-enter, .no-mode-translate-fade-leave-active {
  opacity: 0;
}
.no-mode-translate-fade-enter {
  transform: translateX(31px);
}
.no-mode-translate-fade-leave-active {
  transform: translateX(-31px);
}
</style>
{% endraw %}

Les transitions simultanées d'entrée et de sortie ne sont pas toujours désirées, donc Vue propose des **modes de transition** alternatifs :

- `in-out`: La transition entrante du nouvel élément s'effectue en premier, puis une fois terminée, déclenche la transition sortante de l'élément courant.

- `out-in`: La transition sortante de l'élément courant s'effectue en premier, puis une fois terminée, déclenche la transition entrante du nouvel élément.

Maintenant, mettons à jour la transition pour nos boutons on/off avec `out-in` :

``` html
<transition name="fade" mode="out-in">
  <!-- ... les boutons ... -->
</transition>
```

{% raw %}
<div id="with-mode-demo" class="demo">
  <transition name="with-mode-fade" mode="out-in">
    <button v-if="on" key="on" @click="on = false">
      on
    </button>
    <button v-else key="off" @click="on = true">
      off
    </button>
  </transition>
</div>
<script>
new Vue({
  el: '#with-mode-demo',
  data: {
    on: false
  }
})
</script>
<style>
.with-mode-fade-enter-active, .with-mode-fade-leave-active {
  transition: opacity .5s
}
.with-mode-fade-enter, .with-mode-fade-leave-active {
  opacity: 0
}
</style>
{% endraw %}

Avec l'ajout d'un simple attribut, nous avons corrigé cette transition originale sans devoir ajouter un style spécial.

Le mode `in-out` n'est pas utilisé aussi souvent, mais peut parfois être utile pour un effet de transition un peu différent. Essayons de le combiner avec la transition diapositive sur laquelle nous avons travaillé précédemment.

{% raw %}
<div id="in-out-translate-demo" class="demo">
  <div class="in-out-translate-demo-wrapper">
    <transition name="in-out-translate-fade" mode="in-out">
      <button v-if="on" key="on" @click="on = false">
        on
      </button>
      <button v-else key="off" @click="on = true">
        off
      </button>
    </transition>
  </div>
</div>
<script>
new Vue({
  el: '#in-out-translate-demo',
  data: {
    on: false
  }
})
</script>
<style>
.in-out-translate-demo-wrapper {
  position: relative;
  height: 18px;
}
.in-out-translate-demo-wrapper button {
  position: absolute;
}
.in-out-translate-fade-enter-active, .in-out-translate-fade-leave-active {
  transition: all .5s;
}
.in-out-translate-fade-enter, .in-out-translate-fade-leave-active {
  opacity: 0;
}
.in-out-translate-fade-enter {
  transform: translateX(31px);
}
.in-out-translate-fade-leave-active {
  transform: translateX(-31px);
}
</style>
{% endraw %}

Assez cool, non ?

## Transition entre les composants

Faire une transition entre les composants est encore plus simple (nous n'avons même pas besoin de l'attribut `key`). Au lieu de cela, nous les enveloppons simplement d'un [composant dynamique](components.html#Composants-dynamiques) :

``` html
<transition name="component-fade" mode="out-in">
  <component v-bind:is="view"></component>
</transition>
```

``` js
new Vue({
  el: '#transition-components-demo',
  data: {
    view: 'v-a'
  },
  components: {
    'v-a': {
      template: '<div>Composant A</div>'
    },
    'v-b': {
      template: '<div>Composant B</div>'
    }
  }
})
```

``` css
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active avant la 2.1.8 */ {
  opacity: 0;
}
```

{% raw %}
<div id="transition-components-demo" class="demo">
  <input v-model="view" type="radio" value="v-a" id="a" name="view"><label for="a">A</label>
  <input v-model="view" type="radio" value="v-b" id="b" name="view"><label for="b">B</label>
  <transition name="component-fade" mode="out-in">
    <component v-bind:is="view"></component>
  </transition>
</div>
<style>
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to {
  opacity: 0;
}
</style>
<script>
new Vue({
  el: '#transition-components-demo',
  data: {
    view: 'v-a'
  },
  components: {
    'v-a': {
      template: '<div>Composant A</div>'
    },
    'v-b': {
      template: '<div>Composant B</div>'
    }
  }
})
</script>
{% endraw %}

## Transitions de liste

Jusqu'à présent, nous avons réalisé des transitions pour :

- des nœuds individuels
- des nœuds multiples où un seul est rendu à la fois

Alors, qu'en est-il lorsque nous avons une liste complète d'éléments où nous voulons faire un rendu simultané, par exemple avec `v-for` ? Dans ce cas, nous allons utiliser le composant `<transition-group>`. Cependant avant de plonger dans un exemple, il y a quelques éléments importants à connaitre sur ce composant :

- Contrairement à `<transition>`, il rend un élément réel : par défaut un `<span>`. Vous pouvez modifier l'élément rendu avec l'attribut `tag`.
- Les éléments à l'intérieur **doivent toujours avoir** un attribut `key` unique

### Transitions de liste entrantes/sortantes

Maintenant, nous allons nous plonger dans un exemple simple, faire des transitions entrantes et sortantes en utilisant les mêmes classes CSS que celles utilisées précédemment :

``` html
<div id="list-demo">
  <button v-on:click="add">Ajouter</button>
  <button v-on:click="remove">Enlever</button>
  <transition-group name="list" tag="p">
    <span v-for="item in items" v-bind:key="item" class="list-item">
      {{ item }}
    </span>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
  }
})
```

``` css
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
```

{% raw %}
<div id="list-demo" class="demo">
  <button v-on:click="add">Ajouter</button>
  <button v-on:click="remove">Enlever</button>
  <transition-group name="list" tag="p">
    <span v-for="item in items" :key="item" class="list-item">
      {{ item }}
    </span>
  </transition-group>
</div>
<script>
new Vue({
  el: '#list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
  }
})
</script>
<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
{% endraw %}

Il y a un problème avec cet exemple. Quand vous ajoutez ou enlevez un élément, ceux qui l'entourent se placent instantanément dans leur nouvel emplacement au lieu de se déplacer en douceur. Nous allons régler cela plus tard.

### Transitions de déplacement de liste

Le composant `<transition-group>` a un autre tour dans son sac. Il peut non seulement animer l'entrée et la sortie, mais aussi faire des changements de position. Le seul nouveau concept que vous devez connaitre pour utiliser cette fonctionnalité, c'est l'addition de **la classe `v-move`**,  qui est ajoutée quand les éléments changent de position. Comme les autres classes, son préfixe correspondra à la valeur d'un attribut `name` fourni et vous pouvez également spécifier manuellement une classe avec l'attribut `move-class`.

Cette classe est surtout utile pour spécifier le temps de la transition et la courbe d'accélération, comme vous pourrez le voir ci-dessous :

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>

<div id="flip-list-demo" class="demo">
  <button v-on:click="shuffle">Mélanger</button>
  <transition-group name="flip-list" tag="ul">
    <li v-for="item in items" v-bind:key="item">
      {{ item }}
    </li>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#flip-list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9]
  },
  methods: {
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
```

``` css
.flip-list-move {
  transition: transform 1s;
}
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>
<div id="flip-list-demo" class="demo">
  <button v-on:click="shuffle">Mélanger</button>
  <transition-group name="flip-list" tag="ul">
    <li v-for="item in items" :key="item">
      {{ item }}
    </li>
  </transition-group>
</div>
<script>
new Vue({
  el: '#flip-list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9]
  },
  methods: {
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
</script>
<style>
.flip-list-move {
  transition: transform 1s;
}
</style>
{% endraw %}

Cela peut sembler magique, mais sous le capot, Vue utilise une technique simple d'animation appelée [FLIP](https://aerotwist.com/blog/flip-your-animations/)  pour transiter en douceur les éléments de leur ancienne position vers la nouvelle à l'aide de transformations.

Nous pouvons combiner cette technique avec notre implémentation précédente pour animer chaque changement possible dans notre liste !

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>

<div id="list-complete-demo" class="demo">
  <button v-on:click="shuffle">Mélanger</button>
  <button v-on:click="add">Ajouter</button>
  <button v-on:click="remove">Enlever</button>
  <transition-group name="list-complete" tag="p">
    <span
      v-for="item in items"
      v-bind:key="item"
      class="list-complete-item"
    >
      {{ item }}
    </span>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#list-complete-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
```

``` css
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>
<div id="list-complete-demo" class="demo">
  <button v-on:click="shuffle">Mélanger</button>
  <button v-on:click="add">Ajouter</button>
  <button v-on:click="remove">Enlever</button>
  <transition-group name="list-complete" tag="p">
    <span v-for="item in items" :key="item" class="list-complete-item">
      {{ item }}
    </span>
  </transition-group>
</div>
<script>
new Vue({
  el: '#list-complete-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
</script>
<style>
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
{% endraw %}

<p class="tip">Un point important est a noter : ces transitions FLIP ne fonctionnent pas si des éléments sont configurés avec `display: inline`. Comme alternative, vous pouvez utiliser `display: inline-block` où placer des éléments dans un contexte flexible.</p>

Ces animations FLIP ne se limitent pas à un seul axe. Les éléments dans une grille multidimensionnelle peuvent être transitionnés [aussi facilement](https://jsfiddle.net/chrisvfritz/sLrhk1bc/) :

{% raw %}
<div id="sudoku-demo" class="demo">
  <strong>Sudoku de fainéant</strong>
  <p>Continuez à appuyer sur le bouton Mélanger jusqu'à ce que vous gagnez.</p>
  <button @click="shuffle">
    Mélanger
  </button>
  <transition-group name="cell" tag="div" class="sudoku-container">
    <div v-for="cell in cells" :key="cell.id" class="cell">
      {{ cell.number }}
    </div>
  </transition-group>
</div>
<script>
new Vue({
  el: '#sudoku-demo',
  data: {
    cells: Array.apply(null, { length: 81 })
      .map(function (_, index) {
        return {
          id: index,
          number: index % 9 + 1
        }
      })
  },
  methods: {
    shuffle: function () {
      this.cells = _.shuffle(this.cells)
    }
  }
})
</script>
<style>
.sudoku-container {
  display: flex;
  flex-wrap: wrap;
  width: 238px;
  margin-top: 10px;
}
.cell {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 25px;
  height: 25px;
  border: 1px solid #aaa;
  margin-right: -1px;
  margin-bottom: -1px;
}
.cell:nth-child(3n) {
  margin-right: 0;
}
.cell:nth-child(27n) {
  margin-bottom: 0;
}
.cell-move {
  transition: transform 1s;
}
</style>
{% endraw %}

### Échelonnage des transitions de liste

En communiquant avec des transitions JavaScript via des attributs de données, il est également possible d'échelonner les transitions dans une liste :

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="staggered-list-demo">
  <input v-model="query">
  <transition-group
    name="staggered-fade"
    tag="ul"
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <li
      v-for="(item, index) in computedList"
      v-bind:key="item.msg"
      v-bind:data-index="index"
    >{{ item.msg }}</li>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#staggered-list-demo',
  data: {
    query: '',
    list: [
      { msg: 'Bruce Lee' },
      { msg: 'Jackie Chan' },
      { msg: 'Chuck Norris' },
      { msg: 'Jet Li' },
      { msg: 'Kung Fury' }
    ]
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    }
  }
})
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<div id="example-5" class="demo">
  <input v-model="query">
  <transition-group
    name="staggered-fade"
    tag="ul"
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <li
      v-for="(item, index) in computedList"
      v-bind:key="item.msg"
      v-bind:data-index="index"
    >{{ item.msg }}</li>
  </transition-group>
</div>
<script>
new Vue({
  el: '#example-5',
  data: {
    query: '',
    list: [
      { msg: 'Bruce Lee' },
      { msg: 'Jackie Chan' },
      { msg: 'Chuck Norris' },
      { msg: 'Jet Li' },
      { msg: 'Kung Fury' }
    ]
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    }
  }
})
</script>
{% endraw %}

## Transitions réutilisables

Les Transitions peuvent être réutilisées par le biais du système de composant de Vue. Pour créer une transition réutilisable, il suffit de placer un composant `<transition>` ou `<transition-group>` à la racine, puis passer les enfants dans le composant de transition.

Voici un exemple utilisant un composant template :

``` js
Vue.component('my-special-transition', {
  template: '\
    <transition\
      name="very-special-transition"\
      mode="out-in"\
      v-on:before-enter="beforeEnter"\
      v-on:after-enter="afterEnter"\
    >\
      <slot></slot>\
    </transition>\
  ',
  methods: {
    beforeEnter: function (el) {
      // ...
    },
    afterEnter: function (el) {
      // ...
    }
  }
})
```

Et les composants fonctionnels sont particulièrement adaptés à cette tâche :

``` js
Vue.component('my-special-transition', {
  functional: true,
  render: function (createElement, context) {
    var data = {
      props: {
        name: 'very-special-transition',
        mode: 'out-in'
      },
      on: {
        beforeEnter: function (el) {
          // ...
        },
        afterEnter: function (el) {
          // ...
        }
      }
    }
    return createElement('transition', data, context.children)
  }
})
```

## Transitions dynamiques

Oui, même les transitions dans Vue sont pilotées par les données ! Le plus simple des exemples d'une transition dynamique lie l'attribut `name` à une propriété dynamique.

```html
<transition v-bind:name="transitionName">
  <!-- ... -->
</transition>
```

Cela peut être utile quand vous avez défini des transitions/animations CSS à l'aide des conventions de classes de transition de Vue et que vous souhaitez simplement basculer entre elles.

En vérité, tout attribut de transition peut être dynamiquement lié. Et il ne s'agit pas seulement des attributs. Étant donné que les hooks d'évènements ne sont que des méthodes, ils ont accès à toutes les données dans le contexte. Cela signifie que selon l'état de votre composant, vos transitions JavaScript peuvent se comporter différemment.

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="dynamic-fade-demo" class="demo">
  Fondu entrant : <input type="range" v-model="fadeInDuration" min="0" v-bind:max="maxFadeDuration">
  Fondu sortant : <input type="range" v-model="fadeOutDuration" min="0" v-bind:max="maxFadeDuration">
  <transition
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">bonjour</p>
  </transition>
  <button
    v-if="stop"
    v-on:click="stop = false; show = false"
  >Commencer l'animation</button>
  <button
    v-else
    v-on:click="stop = true"
  >Arrêter ça !</button>
</div>
```

``` js
new Vue({
  el: '#dynamic-fade-demo',
  data: {
    show: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
    maxFadeDuration: 1500,
    stop: true
  },
  mounted: function () {
    this.show = false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 1 },
        {
          duration: this.fadeInDuration,
          complete: function () {
            done()
            if (!vm.stop) vm.show = false
          }
        }
      )
    },
    leave: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 0 },
        {
          duration: this.fadeOutDuration,
          complete: function () {
            done()
            vm.show = true
          }
        }
      )
    }
  }
})
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<div id="dynamic-fade-demo" class="demo">
  Fondu entrant : <input type="range" v-model="fadeInDuration" min="0" v-bind:max="maxFadeDuration">
  Fondu sortant : <input type="range" v-model="fadeOutDuration" min="0" v-bind:max="maxFadeDuration">
  <transition
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">bonjour</p>
  </transition>
  <button
    v-if="stop"
    v-on:click="stop = false; show = false"
  >Commencer l'animation</button>
  <button
    v-else
    v-on:click="stop = true"
  >Arrêtez ça !</button>
</div>
<script>
new Vue({
  el: '#dynamic-fade-demo',
  data: {
    show: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
    maxFadeDuration: 1500,
    stop: true
  },
  mounted: function () {
    this.show = false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 1 },
        {
          duration: this.fadeInDuration,
          complete: function () {
            done()
            if (!vm.stop) vm.show = false
          }
        }
      )
    },
    leave: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 0 },
        {
          duration: this.fadeOutDuration,
          complete: function () {
            done()
            vm.show = true
          }
        }
      )
    }
  }
})
</script>
{% endraw %}

Finalement, le meilleur moyen de créer des transitions dynamiques, c'est par le biais de composants qui acceptent des props pour changer la nature des transitions à utiliser. Cela peut sembler mielleux, mais la seule limite est votre imagination.
