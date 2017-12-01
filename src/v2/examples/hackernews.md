---
title: HackerNews Clone
type: examples
order: 12
---

> Esse é um clone do HackerNews construído utilizando a API Firebase oficial do HackerNews, Vue 2.0 + Vue Router + Vuex, incluindo renderização no lado do servidor.

{% raw %}
<div style="max-width: 600px;">
  <a href="https://github.com/vuejs/vue-hackernews-2.0" target="_blank">
    <img style="width: 100%;" src="/images/hn.png">
  </a>
</div>
{% endraw %}

> [Demonstração ao Vivo](https://vue-hn.now.sh/)
> Observação: essa demonstração pode precisar de algum tempo de carregamento se ninguém tiver a acessado por um certo período de tempo.
>
> [[Código-fonte](https://github.com/vuejs/vue-hackernews-2.0)]

## Funcionalidades

- Renderização no Lado do Servidor
  - Vue + Vue Router + Vuex trabalhando juntos
  - Pré-carregamento de dados do servidor
  - Estado _client-side_ & hidratação do DOM
- Componentes Single-File
  - _Hot-reload_ em desenvolvimento
  - Extração de CSS para produção
- Atualizações em tempo real da lista, com animações FLIP

## Visão Geral da Arquitetura

<img width="973" alt="Visão geral da arquitetura do clone do HackerNews em Vue" src="/images/hn-architecture.png">
