import { useStock } from "../context/StockContext";

export default function Dashboard() {
  const { products, movements, getStatus } = useStock();
  const total = products.length;
  const ok = products.filter((p) => getStatus(p) === "ok").length;
  const low = products.filter((p) => getStatus(p) === "low").length;
  const out = products.filter((p) => getStatus(p) === "out").length;
  const alerts = products.filter((p) => getStatus(p) !== "ok");
  const recent = [...movements].reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Total de itens" value={total} />
        <MetricCard label="Estoque ok" value={ok} color="text-emerald-600" />
        <MetricCard label="Estoque baixo" value={low} color="text-amber-600" />
        <MetricCard label="Sem estoque" value={out} color="text-red-500" />
      </div>

      {alerts.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">⚠️ Alertas de estoque</h2>
          <div className="space-y-2">
            {alerts.map((p) => {
              const isOut = getStatus(p) === "out";
              return (
                <div key={p.id} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                  isOut ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900"
                        : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900"}`}>
                  <span>{isOut ? "🚫" : "📉"}</span>
                  <span className="flex-1">{p.name}</span>
                  <span className="font-medium">{p.qty} {p.unit} {isOut ? "(zerado)" : `(mín: ${p.minQty})`}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Últimas movimentações</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
              <th className="text-left pb-2 font-medium">Produto</th>
              <th className="text-left pb-2 font-medium">Tipo</th>
              <th className="text-left pb-2 font-medium">Qtd</th>
              <th className="text-left pb-2 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((m) => {
              const p = products.find((x) => x.id === m.prodId);
              return (
                <tr key={m.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <td className="py-2 text-gray-700 dark:text-gray-300">{p ? p.name : "—"}</td>
                  <td className="py-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.type === "entrada" ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400" : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400"}`}>{m.type}</span>
                  </td>
                  <td className="py-2 text-gray-700 dark:text-gray-300">{m.qty} {p ? p.unit : ""}</td>
                  <td className="py-2 text-gray-400 dark:text-gray-500">{m.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color = "text-gray-800 dark:text-gray-100" }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-medium ${color}`}>{value}</p>
    </div>
  );
}
