export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function getWhatsAppUrl(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function getProductWhatsAppMessage(productTitle: string): string {
  return `Assalamualaikum, I want to order *${productTitle}*. Is it available?`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getDiscountPercent(price: number, compareAt: number): number {
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function getPrimaryImage(images?: { image_url: string; alt_text?: string | null }[]): string {
  if (!images || images.length === 0) return '/placeholder-product.jpg';
  return images[0].image_url;
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
