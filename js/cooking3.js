"use strict";

/* Storage keys and defaults */
const RECIPES_KEY = "recipes";
const COOKING_STATE_KEY = "recipeJarCookingState";
const DEFAULT_STEP_MINUTES = 10;

/* Default Chicken Karahi recipe (5 steps with durations in minutes) */
const DEFAULT_RECIPE = {
  id: "default-chicken-karahi",
  title: "Chicken Karahi",
  image: "",
  steps: [
    {
      text: "Heat oil in a karahi over medium flame. Add chicken and fry until golden brown.",
      minutes: 15
    },
    {
      text: "Add chopped tomatoes and ginger-garlic paste, then cook until the tomatoes soften.",
      minutes: 8
    },
    {
      text: "Stir in red chili powder, turmeric, cumin, coriander, and salt; cook until oil separates.",
      minutes: 6
    },
    {
      text: "Cover and simmer on low heat until the chicken is tender and cooked through.",
      minutes: 12
    },
    {
      text: "Garnish with julienned ginger, green chilies, and fresh cilantro before serving.",
      minutes: 2
    }
  ]
};

/* Active state */
let activeRecipe = DEFAULT_RECIPE;
let currentStepIndex = 0;
let remainingSeconds = 0;
let timerIntervalId = null;

/* Cached DOM elements */
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const storageAlert = document.getElementById("storage-alert");
const recipeNotice = document.getElementById("recipe-notice");

const recipeTitleText = document.getElementById("recipe-title-text");
const stepTextEl = document.getElementById("step-text");
const stepImageEl = document.getElementById("step-image");
const stepImagePlaceholder = document.getElementById("step-image-placeholder");

const timerValueEl = document.getElementById("timer-value");
const timerStatusEl = document.getElementById("timer-status");
const startTimerBtn = document.getElementById("start-timer-btn");
const pauseTimerBtn = document.getElementById("pause-timer-btn");
const resetTimerBtn = document.getElementById("reset-timer-btn");

const progressTextEl = document.getElementById("progress-text");
const progressTrackEl = document.getElementById("progress-track");
const progressFillEl = document.getElementById("progress-fill");
const restartLink = document.getElementById("restart-link");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const completionBanner = document.getElementById("completion-banner");

/**
 * Toggles the mobile hamburger menu open and closed.
 */
function toggleMobileMenu() {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
}

/**
 * Displays a banner message when localStorage is unavailable.
 * @param {string} message - Friendly storage notice.
 */
function showStorageAlert(message) {
  storageAlert.textContent = message;
  storageAlert.hidden = false;
}

/**
 * Displays a notice when falling back to the default recipe.
 * @param {string} message - Notice message for the user.
 */
function showRecipeNotice(message) {
  recipeNotice.textContent = message;
  recipeNotice.hidden = false;
}

/**
 * Safely reads JSON data from localStorage.
 * @param {string} key - Storage key name.
 * @param {*} fallback - Value returned if missing or inaccessible.
 * @returns {*} Parsed JSON data or fallback.
 */
function safeReadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    showStorageAlert("Browser storage is unavailable. Step progress cannot be saved across reloads.");
    return fallback;
  }
}

/**
 * Safely writes JSON data to localStorage.
 * @param {string} key - Storage key name.
 * @param {*} value - Data to serialize and store.
 */
function safeWriteStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    showStorageAlert("Browser storage is unavailable. Step progress cannot be saved across reloads.");
  }
}

/**
 * Parses a duration in minutes from a step description, defaulting to 10 minutes.
 * @param {string} text - Step instruction text.
 * @returns {number} Duration in whole minutes (at least 1).
 */
function extractMinutesFromText(text) {
  const match = text.match(/(\d+)\s*(?:minutes?|mins?)\b/i);
  if (match) {
    const parsed = parseInt(match[1], 10);
    if (parsed > 0) {
      return parsed;
    }
  }
  return DEFAULT_STEP_MINUTES;
}

/**
 * Normalizes a saved recipe from localStorage into the { id, title, image, steps } format.
 * @param {Object} saved - Recipe object stored by the Submit page.
 * @returns {Object|null} Normalized recipe object, or null if instructions are empty.
 */
function buildRecipeFromSaved(saved) {
  if (!saved || !Array.isArray(saved.instructions)) {
    return null;
  }

  const cleanSteps = saved.instructions
    .map((line) => (typeof line === "string" ? line.trim() : ""))
    .filter((line) => line.length > 0)
    .map((line) => ({
      text: line,
      minutes: extractMinutesFromText(line)
    }));

  if (cleanSteps.length === 0) {
    return null;
  }

  return {
    id: saved.id,
    title: typeof saved.title === "string" && saved.title.trim() ? saved.title.trim() : "Untitled Recipe",
    image: typeof saved.image === "string" ? saved.image : "",
    steps: cleanSteps
  };
}

/**
 * Loads the recipe matching ?id=<id> from localStorage, or falls back to Chicken Karahi.
 */
function loadActiveRecipe() {
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("id");

  if (!requestedId) {
    activeRecipe = DEFAULT_RECIPE;
    return;
  }

  const savedRecipes = safeReadStorage(RECIPES_KEY, []);
  const matched = Array.isArray(savedRecipes)
    ? savedRecipes.find((item) => String(item.id) === String(requestedId))
    : null;

  if (!matched) {
    activeRecipe = DEFAULT_RECIPE;
    showRecipeNotice("Recipe not found in storage. Showing the default Chicken Karahi recipe.");
    return;
  }

  const normalized = buildRecipeFromSaved(matched);
  if (!normalized) {
    activeRecipe = DEFAULT_RECIPE;
    showRecipeNotice("This recipe has no cooking steps yet. Showing the default Chicken Karahi recipe.");
    return;
  }

  activeRecipe = normalized;
}

/**
 * Saves the current recipe ID and step index to localStorage.
 */
function saveCookingState() {
  safeWriteStorage(COOKING_STATE_KEY, {
    recipeId: activeRecipe.id,
    stepIndex: currentStepIndex
  });
}

/**
 * Restores the saved step index from localStorage if it belongs to the active recipe.
 */
function restoreCookingState() {
  const savedState = safeReadStorage(COOKING_STATE_KEY, null);
  if (!savedState || typeof savedState !== "object") {
    currentStepIndex = 0;
    return;
  }

  const sameRecipe = String(savedState.recipeId) === String(activeRecipe.id);
  const idx = Number(savedState.stepIndex);
  if (sameRecipe && Number.isInteger(idx) && idx >= 0 && idx < activeRecipe.steps.length) {
    currentStepIndex = idx;
  } else {
    currentStepIndex = 0;
  }
}

/**
 * Clears saved cooking progress from localStorage.
 */
function clearCookingState() {
  try {
    localStorage.removeItem(COOKING_STATE_KEY);
  } catch (err) {
    showStorageAlert("Browser storage is unavailable.");
  }
}

/**
 * Formats total seconds into mm:ss string (e.g. "15:00" or "04:09").
 * @param {number} totalSeconds - Non-negative integer seconds.
 * @returns {string} Formatted timer text.
 */
function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Plays a short audible beep via Web Audio API when a timer finishes.
 */
function playBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      return;
    }
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.value = 0.15;

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.35);
  } catch (err) {
    // Ignore audio errors if blocked by browser autoplay policy
  }
}

/**
 * Stops the active countdown interval if one is running.
 */
function stopTimer() {
  if (timerIntervalId !== null) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
}

/**
 * Loads the full duration for the current step and updates the timer UI.
 */
function loadStepTimer() {
  stopTimer();
  const step = activeRecipe.steps[currentStepIndex];
  const minutes = step && step.minutes > 0 ? step.minutes : DEFAULT_STEP_MINUTES;
  remainingSeconds = minutes * 60;
  timerValueEl.textContent = formatTime(remainingSeconds);
  timerStatusEl.textContent = "";
}

/**
 * Starts the 1-second countdown without stacking multiple intervals.
 */
function startTimer() {
  if (timerIntervalId !== null || remainingSeconds <= 0) {
    return;
  }

  timerStatusEl.textContent = "";
  timerIntervalId = setInterval(() => {
    remainingSeconds -= 1;
    timerValueEl.textContent = formatTime(remainingSeconds);

    if (remainingSeconds <= 0) {
      stopTimer();
      timerStatusEl.textContent = "Time's up!";
      playBeep();
    }
  }, 1000);
}

/**
 * Pauses the countdown while keeping the remaining time intact.
 */
function pauseTimer() {
  stopTimer();
}

/**
 * Resets the timer back to the current step's full duration.
 */
function resetTimer() {
  loadStepTimer();
}

/**
 * Renders the recipe image if available, or the placeholder box otherwise.
 */
function renderRecipeImage() {
  if (activeRecipe.image) {
    stepImageEl.src = activeRecipe.image;
    stepImageEl.alt = `Photo for ${activeRecipe.title}`;
    stepImageEl.hidden = false;
    stepImagePlaceholder.hidden = true;
  } else {
    stepImageEl.src = "";
    stepImageEl.hidden = true;
    stepImagePlaceholder.hidden = false;
  }
}

/**
 * Renders the current step text, progress bar, navigation buttons, and timer.
 */
function renderStep() {
  const totalSteps = activeRecipe.steps.length;
  const currentStep = activeRecipe.steps[currentStepIndex];
  const stepNumber = currentStepIndex + 1;

  recipeTitleText.textContent = activeRecipe.title;
  document.title = `Cooking Mode: ${activeRecipe.title} | Recipe Jar`;

  stepTextEl.textContent = `${stepNumber}. ${currentStep.text}`;
  progressTextEl.textContent = `Progress: ${stepNumber} of ${totalSteps} Steps`;

  const percent = (stepNumber / totalSteps) * 100;
  progressFillEl.style.width = `${percent}%`;
  progressTrackEl.setAttribute("aria-valuemax", String(totalSteps));
  progressTrackEl.setAttribute("aria-valuenow", String(stepNumber));

  prevBtn.disabled = currentStepIndex === 0;
  nextBtn.textContent = currentStepIndex === totalSteps - 1 ? "Finish Cooking" : "Next Step >";
  completionBanner.hidden = true;

  loadStepTimer();
  saveCookingState();
}

/**
 * Moves to the previous step if not already at step 1.
 */
function handlePrevStep() {
  if (currentStepIndex <= 0) {
    return;
  }
  currentStepIndex -= 1;
  renderStep();
}

/**
 * Advances to the next step, or displays the completion message on the final step.
 */
function handleNextStep() {
  const lastIndex = activeRecipe.steps.length - 1;
  if (currentStepIndex < lastIndex) {
    currentStepIndex += 1;
    renderStep();
    return;
  }

  stopTimer();
  completionBanner.hidden = false;
}

/**
 * Clears saved progress and restarts cooking from step 1.
 * @param {MouseEvent} event - Click event on the Restart link.
 */
function handleRestart(event) {
  event.preventDefault();
  clearCookingState();
  currentStepIndex = 0;
  renderStep();
}

/**
 * Initializes recipe data, restores saved progress, renders the UI, and binds events.
 */
function initCookingPage() {
  navToggle.addEventListener("click", toggleMobileMenu);

  loadActiveRecipe();
  if (!activeRecipe || !Array.isArray(activeRecipe.steps) || activeRecipe.steps.length === 0) {
    activeRecipe = DEFAULT_RECIPE;
  }

  restoreCookingState();
  renderRecipeImage();
  renderStep();

  startTimerBtn.addEventListener("click", startTimer);
  pauseTimerBtn.addEventListener("click", pauseTimer);
  resetTimerBtn.addEventListener("click", resetTimer);

  prevBtn.addEventListener("click", handlePrevStep);
  nextBtn.addEventListener("click", handleNextStep);
  restartLink.addEventListener("click", handleRestart);
}

document.addEventListener("DOMContentLoaded", initCookingPage);
