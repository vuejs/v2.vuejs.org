---
title: Migração do Vuex 0.6.x para 1.0
type: guide
order: 703
---

> Vuex 2.0 foi lançado, mas este guia só cobre a migração para a versão 1.0? É um mero erro de digitação? Aliás, parece que Vuex 1.0 e 2.0 foram lançados simultaneamente! O que está acontecendo? Qual dos dois devo usar e qual deles é compatível com Vue 2.0?

Tanto Vuex 1.0 quanto 2.0:

- suportanto totalmente tanto Vue 1.0 quanto 2.0
- serão mantidos por um futuro próximo

Entretanto, eles tem públicos-alvo significativamente diferentes:

__Vuex 2.0__ é uma reconstrução radical incluindo simplificação da API, para aqueles que estiverem iniciando novos projetos ou queiram ficar na vanguarda do gerenciamento de estado _client-side_. __Ele não é coberto por este guia de migração__, então você deve verificar a [documentação do Vuex 2.0](https://vuex.vuejs.org/en/index.html) se estiver interessado em aprender mais sobre.

__Vuex 1.0__ é majoritariamente retro-compatível, exigindo poucas mudanças para a migração. É recomendado para aqueles com grande base de códigos-fonte ou que desejam uma migração suave em pequenos passos antes do Vue 2.0. Este guia é dedicado a facilitar o processo, mas só inclui notas de migração. Para o guia de uso completo, visite a [documentação do Vuex 1.0](https://github.com/vuejs/vuex/tree/1.0/docs/en).

## `store.watch` com Propriedade String <sup>substituído</sup>

`store.watch` agora aceita apenas funções. Por exemplo, você teria que substituir:

``` js
store.watch('user.notifications', callback)
```

por:

``` js
store.watch(
  // Quando o resultado retornado muda...
  function (state) {
    return state.user.notifications
  },
  // Executa este callback
  callback
)
```

Isto oferece controle mais completo sobre propriedades reativas que você quer de observar.

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>store.watch</code> com Strings em seu primeiro parâmetro.</p>
</div>
{% endraw %}

## Emição de Eventos no Store <sup>removido</sup>

A instância do _store_ não expõe mais a interface de emição de eventos (`on`, `off`, `emit`). Se você esteve usando o _store_ como um *global event bus*, [veja esta seção](migration.html#dispatch-and-broadcast-obsoleto) para instruções de migração.

Ao invés de usar esta interface para observar eventos emitidos pelo próprio _store_ (por exemplo, `store.on('mutation', callback)`), um novo método `store.subscribe` foi introduzido. O cenário de uso típico dentro de um _plugin_ seria:

``` js
const myPlugin = store => {
  store.subscribe(function (mutation, state) {
    // Faça algo...
  })
}
```

Veja o exemplo na [documentação de plugins](https://github.com/vuejs/vuex/blob/1.0/docs/en/plugins.md) para mais informações.

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos de <code>store.on</code>, <code>store.off</code> e <code>store.emit</code>.</p>
</div>
{% endraw %}

## Middlewares <sup>substituído</sup>

Middlewares foram substituídos por _plugins_. Um _plugin_ é uma função que recebe o _store_ como seu único argumento, podendo então se subscrever ao evento de mutação ocorrida nele:

``` js
const myPlugin = store => {
  store.subscribe('mutation', function (mutation, state) {
    // Faça algo...
  })
}
```

Para mais detalhes, veja a [documentação de plugins](https://github.com/vuejs/vuex/blob/1.0/docs/en/plugins.md).

{% raw %}
<div class="upgrade-path">
  <h4>Caminho para Atualização</h4>
  <p>Execute a <a href="https://github.com/vuejs/vue-migration-helper">ferramenta de migração</a> para encontrar casos onde foi feita a utilização de <code>middlewares</code> em um <i>store</i>.</p>
</div>
{% endraw %}
