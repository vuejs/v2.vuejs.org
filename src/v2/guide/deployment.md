---
title: Publicando em Produção
type: guide
order: 401
---

## Habilitando o Modo de Produção

Em desenvolvimento, Vue proporciona uma grande quantidade de avisos para lhe ajudar a escapar das enrascadas mais comuns. Entretanto, estas Strings de aviso se torna desnecessárias em produção e sobrecarregam o tamanho de sua aplicação. Além disso, algumas checagens têm um pequeno custo de desempenho durante a execução que pode ser evitado ao habilitar o modo de produção.

### Sem Empacotadores

Se você está utilizando a compilação completa, ou seja, incluindo diretamente o Vue através de uma _tag_ `<script>` sem uma ferramenta de _build_, tenha certeza que utilizará a versão minificada (`vue.min.js`) para produção. Ambas as versões podem ser encontradas no [guia de Instalação](installation.html#Inclusao-Direta-com-lt-script-gt).

### Com Empacotadores

Utilizando uma ferramenta de _build_ como Webpack ou Browserify, o modo de produção será determinado pelo valor da variável `process.env.NODE_ENV` internamente no código-fonte do Vue, sendo o modo de desenvolvimento seu valor padrão. Ambos os empacotadores oferecem maneiras de sobrescrever esta variável para habilitar o modo de produção, sendo que as mensagens de aviso serão removidas pelos minificadores durante o empacotamento. Todos os modelos de projeto `vue-cli` já vêm com isto pré-configurado para você, mas pode ser interessante saber como funciona:

#### Webpack

Utilize o [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) do Webpack para indicar o ambiente de produção, de forma que blocos de aviso possam ser imediatamente removidos pelo UglifyJS durante a minificação. Exemplo:

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ]
}
```

#### Browserify

- Execute o comando de _build_ com a variável `NODE_ENV` definida para `"production"`. Isto avisará o `vueify` para evitar incluir _hot-reload_ e códigos de desenvolvimento.

- Aplique uma transformação [envify](https://github.com/hughsk/envify) global em seu pacote. Isto permite que o minificador remova todos os avisos incorporados ao código-fonte do Vue. Exemplo:

  ``` bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
  ```

#### Rollup

O procedimento é parecido com o do Webpack. Configure utilizando o [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

``` js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': '"production"'
    })
  ]
}).then(...)
```

## Pré-Compilando Templates

Quando estiver usando _templates_ **in-DOM** ou _template strings_ **in-JavaScript**, a transformação para funções `render` ocorre em tempo real. Isto é geralmente rápido o bastante na maioria dos casos, mas é melhor evitar se a aplicação for muito sensível a variações de desempenho.

A forma mais simples de pré-compilar _templates_ é utilizar [Componentes Single-File](single-file-components.html) - os processos de _build_ associados automaticamente realizam a pré-compilação para você, desta forma o código final já contém as funções `render` ao invés de _template strings_ puras.

Se você estiver utilizando Webpack e preferir separar seu JavaScript dos arquivos de _template_, você pode utilizar [vue-template-loader](https://github.com/ktsn/vue-template-loader), o qual transforma os arquivos de _template_ independentes em funções `render` durante o processo de _build_.

## Extraindo CSS de Componentes

Quando estiver usando Componentes Single-File, o CSS dentro deles é dinamicamente injetado na forma de _ tags_ `<style>` pelo JavaScript. Isto tem um pequeno custo durante a execução, e se você estiver utilizando _server-side rendering_, ocorrerá um efeito de "_flash_ de conteúdo não estilizado". Extrair o CSS de todos os componentes no mesmo arquivo pode evitar estes problemas, além de resultar em uma melhor minificação do CSS e melhor cache.

Acesse a documentação da respectiva ferramenta de _build_ para ver como é feito:

- [Webpack + vue-loader](https://vue-loader.vuejs.org/en/configurations/extract-css.html) (o modelo webpack do `vue-cli` já tem isso pré-configurado)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://vuejs.github.io/rollup-plugin-vue/#/en/2.3/?id=custom-handler)

## Rastreando Erros de Renderização

Se um erro ocorrer durante a execução da renderização de um componente, este será passado para a função global `Vue.config.errorHandler`, se ela estiver definida. Pode ser uma boa deixar este gancho definido juntamente com um serviço de rastreio de erros como o [Sentry](https://sentry.io), o qual possui [uma integração oficial](https://sentry.io/for/vue/) para o Vue.
