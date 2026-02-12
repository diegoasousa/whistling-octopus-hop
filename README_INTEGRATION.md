# 📚 Índice de Documentação - Integração NestJS

Bem-vindo! Este documento lista todos os guias e referências para integração com o backend NestJS.

---

## 🎯 Começar Aqui

1. **[SETUP.md](./SETUP.md)** - Guia de instalação e configuração local
   - Requisitos
   - Setup passo-a-passo
   - Testes iniciais
   - Troubleshooting

2. **[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)** - Referência rápida da API
   - Autenticação Google
   - Endpoints de produtos
   - Endpoints de pedidos
   - Integração Mercado Pago
   - Exemplos de código

---

## 📖 Guias Completos

### 🏗️ Arquitetura
**[ARCHITECTURE.md](./ARCHITECTURE.md)**
- Estrutura de camadas
- Fluxos de dados
- Request/Response patterns
- Persistência de dados
- Segurança (JWT cookies)

### 🔄 Fluxo de Pagamento
**[PAYMENT_FLOW.md](./PAYMENT_FLOW.md)**
- Como funciona Mercado Pago
- URLs de callback
- Verificação de status
- Webhooks (recomendado)
- Checklist de implementação

### 🐛 Debugging
**[DEBUGGING.md](./DEBUGGING.md)**
- Problemas comuns e soluções
- Ferramentas de debug
- Logs estruturados
- Checklist de debug
- URLs para testar

### ✅ Resumo da Integração
**[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)**
- Tudo que foi implementado
- Arquivos modificados
- Endpoints integrados
- Próximos passos
- Checklist pré-produção

---

## 🔑 Referência Rápida

### Autenticação

```tsx
import { useAuth } from "@/hooks/use-auth";

const { user, login, logout, isAuthenticated } = useAuth();

// Login Google
<button onClick={login}>Login</button>

// Logout
<button onClick={logout}>Sair</button>

// Verificar autenticado
{isAuthenticated && <p>Olá, {user?.name}</p>}
```

### Produtos

```tsx
import { getProducts, getProductById } from "@/lib/api";

// Listar com filtros
const products = await getProducts({
  type: "PHOTOCARD",
  search: "BTS",
  page: 1,
  limit: 12,
});

// Detalhes
const product = await getProductById("uuid");
const price = product.priceCents / 100;  // Converter para reais
```

### Carrinho

```tsx
import { useCart } from "@/store/cart";

const { items, totalItems, subtotal, addItem, removeItem, updateQty } = useCart();

// Adicionar (com variação opcional)
addItem(product, quantity, variationId);

// Remover
removeItem(productId, variationId);

// Atualizar quantidade
updateQty(productId, quantity, variationId);
```

### Pedidos

```tsx
import { createOrder, getOrderById, getPaymentStatus } from "@/lib/api";

// Criar
const order = await createOrder({
  items: [{ productId, variationId, quantity }],
  customerName,
  customerEmail,
  customerPhone,
  shippingAddress,
  shippingCity,
  shippingState,
  shippingZipCode,
});

// Consultar
const order = await getOrderById(orderId);
const payment = await getPaymentStatus(orderId);
```

### Pagamento (Mercado Pago)

```tsx
import { createMercadoPagoPreference } from "@/lib/api";

// Criar preferência
const pref = await createMercadoPagoPreference(orderId);

// Redirecionar para MP
window.location.href = pref.initPoint;
```

---

## 📁 Estrutura de Arquivos

### Criados/Modificados

```
src/
├── types/api.ts                          [✏️ MODIFICADO]
│   └── Tipos atualizados para backend
│
├── lib/api.ts                            [✏️ MODIFICADO]
│   └── API client com todos endpoints
│
├── hooks/
│   └── use-auth.ts                       [✨ NOVO]
│       └── Hook de autenticação Google
│
├── store/cart.tsx                        [✏️ MODIFICADO]
│   └── Suporte a variações
│
├── pages/
│   ├── Checkout.tsx                      [✏️ MODIFICADO]
│   │   └── Fluxo com Mercado Pago
│   │
│   └── OrderDetail.tsx                   [✨ NOVO]
│       └── Detalhes e status do pedido
│
├── components/site/
│   ├── Header.tsx                        [⚠️ LEGADO]
│   └── HeaderWithAuth.tsx                [✨ NOVO]
│       └── Header com login Google
│
├── mocks/products.ts                     [✏️ MODIFICADO]
│   └── Atualizado para priceCents
│
└── App.tsx                               [✏️ MODIFICADO]
    └── Rota /orders/:orderId adicionada

Raiz do Projeto:
├── .env.example                          [✨ NOVO]
├── BACKEND_INTEGRATION.md                [✨ NOVO]
├── PAYMENT_FLOW.md                       [✨ NOVO]
├── ARCHITECTURE.md                       [✨ NOVO]
├── DEBUGGING.md                          [✨ NOVO]
├── SETUP.md                              [✨ NOVO]
└── INTEGRATION_SUMMARY.md                [✨ NOVO]

Legend:
  ✨ NOVO - Arquivo criado
  ✏️ MODIFICADO - Arquivo modificado
  ⚠️ LEGADO - Versão anterior (usar HeaderWithAuth)
```

---

## 🔗 Endpoints Integrados

### Produtos (Público)
| Método | Endpoint | Função |
|--------|----------|--------|
| GET | `/products` | `getProducts(params)` |
| GET | `/products/:id` | `getProductById(id)` |

### Pedidos
| Método | Endpoint | Função |
|--------|----------|--------|
| POST | `/orders` | `createOrder(payload)` |
| GET | `/orders/:id` | `getOrderById(id)` |
| GET | `/orders/number/:orderNumber` | `getOrderByNumber(number)` |
| GET | `/orders/my-orders` | `getMyOrders()` |

### Pagamentos
| Método | Endpoint | Função |
|--------|----------|--------|
| POST | `/payments/mercadopago/preference` | `createMercadoPagoPreference(orderId)` |
| GET | `/payments/order/:orderId` | `getPaymentStatus(orderId)` |

### Autenticação
| Método | Endpoint | Função |
|--------|----------|--------|
| GET | `/auth/google` | `loginWithGoogle()` |
| GET | `/auth/me` | `getCurrentUser()` |
| GET | `/auth/logout` | `logout()` |

---

## ⚙️ Configuração

### Variáveis de Ambiente (.env)

```env
# API Backend
VITE_API_BASE=http://localhost:3000/api

# Use mock data (desativar para produção)
VITE_USE_MOCKS=false
```

### Requisitos

- Node.js v18+
- pnpm
- Backend NestJS rodando
- Conta Mercado Pago (para pagamentos)

---

## 🧪 Testes Manuais

### 1. Listar Produtos
```
GET http://localhost:8080/products?page=1&size=12&sort=recent
Status: Deve carregar lista de produtos
```

### 2. Adicionar ao Carrinho
```
Action: Clique em "Adicionar ao carrinho"
Expected: Badge com "1" aparece
```

### 3. Criar Reserva
```
Action: Preencher checkout e clicar "Confirmar reserva"
Expected: Reserva criada e carrinho limpo
```

### 4. Ver Detalhe
```
GET http://localhost:8080/products/:goodsNo
Expected: Mostrar dados do produto
```

---

## 🚀 Próximos Passos

### Curto Prazo
- [ ] Testar integração completa
- [ ] Implementar página "Meus Pedidos"
- [ ] Adicionar mais testes
- [ ] Documentar edge cases

### Médio Prazo
- [ ] Webhooks Mercado Pago
- [ ] Rastreamento de pedidos
- [ ] Reviews de produtos
- [ ] Wishlist

### Longo Prazo
- [ ] PWA (offline support)
- [ ] Análise de dados
- [ ] Recomendações de produto
- [ ] Mobile app nativa

---

## 📞 Support & Referências

### Links Importantes
- [Documentação Mercado Pago](https://www.mercadopago.com.ar/developers)
- [React Query Docs](https://tanstack.com/query/latest)
- [React Router Docs](https://reactrouter.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Arquivos do Backend
Consulte `STOREFRONT_API.md` no repositório do backend para detalhes completos dos contratos API.

---

## ✅ Checklist de Produção

Antes de publicar para produção:

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Backend em HTTPS (não HTTP)
- [ ] Mercado Pago com credenciais de produção
- [ ] CORS configurado corretamente
- [ ] JWT configurado como httpOnly + Secure
- [ ] Testes end-to-end passando
- [ ] Build sem erros (`pnpm build`)
- [ ] Logs monitorados
- [ ] Backup de dados configurado

---

**Última atualização**: 03 de Fevereiro de 2026

Se tiver dúvidas, consulte [DEBUGGING.md](./DEBUGGING.md) ou veja exemplos em [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md).
