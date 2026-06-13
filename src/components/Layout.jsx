import { useStock } from "../context/StockContext";

const navItems = [
  { page: "dashboard", icon: "📊", label: "Dashboard" },
  { page: "products", icon: "📦", label: "Produtos" },
  { page: "movements", icon: "🔄", label: "Movimentações" },
];

const pageTitles = {
  dashboard: "Dashboard",
  products: "Produtos e Insumos",
  movements: "Movimentações",
};

export default function Layout({ page, setPage, children }) {
  const { user, logout } = useStock();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-48 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className="text-base font-semibold text-emerald-600">Stock Now</span>
        </div>
        <nav className="flex-1 py-2">
          {navItems.map((item) => (
            <button key={item.page} onClick={() => setPage(item.page)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left transition-colors border-l-2
                ${page === item.page
                  ? "bg-emerald-50 text-emerald-700 border-emerald-500 font-medium"
                  : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-700"}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-gray-100 py-2">
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-500 hover:bg-gray-50 border-l-2 border-transparent transition-colors">
            <span>🚪</span> Sair
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-6 flex items-center justify-between h-12">
          <span className="text-sm font-medium text-gray-700">{pageTitles[page]}</span>
          <span className="text-xs text-gray-400">👤 {user}</span>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}