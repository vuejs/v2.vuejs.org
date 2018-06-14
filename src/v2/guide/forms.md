---
title: Liaisons sur les champs de formulaire
type: guide
order: 10
---

## Usage basique

Vous pouvez utiliser la directive `v-model` pour créer une liaison de données bidirectionnelle sur les champs de formulaire (input, select ou textarea). Elle choisira automatiquement la bonne manière de mettre à jour l'élément en fonction du type de champ. Bien qu'un peu magique, `v-model` est essentiellement du sucre syntaxique pour mettre à jour les données lors des évènements de saisie utilisateur sur les champs, ainsi que quelques traitements spéciaux pour certains cas particuliers.

<p class="tip">`v-model` ne prend pas en compte la valeur initiale des attributs `value`, `checked` ou `selected` fournis par un champ. Elle traitera toujours les données de l'instance de vue comme la source de vérité. Vous devez déclarer la valeur initiale dans votre JavaScript, dans l'option `data` de votre composant.</p>

<p class="tip" id="vmodel-ime-tip">Pour les langues qui requièrent une [méthode de saisie (IME)](https://fr.wikipedia.org/wiki/M%C3%A9thode_d%27entr%C3%A9e) (chinois, japonais, coréen, etc.), vous remarquerez que `v-model` ne sera pas mise à jour durant l'exécution de la méthode de saisie.</p>

### Texte

``` html
<input v-model="message" placeholder="modifiez-moi">
<p>Le message est : {{ message }}</p>
```

{% raw %}
<div id="example-1" class="demo">
  <input v-model="message" placeholder="modifiez-moi">
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
<p style="white-space: pre-line;">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="ajoutez plusieurs lignes"></textarea>
```

{% raw %}
<div id="example-textarea" class="demo">
  <span>Le message multiligne est :</span>
  <p style="white-space: pre-line;">{{ message }}</p>
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
<p class="tip">L'interpolation sur les zones de texte (<code>&lt;textarea&gt;{{text}}&lt;/textarea&gt;</code>) ne fonctionnera pas. Utilisez <code>v-model</code> à la place.</p>
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

Checkboxes multiples, liées au même tableau (Array) :

``` html
<div id='example-3'>
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>
  <br>
  <span>Noms cochés : {{ checkedNames }}</span>
<div>
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
<input type="radio" id="one" value="Un" v-model="picked">
<label for="one">Un</label>
<br>
<input type="radio" id="two" value="Deux" v-model="picked">
<label for="two">Deux</label>
<br>
<span>Choisi : {{ picked }}</span>
```
{% raw %}
<div id="example-4" class="demo">
  <input type="radio" id="one" value="Un" v-model="picked">
  <label for="one">Un</label>
  <br>
  <input type="radio" id="two" value="Deux" v-model="picked">
  <label for="two">Deux</label>
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

Select à choix unique :

``` html
<select v-model="selected">
  <option disabled value="">Choisissez</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>Sélectionné : {{ selected }}</span>
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
    <option disabled value="">Choisissez</option>
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
    selected: ''
  }
})
</script>
{% endraw %}

<p class="tip">Si la valeur initiale de votre expression dans `v-model` ne correspond à aucune des options, l'élément `<select>` va faire le rendu dans un état « non sélectionné ». Sur iOS cela va conduire l'utilisateur à ne pas pouvoir sélectionner le premier élément car aucun évènement `change` n'est déclenché dans ce cas. Il est cependant recommandé de fournir une option désactivée avec une valeur vide comme dans l'exemple ci-dessous.</p>

Select à choix multiples (lié à un tableau) :

``` html
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br>
<span>Sélectionné(s) : {{ selected }}</span>
```
{% raw %}
<div id="example-6" class="demo">
  <select v-model="selected" multiple style="width: 50px;">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <br>
  <span>Sélectionné(s) : {{ selected }}</span>
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

Options dynamiques générées avec `v-for` :

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
      { text: 'Un', value: 'A' },
      { text: 'Deux', value: 'B' },
      { text: 'Trois', value: 'C' }
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
      { text: 'Un', value: 'A' },
      { text: 'Deux', value: 'B' },
      { text: 'Trois', value: 'C' }
    ]
  }
})
</script>
{% endraw %}

## Liaisons des attributs value

Pour les boutons radio, les cases à cocher et les listes d'options, les valeurs de liaison de `v-model` sont habituellement des chaines de caractères statiques (ou des booléens pour une case à cocher) :

``` html
<!-- `picked` sera une chaine de caractères "a" quand le bouton radio sera sélectionné -->
<input type="radio" v-model="picked" value="a">

<!-- `toggle` est soit true soit false -->
<input type="checkbox" v-model="toggle">

<!-- `selected` sera une chaine de caractères "abc" quand la première option sera sélectionnée -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

Mais parfois nous pouvons souhaiter lier la valeur à une propriété dynamique de l'instance de Vue. Nous pouvons réaliser cela en utilisant `v-bind`. De plus, utiliser `v-bind` nous permet de lier la valeur de l'input à des valeurs qui ne sont pas des chaines de caractères.

### Checkbox

``` html
<input
  type="checkbox"
  v-model="toggle"
  true-value="oui"
  false-value="non"
>
```

``` js
// lorsque c'est coché :
vm.toggle === 'oui'
// lorsque que c'est décoché :
vm.toggle === 'non'
```

<p class="tip">Les attributs `true-value` et `false-value` n'affectent pas la valeur de l'attribut `value`, car les navigateurs n'incluent pas les cases non cochées dans les soumissions de formulaire. Pour garantir que l'une des deux valeurs soit soumise par le formulaire (par ex. `'oui'"` ou `"'non'"`), utilisez les boutons radio à la place.</p>

### Radio

``` html
<input type="radio" v-model="pick" v-bind:value="a">
```

``` js
// lorsque c'est choisi :
vm.pick === vm.a
```

### Options de select

``` html
<select v-model="selected">
  <!-- objet littéral en ligne -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>
```

``` js
// lorsque c'est sélectionné :
typeof vm.selected // => 'object'
vm.selected.number // => 123
```

## Modificateurs

### `.lazy`

Par défaut, `v-model` synchronise le champ avec les données après chaque évènement `input` (à l'exception de l'exécution d'une méthode de saisie comme [mentionné plus haut](#vmodel-ime-tip)). Vous pouvez ajouter le modificateur `lazy` pour synchroniser après les évènements `change` à la place :

``` html
<!-- synchronisé après le "change" au lieu du "input" -->
<input v-model.lazy="msg" >
```

### `.number`

Si vous voulez que la saisie utilisateur soit automatiquement convertie en nombre, vous pouvez ajouter le modificateur `number` à vos champs gérés par `v-model` :

``` html
<input v-model.number="age" type="number">
```

C'est souvent utile, parce que même avec `type="number"`, la valeur des éléments input HTML retourne toujours une chaine de caractères.

### `.trim`

Si vous voulez que les espaces superflus des saisies utilisateur soient automatiquement retirés, vous pouvez ajouter le modificateur `trim` à vos champs gérés par `v-model` :

```html
<input v-model.trim="msg">
```

## `v-model` avec les composants

> Si vous n'êtes pas encore familier avec les composants de Vue, passez cette section pour le moment.

Les types de champ standards HTML ne couvriront pas toujours vos besoins. Heureusement, les composants de Vue vous permettent de construire des champs avec un comportement complètement personnalisé. Ces champs fonctionnent même avec `v-model` ! Pour en apprendre plus, lisez la section [champs personnalisés](components.html#Utiliser-v-model-sur-les-composants) dans le guide des composants.
