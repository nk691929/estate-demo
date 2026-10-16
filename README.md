# Prime Estates: Real Estate Website (Demo MVP)

A fast, SEO-ready real estate website built with Next.js. It runs on mock data so it can be shown to clients before a backend exists.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- lucide-react icons
- Mock data layer (swap for a database later)

## Pages

| Route | Purpose |
|---|---|
| `/` | Home: hero, search, featured properties |
| `/properties` | Listings with filters kept in the URL |
| `/properties/[slug]` | Property detail, gallery, WhatsApp and inquiry form |
| `/agents` | Agent profiles |
| `/about` | About the agency |
| `/contact` | Contact details and message form |
| `/sitemap.xml`, `/robots.txt` | SEO files, generated from the data |

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Before deploying, check the production build:

```bash
npm run build
npm run start
```

## Project structure

```
app/            Routing only (pages, layout, SEO files)
components/     Shared UI (navbar, footer, mobile menu)
features/       Business logic, grouped by feature
  properties/   types, mock data, service, card, search form, results
  agents/       types, mock data, service, card
  inquiries/    server actions and forms
  home/         home page sections
config/         site.ts: name, contact details, URL
lib/            Small helpers (price and size formatting)
public/images/  Photos used by the site
```

The rule: **pages never read data directly.** They call a service, and the service reads the data. Moving from mock data to a real database means changing only the files in `services/`.

## Rebranding for a new client

1. Edit `config/site.ts` (name, tagline, phone, WhatsApp, email, address, URL).
2. Replace the photos in `public/images/` and update the paths in `features/properties/data/mock-properties.ts` and `features/agents/data/mock-agents.ts`.
3. Update the sample numbers in `app/about/page.tsx`.

## Current limitations (demo)

- Properties and agents come from local mock files.
- Inquiry and contact forms run as server actions that **log to the server console**. They do not save or email anything yet.
- Photos are stock images and must be replaced with the client's own.

## Planned next phase

- Database (Supabase or Firebase) for properties, agents and inquiries
- Admin / CRM dashboard to manage listings and leads
- Email or WhatsApp notification for new inquiries
- Structured data (JSON-LD) for property pages