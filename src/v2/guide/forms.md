---
title: Interligações em Formulários
type: guide
order: 10
---

## Uso Básico

Você pode usar a diretiva `v-model` para criar interligações de mão dupla (_two-way binding_) entre os dados e elementos como _input_ e _textarea_ de formulários. A diretiva automaticamente busca a maneira correta de atualizar o elemento com base no tipo de entrada. Embora um pouco mágico, `v-model` é essencialmente açúcar sintático para atualização de dados através de eventos de entrada do usuário, além de cuidados especiais para alguns casos extremos.

<p class="tip">A diretiva `v-model` irá ignorar o estado inicial de `value`, `checked` ou `selected` encontrado em qualquer elemento de formulário. Sempre se tratará a instância Vue como a fonte dos dados verdadeiros. Ou seja, declare os valores iniciais no lado JavaScript, dentro da opção `data` de seu componente.</p>

<p class="tip" id="vmodel-ime-tip">Para linguagens que requerem um [IME](https://en.wikipedia.org/wiki/Input_method) (Chinês, Japonês, Coreano etc.), você notará que `v-model` não é atualizado durante a atualização da composição IME. Se você quiser atender a estas atualizações, use o evento `input` ao invés do `v-model`.</p>

### Input

``` html
<input v-model="message" placeholder="Me edite">
<p>A mensagem é: {{ message }}</p>
```

{% raw %}
<div id="example-1" class="demo">
  <input v-model="message" placeholder="Me edite">
  <p>A mensagem é: {{ message }}</p>
</div>
<script>
new Vue({
  el: '#example-1',
  data: {
    message: ''
  }
})
</script>
{% endraw %}

### Textarea

``` html
<<<<<<< HEAD
<span>Mensagem com múltiplas linhas:</span>
<p style="white-space: pre-line">{{ message }}</p>
=======
<span>Multiline message is:</span>
<p style="white-space: pre-line;">{{ message }}</p>
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454
<br>
<textarea v-model="message" placeholder="Escreva bastante"></textarea>
```

{% raw %}
<div id="example-textarea" class="demo">
<<<<<<< HEAD
  <span>Mensagem com múltiplas linhas:</span>
  <p style="white-space: pre-line">{{ message }}</p>
=======
  <span>Multiline message is:</span>
  <p style="white-space: pre-line;">{{ message }}</p>
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454
  <br>
  <textarea v-model="message" placeholder="Escreva bastante"></textarea>
</div>
<script>
new Vue({
  el: '#example-textarea',
  data: {
    message: ''
  }
})
</script>
{% endraw %}

{% raw %}
<p class="tip">Interpolação em <i>textareas</i> (<code>&lt;textarea&gt;{{text}}&lt;/textarea&gt;</code>) não funciona. Em vez disso, sempre use <code>v-model</code>.</p>
{% endraw %}

### Checkbox

_Checkbox_ simples com valor boleano:

``` html
<input type="checkbox" id="checkbox" v-model="checked">
<label for="checkbox">{{ checked }}</label>
```
{% raw %}
<div id="example-2" class="demo">
  <input type="checkbox" id="checkbox" v-model="checked">
  <label for="checkbox">{{ checked }}</label>
</div>
<script>
new Vue({
  el: '#example-2',
  data: {
    checked: false
  }
})
</script>
{% endraw %}

Múltiplos _checkboxes_, associados a um mesmo Array:

``` html
<div id="example-3">
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>
  <br>
<<<<<<< HEAD
  <span>Nomes assinalados: {{ checkedNames }}</span>
=======
  <span>Checked names: {{ checkedNames }}</span>
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454
</div>
```

``` js
new Vue({
  el: '#example-3',
  data: {
    checkedNames: []
  }
})
```

{% raw %}
<div id="example-3" class="demo">
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>
  <br>
  <span>Nomes assinalados: {{ checkedNames }}</span>
</div>
<script>
new Vue({
  el: '#example-3',
  data: {
    checkedNames: []
  }
})
</script>
{% endraw %}

### Radio

``` html
<input type="radio" id="one" value="Um" v-model="picked">
<label for="one">Um</label>
<br>
<input type="radio" id="two" value="Dois" v-model="picked">
<label for="two">Dois</label>
<br>
<span>Escolhido: {{ picked }}</span>
```
{% raw %}
<div id="example-4" class="demo">
  <input type="radio" id="one" value="Um" v-model="picked">
  <label for="one">Um</label>
  <br>
  <input type="radio" id="two" value="Dois" v-model="picked">
  <label for="two">Dois</label>
  <br>
  <span>Escolhido: {{ picked }}</span>
</div>
<script>
new Vue({
  el: '#example-4',
  data: {
    picked: ''
  }
})
</script>
{% endraw %}

### Select

Seleção de um único item:

``` html
<select v-model="selected">
  <option disabled value="">Escolha um item</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br>
<span>Selecionado: {{ selected }}</span>
```
``` js
new Vue({
  el: '...',
  data: {
    selected: ''
  }
})
```
{% raw %}
<div id="example-5" class="demo">
  <select v-model="selected">
    <option disabled value="">Escolha um item</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <br>
  <span>Selecionado: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-5',
  data: {
    selected: ''
  }
})
</script>
{% endraw %}

<p class="tip">Se o valor inicial da expressão `v-model` não corresponder a nenhuma das opções, o `<select>` será renderizado como "não selecionado". No iOS, isso impedirá o usuário de selecionar o primeiro item, pois não há disparo de eventos de alteração neste caso. Recomenda-se fornecer uma opção desativada com um valor vazio, como demonstrado no exemplo acima.</p>

Seleção de múltiplos itens (vinculando a um Array):

``` html
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br>
<span>Selecionados: {{ selected }}</span>
```
{% raw %}
<div id="example-6" class="demo">
  <select v-model="selected" multiple style="width: 50px;">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <br>
  <span>Selecionados: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-6',
  data: {
    selected: []
  }
})
</script>
{% endraw %}

É possível renderizar dinamicamente as _options_ com `v-for`:

``` html
<select v-model="selected">
  <option v-for="option in options" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
<br>
<span>Selecionado: {{ selected }}</span>
```
``` js
new Vue({
  el: '...',
  data: {
    selected: 'A',
    options: [
      { text: 'Um', value: 'A' },
      { text: 'Dois', value: 'B' },
      { text: 'Três', value: 'C' }
    ]
  }
})
```
{% raw %}
<div id="example-7" class="demo">
  <select v-model="selected">
    <option v-for="option in options" v-bind:value="option.value">
      {{ option.text }}
    </option>
  </select>
  <br>
  <span>Selecionado: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-7',
  data: {
    selected: 'A',
    options: [
      { text: 'Um', value: 'A' },
      { text: 'Dois', value: 'B' },
      { text: 'Três', value: 'C' }
    ]
  }
})
</script>
{% endraw %}

## Vinculando aos Valores

Para _radio_, _checkbox_ e _options_ de _select_, os valores de vinculação do `v-model` são normalmente Strings estáticas (ou boleano no caso do _checkbox_):

``` html
<!-- `picked` é uma string "a" quando assinalado -->
<input type="radio" v-model="picked" value="a">

<!-- `toggle` é verdadeiro ou falso -->
<input type="checkbox" v-model="toggle">

<!-- `selected` é uma string "abc" quando assinalado -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

Mas, às vezes, podemos querer vincular o valor de uma propriedade dinâmica disponível na instância Vue. Podemos usar `v-bind` para alcançar este objetivo. Além disso, usar `v-bind` nos permite vincular o valor de _inputs_ para valores não-String.

### Checkbox

``` html
<input
  type="checkbox"
  v-model="toggle"
  v-bind:true-value="a"
  v-bind:false-value="b"
>
```

``` js
// quando está assinalado:
vm.toggle === vm.a
// quando não está assinalado:
vm.toggle === vm.b
```

### Radio

``` html
<input type="radio" v-model="pick" v-bind:value="a">
```

``` js
// quando está assinalado:
vm.pick === vm.a
```

### Select

``` html
<select v-model="selected">
  <!-- Objeto literal atribuído para demonstração -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>
```

``` js
// quando está assinalado:
typeof vm.selected // => 'object'
vm.selected.number // => 123
```

## Modificadores

### `.lazy`

Por padrão, `v-model` sincroniza o elemento com os dados após cada evento do tipo `input` (com exceção para o caso de composição IME [descrito anteriormente](#vmodel-ime-tip)). Adicionando o modificador `lazy`, a sincronização ocorrerá somente após o evento `change`:

``` html
<!-- sincronizado depois do "change" ao invés de "input" -->
<input v-model.lazy="msg" >
```

### `.number`

Se você quiser que a entrada do usuário seja automaticamente convertida para um número, pode ser feito adicionando o modificador `number` ao `v-model` do elemento:

``` html
<input v-model.number="age" type="number">
```

Isso é bastante útil, porque mesmo no caso de `type="number"`, o valor retornado pelo HTML é sempre uma String.

### `.trim`

Se você quiser que a entrada do usuário seja automaticamente isenta de espaços no início e no fim do texto, você pode adicionar o modificador `trim` ao `v-model` do elemento:

```html
<input v-model.trim="msg">
```

## `v-model` com Componentes

<<<<<<< HEAD
> Se você não está familiarizado com componentes Vue, apenas pule isto por enquanto.
=======
> If you're not yet familiar with Vue's components, you can skip this for now.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

Os tipo de _input_ nativos do HTML nem sempre atendem todas as necessidades. Por sorte, componentes Vue permitem construir _inputs_ reutilizáveis com comportamento completamente personalizado. Estes componentes também funcionam com `v-model`! Para saber mais, leia sobre [componentes de formulário personalizados](components.html#Componentes-de-Formularios-usando-Eventos-Personalizados) no guia de Componentes.
