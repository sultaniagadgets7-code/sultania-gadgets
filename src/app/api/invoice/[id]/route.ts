import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

function formatPKR(n: number) {
  return `Rs. ${n.toLocaleString('en-PK')}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(product_title_snapshot, price_snapshot, quantity)')
    .eq('id', id)
    .single();

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const shortId = order.id.slice(0, 8).toUpperCase();
  const date = new Date(order.created_at).toLocaleDateString('en-PK', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const itemRows = (order.order_items ?? []).map((item: any) => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;font-size:13px;">${item.product_title_snapshot}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:13px;">${item.quantity}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;">${formatPKR(item.price_snapshot)}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;font-weight:700;">${formatPKR(item.price_snapshot * item.quantity)}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice #${shortId} — Sultania Gadgets</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #fff; color: #0a0a0a; padding: 40px; max-width: 700px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid #0a0a0a; }
    .brand { font-size: 24px; font-weight: 900; color: #e01e1e; letter-spacing: -0.04em; }
    .brand-sub { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }
    .invoice-meta { text-align: right; }
    .invoice-meta h1 { font-size: 28px; font-weight: 900; color: #0a0a0a; }
    .invoice-meta p { font-size: 12px; color: #888; margin-top: 4px; }
    .section { margin-bottom: 28px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 8px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .info-box { background: #f7f7f7; border-radius: 10px; padding: 14px 16px; }
    .info-box p { font-size: 13px; color: #555; line-height: 1.6; }
    .info-box strong { color: #0a0a0a; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #0a0a0a; }
    thead th { padding: 10px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #fff; }
    thead th:last-child, thead th:nth-child(3) { text-align: right; }
    thead th:nth-child(2) { text-align: center; }
    .totals { margin-top: 16px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #555; }
    .total-row.final { font-size: 16px; font-weight: 900; color: #0a0a0a; border-top: 2px solid #0a0a0a; padding-top: 12px; margin-top: 8px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 11px; color: #aaa; }
    .cod-badge { display: inline-block; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 8px 14px; font-size: 12px; font-weight: 700; color: #15803d; margin-top: 12px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">SULTANIA GADGETS</div>
      <div class="brand-sub">sultaniagadgets.com</div>
    </div>
    <div class="invoice-meta">
      <h1>INVOICE</h1>
      <p>#${shortId}</p>
      <p>${date}</p>
    </div>
  </div>

  <div class="section info-grid">
    <div class="info-box">
      <div class="section-title">Bill To</div>
      <p><strong>${order.customer_name}</strong></p>
      <p>${order.phone}</p>
      <p>${order.address}</p>
      <p>${order.city}</p>
    </div>
    <div class="info-box">
      <div class="section-title">Order Details</div>
      <p><strong>Order ID:</strong> #${shortId}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Payment:</strong> Cash on Delivery</p>
      <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
    </div>
  </div>

  <div class="section">
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <div class="totals">
      <div class="total-row"><span>Subtotal</span><span>${formatPKR(order.subtotal)}</span></div>
      <div class="total-row"><span>Delivery Fee</span><span>${formatPKR(order.delivery_fee)}</span></div>
      ${order.discount_amount > 0 ? `<div class="total-row" style="color:#16a34a;"><span>Discount</span><span>−${formatPKR(order.discount_amount)}</span></div>` : ''}
      <div class="total-row final"><span>Total (COD)</span><span>${formatPKR(order.total)}</span></div>
    </div>
    <div class="cod-badge">💵 Payment: Cash on Delivery — Pay when you receive</div>
  </div>

  <div class="footer">
    <p>Thank you for shopping with Sultania Gadgets!</p>
    <p style="margin-top:4px;">Questions? WhatsApp: +${order.phone || '923009515230'} · sultaniagadgets.com</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `inline; filename="invoice-${shortId}.html"`,
    },
  });
}
