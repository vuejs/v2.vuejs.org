---
title: Astuce de déploiement en production
type: guide
order: 20
---

## Passer en mode production

Pendant le développement, Vue fournit beaucoup d'avertissements pour vous aider avec les erreurs usuelles et les pièges. Ces suites d'avertissements deviennent cependant inutiles en production et gonflent votre taille en production. De plus, plusieurs de ces avertissements ont un léger coût d'exécution qui peut être évité en mode production.

### Sans outils de build

Si vous utilisez la version complète, c.-à-d. en incluant directement Vue via une balise script sans outil de build, assurez-vous d'utiliser la version minifiée (`vue.min.js`) pour la production. Ces deux versions peuvent être trouvée dans le [guide d'installation](installation.html#Inclusion-directe-lt-script-gt).

### Avec outils de build

Quand vous utilisez un outil de build comme webpack ou Browserify, le mode production va déterminer la valeur de `process.env.NODE_ENV` utilisée dans le code source, et sera en mode développement par défaut. Ces deux outils fournissent des moyens de surcharger cette variable pour activer le mode production de Vue, et les avertissements seront retirés par le minificateur pendant le build. Tous les templates `vue-cli` sont pré-configurés pour vous, mais il est avantageux de savoir comment cela fonctionne :

#### webpack

Utiliser le plugin [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) de webpack pour indiquer un environnement en production, ainsi les structures d'avertissement seront ignorées par UglifyJS pendant la minification. Un exemple de configuration :

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

- Lancer votre commande d'empaquetage avec la variable d'environnement courante `NODE_ENV` sur `"production"`. Cela informe `vueify` d'éviter d'inclure le code utilisé pour le rechargement à chaud.

- Appliquer une transformation [envify](https://github.com/hughsk/envify) globale à votre paquetage. Cela permet au minificateur de retirer tous les avertissements du code source de vue incluent dans la structure conditionnelle relative à la variable `env`. Par exemple :

  ``` bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
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

## Templates pré-compilés

Quand vous utilisez des templates dans le DOM ou dans des chaînes de caractère, une compilation des templates vers les fonctions de rendu est exécuté à la volée. C'est habituellement quelque chose d'assez rapide dans la plupart des cas, mais il vaut mieux l'éviter si la performance de vos applications est quelque chose de critique.

La manière la plus simple de pré-compiler les templates est d'utiliser les [composants monofichiers](single-file-components.html). Le build de mise en place associé remplit ce rôle pour vous, aussi le code contenu dans le paquetage est déjà compilé en fonction de rendu au lieu d'être un template de chaîne de caractère.

Si vous utilisez webpack, et préférez séparer le JavaScript des fichiers de template, vous pouvez utiliser [vue-template-loader](https://github.com/ktsn/vue-template-loader), qui transforme également les fichiers de template en fonction de rendu pendant la phase de build.

## Extraction CSS depuis les composants

Lors de l'utilisation de composants monofichiers, le CSS à l'intérieur du composant est injecté dynamiquement en tant que balise `<style>` via JavaScript. Ceci a un léger coût d'exécution, et si vous utilisez du rendu côté serveur, cela causera le phénomène de FOUC (« flash of unstyled content »). Extraire le CSS depuis tous les composants dans le même fichier évite ces problèmes et mène à une meilleur minification et mise en cache.

Referez-vous respectivement aux documentations des outils de build pour voir comment obtenir cela :

- [webpack + vue-loader](http://vue-loader.vuejs.org/en/configurations/extract-css.html) (le template webpack `vue-cli` a sa propre pré-configuration)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://github.com/znck/rollup-plugin-vue#options)

## Suivre les erreurs d'exécution

Si une erreur d'exécution est levée pendant le rendu d'un composant, elle sera passée à la fonction de configuration globale `Vue.config.errorHandler` si elle a été affectée. C'est toujours une bonne idée de coupler ce hook avec un service de suivie d'erreur comme [Sentry](https://sentry.io), qui fournit [une intégration officielle](https://sentry.io/for/vue/) pour Vue.
