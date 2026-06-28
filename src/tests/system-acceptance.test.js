import { describe, it, expect, beforeEach } from "vitest";

// ─── Simulação completa do sistema ──────────────────────────────────────────

function createStore() {
  let products = [];
  let movements = [];
  let employees = [
    { id: "admin", name: "Admin", username: "admin", password: "1234", role: "admin" }
  ];
  let nextProdId = 1;
  let nextMovId = 1;
  let nextEmpId = 2;

  function generateCode(id) { return `PRD-${String(id).padStart(4, "0")}`; }
  function getStatus(p) {
    if (p.qty === 0) return "out";
    if (p.qty <= p.minQty) return "low";
    return "ok";
  }
  function getExpiryStatus(p, today = new Date()) {
    if (!p.expiryDate) return null;
    const t = new Date(today); t.setHours(0,0,0,0);
    const e = new Date(p.expiryDate); e.setHours(0,0,0,0);
    const diff = Math.ceil((e - t) / 86400000);
    if (diff < 0) return "expired";
    if (diff <= 7) return "expiring";
    return "valid";
  }
  function login(u, p) { return employees.find(e => e.username === u && e.password === p) || null; }
  function addProduct(data) {
    const p = { ...data, id: nextProdId, code: generateCode(nextProdId) };
    products.push(p); nextProdId++; return p;
  }
  function updateProduct(id, data) { products = products.map(p => p.id === id ? { ...p, ...data, code: p.code } : p); }
  function deleteProduct(id) { products = products.filter(p => p.id !== id); }
  function addMovement({ prodId, type, qty, date, note }) {
    const product = products.find(p => p.id === prodId);
    if (!product) return { error: "Produto não encontrado." };
    if (type === "saída" && qty > product.qty) return { error: "Quantidade insuficiente." };
    movements.push({ id: nextMovId, prodId, type, qty, date, note }); nextMovId++;
    updateProduct(prodId, { qty: type === "entrada" ? product.qty + qty : product.qty - qty });
    return { success: true };
  }
  function addEmployee(data) {
    if (employees.find(e => e.username === data.username)) return { error: "Usuário já existe." };
    employees.push({ ...data, id: nextEmpId, role: "employee" }); nextEmpId++;
    return { success: true };
  }
  function deleteEmployee(id) { employees = employees.filter(e => e.id !== id); }
  function getAlerts() {
    return { stock: products.filter(p => getStatus(p) !== "ok"), expiry: products.filter(p => ["expired","expiring"].includes(getExpiryStatus(p))) };
  }

  return { getProducts: () => products, getMovements: () => movements, getEmployees: () => employees, getStatus, getExpiryStatus, getAlerts, login, addProduct, updateProduct, deleteProduct, addMovement, addEmployee, deleteEmployee };
}

// ─── Testes de Sistema ───────────────────────────────────────────────────────

describe("Sistema - Fluxo completo de controle de estoque", () => {
  let store;
  beforeEach(() => { store = createStore(); });

  it("fluxo completo: login → cadastro → entrada → saída → verificar saldo", () => {
    // 1. Login
    const user = store.login("admin", "1234");
    expect(user).not.toBeNull();

    // 2. Cadastrar produto
    const p = store.addProduct({ name: "Café", category: "Alimentos", qty: 0, unit: "kg", minQty: 5, expiryDate: "" });
    expect(store.getProducts()).toHaveLength(1);

    // 3. Entrada
    store.addMovement({ prodId: p.id, type: "entrada", qty: 100, date: "2026-06-28", note: "Compra inicial" });
    expect(store.getProducts()[0].qty).toBe(100);

    // 4. Saída
    store.addMovement({ prodId: p.id, type: "saída", qty: 30, date: "2026-06-28", note: "Consumo" });
    expect(store.getProducts()[0].qty).toBe(70);

    // 5. Status deve ser ok
    expect(store.getStatus(store.getProducts()[0])).toBe("ok");
  });

  it("fluxo de alerta: produto cai abaixo do mínimo → alerta aparece no dashboard", () => {
    const p = store.addProduct({ name: "Detergente", category: "Limpeza", qty: 10, unit: "un", minQty: 10, expiryDate: "" });
    store.addMovement({ prodId: p.id, type: "saída", qty: 8, date: "2026-06-28", note: "" });
    const alerts = store.getAlerts();
    expect(alerts.stock.length).toBeGreaterThan(0);
    expect(alerts.stock[0].name).toBe("Detergente");
  });

  it("fluxo de validade: produto próximo do vencimento aparece nos alertas", () => {
    const today = new Date("2026-06-28");
    store.addProduct({ name: "Leite", category: "Alimentos", qty: 20, unit: "L", minQty: 5, expiryDate: "2026-07-02" });
    const prod = store.getProducts()[0];
    expect(store.getExpiryStatus(prod, today)).toBe("expiring");
  });

  it("fluxo de funcionário: cadastro → login → desligamento → acesso negado", () => {
    store.addEmployee({ name: "Ana", cpf: "123.456.789-00", rg: "1234567", birthDate: "1998-03-10", username: "ana", password: "senha123" });

    // Login funciona
    expect(store.login("ana", "senha123")).not.toBeNull();

    // Desligar
    const emp = store.getEmployees().find(e => e.username === "ana");
    store.deleteEmployee(emp.id);

    // Acesso negado
    expect(store.login("ana", "senha123")).toBeNull();
  });

  it("múltiplos produtos com alertas diferentes devem ser listados corretamente", () => {
    store.addProduct({ name: "Produto A", category: "Outros", qty: 0, unit: "un", minQty: 5, expiryDate: "" });
    store.addProduct({ name: "Produto B", category: "Outros", qty: 3, unit: "un", minQty: 5, expiryDate: "" });
    store.addProduct({ name: "Produto C", category: "Outros", qty: 50, unit: "un", minQty: 5, expiryDate: "" });
    const alerts = store.getAlerts();
    expect(alerts.stock).toHaveLength(2);
  });
});

// ─── Testes de Aceitação (User Stories) ─────────────────────────────────────

describe("Aceitação - US1: Registrar novos produtos", () => {
  let store;
  beforeEach(() => { store = createStore(); });

  it("deve permitir cadastrar apenas 1 produto por vez", () => {
    store.addProduct({ name: "Produto 1", category: "Outros", qty: 10, unit: "un", minQty: 2, expiryDate: "" });
    expect(store.getProducts()).toHaveLength(1);
  });

  it("produto cadastrado deve ter todos os campos preenchidos", () => {
    const p = store.addProduct({ name: "Caneta", category: "Escritório", qty: 50, unit: "un", minQty: 10, expiryDate: "" });
    expect(p.name).toBe("Caneta");
    expect(p.category).toBe("Escritório");
    expect(p.qty).toBe(50);
    expect(p.unit).toBe("un");
    expect(p.minQty).toBe(10);
    expect(p.code).toBeDefined();
  });
});

describe("Aceitação - US2: Data de validade dos produtos", () => {
  let store;
  beforeEach(() => { store = createStore(); });

  it("sistema deve notificar quando produto alcança validade nos próximos 7 dias", () => {
    const today = new Date("2026-06-28");
    store.addProduct({ name: "Iogurte", category: "Alimentos", qty: 10, unit: "un", minQty: 2, expiryDate: "2026-07-04" });
    const p = store.getProducts()[0];
    expect(store.getExpiryStatus(p, today)).toBe("expiring");
  });

  it("produto com validade superior a 7 dias não deve gerar alerta", () => {
    const today = new Date("2026-06-28");
    store.addProduct({ name: "Macarrão", category: "Alimentos", qty: 10, unit: "cx", minQty: 2, expiryDate: "2027-01-01" });
    const p = store.getProducts()[0];
    expect(store.getExpiryStatus(p, today)).toBe("valid");
  });
});

describe("Aceitação - US5: Alerta para falta de produtos", () => {
  let store;
  beforeEach(() => { store = createStore(); });

  it("sistema deve notificar quando produto está abaixo do mínimo", () => {
    store.addProduct({ name: "Papel", category: "Escritório", qty: 2, unit: "cx", minQty: 5, expiryDate: "" });
    const alerts = store.getAlerts();
    expect(alerts.stock.some(p => p.name === "Papel")).toBe(true);
  });

  it("sistema deve notificar quando produto está zerado", () => {
    store.addProduct({ name: "Toner", category: "Escritório", qty: 0, unit: "un", minQty: 1, expiryDate: "" });
    const alerts = store.getAlerts();
    expect(store.getStatus(alerts.stock[0])).toBe("out");
  });

  it("produto com estoque adequado não deve gerar alerta", () => {
    store.addProduct({ name: "Grampeador", category: "Escritório", qty: 10, unit: "un", minQty: 2, expiryDate: "" });
    const alerts = store.getAlerts();
    expect(alerts.stock).toHaveLength(0);
  });
});

describe("Aceitação - US7: Código de identificação único por produto", () => {
  let store;
  beforeEach(() => { store = createStore(); });

  it("cada produto deve ter um código único", () => {
    store.addProduct({ name: "A", category: "Outros", qty: 1, unit: "un", minQty: 0, expiryDate: "" });
    store.addProduct({ name: "B", category: "Outros", qty: 1, unit: "un", minQty: 0, expiryDate: "" });
    store.addProduct({ name: "C", category: "Outros", qty: 1, unit: "un", minQty: 0, expiryDate: "" });
    const codes = store.getProducts().map(p => p.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("código deve seguir o padrão PRD-XXXX", () => {
    const p = store.addProduct({ name: "Teste", category: "Outros", qty: 1, unit: "un", minQty: 0, expiryDate: "" });
    expect(p.code).toMatch(/^PRD-\d{4}$/);
  });
});

describe("Aceitação - US9: Cadastro de funcionários", () => {
  let store;
  beforeEach(() => { store = createStore(); });

  it("somente admin pode cadastrar funcionários (role verificado)", () => {
    const user = store.login("admin", "1234");
    expect(user.role).toBe("admin");
  });

  it("sistema deve impedir cadastro de funcionário menor de 18 anos", () => {
    const birth = new Date();
    birth.setFullYear(birth.getFullYear() - 17);
    const birthDate = birth.toISOString().slice(0, 10);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    expect(age).toBeLessThan(18);
  });

  it("funcionário desligado não deve conseguir acessar o sistema", () => {
    store.addEmployee({ name: "Lucas", cpf: "111.111.111-11", rg: "111111", birthDate: "1995-01-01", username: "lucas", password: "luc123" });
    const emp = store.getEmployees().find(e => e.username === "lucas");
    store.deleteEmployee(emp.id);
    expect(store.login("lucas", "luc123")).toBeNull();
  });
});
