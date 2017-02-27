---
title: Liaisons des champs de formulaire
type: guide
order: 10
---

## Usage basique

Vous pouvez utilisez la directive `v-model` pour créer une liaison de donnée bidirectionnelle sur les champs de formulaire et textarea. Elle choisira automatiquement la bonne manière de mettre à jour l'élément en fonction du type de champ. Bien qu'un peu magique, `v-model` est essentiellement un sucre syntaxique pour mettre à jour les données lors des évènements utilisateurs sur les champs, plus quelques traitements spéciaux pour certains cas particuliers.

<p class="tip">`v-model` ne prend pas en compte la valeur initiale fournie pour un champ ou un textarea. Elle traitera toujours les données de l'instance de vue comme la source de vérité.</p>

<p class="tip" id="vmodel-ime-tip">Pour les languages qui requièrent une [méthode de saisie (IME)](https://fr.wikipedia.org/wiki/M%C3%A9thode_d%27entr%C3%A9e) (chinois, japonais, coréen etc ...), vous remarquerez que `v-model` ne sera pas mis à jour durant l'exécution de la méthode de saisie.</p>

### Texte

``` html
<input v-model="message" placeholder="éditez moi">
<p>Le message est : {{ message }}</p>
```

{% raw %}
<div id="example-1" class="demo">
  <input v-model="message" placeholder="éditez moi">
  <p>Le message est : {{ message }}</p>
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

### Texte multiligne

``` html
<span>Le message multiligne est :</span>
<p style="white-space: pre">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="ajoutez plusieurs lignes"></textarea>
```

{% raw %}
<div id="example-textarea" class="demo">
  <span>Le message multiligne est :</span>
  <p style="white-space: pre">{{ message }}</p>
  <br>
  <textarea v-model="message" placeholder="ajoutez plusieurs lignes"></textarea>
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
<p class="tip">Les interpolations sur les textarea (<code>&lt;textarea&gt;{{text}}&lt;/textarea&gt;</code>) ne fonctionneront pas. Utilisez <code>v-model</code> à la place.</p>
{% endraw %}

### Checkbox

Checkbox seule, valeur booléenne :


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

Checkboxes multiples, liées au même Array:

``` html
<input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
<label for="jack">Jack</label>
<input type="checkbox" id="john" value="John" v-model="checkedNames">
<label for="john">John</label>
<input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
<label for="mike">Mike</label>
<br>
<span>Nom cochés : {{ checkedNames }}</span>
```

``` js
new Vue({
  el: '...',
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
  <span>Noms cochés : {{ checkedNames }}</span>
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
<input type="radio" id="one" value="One" v-model="picked">
<label for="one">One</label>
<br>
<input type="radio" id="two" value="Two" v-model="picked">
<label for="two">Two</label>
<br>
<span>Choisi : {{ picked }}</span>
```
{% raw %}
<div id="example-4" class="demo">
  <input type="radio" id="one" value="One" v-model="picked">
  <label for="one">One</label>
  <br>
  <input type="radio" id="two" value="Two" v-model="picked">
  <label for="two">Two</label>
  <br>
  <span>Choisi : {{ picked }}</span>
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

Select à choix unique:

``` html
<select v-model="selected">
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>Sélectionné : {{ selected }}</span>
```
{% raw %}
<div id="example-5" class="demo">
  <select v-model="selected">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <span>Sélectionné : {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-5',
  data: {
    selected: null
  }
})
</script>
{% endraw %}

Select à choix multiples (lié à un Array):

``` html
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br>
<span>Sélectionnés : {{ selected }}</span>
```
{% raw %}
<div id="example-6" class="demo">
  <select v-model="selected" multiple style="width: 50px">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <br>
  <span>Sélectionnés : {{ selected }}</span>
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

Options dynamiques rendues avec `v-for`:

``` html
<select v-model="selected">
  <option v-for="option in options" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
<span>Sélectionné : {{ selected }}</span>
```
``` js
new Vue({
  el: '...',
  data: {
    selected: 'A',
    options: [
      { text: 'One', value: 'A' },
      { text: 'Two', value: 'B' },
      { text: 'Three', value: 'C' }
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
  <span>Sélectionné : {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-7',
  data: {
    selected: 'A',
    options: [
      { text: 'One', value: 'A' },
      { text: 'Two', value: 'B' },
      { text: 'Three', value: 'C' }
    ]
  }
})
</script>
{% endraw %}

## Liaisons des attributs value

Pour les options de bouton radio, checkbox et select, les valeurs de liaison de `v-model` des attributs value sont habituellement des chaînes de caractères statiques (ou des booléens pour une checkbox):


``` html
<!-- `picked` est une chaîne de caractères "a" quand le bouton radio est sélectionné -->
<input type="radio" v-model="picked" value="a">

<!-- `toggle` est soit true soit false -->
<input type="checkbox" v-model="toggle">

<!-- `selected` est une chaîne de caractères "abc" quand l'option est sélectionnée -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

Mais parfois nous pouvons souhaiter lier la valeur à une propriété dynamique de l'instance de Vue. Nous pouvons réaliser cela en utilisant `v-bind`. De plus, utiliser `v-bind` nous permet de lier la valeur de l'input à des valeurs qui ne sont pas des chaînes de caractères.

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
// quand cochée :
vm.toggle === vm.a
// when unchecked:
vm.toggle === vm.b
```

### Radio

``` html
<input type="radio" v-model="pick" v-bind:value="a">
```

``` js
// quand choisi :
vm.pick === vm.a
```

### Options des select

``` html
<select v-model="selected">
  <!-- objet littéral en ligne -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>
```

``` js
// quand sélectionné :
typeof vm.selected // -> 'object'
vm.selected.number // -> 123
```

## Modificateur

### `.lazy`

Par défaut, `v-model` synchronise l'input avec les données après chaque évènement `input` (à l'exception de l'exécution d'une méthode de saisie comme [dit plus haut](#vmodel-ime-tip)). Vous pouvez ajouter le modificateur `lazy` pour synchroniser après les évènements `change` à la place: 

``` html
<!-- synchronisé après le "change" au lieu du "input" -->
<input v-model.lazy="msg" >
```

### `.number`

Si vous voulez que l'entrée utilisateur soit automatiquement typée en tant que nombre, vous pouvez ajouter le modificateur `number` à vos input gérés par `v-model`

``` html
<input v-model.number="age" type="number">
```

C'est souvent utile, parce que même avec `type="number"`, la valeur des éléments input HTML retourne toujours une chaîne de caractères.

### `.trim`

If you want user input to be trimmed automatically, you can add the `trim` modifier to your `v-model` managed inputs:
c'est vous voulez que les entrées utilisateurs soit "trimmed" automatiquement, vous pouvez ajouter le modificateur `trim` à vos champs gérés par `v-model`

```html
<input v-model.trim="msg">
```

## `v-model` avec les composants

> Si vous n'est pas encore familier avec les composants de Vue, sautez ce passage pour le moment

Les types de champ standards HTML ne couvriront pas toujours vos besoins. Heureusement, les composants de Vue vous permettent de construire des inputs avec un comportement complètement customisé. Ces inputs fonctionnent même avec `v-model` ! Pour en apprendre plus, lisez [inputs personnalisés](components.html#Form-Input-Components-using-Custom-Events) dans le guide des composants.







