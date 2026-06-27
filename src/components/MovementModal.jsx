import { useState } from "react";
import { useStock } from "../context/StockContext";
import Modal from "./Modal";

export default function MovementModal({ initialProdId = null, onClose }) {
  const { products, addMovement } = useStock();
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    prodId: initialProdId || products[0]?.id || "",
    type: "entrada", qty: 1, date: today, note: ""
  });
  const [saving, setSaving] = useState(false);
  const currentProduct = products.find((p) => p.id === form.prodId);

  async function handleSave() {
    if (!form.qty || Number(form.qty) <= 0) return alert("Informe uma quantidade válida.");
    setSaving(true);
    const result = await addMovement({
      prodId: form.prodId,
      type: form.type,
      qty: Number(form.qty),
      date: form.date,
      note: form.note,
    });
    setSaving(false);
    if (result?.error) return alert(result.error);
    onClose();
  }

  return (
    <Modal title="Movimentar estoque" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Produto</label>
          <select value={form.prodId} onChange={(e) => setForm({ ...form, prodId: e.target.value })} className="input w-full">
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        {currentProduct && <p className="text-xs text-gray-400 dark:text-gray-500">Estoque atual: <strong className="text-gray-600 dark:text-gray-300">{currentProduct.qty} {currentProduct.unit}</strong></p>}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Tipo</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input w-full">
              <option value="entrada">Entrada</option>
              <option value="saída">Saída</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Quantidade</label>
            <input type="number" min={1} value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} className="input w-full" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Data</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input w-full" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Observação</label>
          <input type="text" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Opcional" className="input w-full" />
        </div>
        <div className="flex gap-2 justify-end pt-1">
          <button onClick={onClose} className="btn-cancel">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="btn-save disabled:opacity-50">
            {saving ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
