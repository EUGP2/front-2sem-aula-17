import { useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import type { DadosProduto } from '../../types/types'

type Props = {
  produto?: DadosProduto
  textoBotao: string
  onSalvar: (dados: DadosProduto) => Promise<void>
}

export default function FormularioProduto({ produto, textoBotao, onSalvar }: Props) {
  const [erro, setErro] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DadosProduto>({
    defaultValues: produto || { nome: '', preco: 0, estoque: 0, avatar: '' },
  })

  async function enviar(dados: DadosProduto) {
    setErro('')
    try {
      await onSalvar({ ...dados, nome: dados.nome.trim(), avatar: dados.avatar.trim() })
    } catch (erro) {
      setErro(erro instanceof Error ? erro.message : 'Não foi possível salvar o produto.')
    }
  }

  return (
    <form className="formulario" onSubmit={handleSubmit(enviar)} noValidate>
      {erro && <p className="aviso aviso-erro" role="alert">{erro}</p>}
      <fieldset disabled={isSubmitting}>
        <legend>Dados do produto</legend>
        <div className="grade-formulario">
          <div className="grupo-campo campo-largo">
            <label htmlFor="nome">Nome do produto</label>
            <input id="nome" className="campo" type="text" aria-invalid={!!errors.nome} aria-describedby={errors.nome ? 'erro-nome' : undefined} {...register('nome', { validate: valor => valor.trim().length >= 3 || 'Digite um nome com pelo menos 3 caracteres.' })} />
            {errors.nome && <p id="erro-nome" className="erro-campo">{errors.nome.message}</p>}
          </div>
          <div className="grupo-campo">
            <label htmlFor="preco">Preço (R$)</label>
            <input id="preco" className="campo" type="number" min="0.01" step="0.01" aria-invalid={!!errors.preco} aria-describedby={errors.preco ? 'erro-preco' : undefined} {...register('preco', { valueAsNumber: true, validate: valor => (Number.isFinite(valor) && valor > 0) || 'Digite um preço maior que zero.' })} />
            {errors.preco && <p id="erro-preco" className="erro-campo">{errors.preco.message}</p>}
          </div>
          <div className="grupo-campo">
            <label htmlFor="estoque">Quantidade em estoque</label>
            <input id="estoque" className="campo" type="number" min="0" step="1" aria-invalid={!!errors.estoque} aria-describedby={errors.estoque ? 'erro-estoque' : undefined} {...register('estoque', { valueAsNumber: true, validate: valor => (Number.isInteger(valor) && valor >= 0) || 'Digite uma quantidade inteira, igual ou maior que zero.' })} />
            {errors.estoque && <p id="erro-estoque" className="erro-campo">{errors.estoque.message}</p>}
          </div>
          <div className="grupo-campo campo-largo">
            <label htmlFor="avatar">URL da imagem</label>
            <input id="avatar" className="campo" type="url" placeholder="https://…" aria-invalid={!!errors.avatar} aria-describedby={errors.avatar ? 'erro-avatar' : undefined} {...register('avatar', { validate: valor => {
              try { return ['http:', 'https:'].includes(new URL(valor.trim()).protocol) || 'Use uma URL http ou https.' }
              catch { return 'Digite uma URL válida para a imagem.' }
            } })} />
            {errors.avatar && <p id="erro-avatar" className="erro-campo">{errors.avatar.message}</p>}
          </div>
        </div>
        <div className="acoes"><button type="submit" className="botao">{isSubmitting ? 'Salvando…' : textoBotao}</button><Link className="botao botao-secundario" to="/produtos">Cancelar</Link></div>
      </fieldset>
    </form>
  )
}
