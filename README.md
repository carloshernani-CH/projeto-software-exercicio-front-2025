# Catálogo de Filmes - Front-End

Interface web para gerenciamento de catálogo de filmes com autenticação Auth0.

## Funcionalidades

- Login/Logout com Auth0
- Cadastro de filmes (nome, descrição, nota 0-5, diretor)
- Listagem de todos os filmes
- Exclusão de filmes (apenas para usuários administradores)
- Interface responsiva e moderna

## Tecnologias

- React 19
- Vite
- Auth0 React SDK
- TailwindCSS (classes inline)

## Configuração Local

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env
```

### Configurar Variáveis de Ambiente

Edite o arquivo `.env`:

```env
VITE_API_URL=http://localhost:8080
```

### Executar Localmente

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Configuração Auth0

As credenciais do Auth0 já estão configuradas em [src/main.jsx](src/main.jsx):

- **Domain**: `dev-vlbhbshl7b1pxe8e.us.auth0.com`
- **Client ID**: `4rwe12yYJbxAD122EDkjl61unHBaHFL0`
- **Audience**: `https://dev-vlbhbshl7b1pxe8e.us.auth0.com/api/v2/`

Para usar seu próprio tenant Auth0:

1. Acesse [Auth0 Dashboard](https://manage.auth0.com/)
2. Crie uma Application do tipo "Single Page Application"
3. Configure as URLs permitidas:
   - **Allowed Callback URLs**: `http://localhost:5173, https://seu-dominio.vercel.app`
   - **Allowed Logout URLs**: `http://localhost:5173, https://seu-dominio.vercel.app`
   - **Allowed Web Origins**: `http://localhost:5173, https://seu-dominio.vercel.app`
4. Atualize os valores em `src/main.jsx`

### Configurar Permissões de Admin

Para permitir que usuários excluam filmes:

1. No Auth0 Dashboard, vá em **User Management > Roles**
2. Crie uma Role chamada "Admin"
3. Adicione a permissão `delete:filmes` ou `ADMIN`
4. Atribua a role aos usuários que devem ter permissão de exclusão

## Deploy no Vercel

### Método 1: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### Método 2: Via Dashboard

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em "Add New Project"
3. Importe o repositório do GitHub
4. Configure as variáveis de ambiente:
   - `VITE_API_URL`: URL da sua API na AWS (ex: `http://seu-ip-ec2:8080`)
5. Clique em "Deploy"

### Configurar Variáveis de Ambiente no Vercel

No dashboard do Vercel, em **Settings > Environment Variables**, adicione:

```
VITE_API_URL = http://SEU_IP_EC2:8080
```

### Atualizar Auth0 com URL do Vercel

Após o deploy, atualize as URLs permitidas no Auth0:

1. Acesse Auth0 Dashboard > Applications
2. Adicione a URL do Vercel em:
   - **Allowed Callback URLs**: `https://seu-app.vercel.app`
   - **Allowed Logout URLs**: `https://seu-app.vercel.app`
   - **Allowed Web Origins**: `https://seu-app.vercel.app`

## Estrutura do Projeto

```
src/
├── Filme.jsx          # Componente principal de gerenciamento de filmes
├── App.jsx            # Componente raiz
├── main.jsx           # Entry point com Auth0Provider
├── LoginButton.jsx    # Botão de login
├── LogoutButton.jsx   # Botão de logout
└── index.css          # Estilos globais
```

## Scripts Disponíveis

```bash
npm run dev       # Executar em modo desenvolvimento
npm run build     # Build para produção
npm run preview   # Preview do build
npm run lint      # Linter
```

## Integração com Back-End

A aplicação consome a API REST do back-end. Certifique-se de que:

1. A API está rodando e acessível
2. CORS está configurado corretamente no back-end
3. A variável `VITE_API_URL` aponta para o endereço correto da API

## Troubleshooting

### Erro CORS

Se você encontrar erros de CORS, verifique se o back-end está com CORS configurado corretamente em `SecurityConfig.java`.

### Token inválido

Se o token não estiver funcionando:
1. Verifique se o `audience` no Auth0Provider corresponde ao configurado no back-end
2. Verifique se o `issuer-uri` no application.properties do back-end está correto

### Permissão negada ao excluir

Verifique se:
1. O usuário tem a role "Admin" no Auth0
2. As permissões `ADMIN` ou `delete:filmes` estão configuradas
3. O back-end está lendo corretamente as permissões do token JWT

## Licença

Projeto acadêmico - Insper