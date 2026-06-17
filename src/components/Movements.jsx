import { useState } from "react";
import { useStock } from "../context/StockContext";
import MovementModal from "./MovementModal";

export default function Movements() {
  const { movements, products } = useStock();
  const [showModal, setShowModal] = useState(false);
  const sorted = [...movements].reverse();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + Nova movimentação
        </button>
      </div>
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
              <th className="text-left px-4 py-3 font-medium">Produto</th>
              <th className="text-left px-4 py-3 font-medium">Tipo</th>
              <th className="text-left px-4 py-3 font-medium">Qtd</th>
              <th className="text-left px-4 py-3 font-medium">Data</th>
              <th className="text-left px-4 py-3 font-medium">Observação</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((m) => {
              const p = products.find((x) => x.id === m.prodId);
              return (
                <tr key={m.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2.5 font-medium text-gray-800 dark:text-gray-100">{p ? p.name : "Produto removido"}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.type === "entrada" ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400" : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400"}`}>{m.type}</span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{m.qty} {p ? p.unit : ""}</td>
                  <td className="px-4 py-2.5 text-gray-400 dark:text-gray-500">{m.date}</td>
                  <td className="px-4 py-2.5 text-gray-400 dark:text-gray-500">{m.note || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showModal && <MovementModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
