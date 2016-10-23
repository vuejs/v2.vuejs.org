---
title: Publicando em Produção
type: guide
order: 20
---

## Removendo os Avisos

A build minificada independente do Vue já possui os avisos removidos para que seu tamanho seja reduzido, mas quando você está utilizando ferramentas como Webpack ou Browserify, você precisará de algumas configurações adicionais para atingir isso.

### Webpack

Utilize o plugin [DefinePlugin](http://webpack.github.io/docs/list-of-plugins.html#defineplugin) do Webpack's para indicar um ambiente de produção,  assim os blocos com avisos podem ser removidos pelo UglifyJS durante o processo de minificação. Configuração de Exemplo:

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
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
```

### Browserify

- Execute seu comando de bundling com a variável `NODE_ENV` como `"production"`. Isso indicará ao `vueify` para evitar a inclusão de códigos de aviso e relacionados ao ambiente de desenvolvimento.
- Aplique o [envify](https://github.com/hughsk/envify) globalmente para transformar seu bundle. Isso permite que o minifcador remova todos os avisos nos códigos fonte do Vue nos blocos que utilizam a variável condicional. Por exemplo:


``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```

- Para remover os estilos para um arquivo css separado você pode utilizar o plugin extract-css que já está incluso no vueify.

``` bash
NODE_ENV=production browserify -g envify -p [ vueify/plugins/extract-css -o build.css ] -e main.js | uglifyjs -c -m > build.js
```

## Rastreando Erros em Tempo de Execução

Se um erro ocorrer durante a execução da renderização de um componente, ele será enviado para a função `Vue.config.errorHandler` global se ela estiver definida. Pode ser uma boa ideia deixar esse hook definido juntamente com um serviço de rastreio de erros como o [Sentry](https://sentry.io), que possui [uma integração oficial](https://sentry.io/for/vue/) para o Vue.

## Extraindo o CSS

Ao utilizar [Componentes Single-File](./single-file-components.html), as tags `<style>` são injetadas em tempo de execução durante o desenvolvimento. Em produção você pode preferir extrair os estilos de todos os componentes em um arquivo CSS único. Para detalhes de como utilizar isso, consulte a documentação para o [vue-loader](http://vue-loader.vuejs.org/en/configurations/extract-css.html) and [vueify](https://github.com/vuejs/vueify#css-extraction).

O template `webpack` oficial utilizado pelo `vue-cli` já possui esse item configurado para sua conveniência.
