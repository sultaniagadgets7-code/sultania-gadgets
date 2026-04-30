'use server';

import { Resend } from 'resend';

const FROM = process.env.EMAIL_FROM || 'Sultania Gadgets <orders@sultaniagadgets.com>';
const ADMIN = process.env.ADMIN_EMAIL || 'sultaniagadgets7@gmail.com';

interface OrderEmailData {
  orderId: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  items: { title: string; quantity: number; price: number }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

function formatPKR(n: number) {
  return `Rs. ${n.toLocaleString('en-PK')}`;
}

function orderEmailHtml(data: OrderEmailData, isAdmin: boolean) {
  const shortId = data.orderId.slice(0, 8).toUpperCase();
  const itemRows = data.items.map((i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${i.title}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">${formatPKR(i.price * i.quantity)}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    
    <!-- Header -->
    <div style="background:#0a0a0a;padding:24px 32px;">
      <p style="margin:0;font-size:22px;font-weight:900;color:#e01e1e;letter-spacing:-0.04em;">SULTANIA GADGETS</p>
      <p style="margin:4px 0 0;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.08em;">
        ${isAdmin ? '🔔 New Order Received' : 'Order Confirmed'}
      </p>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">
      <p style="margin:0 0 4px;font-size:13px;color:#888;">Order ID</p>
      <p style="margin:0 0 20px;font-size:20px;font-weight:900;color:#0a0a0a;font-family:monospace;">#${shortId}</p>

      ${isAdmin ? `
      <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:10px;padding:12px 16px;margin-bottom:20px;">
        <p style="margin:0;font-size:13px;font-weight:700;color:#856404;">Customer Details</p>
        <p style="margin:4px 0 0;font-size:13px;color:#533f03;">${data.customerName} · ${data.phone}</p>
        <p style="margin:2px 0 0;font-size:13px;color:#533f03;">${data.address}, ${data.city}</p>
      </div>` : `
      <p style="margin:0 0 20px;font-size:14px;color:#555;">
        Assalamualaikum <strong>${data.customerName}</strong>! Your order has been placed successfully. 
        We'll call you to confirm before dispatch.
      </p>`}

      <!-- Items -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr style="background:#f7f7f7;">
            <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;color:#888;">Product</th>
            <th style="padding:8px 12px;text-align:center;font-size:11px;text-transform:uppercase;color:#888;">Qty</th>
            <th style="padding:8px 12px;text-align:right;font-size:11px;text-transform:uppercase;color:#888;">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <!-- Totals -->
      <div style="border-top:2px solid #f0f0f0;padding-top:12px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:13px;color:#888;">Subtotal</span>
          <span style="font-size:13px;color:#555;">${formatPKR(data.subtotal)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:13px;color:#888;">Delivery</span>
          <span style="font-size:13px;color:#555;">${formatPKR(data.deliveryFee)}</span>
        </div>
        ${data.discount > 0 ? `
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:13px;color:#16a34a;">Discount</span>
          <span style="font-size:13px;color:#16a34a;">−${formatPKR(data.discount)}</span>
        </div>` : ''}
        <div style="display:flex;justify-content:space-between;border-top:1px solid #f0f0f0;padding-top:10px;margin-top:6px;">
          <span style="font-size:15px;font-weight:900;color:#0a0a0a;">Total (COD)</span>
          <span style="font-size:15px;font-weight:900;color:#0a0a0a;">${formatPKR(data.total)}</span>
        </div>
      </div>

      ${!isAdmin ? `
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 16px;margin-top:20px;">
        <p style="margin:0;font-size:13px;font-weight:700;color:#15803d;">Payment: Cash on Delivery</p>
        <p style="margin:4px 0 0;font-size:13px;color:#166534;">You pay when your order arrives. Estimated delivery: 2–4 business days.</p>
      </div>` : ''}
    </div>

    <!-- Footer -->
    <div style="background:#f7f7f7;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#aaa;">Sultania Gadgets · sultaniagadgets.com</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendOrderEmails(data: OrderEmailData, customerEmail?: string) {
  if (!process.env.RESEND_API_KEY) return; // silently skip if not configured
  const resend = new Resend(process.env.RESEND_API_KEY);

  const shortId = data.orderId.slice(0, 8).toUpperCase();

  // Admin notification
  await resend.emails.send({
    from: FROM,
    to: ADMIN,
    subject: `🛍️ New Order #${shortId} — ${formatPKR(data.total)}`,
    html: orderEmailHtml(data, true),
  });

  // Customer confirmation (only if email provided)
  if (customerEmail) {
    await resend.emails.send({
      from: FROM,
      to: customerEmail,
      subject: `Order Confirmed #${shortId} — Sultania Gadgets`,
      html: orderEmailHtml(data, false),
    });
  }
}
