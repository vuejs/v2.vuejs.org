---
title: Comparação com Outros Frameworks
type: guide
order: 801
---

Esta é definitivamente a página mais difícil de ser escrita do guia, mas sentimos que é importante. É muito provável que você já teve problemas, tentou resolvê-los e já usou outra biblioteca para resolvê-los. Você está aqui pois quer saber se Vue pode resolver seus problemas específicos de uma forma melhor. É isto que esperamos lhe responder.

Nós também tentamos arduamente evitar arbitrariedade. Como a equipe responsável, obviamente gostamos muito do Vue. Há problemas que acreditamos que ele resolva melhor do que qualquer outra opção existente. Se não acreditássemos nisso, não estaríamos trabalhando nele. Entretanto, queremos ser justos e precisos. Nos esforçamos para listar também onde outras bibliotecas oferecem vantagens significativas, como o vasto ecossistema React de renderizadores alternativos ou o suporte retroativo do Knockout até IE6.

Nós também gostaríamos de **sua** ajuda para manter este documento atualizado, afinal o mundo JavaScript se move rápido! Se você perceber alguma inconsistência ou algo que não parece estar certo, por favor, nos mantenha a par [informando um problema](https://github.com/vuejs/vuejs.org/issues/new?title=Inaccuracy+in+comparisons+guide).

## React

React e Vue compartilham muitas similaridades. Ambos:

- utilizam a abordagem de DOM virtual
- provêm componentes visuais reativos e combináveis
- mantêm o foco na biblioteca principal, com preocupações como roteamento e gerenciamento de estado global tratadas por bibliotecas companheiras

Sendo tão similares em escopo, desprendemos mais tempo para refinar esta comparação em relação às outras. Queremos garantir não somente precisão técnica, mas também equilíbrio. Apontamos onde React supera Vue, por exemplo, na riqueza de seu ecossistema e na abundância de renderizadores personalizados.

Com isso dito, é inevitável que a comparação pareça tendenciosa ao Vue para alguns usuários do React, pois muitos dos assuntos explorados são de certo modo subjetivos. Reconhecemos a existência de variadas preferências técnicas, e esta comparação tem como objetivo principal delinear as razões pelas quais Vue poderia ser uma escolha melhor se suas preferências coincidirem com as nossas.

A comunidade React [tem sido fundamental](https://github.com/vuejs/vuejs.org/issues/364) para nos ajudar a alcançar esse equilíbrio, com agradecimentos especiais a Dan Abramov da equipe React. Ele foi extremamente generoso com seu tempo e considerável experiência para nos ajudar a refinar este documento até que [ambos ficassem felizes](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244575740) com o resultado final.

### Desempenho

Tanto React quanto Vue oferecem desempenho equivalente na maioria dos casos que encontramos, eventualmente com Vue um pouco à frente por causa de sua implementação Virtual DOM mais leve. Se você está interessado em números, pode dar uma olhada neste [comparativo independente](https://rawgit.com/krausest/js-_framework_-benchmark/master/webdriver-ts/table.html) que foca no desempenho bruto de renderização/atualização. Observe que não se leva em conta estruturas complexas de componentes, portanto encare-o apenas como uma referência e não um veredito.

#### Esforços de Otimização

No React, quando o estado de um componente muda, ele aciona também a renderização de toda a árvore de componentes filhos. Para evitar renderizações desnecessárias de componentes filhos, você precisa utilizar um `PureComponent` ou implementar `shouldComponentUpdate` sempre que puder. Você também pode precisar utilizar estruturas de dados imutáveis para tornar suas mudanças de estado mais amigáveis a otimizações. Entretanto, em certos casos pode não ser possível se apoiar nestas otimizações, pois `PureComponent` e `shouldComponentUpdate` assumem que o resultado da renderização de toda a árvore interna sempre é determinado pelas propriedades do componente corrente. Se este não for seu caso, tais otimizações podem levar a estado inconsistente no DOM.

No Vue, as dependências de um componente são automaticamente observadas durante sua renderização, desta forma o sistema sabe precisamente quais componentes precisam ser renderizados quando o estado muda. Pode-se considerar que cada componente já tem `shouldComponentUpdate` automaticamente implementado para você, e sem os problemas com componentes filhos.

De forma geral, isto remove a necessidade de conhecimento de toda uma gama de otimizações de desempenho das responsabilidades do desenvolvedor, permitindo-o focar mais em construir a aplicação em si enquanto ela cresce.

### HTML & CSS

No React, tudo é exclusivamente JavaScript. Não apenas as estruturas HTML são expressas através de JSX, mas tendências recentes também apontam para colocar o gerenciamento CSS dentro do JavaScript. Esta abordagem tem seus próprios benefícios, mas também vem com várias contra-partidas que podem não aparecer de cara para todos os desenvolvedores.

Vue abraça as tecnologias Web clássicas e constrói em cima delas. Para mostrar o que isso significa, mergulharemos em alguns exemplos.

#### JSX vs. Templates

No React, todos os componentes expressam sua interface com funções `render` usando JSX, uma sintaxe declarativa estilo XML, embutida dentro do JavaScript.

A utilização de _render functions_ com JSX oferece algumas vantagens:

- Você pode usar o poder total de uma linguagem de programação (JavaScript) para construir sua camada visual. Isto inclui variáveis temporárias, fluxos de controle e referenciamento direto a valores JavaScript no escopo.

- Ferramentas de suporte (como _linting_, checagem de tipos, _autocomplete_ de código) para JSX estão um pouco mais avançadas do que atualmente temos para _templates_ Vue.

No Vue, também temos [funções de renderização](render-function.html) e até mesmo [suporte a JSX](render-function.html#JSX), afinal às vezes você precisa deste poder. Entretanto, oferecemos para a experiência padrão o uso de _templates_ como uma alternativa mais simples. Qualquer HTML válido é um _template_ Vue válido, o que leva a algumas vantagens próprias:

<<<<<<< HEAD
- Para muitos desenvolvedores habituados a trabalhar com HTML, _templates_ parecem naturalmente mais fáceis de ler e escrever. A preferência pode ser algo subjetivo, mas se isto torna o desenvolvedor mais produtivo, então o benefício é objetivo.
=======
- For many developers who have been working with HTML, templates feel more natural to read and write. The preference itself can be somewhat subjective, but if it makes the developer more productive then the benefit is objective.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

- Utilizar _templates_ baseados em HTML torna mais fácil migrar progressivamente aplicações existentes para tirar vantagens dos recursos de reatividade do Vue.

- Também pode ser muito mais simples para _designers_ e desenvolvedores menos experientes compreenderem o código e começarem a participar.

- Pode-se inclusive utilizar pré-processadores como Pug (anteriormente denominado Jade) para a autoria de seus _templates_ Vue.

<<<<<<< HEAD
Alguns argumentam que é preciso aprender uma nova sintaxe específica de um único domínio para ser capaz de escrever _templates_ - nós acreditamos que este argumento é superficial. Primeiramente, usar JSX não significa que o desenvolvedor não precisa aprender algo - sendo uma sintaxe adicional por cima do JavaScript puro, pode ser fácil de aprender para aqueles familiarizados com JavaScript, mas ainda assim há uma curva de aprendizado. Similarmente, usar _templates_ também é apenas uma sintaxe adicional por cima do HTML puro, inclusive com uma curva de aprendizado bem menor para aqueles familiarizados com HTML. E com este novo conhecimento "específico", ajudamos os desenvolvedores a fazer mais com menos código (por exemplo, modificadores `v-on`). A mesma tarefa pode envolver muito mais código quando usamos JSX ou funções de renderização.
=======
Some argue that you'd need to learn an extra DSL (Domain-Specific Language) to be able to write templates - we believe this difference is superficial at best. First, JSX doesn't mean the user doesn't need to learn anything - it's additional syntax on top of plain JavaScript, so it can be easy for someone familiar with JavaScript to learn, but saying it's essentially free is misleading. Similarly, a template is just additional syntax on top of plain HTML and thus has very low learning cost for those who are already familiar with HTML. With the DSL we are also able to help the user get more done with less code (e.g. `v-on` modifiers). The same task can involve a lot more code when using plain JSX or render functions.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

Em um nível mais alto, podemos dividir componentes em duas categorias: de apresentação ou de lógica. Recomendamos utilizar _templates_ para componentes de apresentação e funções de renderização ou JSX para componentes de lógica. O percentual destes componentes depende do tipo de aplicação que você está construindo, mas normalmente observamos que componentes de apresentação são muito mais comuns.

#### CSS com Escopo por Componente

<<<<<<< HEAD
A menos que distribua componentes entre vários arquivos (por exemplo, com [CSS Modules](https://github.com/gajus/react-css-modules)), usar CSS com escopo no React frequentemente se baseia em soluções CSS-no-JS. Há muitas soluções por aí, cada qual com seus contratempos. Um problema comum é que recursos como estados `:hover`, _media queries_ e pseudo-seletores exigem dependências pesadas para reinventar o que o CSS já faz - ou por vezes nem são suportados. Se não otimizado com cautela, CSS-no-JS também pode introduzir problemas de desempenho não triviais. E o mais importante, isto desvia da experiência normal de autoria de CSS.

Vue, por outro lado, proporciona acesso completo ao CSS com [componentes single-file](single-file-components.html):
=======
Unless you spread components out over multiple files (for example with [CSS Modules](https://github.com/gajus/react-css-modules)), scoping CSS in React is often done via CSS-in-JS solutions (e.g. [styled-components](https://github.com/styled-components/styled-components), [glamorous](https://github.com/paypal/glamorous), and [emotion](https://github.com/emotion-js/emotion)). This introduces a new component-oriented styling paradigm that is different from the normal CSS authoring process. Additionally, although there is support for extracting CSS into a single stylesheet at build time, it is still common that a runtime will need to be included in the bundle for styling to work properly. While you gain access to the dynamism of JavaScript while constructing your styles, the tradeoff is often increased bundle size and runtime cost.

If you are a fan of CSS-in-JS, many of the popular CSS-in-JS libraries support Vue (e.g. [styled-components-vue](https://github.com/styled-components/vue-styled-components) and [vue-emotion](https://github.com/egoist/vue-emotion)). The main difference between React and Vue here is that the default method of styling in Vue is through more familiar `style` tags in [single-file components](single-file-components.html).

[Single-file components](single-file-components.html) give you full access to CSS in the same file as the rest of your component code.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

```html
<style scoped>
  @media (min-width: 250px) {
    .list-container:hover {
      background: orange;
    }
  }
</style>
```

O atributo opcional `scoped` automaticamente cria escopo ao CSS de seu componente adicionando um atributo único (por exemplo, `data-v-21e5b78`) aos elementos e compilando `.list-container:hover` para algo como `.list-container[data-v-21e5b78]:hover`.

<<<<<<< HEAD
Se você já está familiarizado com CSS Modules, os componentes _single-file_ do Vue também possuem [suporte de primeira classe para isso](https://vue-loader.vuejs.org/en/features/css-modules.html).

Finalmente, assim como no HTML, você também tem a opção de escrever seu CSS utilizando qualquer pré-processador (ou pós-processador) de sua preferência, permitindo-o se apoiar em bibliotecas existentes neste ecossistema. Você pode realizar operações centradas no _design_, como manipulação de cores durante o processo de _build_, ao invés de precisar importar bibliotecas JavaScript especializadas que aumentariam o tamanho de seu pacote compilado e a complexidade de sua aplicação.
=======
Lastly, the styling in Vue's single-file component's is very flexible. Through [vue-loader](https://github.com/vuejs/vue-loader), you can use any preprocessor, post-processor, and even deep integration with [CSS Modules](https://vue-loader.vuejs.org/en/features/css-modules.html) -- all within the `<style>` element.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

### Escalabilidade

#### Ampliando a Escala

Para aplicações grandes, tanto Vue quanto React oferecem soluções de roteamento robustas. A comunidade React também tem sido muito inovadora em termos de soluções de gerenciamento de estado (com Flux/Redux). Esses padrões de gerenciamento de estado e até [o próprio Redux](https://github.com/egoist/revue) podem ser integrados facilmente em aplicações Vue. Na verdade, neste modelo, Vue até deu um passo adiante com o [Vuex](https://github.com/vuejs/vuex), uma solução de gerenciamento de estado ispirada em Elm, que se integra profundamente com o Vue, a qual nós acreditamos que oferece uma experiência de desenvolvimento superior.

Outra importante diferença entre os dois ecossistemas é que as bibliotecas companheiras do Vue para gerenciamento de estado e roteamento (dentre [outras preocupações](https://github.com/vuejs)) são oficialmente suportadas e mantidas sempre atualizadas em relação à biblioteca principal. Ao contrário disso, React escolhe deixar tais preocupações para a comunidade, criando um ecossistema mais fragmentado. Por outro lado, por ser mais popular, o ecossistema React é consideravelmente mais rico do que o do Vue.

Por fim, Vue oferece um [CLI gerador de projetos](https://github.com/vuejs/vue-cli) que torna trivialmente simples iniciar um novo projeto usando o sistema de _build_ de sua escolha, incluindo [webpack](https://github.com/vuejs-templates/webpack), [Browserify](https://github.com/vuejs-templates/browserify), ou mesmo [nenhum](https://github.com/vuejs-templates/simple). React também está fazendo avanços nesta área com o [create-react-app](https://github.com/facebookincubator/create-react-app), mas atualmente tem algumas limitações:

- Não permite nenhuma configuração durante a geração do projeto, enquanto os _templates_ de projeto Vue permitem personalização no estilo [Yeoman](http://yeoman.io/).
- Oferece um modelo simples assumindo que você está criando uma aplicação _single-page_, enquanto Vue oferece muita variedade, para vários propósitos e sistemas de _build_.
- Não permite criar projetos a partir de modelos feitos por outros desenvolvedores, o que pode ser muito útil especialmente em ambientes empresariais com padrões estabelecidos.

É importante notar, no entanto, que muitas dessas limitações são decisões de projeto intencionais tomadas pela equipe do create-react-app, as quais têm suas vantagens. Por exemplo, enquanto as necessidades de seu projeto são bem simples e você não precisa "ejetar" para customizar o processo de _build_, é possível mantê-lo atualizado como uma dependência. Você pode ler mais sobre esta [filosofia diferente aqui](https://github.com/facebookincubator/create-react-app#philosophy).

#### Reduzindo a Escala

React é conhecido por sua curva de aprendizado. Antes que você possa realmente começar, você precisa saber sobre JSX e provavelmente ES2015+, uma vez que muitos exemplos React usam sintaxe de classes. Você também precisa aprender sobre processos de transpilação, pois embora você possa tecnicamente usar Babel para compilar código em tempo real diretamente no navegador, não é algo recomendado para a produção.

Enquanto Vue escala ascendentemente tão bem quanto, se não até melhor que o React, ele também é capaz de reduzir a escala tão bem quanto jQuery. É isso mesmo - tudo que você precisa fazer é colocar uma única _tag_ `<script>` na página:

``` html
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

Então você pode começar a escrever código Vue e ainda distribuir a versão minificada em produção sem se sentir culpado ou ter que se preocupar sobre problemas de performance.

E já que você não precisa obrigatoriamente saber sobre JSX, ES2015 ou sistemas de _build_ para começar com o Vue, leva tipicamente menos de um dia para os desenvolvedores lerem os pontos mais importantes [no guia](/guide) e aprenderem o suficiente para criar aplicações não triviais.

### Renderização Nativa

React Native lhe permite escrever aplicativos nativamente renderizados para iOS e Android usando o mesmo modelo de componentes do React. É ótimo que, como desenvolvedor, você possa aplicar o conhecimento de um _framework_ entre múltiplas plataformas. Nesta frente, Vue possui uma colaboração oficial com [Weex](https://alibaba.github.io/weex/), um _framework_ de UI multiplataforma desenvolvido por Alibaba Group, o qual utiliza Vue como seu motor JavaScript. Isso significa que, com Weex, você pode utilizar a mesma sintaxe de componentes Vue para criar componentes que podem ser renderizados não apenas no navegador, mas também nativamente em iOS e Android!

No presente momento, Weex ainda é um projeto em desenvolvimento ativo e não está tão maduro e testado na prática quanto o ReactNative, mas o desenvolvimento é dirigido às necessidades de produção do maior negócio de comércio eletrônico do mundo, e a equipe Vue colaborará ativamente com a equipe Weex para garantir a experiência mais suave possível aos desenvolvedores Vue.

Outra opção que desenvolvedores Vue terão em breve é utilizar o [NativeScript](https://www.nativescript.org/), através de um [plugin](https://github.com/rigor789/nativescript-vue) desenvolvido pela comunidade.

### Utilizando MobX

MobX se tornou bem popular na comunidade React e, de fato, utiliza um sistema de reatividade quase idêntico ao Vue. De forma simplista, o fluxo de trabalho React + MobX pode ser pensado como um Vue com código mais prolixo. Por isso, se você estiver usando essa combinação e estiver gostando, saltar para o Vue é, provavelmente, o próximo passo lógico.

## AngularJS (Angular 1)

Um pouco da sintaxe Vue é muito similar ao Angular (por exemplo, `v-if` vs. `ng-if`). Isto ocorre pois acreditamos que há muitas coisas que o AngularJS resolveu corretamente, as quais serviram de inspiração para o Vue bem no início de seu desenvolvimento. Entretanto, também há muitas dores que vêm com o AngularJS, onde o Vue tentou oferecer melhorias significativas.

### Complexidade

Vue é muito mais simples que o AngularJS, tanto em termos de API quanto de _design_. Aprender o suficiente para construir aplicações não triviais tipicamente leva menos de um dia, o que não é verdade para o AngularJS.

### Flexibilidade e Modularidade

<<<<<<< HEAD
AngularJS tem fortes opiniões sobre como as aplicações devem ser estruturadas, enquanto Vue é uma solução mais flexível e modular. Ainda que isto torne Vue mais adaptável a uma ampla variedade de projetos, reconhecemos que às vezes é útil ter algumas decisões já tomadas para você, para que possa simplesmente sair codificando.
=======
AngularJS has strong opinions about how your applications should be structured, while Vue is a more flexible, modular solution. While this makes Vue more adaptable to a wide variety of projects, we also recognize that sometimes it's useful to have some decisions made for you, so that you can just start coding.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

É por isso que oferecemos o [modelo de projeto com webpack](https://github.com/vuejs-templates/webpack) que você pode configurar dentro de poucos minutos, ainda assim concedendo-lhe acesso a recursos avançados como _hot module reloading_, _linting_, extração de CSS, e muito mais.

### Interligação com Dados

AngularJS adota a abordagem de _two-way binding_ entre escopos, enquanto Vue força um fluxo de dados de mão única entre componentes. Isto permite que o fluxo de dados seja mais compreensível em aplicações não triviais.

### Diretivas vs. Componentes

Vue possui clara separação entre diretivas e componentes. Diretivas são feitas exclusivamente para encapsular lógica de manipulação do DOM, enquanto componentes são unidades auto-contidas que possuem sua própria lógica de dados e de apresentação. Com AngularJS, existe uma confusão considerável entre os dois.

### Desempenho

<<<<<<< HEAD
Vue tem melhor desempenho e é muito, muito mais fácil de otimizar, por não utilizar verificação suja de alterações de dados no escopo (_dirty checking_). AngularJS torna-se lento quando há um grande número de observadores (_watchers_), pois a cada vez que qualquer coisa muda no escopo, todos esses observadores precisam ser reavaliados. Além disso, este laço de verificação suja (chamado _digest cycle_), pode ter que executar várias vezes para "estabilizar" se algum observador aciona outra atualização. Usuários do AngularJS por vezes têm de recorrer a técnicas esotéricas para contornar este ciclo e, em algumas situações, não há simplesmente nenhuma maneira de otimizar um escopo com muitos observadores.
=======
Vue has better performance and is much, much easier to optimize because it doesn't use dirty checking. AngularJS becomes slow when there are a lot of watchers, because every time anything in the scope changes, all these watchers need to be re-evaluated again. Also, the digest cycle may have to run multiple times to "stabilize" if some watcher triggers another update. AngularJS users often have to resort to esoteric techniques to get around the digest cycle, and in some situations, there's no way to optimize a scope with many watchers.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

O Vue definitivamente não sofre com isso, pois usa um sistema de observação por rastreamento de dependências transparente, com enfileiramento assíncrono - todas as alterações disparam de forma independente, a menos que tenham dependências explícitas.

Curiosamente, há algumas semelhanças na forma como Angular 2 e Vue estão lidando com estes problemas existentes no AngularJS.

## Angular (previamente denominado Angular 2)

Temos uma seção separada para Angular por ser, de fato, um _framework_ completamente diferente do AngularJS. Por exemplo, possui um sistema de componentes de primeira classe, muitos detalhes de implementação foram totalmente reescritos, e a API também mudou drasticamente.

### TypeScript

<<<<<<< HEAD
Angular essencialmente requer a utilização de TypeScript, dado que quase toda sua documentação e recursos de aprendizado são baseados nesta linguagem. TypeScript tem seus benefícios óbvios - checagem estática de tipos pode ser muito útil para aplicações de larga escala, e pode ser um grande bônus de produtividade para desenvolvedores acostumados com Java e C#.
=======
Angular essentially requires using TypeScript, given that almost all its documentation and learning resources are TypeScript-based. TypeScript has its benefits - static type checking can be very useful for large-scale applications, and can be a big productivity boost for developers with backgrounds in Java and C#.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

Entretanto, nem todo mundo quer TypeScript. Em muitos casos de menor escala, introduzir um sistema de tipagem pode resultar em mais sobrecarga do que ganho de produtividade. Nestes casos você estaria melhor seguindo com Vue, afinal utilizar Angular sem TypeScript pode ser desafiador.

Por fim, ainda que não tão profundamente integrado com TypeScript quanto Angular, Vue também oferece [tipagem oficial](https://github.com/vuejs/vue/tree/dev/types) e [decorador oficial](https://github.com/vuejs/vue-class-component) para aqueles que desejarem utilizar TypeScript com Vue. Também estamos ativamente colaborando com os times do TypeScript e do VSCode da Microsoft para melhorar a experiência TS/IDE para os usuários Vue + TS.

### Tamanho e Desempenho

Em termos de desempenho, ambos os _frameworks_ são excepcionalmente rápidos e não há dados suficientes a partir de casos do mundo real para oferecer um veredito. No entanto, se você está determinado a ver alguns números, Vue 2.0 parece estar à frente do Angular de acordo com este [comparativo independente](http://stefankrause.net/js-frameworks-benchmark4/webdriver-ts/table.html).

<<<<<<< HEAD
Versões recentes do Angular, com compilação AOT (_Ahead-Of-Time_) e _tree-shaking_, tem sido capazes de derrubar o tamanho do pacote consideravelmente. No entanto, um projeto Vue 2 cheio de recursos com Vuex + vue-router incluídos (~30kb gzip) ainda é significativamente mais leve do que uma aplicação padrão com AOT gerada pelo `angular-cli` (~130kb gzip).
=======
Recent versions of Angular, with AOT compilation and tree-shaking, have been able to get its size down considerably. However, a full-featured Vue 2 project with Vuex + Vue Router included (~30KB gzipped) is still significantly lighter than an out-of-the-box, AOT-compiled application generated by `angular-cli` (~130KB gzipped).
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

### Flexibilidade

Vue é muito menos opinativo que Angular, oferecendo suporte oficial a vários sistemas de _build_, sem restrições sobre como você estrutura sua aplicação. Muitos desenvolvedores gostam desta liberdade, enquanto outros preferem ter somente "O Jeito Certo" de construir qualquer aplicação.

### Curva de Aprendizado

Para começar com Vue, tudo que você precisa é familiaridade com HTML e JavaScript versão ES5 (ou seja, JavaScript puro). Com estas habilidades básicas, você pode começar a construir aplicações não triviais com menos de um dia de leitura [do guia](/guide).

<<<<<<< HEAD
A curva de aprendizado do Angular é muito mais acentuada. A superfície da API do _framework_ é simplesmente enorme e o usuário precisará se familiarizar com muito mais antes de se tornar produtivo. Obviamente, a complexidade do Angular deve-se em grande parte ao seu objetivo de projetar somente aplicações grandes e complexas - mas isso torna o _framework_ muito mais difícil para desenvolvedores menos experientes começarem.
=======
Angular's learning curve is much steeper. The API surface of the framework is huge and as a user you will need to familiarize yourself with a lot more concepts before getting productive. The complexity of Angular is largely due to its design goal of targeting only large, complex applications - but that does make the framework a lot more difficult for less-experienced developers to pick up.
>>>>>>> 87f1d8e395539750f2861c497796e7e011aef454

## Ember

Ember é um _framework_ completo projetado para ser altamente opinativo. Ele fornece uma série de convenções estabelecidas e, uma vez que você fique bastante familiarizado com elas, pode se tornar muito produtivo. No entanto, também significa que a curva de aprendizado é elevada e a flexibilidade é sofrível. É uma escolha para você colocar na balança entre adotar um _framework_ fortemente opinativo ou uma biblioteca com um conjunto de ferramentas de baixo acoplamento que funcionam em conjunto. Este último cenário lhe dá mais liberdade, mas também requer que você tome mais decisões arquitetônicas.

Com isto dito, seria provavelmente mais adequado uma comparação entre o núcleo do Vue e as camadas de [templates](https://guides.emberjs.com/v2.7.0/templates/handlebars-basics/) e de [modelo de objetos](https://guides.emberjs.com/v2.7.0/object-model/) do Ember:

- Vue oferece reatividade não obstrusiva em objetos JavaScript tradicionais e propriedades computadas totalmente automáticas. No Ember, você precisa envolver qualquer coisa em Objetos Ember e manualmente declarar dependências para propriedades computadas.

- A sintaxe de _templates_ do Vue se arma com o poder total de expressões JavaScript, enquanto a sintaxe de expressões e _helpers_ do Handlebars é bastante limitada.

- Em termos de performance, Vue supera Ember [por uma margem justa](https://rawgit.com/krausest/js-_framework_-benchmark/master/webdriver-ts/table.html), mesmo após a atualização mais recente do motor Glimmer no Ember 2. Vue realiza atualizações em lote automaticamente, enquanto no Ember você precisa lidar manualmente com laços de execução em situações de desempenho crítico.

## Knockout

Knockout foi um pioneiro nas áreas de MVVM e rastreamento de dependências e seu sistema de reatividade é muito semelhante ao Vue. O [suporte a navegadores](http://knockoutjs.com/documentation/browser-support.html) é muito impressionante considerando tudo o que faz, suportante retroativamente até o IE6! Vue, por outro lado, suporta apenas IE9 e superiores.

Com o tempo, porém, o desenvolvimento do Knockout começou a diminuir e está começando a dar sinais de sua idade. Por exemplo, seu sistema de componentes carece de um conjunto completo de eventos de ciclo de vida e, embora seja um caso muito comum, a interface para passagem de elementos filhos a um componente pai se mostra um pouco desajeitada em comparação com o [Vue](components.html#Content-Distribution-with-Slots).

Nos parece que existem também diferenças filosóficas na concepção da API que, se você estiver curioso, podem ser demonstradas pela forma como cada um lida com a criação de uma [lista de tarefas simples](https://gist.github.com/chrisvfritz/9e5f2d6826af00fcbace7be8f6dccb89). É definitivamente um tanto subjetivo, mas muitos consideram a API do Vue menos complexo e melhor estruturada.

## Polymer

Polymer é outro projeto patrocinado por Google e, de fato, também foi uma fonte de inspiração para o Vue. Componentes Vue podem ser vagamente comparados com elementos customizados Polymer, e ambos fornecem um estilo de desenvolvimento semelhante. A maior diferença é que o Polymer é construído sobre os mais recentes recursos de Web Components e, portanto, requer _polyfills_ não triviais para funcionar (com um desempenho degradado) em navegadores que não suportam esses recursos de forma nativa. Em contraste, Vue funciona sem qualquer dependência externa ou _polyfills_ até o IE9.

No Polymer 1.0, a equipe fez também um sistema de _data-binding_ muito limitado, a fim de compensar o desempenho. Por exemplo, as únicas expressões suportados em _templates_ Polymer são de negação booleana e chamadas simples de métodos. Sua implementação de propriedades computadas também não é muito flexível.

Elementos customizados do Polymer são autorados em arquivos HTML, o que limita a JavaScript/CSS puro (e a recursos suportados pelos navegadores atuais). Em comparação, _single-file components_ Vue permitem facilmente usar ES2015+ e pré-processadores HTML/CSS.

Ao publicar em produção, Polymer recomenda o carregamento de tudo sob demanda com HTML Imports, o que assume navegadores adequados a esta especificação e suporte HTTP/2 tanto no servidor quanto no cliente. Isto pode ou não ser viável, dependendo de seu público-alvo e ambiente de implantação. Nos casos em que não é desejável, você terá que usar uma ferramenta especial chamada Vulcanizer para agrupar seus elementos Polymer. Nesta frente, Vue pode combinar sua característica de componentes assíncronos com o recurso de _code-splitting_ do webpack para dividir facilmente a aplicação em partes, com pacotes carregados somente quando requeridos. Isso garante compatibilidade com navegadores mais antigos, mantendo excelente desempenho no carregamento.

Também é totalmente viável oferecermos integração mais profunda entre o Vue e as especificações de Web Componentes, como elementos customizados e encapsulamento de estilos com Shadow DOM - no entanto, neste momento, estamos esperando as especificações amadurecerem e se tornarem amplamente implementadas em todos os navegadores convencionais antes de nos comprometermos a fundo com isso.

## Riot

Riot 2.0 fornece um modelo de desenvolvimento baseado em componentes muito similar (os quais são chamados de _tag_ no Riot), com uma API mínima e bem concebida. Riot e Vue provavelmente compartilham muitas filosofias de _design_. No entanto, apesar de ser um pouco mais pesado que Riot, Vue oferece algumas vantagens significativas:

- [Sistema de efeitos de transição](transitions.html). Riot não tem nenhum.
- Um roteador muito mais poderoso. No Riot, a API de rotas é extremamente mínima.
- Melhor desempenho. Riot [atravessa a árvore DOM](http://riotjs.com/compare/#virtual-dom-vs-expressions-binding) ao invés de utilizar DOM virtual, portanto sofre dos mesmos problemas de desempenho do AngularJS.
- Mais maturidade no suporte a ferramentas de _build_. Vue oferece suporte oficial a [webpack](https://github.com/vuejs/vue-loader) e [Browserify](https://github.com/vuejs/vueify), enquanto Riot deixa para a comunidade a integração com sistemas de _build_.
