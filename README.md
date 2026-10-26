# Sunyani Connect — Version 2

Open **index.html** in your browser. All project pages must remain in the same folder.

Pages: index.html (homepage), discover.html (directory), categories.html (all industry categories), map.html (place selector + Google Maps search preview), about.html (mission), list.html (local draft form). Navigation from the homepage opens separate browser tabs. Browser pop-up blockers may prevent scripted new tabs from buttons; links work normally.

**Data limitation:** Seed listings are researched examples, not a comprehensive registry of all Sunyani institutions. Maps are name-based searches, *not verified coordinates or simultaneous map pins*. Initial category images are illustrative stock photography; Golden Tulip image is the user upload; UENR image is linked from Wikimedia Commons, subject to network availability.

**Form limitation:** form submissions are stored in localStorage on the current browser only. No backend, public publication, logins or moderation is implemented. Online images and maps require internet.

Sources used for new directory records: https://www.gibagh.org/members-ghana-independent-broadcasters-association/ ; https://schoolregistryghana.com/cities/sunyani ; https://cdsunyani.org/cds-support-education/ ; https://www.ghanabusinessweb.com/sunyani ; https://www.cybo.com/GH/sunyani/media/ ; https://www.ghanayello.com/category/printing/city:Sunyani ; https://www.gtec.edu.gh/ . Verify individual listings before launch.

# SUNYANI CONNECT — website pilot

A responsive, working, **static** directory prototype for businesses in Sunyani, Ghana.

## Run on your Windows PC

1. Unzip `sunyani-connect.zip` into `C:\Users\wiseg\Desktop\SUNYANI\sunyani-connect`.
2. Open `index.html` in Chrome or Edge. No npm, API keys, or internet connection is required for the site's core functions (Google Fonts and Google Maps links need internet access).
3. Alternatively, open the folder in VS Code and run with the **Live Server** extension.
4. To change the featured image, replace `assets/golden-tulip-facade.png`, keeping the same filename. Your supplied image is already included.

## What's working

- Responsive landing page with your real uploaded Sunyani hotel image
- Curated local directory, keyword search, category and area filters, sorting
- Save/unsave favorites in browser localStorage
- Click-to-call and Google Maps directions where details are present
- Business submission form, saved only in the current browser's localStorage
- Mobile navigation, semantic page structure, keyboard-friendly form controls

## Important limitations

**This is an interactive front-end MVP, not a live multi-user platform.** Entries gathered from public search and official sites are not claimed as business-owner verified. Public data can become outdated. The submission form does not broadcast entries or send them to an administrator; browser data is never synced between users. No sign-in, moderation, payments, messaging, analytics, or production database yet. Do not advertise this as a fully launched service until those components exist.

## Project roadmap

**Phase 2: Real backend** — Next.js + TypeScript, PostgreSQL/Supabase, user accounts, business-claim workflow, admin review queue, image uploads, production maps, normalized categories, rate limits, audit log, consent/privacy policy, and verified business contact details.

**Phase 3: Commerce** — Mobile Money payment integration using an approved Ghanaian payment provider, featured listings, subscription plans, inquiry/booking request flow, moderation dashboard, events and jobs.

**Phase 4: Scale** — Business owner dashboards, merchant insights, multilingual support where appropriate, SEO category/location pages, public API, automated backups, uptime monitoring.

## Suggested data schema

- businesses: id, owner_id, name, slug, category_id, description, address, area, ghana_post_gps, lat, lng, phone, website, status, verification_status, created_at, updated_at
- categories: id, slug, name, icon
- users: id, display_name, email, role
- submissions: id, business_id, submitted_by, status, review_notes
- media: id, business_id, storage_path, attribution, rights_status
- leads: id, business_id, contact_method, timestamp (with privacy controls)

## Sources consulted for seed listings

- https://brcc.gov.gh/economic-activities/
- https://www.sma.gov.gh/
- https://sth.gov.gh/services
- https://cdsunyani.org/institutions-services/
- https://www.ghanabusinessweb.com/sunyani
- Public local-business listings for details of other individual businesses

## Asset rights

The included photo was supplied by the project owner. Confirm that you have permission to display it publicly before hosting the site; do not treat the photo as proof that a particular hotel endorses this project.


## Version 3 additions
- The basic school records are now in SEED, not accidentally in CATEGORIES. Category cards therefore always have defined names and icons.
- Creator credit and direct phone, WhatsApp and social links appear across all six pages.
- Separate WhatsApp chat links use Ghana international prefix +233 without the domestic leading 0.
- Subpage navigation is accessible on mobile via a horizontally scrollable menu.
- The site remains a static/browser-only demonstration; user submissions are not public and no database is connected.


## Version 4 - embedded hero photograph

The hotel hero photo is now embedded directly in `styles.css` (WebP data URI). The `assets` directory is no longer required for this background photograph. To update GitHub Pages, upload **styles.css** to your repository root and replace the existing file. You can also upload all the files in this release. Do not upload the ZIP itself.
