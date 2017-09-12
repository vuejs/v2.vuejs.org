---
title: Clone de HackerNews
type: examples
order: 12
---

> Ceci est un build clone du site HackerNews (HN) utilisant l'API Firebase HN officielle, Vue 2.0 + vue-router + vuex, avec un rendu côté serveur.

{% raw %}
<div style="max-width:600px">
  <a href="https://github.com/vuejs/vue-hackernews-2.0" target="_blank">
    <img style="width:100%" src="/images/hn.png">
  </a>
</div>
{% endraw %}

> [Démo en ligne](https://vue-hn.now.sh/)
> Note : la démo peut avoir besoin de temps pour se lancer si personne n'y a accédé depuis un certain temps.
>
> [[Source](https://github.com/vuejs/vue-hackernews-2.0)]

## Fonctionnalités

- Rendu Côté Serveur
  - Vue + Vue Router + Vuex fonctionnant ensemble
  - Données serveur préchargées
  - État Client et Hydratation du DOM
- Composant Vue Monofichier
  - Rechargement à chaud en développement
  - Extraction CSS pour la production
- Mise à jour en temps-réel de liste avec animation de réordonnement.

## Présentation d'architecture

<img width="973" alt="Présentation d'architecture clone Hackernew" src="/images/hn-architecture.png">
