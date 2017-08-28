---
title: Binding en Campos de Formulario
type: guide
order: 10
---

## Uso Básico

Puede usar la directiva `v-model` para crear enlaces (en inglés **Data Bindings**) de datos de doble vía en elementos de ingreso de datos de formulario y áreas de texto. `v-model` automáticamente escoge la forma correcta de actualizar el elemento basado en el tipo de campo. Aunque parezca un poco mágico, `v-model` es esencialmente un sintaxis bonito para actualizar datos cuando el usuario ingresa información, además de algunos cuidados adicionales para casos extremos.

<p class="tip">`v-model` no se preocupa por el valor inicial dado a un input o textarea. Siempre considera a los datos de instancia de Vue como la fuente de la verdad.</p>

<p class="tip" id="vmodel-ime-tip">Para lenguajes que requieren un [IME](https://en.wikipedia.org/wiki/Input_method) (Chino, Japonés, Koreano, etc), se dará cuenta que `v-model` no se actualiza durante la composición IME. Si también desea soportar estas actualizaciones, mejor use el evento `input`.</p>

### Texto

``` html
<input v-model="message" placeholder="edit me">
<p>Message is: {{ message }}</p>
```

{% raw %}
<div id="example-1" class="demo">
  <input v-model="message" placeholder="edit me">
  <p>Message is: {{ message }}</p>
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

### Texto Multilínea

``` html
<span>Multiline message is:</span>
<p style="white-space: pre">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```

{% raw %}
<div id="example-textarea" class="demo">
  <span>Multiline message is:</span>
  <p style="white-space: pre">{{ message }}</p>
  <br>
  <textarea v-model="message" placeholder="add multiple lines"></textarea>
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
<p class="tip">La interpolación en textareas (<code>&lt;textarea&gt;{{text}}&lt;/textarea&gt;</code>)no funcionará. En cambio use <code>v-model</code>.</p>
{% endraw %}

### Checkbox

Un sólo Checkbox, valor booleano:

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

Múltiples checkboxes, asignados al mismo Array:

``` html
<input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
<label for="jack">Jack</label>
<input type="checkbox" id="john" value="John" v-model="checkedNames">
<label for="john">John</label>
<input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
<label for="mike">Mike</label>
<br>
<span>Checked names: {{ checkedNames }}</span>
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
  <span>Checked names: {{ checkedNames }}</span>
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

### Radios


``` html
<input type="radio" id="one" value="One" v-model="picked">
<label for="one">One</label>
<br>
<input type="radio" id="two" value="Two" v-model="picked">
<label for="two">Two</label>
<br>
<span>Picked: {{ picked }}</span>
```
{% raw %}
<div id="example-4" class="demo">
  <input type="radio" id="one" value="One" v-model="picked">
  <label for="one">One</label>
  <br>
  <input type="radio" id="two" value="Two" v-model="picked">
  <label for="two">Two</label>
  <br>
  <span>Picked: {{ picked }}</span>
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

### Selects

Select único:

``` html
<select v-model="selected">
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>Selected: {{ selected }}</span>
```
{% raw %}
<div id="example-5" class="demo">
  <select v-model="selected">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <span>Selected: {{ selected }}</span>
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

Múltiple selects (asignados a un Array):

``` html
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br>
<span>Selected: {{ selected }}</span>
```
{% raw %}
<div id="example-6" class="demo">
  <select v-model="selected" multiple style="width: 50px">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <br>
  <span>Selected: {{ selected }}</span>
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

Opciones dinámicas renderizadas con `v-for`:

``` html
<select v-model="selected">
  <option v-for="option in options" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
<span>Selected: {{ selected }}</span>
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
  <span>Selected: {{ selected }}</span>
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

## Bindings de valor

Para opciones en radios, checkboxes y selects, los valores asignados mediante `v-model` son usualmente cadenas de texto estáticas (o booleanos para checkbox):

``` html
<!-- `picked` es un string "a" cuando es seleccionado -->
<input type="radio" v-model="picked" value="a">

<!-- `toggle` es verdadero o falso -->
<input type="checkbox" v-model="toggle">

<!-- `selected` es un string "abc" cuando es seleccionado -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

Pero a veces queremos asignar el valor a una propiedad dinámica de la instancia Vue. Podemos usar `v-bind` para lograr esto. Adicionalmente, usar `v-bind` nos permite asignar el valor del input a valores que no sean strings. 

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
// cuando se selecciona:
vm.toggle === vm.a
// cuando se elimina la selección:
vm.toggle === vm.b
```

### Radio

``` html
<input type="radio" v-model="pick" v-bind:value="a">
```

``` js
// cuando se selecciona:
vm.pick === vm.a
```

### Opciones de Select

``` html
<select v-model="selected">
  <!-- literal de objeto en línea -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>
```

``` js
// cuando se selecciona:
typeof vm.selected // -> 'object'
vm.selected.number // -> 123
```

## Modificadores

### `.lazy`

Por defecto, `v-model` sincroniza el input con los datos después de cada evento `input` (Con la excepción de composición IME como [fué dicho antes](#vmodel-ime-tip)). Puede agregar el atributo `lazy` para que alternativamente, los datos sean sincronizados después del evento `change`:  

``` html
<!-- sincronizado después de "change" en vez de "input" -->
<input v-model.lazy="msg" >
```

### `.number`

Si usted quiere que los datos de un usuario sean automáticamente convertidos a número, puede agregar el modificador `number` a sus inputs controlados por `v-model`:

``` html
<input v-model.number="age" type="number">
```

Esto es a menudo muy útil, ya que incluso con `type="number"`, el valor de los elementos input en HTML siempre son de tipo string.

### `.trim`

Si quiere que los datos de usuario sean recortados automáticamente, puede agregar el modificador `trim` a sus inputs manejados por `v-model` para eliminar espacios en blanco antes y después del valor ingresado.

```html
<input v-model.trim="msg">
```

## `v-model` con Componentes

> Si los componentes de Vue no le son familiares, puede saltarse esta sección por ahora.

Los tipos de input nativos de HTML no siempre satisfacen sus necesidades. Afortunadamente, los componentes Vue le permiten crear inputs re-usables con comportamiento completamente personalizable. ¡Estos inputs incluso funcionan mejor con `v-model`! Para conocer más, lea sobre [inputs personalizados](components.html#Form-Input-Components-using-Custom-Events) en la guía de componentes.
