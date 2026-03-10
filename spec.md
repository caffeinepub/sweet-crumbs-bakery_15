# Sweet Crumbs Bakery

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full public-facing bakery website with 8 sections
- Admin panel at /admin for managing menu items and daily specials
- Motoko backend storing menu items and daily specials

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- `MenuItem` type: id, name, category, description, price (Text), imageUrl, isActive
- `DailySpecial` type: id, name, description, imageUrl, isAvailable
- CRUD operations for menu items: addMenuItem, updateMenuItem, removeMenuItem, getMenuItems, getMenuItemsByCategory
- CRUD operations for daily specials: addDailySpecial, updateDailySpecial, removeDailySpecial, getDailySpecials
- Seed default menu items and specials on first load

### Frontend Pages
1. `/` - Public bakery website with:
   - Sticky nav bar with smooth scroll links
   - Hero section: full-width image, bakery name, tagline, 3 CTA buttons (WhatsApp, Zomato, Swiggy)
   - About section: storytelling text + cozy image + 3 highlight badges
   - Menu section: category tabs + grid of menu cards (image, name, desc, price)
   - Custom Cake Order Form: name, phone, flavor dropdown, size dropdown, image upload, date picker, message textarea, WhatsApp submit button
   - Daily Fresh Specials: warm-background card section
   - Customer Reviews: 3-4 testimonial cards with star ratings
   - Visit Us: map placeholder iframe, address, opening hours table
   - Footer: social icons, contact info, quick order buttons, copyright
2. `/admin` - Hidden admin panel:
   - Menu items management: list with edit/delete, add new item form (name, category, price, imageUrl, description)
   - Daily specials management: list with toggle availability, add/edit/delete
   - No authentication required (hidden by obscurity)

### Data
- Menu categories: Cakes, Pastries, Cupcakes, Artisan Breads, Cookies & Desserts
- Seed 2-3 items per category
- Seed 4 daily specials: Croissants, Brownies, Muffins, Pain au Chocolat
