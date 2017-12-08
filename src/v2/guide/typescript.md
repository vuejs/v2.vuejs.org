---
title: Suporte ao TypeScript
type: guide
order: 404
---

> No Vue 2.5.0+ melhoramos bastante a declaração de tipos para funcionar com a API baseada em objetos padrão. Ao mesmo tempo, isto introduziu mudanças que requerem ações de migração para esta versão. Leia [esta postagem](https://medium.com/the-vue-point/upcoming-typescript-changes-in-vue-2-5-e9bd7e2ecf08) para mais detalhes.

## Declaração Oficial em Pacotes NPM

Um sistema de tipagem estática pode ajudar a previnir muitos erros de _runtime_ potenciais, especialmente conforme as aplicações crescem. Por isso temos [declaração de tipos oficial](https://github.com/vuejs/vue/tree/dev/types) para o [TypeScript](https://www.typescriptlang.org/) - não apenas no núcleo do Vue, mas para [Vue Router](https://github.com/vuejs/vue-router/tree/dev/types) e [Vuex](https://github.com/vuejs/vuex/tree/dev/types) também.

Já que estão [publicadas no NPM](https://cdn.jsdelivr.net/npm/vue/types/) e o TypeScript mais recente sabe como resolver declarações de tipo em pacotes NPM, isto significa que você não precisa de nenhuma ferramenta adicional para utilizar TypeScript com Vue quando instalado via NPM.

Estamos também planejando oferecer uma opção para gerar um projeto Vue + TypeScript pronto para uso através do `vue-cli` em um futuro próximo.

## Configuração Recomendada

``` js
// tsconfig.json
{
  "compilerOptions": {
    // isto alinha com o suporte de navegadores do Vue
    "target": "es5",
    // habilita inferência estrita de propriedades de dados no `this`
    "strict": true,
    // se usando webpack 2+ ou rollup, para habilitar tree shaking
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

Observe que é obrigatório incluir `strict: true` (ou pelo menos `noImplicitThis: true` o qual é parte da _flag_ `strict`) para poder se aproveitar da checagem de tipos do `this` em métodos de componentes, caso contrário ele sempre será tratado como o tipo `any`.

Veja as [opções de compilação do TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html) para mais detalhes.

## Ferramentas para Desenvolvimento

Para desenvolver aplicações Vue com TypeScript, nós recomendamos fortemente utilizar o [Visual Studio Code](https://code.visualstudio.com/), o qual oferece ótimo suporte por padrão ao TypeScript.

Se você está usando [Componentes Single-File](./single-file-components.html), obtenha a ótima [extensão Vetur](https://github.com/vuejs/vetur) que oferece inferência TypeScript dentro dos componentes `.vue` e muitos outros ótimos recursos.

[WebStorm](https://www.jetbrains.com/webstorm/) também oferece suporte por padrão tanto a TypeScript quanto ao Vue.

## Utilização Básica

Para permitir que o TypeScript infira tipos dentro das opções de componentes Vue, você precisa definir componentes com `Vue.component` ou `Vue.extend`:

``` ts
import Vue from 'vue'

const Component = Vue.extend({
  // inferência de tipos habilitada
})

const Component = {
  // isto NÃO terá inferência de tipos,
  // pois TypeScript não pode supor que são opções de componente Vue.
}
```

## Componentes Através de Classes

Se você prefere uma API baseada em classes ao declarar seus componentes, pode usar o decorador oficial [vue-class-component](https://github.com/vuejs/vue-class-component):

``` ts
import Vue from 'vue'
import Component from 'vue-class-component'

// O decorador @Component indica que a classe é um componente Vue
@Component({
  // Todas as opções de componentes são permitidas aqui
  template: '<button @click="onClick">Click!</button>'
})
export default class MyComponent extends Vue {
  // Dados iniciais podem ser declarados como propriedades da instância
  message: string = 'Hello!'

  // Métodos do componente podem ser declarados como métodos da instância
  onClick (): void {
    window.alert(this.message)
  }
}
```

## Ampliando Tipos ao Usar Plugins

Plugins podem adicionar propriedades e opções à instância Vue ou ao contexto global. Nestes casos, declarações de tipos são necessárias para que possam compilar em TypeScript. Por sorte, há um recurso TypeScript para ampliar tipos existentes, [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

Por exemplo, para declarar uma propriedade de instância `$myProperty` como `string`:

``` ts
// 1. Tenha certeza de importar 'vue' antes de declarar tipos ampliados
import Vue from 'vue'

// 2. Especifique o arquivo com os tipos que quer ampliar
//    Vue tem um construtor de tipos em types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Declare a ampliação para Vue
  interface Vue {
    $myProperty: string
  }
}
```

Após incluir o código acima como um arquivo de declaração (como `my-property.d.ts`) em seu projeto, você pode importar `$myProperty` em uma instância Vue.

```ts
var vm = new Vue()
console.log(vm.$myProperty) // Isto deve compilar com sucesso
```

Você também pode declarar propriedades globais e opções de componentes adicionais:

```ts
import Vue from 'vue'

declare module 'vue/types/vue' {
  // Propriedades globais podem ser declaradas
  // na interface `VueConstructor`
  interface VueConstructor {
    $myGlobal: string
  }
}

// ComponentOptions são declarados em types/options.d.ts
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    myOption?: string
  }
}
```

As declarações acima permitem compilação dos códigos a seguir:

```ts
// Propriedade global
console.log(Vue.$myGlobal)

// Opções de componente adicional
var vm = new Vue({
  myOption: 'Hello'
})
```

## Anotando Tipos de Retorno

Por causa da natureza circular dos arquivos de declaração Vue, TypeScript pode ter dificuldades ao inferir tipos de alguns métodos. Por esta razão, você pode precisar anotar o tipo de retorno em métodos como `render` e aqueles em `computed`.

```ts
import Vue, { VNode } from 'vue'

const Component = Vue.extend({
  data () {
    return {
      msg: 'Olá'
    }
  },
  methods: {
    // Precisa de anotação por causa do `this` no retorno
    greet (): string {
      return this.msg + ' mundo'
    }
  },
  computed: {
    // Precisa de anotação
    greeting(): string {
      return this.greet() + '!'
    }
  },
  // `createElement` é inferido, mas `render` precisa do tipo de retorno
  render (createElement): VNode {
    return createElement('div', this.greeting)
  }
})
```

Se você achar que a inferência de tipos ou a autocompletação não estiver funcionando, anotar certos métodos pode ajudar a endereçar estes problemas. Usar a opção `--noImplicitAny` irá ajudar a encontrar muitos destes métodos não anotados.
