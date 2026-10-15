/**
 * WhatsApp Integration Utilities for Elvra For Divas
 * Handles direct redirection for all customer queries and orders.
 * Contact: +91 80158 48822
 */

export const ELVRA_WHATSAPP_NUMBER = '918015848822';
export const ELVRA_WHATSAPP_DISPLAY = '+91 80158 48822';

export interface WhatsAppShippingAddress {
  recipient_name?: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
}

export interface WhatsAppOrderItem {
  title: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface WhatsAppOrderPayload {
  orderNumber?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: WhatsAppShippingAddress;
  items: WhatsAppOrderItem[];
  subtotal: number;
  discountAmount?: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number;
  paymentPreference?: string;
}

export interface WhatsAppQueryPayload {
  name: string;
  email?: string;
  phone?: string;
  topic?: string;
  message: string;
}

export interface WhatsAppProductContext {
  title: string;
  color?: string;
  size?: string;
  price?: number;
  quantity?: number;
  slug?: string;
}

/**
 * Opens WhatsApp with pre-filled message encoded
 */
export function openWhatsApp(message: string): void {
  const cleanNumber = ELVRA_WHATSAPP_NUMBER.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${cleanNumber}?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Builds a structured text message for a full order placed on the website
 */
export function formatOrderWhatsAppMessage(order: WhatsAppOrderPayload): string {
  const ref = order.orderNumber || `ELV-WA-${Date.now().toString().slice(-6)}`;
  
  const itemsText = order.items
    .map((item, idx) => {
      const variantStr = [item.color, item.size ? `Size: ${item.size}` : '']
        .filter(Boolean)
        .join(' | ');
      return `${idx + 1}. *${item.title}*\n   ${variantStr ? `(${variantStr})\n   ` : ''}Qty: ${item.quantity} × ₹${item.unitPrice} = *₹${item.subtotal}*`;
    })
    .join('\n\n');

  const addr = order.shippingAddress;
  const addressText = [
    addr.addressLine1,
    addr.addressLine2,
    `${addr.city}, ${addr.state} - ${addr.pincode}`,
  ]
    .filter(Boolean)
    .join('\n');

  let discountLine = '';
  if (order.discountAmount && order.discountAmount > 0) {
    discountLine = `\n• Discount (${order.couponCode || 'Promo'}): -₹${order.discountAmount}`;
  }

  const shippingLine = order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`;
  const paymentPref = order.paymentPreference || 'WhatsApp Pay / UPI (GPay/PhonePe/Paytm) / COD';

  return `🛍️ *NEW ORDER — ELVRA FOR DIVAS*
Order Ref: *#${ref}*

👤 *Customer Details:*
• Name: ${order.customerName}
• Phone: ${order.customerPhone}
${order.customerEmail ? `• Email: ${order.customerEmail}\n` : ''}
📍 *Shipping Address:*
${addressText}

📦 *Items Ordered (${order.items.reduce((acc, i) => acc + i.quantity, 0)} pcs):*
${itemsText}

💰 *Bill Breakdown:*
• Items Subtotal: ₹${order.subtotal}${discountLine}
• Delivery: ${shippingLine}
• *TOTAL AMOUNT: ₹${order.totalAmount}*

💳 *Payment Preference:* ${paymentPref}

✨ *Wings to Explore | elvrafordivas.com*
Please confirm my order and share dispatch details!`;
}

/**
 * Builds a quick order message from Shopping Bag
 */
export function formatCartWhatsAppMessage(
  items: Array<{ title: string; color?: string; size?: string; quantity: number; subtotal: number }>,
  subtotal: number,
  shippingFee: number,
  total: number,
  couponCode?: string,
  discountAmount?: number
): string {
  const itemsList = items
    .map((item, idx) => {
      const details = [item.color, item.size ? `Size ${item.size}` : ''].filter(Boolean).join(' • ');
      return `${idx + 1}. *${item.title}* (${details}) × ${item.quantity} = ₹${item.subtotal}`;
    })
    .join('\n');

  let discountStr = '';
  if (discountAmount && discountAmount > 0) {
    discountStr = `\n• Discount (${couponCode}): -₹${discountAmount}`;
  }

  return `🛍️ *SHOPPING BAG ORDER — ELVRA FOR DIVAS*

Hello Elvra Concierge! I would like to place an order for the items in my shopping bag:

${itemsList}

💰 *Estimated Summary:*
• Subtotal: ₹${subtotal}${discountStr}
• Shipping: ${shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
• *Estimated Total: ₹${total}*

Please guide me with address confirmation and UPI / payment options!`;
}

/**
 * Builds a single product direct order message (Buy Now on WhatsApp)
 */
export function formatSingleProductOrderMessage(product: WhatsAppProductContext): string {
  const variant = [product.color, product.size ? `Size: ${product.size}` : ''].filter(Boolean).join(', ');
  const qty = product.quantity || 1;
  const unitPrice = product.price || 0;
  const totalPrice = unitPrice * qty;

  return `🛍️ *DIRECT PRODUCT ORDER — ELVRA FOR DIVAS*

Hello Elvra Team! I would like to order:
• *Product:* ${product.title}
• *Options:* ${variant || 'Standard'}
• *Quantity:* ${qty}
• *Price:* ₹${totalPrice} (₹${unitPrice} each)

Please confirm availability and share payment (UPI / GPay / PhonePe / COD) & delivery details!`;
}

/**
 * Builds a product query message (fit, fabric, availability)
 */
export function formatProductInquiryMessage(product: WhatsAppProductContext, query?: string): string {
  const variant = [product.color, product.size ? `Size: ${product.size}` : ''].filter(Boolean).join(', ');

  return `🌿 *PRODUCT ENQUIRY — ELVRA FOR DIVAS*

Hi Elvra Concierge, I have a question regarding:
• *Product:* ${product.title}
${variant ? `• *Selected Variant:* ${variant}\n` : ''}${product.price ? `• *Price:* ₹${product.price}\n` : ''}
${query ? `💬 *My Question:*\n"${query}"\n\n` : ''}Could you please help me with more details?`;
}

/**
 * Builds a general inquiry message from Contact form or Help sections
 */
export function formatGeneralInquiryMessage(inquiry: WhatsAppQueryPayload): string {
  return `💌 *WEBSITE QUERY — ELVRA FOR DIVAS*

👤 *From:* ${inquiry.name}
${inquiry.phone ? `📞 *Phone:* ${inquiry.phone}\n` : ''}${inquiry.email ? `✉️ *Email:* ${inquiry.email}\n` : ''}${inquiry.topic ? `📌 *Topic:* ${inquiry.topic}\n` : ''}
📝 *Message:*
"${inquiry.message}"

✨ Sent from elvrafordivas.com`;
}
