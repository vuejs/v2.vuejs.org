---
title: Propriétés calculées et observateurs
type: guide
order: 5
---

## Propriétés calculées

Les expressions dans le template sont très pratiques, mais elles sont uniquement destinées à des opérations simples. Mettre trop de logique dans vos templates peut les rendre trop verbeux et difficiles à maintenir. Par exemple :

``` html
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```

À ce stade, le template n'est ni simple, ni déclaratif. Vous devez le regarder pendant une seconde avant de réaliser qu'il affiche `message` dans le sens inverse. Le problème s'aggrave lorsque vous souhaitez inclure le message inversé plusieurs fois dans votre template.

C'est pourquoi vous devriez utiliser des **propriétés calculées** pour toute logique complexe.

### Exemple basique

``` html
<div id="example">
  <p>Message original : "{{ message }}"</p>
  <p>Message inversé calculé : "{{ reversedMessage }}"</p>
</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Bonjour'
  },
  computed: {
    // un accesseur (getter) calculé
    reversedMessage: function () {
      // `this` pointe sur l'instance vm
      return this.message.split('').reverse().join('')
    }
  }
})
```

Résultat :

{% raw %}
<div id="example" class="demo">
  <p>Message original : "{{ message }}"</p>
  <p>Message inversé calculé : "{{ reversedMessage }}"</p>
</div>
<script>
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Bonjour'
  },
  computed: {
    reversedMessage: function () {
      return this.message.split('').reverse().join('')
    }
  }
})
</script>
{% endraw %}

Ici, nous avons déclaré une propriété calculée `reversedMessage`. La fonction que nous avons fournie sera utilisée comme une fonction accesseur (getter) pour la propriété `vm.reversedMessage` :

``` js
console.log(vm.reversedMessage) // -> 'ruojnoB'
vm.message = 'Au revoir'
console.log(vm.reversedMessage) // -> 'riover uA'
```

Vous pouvez ouvrir la console et jouer vous-même avec l'exemple de vm. La valeur de `vm.reversedMessage` dépend toujours de la valeur de `vm.message`.

Vous pouvez lier des données aux propriétés calculées dans les templates comme une propriété normale. Vue est au courant que `vm.reversedMessage` dépend de `vm.message`, donc il mettra à jour toutes les liaisons qui dépendent de `vm.reversedMessage` lorsque `vm.message` changera. Et le mieux dans tout cela est que nous avons crée cette relation de dépendance de façon déclarative : la fonction de l'accesseur calculé n'a pas d'effets secondaires, ce qui la rend facile à tester et à raisonner.

### Mise en cache dans `computed` vs `methods`

Vous avez peut-être remarqué que nous pouvons accomplir le même résultat en invoquant une méthode dans l'expression :

``` html
<p>Message inversé : "{{ reverseMessage() }}"</p>
```

``` js
// dans le composant
methods: {
  reverseMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
```

Au lieu d'une propriété calculée, nous pouvons définir la même fonction en tant que méthode. Pour le résultat final, les deux approches sont en effet exactement les mêmes. Cependant, la différence est que **les propriétés déclarées dans `computed` sont mises en cache selon leurs dépendances.** Une propriété calculée sera réévaluée uniquement quand certaines de ses dépendances auront changé. Cela signifie que tant que `message` n'a pas changé, les multiples accès à la propriété calculée `reversedMessage` retourneront immédiatement le résultat précédemment calculé sans avoir à réexécuter la fonction.

Cela signifie également que la propriété calculée suivante ne sera jamais mise à jour, parce que `Date.now()` n'est pas une dépendance réactive :

``` js
computed: {
  now: function () {
    return Date.now()
  }
}
```

En comparaison, une invocation de méthode exécutera **toujours** la fonction à chaque fois que se produira un re-déclenchement du rendu.

Pourquoi avons-nous besoin de mettre en cache ? Imaginez que nous avons une propriété calculée coûteuse **A**, qui exige une boucle dans un énorme tableau et qui fait beaucoup de calculs. Alors nous pouvons avoir d’autres propriétés calculées qui dépendent à leur tour de **A**. Sans la mise en cache, nous exécuterions l'accesseur de **A** autant de fois que nécessaire ! Dans les cas où vous ne souhaitez pas la mise en cache, utilisez une méthode à la place.

### Propriétés calculées vs observées

Vue fournit une façon plus générique d'observer et de réagir aux changements de données sur une instance de Vue : **les propriétés watch**. Quand vous avez des données qu'il faut changer selon d'autres données, il est tentant d'abuser de `watch` (surtout si vous venez du monde d'AngularJS). Toutefois, il est souvent préférable d’utiliser une propriété calculée et non une fonction de rappel impérative comme `watch`. Considérez cet exemple :

``` html
<div id="demo">{{ fullName }}</div>
```

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})
```

Le code ci-dessus est impératif et répétitif. Comparez-le avec une version de propriété calculée :

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

C'est mieux, n'est-ce pas ?

### Mutateur calculé

Les propriétés calculées ont par défaut uniquement un accesseur, mais vous pouvez également fournir un mutateur (setter) quand vous en avez besoin :

``` js
// ...
computed: {
  fullName: {
    // accesseur
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // mutateur
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

Maintenant, lorsque vous exécutez `vm.fullName = 'John Doe'`, le mutateur sera invoqué, `vm.firstName` et `vm.lastName` seront mis à jour en conséquence.

## Observateurs

Bien que les propriétés calculées soient plus appropriées dans la plupart des cas, parfois un observateur personnalisé est nécessaire. C'est pour cela que Vue fournit une façon plus générique de réagir aux changements de données à travers l'option `watch`. Ceci est très utile lorsque vous souhaitez exécuter des opérations asynchrones ou coûteuses en réponse à des données changeantes.

Par exemple :

``` html
<div id="watch-example">
  <p>
    Posez votre question (réponse par Oui ou Non) :
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
```

``` html
<!-- Puisqu'il y a déjà un riche écosystème de bibliothèques ajax      -->
<!-- et de collections de méthodes d'utilité générale, en ne les       -->
<!-- réinventant pas, le noyau de Vue peut rester petit. Cela vous     -->
<!-- donne aussi la liberté d’utiliser tout ce qui vous est familier. -->
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'Je ne peux pas vous donner une réponse avant que vous ne posiez une question !'
  },
  watch: {
    // à chaque fois que la question change, cette fonction s'exécutera
    question: function (newQuestion) {
      this.answer = "J'attends que vous arrêtiez de taper..."
      this.getAnswer()
    }
  },
  methods: {
    // _.debounce est une fonction fournie par lodash pour limiter la fréquence
    // d'exécution d'une opération particulièrement coûteuse.
    // Dans ce cas, nous voulons limiter la fréquence d'accès à
    // yesno.wtf/api, en attendant que l'utilisateur ait complètement
    // fini de taper avant de faire la requête ajax. Pour en savoir
    //  plus sur la fonction _.debounce (et sa cousine
    // _.throttle), visitez : https://lodash.com/docs#debounce
    getAnswer: _.debounce(
      function () {
        if (this.question.indexOf('?') === -1) {
          this.answer = "Les questions contiennent généralement un point d'interrogation. ;-)"
          return
        }
        this.answer = 'Je réfléchis...'
        var vm = this
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = "Erreur ! Impossible d'accéder à l'API." + error
          })
      },
      // C'est le nombre de millisecondes que nous attendons
      // pour que l’utilisateur arrête de taper.
      500
    )
  }
})
</script>
```

Result:

{% raw %}
<div id="watch-example" class="demo">
  <p>
    Posez votre question (réponse par Oui ou Non) :
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'Je ne peux pas vous donner une réponse avant que vous ne posiez une question !'
  },
  watch: {
    question: function (newQuestion) {
      this.answer = "J'attends que vous arrêtiez de taper..."
      this.getAnswer()
    }
  },
  methods: {
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (this.question.indexOf('?') === -1) {
          vm.answer = "Les questions contiennent généralement un point d'interrogation. ;-)"
          return
        }
        vm.answer = 'Je réfléchis...'
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = "Erreur ! Impossible d'accéder à l'API." + error
          })
      },
      500
    )
  }
})
</script>
{% endraw %}

Dans ce cas, l'utilisation de l'option `watch` nous permet d'effectuer une opération asynchrone (accéder à une API), de limiter la fréquence d'exécution de cette opération et de définir des états intermédiaires jusqu'à ce que nous obtenions une réponse finale. Rien de tout cela ne serait possible avec une propriété calculée.

En plus de l'option `watch`, vous pouvez aussi utiliser [l'API vm.$watch](../api/#vm-watch).
