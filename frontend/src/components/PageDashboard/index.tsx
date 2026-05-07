import type { Aeronave, Etapa, Peca, Teste } from "../../types";
import { statusAeronave } from "../../utils";

type Props = {
  aeronaves: Aeronave[];
  etapas: Etapa[];
  pecas: Peca[];
  testes: Teste[];
};

export function PageDashboard({ aeronaves, etapas, pecas, testes }: Props) {
  return (
    <section className="page page-enter">
      <h2>Dashboard</h2>
      <div className="cards">
        <div className="card">
          <span className="card-num">{aeronaves.length}</span>
          <span className="card-label">Aeronaves</span>
        </div>
        <div className="card">
          <span className="card-num">{etapas.length}</span>
          <span className="card-label">Etapas</span>
        </div>
        <div className="card">
          <span className="card-num">{pecas.length}</span>
          <span className="card-label">Peças</span>
        </div>
        <div className="card">
          <span className="card-num">{testes.length}</span>
          <span className="card-label">Testes</span>
        </div>
      </div>
      <h3>Aeronaves Recentes</h3>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Modelo</th>
            <th>Tipo</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {aeronaves.map((aeronave) => {
            const st = statusAeronave(aeronave.codigo, etapas, pecas);
            return (
              <tr key={aeronave.codigo}>
                <td>{aeronave.codigo}</td>
                <td>{aeronave.modelo}</td>
                <td>{aeronave.tipo}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      background: st.bg,
                      color: st.color,
                    }}
                  >
                    {st.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}