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
- [ ] Components (@danielschmitz)
- [ ] Transitions: Entering, Leaving, and Lists
- [ ] Transitioning State
- [x] Render Functions (@jbruni)
- [x] Reactivity in Depth (@gidenilson)
- [ ] Custom Directives
- [x] Mixins (@jbruni)
- [x] Plugins (@jbruni)
- [x] Single File Components (@ErickPetru)
- [ ] Routing (@natanaelphp)
- [x] State Management (@ErickPetru)
- [x] Unit Testing (@capaci)
- [ ] Server-Side Rendering
- [ ] Migration from Vue 1.x
- [ ] Migration from Vue Router 0.7.x
- [x] Migration from Vuex 0.6.x to 1.0 (@ErickPetru)
- [x] Comparison with Other Frameworks (@ErickPetru)
- [ ] Deployment

**API**
- [ ] Global Config
- [ ] Global API
- [ ] Options / Data
- [ ] Options / DOM
- [ ] Options / Lifecycle Hooks
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
