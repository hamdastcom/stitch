# Hamdast Landing

Marketing site for [Hamdast](https://hamdast.com): a Persian-first AI platform with access to 22+ models such as Claude, GPT, and Gemini — without a VPN, billed in Tomans.

The site is RTL, written in Persian, and built with Next.js.

## Pages

- `/` — home (hero, how it works, features, characters, pricing, testimonials, FAQ)
- `/pricing` — plans, gem calculator, and comparison table
- `/faq` — full FAQ

The app itself lives at [app.hamdast.com](http://app.hamdast.com/).

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Vazirmatn (Google Fonts)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start the local server   |
| `npm run build` | Production build         |
| `npm run start` | Serve the production build |
| `npm run lint`  | Run ESLint               |

## Project structure

```text
app/
  page.tsx              Home page
  pricing/page.tsx      Pricing page
  faq/page.tsx          FAQ page
  layout.tsx            Root layout (RTL, metadata)
  _components/          Page sections
public/figma/           Brand and UI assets
```
