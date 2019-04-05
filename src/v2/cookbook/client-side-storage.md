---
title: Almacenamiento del lado del cliente
type: cookbook
order: 11
---

## Ejemplo Básico

El almacenamiento de datos de lado del cliente es una excelente forma de mejorar el rendimiento de una aplicación. Al almacenar los datos directamente en el navegador se evita tener que solicitar datos desde el servidor cada vez que el usuario lo necesita. Es especialmente útil para soportar navegación fuera de línea, pero también los usuarios que disponen de una conexión activa se pueden ver beneficiados por el almacenamiento local. El almacenamiento del lado del cliente se puede lograr de múltiples formas, por ejemplo [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) (técnicamente  "Web Storage"), [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) y [WebSQL](https://www.w3.org/TR/webdatabase/) (un método discontinuado que no debería usarse en proyectos nuevos).

El enfoque de esta "receta" es particularmente en Local Storage, el cual es el método más simple de almacenamiento. Local Storage usa un sistema de clave/valor para almacenar datos. Está limitado a solo almacenar datos simples, pero se puede lograr almacenar datos complejos si se desea implementar una forma de codificación y decodificación de objetos JSON. En general Local Storage es apropiado para almacenar pequeñas cantidades de datos, por ejemplo preferencias del usuario. En caso de necesitar almacenar datos de mayor volumen y más complejos se recomienda otras soluciones como IndexedDB.

Comencemos con un ejemplo basado en un formulario simple:

``` html
<div id="app">
  Mi nombre es <input v-model="name">
</div>
```

Este ejemplo tiene un campo en un formulario ligado a Vue a través del valor `name`. A continuación se puede ver el JavaScript:

``` js
const app = new Vue({
  el: '#app',
  data: {
    name: ''
  },
  mounted() {
    if (localStorage.name) {
      this.name = localStorage.name;
    }
  },
  watch: {
    name(newName) {
      localStorage.name = newName;
    }
  }
});
```

Si se enfoca en la parte del `mounted` y el `watch` se puede ver que en este caso se utiliza `mounted` para cargar el dato almacenado en localStorage. Luego se observa el valor de `name` y automáticamente cuando ocurren cambios estos se almacenan en la base datos.

Usted puede ejecutar el ejemplo aquí:

<p data-height="265" data-theme-id="0" data-slug-hash="KodaKb" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="testing localstorage" class="codepen">Vea el Pen <a href="https://codepen.io/cfjedimaster/pen/KodaKb/">probando localstorage</a> por Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) en <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Escriba algo en el formulario y luego recargue la página. Usted notará que el valor escrito anteriormente será mostrado automáticamente. No se olvide que el navegador provee the herramientas de desarrollador para que pueda inspeccionar el almacenamiento del lado de cliente. Puede ver un ejemplo en Firefox a continuación:

![Herramientas de desarrollador para almacenamiento en Firefox](/images/devtools-storage.png)

Aquí puede verlo en Chrome:

![Herramientas de desarrollador para almacenamiento en Chrome](/images/devtools-storage-chrome.png)

Y finalmente puede ver un ejemplo en Microsoft Edge. Nótese que se pueden encontrar los valores almacenados en la pestaña "Debugger" o "Depuración"

![Herramientas de desarrollador para almacenamiento en Edge](/images/devtools-storage-edge.png)

<p class="tip">Como una nota aparte, las herramientas para desarrollador ofrecen una manera de eliminar los valores almacenados que es muy útil para efectuar pruebas</p>

Guardar los datos inmediatamente cuando cambian puede no ser recomendable. Consideremos un ejemplo un poco más avanzando. Primero veamos el formulario:

``` html
<div id="app">
  <p>
    Mi nombre es <input v-model="name">
    y tengo <input v-model="age"> años.
  </p>
  <p>
    <button @click="persist">Guardar</button>
  </p>
</div>
```

Ahora tenemos dos campos (también ligados a la instancia de Vue) y además un botón que ejecuta el método `persist` cuando hacemos clic. Veamos el código JavaScript:

``` js
const app = new Vue({
  el: '#app',
  data: {
    name: '',
    age: 0
  },
  mounted() {
    if (localStorage.name) {
      this.name = localStorage.name;
    }
    if (localStorage.age) {
      this.age = localStorage.age;
    }
  },
  methods: {
    persist() {
      localStorage.name = this.name;
      localStorage.age = this.age;
      console.log('imaginen que estoy haciendo más cosas...');
    }
  }
})
```

Igual que antes, `mounted` es utilizado para cargar los datos almacenados cuando existen. Sin embargo esta vez los datos solo son guardados cuando hacemos clic en el botón. También se podrían efectuar validaciones antes guardar los datos. También se puede almacenar información sobre cuándo fueron guardados los datos. Con esa metadata el método `mounted` podría decidir si guardar o no los datos nuevamente. Puede probar esta nueva versión a continuación.

<p data-height="265" data-theme-id="0" data-slug-hash="rdOjLN" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="testing localstorage 2" class="codepen">Vea el Pen <a href="https://codepen.io/cfjedimaster/pen/rdOjLN/">probando localstorage 2</a> por Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) en <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Trabajando con valores complejos

Como fue mencionado anteriormente, Local Storage solamente funciona con valores simples. Para almacenar valores complejos como objetos o arreglos usted debe serializar y deserializar los valores con JSON. Aquí puede encontrar un ejemplo avanzado que almacena un arreglo de gatos (el mejor tipo de arreglos).

``` html
<div id="app">
  <h2>Gatos</h2>
  <div v-for="(cat, n) in cats">
    <p>
      <span class="cat">{{ cat }}</span>
      <button @click="removeCat(n)">Eliminar</button>
    </p>
  </div>

  <p>
    <input v-model="newCat">
    <button @click="addCat">Agregar gato</button>
  </p>
</div>
```

Esta "aplicación" consiste en una simple lista con un botón para eliminar gatos y un formulario para agregarlos en la parte inferior. Veamos el JavaScript.

``` js
const app = new Vue({
  el: '#app',
  data: {
    cats: [],
    newCat: null
  },
  mounted() {
    if (localStorage.getItem('cats')) {
      try {
        this.cats = JSON.parse(localStorage.getItem('cats'));
      } catch(e) {
        localStorage.removeItem('cats');
      }
    }
  },
  methods: {
    addCat() {
      // asegurarse que el usuario efectivamente ha escrito algo
      if (!this.newCat) {
        return;
      }

      this.cats.push(this.newCat);
      this.newCat = '';
      this.saveCats();
    },
    removeCat(x) {
      this.cats.splice(x, 1);
      this.saveCats();
    },
    saveCats() {
      const parsed = JSON.stringify(this.cats);
      localStorage.setItem('cats', parsed);
    }
  }
})
```

En esta aplicación hemos utilizado el acceso a través de la API de Local Storage en lugar de acceder directamente. Ambos métodos funcionan, pero el método a través de la API es el preferido. El método `mounted` ahora debe leer el valor almacenado y decodificarlo a un objeto JSON. Si algo falla, entonces asumimos que los datos se corrompieron y los eliminamos. Recuerda que cuando usamos almacenamiento del lado del cliente, estamos sujetos a modificaciones de los datos ya que los usuarios tiene acceso a los mismos y pueden cambiarlos.

Tenemos tres métodos que se encargan de la interacción con los gatos. Ambos `addCat` y `removeCat` se encargan de actualizar los datos en "vivo" de Vue, almacenados en `this.cats`. Luego el método `saveCats` se encarga de la serialización y persistencia de los datos. Usted puede jugar con esta versión a continuación:

<p data-height="265" data-theme-id="0" data-slug-hash="qoYbyW" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="localstorage, complex" class="codepen">Vea el Pen <a href="https://codepen.io/cfjedimaster/pen/qoYbyW/">localstorage, complejo</a> por Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) en <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Patrones alternativos

Si bien la API de Local Storage es muy simple, esta carece de algunas funcionalidades que podrían resultar útiles en muchas aplicaciones. Las siguientes librerías proveen de algunas mejoras sobre Local Storage para hacer su uso más fácil y completo con funcionalidades como los valores por defecto.

* [vue-local-storage](https://github.com/pinguinjkeke/vue-local-storage)
* [vue-reactive-storage](https://github.com/ropbla9/vue-reactive-storage)
* [vue2-storage](https://github.com/yarkovaleksei/vue2-storage)

## Conclusión

A pesar de que el almacenamiento en el navegador nunca va a remplazar la persistencia del lado del servidor, contar con múltiples opciones para tener datos almacenados localmente en el cliente puede significar mejoras importantes de performance para su aplicación, y al usarlo en conjunto con Vue.js lo hace aún más poderoso.
