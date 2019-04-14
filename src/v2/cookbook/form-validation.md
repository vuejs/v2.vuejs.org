---
title: Validación de Formularios
type: cookbook
order: 3
---

## Ejemplo Base

La validación de formularios es soportada de forma nativa por el navegador. Sin embargo, diferentes navegadores manejarán las cosas de una manera que puede ser un poco complicada o tramposa. Incluso cuando la validación es soportada perfectamente, algunas veces habrá la necesidad de personalizar las mismas, por lo cual, una solución basada en Vue podrá ser más apropiada. Comencemos con un simple ejemplo.

Dado un formulario con tres campos, haremos dos obligatorios. Veremos el HTML primero:

``` html
<form
  id="app"
  @submit="checkForm"
  action="https://vuejs.org/"
  method="post"
>

  <p v-if="errors.length">
    <b>Por favor, corrija el(los) siguiente(s) error(es):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for="name">Nombre</label>
    <input
      id="name"
      v-model="name"
      type="text"
      name="name"
    >
  </p>

  <p>
    <label for="age">Edad</label>
    <input
      id="age"
      v-model="age"
      type="number"
      name="age"
      min="0">
  </p>

  <p>
    <label for="movie">Película favorita</label>
    <select
      id="movie"
      v-model="movie"
      name="movie"
    >
      <option>Star Wars</option>
      <option>Vanilla Sky</option>
      <option>Atomic Blonde</option>
    </select>
  </p>

  <p>
    <input
      type="submit"
      value="Enviar"
    >
  </p>

</form>
```

Comencemos desde el inicio. La _tag_ `<form>` tiene un ID que usaremos para la componente Vue. Hay un botón de envío, del cual hablaremos en un momento y la `action` del formulario que es una URL temporal que apuntaría a algo real en un servidor (donde habrá una copia de la validación en el lado del servidor, por supuesto).

Debajo del formulario, hay un párrafo que se mostrará o esconderá basado en el estado del error. Esto renderizará una lista de errores arriba del formulario. Además, note que la validación se lanza en el evento de envío del formulario, en vez de hacerlo cada vez que un campo es modificado.

Lo último a notar es que cada uno de los tres campos tiene su correspondiente `v-model`, para conectar los mismos a los valores con los que trabajaremos en JavaScript. Ahora, veamos el ejemplo:

``` js
const app = new Vue({
  el: '#app',
  data: {
    errors: [],
    name: null,
    age: null,
    movie: null
  },
  methods:{
    checkForm: function (e) {
      if (this.name && this.age) {
        return true;
      }

      this.errors = [];

      if (!this.name) {
        this.errors.push('El nombre es obligatorio.');
      }
      if (!this.age) {
        this.errors.push('La edad es obligatoria.');
      }

      e.preventDefault();
    }
  }
})
```

Bastante corto y simple. Definimos un arreglo que contendrá los errores e inicializamos los valores de los tres campos en `null`. La lógica del método `checkFrom` (recordando que corre al enviar el formulario) valida solamente el nombre y la edad, ya que la película es opcional. En caso que esten vacíos, chequeamos cada uno y definimos un error específico (para cada uno de ellos). Y es sólo eso. Puede probar el ejemplo abajo. No olvide que si los campos son válidos, usted será redirigido a una URL temporal vacía.

<p data-height="265" data-theme-id="0" data-slug-hash="GObpZM" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 1" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/GObpZM/">form validation 1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Usando Validaciones Personalizadas

Para el segundo ejemplo, el segundo campo de texto (edad) fue cambiado a correo electrónico, necesitando una validación más personalizada. El código fue extraído de la siguiente pregunta de StackOverflow [How to validate email address in JavaScript?](https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript). Ésta es una estupenda pregunta, pues provoca que su argumento político/religioso más intenso en Facebook parezca un pequeño desacuerdo sobre cuál es la mejor cerveza.


``` html
<form
  id="app"
  @submit="checkForm"
  action="https://vuejs.org/"
  method="post"
  novalidate="true"
>

  <p v-if="errors.length">
    <b>Por favor, corrija el(los) siguiente(s) error(es):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for="name">Nombre</label>
    <input
      id="name"
      v-model="name"
      type="text"
      name="name"
    >
  </p>

  <p>
    <label for="email">Correo electrónico</label>
    <input
      id="email"
      v-model="email"
      type="email"
      name="email"
    >
  </p>

  <p>
    <label for="movie">Película favorita</label>
    <select
      id="movie"
      v-model="movie"
      name="movie"
    >
      <option>Star Wars</option>
      <option>Vanilla Sky</option>
      <option>Atomic Blonde</option>
    </select>
  </p>

  <p>
    <input
      type="submit"
      value="Enviar"
    >
  </p>

</form>
```

Mientras los cambios en el _template_ son pocos, note el `novalidate="true"` al inicio. Esto es muy importante, puesto que el navegador intentará validar la dirección de correo electrónico cuando el campo es del tipo `type="email"`. Francamente, en este caso tendría más sentido confiar en el navegador, pero como queremos una validación personalizada, la deshabilitamos. Aquí está el JavaScript actualizado:

``` js
const app = new Vue({
  el: '#app',
  data: {
    errors: [],
    name: null,
    email: null,
    movie: null
  },
  methods: {
    checkForm: function (e) {
      this.errors = [];

      if (!this.name) {
        this.errors.push("El nombre es obligatorio.");
      }
      if (!this.email) {
        this.errors.push('El correo electrónico es obligatorio.');
      } else if (!this.validEmail(this.email)) {
        this.errors.push('El correo electrónico debe ser válido.');
      }

      if (!this.errors.length) {
        return true;
      }

      e.preventDefault();
    },
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
})
```

Como puede ver, añadimos `validEmail` como un nuevo método y este simplemente es llamado desde `checkForm`. Puede probar este ejemplo aquí:

<p data-height="265" data-theme-id="0" data-slug-hash="vWqNXZ" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 2" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/vWqNXZ/">form validation 2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Otro Ejemplo de Validación Personalizada

Para el tercer ejemplo, hemos construido algo que probablemente usted ya ha visto en las aplicaciones de cuestionarios. Se le pide al usuario que gaste un "presupuesto" en un conjunto de características para la próxima generación del Destructor Estelar. El total debe ser de 100. Primero, el HTML:

``` html
<form
  id="app"
  @submit="checkForm"
  action="https://vuejs.org/"
  method="post"
  novalidate="true"
>

  <p v-if="errors.length">
    <b>Por favor, corrija el(los) siguiente(s) error(es):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    Dado un presupuesto de 100 dólares, indique cuanto
    le gustaría gastar en las siguientes características
    para la próxima generación del Destructor Estelar. El
    total debe sumar 100.
  </p>

  <p>
    <input
      v-model.number="weapons"
      type="number"
      name="weapons"
    > Armas <br/>
    <input
      v-model.number="shields"
      type="number"
      name="shields"
    > Escudos <br/>
    <input
      v-model.number="coffee"
      type="number"
      name="coffee"
    > Café <br/>
    <input
      v-model.number="ac"
      type="number"
      name="ac"
    > Aire Acondicionado <br/>
    <input
      v-model.number="mousedroids"
      type="number"
      name="mousedroids"
    > Droides Ratón <br/>
  </p>

  <p>
    Total actual: {{total}}
  </p>

  <p>
    <input
      type="submit"
      value="Enviar"
    >
  </p>

</form>
```

Tenga en cuenta el conjunto de _inputs_ que cubre las cinco diferentes características posibles. También, tenga en cuenta la adición de `.number` al atributo `v-model`. Esto le dice a Vue que convierta el valor a un número cuando lo use. Sin embargo, existe un problema con este recurso, puesto que cuando el valor está vacío, este se vuelve una cadena de texto (_string_). Verá una solución a este problema abajo. Para hacer el uso un poco más fácil para el usuario, también hemos añadido el total actual para que vea, en tiempo real, cuánto es el total. Ahora, veamos el JavaScript:

``` js
const app = new Vue({
  el: '#app',
  data:{
    errors: [],
    weapons: 0,
    shields: 0,
    coffee: 0,
    ac: 0,
    mousedroids: 0
  },
  computed: {
     total: function () {
       // se debe parsear porque Vue transforma el valor vacío a string
       return Number(this.weapons) +
         Number(this.shields) +
         Number(this.coffee) +
         Number(this.ac+this.mousedroids);
     }
  },
  methods:{
    checkForm: function (e) {
      this.errors = [];

      if (this.total != 100) {
        this.errors.push('El total debe ser 100!');
      }

      if (!this.errors.length) {
        return true;
      }

      e.preventDefault();
    }
  }
})
```

Definimos el valor total como una propiedad computada, esto es algo fácil de configurar sin tener el pequeño problema antes mencionado. El método `checkForm` ahora sólo debe verificar sí el total es 100, simplemente eso. Puede probar este ejemplo aquí:

<p data-height="265" data-theme-id="0" data-slug-hash="vWqGoy" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 3" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/vWqGoy/">form validation 3</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Validación en el lado del Servidor

Como úlitmo ejemplo, construiremos algo que utilice Ajax para realizar una validación en el servidor. El formulario le pedirá que nombre un nuevo producto y luego verificará que este nombre sea único. Escribimos una rápida acción _serverless_ [OpenWhisk](http://openwhisk.apache.org/) para hacer la validación. Aunque no sea muy importante, aquí esta la lógica utilizada:

``` js
function main(args) {
    return new Promise((resolve, reject) => {
        // Malos nombres de productos: vista, empire, mbp
        const badNames = ['vista', 'empire', 'mbp'];

        if (badNames.includes(args.name)) {
          reject({error: 'El producto ya existe'});
        }

        resolve({status: 'ok'});
    });
}
```

Básicamente cualquier nombre menos "vista", "empire" y "mbp" son aceptables. Veamos el formulario:

``` html
<form
  id="app"
  @submit="checkForm"
  method="post"
>

  <p v-if="errors.length">
    <b>Por favor, corrija el(los) siguiente(s) error(es):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for="name">Nuevo nombre del producto: </label>
    <input
      id="name"
      v-model="name"
      type="text"
      name="name"
    >
  </p>

  <p>
    <input
      type="submit"
      value="Enviar"
    >
  </p>

</form>
```

No hay nada especial aquí. Veamos el JavaScript:

``` js
const apiUrl = 'https://openwhisk.ng.bluemix.net/api/v1/web/rcamden%40us.ibm.com_My%20Space/safeToDelete/productName.json?name=';

const app = new Vue({
  el: '#app',
  data: {
    errors: [],
    name: ''
  },
  methods:{
    checkForm: function (e) {
      e.preventDefault();

      this.errors = [];

      if (this.name === '') {
        this.errors.push('El nombre del producto es obligatorio.');
      } else {
        fetch(apiUrl + encodeURIComponent(this.name))
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            this.errors.push(res.error);
          } else {
            // Podría redireccionar a una nueva URL, o hacer algo diferente
            alert('Ok!');
          }
        });
      }
    }
  }
})
```

Comenzamos con una variable que respresenta la URL de la API que está ejecutando en OpenWhisk. Ahora vea el método `checkForm`. En esta versión, siempre impedimos que el formulario se envíe (lo cual también se podría hacer en el HTML con Vue). Puede ver un chequeo básico para ver sí `this.name` está vacío, y luego hacemos el llamado a la API. En caso de error, agregamos un error como hacíamos antes. Ahora no estamos realizando nada en caso de exito (simplemente un _alert_), pero usted podría redirigir al usuario a una página con el nombre del producto en la URL, o realizar otras acciones según desee. Puede probar este ejemplo aquí:

<p data-height="265" data-theme-id="0" data-slug-hash="BmgzeM" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 4" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/BmgzeM/">form validation 4</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Patrones Alternativos

Mientras este libro de recetas se basa en realizar la validación de formularios "a mano", existen, por supuesto, algunas librerías Vue que manejarán muchos de estos detalles por usted. Cambiar a una librería existente puede impactar en el tamaño final de su aplicación, pero los beneficios pueden ser tremendos. Tendrá código (probablemente) testado y también regularmente actualizado. Algunos ejemplos de librerías de validación de formularios para Vue incluyen:

* [vuelidate](https://github.com/monterail/vuelidate)
* [VeeValidate](http://vee-validate.logaretm.com/)
