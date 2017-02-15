---
title: HackerNews Clone
type: examples
order: 10
---

> Este es un clon de HackerNews construido en base a la API oficial de HackerNews hecha en Firebase, Vue 2.0 + vue-router + vuex, con renderizado en el lado del servidor.

{% raw %}
<div style="max-width:600px">
  <a href="https://github.com/vuejs/vue-hackernews-2.0" target="_blank">
    <img style="width:100%" src="/images/hn.png">
  </a>
</div>
{% endraw %}

> [Live Demo](https://vue-hn.now.sh/)
> Nota: La demo puede tardar un poco en cargar si nadie ha accedido en un cierto periodo de tiempo.
>
> [[Fuente](https://github.com/vuejs/vue-hackernews-2.0)]

## Características

- Renderizado en el lado del servidor
  - Vue + vue-router + vuex trabajando en conjunto
  - Extracción previa de datos en el lado del servidor
  - Client-side state & DOM hydration
- Componentes de un solo archivo
  - Recarga automática durante la etapa de desarrollo
  - Extracción de CSS para producción
- Actualizacion en tiempo real de la lista con animaciones FLIP

## Descripción general de la arquitectura

<img width="973" alt="Hackernew clone architecture overview" src="/images/hn-architecture.png">
