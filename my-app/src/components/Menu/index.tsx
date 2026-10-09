import { NavLink } from 'react-router'
import { modoLocal } from '../../services/produtos'

export default function Menu() {
    return (
        <nav aria-label="Navegação principal">
            <ul className="menu">
                <li><NavLink to="/" end>Início</NavLink></li>
                <li><NavLink to="/produtos">Produtos</NavLink></li>
                <li><NavLink to="/users/git">Usuários GitHub</NavLink></li>
                {modoLocal && <li><NavLink to="/cad-produto/">Cadastrar produto</NavLink></li>}
            </ul>
        </nav>
    )
}
