type Props = {
  inputUsuario: string;
  inputSenha: string;
  erroLogin: boolean;
  onChangeUsuario: (v: string) => void;
  onChangeSenha: (v: string) => void;
  onLogin: () => void;
};

export function PageLogin({
  inputUsuario,
  inputSenha,
  erroLogin,
  onChangeUsuario,
  onChangeSenha,
  onLogin,
}: Props) {
  return (
    <div className="page-login">
      <div className="login-box">
        <h1 className="logo">✈ Aerocode</h1>
        <p className="subtitle">Sistema de Gestão da Produção de Aeronaves</p>
        {erroLogin && <div className="error-msg">Usuário ou senha incorretos.</div>}
        <label>
          Usuário
          <input
            type="text"
            placeholder="Ex: carlos.oliveira"
            value={inputUsuario}
            onChange={(e) => onChangeUsuario(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onLogin()}
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            placeholder="Sua senha"
            value={inputSenha}
            onChange={(e) => onChangeSenha(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onLogin()}
          />
        </label>
        <button onClick={onLogin}>Entrar</button>
        <div className="login-help" style={{ marginTop: 20 }}>
          <strong>Usuários de teste:</strong>
          <br />
          carlos.oliveira / Senha@123 (Admin)
          <br />
          ana.lima / Eng@2024 (Engenheiro)
          <br />
          paulo.souza / Op@2024 (Operador)
        </div>
      </div>
    </div>
  );
}