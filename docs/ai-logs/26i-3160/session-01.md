> You are helping me build ONE page of a group website called "Recipe Jar" (theme: Recipe sharing hub). I am Member 3.
  This task is ONLY the Submit Recipe page. Do not build any other page.

  STACK RULES
  - HTML5 + CSS3 + vanilla JavaScript only. Bootstrap 5 via CDN is allowed. No jQuery, React or other libraries.
  - Use relative paths only. Use semantic tags (<header>, <nav>, <main>, <footer>, <section>, <form>).
  - Files to create: pages/submit3.html, css/submit3.css, js/submit3.js. Do not touch index.html or other members'
  files. If css/style.css already exists, link it and don't edit it.
  - No lorem ipsum. Add alt text to all images. Keep code simple, commented, and easy to explain.

  DESIGN SYSTEM (use as CSS variables in :root)
  --bg: #FAF7F2; --surface: #FFFFFF; --border: #E6E0D6; --primary: #2E5A44 (navbar, headings, active tab); --accent:
  #D96B43 (Submit/CTA buttons); --tag: #E9EFEA; --text: #1F2933.
  Body background is --bg, cards are white with a 1px --border and rounded corners.

  SHARED LAYOUT (must match the other pages)
  - Header/navbar: "Recipe Jar" logo text with a small jar icon on the left; links on the right: Home | Browse | Submit
  | Saved | Login. "Submit" is the active link. On mobile (<768px) collapse into a hamburger menu.
  - Footer: "About Recipe Jar | Contact Us | Privacy Policy" and "Copyright © Recipe Jar".

  PAGE LAYOUT (matches my hand-drawn prototype)
  Title: "Submit a Recipe". Desktop: two columns inside a white card.
  - Left column: label "Upload Cover Image", a square image preview box (placeholder with an X/image icon), a "Browse
  File" button (hidden file input), and a dark "Submit Recipe" button underneath. Make the Submit button terracotta
  (--accent).
  - Right column, stacked fields: Recipe Title (input), Description (textarea), Ingredients (textarea, placeholder "One
  ingredient per line"), Instructions (textarea).
  On mobile, stack everything in one column: Title, Ingredients, Steps/Instructions, image upload, Submit.

  FEATURES (all must work in depth)
  1. Forms & Input: live validation on blur and on submit. Required: title (min 3 chars), description, at least 1
  ingredient line, instructions, and a cover image. Invalid fields get a red border (#C0392B) and a red message under
  the field, e.g. "Description required!". The first invalid field gets focus. Errors clear as the user fixes them.
  2. Interaction: choosing an image shows a live preview inside the preview box. Reject non-image files and files over
  2MB with a clear error. A "Remove image" option resets it.
  3. State & Memory: save the draft form (without image) to localStorage as the user types so it survives a page
  reload. On successful submit, save the recipe object {id, title, description, ingredients[], instructions[], image
  (base64), date} into a "recipes" array in localStorage, then clear the draft.
  4. Data & Display: parse ingredients and instructions into arrays (split by new line, trim, remove empties). On
  success, render a summary of what was published from this data (not hardcoded HTML).
  5. Success state: after a valid submit, show an overlay/modal with a check-mark icon, "Recipe Published!", "Your
  <recipe title> is now live!" and a "View Recipe" button linking to cooking3.html. Closing it resets the form.
  6. Responsive & Accessible: proper <label for>, visible focus states, aria-live on error messages, good contrast,
  hamburger menu on mobile.
  Edge cases to handle: empty form, whitespace-only input, duplicate title (warn but allow), localStorage unavailable
  (try/catch and show a friendly message), very long titles (max 80 chars).

  AFTER BUILDING
  Give me a short list of each function in js/submit3.js and what it does, so I can explain it in my viva. Do not add
  features beyond what is listed.

○ Thought for 1m 3s (Element IDs in `js/submit3.js` require validation against `pages/submit3.html` to ensure prope...)
● Ran 2 commands (Get-ChildItem -Recurse -Name · Get-ChildItem -Force)
● Edited 3 files (submit3.html, submit3.css, submit3.js)
● Ran 3 commands (+1 · python -c " import r...: failed · $html = Get-Content ...) (ctrl+o to expand)

▸ Thought for 4s

  I have built the Submit a Recipe page for Recipe Jar across the three requested files:

  • pages/submit3.html
  • css/submit3.css
  • js/submit3.js

  (Note: css/style.css and index.html do not exist in the workspace yet, so neither was created or modified.)

  What Was Implemented

  • Shared Layout & Design System: Defined all :root CSS variables (--bg, --surface, --border, --primary, --accent, -
  -tag, --text), semantic <header>, <nav>, <main>, <section>, <form>, and <footer>, a jar SVG logo, active Submit
  link, mobile hamburger menu (<768px), and the shared footer links.
  • Responsive Form Layout: Desktop (>=768px) renders a two-column white card (cover image preview, Browse File,
  Remove image, and terracotta Submit Recipe button on the left; Title, Description, Ingredients, and Instructions on
  the right). Mobile stacks vertically in one column (Title -> Description -> Ingredients -> Instructions -> Upload
  Cover Image -> Submit Recipe).
  • Validation, Image Preview & Storage: Validates required fields on blur and submit (trims whitespace, enforces
  3–80 chars on title, rejects non-image files and images over 2MB, focuses the first invalid control, clears errors
  as you fix them, warns on duplicate titles without blocking, saves/restores drafts without the image, stores
  published recipes under "recipes" in localStorage with try/catch fallback messaging, and displays a dynamically
  rendered summary inside the "Recipe Published!" modal linking to cooking3.html).

  Verification

  • Verified via PowerShell script that every document.getElementById(...) call in js/submit3.js matches an id in
  pages/submit3.html (Missing IDs: empty).
  • node --check was not executed because node is not installed in this environment, and browser rendering was not
  run in this environment.
  ──────
  Functions in js/submit3.js (For Your Viva)

  1. toggleMobileMenu() — Toggles the .is-open class on #nav-menu and updates aria-expanded when the mobile hamburger
  button is clicked.
  2. showStorageAlert(message) — Reveals the #storage-alert banner with a friendly message if localStorage is
  disabled or full.
  3. safeReadStorage(key, fallback) — Reads and JSON.parses a key from localStorage inside a try/catch, returning
  fallback and calling showStorageAlert on error.
  4. safeWriteStorage(key, value) — Serializes and writes a value to localStorage inside a try/catch, returning
  true/false and showing an alert if saving fails.
  5. parseLines(text) — Splits a textarea string on newlines, trims each line, and filters out empty lines to produce
  the ingredients[] and instructions[] arrays.
  6. setFieldError(targetEl, errorEl, message) — Applies or clears .is-invalid (red border #C0392B), aria-invalid,
  and the error text underneath a field.
  7. checkDuplicateTitle() — Compares the trimmed title (case-insensitively) against existing recipes in localStorage
  and shows a non-blocking warning in #title-warning if a match exists.
  8. validateTitle() — Checks that the trimmed title is present, at least 3 characters, and at most 80 characters.
  9. validateDescription() — Checks that the trimmed description is non-empty.
  10. validateIngredients() — Uses parseLines to verify at least one non-empty ingredient line exists.
  11. validateInstructions() — Uses parseLines to verify at least one non-empty instruction line exists.
  12. validateImage() — Verifies that currentImageData holds a loaded base64 image.
  13. validateForm() — Runs all five field validators in order and moves focus to the first invalid control.
  14. saveDraft() — Saves the four text fields (excluding the image) under "recipeJarDraft" in localStorage as the
  user types.
  15. loadDraft() — Restores any saved draft fields from localStorage when the page loads and checks for duplicate
  titles.
  16. clearDraft() — Removes "recipeJarDraft" from localStorage after submission or reset.
  17. handleImageChange() — Validates the selected file's MIME type (image/*) and size (<= 2MB), then uses FileReader
  to convert it to base64 and display it in #image-preview.
  18. resetImagePreview() — Clears currentImageData, resets the file input, hides #image-preview and #remove-image-
  btn, and restores the placeholder icon.
  19. renderPublishedSummary(recipe) — Dynamically builds DOM nodes inside #published-summary from the saved recipe
  object (thumbnail, title, date, description, ingredient list, instruction steps).
  20. openSuccessModal(recipe) — Sets "Your <title> is now live!", calls renderPublishedSummary(recipe), displays
  #success-modal, and focuses the close button.
  21. closeSuccessModalAndReset() — Hides #success-modal and calls resetFormState().
  22. resetFormState() — Resets form inputs, clears the image preview, clears all field errors and duplicate warnings,
  and clears the saved draft.
  23. handleFormSubmit(event) — Prevents default form submission, runs validateForm(), creates the { id, title,
  description, ingredients, instructions, image, date } object, appends it to "recipes" in localStorage, clears the
  draft, and opens the success modal.
  24. initSubmitPage() — Attaches all event listeners (hamburger menu, blur/input validation and draft autosave,
  image browse/change/remove, form submit, modal close/Escape) and calls loadDraft() on DOMContentLoaded.
