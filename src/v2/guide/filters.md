---
title: Filtres
type: guide
order: 305
---

Vue.js permet de définir des filtres qui peuvent être utilisés pour appliquer des formatages de textes courants. Les filtres sont utilisables à deux endroits : **les interpolations à moustaches et les expressions de v-bind** (ces dernières étant supportées depuis la 2.1.0+). Les filtres doivent être ajoutés à la fin de l'expression JavaScript, indiqués par le symbole de la barre verticale :

``` html
<!-- dans les moustaches -->
{{ message | capitalize }}

<!-- dans les v-bind -->
<div v-bind:id="rawId | formatId"></div>
```

Vous pouvez définir les filtres locaux dans les options d'un composant :

``` js
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

ou définir un filtre globalement:

``` js
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
```

Ci-dessous un exemple du filtre `capitalize` en action :

{% raw %}
<div id="example_1" class="demo">
  <input type="text" v-model="message">
  <p>{{ message | capitalize }}</p>
</div>
<script>
  new Vue({
    el: '#example_1',
    data: function () {
      return {
        message: 'john'
      }
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
  })
</script>
{% endraw %}

La fonction de filtre reçoit toujours la valeur de l'expression (le résultat de la chaine) comme premier argument. Dans cet exemple, la fonction de filtre `capitalize` va recevoir la valeur de `message` dans son argument.

Les filtres peuvent être chainés :

``` html
{{ message | filterA | filterB }}
```

Dans ce cas, `filterA`, défini avec un seul argument, va recevoir la valeur de `message`. Puis la fonction `filterB` va être appelée avec le résultat de `filterA` passé dans `filterB` en tant que simple argument.

Les filtres sont des fonctions JavaScript et peuvent donc recevoir des arguments :

``` html
{{ message | filterA('arg1', arg2) }}
```

Ici `filterA` est définie comme une fonction prenant trois arguments. La valeur de `message` va être passée en premier argument. La chaine de caractères `'arg1'` sera passée au filtre `filterA` en tant que second argument, et la valeur de l'expression `arg2` sera évaluée et passée en tant que troisième argument.
