import { createContext, useContext, useState, useEffect } from "react";

const StockContext = createContext(null);

function generateCode(id) {
  return `PRD-${String(id).padStart(4, "0")}`;
}

const initialProducts = [
  { id: 1, code: "PRD-0001", name: "Farinha de trigo", category: "Alimentos", qty: 50, unit: "kg", minQty: 10 },
  { id: 2, code: "PRD-0002", name: "Detergente", category: "Limpeza", qty: 3, unit: "un", minQty: 5 },
  { id: 3, code: "PRD-0003", name: "Água mineral", category: "Bebidas", qty: 0, unit: "L", minQty: 12 },
  { id: 4, code: "PRD-0004", name: "Papel A4", category: "Escritório", qty: 8, unit: "cx", minQty: 2 },
  { id: 5, code: "PRD-0005", name: "Sabonete", category: "Higiene", qty: 20, unit: "un", minQty: 10 },
];

const initialMovements = [
  { id: 1, prodId: 1, type: "entrada", qty: 50, date: "2026-06-10", note: "Compra inicial" },
  { id: 2, prodId: 2, type: "saída", qty: 2, date: "2026-06-11", note: "Uso operacional" },
  { id: 3, prodId: 3, type: "entrada", qty: 24, date: "2026-06-11", note: "Entrega fornecedor" },
  { id: 4, prodId: 3, type: "saída", qty: 24, date: "2026-06-12", note: "Distribuição" },
];

export function StockProvider({ children }) {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(initialProducts);
  const [movements, setMovements] = useState(initialMovements);
  const [nextProdId, setNextProdId] = useState(6);
  const [nextMovId, setNextMovId] = useState(5);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  function login(username, password) {
    if (username === "admin" && password === "1234") { setUser(username); return true; }
    return false;
  }
  function logout() { setUser(null); }

  function addProduct(data) {
    const code = generateCode(nextProdId);
    setProducts((prev) => [...prev, { ...data, id: nextProdId, code }]);
    setNextProdId((n) => n + 1);
  }

  function updateProduct(id, data) {
    // Mantém o código original ao editar
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data, code: p.code } : p)));
  }

  function deleteProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function addMovement({ prodId, type, qty, date, note }) {
    const product = products.find((p) => p.id === prodId);
    if (!product) return { error: "Produto não encontrado." };
    if (type === "saída" && qty > product.qty)
      return { error: `Quantidade insuficiente. Estoque atual: ${product.qty} ${product.unit}` };
    setMovements((prev) => [...prev, { id: nextMovId, prodId, type, qty, date, note }]);
    setNextMovId((n) => n + 1);
    setProducts((prev) => prev.map((p) =>
      p.id === prodId ? { ...p, qty: type === "entrada" ? p.qty + qty : p.qty - qty } : p
    ));
    return { success: true };
  }

  function getStatus(product) {
    if (product.qty === 0) return "out";
    if (product.qty <= product.minQty) return "low";
    return "ok";
  }

  return (
    <StockContext.Provider value={{
      user, login, logout,
      products, movements,
      addProduct, updateProduct, deleteProduct, addMovement,
      getStatus, darkMode, setDarkMode
    }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStock() { return useContext(StockContext); }
