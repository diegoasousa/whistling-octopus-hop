# 📋 Resumo da Integração Backend NestJS

Data: 03 de Fevereiro de 2026

## ✅ O Que Foi Implementado

### 1. **Tipos TypeScript Atualizados** (`src/types/api.ts`)
- ✅ Novo enum `ProductType`: PHOTOCARD, LIGHTSTICK, ALBUM, MERCH, DOLL, OTHER
- ✅ Campo `priceCents` em Products (converter para reais: `priceCents / 100`)
- ✅ Suporte a variações de produtos
- ✅ Tipos para Order, Payment, User
- ✅ Tipos para Mercado Pago

### 2. **API Client Completo** (`src/lib/api.ts`)
- ✅ `credentials: 'include'` em todas as requisições (JWT httpOnly)
- ✅ Produtos: `getProducts()`, `getProductById()`
- ✅ Pedidos: `createOrder()`, `getOrderById()`, `getOrderByNumber()`, `getMyOrders()`
- ✅ Pagamentos: `createMercadoPagoPreference()`, `getPaymentStatus()`
- ✅ Auth: `loginWithGoogle()`, `getCurrentUser()`, `logout()`

### 3. **Hook de Autenticação** (`src/hooks/use-auth.ts`)
- ✅ `useAuth()` para gerenciar estado de login
- ✅ Google OAuth redirect automático
- ✅ Caching com React Query (5min staleTime)
- ✅ Métodos: `login()`, `logout()`, `refetch()`

### 4. **Checkout com Mercado Pago** (`src/pages/Checkout.tsx`)
- ✅ Formulário de dados do cliente
- ✅ Criação de pedido
- ✅ Criação de preferência MP
- ✅ Redirecionamento para pagamento
- ✅ Suporte a variações e produtos

### 5. **Página de Detalhes do Pedido** (`src/pages/OrderDetail.tsx`)
- ✅ Consultar status do pedido
- ✅ Consultar status do pagamento
- ✅ Exibir itens, cliente, total
- ✅ Visualização de payment status (approved, pending, etc)

### 6. **Carrinho Atualizado** (`src/store/cart.tsx`)
- ✅ Suporte a variações de produtos
- ✅ Conversão automática de priceCents para reais
- ✅ Remover itens com variação específica

### 7. **Rota de Orders Adicionada** (`src/App.tsx`)
- ✅ Rota `/orders/:orderId` para detalhes do pedido

### 8. **Mock Products Compatíveis** (`src/mocks/products.ts`)
- ✅ Produtos com `priceCents` em vez de `price`
- ✅ Tipos corretos: PHOTOCARD, LIGHTSTICK, ALBUM, MERCH, DOLL, OTHER
- ✅ Campo `isActive` adicionado

### 9. **Documentação Completa**
- ✅ `BACKEND_INTEGRATION.md` - Guia rápido de uso
- ✅ `PAYMENT_FLOW.md` - Fluxo de pagamento Mercado Pago
- ✅ `.env.example` - Variáveis de ambiente

### 10. **Header com Autenticação** (`src/components/site/HeaderWithAuth.tsx`)
- ✅ Botão "Login Google"
- ✅ Menu do usuário autenticado
- ✅ Dropdown com "Meus Pedidos" e "Logout"
- ✅ Avatar com iniciais

---

## 🔧 Configuração Necessária

### Backend NestJS Esperado

```bash
http://localhost:3000/api
```

### Variáveis de Ambiente (`.env`)

```env
VITE_API_BASE=http://localhost:3000/api
VITE_USE_MOCKS=false  # true para testes sem backend
```

---

## 📦 Endpoints Integrados

### Produtos (Público)
- `GET /products` → `getProducts(params)`
- `GET /products/:id` → `getProductById(id)`

### Pedidos
- `POST /orders` → `createOrder(payload)`
- `GET /orders/:id` → `getOrderById(id)`
- `GET /orders/number/:orderNumber` → `getOrderByNumber(orderNumber)`
- `GET /orders/my-orders` → `getMyOrders()`

### Pagamentos (Mercado Pago)
- `POST /payments/mercadopago/preference` → `createMercadoPagoPreference(orderId)`
- `GET /payments/order/:orderId` → `getPaymentStatus(orderId)`

### Autenticação
- `GET /auth/google` → `loginWithGoogle()`
- `GET /auth/me` → `getCurrentUser()`
- `GET /auth/logout` → `logout()`

---

## 🚀 Como Usar

### 1. **Listar Produtos**
```tsx
import { getProducts } from "@/lib/api";

const { data } = useQuery({
  queryKey: ["products"],
  queryFn: () => getProducts({ type: "PHOTOCARD", limit: 12 })
});
```

### 2. **Adicionar ao Carrinho**
```tsx
import { useCart } from "@/store/cart";

const { addItem } = useCart();
addItem(product, quantity, variationId);
```

### 3. **Fazer Checkout com Pagamento**
```tsx
const orderRes = await createOrder(payload);
const pref = await createMercadoPagoPreference(orderRes.id);
window.location.href = pref.initPoint;
```

### 4. **Login Google**
```tsx
import { useAuth } from "@/hooks/use-auth";

const { user, login } = useAuth();
if (!user) <button onClick={login}>Login</button>;
```

---

## ⚠️ Pontos Importantes

1. **JWT em Cookies** → O token é httpOnly, enviado automaticamente
2. **Sempre use `credentials: 'include'`** → Já está em `fetchJson()`
3. **Converter Preços** → `priceCents / 100` para reais
4. **Variações Opcionais** → Nem todo produto tem
5. **Status do Pedido** → PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED
6. **ProductType** → PHOTOCARD | LIGHTSTICK | ALBUM | MERCH | DOLL | OTHER

---

## 📝 Próximos Passos (Opcional)

- [ ] Implementar página "Meus Pedidos"
- [ ] Webhook para status de pagamento em tempo real
- [ ] Filtros avançados de produtos
- [ ] Rastreamento de pedido
- [ ] Histórico de compras
- [ ] Wishlist
- [ ] Reviews de produtos

---

## 🎯 Checklist Pré-Produção

- [ ] Backend NestJS em `http://localhost:3000/api`
- [ ] JWT httpOnly configurado
- [ ] Mercado Pago integrado e credenciais atualizadas
- [ ] CORS configurado no backend
- [ ] URLs de callback do MP configuradas
- [ ] Variáveis de ambiente definidas
- [ ] Mock API desativado (`VITE_USE_MOCKS=false`)
- [ ] Testes de fluxo completo: produtos → carrinho → checkout → pagamento → status

---

## 📚 Arquivos Modificados

```
src/
├── types/api.ts                    ✅ Tipos do backend
├── lib/api.ts                      ✅ API client completo
├── hooks/use-auth.ts               ✅ Hook de autenticação
├── store/cart.tsx                  ✅ Carrinho com suporte a variações
├── pages/
│   ├── Checkout.tsx                ✅ Fluxo com MP
│   └── OrderDetail.tsx             ✅ Novo - detalhes do pedido
├── components/site/
│   ├── HeaderWithAuth.tsx          ✅ Novo - com login
│   └── Header.tsx                  ⚠️ Versão antiga (usar HeaderWithAuth)
├── mocks/products.ts               ✅ Atualizado para priceCents
├── App.tsx                         ✅ Rota /orders/:orderId adicionada
├── .env.example                    ✅ Novo
├── BACKEND_INTEGRATION.md          ✅ Novo - documentação
└── PAYMENT_FLOW.md                 ✅ Novo - fluxo de pagamento
```

---

## 🤝 Suporte

Para dúvidas sobre endpoints específicos do backend, consulte a documentação do NestJS em `STOREFRONT_API.md` no repositório do backend.

Última atualização: 03/02/2026
