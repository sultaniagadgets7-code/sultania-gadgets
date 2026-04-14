'use client';

import { useState } from 'react';
import { MessageCircle, Link2, Share2 } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Check out ${title} at ${url}`)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('input');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleNativeShare() {
    if (navigator.share) {
      await navigator.share({ title, url });
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Share:</span>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 bg-[#f7f7f7] hover:bg-[#25D366] hover:text-white text-gray-600 text-xs font-semibold px-3 py-2 rounded-full transition-colors"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
        WhatsApp
      </a>

      <button
        onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full transition-colors ${
          copied
            ? 'bg-green-100 text-green-700'
            : 'bg-[#f7f7f7] hover:bg-gray-200 text-gray-600'
        }`}
        aria-label="Copy product link"
      >
        <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
        {copied ? 'Copied!' : 'Copy Link'}
      </button>

      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="inline-flex items-center gap-1.5 bg-[#f7f7f7] hover:bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-2 rounded-full transition-colors"
          aria-label="Share via native share"
        >
          <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
          Share
        </button>
      )}
    </div>
  );
}
