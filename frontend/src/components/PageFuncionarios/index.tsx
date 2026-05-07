import type { Funcionario, NivelPermissao } from "../../types";
import { BadgeNivel } from "../BadgeNivel";

type Props = {
  funcionarios: Funcionario[];
  funcionariosFiltrados: Funcionario[];
  buscaFuncionario: string;
  filtroNivel: string;
  onBuscaChange: (v: string) => void;
  onFiltroNivelChange: (v: string) => void;
  onNovoFuncionario: () => void;
  onEditarFuncionario: (f: Funcionario) => void;
  onExcluirFuncionario: (id: number) => void;

  modalAberto: boolean;
  funcionarioEditando: Funcionario | null;
  novoFuncionario: Omit<Funcionario, "id">;
  onNovoFuncionarioChange: (f: Omit<Funcionario, "id">) => void;
  erroFuncionario: string;
  mostrarSenha: boolean;
  onToggleSenha: () => void;
  onSalvar: () => void;
  onCancelarModal: () => void;
};

export function PageFuncionarios({
  funcionarios,
  funcionariosFiltrados,
  buscaFuncionario,
  filtroNivel,
  onBuscaChange,
  onFiltroNivelChange,
  onNovoFuncionario,
  onEditarFuncionario,
  onExcluirFuncionario,
  modalAberto,
  funcionarioEditando,
  novoFuncionario,
  onNovoFuncionarioChange,
  erroFuncionario,
  mostrarSenha,
  onToggleSenha,
  onSalvar,
  onCancelarModal,
}: Props) {
  return (
    <section className="page page-enter">
      <div className="page-header">
        <h2>Funcionários</h2>
        <button onClick={onNovoFuncionario}>+ Novo funcionário</button>
      </div>

      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por nome ou usuário..."
          value={buscaFuncionario}
          onChange={(e) => onBuscaChange(e.target.value)}
        />
        <select value={filtroNivel} onChange={(e) => onFiltroNivelChange(e.target.value)}>
          <option value="">Todos os níveis</option>
          <option value="ADMINISTRADOR">Administrador</option>
          <option value="ENGENHEIRO">Engenheiro</option>
          <option value="OPERADOR">Operador</option>
        </select>
      </div>

      <div
        className="cards"
        style={{ gridTemplateColumns: "repeat(3, minmax(140px, 1fr))", marginBottom: 20 }}
      >
        <div className="card">
          <span className="card-num">
            {funcionarios.filter((f) => f.nivelPermissao === "ADMINISTRADOR").length}
          </span>
          <span className="card-label">Administradores</span>
        </div>
        <div className="card">
          <span className="card-num">
            {funcionarios.filter((f) => f.nivelPermissao === "ENGENHEIRO").length}
          </span>
          <span className="card-label">Engenheiros</span>
        </div>
        <div className="card">
          <span className="card-num">
            {funcionarios.filter((f) => f.nivelPermissao === "OPERADOR").length}
          </span>
          <span className="card-label">Operadores</span>
        </div>
      </div>

      {funcionariosFiltrados.length === 0 ? (
        <div className="vazio">Nenhum funcionário encontrado.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Usuário</th>
              <th>Telefone</th>
              <th>Nível</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionariosFiltrados.map((func) => (
              <tr key={func.id}>
                <td style={{ color: "#9ca3af", fontSize: 13 }}>#{func.id}</td>
                <td>
                  <strong>{func.nome}</strong>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                    {func.endereco}
                  </div>
                </td>
                <td style={{ fontFamily: "monospace", fontSize: 13 }}>{func.usuario}</td>
                <td>{func.telefone}</td>
                <td>
                  <BadgeNivel nivel={func.nivelPermissao} />
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      style={{ padding: "6px 12px", fontSize: 13, background: "#374151" }}
                      onClick={() => onEditarFuncionario(func)}
                    >
                      Editar
                    </button>
                    <button
                      style={{ padding: "6px 12px", fontSize: 13, background: "#b91c1c" }}
                      onClick={() => onExcluirFuncionario(func.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalAberto && (
        <div className="modal">
          <div className="modal-box">
            <h3>{funcionarioEditando ? "Editar Funcionário" : "Novo Funcionário"}</h3>
            {erroFuncionario && (
              <div className="error-msg" style={{ marginBottom: 16 }}>
                {erroFuncionario}
              </div>
            )}
            <label>
              Nome completo *
              <input
                type="text"
                placeholder="Ex: João da Silva"
                value={novoFuncionario.nome}
                onChange={(e) =>
                  onNovoFuncionarioChange({ ...novoFuncionario, nome: e.target.value })
                }
              />
            </label>
            <label>
              Telefone *
              <input
                type="tel"
                placeholder="(XX) XXXXX-XXXX"
                value={novoFuncionario.telefone}
                onChange={(e) =>
                  onNovoFuncionarioChange({ ...novoFuncionario, telefone: e.target.value })
                }
              />
            </label>
            <label>
              Endereço *
              <input
                type="text"
                placeholder="Rua, número - cidade"
                value={novoFuncionario.endereco}
                onChange={(e) =>
                  onNovoFuncionarioChange({ ...novoFuncionario, endereco: e.target.value })
                }
              />
            </label>
            <label>
              Usuário (login) *
              <input
                type="text"
                placeholder="Ex: joao.silva"
                value={novoFuncionario.usuario}
                onChange={(e) =>
                  onNovoFuncionarioChange({
                    ...novoFuncionario,
                    usuario: e.target.value.toLowerCase().replace(/\s/g, ""),
                  })
                }
              />
            </label>
            <label>
              Senha *
              <div style={{ position: "relative" }}>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={novoFuncionario.senha}
                  style={{ paddingRight: 80 }}
                  onChange={(e) =>
                    onNovoFuncionarioChange({ ...novoFuncionario, senha: e.target.value })
                  }
                />
                <button
                  onClick={onToggleSenha}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: "4px 10px",
                    fontSize: 12,
                    background: "#e5e7eb",
                    color: "#111827",
                    marginTop: 0,
                  }}
                >
                  {mostrarSenha ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </label>
            <label>
              Nível de permissão *
              <select
                value={novoFuncionario.nivelPermissao}
                onChange={(e) =>
                  onNovoFuncionarioChange({
                    ...novoFuncionario,
                    nivelPermissao: e.target.value as NivelPermissao,
                  })
                }
              >
                <option value="OPERADOR">Operador</option>
                <option value="ENGENHEIRO">Engenheiro</option>
                <option value="ADMINISTRADOR">Administrador</option>
              </select>
            </label>
            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "12px 14px",
                fontSize: 12,
                color: "#6b7280",
                marginBottom: 4,
                lineHeight: 1.7,
              }}
            >
              <strong style={{ color: "#374151" }}>Níveis de acesso:</strong>
              <br />
              🔴 <strong>Administrador</strong> — acesso total ao sistema
              <br />
              🔵 <strong>Engenheiro</strong> — aeronaves, etapas, testes e relatórios
              <br />
              ⚪ <strong>Operador</strong> — etapas e peças
            </div>
            <div className="btn-group">
              <button onClick={onSalvar}>
                {funcionarioEditando ? "Salvar alterações" : "Cadastrar"}
              </button>
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