import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/queries';
import { SettingsForm } from './SettingsForm';

export const metadata: Metadata = { title: 'Site Settings' };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage store-wide configuration</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
