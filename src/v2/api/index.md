---
type: api
---

## Configuração Global

`Vue.config` é um objeto contendo a configuração global do Vue. Você pode modificar suas propriedades listadas abaixo antes de iniciar sua aplicação:

### silent

- **Tipo:** `boolean`

- **Padrão:** `false`

- **Uso:**

  ``` js
  Vue.config.silent = true
  ```

  Suprime todos os _logs_ e avisos do Vue.

### optionMergeStrategies

- **Tipo:** `{ [key: string]: Function }`

- **Padrão:** `{}`

- **Uso:**

  ``` js
  Vue.config.optionMergeStrategies._my_option = function (parent, child, vm) {
    return child + 1
  }

  const Profile = Vue.extend({
    _my_option: 1
  })

  // Profile.options._my_option = 2
  ```

  Define opções de mesclagem personalizadas.

  A estratégia de mesclagem recebe o valor da opção definida no pai e nas instâncias filhas como o primeiro e segundo argumento, repectivamente. O contexto da instância Vue é passado como o terceiro argumento.

- **Ver também:** [Estratégias de Mesclagem de Opções Customizadas](../guide/mixins.html#Estrategias-de-Mesclagem-de-Opcoes-Customizadas)

### devtools

- **Tipo:** `boolean`

- **Padrão:** `true` (`false` em builds de produção)

- **Uso:**

  ``` js
  // tenha certeza de definir isso imediatamente síncrono após o carregamento do Vue
  Vue.config.devtools = true
  ```

  Configura se deseja permitir a inspeção do [vue-devtools](https://github.com/vuejs/vue-devtools). O valor padrão dessa opção é `true` em compilações de desenvolvimento e `false` em compilações de produção. Você pode definir `true` para forçar habilitar a inspeção em compilações de produção.

### errorHandler

- **Tipo:** `Function`

- **Padrão:** `undefined`

- **Uso:**

  ``` js
  Vue.config.errorHandler = function (err, vm, info) {
    // manuseia o erro
    // `info` é um erro específico do Vue, ex: cada lifecycle hook
    // que o erro foi encontrado. Disponível apenas em 2.2.0+
  }
  ```

  Atribui um manipulador para erros não detectados durante a renderização do componente e dos observadores. O manipulador é chamado com o erro e a instância Vue.

  > No 2.2.0+, esse gatilho também captura erros em gatilhos de ciclo-de-vida do componente. Além disso, quando esse gatilho é `undefined`, os erros capturados são registrados com `console.error` em vez de quebrar o aplicativo.

  > No 2.4.0+, esse gatilho também captura erros disparados dentro de manipuladores de eventos personalizados.

  > [Sentry](https://sentry.io), um serviço de rastreamento de erro, fornece [integração oficial](https://sentry.io/for/vue/) usando essa opção.

### warnHandler

> Novo em 2.4.0+

- **Tipo:** `Function`

- **Padrão:** `undefined`

- **Uso:**

  ``` js
  Vue.config.warnHandler = function (msg, vm, trace) {
    // `trace` é a pilha da hierarquia do componente
  }
  ```

  Atribui um gatilho personalizado para avisos Vue de tempo de execução. Observe que isto funciona apenas durante o desenvolvimento e será ignorado em produção.

### ignoredElements

- **Tipo:** `Array<string>`

- **Padrão:** `[]`

- **Uso:**

  ``` js
  Vue.config.ignoredElements = [
    'my-custom-web-component', 'another-web-component'
  ]
  ```

  Faz com que o Vue ignore elementos customizados definidos fora do Vue (ex: usando APIs de Web Components). De outra forma, Vue iria lançar um aviso sobre `Unknown custom element` (elemento customizado desconhecido), assumindo que você esqueceu de registrar algum componente global ou escreveu erroneamente o nome de um componente.

### keyCodes

- **Tipo:** `{ [key: string]: number | Array<number> }`

- **Padrão:** `{}`

- **Uso:**

  ``` js
  Vue.config.keyCodes = {
    v: 86,
    f1: 112,
    // camelCase não funciona
    mediaPlayPause: 179,
    // ao invés disso, pode usar kebab-case com aspas duplas
    "media-play-pause": 179,
    up: [38, 87]
  }
  ```

  ```html
  <input type="text" @keyup.media-play-pause="method">
  ```

  Define atalhos personalizados de teclas para o `v-on`.

### performance

> Novo em 2.2.0+

- **Tipo:** `boolean`

- **Padrão:** `false (desde 2.2.3+)`

- **Uso:**

  Defina `true` para habilitar o rastreamento de desempenho do _init_, _compile_, _render_ e _patch_ do componente na linha-do-tempo de inspeção do navegador. Só funciona no modo de desenvolvimento e em navegadores que suportam a API do [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark).

### productionTip

> Novo em 2.2.0+

- **Tipo:** `boolean`

- **Padrão:** `true`

- **Uso:**

  Defina `false` para previnir a exibição da dica sobre o modo de produção ao iniciar o Vue.

## Métodos Globais

<h3 id="Vue-extend">Vue.extend( options )</h3>

- **Argumentos:**
  - `{Object} options`

- **Uso:**

  Create a "subclass" of the base Vue constructor. The argument should be an object containing component options.

  The special case to note here is the `data` option - it must be a function when used with `Vue.extend()`.

  ``` html
  <div id="mount-point"></div>
  ```

  ``` js
  // create constructor
  var Profile = Vue.extend({
    template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
    data: function () {
      return {
        firstName: 'Walter',
        lastName: 'White',
        alias: 'Heisenberg'
      }
    }
  })
  // create an instance of Profile and mount it on an element
  new Profile().$mount('#mount-point')
  ```

  Will result in:

  ``` html
  <p>Walter White aka Heisenberg</p>
  ```

- **Ver também:** [Components](../guide/components.html)

<h3 id="Vue-nextTick">Vue.nextTick( [callback, context] )</h3>

- **Argumentos:**
  - `{Function} [callback]`
  - `{Object} [context]`

- **Uso:**

  Defer the callback to be executed after the next DOM update cycle. Use it immediately after you've changed some data to wait for the DOM update.

  ``` js
  // modify data
  vm.msg = 'Hello'
  // DOM not updated yet
  Vue.nextTick(function () {
    // DOM updated
  })
  ```

  > Novo em 2.1.0+: returns a Promise if no callback is provided and Promise is supported in the execution environment.

- **Ver também:** [Async Update Queue](../guide/reactivity.html#Async-Update-Queue)

<h3 id="Vue-set">Vue.set( target, key, value )</h3>

- **Argumentos:**
  - `{Object | Array} target`
  - `{string | number} key`
  - `{any} value`

- **Returns:** the set value.

- **Uso:**

  Set a property on an object. If the object is reactive, ensure the property is created as a reactive property and trigger view updates. This is primarily used to get around the limitation that Vue cannot detect property additions.

  **Note the object cannot be a Vue instance, or the root data object of a Vue instance.**

- **Ver também:** [Reactivity in Depth](../guide/reactivity.html)

<h3 id="Vue-delete">Vue.delete( target, key )</h3>

- **Argumentos:**
  - `{Object | Array} target`
  - `{string | number} key/index`

  > Only works with Array + index in 2.2.0+.

- **Uso:**

  Delete a property on an object. If the object is reactive, ensure the deletion triggers view updates. This is primarily used to get around the limitation that Vue cannot detect property deletions, but you should rarely need to use it.

  <p class="tip">The target object cannot be a Vue instance, or the root data object of a Vue instance.</p>

- **Ver também:** [Reactivity in Depth](../guide/reactivity.html)

<h3 id="Vue-directive">Vue.directive( id, [definition] )</h3>

- **Argumentos:**
  - `{string} id`
  - `{Function | Object} [definition]`

- **Uso:**

  Register or retrieve a global directive.

  ``` js
  // register
  Vue.directive('my-directive', {
    bind: function () {},
    inserted: function () {},
    update: function () {},
    componentUpdated: function () {},
    unbind: function () {}
  })

  // register (simple function directive)
  Vue.directive('my-directive', function () {
    // this will be called as `bind` and `update`
  })

  // getter, return the directive definition if registered
  var myDirective = Vue.directive('my-directive')
  ```

- **Ver também:** [Custom Directives](../guide/custom-directive.html)

<h3 id="Vue-filter">Vue.filter( id, [definition] )</h3>

- **Argumentos:**
  - `{string} id`
  - `{Function} [definition]`

- **Uso:**

  Register or retrieve a global filter.

  ``` js
  // register
  Vue.filter('my-filter', function (value) {
    // return processed value
  })

  // getter, return the filter if registered
  var myFilter = Vue.filter('my-filter')
  ```

<h3 id="Vue-component">Vue.component( id, [definition] )</h3>

- **Argumentos:**
  - `{string} id`
  - `{Function | Object} [definition]`

- **Uso:**

  Register or retrieve a global component. Registration also automatically sets the component's `name` with the given `id`.

  ``` js
  // register an extended constructor
  Vue.component('my-component', Vue.extend({ /* ... */ }))

  // register an options object (automatically call Vue.extend)
  Vue.component('my-component', { /* ... */ })

  // retrieve a registered component (always return constructor)
  var MyComponent = Vue.component('my-component')
  ```

- **Ver também:** [Components](../guide/components.html)

<h3 id="Vue-use">Vue.use( plugin )</h3>

- **Argumentos:**
  - `{Object | Function} plugin`

- **Uso:**

  Install a Vue.js plugin. If the plugin is an Object, it must expose an `install` method. If it is a function itself, it will be treated as the install method. The install method will be called with Vue as the argument.

  When this method is called on the same plugin multiple times, the plugin will be installed only once.

- **Ver também:** [Plugins](../guide/plugins.html)

<h3 id="Vue-mixin">Vue.mixin( mixin )</h3>

- **Argumentos:**
  - `{Object} mixin`

- **Uso:**

  Apply a mixin globally, which affects every Vue instance created afterwards. This can be used by plugin authors to inject custom behavior into components. **Not recommended in application code**.

- **Ver também:** [Global Mixin](../guide/mixins.html#Global-Mixin)

<h3 id="Vue-compile">Vue.compile( template )</h3>

- **Argumentos:**
  - `{string} template`

- **Uso:**

  Compiles a template string into a render function. **Only available in the full build.**

  ``` js
  var res = Vue.compile('<div><span>{{ msg }}</span></div>')

  new Vue({
    data: {
      msg: 'hello'
    },
    render: res.render,
    staticRenderFns: res.staticRenderFns
  })
  ```

- **Ver também:** [Render Functions](../guide/render-function.html)

<h3 id="Vue-version">Vue.version</h3>

- **Details**: Provides the installed version of Vue as a string. This is especially useful for community plugins and components, where you might use different strategies for different versions.

- **Uso:**

```js
var version = Number(Vue.version.split('.')[0])

if (version === 2) {
  // Vue v2.x.x
} else if (version === 1) {
  // Vue v1.x.x
} else {
  // Unsupported versions of Vue
}
```

## Opções / Dados

### data

- **Tipo:** `Object | Function`

- **Restriction:** Only accepts `Function` when used in a component definition.

- **Detalhes:**

  The data object for the Vue instance. Vue will recursively convert its properties into getter/setters to make it "reactive". **The object must be plain**: native objects such as browser API objects and prototype properties are ignored. A rule of thumb is that data should just be data - it is not recommended to observe objects with its own stateful behavior.

  Once observed, you can no longer add reactive properties to the root data object. It is therefore recommended to declare all root-level reactive properties upfront, before creating the instance.

  After the instance is created, the original data object can be accessed as `vm.$data`. The Vue instance also proxies all the properties found on the data object, so `vm.a` will be equivalent to `vm.$data.a`.

  Properties that start with `_` or `$` will **not** be proxied on the Vue instance because they may conflict with Vue's internal properties and API methods. You will have to access them as `vm.$data._property`.

  When defining a **component**, `data` must be declared as a function that returns the initial data object, because there will be many instances created using the same definition. If we still use a plain object for `data`, that same object will be **shared by reference** across all instances created! By providing a `data` function, every time a new instance is created, we can simply call it to return a fresh copy of the initial data.

  If required, a deep clone of the original object can be obtained by passing `vm.$data` through `JSON.parse(JSON.stringify(...))`.

- **Exemplo:**

  ``` js
  var data = { a: 1 }

  // direct instance creation
  var vm = new Vue({
    data: data
  })
  vm.a // -> 1
  vm.$data === data // -> true

  // must use function when in Vue.extend()
  var Component = Vue.extend({
    data: function () {
      return { a: 1 }
    }
  })
  ```

  <p class="tip">Note that __you should not use an arrow function with the `data` property__ (e.g. `data: () => { return { a: this.myProp }}`). The reason is arrow functions bind the parent context, so `this` will not be the Vue instance as you expect and `this.myProp` will be undefined.</p>

- **Ver também:** [Reactivity in Depth](../guide/reactivity.html)

### props

- **Tipo:** `Array<string> | Object`

- **Detalhes:**

  A list/hash of attributes that are exposed to accept data from the parent component. It has a simple Array-based syntax and an alternative Object-based syntax that allows advanced configurations such as type checking, custom validation and default values.

- **Exemplo:**

  ``` js
  // simple syntax
  Vue.component('props-demo-simple', {
    props: ['size', 'myMessage']
  })

  // object syntax with validation
  Vue.component('props-demo-advanced', {
    props: {
      // just type check
      height: Number,
      // type check plus other validations
      age: {
        type: Number,
        default: 0,
        required: true,
        validator: function (value) {
          return value >= 0
        }
      }
    }
  })
  ```

- **Ver também:** [Props](../guide/components.html#Props)

### propsData

- **Tipo:** `{ [key: string]: any }`

- **Restriction:** only respected in instance creation via `new`.

- **Detalhes:**

  Pass props to an instance during its creation. This is primarily intended to make unit testing easier.

- **Exemplo:**

  ``` js
  var Comp = Vue.extend({
    props: ['msg'],
    template: '<div>{{ msg }}</div>'
  })

  var vm = new Comp({
    propsData: {
      msg: 'hello'
    }
  })
  ```

### computed

- **Tipo:** `{ [key: string]: Function | { get: Function, set: Function } }`

- **Detalhes:**

  Computed properties to be mixed into the Vue instance. All getters and setters have their `this` context automatically bound to the Vue instance.

  <p class="tip">Note that __you should not use an arrow function to define a computed property__ (e.g. `aDouble: () => this.a * 2`). The reason is arrow functions bind the parent context, so `this` will not be the Vue instance as you expect and `this.a` will be undefined.</p>

  Computed properties are cached, and only re-computed on reactive dependency changes. Note that if a certain dependency is out of the instance's scope (i.e. not reactive), the computed property will __not__ be updated.

- **Exemplo:**

  ```js
  var vm = new Vue({
    data: { a: 1 },
    computed: {
      // get only, just need a function
      aDouble: function () {
        return this.a * 2
      },
      // both get and set
      aPlus: {
        get: function () {
          return this.a + 1
        },
        set: function (v) {
          this.a = v - 1
        }
      }
    }
  })
  vm.aPlus   // -> 2
  vm.aPlus = 3
  vm.a       // -> 2
  vm.aDouble // -> 4
  ```

- **Ver também:** [Computed Properties](../guide/computed.html)

### methods

- **Tipo:** `{ [key: string]: Function }`

- **Detalhes:**

  Methods to be mixed into the Vue instance. You can access these methods directly on the VM instance, or use them in directive expressions. All methods will have their `this` context automatically bound to the Vue instance.

  <p class="tip">Note that __you should not use an arrow function to define a method__ (e.g. `plus: () => this.a++`). The reason is arrow functions bind the parent context, so `this` will not be the Vue instance as you expect and `this.a` will be undefined.</p>

- **Exemplo:**

  ```js
  var vm = new Vue({
    data: { a: 1 },
    methods: {
      plus: function () {
        this.a++
      }
    }
  })
  vm.plus()
  vm.a // 2
  ```

- **Ver também:** [Event Handling](../guide/events.html)

### watch

- **Tipo:** `{ [key: string]: string | Function | Object }`

- **Detalhes:**

  An object where keys are expressions to watch and values are the corresponding callbacks. The value can also be a string of a method name, or an Object that contains additional options. The Vue instance will call `$watch()` for each entry in the object at instantiation.

- **Exemplo:**

  ``` js
  var vm = new Vue({
    data: {
      a: 1,
      b: 2,
      c: 3
    },
    watch: {
      a: function (val, oldVal) {
        console.log('new: %s, old: %s', val, oldVal)
      },
      // string method name
      b: 'someMethod',
      // deep watcher
      c: {
        handler: function (val, oldVal) { /* ... */ },
        deep: true
      }
    }
  })
  vm.a = 2 // -> new: 2, old: 1
  ```

  <p class="tip">Note that __you should not use an arrow function to define a watcher__ (e.g. `searchQuery: newValue => this.updateAutocomplete(newValue)`). The reason is arrow functions bind the parent context, so `this` will not be the Vue instance as you expect and `this.updateAutocomplete` will be undefined.</p>

- **Ver também:** [Métodos da Instância / Data - vm.$watch](#vm-watch)

## Opções / DOM

### el

- **Tipo:** `string | HTMLElement`

- **Restrição:** respeitado apenas durante a criação da instância com `new`.

- **Detalhes:**

  Fornece um elemento existente no DOM para a instância Vue ser montada. Pode ser um seletor CSS ou um `HTMLElement`.

  Após a instância ser montada, o elemento gerado poderá ser acessado utilizando `vm.$el`.

  Se essa opção estiver disponível durante a instanciação, a instância irá compilar imediatamente; caso contrário, o usuário terá que chamar explicitamente `vm.$mount()` para iniciar manualmente a compilação.

  <p class="tip">O elemento fornecido serve apenas como ponto de montagem. Diferentemente do Vue 1.x, o elemento montado será substituído pelo DOM gerado pelo Vue em todos os casos. Portanto, não é recomendado montar a instância raiz em `<html>` ou `<body>`.</p>

  <p class="tip">Se a função `render` ou a opção `template` não estiverem presentes, o HTML já existente no DOM do elemento sendo montado será extraído como seu _template_. Neste caso, a versão Runtime + Compilador do Vue precisa ser utilizada.</p>

- **Ver também:**
  - [Diagrama do Ciclo de Vida](../guide/instance.html#Diagrama-do-Ciclo-de-Vida)
  - [Runtime + Compiler vs. Runtime](../guide/installation.html#Runtime-Compilador-vs-Runtime)

### template

- **Tipo:** `string`

- **Detalhes:**

  Um _template_ dentro de uma String para ser usado como marcação para a instância Vue. O _template_ irá **substituir** o elemento montado. Qualquer marcação existente dentro do elemento montado será ignorada, a menos que _slots_ de destribuição de conteúdo estejam presentes no _template_.

  Se a String começa com `#`, ela será usada como um `querySelector` e utilizará o `innerHTML` do elemento selecionado como _template_ String. Isto permite o uso do truque comum com `<script type="x-template">` para incluir _templates_.

  <p class="tip">De uma perspective de segurança, você deve usar apenas _templates_ Vue em que possa confiar. Nunca use conteúdo gerado pelo usuário como seu _template_.</p>

  <p class="tip">Se a função `render` estiver presente nas opções Vue, o _template_ será ignorado.</p>

- **Ver também:**
  - [Diagrama do Ciclo de Vida](../guide/instance.html#Diagrama-do-Ciclo-de-Vida)
  - [Distribuição de Conteúdo com Slots](../guide/components.html#Distribuicao-de-Conteudo-com-Slots)

### render

  - **Tipo:** `(createElement: () => VNode) => VNode`

  - **Detalhes:**

    Uma alternativa aos _templates_ baseados em Strings, que permite aproveitar o completo poder pragmático do JavaScript. A função de renderização recebe um método `createElement` como primeiro argumento, para criar elementos `VNode`.

    Se o componente é um componente funcional, a função de renderização também recebe um argumento extra `context`, que fornece acesso a dados contextuais, uma vez que componentes funcionais não possuem instância própria.

    <p class="tip">A função `render` tem prioridade sobre funções de renderização compiladas através da opção `template` e sobre _template_ extraído do DOM do elemento sendo montado conforme especificado com a opção `el`.</p>

  - **Ver também:** [Funções de Renderização](../guide/render-function.html)

### renderError

> Novo em 2.2.0+

  - **Tipo:** `(createElement: () => VNode, error: Error) => VNode`

  - **Detalhes:**

    **Funciona apenas em Modo de Desenvolvimento.**

    Provê uma saída de renderização alternativa para quando a função `render` padrão encontrar um erro. O objeto de erro será passado ao `renderError` como seu segundo argumento. É particularmente útil quando utilizado em conjunto com _hot-reload_.

  - **Exemplo:**

    ``` js
    new Vue({
      render (h) {
        throw new Error('oops')
      },
      renderError (h, err) {
        return h('pre', { style: { color: 'red' }}, err.stack)
      }
    }).$mount('#app')
    ```

  - **Ver também:** [Funções de Renderização](../guide/render-function.html)

## Opções / Ciclo-de-Vida

<p class="tip">Todos os gatilhos de ciclo-de-vida automaticamente possuem seus contextos `this` vinculados à instância, assim você pode acessar dados, propriedades computadas e métodos. Isso significa que __você não deve usar Arrow Function para definir este tipo de método__ (por exemplo, `created: () => this.fetchTodos()`). Isto porque _arrow functions_ vinculam o contexto pai, assim `this` não será a instância Vue como você espera e `this.fetchTodos` será `undefined`.</p>

### beforeCreate

- **Tipo:** `Function`

- **Detalhes:**

  Invocado sincronicamente logo após a instância ser inicializada, antes da observação de dados e configuração event/watcher.

- **Ver também:** [Diagrama do Ciclo de Vida](../guide/instance.html#Diagrama-do-Ciclo-de-Vida)

### created

- **Tipo:** `Function`

- **Detalhes:**

  Invocado sincronicamente após a instância ser criada. Neste ponto, a instância finalizou o processamento das opções, o que significa que  foi configurado:  observação de dados, propriedades computadas, metodos, watch/event callbacks. Entretanto, a fase de montagem não foi iniciada, e a propriedade `$el` não estará disponível ainda.

- **Ver também:** [Diagrama do Ciclo de Vida](../guide/instance.html#Diagrama-do-Ciclo-de-Vida)

### beforeMount

- **Tipo:** `Function`

- **Detalhes:**

  Invocado logo antes da montagem começar: a função `render` está prestes a ser invocada pela primeira vez.

  **Este gatilho não é invocado em Renderização no Lado do Servidor.**

- **Ver também:** [Diagrama do Ciclo de Vida](../guide/instance.html#Diagrama-do-Ciclo-de-Vida)

### mounted

- **Tipo:** `Function`

- **Detalhes:**

  Invocado logo após a instância ter sido montada onde `el` é substituído pelo recente criado `vm.$el`. Se a instância raiz é montada em um elemento in-document, `vm.$el` também será in-document quando `mounted` é invocada.

  **Este gatilho não é invocado em Renderização no Lado do Servidor.**

- **Ver também:** [Diagrama do Ciclo de Vida](../guide/instance.html#Diagrama-do-Ciclo-de-Vida)

### beforeUpdate

- **Tipo:** `Function`

- **Detalhes:**

  Invocado quando os dados mudam, antes do virtual DOM ser re-renderizado e atualizado.

  Você pode realizar mais mudanças de estado neste gatilho e elas não irão disparar re-renders adicionais.

  **Este gatilho não é invocado em Renderização no Lado do Servidor.**

- **Ver também:** [Diagrama do Ciclo de Vida](../guide/instance.html#Diagrama-do-Ciclo-de-Vida)

### updated

- **Tipo:** `Function`

- **Detalhes:**

  Invocado após a mudança de dados fazer o virtual DOM ser re-renderizado e atualizado.

  O DOM do componente estará no estado `updated` quando este gatilho for invocado, assim você pode realizar operações dependentes de DOM neste gatilho.
  Entretanto, na maioria dos casos você deveria evitar mudar o estado deste gatilho, melhor utilizar [propriedades computadas](#computed) ou [observadores](#watch).

  **Este gatilho não é invocado em Renderização no Lado do Servidor.**

- **Ver também:** [Diagrama do Ciclo de Vida](../guide/instance.html#Diagrama-do-Ciclo-de-Vida)

### activated

- **Tipo:** `Function`

- **Detalhes:**

  Invocado quando um componente kept-alive é ativado.

  **Este gatilho não é invocado em Renderização no Lado do Servidor.**

- **Ver também:**
  - [Built-in Components - keep-alive](#keep-alive)
  - [Dynamic Components - keep-alive](../guide/components.html#keep-alive)

### deactivated

- **Tipo:** `Function`

- **Detalhes:**

  Invocado quando um componente kept-alive é desativado.

  **Este gatilho não é invocado em Renderização no Lado do Servidor.**

- **Ver também:**
  - [Built-in Components - keep-alive](#keep-alive)
  - [Dynamic Components - keep-alive](../guide/components.html#keep-alive)

### beforeDestroy

- **Tipo:** `Function`

- **Detalhes:**

  Invocado logo antes da instância Vue ser destruída. Neste ponto a instância ainda é completamente funcional.

  **Este gatilho não é invocado em Renderização no Lado do Servidor.**

- **Ver também:** [Diagrama do Ciclo de Vida](../guide/instance.html#Diagrama-do-Ciclo-de-Vida)

### destroyed

- **Tipo:** `Function`

- **Detalhes:**

  Invocado após a instância Vue ter sido destruída. Quando este gatilho é invocado, todas as diretivas da instância Vue já foram desvinculadas, todos os event listeners foram removidos, e todas as instâncias Vue filhas também foram destruídas.


  **Este gatilho não é invocado em Renderização no Lado do Servidor.**

- **Ver também:** [Diagrama do Ciclo de Vida](../guide/instance.html#Diagrama-do-Ciclo-de-Vida)

## Opções / Recursos

### directives

- **Tipo:** `Object`

- **Detalhes:**

  Um conjunto de diretivas que será disponibilizado para a instância Vue.

- **Ver também:** [Diretivas Personalizadas](../guide/custom-directive.html)

### filters

- **Tipo:** `Object`

- **Detalhes:**

  Um conjunto de filtros que será disponibilizado para a instância Vue.

- **Ver também:** [`Vue.filter`](#Vue-filter)

### components

- **Tipo:** `Object`

- **Detalhes:**

  Um conjunto de componentes que será disponibilizado para a instância Vue.

- **Ver também:** [Componentes](../guide/components.html)

## Opções / Composição

### parent

- **Tipo:** `Vue instance`

- **Detalhes:**

  Specify the parent instance for the instance to be created. Establishes a parent-child relationship between the two. The parent will be accessible as `this.$parent` for the child, and the child will be pushed into the parent's `$children` array.

  <p class="tip">Use `$parent` and `$children` sparingly - they mostly serve as an escape-hatch. Prefer using props and events for parent-child communication.</p>

### mixins

- **Tipo:** `Array<Object>`

- **Detalhes:**

  The `mixins` option accepts an array of mixin objects. These mixin objects can contain instance options just like normal instance objects, and they will be merged against the eventual options using the same option merging logic in `Vue.extend()`. e.g. If your mixin contains a created hook and the component itself also has one, both functions will be called.

  Mixin hooks are called in the order they are provided, and called before the component's own hooks.

- **Exemplo:**

  ``` js
  var mixin = {
    created: function () { console.log(1) }
  }
  var vm = new Vue({
    created: function () { console.log(2) },
    mixins: [mixin]
  })
  // -> 1
  // -> 2
  ```

- **Ver também:** [Mixins](../guide/mixins.html)

### extends

- **Tipo:** `Object | Function`

- **Detalhes:**

  Allows declaratively extending another component (could be either a plain options object or a constructor) without having to use `Vue.extend`. This is primarily intended to make it easier to extend between single file components.

  This is similar to `mixins`, the difference being that the component's own options takes higher priority than the source component being extended.

- **Exemplo:**

  ``` js
  var CompA = { ... }

  // extend CompA without having to call `Vue.extend` on either
  var CompB = {
    extends: CompA,
    ...
  }
  ```

### provide / inject

> Novo em 2.2.0+

- **Tipo:**
  - **provide:** `Object | () => Object`
  - **inject:** `Array<string> | { [key: string]: string | Symbol }`

- **Detalhes:**

  <p class="tip">`provide` and `inject` are primarily provided for advanced plugin / component library use cases. It is NOT recommended to use them in generic application code.</p>

  This pair of options are used together to allow an ancestor component to serve as a dependency injector for its all descendants, regardless of how deep the component hierarchy is, as long as they are in the same parent chain. If you are familiar with React, this is very similar to React's context feature.

  The `provide` option should be an object or a function that returns an object. This object contains the properties that are available for injection into its descendants. You can use ES2015 Symbols as keys in this object, but only in environments that natively support `Symbol` and `Reflect.ownKeys`.

  The `inject` options should be either an Array of strings or an object where the keys stand for the local binding name, and the value being the key (string or Symbol) to search for in available injections.

  > Note: the `provide` and `inject` bindings are NOT reactive. This is intentional. However, if you pass down an observed object, properties on that object do remain reactive.

- **Exemplo:**

  ``` js
  var Provider = {
    provide: {
      foo: 'bar'
    },
    // ...
  }

  var Child = {
    inject: ['foo'],
    created () {
      console.log(this.foo) // -> "bar"
    }
    // ...
  }
  ```

  With ES2015 Symbols, function `provide` and object `inject`:
  ``` js
  const s = Symbol()

  const Provider = {
    provide () {
      return {
        [s]: 'foo'
      }
    }
  }

  const Child = {
    inject: { s },
    // ...
  }
  ```

  > The next 2 examples work with Vue 2.2.1+. Below that version, injected values were resolved after the `props` and the `data` initialization.

  Using an injected value as the default for a prop:
  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default () {
          return this.foo
        }
      }
    }
  }
  ```

  Using an injected value as data entry:
  ```js
  const Child = {
    inject: ['foo'],
    data () {
      return {
        bar: this.foo
      }
    }
  }
  ```

## Opções / Diversos

### name

- **Tipo:** `string`

- **Restrição:** somente é respeitada quando usada como uma opção do componente.

- **Detalhes:**

  Permite que o componente invoque a si mesmo recursivamente no seu *template*. Note que quando um componente é registrado globalmente com `Vue.component()`, seu ID global é automaticamente especificado com seu nome.

  Outro benefício de se especificar a opção `name` é depuração. Componentes nomeados resultarão em mensagens de aviso mais prestativas. Além disso, ao se inspecionar uma aplicação em [vue-devtools](https://github.com/vuejs/vue-devtools), componentes não nomeados aparecerão como `<AnonymousComponent>`, o que não é muito informativo. Ao fornecer a opção `name`, você terá uma árvore de componentes muito mais informativa.

### delimiters

- **Tipo:** `Array<string>`

- **Padrão:** `{% raw %}["{{", "}}"]{% endraw %}`

- **Restrições:** Esta opção só está disponível na *build* completa, com compilação no navegador.

- **Detalhes:**

  Altera os delimitadores de interpolação de texto simples.

- **Exemplo:**

  ``` js
  new Vue({
    delimiters: ['${', '}']
  })

  // Mudando os delimitadores para o estilo do ES6 template string
  ```

### functional

- **Tipo:** `boolean`

- **Detalhes:**

  Faz com que um componente seja *stateless* (ou seja, não possui `data`) and *instanceless* (ou seja, não possui o contexto `this`). Componentes com esta opção habilitada serão apenas uma função `render` que retorna nós virtuais, fazendo com que sejam muito menos custosos para renderizar.

- **Ver também:** [Componentes funcionais](../guide/render-function.html#Functional-Components)

### model

> Novo em 2.2.0

- **Tipo:** `{ prop: string, event: string }`

- **Detalhes:**

  Permite que um componente personalize a propriedade e o evento usados quando `v-model` é utilizado. Por padrão, `v-model` em um componente usa `value` como a propriedade e `input` como o evento, mas alguns tipos de *inputs* (como *checkbox* e *radio buttons*) podem querer usar a propriedade `value` com outro propósito. Usar a opção `model` pode evitar conflitos nesses casos.

- **Exemplo:**

  ``` js
  Vue.component('my-checkbox', {
    model: {
      prop: 'checked',
      event: 'change'
    },
    props: {
      // Isto permite usar a propriedade `value` com um propósito diferente
      value: String,
      // Usando `checked` como a propriedade, ao invés de `value`
      checked: {
        type: Number,
        default: 0
      }
    },
    // ...
  })
  ```

  ``` html
  <my-checkbox v-model="foo" value="some value"></my-checkbox>
  ```

  O código acima equivale a:

  ``` html
  <my-checkbox
    :checked="foo"
    @change="val => { foo = val }"
    value="some value">
  </my-checkbox>
  ```

### inheritAttrs

> Novo em 2.4.0+

- **Tipo:** `boolean`

- **Padrão:** `true`

- **Detalhes:**

  Por padrão, atributos *binded* ao escopo do componente pai que não são reconhecidos como *props* serão aplicados ao elemento raíz do componente filho como atributos normais de HTML. Quando um componente é implementado com o objetivo de envolver um elemento-alvo ou outro componente, este comportamento nem sempre é o mais desejado. Ao especificar `inheritAttrs` para `false`, este comportamento padrão pode ser desabilitado. Os atributos estarão disponíveis pela propriedade de instância `$attrs` (também nova na versão 2.4) e podem ser explicitamente vinculados a um elemento que não seja a raíz utilizando `v-bind`.

  Nota: esta opção **não** afeta *bindings* de `class` e `style`.

### comments

> Novo em 2.4.0+

- **Tipo:** `boolean`

- **Padrão:** `false`

- **Restrições:** Esta opção só está disponível na *build* completa, com compilação no navegador.

- **Detalhes:**

  Quando especificada para `true`, esta opção irá preservar e renderizar comentários HTML encontrados nos _templates_. O comportamento padrão é discartá-los.

## Propriedades de Instância

### vm.$data

- **Tipo:** `Object`

- **Detalhes:**

  O objeto _data_ que a instância Vue está observando. A instância do Vue provê acesso a estas propriedades no seu objeto *data*.

- **Ver também:** [Opções / Dados - data](#data)

### vm.$props

> Novo em 2.2.0+

- **Tipo:** `Object`

- **Detalhes:**

  Um objeto que representa as *props* atuais que um componente recebeu. A instância do Vue provê acesso a estas propriedades no seu objeto *props*.

### vm.$el

- **Tipo:** `HTMLElement`

- **Somente leitura**

- **Detalhes:**

  O elemento DOM raíz que a instância do Vue está gerenciando.

### vm.$options

- **Tipo:** `Object`

- **Somente leitura**

- **Detalhes:**

  As opções de instânciação usadas para a instância atual do Vue. Isto é útil quando se deseja incluir propriedades personalizadas nas opções:

  ``` js
  new Vue({
    customOption: 'foo',
    created: function () {
      console.log(this.$options.customOption) // -> 'foo'
    }
  })
  ```

### vm.$parent

- **Tipo:** `Instância do Vue`

- **Somente leitura**

- **Detalhes:**

  A instância pai, se a instância atual contém uma.

### vm.$root

- **Tipo:** `Instância do Vue`

- **Somente leitura**

- **Detalhes:**

  A instância raíz do Vue da árvore do componente atual. Se a instância atual não tem uma instância pai, este valor vai ser ele mesmo.

### vm.$children

- **Tipo:** `Array<Instância do Vue>`

- **Somente leitura**

- **Detalhes:**

  Os componentes filhos diretos da instância atual. **Note que não há ordem garantida para `$children`, e esta propriedade não é reativa.** Se você está tentando usar `$chilren`para *binding* de dados, considere usar um Array e `v-for` para gerar os componentes filhos, e use o Array como a fonte da verdade.

### vm.$slots

- **Tipo:** `{ [name: string]: Array<VNode> }`

- **Read only**

- **Detalhes:**

  Usado para acessar programaticamente o conteúdo [distribuído pelos *slots*](../guide/components.html#Content-Distribution-with-Slots). Cada [*slot* nomeado](../guide/components.html#Named-Slots) tem sua propriedade correspondente (por exemplo, o conteúdo do `slot="foo"` poderá ser acessado via `vm.$slots.foo`). A propriedade `default` contém todo nó que não está inserido em nenhum *slot* nomeado.

  É bastante útil acessar `vm.$slots` quando se está escrevendo um componente com uma [função de renderização](../guide/render-function.html).

- **Exemplo:**

  ```html
  <blog-post>
    <h1 slot="header">
      Sobre mim
    </h1>

    <p>Aqui há conteúdo da página que será incluído em vm.$slots.default, pois não está dentro de nenhum slot nomeado.</p>

    <p slot="footer">
      Copyright 2016 Evan You
    </p>

    <p>Se eu tenho algum conteúdo aqui embaixo, este também será incluído em vm.$slots.default.</p>.
  </blog-post>
  ```

  ```js
  Vue.component('blog-post', {
    render: function (createElement) {
      var header = this.$slots.header
      var body   = this.$slots.default
      var footer = this.$slots.footer
      return createElement('div', [
        createElement('header', header),
        createElement('main', body),
        createElement('footer', footer)
      ])
    }
  })
  ```

- **Ver também:**
  - [Componente `<slot>`](#slot-1)
  - [Distribuição de conteúdo com Slots](../guide/components.html#Distribuicao-de-Conteudo-com-Slots)
  - [Funções de Renderização - Slots](../guide/render-function.html#Slots)

### vm.$scopedSlots

> Novo em 2.1.0+

- **Tipo:** `{ [name: string]: props => VNode | Array<VNode> }`

- **Somente leitura**

- **Detalhes:**

  Usado para acessar programaticamente [*scoped slots*](../guide/components.html#Scoped-Slots). Para cada *slot*, incluindo o *slot* `default`, o objeto contém uma função correspondente que retorna *VNodes*.

  É bastante útil acessar `vm.$scopedSlots` quando se está escrevendo um componente com uma [função de renderização](../guide/render-function.html).

- **Ver também:**
  - [Componente `<slot>`](#slot-1)
  - [Slot com Escopo](../guide/components.html#Slot-com-Escopo)
  - [Funções de Renderização - Slots](../guide/render-function.html#Slots)

### vm.$refs

- **Tipo:** `Object`

- **Somente leitura**

- **Detalhes:**

  Um objeto que mantém componentes filhos que têm `ref` registrados.

- **Ver também:**
  - [Referências a Componentes Filhos](../guide/components.html#Referencias-a-Componentes-Filhos)
  - [Atributos Especiais - ref](#ref)

### vm.$isServer

- **Tipo:** `boolean`

- **Somente leitura**

- **Detalhes:**

  Retorna se a instância atual do Vue está sendo executada no servidor.

- **Ver também:** [Renderização do lado do servidor](../guide/ssr.html)

### vm.$attrs

- **Tipo:** `{ [key: string]: string }`

- **Somente leitura**

- **Detalhes:**

  Contém *bindings* de atributos do escopo do componente pai (exceto para `class` e `style`) que não são reconhecido como *props*. Quando um componente não tem nenhum *props* declarado, esta propriedade essencialmente contém todos os *bindings* do escopo do componente pai (exceto para `class` e `style`), e pode ser passada para os componentes internos via `v-bind="$attrs"` - útil quando se quer criar componentes de ordem superior.

### vm.$listeners

- **Tipo:** `{ [key: string]: Function | Array<Function> }`

- **Somente leitura**

- **Detalhes:**

  Contém ouvintes de eventos (*event listeners*) advindos de `v-on` do escopo do componente pai. Esta propriedade pode ser para os componentes internos via `v-on="$listeners"` - útil quando se quer criar componentes de ordem superior.


## Métodos da Instância / Dados

<h3 id="vm-watch">vm.$watch( expOrFn, callback, [options] )</h3>

- **Argumentos:**
  - `{string | Function} expOrFn`
  - `{Function | Object} callback`
  - `{Object} [options]`
    - `{boolean} deep`
    - `{boolean} immediate`

- **Returns:** `{Function} unwatch`

- **Uso:**

  Observa (em busca de mudanças) uma expressão ou uma função computada na instância do Vue. A função de *callback* é chamada com o novo e o antigo valor. A expressão somente aceita caminhos delimitados por pontos. Para expressões mais complexas, utilize uma função.

  <p class="tip">Nota: quando se está alterando (ao invés de substituindo) um objeto ou um *Array*, o valor antigo será igual ao novo valor, pois eles referenciam o mesmo objeto/*Array*. O Vue não mantém uma cópia dos valores antes de serem mutados.</p>

- **Exemplo:**

  ``` js
  // caminho da chave
  vm.$watch('a.b.c', function (newVal, oldVal) {
    // faz alguma coisa
  })

  // função
  vm.$watch(
    function () {
      return this.a + this.b
    },
    function (newVal, oldVal) {
      // faz alguma coisa
    }
  )
  ```

  `vm.$watch` retorna uma função *unwatch*, que para de lançar o *callback*:

  ``` js
  var unwatch = vm.$watch('a', cb)
  // depois, destruirá o watcher
  unwatch()
  ```

- **Opção: deep**

  Para também detectar valores aninhados dentro de objetos, você deve passar `deep: true` nas opções. Note que você não precisa fazer isso para mutações em *Array*.

  ``` js
  vm.$watch('someObject', callback, {
    deep: true
  })
  vm.someObject.nestedValue = 123
  // callback é acionado
  ```

- **Opção: immediate**

  Passar `immediate: true` nas opções irá acionar a função de *callback* imediatamente com o novo valor da expressão:

  ``` js
  vm.$watch('a', callback, {
    immediate: true
  })
  // `callback` é acionada imediatamente com o novo valor de 'a'
  ```

<h3 id="vm-set">vm.$set( target, key, value )</h3>

- **Argumentos:**
  - `{Object | Array} target`
  - `{string | number} key`
  - `{any} value`

- **Retorno:** o valor determinado.

- **Uso:**

  Esta método é um ***alias*** para a função global `Vue.set`.

- **Ver também:** [Vue.set](#Vue-set)

<h3 id="vm-delete">vm.$delete( target, key )</h3>

- **Argumentos:**
  - `{Object | Array} target`
  - `{string | number} key`

- **Uso:**

  Este método é um ***alias*** para a função global `Vue.delete`.

- **Ver também:** [Vue.delete](#Vue-delete)

## Métodos da Instância / Eventos

<h3 id="vm-on">vm.$on( event, callback )</h3>

- **Argumentos:**
  - `{string | Array<string>} event` (array somente é suportado em 2.2.0+)
  - `{Function} callback`

- **Uso:**

  Escuta um evento customizado na *vm* atual. Eventos podem ser lançados utilizando `vm.$emit`. A função de *callback* irá receber todos os argumentos adicionais passados nos métodos que lançam eventos.

- **Exemplo:**

  ``` js
  vm.$on('test', function (msg) {
    console.log(msg)
  })
  vm.$emit('test', 'hi')
  // -> "hi"
  ```

<h3 id="vm-once">vm.$once( event, callback )</h3>

- **Argumentos:**
  - `{string} event`
  - `{Function} callback`

- **Uso:**

  Escuta um evento customizado, porém somente uma vez. O *listener* será removido assim que for acionado pela primeira vez.

<h3 id="vm-off">vm.$off( [event, callback] )</h3>

- **Argumentos:**
  - `{string | Array<string>} event` (array somente é suportado em 2.2.2+)
  - `{Function} [callback]`

- **Uso:**

  Remove *listener(s)* de eventos customizados.

  - Se nenhum argumento é passado, esta função irá remover todos os *listeners*;

  - Se apenas o evento é passado, esta função irá remover todos os *listeners* para este evento;

  - Se tanto o evento quanto o *callback* forem passados, esta função somente irá remover o *listener* para este *callback* específico.

<h3 id="vm-emit">vm.$emit( event, [...args] )</h3>

- **Argumentos:**
  - `{string} event`
  - `[...args]`

  Lança um evento na instância atual. Qualquer argumento adicional será passado para a função de *callback* do *listener*.

## Métodos da Instância / Ciclo-de-Vida

<h3 id="vm-mount">vm.$mount( [elementOrSelector] )</h3>

- **Argumentos:**
  - `{Element | string} [elementOrSelector]`
  - `{boolean} [hydrating]`

- **Returns:** `vm` - a própria instância

- **Uso:**

  Se a instância do Vue não recebeu a opção `el` durante a instanciação, ela estará em um estado "não montado", sem um elemento DOM associado. `vm.$mount()` pode ser usada para começar a montagem de uma instância não montada do Vue.

  Se o argumento `elementOrSelector` não for passado, o *template* será renderizado como um elemento "fora do documento", e você terá que usar a API nativa do DOM para inserí-lo no documento.

  O método retorna a própria instância, para que você possa encadear outros métodos de instâncias depois dele.

- **Exemplo:**

  ``` js
  var MyComponent = Vue.extend({
    template: '<div>Hello!</div>'
  })

  // cria e monta em #app (irá substituir #app)
  new MyComponent().$mount('#app')

  // a linha acima é o mesmo que:
  new MyComponent({ el: '#app' })

  // ou renderiza como "fora do documento" e anexa depois:
  var component = new MyComponent().$mount()
  document.getElementById('app').appendChild(component.$el)
  ```

- **Ver também:**
  - [Diagrama do ciclo de vida](../guide/instance.html#Diagrama-do-Ciclo-de-Vida)
  - [Renderização no lado do servidor](../guide/ssr.html)

<h3 id="vm-forceUpdate">vm.$forceUpdate()</h3>

- **Uso:**

  Força a instância do Vue a renderizar novamente. Note que isso não afeta todos os componentes filhos, apenas a própria instância e os componentes filhos com conteúdo em inseridos em seus respectivos *slots*.

<h3 id="vm-nextTick">vm.$nextTick( [callback] )</h3>

- **Argumentos:**
  - `{Function} [callback]`

- **Uso:**

  Adia a execução do *callback* para o próximo ciclo de atualização. Use esta função imediatamente após você alterar algum dado para esperar pela atualização do DOM. Este método é o mesmo que a função global `Vue.nextTick`, exceto que o contexto do `this` no *callback* é automaticamente vinculado (*bound*) à instância que chama este método.

  > Novo em 2.1.0+: retorna uma Promise se nenhum *callback* é provido, e Promise é suportada no ambiente de execução.

- **Exemplo:**

  ``` js
  new Vue({
    // ...
    methods: {
      // ...
      example: function () {
        // modifica um dado
        this.message = 'changed'
        // DOM ainda não está atualizada
        this.$nextTick(function () {
          // DOM agora está atualizada
          // `this` é vinculado (bound) à instância atual
          this.doSomethingElse()
        })
      }
    }
  })
  ```

- **Ver também:**
  - [Vue.nextTick](#Vue-nextTick)
  - [Fila de atualização *Async*](../guide/reactivity.html#Async-Update-Queue)

<h3 id="vm-destroy">vm.$destroy()</h3>

- **Uso:**

  Destrói completamente a *vm*. Limpa todas as suas conexões com outras *vms*, desvincula (*unbind*) todas as suas diretivas e desliga todos os *listeners* de eventos.

  Aciona os *hooks* `beforeDestroy` e `destroyed`.

  <p class="tip">Em casos normais você não deve chamar este método. Prefira controlar o ciclo de vida dos componentes filhos em um modelo direcionado a dados utilizando `v-if` e `v-for`.</p>

- **Ver também:** [Diagrama do ciclo de vida](../guide/instance.html#Diagrama-do-Ciclo-de-Vida)

## Diretivas

### v-text

- **Espera:** `string`

- **Detalhes:**

  Atualiza o `textContent` do elemento. Se você precisa atualizar a parte de `textContent`, você deve usar interpolações `{% raw %}{{ Mustache }}{% endraw %}`.

- **Exemplo:**

  ```html
  <span v-text="msg"></span>
  <!-- o mesmo que -->
  <span>{{msg}}</span>
  ```

- **Ver também:** [Sintaxe de Templates - Interpolações](../guide/syntax.html#Texto)

### v-html

- **Espera:** `string`

- **Detalhes:**

  Atualiza o `innerHTML` do elemento. **Perceba que os conteúdos são inseridos como HTML puro - eles não serão compilados como templates Vue**. Se você se pegar tentando compor templates usando `v-html`, ao invés disso tente repensar a solução usando componentes.

  <p class="tip">Renderizar dinamicamente HTML arbitrário em seu website pode ser muito perigoso porque isso pode facilmente levar a [ataques XSS](https://pt.wikipedia.org/wiki/Cross-site_scripting). Use `v-html` somente em conteúdo confiável e **nunca** em conteúdo fornecido por usuário.</p>

- **Exemplo:**

  ```html
  <div v-html="html"></div>
  ```

- **Ver também:** [Sintaxe de Templates - Interpolações](../guide/syntax.html#HTML)

### v-show

- **Espera:** `any`

- **Uso:**

  Alterna a propriedade CSS `display` do elemento baseado na condição de verdade do valor da expressão.

  Esta diretiva dispara transições quando sua condição muda.

- **Ver também:** [Renderização Condicional - v-show](../guide/conditional.html#v-show)

### v-if

- **Espera:** `any`

- **Uso:**

  Renderiza condicionalmente o elemento baseado na condição de verdade do valor da expressão. O elemento e suas diretivas/componentes contidos são destruídos e reconstruídos durante alternâncias (_toggles_). Se o elemento é um `<template>`, seu conteúdo será extraído como o bloco condicional.

  Esta diretiva dispara transições quando sua condição muda.

  <p class="tip">Quando usada em conjunto com v-if, v-for tem uma prioridade maior. Veja o <a href="../guide/list.html#v-for-with-v-if">guia de Renderização de Listas</a> para detalhes.</p>

- **Ver também:** [Renderização Condicional - v-if](../guide/conditional.html)

### v-else

- **Não espera expressão**

- **Restrição:** o elemento-irmão anterior deve ter `v-if` ou `v-else-if`.

- **Uso:**

  Denota o "bloco senão" de uma cadeia `v-if` ou `v-if`/`v-else-if`.

  ```html
  <div v-if="Math.random() > 0.5">
    Agora você me vê
  </div>
  <div v-else>
    Agora não vê
  </div>
  ```

- **Ver também:** [Renderização Condicional - v-else](../guide/conditional.html#v-else)

### v-else-if

> Novo em 2.1.0+

- **Espera:** `any`

- **Restrição:** o elemento-irmão anterior deve ter `v-if` ou `v-else-if`.

- **Uso:**

  Denota o "bloco senão se" para `v-if`. Pode ser encadeado.

  ```html
  <div v-if="type === 'A'">
    A
  </div>
  <div v-else-if="type === 'B'">
    B
  </div>
  <div v-else-if="type === 'C'">
    C
  </div>
  <div v-else>
    Não A/B/C
  </div>
  ```

- **Ver também:** [Renderização Condicional - v-else-if](../guide/conditional.html#v-else-if)

### v-for

- **Espera:** `Array | Object | number | string`

- **Uso:**

  Renderiza o elemento ou bloco de template múltiplas vezes baseado nos dados de origem (_source data_). O valor da diretiva deve usar a sintaxe especial `alias in expression` para fornecer um alias para o elemento atual ser iterado em:

  ``` html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  Alternativamente, você também pode especificar um alias para o índice (ou a chave, se usada em um Objeto):

  ``` html
  <div v-for="(item, index) in items"></div>
  <div v-for="(val, key) in object"></div>
  <div v-for="(val, key, index) in object"></div>
  ```

  O comportamento padrão de `v-for` tentará corrigir os elementos in-place sem os mover. Para forçá-lo a reordenar elementos, você precisa fornecer uma sugestão de ordenação com o atributo especial `key`:

  ``` html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  <p class="tip">Quando usada em conjunto com v-if, v-for tem uma prioridade maior. Veja o <a href="../guide/list.html#v-for-with-v-if">guia de Renderização de Listas</a> para detalhes.</p>

  O uso detalhado de `v-for` é explicado na seção de Guia com link abaixo.

- **Ver também:**
  - [Renderização de Listas](../guide/list.html)
  - [key](../guide/list.html#key)

### v-on

- **Forma abreviada:** `@`

- **Espera:** `Function | Inline Statement | Object`

- **Argumento:** `event`

- **Modificadores:**
  - `.stop` - chama `event.stopPropagation()`.
  - `.prevent` - chama `event.preventDefault()`.
  - `.capture` - adiciona escuta de eventos em modo de captura.
  - `.self` - aciona o manipulador somente se o evento foi disparado a partir deste elemento.
  - `.{keyCode | keyAlias}` - aciona o manipulador apenas em certas chaves.
  - `.native` - escuta por um evento nativo no elemento-raiz do componente.
  - `.once` - aciona o manipulador somente uma vez.
  - `.left` - (2.2.0+) aciona o manipulador somente para eventos do botão esquerdo do mouse.
  - `.right` - (2.2.0+) aciona o manipulador somente para eventos do botão direito do mouse.
  - `.middle` - (2.2.0+) aciona o manipulador somente para eventos do botão do meio do mouse.
  - `.passive` - (2.3.0+) atribui um evento ao DOM com `{ passive: true }`.

- **Uso:**

  Atribui um escutador de evento ao elemento. O tipo de evento é denotado pelo argumento. A expressão pode ser um nome de método, uma declaração em linha ou simplesmente omitida quando há modificadores presentes.

  Começando na 2.4.0+, `v-on` também suporta interligação a um objeto de pares evento/escutador sem argumentos. Note que, quando se usa a sintaxe de objeto, não há suporte para quaisquer modificadores.

  Quando usada em um elemento normal, escuta somente **eventos nativos de DOM**. Quando usada em um componente de elemento personalizado, também escuta a **eventos personalizados** emitidos naquele componente-filho.

  Quando escutando a eventos nativos de DOM, o método recebe o evento nativo como argumento único. Se usando declaração em linha, a declaração tem acesso à propriedade especial `$event`: `v-on:click="handle('ok', $event)"`.

- **Exemplo:**

  ```html
  <!-- manipulador de método -->
  <button v-on:click="doThis"></button>

  <!-- sintaxe de objeto (2.4.0+) -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>

  <!-- declaração em linha -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- forma abreviada -->
  <button @click="doThis"></button>

  <!-- para a propagação -->
  <button @click.stop="doThis"></button>

  <!-- previne padrão -->
  <button @click.prevent="doThis"></button>

  <!-- previne padrão sem expressão -->
  <form @submit.prevent></form>

  <!-- modificadores em cadeia -->
  <button @click.stop.prevent="doThis"></button>

  <!-- modificador de chave usando keyAlias -->
  <input @keyup.enter="onEnter">

  <!-- modificador de chave usando keyCode -->
  <input @keyup.13="onEnter">

  <!-- o evento de clique será acionado somente uma vez -->
  <button v-on:click.once="doThis"></button>
  ```

  Escutando a eventos personalizados em um componente-filho (o manipulador é chamado quando "my-event" é emitido no filho):

  ```html
  <my-component @my-event="handleThis"></my-component>

  <!-- declaração em linha -->
  <my-component @my-event="handleThis(123, $event)"></my-component>

  <!-- evento nativo no componente -->
  <my-component @click.native="onClick"></my-component>
  ```

- **Ver também:**
  - [Manipulação de Eventos](../guide/events.html)
  - [Componentes - Eventos Personalizados](../guide/components.html#Eventos-Personalizados)

### v-bind

- **Forma abreviada:** `:`

- **Espera:** `any (sem argumento) | Object (sem argumeto)`

- **Argumento:** `attrOrProp (opcional)`

- **Modificadores:**
  - `.prop` - Interliga como uma propriedade DOM ao invés de um atributo ([qual a diferença?](http://stackoverflow.com/questions/6003819/properties-and-attributes-in-html#answer-6004028)). Se a _tag_ é um componente, então `.prop` irá definir a propriedade no `$el` do componente.
  - `.camel` - (2.1.0+) transforma o nome do atributo de kebab-case para camelCase.
  - `.sync` - (2.3.0+) um açúcar sintático que se expande em um `v-on` para atualizar o valor vinculado.

- **Uso:**

  Dinamicamente faz a interligação de um ou mais atributos ou propriedades de um componente a uma expressão.

  Quando usado para o vínculo de atributos `class` ou `style`, suporta tipos de valores adicionais, como Array ou Objects. Veja na seção do Guia abaixo para mais detalhes.

  Quando usado para vincular uma propriedade, a propriedade deve ser devidamente declarada no elemento-filho.

  Quando usado sem argumentos, pode ser utilizado para vincular em um objeto contendo pares nome-valor. Perceba que, neste modo, `class` e `style` não suportam Array ou Objects.

- **Exemplo:**

  ```html
  <!-- interligando a um atributo -->
  <img v-bind:src="imageSrc">

  <!-- forma abreviada -->
  <img :src="imageSrc">

  <!-- com concatenação de String no local -->
  <img :src="'/path/to/images/' + fileName">

  <!-- interligando classes -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]">

  <!-- interligando estilos -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- interligando um objeto com atributos -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- interligando atributo DOM com modificador de propriedade -->
  <div v-bind:text-content.prop="text"></div>

  <!-- interligando propriedade. "prop" deve existir em my-component -->
  <my-component :prop="someThing"></my-component>

  <!-- tramsmite todas as props do pai em comum com o componente-filho -->
  <child-component v-bind="$props"></child-component>

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  O modificador `.camel` permite colocar na notação _camelCase_ (_camelizing_) um nome do atributo `v-bind` quando usando em _templates_ no DOM, por exemplo, o atributo `viewBox` de um SVG:

  ``` html
  <svg :view-box.camel="viewBox"></svg>
  ```

  `.camel` não é necessário se você está usando _templates_ baseados em String ou compilando com `vue-loader`/`vueify`.

- **Ver também:**
  - [Interligações em Classes e Estilos](../guide/class-and-style.html)
  - [Componentes - Propriedades](../guide/components.html#Propriedades)
  - [Componentes - O Modificador `.sync`](../guide/components.html#O-Modificador-sync)

### v-model

- **Espera:** varia baseado no valor do elemento de input de formulário ou saída de componentes

- **Limitado a:**
  - `<input>`
  - `<select>`
  - `<textarea>`
  - componentes

- **Modificadores:**
  - [`.lazy`](../guide/forms.html#lazy) - escuta por eventos `change` ao invés de `input`
  - [`.number`](../guide/forms.html#number) - faz o cast da string informada para números
  - [`.trim`](../guide/forms.html#trim) - faz trim da entrada

- **Uso:**

  Cria uma interligação de mão-dupla (_two-way binding_) em um elemento de entrada (_input_) de formulário ou componente. Para uso detalhado e outras observações, veja o link abaixo para a seção do Guia.

- **Ver também:**
  - [Interligações em Formulários](../guide/forms.html)
  - [Componentes - Componentes de Formulários usando Eventos Personalizados](../guide/components.html#Componentes-de-Formularios-usando-Eventos-Personalizados)

### v-pre

- **Não espera expressão**

- **Uso:**

  Pula a compilação para esse elemento e todos seus filhos. Você pode usar isso para mostrar tags mustache sem conversão (_raw_). Pular uma grande quantidade de nós sem diretivas pode acelerar a compilação.

- **Exemplo:**

  ```html
  <span v-pre>{{ isso não será compilado }}</span>
   ```

### v-cloak

- **Não espera expressão**

- **Uso:**

  Essa diretiva permanecerá no elemento até que a instância associada de Vue termine de compilar. Ao ser combinada com regras CSS como `[v-cloak] { display: none }`, essa diretiva pode ser usada para esconder interligações mustache não-compiladas até que a instância de Vue esteja pronta.

- **Exemplo:**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```html
  <div v-cloak>
    {{ mensagem }}
  </div>
  ```

  A `<div>` não ficará visível até que a compilação tenha terminado.

### v-once

- **Não espera expressão**

- **Detalhes:**

  Renderiza o elemento e componente **somente uma vez**. Em re-renderizações subsequentes, o elemento/componente e todos seus filhos serão tratados como conteúdo estático e pulados. Isso pode ser usado para otimizar o desempenho da atualização.

  ```html
  <!-- elemento único -->
  <span v-once>Isso nunca vai mudar: {{msg}}</span>
  <!-- o elemento tem filhos -->
  <div v-once>
    <h1>comentário</h1>
    <p>{{msg}}</p>
  </div>
  <!-- componente -->
  <my-component v-once :comment="msg"></my-component>
  <!-- diretiva v-for -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

- **Ver também:**
  - [Sintaxe de Templates - Interpolações](../guide/syntax.html#Texto)
  - [Componentes - Componentes Estáticos Leves com v-once](../guide/components.html#Componentes-Estaticos-Leves-com-v-once)

## Atributos Especiais

### key

- **Espera:** `number | string`

  O atributo especial `key` é usado principalmente como um aviso para o algoritmo do virtual DOM do Vue identificar VNodes quando compara a nova lista de nós com a anterior. Sem `keys`, o Vue usa um algoritmo que minimiza a movimentação de elementos e tenta corrigir/reusar elementos do mesmo tipo no local tanto quanto possível. Com `keys`, ele irá reordenar os elementos baseado na ordem de mudança das `keys`, e elementos com `keys` que não estão mais presentes serão sempre removidos/destruídos.

  Componentes filhos com pai em comum precisam ter **keys únicas**. `keys` duplicadas causarão erros de renderização.

  O caso mais comum é combinado com o `v-for`:

  ``` html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  Também pode ser usado para forçar a substituição de um elemento/componente ao invés de reusa-lo. Isso pode ser útil quando você quiser:

  - Ativar corretamente os hooks do ciclo de vida de um componente.
  - Ativar transições.

  Por exemplo:

  ``` html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  Quanto `text` mudar, o `<span>` será substituído em vez de alterado, então a transição será ativada.

### ref

- **Espera:** `string`

  `ref` é usada para registrar a referência para um elemento ou um componente filho. A referência será registrada no objeto `$refs` do componente pai. Se usada em um elemento normal do DOM, a referência será aquele elemento; se usada em um componente filho, a referência será a instância do componente:

  ``` html
  <!-- vm.$refs.p será o nó do DOM-->
  <p ref="p">Olá</p>

  <!-- vm.$refs.child será a instância do componente filho -->
  <child-comp ref="child"></child-comp>
  ```

  Quando usada em elementos/componentes com `v-for`, a referência registrada será um Array contendo nós do DOM ou instâncias de componentes.

  Uma observação importante sobre o tempo do registro de `ref`: como as `refs` são criadas como resultados da função de renderização, você não pode acessá-las na renderização inicial - elas ainda não existem! `$refs` são não-reativas, portanto você não deve tentar usá-las em templates para *data-binding*.

- **Ver também:** [Child Component Refs](../guide/components.html#Child-Component-Refs)

### slot

- **Espera:** `string`

  Usado dentro de conteúdos inseridos no componente filho para indicar a qual *named slot* o conteúdo pertence.

  Para maiores detalhes de uso, veja a sessão no guia linkado abaixo:

- **Ver também:** [Named Slots](../guide/components.html#Named-Slots)

### is

- **Espera:** `string`

  Usado para [componentes dinâmicos](../guide/components.html#Dynamic-Components) e para trabalhar [limitações dos templates do DOM](../guide/components.html#DOM-Template-Parsing-Caveats).

  Por exemplo:

  ``` html
  <!-- component é alterado quando o currentView é alterado -->
  <component v-bind:is="currentView"></component>

  <!-- necessário, porque <my-row> seria inválido dentro -->
  <!-- do elemento <table> e seria içado para fora (hoisted out) -->
  <table>
    <tr is="my-row"></tr>
  </table>
  ```

  Para maiores detalhes de uso, veja os links na descrição abaixo.

- **Ver também:**
  - [Componentes Dinâmicos](../guide/components.html#Dynamic-Components)
  - [Ressalvas do processamento do template do DOM](../guide/components.html#DOM-Template-Parsing-Caveats)

## Componentes Integrados

### component

- **Props:**
  - `is` - string | ComponentDefinition | ComponentConstructor
  - `inline-template` - boolean

- **Uso:**

  A "meta component" for rendering dynamic components. The actual component to render is determined by the `is` prop:

  ```html
  <!-- a dynamic component controlled by -->
  <!-- the `componentId` property on the vm -->
  <component :is="componentId"></component>

  <!-- can also render registered component or component passed as prop -->
  <component :is="$options.components.child"></component>
  ```

- **Ver também:** [Dynamic Components](../guide/components.html#Dynamic-Components)

### transition

- **Props:**
  - `name` - string, Used to automatically generate transition CSS class names. e.g. `name: 'fade'` will auto expand to `.fade-enter`, `.fade-enter-active`, etc. Defaults to `"v"`.
  - `appear` - boolean, Whether to apply transition on initial render. Defaults to `false`.
  - `css` - boolean, Whether to apply CSS transition classes. Defaults to `true`. If set to `false`, will only trigger JavaScript hooks registered via component events.
  - `type` - string, Specify the type of transition events to wait for to determine transition end timing. Available values are `"transition"` and `"animation"`. By default, it will automatically detect the type that has a longer duration.
  - `mode` - string, Controls the timing sequence of leaving/entering transitions. Available modes are `"out-in"` and `"in-out"`; defaults to simultaneous.
  - `enter-class` - string
  - `leave-class` - string
  - `appear-class` - string
  - `enter-to-class` - string
  - `leave-to-class` - string
  - `appear-to-class` - string
  - `enter-active-class` - string
  - `leave-active-class` - string
  - `appear-active-class` - string

- **Events:**
  - `before-enter`
  - `before-leave`
  - `before-appear`
  - `enter`
  - `leave`
  - `appear`
  - `after-enter`
  - `after-leave`
  - `after-appear`
  - `enter-cancelled`
  - `leave-cancelled` (`v-show` only)
  - `appear-cancelled`

- **Uso:**

  `<transition>` serve as transition effects for **single** element/component. The `<transition>` does not render an extra DOM element, nor does it show up in the inspected component hierarchy. It simply applies the transition behavior to the wrapped content inside.

  ```html
  <!-- simple element -->
  <transition>
    <div v-if="ok">toggled content</div>
  </transition>

  <!-- dynamic component -->
  <transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </transition>

  <!-- event hooking -->
  <div id="transition-demo">
    <transition @after-enter="transitionComplete">
      <div v-show="ok">toggled content</div>
    </transition>
  </div>
  ```

  ``` js
  new Vue({
    ...
    methods: {
      transitionComplete: function (el) {
        // for passed 'el' that DOM element as the argument, something ...
      }
    }
    ...
  }).$mount('#transition-demo')
  ```

- **Ver também:** [Transitions: Entering, Leaving, and Lists](../guide/transitions.html)

### transition-group

- **Props:**
  - `tag` - string, defaults to `span`.
  - `move-class` - overwrite CSS class applied during moving transition.
  - exposes the same props as `<transition>` except `mode`.

- **Events:**
  - exposes the same events as `<transition>`.

- **Uso:**

  `<transition-group>` serve as transition effects for **multiple** elements/components. The `<transition-group>` renders a real DOM element. By default it renders a `<span>`, and you can configure what element is should render via the `tag` attribute.

  Note every child in a `<transition-group>` must be **uniquely keyed** for the animations to work properly.

  `<transition-group>` supports moving transitions via CSS transform. When a child's position on screen has changed after an updated, it will get applied a moving CSS class (auto generated from the `name` attribute or configured with the `move-class` attribute). If the CSS `transform` property is "transition-able" when the moving class is applied, the element will be smoothly animated to its destination using the [FLIP technique](https://aerotwist.com/blog/flip-your-animations/).

  ```html
  <transition-group tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </transition-group>
  ```

- **Ver também:** [Transitions: Entering, Leaving, and Lists](../guide/transitions.html)

### keep-alive

- **Props:**
  - `include` - string or RegExp or Array. Only components matched by this will be cached.
  - `exclude` - string or RegExp or Array. Any component matched by this will not be cached.

- **Uso:**

  When wrapped around a dynamic component, `<keep-alive>` caches the inactive component instances without destroying them. Similar to `<transition>`, `<keep-alive>` is an abstract component: it doesn't render a DOM element itself, and doesn't show up in the component parent chain.

  When a component is toggled inside `<keep-alive>`, its `activated` and `deactivated` lifecycle hooks will be invoked accordingly.

  > In 2.2.0+ and above, `activated` and `deactivated` will fire for all nested components inside a `<keep-alive>` tree.

  Primarily used with preserve component state or avoid re-rendering.

  ```html
  <!-- basic -->
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>

  <!-- multiple conditional children -->
  <keep-alive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </keep-alive>

  <!-- used together with `<transition>` -->
  <transition>
    <keep-alive>
      <component :is="view"></component>
    </keep-alive>
  </transition>
  ```

  Note, `<keep-alive>` is designed for the case where it has one direct child component that is being toggled. It does not work if you have `v-for` inside it. When there are multiple conditional children, as above, `<keep-alive>` requires that only one child is rendered at a time.

- **`include` and `exclude`**

  > Novo em 2.1.0+

  The `include` and `exclude` props allow components to be conditionally cached. Both props can be a comma-delimited string, a RegExp or an Array:

  ``` html
  <!-- comma-delimited string -->
  <keep-alive include="a,b">
    <component :is="view"></component>
  </keep-alive>

  <!-- regex (use `v-bind`) -->
  <keep-alive :include="/a|b/">
    <component :is="view"></component>
  </keep-alive>

  <!-- Array (use `v-bind`) -->
  <keep-alive :include="['a', 'b']">
    <component :is="view"></component>
  </keep-alive>
  ```

  The match is first checked on the component's own `name` option, then its local registration name (the key in the parent's `components` option) if the `name` option is not available. Anonymous components cannot be matched against.

  <p class="tip">`<keep-alive>` does not work with functional components because they do not have instances to be cached.</p>

- **Ver também:** [Dynamic Components - keep-alive](../guide/components.html#keep-alive)

### slot

- **Props:**
  - `name` - string, Used for named slot.

- **Uso:**

  `<slot>` serve as content distribution outlets in component templates. `<slot>` itself will be replaced.

  For detailed usage, see the guide section linked below.

- **Ver também:** [Content Distribution with Slots](../guide/components.html#Content-Distribution-with-Slots)

## Interface VNode

- Por favor, consulte a [declaração da classe VNode](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js).

## Renderização no Lado do Servidor

- Por favor, consulte a [documentação do pacote vue-server-renderer](https://ssr.vuejs.org/en/api.html).
