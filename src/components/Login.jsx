import { useState } from "react";
import { useStock } from "../context/StockContext";

export default function Login() {
  const { login } = useStock();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) setError("Usuário ou senha inválidos.");
    else setError("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-sm shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-emerald-600">Stock Now</h1>
          <p className="text-sm text-gray-500 mt-1">Controle de estoque</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Usuário</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <button type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-sm transition-colors">
            Entrar
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">
          Usuário: <strong>admin</strong> / Senha: <strong>1234</strong>
        </p>
      </div>
    </div>
  );
}