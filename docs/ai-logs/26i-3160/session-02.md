You are helping me build ONE page of a group website called "Recipe Jar" (theme: Recipe sharing hub). I am Member 3.
  This task is ONLY the Cooking Mode page. Do not build any other page and do not edit pages/submit3.html, index.html
  or other members' files.

  STACK RULES
  - HTML5 + CSS3 + vanilla JavaScript only. Bootstrap 5 via CDN is allowed. No jQuery, React or other libraries.
  - Relative paths only. Semantic tags (<header>, <nav>, <main>, <footer>, <section>).
  - Create: pages/cooking3.html, css/cooking3.css, js/cooking3.js.
  - Copy the header/navbar/footer markup and the :root CSS variables from pages/submit3.html so the look matches
  exactly. "Submit" is not active here, so no nav link is highlighted.
  - No lorem ipsum. Alt text on all images. Simple, commented code I can explain in a viva.

  DESIGN SYSTEM
  --bg: #FAF7F2; --surface: #FFFFFF; --border: #E6E0D6; --primary: #2E5A44 (headings, progress bar, nav); --accent:
  #D96B43 (main buttons); --tag: #E9EFEA; --text: #1F2933. White cards with 1px --border and rounded corners.

  PAGE LAYOUT (matches my hand-drawn prototype)
  Title: "Cooking Mode: <recipe title>".
  Desktop: two columns inside a white card.
  - Left column: heading "Step-by-Step cooking" and the current step text (e.g. "1. Heat oil in a karahi over medium
  flame. Add chicken and fry until golden brown.").
  - Right column: "Timer: 15:00" in large text, three buttons Start | Pause | Reset, then "Progress: 1 of 5 Steps" with
  a progress bar underneath.
  - Bottom row: "< Previous Step" and "Next Step >" buttons (Next uses --accent).
  Mobile (<768px): single column, hamburger menu, in this order: "Cooking: <title>", step text, step image (with
  placeholder if none), big timer "15:00", full-width "Next Step" button, with Previous Step below it and the progress
  bar.

  DATA
  - Default recipe hardcoded as a JS array of step objects in js/cooking3.js: Chicken Karahi, 5 steps, each {text,
  minutes} (e.g. fry chicken 15 min, add tomatoes, add spices, simmer, garnish).
  - If localStorage has a "recipes" array (saved by the Submit page with fields id, title, description, ingredients[],
  instructions[], image), and the URL has ?id=<id>, load that recipe instead. Its instructions[] become the steps
  (default 10 minutes each, or parse a number like "15 minutes" from the step text if present). Show its saved image as
  the step image. If the id is not found, fall back to the default recipe and show a small notice.

  FEATURES (all must work in depth)
  1. Data & Display: steps, title and step count are rendered by JavaScript from the data, not hardcoded in HTML.
  2. Interaction: Previous/Next change the step, update the step text, progress text ("Progress: 2 of 5 Steps") and
  progress bar width. Previous is disabled on step 1. On the last step, Next becomes "Finish Cooking" and shows a
  "Recipe complete, enjoy your meal!" message.
  3. Logic & Calculation: countdown timer per step. Each step loads its own duration. Start begins counting down every
  second (mm:ss), Pause freezes it, Reset restores the step's full time. Changing steps stops the timer and loads the
  new step's time. At 00:00 stop the timer, show "Time's up!" and play a short beep (Web Audio API, wrapped in
  try/catch). Prevent multiple intervals from stacking if Start is clicked repeatedly.
  4. State & Memory: save current step index and recipe id to localStorage so a reload returns to the same step. Add a
  "Restart" link that clears this.
  5. Responsive & Accessible: aria-live on the timer and progress text, visible focus states, buttons usable by
  keyboard, good contrast, hamburger menu on mobile.
  Edge cases: no recipe data, empty instructions array, localStorage unavailable (try/catch with a friendly message),
  step with no duration, rapid button clicking.

  AFTER BUILDING
  Give me a short list of each function in js/cooking3.js and what it does, so I can explain it in my viva. Do not add
  features beyond what is listed.

○ Thought for 31.5s (File generation scope must remain strictly bound to designated targets without altering extern...)
● Explored 2 files (submit3.html, submit3.css)
● Edited 3 files (cooking3.html, cooking3.css, cooking3.js)
● Ran ($html = Get-Content 'pages/cooking3.html' -Raw; $js = Get-Content 'js/cooking3.js' -Raw...) (ctrl+o to expand)

  I have built the Cooking Mode page for Recipe Jar without modifying pages/submit3.html or any other files:

  • pages/cooking3.html
  • css/cooking3.css
  • js/cooking3.js

  What Was Implemented

  • Shared Header, Footer & Design System: Copied the navbar, footer, mobile hamburger toggle, and :root color
  variables from pages/submit3.html and css/submit3.css, with no active nav link highlighted.
  • Desktop & Mobile Layouts: Desktop (>=768px) renders the two-column white card (left: "Step-by-Step cooking" text
  and step image/placeholder; right: "Timer: mm:ss" with Start/Pause/Reset and progress bar; bottom: < Previous Step
  and Next Step >). Mobile (<768px) stacks in the requested order: "Cooking: <title>", step text, step
  image/placeholder, large timer, full-width Next Step > button, < Previous Step, and the progress bar with "Restart".
  • Recipe Loading, Timer & Persistence: Defaults to a 5-step Chicken Karahi array ({ text, minutes }), or loads a
  submitted recipe from localStorage via ?id=<id> (extracting minute values from step text or defaulting to 10
  minutes, and falling back with a notice if missing or empty). Prevents stacked intervals, plays a Web Audio API
  beep in try/catch at 00:00 with "Time's up!", saves { recipeId, stepIndex } across reloads, and shows "Recipe
  complete, enjoy your meal!" on "Finish Cooking".

  Verification

  • Verified via PowerShell script that all document.getElementById(...) lookups in js/cooking3.js match element IDs
  in pages/cooking3.html (Missing IDs: empty) and Active nav links in cooking3.html: 0.
  • Browser runtime rendering and audio playback were not executed in this environment.
  ──────
  Functions in js/cooking3.js (For Your Viva)

  1. toggleMobileMenu() — Toggles .is-open on #nav-menu and updates aria-expanded for the mobile hamburger menu.
  2. showStorageAlert(message) — Displays #storage-alert when localStorage is unavailable.
  3. showRecipeNotice(message) — Displays #recipe-notice when falling back to the default recipe (e.g. unknown ?id=
  or empty steps).
  4. safeReadStorage(key, fallback) — Reads and parses JSON from localStorage inside try/catch, returning fallback on
  failure.
  5. safeWriteStorage(key, value) — Serializes and saves JSON to localStorage inside try/catch.
  6. extractMinutesFromText(text) — Uses a regex to parse a number before "min"/"minutes" in a step string,
  defaulting to 10 minutes if none is found.
  7. buildRecipeFromSaved(saved) — Converts a saved recipe from submit3.js into { id, title, image, steps },
  returning null if instructions is missing or empty.
  8. loadActiveRecipe() — Checks the ?id= URL parameter, searches "recipes" in localStorage, and sets activeRecipe
  (or falls back to DEFAULT_RECIPE).
  9. saveCookingState() — Saves { recipeId, stepIndex } to localStorage under "recipeJarCookingState".
  10. restoreCookingState() — Restores currentStepIndex on page reload if the saved recipeId matches the active
  recipe and the index is in bounds.
  11. clearCookingState() — Removes "recipeJarCookingState" from localStorage.
  12. formatTime(totalSeconds) — Converts seconds into a zero-padded mm:ss string.
  13. playBeep() — Uses the Web Audio API (AudioContext + OscillatorNode) inside try/catch to play a short beep when
  the timer hits 00:00.
  14. stopTimer() — Clears timerIntervalId if a countdown interval is active.
  15. loadStepTimer() — Stops any active timer, loads the current step's duration in seconds, updates #timer-value,
  and clears #timer-status.
  16. startTimer() — Starts a 1-second setInterval countdown (ignoring repeated clicks if already running or at
  00:00) and triggers "Time's up!" + playBeep() at 00:00.
  17. pauseTimer() — Pauses the countdown by calling stopTimer() without resetting remainingSeconds.
  18. resetTimer() — Restores the current step's full duration by calling loadStepTimer().
  19. renderRecipeImage() — Shows #step-image with alt text if the active recipe has an image, or shows #step-image-
  placeholder otherwise.
  20. renderStep() — Renders the recipe title, numbered step text, "Progress: X of Y Steps", progress bar width/ARIA
  attributes, Previous/Next button states ("Finish Cooking" on the final step), reloads the step timer, and saves
  progress.
  21. handlePrevStep() — Decrements currentStepIndex when above 0 and calls renderStep().
  22. handleNextStep() — Advances to the next step, or stops the timer and reveals #completion-banner ("Recipe
  complete, enjoy your meal!") on the last step.
  23. handleRestart(event) — Prevents default link jump, clears saved state via clearCookingState(), resets
  currentStepIndex to 0, and calls renderStep().
  24. initCookingPage() — Binds navigation, timer, step, and restart event listeners, loads the recipe, restores
  saved progress, and renders the initial view on DOMContentLoaded.
