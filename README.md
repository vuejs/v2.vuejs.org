# vuejs.org

This site is built with [hexo](http://hexo.io/). Site content is written in Markdown format located in `src`. Pull requests welcome!

## Developing

Start a dev server at `localhost:4000`:

```
$ npm install -g hexo-cli
$ npm install
$ hexo server
```

## Como Proceder

- Faça um fork deste repo na sua conta
- Edite o arquivo README.md inserindo o seu login ao lado da página que deseja traduzir
- Faça um Pull Request do README e você já poderá começar a traduzir a página
- Para finalizar, faça um Pull Request da página em questão

## Algumas considerações

- Não traduzir nome de variáveis (código fonte)
- Pode traduzir textos informativos no código fonte, como por exemplo: `<div id="level-1">Nível 1</div>`
- Não é preciso colocar expressões em inglês no itálico
- Faça os comentários do commit em INGLÊS
- Não faça PRs para o vuejs/master
- Não faça PULL ou MERGE de vuejs/master, deixe isso para o @danielschmitz

### Palavras padronizadas

- *Computed Properties* = Propriedades Computadas
- *Watchers* = Observadores
- *Single-File Components* = Componentes Single-File
- *Custom Elements* = Elementos Personalizados
- *Performance* = Desempenho

## Palavras reservadas

Estas palavras podem ser mantidas no inglês

| debug        | bundle           | standalone  | runtime |
| ------------- |-------------| -----| --------|
| build      | import | render | alias | router
| store      | scaffolding  |   loader | bind |
| loop | for | true | false |
| number (tipo) | string (tipo) | template | feature |
| wrapper | hot-reload | hook | ? |


## Translation Status (en to pt_br)

**Website**
- [x] Entry Page (@danielschmitz)

**Guide**
- [x] Installation (@danielschmitz)
- [x] Introduction (@ErickPetru)
- [x] The Vue Instance (@danielschmitz)
- [x] Template Syntax (@vitorarjol)
- [x] Computed Properties and Watchers (@danielschmitz)
- [x] Class and Style Bindings (@gidenilson)
- [x] Conditional Rendering (@gidenilson)
- [x] List Rendering (@ErickPetru)
- [x] Event Handling (@gidenilson)
- [x] Form Input Bindings(@gidenilson)
- [ ] Components (@NicholasPedroso)
- [x] Transitions: Entering, Leaving, and Lists (@jbruni, @NicholasPedroso)
- [ ] Transitioning State (@diegoleme)
- [x] Render Functions (@jbruni)
- [x] Reactivity in Depth (@gidenilson)
- [x] Custom Directives (@gidenilson)
- [x] Mixins (@jbruni)
- [x] Plugins (@jbruni)
- [x] Single File Components (@ErickPetru)
- [X] Routing (@natanaelphp)
- [x] State Management (@ErickPetru)
- [x] Unit Testing (@capaci)
- [x] Server-Side Rendering (@ErickPetru)
- [ ] Migration from Vue 1.x
- [x] Migration from Vue Router 0.7.x (@ErickPetru)
- [x] Migration from Vuex 0.6.x to 1.0 (@ErickPetru)
- [x] Comparison with Other Frameworks (@ErickPetru)
- [x] Deployment (@vitorarjol)

**API**
- [x] Global Config (@theus)
- [ ] Global API
- [ ] Options / Data
- [x] Options / DOM (@guilherme-dev)
- [x] Options / Lifecycle Hooks (@guilherme-dev)
- [ ] Options / Misc
- [ ] Instance Properties
- [ ] Instance Methods / Data
- [ ] Instance Methods / Events
- [ ] Instance Methods / Lifecycle
- [ ] Directives
- [ ] Special Attributes
- [ ] Built-In Components
- [ ] VNode Interface
- [ ] Server-Side Rendering

**Examples**
- [x] Markdown Editor (@vitorarjol)
- [x] GitHub Commits (@vitorarjol)
- [x] Firebase + Validation (@vitorarjol)
- [x] Grid Component (@vitorarjol)
- [x] Tree View (@vitorarjol)
- [x] SVG Graph (@vitorarjol)
- [x] Modal Component (@vitorarjol)
- [x] Elastic Header (@vitorarjol)
- [x] Wrapper Component (@vitorarjol)
- [x] TodoMVC (@vitorarjol)
- [x] HackerNews Clone (@vitorarjol)
=======
## On Translations

Translation for this documentation project are currently mantained in separate repositories forked from this original one.

### Mandarin

* Translation Repo - [/vuejs/cn.vuejs.org](https://github.com/vuejs/cn.vuejs.org)

### Japanese

Japanese translation is maintained by [Vue.js japan user group](https://github.com/vuejs-jp)

* Translation Repo - [/vuejs/jp.vuejs.org](https://github.com/vuejs/jp.vuejs.org)
* Primary maintainer - [kazupon](https://github.com/kazupon)

### Russian

Russian translation is maintained by Translation Gang.

* Translation Repo — [/translation-gang/ru.vuejs.org](https://github.com/translation-gang/ru.vuejs.org)
* Primary maintainer - [Grigoriy Beziuk](https://gbezyuk.github.io)

### Italian

* Translation Repo - [/vuejs/it.vuejs.org](https://github.com/vuejs/it.vuejs.org)

### Korean

Korean translation is maintained by [Vue.js Korean User group](https://github.com/vuejs-kr).

* Translation Repo - [/vuejs-kr/kr.vuejs.org](https://github.com/vuejs-kr/kr.vuejs.org)
* Primary maintainer - [ChangJoo Park](https://github.com/ChangJoo-Park)

### French

French translation is maintained by Vuejs-FR.

* Translation Repo — [/vuejs-fr/vuejs.org](https://github.com/vuejs-fr/vuejs.org)

### Want to help with the translation?

If you feel okay with translating sorta alone, just fork the repo, create a "work-in-progress" issue to inform others that you're doing the translation, and just go on.

If you are more of a team player, maybe Translation Gang is for you? Then just let us know somehow that you're ready to join this international open-source translators community. Feel free to contact [Grigoriy Beziuk](https://gbezyuk.github.io) or anybody else from [the team](https://github.com/orgs/translation-gang/people).

And thank you in advance ;)
