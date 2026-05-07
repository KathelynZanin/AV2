import type { Etapa, Funcionario, NivelPermissao, Peca } from "../types";

// ── Status derivado das etapas ────────────────────────────────
export function statusAeronave(
  codigo: string,
  etapas: Etapa[],
  pecas: Peca[]
): { label: string; color: string; bg: string } {
  const etapasDaAeronave = etapas.filter((e) => e.aeronave === codigo);
  const pecasDaAeronave = pecas.filter((p) => p.aeronave === codigo);
  if (etapasDaAeronave.length === 0 && pecasDaAeronave.length === 0)
    return { label: "Não iniciada", color: "#6b7280", bg: "#f3f4f6" };
  const todasEtapasConcluidas = etapasDaAeronave.every((e) => e.status === "Concluída");
  const todasPecasProntas = pecasDaAeronave.every((p) => p.status === "Pronta");
  if (todasEtapasConcluidas && todasPecasProntas)
    return { label: "Pronta para entrega", color: "#166534", bg: "#dcfce7" };
  return { label: "Em produção", color: "#075985", bg: "#e0f2fe" };
}


export function podeAcessarPagina(
  pagina: string,
  usuario: Funcionario | null
): boolean {
  if (!usuario) return false;
  const nivel = usuario.nivelPermissao;
  if (nivel === "ADMINISTRADOR") return true;
  if (nivel === "ENGENHEIRO")
    return ["dashboard", "aeronaves", "etapas", "testes", "relatorio"].includes(pagina);
  if (nivel === "OPERADOR")
    return ["dashboard", "etapas", "pecas"].includes(pagina);
  return false;
}


export function getBadgeNivelStyle(nivel: NivelPermissao): {
  background: string;
  color: string;
} {
  const cores: Record<NivelPermissao, { background: string; color: string }> = {
    ADMINISTRADOR: { background: "#fef3c7", color: "#92400e" },
    ENGENHEIRO: { background: "#e0f2fe", color: "#075985" },
    OPERADOR: { background: "#f3f4f6", color: "#374151" },
  };
  return cores[nivel];
}


export function validarFuncionario(
  dados: Omit<Funcionario, "id">,
  funcionarios: Funcionario[],
  idEditando?: number
): string | null {
  if (!dados.nome.trim()) return "O nome é obrigatório.";
  if (!dados.telefone.trim()) return "O telefone é obrigatório.";
  if (!dados.endereco.trim()) return "O endereço é obrigatório.";
  if (!dados.usuario.trim()) return "O usuário é obrigatório.";
  if (!dados.senha.trim()) return "A senha é obrigatória.";
  if (dados.senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
  const usuarioDuplicado = funcionarios.some(
    (f) => f.usuario === dados.usuario && f.id !== idEditando
  );
  if (usuarioDuplicado) return "Esse nome de usuário já está em uso.";
  return null;
}


export function gerarTextoRelatorio(params: {
  aeronave: { codigo: string; modelo: string; tipo: string; capacidade: number; alcance: number };
  cliente: string;
  data: string;
  etapas: Etapa[];
  pecas: Peca[];
  testes: { tipo: string; resultado: string }[];
  funcionarios: Funcionario[];
  usuarioLogado: Funcionario;
}): string {
  const { aeronave, cliente, data, etapas, pecas, testes, funcionarios, usuarioLogado } = params;

  const linhaEtapas =
    etapas.length === 0
      ? "  Nenhuma etapa registrada."
      : etapas
          .map((e, i) => {
            const funcs =
              funcionarios
                .filter((f) => e.funcionariosIds.includes(f.id))
                .map((f) => f.nome)
                .join(", ") || "Nenhum";
            return `  ${i + 1}. ${e.nome}\n     Prazo: ${e.prazo} | Status: ${e.status}\n     Responsáveis: ${funcs}`;
          })
          .join("\n");

  const linhaPecas =
    pecas.length === 0
      ? "  Nenhuma peça registrada."
      : pecas
          .map(
            (p, i) =>
              `  ${i + 1}. ${p.nome}\n     Tipo: ${p.tipo} | Fornecedor: ${p.fornecedor} | Status: ${p.status}`
          )
          .join("\n");

  const aprovados = testes.filter((t) => t.resultado === "Aprovado").length;
  const reprovados = testes.filter((t) => t.resultado === "Reprovado").length;

  const linhaTestes =
    testes.length === 0
      ? "  Nenhum teste registrado."
      : testes.map((t, i) => `  ${i + 1}. ${t.tipo} — ${t.resultado}`).join("\n");

  return `========================================
RELATÓRIO FINAL DA AERONAVE
Aerocode — Sistema de Gestão da Produção
========================================

AERONAVE
  Código:      ${aeronave.codigo}
  Modelo:      ${aeronave.modelo}
  Tipo:        ${aeronave.tipo}
  Capacidade:  ${aeronave.capacidade} passageiros
  Alcance:     ${aeronave.alcance} km

ENTREGA
  Cliente:     ${cliente}
  Data:        ${data}

----------------------------------------
ETAPAS REALIZADAS (${etapas.length})
----------------------------------------
${linhaEtapas}

----------------------------------------
PEÇAS UTILIZADAS (${pecas.length})
----------------------------------------
${linhaPecas}

----------------------------------------
RESULTADOS DOS TESTES (${testes.length})
  Aprovados: ${aprovados} | Reprovados: ${reprovados}
----------------------------------------
${linhaTestes}

========================================
Relatório gerado em: ${new Date().toLocaleString("pt-BR")}
Gerado por: ${usuarioLogado.nome} (${usuarioLogado.nivelPermissao})
========================================`;
}