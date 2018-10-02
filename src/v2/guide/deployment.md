---
title: Déploiement en production
type: guide
order: 401
---

## Passer en mode production

Pendant le développement, Vue fournit beaucoup d'avertissements pour vous aider avec les erreurs usuelles et les pièges. Ces messages d'avertissement deviennent cependant inutiles en production et gonflent la taille de votre application en production. De plus, certains de ces avertissements ont un léger cout d'exécution qui peut être évité en mode production.

### Sans outils de build

Si vous utilisez la version complète, c.-à-d. en incluant directement Vue via une balise script sans outil de build, assurez-vous d'utiliser la version minifiée (`vue.min.js`) pour la production. Ces deux versions peuvent être trouvées dans le [guide d'installation](installation.html#Inclusion-directe-lt-script-gt).

### Avec outils de build

Quand vous utilisez un outil de build comme webpack ou Browserify, le mode production sera déterminé par la valeur de `process.env.NODE_ENV` utilisée dans le code source de Vue, et sera en mode développement par défaut. Ces deux outils fournissent des moyens de surcharger cette variable pour activer le mode production de Vue, et les avertissements seront retirés par le minificateur pendant le build. Tous les templates `vue-cli` sont préconfigurés pour vous, mais il peut être utile de savoir comment cela fonctionne :

#### webpack

Dans webpack 4+, vous pouvez utiliser l'option `mode` :

``` js
module.exports = {
  mode: 'production'
}
```

Mais dans webpack 3 et précédent, vous devez utiliser la fonction [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) :

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}
```
#### Browserify

- Lancer votre commande d'empaquetage avec la variable d'environnement `NODE_ENV` assignée à `"production"`. Cela indique à `vueify` d'éviter d'inclure le code utilisé pour le rechargement à chaud ou lié au développement.

- Appliquer une transformation [envify](https://github.com/hughsk/envify) globale à votre paquetage (« bundle »). Cela permet au minificateur de retirer tous les avertissements dans le code source de Vue qui sont entourés d'une instruction conditionnelle sur la variable `env`. Par exemple :

  ``` bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
  ```

- Ou, utiliser [envify](https://github.com/hughsk/envify) avec gulp :

  ``` js
  // Utiliser le module personnalisé envify pour spécifier les variables d'environnement
  var envify = require('envify/custom')

  browserify(browserifyOptions)
    .transform(vueify)
    .transform(
      // Requis sur les fichiers dans `node_modules`
      { global: true },
      envify({ NODE_ENV: 'production' })
    )
    .bundle()
  ```

- Ou, utilisez [envify](https://github.com/hughsk/envify) avec Grunt et [grunt-browserify](https://github.com/jmreidy/grunt-browserify) :

  ``` js
  // Utiliser le module personnalisé envify pour spécifier les variables d'environnement
  var envify = require('envify/custom')

  browserify: {
    dist: {
      options: {
        // Fonction à dévier de l'ordre par défaut de `grunt-browserify`
        configure: b => b
          .transform('vueify')
          .transform(
            // Demande un ordre pour exécuter les fichiers `node_modules`
            { global: true },
            envify({ NODE_ENV: 'production' })
          )
          .bundle()
      }
    }
  }
  ```

#### Rollup

Utiliser le plugin [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

``` js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
}).then(...)
```

## Templates précompilés

Quand vous utilisez des templates dans le DOM ou dans des chaînes de caractères en JavaScript, une compilation des templates vers les fonctions de rendu est exécutée à la volée. C'est habituellement assez rapide dans la plupart des cas, mais il vaut mieux l'éviter si la performance de vos applications est quelque chose de critique.

La manière la plus simple de précompiler les templates est d'utiliser les [composants monofichiers](single-file-components.html). Les outils de build associés effectuent la précompilation pour vous, afin que le code produit contienne les fonctions de rendu déjà compilées au lieu des templates en chaînes de caractères à l'état brut.

Si vous utilisez webpack, et préférez séparer le JavaScript des fichiers de template, vous pouvez utiliser [vue-template-loader](https://github.com/ktsn/vue-template-loader), qui transforme également les fichiers de template en fonctions de rendu pendant la phase de build.

## Extraire le CSS des composants

Lors de l'utilisation de composants monofichiers, le CSS à l'intérieur des composants est injecté dynamiquement sous la forme de balises `<style>` via JavaScript. Ceci a un léger cout d'exécution, et si vous utilisez du rendu côté serveur, cela causera le phénomène de FOUC (« Flash Of Unstyled Content »). Extraire le CSS depuis tous les composants dans le même fichier évite ces problèmes et amène à une meilleure minification et mise en cache du CSS.

Référez-vous aux documentations respectives des outils de build pour voir comment cela est fait :

- [webpack + vue-loader](https://vue-loader.vuejs.org/en/configurations/extract-css.html) (le template webpack `vue-cli` a cela préconfiguré)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://vuejs.github.io/rollup-plugin-vue/#/en/2.3/?id=custom-handler)

## Suivre les erreurs d'exécution

Si une erreur d'exécution est levée pendant le rendu d'un composant, elle sera passée à la fonction de configuration globale `Vue.config.errorHandler` si elle a été affectée. C'est toujours une bonne idée de coupler ce hook avec un service de suivi d'erreur comme [Sentry](https://sentry.io), qui fournit [une intégration officielle](https://sentry.io/for/vue/) pour Vue.
