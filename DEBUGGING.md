# 🐛 Guia de Debugging

## 🔍 Problemas Comuns e Soluções

### 1. "CORS Error" ou "Blocked by CORS"

**Sintoma**: Erro na console do navegador sobre CORS quando faz requisições

**Causas Possíveis**:
- Backend não tem CORS configurado
- Backend não aceita `credentials: 'include'`
- URL base incorreta

**Solução**:
```tsx
// 1. Verificar URL base
// .env
VITE_API_BASE=http://localhost:3000/api  ✅

// 2. Backend deve ter:
// app.enableCors({ credentials: true });
```

**Debug**:
```bash
# Verificar se backend está rodando
curl http://localhost:3000/api/products -i
```

---

### 2. "401 Unauthorized" em Endpoints de Autenticação

**Sintoma**: `GET /orders/my-orders` retorna 401

**Causas**:
- JWT expirado
- JWT não está sendo enviado no cookie
- Backend não está lendo o cookie

**Solução**:
```tsx
// Verificar no DevTools > Application > Cookies
// Deve estar: "jwt" (httpOnly, Secure, SameSite=Lax)

// Refazer login:
const { login } = useAuth();
<button onClick={login}>Login novamente</button>
```

**Debug**:
```bash
# Ver cookies enviados na requisição
curl http://localhost:3000/api/auth/me -b "jwt=seu-token-aqui" -H "Accept: application/json"
```

---

### 3. "Cannot read property 'priceCents' of undefined"

**Sintoma**: Erro ao exibir preço do produto

**Causa**: Produto antigo com `price` em vez de `priceCents`

**Solução**:
```tsx
// Usar priceCents e converter para reais
const price = product.priceCents / 100;  // ✅ R$ 59.90

// Nunca usar:
const price = product.price;  // ❌ Será undefined no novo backend
```

---

### 4. "Cannot redirecionar para Mercado Pago"

**Sintoma**: Clica em "Ir para pagamento" mas nada acontece

**Causas**:
- `createMercadoPagoPreference` retornou erro
- `initPoint` está undefined
- Network error

**Solução**:
```tsx
const paymentMutation = useMutation({
  mutationFn: async (orderId: string) => {
    console.log("Criando preferência para:", orderId);
    const pref = await createMercadoPagoPreference(orderId);
    console.log("Preferência criada:", pref);
    console.log("Redirecionando para:", pref.initPoint);
    window.location.href = pref.initPoint;
  },
  onError: (e) => {
    console.error("Erro ao processar pagamento:", e);
    toast({
      title: "Erro",
      description: e instanceof Error ? e.message : "Tente novamente",
      variant: "destructive",
    });
  },
});
```

**Debug**:
```bash
# Abrir DevTools > Network > XHR
# Verificar requisição POST /payments/mercadopago/preference
# Status deve ser 200/201
# Response deve ter { initPoint: "https://...", sandboxInitPoint: "..." }
```

---

### 5. "Carrinho vazio após checkout"

**Sintoma**: Pedido criado mas carrinho não foi limpo

**Solução**: Certificar que `clearCart()` é chamado no `onSuccess`

```tsx
const createOrderMutation = useMutation({
  mutationFn: () => createOrder(payload),
  onSuccess: (res) => {
    clearCart();  // ✅ Isso é importante
    setSuccessOrder({ id: res.id, number: res.orderNumber });
  },
});
```

---

### 6. "Autenticação perdida ao recarregar página"

**Sintoma**: Login funciona, mas ao F5 volta para "não autenticado"

**Causa**: JWT httpOnly não está sendo enviado/lido corretamente

**Solução**:
```tsx
// useAuth já trata isso com refetch automático
// Mas verificar:
const { user, isLoading, isAuthenticated } = useAuth();

if (isLoading) return <LoadingSpinner />;  // ✅ Esperar carregar

// Nunca usar localStorage para JWT
// ❌ localStorage.setItem("token", jwt)  // INSEGURO
```

---

### 7. "Produtos não aparecem com mock"

**Sintoma**: Lista de produtos vazia ao usar VITE_USE_MOCKS=true

**Solução**:
```tsx
// Verificar em src/mocks/products.ts se `MOCK_PRODUCTS` está exportado
export const MOCK_PRODUCTS: Product[] = [...]  // ✅

// Verificar se USE_MOCKS está true
// src/lib/api.ts
const USE_MOCKS = String(import.meta.env.VITE_USE_MOCKS ?? ...) === "true";
console.log("USE_MOCKS:", USE_MOCKS);  // Debug
```

---

### 8. "Erro ao buscar detalhes do pedido"

**Sintoma**: Página `/orders/:orderId` mostra erro

**Possíveis causas**:
- `orderId` inválido
- Pedido não existe no backend
- Usuário não tem acesso (se deve estar autenticado)

**Solução**:
```tsx
// Verificar orderId na URL
console.log("orderId:", orderId);  // Debug

// Verificar resposta da API
if (orderError) {
  console.error("Erro ao buscar pedido:", orderErrorMsg);
}

// Tente acessar direto na API
curl http://localhost:3000/api/orders/uuid-123
```

---

## 🛠️ Ferramentas de Debug

### 1. **DevTools do Navegador**

```
F12 → Network → XHR
- Ver todas as requisições
- Verificar status, headers, response
- Checar cookies enviados
```

### 2. **React Query DevTools**

```tsx
// Já está instalado (@tanstack/react-query)
// Para ativar no desenvolvimento:

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* seu app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### 3. **Logs Estruturados**

```tsx
// Adicione logs em pontos críticos:

console.log("🔄 Iniciando login...");
const { user, login } = useAuth();

console.log("📦 Criando pedido:", payload);
const order = await createOrder(payload);
console.log("✅ Pedido criado:", order);

console.log("💳 Criando preferência MP");
const pref = await createMercadoPagoPreference(orderId);
console.log("🔗 URL de pagamento:", pref.initPoint);
```

### 4. **Verificar localStorage/sessionStorage**

```javascript
// No console do navegador:
localStorage.getItem('kpop_storefront_cart_v1')  // Ver carrinho
sessionStorage.getItem('lastOrderId')            // Ver último pedido
```

---

## 🔗 URLs Úteis Para Testar

```bash
# Listar produtos
curl http://localhost:3000/api/products

# Usuário logado
curl http://localhost:3000/api/auth/me -b "jwt=seu-token"

# Detalhes do pedido
curl http://localhost:3000/api/orders/uuid-123

# Verificar status de pagamento
curl http://localhost:3000/api/payments/order/uuid-123
```

---

## 📝 Checklist de Debug

- [ ] Backend está rodando em `http://localhost:3000`
- [ ] `.env` tem `VITE_API_BASE=http://localhost:3000/api`
- [ ] Frontend rodando em `http://localhost:8080`
- [ ] DevTools Network aberto enquanto testa
- [ ] Console sem erros vermelhos
- [ ] Cookies aparecem em DevTools > Application > Cookies
- [ ] Requisições retornam status 200/201 (não 4xx/5xx)

---

## 🆘 Ainda Não Funciona?

1. **Verificar logs do backend** → `console.log`, stderr
2. **Verificar Network Tab** → Status e response exato
3. **Testar com cURL** → Confirmar se endpoint funciona
4. **Limpar cache** → Ctrl+Shift+Delete ou `npm run build` novo
5. **Reiniciar tudo** → Stop frontend/backend, start novamente

Boa sorte! 🚀
