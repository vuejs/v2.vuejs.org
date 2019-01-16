---
title: Binding en Formularios
type: guide
order: 10
---

## Uso básico

Puede usar la directiva `v-model` para crear *bindings* de datos bidireccionales (*two-way binding*) en elementos *input*, *textarea* y *select* de un formulario. La directiva busca automáticamente la manera correcta de actualizar el elemento según el tipo de entrada. Aunque un poco mágico, `v-model` es esencialmente *syntax sugar* para actualización de datos a través de eventos de entradas del usuario, además de mostrar un cuidado especial para algunos casos de borde.

<p class="tip">`v-model` ignorará el `value` inicial, los atributos `checked` o `selected` que se encuentran en cualquier elemento de formulario. Siempre tratará los datos de la instancia de Vue como la fuente confiable. Debe declarar el valor inicial del lado de JavaScript, dentro de la opción `data` de su componente.</p>

<p class="tip" id="vmodel-ime-tip">Para los idiomas que requieren un [IME](https://en.wikipedia.org/wiki/Input_method) (chino, japonés, coreano, etc.), notará que el `v-model` no se actualiza durante la composición del IME. Si también desea atender estas actualizaciones, use un evento `input` en su lugar.</p>

### Input

``` html
<input v-model="message" placeholder="edíteme">
<p>El mensaje es: {{ message }}</p>
```

{% raw %}
<div id="example-1" class="demo">
  <input v-model="message" placeholder="edíteme">
  <p>El mensaje es: {{ message }}</p>
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
<span>El mensaje multilínea es:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="agregar múltiples líneas"></textarea>
```

{% raw %}
<div id="example-textarea" class="demo">
  <span>El mensaje multilínea es:</span>
  <p style="white-space: pre-line;">{{ message }}</p>
  <br>
  <textarea v-model="message" placeholder="agregar múltiples líneas"></textarea>
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
<p class="tip">La interpolación en textareas no funciona (<code>&lt;textarea&gt;{{text}}&lt;/textarea&gt;</code>). En su lugar use <code>v-model</code>.</p>
{% endraw %}

### Checkbox

*Checkbox* simples con valor booleano:

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

Múltiples checkboxes vinculados al mismo Array:

``` html
<div id='example-3'>
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>
  <br>
  <span>Checked names: {{ checkedNames }}</span>
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
  <span>Nombres Checked: {{ checkedNames }}</span>
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
<input type="radio" id="uno" value="Uno" v-model="picked">
<label for="uno">Uno</label>
<br>
<input type="radio" id="Dos" value="Dos" v-model="picked">
<label for="Dos">Dos</label>
<br>
<span>Eligió: {{ picked }}</span>
```
{% raw %}
<div id="example-4" class="demo">
  <input type="radio" id="uno" value="uno" v-model="picked">
  <label for="uno">Uno</label>
  <br>
  <input type="radio" id="Dos" value="Dos" v-model="picked">
  <label for="Dos">Dos</label>
  <br>
  <span>Eligió: {{ picked }}</span>
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

Selección de un solo elemento:

``` html
<select v-model="selected">
  <option disabled value="">Seleccione un elemento</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>Seleccionado: {{ selected }}</span>
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
    <option disabled value="">Seleccione un elemento</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <span>Seleccionado: {{ selected }}</span>
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

<p class="tip">Si el valor inicial de su expresión `v-model` no coincide con ninguna de las opciones, el elemento `<select>` se representará en un estado "unselected". En iOS, esto hará que el usuario no pueda seleccionar el primer elemento porque iOS no dispara un evento de cambio en este caso. Por lo tanto, se recomienda proporcionar una opción deshabilitada con un valor vacío, como se muestra en el ejemplo anterior.
</p>

Selección de múltiples elementos (vinculando a un Array):

``` html
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br>
<span>Seleccionados: {{ selected }}</span>
```
{% raw %}
<div id="example-6" class="demo">
  <select v-model="selected" multiple style="width: 50px;">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <br>
  <span>Seleccionados: {{ selected }}</span>
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
<span>Seleccionado: {{ selected }}</span>
```
``` js
new Vue({
  el: '...',
  data: {
    selected: 'A',
    options: [
      { text: 'Uno', value: 'A' },
      { text: 'Dos', value: 'B' },
      { text: 'Tres', value: 'C' }
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
  <span>Seleccionado: {{ selected }}</span>
</div>
<script>
new Vue({
  el: '#example-7',
  data: {
    selected: 'A',
    options: [
      { text: 'Uno', value: 'A' },
      { text: 'Dos', value: 'B' },
      { text: 'Tres', value: 'C' }
    ]
  }
})
</script>
{% endraw %}

## Vinculando a Valores

Para *radio*, *checkbox* y *option* de *select*, los valores de vinculación del `v-model` suelen ser cadenas estáticas (o booleanos para *checkbox*):

``` html
<!-- `picked` es una cadena "a" cuando está chequeado -->
<input type="radio" v-model="picked" value="a">

<!-- `toggle` es verdadero o falso -->
<input type="checkbox" v-model="toggle">

<!-- `selected` es una cadena "abc" cuando se selecciona la primera opción -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

Pero a veces es posible que queramos vincular el valor a una propiedad dinámica en la instancia de Vue. Podemos usar `v-bind` para lograr eso. Además, el uso de `v-bind` nos permite vincular el valor de entrada a valores no cadena.

### Checkbox

``` html
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no"
>
```

``` js
// cuando está marcado:
vm.toggle === 'yes'
// cuando está desmarcado:
vm.toggle === 'no'
```

<p class="tip">Los atributos de `true-value` y de `false-value` no afectan la entrada del atributo `value`, ya que los navegadores no incluyen casillas sin marcar en los envíos de formularios. Para garantizar que uno de los dos valores se envie en un formulario (por ejemplo, "yes" o "no"), use entradas de radio en su lugar.
</p>

### Radio

``` html
<input type="radio" v-model="pick" v-bind:value="a">
```

``` js
// cuando está marcado:
vm.pick === vm.a
```

### Select

``` html
<select v-model="selected">
  <!--  objeto literal en linea --> -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>
```

``` js
// cuando está seleccionado:
typeof vm.selected // => 'object'
vm.selected.number // => 123
```

## Modificadores

### `.lazy`

De forma predeterminada, `v-model` sincroniza el `input` con los datos después de cada evento de tipo `input` (con la excepción de la composición IME [descrito anteriormente](#vmodel-ime-tip)). En lugar de esto, puede agregar el modificador `lazy` para realizar la sincronización después del evento `change`:

``` html
<!-- sincronizado después de "change" en lugar de "input" -->
<input v-model.lazy="msg" >
```

### `.number`

Si desea que las entradas del usuario se escriban automáticamente como un número, puede agregar el modificador `number` al `v-model` del elemento:

``` html
<input v-model.number="age" type="number">
```

Esto suele ser útil, porque incluso con `type="number"`, el valor retornado por el elemento HTML siempre es una cadena de texto. Si el valor no se puede analizar con `parseFloat()`, se retorna el valor original.

### `.trim`

Si desea que las entradas del usuario se recorten automáticamente, puede agregar el modificador `trim` al `v-model` de su elemento:

```html
<input v-model.trim="msg">
```

## `v-model` con Componentes

> Si aún no está familiarizado con los componentes de Vue, puede omitir esto por ahora.

Los tipos de *input* nativos de HTML no siempre satisfarán sus necesidades. Afortunadamente, los componentes de Vue le permiten crear *input* reutilizables con un comportamiento completamente personalizado. Estos componentes también funcionan con `v-model`! Para aprender más, lea acerca de [inputs personalizados](components.html#Using-v-model-on-Components) en la guía de componentes.
