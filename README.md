# 💻 Codelabs: Aulas de Front-End

* [Roteamento, Estado e Ciclo de Vida com React Router](https://alecarlosjesus.github.io/aula-code-labs/)

## Instalação e desenvolvimento

Execute os comandos na pasta `my-app` (com hífen):

```sh
cd my-app
npm ci
npm run dev
```

O comando `npm ci` instala as versões registradas no `package-lock.json`.
Para usar a API local de produtos, execute `npm run api` em outro terminal,
também dentro de `my-app`. Essa API local não é publicada no Netlify.

## Deploy no Netlify

O arquivo `netlify.toml` na raiz define `my-app` como diretório base,
`npm run build` como comando de compilação e `dist` como pasta de publicação.
O redirecionamento para `index.html` permite acessar diretamente as rotas
da aplicação React.
