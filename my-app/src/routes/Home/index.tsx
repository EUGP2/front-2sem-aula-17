import { useEffect } from 'react'
import { Link } from 'react-router'

export default function Home() {
  useEffect(() => {
    document.title = 'Início | Aula 17'
  }, [])

  const estojo = { lapis: 'preto', caneta: 'azul', borracha: 'branca' }
  const { lapis, caneta } = estojo
  const jogos = ['Sonic', 'Mario', 'Zelda']
  const [sonic, mario, zelda] = jogos

  return (
    <main id="conteudo" className="pagina" tabIndex={-1}>
      <div className="apresentacao">
        <p className="subtitulo">Exercício de front-end</p>
        <h1>Rotas e dados na prática</h1>
        <p>Um projeto de aula para navegar entre páginas e consultar listas usando React.</p>
      </div>

      <div className="grade-home">
        <section className="cartao">
          <span className="cartao-numero" aria-hidden="true">01</span>
          <h2>Produtos</h2>
          <p>Consulte os produtos da lista disponibilizada pelo professor.</p>
          <Link className="botao" to="/produtos">Ver produtos <span aria-hidden="true">→</span></Link>
        </section>
        <section className="cartao">
          <span className="cartao-numero" aria-hidden="true">02</span>
          <h2>Usuários GitHub</h2>
          <p>Veja uma lista de usuários carregada diretamente da API do GitHub.</p>
          <Link className="botao botao-secundario" to="/users/git">Ver usuários <span aria-hidden="true">→</span></Link>
        </section>
      </div>

      <section className="exercicio" aria-labelledby="titulo-exercicio">
        <h2 id="titulo-exercicio">Exemplo de destructuring</h2>
        <p>Separando valores de um objeto e de um array, como no exercício da aula.</p>
        <dl className="exercicio-valores">
          <div><dt>Estojo</dt><dd>Lápis {lapis} e caneta {caneta}.</dd></div>
          <div><dt>Jogos</dt><dd>{sonic}, {mario} e {zelda}.</dd></div>
        </dl>
      </section>
    </main>
  )
}
