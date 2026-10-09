import type { TipoProduto } from '../types/types.ts'

// A planilha envia uma matriz: a primeira linha contém os nomes das colunas.
export function normalizarProdutos(dados: unknown): TipoProduto[] {
  if (!Array.isArray(dados)) throw new Error('A lista de produtos tem um formato inválido.')
  if (dados.length === 0) return []

  let registros: unknown[] = dados

  if (Array.isArray(dados[0])) {
    const colunas = dados[0].map((coluna: unknown) => String(coluna).trim().toLowerCase())
    const campos = ['id', 'nome', 'preco', 'estoque', 'avatar']
    if (campos.some(campo => !colunas.includes(campo))) {
      throw new Error('A lista está sem uma das colunas de produto.')
    }

    registros = dados.slice(1).filter(linha => {
      if (!Array.isArray(linha)) throw new Error('Uma linha da lista é inválida.')
      return linha.some(valor => valor !== '' && valor !== null && valor !== undefined)
    }).map(linha => Object.fromEntries(campos.map(campo => [campo, linha[colunas.indexOf(campo)]])))
  }

  const ids = new Set<string>()
  return registros.map(registro => {
    if (!registro || typeof registro !== 'object' || Array.isArray(registro)) {
      throw new Error('Um produto da lista é inválido.')
    }

    const produto = registro as Record<string, unknown>
    const id = typeof produto.id === 'string' || typeof produto.id === 'number' ? String(produto.id).trim() : ''
    const nome = typeof produto.nome === 'string' ? produto.nome.trim() : ''
    const preco = numero(produto.preco)
    const estoque = numero(produto.estoque)
    if (!id || !nome || typeof produto.avatar !== 'string' || !Number.isFinite(preco) || preco < 0 || !Number.isInteger(estoque) || estoque < 0 || ids.has(id)) {
      throw new Error('Um produto está com dados inválidos ou ID repetido.')
    }

    ids.add(id)
    return { id, nome, preco, estoque, avatar: produto.avatar.trim() }
  })
}

function numero(valor: unknown): number {
  if (typeof valor === 'number') return valor
  if (typeof valor === 'string' && valor.trim() !== '') return Number(valor)
  return NaN
}
