# Two Hundred Burger — Demo Website

A modern, mobile-first proposal website for **Two Hundred Burger**, a burger restaurant
in Amman, Jordan. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

> **Note:** This is a demo/proposal site, not the restaurant's official website yet.
> The footer and metadata reflect that until the business approves and launches it.

### Completed System Phases:
- **Phase 1**: Shopping cart
- **Phase 2**: Checkout + Supabase order storage
- **Phase 3**: Mock payment mode + Cash on Delivery
- **Phase 4**: Manual WhatsApp restaurant notification
- **Phase 5**: Password-protected kitchen dashboard
- **Phase 6**: Final QA, Polish, Demo Readiness, and Owner Presentation

---

## 1. Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + `tailwindcss-animate`
- **shadcn/ui**-style components (`Button`, `Input`, `Textarea` in `components/ui/`)
- **Framer Motion** for scroll/entrance animations
- **lucide-react** for icons

---

## 2. Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open http://localhost:3000
```

Requires Node.js 18.18+ (or 20+ recommended).

---

## 3. Deploy to Vercel

**Option A — via GitHub (recommended):**
1. Push this project to a new GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — click **Deploy**. No config needed.

**Option B — via Vercel CLI:**
```bash
npm i -g vercel
vercel
```

After deploying, update `siteConfig.url` in `lib/site-config.ts` to your real domain
(e.g. `https://twohundredburger.com`) so Open Graph / SEO tags are correct.

---

## 4. Where to Edit Content (everything in one file)

Almost all editable content lives in **`lib/site-config.ts`**:

| What to change | Where |
|---|---|
| Restaurant name, tagline | `siteConfig.name`, `siteConfig.tagline` |
| Phone number | `siteConfig.phoneDisplay` / `phoneHref` |
| WhatsApp number | `siteConfig.whatsappNumber` (currently `962790444939`, used across all "Order on WhatsApp" buttons) |
| Address & Google Maps embed | `siteConfig.address` |
| Opening hours | `siteConfig.hours` |
| Social media links | `siteConfig.social` |
| Menu items, descriptions, prices | `menuItems` array |
| Customer reviews | `reviews` array |

You should **not need to touch component files** (`components/*.tsx`) for routine
content updates — only for structural/design changes.

---

## 5. Images — What You Need to Add

All images live in `public/images/`. The code currently points to these filenames
(placeholders are referenced but the actual image files are **not included** — you
need to add real or licensed stock photos before launch):

| Filename | Used for | Recommended size |
|---|---|---|
| `hero-burger.jpg` | Hero section main photo | 1200×1500px (portrait) |
| `classic-burger.jpg` | Classic Burger menu card | 800×600px |
| `double-smash.jpg` | Double Smash Burger menu card | 800×600px |
| `crispy-chicken.jpg` | Crispy Chicken Burger menu card | 800×600px |
| `loaded-fries.jpg` | Loaded Fries menu card | 800×600px |
| `wings.jpg` | Chicken Wings menu card | 800×600px |
| `soft-drinks.jpg` | Soft Drinks menu card | 800×600px |
| `restaurant-interior.jpg` | About section | 1000×750px |
| `og-cover.jpg` | Social share preview (Open Graph/Twitter) | 1200×630px |
| `favicon.ico` | Browser tab icon | 32×32px (or 512×512 source) |

**Important:** Do not use photos scraped from Google Images, Instagram, Facebook,
Talabat, or any other source you don't have rights to. Options:
- Commission real food photography once the client approves.
- Use a licensed stock photo service (e.g. Unsplash for food photography that
  allows commercial use, or a paid stock library) as a temporary placeholder.
- Generate placeholder images with an AI image tool for the pitch, clearly
  understanding they'll be swapped for real photos before public launch.

All `<Image>` components already use `next/image` for optimization and have
descriptive `alt` text for SEO (e.g. *"Premium smash burger in Amman Jordan"*) —
you only need to drop in the correctly named files.

---

## 6. Arabic Language (Future)

The site ships in English but is structured to make an Arabic version straightforward:
- Text content is centralized in `lib/site-config.ts` and `menuItems`/`reviews` arrays.
- See the comment block in `app/layout.tsx` for the recommended approach
  (`app/[locale]/layout.tsx`, `dir="rtl"`, and an Arabic font pairing).

---

## 7. Launch & Demo Documentation

Check the root directory for additional files related to launching and demoing the project:
- **`TEST_DATA_CLEANUP.md`**: How to safely delete all demo orders from the Supabase database before launching.
- **`DEPLOYMENT_CHECKLIST.md`**: Vercel deployment steps and required environment variables.
- **`OWNER_DEMO_SCRIPT.md`**: A presentation script designed for pitching this software to the restaurant owner.

---

## 8. Project Structure

```
app/
  layout.tsx        → fonts, global <head> SEO metadata
  page.tsx           → assembles all sections + JSON-LD structured data
  globals.css        → Tailwind base styles, ticket-card + eyebrow utilities
components/
  Header.tsx, Hero.tsx, Menu.tsx, About.tsx, WhyChooseUs.tsx,
  Reviews.tsx, Location.tsx, Franchise.tsx, Contact.tsx, Footer.tsx
  WhatsAppFloatButton.tsx, FadeIn.tsx
  ui/                → button.tsx, input.tsx, textarea.tsx (shadcn-style)
lib/
  site-config.ts      → ALL editable content (menu, prices, contact, hours)
  utils.ts            → cn() class-merging helper
public/images/         → drop real photos here (see table above)
```
