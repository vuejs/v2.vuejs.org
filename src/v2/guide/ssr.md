---
title: Renderização Server-Side
type: guide
order: 24
---

## Você Precisa de SSR?

Antes de mergulhar no SSR (sigla para o inglês *Server-Side Rendering*), é interessante explorar o que isso efetivamente faz por você e quando você pode precisar dele.

### SEO

Google e Bing podem indexar aplicações JavaScript síncronas sem problemas. _Síncrono_ é a palavra chave aqui. Se sua aplicação inicia com um ícone de carregamento e então busca o conteúdo por Ajax, o robô de indexação não vai esperar a requisição terminar.

Isso significa que, se você tem conteúdo carregado dinamicamente em páginas onde SEO é importante, SSR pode ser necessário.

### Clientes com Internet Lenta

Usuários talvez visitem seu site a partir de uma área remota com Internet lenta - ou simplesmente com uma conexão móvel ruim. Nestes casos, você irá querer minimizar o número e o tamanho das requisições necessárias para os usuários verem o conteúdo básico.

<<<<<<< HEAD:src/guide/ssr.md
É possível usar [code splitting do Webpack](https://webpack.github.io/docs/code-splitting.html) para evitar forçar os usuários a baixarem sua aplicação inteira simplesmente para visualizar uma página individual, mas isto ainda não seria tão performático quando baixar um simples arquivo HTML pré-renderizado.
=======
You can use [Webpack's code splitting](https://webpack.js.org/guides/code-splitting-require/) to avoid forcing users to download your entire application to view a single page, but it still won't be as performant as downloading a single, pre-rendered HTML file.
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/ssr.md

### Clientes com Motor JavaScript Antigo (Ou Nulo)

Para algumas regiões demográficas e áreas do mundo, utilizar um computador de 1998 para acessar a Internet pode ser a única opção. Uma vez que o Vue só é suportado a partir do IE9, você pode querer entregar conteúdo básico para aqueles usuários presos a navegadores antigos - ou para *hackers hipsters* usando [Lynx](http://lynx.browser.org/) no terminal.

### SSR vs Pré-renderização

Se você está investigando SSR para melhorar o SEO de algumas páginas de *marketing* (por exemplo, `/`, `/sobre`, `/contato`, etc), então você provavelmente vai querer utilizar pré-renderização no seu lugar. Ao invés de usar um servidor Web para compilar HTML em tempo real, a pré-renderização simplesmente gera arquivos HTML estáticos para rotas específicas durante a compilação da aplicação. A vantagem é que a configuração de pré-renderização é muito mais simples e permite manter seu *frontend* como um site totalmente estático.

Se você estiver usando Webpack, é possível obter isto facilmente com o [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin). Ele tem sido extensivamente testado em aplicações Vue - e, de fato, o criador inclusive é membro da equipe principal do Vue.

## Olá Mundo

Se chegou até aqui, está pronto para ver SSR em ação. Soa complexo, mas um script Node simples demonstrando a funcionalidade requer apenas 3 passos:

``` js
// Passo 1: Criar uma instância Vue
var Vue = require('vue')
var app = new Vue({
  render: function (h) {
    return h('p', 'Olá Mundo')
  }
})

// Passo 2: Criar um renderizador
var renderer = require('vue-server-renderer').createRenderer()

// Passo 3: Renderizar a instância Vue como HTML
renderer.renderToString(app, function (error, html) {
  if (error) throw error
  console.log(html)
  // => <p server-rendered="true">Olá Mundo</p>
})
```

Não é tão assustador, certo? É claro que este exemplo é muito mais simples do que a maioria das aplicações. Ainda não tivemos que nos preocupar com:

- Um Servidor Web
- Streaming de Resposta
- Cache de Componentes
- Um Processo de Build
- Roteamento
- Hidratação de Estado Vuex

No restante deste guia, vamos falar sobre como lidar com algumas destas características. Depois de entender o básico, lhe encaminharemos para uma documentação mais detalhada e para exemplos avançados que irão ajudá-lo a lidar com casos extremos.

## SSR Simples com Servidor Web Express

É meio forçado chamar algo de "renderização do lado do servidor" quando na verdade não temos um servidor Web, então vamos consertar isso. Construiremos um aplicativo SSR muito simples, usando apenas ES5 e sem qualquer etapa de compilação ou plugins Vue.

Vamos começar apenas dizendo ao usuário por quantos segundos ele esteve na página:

``` js
new Vue({
  template: '<div>Você esteve aqui por {{ counter }}s.</div>',
  data: {
    counter: 0
  },
  created: function () {
    var vm = this
    setInterval(function () {
      vm.counter += 1
    }, 1000)
  }
})
```

Para adaptá-lo para SSR, existem algumas modificações que precisaremos fazer, para que funcione tanto no navegador quanto no servidor Node:

- Quando estiver no navegador, coloque uma instância do aplicativo no contexto global (ou seja, `window`), para que possamos montá-lo no documento.
- Quando estiver no Node, exporte uma função *factory* para que possamos criar uma nova instância do aplicativo a cada requisição.

Atender estes passos requer um pouco de código estrutural:

``` js
// assets/app.js
(function () { 'use strict'
  var createApp = function () {
    // ------------------------------
    // INÍCIO DO CÓDIGO NORMAL DO APP
    // ------------------------------

    // A instância Vue principal deve ser retornada e possuir
    // um nó principal com o id "app", para que a versão client-side
    // possa tomar conta dele assim que carregar.
    return new Vue({
      template: '<div id="app">Você esteve aqui por {{ counter }}s.</div>',
      data: {
        counter: 0
      },
      created: function () {
        var vm = this
        setInterval(function () {
          vm.counter += 1
        }, 1000)
      }
    })

    // -------------------------------
    // TÉRMINO DO CÓDIGO NORMAL DO APP
    // -------------------------------
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = createApp
  } else {
    this.app = createApp()
  }
}).call(this)
```

Agora que temos o código de nossa aplicação, vamos criar um arquivo `index.html`:

``` html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Meu App Vue</title>
  <script src="/assets/vue.js"></script>
</head>
<body>
  <div id="app"></div>
  <script src="/assets/app.js"></script>
  <script>app.$mount('#app')</script>
</body>
</html>
```

Se o diretório `assets` realmente contém o arquivo `app.js` criado anteriormente, assim como um arquivo `vue.js` com o Vue, devemos ter uma aplicação *single-page* funcionando!

Então, para a renderização pelo servidor funcionar, só há mais um passo - o servidor Web:

``` js
// server.js
'use strict'

var fs = require('fs')
var path = require('path')

// Define um objeto Vue global para o app.js server-side
global.Vue = require('vue')

// Obtém o layout HTML básico
var layout = fs.readFileSync('./index.html', 'utf8')

// Cria um renderizador
var renderer = require('vue-server-renderer').createRenderer()

// Cria um servidor Express
var express = require('express')
var server = express()

// Serve estaticamente os arquivos do diretório assets
server.use('/assets', express.static(
  path.resolve(__dirname, 'assets')
))

// Intercepta todas as requisições GET
server.get('*', function (request, response) {
  // Renderiza nosso aplicativo Vue como uma String
  renderer.renderToString(
    // Cria uma instância do app para renderizar
    require('./assets/app')(),
    // Manipula o resultado renderizado
    function (error, html) {
      // Se ocorreu alguma erro enquanto processava...
      if (error) {
        // Registra o erro no console
        console.error(error)
        // Informa o cliente que algo errado aconteceu
        return response
          .status(500)
          .send('Server Error')
      }
      // Senão, envia o layout renderizado injetado no HTML carregado
      response.send(layout.replace('<div id="app"></div>', html))
    }
  )
})

// Levanta o servidor Express criado, escutando na porta 5000
server.listen(5000, function (error) {
  if (error) throw error
  console.log('Servidor executando em localhost:5000')
})
```

É isso! Aqui está [a aplicação completa](https://github.com/erickpetru/vue-ssr-demo-simple), caso queira clonar e experimentar mais. Assim que estiver com ela executando localmente, é possível confirmar que a renderização pelo lado do servidor está realmente funcionando ao clicar com o botão direito na página e selecionar `Exibir código fonte da página` (ou algo similar). Você deve ver isso no `body`:

``` html
<div id="app" server-rendered="true">Você esteve aqui por 0s&period;</div>
```

Ao invés de simplesmente:

``` html
<div id="app"></div>
```

## Streaming de Resposta

Vue também suporta renderizar em um __stream__, ideal em servidores que suportam *streaming*. Isto permite que o HTML seja escrito na resposta _enquanto é gerado_, ao invés de uma vez só no final. O resultado são requisições servidas mais rapidamente, sem nenhuma desvantagem.

Para adaptar nosso aplicativo da seção anterior para *streaming*, simplesmente trocamos o conteúdo do bloco `server.get('*', ...)` pelo seguinte:

``` js
// Quebra o layout em duas seções de HTML
var layoutSections = layout.split('<div id="app"></div>')
var preAppHTML = layoutSections[0]
var postAppHTML = layoutSections[1]

// Intercepta todas as requisições GET
server.get('*', function (request, response) {
  // Renderiza nosso aplicativo Vue como um Stream
  var stream = renderer.renderToStream(require('./assets/app')())

  // Escreve o HTML antes do app na resposta
  response.write(preAppHTML)

  // Sempre que novos pedaços são renderizados...
  stream.on('data', function (chunk) {
    // Escreve o novo pedaço na resposta
    response.write(chunk)
  })

  // Quando todos os pedaços estiverem renderizados...
  stream.on('end', function () {
    // Escreve o HTML após o app na resposta
    response.end(postAppHTML)
  })

  // Se ocorrer algum erro enquanto está processando...
  stream.on('error', function (error) {
    // Registra o erro no console
    console.error(error)
    // Informa o cliente que algo errado aconteceu
    return response
      .status(500)
      .send('Server Error')
  })
})
```

Como você pode ver, não é muito mais complicado que a seção anterior, mesmo que o conceito de *streams* seja novo para você. Nós apenas:

1. Configuramos o *stream*
2. Escrevemos o HTML antes do app Vue na resposta
3. Escrevemos o HTML do app Vue na resposta quando ele se torna disponível
4. Escrevemos o HTML após o app Vue na resposta e encerramos ela
5. Interceptamos quaisquer erros

## Cache de Componentes

SSR no Vue é bem rápido por padrão, mas você pode melhorar ainda mais o desempenho ao colocar em cache os componentes renderizados. Isto deve ser considerado um recurso avançado, já que fazer cache dos componentes errados (ou os certos, mas com as chaves erradas) poderia acabar por estragar a renderização de seu aplicativo. Especificamente:

<p class="tip">Você não deveria fazer  cache de um componente cujos componentes filhos dependem de estado global (por exemplo, do vuex). Se fizer, estes componentes filhos (e de fato, toda a árvore de componentes) também serão colocados em cache. Seja especialmente cauteloso com componentes que aceitam slots/filhos.</p>

### Configuração

Com este aviso dado, aqui vai como colocamos componentes em cache.

Primeiramente, você precisará fornecer ao renderizador um [objeto de cache](https://www.npmjs.com/package/vue-server-renderer#cache). Aqui está um exemplo simples com [lru-cache](https://github.com/isaacs/node-lru-cache):

``` js
var createRenderer = require('vue-server-renderer').createRenderer
var lru = require('lru-cache')

var renderer = createRenderer({
  cache: lru(1000)
})
```

Isto irá colocar em cache até 1000 renderizações únicas. Para outras configurações que se alinham melhor a necessidades de uso de memória, veja as [opções do lru-cache](https://github.com/isaacs/node-lru-cache#options).

Então, para os componentes que quer fazer cache, você deve oferecer a eles:

- um valor exclusivo para o atributo `name`
- uma função `serverCacheKey`, retornando uma chave única para o escopo do componente

Por exemplo:

``` js
Vue.component({
  name: 'list-item',
  template: '<li>{{ item.name }}</li>',
  props: ['item'],
  serverCacheKey: function (props) {
    return props.item.type + '::' + props.item.id
  }
})
```

### Componentes Ideais para Cache

Qualquer componente "puro" pode ficar em cache com segurança - isto é, qualquer componente em que é garantido sempre gerar o mesmo HTML a partir das mesmas propriedades. Exemplos comuns incluem:

- Componentes estáticos (sempre geram o mesmo HTML, então a função `serverCacheKey` pode simplesmente retornar `true`)
- Componentes de itens de listas (quando fizerem parte de listas grandes, fazer cache deles pode melhorar significativamente o desempenho)
- Componentes genéricos de UI (como botões, *alerts*, etc - ao menos aqueles que aceitam valores através de props e não slots/filhos)

## Processo de Build, Roteamento e Hidratação de Estado Vuex

Neste momento, você deve ter entendido os conceitos fundamentais por trás da renderização pelo lado do servidor. Entretanto, assim que introduzir um processo de *build*, roteamento e/ou gerenciamento de estado com Vuex, cada qual trará suas próprias considerações.

Para se tornar verdadeiramente um mestre em renderização server-side para aplicações complexas, recomendamos que se aprofunde nos seguintes materiais:

<<<<<<< HEAD:src/guide/ssr.md
- [documentação do vue-server-renderer](https://www.npmjs.com/package/vue-server-renderer#api): mais detalhes nos tópicos cobertos aqui, assim como documentação de tópicos mais avançados, como [prevenir contaminação entre requisições](https://www.npmjs.com/package/vue-server-renderer#why-use-bundlerenderer) e [adicionar build separado para o servidor](https://www.npmjs.com/package/vue-server-renderer#creating-the-server-bundle)
- [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0): o exemplo definitivo de integração de todas as bibliotecas principais do Vue e seus conceitos em uma única aplicação
=======
- [vue-server-renderer docs](https://www.npmjs.com/package/vue-server-renderer#api): more details on topics covered here, as well as documentation of more advanced topics, such as [preventing cross-request contamination](https://www.npmjs.com/package/vue-server-renderer#why-use-bundlerenderer) and [adding a separate server build](https://www.npmjs.com/package/vue-server-renderer#creating-the-server-bundle)
- [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0): the definitive example of integrating all major Vue libraries and concepts in a single application

## Nuxt.js

Properly configuring all the discussed aspects of a production-ready server-rendered app can be a daunting task. Luckily, there is an excellent community project that aims to make all of this easier: [Nuxt.js](https://nuxtjs.org/). Nuxt.js is a higher-level framework built on top of the Vue ecosystem which provides an extremely streamlined development experience for writing universal Vue applications. Better yet, you can even use it as a static site generator (with pages authored as single-file Vue components)! We highly recommend giving it a try.
>>>>>>> refs/remotes/vuejs/master:src/v2/guide/ssr.md
