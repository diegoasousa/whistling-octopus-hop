# 📊 Arquitetura da Integração

## 🏗️ Estrutura de Camadas

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Pages (Products, Checkout, OrderDetail, etc)       │   │
│  └────────────────┬─────────────────────────────────────┘   │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────────────┐   │
│  │  Components (ProductCard, Header, Form, etc)        │   │
│  └────────────────┬─────────────────────────────────────┘   │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────────────┐   │
│  │  Hooks & Store (useAuth, useCart, useQuery)        │   │
│  └────────────────┬─────────────────────────────────────┘   │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────────────┐   │
│  │  API Client (src/lib/api.ts)                         │   │
│  │  - credentials: 'include' (JWT cookies)              │   │
│  │  - Timeout 10s                                       │   │
│  │  - Error handling com retry                          │   │
│  └────────────────┬─────────────────────────────────────┘   │
└────────────────┬──────────────────────────────────────────────┘
                 │ HTTP + JWT (httpOnly Cookie)
                 │
┌────────────────▼──────────────────────────────────────────────┐
│           Backend NestJS (http://localhost:3000)              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Controllers                                         │   │
│  │  - ProductsController (/api/products)               │   │
│  │  - OrdersController (/api/orders)                   │   │
│  │  - PaymentsController (/api/payments/mercadopago)   │   │
│  │  - AuthController (/api/auth/google)                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services & Business Logic                          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Database (PostgreSQL/MongoDB)                      │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────┬──────────────────────────────────────────────┘
                 │
                 │
┌────────────────▼──────────────────────────────────────────────┐
│        Mercado Pago API (payment processing)                  │
│  - Create Preference (checkout)                              │
│  - Get Payment Status                                        │
│  - Webhooks (optional)                                       │
└───────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados

### 1️⃣ Listar Produtos

```
User visits /products
        ↓
ProductsPage.tsx
        ↓
useQuery({ queryKey: ["products"], queryFn: getProducts })
        ↓
API: GET /api/products?type=PHOTOCARD&page=1
        ↓
Backend: ProductsController.getProducts()
        ↓
Database: SELECT products WHERE type=PHOTOCARD
        ↓
Return: ProductsListResponse { items[], page, total, totalPages }
        ↓
Frontend renders ProductCard components
```

### 2️⃣ Adicionar ao Carrinho

```
User clicks "Adicionar ao carrinho"
        ↓
ProductCard.tsx: onClick={() => addItem(product, quantity)}
        ↓
CartProvider.dispatch({ type: "ADD", payload: { product, quantity } })
        ↓
cartReducer: 
  - Convert priceCents to price (/ 100)
  - Create CartItem
  - Save to localStorage
        ↓
UI updates showing totalItems badge
```

### 3️⃣ Criar Pedido (Checkout)

```
User fills form and clicks "Confirmar"
        ↓
CheckoutPage.tsx: 
  - Validar dados com Zod
  - Build OrderPayload
        ↓
createOrderMutation.mutate()
        ↓
API: POST /api/orders
  Headers: 
    - Content-Type: application/json
    - credentials: 'include'  ← Envia JWT cookie
  Body: OrderPayload
        ↓
Backend: 
  1. Verify JWT (Guard)
  2. Create Order record
  3. Calculate total (itens + frete)
  4. Return: CreateOrderResponse { id, orderNumber, status }
        ↓
Frontend:
  - Clear cart
  - Show success screen
  - setSuccessOrder({ id, number })
```

### 4️⃣ Criar Preferência de Pagamento

```
User clicks "Ir para pagamento"
        ↓
paymentMutation.mutate(orderId)
        ↓
API: POST /api/payments/mercadopago/preference
  Body: { orderId }
        ↓
Backend:
  1. Find Order by ID
  2. Call Mercado Pago API (create preference)
  3. Save preference to database
  4. Return: MercadoPagoPreference { initPoint, sandboxInitPoint }
        ↓
Frontend:
  window.location.href = pref.initPoint
        ↓
User redirected to Mercado Pago checkout
```

### 5️⃣ Pagamento Completo

```
[Mercado Pago checkout] → User pays with card/Pix/etc
        ↓
MP webhook (optional, backend handles)
  POST /api/webhooks/mercadopago { payment data }
        ↓
Backend updates Order status: PAID
        ↓
MP redirects user back to:
  https://seu-app.com/orders/:orderId?status=approved
        ↓
Frontend: OrderDetail.tsx
  - Fetch order status
  - Fetch payment status
  - Display: "Pagamento confirmado! ✅"
```

### 6️⃣ Consultar Status do Pedido

```
User visits /orders/:orderId
        ↓
OrderDetail.tsx:
  useQuery({ queryKey: ["orders", orderId], queryFn: getOrderById })
  useQuery({ queryKey: ["payment", orderId], queryFn: getPaymentStatus })
        ↓
API calls in parallel:
  - GET /api/orders/:orderId
  - GET /api/payments/order/:orderId
        ↓
Backend returns:
  Order: { id, orderNumber, status, items, customer, totalCents }
  Payment: { orderId, status, paymentId, createdAt }
        ↓
Frontend renders full order details with payment status
```

---

## 🗄️ Estado Global

### CartProvider (localStorage + Context)

```
CartState {
  items: CartItem[] [
    {
      productId: "uuid-1",
      variationId?: "var-1",
      name: "Lightstick Aurora",
      price: 189.90,        ← convertido de priceCents
      image: "url",
      type: "LIGHTSTICK",
      quantity: 2,
    },
    ...
  ]
}

Persistência: localStorage.setItem('kpop_storefront_cart_v1', JSON.stringify(state))
```

### useAuth (React Query + Cookies)

```
User:
  - id: string
  - email: string
  - name: string
  - picture?: string

Token storage: Cookie httpOnly (não acessível de JS)
Refresh: Automático com queryClient refetch
```

---

## 🔐 Segurança

### JWT Cookies

```
Cookie Header:
  Name: jwt (ou access_token)
  Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  HttpOnly: true    ← Não acessível de JavaScript
  Secure: true      ← HTTPS apenas
  SameSite: Lax     ← Proteção contra CSRF
  Path: /
  Domain: localhost

Enviado automaticamente em:
  fetch(..., { credentials: 'include' })
              ↑ Necessário para enviar cookies
```

### Endpoints Protegidos

```
GET /api/orders/my-orders
  ↓
Backend JWT Guard:
  if (!req.headers.cookie) throw 401
  if (jwt inválido) throw 401
  if (jwt expirado) throw 401
  ↓
else: Continuar

GET /api/products  (público, sem JWT necessário)
```

---

## 📦 Tipos de Dados Fluxo

```
Product (do backend) → CartItem (no carrinho)
{                        {
  id: uuid,              productId: uuid,
  name: string,          variationId?: uuid,
  priceCents: 18900,     name: string,
  type: enum,            price: 189.90,
  images: [],            image: string,
  variations: []         type: enum,
  isActive: true         quantity: number
}                      }

OrderPayload (envio) → CreateOrderResponse (retorno)
{                      {
  items: [{            id: uuid,
    productId,         orderNumber: "ORD-2024-001",
    variationId,       status: "PENDING",
    quantity           totalCents: 45990
  }],                }
  customerName,
  customerEmail,
  shippingAddress,
  shippingCity,
  shippingState,
  shippingZipCode
}
```

---

## 🔄 Ciclo de Vida de Requisições

```
fetch() chamada
        ↓
Controller função customizada buildQuery/URL
        ↓
fetchJson<T>():
  1. Create AbortController (timeout 10s)
  2. fetch with { credentials: 'include' }
  3. if !res.ok → throw Error(message)
  4. Parse JSON response
  5. return <T>
        ↓
Tratado por React Query:
  - Retry automático (1x por padrão)
  - Cache com staleTime
  - Background refetch
        ↓
Component recebe data/error/loading

onSuccess Hook:
  - toast notification
  - navigate to page
  - clearCart()

onError Hook:
  - toast notification
  - error logging
```

---

## 💾 Persistência

```
LocalStorage:
  kpop_storefront_cart_v1 = JSON.stringify(CartState)
        ↓
  Loaded on app start
  Restored on page reload

SessionStorage (opcional):
  lastOrderId = orderId
        ↓
  Usado para rastrear redirect do MP

Backend Database:
  Products, Orders, Payments, Users
        ↓
  Persistido no PostgreSQL/MongoDB
```

---

## 🎯 Request/Response Pattern

```
Frontend Request:
  POST /api/orders
  Content-Type: application/json
  Cookie: jwt=...
  Body: {
    items: [...],
    customerName: "João",
    customerEmail: "joao@email.com",
    ...
  }

Backend Response (Success):
  Status: 201 Created
  Content-Type: application/json
  Body: {
    id: "uuid-123",
    orderNumber: "ORD-2024-001",
    status: "PENDING",
    totalCents: 45990
  }

Backend Response (Error):
  Status: 4xx ou 5xx
  Content-Type: application/json
  Body: {
    message: "Erro descritivo",
    error: "BAD_REQUEST",
    statusCode: 400
  }

Frontend Error Handling:
  if (res.ok) → return (await res.json()) as T
  else → throw new Error(message)
           ↓
        onError hook → toast.error()
```

