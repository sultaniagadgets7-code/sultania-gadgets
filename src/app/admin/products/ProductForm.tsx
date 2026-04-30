'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '@/lib/actions';
import { slugify } from '@/lib/utils';
import type { Category, Product } from '@/types';
import {
  AlertCircle, CheckCircle, Upload, X, ImagePlus,
  GripVertical, ChevronDown, ChevronUp, Info, Plus, Trash2,
} from 'lucide-react';

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

interface UploadedImage {
  url: string;
  alt: string;
  uploading?: boolean;
  error?: string;
}

interface Variation {
  name: string;   // e.g. "Color", "Size", "Storage"
  options: string; // comma-separated e.g. "Black, White, Red"
}

// ── Section wrapper ──────────────────────────────────────────
function Section({ title, subtitle, children, defaultOpen = true }: {
  title: string; subtitle?: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div>
          <p className="font-bold text-gray-900 text-sm">{title}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 pt-2 border-t border-gray-100">{children}</div>}
    </div>
  );
}

// ── Field wrapper ────────────────────────────────────────────
function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
        {hint && (
          <span className="group relative cursor-help">
            <Info className="w-3 h-3 text-gray-400" />
            <span className="absolute left-5 top-0 w-48 bg-gray-900 text-white text-xs rounded-lg px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              {hint}
            </span>
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

const inp = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition';

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [title, setTitle] = useState(product?.title || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [images, setImages] = useState<UploadedImage[]>(
    product?.product_images?.map((img) => ({ url: img.image_url, alt: img.alt_text || '' })) || []
  );
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract existing variations from specs_json
  const existingSpecs = product?.specs_json as Record<string, unknown> | null;
  const existingVariations = (existingSpecs?._variations as Variation[]) || [];
  const [variations, setVariations] = useState<Variation[]>(
    existingVariations.length > 0 ? existingVariations : []
  );

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEdit) setSlug(slugify(val));
  }

  // ── Image upload → R2 ───────────────────────────────────
  async function uploadFile(file: File): Promise<string | null> {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        console.error('Upload failed:', data.error);
        return null;
      }
      return data.url;
    } catch (err) {
      console.error('Upload error:', err);
      return null;
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    // Upload each file sequentially with a unique key
    for (const file of validFiles) {
      const tempId = `uploading-${Date.now()}-${Math.random()}`;

      // Add placeholder
      setImages((prev) => [...prev, {
        url: URL.createObjectURL(file),
        alt: title || file.name.replace(/\.[^.]+$/, ''),
        uploading: true,
        error: tempId, // use error field as temp ID
      }]);

      // Upload to R2
      const url = await uploadFile(file);

      setImages((prev) => prev.map((img) => {
        if (img.error === tempId) {
          if (url) {
            return { url, alt: title || file.name, uploading: false };
          } else {
            return { ...img, uploading: false, error: 'Upload failed' };
          }
        }
        return img;
      }));
    }
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function moveImage(from: number, to: number) {
    setImages((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  }

  function updateAlt(idx: number, alt: string) {
    setImages((prev) => prev.map((img, i) => i === idx ? { ...img, alt } : img));
  }

  // ── Submit ───────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Block save if images are still uploading
    const stillUploading = images.some((img) => img.uploading);
    if (stillUploading) {
      setMessage({ type: 'error', text: 'Please wait for all images to finish uploading.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    // Only include fully uploaded images (have R2 URL, not uploading, no real error)
    const imageUrls = images
      .filter((img) => !img.uploading && img.url.startsWith('http'))
      .map((img) => img.url)
      .join('\n');
    formData.set('image_urls', imageUrls);
    formData.set('title', title);
    formData.set('slug', slug);

    // Merge variations into specs_json
    const specsRaw = formData.get('specs_json') as string;
    let specs: Record<string, unknown> = {};
    try { specs = specsRaw ? JSON.parse(specsRaw) : {}; } catch { specs = {}; }
    const validVariations = variations.filter(v => v.name.trim() && v.options.trim());
    if (validVariations.length > 0) {
      specs._variations = validVariations;
    } else {
      delete specs._variations;
    }
    formData.set('specs_json', JSON.stringify(specs));
    // Checkboxes only appear in FormData when checked — normalise to explicit true/false
    formData.set('is_active', formData.has('is_active') ? 'true' : 'false');
    formData.set('is_featured', formData.has('is_featured') ? 'true' : 'false');
    formData.set('is_new_arrival', formData.has('is_new_arrival') ? 'true' : 'false');

    const result = isEdit
      ? await updateProduct(product!.id, formData)
      : await createProduct(formData);

    if (result.success) {
      setMessage({ type: 'success', text: isEdit ? 'Product updated successfully.' : 'Product created successfully.' });
      if (!isEdit) router.push('/admin/products');
    } else {
      setMessage({ type: 'error', text: result.error || 'Something went wrong.' });
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl">

      {/* Status message */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-[16px] text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success'
            ? <CheckCircle className="w-4 h-4 shrink-0" />
            : <AlertCircle className="w-4 h-4 shrink-0" />}
          {message.text}
        </div>
      )}

      {/* ── IMAGES ─────────────────────────────────────────── */}
      <Section title="Product Images" subtitle="Upload up to 8 images. First image is the primary.">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors mb-4 ${
            dragOver ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <ImagePlus className="w-8 h-8 text-gray-300 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-semibold text-gray-600">Drop images here or click to upload</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 5MB each</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            aria-label="Upload product images"
          />
        </div>

        {/* Image grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <div className={`relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 ${
                  i === 0 ? 'border-gray-900' : 'border-transparent'
                }`}>
                  {/* Use regular img tag — works for both blob: and https: URLs */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.alt || `Image ${i + 1}`}
                    className="w-full h-full object-contain p-2"
                  />
                  {img.uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <svg className="animate-spin w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </div>
                  )}
                  {img.error && !img.uploading && (
                    <div className="absolute inset-0 bg-red-50/95 flex flex-col items-center justify-center p-2">
                      <p className="text-xs text-red-600 text-center font-semibold">❌ Upload failed</p>
                      <p className="text-[10px] text-red-400 text-center mt-1">Open F12 console for details</p>
                    </div>
                  )}
                  {/* Primary badge */}
                  {i === 0 && !img.uploading && (
                    <span className="absolute top-1.5 left-1.5 bg-gray-900 text-white text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full">
                      Primary
                    </span>
                  )}
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* Alt text */}
                <input
                  value={img.alt}
                  onChange={(e) => updateAlt(i, e.target.value)}
                  placeholder="Alt text"
                  className="mt-1.5 w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  aria-label={`Alt text for image ${i + 1}`}
                />

                {/* Reorder buttons */}
                <div className="flex gap-1 mt-1">
                  {i > 0 && (
                    <button type="button" onClick={() => moveImage(i, i - 1)}
                      className="flex-1 text-xs text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg py-1 transition-colors"
                      aria-label="Move left">← Move left</button>
                  )}
                  {i < images.length - 1 && (
                    <button type="button" onClick={() => moveImage(i, i + 1)}
                      className="flex-1 text-xs text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg py-1 transition-colors"
                      aria-label="Move right">Move right →</button>
                  )}
                </div>
              </div>
            ))}

            {/* Add more */}
            {images.length < 8 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-gray-400 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Add more images"
              >
                <Upload className="w-5 h-5" />
                <span className="text-xs font-medium">Add more</span>
              </button>
            )}
          </div>
        )}
      </Section>

      {/* ── BASIC INFO ─────────────────────────────────────── */}
      <Section title="Basic Information" subtitle="Product title, slug, and category">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Product Title" required>
            <input name="title" required value={title} onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. 65W GaN Fast Charger" className={inp} />
          </Field>

          <Field label="URL Slug" required hint="Used in the product URL. Auto-generated from title.">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">/product/</span>
              <input name="slug" required value={slug} onChange={(e) => setSlug(e.target.value)}
                placeholder="65w-gan-charger" className={`${inp} pl-20 font-mono`} />
            </div>
          </Field>

          <Field label="Category">
            <select name="category_id" defaultValue={product?.category_id || ''} className={inp}>
              <option value="">— No Category —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>

          <Field label="SKU" hint="Stock Keeping Unit — your internal product code">
            <input name="sku" defaultValue={product?.sku || ''} placeholder="e.g. CHG-65W-001" className={inp} />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Short Description" hint="Shown under the title on product cards and listing pages">
            <input name="short_description" defaultValue={product?.short_description || ''}
              placeholder="One-line summary of the product" className={inp} />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Full Description" hint="Use lines starting with - or • for key features (shown as bullet list)">
            <textarea name="description" rows={6} defaultValue={product?.description || ''}
              placeholder={`- 65W GaN technology for fast, efficient charging\n- Supports USB-C Power Delivery (PD)\n- Compact design\n\nFull description text here...`}
              className={`${inp} resize-y`} />
          </Field>
        </div>
      </Section>

      {/* ── PRICING & STOCK ────────────────────────────────── */}
      <Section title="Pricing & Stock" subtitle="Set price, compare-at price, and inventory">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="Price (PKR)" required>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold">Rs.</span>
              <input name="price" type="number" required min="0" step="1"
                defaultValue={product?.price || ''}
                placeholder="0" className={`${inp} pl-10`} />
            </div>
          </Field>

          <Field label="Compare-at Price" hint="Original price before discount. Shows strikethrough.">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold">Rs.</span>
              <input name="compare_at_price" type="number" min="0" step="1"
                defaultValue={product?.compare_at_price || ''}
                placeholder="0" className={`${inp} pl-10`} />
            </div>
          </Field>

          <Field label="Stock Quantity" required>
            <input name="stock_quantity" type="number" required min="0"
              defaultValue={product?.stock_quantity ?? 0}
              placeholder="0" className={inp} />
          </Field>

          <Field label="Condition">
            <select name="condition" defaultValue={product?.condition || 'New'} className={inp}>
              <option>New</option>
              <option>Open Box</option>
              <option>Refurbished</option>
            </select>
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Badge" hint="Small label shown on product card (e.g. New, Sale, Hot, Popular)">
            <div className="flex gap-2 flex-wrap">
              {['New', 'Sale', 'Hot', 'Popular', 'Limited'].map((b) => (
                <label key={b} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="badge" value={b}
                    defaultChecked={product?.badge === b}
                    className="w-3.5 h-3.5 accent-gray-900" />
                  <span className="text-sm text-gray-700">{b}</span>
                </label>
              ))}
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="badge" value=""
                  defaultChecked={!product?.badge}
                  className="w-3.5 h-3.5 accent-gray-900" />
                <span className="text-sm text-gray-500">None</span>
              </label>
            </div>
          </Field>
        </div>
      </Section>

      {/* ── PRODUCT DETAILS ────────────────────────────────── */}
      <Section title="Product Details" subtitle="Compatibility, specs, and package contents">
        <div className="space-y-4">
          <Field label="Compatibility" hint="List devices this product works with">
            <input name="compatibility" defaultValue={product?.compatibility || ''}
              placeholder="e.g. iPhone 12/13/14/15, Samsung Galaxy S21+, MacBook Air M1/M2"
              className={inp} />
          </Field>

          <Field label="Specifications (JSON)" hint='Format: {"Output": "65W", "Connector": "USB-C"}'>
            <textarea name="specs_json" rows={5}
              defaultValue={product?.specs_json ? JSON.stringify(product.specs_json, null, 2) : ''}
              placeholder={'{\n  "Output": "65W",\n  "Connector": "USB-C",\n  "Input": "100-240V"\n}'}
              className={`${inp} font-mono text-xs resize-y`} />
          </Field>

          <Field label="What's in the Box" hint="One item per line">
            <textarea name="whats_in_box" rows={4}
              defaultValue={product?.whats_in_box || ''}
              placeholder={"1x Charger\n1x USB-C Cable\n1x User Manual"}
              className={`${inp} resize-y`} />
          </Field>
        </div>
      </Section>

      {/* ── VARIATIONS ─────────────────────────────────────── */}
      <Section title="Variations" subtitle="Add color, size, storage options etc." defaultOpen={false}>
        <div className="space-y-3">
          {variations.map((v, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  value={v.name}
                  onChange={(e) => setVariations(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                  placeholder="e.g. Color, Size, Storage"
                  className={inp}
                />
                <input
                  value={v.options}
                  onChange={(e) => setVariations(prev => prev.map((x, j) => j === i ? { ...x, options: e.target.value } : x))}
                  placeholder="e.g. Black, White, Red"
                  className={inp}
                />
              </div>
              <button
                type="button"
                onClick={() => setVariations(prev => prev.filter((_, j) => j !== i))}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors mt-0.5"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setVariations(prev => [...prev, { name: '', options: '' }])}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Variation
          </button>

          {variations.length > 0 && (
            <p className="text-xs text-gray-400">
              Tip: Separate options with commas — e.g. "Black, White, Blue"
            </p>
          )}
        </div>
      </Section>

      {/* ── VISIBILITY ─────────────────────────────────────── */}
      <Section title="Visibility & Display" subtitle="Control where and how this product appears">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
            <input type="checkbox" name="is_active" value="true"
              defaultChecked={product?.is_active ?? true}
              className="w-4 h-4 mt-0.5 rounded accent-gray-900" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Active (visible in store)</p>
              <p className="text-xs text-gray-500 mt-0.5">Product appears in shop, search, and category pages</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
            <input type="checkbox" name="is_featured" value="true"
              defaultChecked={product?.is_featured ?? false}
              className="w-4 h-4 mt-0.5 rounded accent-gray-900" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Featured Product</p>
              <p className="text-xs text-gray-500 mt-0.5">Appears in the Featured Products section on homepage</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
            <input type="checkbox" name="is_new_arrival" value="true"
              defaultChecked={product?.is_new_arrival ?? false}
              className="w-4 h-4 mt-0.5 rounded accent-gray-900" />
            <div>
              <p className="text-sm font-semibold text-gray-900">New Arrival</p>
              <p className="text-xs text-gray-500 mt-0.5">Appears in the New Arrivals section on homepage</p>
            </div>
          </label>
        </div>
      </Section>

      {/* ── SUBMIT ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-2">
        {images.some(img => img.uploading) && (
          <div className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 flex items-center gap-2 mb-2">
            <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Uploading images... please wait before saving.
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={loading || images.some(img => img.uploading)}
          className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full transition-colors disabled:opacity-50">
          {loading && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>

        <a href="/admin/products"
          className="text-sm font-semibold text-gray-400 hover:text-gray-700 px-4 py-3.5 rounded-full hover:bg-gray-100 transition-colors">
          Cancel
        </a>

        {isEdit && (
          <a href={`/product/${product!.slug}`} target="_blank" rel="noopener noreferrer"
            className="ml-auto text-xs font-semibold text-gray-400 hover:text-gray-700 underline underline-offset-4 transition-colors">
            View on store ↗
          </a>
        )}
      </div>
    </form>
  );
}
