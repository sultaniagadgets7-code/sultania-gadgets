import type { Metadata } from 'next';
import { ExchangeForm } from './ExchangeForm';

export const metadata: Metadata = {
  title: 'Exchange / Return Request',
  description: 'Submit an exchange or return request for your Sultania Gadgets order.',
};

export default function ExchangeRequestPage() {
  return (
    <div className="max-w-lg mx-auto px-5 py-12">
      <div className="text-center mb-8">
        <p className="label text-gray-400 mb-2">Support</p>
        <h1 className="heading-xl text-gray-950 mb-3">Exchange Request</h1>
        <p className="text-gray-500 text-sm">
          Received a defective or wrong item? Fill in the form below and we&apos;ll arrange an exchange.
        </p>
      </div>
      <ExchangeForm />
    </div>
  );
}
