# Front-end — Aula 17

Projeto de estudo com React, TypeScript e React Router, a partir do exemplo da
turma. [Codelabs do professor](https://alecarlosjesus.github.io/aula-code-labs/).

## O que tem no projeto

- Início com navegação e o exemplo de destructuring da aula.
- Produtos da [lista do professor](https://script.google.com/macros/s/AKfycbz7yQUCSU5GKaF4w2x5Xbneo4kDzGXvKPKVNf1yL3mP-fMRc0Au9gZz5wunfERN8yhaKQ/exec), com busca, preço em reais e estoque.
- Consulta de usuários da API do GitHub.
- Cadastro, edição e exclusão preservados como exercícios **locais**.

Em Produtos, `useEffect` faz a requisição e `useState` guarda a lista.
O serviço converte as linhas da planilha em objetos, sem exibir o cabeçalho
como produto. A lista do professor é somente consultada; não recebe gravações.

## Rodar no computador

Use Node 22.22 ou mais recente. Execute dentro da pasta `my-app` (com hífen):

```sh
cd my-app
npm ci
npm run dev
```

A consulta online funciona sem `json-server` e sem arquivo `.env`.
Para conferir o código: `npm run lint`, `npm run build` e `npm test`.

## Exercício opcional com API local

Dentro de `my-app`, copie `.env.example` para `.env.local` e inicie
`npm run api` em outro terminal. Reinicie `npm run dev`.
Nesse modo, o menu libera Cadastro e a tabela libera Editar/Excluir.
Os dados pertencem ao `db.json` local, não à lista do professor.

## Publicação

No Vercel, o diretório do projeto é `my-app`, o build é `npm run build` e a
saída é `dist`. O `vercel.json` permite abrir diretamente as rotas da aplicação.

O `netlify.toml` mantém a configuração existente: base `my-app`, comando
`npm run build`, publicação de `dist`, Node 24 e fallback para `index.html`.
O site publicado sempre usa a lista online do professor, mesmo se existir
configuração local no ambiente de desenvolvimento.

Arquivos `.env.local`, dependências, build e capturas de teste não devem entrar
nos commits. O histórico do projeto e a origem do material da aula são preservados.
