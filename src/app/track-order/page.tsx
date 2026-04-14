import type { Metadata } from 'next';
import { TrackOrderForm } from './TrackOrderForm';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Enter your phone number to track your Sultania Gadgets order status.',
};

export default function TrackOrderPage() {
  return (
    <div className="max-w-lg mx-auto px-5 py-16">
      <div className="text-center mb-8">
        <p className="label text-gray-400 mb-2">Order Tracking</p>
        <h1 className="heading-xl text-gray-950 mb-3">Track Your Order</h1>
        <p className="text-gray-500 text-sm">Enter your phone number to see all your orders and their status.</p>
      </div>
      <TrackOrderForm />
    </div>
  );
}
