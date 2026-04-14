'use client';

import { Printer } from 'lucide-react';
import type { Order } from '@/types';
import { formatPrice } from '@/lib/utils';

function printSlip(order: Order) {
  const win = window.open('', '_blank');
  if (!win) return;

  const orderId = order.id.slice(0, 8).toUpperCase();
  const date = new Date(order.created_at).toLocaleDateString('en-PK', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const itemsRows = (order.order_items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.product_title_snapshot}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">Rs. ${item.price_snapshot.toLocaleString()}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">Rs. ${(item.price_snapshot * item.quantity).toLocaleString()}</td>
      </tr>`
    )
    .join('');

  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Packing Slip — ${orderId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 13px; color: #111; padding: 32px; max-width: 680px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 2px solid #111; padding-bottom: 16px; margin-bottom: 20px; }
    .store-name { font-size: 22px; font-weight: 900; letter-spacing: -0.04em; color: #e01e1e; }
    .store-sub { font-size: 11px; color: #666; margin-top: 2px; }
    .order-meta { display: flex; justify-content: space-between; margin-bottom: 20px; gap: 16px; }
    .meta-block { flex: 1; }
    .meta-block h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin-bottom: 6px; }
    .meta-block p { font-size: 13px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    thead tr { background: #f7f7f7; }
    th { padding: 8px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #555; }
    th:last-child, td:last-child { text-align: right; }
    th:nth-child(2), td:nth-child(2) { text-align: center; }
    .totals { margin-left: auto; width: 240px; }
    .totals-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; }
    .totals-row.total { font-weight: 700; font-size: 15px; border-top: 2px solid #111; padding-top: 8px; margin-top: 4px; }
    .cod-badge { display: inline-block; background: #f7f7f7; border: 1px solid #ddd; border-radius: 20px; padding: 4px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 16px; }
    .footer { text-align: center; margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #888; }
    @media print {
      body { padding: 16px; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="store-name">SULTANIA GADGETS</div>
    <div class="store-sub">Trusted Tech Accessories · Cash on Delivery · Pakistan</div>
  </div>

  <div class="order-meta">
    <div class="meta-block">
      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> #${orderId}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Payment:</strong> Cash on Delivery</p>
    </div>
    <div class="meta-block">
      <h3>Deliver To</h3>
      <p><strong>${order.customer_name}</strong></p>
      <p>${order.phone}</p>
      <p>${order.address}</p>
      <p>${order.city}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Qty</th>
        <th>Unit Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row"><span>Subtotal</span><span>Rs. ${order.subtotal.toLocaleString()}</span></div>
    <div class="totals-row"><span>Delivery</span><span>Rs. ${order.delivery_fee.toLocaleString()}</span></div>
    <div class="totals-row total"><span>Total</span><span>Rs. ${order.total.toLocaleString()}</span></div>
  </div>

  <div><span class="cod-badge">💵 Cash on Delivery</span></div>

  <div class="footer">
    <p>Thank you for your order!</p>
    <p style="margin-top:4px;">For support, contact us on WhatsApp.</p>
  </div>

  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`);
  win.document.close();
  win.focus();
}

interface PrintSlipProps {
  order: Order;
}

export function PrintSlip({ order }: PrintSlipProps) {
  return (
    <button
      onClick={() => printSlip(order)}
      className="inline-flex items-center gap-2 bg-[#f7f7f7] hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-full transition-colors"
      aria-label={`Print packing slip for order ${order.id.slice(0, 8).toUpperCase()}`}
    >
      <Printer className="w-3.5 h-3.5" aria-hidden="true" />
      Print Slip
    </button>
  );
}
