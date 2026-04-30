'use client';

import { StickyOrderBar } from '@/app/product/[slug]/StickyOrderBar';
import { SocialProofToast } from './SocialProofToast';
import { ExitIntentPopup } from './ExitIntentPopup';

interface Props {
  productTitle: string;
  price: number;
  isOutOfStock: boolean;
  whatsappNumber: string;
}

export function ProductPageClient({ productTitle, price, isOutOfStock, whatsappNumber }: Props) {
  if (isOutOfStock) {
    return (
      <>
        <SocialProofToast productTitle={productTitle} />
        <ExitIntentPopup whatsappNumber={whatsappNumber} />
      </>
    );
  }

  return (
    <>
      <SocialProofToast productTitle={productTitle} />
      <ExitIntentPopup whatsappNumber={whatsappNumber} />
      <StickyOrderBar
        price={price}
        productTitle={productTitle}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
