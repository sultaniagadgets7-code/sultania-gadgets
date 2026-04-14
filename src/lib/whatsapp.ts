export const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

export function waUrl(message: string, phone?: string) {
  const num = phone ? phone.replace(/\D/g, '') : WA_NUMBER;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export function orderConfirmationMessage(order: {
  id: string;
  customerName: string;
  items: string;
  total: number;
  city: string;
}) {
  return `✅ *Order Confirmed — Sultania Gadgets*

Assalamualaikum ${order.customerName}!

Your order *#${order.id.slice(0, 8).toUpperCase()}* has been confirmed.

📦 *Items:* ${order.items}
💰 *Total:* Rs. ${order.total} (Cash on Delivery)
📍 *Delivery to:* ${order.city}
⏱ *Estimated:* 2–4 business days

Thank you for shopping with Sultania Gadgets! 🙏`;
}

export function orderStatusMessage(order: {
  id: string;
  customerName: string;
  status: string;
  city: string;
}) {
  const statusEmoji: Record<string, string> = {
    confirmed: '✅',
    shipped: '🚚',
    delivered: '🎉',
    cancelled: '❌',
  };
  const emoji = statusEmoji[order.status] || '📦';
  const statusLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);
  return `${emoji} *Order Update — Sultania Gadgets*

Assalamualaikum ${order.customerName}!

Your order *#${order.id.slice(0, 8).toUpperCase()}* status has been updated to: *${statusLabel}*

For any questions, reply to this message.

Sultania Gadgets 🛍️`;
}

export function abandonedCartMessage(items: string, cartUrl: string) {
  return `🛒 *Sultania Gadgets*

Assalamualaikum! You left these items in your cart:

${items}

Complete your order here: ${cartUrl}

Cash on Delivery available! 📦`;
}

export function dispatchMessage(order: {
  id: string;
  customerName: string;
  courier: string;
  trackingNumber: string;
}) {
  return `🚚 *Your Order is on the Way! — Sultania Gadgets*

Assalamualaikum ${order.customerName}!

Your order *#${order.id.slice(0, 8).toUpperCase()}* has been dispatched.

📦 *Courier:* ${order.courier}
🔍 *Tracking No:* ${order.trackingNumber}

Expected delivery in 2–4 business days.

Sultania Gadgets 🛍️`;
}
