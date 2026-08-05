# CycleNest Template

A premium HTML/CSS/JS template for a Bicycle Shop & Accessories Store, featuring a high-motion, sporty visual language.

## Pages Overview

- `index.html`: Main Homepage (Energetic hero, categories, services highlight).
- `home2.html`: Alternative Homepage (Split-screen shop/service layout).
- `bicycles.html`: Bicycles showcase with category filtering tabs.
- `accessories.html`: Grid of accessories and spare parts.
- `services.html`: Repair & servicing details page.
- `contact.html`: Contact info and the main **Appointment Booking Form**.
- `about.html`: Company story and team mechanics.
- `blog.html` & `blog-single.html`: Cycling tips, guides, and single article layout.
- `login.html` & `register.html`: Centered authentication pages.
- `404.html`: Custom error page.
- `coming-soon.html`: Countdown timer with email capture.

## File Structure

```
cyclenest/
├── index.html
├── home2.html
├── bicycles.html
├── accessories.html
├── services.html
├── contact.html
├── about.html
├── blog.html
├── blog-single.html
├── login.html
├── register.html
├── 404.html
├── coming-soon.html
├── README.md
└── assets/
    ├── css/
    │   ├── style.css    (Design system, global styles, tokens)
    │   └── rtl.css      (RTL overrides)
    └── js/
        ├── main.js      (Sticky nav, mobile drawer, theme toggle, animations)
        └── booking.js   (Form validation logic for the booking form)
```

## Integration Placeholders

1. **Appointment Booking Form (`contact.html`)**
   - The form uses `action="https://formspree.io/f/YOUR_FORM_ID"`.
   - Client-side validation is active via `assets/js/booking.js`. Update the URL to your form handler (Formspree, Netlify Forms, Formcarry).

2. **Newsletter (`footer` across pages)**
   - Includes a visual form with an email input. The actual Mailchimp embed code `<!-- Mailchimp embed code comment -->` is commented out.

3. **Map (`contact.html`)**
   - A placeholder `div` is present. Replace the comment `<!-- <iframe src="YOUR_GOOGLE_MAPS_EMBED_URL" ...></iframe> -->` with an actual Google Maps embed iframe.

4. **Analytics (`footer` across pages)**
   - Look for the `<!-- GA_TAG -->` comment just above the closing `</footer>` or `</body>` tag to insert your Google Analytics script.

## Theme & RTL Support
- **Dark Mode**: Persists via `localStorage` (key: `theme`). Default is `prefers-color-scheme`.
- **RTL**: Persists via `localStorage` (key: `rtl`). Toggle adds `dir="rtl"` to the `<html>` element.

## Design System
- **Colors**: Racing Red (`#e63946`), Charcoal (`#1a1a1a`), Cyan (`#00f0ff`).
- **Typography**: Outfit (Headings), Manrope (Body).
- **Icons**: Phosphor Icons (loaded via CDN).
