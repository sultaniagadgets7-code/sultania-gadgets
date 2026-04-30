# How to Add Logo to Your Website

## 📋 Quick Guide

### Step 1: Prepare Your Logo

Create your logo in these formats:
- **logo.png** or **logo.svg** (main logo - transparent background)
- **logo-white.png** or **logo-white.svg** (white version for dark backgrounds)
- Recommended size: 180px wide × 40-50px tall
- Format: PNG with transparency or SVG

### Step 2: Add Logo Files

Place your logo files in the `/public` folder:
```
sultania-gadgets/public/
  ├── logo.png          (main logo)
  ├── logo-white.png    (white version for footer)
  └── logo.svg          (optional SVG version)
```

### Step 3: Logo is Already Configured!

I've already updated your code to support logos. The navbar will automatically:
- Show your logo image if `logo.png` or `logo.svg` exists
- Fall back to "SULTANIA" text if no logo file is found
- Use `logo-white.png` in the footer

## 🎨 Logo Design Tips

### Size Guidelines:
- **Width:** 140-180px (desktop)
- **Height:** 35-50px
- **Mobile:** Will auto-scale to fit

### Design Best Practices:
1. Keep it simple and recognizable
2. Use transparent background (PNG)
3. Ensure it's readable at small sizes
4. Test on both light and dark backgrounds

### Color Recommendations:
- Primary logo: Use your brand red (#e01e1e)
- White version: Pure white (#ffffff) for footer
- Ensure good contrast

## 🛠️ Creating Your Logo

### Option 1: Use Canva (Free & Easy)
1. Go to https://www.canva.com/
2. Search for "Logo" templates
3. Customize with your brand name
4. Download as PNG (transparent background)

### Option 2: Use Figma (Professional)
1. Go to https://www.figma.com/
2. Create new design (180 × 45px)
3. Design your logo
4. Export as PNG or SVG

### Option 3: Hire a Designer
- Fiverr: $5-50
- Upwork: $50-500
- 99designs: $299+

## 📁 File Structure

```
public/
├── logo.png              ← Main logo (navbar)
├── logo-white.png        ← White version (footer)
├── logo.svg              ← Optional SVG version
├── favicon.ico           ← Browser tab icon
├── apple-touch-icon.png  ← iOS home screen
└── og-image.jpg          ← Social media preview
```

## 🔧 Advanced: Custom Logo Sizes

If you want different logo sizes, edit the navbar component:

```typescript
// In src/components/layout/Navbar.tsx
<Image 
  src="/logo.png" 
  alt="Sultania Gadgets" 
  width={160}    // Change this
  height={40}    // Change this
  priority 
/>
```

## ✅ Testing Your Logo

After adding your logo:

1. **Check navbar:**
   - Visit homepage
   - Logo should appear in top-left
   - Should be clickable (links to home)

2. **Check footer:**
   - Scroll to bottom
   - White logo should appear
   - Should match navbar logo style

3. **Check mobile:**
   - Open on phone
   - Logo should scale properly
   - Should not overlap menu button

4. **Check all pages:**
   - Product pages
   - Category pages
   - Checkout page

## 🎯 Quick Start (No Logo Yet?)

If you don't have a logo yet, the site will show "SULTANIA" text (already looks great!).

To create a simple text-based logo:
1. Use a logo generator: https://www.namecheap.com/logo-maker/
2. Enter "SULTANIA GADGETS"
3. Choose a style
4. Download PNG
5. Add to `/public/logo.png`

## 🚀 After Adding Logo

Once you add your logo files:
1. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)
2. Logo should appear automatically
3. No code changes needed!

## 📱 Logo Specifications

### Navbar Logo:
- Format: PNG or SVG
- Size: 160×40px (recommended)
- Background: Transparent
- Color: Your brand color

### Footer Logo:
- Format: PNG or SVG
- Size: 160×40px (recommended)
- Background: Transparent
- Color: White (#ffffff)

### Favicon (Browser Tab):
- Format: ICO or PNG
- Size: 32×32px
- File: `favicon.ico`

## 💡 Pro Tips

1. **Use SVG when possible** - scales perfectly at any size
2. **Keep file size small** - under 50KB for fast loading
3. **Test on mobile** - ensure it's readable on small screens
4. **Match your brand** - use consistent colors and style
5. **Add alt text** - already configured for accessibility

## 🔍 Troubleshooting

### Logo not showing?
- Check file name: must be exactly `logo.png` or `logo.svg`
- Check file location: must be in `/public` folder
- Clear browser cache: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Check file size: should be under 100KB

### Logo too big/small?
- Edit the width/height in Navbar.tsx
- Recommended: 140-180px wide

### Logo blurry?
- Use higher resolution (2x size)
- Use SVG format instead of PNG
- Ensure PNG is at least 300 DPI

## 📞 Need Help?

If you need help creating or adding your logo:
1. Share your logo file
2. I'll help you add it to the website
3. We'll test it together

---

**Current Status:** Logo support is ready! Just add your logo files to `/public` folder.
