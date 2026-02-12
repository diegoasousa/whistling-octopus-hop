# 🚀 Guia de Setup Completo

## ⚙️ Pré-requisitos

- **Node.js**: v18+ (verificar com `node --version`)
- **pnpm**: instalado globalmente (`npm install -g pnpm`)
- **Backend NestJS**: rodando em `http://localhost:3000`
- **Git**: para controle de versão

---

## 1️⃣ Configuração Local

### Clone ou Abra o Repositório

```bash
cd /Volumes/MacSSD/Projects/dyad-apps/whistling-octopus-hop
```

### Instale Dependências

```bash
pnpm install
# ou
npm install
```

### Configure Variáveis de Ambiente

```bash
# Copiar template
cp .env.example .env

# Editar .env
nano .env
# ou via VS Code
code .env
```

**Conteúdo padrão do `.env`**:

```env
VITE_API_BASE=http://localhost:3000/api
VITE_USE_MOCKS=false
```

### Inicie o Frontend

```bash
pnpm dev
# ou
npm run dev
```

Acesse: `http://localhost:8080`

---

## 2️⃣ Configuração do Backend NestJS

### Certifique-se que o Backend está Rodando

```bash
# Em outro terminal
cd /seu/caminho/backend-nestjs
npm run start:dev
```

Deve estar em: `http://localhost:3000`

### Verificar Conexão

```bash
# No terminal, testar:
curl http://localhost:3000/api/products

# Deve retornar algo como:
# {"items": [...], "page": 1, "pageSize": 12, "total": 50, "totalPages": 5}
```

---

## 3️⃣ Configurar Mercado Pago

### Credenciais

1. Vá em [https://www.mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2. Login com sua conta Mercado Pago
3. Vá em "Suas integrações" → "Credenciais"
4. Copie:
   - **Public Key** (começa com `APP_USR-`)
   - **Access Token** (começa com `APP_USR-`)

### No Backend NestJS

```bash
# .env
MERCADO_PAGO_PUBLIC_KEY=APP_USR-...
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-...
```

### Teste de Integração

```bash
curl -X POST http://localhost:3000/api/payments/mercadopago/preference \
  -H "Content-Type: application/json" \
  -d '{"orderId": "test-uuid-123"}'

# Deve retornar:
# {"initPoint": "https://www.mercadopago.com.uy/checkout/v1/...", "sandboxInitPoint": "..."}
```

---

## 4️⃣ Testar Fluxo Completo

### 🔄 Teste 1: Listar Produtos

```bash
# Frontend
1. Abra http://localhost:8080/products
2. Deve mostrar lista de produtos
3. DevTools > Network > Verificar GET /api/products (Status 200)
```

### 🛒 Teste 2: Adicionar ao Carrinho

```bash
# Frontend
1. Clique em um produto
2. Clique em "Adicionar ao carrinho"
3. Badge do carrinho deve mostrar "1"
4. localStorage deve ter 'kpop_storefront_cart_v1'
```

### 📋 Teste 3: Criar Pedido

```bash
# Frontend
1. Vá em /checkout
2. Preencha formulário:
   - Nome: "Teste Silva"
   - Email: "teste@email.com"
   - Telefone: "11999999999"
   - CEP: "01000-000"
   - Cidade: "São Paulo"
   - Estado: "SP"
   - Endereço: "Rua Teste, 123"
3. Clique "Confirmar e processar pagamento"
4. Deve exibir ID e Número do pedido
5. Network > POST /api/orders (Status 201)
```

### 💳 Teste 4: Ir para Mercado Pago

```bash
# Frontend
1. Após criar pedido, clique "Ir para pagamento (Mercado Pago)"
2. Deve redirecionar para MP
3. Pode usar cartão de teste (sandbox):
   - Número: 4111 1111 1111 1111
   - Data: 11/25
   - CVV: 123
```

### ✅ Teste 5: Verificar Status

```bash
# Frontend
1. Após pagamento no MP, você redirecionará para /orders/:orderId
2. Ou acesse manualmente: http://localhost:8080/orders/seu-order-id
3. Deve exibir:
   - Número do pedido
   - Status do pagamento
   - Itens
   - Total
```

---

## 5️⃣ Testar Autenticação

### Login Google (Requer Configuração OAuth)

```bash
# Backend .env (adicionar)
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

### Frontend - Teste Manual

```bash
# 1. Abra http://localhost:8080
# 2. Procure botão "Login Google" (em HeaderWithAuth.tsx)
# 3. Clique → Redireciona para Google
# 4. Após login → Retorna com JWT em cookie
# 5. Agora pode acessar GET /orders/my-orders
```

---

## 6️⃣ Build para Produção

### Gerar Build Otimizado

```bash
pnpm build
# ou
npm run build
```

Output em `dist/`

### Visualizar Build Localmente

```bash
pnpm preview
# Acessa em http://localhost:4173
```

### Deploy

```bash
# Opções:
# 1. Vercel (já configurado)
vercel

# 2. Netlify
netlify deploy --prod --dir=dist

# 3. Docker
docker build -t neon-fandom .
docker run -p 8080:8080 neon-fandom
```

---

## 7️⃣ Variáveis de Ambiente por Ambiente

### Desenvolvimento (`.env`)

```env
VITE_API_BASE=http://localhost:3000/api
VITE_USE_MOCKS=false
```

### Staging (`.env.staging`)

```env
VITE_API_BASE=https://api-staging.seu-dominio.com/api
VITE_USE_MOCKS=false
```

### Produção (`.env.production`)

```env
VITE_API_BASE=https://api.seu-dominio.com/api
VITE_USE_MOCKS=false
```

### Usar Ambiente Específico

```bash
# Build com environment
VITE_API_BASE=https://api.seu-dominio.com/api pnpm build

# Ou configurar via .env.production
VITE_API_BASE=https://seu-api.com pnpm build --mode production
```

---

## 8️⃣ Troubleshooting Setup

### ❌ "Cannot GET /products"

**Causa**: Frontend não está conectando ao backend

**Solução**:
```bash
# 1. Verificar se backend está rodando
lsof -i :3000

# 2. Verificar VITE_API_BASE em .env
cat .env | grep VITE_API_BASE

# 3. Reiniciar frontend
pnpm dev
```

### ❌ "Module not found" ou Erros de Import

**Causa**: node_modules não instalado corretamente

**Solução**:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### ❌ "CORS Error"

**Causa**: Backend não aceitando requisições

**Solução**: Backend deve ter:
```typescript
app.enableCors({
  origin: 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### ❌ "Port 8080 already in use"

**Solução**:
```bash
# Matar processo na porta
lsof -i :8080
kill -9 <PID>

# Ou usar porta diferente
VITE_DEV_SERVER_PORT=8081 pnpm dev
```

### ❌ "Jest/ESLint Errors"

**Solução**:
```bash
pnpm lint
pnpm lint --fix  # Auto-corrigir
```

---

## 9️⃣ Scripts Úteis

```bash
# Desenvolvimento
pnpm dev              # Iniciar dev server
pnpm build            # Build para produção
pnpm preview          # Visualizar build
pnpm lint             # Verificar código
pnpm lint --fix       # Corrigir automaticamente

# Útil no desenvolvimento
pnpm dev --host       # Acesso de outro computador (192.168.x.x:8080)
pnpm build --mode development  # Build em modo dev
```

---

## 🔟 Checklist Final

- [ ] Node.js v18+ instalado
- [ ] pnpm instalado
- [ ] Backend NestJS rodando em port 3000
- [ ] `.env` configurado com `VITE_API_BASE`
- [ ] `pnpm install` executado
- [ ] `pnpm dev` funcionando sem erros
- [ ] Página de produtos carrega (GET /products)
- [ ] Pode adicionar produtos ao carrinho
- [ ] Pode fazer checkout
- [ ] Mercado Pago redirection funciona
- [ ] Build (`pnpm build`) sem erros

---

## 📞 Próximos Passos

1. **Implementar mais features**:
   - Filtros de produtos
   - Wishlist
   - Reviews
   - Rastreamento de pedidos

2. **Melhorar UX**:
   - Loading states
   - Skeleton screens
   - Offline support (PWA)
   - Dark mode (já tem CSS base)

3. **Performance**:
   - Code splitting
   - Image optimization
   - Caching estratégico
   - Lazy loading

4. **Segurança**:
   - CSRF protection
   - Rate limiting
   - Input validation
   - XSS prevention

---

## 📚 Referências Importantes

- [Documentação de Integração](./BACKEND_INTEGRATION.md)
- [Fluxo de Pagamento](./PAYMENT_FLOW.md)
- [Guia de Debug](./DEBUGGING.md)
- [Arquitetura](./ARCHITECTURE.md)

---

**Última atualização**: 03/02/2026
