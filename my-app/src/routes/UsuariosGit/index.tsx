import { useEffect, useState } from 'react'

type UsuarioGit = {
  id: number
  login: string
  avatar_url: string
  html_url: string
}

export default function UsuariosGit() {
  const [usuarios, setUsuarios] = useState<UsuarioGit[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    document.title = 'Usuários GitHub | Aula 17'
    const controller = new AbortController()

    async function carregarUsuarios() {
      setCarregando(true)
      setErro('')

      try {
        const response = await fetch('https://api.github.com/users?per_page=24', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(response.status === 403 || response.status === 429
            ? 'O limite de consultas do GitHub foi atingido. Aguarde um pouco e tente novamente.'
            : 'Não foi possível carregar os usuários do GitHub.')
        }

        const data: unknown = await response.json()
        if (!Array.isArray(data) || !data.every((usuario) =>
          usuario && typeof usuario.id === 'number' && typeof usuario.login === 'string'
          && typeof usuario.avatar_url === 'string' && typeof usuario.html_url === 'string')) {
          throw new Error('O GitHub retornou uma lista em um formato inesperado.')
        }

        if (!controller.signal.aborted) setUsuarios(data)
      } catch (error) {
        if (!controller.signal.aborted) {
          setErro(error instanceof Error && !(error instanceof TypeError)
            ? error.message
            : 'Não foi possível carregar os usuários. Verifique sua conexão e tente novamente.')
        }
      } finally {
        if (!controller.signal.aborted) setCarregando(false)
      }
    }

    void carregarUsuarios()
    return () => controller.abort()
  }, [tentativa])

  return (
    <main id="conteudo" className="pagina" tabIndex={-1}>
      <div className="pagina-topo">
        <div>
          <p className="subtitulo">Consulta à API</p>
          <h1>Usuários GitHub</h1>
          <p>Uma lista pública de perfis. Selecione um usuário para abrir o perfil no GitHub.</p>
        </div>
      </div>

      {carregando && <p className="aviso" role="status">Carregando usuários…</p>}
      {erro && <div className="aviso aviso-erro" role="alert">
        <p>{erro}</p>
        <button className="botao botao-secundario" type="button" onClick={() => setTentativa((valor) => valor + 1)}>Tentar novamente</button>
      </div>}
      {!carregando && !erro && (usuarios.length === 0
        ? <p className="aviso" role="status">Nenhum usuário foi encontrado.</p>
        : <>
          <p className="total-lista">{usuarios.length} usuários · os perfis abrem em uma nova aba</p>
          <ul className="grade-usuarios">
            {usuarios.map((usuario) => <li key={usuario.id}>
              <a className="usuario" href={usuario.html_url} target="_blank" rel="noopener noreferrer">
                <img src={usuario.avatar_url} alt="" width={56} height={56} loading="lazy" />
                <div><h2>{usuario.login}</h2><p>Ver perfil <span aria-hidden="true">↗</span></p></div>
              </a>
            </li>)}
          </ul>
        </>)}
    </main>
  )
}
