---
title: Filtros
type: guide
order: 305
---

Vue permite que você defina filtros que podem ser utilizados para aplicação de formatações de texto corriqueiras. Filtros são permitidos em **interpolações _mustache_ e expressões `v-bind`** (sendo a última suportada em 2.1.0+). Filtros podem ser acrescidos ao final de uma expressão JavaScript, sendo denotados pelo símbolo "_pipe_":

``` html
<!-- em interpolações de texto -->
{{ message | capitalize }}

<!-- em interligações de atributos -->
<div v-bind:id="rawId | formatId"></div>
```

A função `filter` sempre recebe o valor da expressão (o resultado da cadeia de execução antes da chamada do filtro) como seu primeiro argumento. Neste exemplo, a função de filtro `capitalize` irá receber o valor de `message` como argumento.

``` js
new Vue({
  // ...
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
})
```

Filtros podem ser encadeados:

``` html
{{ message | filterA | filterB }}
```

Neste caso, `filterA` é definida para receber **um único argumento**, obtendo o valor de `message` neste argumento, então a função `filterB` será chamada com o resultado de `filterA` sendo passado como o único argumento de `filterB`.

Filtros são simplesmente funções JavaScript, então podem aceitar mais argumentos:

``` html
{{ message | filterA('arg1', arg2) }}
```

Aqui, a função `filterA` é definida para receber **três argumentos**. O valor de `message` será passado como seu primeiro argumento. Como segundo argumento, a String pura `'arg1'` será passada à função `filterA`. Por fim, o valor da expressão `arg2` será avaliado e o resultado passado como terceiro argumento.
