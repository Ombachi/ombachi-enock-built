# Role-led hero, complete page metadata, thank-you page, and cookie consent

## Scope

### 1. Rebuild the home hero around four professional roles

- Keep the four existing hero photographs and pair each one with a role:
  - Medical Laboratory Scientist
  - Techie
  - Entrepreneur
  - Public Leader & Advocate
- Add one original, first-person guiding quotation per role so no quote is falsely attributed to another person.
- Make the changing role the home page’s single accessible `<h1>`: a crisp uppercase role label followed by the quotation in Playfair Display using the requested editorial sizing and italic serif treatment.
- Place the text above the photograph with a readable semantic overlay, preserving the existing image crossfade and navigation dots.
- Improve the slider controls with current-slide accessibility state, descriptive labels, keyboard-safe buttons, automatic rotation, hover/focus pause, and reduced-motion support.
- Keep the image-to-role pairing synchronized at every transition and ensure the copy remains readable on mobile and desktop.

### 2. Complete route-specific metadata

- Add home-page title, description, canonical URL, and matching Open Graph URL/title/description through the existing head-management system.
- Add project-specific title, description, canonical URL, and Open Graph metadata to every `/work/:slug` page; use a noindex title/description for an unknown project.
- Add private/admin metadata to `/admin`, including `noindex`.
- Add a dedicated title, description, canonical URL, Open Graph metadata, and `noindex` to the 404 page.
- Add missing page-specific descriptions to checkout and account; retain the cart description that is already present.
- Keep all canonical and Open Graph URLs self-referencing under `https://ombachi-enock-built.lovable.app`.

### 3. Add a dedicated thank-you journey

- Create `/thank-you` with a clear confirmation, next-step links back to selected work and publications, page-specific metadata, and `noindex`.
- After a successful contact submission, send visitors to `/thank-you` instead of showing the temporary in-form confirmation.
- Preserve the existing sending state and leave failed submissions on the form.

### 4. Add cookie consent

- Add an unobtrusive, accessible bottom banner explaining first-party visitor measurement.
- Provide “Accept” and “Decline” actions, persist the choice in the browser, and allow the banner to disappear after selection.
- Gate first-party analytics until consent is accepted; essential cart, account, and security storage remain unaffected.
- Add a footer control to reopen cookie preferences so consent can be changed later.

## Technical details

- Use the existing semantic color tokens, Button component, Helmet provider, router, image assets, and typography.
- Create small focused components for cookie consent and the thank-you page, then register the new route in the main router.
- Update the analytics hook to read the stored consent state and respond when the user changes it.
- Add one architecture note documenting consent-gated analytics.

## Verification

- Confirm the home page has exactly one `<h1>` and that role, quote, and image change together.
- Check desktop and mobile hero layouts, slider controls, reduced-motion behavior, and cookie banner keyboard access.
- Submit the contact form through its successful path and verify `/thank-you` renders.
- Visit home, every project type, cart, checkout, account, admin, thank-you, and an unknown route; verify each document title and description.
- Confirm analytics requests do not run before acceptance and do run after acceptance.
- Check the final preview build and runtime logs.
