import { describe, it, expect, beforeEach } from "vitest";

// ─── Simulação do estado do sistema (sem Firebase) ──────────────────────────

function createStore() {
  let products = [];
  let movements = [];
  let employees = [
    { id: "admin", name: "Admin", username: "admin", password: "1234", role: "admin" }
  ];
  let nextProdId = 1;
  let nextMovId = 1;
  let nextEmpId = 2;

  function generateCode(id) {
    return `PRD-${String(id).padStart(4, "0")}`;
  }

  function getStatus(product) {
    if (product.qty === 0) return "out";
    if (product.qty <= product.minQty) return "low";
    return "ok";
  }

  function login(username, password) {
    return employees.find(e => e.username === username && e.password === password) || null;
  }

  function addProduct(data) {
    const code = generateCode(nextProdId);
    const product = { ...data, id: nextProdId, code };
    products.push(product);
    nextProdId++;
    return product;
  }

  function updateProduct(id, data) {
    products = products.map(p => p.id === id ? { ...p, ...data, code: p.code } : p);
  }

  function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
  }

  function addMovement({ prodId, type, qty, date, note }) {
    const product = products.find(p => p.id === prodId);
    if (!product) return { error: "Produto não encontrado." };
    if (type === "saída" && qty > product.qty)
      return { error: `Quantidade insuficiente. Estoque atual: ${product.qty} ${product.unit}` };
    const movement = { id: nextMovId, prodId, type, qty, date, note };
    movements.push(movement);
    nextMovId++;
    updateProduct(prodId, { qty: type === "entrada" ? product.qty + qty : product.qty - qty });
    return { success: true };
  }

  function addEmployee(data) {
    if (employees.find(e => e.username === data.username))
      return { error: "Este nome de usuário já existe." };
    const emp = { ...data, id: nextEmpId, role: "employee" };
    employees.push(emp);
    nextEmpId++;
    return { success: true };
  }

  function deleteEmployee(id) {
    employees = employees.filter(e => e.id !== id);
  }

  return { getProducts: () => products, getMovements: () => movements, getEmployees: () => employees, getStatus, login, addProduct, updateProduct, deleteProduct, addMovement, addEmployee, deleteEmployee };
}

// ─── Testes de Integração ────────────────────────────────────────────────────

describe("Integração - Login e controle de acesso", () => {
  let store;
  beforeEach(() => { store = createStore(); });

  it("admin deve conseguir fazer login com credenciais corretas", () => {
    const user = store.login("admin", "1234");
    expect(user).not.toBeNull();
    expect(user.role).toBe("admin");
  });

  it("login com senha errada deve retornar null", () => {
    expect(store.login("admin", "senhaerrada")).toBeNull();
  });

  it("login com usuário inexistente deve retornar null", () => {
    expect(store.login("fantasma", "1234")).toBeNull();
  });

  it("funcionário cadastrado deve conseguir fazer login", () => {
    store.addEmployee({ name: "João", cpf: "111.222.333-44", rg: "1234567", birthDate: "1995-01-01", username: "joao", password: "abc123" });
    const user = store.login("joao", "abc123");
    expect(user).not.toBeNull();
    expect(user.role).toBe("employee");
  });
});

describe("Integração - Cadastro e listagem de produtos", () => {
  let store;
  beforeEach(() => { store = createStore(); });

  it("produto cadastrado deve aparecer na listagem", () => {
    store.addProduct({ name: "Arroz", category: "Alimentos", qty: 100, unit: "kg", minQty: 20, expiryDate: "" });
    expect(store.getProducts()).toHaveLength(1);
    expect(store.getProducts()[0].name).toBe("Arroz");
  });

  it("produto cadastrado deve receber código automático único", () => {
    store.addProduct({ name: "Feijão", category: "Alimentos", qty: 50, unit: "kg", minQty: 10, expiryDate: "" });
    store.addProduct({ name: "Sal", category: "Alimentos", qty: 20, unit: "kg", minQty: 5, expiryDate: "" });
    const codes = store.getProducts().map(p => p.code);
    expect(new Set(codes).size).toBe(2);
  });

  it("produto excluído não deve aparecer na listagem", () => {
    const p = store.addProduct({ name: "Óleo", category: "Alimentos", qty: 10, unit: "L", minQty: 2, expiryDate: "" });
    store.deleteProduct(p.id);
    expect(store.getProducts()).toHaveLength(0);
  });

  it("edição de produto deve manter o código original", () => {
    const p = store.addProduct({ name: "Açúcar", category: "Alimentos", qty: 30, unit: "kg", minQty: 5, expiryDate: "" });
    const codigoOriginal = p.code;
    store.updateProduct(p.id, { name: "Açúcar Refinado", qty: 30, unit: "kg", minQty: 5, expiryDate: "" });
    expect(store.getProducts()[0].code).toBe(codigoOriginal);
  });
});

describe("Integração - Movimentações e atualização de estoque", () => {
  let store;
  beforeEach(() => {
    store = createStore();
    store.addProduct({ name: "Farinha", category: "Alimentos", qty: 0, unit: "kg", minQty: 5, expiryDate: "" });
  });

  it("entrada deve aumentar a quantidade do produto", () => {
    const prod = store.getProducts()[0];
    store.addMovement({ prodId: prod.id, type: "entrada", qty: 50, date: "2026-06-28", note: "" });
    expect(store.getProducts()[0].qty).toBe(50);
  });

  it("saída deve diminuir a quantidade do produto", () => {
    const prod = store.getProducts()[0];
    store.addMovement({ prodId: prod.id, type: "entrada", qty: 50, date: "2026-06-28", note: "" });
    store.addMovement({ prodId: prod.id, type: "saída", qty: 20, date: "2026-06-28", note: "" });
    expect(store.getProducts()[0].qty).toBe(30);
  });

  it("saída com quantidade maior que o estoque deve retornar erro", () => {
    const prod = store.getProducts()[0];
    store.addMovement({ prodId: prod.id, type: "entrada", qty: 10, date: "2026-06-28", note: "" });
    const result = store.addMovement({ prodId: prod.id, type: "saída", qty: 999, date: "2026-06-28", note: "" });
    expect(result.error).toBeDefined();
  });

  it("movimentação deve ser registrada no histórico", () => {
    const prod = store.getProducts()[0];
    store.addMovement({ prodId: prod.id, type: "entrada", qty: 30, date: "2026-06-28", note: "Compra" });
    expect(store.getMovements()).toHaveLength(1);
    expect(store.getMovements()[0].type).toBe("entrada");
  });
});

describe("Integração - Cadastro de funcionários", () => {
  let store;
  beforeEach(() => { store = createStore(); });

  it("funcionário cadastrado deve aparecer na listagem", () => {
    store.addEmployee({ name: "Maria", cpf: "111.222.333-44", rg: "123", birthDate: "1990-05-10", username: "maria", password: "123" });
    const emp = store.getEmployees().find(e => e.username === "maria");
    expect(emp).toBeDefined();
  });

  it("não deve permitir dois funcionários com o mesmo usuário", () => {
    store.addEmployee({ name: "João", cpf: "111.222.333-44", rg: "123", birthDate: "1990-01-01", username: "joao", password: "123" });
    const result = store.addEmployee({ name: "João 2", cpf: "999.888.777-66", rg: "456", birthDate: "1992-01-01", username: "joao", password: "456" });
    expect(result.error).toBeDefined();
  });

  it("funcionário desligado deve perder acesso ao sistema", () => {
    store.addEmployee({ name: "Pedro", cpf: "444.555.666-77", rg: "789", birthDate: "1988-03-15", username: "pedro", password: "abc" });
    const emp = store.getEmployees().find(e => e.username === "pedro");
    store.deleteEmployee(emp.id);
    expect(store.login("pedro", "abc")).toBeNull();
  });
});
