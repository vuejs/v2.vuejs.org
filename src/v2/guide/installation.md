---
title: Instalação
type: guide
order: 1
vue_version: 2.3.0
dev_size: "247.31"
min_size: "76.64"
gz_size: "28.03"
ro_gz_size: "19.54"
---

### Sobre a Compatibilidade

Vue **não** suporta IE8 e versões anteriores, porque são usadas funcionalidades ECMAScript 5 que são incompatíveis com o IE8. Entretanto, suporta todos os [navegadores compatíveis com ECMAScript 5](http://caniuse.com/#feat=es5).

### Notas de Lançamento

Notas detalhadas para cada versão lançada estão disponíveis no [GitHub](https://github.com/vuejs/vue/releases).

## Inclusão Direta com `<script>`

Simplesmente faça o _download_ e inclua a _tag_ `<script>` com o caminho correto. `Vue` será registrado como uma variável global.

<p class="tip">Não use a versão minificada (de produção) durante o desenvolvimento. Você irá perder todos os avisos interessantes para os erros mais comuns!</p>

<div id="downloads">
<a class="button" href="/js/vue.js" download>Versão Desenvolvedor</a><span class="light info">Mensagens de erro completas e modo de depuração</span>

<a class="button" href="/js/vue.min.js" download>Versão de Produção</a><span class="light info">Sem mensagens de erro, {{gz_size}}kb min+gzip</span>
</div>

### CDN

**Recomendado:** [unpkg.com/vue/dist/vue.js](https://unpkg.com/vue/dist/vue.js), reflete a última versão assim que ela é disponibilizada no `npm`. Inclusive, pode navegar pelo código-fonte do pacote em [https://unpkg.com/vue/](https://unpkg.com/vue/).

Também disponível no [jsDelivr](//cdn.jsdelivr.net/vue/{{vue_version}}/vue.js) ou no [cdnjs](//cdnjs.cloudflare.com/ajax/libs/vue/{{vue_version}}/vue.js), mas estes dois serviços levam algum tempo para sincronizar com a última versão quando lançada.

## NPM

NPM é o método de instalação recomendado para construção de aplicações em larga escala com o Vue. Ele combina perfeitamente com _module bundlers_, tais como [Webpack](https://webpack.js.org/) ou [Browserify](http://browserify.org/). Vue também oferece ferramentas para a criação de [Componentes Single-File](single-file-components.html).

``` bash
# última versão estável
$ npm install vue
```

## CLI

Vue.js oferece um [CLI oficial](https://github.com/vuejs/vue-cli) para rapidamente construir ambiciosas _Single Page Applications_. Ele possui uma série de funcionalidades e configurações prontas para uso, para o desenvolvimento de aplicações _frontend_ modernas. Leva apenas alguns minutos para estar executando com _hot-reload_, _lint_ ao salvar, e compilações prontas para produção:

``` bash
# instala o vue-cli globalmente
$ npm install --global vue-cli
# cria um novo projeto com o template "webpack"
$ vue init webpack my-project
# instala as dependências e executa!
$ cd my-project
$ npm install
$ npm run dev
```

<p class="tip">Este assunto pressupõe conhecimento prévio em Node.js e ferramentas de _build_ associadas. Se você é novo no Vue ou neste tipo de ferramenta, recomendamos fortemente que passe por todo <a href="./">o guia</a> antes de tentar usar o CLI.</p>

## Explicação das Distribuições

No [diretório `dist/`do pacote NPM](https://unpkg.com/vue@latest/dist/) você encontrará muitas distribuições diferentes do Vue.js. Aqui está uma visão geral das variações entre cada uma delas:

| | UMD | CommonJS | ES Module |
| --- | --- | --- | --- |
| **Completa** | vue.js | vue.common.js | vue.esm.js |
| **Apenas Runtime** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js |
| **Completa (produção)** | vue.min.js | - | - |
| **Apenas Runtime (produção)** | vue.runtime.min.js | - | - |

### Terms

- **Completa**: pacotes completos, os quais contêem tanto o compilador quanto o motor de tempo de execução (em inglês, _runtime_).

- **Compilador**: código responsável por compilar Strings com _templates_ para funções de renderização em JavaScript.

- **Runtime**: código responsável por criar instâncias Vue, renderizar e atualizar o Virtual DOM, etc. Basicamente, tudo menos o compilador.

- **[UMD](https://github.com/umdjs/umd)**: definição de módulos universal, pode ser usada diretamente no navegador através de uma _tag_ `<script>`. O arquivo padrão no Unpkg CDN (no endereço [unpkg.com/vue](https://unpkg.com/vue)) é a distribuição Compilador + Runtime em formato UMD (`vue.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: formato destinado a empacotadores antigos como [browserify](http://browserify.org/) ou [webpack 1](https://webpack.github.io). O arquivo padrão para estes empacotadores (`pkg.main`) é a distribuição apenas Runtime em formato CommonJS (`vue.runtime.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: formato de módulos ECMAScript destinado a empacotadores modernos como [webpack 2](https://webpack.js.org) ou [rollup](http://rollupjs.org/). O arquivo padrão para estes empacotadores (`pkg.module`) é a distribuição apenas Runtime em formato ES Module (`vue.runtime.esm.js`).

### Compilador + Runtime vs. Runtime

Se você precisar compilar _templates_ em tempo real (por exemplo, passando uma String na opção `template`, ou usando elementos existentes no DOM através do HTML como _template_), você vai precisar do compilador e, portanto, do _build_ completo:

``` js
// Isso requer o compilador
new Vue({
  template: '<div>{{ hi }}</div>'
})

// Isso não requer
new Vue({
  render: h => h('div', this.hi)
})
```

Ao utilizar `vue-loader` ou `vueify`, _templates_ dentro de arquivos `*.vue` são pré-compilados para JavaScript durante o processo de construção. Você realmente não precisa do compilador no seu pacote final, desta forma pode utilizar apenas a distribuição Runtime.

Uma vez que as distribuições apenas com o código de Runtime são aproximadamente 30% mais leves que as completas, você deve usá-las sempre que puder. Se você ainda assim desejar utilizar a distribuição completa, precisará configurar um _alias_ no seu empacotador:

#### Webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue.common.js' para webpack 1
    }
  }
}
```

#### Rollup

``` js
const alias = require('rollup-plugin-alias')

rollup({
  // ...
  plugins: [
    alias({
      'vue': 'vue/dist/vue.esm.js'
    })
  ]
})
```

#### Browserify

Adicione no `package.json` de seu projeto:

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

### Desenvolvimento vs. Produção

Modos de desenvolvimento/produção estão fixos no código das distribuições UMD: os arquivos não minificados são para desenvolvimento, os arquivos minificados são para produção. 

Distribuições CommonJS e ES Module são destinadas a empacotadores, desta forma não oferecemos versões minificadas. Você será responsável por minificar todo seu pacote final.

Tais distribuições também preservam checagens à variável `process.env.NODE_ENV`, para determinar o modo de operação que utilizarão. Você deve configurar apropriadamente seu empacotador para alterar essa variável de ambiente corretamente, de forma a controlar o modo em que o Vue irá executar. Alterar `process.env.NODE_ENV` usando Strings literais também permite que minificadores como UglifyJS possam remover completamente blocos de código exclusivos de desenvolvimento, reduzindo o tamanho final do pacote.

#### Webpack

Utilize o [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) do Webpack:

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}
```

#### Rollup

Utilize o [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

``` js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}).then(...)
```

#### Browserify

Aplique uma transformação [envify](https://github.com/hughsk/envify) global em seu pacote.

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

Veja também [Dicas de Publicação para Produção](deployment.html).

### Ambientes CSP

Alguns ambientes, como aplicativos do Google Chrome, forçam Content Security Policy (CSP), a qual proíbe o uso de `new Function()` para avaliar expressões. A distribuição completa depende deste recurso para compilar os _templates_, portanto não é viável nestes ambientes.

Por outro lado, a distribuição apenas Runtime é totalmente compatível. Ao utilizar este tipo de distribuição com [Webpack + vue-loader](https://github.com/vuejs-templates/webpack-simple) ou [Browserify + vueify](https://github.com/vuejs-templates/browserify-simple), seus _templates_ serão pré-compilados em funções `render`, as quais funcionam perfeitamente neste tipo de ambiente.

## Compilação de Desenvolvimento

**Importante**: os arquivos compilados no diretório `/dist` do GitHub são criados apenas nos lançamentos de novas versões. Se quiser usar o Vue a partir do código-fonte mais recente do GitHub (e portanto, possivelmente não estável), você terá que compilá-lo você mesmo!

``` bash
git clone https://github.com/vuejs/vue.git node_modules/vue
cd node_modules/vue
npm install
npm run build
```

## Bower

Apenas distribuições UMD estão disponíveis através do Bower.

``` bash
# última versão estável
$ bower install vue
```

## Módulos AMD

Todas as distribuições UMD podem ser utilizadas diretamente como módulos AMD.
