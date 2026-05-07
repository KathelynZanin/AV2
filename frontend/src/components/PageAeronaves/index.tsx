import type { Aeronave, TipoAeronave } from "../../types";

type Props = {
  aeronaves: Aeronave[];
  aeronavesFiltradas: Aeronave[];
  buscaAeronave: string;
  filtroTipoAeronave: string;
  onBuscaChange: (v: string) => void;
  onFiltroTipoChange: (v: string) => void;
  onNovaAeronave: () => void;
  novaAeronave: Aeronave;
  onNovaAeronaveChange: (a: Aeronave) => void;
  modalAberto: boolean;
  onSalvar: () => void;
  onCancelarModal: () => void;
};

export function PageAeronaves({
  aeronavesFiltradas,
  buscaAeronave,
  filtroTipoAeronave,
  onBuscaChange,
  onFiltroTipoChange,
  onNovaAeronave,
  novaAeronave,
  onNovaAeronaveChange,
  modalAberto,
  onSalvar,
  onCancelarModal,
}: Props) {
  return (
    <section className="page page-enter">
      <div className="page-header">
        <h2>Aeronaves</h2>
        <button onClick={onNovaAeronave}>+ Nova aeronave</button>
      </div>
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por código..."
          value={buscaAeronave}
          onChange={(e) => onBuscaChange(e.target.value)}
        />
        <select
          value={filtroTipoAeronave}
          onChange={(e) => onFiltroTipoChange(e.target.value)}
        >
          <option value="">Todos os tipos</option>
          <option value="Comercial">Comercial</option>
          <option value="Militar">Militar</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Modelo</th>
            <th>Tipo</th>
            <th>Capacidade</th>
            <th>Alcance</th>
          </tr>
        </thead>
        <tbody>
          {aeronavesFiltradas.map((aeronave) => (
            <tr key={aeronave.codigo}>
              <td>{aeronave.codigo}</td>
              <td>{aeronave.modelo}</td>
              <td>{aeronave.tipo}</td>
              <td>{aeronave.capacidade}</td>
              <td>{aeronave.alcance} km</td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalAberto && (
        <div className="modal">
          <div className="modal-box">
            <h3>Nova Aeronave</h3>
            <label>
              Código *
              <input
                type="text"
                value={novaAeronave.codigo}
                onChange={(e) =>
                  onNovaAeronaveChange({ ...novaAeronave, codigo: e.target.value })
                }
              />
            </label>
            <label>
              Modelo *
              <input
                type="text"
                value={novaAeronave.modelo}
                onChange={(e) =>
                  onNovaAeronaveChange({ ...novaAeronave, modelo: e.target.value })
                }
              />
            </label>
            <label>
              Tipo *
              <select
                value={novaAeronave.tipo}
                onChange={(e) =>
                  onNovaAeronaveChange({
                    ...novaAeronave,
                    tipo: e.target.value as TipoAeronave,
                  })
                }
              >
                <option value="Comercial">Comercial</option>
                <option value="Militar">Militar</option>
              </select>
            </label>
            <label>
              Capacidade
              <input
                type="number"
                value={novaAeronave.capacidade}
                onChange={(e) =>
                  onNovaAeronaveChange({
                    ...novaAeronave,
                    capacidade: Number(e.target.value),
                  })
                }
              />
            </label>
            <label>
              Alcance (km)
              <input
                type="number"
                value={novaAeronave.alcance}
                onChange={(e) =>
                  onNovaAeronaveChange({
                    ...novaAeronave,
                    alcance: Number(e.target.value),
                  })
                }
              />
            </label>
            <div className="btn-group">
              <button onClick={onSalvar}>Salvar</button>
              <button className="btn-sec" onClick={onCancelarModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}