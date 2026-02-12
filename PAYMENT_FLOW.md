# Fluxo de Pagamento - Mercado Pago Callback

## 🔄 Como Funciona

1. **Usuário cria pedido** → `POST /orders` → Retorna `orderId`
2. **Cria preferência MP** → `POST /payments/mercadopago/preference` → Retorna `initPoint`
3. **Redireciona para MP** → `window.location.href = initPoint`
4. **Usuário paga no MP** → MP redireciona para seu app
5. **Verifica status** → `GET /payments/order/:orderId`

---

## 📍 URLs de Retorno do Mercado Pago

O backend deve estar configurado com as URLs de sucesso/falha no Mercado Pago:

```
Sucesso: https://seu-dominio.com/orders/:orderId?mp_status=approved
Falha:   https://seu-dominio.com/orders/:orderId?mp_status=failed
Pendente: https://seu-dominio.com/orders/:orderId?mp_status=pending
```

---

## 🛠️ Implementar Verificação de Status

### Opção 1: Verificar ao carregar a página de detalhes

```tsx
// src/pages/OrderDetail.tsx (já implementado)
const { data: payment } = useQuery({
  queryKey: ["payment", orderId],
  queryFn: () => getPaymentStatus(orderId),
  enabled: !!orderId,
});

if (payment?.status === 'approved') {
  // Mostrar "Pedido Pago"
}
```

### Opção 2: Polling automático (verificação contínua)

```tsx
const { data: payment } = useQuery({
  queryKey: ["payment", orderId],
  queryFn: () => getPaymentStatus(orderId),
  enabled: !!orderId,
  refetchInterval: 3000, // A cada 3 segundos
  refetchIntervalInBackground: true, // Mesmo aberto em background
});
```

---

## 🔐 Webhooks (Recomendado)

Para uma experiência melhor, configure webhooks no backend Mercado Pago:

```javascript
// Backend NestJS
@Post('/webhooks/mercadopago')
async handleMercadoPagoWebhook(@Body() payload: any) {
  // payload.action = "payment.created" | "payment.updated"
  // payload.data.id = payment ID
  
  const paymentId = payload.data.id;
  
  // Buscar informações do pagamento no MP
  const mpPayment = await mercadopagoClient.payment.findById(paymentId);
  
  // Atualizar status do pedido
  if (mpPayment.status === 'approved') {
    await ordersService.updateOrderStatus(orderId, 'PAID');
  } else if (mpPayment.status === 'rejected') {
    await ordersService.updateOrderStatus(orderId, 'CANCELLED');
  }
}
```

---

## 💾 Estado do Pedido na Sessão

Para manter o estado do pedido durante o redirect do MP:

```tsx
// src/pages/Checkout.tsx
const [successOrder, setSuccessOrder] = useState<{ id: string; number: string } | null>(null);

const paymentMutation = useMutation({
  mutationFn: async (orderId: string) => {
    const pref = await createMercadoPagoPreference(orderId);
    // Salvar estado antes de redirecionar
    sessionStorage.setItem('lastOrderId', orderId);
    window.location.href = pref.initPoint;
  },
});
```

Depois, ao retornar:

```tsx
// src/pages/OrderDetail.tsx
useEffect(() => {
  const lastOrderId = sessionStorage.getItem('lastOrderId');
  if (lastOrderId && !orderId) {
    navigate(`/orders/${lastOrderId}`);
  }
}, []);
```

---

## ✅ Checklist de Implementação

- [ ] API Backend tem `POST /payments/mercadopago/preference`
- [ ] API Backend tem `GET /payments/order/:orderId`
- [ ] URLs de retorno do MP configuradas no backend
- [ ] Webhook do MP configurado (opcional, mas recomendado)
- [ ] Frontend redireciona para `/orders/:orderId` após MP
- [ ] Página OrderDetail verifica `getPaymentStatus()`
- [ ] Estados possíveis tratados: pending, approved, rejected, cancelled

---

## 🔗 Referências

- [Mercado Pago Integraciones](https://www.mercadopago.com.ar/developers/es)
- [Crear Preferencia de Pago](https://www.mercadopago.com.ar/developers/es/reference/_checkout_preferences/_post)
- [Consultar Pagamento](https://www.mercadopago.com.ar/developers/es/reference/_payments_id/_get)
