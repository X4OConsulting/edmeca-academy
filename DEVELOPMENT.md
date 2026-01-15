# Edmeca Academy - Development Guide

## 🚀 Getting Started

### On Your Mac

```bash
# Clone the repository
git clone git@github.com:X4OConsulting/edmeca-academy.git
cd edmeca-academy

# Checkout the development branch
git checkout claude/rebuild-edmeca-website-R2IlP

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 to see your website!

---

## 📝 Daily Workflow

### 1. Start Your Day

```bash
# Pull latest changes
git pull origin claude/rebuild-edmeca-website-R2IlP

# Start development
npm run dev
```

### 2. Make Changes

- Edit files in VS Code or your preferred editor
- Changes auto-reload in browser
- Test thoroughly

### 3. Save Your Work

```bash
# Check what changed
git status

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Your change description"

# Push to GitHub
git push origin claude/rebuild-edmeca-website-R2IlP
```

---

## 🔄 Syncing Between Mac and Server

### Changes on Mac → Server

```bash
# On Mac: Push changes
git push origin claude/rebuild-edmeca-website-R2IlP

# On Server: Pull changes
git pull origin claude/rebuild-edmeca-website-R2IlP
```

### Changes on Server → Mac

```bash
# On Mac: Pull changes
git pull origin claude/rebuild-edmeca-website-R2IlP

# Update dependencies if needed
npm install
```

---

## 🎨 Customization Checklist

- [ ] Update brand colors in `src/app/globals.css`
- [ ] Add logo to `public/images/logos/`
- [ ] Update Header logo in `src/components/layout/Header.tsx`
- [ ] Update Footer logo in `src/components/layout/Footer.tsx`
- [ ] Update contact info in `src/components/sections/Contact.tsx`
- [ ] Update footer contact in `src/components/layout/Footer.tsx`
- [ ] Add social media links
- [ ] Update testimonials in `src/components/sections/WhyUs.tsx`
- [ ] Customize program offerings in `src/components/sections/Programs.tsx`

---

## 🛠️ Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Run production build

# Git
git status           # Check changes
git log --oneline    # View commit history
git branch           # List branches
git checkout -b feature/name  # Create new branch

# Troubleshooting
rm -rf node_modules  # Remove dependencies
npm install          # Reinstall dependencies
rm -rf .next         # Clear build cache
```

---

## 📦 Project Structure

```
edmeca-academy/
├── src/
│   ├── app/
│   │   ├── globals.css       # 🎨 Brand colors here
│   │   ├── layout.tsx        # Main layout
│   │   └── page.tsx          # Home page
│   └── components/
│       ├── layout/
│       │   ├── Header.tsx    # Navigation
│       │   └── Footer.tsx    # Footer
│       └── sections/
│           ├── Hero.tsx      # Landing section
│           ├── About.tsx     # About section
│           ├── Programs.tsx  # Programs showcase
│           ├── WhyUs.tsx     # Features & testimonials
│           └── Contact.tsx   # Contact form
├── public/              # Static assets
├── package.json         # Dependencies
└── next.config.ts       # Next.js config
```

---

## 🆘 Need Help?

- **Customization Guide:** See `CUSTOMIZATION.md`
- **GitHub Issues:** Report bugs or request features
- **Documentation:** https://nextjs.org/docs

---

**Happy Coding! 🎉**
