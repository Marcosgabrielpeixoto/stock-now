import { describe, it, expect } from "vitest";

// ─── Funções puras extraídas da lógica do sistema ───────────────────────────

function generateCode(id) {
  return `PRD-${String(id).padStart(4, "0")}`;
}

function getStatus(product) {
  if (product.qty === 0) return "out";
  if (product.qty <= product.minQty) return "low";
  return "ok";
}

function getExpiryStatus(product, today = new Date()) {
  if (!product.expiryDate) return null;
  const t = new Date(today); t.setHours(0, 0, 0, 0);
  const e = new Date(product.expiryDate); e.setHours(0, 0, 0, 0);
  const diff = Math.ceil((e - t) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "expired";
  if (diff <= 7) return "expiring";
  return "valid";
}

function getDaysUntilExpiry(product, today = new Date()) {
  if (!product.expiryDate) return null;
  const t = new Date(today); t.setHours(0, 0, 0, 0);
  const e = new Date(product.expiryDate); e.setHours(0, 0, 0, 0);
  return Math.ceil((e - t) / (1000 * 60 * 60 * 24));
}

function calculateAge(birthDate) {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function formatCPF(value) {
  return value.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

// ─── Testes Unitários ────────────────────────────────────────────────────────

describe("US7 - Geração de código de produto", () => {
  it("deve gerar código PRD-0001 para o id 1", () => {
    expect(generateCode(1)).toBe("PRD-0001");
  });
  it("deve gerar código PRD-0010 para o id 10", () => {
    expect(generateCode(10)).toBe("PRD-0010");
  });
  it("deve gerar código PRD-0100 para o id 100", () => {
    expect(generateCode(100)).toBe("PRD-0100");
  });
  it("códigos gerados para ids diferentes devem ser únicos", () => {
    const codes = [1, 2, 3, 4, 5].map(generateCode);
    const unique = new Set(codes);
    expect(unique.size).toBe(5);
  });
});

describe("US5 - Status de estoque do produto", () => {
  it("deve retornar 'out' quando quantidade é zero", () => {
    expect(getStatus({ qty: 0, minQty: 10 })).toBe("out");
  });
  it("deve retornar 'low' quando quantidade é igual ao mínimo", () => {
    expect(getStatus({ qty: 10, minQty: 10 })).toBe("low");
  });
  it("deve retornar 'low' quando quantidade é menor que o mínimo", () => {
    expect(getStatus({ qty: 3, minQty: 5 })).toBe("low");
  });
  it("deve retornar 'ok' quando quantidade é maior que o mínimo", () => {
    expect(getStatus({ qty: 50, minQty: 10 })).toBe("ok");
  });
});

describe("US2 - Status de validade do produto", () => {
  const today = new Date("2026-06-28");

  it("deve retornar null quando não há data de validade", () => {
    expect(getExpiryStatus({ expiryDate: "" }, today)).toBeNull();
  });
  it("deve retornar 'expired' quando produto está vencido", () => {
    expect(getExpiryStatus({ expiryDate: "2026-06-01" }, today)).toBe("expired");
  });
  it("deve retornar 'expiring' quando vence em até 7 dias", () => {
    expect(getExpiryStatus({ expiryDate: "2026-07-03" }, today)).toBe("expiring");
  });
  it("deve retornar 'expiring' quando vence hoje (0 dias)", () => {
    expect(getExpiryStatus({ expiryDate: "2026-06-28" }, today)).toBe("expiring");
  });
  it("deve retornar 'valid' quando vence depois de 7 dias", () => {
    expect(getExpiryStatus({ expiryDate: "2026-12-31" }, today)).toBe("valid");
  });
  it("deve calcular corretamente os dias até o vencimento", () => {
    expect(getDaysUntilExpiry({ expiryDate: "2026-07-05" }, today)).toBe(7);
  });
});

describe("US9 - Validação de idade de funcionário", () => {
  it("deve retornar 18 para quem nasceu exatamente 18 anos atrás", () => {
    const birth = new Date();
    birth.setFullYear(birth.getFullYear() - 18);
    expect(calculateAge(birth.toISOString().slice(0, 10))).toBe(18);
  });
  it("deve retornar 0 para data vazia", () => {
    expect(calculateAge("")).toBe(0);
  });
  it("deve retornar idade correta para data conhecida", () => {
    const age = calculateAge("2000-01-01");
    expect(age).toBeGreaterThanOrEqual(26);
  });
  it("menor de 18 anos deve ser barrado (idade < 18)", () => {
    const birth = new Date();
    birth.setFullYear(birth.getFullYear() - 17);
    expect(calculateAge(birth.toISOString().slice(0, 10))).toBeLessThan(18);
  });
});

describe("US9 - Formatação de CPF", () => {
  it("deve formatar CPF corretamente", () => {
    expect(formatCPF("12345678901")).toBe("123.456.789-01");
  });
  it("deve ignorar caracteres não numéricos na entrada", () => {
    expect(formatCPF("123.456.789-01")).toBe("123.456.789-01");
  });
  it("deve limitar a 11 dígitos", () => {
    expect(formatCPF("123456789012345")).toBe("123.456.789-01");
  });
});
