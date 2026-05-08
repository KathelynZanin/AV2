import type { Aeronave, Peca, StatusPeca, TipoPeca } from "../../types";
import { PROXIMO_STATUS_PECA } from "../../constants";
import { Modal } from "../Modal/index";

type Props = {
  pecas: Peca[];
  pecasFiltradas: Peca[];
  aeronaves: Aeronave[];
  filtroTipoPeca: string;
  filtroStatusPeca: string;
  onFiltroTipoChange: (v: string) => void;
  onFiltroStatusChange: (v: string) => void;
  onNovaP: () => void;
  onAvancarStatus: (indexReal: number) => void;
  novaPeca: Peca;
  onNovaPecaChange: (p: Peca) => void;
  modalAberto: boolean;
  onSalvar: () => void;
  onCancelarModal: () => void;
};

export function PagePecas({
  pecas,
  pecasFiltradas,
  aeronaves,
  filtroTipoPeca,
  filtroStatusPeca,
  onFiltroTipoChange,
  onFiltroStatusChange,
  onNovaP,
  onAvancarStatus,
  novaPeca,
  onNovaPecaChange,
  modalAberto,
  onSalvar,
  onCancelarModal,
}: Props) {
  return (
    <section className="page page-enter">
      <div className="page-header">
        <h2>Peças</h2>
        <button onClick={onNovaP}>+ Nova peça</button>
      </div>
      <div className="filtros">
        <select value={filtroTipoPeca} onChange={(e) => onFiltroTipoChange(e.target.value)}>
          <option value="">Todos os tipos</option>
          <option value="Nacional">Nacional</option>
          <option value="Importada">Importada</option>
        </select>
        <select value={filtroStatusPeca} onChange={(e) => onFiltroStatusChange(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="Em produção">Em produção</option>
          <option value="Em transporte">Em transporte</option>
          <option value="Pronta">Pronta</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Fornecedor</th>
            <th>Aeronave</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {pecasFiltradas.map((peca, idx) => {
            const indexReal = pecas.findIndex(
              (p) =>
                p.nome === peca.nome &&
                p.aeronave === peca.aeronave &&
                p.fornecedor === peca.fornecedor
            );
            const proximoStatus = PROXIMO_STATUS_PECA[peca.status];
            return (
              <tr key={idx}>
                <td>{peca.nome}</td>
                <td>{peca.tipo}</td>
                <td>{peca.fornecedor}</td>
                <td>{peca.aeronave || "—"}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      background:
                        peca.status === "Pronta"
                          ? "#dcfce7"
                          : peca.status === "Em transporte"
                          ? "#fef3c7"
                          : "#e0f2fe",
                      color:
                        peca.status === "Pronta"
                          ? "#166534"
                          : peca.status === "Em transporte"
                          ? "#92400e"
                          : "#075985",
                    }}
                  >
                    {peca.status}
                  </span>
                </td>
                <td>
                  {proximoStatus ? (
                    <button
                      style={{ padding: "5px 12px", fontSize: 12, background: "#374151" }}
                      onClick={() => onAvancarStatus(indexReal)}
                    >
                      → {proximoStatus}
                    </button>
                  ) : (
                    <span style={{ color: "#9ca3af", fontSize: 13 }}>Finalizada</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modalAberto && (
        <Modal>
          <div className="modal-box">
            <h3>Nova Peça</h3>
            <label>
              Nome *
              <input
                type="text"
                value={novaPeca.nome}
                onChange={(e) => onNovaPecaChange({ ...novaPeca, nome: e.target.value })}
              />
            </label>
            <label>
              Tipo *
              <select
                value={novaPeca.tipo}
                onChange={(e) =>
                  onNovaPecaChange({ ...novaPeca, tipo: e.target.value as TipoPeca })
                }
              >
                <option value="Nacional">Nacional</option>
                <option value="Importada">Importada</option>
              </select>
            </label>
            <label>
              Fornecedor
              <input
                type="text"
                value={novaPeca.fornecedor}
                onChange={(e) =>
                  onNovaPecaChange({ ...novaPeca, fornecedor: e.target.value })
                }
              />
            </label>
            <label>
              Aeronave *
              <select
                value={novaPeca.aeronave}
                onChange={(e) =>
                  onNovaPecaChange({ ...novaPeca, aeronave: e.target.value })
                }
              >
                <option value="">-- escolha --</option>
                {aeronaves.map((a) => (
                  <option key={a.codigo} value={a.codigo}>
                    {a.codigo} - {a.modelo}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status inicial
              <select
                value={novaPeca.status}
                onChange={(e) =>
                  onNovaPecaChange({ ...novaPeca, status: e.target.value as StatusPeca })
                }
              >
                <option value="Em produção">Em produção</option>
                <option value="Em transporte">Em transporte</option>
                <option value="Pronta">Pronta</option>
              </select>
            </label>
            <div className="btn-group">
              <button onClick={onSalvar}>Salvar</button>
              <button className="btn-sec" onClick={onCancelarModal}>
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}