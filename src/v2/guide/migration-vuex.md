---
title: Migration depuis Vuex 0.6.x à 1.0
type: guide
order: 28
---

> Vuex 2.0 est sorti, mais ce guide ne couvre que la migration vers la version 1.0 ? C'est une erreur ? En fait, Vuex 1.0 et 2.0 sont sortis simultanément. Ça veut dire quoi ? Lequel dois-je utiliser et lesquels sont compatibles avec Vue 2.0 ?

Pour Vuex 1.0 et 2.0 :

- le support de Vue 1.0 et 2.0 est total,
- ils seront maintenus à cours et moyen terme.

Ils ciblent cependant des utilisateurs légèrement différents.

__Vuex 2.0__ est complètement revisité et son API est simplifiée. Parfait pour ceux qui commencent de nouveaux projets ou qui veulent être à la pointe de la gestion d'état côté client. __Il n'est pas couvert par ce guide de migration__ et vous devez donc vous tourner vers [la documentation Vuex 2.0](https://vuex.vuejs.org/fr/index.html) si vous souhaitez en apprendre plus à son sujet.

__Vuex 1.0__ est en partie compatible avec ses versions antérieurs, il requiert vraiment peu de changement pour être mis à jour. Il est recommandé pour les grandes bases de code ou pour ceux qui souhaitent migrer lentement vers Vue 2.0. Ce guide est réalisé pour faciliter cette tâche mais n'inclut que des notes de migration. Pour le guide complet d'utilisation, consultez [la documentation Vuex 1.0](https://github.com/vuejs/vuex/tree/1.0/docs/en).

## `store.watch` avec chemin en propriété <sup>remplacée</sup>

`store.watch` n'accepte plus que des fonctions. Donc par exemple, vous devrez remplacer :

``` js
store.watch('user.notifications', callback)
```

par :

``` js
store.watch(
  // Quand le résultat retourné change...
  function (state) {
    return state.user.notifications
  },
  // Lancer cette fonction de rappel
  callback
)
```

Cela vous donne un contrôle plus complet sur les propriétés réactives que vous souhaitez observer.

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver tous les exemples de <code>store.watch</code> avec une chaîne de caractère comme premier argument.</p>
</div>
{% endraw %}

## Émetteur d'évènement du Store <sup>supprimé</sup>

L'instance du store n'expose plus l'interface d'émetteur d'évènement (`on`, `off`, `emit`). Si vous utilisiez précédemment le store comme un canal global d'évènement, [consultez cette section](migration.html#dispatch-et-broadcast-remplaces) pour des instructions de migration.

Au lieu d'utiliser cette interface pour observer les émetteurs d'évènement dans le store lui-même (par ex. `store.on('mutation', callback)`), une nouvelle méthode `store.subscribe` a été introduite. L'utilisation typique dans un plugin serait :

``` js
var myPlugin = store => {
  store.subscribe(function (mutation, state) {
    // Faire quelque chose...
  })
}

```

Consultez comme exemple [la documentation des plugins](https://github.com/vuejs/vuex/blob/1.0/docs/en/plugins.md) pour plus d'informations.

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver tous les exemples de <code>store.on</code>, <code>store.off</code> et <code>store.emit</code>.</p>
</div>
{% endraw %}

## Middlewares <sup>remplacés</sup>

Les middlewares sont remplacés par les plugins. Un plugin est une simple fonction qui fournit le store comme seul argument et qui peut écouter les mutations d'évènement sur le store :

``` js
const myPlugins = store => {
  store.subscribe('mutation', (mutation, state) => {
    // Faire quelque chose...
  })
}
```

Pour plus de détails, consultez [la documentation des plugins](https://github.com/vuejs/vuex/blob/1.0/docs/en/plugins.md).

{% raw %}
<div class="upgrade-path">
  <h4>Comment procéder ?</h4>
  <p>Lancez l'<a href="https://github.com/vuejs/vue-migration-helper">outil d'aide à la migration</a> sur votre code pour trouver tous les exemples de l'option <code>middlewares</code> sur un store.</p>
</div>
{% endraw %}
