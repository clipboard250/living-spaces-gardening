# Living Spaces Gardening

Native Florida landscape design, hardscaping, and habitat gardens in the Tampa Bay area. Family owned, Florida Master Naturalist-led. Founded 2018.

Live site: [livingspacesgardening.com](https://www.livingspacesgardening.com)

## About

Living Spaces Gardening is run by Kiamesha Wray and Justus Weisensel out of St. Petersburg, FL. Kiamesha is a certified Florida Master Naturalist and FANN credentialed native plant professional. Featured in Homes & Gardens, November 2025.

- **Phone:** 727-710-7400
- **Address:** 2621 4th Ave S, St. Petersburg, FL 33712
- **Sister site:** [livingrestorations.com](https://www.livingrestorations.com)

## Tech Stack

- **Hosting:** Vercel Pro
- **Domain:** GoDaddy (DNS pointed to Vercel)
- **Analytics:** Google Analytics (GA4)
- **Forms:** Formspree
- **Fonts:** Noto Sans (Google Fonts)

## File Structure

```
/
├── index.html                          Homepage
├── press.html                          Media coverage page
├── privacy.html                        Privacy policy
├── thank-you.html                      Form submission thank you page
├── for-hoa.html                        HOA services landing page
├── hoa-guide.html                      Gated HOA guide (delivery page)
├── garden-maintenance.html             Service detail page
│
├── service-areas/                      13 location pages (SEO/AEO)
│   ├── st-petersburg-fl.html
│   ├── gulfport-fl.html
│   ├── pinellas-park-fl.html
│   ├── largo-fl.html
│   ├── clearwater-fl.html
│   ├── dunedin-fl.html
│   ├── tarpon-springs-fl.html
│   ├── redington-beach-fl.html
│   ├── treasure-island-fl.html
│   ├── madeira-beach-fl.html
│   ├── tampa-fl.html
│   ├── south-tampa-fl.html
│   └── pinellas-county-fl.html
│
├── preview/                            Password-gated client preview pages
│   └── st-petersburg-fl.html
│
├── assets/                             Images, logos, gallery
│   └── gallery/                        WebP images, 1200x1200 at 75-80% quality
│
├── sitemap.xml                         Submitted to Google Search Console
├── robots.txt                          Allows all crawlers + points to sitemap
├── llms.txt                            For AI crawlers (ChatGPT, Perplexity, etc)
├── vercel.json                         Redirects + rewrites (clean URLs)
└── README.md                           This file
```

## URL Rewrites

Clean URLs without `.html` extensions are handled in `vercel.json`. For example:
- `/service-areas/st-petersburg-fl` → `/service-areas/st-petersburg-fl.html`
- `/hoa-guide` → `/hoa-guide.html`
- `/press` → `/press.html`

When adding a new page, add both a sitemap entry AND a rewrite in `vercel.json`.

## Forms

All forms submit to Formspree:
- **Client inquiries (homepage, location pages):** `https://formspree.io/f/xeerpvjv`
- **Internal (previews, surveys, approvals):** `https://formspree.io/f/mzdankle`

## SEO / AEO Implementation

Every page includes:
- JSON-LD schema (LocalBusiness, BreadcrumbList, FAQPage where applicable)
- Unique meta title and description
- Canonical URL
- Open Graph tags
- Semantic HTML (single H1, proper heading hierarchy)
- Mobile responsive
- Core Web Vitals passing

Location pages each include:
- City-specific LocalBusiness schema with geo coordinates
- FAQPage schema with 5 city-specific Q&A pairs
- BreadcrumbList schema
- Unique intro content and neighborhood lists per city
- Cross-linked Service Areas dropdown

## Google Business Profile

- **Address:** 2621 4th Ave S, St. Petersburg, FL 33712
- **Service areas:** St. Petersburg, Gulfport, Pinellas Park, Largo, Clearwater, Dunedin, Tarpon Springs, Redington Beach, Treasure Island, Madeira Beach, Tampa, South Tampa, Pinellas County, Hillsborough County

## Development

- **Developer:** Dayna Himot / Gofer Content
- **Contact:** info@gofercontent.com

## Brand

Brand book in project files. Key brand elements:
- **Colors:** terra #9e4732, teal #508e8a, mustard #c9802e, sand #f8f5eb, charcoal #3b3836, cocoa #63403c
- **Font:** Noto Sans
- **Voice:** warm, residential, honest. No jargon, no corporate copy.
- **Never use:** em-dashes, smart quotes, or accessibility overlay plugins.

## License

All content copyright Living Spaces Gardening. All rights reserved.
