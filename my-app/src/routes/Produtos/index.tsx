import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import type { TipoProduto } from '../../types/types'
import { excluirProduto, listarProdutos, modoLocal, URL_LISTA_PROFESSOR } from '../../services/produtos'

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Produtos() {
  const [produtos, setProdutos] = useState<TipoProduto[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [busca, setBusca] = useState('')
  const [atualizacao, setAtualizacao] = useState(0)
  const [selecionado, setSelecionado] = useState<TipoProduto | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const atualizarRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.title = 'Produtos | Catálogo da aula'
    const controller = new AbortController()
    let ativo = true
    const timeout = window.setTimeout(() => controller.abort(), 20000)
    async function carregar() {
      try {
        const lista = await listarProdutos(controller.signal)
        if (ativo) setProdutos(lista)
      } catch {
        if (ativo) setErro('Não foi possível carregar a lista. Confira sua conexão e tente novamente.')
      } finally {
        window.clearTimeout(timeout)
        if (ativo) setCarregando(false)
      }
    }
    carregar()
    return () => {
      ativo = false
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [atualizacao])

  const produtosVisiveis = produtos.filter(produto => produto.nome.toLocaleLowerCase('pt-BR').includes(busca.trim().toLocaleLowerCase('pt-BR')))

  function atualizarLista() {
    setCarregando(true)
    setErro('')
    setMensagem('')
    setProdutos([])
    setAtualizacao(valor => valor + 1)
  }

  function abrirExclusao(produto: TipoProduto) {
    setSelecionado(produto)
    setErroExclusao('')
    dialogRef.current?.showModal()
  }

  async function confirmarExclusao() {
    if (!selecionado || excluindo) return
    setExcluindo(true)
    setErroExclusao('')
    try {
      await excluirProduto(selecionado.id)
      setProdutos(lista => lista.filter(produto => produto.id !== selecionado.id))
      setMensagem('Produto excluído com sucesso da API local.')
      dialogRef.current?.close()
      atualizarRef.current?.focus()
    } catch (erro) {
      setErroExclusao(erro instanceof Error ? erro.message : 'Não foi possível excluir o produto.')
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <main id="conteudo" className="pagina" tabIndex={-1}>
      <div className="pagina-topo">
        <div>
          <a className="link-fonte" href={URL_LISTA_PROFESSOR} target="_blank" rel="noopener noreferrer">Ver lista do professor ↗</a>
          <h1>Produtos</h1>
          <p className="subtitulo">{modoLocal ? 'Exercício com a API local de produtos.' : 'Lista de produtos carregada diretamente da fonte da aula.'}</p>
        </div>
        <div className="acoes">
          <button ref={atualizarRef} type="button" className="botao botao-secundario" disabled={carregando} onClick={atualizarLista}>Atualizar lista</button>
          {modoLocal && <Link className="botao" to="/cad-produto">Cadastrar produto</Link>}
        </div>
      </div>

      <div className="grupo-campo busca-produtos">
        <label htmlFor="busca-produtos">Buscar pelo nome</label>
        <input id="busca-produtos" className="campo" type="search" value={busca} onChange={event => setBusca(event.target.value)} placeholder="Ex.: mouse" />
      </div>

      {mensagem && <p className="aviso aviso-sucesso" role="status">{mensagem}</p>}
      {carregando && <p className="aviso" role="status">Carregando produtos…</p>}
      {erro && <div className="aviso aviso-erro" role="alert"><p>{erro}</p><button type="button" className="botao botao-secundario" onClick={atualizarLista}>Tentar novamente</button></div>}

      {!carregando && !erro && (produtosVisiveis.length === 0 ? (
        <p className="aviso" role="status">{produtos.length ? 'Nenhum produto encontrado para essa busca.' : 'A lista ainda não possui produtos.'}</p>
      ) : (
        <div className="tabela-container" role="region" aria-label="Tabela de produtos" tabIndex={0}>
          <table className="tabela-produtos">
            <caption className="sr-only">Produtos, preços e quantidade em estoque</caption>
            <thead><tr><th scope="col">ID</th><th scope="col">Imagem</th><th scope="col">Nome</th><th scope="col">Preço</th><th scope="col">Estoque</th>{modoLocal && <th scope="col">Ações</th>}</tr></thead>
            <tbody>
              {produtosVisiveis.map(produto => (
                <tr key={produto.id}>
                  <td>{produto.id}</td>
                  <td><ImagemProduto produto={produto} /></td>
                  <th scope="row">{produto.nome}</th>
                  <td>{moeda.format(produto.preco)}</td>
                  <td>{produto.estoque}</td>
                  {modoLocal && <td><div className="acoes"><Link className="botao botao-secundario" to={`/editar-produtos/${encodeURIComponent(produto.id)}`} aria-label={`Editar ${produto.nome}`}>Editar</Link><button type="button" className="botao botao-perigo" onClick={() => abrirExclusao(produto)} aria-label={`Excluir ${produto.nome}`}>Excluir</button></div></td>}
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan={modoLocal ? 6 : 5}>{produtosVisiveis.length} de {produtos.length} produtos</td></tr></tfoot>
          </table>
        </div>
      ))}

      <p className="nota dica-tabela">Deslize a tabela para ver todas as colunas.</p>
      {!modoLocal && <p className="nota">Esta lista é somente para consulta. As imagens são fornecidas pela fonte da aula.</p>}

      {modoLocal && <dialog ref={dialogRef} className="modal" aria-labelledby="titulo-exclusao" onCancel={event => { if (excluindo) event.preventDefault() }}>
        <h2 id="titulo-exclusao">Excluir produto?</h2>
        <p>O produto <strong>{selecionado?.nome}</strong> será removido da API local.</p>
        {erroExclusao && <p className="aviso aviso-erro" role="alert">{erroExclusao}</p>}
        <div className="acoes"><button type="button" className="botao botao-secundario" disabled={excluindo} onClick={() => dialogRef.current?.close()}>Cancelar</button><button type="button" className="botao botao-perigo" disabled={excluindo} onClick={confirmarExclusao}>{excluindo ? 'Excluindo…' : 'Confirmar exclusão'}</button></div>
      </dialog>}
    </main>
  )
}

function ImagemProduto({ produto }: { produto: TipoProduto }) {
  const [falhou, setFalhou] = useState(false)
  if (!produto.avatar || falhou) return <span className="imagem-ausente" aria-label={`Imagem de ${produto.nome} indisponível`}>Sem imagem</span>
  return <img className="miniatura-produto" src={produto.avatar} alt={`Imagem ilustrativa de ${produto.nome}`} width={52} height={52} loading="lazy" referrerPolicy="no-referrer" onError={() => setFalhou(true)} />
}
