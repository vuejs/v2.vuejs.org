# br.vuejs.org

Este é o repositório oficial da tradução em português brasileiro do _site_ [vuejs.org](http://www.vuejs.org/). O _site_ foi construído com [hexo](http://hexo.io/) e seu conteúdo é escrito em formato _Markdown_, localizado na pasta `src`. _Pull requests_ são bem-vindos!

## Situação da tradução

A tradução atualmente é um trabalho em progresso. Situação de cada página do _site_:

**Website**
- [x] Tela Principal (Tradução: @danielschmitz, @ErickPetru. Revisão 2.2: @ErickPetru)
- [x] Menus e barras (Tradução: @ErickPetru. Revisão 2.2: @ErickPetru)

**Guide**
- [X] Installation (Tradução: @danielschmitz, @ErickPetru. Revisão 2.2: @ErickPetru)
- [X] Introduction (Tradução: @ErickPetru. Revisão 2.2: @ErickPetru)
- [X] The Vue Instance (Tradução: @danielschmitz. Revisão 2.2: @ErickPetru)
- [X] Template Syntax (Tradução: @vitorarjol. Revisão 2.2: @ErickPetru)
- [ ] Computed Properties and Watchers (Tradução: @danielschmitz. Revisão 2.2: @ErickPetru)
- [ ] Class and Style Bindings (Tradução: @gidenilson. Revisão 2.2: **pendente**)
- [ ] Conditional Rendering (Tradução: @gidenilson. Revisão 2.2: **pendente**)
- [ ] List Rendering (Tradução: @ErickPetru. Revisão 2.2: **pendente**)
- [ ] Event Handling (Tradução: @gidenilson. Revisão 2.2: **pendente**)
- [ ] Form Input Bindings(Tradução: @gidenilson. Revisão 2.2: **pendente**)
- [ ] Components (Tradução: **pendente**)
- [ ] Reactivity in Depth (Tradução: @gidenilson. Revisão 2.2: **pendente**)
- [ ] Transition Effects (Tradução: @jbruni, @NicholasPedroso. Revisão 2.2: **pendente**)
- [ ] Transitioning State (Tradução: **pendente**)
- [ ] Render Functions (Tradução: @jbruni. Revisão 2.2: **pendente**)
- [ ] Custom Directives (Tradução: @gidenilson. Revisão 2.2: **pendente**)
- [ ] Mixins (Tradução: @jbruni. Revisão 2.2: **pendente**)
- [ ] Plugins (Tradução: @jbruni. Revisão 2.2: **pendente**)
- [ ] Single File Components (Tradução: @ErickPetru. Revisão 2.2: **pendente**)
- [ ] Production Deployment Tips (Tradução: @vitorarjol. Revisão 2.2: **pendente**)
- [ ] Routing (Tradução: @natanaelphp. Revisão 2.2: **pendente**)
- [ ] State Management (Tradução: @ErickPetru. Revisão 2.2: **pendente**)
- [ ] Unit Testing (Tradução: @capaci. Revisão 2.2: **pendente**)
- [ ] Server-Side Rendering (Tradução: @ErickPetru. Revisão 2.2: **pendente**)
- [ ] Migration from Vue 1.x (Tradução: **pendente**)
- [ ] Migration from Vue Router 0.7.x (Tradução: @ErickPetru. Revisão 2.2: **pendente**)
- [ ] Migration from Vuex 0.6.x to 1.0 (Tradução: @ErickPetru. Revisão 2.2: **pendente**)
- [ ] Comparison with Other Frameworks (Tradução: @ErickPetru. Revisão 2.2: **pendente**)
- [ ] Join the Vue.js Community! (Tradução: **pendente**)

**API**
- [x] Global Config (Tradução: @theus. Revisão 2.2: @theus)
- [ ] Global API
- [ ] Options / Data
- [ ] Options / DOM (Tradução: @guilherme-dev. Revisão 2.2: **pendente**)
- [ ] Options / Lifecycle Hooks (Tradução: @guilherme-dev. Revisão 2.2: **pendente**)
- [ ] Options / Assets
- [ ] Options / Composition
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
- [ ] Markdown Editor (Tradução: @vitorarjol. Revisão 2.2: **pendente**)
- [ ] GitHub Commits (Tradução: @vitorarjol. Revisão 2.2: **pendente**)
- [ ] Firebase + Validation (Tradução: @vitorarjol. Revisão 2.2: **pendente**)
- [ ] Grid Component (Tradução: @vitorarjol. Revisão 2.2: **pendente**)
- [ ] Tree View (Tradução: @vitorarjol. Revisão 2.2: **pendente**)
- [ ] SVG Graph (Tradução: @vitorarjol. Revisão 2.2: **pendente**)
- [ ] Modal Component (Tradução: @vitorarjol. Revisão 2.2: **pendente**)
- [ ] Elastic Header (Tradução: @vitorarjol. Revisão 2.2: **pendente**)
- [ ] Wrapper Component (Tradução: @vitorarjol. Revisão 2.2: **pendente**)
- [ ] TodoMVC (Tradução: @vitorarjol. Revisão 2.2: **pendente**)
- [ ] HackerNews Clone (Tradução: @vitorarjol. Revisão 2.2: **pendente**)

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

- Traduzir os comentários dos códigos-fonte;
- Traduzir os textos informativos dos códigos-fonte, por exemplo: `<div id="level-1">Nível 1</div>`;
- Seguir maiúsculas e minúsculas conforme o original em inglês, mantendo a notação sempre que possível;
- Utilizar alguma extensão para ortografia e gramática, para evitar que erros deste tipo passem;
- Embora não obrigatório, sugere-se usar _itálico_ em expressões sem tradução (por exemplo, _view layer_);
- Quando for submeter, **sempre escreva os comentários do _commit_ em INGLÊS**.

E algumas recomendações do que não fazer:

- Não traduzir nomes de variáveis, métodos, dados, _ids_, classes etc. nos códigos-fonte.
- Não faça _pull request_ diretamente para `vuejs/master`, o processo de tradução deve passar por esse repositório.
- Não faça _pull_ ou _merge_ diretamente de `vuejs/master`, faça apenas deste repositório para seu _fork_ pessoal.

### Traduções padronizadas

Alguns termos recorrentes no guia devem ser traduzidos sempre da mesma maneira, desde que a tradução não atrapalhe o contexto da frase:

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

Atualmente recomenda-se que estes termos sejam mantidos em inglês: _standalone_, _runtime_, _build_, _alias_, _store_, _scaffolding_ _loader_, _bind_, _loop_, true, false, Number, String, _template_,_wrapper_, _hot-reload_, _hook_.

### Discussões entre a equipe

Durante a tradução, se sentir necessidade de sugerir novos termos para alguma das listas de padronização, abra uma nova _Issue_ para discussão. Se precisar apontar problemas específicos em algum item já traduzido, o caminho também é esse.

Se for necessário se apronfundar em discussões maiores, tirar dúvidas ou mesmo interagir de qualquer outra forma com a equipe, participe de nosso [canal de tradução no Slack](https://vuejs-brasil.slack.com/messages/traducao).
