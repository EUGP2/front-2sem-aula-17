export type TipoProduto = {
  id: string
  nome: string
  preco: number
  estoque: number
  avatar: string
}

export type DadosProduto = Omit<TipoProduto, 'id'>
