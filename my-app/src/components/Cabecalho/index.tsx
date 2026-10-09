import Menu from '../Menu'
import { Link } from 'react-router'

export default function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="cabecalho-conteudo">
        <Link className="marca" to="/" aria-label="Front-end, aula 17: início">
          <span className="marca-simbolo" aria-hidden="true">F</span>
          <span>Front-end <small>Aula 17</small></span>
        </Link>
        <Menu />
      </div>
    </header>
  )
}
