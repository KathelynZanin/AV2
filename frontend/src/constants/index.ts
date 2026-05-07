import type { Aeronave, Etapa, Funcionario, Peca, StatusPeca, Teste } from "../types";

export const FUNCIONARIO_VAZIO: Omit<Funcionario, "id"> = {
  nome: "",
  telefone: "",
  endereco: "",
  usuario: "",
  senha: "",
  nivelPermissao: "OPERADOR",
};


export const PROXIMO_STATUS_PECA: Record<StatusPeca, StatusPeca | null> = {
  "Em produção": "Em transporte",
  "Em transporte": "Pronta",
  "Pronta": null,
};

export const AERONAVES_INICIAIS: Aeronave[] = [
  { codigo: "AC-001", modelo: "AeroCode Falcon", tipo: "Comercial", capacidade: 180, alcance: 5200 },
  { codigo: "AC-002", modelo: "AeroCode Hawk", tipo: "Militar", capacidade: 2, alcance: 3000 },
];

export const PECAS_INICIAIS: Peca[] = [
  { nome: "Fuselagem dianteira", tipo: "Nacional", fornecedor: "AeroParts Brasil", status: "Pronta", aeronave: "AC-001" },
  { nome: "Sistema hidráulico", tipo: "Importada", fornecedor: "Global Aviation", status: "Em transporte", aeronave: "AC-001" },
];

export const ETAPAS_INICIAIS: Etapa[] = [
  { nome: "Montagem da fuselagem", prazo: "10 dias", status: "Concluída", funcionariosIds: [1], aeronave: "AC-001" },
  { nome: "Instalação elétrica", prazo: "7 dias", status: "Em andamento", funcionariosIds: [2], aeronave: "AC-001" },
  { nome: "Testes finais", prazo: "5 dias", status: "Pendente", funcionariosIds: [], aeronave: "AC-001" },
  { nome: "Montagem de asas", prazo: "8 dias", status: "Concluída", funcionariosIds: [1, 2], aeronave: "AC-002" },
  { nome: "Sistemas de armamento", prazo: "12 dias", status: "Pendente", funcionariosIds: [], aeronave: "AC-002" },
];

export const TESTES_INICIAIS: Teste[] = [
  { tipo: "Elétrico", aeronave: "AC-001", resultado: "Aprovado" },
];

export const FUNCIONARIOS_INICIAIS: Funcionario[] = [
  { id: 1, nome: "Carlos Oliveira", telefone: "(12) 99999-0001", endereco: "Rua das Acácias, 10 - SJC", usuario: "carlos.oliveira", senha: "Senha@123", nivelPermissao: "ADMINISTRADOR" },
  { id: 2, nome: "Ana Lima", telefone: "(12) 98888-0002", endereco: "Av. Brasil, 200 - SJC", usuario: "ana.lima", senha: "Eng@2024", nivelPermissao: "ENGENHEIRO" },
  { id: 3, nome: "Paulo Souza", telefone: "(12) 97777-0003", endereco: "Rua Marte, 45 - SJC", usuario: "paulo.souza", senha: "Op@2024", nivelPermissao: "OPERADOR" },
];