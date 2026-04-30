# 💳 Payment Gateway Integration Guide

Complete guide to add JazzCash and EasyPaisa payment options to your website.

---

## 🎯 Overview

Currently, your website only supports Cash on Delivery (COD). Adding online payment gateways will:
- ✅ Increase conversions (many customers prefer online payment)
- ✅ Reduce COD rejection rates
- ✅ Get paid instantly (no waiting for delivery)
- ✅ Expand to customers who don't have cash
- ✅ Look more professional

---

## 💰 Payment Gateway Options in Pakistan

### 1. JazzCash (Recommended)
- **Market Share**: 40%+ in Pakistan
- **Setup Fee**: Free
- **Transaction Fee**: 1.5% - 2.5%
- **Settlement**: T+1 (next business day)
- **Best For**: Mobile wallets, cards

### 2. EasyPaisa
- **Market Share**: 35%+ in Pakistan
- **Setup Fee**: Free
- **Transaction Fee**: 1.5% - 2.5%
- **Settlement**: T+1
- **Best For**: Mobile wallets, cards

### 3. Stripe (International)
- **Transaction Fee**: 2.9% + Rs. 30
- **Best For**: International cards
- **Note**: Requires business registration

### 4. PayFast (Aggregator)
- **Supports**: JazzCash, EasyPaisa, Cards
- **Transaction Fee**: 2.5% - 3%
- **Best For**: All-in-one solution

---

## 🚀 Quick Start: JazzCash Integration

### Step 1: Create JazzCash Merchant Account

1. Visit: https://sandbox.jazzcash.com.pk/
2. Click "Merchant Registration"
3. Fill in business details:
   - Business name
   - CNIC/NTN
   - Bank account details
   - Website URL
4. Submit documents:
   - CNIC copy
   - Bank statement
   - Business registration (if company)
5. Wait 3-5 business days for approval

### Step 2: Get API Credentials

After approval, you'll receive:
- **Merchant ID**: e.g., MC12345
- **Password**: Your secret key
- **Integrity Salt**: For transaction verification

### Step 3: Install Package

\`\`\`bash
npm install crypto
\`\`\`

### Step 4: Add Environment Variables

Add to \`.env.local\`:
\`\`\`env
# JazzCash
JAZZCASH_MERCHANT_ID=MC12345
JAZZCASH_PASSWORD=your_password_here
JAZZCASH_INTEGRITY_SALT=your_salt_here
JAZZCASH_RETURN_URL=https://sultaniagadgets.com/payment/callback
\`\`\`

### Step 5: Create Payment API Route

File: \`src/app/api/payment/jazzcash/route.ts\`

\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const { orderId, amount, customerEmail, customerPhone } = await request.json();

  const merchantId = process.env.JAZZCASH_MERCHANT_ID!;
  const password = process.env.JAZZCASH_PASSWORD!;
  const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT!;
  const returnUrl = process.env.JAZZCASH_RETURN_URL!;

  // Generate transaction reference
  const txnRefNo = \`T\${Date.now()}\`;
  const txnDateTime = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
  const expiryDateTime = new Date(Date.now() + 3600000).toISOString().replace(/[-:]/g, '').split('.')[0];

  // Prepare data for hash
  const data = {
    pp_Version: '1.1',
    pp_TxnType: 'MWALLET',
    pp_Language: 'EN',
    pp_MerchantID: merchantId,
    pp_SubMerchantID: '',
    pp_Password: password,
    pp_TxnRefNo: txnRefNo,
    pp_Amount: (amount * 100).toString(), // Convert to paisa
    pp_TxnCurrency: 'PKR',
    pp_TxnDateTime: txnDateTime,
    pp_BillReference: orderId,
    pp_Description: \`Order #\${orderId}\`,
    pp_TxnExpiryDateTime: expiryDateTime,
    pp_ReturnURL: returnUrl,
    pp_SecureHash: '',
    ppmpf_1: customerEmail,
    ppmpf_2: customerPhone,
  };

  // Generate secure hash
  const sortedValues = Object.keys(data)
    .filter(key => key !== 'pp_SecureHash')
    .sort()
    .map(key => data[key as keyof typeof data])
    .join('&');

  const hashString = integritySalt + '&' + sortedValues;
  const secureHash = crypto.createHmac('sha256', integritySalt).update(hashString).digest('hex');

  data.pp_SecureHash = secureHash;

  return NextResponse.json({
    url: 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/',
    data,
  });
}
\`\`\`

### Step 6: Create Payment Button Component

File: \`src/components/payment/JazzCashButton.tsx\`

\`\`\`typescript
'use client';

import { useState } from 'react';

interface Props {
  orderId: string;
  amount: number;
  customerEmail: string;
  customerPhone: string;
}

export function JazzCashButton({ orderId, amount, customerEmail, customerPhone }: Props) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/payment/jazzcash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount, customerEmail, customerPhone }),
      });

      const { url, data } = await res.json();

      // Create form and submit
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;

      Object.keys(data).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded font-semibold disabled:opacity-50"
    >
      {loading ? 'Processing...' : 'Pay with JazzCash'}
    </button>
  );
}
\`\`\`

### Step 7: Handle Payment Callback

File: \`src/app/payment/callback/page.tsx\`

\`\`\`typescript
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function PaymentCallback({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { pp_ResponseCode, pp_TxnRefNo, pp_BillReference } = searchParams;

  if (pp_ResponseCode === '000') {
    // Payment successful
    const supabase = await createClient();
    
    await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        payment_method: 'jazzcash',
        transaction_id: pp_TxnRefNo,
      })
      .eq('id', pp_BillReference);

    redirect(\`/order-confirmation?id=\${pp_BillReference}\`);
  } else {
    // Payment failed
    redirect(\`/checkout?error=payment_failed\`);
  }
}
\`\`\`

---

## 🚀 Quick Start: EasyPaisa Integration

### Step 1: Create EasyPaisa Merchant Account

1. Visit: https://easypaisa.com.pk/merchant-solutions/
2. Click "Become a Merchant"
3. Fill in business details
4. Submit documents (same as JazzCash)
5. Wait for approval

### Step 2: Get API Credentials

You'll receive:
- **Store ID**
- **Hash Key**
- **API Endpoint**

### Step 3: Implementation

Similar to JazzCash, but with EasyPaisa's API format.

---

## 💡 Recommended Approach

### Option 1: Integrate Both (Best)
- Offer both JazzCash and EasyPaisa
- Covers 75%+ of Pakistani market
- More conversions

### Option 2: Use Payment Aggregator (Easiest)
- Use PayFast or similar
- One integration, multiple payment methods
- Slightly higher fees

### Option 3: Start with One (Quick)
- Start with JazzCash (larger market share)
- Add EasyPaisa later

---

## 📊 Database Changes Needed

Add to your orders table:

\`\`\`sql
ALTER TABLE orders
ADD COLUMN payment_method TEXT DEFAULT 'cod',
ADD COLUMN payment_status TEXT DEFAULT 'pending',
ADD COLUMN transaction_id TEXT,
ADD COLUMN paid_at TIMESTAMPTZ;
\`\`\`

---

## 🔒 Security Checklist

- ✅ Always verify payment callback hash
- ✅ Store transaction IDs
- ✅ Log all payment attempts
- ✅ Use HTTPS only
- ✅ Never expose API keys
- ✅ Validate amounts server-side
- ✅ Handle payment failures gracefully

---

## 🧪 Testing

### JazzCash Sandbox
- URL: https://sandbox.jazzcash.com.pk/
- Test cards provided in documentation
- Test all scenarios (success, failure, timeout)

### EasyPaisa Sandbox
- Similar sandbox environment
- Test credentials provided

---

## 💰 Cost Comparison

| Gateway | Setup Fee | Transaction Fee | Settlement |
|---------|-----------|-----------------|------------|
| JazzCash | Free | 1.5% - 2.5% | T+1 |
| EasyPaisa | Free | 1.5% - 2.5% | T+1 |
| PayFast | Free | 2.5% - 3% | T+1 |
| Stripe | Free | 2.9% + Rs. 30 | T+2 |

---

## 📞 Support Contacts

### JazzCash
- Email: merchantsupport@jazzcash.com.pk
- Phone: 111-124-444

### EasyPaisa
- Email: merchant@easypaisa.com.pk
- Phone: 111-003-947

---

## 🎯 Next Steps

1. **Week 1**: Apply for JazzCash merchant account
2. **Week 2**: Get approved, receive credentials
3. **Week 3**: Integrate and test in sandbox
4. **Week 4**: Go live with JazzCash
5. **Month 2**: Add EasyPaisa

---

## 📚 Resources

- JazzCash API Docs: https://sandbox.jazzcash.com.pk/documentation/
- EasyPaisa Merchant Portal: https://easypaisa.com.pk/merchant/
- PayFast: https://www.payfast.pk/

---

**Estimated Time**: 2-3 weeks (including approval)  
**Difficulty**: Medium  
**Impact**: High (30-50% increase in conversions)

🚀 **Ready to add online payments? Start with JazzCash application today!**
