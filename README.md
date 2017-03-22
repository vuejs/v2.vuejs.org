# br.vuejs.org

Este é o repositório oficial da tradução em português brasileiro do site do framework JavaScript progressivo [Vue.js](http://www.vuejs.org/). Este site é construído com [hexo](http://hexo.io/). O conteúdo é escrito em formato _Markdown_ e está localizado na pasta `src`. _Pull requests_ são bem-vindos!

## Como colaborar?

Para participar traduzindo/revisando os conteúdos, siga os passos:

- Faça um _fork_ deste repositório para sua própria conta;
- Edite o arquivo `README` registrando seu usuário ao lado da página que deseja traduzir/revisar;
- Faça um _pull request_ do `README` para que todos aqui sejam notificados e não ocorram trabalhos repetidos em paralelo.
- Ao finalizar, faça um novo _pull request_ com os arquivos modificados por você.
- Não se esqueça de fazer um _merge_ para obter as alterações mais recentes antes de recomeçar o processo assumindo outra tradução/revisão.

Caso não consiga terminar por completo algum arquivo, mas queira enviar o trabalho parcial, pedimos que abra uma nova _Issue_ logo após a submissão para informar quais problemas persistem no arquivo enviado.

## Ambiente de desenvolvimento

Após clonar seu repositório, inicie um servidor de desenvolvimento em `localhost:4000`:

```
$ npm install -g hexo-cli
$ npm install
$ hexo server
```

## Considerações para padronização

A fim de obtermos uma documentação padronizada, seguem recomendações do que fazer:

- Seguir maiúsculas e minúsculas conforme o texto original em inglês, mantendo a mesma notação sempre que possível;
- Traduzir os comentários dos códigos-fonte;
- Traduzir os textos informativos dos códigos-fonte, por exemplo: `<div id="level-1">Nível 1</div>`;
- Utilizar alguma extensão de apoio para ortografia e gramática durante a tradução, para evitar que erros deste tipo passem;
- Embora não seja obrigatório, sugere-se marcar em itálico expressões sem tradução que permanecerem no texto (por exemplo, _view layer_);
- Quando for submeter, **sempre escreva os comentários do _commit_ em INGLÊS**.

E algumas recomendações do que não fazer:

- Não traduzir nomes de variáveis, métodos, dados, _ids_, classes etc. nos códigos-fonte.
- Não faça _pull request_ diretamente para `vuejs/master`, o processo de tradução deve passar por esse repositório.
- Não faça _pull_ ou _merge_ diretamente de `vuejs/master`, faça apenas deste repositório para seu _fork_ pessoal.

### Traduções padronizadas

Alguns termos recorrentes no guia devem ser traduzidos sempre da mesma maneira:

- *Bundle* = Pacote
- *Debug* = Depuração
- *Handling* = Manipulação
- *Event Listening* = Escuta de Eventos
- *Render Funcion* = Função de Renderização
- *Computed Properties* = Propriedades Computadas
- *Single-File Components* = Componentes Single-File
- *Custom Elements* = Elementos Personalizados
- *Performance* = Desempenho
- *Watchers* = Observadores

### Termos não traduzidos

Atualmente recomenda-se que estes termos sejam mantidos em inglês: _bundle_,_standalone_, _runtime_, _build_, _alias_, _store_, _scaffolding_ _loader_, _bind_, _loop_, true, false, Number, String, _template_,_wrapper_, _hot-reload_, _hook_.

Durante a tradução, se sentir necessidade de sugerir novos para alguma dessas duas listas, abra uma nova _Issue_ para discussão.

## Situação da tradução

A tradução atualmente é um trabalho em progresso. Observar que todos os itens já marcados como traduzidos ainda carecem de revisão.

**Website**
- [x] Tela Principal (@danielschmitz, @ErickPetru)
- [x] Menus e barras (@ErickPetru)

**Guide**
- [ ] Installation (@danielschmitz, @ErickPetru)
- [ ] Introduction (@ErickPetru)
- [ ] The Vue Instance (@danielschmitz, @ErickPetru)
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
