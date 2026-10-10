# Front-end — Aula 17

Projeto da aula com React, TypeScript e React Router.
[Codelabs do professor](https://alecarlosjesus.github.io/aula-code-labs/).

## Acompanhar a aula

Na pasta `my-app`, execute `npm ci` e `npm run dev`.
Em outro terminal, na mesma pasta, execute `npm run api`.
Use Node 22.22 ou mais recente.

No computador, os produtos, cadastro, edição e exclusão usam o `db.json`
do json-server, como no exemplo da aula.
No site publicado, Produtos exibe somente a lista do professor, sem alterá-la.
O link para a fonte fica acima do título da página.

Foram mantidos os componentes e as páginas simples da aula, com as cores verdes
no cabeçalho e rodapé. O fundo do rodapé ocupa toda a largura da tela.

## Conferir e publicar

`npm run lint`, `npm run build` e `npm test`.
No Vercel, a raiz do projeto é `my-app` e a saída do build é `dist`.
O `vercel.json` mantém as rotas funcionando ao abrir diretamente pelo endereço.
A configuração existente do Netlify também foi preservada.
