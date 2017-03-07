---
title: L'instance de Vue
type: guide
order: 3
---

## Constructeur

Chaque Vue vm est initialisée en créant une **instance racine de Vue** avec le constructeur de la fonction `Vue`

``` js
var vm = new Vue({
  // options
})
```

Bien que n'étant pas strictement associée au patron d'architecture [MVVM pattern](https://en.wikipedia.org/wiki/Model_View_ViewModel), la conception de Vue s'en est en partie inspirée. Par convention, nous utilisons souvent la variable `vm` (abréviation pour ViewModel) pour faire référence à nos instances de Vue.

Quand vous créez une instance de Vue, vous devez passer un **objet d'options** qui contient les options pour les données, le template, l’élément de montage, les méthodes, les fonctions de retour du cycle de vie etc... La liste des options peut être trouvée [dans la documentation de l'API](../api).

Le constructeur de `Vue` peut être étendu pour créer des **constructeurs de composants** réutilisables avec des options prédéfinies.

``` js
var MyComponent = Vue.extend({
  // options d'extension
})

// toutes les instances de `MyComponent` sont créées avec
// les options d'extension prédéfinies
var myComponentInstance = new MyComponent()
```

Bien qu'il soit possible de créer des instances étendues de manière impérative, la plupart du temps il est recommandé de les composer de manière déclarative dans les templates en tant qu'éléments personnalisés. Nous parlerons du [système de composants](components.html) en détail plus loin. Pour le moment, vous avez juste besoin de savoir que tous les composants de Vue sont fondamentalement des instances de Vue étendues. 

## Propriétés et méthodes

Chaque instance de vue **« proxifie »** toutes les propriétés contenues dans son objet `data`

``` js
var data = { a: 1 }
var vm = new Vue({
  data: data
})

vm.a === data.a // -> true

// assigner la propriété affecte également la donnée originale
vm.a = 2
data.a // -> 2

// ... et vice-versa
data.a = 3
vm.a // -> 3
```

Soulignons que seuls ces propriétés proxifiées sont **réactives**. Si vous attachez une nouvelle propriété à l'instance après sa création, elle ne déclenchera aucune mise à jour de la vue. Nous parlerons plus loin du système de réactivité en détail.

En plus des propriétés de data, les instances de Vue exposent de nombreuses méthodes et propriétés utiles. Ces propriétés et méthodes sont préfixées par `$` pour les différencier des propriétés proxifiées de data. Par exemple :

``` js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // -> true
vm.$el === document.getElementById('example') // -> true

// $watch est une méthode de l'instance
vm.$watch('a', function (newVal, oldVal) {
  // cette fonction de retour sera appelée quand `vm.a` changera
})
```

<p class="tip">N'utilisez pas les [fonctions fléchées](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Fonctions/Fonctions_fl%C3%A9ch%C3%A9es) sur une propriété ou fonction de retour d'une instance  (par exemple `vm.$watch('a', newVal => this.myMethod())`). Comme les fonctions fléchées sont liées au contexte parent, `this` ne sera pas l'instance de Vue comme vous pourriez vous y attendre et `this.myMethod` sera indéfini.</p>

Consultez [l'API](../api) pour une liste complète des propriétés et méthodes d'une instance. 

## Les *hooks* de cycle de vie d'une instance

Chaque instance de vue traverse une série d'étapes d'initialisation au moment de sa création - par exemple, elle doit mettre en place l'observation des données, compiler le template, monter l'instance sur le DOM et mettre à jour le DOM quand les données changent. En cours de route, elle va aussi invoquer des **_hooks_ de cycle de vie**, qui nous donnent l'opportunité d'exécuter une logique personnalisée. Par exemple, le hook [`created`](../api/#created) est appelé une fois l'instance créée.

``` js
var vm = new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` est une référence à l'instance de vm
    console.log('a is: ' + this.a)
  }
})
// -> "a is: 1"
```

Il y aussi d'autres hooks qui seront appelés à différentes étapes du cycle de vie d'une instance, par exemple [`mounted`](../api/#mounted), [`updated`](../api/#updated) et [`destroyed`](../api/#destroyed). Tous ces *hooks* de cycle de vie sont appelés avec leur `this` pointant sur l'instance de la vue qui les invoque. Vous vous êtes peut-être demandé où se trouvait le concept de « contrôleur » dans le monde de Vue et la réponse est : il n'y pas de contrôleurs. Votre logique personnalisée pour un composant sera répartie entre ces *hooks* de cycle de vie.

## Diagramme de cycle de vie

Ci-dessous se trouve le diagramme d'un cycle de vie d'une instance. Vous n'avez pas besoin de tout comprendre de A à Z à ce stade, mais ce diagramme pourra vous être utile dans le futur.

<div class="lifecycle">
	<style scoped>
		.lifecycle {
		    position: relative;
		    font-size: 2vw;
		    font-weight: bold;
		    color: #fff;
		    text-align: center;
		}
		@media (min-width: 760px) {
			.lifecycle {
		    	font-size: 16px;
			}
		}
		.lifecycle--observe-data,
		.lifecycle--init-event,
		.lifecycle--has-el,
		.lifecycle--has-template,
		.lifecycle--when-mount,
		.lifecycle--if-el-yes,
		.lifecycle--if-el-no,
		.lifecycle--if-template-yes,
		.lifecycle--if-template-no,
		.lifecycle--compile-function,
		.lifecycle--compile-template,
		.lifecycle--create-el,
		.lifecycle--virtual-dom,
		.lifecycle--when-data-change,
		.lifecycle--when-destroy,
		.lifecycle--teardown,
		.lifecycle--mounted,
		.lifecycle--destroyed {
			z-index: 2;
		    position: absolute; 
		    transform: translate(-50%, -50%);
		    background-color: #3ab882;
		    border-radius: 10px;
		}
		.lifecycle--observe-data,
		.lifecycle--init-event,
		.lifecycle--compile-function,
		.lifecycle--compile-template,
		.lifecycle--create-el,
		.lifecycle--virtual-dom,
		.lifecycle--teardown {
		    background-color: #3ab882;
		    border-radius: 10px;
		}
		.lifecycle--has-el,
		.lifecycle--has-template {
		    background-color: #fcb738;
		    border-radius: 50%;
		}
		.lifecycle--mounted,
		.lifecycle--destroyed {
		    background-color: #da5961;
		    border-radius: 50%;
		}
		.lifecycle--when-mount,
		.lifecycle--if-el-yes,
		.lifecycle--if-el-no,
		.lifecycle--if-template-yes,
		.lifecycle--if-template-no,
		.lifecycle--when-data-change,
		.lifecycle--when-destroy {
			color: #8699A3;
		    background-color: #fff;
		}
		.lifecycle--observe-data {
		    top: 9.7%;
		    left: 49%;
		    width: 24.5%;
		    height: 3.3%;
		}
		.lifecycle--init-event {
		    top: 15.3%;
		    left: 49%;
		    width: 24.5%;
		    height: 2.9%;
		}
		.lifecycle--has-el {
		    top: 23.2%;
		    left: 49%;
		    width: 16%;
		    height: 4%;
		}
		.lifecycle--has-template {
			top: 31.6%;
			left: 49%;
			width: 16%;
			height: 4%;
		}
		.lifecycle--when-mount {
			top: 27%;
		    left: 77.5%;
		    width: 18%;
			height: 4%;
		}
		.lifecycle--if-el-yes {
	        left: 45%;
		    top: 27.4%;
		    width: 6%;
		    height: 1%;
		}
		.lifecycle--if-el-no {
		    top: 22.2%;
		    left: 70.5%;
		    width: 6%;
		    height: 1%;
		}
		.lifecycle--if-template-yes {
	        top: 37.7%;
		    left: 22.5%;
		    width: 6%;
		    height: 1%;
		}
		.lifecycle--if-template-no {
		    top: 37.7%;
		    left: 75.5%;
		    width: 6%;
		    height: 1%;
		}
		.lifecycle--compile-function {
			top: 41.7%;
		    left: 27%;
		    width: 24.5%;
		    height: 5%;
		}
		.lifecycle--compile-template {
			top: 41.7%;
		    left: 70.5%;
		    width: 24.5%;
		    height: 5%;
		}
		.lifecycle--create-el {
			top: 55%;
		    left: 49%;
		    width: 24.5%;
		    height: 5%;
		}
		.lifecycle--virtual-dom {
    		top: 68.5%;
	        left: 79%;
    		width: 17%;
		    height: 5%;
		}
		.lifecycle--when-data-change {
		    top: 63%;
    		left: 66%;
    		width: 13%;
			height: 4%;
		}
		.lifecycle--when-destroy {
			top: 75.2%;
		    left: 49%;
		    width: 17%;
			height: 4%;
		}
		.lifecycle--teardown {
	        top: 85%;
		    left: 49%;
    		width: 28%;
		    height: 5%;
		}
		.lifecycle--mounted {
    		top: 68.3%;
		    left: 49%;
	        width: 12%;
		    height: 5%;
		}
		.lifecycle--destroyed {
		    top: 94%;
		    left: 49%;
	        width: 12%;
		    height: 5%;
		}
		.lifecycle--observe-data span,
		.lifecycle--init-event span,
		.lifecycle--has-el span,
		.lifecycle--has-template span,
		.lifecycle--when-mount span,
		.lifecycle--if-el-yes span,
		.lifecycle--if-el-no span,
		.lifecycle--if-template-yes span,
		.lifecycle--if-template-no span,
		.lifecycle--compile-function span,
		.lifecycle--compile-template span,
		.lifecycle--create-el span,
		.lifecycle--virtual-dom span,
		.lifecycle--when-data-change span,
		.lifecycle--when-destroy span,
		.lifecycle--teardown span,
		.lifecycle--mounted span,
		.lifecycle--destroyed span {
		    position: absolute;
		    top: 50%;
		    left: 50%;
			transform: translate(-50%, -50%);
			width: 100%;
		}
	</style>
	<div class="lifecycle--observe-data"><span>Observe les données</span></div>
	<div class="lifecycle--init-event"><span>Initialise les événements</span></div>
	<div class="lifecycle--has-el"><span>A l'option “el”</span></div>
	<div class="lifecycle--has-template"><span>A l'option “template”</span></div>
	<div class="lifecycle--when-mount"><span>quand vm.$mount(el) est appelé</span></div>
	<div class="lifecycle--if-el-yes"><span>OUI</span></div>
	<div class="lifecycle--if-el-no"><span>NON</span></div>
	<div class="lifecycle--if-template-yes"><span>OUI</span></div>
	<div class="lifecycle--if-template-no"><span>NON</span></div>
	<div class="lifecycle--compile-function"><span>Compiler le template en une fonction de rendu</span></div>
	<div class="lifecycle--compile-template"><span>Compiler le contenu HTML de el en tant que template</span></div>
	<div class="lifecycle--create-el"><span>Créer vm.$el et remplacer el avec</span></div>
	<div class="lifecycle--virtual-dom"><span>Re-rendu du DOM Virtuel puis du DOM</span></div>
	<div class="lifecycle--when-data-change"><span>quand les données changent</span></div>
	<div class="lifecycle--when-destroy"><span>quand vm.$destroy() est appelé</span></div>
	<div class="lifecycle--teardown"><span>Démontage des observateurs, composants enfants et écouteurs d'événement</span></div>
	<div class="lifecycle--mounted"><span>Monté</span></div>
	<div class="lifecycle--destroyed"><span>Détruit</span></div>
	<p><img src="/images/lifecycle.png" alt="Lifecycle"></p>
</div>
