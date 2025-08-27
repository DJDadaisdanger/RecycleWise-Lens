# **App Name**: RecycleWise Lens

## Core Features:

- Image Capture: User-friendly camera and upload interface for quick image capture of waste items.
- Image Recognition: On-device AI model (using TF.js or ONNX Runtime Web) to identify waste items such as PET bottles, paper cups, batteries, etc. Includes fallback OCR via Tesseract.js for reading labels or markings.
- Location Detection: Automatic geolocation to detect applicable city recycling rules, with a manual dropdown for rule override.
- Rules Engine: Client-side matching engine mapping identified item + location to the correct disposal action: Recycle, Landfill, Compost, or Special Drop-off.
- Result Display: Clear card-based UI displaying the disposal action, preparation instructions (e.g., rinse, remove lid), notes on exceptions, and a source quote with a clickable link to the official municipal recycling guidelines.
- City Rule Comparison: Interactive toggle to view how disposal rules vary across different cities for the same item. The display shows the detected item, matched rule (with action, prep, exceptions), explanatory logic, and city badge for clarity.
- Impact Dashboard: Displays simple counters on how many items correctly sorted, estimated waste diverted, and environmental benefits.
- Feedback Button: Users can report rule inaccuracies or suggest new city rules, supporting community-driven improvements.
- Saved History: Allow users to save a list of scanned items for later reference and tracking.

## Style Guidelines:

- Bright Blue (#29ABE2) — same saturated blue for key UI elements like buttons and highlights, ensuring vibrancy on dark backgrounds.
- Dark Slate Gray (#121212) — deep, neutral dark background that reduces eye strain and highlights foreground content.
- Charcoal Gray (#1E1E1E) — for cards, modals, and panels to create clear separation with subtle elevation.
- Vibrant Orange (#FF8C00) — for critical alerts, buttons, and notifications to draw immediate focus.
- Primary text: Soft White (#E0E0E0) for readability on dark backgrounds.
- Secondary text: Cool Gray (#A0A0A0) for less emphasized info like exceptions or citations.
- Continue using 'Space Grotesk' for headlines and 'Inter' for body, both rendered in light color shades for contrast.
- Use bright or white icons with slight glow or drop shadow for clarity and legibility.
- Subtle fade-ins and slide effects that play well on dark surfaces, avoiding glaring flashes.
- Dark Mode: Implemented for user preference, offering a visually comfortable experience in low-light environments.