import { useState } from "react";
import type { Aeronave, Etapa, Funcionario, Peca, Teste } from "./types";
import {
  AERONAVES_INICIAIS,
  ETAPAS_INICIAIS,
  FUNCIONARIO_VAZIO,
  FUNCIONARIOS_INICIAIS,
  PECAS_INICIAIS,
  PROXIMO_STATUS_PECA,
  TESTES_INICIAIS,
} from "./constants";
import { gerarTextoRelatorio, podeAcessarPagina, validarFuncionario } from "./utils";

import { PageLogin } from "./components/PageLogin";
import { Sidebar } from "./components/Sidebar";
import { PageDashboard } from "./components/PageDashboard";
import { PageAeronaves } from "./components/PageAeronaves";
import { PageEtapas } from "./components/PageEtapas";
import { PagePecas } from "./components/PagePecas";
import { PageTestes } from "./components/PageTestes";
import { PageFuncionarios } from "./components/PageFuncionarios";
import { PageRelatorio } from "./components/PageRelatorio";
import { KonamiCode } from "./hooks/useKonamiCode";


function App() {
  
  const [logado, setLogado] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState<Funcionario | null>(null);
  const [inputUsuario, setInputUsuario] = useState("");
  const [inputSenha, setInputSenha] = useState("");
  const [erroLogin, setErroLogin] = useState(false);


  const [pagina, setPagina] = useState("dashboard");


  const [modalAeronave, setModalAeronave] = useState(false);
  const [modalPeca, setModalPeca] = useState(false);
  const [modalFuncionario, setModalFuncionario] = useState(false);
  const [modalEtapa, setModalEtapa] = useState(false);
  const [modalAssociarFuncionario, setModalAssociarFuncionario] = useState(false);
 
  const [funcionarioEditando, setFuncionarioEditando] = useState<Funcionario | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroFuncionario, setErroFuncionario] = useState("");

 
  const [buscaAeronave, setBuscaAeronave] = useState("");
  const [filtroTipoAeronave, setFiltroTipoAeronave] = useState("");
  const [filtroTipoPeca, setFiltroTipoPeca] = useState("");
  const [filtroStatusPeca, setFiltroStatusPeca] = useState("");
  const [buscaFuncionario, setBuscaFuncionario] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("");

 
  const [aeronaveEtapaSelecionada, setAeronaveEtapaSelecionada] = useState("");
  const [etapaAssociarIndex, setEtapaAssociarIndex] = useState<number | null>(null);
  const [funcionarioParaAssociar, setFuncionarioParaAssociar] = useState("");


  const [aeronaveRelatorio, setAeronaveRelatorio] = useState("");
  const [clienteRelatorio, setClienteRelatorio] = useState("");
  const [dataRelatorio, setDataRelatorio] = useState("");
  const [relatorioGerado, setRelatorioGerado] = useState("");


  const [aeronaves, setAeronaves] = useState<Aeronave[]>(AERONAVES_INICIAIS);
  const [pecas, setPecas] = useState<Peca[]>(PECAS_INICIAIS);
  const [etapas, setEtapas] = useState<Etapa[]>(ETAPAS_INICIAIS);
  const [testes, setTestes] = useState<Teste[]>(TESTES_INICIAIS);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(FUNCIONARIOS_INICIAIS);
  const [proximoId, setProximoId] = useState(4);


  const [novaAeronave, setNovaAeronave] = useState<Aeronave>({
    codigo: "", modelo: "", tipo: "Comercial", capacidade: 0, alcance: 0,
  });
  const [novaPeca, setNovaPeca] = useState<Peca>({
    nome: "", tipo: "Nacional", fornecedor: "", status: "Em produção", aeronave: "",
  });
  const [novoTeste, setNovoTeste] = useState<Teste>({
    tipo: "Elétrico", aeronave: "", resultado: "Aprovado",
  });
  const [novoFuncionario, setNovoFuncionario] = useState<Omit<Funcionario, "id">>(FUNCIONARIO_VAZIO);
  const [novaEtapa, setNovaEtapa] = useState<Etapa>({
    nome: "", prazo: "", status: "Pendente", funcionariosIds: [], aeronave: "",
  });


  function podeAcessar(p: string): boolean {
    return podeAcessarPagina(p, usuarioLogado);
  }


  const aeronavesFiltradas = aeronaves.filter((a) => {
    return (
      a.codigo.toLowerCase().includes(buscaAeronave.toLowerCase()) &&
      (filtroTipoAeronave === "" || a.tipo === filtroTipoAeronave)
    );
  });

  const pecasFiltradas = pecas.filter((p) => {
    return (
      (filtroTipoPeca === "" || p.tipo === filtroTipoPeca) &&
      (filtroStatusPeca === "" || p.status === filtroStatusPeca)
    );
  });

  const funcionariosFiltrados = funcionarios.filter((f) => {
    const bateBusca =
      f.nome.toLowerCase().includes(buscaFuncionario.toLowerCase()) ||
      f.usuario.toLowerCase().includes(buscaFuncionario.toLowerCase());
    return bateBusca && (filtroNivel === "" || f.nivelPermissao === filtroNivel);
  });


  function login() {
    const func = funcionarios.find(
      (f) => f.usuario === inputUsuario && f.senha === inputSenha
    );
    if (func) {
      setUsuarioLogado(func);
      setLogado(true);
      setErroLogin(false);
      setPagina("dashboard");
    } else {
      setErroLogin(true);
    }
  }

  function logout() {
    setLogado(false);
    setUsuarioLogado(null);
    setInputUsuario("");
    setInputSenha("");
    setPagina("dashboard");
  }

  //CRUD Aeronaves
  function salvarAeronave() {
    if (!novaAeronave.codigo || !novaAeronave.modelo) {
      alert("Preencha o código e o modelo da aeronave.");
      return;
    }
    if (aeronaves.some((a) => a.codigo === novaAeronave.codigo)) {
      alert("Esse código de aeronave já existe.");
      return;
    }
    setAeronaves([...aeronaves, novaAeronave]);
    setNovaAeronave({ codigo: "", modelo: "", tipo: "Comercial", capacidade: 0, alcance: 0 });
    setModalAeronave(false);
  }

  //CRUD Peças
  function salvarPeca() {
    if (!novaPeca.nome) { alert("Preencha o nome da peça."); return; }
    if (!novaPeca.aeronave) { alert("Selecione a aeronave desta peça."); return; }
    setPecas([...pecas, novaPeca]);
    setNovaPeca({ nome: "", tipo: "Nacional", fornecedor: "", status: "Em produção", aeronave: "" });
    setModalPeca(false);
  }

  function avancarStatusPeca(index: number) {
    const proximo = PROXIMO_STATUS_PECA[pecas[index].status];
    if (!proximo) return;
    const copia = [...pecas];
    copia[index] = { ...copia[index], status: proximo };
    setPecas(copia);
  }


  function salvarEtapa() {
    if (!novaEtapa.nome.trim()) { alert("Preencha o nome da etapa."); return; }
    if (!novaEtapa.prazo.trim()) { alert("Preencha o prazo da etapa."); return; }
    if (!novaEtapa.aeronave) { alert("Selecione a aeronave desta etapa."); return; }
    setEtapas([...etapas, { ...novaEtapa, status: "Pendente", funcionariosIds: [] }]);
    setNovaEtapa({ nome: "", prazo: "", status: "Pendente", funcionariosIds: [], aeronave: "" });
    setModalEtapa(false);
  }

  function atualizarStatusEtapa(index: number) {
    const etapa = etapas[index];
    const etapasDaAeronave = etapas
      .map((e, i) => ({ ...e, originalIndex: i }))
      .filter((e) => e.aeronave === etapa.aeronave);
    const posNaAeronave = etapasDaAeronave.findIndex((e) => e.originalIndex === index);
    if (posNaAeronave > 0 && etapasDaAeronave[posNaAeronave - 1].status !== "Concluída") {
      alert("A etapa anterior desta aeronave precisa ser concluída primeiro.");
      return;
    }
    const copia = [...etapas];
    if (copia[index].status === "Pendente") copia[index].status = "Em andamento";
    else if (copia[index].status === "Em andamento") copia[index].status = "Concluída";
    setEtapas(copia);
  }

  function abrirModalAssociar(index: number) {
    setEtapaAssociarIndex(index);
    setFuncionarioParaAssociar("");
    setModalAssociarFuncionario(true);
  }

  function associarFuncionario() {
    if (etapaAssociarIndex === null || !funcionarioParaAssociar) return;
    const id = Number(funcionarioParaAssociar);
    const copia = [...etapas];
    const etapa = copia[etapaAssociarIndex];
    if (etapa.funcionariosIds.includes(id)) {
      alert("Este funcionário já está associado a esta etapa.");
      return;
    }
    etapa.funcionariosIds = [...etapa.funcionariosIds, id];
    setEtapas(copia);
    setModalAssociarFuncionario(false);
  }

  function removerFuncionarioDaEtapa(etapaIndex: number, funcId: number) {
    const copia = [...etapas];
    copia[etapaIndex].funcionariosIds = copia[etapaIndex].funcionariosIds.filter(
      (id) => id !== funcId
    );
    setEtapas(copia);
  }

  
  function registrarTeste() {
    if (!novoTeste.aeronave) { alert("Selecione uma aeronave."); return; }
    setTestes([...testes, novoTeste]);
    setNovoTeste({ tipo: "Elétrico", aeronave: "", resultado: "Aprovado" });
  }

 
  function gerarRelatorio() {
    if (!aeronaveRelatorio || !clienteRelatorio || !dataRelatorio) {
      alert("Preencha aeronave, cliente e data de entrega.");
      return;
    }
    const aeronave = aeronaves.find((a) => a.codigo === aeronaveRelatorio);
    if (!aeronave || !usuarioLogado) { alert("Aeronave não encontrada."); return; }

    const texto = gerarTextoRelatorio({
      aeronave,
      cliente: clienteRelatorio,
      data: dataRelatorio,
      etapas: etapas.filter((e) => e.aeronave === aeronaveRelatorio),
      pecas: pecas.filter((p) => p.aeronave === aeronaveRelatorio),
      testes: testes.filter((t) => t.aeronave === aeronaveRelatorio),
      funcionarios,
      usuarioLogado,
    });
    setRelatorioGerado(texto);
  }

  function salvarTxt() {
    if (!relatorioGerado) { alert("Gere o relatório antes de salvar."); return; }
    const arquivo = new Blob([relatorioGerado], { type: "text/plain" });
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorio-aerocode.txt";
    link.click();
    URL.revokeObjectURL(url);
  }


  function abrirModalNovo() {
    setFuncionarioEditando(null);
    setNovoFuncionario(FUNCIONARIO_VAZIO);
    setErroFuncionario("");
    setMostrarSenha(false);
    setModalFuncionario(true);
  }

  function abrirModalEditar(func: Funcionario) {
    setFuncionarioEditando(func);
    setNovoFuncionario({
      nome: func.nome, telefone: func.telefone, endereco: func.endereco,
      usuario: func.usuario, senha: func.senha, nivelPermissao: func.nivelPermissao,
    });
    setErroFuncionario("");
    setMostrarSenha(false);
    setModalFuncionario(true);
  }

  function salvarFuncionario() {
    const erro = validarFuncionario(novoFuncionario, funcionarios, funcionarioEditando?.id);
    if (erro) { setErroFuncionario(erro); return; }
    if (funcionarioEditando) {
      setFuncionarios(
        funcionarios.map((f) =>
          f.id === funcionarioEditando.id ? { ...novoFuncionario, id: f.id } : f
        )
      );
    } else {
      setFuncionarios([...funcionarios, { ...novoFuncionario, id: proximoId }]);
      setProximoId(proximoId + 1);
    }
    setModalFuncionario(false);
  }

  function excluirFuncionario(id: number) {
    if (confirm("Deseja excluir este funcionário?")) {
      setFuncionarios(funcionarios.filter((f) => f.id !== id));
    }
  }

  
 if (!logado) {
  return (
    <>
      <PageLogin
        inputUsuario={inputUsuario}
        inputSenha={inputSenha}
        erroLogin={erroLogin}
        onChangeUsuario={setInputUsuario}
        onChangeSenha={setInputSenha}
        onLogin={login}
      />
      <KonamiCode />
    </>
  );
}

  return (
    
    <div className="layout">
      <Sidebar
        usuarioLogado={usuarioLogado!}
        pagina={pagina}
        podeAcessar={podeAcessar}
        onNavegar={setPagina}
        onLogout={logout}
      />

      <main className="content">

        {pagina === "dashboard" && (
          <PageDashboard aeronaves={aeronaves} etapas={etapas} pecas={pecas} testes={testes} />
        )}

        {pagina === "aeronaves" && podeAcessar("aeronaves") && (
          <PageAeronaves
            aeronaves={aeronaves}
            aeronavesFiltradas={aeronavesFiltradas}
            buscaAeronave={buscaAeronave}
            filtroTipoAeronave={filtroTipoAeronave}
            onBuscaChange={setBuscaAeronave}
            onFiltroTipoChange={setFiltroTipoAeronave}
            onNovaAeronave={() => setModalAeronave(true)}
            novaAeronave={novaAeronave}
            onNovaAeronaveChange={setNovaAeronave}
            modalAberto={modalAeronave}
            onSalvar={salvarAeronave}
            onCancelarModal={() => setModalAeronave(false)}
          />
        )}

        {pagina === "etapas" && podeAcessar("etapas") && (
          <PageEtapas
            etapas={etapas}
            aeronaves={aeronaves}
            funcionarios={funcionarios}
            aeronaveEtapaSelecionada={aeronaveEtapaSelecionada}
            onAeronaveChange={setAeronaveEtapaSelecionada}
            onAvancarStatus={atualizarStatusEtapa}
            onAbrirAssociar={abrirModalAssociar}
            onRemoverFuncionario={removerFuncionarioDaEtapa}
            onNovaEtapa={() => setModalEtapa(true)}
            novaEtapa={novaEtapa}
            onNovaEtapaChange={setNovaEtapa}
            modalEtapaAberto={modalEtapa}
            onSalvarEtapa={salvarEtapa}
            onCancelarEtapa={() => setModalEtapa(false)}
            modalAssociarAberto={modalAssociarFuncionario}
            etapaAssociarIndex={etapaAssociarIndex}
            funcionarioParaAssociar={funcionarioParaAssociar}
            onFuncionarioAssociarChange={setFuncionarioParaAssociar}
            onAssociar={associarFuncionario}
            onCancelarAssociar={() => setModalAssociarFuncionario(false)}
          />
        )}

        {pagina === "pecas" && podeAcessar("pecas") && (
          <PagePecas
            pecas={pecas}
            pecasFiltradas={pecasFiltradas}
            aeronaves={aeronaves}
            filtroTipoPeca={filtroTipoPeca}
            filtroStatusPeca={filtroStatusPeca}
            onFiltroTipoChange={setFiltroTipoPeca}
            onFiltroStatusChange={setFiltroStatusPeca}
            onNovaP={() => setModalPeca(true)}
            onAvancarStatus={avancarStatusPeca}
            novaPeca={novaPeca}
            onNovaPecaChange={setNovaPeca}
            modalAberto={modalPeca}
            onSalvar={salvarPeca}
            onCancelarModal={() => setModalPeca(false)}
          />
        )}

        {pagina === "testes" && podeAcessar("testes") && (
          <PageTestes
            testes={testes}
            aeronaves={aeronaves}
            novoTeste={novoTeste}
            onNovoTesteChange={setNovoTeste}
            onRegistrar={registrarTeste}
          />
        )}

        {pagina === "funcionarios" && podeAcessar("funcionarios") && (
          <PageFuncionarios
            funcionarios={funcionarios}
            funcionariosFiltrados={funcionariosFiltrados}
            buscaFuncionario={buscaFuncionario}
            filtroNivel={filtroNivel}
            onBuscaChange={setBuscaFuncionario}
            onFiltroNivelChange={setFiltroNivel}
            onNovoFuncionario={abrirModalNovo}
            onEditarFuncionario={abrirModalEditar}
            onExcluirFuncionario={excluirFuncionario}
            modalAberto={modalFuncionario}
            funcionarioEditando={funcionarioEditando}
            novoFuncionario={novoFuncionario}
            onNovoFuncionarioChange={setNovoFuncionario}
            erroFuncionario={erroFuncionario}
            mostrarSenha={mostrarSenha}
            onToggleSenha={() => setMostrarSenha(!mostrarSenha)}
            onSalvar={salvarFuncionario}
            onCancelarModal={() => setModalFuncionario(false)}
          />
        )}

        {pagina === "relatorio" && podeAcessar("relatorio") && (
          <PageRelatorio
            aeronaves={aeronaves}
            aeronaveRelatorio={aeronaveRelatorio}
            clienteRelatorio={clienteRelatorio}
            dataRelatorio={dataRelatorio}
            relatorioGerado={relatorioGerado}
            onAeronaveChange={setAeronaveRelatorio}
            onClienteChange={setClienteRelatorio}
            onDataChange={setDataRelatorio}
            onGerar={gerarRelatorio}
            onSalvarTxt={salvarTxt}
          />
        )}

        {!podeAcessar(pagina) && pagina !== "dashboard" && (
          <section className="page page-enter">
            <h2>Acesso negado</h2>
            <div className="vazio">
              Você não tem permissão para acessar esta página.
              <br />
              Nível atual: <strong>{usuarioLogado?.nivelPermissao}</strong>
            </div>
          </section>
        )}

      </main>
      <KonamiCode />
    </div>
  );
}

export default App;