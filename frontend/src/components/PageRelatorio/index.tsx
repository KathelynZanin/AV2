import type { Aeronave } from "../../types";

type Props = {
  aeronaves: Aeronave[];
  aeronaveRelatorio: string;
  clienteRelatorio: string;
  dataRelatorio: string;
  relatorioGerado: string;
  onAeronaveChange: (v: string) => void;
  onClienteChange: (v: string) => void;
  onDataChange: (v: string) => void;
  onGerar: () => void;
  onSalvarTxt: () => void;
};

export function PageRelatorio({
  aeronaves,
  aeronaveRelatorio,
  clienteRelatorio,
  dataRelatorio,
  relatorioGerado,
  onAeronaveChange,
  onClienteChange,
  onDataChange,
  onGerar,
  onSalvarTxt,
}: Props) {
  return (
    <section className="page page-enter">
      <h2>Relatório Final</h2>
      <label>
        Aeronave
        <select value={aeronaveRelatorio} onChange={(e) => onAeronaveChange(e.target.value)}>
          <option value="">-- escolha --</option>
          {aeronaves.map((a) => (
            <option key={a.codigo} value={a.codigo}>
              {a.codigo} - {a.modelo}
            </option>
          ))}
        </select>
      </label>
      <label>
        Cliente
        <input
          type="text"
          value={clienteRelatorio}
          onChange={(e) => onClienteChange(e.target.value)}
        />
      </label>
      <label>
        Data de entrega
        <input
          type="date"
          value={dataRelatorio}
          onChange={(e) => onDataChange(e.target.value)}
        />
      </label>
      {relatorioGerado && <pre className="rel-preview">{relatorioGerado}</pre>}
      <div className="btn-group">
        <button onClick={onGerar}>Gerar relatório</button>
        <button className="btn-sec" onClick={onSalvarTxt}>
          Salvar .txt
        </button>
      </div>
    </section>
  );
}