import { useEffect } from 'react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

export default function Error() {
  const erro = useRouteError()
  const naoEncontrada = isRouteErrorResponse(erro) && erro.status === 404

  useEffect(() => {
    document.title = naoEncontrada ? 'Página não encontrada | Aula 17' : 'Erro | Aula 17'
  }, [naoEncontrada])

  return (
    <main id="conteudo" className="pagina pagina-erro" tabIndex={-1}>
      <p className="subtitulo">{naoEncontrada ? 'Erro 404' : 'Algo deu errado'}</p>
      <h1>{naoEncontrada ? 'Página não encontrada' : 'Não foi possível abrir esta página'}</h1>
      <p>{naoEncontrada ? 'O endereço pode estar incorreto ou a página não existe.' : 'Tente voltar ao início e abrir a página novamente.'}</p>
      <Link className="botao" to="/">Voltar ao início</Link>
    </main>
  )
}
