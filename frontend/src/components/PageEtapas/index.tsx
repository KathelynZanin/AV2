import type { Aeronave, Etapa, Funcionario } from "../../types";
import { BadgeNivel } from "../BadgeNivel";
import { Modal } from "../Modal/index";

type Props = {
  etapas: Etapa[];
  aeronaves: Aeronave[];
  funcionarios: Funcionario[];
  aeronaveEtapaSelecionada: string;
  onAeronaveChange: (v: string) => void;
  onAvancarStatus: (index: number) => void;
  onAbrirAssociar: (index: number) => void;
  onRemoverFuncionario: (etapaIndex: number, funcId: number) => void;
  onNovaEtapa: () => void;

  novaEtapa: Etapa;
  onNovaEtapaChange: (e: Etapa) => void;
  modalEtapaAberto: boolean;
  onSalvarEtapa: () => void;
  onCancelarEtapa: () => void;

  modalAssociarAberto: boolean;
  etapaAssociarIndex: number | null;
  funcionarioParaAssociar: string;
  onFuncionarioAssociarChange: (v: string) => void;
  onAssociar: () => void;
  onCancelarAssociar: () => void;
};

export function PageEtapas({
  etapas,
  aeronaves,
  funcionarios,
  aeronaveEtapaSelecionada,
  onAeronaveChange,
  onAvancarStatus,
  onAbrirAssociar,
  onRemoverFuncionario,
  onNovaEtapa,
  novaEtapa,
  onNovaEtapaChange,
  modalEtapaAberto,
  onSalvarEtapa,
  onCancelarEtapa,
  modalAssociarAberto,
  etapaAssociarIndex,
  funcionarioParaAssociar,
  onFuncionarioAssociarChange,
  onAssociar,
  onCancelarAssociar,
}: Props) {
  const etapasDaAeronave = etapas
    .map((e, i) => ({ ...e, originalIndex: i }))
    .filter((e) => e.aeronave === aeronaveEtapaSelecionada);

  return (
    <section className="page page-enter">
      <div className="page-header">
        <h2>Etapas de Produção</h2>
        <button onClick={onNovaEtapa}>+ Nova etapa</button>
      </div>
      <label>
        Selecionar aeronave
        <select
          value={aeronaveEtapaSelecionada}
          onChange={(e) => onAeronaveChange(e.target.value)}
        >
          <option value="">-- escolha --</option>
          {aeronaves.map((aeronave) => (
            <option key={aeronave.codigo} value={aeronave.codigo}>
              {aeronave.codigo} - {aeronave.modelo}
            </option>
          ))}
        </select>
      </label>

      {!aeronaveEtapaSelecionada && (
        <div className="vazio">Selecione uma aeronave para ver as etapas.</div>
      )}

      {aeronaveEtapaSelecionada && etapasDaAeronave.length === 0 && (
        <div className="vazio">Nenhuma etapa cadastrada para esta aeronave.</div>
      )}

      {aeronaveEtapaSelecionada && etapasDaAeronave.length > 0 && (
        <div className="lista-etapas">
          {etapasDaAeronave.map((etapa) => {
            const index = etapa.originalIndex;
            const funcsAssociados = funcionarios.filter((f) =>
              etapa.funcionariosIds.includes(f.id)
            );
            const funcsDisponiveis = funcionarios.filter(
              (f) => !etapa.funcionariosIds.includes(f.id)
            );

            return (
              <div
                key={etapa.nome + index}
                style={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 14,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <strong>{etapa.nome}</strong>
                    <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
                      Prazo: {etapa.prazo}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="badge">{etapa.status}</span>
                    {etapa.status !== "Concluída" && (
                      <button onClick={() => onAvancarStatus(index)}>Avançar</button>
                    )}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
                      👷 Funcionários responsáveis ({funcsAssociados.length})
                    </span>
                    {funcsDisponiveis.length > 0 && (
                      <button
                        style={{ padding: "5px 12px", fontSize: 12, background: "#374151" }}
                        onClick={() => onAbrirAssociar(index)}
                      >
                        + Associar
                      </button>
                    )}
                  </div>

                  {funcsAssociados.length === 0 ? (
                    <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
                      Nenhum funcionário associado a esta etapa.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {funcsAssociados.map((func) => (
                        <div
                          key={func.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            padding: "8px 12px",
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{func.nome}</span>
                            <span style={{ marginLeft: 8 }}>
                              <BadgeNivel nivel={func.nivelPermissao} />
                            </span>
                            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                              @{func.usuario} · {func.telefone}
                            </div>
                          </div>
                          <button
                            style={{ padding: "4px 10px", fontSize: 12, background: "#b91c1c" }}
                            onClick={() => onRemoverFuncionario(index, func.id)}
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalEtapaAberto && (
        <Modal>
          <div className="modal-box">
            <h3>Nova Etapa</h3>
            <label>
              Aeronave *
              <select
                value={novaEtapa.aeronave}
                onChange={(e) => onNovaEtapaChange({ ...novaEtapa, aeronave: e.target.value })}
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
              Nome da etapa *
              <input
                type="text"
                placeholder="Ex: Instalação de sistemas elétricos"
                value={novaEtapa.nome}
                onChange={(e) => onNovaEtapaChange({ ...novaEtapa, nome: e.target.value })}
              />
            </label>
            <label>
              Prazo *
              <input
                type="text"
                placeholder="Ex: 7 dias"
                value={novaEtapa.prazo}
                onChange={(e) => onNovaEtapaChange({ ...novaEtapa, prazo: e.target.value })}
              />
            </label>
            <div className="btn-group">
              <button onClick={onSalvarEtapa}>Salvar</button>
              <button className="btn-sec" onClick={onCancelarEtapa}>
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modalAssociarAberto && etapaAssociarIndex !== null && (
        <Modal>
          <div className="modal-box">
            <h3>Associar Funcionário</h3>
            <p style={{ color: "#6b7280", marginTop: 0 }}>
              Etapa: <strong>{etapas[etapaAssociarIndex].nome}</strong>
            </p>
            <label>
              Selecione o funcionário
              <select
                value={funcionarioParaAssociar}
                onChange={(e) => onFuncionarioAssociarChange(e.target.value)}
              >
                <option value="">-- escolha --</option>
                {funcionarios
                  .filter(
                    (f) => !etapas[etapaAssociarIndex].funcionariosIds.includes(f.id)
                  )
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome} ({f.nivelPermissao})
                    </option>
                  ))}
              </select>
            </label>
            <div className="btn-group">
              <button onClick={onAssociar} disabled={!funcionarioParaAssociar}>
                Associar
              </button>
              <button className="btn-sec" onClick={onCancelarAssociar}>
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}