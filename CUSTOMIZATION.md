# Edmeca Academy Website - Customization Guide

Welcome to your new Edmeca Academy website! This guide will help you customize the colors and branding to match your existing brand.

## 🎨 Customizing Brand Colors

The website uses placeholder colors that you need to replace with your actual brand colors.

### Step 1: Update Color Variables

Open the file: `src/app/globals.css`

Find the `:root` section (around line 3) and replace these placeholder colors:

```css
:root {
  /* Edmeca Brand Colors - PLACEHOLDER: Replace with actual brand colors */
  --primary: #0066cc;        /* Primary blue - update this */
  --primary-dark: #004c99;   /* Darker shade of primary */
  --primary-light: #3385d6;  /* Lighter shade of primary */
  --secondary: #ff6b35;      /* Accent color - update this */
  --secondary-dark: #e55a2b; /* Darker shade of secondary */
  --accent: #ffd700;         /* Highlight color - update this */
}
```

### How to Get Your Color Codes:

1. **From your existing website:**
   - Right-click on an element with your brand color
   - Select "Inspect" or "Inspect Element"
   - Look for the color code in the CSS (usually starts with # or rgb)

2. **From your brand guidelines:**
   - Use the hex codes provided (e.g., #0066cc)
   - If you have RGB values, convert them to hex using an online converter

3. **From your logo:**
   - Use a color picker tool (like ColorZilla browser extension)
   - Click on your logo to extract the exact colors

### Example Color Update:

If your brand colors are:
- Primary: Blue (#1E5BA8)
- Secondary: Orange (#F47920)
- Accent: Gold (#C79A2E)

Update the CSS like this:

```css
:root {
  --primary: #1E5BA8;
  --primary-dark: #164578;
  --primary-light: #2a6bbf;
  --secondary: #F47920;
  --secondary-dark: #d6681a;
  --accent: #C79A2E;
}
```

**Tip:** For the `-dark` and `-light` variants, you can use online tools like:
- [Coolors.co](https://coolors.co) - Generate shades
- [Color Shades Generator](https://mdigi.tools/color-shades/)

## 🖼️ Adding Your Logo

### Step 1: Add Logo Files

1. Place your logo file(s) in: `public/images/logos/`
2. Recommended formats: PNG (with transparent background), SVG, or WebP
3. Name suggestions: `edmeca-logo.png`, `edmeca-logo-white.png` (for dark backgrounds)

### Step 2: Update the Header Component

Open the file: `src/components/layout/Header.tsx`

Find the logo section (around line 34) and replace:

```tsx
{/* Current placeholder logo */}
<div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
  E
</div>
```

With your actual logo:

```tsx
{/* Your actual logo */}
<Image
  src="/images/logos/edmeca-logo.png"
  alt="Edmeca Academy Logo"
  width={48}
  height={48}
  className="w-12 h-12"
/>
```

Don't forget to import Image at the top of the file:

```tsx
import Image from 'next/image';
```

### Step 3: Update the Footer Logo

Repeat the same process in: `src/components/layout/Footer.tsx` (around line 45)

## 📝 Customizing Content

### Update Contact Information

Edit: `src/components/sections/Contact.tsx`

Find and update (around line 61):

```tsx
const contactInfo = [
  {
    icon: '📍',
    title: 'Visit Us',
    details: ['YOUR ADDRESS', 'YOUR CITY', 'YOUR POSTAL CODE'],
  },
  {
    icon: '📞',
    title: 'Call Us',
    details: ['YOUR PHONE 1', 'YOUR PHONE 2', 'YOUR HOURS'],
  },
  {
    icon: '✉️',
    title: 'Email Us',
    details: ['YOUR EMAIL 1', 'YOUR EMAIL 2', 'YOUR EMAIL 3'],
  },
];
```

### Update Footer Contact Info

Edit: `src/components/layout/Footer.tsx`

Find and update the contact section (around line 119).

### Update Social Media Links

In both `Footer.tsx` and `Contact.tsx`, replace the `#` in social media links with your actual social media URLs:

```tsx
<a href="https://facebook.com/yourpage" ... >
<a href="https://twitter.com/yourhandle" ... >
<a href="https://instagram.com/yourprofile" ... >
<a href="https://linkedin.com/company/yourcompany" ... >
```

## 🚀 Testing Your Changes

After making customizations:

1. **Development Mode:**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 in your browser

2. **Production Build:**
   ```bash
   npm run build
   npm start
   ```

## 🎯 Additional Customizations

### Change Stats Numbers

Edit: `src/components/sections/Hero.tsx` (line 58)
- Update student count, success rate, and programs count

### Modify Programs/Courses

Edit: `src/components/sections/Programs.tsx` (line 27)
- Add, remove, or modify program offerings

### Update About Section

Edit: `src/components/sections/About.tsx`
- Customize mission, vision, and values

### Testimonials

Edit: `src/components/sections/WhyUs.tsx` (line 72)
- Add real testimonials from students, parents, or alumni

## 📱 Responsive Design

The website is fully responsive and will automatically adapt to:
- Mobile phones
- Tablets
- Desktops
- Large screens

No additional configuration needed!

## 🆘 Need Help?

If you encounter any issues:

1. Make sure you've saved all files after editing
2. Restart the development server (`Ctrl+C` then `npm run dev`)
3. Clear your browser cache
4. Check the browser console for errors (F12)

## 📦 Deployment

Once you're happy with your customizations:

```bash
npm run build
```

This creates an optimized production build in the `.next` folder, ready for deployment to platforms like:
- Vercel
- Netlify
- AWS
- Your own hosting server

---

**Next Steps:**
1. ✅ Update brand colors in `globals.css`
2. ✅ Add your logo to `public/images/logos/`
3. ✅ Update Header and Footer with your logo
4. ✅ Update all contact information
5. ✅ Add social media links
6. ✅ Customize content sections
7. ✅ Test thoroughly
8. ✅ Deploy!

Enjoy your new website! 🎉
