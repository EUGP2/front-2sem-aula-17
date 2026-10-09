import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizarProdutos } from '../src/services/normalizarProdutos.ts'

const colunas = ['id', 'nome', 'preco', 'estoque', 'avatar']
const imagem = 'https://picsum.photos/200/200'
const produto = { id: '1', nome: 'Mouse', preco: 120, estoque: 33, avatar: imagem }

test('converte a matriz do professor sem incluir o cabeçalho como produto', () => {
  assert.deepEqual(normalizarProdutos([colunas, [1, 'Mouse', 120, 33, imagem]]), [produto])
})

test('encontra as colunas pelo nome, mesmo que mudem de posição', () => {
  assert.deepEqual(normalizarProdutos([['avatar', 'estoque', 'preco', 'nome', 'id'], [imagem, 33, 120, 'Mouse', 1]]), [produto])
})

test('aceita objetos da API local e converte preço e estoque para números', () => {
  assert.deepEqual(normalizarProdutos([{ ...produto, preco: '120', estoque: '33' }]), [produto])
})

test('aceita lista vazia e planilha contendo somente o cabeçalho', () => {
  assert.deepEqual(normalizarProdutos([]), [])
  assert.deepEqual(normalizarProdutos([colunas]), [])
})

test('ignora linhas em branco da planilha e preserva estoque zero', () => {
  assert.deepEqual(normalizarProdutos([colunas, ['', '', '', '', ''], [1, 'Mouse', 120, 0, imagem]]), [{ ...produto, estoque: 0 }])
})

test('preserva texto como texto, sem interpretar HTML', () => {
  const nome = '<script>alert(1)</script>'
  assert.equal(normalizarProdutos([{ ...produto, nome }])[0].nome, nome)
})

for (const [nome, dados] of [
  ['resposta fora do formato de lista', { erro: true }],
  ['coluna ausente', [['id', 'nome'], [1, 'Mouse']]],
  ['linha inválida', [colunas, null]],
  ['nome vazio', [{ ...produto, nome: '   ' }]],
  ['preço inválido', [{ ...produto, preco: 'abc' }]],
  ['preço vazio', [{ ...produto, preco: '' }]],
  ['estoque fracionado', [{ ...produto, estoque: 1.5 }]],
  ['estoque negativo', [{ ...produto, estoque: -1 }]],
  ['IDs repetidos', [produto, produto]],
]) {
  test(`recusa ${nome}`, () => assert.throws(() => normalizarProdutos(dados)))
}
