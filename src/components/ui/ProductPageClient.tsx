'use client';

import { StickyOrderBar } from './StickyOrderBar';
import { SocialProofToast } from './SocialProofToast';
import { ExitIntentPopup } from './ExitIntentPopup';

interface Props {
  productTitle: string;
  price: number;
  isOutOfStock: boolean;
  whatsappNumber: string;
}

export function ProductPageClient({ productTitle, price, isOutOfStock, whatsappNumber }: Props) {
  return (
    <>
      <SocialProofToast productTitle={productTitle} />
      <ExitIntentPopup whatsappNumber={whatsappNumber} />
      <StickyOrderBar
        title={productTitle}
        price={price}
        isOutOfStock={isOutOfStock}
        onOrder={() => {
          document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
      />
    </>
  );
}
