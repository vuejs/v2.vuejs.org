---
title: Form Validation
type: cookbook
order: 3
---

## Exemple de base

La validation des formulaires est supportée nativement par le navigateur. Parfois on va observer des différences sur la manière de gérer la validation en fonction des navigateurs ce qui fait que se reposer sur cette validation supportée nativement est des plus délicat. Même quand la validation est supportée parfaitement, il se peut que quand des validations personnalisées ou plus "manuelles" sont nécessaires, les solutions basées sur Vue soient plus appropriées. Commençons avec un exemple simple.

Pour un formulaire avec trois champs, considérons que deux sont obligatoires. Regardons le HTML d'abord:

``` html
<form
  id="app"
  @submit="checkForm"
  action="https://vuejs.org/"
  method="post"
>

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for="name">Name</label>
    <input
      id="name"
      v-model="name"
      type="text"
      name="name"
    >
  </p>

  <p>
    <label for="age">Age</label>
    <input
      id="age"
      v-model="age"
      type="number"
      name="age"
      min="0">
  </p>

  <p>
    <label for="movie">Favorite Movie</label>
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
      value="Submit"
    >
  </p>

</form>
```

Analysons cela à partir en partant du haut. La balise `<form>` a un id que nous utiliserons pour le composant Vue. Il y a un gestionnaire d'évènement à la soumission du formulaire que vous verrez dans un moment, et l'attribut `action` correspond a une URL temporaire qui devrait pointer vers quelque chose de réel sur un serveur (sur lequel vous avez une validation côté serveur bien entendu).

En dessous il y a un paragraphe qui s'affiche ou non en fonction de la présence d'erreurs. C'est une simple liste d'erreurs au-dessus du formulaire. Notez aussi que l'on déclenche la validation à la soumission du formulaire plutôt qu'a la modification de chaque champ.

La dernière chose à remarquer est que chacun des trois champs possède un `v-model` correspondant afin de les connecter aux valeurs sur lesquelles nous travaillerons en JavaScript.

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
        this.errors.push('Name required.');
      }
      if (!this.age) {
        this.errors.push('Age required.');
      }

      e.preventDefault();
    }
  }
})
```

Relativement court et simple, on définit un tableau pour contenir les erreurs et les valeurs des trois champs du formulaire sont initialisées à `null`. La logique de `checkForm` (qui est activée à la soumission du formulaire) vérifie seulement que name et age ont des valeurs puisque movie est optionnel. Si ce n'est pas le cas, on vérifie chacune d'elles et on ajoute une erreur spécifique quand elles sont nulles. Et c'est tout. Vous pouvez lancer la démo ci-dessous. N'oubliez pas que pour une soumission réussie, cela va générer une requête POST à une URL temporaire.

<p data-height="265" data-theme-id="0" data-slug-hash="GObpZM" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 1" class="codepen">Voir le Pen <a href="https://codepen.io/cfjedimaster/pen/GObpZM/">form validation 1</a> par Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) sur <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Utiliser une validation personnalisée.

Pour le second exemple, le deuxième champ de texte (age) est remplacé par un champ d'email qui sera validé par un peu de logique personnalisée. Le code vient de la question StackOverflow , [Comment valider une adresse email en JavaScript?](https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript). C'est une très bonne question puisqu'elle fait passer votre plus intense discussion politique ou religieuse sur Facebook pour un simple désaccord sur qui fait la meilleure bière. Sérieusement, c'est délirant. Voici le HTML, même si il est très proche du premier exemple.

``` html
<form
  id="app"
  @submit="checkForm"
  action="https://vuejs.org/"
  method="post"
  novalidate="true"
>

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for="name">Name</label>
    <input
      id="name"
      v-model="name"
      type="text"
      name="name"
    >
  </p>

  <p>
    <label for="email">Email</label>
    <input
      id="email"
      v-model="email"
      type="email"
      name="email"
    >
  </p>

  <p>
    <label for="movie">Favorite Movie</label>
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
      value="Submit"
    >
  </p>

</form>
```

Bien qu'il y ait peu de différence, remarquez le `novalidate="true"` au début. C'est important car le navigateur va essayer de valider l'adresse email dans le champ quand `type=email` est spécifié. Honnêtement, il est plus logique de faire confiance au navigateur dans ce cas, mais comme nous voulions un exemple personnalisé de validation, nous le désactivons. Voici le JavaScript mis à jour.

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
        this.errors.push("Name required.");
      }
      if (!this.email) {
        this.errors.push('Email required.');
      } else if (!this.validEmail(this.email)) {
        this.errors.push('Valid email required.');
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

Comme vous pouvez le voir, nous avons ajouté une nouvelle méthode `validEmail` qui est simplement appelée par `checkForm`. Vous pouvez jouer avec l'exemple ici:

<p data-height="265" data-theme-id="0" data-slug-hash="vWqNXZ" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 2" class="codepen">Voir le Pen <a href="https://codepen.io/cfjedimaster/pen/vWqNXZ/">form validation 2</a> par Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) sur <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Autre exemple de validation personnalisée

Pour le troisième exemple, nous avons construit quelque chose que vous avez surement déjà vu dans des applications de sondage. L'utilisateur se voit demander de dépenser un budget pour un ensemble de propriétés pour un nouveau modèle de Star Destroyer. Le total doit être de 100. Tout d'abord le HTML.

``` html
<form
  id="app"
  @submit="checkForm"
  action="https://vuejs.org/"
  method="post"
  novalidate="true"
>

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    Given a budget of 100 dollars, indicate how much
    you would spend on the following features for the
    next generation Star Destroyer. Your total must sum up to 100.
  </p>

  <p>
    <input
      v-model.number="weapons"
      type="number"
      name="weapons"
    > Weapons <br/>
    <input
      v-model.number="shields"
      type="number"
      name="shields"
    > Shields <br/>
    <input
      v-model.number="coffee"
      type="number"
      name="coffee"
    > Coffee <br/>
    <input
      v-model.number="ac"
      type="number"
      name="ac"
    > Air Conditioning <br/>
    <input
      v-model.number="mousedroids"
      type="number"
      name="mousedroids"
    > Mouse Droids <br/>
  </p>

  <p>
    Current Total: {{total}}
  </p>

  <p>
    <input
      type="submit"
      value="Submit"
    >
  </p>

</form>
```

Notez l'ensemble des champs pour les cinq propriétés. Remarquez l'ajout de `.number` à la suite de l'attribut `v-model`. Cela dit à Vue de caster la valeur en un nombre quand vous l'utilisez. Il y a cependant un bug avec cette fonctionnalité qui fait que quand la valeur est nulle, cela retourne une chaine de caractère. Vous verrez comment contourner cela plus bas. Pour faciliter la tâche à l'utilisateur, nous avons ajouté le total en cours juste en bas afin qu'ils puissent le visualiser en temps réel. Maintenant regardons le JavaScript.

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
       // must parse because Vue turns empty value to string
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
        this.errors.push('Total must be 100!');
      }

      if (!this.errors.length) {
        return true;
      }

      e.preventDefault();
    }
  }
})
```

Nous avons défini le total comme une valeur calculée et la méthode checkForm doit maintenant juste vérifier si le total est 100 et c'est tout. Vous pouvez jouer avec ici:

<p data-height="265" data-theme-id="0" data-slug-hash="vWqGoy" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 3" class="codepen">Voir le Pen <a href="https://codepen.io/cfjedimaster/pen/vWqGoy/">form validation 3</a> par Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) sur <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Validation côté serveur

Dans mon dernier exemple, nous allons construire une application vuejs qui utilise Ajax pour valider des données via le serveur. Le formulaire va vous demander de nommer un nouveau produit et ensuite s'assurer que ce nom est unique. Nous avons écrit une rapide [OpenWhisk](http://openwhisk.apache.org/) action sans serveur pour gérer la validation, voici la logique de cette action.

``` js
function main(args) {
    return new Promise((resolve, reject) => {
        // bad product names: vista, empire, mbp
        const badNames = ['vista', 'empire', 'mbp'];

        if (badNames.includes(args.name)) {
          reject({error: 'Existing product'});
        }

        resolve({status: 'ok'});
    });
}
```

En gros, tous les noms exceptés "vista", "empire", and "mbp" sont valides. Bien, regardons donc le formulaire.

``` html
<form
  id="app"
  @submit="checkForm"
  method="post"
>

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for="name">New Product Name: </label>
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
      value="Submit"
    >
  </p>

</form>
```

Il n'y a rien de bien spécial ici. Voyons maintenant le JavaScript.

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
        this.errors.push('Product name is required.');
      } else {
        fetch(apiUrl + encodeURIComponent(this.name))
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            this.errors.push(res.error);
          } else {
            // redirect to a new URL, or do something on success
            alert('ok!');
          }
        });
      }
    }
  }
})
```

On commence par une variable pour l'URL de l'API qui est exécuté sur OpenWhisk. Maintenant, voyons `checkForm`. Dans cette version, nous empêchons le formulaire d'être soumis (ce qui, par ailleurs, pourrait être fait en HTML par Vue). Vous pouvez voir une vérification basique sur la nullité de `this.name` puis on attaque l'API. Si c'est un mauvais nom, on ajoute une erreur comme précédemment. Si c'est bon, dans cet exemple nous ne faisons rien à part une alerte JavaScript, mais vous pouvez renvoyer l'utilisateur vers une nouvelle page avec le nom du produit dans l'URL, ou effectuer d'autres actions. Vous pouvez tester la démo ci-dessous:

<p data-height="265" data-theme-id="0" data-slug-hash="BmgzeM" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 4" class="codepen">Voir le Pen <a href="https://codepen.io/cfjedimaster/pen/BmgzeM/">form validation 4</a> par Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) sur <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Patterns alternatifs

Bien que cette partie se focalise essentiellement sur une validation "manuelle", il y a bien sûr, de très bonnes bibliothèques permettant de gérer cela pour vous. Opter pour une bibliothèque pré-packagée pourrait avoir un impact sur la taille finale de votre application, mais les bénéfices pourraient être énormes. Vous avez à votre disposition du code qui est (très probablement) très bien testé et aussi mis à jour régulièrement. Quelques exemples de bibliothèques de validation pour Vue:

* [vuelidate](https://github.com/monterail/vuelidate)
* [VeeValidate](http://vee-validate.logaretm.com/)
