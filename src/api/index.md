---
type: api
---

## Глобальный Конфиг

`Vue.config` - это объект, содержащий глобальную конфигурацию Vue. Вы можете изменить его нижеперечисленные свойства перед начальной загрузкой вашего приложения:

### silent

- **Тип:** `boolean`

- **По умолчанию:** `false`

- **Использование:**

  ``` js
  Vue.config.silent = true
  ```

  Подавляет все логи и предупреждения Vue.

### optionMergeStrategies

- **Тип:** `{ [key: string]: Function }`

- **По умолчанию:** `{}`

- **Использование:**

  ``` js
  Vue.config.optionMergeStrategies._my_option = function (parent, child, vm) {
    return child + 1
  }

  const Profile = Vue.extend({
    _my_option: 1
  })

  // Profile.options._my_option = 2
  ```

  Определяет пользовательские стратегии слияния для опций.

  Стратегия слияния получает значения опции, определённые в родительском и дочернем элементах как первый и второй параметр соответственно. Контекст действующего экземпляра Vue передаётся как третий аргумент.

- **См. также:** [Пользовательские Методы Слияния Опций](/guide/mixins.html#Custom-Option-Merge-Strategies)

### devtools

- **Тип:** `boolean`

- **По умолчанию:** `true` (`false` в production-сборках)

- **Использование:**

  ``` js
  // удостоверьтесь, что эта опция устанавливается синхронно сразу после загрузки Vue
  Vue.config.devtools = true
  ```

  Указывает, позволять ли инспекции [vue-devtools](https://github.com/vuejs/vue-devtools). Значение по умолчанию для development-окружения — `true`, для production-сборок — `false`. Вы можете установить `true` для использования vue-devtools в production-окружении.

### errorHandler

- **Тип:** `Function`

- **По умолчанию:** Ошибка выбрасывается "на месте"

- **Использование:**

  ``` js
  Vue.config.errorHandler = function (err, vm) {
    // обработка ошибки
  }
  ```

  Устанавливает обработчик для ошибок, не пойманных во время рендеренга компонент и в наблюдателях. Обработчик при вызове будут передана ошибка и действующий экземпляр Vue.

  > [Sentry](https://sentry.io), сервис трекинга ошибок, предоставляет [официальную интеграцию](https://sentry.io/for/vue/), с использованием этой опции.

### keyCodes

- **Тип:** `{ [key: string]: number }`

- **По умолчанию:** `{}`

- **Использование:**

  ``` js
  Vue.config.keyCodes = {
    v: 86,
    f1: 112,
    mediaPlayPause: 179
  }
  ```

  Определяет пользовательский алиас(ы) для директивы v-on.

## Глобальное API

<h3 id="Vue-extend">Vue.extend( options )</h3>

- **Аргументы:**
  - `{Object} options`

- **Использование:**

  Создаёт "подкласс" базового конструктора Vue. Параметром должен быть объект, содержащий опции компонента.  

  Внимание: при использовании с `Vue.extend()` опция `data` должна быть определена как функция.  

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
  // создаёт экземпляр Profile и монтирует его к элементу DOM
  new Profile().$mount('#mount-point')
  ```

  Результатом будет:

  ``` html
  <p>Walter White aka Heisenberg</p>
  ```

- **См. также:** [Компоненты](/guide/components.html)

<h3 id="Vue-nextTick">Vue.nextTick( callback, [context] )</h3>

- **Аргументы:**
  - `{Function} callback`
  - `{Object} [context]`

- **Использование:**

  Откладывает выполнение callback-функции до следующего цикла обновления DOM. Используйте непосредственно после того как изменяете какие-либо данные чтобы подождать обновления DOM.
  

  ``` js
  // modify data
  vm.msg = 'Hello'
  // DOM ещё не обновлён
  Vue.nextTick(function () {
    // теперь DOM обновлён
  })
  ```

- **См. также:** [Async Update Queue](/guide/reactivity.html#Async-Update-Queue)

<h3 id="Vue-set">Vue.set( object, key, value )</h3>

- **Аргументы:**
  - `{Object} object`
  - `{string} key`
  - `{any} value`

- **Returns:** установленное значение.

- **Использование:**

  Устанавливает значение поля объекта. Если объект является реактивным, удостоверится что поле будет создано как реактивное и запустит обновления view. Главным образом используется для обхода ограничения, из-за которого Vue не может детектировать добавление полей неявно.

  **Обратите внимание что объект не может быть экземпляром Vue или корневым объектом data экземпляра Vue.**

- **См. также:** [Подробно о Реактивности](/guide/reactivity.html)

<h3 id="Vue-delete">Vue.delete( object, key )</h3>

- **Аргументы:**
  - `{Object} object`
  - `{string} key`

- **Использование:**

  Удаляет поле объекта. Если объект является реактивным, удостоверится что удаление запустит обновления view. Главным образом используется для обхода ограничения, из-за которого Vue не может детектировать удаления полей неявно, хотя вам в ряд ли часто понадобится использовать эту возможность.

  **Обратите внимание что объект не может быть экземпляром Vue или корневым объектом data экземпляра Vue.**

- **См. также:** [Подробно о Реактивности](/guide/reactivity.html)

<h3 id="Vue-directive">Vue.directive( id, [definition] )</h3>

- **Аргументы:**
  - `{string} id`
  - `{Function | Object} [definition]`

- **Использование:**

  Регистрирует или получает глобальную директиву.  

  ``` js
  // регистрация
  Vue.directive('my-directive', {
    bind: function () {},
    inserted: function () {},
    update: function () {},
    componentUpdated: function () {},
    unbind: function () {}
  })

  // регистрация (директива в виде простой функции)
  Vue.directive('my-directive', function () {
    // эта функция будет вызвана как `bind` и `update`
  })

  // геттер, вернёт определение директивы, если она зарегистрирована  
  var myDirective = Vue.directive('my-directive')
  ```

- **См. также:** [Пользовательские Директивы](/guide/custom-directive.html)

<h3 id="Vue-filter">Vue.filter( id, [definition] )</h3>

- **Аргументы:**
  - `{string} id`
  - `{Function} [definition]`

- **Использование:**

  Регистрирует или получает глобальный фильтр.

  ``` js
  // регистрация
  Vue.filter('my-filter', function (value) {
    // return processed value
  })

  // геттер, вернёт фильтр если он зарегистрирован
  var myFilter = Vue.filter('my-filter')
  ```

<h3 id="Vue-component">Vue.component( id, [definition] )</h3>

- **Аргументы:**
  - `{string} id`
  - `{Function | Object} [definition]`

- **Использование:**

  Регистрирует или получает глобальный компонент

  ``` js
  // регистрирует расширенный конструктор
  Vue.component('my-component', Vue.extend({ /* ... */ }))

  // регистрирует объект опций (Vue.extend будет вызвана автоматически)
  Vue.component('my-component', { /* ... */ })

  // получает зарегистрированный компонент (всегда вернёт конструктор)
  var MyComponent = Vue.component('my-component')
  ```

- **См. также:** [Компоненты](/guide/components.html)

<h3 id="Vue-use">Vue.use( plugin )</h3>

- **Аргументы:**
  - `{Object | Function} plugin`

- **Использование:**

  Устанавливает плагин Vue.js. Если плагин определён как объект, он должен содержать публичный метод `install`. Если плагин сам является функцией, он будет воспринят как метод install. Упомянутый метод будет вызван с Vue в качестве аргумента.

  При многократном вызове этого метода с одним и тем же плагином, плагин будет установлен только однажды.  

- **См. также:** [Плагины](/guide/plugins.html)

<h3 id="Vue-mixin">Vue.mixin( mixin )</h3>

- **Аргументы:**
  - `{Object} mixin`

- **Использование:**

  Применяет миксин глобально, оказывая влияние на все созданные впоследствии экземпляры Vue. Это может быть использовано авторами плагинов для инъекции пользовательского поведения в компоненты. **Не рекомендуется к использованию в коде приложений**.  

- **См. также:** [Глобальные Миксины](/guide/mixins.html#Global-Mixin)

<h3 id="Vue-compile">Vue.compile( template )</h3>

- **Аргументы:**
  - `{string} template`

- **Использование:**

  Компилирует строковой шаблон в render-функцию. **Доступно только в автономной сборке.**

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

- **См. также:** [Render-Функции](/guide/render-function.html)

## Опции / Data

### data

- **Тип:** `Object | Function`

- **Ограничение:** Принимает только `Function` когда используется при определении компонентов.

- **Подробности:**

  Объект данных для экземпляра Vue. Vue рекурсивно конвертирует поля этого объекта в геттеры/сеттеры чтобы сделать его "реактивным". **Объект должен быть простым**: нативные объекты, такие как объекты API браузера и свойства прототипа игнорируются. Упрощённо, правило состоит в том чтобы данные были просто данными — наблюдение за обладающими собственным зависящим от состояния поведением не рекомендуется.
  
  Однажды начав наблюдение, вы не сможете больше добавлять реактивные свойства к корневому объекту данных. По этой причине рекоммендуется определять все реактивные свойства корневого уровня заранее, до создания экземпляра.

  После того как экземпляр был создан, доступ к оригиналу объекта данных может быть получен как `vm.$data`. Экземпляр Vue также проксирует все свойства, обнаруженные в объекте data, так что `vm.a` будет эквивалентно `vm.$data.a`.

  Свойства, названия которых начинается с `_` или `$` **не** проксируются из-за возможных конфликтов со внутренними свойствами и методами API Vue. Доступ к таким свойствам возможен только через `vm.$data._property`.  

  При определении **компонента**, `data` должна быть определена как функция, возвращающая объект для инициализации, так как будет создано множество экземпляров компонента, используя одно и то же определение. Если бы мы всё так же использовали для `data` простой объект, **ссылку на него** получили бы все созданные экземпляры! При использовании функции для `data`, при каждом создании нового экземпляра мы можем попросту вызвать эту функцию и вернуть свежую копию данных для инициализации.
  
  При необходимости полная копия оригинального объекта может быть получена при передаче `vm.$data` как аргумента в `JSON.parse(JSON.stringify(...))`.

- **Пример:**

  ``` js
  var data = { a: 1 }

  // прямое создание экземпляра
  var vm = new Vue({
    data: data
  })
  vm.a // -> 1
  vm.$data === data // -> true

  // при использовании Vue.extend() необходимо использование функции
  var Component = Vue.extend({
    data: function () {
      return { a: 1 }
    }
  })
  ```

  <p class="tip">Обратите внимание, что __вам не стоит использовать arrow-функции в параметре `data`__ (напр. `data: () => { return { a: this.myProp }}`). Причина в том, что arrow-функции связываются с родительским контекстом, и таким образом `this` не будет указывать на экземпляр Vue (что ожидается), и `this.myProp` окажется неопределенным.</p>

- **См. также:** [Подробно о Реактивности](/guide/reactivity.html)

### props

- **Тип:** `Array<string> | Object`

- **Подробности:**

  Список или хэш аттрибутов, по которым разрешено получение данных от родительского компонента. Допустима простая форма записи на основе массивов и альтертанивный объектный синтаксис, позволяющий расширенное конфигурирование, такое как проверка типов, пользовательская валидация и указание значений по умолчанию.

- **Пример:**

  ``` js
  // простая форма записи
  Vue.component('props-demo-simple', {
    props: ['size', 'myMessage']
  })

  // объектный синтаксис, с указанием правил валидации
  Vue.component('props-demo-advanced', {
    props: {
      // только проверка типа
      height: Number,
      // проверка типа плюс другие правила валидации
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

- **См. также:** [Параметры Компонентов](/guide/components.html#Props)

### propsData

- **Тип:** `{ [key: string]: any }`

- **Ограничение:** учитывается только при создании экземпляра через `new`.

- **Подробности:**

  Передаёт параметры компоненту при его создании. В основном предназначено для облегчения тестирования.

- **Пример:**

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

- **Тип:** `{ [key: string]: Function | { get: Function, set: Function } }`

- **Подробности:**

  Содержит вычисляемые свойства, которые будут подмешаны к экземпляру Vue. Контекст `this` всех геттеров и сеттеров привязывается к экземпляру Vue автоматически.

  <p class="tip">Обратите внимание, что __вам не стоит использовать arrow-функции при определении вычисляемых свойств__ (напр. `aDouble: () => this.a * 2`). Причина в том, что arrow-функции связываются с родительским контекстом, и таким образом `this` не будет указывать на экземпляр Vue (что ожидается), и `this.a` окажется неопределенным.</p>

  Вычисляемые свойства кэшируются и повторно вычисляются только при изменении реактивных зависимостей.

- **Пример:**

  ```js
  var vm = new Vue({
    data: { a: 1 },
    computed: {
      // только получение данных, достаточно простой функции
      aDouble: function () {
        return this.a * 2
      },
      // и получение и установка
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

- **См. также:**
  - [Вычисляемые Свойства](/guide/computed.html)

### methods

- **Тип:** `{ [key: string]: Function }`

- **Подробности:**

  Методы, которые будут подмешаны к экземпляру Vue. Вы можете получить доступ к этим методам непосредственно через экземпляр VM, или использовать их в выражениях директив. Контекст `this` всех методов привязывается к экземпляру Vue автоматически.

  <p class="tip">Обратите внимание, что __вам не стоит использовать arrow-функции при определении методов__ (напр. `plus: () => this.a++`). Причина в том, что arrow-функции связываются с родительским контекстом, и таким образом `this` не будет указывать на экземпляр Vue (что ожидается), и `this.a` окажется неопределенным.</p>

- **Пример:**

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

- **См. также:** [Методы и Обработка Событий](/guide/events.html)

### watch

- **Тип:** `{ [key: string]: string | Function | Object }`

- **Подробности:**

  Объект, ключи которого — выражения для наблюдения, а значения — соответствующие функции обратного вызова. Значения также могут строками с именами методов, или объектами, содержащими дополнительные опции. Экземпляр Vue вызовет `$watch()` для каждой записи при создании экземпляра.

- **Пример:**

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
      // строка с именем метода
      b: 'someMethod',
      // глубокий наблюдатель
      c: {
        handler: function (val, oldVal) { /* ... */ },
        deep: true
      }
    }
  })
  vm.a = 2 // -> new: 2, old: 1
  ```

  <p class="tip">Обратите внимание, что __вам не стоит использовать arrow-функции при определении наблюдателей__ (напр. `searchQuery: newValue => this.updateAutocomplete(newValue)`). Причина в том, что arrow-функции связываются с родительским контекстом, и таким образом `this` не будет указывать на экземпляр Vue (что ожидается), и `this.updateAutocomplete` окажется неопределенным.</p>

- **См. также:** [Instance Methods - vm.$watch](#vm-watch)

## Опции / DOM

### el

- **Тип:** `string | HTMLElement`

- **Ограничение:** используется только при создании экземпляра через `new`.

- **Подробности:**

  Указывает, на какой существующий элемент DOM будет смонтирован экземпляр Vue. Может быть строковым CSS-селектором или собственно экземпляром HTMLElement.

  После монтирования экземпляра, разрешённый элемент будет доступен как `vm.$el`.

  Если эта опция указана при создании экземпляра, компиляция будет начата незамедлительно. В противном случае для ручного старта компиляции будет необходимо явно вызвать `vm.$mount()`.

  <p class="tip">Указанный элемент служит исключительно точкой монтирования. В отличии от Vue 1.x, он будет заменен сгенерированным Vue DOM во всех случаях. По этой причине монтирование в корневые элементы `<html>` или `<body>` не рекоммендуется.</p>

- **См. также:** [Диаграмма Жизненного Цикла](/guide/instance.html#Lifecycle-Diagram)

### template

- **Тип:** `string`

- **Подробности:**

  Строковый шаблон, который будет использован как разметка для экземпляра Vue. Этот шаблон **заменит** элемент в точке монтирования. Вся уже существующая разметка внутри точки монтирования будет проигнорирована, за исключением случаев наличия слотов дистрибьюции контента в шаблоне.

  Если строка начинается с `#`, она будет использована как querySelector, а в качестве строкового шаблона будет использован innerHTML элемента с указанным id. Это позволяет использовать распространённый трюк с `<script type="x-template">` для включения шаблонов.

  <p class="tip">С позиций безопасности, вы должны всегда использовать только те шаблоны Vue, которым можете доверять. Никогда не используйте в качестве шаблона данные, вводимые пользователем.</p>

- **См. также:**
  - [Диаграмма Жизненного Цикла](/guide/instance.html#Lifecycle-Diagram)
  - [Дистрибьюция Контента](/guide/components.html#Content-Distribution-with-Slots)

### render

  - **Тип:** `Function`

  - **Подробности:**

    Альтернатива строковым шаблонам, позволяющая задействовать все алгоритмические возможности JavaScript. Render-функция получает первым аргументом метод `createElement`, используемый для создания `VNode`-ов.

    Если компонент является функциональным, также передаётся второй параметр `context`, дающий доступ к контекстным данным, так как функциональные компоненты не имеют экземпляров.

  - **См. также:**
    - [Render-Функции](/guide/render-function)

## Опции / Хуки Жизненного Цикла

Контекст `this` всех хуков автоматически привязывается к экземпляру, что даёт доступ к данным, вычисляемым свойствам и методам. Это значит, что __вам не следует использовать arrow-функции для определения методов жизненного цикла__ (напр. `created: () => this.fetchTodos()`). Причина в том, что arrow-функции связываются с родительским контекстом, и таким образом `this` не будет указывать на экземпляр Vue (что ожидается), и `this.fetchTodos` окажется неопределенным.

### beforeCreate

- **Тип:** `Function`

- **Подробности:**

  Вызывается синхронно сразу после инициализации экземпляра, до настройки наблюдения за данными и механизмов наблюдателей/событий.

- **См. также:** [Диаграмма Жизненного Цикла](/guide/instance.html#Lifecycle-Diagram)

### created

- **Тип:** `Function`

- **Подробности:**

  Вызывается синхронно сразу после создания экземпляра. На этом этапе экземпляр закончил обработку опций, что означает что все нижеперечисленное уже работает: наблюдение за данными, вычисляемые свойства, методы, функции обратного вызова наблюдателей и событий. Однако, фаза монтирования ещё не была начата, и свойство `$el` ещё не будет доступно.

- **См. также:** [Диаграмма Жизненного Цикла](/guide/instance.html#Lifecycle-Diagram)

### beforeMount

- **Тип:** `Function`

- **Подробности:**

  Вызывается перед началом монтирования: сразу перед первым вызовом функции `render`.  

  **При рендеринге на стороне сервера этот хук не вызывается.**

- **См. также:** [Диаграмма Жизненного Цикла](/guide/instance.html#Lifecycle-Diagram)

### mounted

- **Тип:** `Function`

- **Подробности:**

  Вызывается сразу после того как экземпляр был смонтирован, а `el` — заменено новосозданным `vm.$el`. Если корневой экземпляр смонтирован на in-document элемент, `vm.$el` будет также in-document элементом к моменту вызова `mounted`.

  **При рендеринге на стороне сервера этот хук не вызывается.**

- **См. также:** [Диаграмма Жизненного Цикла](/guide/instance.html#Lifecycle-Diagram)

### beforeUpdate

- **Тип:** `Function`

- **Подробности:**

  Вызывается при изменении данных, перед ререндерингом и обновлением virtual DOM.

  В этом хуке можно дополнительно изменять состояние, и это не вызовет повторного ререндеринга.  

  **При рендеринге на стороне сервера этот хук не вызывается.**

- **См. также:** [Диаграмма Жизненного Цикла](/guide/instance.html#Lifecycle-Diagram)

### updated

- **Тип:** `Function`

- **Подробности:**

  Вызывается после того как virtual DOM был обновлён вследствие изменения данных.

  DOM компонента будет находиться в обновлённом состоянии к моменту вызова этого хука, что позволяет выполнять здесь операции, имеющие зависимость от DOM. Однако, в большинстве случаев следует избегать изменения состояния в этом хуке, поскольку это может привести к бесконечному циклу обновления.  

  **При рендеринге на стороне сервера этот хук не вызывается.**

- **См. также:** [Диаграмма Жизненного Цикла](/guide/instance.html#Lifecycle-Diagram)

### activated

- **Тип:** `Function`

- **Подробности:**

  Вызывается при активации keep-alive компонента.  

  **При рендеринге на стороне сервера этот хук не вызывается.**

- **См. также:**
  - [Built-in Компоненты - keep-alive](#keep-alive)
  - [Динамические Компоненты - keep-alive](/guide/components.html#keep-alive)

### deactivated

- **Тип:** `Function`

- **Подробности:**

  Вызывается после деактивации keep-alive компонента.

  **При рендеринге на стороне сервера этот хук не вызывается.**

- **См. также:**
  - [Built-in Компоненты - keep-alive](#keep-alive)
  - [Динамические Компоненты - keep-alive](/guide/components.html#keep-alive)

### beforeDestroy

- **Тип:** `Function`

- **Подробности:**

  Вызывается непосредственно перед уничтожением экземпляра Vue. На этом этапе экземпляр всё ещё полностью функционален.  

  **При рендеринге на стороне сервера этот хук не вызывается.**

- **См. также:** [Диаграмма Жизненного Цикла](/guide/instance.html#Lifecycle-Diagram)

### destroyed

- **Тип:** `Function`

- **Подробности:**

  Вызывается после уничтожения экземпляра Vue. К моменту вызова этого хука, все директивы экземпляра Vue уже отвязаны, все слушатели событий — удалены, все дочерние экземпляры Vue — также уничтожены.

  **При рендеринге на стороне сервера этот хук не вызывается.**

- **См. также:** [Диаграмма Жизненного Цикла](/guide/instance.html#Lifecycle-Diagram)

## Опции / Assets

### directives

- **Тип:** `Object`

- **Подробности:**

  Хэш директив которые будут доступны экземпляру Vue.

- **См. также:**
  - [Пользовательские Директивы](/guide/custom-directive.html)
  - [Соглашение по Именованию Asset'ов](/guide/components.html#Assets-Naming-Convention)

### filters

- **Тип:** `Object`

- **Подробности:**

  Хэш фильтров которые будут доступны экземпляру Vue.

- **См. также:**
  - [`Vue.filter`](#Vue-filter)

### components

- **Тип:** `Object`

- **Подробности:**

  Хэш компонентов которые будут доступны экземпляру Vue.

- **См. также:**
  - [Компоненты](/guide/components.html)

## Options / Разное

### parent

- **Тип:** `Vue instance`

- **Подробности:**

  Указывает родительский экземпляр для создаваемого. Устанавливает отношение "родитель-ребёнок" между ними. Родительский элемент будет доступен для дочернего через `this.$parent`, а дочерний элемент будет дабавлен в массив `$children` родителя.  

  <p class="tip">Use `$parent` and `$children` sparringly - they mostly serve as an escape-hatch. Prefer using props and events for parent-child communication.</p>

### mixins

- **Тип:** `Array<Object>`

- **Подробности:**

  Опция `mixins` принимает массив объектов-примесей. Примеси могут содержать точно такие же опции, как и обычные объекты экземпляров Vue, и они будут слиты с основными опциями по той же логике, что и при использовании `Vue.extend()`. Например, если и примесь и объект оба содержат хук `created`, вызваны будут обе функции.

  Хуки примесей вызываются в порядке их определения, перед вызовом собственных хуков компонента.

- **Пример:**

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

- **См. также:** [Mixins](/guide/mixins.html)

### name

- **Тип:** `string`

- **Ограничение:** учитывается только при определении компонента.

- **Подробности:**

  Позволяет компоненту рекурсивно вызывать самого себя в шаблоне. Обратите внимание что когда компонент регистрируется глобально посредством `Vue.component()`, глобальный ID автоматически устанавливается равным его имени.
  
  Другое преимущество указания опции `name` проявляется в отладке. Именованние компонент приводит к более понятным предупреждающим сообщениям. Также, при использовании [vue-devtools](https://github.com/vuejs/vue-devtools) безымянные компоненты отображаются как `<AnonymousComponent>`, что не очень информативно. Указывая опцию `name`, вы получите значительно более информативное дерево компонент.

### extends

- **Тип:** `Object | Function`

- **Подробности:**

  Позволяет декларативно наследоваться от другого компонента (может быть либо простым объектом, либо конструктором), не используя `Vue.extend`. Главным образом предназначено для облегчения наследования между компонентами, хранимыми в единых файлах.

  Эта функциональность близка к `mixins`, с разницей в том, что собственные опции компонента имеют высший приоритет над опциями компонента, от которого происходит наследование.

- **Пример:**

  ``` js
  var CompA = { ... }

  // наследование от CompA без необходимость вызывать Vue.extend ни в том ни в другом
  var CompB = {
    extends: CompA,
    ...
  }
  ```

### delimiters

- **Тип:** `Array<string>`

- **По умолчанию:** `["{{", "}}"]`

- **Подробности:**

  Изменяет маркеры, выделяющие текст для интерполяции. **Доступно только в автономной сборке.**

- **Пример:**

  ``` js
  new Vue({
    delimiters: ['${', '}']
  })

  // Маркеры в шаблонах изменены на стиль ES6
  ```

### functional

- **Тип:** `boolean`

- **Подробности:**

  Превращает компонент в stateless (не имеющий `data`) и instanceless (без контекста `this`). Такие компоненты представляют собой попросту функцию `render`, которая возвращает узлы Virtual DOM, делая рендеринг значительно дешевле.  

- **См. также:** [Функциональные Компоненты](/guide/render-function.html#Functional-Components)

## Instance Properties

### vm.$data

- **Тип:** `Object`

- **Подробности:**

  Объект данных, над которым экземпляр Vue осуществляет наблюдение. Экземпляр проксирует доступ к объекту данных через это поле.  

- **См. также:** [Опции - data](#data)

### vm.$el

- **Тип:** `HTMLElement`

- **Только для чтения**

- **Подробности:**

  Корневой элемент DOM, управляемый экземпляром Vue.

### vm.$options

- **Тип:** `Object`

- **Только для чтения**

- **Подробности:**

  Опции инстанциирования, использованные для текущего экземпляра Vue. Полезно, когда вы хотите включить пользовательские свойства в опции:  

  ``` js
  new Vue({
    customOption: 'foo',
    created: function () {
      console.log(this.$options.customOption) // -> 'foo'
    }
  })
  ```

### vm.$parent

- **Тип:** `Vue instance`

- **Только для чтения**

- **Подробности:**

  Родительский экземпляр, если присутствует.

### vm.$root

- **Тип:** `Vue instance`

- **Только для чтения**

- **Подробности:**

  Корневой экземпляр Vue текущего дерева компонентов. Если текущий экземпляр не имеет родителей, значением будет он сам.

### vm.$children

- **Тип:** `Array<Vue instance>`

- **Только для чтения**

- **Подробности:**

  Компоненты, являющиеся прямыми потомками текущего экземпляра. **Обратите внимания, что порядок следования элементов в `$children` не гарантируется, и этот массив не реактивен.** Если вы обнаружите, что пытаетесь использовать `$children` для связывания данных, попробуйте использовать массив и директиву `v-for` для создания дочерних компонент, и используйте этот массив как "источник истины".

### vm.$slots

- **Тип:** `Object`

- **Только для чтения**

- **Подробности:**

  Используется для доступа к контенту, [распространяемому через слоты](/guide/components.html#Content-Distribution-with-Slots). Каждый [именованный слот](/guide/components.html#Named-Slots) имеет собственное соответствующее значение (например, содержимое `slot="foo"` будет находится в `vm.$slots.foo`). Свойство `default` содержит узлы, не включённые в именованные слоты.
  
  Использование `vm.$slots` более всего находит своё применение при написании компонентов с [render-функциями](/guide/render-function.html).

- **Пример:**

  ```html
  <blog-post>
    <h1 slot="header">
      About Me
    </h1>

    <p>Here's some page content, which will be included in vm.$slots.default, because it's not inside a named slot.</p>

    <p slot="footer">
      Copyright 2016 Evan You
    </p>

    <p>If I have some content down here, it will also be included in vm.$slots.default.</p>.
  </blog-post>
  ```

  ```js
  Vue.component('blog-post', {
    render: function (createElement) {
      var header = this.$slots.header
      var body   = this.$slots.default
      var footer = this.$slots.footer
      return createElement('div', [
        createElement('header', header)
        createElement('main', body)
        createElement('footer', footer)
      ])
    }
  })
  ```

- **См. также:**
  - [`<slot>` Component](#slot)
  - [Content Distribution with Slots](/guide/components.html#Content-Distribution-with-Slots)
  - [Render-Функции](/guide/render-function.html)

### vm.$refs

- **Тип:** `Object`

- **Только для чтения**

- **Подробности:**

  An object that holds child components that have `ref` registered.

- **См. также:**
  - [Child Component Refs](/guide/components.html#Child-Component-Refs)
  - [ref](#ref)

### vm.$isServer

- **Тип:** `boolean`

- **Только для чтения**

- **Подробности:**

  Whether the current Vue instance is running on the server.

- **См. также:** [Server-Side Rendering](/guide/ssr.html)

## Instance Methods / Data

<h3 id="vm-watch">vm.$watch( expOrFn, callback, [options] )</h3>

- **Аргументы:**
  - `{string | Function} expOrFn`
  - `{Function} callback`
  - `{Object} [options]`
    - `{boolean} deep`
    - `{boolean} immediate`

- **Returns:** `{Function} unwatch`

- **Использование:**

  Watch an expression or a computed function on the Vue instance for changes. The callback gets called with the new value and the old value. The expression can be a single keypath or any valid binding expressions.

<p class="tip">Note: when mutating (rather than replacing) an Object or an Array, the old value will be the same as new value because they reference the same Object/Array. Vue doesn't keep a copy of the pre-mutate value.</p>

- **Пример:**

  ``` js
  // keypath
  vm.$watch('a.b.c', function (newVal, oldVal) {
    // do something
  })

  // expression
  vm.$watch('a + b', function (newVal, oldVal) {
    // do something
  })

  // function
  vm.$watch(
    function () {
      return this.a + this.b
    },
    function (newVal, oldVal) {
      // do something
    }
  )
  ```

  `vm.$watch` returns an unwatch function that stops firing the callback:

  ``` js
  var unwatch = vm.$watch('a', cb)
  // later, teardown the watcher
  unwatch()
  ```

- **Option: deep**

  To also detect nested value changes inside Objects, you need to pass in `deep: true` in the options argument. Note that you don't need to do so to listen for Array mutations.

  ``` js
  vm.$watch('someObject', callback, {
    deep: true
  })
  vm.someObject.nestedValue = 123
  // callback is fired
  ```

- **Option: immediate**

  Passing in `immediate: true` in the option will trigger the callback immediately with the current value of the expression:

  ``` js
  vm.$watch('a', callback, {
    immediate: true
  })
  // callback is fired immediately with current value of `a`
  ```

<h3 id="vm-set">vm.$set( object, key, value )</h3>

- **Аргументы:**
  - `{Object} object`
  - `{string} key`
  - `{any} value`

- **Returns:** the set value.

- **Использование:**

  This is the **alias** of the global `Vue.set`.

- **См. также:** [Vue.set](#Vue-set)

<h3 id="vm-delete">vm.$delete( object, key )</h3>

- **Аргументы:**
  - `{Object} object`
  - `{string} key`

- **Использование:**

  This is the **alias** of the global `Vue.delete`.

- **См. также:** [Vue.delete](#Vue-delete)

## Instance Methods / Events

<h3 id="vm-on">vm.$on( event, callback )</h3>

- **Аргументы:**
  - `{string} event`
  - `{Function} callback`

- **Использование:**

  Listen for a custom event on the current vm. Events can be triggered by `vm.$emit`. The callback will receive all the additional arguments passed into these event-triggering methods.

- **Пример:**

  ``` js
  vm.$on('test', function (msg) {
    console.log(msg)
  })
  vm.$emit('test', 'hi')
  // -> "hi"
  ```

<h3 id="vm-once">vm.$once( event, callback )</h3>

- **Аргументы:**
  - `{string} event`
  - `{Function} callback`

- **Использование:**

  Listen for a custom event, but only once. The listener will be removed once it triggers for the first time.

<h3 id="vm-off">vm.$off( [event, callback] )</h3>

- **Аргументы:**
  - `{string} [event]`
  - `{Function} [callback]`

- **Использование:**

  Remove event listener(s).

  - If no arguments are provided, remove all event listeners;

  - If only the event is provided, remove all listeners for that event;

  - If both event and callback are given, remove the listener for that specific callback only.

<h3 id="vm-emit">vm.$emit( event, [...args] )</h3>

- **Аргументы:**
  - `{string} event`
  - `[...args]`

  Trigger an event on the current instance. Any additional arguments will be passed into the listener's callback function.

## Instance Methods / Lifecycle

<h3 id="vm-mount">vm.$mount( [elementOrSelector] )</h3>

- **Аргументы:**
  - `{Element | string} [elementOrSelector]`
  - `{boolean} [hydrating]`

- **Returns:** `vm` - the instance itself

- **Использование:**

  If a Vue instance didn't receive the `el` option at instantiation, it will be in "unmounted" state, without an associated DOM element. `vm.$mount()` can be used to manually start the mounting of an unmounted Vue instance.

  If `elementOrSelector` argument is not provided, the template will be rendered as an off-document element, and you will have to use native DOM API to insert it into the document yourself.

  The method returns the instance itself so you can chain other instance methods after it.

- **Пример:**

  ``` js
  var MyComponent = Vue.extend({
    template: '<div>Hello!</div>'
  })

  // create and mount to #app (will replace #app)
  new MyComponent().$mount('#app')

  // the above is the same as:
  new MyComponent({ el: '#app' })

  // or, render off-document and append afterwards:
  var component = new MyComponent().$mount()
  document.getElementById('app').appendChild(component.$el)
  ```

- **См. также:**
  - [Диаграмма Жизненного Цикла](/guide/instance.html#Lifecycle-Diagram)
  - [Server-Side Rendering](/guide/ssr.html)

<h3 id="vm-forceUpdate">vm.$forceUpdate()</h3>

- **Использование:**

  Force the Vue instance to re-render. Note it does not affect all child components, only the instance itself and child components with inserted slot content.

<h3 id="vm-nextTick">vm.$nextTick( callback )</h3>

- **Аргументы:**
  - `{Function} callback`

- **Использование:**

  Defer the callback to be executed after the next DOM update cycle. Use it immediately after you've changed some data to wait for the DOM update. This is the same as the global `Vue.nextTick`, except that the callback's `this` context is automatically bound to the instance calling this method.

- **Пример:**

  ``` js
  new Vue({
    // ...
    methods: {
      // ...
      example: function () {
        // modify data
        this.message = 'changed'
        // DOM is not updated yet
        this.$nextTick(function () {
          // DOM is now updated
          // `this` is bound to the current instance
          this.doSomethingElse()
        })
      }
    }
  })
  ```

- **См. также:**
  - [Vue.nextTick](#Vue-nextTick)
  - [Async Update Queue](/guide/reactivity.html#Async-Update-Queue)

<h3 id="vm-destroy">vm.$destroy()</h3>

- **Использование:**

  Completely destroy a vm. Clean up its connections with other existing vms, unbind all its directives, turn off all event listeners.

  Triggers the `beforeDestroy` and `destroyed` hooks.

  <p class="tip">In normal use cases you shouldn't have to call this method yourself. Prefer controlling the lifecycle of child components in a data-driven fashion using `v-if` and `v-for`.</p>

- **См. также:** [Диаграмма Жизненного Цикла](/guide/instance.html#Lifecycle-Diagram)

## Directives

### v-text

- **Expects:** `string`

- **Подробности:**

  Updates the element's `textContent`. If you need to update the part of `textContent`, you should use `{% raw %}{{ Mustache }}{% endraw %}` interpolations.

- **Пример:**

  ```html
  <span v-text="msg"></span>
  <!-- same as -->
  <span>{{msg}}</span>
  ```

- **См. также:** [Data Binding Syntax - interpolations](/guide/syntax.html#Text)

### v-html

- **Expects:** `string`

- **Подробности:**

  Updates the element's `innerHTML`. **Note that the contents are inserted as plain HTML - they will not be compiled as Vue templates**. If you find yourself trying to compose templates using `v-html`, try to rethink the solution by using components instead.

  <p class="tip">Dynamically rendering arbitrary HTML on your website can be very dangerous because it can easily lead to [XSS attacks](https://en.wikipedia.org/wiki/Cross-site_scripting). Only use `v-html` on trusted content and **never** on user-provided content.</p>

- **Пример:**

  ```html
  <div v-html="html"></div>
  ```
- **См. также:** [Data Binding Syntax - interpolations](/guide/syntax.html#Raw-HTML)

### v-if

- **Expects:** `any`

- **Использование:**

  Conditionally render the element based on the truthy-ness of the expression value. The element and its contained directives / components are destroyed and re-constructed during toggles. If the element is a `<template>` element, its content will be extracted as the conditional block.

  This directive triggers transitions when its condition changes.

- **См. также:** [Conditional Rendering - v-if](/guide/conditional.html)

### v-show

- **Expects:** `any`

- **Использование:**

  Toggle's the element's `display` CSS property based on the truthy-ness of the expression value.

  This directive triggers transitions when its condition changes.

- **См. также:** [Conditional Rendering - v-show](/guide/conditional.html#v-show)

### v-else

- **Does not expect expression**

- **Ограничение:** previous sibling element must have `v-if`.

- **Использование:**

  Denote the "else block" for `v-if`.

  ```html
  <div v-if="Math.random() > 0.5">
    Now you see me
  </div>
  <div v-else>
    Now you don't
  </div>
  ```

- **См. также:**
  - [Conditional Rendering - v-else](/guide/conditional.html#v-else)

### v-for

- **Expects:** `Array | Object | number | string`

- **Использование:**

  Render the element or template block multiple times based on the source data. The directive's value must use the special syntax `alias in expression` to provide an alias for the current element being iterated on:

  ``` html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  Alternatively, you can also specify an alias for the index (or the key if used on an Object):

  ``` html
  <div v-for="(item, index) in items"></div>
  <div v-for="(val, key) in object"></div>
  <div v-for="(val, key, index) in object"></div>
  ```

  The default behavior of `v-for` will try to patch the elements in-place without moving them. To force it to reorder elements, you need to provide an ordering hint with the `key` special attribute:

  ``` html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  The detailed usage for `v-for` is explained in the guide section linked below.

- **См. также:**
  - [List Rendering](/guide/list.html)
  - [key](/guide/list.html#key)

### v-on

- **Shorthand:** `@`

- **Expects:** `Function | Inline Statement`

- **Argument:** `event (required)`

- **Modifiers:**
  - `.stop` - call `event.stopPropagation()`.
  - `.prevent` - call `event.preventDefault()`.
  - `.capture` - add event listener in capture mode.
  - `.self` - only trigger handler if event was dispatched from this element.
  - `.{keyCode | keyAlias}` - only trigger handler on certain keys.
  - `.native` - listen for a native event on the root element of component.

- **Использование:**

  Attaches an event listener to the element. The event type is denoted by the argument. The expression can either be a method name or an inline statement, or simply omitted when there are modifiers present.

  When used on a normal element, it listens to **native DOM events** only. When used on a custom element component, it also listens to **custom events** emitted on that child component.

  When listening to native DOM events, the method receives the native event as the only argument. If using inline statement, the statement has access to the special `$event` property: `v-on:click="handle('ok', $event)"`.

- **Пример:**

  ```html
  <!-- method handler -->
  <button v-on:click="doThis"></button>

  <!-- inline statement -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- shorthand -->
  <button @click="doThis"></button>

  <!-- stop propagation -->
  <button @click.stop="doThis"></button>

  <!-- prevent default -->
  <button @click.prevent="doThis"></button>

  <!-- prevent default without expression -->
  <form @submit.prevent></form>

  <!-- chain modifiers -->
  <button @click.stop.prevent="doThis"></button>

  <!-- key modifier using keyAlias -->
  <input @keyup.enter="onEnter">

  <!-- key modifier using keyCode -->
  <input @keyup.13="onEnter">
  ```

  Listening to custom events on a child component (the handler is called when "my-event" is emitted on the child):

  ```html
  <my-component @my-event="handleThis"></my-component>

  <!-- inline statement -->
  <my-component @my-event="handleThis(123, $event)"></my-component>

  <!-- native event on component -->
  <my-component @click.native="onClick"></my-component>
  ```

- **См. также:**
  - [Методы и Обработка Событий](/guide/events.html)
  - [Компоненты - Custom Events](/guide/components.html#Custom-Events)

### v-bind

- **Shorthand:** `:`

- **Expects:** `any (with argument) | Object (without argument)`

- **Argument:** `attrOrProp (optional)`

- **Modifiers:**
  - `.prop` - Used for binding DOM attributes.

- **Использование:**

  Dynamically bind one or more attributes, or a component prop to an expression.

  When used to bind the `class` or `style` attribute, it supports additional value types such as Array or Objects. See linked guide section below for more details.

  When used for prop binding, the prop must be properly declared in the child component.

  When used without an argument, can be used to bind an object containing attribute name-value pairs. Note in this mode `class` and `style` does not support Array or Objects.

- **Пример:**

  ```html
  <!-- bind an attribute -->
  <img v-bind:src="imageSrc">

  <!-- shorthand -->
  <img :src="imageSrc">

  <!-- class binding -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]">

  <!-- style binding -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- binding an object of attributes -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- DOM attribute binding with prop modifier -->
  <div v-bind:text-content.prop="text"></div>

  <!-- prop binding. "prop" must be declared in my-component. -->
  <my-component :prop="someThing"></my-component>

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

- **См. также:**
  - [Class and Style Bindings](/guide/class-and-style.html)
  - [Компоненты - Component Props](/guide/components.html#Props)

### v-model

- **Expects:** varies based on value of form inputs element or output of components

- **Limited to:**
  - `<input>`
  - `<select>`
  - `<textarea>`
  - components

- **Modifiers:**
  - [`.lazy`](/guide/forms.html#lazy) - listen to `change` events instead of `input`
  - [`.number`](/guide/forms.html#number) - cast input string to numbers
  - [`.trim`](/guild/forms.html#trim) - trim input

- **Использование:**

  Create a two-way binding on a form input element or a component. For detailed usage, see guide section linked below.

- **См. также:**
  - [Form Input Bindings](/guide/forms.html)
  - [Компоненты - Form Input Компоненты using Custom Events](/guide/components.html#Form-Input-Компоненты-using-Custom-Events)

### v-pre

- **Does not expect expression**

- **Usage**

  Skip compilation for this element and all its children. You can use this for displaying raw mustache tags. Skipping large numbers of nodes with no directives on them can also speed up compilation.

- **Пример:**

  ```html
  <span v-pre>{{ this will not be compiled }}</span>
   ```

### v-cloak

- **Does not expect expression**

- **Использование:**

  This directive will remain on the element until the associated Vue instance finishes compilation. Combined with CSS rules such as `[v-cloak] { display: none }`, this directive can be used to hide un-compiled mustache bindings until the Vue instance is ready.

- **Пример:**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  The `<div>` will not be visible until the compilation is done.

### v-once

- **Does not expect expression**

- **Подробности:**

  Render the element and component **once** only. On subsequent re-renders, the element/component and all its children will be treated as static content and skipped. This can be used to optimize update performance.

  ```html
  <!-- single element -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- the element have children -->
  <div v-once>
    <h1>comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- component -->
  <my-component v-once :comment="msg"></my-component>
  <!-- v-for directive -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

- **См. также:**
  - [Data Binding Syntax - interpolations](/guide/syntax.html#Text)
  - [Компоненты - Cheap Static Компоненты with v-once](/guide/components.html#Cheap-Static-Компоненты-with-v-once)

## Special Attributes

### key

- **Expects:** `string`

  The `key` special attribute is primarily used as a hint for Vue's virtual DOM algorithm to identify VNodes when diffing the new list of nodes against the old list. Without keys, Vue uses an algorithm that minimizes element movement and tries to patch/reuse elements of the same type in-place as much as possible. With keys, it will reorder elements based on the order change of keys, and elements with keys that are no longer present will always be removed/destroyed.

  Children of the same common parent must have **unique keys**. Duplicate keys will cause render errors.

  The most common use case is combined with `v-for`:

  ``` html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  It can also be used to force replacement of an element/component instead of reusing it. This can be useful when you want to:

  - Properly trigger lifecycle hooks of a component
  - Trigger transitions

  For example:

  ``` html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  When `text` changes, the `<span>` will always be replaced instead of patched, so a transition will be triggered.

### ref

- **Expects:** `string`

  `ref` is used to register a reference to an element or a child component. The reference will be registered under the parent component's `$refs` object. If used on a plain DOM element, the reference will be that element; if used on a child component, the reference will be component instance:

  ``` html
  <!-- vm.$refs.p will the DOM node -->
  <p ref="p">hello</p>

  <!-- vm.$refs.child will be the child comp instance -->
  <child-comp ref="child"></child-comp>
  ```

  When used on elements/components with `v-for`, the registered reference will be an Array containing DOM nodes or component instances.

  An important note about the ref registration timing: because the refs themselves are created as a result of the render function, you cannot access them on the initial render - they don't exist yet! `$refs` is also non-reactive, therefore you should not attempt to use it in templates for data-binding.

- **См. также:** [Child Component Refs](/guide/components.html#Child-Component-Refs)

### slot

- **Expects:** `string`

  Used on content inserted into child components to indicate which named slot the content belongs to.

  For detailed usage, see the guide section linked below.

- **См. также:** [Named Slots](/guide/components.html#Named-Slots)

## Built-In Компоненты

### component

- **Props:**
  - `is` - string | ComponentDefinition | ComponentConstructor
  - `inline-template` - boolean

- **Использование:**

  A "meta component" for rendering dynamic components. The actual component to render is determined by the `is` prop:

  ```html
  <!-- a dynamic component controlled by -->
  <!-- the `componentId` property on the vm -->
  <component :is="componentId"></component>

  <!-- can also render registered component or component passed as prop -->
  <component :is="$options.components.child"></component>
  ```

- **См. также:** [Динамические Компоненты](/guide/components.html#Dynamic-Компоненты)

### transition

- **Props:**
  - `name` - string, Used to automatically generate transition CSS class names. e.g. `name: 'fade'` will auto expand to `.fade-enter`, `.fade-enter-active`, etc. Defaults to `"v"`.
  - `appear` - boolean, Whether to apply transition on initial render. Defaults to `false`.
  - `css` - boolean, Whether to apply CSS transition classes. Defaults to `true`. If set to `false`, will only trigger JavaScript hooks registered via component events.
  - `type` - string, Specify the type of transition events to wait for to determine transition end timing. Available values are `"transition"` and `"animation"`. By default, it will automatically detect the type that has a longer duration.
  - `mode` - string, Controls the timing sequence of leaving/entering transitions. Available modes are `"out-in"` and `"in-out"`; defaults to simultaneous.
  - `enter-class` - string
  - `leave-class` - string
  - `enter-active-class` - string
  - `leave-active-class` - string
  - `appear-class` - string
  - `appear-active-class` - string

- **Events:**
  - `before-enter`
  - `enter`
  - `after-enter`
  - `before-leave`
  - `leave`
  - `after-leave`
  - `before-appear`
  - `appear`
  - `after-appear`

- **Использование:**

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

- **См. также:** [Transitions: Entering, Leaving, and Lists](/guide/transitions.html)

### transition-group

- **Props:**
  - `tag` - string, defaults to `span`.
  - `move-class` - overwrite CSS class applied during moving transition.
  - exposes the same props as `<transition>` except `mode`.

- **Events:**
  - exposes the same events as `<transition>`.

- **Использование:**

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

- **См. также:** [Transitions: Entering, Leaving, and Lists](/guide/transitions.html)

### keep-alive

- **Использование:**

  When wrapped around a dynamic component, `<keep-alive>` caches the inactive component instances without destroying them. Similar to `<transition>`, `<keep-alive>` is an abstract component: it doesn't render a DOM element itself, and doesn't show up in the component parent chain.

  When a component is toggled inside `<keep-alive>`, its `activated` and `deactivated` lifecycle hooks will be invoked accordingly.

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

  <!-- used together with <transition> -->
  <transition>
    <keep-alive>
      <component :is="view"></component>
    </keep-alive>
  </transition>
  ```

  <p class="tip">`<keep-alive>` does not work with functional components because they do not have instances to be cached.</p>

- **См. также:** [Динамические Компоненты - keep-alive](/guide/components.html#keep-alive)

### slot

- **Props:**
  - `name` - string, Used for named slot.

- **Использование:**

  `<slot>` serve as content distribution outlets in component templates. `<slot>` itself will be replaced.

  For detailed usage, see the guide section linked below.

- **См. также:** [Content Distribution with Slots](/guide/components.html#Content-Distribution-with-Slots)

## VNode Interface

- Please refer to the [VNode class declaration](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js).

## Server-Side Rendering

- Please refer to the [vue-server-renderer package documentation](https://github.com/vuejs/vue/tree/dev/packages/vue-server-renderer).
