# vuejs.org

This site is built with [hexo](http://hexo.io/). Site content is written in Markdown format located in `src`. Pull requests welcome!

## Developing

Start a dev server at `localhost:4000`:

```
$ npm install -g hexo-cli
$ npm install
$ hexo server
```

## Algumas considerações

- Não traduzir nome de variáveis (código fonte)
- Pode traduzir textos informativos no código fonte, como por exemplo: `<div id="level-1">Nível 1</div>`
- Não é preciso colocar expressões em inglês no itálico
- Faça os comentários do commit em INGLÊS
- Não faça PRs para o vuejs/master
- Não faça PULL ou MERGE de vuejs/master, deixe isso para o @danielschmitz

## Palavras reservadas 

Estas palavras podem ser mantidas no inglês

| debug        | bundle           | standalone  | runtime |
| ------------- |-------------| -----| --------|
| build      | import | render | alias | router
| store      | scaffolding  |   loader | bind |
| loop | for | true | false |
| number (tipo) | string (tipo) | template | feature |
| wrapper | ? | ? | ? |


## Translation Status (en to pt_br)

**Website**
- [x] Entry Page (@danielschmitz)

**Guide**
- [ ] Installation (@danielschmitz)
- [x] Introduction (@ErickPetru)
- [ ] The Vue Instance
- [x] Template Syntax (@vitorarjol)
- [ ] Computed Properties and Watchers
- [ ] Class and Style Bindings
- [ ] Conditional Rendering
- [ ] List Rendering
- [ ] Event Handling
- [ ] Form Input Bindings
- [ ] Components
- [ ] Advanced
- [ ] Transitions: Entering, Leaving, and Lists
- [ ] Transitioning State
- [x] Render Functions (@jbruni)
- [ ] Reactivity in Depth
- [ ] Custom Directives
- [ ] Mixins
- [ ] Plugins
- [ ] Single File Components
- [ ] Routing
- [ ] State Management
- [ ] Unit Testing
- [ ] Server-Side Rendering
- [ ] Migration from Vue 1.x
- [ ] Migration from Vue Router 0.7.x
- [ ] Comparison with Other Frameworks (@ErickPetru)

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
- [ ] Markdown Editor
- [ ] GitHub Commits
- [ ] Firebase + Validation
- [ ] Grid Component
- [ ] Tree View
- [ ] SVG Graph
- [ ] Modal Component
- [ ] Elastic Header
- [ ] Wrapper Component
- [ ] TodoMVC
- [ ] HackerNews Clone
