'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, AlertCircle } from 'lucide-react';
import { updateSiteSettings } from '@/lib/actions';
import type { SiteSettings } from '@/types';

interface SettingsFormProps {
  settings: SiteSettings | null;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    whatsapp_number: settings?.whatsapp_number ?? '',
    support_text: settings?.support_text ?? '',
    shipping_text: settings?.shipping_text ?? '',
    cod_enabled: settings?.cod_enabled ?? true,
    store_city: settings?.store_city ?? '',
    delivery_fee: settings?.delivery_fee ?? 200,
    announcement_text: settings?.announcement_text ?? '',
    hero_headline: settings?.hero_headline ?? '',
    hero_subtext: settings?.hero_subtext ?? '',
    social_whatsapp: settings?.social_whatsapp ?? '',
    social_facebook: settings?.social_facebook ?? '',
    social_instagram: settings?.social_instagram ?? '',
    social_tiktok: settings?.social_tiktok ?? '',
    social_youtube: settings?.social_youtube ?? '',
    social_twitter: settings?.social_twitter ?? '',
  });

  async function handleSave() {
    setLoading(true);
    setError('');
    setSaved(false);
    const result = await updateSiteSettings(form);
    if (result.success) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result.error || 'Failed to save settings.');
    }
    setLoading(false);
  }

  const inp = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition';
  const label = 'text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5';

  return (
    <div className="max-w-2xl space-y-5">
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl p-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Contact & Support */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-5">
        <p className="font-bold text-sm text-gray-900 mb-4">Contact & Support</p>
        <div className="space-y-3">
          <div>
            <label className={label}>WhatsApp Number</label>
            <input
              value={form.whatsapp_number}
              onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
              placeholder="923001234567"
              className={inp}
            />
            <p className="text-xs text-gray-400 mt-1">Include country code, no + or spaces</p>
          </div>
          <div>
            <label className={label}>Support Text</label>
            <input
              value={form.support_text}
              onChange={(e) => setForm({ ...form, support_text: e.target.value })}
              placeholder="e.g. Mon–Sat, 9am–9pm"
              className={inp}
            />
          </div>
          <div>
            <label className={label}>Store City</label>
            <input
              value={form.store_city}
              onChange={(e) => setForm({ ...form, store_city: e.target.value })}
              placeholder="e.g. Lahore"
              className={inp}
            />
          </div>
        </div>
      </div>

      {/* Shipping & Orders */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-5">
        <p className="font-bold text-sm text-gray-900 mb-4">Shipping & Orders</p>
        <div className="space-y-3">
          <div>
            <label className={label}>Shipping Text</label>
            <input
              value={form.shipping_text}
              onChange={(e) => setForm({ ...form, shipping_text: e.target.value })}
              placeholder="e.g. Free delivery on orders above Rs. 2000"
              className={inp}
            />
          </div>
          <div>
            <label className={label}>Delivery Fee (Rs.)</label>
            <input
              type="number"
              value={form.delivery_fee}
              onChange={(e) => setForm({ ...form, delivery_fee: parseInt(e.target.value) || 0 })}
              placeholder="200"
              className={inp}
            />
          </div>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Cash on Delivery</p>
              <p className="text-xs text-gray-500">Allow COD payment at checkout</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, cod_enabled: !form.cod_enabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${form.cod_enabled ? 'bg-gray-900' : 'bg-gray-300'}`}
              role="switch"
              aria-checked={form.cod_enabled}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.cod_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Storefront Content */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-5">
        <p className="font-bold text-sm text-gray-900 mb-4">Storefront Content</p>
        <div className="space-y-3">
          <div>
            <label className={label}>Announcement Text</label>
            <input
              value={form.announcement_text}
              onChange={(e) => setForm({ ...form, announcement_text: e.target.value })}
              placeholder="e.g. 🎉 Free delivery on orders above Rs. 2000!"
              className={inp}
            />
            <p className="text-xs text-gray-400 mt-1">Shown in the top announcement bar</p>
          </div>
          <div>
            <label className={label}>Hero Headline</label>
            <input
              value={form.hero_headline}
              onChange={(e) => setForm({ ...form, hero_headline: e.target.value })}
              placeholder="e.g. Pakistan's #1 Mobile Accessories Store"
              className={inp}
            />
          </div>
          <div>
            <label className={label}>Hero Subtext</label>
            <input
              value={form.hero_subtext}
              onChange={(e) => setForm({ ...form, hero_subtext: e.target.value })}
              placeholder="e.g. Premium quality at unbeatable prices"
              className={inp}
            />
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-5">
        <p className="font-bold text-sm text-gray-900 mb-1">Social Media Links</p>
        <p className="text-xs text-gray-400 mb-4">These appear in the &quot;Stay Connected&quot; section on the homepage.</p>
        <div className="space-y-3">
          {[
            { key: 'social_whatsapp',  label: 'WhatsApp',    placeholder: 'https://wa.me/923001234567',       color: '#25D366' },
            { key: 'social_facebook',  label: 'Facebook',    placeholder: 'https://facebook.com/yourpage',    color: '#1877F2' },
            { key: 'social_instagram', label: 'Instagram',   placeholder: 'https://instagram.com/yourhandle', color: '#E1306C' },
            { key: 'social_tiktok',    label: 'TikTok',      placeholder: 'https://tiktok.com/@yourhandle',   color: '#0a0a0a' },
            { key: 'social_youtube',   label: 'YouTube',     placeholder: 'https://youtube.com/@yourchannel', color: '#FF0000' },
            { key: 'social_twitter',   label: 'X / Twitter', placeholder: 'https://x.com/yourhandle',         color: '#0a0a0a' },
          ].map(({ key, label: lbl, placeholder, color }) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: color }}>
                {lbl[0]}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{lbl}</p>
                <input
                  value={(form as any)[key] ?? ''}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className={inp}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-colors disabled:opacity-50"
      >
        {loading ? (
          <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <Check className="w-3.5 h-3.5" />
        )}
        {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
      </button>
    </div>
  );
}
