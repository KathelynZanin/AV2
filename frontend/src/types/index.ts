
export type TipoAeronave = "Comercial" | "Militar";
export type TipoPeca = "Nacional" | "Importada";
export type StatusPeca = "Em produção" | "Em transporte" | "Pronta";
export type StatusEtapa = "Pendente" | "Em andamento" | "Concluída";
export type NivelPermissao = "ADMINISTRADOR" | "ENGENHEIRO" | "OPERADOR";
export type TipoTeste = "Elétrico" | "Hidráulico" | "Aerodinâmico";
export type ResultadoTeste = "Aprovado" | "Reprovado";


export type Aeronave = {
  codigo: string;
  modelo: string;
  tipo: TipoAeronave;
  capacidade: number;
  alcance: number;
};

export type Peca = {
  nome: string;
  tipo: TipoPeca;
  fornecedor: string;
  status: StatusPeca;
  aeronave: string;
};

export type Teste = {
  tipo: TipoTeste;
  aeronave: string;
  resultado: ResultadoTeste;
};

export type Etapa = {
  nome: string;
  prazo: string;
  status: StatusEtapa;
  funcionariosIds: number[];
  aeronave: string;
};

export type Funcionario = {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  senha: string;
  nivelPermissao: NivelPermissao;
};