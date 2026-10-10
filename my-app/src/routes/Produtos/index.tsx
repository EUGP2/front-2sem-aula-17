import { useEffect, useRef, useState } from "react";
import type { TipoProduto } from "../../types/types";
import { Link, useNavigate } from "react-router";
import { CiEdit as Editar } from "react-icons/ci";
import { RiDeleteBin6Line as Excluir } from "react-icons/ri";
import { modoLocal, URL_LISTA_PROFESSOR } from "../../services/produtos";
import { normalizarProdutos } from "../../services/normalizarProdutos";

export default function Produtos() {

  // REF e STATE do DIALOG para o produto que será deletado na API local.
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [idExclusivo, setIdExclusivo] = useState<string>("");

  const abrirModal = (id: string) => {
    setIdExclusivo(id);
    dialogRef.current?.showModal();
  };

  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<TipoProduto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    document.title = "Produtos";
    let ativo = true;

    // Mesma requisição da aula: local no computador, lista do professor no site.
    const carregaProdutos = async () => {
      try {
        const response = await fetch(modoLocal ? "http://localhost:3001/produtos" : URL_LISTA_PROFESSOR);
        if (!response.ok) throw new Error("Não foi possível carregar os produtos.");

        const data = await response.json();
        // A planilha envia linhas; a API local já envia objetos de produto.
        if (ativo) setProdutos(normalizarProdutos(data));
      } catch (error) {
        if (ativo) setErro(error instanceof Error ? error.message : "Não foi possível carregar os produtos.");
      } finally {
        if (ativo) setCarregando(false);
      }
    };

    carregaProdutos();
    return () => { ativo = false; };
  }, []);

  const handleDelete = async () => {
    if (!modoLocal) return;
    try {
      const response = await fetch(`http://localhost:3001/produtos/${idExclusivo}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Falha na exclusão do produto.");
      alert("Produto excluído com sucesso!");
      navigate("/");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Falha na exclusão do produto.");
    }
  };

  return (
    <main>
      <a className="underline" href={URL_LISTA_PROFESSOR} target="_blank" rel="noopener noreferrer">Ver lista do professor</a>
      <h2>Produtos</h2>
      {carregando && <p>Carregando produtos...</p>}
      {erro && <p role="alert">{erro}</p>}

      {modoLocal && (
        <dialog ref={dialogRef} style={{ padding: "20px", borderRadius: "8px", border: "1px solid #ccc" }}>
          <h3>Confirmar Exclusão de Produto</h3>
          <p>Tem certeza que deseja excluir este produto?</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "15px" }}>
            <button onClick={() => dialogRef.current?.close()}>Cancelar</button>
            <button onClick={handleDelete} style={{ background: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>Excluir</button>
          </div>
        </dialog>
      )}

      <div style={{ overflowX: "auto" }}>
        <table border={1} style={{ margin: "0 auto", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOME</th>
              <th>PREÇO</th>
              <th>ESTOQUE</th>
              <th>AVATAR</th>
              {modoLocal && <th>AÇÕES</th>}
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>{p.preco}</td>
                <td>{p.estoque}</td>
                <td><img src={p.avatar} alt={p.nome} width={30} /></td>
                {modoLocal && (
                  <td>
                    <Link to={`/editar-produtos/${p.id}`}><Editar /></Link> |
                    <Excluir style={{ cursor: "pointer" }} onClick={() => abrirModal(p.id)} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={modoLocal ? 6 : 5}>Quantidade de produtos : {produtos.length}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  );
}
