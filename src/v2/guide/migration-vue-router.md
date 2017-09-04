---
title: Migração do Vue Router 0.7.x
type: guide
order: 602
---

> Somente Vue Router 2 é compatível com Vue 2, então se você estiver atualizando o Vue, terá de atualizar também o Vue Router. Esta é a razão pela qual incluímos detalhes de migração aqui na documentação principal. Para um guia completo em como usar o novo Vue Router, veja a [documentação do Vue Router](http://router.vuejs.org/en/).

## Inicialização do Roteador

### `router.start` <sup>obsoleto</sup>

Não há mais uma API especial para inicializar um aplicativo com Vue Router. Ao invés de:

``` js
router.start({
  template: '<router-view></router-view>'
}, '#app')
```

Apenas passe uma propriedade router para a instância Vue:

``` js
new Vue({
  el: '#app',
  router: router,
  template: '<router-view></router-view>'
})
```

Ou, se estiver usando a compilação *runtime-only* do Vue:

``` js
new Vue({
  el: '#app',
  router: router,
  render: h => h('router-view')
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>router.start</code>.</p>
</div>
{% endraw %}

## Definição de Rotas


### `router.map` <sup>alterado</sup>

Rotas são agora definidas como um Array em uma [opção `routes`](http://router.vuejs.org/en/essentials/getting-started.html#javascript) na inicialização do roteador. Então estas rotas, por exemplo:

``` js
router.map({
  '/foo': {
    component: Foo
  },
  '/bar': {
    component: Bar
  }
})
```

Serão definidas desta forma:

``` js
var router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})
```

A sintaxe com Array oferece mais precisão na definição de rotas, uma vez que ao iterar sobre objetos não existe garantia da mesma ordem dos atributos entre navegadores.

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>router.map</code>.</p>
</div>
{% endraw %}

### `router.on` <sup>removido</sup>

Se você precisar programaticamente gerar rotas quando iniciar a aplicação, é possível fazer isso acrescentando dinamicamente definições a um Array de rotas. Por exemplo:

``` js
// Rotas base normais
var routes = [
  // ...
]

// Rotas geradas dinamicamente
marketingPages.forEach(function (page) {
  routes.push({
    path: '/marketing/' + page.slug
    component: {
      extends: MarketingComponent
      data: function () {
        return { page: page }
      }
    }
  })
})

var router = new Router({
  routes: routes
})
```

Se houver necessidade de adicionar rotas após a inicialização, é possível substituir a função de identificação de rotas com uma nova que inclua a rota que você deseja adicionar:

``` js
router.match = createMatcher(
  [{
    path: '/my/new/path',
    component: MyComponent
  }].concat(router.options.routes)
)
```

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>router.on</code>.</p>
</div>
{% endraw %}

### `router.beforeEach` <sup>alterado</sup>

`router.beforeEach` agora trabalha assincronamente e recebe uma função `next` como seu terceiro argumento.

``` js
router.beforeEach(function (transition) {
  if (transition.to.path === '/forbidden') {
    transition.abort()
  } else {
    transition.next()
  }
})
```

``` js
router.beforeEach(function (to, from, next) {
  if (to.path === '/forbidden') {
    next(false)
  } else {
    next()
  }
})
```

### `subRoutes` <sup>renomeado</sup>

[Renomeado para `children`](http://router.vuejs.org/en/essentials/nested-routes.html) para consistência com Vue e com outras bibliotecas de rotas.

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>subRoutes</code>.</p>
</div>
{% endraw %}


### `router.redirect` <sup>alterado</sup>

Isto agora é uma [opção da definição de uma rota](http://router.vuejs.org/en/essentials/redirect-and-alias.html). Então, por exemplo, você atualizará:

``` js
router.redirect({
  '/tos': '/terms-of-service'
})
```

Para uma definição conforme exibido abaixo, na configuração de suas `routes`:

``` js
{
  path: '/tos',
  redirect: '/terms-of-service'
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>router.redirect</code>.</p>
</div>
{% endraw %}


### `router.alias` <sup>alterado</sup>

Isto agora é uma [opção da definição da rota](http://router.vuejs.org/en/essentials/redirect-and-alias.html) de destino. Então, por exemplo, você atualizará:

``` js
router.alias({
  '/manage': '/admin'
})
```

Para uma definição conforme exibido abaixo, na configuração de suas `routes`:

``` js
{
  path: '/admin',
  component: AdminPanel,
  alias: '/manage'
}
```

Se você precisar de múltiplos apelidos, é possível usar uma sintaxe de Array:

``` js
alias: ['/manage', '/administer', '/administrate']
```

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>router.alias</code>.</p>
</div>
{% endraw %}


### Propriedades Arbitrárias em Rotas <sup>substituído</sup>

Propriedades definidas arbitrariamente em rotas agora precisam estar inseridas em uma nova propriedade `meta`, para evitar conflitos com atualizações futuras. Então, por exemplo:

``` js
'/admin': {
  component: AdminPanel,
  requiresAuth: true
}
```

Deverá ser atualizado para:

``` js
{
  path: '/admin',
  component: AdminPanel,
  meta: {
    requiresAuth: true
  }
}
```

Assim, quando estiver acessando posteriormente esta propriedade da rota, será necessário também seguir através de `meta`. Por exemplo:

``` js
if (route.meta.requiresAuth) {
  // ...
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos propriedades arbitrárias em rotas não inseridas em <code>meta</code>.</p>
</div>
{% endraw %}

<!-- TODO -->
### [] Syntax for Arrays in Queries <sup>removed</sup>

When passing arrays to query parameters the QueryString syntax is no longer `/foo?users[]=Tom&users[]=Jerry`, instead, the new syntax is `/foo?users=Tom&users=Jerry`. Internally, `$route.query.users` will still be an Array, but if there's only one parameter in the query: `/foo?users=Tom`, when directly accessing this route, there's no way for the router to know if we were expecting `users` to be an Array. Because of this, consider adding a computed property and replacing every reference of `$route.query.users` with it:

```javascript
export default {
  // ...
  computed: {
    // users will always be an array
    users () {
      const users = this.$route.query.users
      return Array.isArray(users) ? users : [users]
    }
  }
}
```

## Identificação das Rotas

Agora a identificação das rotas utiliza [path-to-regexp](https://github.com/pillarjs/path-to-regexp) em seu interior, tornando-a muito mais flexível do que anteriormente.


### Um ou Mais Parâmetros Nomeados <sup>alterado</sup>

A sintaxe mudou levemente, assim `/category/*tags`, por exemplo, deveria ser atualizado para `/category/:tags+`.

{% raw %}
<div class="upgrade-path">

  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de sintaxe de rotas com regras obsoletas.</p>
</div>
{% endraw %}

## Links


### `v-link` <sup>substituído</sup>

A diretiva `v-link` foi substituída por um novo [componente `<router-link>`](http://router.vuejs.org/en/api/router-link.html), visto que este tipo de tarefa é exclusivamente responsabilidade de componentes no Vue 2. Isso significa que em qualquer lugar que você tiver um *link* como este:

``` html
<a v-link="'/about'">Sobre</a>
```

Você precisará atualizá-lo desta forma:

``` html
<router-link to="/about">Sobre</router-link>
```

Note that `target="_blank"` is not supported on `<router-link>`, so if you need to open a link in a new tab, you have to use `<a>` instead.

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos com a diretiva <code>v-link</code>.</p>
</div>
{% endraw %}

### `v-link-active` <sup>substituído</sup>

A diretiva `v-link-active` também foi removida em favor de se especificar uma *tag* separada [no componente `<router-link>`](http://router.vuejs.org/en/api/router-link.html). Então, por exemplo, você irá atualizar isto:

``` html
<li v-link-active>
  <a v-link="'/about'">Sobre</a>
</li>
```

Para isto:

``` html
<router-link tag="li" to="/about">
  <a>Sobre</a>
</router-link>
```

O elemento `<a>` será efetivamente o *link* (e obterá corretamente o `href`), mas a classe de estado ativo será aplicada ao elemento externo `<li>`.

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos com a diretiva <code>v-link-active</code>.</p>
</div>
{% endraw %}

## Navegação Programática

### `router.go` <sup>changed</sup>

Para consistência com a [HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API), `router.go` agora é usado somente para [navegação de voltar/avançar](https://router.vuejs.org/en/essentials/navigation.html#routergon), enquanto [`router.push`](http://router.vuejs.org/en/essentials/navigation.html#routerpushlocation) para navegação a páginas específicas.

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>router.go</code> sendo usado onde <code>router.push</code> deveria ser usado em seu lugar.</p>
</div>
{% endraw %}

## Opções do Roteador: Modos

### `hashbang: false` <sup>removido</sup>

Hashbangs não são mais exigidos pelo Google para indexar uma URL, assim não são mais uma opção padrão (ou mesmo uma opção existente) para a estratégia de hash.

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>hashbang: false</code>.</p>
</div>
{% endraw %}


### `history: true` <sup>substituído</sup>

Todos os modos de roteamento foram condensados em uma simples [opção `mode`](http://router.vuejs.org/en/api/options.html#mode). Atualize:

``` js
var router = new VueRouter({
  history: true
})
```

Para:

``` js
var router = new VueRouter({
  mode: 'history'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>history: true</code>.</p>
</div>
{% endraw %}


### `abstract: true` <sup>subsituído</sup>

Todos os modos de roteamento foram condensados em uma simples [opção `mode`](http://router.vuejs.org/en/api/options.html#mode). Atualize:

``` js
var router = new VueRouter({
  abstract: true
})
```

Para:

``` js
var router = new VueRouter({
  mode: 'abstract'
})
```

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>abstract: true</code>.</p>
</div>
{% endraw %}

## Opções do Roteador: Diversos


### `saveScrollPosition` <sup>subsituído</sup>


Foi substituído com uma [opção `scrollBehavior`](http://router.vuejs.org/en/advanced/scroll-behavior.html) que aceita uma função, de forma que o comportamento de rolagem pode ser completamente personalizado - inclusive por rota. Abre-se muitas novas possibilidades, mas para simplesmente replicar o antigo comportamento de:

``` js
saveScrollPosition: true
```

Você pode substituir com uma função como esta:

``` js
scrollBehavior: function (to, from, savedPosition) {
  return savedPosition || { x: 0, y: 0 }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>saveScrollPosition: true</code>.</p>
</div>
{% endraw %}


### `root` <sup>renomeado</sup>

Renomeado para `base` para consistência com [o elemento HTML `<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base).

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>root</code>.</p>
</div>
{% endraw %}


### `transitionOnLoad` <sup>removido</sup>

Esta opção não é mais necessária agora que o sistema de transições do Vue tem explícito controle de [`appear` de transições](transitions.html#Transitions-on-Initial-Render).

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>transitionOnLoad: true</code>.</p>
</div>
{% endraw %}


### `suppressTransitionError` <sup>removido</sup>

Removido para simplificação de ganchos. Se você realmente precisar suprimir erros de transição, você pode usar [`try`...`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) para isto.

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>suppressTransitionError: true</code>.</p>
</div>
{% endraw %}

## Ganchos do Roteador


### `activate` <sup>substituído</sup>

Em seu lugar, use [`beforeRouteEnter`](http://router.vuejs.org/en/advanced/navigation-guards.html#incomponent-guards) no componente.

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>active</code>.</p>
</div>
{% endraw %}


### `canActivate` <sup>subsituído</sup>

Em seu lugar, use [`beforeEnter`](http://router.vuejs.org/en/advanced/navigation-guards.html#perroute-guard) no roteador.

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>canActivate</code>.</p>
</div>
{% endraw %}


### `deactivate` <sup>removido</sup>

Em seu lugar, use os ganchos de componentes [`beforeDestroy`](../api/#beforeDestroy) ou [`destroyed`](../api/#destroyed).

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>deactivate</code>.</p>
</div>
{% endraw %}

### `canDeactivate` <sup>subsituído</sup>

Em seu lugar, use [`beforeRouteLeave`](http://router.vuejs.org/en/advanced/navigation-guards.html#incomponent-guards) no componente.

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>canDeactivate</code>.</p>
</div>
{% endraw %}


### `canReuse: false` <sup>removido</sup>

Não existem mais casos de uso para isso no novo Vue Router.

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>canReuse: false</code>.</p>
</div>
{% endraw %}


### `data` <sup>subsituído</sup>

A propriedade `$route` é reativa, desta forma simplesmente utilize um observador para reagir a mudanças de rota, como neste exemplo:

``` js
watch: {
  '$route': 'fetchData'
},
methods: {
  fetchData: function () {
    // ...
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>data</code>.</p>
</div>
{% endraw %}


### `$loadingRouteData` <sup>removido</sup>

Defina sua própria propriedade (por exemplo, `isLoading`) e atualize a situação através de um observador na rota. Por exemplo, se estiver obtendo dados remotos com o [axios](https://github.com/mzabriskie/axios):

``` js
data () {
  return {
    posts: [],
    isLoading: false,
    fetchError: null
  }
},
watch: {
  '$route': () => {
    this.isLoading = true
    this.fetchData().then(() => {
      this.isLoading = false
    })
  }
},
methods: {
  fetchData: () => {
    return axios.get('/api/posts')
      .then(response => {
        this.posts = response.data.posts
      })
      .catch(error => {
        this.fetchError = error
      })
  }
}
```

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>$loadingRouteData</code>.</p>
</div>
{% endraw %}
