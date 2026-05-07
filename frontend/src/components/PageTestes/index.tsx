import type { Aeronave, ResultadoTeste, Teste, TipoTeste } from "../../types";

type Props = {
  testes: Teste[];
  aeronaves: Aeronave[];
  novoTeste: Teste;
  onNovoTesteChange: (t: Teste) => void;
  onRegistrar: () => void;
};

export function PageTestes({ testes, aeronaves, novoTeste, onNovoTesteChange, onRegistrar }: Props) {
  return (
    <section className="page page-enter">
      <h2>Testes</h2>
      <div className="form-inline">
        <h3>Registrar Teste</h3>
        <label>
          Tipo
          <select
            value={novoTeste.tipo}
            onChange={(e) =>
              onNovoTesteChange({ ...novoTeste, tipo: e.target.value as TipoTeste })
            }
          >
            <option value="Elétrico">Elétrico</option>
            <option value="Hidráulico">Hidráulico</option>
            <option value="Aerodinâmico">Aerodinâmico</option>
          </select>
        </label>
        <label>
          Aeronave
          <select
            value={novoTeste.aeronave}
            onChange={(e) => onNovoTesteChange({ ...novoTeste, aeronave: e.target.value })}
          >
            <option value="">-- escolha --</option>
            {aeronaves.map((a) => (
              <option key={a.codigo} value={a.codigo}>
                {a.codigo}
              </option>
            ))}
          </select>
        </label>
        <label>
          Resultado
          <select
            value={novoTeste.resultado}
            onChange={(e) =>
              onNovoTesteChange({ ...novoTeste, resultado: e.target.value as ResultadoTeste })
            }
          >
            <option value="Aprovado">Aprovado</option>
            <option value="Reprovado">Reprovado</option>
          </select>
        </label>
        <button onClick={onRegistrar}>Registrar</button>
      </div>
      <h3>Histórico de Testes</h3>
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Aeronave</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          {testes.map((teste, index) => (
            <tr key={index}>
              <td>{teste.tipo}</td>
              <td>{teste.aeronave}</td>
              <td>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    background: teste.resultado === "Aprovado" ? "#dcfce7" : "#fee2e2",
                    color: teste.resultado === "Aprovado" ? "#166534" : "#991b1b",
                  }}
                >
                  {teste.resultado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}