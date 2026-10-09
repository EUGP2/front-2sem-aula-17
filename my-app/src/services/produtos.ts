import type { TipoProduto, DadosProduto } from '../types/types'
import { normalizarProdutos } from './normalizarProdutos'

export const URL_LISTA_PROFESSOR = 'https://script.google.com/macros/s/AKfycbz7yQUCSU5GKaF4w2x5Xbneo4kDzGXvKPKVNf1yL3mP-fMRc0Au9gZz5wunfERN8yhaKQ/exec'

// A API de escrita é um exercício local. O site publicado sempre consulta a lista do professor.
const apiLocal = import.meta.env.DEV ? import.meta.env.VITE_API_LOCAL_URL?.trim().replace(/\/+$/, '') : undefined
export const modoLocal = Boolean(apiLocal)

export async function listarProdutos(signal?: AbortSignal): Promise<TipoProduto[]> {
  const resposta = await fetch(apiLocal || URL_LISTA_PROFESSOR, { signal })
  if (!resposta.ok) throw new Error('Não foi possível carregar os produtos.')
  return normalizarProdutos(await resposta.json())
}

export async function buscarProduto(id: string, signal?: AbortSignal): Promise<TipoProduto> {
  const resposta = await fetch(`${urlLocal()}/${encodeURIComponent(id)}`, { signal })
  if (resposta.status === 404) throw new Error('Produto não encontrado.')
  if (!resposta.ok) throw new Error('Não foi possível carregar o produto.')
  return normalizarProdutos([await resposta.json()])[0]
}

export async function salvarProduto(dados: DadosProduto, id?: string): Promise<void> {
  const url = id ? `${urlLocal()}/${encodeURIComponent(id)}` : urlLocal()
  const resposta = await fetch(url, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(id ? { ...dados, id } : dados),
  })
  if (!resposta.ok) throw new Error('Não foi possível salvar o produto. Confira a API local.')
}

export async function excluirProduto(id: string): Promise<void> {
  const resposta = await fetch(`${urlLocal()}/${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!resposta.ok) throw new Error('Não foi possível excluir o produto. Confira a API local.')
}

function urlLocal(): string {
  if (!apiLocal) throw new Error('A lista do professor está disponível somente para consulta.')
  return apiLocal
}
