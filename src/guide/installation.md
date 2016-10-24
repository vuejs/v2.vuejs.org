---
title: Установка
type: руководство
order: 1
vue_version: 2.0.3
dev_size: "188.88"
min_size: "62.54"
gz_size: "22.86"
ro_gz_size: "16"
---

### Замечание о Совместимости

Vue **не** поддерживает IE8 и ниже, так как использует возможности ECMAScript 5, которые невозможно сэмулировать в IE8. Тем не менее, поддерживаются все [ECMAScript 5 compliant browsers](http://caniuse.com/#feat=es5).

### Замечания о Релизе

Детальная информация о релизе каждой версии доступна на [GitHub](https://github.com/vuejs/vue/releases).

## Автономная установка

Просто скачайте js-файл и подключине как скрипт. `Vue` будет зарегистрирован как глобальная переменная.

<p class="tip">Не используйте минифицированную версию во время разработки. В противном случае вы потеряете возможность использовать удобные предупреждения о типичных ошибках!</p>

<div id="downloads">
<a class="button" href="/js/vue.js" download>Версия для Разработки</a><span class="light info">С полными предупреждениями и возможностями отладки</span>

<a class="button" href="/js/vue.min.js" download>Версия для Продакшна</a><span class="light info">Без предупреждений, {{gz_size}}kb min+gzip</span>
</div>

### CDN

Рекомендовано: ссылка [unpkg](https://unpkg.com/vue/dist/vue.js) всегда указывает на самую свежую версию Vue, загруженную в npm. Исходный код npm-пакета также доступен по ссылке [unpkg.com/vue/](https://unpkg.com/vue/).

Vue также доступен на [jsdelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.js) и [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js), но эти сервисы синхронизируются с npm с некоторой задержкой, из-за чего новейшая версия может быть не всегда доступна.

## NPM

NPM is the recommended installation method when building large scale applications with Vue. It pairs nicely with module bundlers such as [Webpack](http://webpack.github.io/) or [Browserify](http://browserify.org/). Vue also provides accompanying tools for authoring [Single File Components](single-file-components.html).

Использование NPM рекомендовано при создании крупных приложений на Vue. Прекрасно работает в паре с инструментами сборки, такими как [Webpack](http://webpack.github.io/) и [Browserify](http://browserify.org/). Vue также имеет инструменты для разработки [Single-File Компонентов](single-file-components.html).

``` bash
# latest stable
$ npm install vue
```

### Standalone vs. Runtime-only Версии Сборки

Доступны две версии сборки, standalone и runtime-only.

- Standalone-сборка включает компилятор и поддерживает опцию `template`. **Кроме того, она опирается на API браузера, и потому не может быть использована для рендеринга на стороне сервера.**

- Runtime-only-сборка не включает компилятор шаблонов и не поддерживает опцию `template`. При использовании runtime-only-сборки доступна только опция render, но этого достаточно для работы с single-file компонентами, поскольку шаблоны в них прекомпилируются в `render`-функции на этапе сборки. Runtime-only версия приблизительно на 30% легче, чем standalone, и весит всего {{ro_gz_size}}kb min+gzip.

По умолчанию, NPM-пакет экспортирует сборку **runtime-only**. Для использования standalone-сборки, добавиьте в свою конфигурацию Webpack cследующее:

``` js
resolve: {
  alias: {
    'vue$': 'vue/dist/vue.js'
  }
}
```

Для достижения того же эффекта в Browserify можно использовать [aliasify](https://github.com/benbria/aliasify).

<p class="tip">НЕ импортируйте Vue через `import Vue from 'vue/dist/vue.js'` - так как некоторые инструменты и сторонние библиотеки могут также импортировать Vue, такая запись может результировать в одновременной загрузке runtime и standalone-версий Vue и привести к ошибкам.</p>

### CSP-окружения

Некоторые окружения, такие как Google Chrome Apps, требуют соблюдения Content Security Policy (CSP), запрещающей использование конструкции `new Function()` для исполнения выражений. Standalone-сборка использует эту возможность для компиляции шаблонов, и потому непригодна к использованию в таких окружениях.

С другой стороны, версия runtime-only полностью совместим с CSP. При её использовании с [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) или [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple) шаблоны прекомпилируются в `render`-функции, которые прекрасно работают в CSP-окружениях.

## CLI (Интерпретатор Командной Строки)

Vue.js предоставляет [официальный интерпретатор командной строки (CLI)](https://github.com/vuejs/vue-cli) для быстрого создания каркасов амбициозных одностраничных приложений. Он предоставляет полностью готовые к употреблению шаблоны для организации современной frontend-разработки. Для получения работающей конфигурации, включающей hot-reload, линтинг кода при сохранении и готовые к продакшну сборки требуется всего несколько минут.

``` bash
# install vue-cli
$ npm install --global vue-cli
# create a new project using the "webpack" template
$ vue init webpack my-project
# install dependencies and go!
$ cd my-project
$ npm install
$ npm run dev
```

## Сборка Dev-версии

**Важное замечание**: файлы сборки в папке `/dist` на GitHub обновляются только при релизах. Для использования версии из новейшего исходного кода с GitHub, вам придётся сделать сборку самостоятельно!

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

``` bash
# latest stable
$ bower install vue
```

## Загрузчики AMD-Модулей

Standalone-версия и версии, устанавливаемые через Bower заворачиваются с помощью UMD, и потому могут быть напрямую использованы как AMD-модули.
