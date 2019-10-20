---
title: Вступ
type: guide
order: 2
---

## Що таке Vue.js?

Vue (промовляється як в'ю) є **прогресивним фреймворком** для розробки користувацьких інтерфейсів. На відміну від інших монолітних фреймворків, Vue був розроблений з нуля щоб бути постійно пристосовуваним. Основна бібліотека сфокусована лише на шарі відображення, що надає змогу легкої інтеграції з іншими бібліотеками та існуючими проектами. З іншої сторони, Vue також готовий бути основою як простих SPA, так і складних додатків в комбінації із [сучасними інструментами](single-file-components.html) та [підтримуючими бібліотеками](https://github.com/vuejs/awesome-vue#components--libraries).

Якщо Ви бажаєте дізнатися більше про Vue перед поглибленням усередину, ми <a id="modal-player" href="#">створили відео</a>, яке розповідає про основні принципи на прикладі простенького проекту.

Якщо ж Ви frontend-розробник з досвідом та бажаєте дізнатися про Vue в порівнянні з іншими бібліотеками/фреймворками, перегляньте [Порівняння з іншими фреймворками](comparison.html).

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="sponsored noopener" title="Безкоштовний курс по Vue.js">Переглянути безкоштовний відео курс на Vue Mastery</a></div>

## Починаємо

<a class="button" href="installation.html">Встановлення</a>

<p class="tip">Офіційний посібник передбачає середній рівень знант HTML, CSS та JavaScript. Якщо Ви зовсім нещодавно у frontend-розробці, це може бути не найкращою ідеєю для вивчення фреймворку в якості Вашого першого кроку — опануйте основи та повертайтеся до нас! Попередній досвід з іншими фреймворками є корисним, але зовсім не обов'язковий.</p>

Найлегший спосіб спробувати Vue — переглянути [приклад "Привіт Світ" на JSFiddle](https://jsfiddle.net/matrunchyk/rtpLkqyf/4/). Відкрийте цей приклад в новій вкладці та слідкуйте далі за тим, як ми будемо давати деякі приклади. Або ж, Ви можете <a href="https://gist.githubusercontent.com/matrunchyk/cbc973f1db9e73e036823da9452eeb9d/raw/785b612ae7879a2492553188b6aa01d9b11a77b8/My%2520first%2520Vue%2520app" target="_blank" download="index.html" rel="noopener noreferrer">створіть файл <code>index.html</code></a> та додайте Vue наступним чином:

``` html
<!-- версія для розробників, включає в себе корисні повідомлення про помилки в консолі -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

або:

``` html
<!-- продакшн-версія, оптимізована в швидкості та розмірі -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

[Сторінка по встановленню](installation.html) містить більше налаштувань по встановленню Vue. Примітка: Ми **не рекомендуємо** початківцям використовувати `vue-cli`, особливо, якщо Ви ще не познайомилися з інструментами компіляції на Node.js.

Якщо Ви хотіли б більшої взаємодії, радимо переглянути [навчальний посібник на Scrimba](https://scrimba.com/playlist/pXKqta), в якому Ви матимете можливість спостерігати екран та пробувати писати код власноруч, ставивши відео на паузу в будь-який час.

## Декларативне промальовування

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cQ3QVcr" target="_blank" rel="noopener noreferrer">Переглянути урок на Scrimba</a></div>

Основою Vue.js є система, яка дозволяє [декларативно](https://uk.wikipedia.org/wiki/%D0%94%D0%B5%D0%BA%D0%BB%D0%B0%D1%80%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D0%B5_%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F) промальовувати дані в DOM, використовуючи зрозумілий синтаксис шаблону: 

``` html
<div id="app">
  {{ message }}
</div>
```
``` js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Привіт, Vue!'
  }
})
```
{% raw %}
<div id="app" class="demo">
  {{ message }}
</div>
<script>
var app = new Vue({
  el: '#app',
  data: {
    message: 'Привіт, Vue!'
  }
});
</script>
{% endraw %}

Ми щойно створили наш перший додаток на Vue! Як бачите, процес є досить схожим до роботи з [шаблонами рядків](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), але з Vue додатково ще вионується чимало роботи під капотом. Дані та DOM тепер зв'язані, та все тепер є **реактивним**. Як це перевірити? Відкрийте консоль браузера (на цій сторінці, поки що) та запишіть в `app.message` якесь інше значення. Ви маєте побачити, що відбулося автотичне промальовування відповідно до того, що Ви ввели.      

Крім текстової інтерполяції, ми також можемо зв'язати атрибути елементу наступним чином:

``` html
<div id="app-2">
  <span v-bind:title="message">
    Наведіть вказівник мишки поверх мене на кілька секунд,
    щоб побачити динамічно зв'язаний title!
  </span>
</div>
```
``` js
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Ви завантажили цю сторінку о ' + new Date().toLocaleString()
  }
})
```
{% raw %}
<div id="app-2" class="demo">
  <span v-bind:title="message">
    Наведіть вказівник мишки поверх мене на кілька секунд, щоб побачити динамічно зв'язаний title!
  </span>
</div>
<script>
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'Ви завантажили цю сторінку о ' + new Date().toLocaleString()
  }
});
</script>
{% endraw %}

Тут ми спостерігаємо щось нове. Атрибут `v-bind`, який Ви бачите, називається **директивою**. Директиви мають префікс `v-`, щоб вказати, що вони є спеціальними атрибутими, яке надає нам Vue, і що, як Ви вже певно здогадались, вони застосовують спеціальну реактивну поведінку до промальовуваного DOM. Тут ми буквально кажемо "оновлюй атрибут `title` елемента, як тільки зміниться властивість `message` на екземплярі Vue."

Якщо Ви знову відкриєте JavaScript консоль та введете `app2.message = 'це так легко'`, ви знову побачите, що зв'язаний HTML - в цьому випадку це атрибут `title` — змінився.

## Умови та цикли

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQe4SJ" target="_blank" rel="noopener noreferrer">Переглянути урок на Scrimba</a></div>

Так ж легко перемикати присутність елемента:

``` html
<div id="app-3">
  <span v-if="seen">Тепер мене видно</span>
</div>
```

``` js
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
```

{% raw %}
<div id="app-3" class="demo">
  <span v-if="seen">Тепер мене видно</span>
</div>
<script>
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
});
</script>
{% endraw %}

Не зупиняйтеся та введіть `app3.seen = false` в консолі. Ви помітите, що повідомлення зникло.

Це приклад ілюструє, що ми можемо зв'язувати дані не тільки до текстових атрибутів, але також до самої **структури** DOM. Більше того, Vue надає нам потужну систему ефектів переходів, які автоматично можуть задіювати [переходи](transitions.html), коли елементи додаються, оновлюються чи видаляються Vue.

Існує чимало інших директив, кожна з яких має свою власну функціональність. Для прикладу, директива `v-for` може бути використана для відображення списку елементів, використовуючи дані з масиву: 

``` html
<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```
``` js
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Вивчити JavaScript' },
      { text: 'Вивчити Vue' },
      { text: 'Створити щось круте' }
    ]
  }
})
```
{% raw %}
<div id="app-4" class="demo">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
<script>
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Вивчити JavaScript' },
      { text: 'Вивчити Vue' },
      { text: 'Створити щось круте' }
    ]
  }
});
</script>
{% endraw %}

В консолі, змініть масив, ввівши `app4.todos.push({ text: 'Посадити дерево' })`. Ви маєте побачити, що нову ціль додано до списку цілей.

## Обробка користувацького введення

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/czPNaUr" target="_blank" rel="noopener noreferrer">Переглянути урок на Scrimba</a></div>

Щоб користувачі мали змогу взаємодіяти з додатком, ми можемо використовувати директиву `v-on` для закріплення обробників подій на нашому екземплярі Vue.  

``` html
<div id="app-5">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Реверсувати напис</button>
</div>
```
``` js
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Привіт, Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
```
{% raw %}
<div id="app-5" class="demo">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Реверсувати напис</button>
</div>
<script>
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Привіт, Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('');
    }
  }
});
</script>
{% endraw %}

Зауважте, що в цьому методі ми оновлюємо стан нашого додатку, не зачіпаючи DOM - всі маніпуляції з ним виконуються через Vue, та при написанні коду Ви зосереджені лише на логіку в основі. 

Vue також надає нам директиву `v-model`, яка задіює, так звану, двосторонню зв'язку з елементом введення форми та станом додатку дуже просто:

``` html
<div id="app-6">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
```
``` js
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Привіт, Vue!'
  }
})
```
{% raw %}
<div id="app-6" class="demo">
  <p>{{ message }}</p>
  <input v-model="message">
</div>
<script>
var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Привіт, Vue!'
  }
});
</script>
{% endraw %}

## Робота з компонентами

<div class="scrimba"><a href="https://scrimba.com/p/pXKqta/cEQVkA3" target="_blank" rel="noopener noreferrer">Переглянути урок на Scrimba</a></div>

Система компонентів є іншим важливим концептом в Vue — це є абстракція, яка дозволяє нам будувати високомасштабовані додатки, організовані з маленьких, повноцінних та часто повторно використовуваних компонент. Ви лише уявіть — майже кожен тип інтерфейсу додатку може бути умовно поділений на певне дерево компонентів:

![Дерево компонентів](/images/components.png)

У Vue, компонентом є екземпляр Vue з заданими певними налаштуваннями. Реєстрація компоненти у Vue є досить простою:

``` js
// Оголошуємо нову компоненту з назвою todo-item
Vue.component('todo-item', {
  template: '<li>Якась задача</li>'
})

var app = new Vue(...)
```

Тепер Ви можете використати її в шаблоні іншої компоненти: 

``` html
<ol>
  <!-- Створити екземпляр компоненти todo-item -->
  <todo-item></todo-item>
</ol>
```

Але це б промалювало той ж самий текст для кожної задачі, що не є дуже цікавим. Було б супер, якби ми могли передавати дані з батьківської компоненти в дочірню. Давайте змінимо оголошення компоненти так, щоб вона приймала [властивість](components.html#Props):

``` js
Vue.component('todo-item', {
  // Тепер компонента todo-item приймає властивість,
  // яка є спеціальним атрибутом.
  // Давайте назвемо нашу властивість todo.
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
```

Ось тепер ми можемо передавати задачу в кожну таку компоненту, використовуючи `v-bind`.

``` html
<div id="app-7">
  <ol>
    <!--
      Тут ми передаємо кожній компоненті todo-item об'єкт,
      в якій знаходиться задача, щоб зробити її вміст динамічним.
      Ми повинні також вказувати для кожної компоненти
      спеціальний атрибут "key", про який ми поговоримо пізніше.
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id"
    ></todo-item>
  </ol>
</div>
```
``` js
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})

var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: 'Овочі' },
      { id: 1, text: 'Сир' },
      { id: 2, text: 'Щось інше, придатне для їжі' }
    ]
  }
})
```
{% raw %}
<div id="app-7" class="demo">
  <ol>
    <todo-item v-for="item in groceryList" v-bind:todo="item" :key="item.id"></todo-item>
  </ol>
</div>
<script>
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      { id: 0, text: 'Овочі' },
      { id: 1, text: 'Сир' },
      { id: 2, text: 'Щось інше, придатне для їжі' }
    ]
  }
});
</script>
{% endraw %}

Звичайно, це надуманий приклад, але головне те, що ми змогли розбити наш додаток на дрібніші частинки, дочірня компонента є досить незалежною від батьківської через інтерфейс властивостей. Тепер ми можемо навіть вдосконалити нашу компоненту `<todo-item>`, додавши більше складої логіки та змінивши шаблон без жодного впливу на батьківську.

У великих додатках, розділення на компоненти є обов'язковим — це покращує їх обслуговування. В цьому посібнику ми ще обов'язково розглянемо компоненти більш глибше [пізніше](components.html), але давайте поглянемо ще на один (теж уявний) приклад того, як ще може виглядати додаток з іншими компонентами:

``` html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### Відношення до специфікації Веб Компоненти

Ви могли помітити, що компоненти Vue дуже схожі до **Веб Компонент**, які є частиною [специфікації Веб Компонент](https://www.w3.org/wiki/WebComponents/). Це все тому, що синтаксис компонент Vue був навмисне дещо пов'язаний з даною специфікацією. Для прикладу, компоненти Vue слідують за [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) та спеціальним атрибутом `is`. Разом з тим, все ж є кілька відмінностей:

1. Роботу над специфікацією було закінчено, але вона не була задіяна нативно в кожному браузері. Safari 10.1+, Chrome 54+ та Firefox 63+ підтримують веб-компоненти нативно. В порівнянні, компоненти Vue не потребують жодних поліфілів та працюють однаково в усіх підтримуваних браузерах (IE9 та вище). Коли потрібно, компоненти Vue також можуть бути обгорнуті всередині нативної користувацької веб-компоненти.

2. Компоненти Vue надають важливі можливості, недоступні в звичайних користувацьких елементах, відмінний наскрізьний обмін даними між компонентами, користувацькі події та взаємодію з інструментами компіляції.

Хоч Vue і не використовує користувацькі веб-компоненти внутрішньо, але у Vue є [прекрасна з ними сумісність](https://custom-elements-everywhere.com/#vue), коли це стосується розповсюдження Vue-компонентів як користувацьких веб-компонентів. Vue CLI також підтримує компіляцію компонентів Vue, які автоматично себе реєструють як нативні користувацькі веб-компоненти.

## Готові до більшого?

Ми коротко познайомили Вас з кількома основними можливостями Vue.js — все інше в цьому посібнику розглядає кожну з них та багато інших прогресивних можливостей в деталях, не пропустіть нічого!   

<div id="video-modal" class="modal"><div class="video-space" style="padding: 56.25% 0 0 0; position: relative;"><iframe src="https://player.vimeo.com/video/247494684?dnt=1" style="height: 100%; left: 0; position: absolute; top: 0; width: 100%; margin: 0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script><p class="modal-text">Автор відео <a href="https://www.vuemastery.com" target="_blank" rel="sponsored noopener" title="Курси по Vue.js на Vue Mastery">Vue Mastery</a>. Перегляньте безкоштовний курс <a href="https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/" target="_blank" rel="sponsored noopener" title="Курс по Vue.js на Vue Mastery">Введення до Vue</a> на Vue Mastery.</div>
