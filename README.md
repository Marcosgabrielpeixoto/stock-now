# Stock Now

Sistema web de gerenciamento de estoque desenvolvido para auxiliar no controle de produtos, funcionários e movimentações, oferecendo recursos para organização e acompanhamento das operações de estoque.

## Funcionalidades

- Dashboard para visualização de informações do estoque.
- Autenticação e controle de acesso de usuários.
- Cadastro e gerenciamento de produtos.
- Cadastro e gerenciamento de funcionários.
- Registro de movimentações de estoque.
- Consulta ao histórico de movimentações.
- Identificação de produtos com estoque baixo ou zerado.
- Monitoramento da validade dos produtos.
- Área de ajuda do sistema.

## Tecnologias utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React | 19.2.6 | Construção da interface |
| Vite | 8.0.12 | Ambiente de desenvolvimento e build |
| JavaScript | ES Modules | Linguagem de programação |
| Firebase | 12.15.0 | Integração com serviços Firebase |
| Cloud Firestore | — | Banco de dados |
| Tailwind CSS | 3.4.19 | Estilização |
| Vitest | 4.1.9 | Testes automatizados |
| ESLint | 10.3.0 | Análise estática de código |
| XLSX | 0.18.5 | Manipulação de planilhas |

## Estrutura do projeto

```text
.
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── README.md
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── Employees.jsx
│   │   ├── Help.jsx
│   │   ├── Layout.jsx
│   │   ├── Login.jsx
│   │   ├── Modal.jsx
│   │   ├── MovementModal.jsx
│   │   ├── Movements.jsx
│   │   └── Products.jsx
│   ├── context/
│   │   └── StockContext.jsx
│   ├── firebase.js
│   ├── index.css
│   ├── main.jsx
│   └── tests/
│       ├── integration.test.js
│       ├── system-acceptance.test.js
│       └── unit.test.js
├── tailwind.config.js
├── vite.config.js
└── vitest.config.js
```

### Organização dos diretórios

- `public/`: arquivos estáticos e recursos públicos.
- `src/components/`: componentes e telas da aplicação.
- `src/context/`: gerenciamento de contexto e estado da aplicação.
- `src/tests/`: arquivos de testes automatizados.
- `src/firebase.js`: inicialização do Firebase e configuração do Firestore.

## Pré-requisitos

Antes de executar o projeto, é necessário possuir:

- [Node.js](https://nodejs.org/) instalado.
- npm (gerenciador de pacotes do Node.js).
- Uma conta no [Firebase](https://firebase.google.com/).

## Instalação

Clone o repositório:

```bash
git clone https://github.com/Marcosgabrielpeixoto/stock-now.git
```

Acesse o diretório do projeto:

```bash
cd stock-now
```

Instale as dependências:

```bash
npm install
```

## Configuração do Firebase

O projeto utiliza o Firebase Cloud Firestore como banco de dados.

Para configurar a integração:

1. Acesse o [Firebase Console](https://console.firebase.google.com/).
2. Crie um projeto no Firebase.
3. Registre uma aplicação Web no projeto.
4. Acesse as configurações da aplicação e obtenha as credenciais de configuração.
5. Abra o arquivo `src/firebase.js`.
6. Preencha os campos de `firebaseConfig` com os valores fornecidos pelo Firebase.

Exemplo da configuração utilizada:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

Após configurar as credenciais, a aplicação poderá inicializar a conexão com o Cloud Firestore.

**Importante:** configure adequadamente as regras de segurança do Firestore para proteger os dados armazenados.

## Executando a aplicação

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O Vite apresentará no terminal o endereço local para acessar a aplicação.

### Gerando a versão de produção

Para gerar os arquivos de produção:

```bash
npm run build
```

### Visualizando a versão de produção

Após gerar o build, execute:

```bash
npm run preview
```

## Scripts disponíveis

Os comandos disponíveis no `package.json` são:

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Gera a versão de produção. |
| `npm run lint` | Executa a análise estática com ESLint. |
| `npm run preview` | Executa uma pré-visualização do build de produção. |

## Testes automatizados

O projeto utiliza o **Vitest** para execução dos testes automatizados.

Os testes estão organizados em três arquivos:

| Arquivo | Descrição |
|---|---|
| `unit.test.js` | Verifica funções e regras de negócio isoladamente. |
| `integration.test.js` | Verifica a interação entre operações do sistema. |
| `system-acceptance.test.js` | Verifica fluxos de sistema e critérios de aceitação baseados em User Stories. |

### Funcionalidades cobertas pelos testes

**Testes unitários:**
- Geração de códigos de produtos.
- Identificação do status do estoque.
- Verificação da validade dos produtos.
- Cálculo da idade dos funcionários.
- Formatação de CPF.

**Testes de integração:**
- Login e controle de acesso.
- Cadastro, edição e exclusão de produtos.
- Geração de códigos únicos.
- Registro de entradas e saídas de estoque.
- Atualização de quantidades.
- Consulta ao histórico de movimentações.
- Cadastro e desligamento de funcionários.

**Testes de sistema:**
- Fluxo completo de controle de estoque.
- Geração de alertas de estoque.
- Monitoramento da validade dos produtos.
- Cadastro, login e desligamento de funcionários.
- Identificação de múltiplos produtos com alertas.

**Testes de aceitação:**

- US1: Registro de novos produtos.
- US2: Data de validade dos produtos.
- US5: Alertas para falta de produtos.
- US7: Código de identificação único por produto.
- US9: Cadastro de funcionários.

### Executando os testes

Para executar os testes diretamente pelo Vitest:

```bash
npx vitest run
```

Para executar em modo de observação:

```bash
npx vitest
```

**Observação:** os testes utilizam simulações em memória para verificar regras de negócio e fluxos do sistema. Eles não realizam integração direta com o Firebase ou com a interface React.
