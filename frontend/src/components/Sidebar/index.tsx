import type { Funcionario } from "../../types";
import { BadgeNivel } from "../BadgeNivel";

type Props = {
  usuarioLogado: Funcionario;
  pagina: string;
  podeAcessar: (p: string) => boolean;
  onNavegar: (p: string) => void;
  onLogout: () => void;
};

export function Sidebar({ usuarioLogado, pagina: _pagina, podeAcessar, onNavegar, onLogout }: Props) {
  return (
    <nav className="sidebar">
      <div className="brand">✈ Aerocode</div>

      <div
        style={{
          marginBottom: 20,
          padding: "12px",
          background: "#1f2937",
          borderRadius: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#374151",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            👤
          </span>
          <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>
            {usuarioLogado.nome}
          </div>
        </div>
        <div>
          <BadgeNivel nivel={usuarioLogado.nivelPermissao} />
        </div>
      </div>

      <ul>
        <li><button onClick={() => onNavegar("dashboard")}>Dashboard</button></li>
        {podeAcessar("aeronaves") && <li><button onClick={() => onNavegar("aeronaves")}>Aeronaves</button></li>}
        {podeAcessar("etapas") && <li><button onClick={() => onNavegar("etapas")}>Etapas</button></li>}
        {podeAcessar("pecas") && <li><button onClick={() => onNavegar("pecas")}>Peças</button></li>}
        {podeAcessar("testes") && <li><button onClick={() => onNavegar("testes")}>Testes</button></li>}
        {podeAcessar("funcionarios") && <li><button onClick={() => onNavegar("funcionarios")}>Funcionários</button></li>}
        {podeAcessar("relatorio") && <li><button onClick={() => onNavegar("relatorio")}>Relatório</button></li>}
      </ul>
      <button className="btn-logout" onClick={onLogout}>Sair</button>
    </nav>
  );
}