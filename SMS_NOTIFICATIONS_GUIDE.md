# 📱 SMS Notifications Setup Guide

Complete guide to add SMS notifications for order confirmations and updates.

---

## 🎯 Why SMS Notifications?

- ✅ Instant delivery confirmation
- ✅ Higher open rates than email (98% vs 20%)
- ✅ Works without internet
- ✅ Professional customer experience
- ✅ Reduces "Where is my order?" calls

---

## 📊 SMS Providers in Pakistan

### 1. Twilio (Recommended - International)
- **Pricing**: $0.0075 per SMS (~Rs. 2)
- **Reliability**: 99.95% uptime
- **Features**: Two-way SMS, delivery reports
- **Setup**: 10 minutes
- **Best For**: Professional businesses

### 2. SMS Gateway Pakistan (Local)
- **Pricing**: Rs. 0.50 - Rs. 1 per SMS
- **Reliability**: Good
- **Features**: Bulk SMS, custom sender ID
- **Setup**: 1-2 days
- **Best For**: Budget-conscious

### 3. Eocean (Local)
- **Pricing**: Rs. 0.60 per SMS
- **Reliability**: Good
- **Features**: API, bulk SMS
- **Setup**: 1 day
- **Best For**: Local businesses

### 4. Telenor Bulk SMS (Local)
- **Pricing**: Rs. 0.50 per SMS
- **Reliability**: Excellent
- **Features**: Branded sender ID
- **Setup**: 2-3 days
- **Best For**: High volume

---

## 🚀 Quick Start: Twilio Integration

### Step 1: Create Twilio Account

1. Visit: https://www.twilio.com/try-twilio
2. Sign up (free trial includes $15 credit)
3. Verify your phone number
4. Get a Twilio phone number

### Step 2: Get API Credentials

From Twilio Console:
- **Account SID**: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
- **Auth Token**: Your secret token
- **Phone Number**: +1234567890

### Step 3: Install Twilio SDK

\`\`\`bash
cd sultania-gadgets
npm install twilio
\`\`\`

### Step 4: Add Environment Variables

Add to \`.env.local\`:
\`\`\`env
# Twilio SMS
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
\`\`\`

### Step 5: Create SMS Utility

File: \`src/lib/sms.ts\`

\`\`\`typescript
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export async function sendSMS(to: string, message: string) {
  try {
    // Format Pakistani number: +92 instead of 0
    const formattedNumber = to.startsWith('0') 
      ? \`+92\${to.substring(1)}\` 
      : to.startsWith('+92') 
      ? to 
      : \`+92\${to}\`;

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedNumber,
    });

    console.log('SMS sent:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('SMS error:', error);
    return { success: false, error };
  }
}

// Order confirmation SMS
export async function sendOrderConfirmationSMS(
  phone: string,
  orderId: string,
  amount: number
) {
  const message = \`Thank you for your order! Order #\${orderId} (Rs. \${amount.toLocaleString()}) has been confirmed. Track: https://sultaniagadgets.com/track-order?id=\${orderId}\`;
  return sendSMS(phone, message);
}

// Order shipped SMS
export async function sendOrderShippedSMS(
  phone: string,
  orderId: string,
  trackingNumber?: string
) {
  const message = trackingNumber
    ? \`Your order #\${orderId} has been shipped! Tracking: \${trackingNumber}. Expected delivery: 2-4 days.\`
    : \`Your order #\${orderId} has been shipped! Expected delivery: 2-4 days.\`;
  return sendSMS(phone, message);
}

// Order delivered SMS
export async function sendOrderDeliveredSMS(
  phone: string,
  orderId: string
) {
  const message = \`Your order #\${orderId} has been delivered! Thank you for shopping with Sultania Gadgets. Rate your experience: https://sultaniagadgets.com/review/\${orderId}\`;
  return sendSMS(phone, message);
}

// Low stock alert SMS (for admin)
export async function sendLowStockAlertSMS(
  adminPhone: string,
  productName: string,
  stock: number
) {
  const message = \`⚠️ Low Stock Alert: "\${productName}" has only \${stock} units left. Restock soon!\`;
  return sendSMS(adminPhone, message);
}
\`\`\`

### Step 6: Update Order Creation

File: \`src/app/actions/orders.ts\` (add to existing file)

\`\`\`typescript
import { sendOrderConfirmationSMS } from '@/lib/sms';

// After creating order
export async function createOrder(orderData: any) {
  // ... existing order creation code ...

  // Send SMS notification
  if (orderData.phone) {
    await sendOrderConfirmationSMS(
      orderData.phone,
      order.id,
      order.total_amount
    );
  }

  return order;
}
\`\`\`

### Step 7: Add SMS to Admin Panel

File: \`src/app/admin/orders/[id]/page.tsx\`

Add button to send status update SMS:

\`\`\`typescript
import { sendOrderShippedSMS, sendOrderDeliveredSMS } from '@/lib/sms';

async function sendStatusSMS(orderId: string, status: string, phone: string) {
  if (status === 'shipped') {
    await sendOrderShippedSMS(phone, orderId);
  } else if (status === 'delivered') {
    await sendOrderDeliveredSMS(phone, orderId);
  }
}
\`\`\`

---

## 🚀 Alternative: Local SMS Provider (Cheaper)

### Using SMS Gateway Pakistan

\`\`\`typescript
// src/lib/sms-local.ts
export async function sendSMS(to: string, message: string) {
  const apiKey = process.env.SMS_GATEWAY_API_KEY;
  const senderId = process.env.SMS_GATEWAY_SENDER_ID; // e.g., "SULTANIA"

  const response = await fetch('https://api.smsgateway.pk/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      sender_id: senderId,
      phone: to,
      message: message,
    }),
  });

  return response.json();
}
\`\`\`

---

## 📋 SMS Templates

### Order Confirmation
\`\`\`
Thank you for your order! Order #12345 (Rs. 5,000) confirmed. 
Track: sultaniagadgets.com/track-order?id=12345
- Sultania Gadgets
\`\`\`

### Order Shipped
\`\`\`
Your order #12345 has been shipped! 
Tracking: TCS-123456789
Expected delivery: 2-4 days
- Sultania Gadgets
\`\`\`

### Order Delivered
\`\`\`
Your order #12345 delivered! 
Thank you for shopping with us.
Rate: sultaniagadgets.com/review/12345
- Sultania Gadgets
\`\`\`

### Payment Reminder (COD)
\`\`\`
Reminder: Order #12345 (Rs. 5,000) arriving today.
Please keep cash ready. Thank you!
- Sultania Gadgets
\`\`\`

### Exchange Approved
\`\`\`
Your exchange request #12345 approved!
Our courier will collect the item within 2 days.
- Sultania Gadgets
\`\`\`

---

## 💰 Cost Estimation

### Twilio (International)
- **Per SMS**: ~Rs. 2
- **100 orders/month**: Rs. 200
- **500 orders/month**: Rs. 1,000
- **1000 orders/month**: Rs. 2,000

### Local Provider
- **Per SMS**: Rs. 0.50 - Rs. 1
- **100 orders/month**: Rs. 50 - Rs. 100
- **500 orders/month**: Rs. 250 - Rs. 500
- **1000 orders/month**: Rs. 500 - Rs. 1,000

---

## 🎯 SMS Strategy

### Essential SMS (Send Always)
1. ✅ Order confirmation
2. ✅ Order shipped
3. ✅ Order delivered

### Optional SMS (Send Selectively)
4. Payment reminder (COD)
5. Delivery attempt failed
6. Exchange/return updates
7. Promotional offers (with opt-in)

---

## 📊 Database Changes

Add SMS tracking:

\`\`\`sql
CREATE TABLE sms_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT, -- 'sent', 'failed', 'delivered'
  provider TEXT, -- 'twilio', 'local'
  sid TEXT, -- Provider message ID
  cost DECIMAL(10, 2),
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sms_logs_order ON sms_logs(order_id);
CREATE INDEX idx_sms_logs_phone ON sms_logs(phone);
\`\`\`

---

## 🔒 Best Practices

### Do's ✅
- Keep messages under 160 characters
- Include order ID
- Add brand name
- Provide tracking link
- Send during business hours (9 AM - 9 PM)
- Get consent for promotional SMS

### Don'ts ❌
- Don't send too many SMS
- Don't send at night
- Don't use ALL CAPS
- Don't send promotional SMS without consent
- Don't include sensitive data (passwords, etc.)

---

## 🧪 Testing

### Test Numbers (Twilio)
During trial, you can only send to verified numbers.

### Test in Production
1. Create test order with your number
2. Verify SMS received
3. Check formatting
4. Test all order statuses

---

## 📱 SMS Opt-Out

Add to your SMS:
\`\`\`
Reply STOP to unsubscribe
\`\`\`

Handle opt-outs:
\`\`\`typescript
// Store opt-outs in database
CREATE TABLE sms_opt_outs (
  phone TEXT PRIMARY KEY,
  opted_out_at TIMESTAMPTZ DEFAULT NOW()
);

// Check before sending
async function canSendSMS(phone: string) {
  const { data } = await supabase
    .from('sms_opt_outs')
    .select('phone')
    .eq('phone', phone)
    .single();
  
  return !data;
}
\`\`\`

---

## 🎯 Implementation Timeline

### Week 1: Setup
- Day 1-2: Create Twilio account
- Day 3: Integrate SMS utility
- Day 4-5: Test with sample orders

### Week 2: Deploy
- Day 1: Add to order creation
- Day 2: Add to admin panel
- Day 3-5: Monitor and optimize

---

## 📞 Provider Contacts

### Twilio
- Website: https://www.twilio.com
- Support: https://support.twilio.com
- Docs: https://www.twilio.com/docs/sms

### SMS Gateway Pakistan
- Website: https://smsgateway.pk
- Email: support@smsgateway.pk
- Phone: +92-21-111-111-475

### Eocean
- Website: https://eocean.us
- Email: info@eocean.us

---

## 💡 Pro Tips

1. **Start with Twilio** - Easy setup, reliable
2. **Switch to local later** - Once volume increases
3. **Track delivery rates** - Monitor SMS success
4. **A/B test messages** - Find what works
5. **Keep it short** - Under 160 characters
6. **Personalize** - Use customer name
7. **Add value** - Include tracking link

---

**Estimated Setup Time**: 1-2 hours  
**Monthly Cost**: Rs. 200 - Rs. 2,000 (depending on volume)  
**Impact**: High (better customer experience)

🚀 **Ready to add SMS? Start with Twilio free trial today!**
