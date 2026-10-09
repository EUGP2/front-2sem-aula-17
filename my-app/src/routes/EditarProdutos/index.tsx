import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import FormularioProduto from '../../components/FormularioProduto'
import { buscarProduto, modoLocal, salvarProduto } from '../../services/produtos'
import type { DadosProduto, TipoProduto } from '../../types/types'

export default function EditarProdutos() {
  const { id } = useParams<{ id: string }>()
  // Uma mudança de ID inicia um formulário novo, sem mostrar o produto anterior.
  return <EditarProduto key={id} id={id} />
}

function EditarProduto({ id }: { id?: string }) {
  const navigate = useNavigate()
  const [produto, setProduto] = useState<TipoProduto | null>(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(modoLocal)

  useEffect(() => {
    document.title = 'Editar produto | Catálogo da aula'
    if (!modoLocal) return
    const controller = new AbortController()
    let ativo = true
    async function carregar() {
      try {
        if (!id) throw new Error('Produto não encontrado.')
        const dados = await buscarProduto(id, controller.signal)
        if (ativo) setProduto(dados)
      } catch (erro) {
        if (ativo) setErro(erro instanceof Error ? erro.message : 'Não foi possível carregar o produto.')
      } finally {
        if (ativo) setCarregando(false)
      }
    }
    carregar()
    return () => { ativo = false; controller.abort() }
  }, [id])

  async function atualizar(dados: DadosProduto) {
    if (!produto) throw new Error('Carregue o produto antes de salvar.')
    await salvarProduto(dados, produto.id)
    navigate('/produtos')
  }

  return (
    <main id="conteudo" className="pagina" tabIndex={-1}>
      <div className="pagina-topo"><div><h1>Editar produto</h1><p className="subtitulo">Atualize um produto da API local da aula.</p></div></div>
      {!modoLocal ? <div className="aviso"><p>A lista do professor é somente para consulta. A edição fica disponível no modo local, descrito no README do projeto.</p><Link className="botao" to="/produtos">Ver produtos</Link></div> : (
        <>
          {carregando && <p className="aviso" role="status">Carregando produto…</p>}
          {erro && <div className="aviso aviso-erro" role="alert"><p>{erro}</p><Link className="botao botao-secundario" to="/produtos">Voltar para produtos</Link></div>}
          {produto && <FormularioProduto key={produto.id} produto={produto} textoBotao="Salvar alterações" onSalvar={atualizar} />}
        </>
      )}
    </main>
  )
}
