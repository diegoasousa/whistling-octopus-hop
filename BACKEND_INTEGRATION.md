# Integração com Backend NestJS - Guia Rápido

## Configuração

1. **Variáveis de Ambiente** (`.env`):
```
VITE_API_BASE=http://localhost:3000/api
VITE_USE_MOCKS=false  # usar true para testes sem backend
```

2. **Base URL padrão**: `http://localhost:3000/api`

---

## 🔑 Autenticação

### Hook: `useAuth()`

```tsx
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  
  if (isLoading) return <div>Carregando...</div>;
  
  if (!isAuthenticated) {
    return <button onClick={login}>Login com Google</button>;
  }
  
  return (
    <div>
      Olá, {user?.name}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Endpoints:
- `GET /auth/google` → Redireciona para login Google
- `GET /auth/me` → Retorna usuário logado
- `GET /auth/logout` → Faz logout

---

## 📦 Produtos (Público)

### `getProducts(params)`

```tsx
import { getProducts } from "@/lib/api";

const data = await getProducts({
  type: "PHOTOCARD",      // PHOTOCARD | LIGHTSTICK | ALBUM | MERCH | DOLL | OTHER
  search: "BTS",
  page: 1,
  limit: 12,
  isActive: true,
});

// data = {
//   items: Product[],
//   page: 1,
//   pageSize: 12,
//   total: 150,
//   totalPages: 13,
// }
```

### `getProductById(id)`

```tsx
const product = await getProductById("uuid-123");
// product.priceCents = 5990 → R$ 59.90
```

### Type: `Product`
```ts
{
  id: string;
  name: string;
  description: string;
  priceCents: number;      // ⚠️ converter para reais: priceCents / 100
  type: ProductType;       // PHOTOCARD | LIGHTSTICK | ALBUM | MERCH | DOLL | OTHER
  images: string[];
  variations?: [{          // Variações do produto (cores, tamanhos, etc)
    id: string;
    name: string;
    priceCents?: number;
  }];
  isActive: boolean;
  createdAt: string;       // ISO 8601
}
```

---

## 🛒 Carrinho

### Hook: `useCart()`

```tsx
import { useCart } from "@/store/cart";

const { items, totalItems, subtotal, addItem, removeItem, updateQty, clearCart } = useCart();

// Adicionar item (com variação opcional)
addItem(product, quantity, variationId);

// Remover item
removeItem(productId, variationId);

// Atualizar quantidade
updateQty(productId, quantity, variationId);

// Limpar carrinho
clearCart();
```

---

## 📋 Pedidos

### `createOrder(payload)`

```tsx
import { createOrder } from "@/lib/api";

const order = await createOrder({
  items: [
    { productId: "uuid-1", variationId: "var-1", quantity: 2 },
    { productId: "uuid-2", quantity: 1 },
  ],
  customerName: "João Silva",
  customerEmail: "joao@email.com",
  customerPhone: "11999999999",
  shippingAddress: "Rua X, 123",
  shippingCity: "São Paulo",
  shippingState: "SP",
  shippingZipCode: "01000-000",
});

// Retorna: { id: "uuid", orderNumber: "ORD-2024-001", status: "PENDING", totalCents: 15990 }
```

### `getOrderById(id)`, `getOrderByNumber(orderNumber)`

```tsx
const order = await getOrderById("uuid-123");
const order = await getOrderByNumber("ORD-2024-001");

// Retorna detalhes completos do pedido
```

### `getMyOrders()` (requer autenticação)

```tsx
const orders = await getMyOrders();
// Retorna Order[]
```

---

## 💳 Pagamentos (Mercado Pago)

### `createMercadoPagoPreference(orderId)`

```tsx
import { createMercadoPagoPreference } from "@/lib/api";

const pref = await createMercadoPagoPreference(orderId);

// Redirecionar para pagamento:
window.location.href = pref.initPoint;  // Mercado Pago (produção)
// ou
window.location.href = pref.sandboxInitPoint;  // Sandbox (testes)
```

### `getPaymentStatus(orderId)`

```tsx
const payment = await getPaymentStatus(orderId);

// payment = {
//   orderId: "uuid",
//   status: "pending" | "approved" | "rejected" | "cancelled",
//   paymentId?: "mp-payment-id",
//   createdAt: "2024-02-03T10:00:00Z",
// }
```

---

## 🔄 Fluxo Completo: Checkout

1. **Listar produtos**
   ```tsx
   const products = await getProducts();
   ```

2. **Usuário adiciona ao carrinho**
   ```tsx
   const { addItem } = useCart();
   addItem(product, quantity, variationId);
   ```

3. **Ir para checkout** → Preencher dados e confirmar
   ```tsx
   const order = await createOrder(payload);
   // order.id, order.orderNumber, etc
   ```

4. **Criar preferência de pagamento**
   ```tsx
   const pref = await createMercadoPagoPreference(order.id);
   window.location.href = pref.initPoint;
   ```

5. **Usuário paga no Mercado Pago** → Retorna para o app

6. **Verificar status do pagamento**
   ```tsx
   const payment = await getPaymentStatus(orderId);
   ```

---

## ⚠️ Pontos Importantes

✅ **Sempre enviar `credentials: 'include'`** → JWT httpOnly é automático em `fetchJson()`

✅ **Converter `priceCents` para reais**: `priceCents / 100`

✅ **Variações são opcionais** → Alguns produtos podem não ter

✅ **Cookies JWT** → Armazenados automaticamente pelo navegador (httpOnly)

✅ **Enum `ProductType`**: `PHOTOCARD`, `LIGHTSTICK`, `ALBUM`, `MERCH`, `DOLL`, `OTHER`

✅ **Query params de produtos**: `type`, `search`, `page`, `limit`, `isActive`

---

## 📝 Exemplo de Integração Completa

Veja [src/pages/Checkout.tsx](src/pages/Checkout.tsx) para um exemplo funcional de:
- Coleta de dados do cliente
- Criação de pedido
- Fluxo de pagamento Mercado Pago

---

## 🐛 Troubleshooting

### "Erro 401 Unauthorized"
- Problema: JWT expirado ou não foi enviado
- Solução: Fazer login novamente

### "CORS Error"
- Problema: Backend não tem CORS configurado
- Solução: Verificar `credentials: 'include'` e headers no backend

### "priceCents is undefined"
- Problema: Produto antigo com `price` em vez de `priceCents`
- Solução: Usar `priceCents / 100` ou `product.price` se legado

