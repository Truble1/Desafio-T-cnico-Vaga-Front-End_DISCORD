# Desafio CRUD Discord - Sistema de Produtos

Sistema completo de gerenciamento de produtos desenvolvido com Next.js, incluindo autenticação, CRUD completo e dashboard com métricas.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com SSR
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **HeroUI** - Componentes de interface
- **Zustand** - Gerenciamento de estado
- **Zod** - Validação de formulários
- **React Hook Form** - Formulários
- **Recharts** - Gráficos e métricas
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones

## ⚡ Funcionalidades

### 🔐 Autenticação
- Login de usuários
- Cadastro de novos usuários
- Gerenciamento de tokens JWT
- Proteção de rotas

### 📦 CRUD de Produtos
- ✅ Criar produtos com upload de imagem
- ✅ Listar produtos com paginação
- ✅ Editar produtos existentes
- ✅ Deletar produtos
- ✅ Atualizar thumbnail dos produtos
- ✅ Busca e filtros

### 📊 Dashboard e Métricas
- Gráficos de barras (produtos por mês)
- Gráficos de linha (receita)
- Gráfico de pizza (categorias)
- Cards com estatísticas
- Dados mockados para demonstração

### 🎨 Interface
- Design responsivo (desktop e mobile)
- Modo escuro/claro
- Componentes HeroUI
- Animações e transições
- Layout moderno e intuitivo

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- npm, yarn, pnpm ou bun

### Passos

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd desafio-crud-discord
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Execute o projeto em desenvolvimento:
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

4. Acesse no navegador:
```
http://localhost:3000
```

## 📖 Como usar

### 1. Criar uma conta
- Acesse `/register` ou clique em "Criar Conta"
- Preencha os dados pessoais e telefone
- Faça login com as credenciais criadas

### 2. Gerenciar produtos
- Acesse a página "Produtos" no menu
- Clique em "Novo Produto" para criar
- Use os botões de ação para editar ou deletar
- Faça upload de imagens (PNG, JPG, JPEG, WebP)

### 3. Visualizar métricas
- Acesse o "Dashboard" no menu
- Veja gráficos e estatísticas
- Dados são mockados para demonstração

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── dashboard/         # Página do dashboard
│   ├── login/            # Página de login
│   ├── products/         # Página de produtos
│   ├── register/         # Página de cadastro
│   ├── globals.css       # Estilos globais
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página inicial
├── components/            # Componentes React
│   ├── auth/             # Componentes de autenticação
│   ├── dashboard/        # Componentes do dashboard
│   ├── layout/           # Componentes de layout
│   └── products/         # Componentes de produtos
├── lib/                  # Utilitários e configurações
│   ├── api.ts           # Cliente da API
│   └── validations.ts   # Schemas de validação
├── providers/            # Providers do React
│   ├── providers.tsx    # Provider principal
│   └── theme-provider.tsx # Provider de tema
├── stores/              # Estados globais (Zustand)
│   ├── authStore.ts    # Store de autenticação
│   └── productStore.ts # Store de produtos
└── types/              # Tipos TypeScript
    └── api.ts         # Tipos da API
```

## 🔗 API

A aplicação consome a API: `https://api-teste-front-production.up.railway.app`

### Endpoints principais:
- `POST /auth/login` - Login
- `POST /users` - Cadastro
- `GET /products` - Listar produtos
- `POST /products` - Criar produto
- `PUT /products/{id}` - Atualizar produto
- `DELETE /products/{id}` - Deletar produto
- `PATCH /products/thumbnail/{id}` - Atualizar thumbnail

## 🎯 Critérios Atendidos

- ✅ **CRUD completo** de produtos
- ✅ **Gráficos** implementados com Recharts
- ✅ **Boas práticas** de código e estruturação
- ✅ **Responsividade** e uso do HeroUI
- ✅ **Validação** com Zod
- ✅ **Estado global** com Zustand
- ✅ **Autenticação** completa
- ✅ **Dark mode** funcional
- ✅ **Upload de arquivos**
- ✅ **TypeScript** em todo projeto

## 🚀 Deploy

### Deploy no Vercel

#### Opção 1: Via CLI (Recomendado)

1. Instale a CLI do Vercel:
```bash
npm i -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Na pasta do projeto:
```bash
vercel
```

4. Responda às configurações:
   - "Set up and deploy?" → **Yes**
   - "Which scope?" → Sua conta
   - "Link to existing project?" → **No** (primeira vez)
   - "Project name?" → `desafio-crud-discord`
   - "Directory?" → `./`

#### Opção 2: Via GitHub

1. Faça push para GitHub:
```bash
git init
git add .
git commit -m "Deploy: Sistema CRUD completo"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/desafio-crud-discord.git
git push -u origin main
```

2. Acesse [vercel.com](https://vercel.com)
3. Clique em "New Project"
4. Importe seu repositório
5. Configure:
   - Framework: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Deploy automático! 🚀

### Build Local

Para testar build de produção localmente:
```bash
npm run build
npm start
```

### Configurações de Deploy

O projeto já está configurado com:
- ✅ **next.config.js** otimizado
- ✅ **TypeScript** configurado
- ✅ **ESLint** configurado
- ✅ **Tailwind CSS** configurado
- ✅ **Responsive design**
- ✅ **API externa** (sem variáveis de ambiente necessárias)