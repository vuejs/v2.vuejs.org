---
title: Filtros
type: guide
order: 305
---

Vue permite que você defina filtros que podem ser utilizados para aplicação de formatações de texto corriqueiras. Filtros são permitidos em **interpolações _mustache_ e expressões `v-bind`** (sendo a última suportada em 2.1.0+). Filtros podem ser acrescidos ao final de uma expressão JavaScript, sendo denotados pelo símbolo _"pipe"_:

``` html
<!-- em interpolações de texto -->
{{ message | capitalize }}

<!-- em interligações de atributos -->
<div v-bind:id="rawId | formatId"></div>
```

Você pode definir filtros locais nas opções dos componentes:

``` js
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

Ou definir um filtro globalmente:

``` js
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
```

Abaixo está um exemplo de nosso filtro `capitalize` sendo utilizado:

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
        message: 'algo'
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

A função de filtro sempre recebe o valor da expressão (o resultado da cadeia de execução até aquele momento) como seu primeiro argumento. No exemplo acima, a função de filtro `capitalize` irá receber o valor de `message` como seu argumento. 

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
