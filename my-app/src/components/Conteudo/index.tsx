import { useState } from 'react'

// Exemplo da aula: o estado atualiza a tela quando o nome muda.
export default function Conteudo() {
  const nomeComum = 'Flávio'
  const [nomeState, setNomeState] = useState('Juquinha')

  function alterarNome() {
    const novoNome = prompt('Digite o novo nome:')
    if (novoNome?.trim()) setNomeState(novoNome.trim())
  }

  return (
    <section className="exercicio">
      <h2>Exemplo de estado</h2>
      <p>Nome inicial: {nomeComum}</p>
      <p>Nome no estado: {nomeState}</p>
      <button type="button" className="botao" onClick={alterarNome}>Alterar nome</button>
    </section>
  )
}
