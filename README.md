# 🏄‍♂️ SurfConnect — Sistema de Gestão para Escolas de Surf

SurfConnect é uma plataforma moderna e imersiva projetada para gerenciar agendamentos de aulas de surf, controle de alunos, instrutores e métricas financeiras. O sistema utiliza uma arquitetura robusta com RBAC (Controle de Acesso Baseado em Funções), oferecendo experiências personalizadas para Administradores, Instrutores e Alunos.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19**: Interface reativa e moderna.
- **Tailwind CSS 4**: Estilização de alta performance com design responsivo.
- **Lucide React**: Biblioteca de ícones elegantes.
- **React Router Dom**: Navegação entre páginas.
- **Hooks Customizados**: Lógica de interface reutilizável (ex: `useScrollDirection`).

### Backend
- **Node.js & Express**: API RESTful modularizada.
- **Prisma ORM**: Gerenciamento de banco de dados MySQL com tipagem segura.
- **JWT (JSON Web Token)**: Autenticação segura.
- **Bcrypt.js**: Criptografia de senhas.
- **Modularização de Rotas**: Estrutura organizada para escalabilidade.

---

## 🛠️ Como Instalar e Rodar

### Pré-requisitos
- Node.js instalado (v18+)
- Banco de dados MySQL rodando

### 1. Configuração do Backend
1. Entre na pasta backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env`:
   - Crie um arquivo `.env` na raiz da pasta `backend`.
   - Adicione sua URL de conexão MySQL: `DATABASE_URL="mysql://usuario:senha@localhost:3306/surfconnect"`
   - Adicione uma secret para o JWT: `JWT_SECRET="sua_chave_secreta_aqui"`
4. Rode as migrações do Prisma:
   ```bash
   npx prisma migrate dev --name init
   ```
5. (Opcional) Popule o banco com dados iniciais:
   ```bash
   npm run db:seed
   ```
6. Inicie o servidor:
   ```bash
   npm start
   ```

### 2. Configuração do Frontend
1. Entre na pasta frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o projeto em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## 🔐 Perfis de Acesso (RBAC)

O sistema possui três níveis de permissão:

- **Administrador (ADMIN)**:
  - Cria e gerencia aulas.
  - Visualiza faturamento e métricas totais.
  - Monitora todos os agendamentos e lista de instrutores.
- **Instrutor (INSTRUCTOR)**:
  - Visualiza seu quadro de aulas pessoal.
  - Gerencia lista de presença dos alunos.
  - Confirma pagamentos via sistema.
- **Aluno (STUDENT)**:
  - Visualiza previsão de ondas e clima (integrado).
  - Agenda aulas disponíveis.
  - Realiza pagamentos simulados via Pix.

---

## ✨ Funcionalidades Destacadas

- **UI Imersiva**: Design "Glassmorphism" com fundos cinematográficos e animações suaves.
- **Header Inteligente**: O menu de navegação desaparece ao rolar para baixo e reaparece ao rolar para cima.
- **Banco de Dados Auditável**: Todos os registros possuem timestamps (`createdAt`, `updatedAt`).
- **Previsão de Ondas**: Dashboard do aluno com resumo de condições do mar (Mock API).
- **Segurança**: Rotas protegidas por middleware de autenticação e verificação de cargo.

## 📡 API Endpoints (Principais)

### Autenticação
- `POST /api/auth/register`: Criação de usuário.
- `POST /api/auth/login`: Autenticação e recebimento de JWT.

### Aluno
- `GET /api/student/classes`: Lista aulas disponíveis.
- `GET /api/student/bookings`: Histórico de agendamentos.
- `POST /api/student/bookings`: Realiza novo agendamento.

### Instrutor
- `GET /api/instructor/classes`: Aulas atribuídas ao instrutor.
- `POST /api/instructor/attendance`: Confirma presença de aluno.

### Admin
- `GET /api/admin/metrics`: Dados do dashboard administrativo.
- `GET /api/admin/classes`: Lista todas as aulas.
- `POST /api/admin/classes`: Cria nova aula.

---

## 📄 Licença
Este projeto é para fins educacionais e de portfólio. Desenvolvido para facilitar a vida de escolas de surf ao redor do mundo. 🤙
