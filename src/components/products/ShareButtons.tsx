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
    <div className="flex items-center gap-2 flex-wrap touch-manipulation">
      <span className="text-xs text-[#94a3b8] font-semibold uppercase tracking-widest">Share:</span>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 bg-[#f8fafc] hover:bg-[#25D366] hover:text-white text-[#64748b] text-xs font-semibold px-3 py-2 rounded-full transition-colors touch-manipulation"
        aria-label="Share on WhatsApp"
        style={{ touchAction: 'manipulation' }}
      >
        <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
        WhatsApp
      </a>

      <button
        onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full transition-colors touch-manipulation ${
          copied
            ? 'bg-green-100 text-green-700'
            : 'bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#64748b]'
        }`}
        aria-label="Copy product link"
        style={{ touchAction: 'manipulation' }}
      >
        <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
        {copied ? 'Copied!' : 'Copy Link'}
      </button>

      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="inline-flex items-center gap-1.5 bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#64748b] text-xs font-semibold px-3 py-2 rounded-full transition-colors touch-manipulation"
          aria-label="Share via native share"
          style={{ touchAction: 'manipulation' }}
        >
          <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
          Share
        </button>
      )}
    </div>
  );
}
