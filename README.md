# br.vuejs.org

Este é o repositório oficial da tradução em português brasileiro do _site_ [vuejs.org](http://www.vuejs.org/). O _site_ foi construído com [hexo](http://hexo.io/) e seu conteúdo é escrito em formato _Markdown_, localizado na pasta `src`. _Pull requests_ são bem-vindos!

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
- *Computed Properties* = Dados Computados
- *Single-File Components* = Componentes Single-File
- *Custom Elements* = Elementos Personalizados
- *Performance* = Desempenho
- *Watchers* = Observadores

### Termos não traduzidos

Atualmente recomenda-se que estes termos sejam mantidos em inglês: _getter_, _setter_, _standalone_, _runtime_, _build_, _alias_, _store_, _scaffolding_ _loader_, _bind_, _loop_, true, false, Number, String, _template_, _wrapper_, _hot-reload_, _hook_.

### Discussões entre a equipe

Durante a tradução, se sentir necessidade de sugerir novos termos para alguma das listas de padronização, abra uma nova _Issue_ para discussão. Se precisar apontar problemas específicos em algum item já traduzido, o caminho também é esse.

Se for necessário se apronfundar em discussões maiores, tirar dúvidas ou mesmo interagir de qualquer outra forma com a equipe, participe de nosso [canal de tradução no Slack](https://vuejs-brasil.slack.com/messages/traducao).
