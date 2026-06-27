import { useState } from "react";
import { StockProvider, useStock } from "./context/StockContext";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Movements from "./components/Movements";
import Employees from "./components/Employees";
import Help from "./components/Help";

function AppContent() {
  const { user, userRole, loading } = useStock();
  const [page, setPage] = useState("dashboard");

  if (loading && !user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center space-y-3">
        <div className="text-3xl animate-pulse">📦</div>
        <p className="text-sm text-gray-400 dark:text-gray-500">Carregando Stock Now...</p>
      </div>
    </div>
  );

  if (!user) return <Login />;

  const pages = {
    dashboard: <Dashboard />,
    products: <Products />,
    movements: <Movements />,
    employees: userRole === "admin" ? <Employees /> : <Dashboard />,
    help: <Help />,
  };

  return (
    <Layout page={page} setPage={setPage}>
      {pages[page]}
    </Layout>
  );
}

export default function App() {
  return (
    <StockProvider>
      <AppContent />
    </StockProvider>
  );
}
