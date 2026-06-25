import { useState } from "react";
import { StockProvider, useStock } from "./context/StockContext";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Movements from "./components/Movements";
import Help from "./components/Help";

function AppContent() {
  const { user } = useStock();
  const [page, setPage] = useState("dashboard");

  if (!user) return <Login />;

  const pages = {
    dashboard: <Dashboard />,
    products: <Products />,
    movements: <Movements />,
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
