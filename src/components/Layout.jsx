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
  const { user, logout, darkMode, setDarkMode } = useStock();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <aside className="w-48 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col shrink-0">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <span className="text-base font-semibold text-emerald-600">Stock Now</span>
        </div>

        <nav className="flex-1 py-2">
          {navItems.map((item) => (
            <button key={item.page} onClick={() => setPage(item.page)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left transition-colors border-l-2
                ${page === item.page
                  ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-500 font-medium"
                  : "text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
                }`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-100 dark:border-gray-800 py-2">
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border-l-2 border-transparent transition-colors">
            <span>🚪</span> Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 flex items-center justify-between h-12">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{pageTitles[page]}</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)}
              className="text-lg p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={darkMode ? "Modo claro" : "Modo escuro"}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            <span className="text-xs text-gray-400 dark:text-gray-500">👤 {user}</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
