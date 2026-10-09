import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import FormularioProduto from '../../components/FormularioProduto'
import { modoLocal, salvarProduto } from '../../services/produtos'
import type { DadosProduto } from '../../types/types'

export default function CadProduto() {
  const navigate = useNavigate()
  useEffect(() => { document.title = 'Cadastro | Catálogo da aula' }, [])

  async function cadastrar(dados: DadosProduto) {
    await salvarProduto(dados)
    navigate('/produtos')
  }

  return (
    <main id="conteudo" className="pagina" tabIndex={-1}>
      <div className="pagina-topo"><div><h1>Cadastrar produto</h1><p className="subtitulo">Exercício de formulário com a API local da aula.</p></div></div>
      {modoLocal ? <FormularioProduto textoBotao="Cadastrar produto" onSalvar={cadastrar} /> : <div className="aviso"><p>A lista do professor é somente para consulta. O cadastro fica disponível no modo local, descrito no README do projeto.</p><Link className="botao" to="/produtos">Ver produtos</Link></div>}
    </main>
  )
}
