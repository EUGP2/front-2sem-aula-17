import { Outlet } from 'react-router'
import Cabecalho from "./components/Cabecalho"
import Rodape from "./components/Rodape"
export default function App() {
  return (
    <div className="app-layout">
      <a className="pular-conteudo" href="#conteudo">Pular para o conteúdo</a>
      <Cabecalho/>
      <Outlet/>
      <Rodape/>
    </div>

  )
}
