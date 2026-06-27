import { useState } from "react";
import { useStock } from "../context/StockContext";
import Modal from "./Modal";

const emptyForm = { name: "", cpf: "", rg: "", birthDate: "", username: "", password: "" };

function formatCPF(value) {
  return value.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function calculateAge(birthDate) {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function Employees() {
  const { employees, addEmployee, deleteEmployee } = useStock();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setError("");
    if (!form.name.trim()) return setError("Informe o nome do funcionário.");
    if (!form.cpf.trim()) return setError("Informe o CPF.");
    if (!form.rg.trim()) return setError("Informe o RG.");
    if (!form.birthDate) return setError("Informe a data de nascimento.");
    if (!form.username.trim()) return setError("Informe o nome de usuário.");
    if (!form.password.trim()) return setError("Informe a senha.");
    if (calculateAge(form.birthDate) < 18) return setError("O funcionário deve ter no mínimo 18 anos.");
    setSaving(true);
    const result = await addEmployee(form);
    setSaving(false);
    if (result.error) return setError(result.error);
    setForm(emptyForm);
    setShowModal(false);
  }

  async function handleDelete(id) {
    if (window.confirm("Desligar este funcionário? O acesso será revogado imediatamente.")) {
      await deleteEmployee(id);
    }
  }

  const list = employees.filter((e) => e.role !== "admin");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { setForm(emptyForm); setError(""); setShowModal(true); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + Novo funcionário
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
              <th className="text-left px-4 py-3 font-medium">Nome</th>
              <th className="text-left px-4 py-3 font-medium">CPF</th>
              <th className="text-left px-4 py-3 font-medium">RG</th>
              <th className="text-left px-4 py-3 font-medium">Usuário</th>
              <th className="text-left px-4 py-3 font-medium">Idade</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400 dark:text-gray-500">Nenhum funcionário cadastrado</td></tr>
            ) : list.map((e) => (
              <tr key={e.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-2.5 font-medium text-gray-800 dark:text-gray-100">{e.name}</td>
                <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400 font-mono text-xs">{e.cpf}</td>
                <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">{e.rg}</td>
                <td className="px-4 py-2.5"><span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-mono">{e.username}</span></td>
                <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">{calculateAge(e.birthDate)} anos</td>
                <td className="px-4 py-2.5 text-right">
                  <button onClick={() => handleDelete(e.id)}
                    className="text-xs px-2 py-1 rounded-md border border-red-100 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 text-red-500 dark:text-red-400">
                    🗑️ Desligar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Novo funcionário" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            {error && <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-2">{error}</div>}
            <div>
              <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Nome completo</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">CPF</label>
                <input type="text" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: formatCPF(e.target.value) })} placeholder="000.000.000-00" className="input" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">RG</label>
                <input type="text" value={form.rg} onChange={(e) => setForm({ ...form, rg: e.target.value })} className="input" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Data de nascimento</label>
              <input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} className="input" />
              {form.birthDate && (
                <p className={`text-xs mt-1 ${calculateAge(form.birthDate) < 18 ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}>
                  {calculateAge(form.birthDate)} anos {calculateAge(form.birthDate) < 18 ? "— mínimo 18 anos" : ""}
                </p>
              )}
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Credenciais de acesso ao sistema</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Usuário</label>
                  <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Senha</label>
                  <input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button onClick={() => setShowModal(false)} className="btn-cancel">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="btn-save disabled:opacity-50">
                {saving ? "Cadastrando..." : "Cadastrar"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
