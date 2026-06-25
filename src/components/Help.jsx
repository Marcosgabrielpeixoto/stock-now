import { useState } from "react";
import { useStock } from "../context/StockContext";

const FAQS = [
  { q: "Como cadastrar um novo produto?", a: "Vá até a página 'Produtos', clique no botão '+ Novo produto' no canto superior direito, preencha os campos e clique em Salvar." },
  { q: "O que significa 'Estoque baixo'?", a: "Quando a quantidade atual de um produto é igual ou menor que o estoque mínimo definido no cadastro, ele entra em estado de 'Estoque baixo' e aparece nos alertas do Dashboard." },
  { q: "O que significa 'Sem estoque'?", a: "Quando a quantidade atual de um produto chega a zero, ele é marcado como 'Sem estoque' e aparece como alerta crítico no Dashboard." },
  { q: "Como registrar uma entrada ou saída?", a: "Na página 'Produtos', clique no botão 🔄 ao lado do produto desejado, ou acesse 'Movimentações' e clique em '+ Nova movimentação'. Escolha o tipo (entrada ou saída), informe a quantidade e confirme." },
  { q: "O sistema salva os dados automaticamente?", a: "Sim, todas as alterações são salvas automaticamente enquanto você usa o sistema. Porém, ao fechar o navegador os dados voltam ao estado inicial, pois ainda não há banco de dados persistente." },
  { q: "Como editar ou excluir um produto?", a: "Na página 'Produtos', clique no ícone ✏️ para editar ou 🗑️ para excluir o produto desejado." },
  { q: "Como alternar entre modo claro e escuro?", a: "Clique no botão 🌙 ou ☀️ no canto superior direito da barra do topo, ou no card de login." },
];

const TUTORIAL_STEPS = [
  {
    icon: "📊",
    title: "Dashboard",
    description: "A página inicial do sistema. Aqui você visualiza um resumo do estoque: total de itens, quantos estão em situação normal, com estoque baixo ou zerados. Também exibe alertas de produtos que precisam de atenção e as últimas movimentações registradas.",
  },
  {
    icon: "📦",
    title: "Produtos e Insumos",
    description: "Gerencie todos os produtos do estoque. Cadastre novos itens informando nome, categoria, unidade de medida, quantidade atual e estoque mínimo. Use a busca e o filtro por categoria para encontrar produtos rapidamente. Cada produto pode ser editado, excluído ou movimentado.",
  },
  {
    icon: "🔄",
    title: "Movimentações",
    description: "Registre entradas e saídas de produtos. Ao movimentar um item, o estoque é atualizado automaticamente. O sistema bloqueia saídas caso a quantidade solicitada seja maior do que o disponível. Todas as movimentações ficam registradas com data e observação.",
  },
  {
    icon: "⚠️",
    title: "Alertas de estoque",
    description: "O sistema monitora automaticamente todos os produtos. Quando um item atinge ou fica abaixo do estoque mínimo, ele aparece como 'Estoque baixo' (laranja). Quando chega a zero, aparece como 'Sem estoque' (vermelho). Esses alertas ficam visíveis no Dashboard.",
  },
  {
    icon: "🌙",
    title: "Modo escuro",
    description: "O sistema suporta modo claro e escuro. Para alternar, clique no botão 🌙 / ☀️ no canto superior direito da tela. A preferência é mantida durante toda a sessão.",
  },
];

export default function Help() {
  const [tab, setTab] = useState("tutorial");
  const [tutorialStep, setTutorialStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        {[
          { key: "tutorial", label: "📖 Tutorial" },
          { key: "faq", label: "❓ FAQ" },
          { key: "about", label: "ℹ️ Sobre" },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === t.key
                ? "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tutorial */}
      {tab === "tutorial" && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Passo {tutorialStep + 1} de {TUTORIAL_STEPS.length}
            </span>
            <div className="flex gap-1">
              {TUTORIAL_STEPS.map((_, i) => (
                <button key={i} onClick={() => setTutorialStep(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === tutorialStep ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`} />
              ))}
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">{TUTORIAL_STEPS[tutorialStep].icon}</div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              {TUTORIAL_STEPS[tutorialStep].title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {TUTORIAL_STEPS[tutorialStep].description}
            </p>
          </div>

          <div className="flex gap-2 justify-between">
            <button onClick={() => setTutorialStep((s) => Math.max(0, s - 1))}
              disabled={tutorialStep === 0}
              className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors">
              ← Anterior
            </button>
            {tutorialStep < TUTORIAL_STEPS.length - 1 ? (
              <button onClick={() => setTutorialStep((s) => s + 1)}
                className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                Próximo →
              </button>
            ) : (
              <button onClick={() => setTutorialStep(0)}
                className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                Recomeçar ↩
              </button>
            )}
          </div>
        </div>
      )}

      {/* FAQ */}
      {tab === "faq" && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
          {FAQS.map((item, i) => (
            <div key={i} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.q}</span>
                <span className="text-gray-400 ml-4 shrink-0">{openFaq === i ? "▲" : "▼"}</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sobre */}
      {tab === "about" && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 space-y-5">
          <div className="text-center">
            <div className="text-4xl mb-3">📦</div>
            <h2 className="text-lg font-semibold text-emerald-600">Stock Now</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Versão 1.0.0</p>
          </div>

          <div className="space-y-3 text-sm">
            <InfoRow label="Descrição" value="Sistema de controle de estoque desenvolvido como projeto acadêmico de Engenharia de Software." />
            <InfoRow label="Tecnologias" value="React, Tailwind CSS, Vite" />
            <InfoRow label="Hospedagem" value="Vercel" />
            <InfoRow label="Repositório" value="GitHub — Marcosgabrielpeixoto/estoque-agora" />
            <InfoRow label="Desenvolvido por" value="Equipe Stock Now" />
            <InfoRow label="Ano" value="2026" />
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 text-xs text-gray-400 dark:text-gray-500 text-center">
            Projeto acadêmico — Engenharia de Software
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-400 dark:text-gray-500 w-32 shrink-0">{label}</span>
      <span className="text-gray-700 dark:text-gray-300">{value}</span>
    </div>
  );
}
