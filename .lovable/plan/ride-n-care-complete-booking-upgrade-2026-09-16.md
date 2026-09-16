# Ride N Care Complete Booking Upgrade

## Goal
Upgrade the existing booking experience to closely follow the uploaded mobile reference while preserving Ride N Care’s current branding, pages, SEO, and desktop design.

## Booking experience
- Replace the current generic selector with the reference-style stepped journey: Vehicle → Power → Brand → Model → CC → Package → What’s Included → Location → Customer Details → Payment → Confirmation.
- Use compact pill controls, searchable/selectable brand and model lists, logo-led brand cards, service cards, clear back navigation, progress, and mobile-first spacing inspired by the video.
- Add “Use Current Location” with a clear fallback to manual address entry.
- Keep car prices as “Price on Request” unless verified pricing already exists.

## Unified vehicle and pricing data
- Create one central bike catalogue containing major Indian brands, models, engine CC, and lightweight brand artwork where available.
- Automatically derive the exact CC tier from the selected model; retain a manual CC fallback for “Other model.”
- Replace bike service pricing with the six exact CC bands and four services supplied:
  - Up to 199cc
  - 200–249cc
  - 250–400cc
  - 401–500cc
  - 501–800cc
  - 801cc and above
- Keep existing valid inclusion lists, map them consistently to the new services, and make every website surface read from the same source.
- Audit all source and public content for stale prices, conflicting inclusions, and every variation of “Up to 200cc.”

## Persistent bookings and IDs
- Add secure booking and booking-status-history tables in Lovable Cloud.
- Generate unique daily IDs atomically in the database using `RNC-YYYYMMDD-0001` format.
- Store the complete vehicle, package, inclusion snapshot, price, customer/location details, payment choice/status, booking status, and timestamps.
- Allow anonymous booking creation and narrowly scoped tracking by exact Booking ID plus validated mobile number; keep customer records otherwise private.

## Payment and confirmation
- Add Pay Later as a complete booking path with payment status `pending`.
- Connect Pay Now to the project’s configured online payment provider; never mark payment successful until provider confirmation.
- Show a final confirmation with Booking ID, full booking summary, payment status, status timeline, WhatsApp confirmation, copy, and call fallback.

## Customer tracking and admin
- Add a public “Track Booking” page using Booking ID and mobile number.
- Add a protected admin bookings page with Booking ID search, customer/vehicle/service/location/payment details, status updates, and immutable status history.
- Use server-side admin role checks; no client-side admin trust.

## AI booking
- Keep natural-language collection, but make AI use the exact shared catalogue and pricing.
- Ask only for missing details, show inclusions and price, require an explicit final confirmation, then create the booking through the same secure booking function as the normal flow.
- Use the required Lovable AI model and visibly surface gateway errors without inventing prices or booking IDs.

## Validation
- Test exact CC boundary mapping, mobile validation, unique booking creation, tracking, status changes, Pay Later, and the configured Pay Now handoff.
- Test the full flow at 360, 375, 390, 414, and 430px widths plus desktop, checking overflow, tap targets, dialogs, and confirmation screens.
- Re-scan the whole project for old prices and forbidden “Up to 200cc” wording.
