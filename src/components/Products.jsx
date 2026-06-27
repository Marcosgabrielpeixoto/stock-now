import { useState } from "react";
import { useStock } from "../context/StockContext";
import Modal from "./Modal";
import MovementModal from "./MovementModal";

const CATEGORIES = ["Alimentos", "Bebidas", "Limpeza", "Higiene", "Escritório", "Outros"];
const UNITS = ["un", "kg", "g", "L", "ml", "cx", "pct", "m"];
const emptyForm = { name: "", category: "Alimentos", unit: "un", qty: 0, minQty: 0 };

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, getStatus } = useStock();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [modal, setModal] = useState(null);
  const [movProdId, setMovProdId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const filtered = products.filter((p) => {
    const s = search.toLowerCase();
    return (
      (!s || p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s) || p.code.toLowerCase().includes(s)) &&
      (!filterCat || p.category === filterCat)
    );
  });

  function openNew() { setForm(emptyForm); setEditingId(null); setModal("new"); }
  function openEdit(p) {
    setForm({ name: p.name, category: p.category, unit: p.unit, qty: p.qty, minQty: p.minQty });
    setEditingId(p.id);
    setModal("edit");
  }
  function handleSave() {
    if (!form.name.trim()) return alert("Informe o nome do produto.");
    const data = { ...form, qty: Number(form.qty), minQty: Number(form.minQty) };
    if (modal === "edit") updateProduct(editingId, data);
    else addProduct(data);
    setModal(null);
  }
  function handleDelete(id) { if (window.confirm("Excluir este produto?")) deleteProduct(id); }

  const statusMap = {
    ok: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400",
    low: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
    out: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400"
  };
  const statusLabel = { ok: "Normal", low: "Estoque baixo", out: "Sem estoque" };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input type="text" placeholder="Buscar por nome, código ou categoria..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 w-64 placeholder-gray-400 dark:placeholder-gray-500" />
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
          className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
          <option value="">Todas categorias</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button onClick={openNew}
          className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + Novo produto
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
              <th className="text-left px-4 py-3 font-medium">Código</th>
              <th className="text-left px-4 py-3 font-medium">Nome</th>
              <th className="text-left px-4 py-3 font-medium">Categoria</th>
              <th className="text-left px-4 py-3 font-medium">Qtd</th>
              <th className="text-left px-4 py-3 font-medium">Mínimo</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400 dark:text-gray-500">Nenhum produto encontrado</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-2.5">
                  <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                    {p.code}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-medium text-gray-800 dark:text-gray-100">{p.name}</td>
                <td className="px-4 py-2.5">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                    {p.category}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{p.qty} {p.unit}</td>
                <td className="px-4 py-2.5 text-gray-400 dark:text-gray-500">{p.minQty} {p.unit}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusMap[getStatus(p)]}`}>
                    {statusLabel[getStatus(p)]}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => setMovProdId(p.id)} title="Movimentar"
                      className="text-xs px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">🔄</button>
                    <button onClick={() => openEdit(p)} title="Editar"
                      className="text-xs px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">✏️</button>
                    <button onClick={() => handleDelete(p.id)} title="Excluir"
                      className="text-xs px-2 py-1 rounded-md border border-red-100 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 text-red-500 dark:text-red-400">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal cadastro/edição */}
      {modal && (
        <Modal title={modal === "edit" ? "Editar produto" : "Novo produto"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {modal === "edit" && (
              <div>
                <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Código</label>
                <p className="font-mono text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
                  {products.find(p => p.id === editingId)?.code}
                  <span className="ml-2 text-xs text-gray-400">(gerado automaticamente)</span>
                </p>
              </div>
            )}
            <div>
              <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Nome</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Categoria</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Unidade</label>
                <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input">
                  {UNITS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Quantidade atual</label>
                <input type="number" min={0} value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} className="input" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Estoque mínimo</label>
                <input type="number" min={0} value={form.minQty} onChange={(e) => setForm({ ...form, minQty: e.target.value })} className="input" />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button onClick={() => setModal(null)} className="btn-cancel">Cancelar</button>
              <button onClick={handleSave} className="btn-save">Salvar</button>
            </div>
          </div>
        </Modal>
      )}

      {movProdId && <MovementModal initialProdId={movProdId} onClose={() => setMovProdId(null)} />}
    </div>
  );
}
