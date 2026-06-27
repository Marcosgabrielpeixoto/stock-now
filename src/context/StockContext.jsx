import { createContext, useContext, useState, useEffect } from "react";
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, setDoc, query, orderBy
} from "firebase/firestore";
import { db } from "../firebase";

const StockContext = createContext(null);

function generateCode(id) {
  return `PRD-${String(id).padStart(4, "0")}`;
}

const DEFAULT_ADMIN = {
  id: "admin",
  name: "Admin",
  cpf: "000.000.000-00",
  rg: "0000000",
  birthDate: "1990-01-01",
  username: "admin",
  password: "1234",
  role: "admin",
};

export function StockProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [employees, setEmployees] = useState([DEFAULT_ADMIN]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // Escuta produtos em tempo real
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("code"));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  // Escuta movimentações em tempo real
  useEffect(() => {
    const q = query(collection(db, "movements"), orderBy("date"));
    const unsub = onSnapshot(q, (snap) => {
      setMovements(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // Escuta funcionários em tempo real
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "employees"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEmployees([DEFAULT_ADMIN, ...list]);
    });
    return unsub;
  }, []);

  function login(username, password) {
    const emp = employees.find((e) => e.username === username && e.password === password);
    if (emp) { setUser(emp.name); setUserRole(emp.role); return true; }
    return false;
  }

  function logout() { setUser(null); setUserRole(null); }

  async function addProduct(data) {
    const nextCode = `PRD-${String(products.length + 1).padStart(4, "0")}`;
    await addDoc(collection(db, "products"), { ...data, code: nextCode });
  }

  async function updateProduct(id, data) {
    await updateDoc(doc(db, "products", id), data);
  }

  async function deleteProduct(id) {
    await deleteDoc(doc(db, "products", id));
  }

  async function addMovement({ prodId, type, qty, date, note }) {
    const product = products.find((p) => p.id === prodId);
    if (!product) return { error: "Produto não encontrado." };
    if (type === "saída" && qty > product.qty)
      return { error: `Quantidade insuficiente. Estoque atual: ${product.qty} ${product.unit}` };
    await addDoc(collection(db, "movements"), { prodId, type, qty, date, note });
    await updateDoc(doc(db, "products", prodId), {
      qty: type === "entrada" ? product.qty + qty : product.qty - qty,
    });
    return { success: true };
  }

  async function addEmployee(data) {
    const all = [...employees];
    if (all.find((e) => e.username === data.username))
      return { error: "Este nome de usuário já existe." };
    await addDoc(collection(db, "employees"), { ...data, role: "employee" });
    return { success: true };
  }

  async function deleteEmployee(id) {
    await deleteDoc(doc(db, "employees", id));
  }

  function getStatus(product) {
    if (product.qty === 0) return "out";
    if (product.qty <= product.minQty) return "low";
    return "ok";
  }

  function getExpiryStatus(product) {
    if (!product.expiryDate) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const expiry = new Date(product.expiryDate); expiry.setHours(0, 0, 0, 0);
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "expired";
    if (diff <= 7) return "expiring";
    return "valid";
  }

  function getDaysUntilExpiry(product) {
    if (!product.expiryDate) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const expiry = new Date(product.expiryDate); expiry.setHours(0, 0, 0, 0);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  }

  return (
    <StockContext.Provider value={{
      user, userRole, login, logout, loading,
      products, movements, employees,
      addProduct, updateProduct, deleteProduct,
      addMovement, addEmployee, deleteEmployee,
      getStatus, getExpiryStatus, getDaysUntilExpiry,
      darkMode, setDarkMode
    }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStock() { return useContext(StockContext); }
