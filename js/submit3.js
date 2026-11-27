"use strict";

/* Constants for storage keys and image upload limits */
const DRAFT_KEY = "recipeJarDraft";
const RECIPES_KEY = "recipes";
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_TITLE_LENGTH = 80;

/* Holds the currently selected image as a base64 Data URL */
let currentImageData = "";

/* Cached DOM elements */
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const storageAlert = document.getElementById("storage-alert");

const recipeForm = document.getElementById("recipe-form");
const titleInput = document.getElementById("recipe-title");
const descriptionInput = document.getElementById("recipe-description");
const ingredientsInput = document.getElementById("recipe-ingredients");
const instructionsInput = document.getElementById("recipe-instructions");

const titleError = document.getElementById("title-error");
const titleWarning = document.getElementById("title-warning");
const descriptionError = document.getElementById("description-error");
const ingredientsError = document.getElementById("ingredients-error");
const instructionsError = document.getElementById("instructions-error");

const imageInput = document.getElementById("recipe-image");
const imagePreviewBox = document.getElementById("image-preview-box");
const imagePlaceholder = document.getElementById("image-placeholder");
const imagePreview = document.getElementById("image-preview");
const browseImageBtn = document.getElementById("browse-image-btn");
const removeImageBtn = document.getElementById("remove-image-btn");
const imageError = document.getElementById("image-error");

const successModal = document.getElementById("success-modal");
const successMessage = document.getElementById("success-message");
const publishedSummary = document.getElementById("published-summary");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalDoneBtn = document.getElementById("modal-done-btn");

/**
 * Toggles the mobile hamburger menu open and closed.
 */
function toggleMobileMenu() {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
}

/**
 * Displays a friendly banner when localStorage cannot be used.
 * @param {string} message - Explanation shown to the user.
 */
function showStorageAlert(message) {
  storageAlert.textContent = message;
  storageAlert.hidden = false;
}

/**
 * Safely reads and parses JSON data from localStorage.
 * @param {string} key - The localStorage key to read.
 * @param {*} fallback - Value returned if missing or unreadable.
 * @returns {*} Parsed JSON value or the fallback.
 */
function safeReadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    showStorageAlert("Browser storage is currently unavailable. Your draft or recipes may not persist.");
    return fallback;
  }
}

/**
 * Safely writes JSON data to localStorage.
 * @param {string} key - The localStorage key to write.
 * @param {*} value - Data to serialize and save.
 * @returns {boolean} True if saved successfully, false otherwise.
 */
function safeWriteStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    showStorageAlert("Could not save to browser storage (storage may be full or disabled).");
    return false;
  }
}

/**
 * Splits multiline text into trimmed non-empty lines.
 * @param {string} text - Raw textarea content.
 * @returns {string[]} Array of cleaned lines.
 */
function parseLines(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Sets or clears an error state on a form field or container.
 * @param {HTMLElement} targetEl - Element that receives the red border.
 * @param {HTMLElement} errorEl - Paragraph that displays the error text.
 * @param {string} message - Error message (empty string clears the error).
 */
function setFieldError(targetEl, errorEl, message) {
  errorEl.textContent = message;
  if (message) {
    targetEl.classList.add("is-invalid");
    targetEl.setAttribute("aria-invalid", "true");
  } else {
    targetEl.classList.remove("is-invalid");
    targetEl.removeAttribute("aria-invalid");
  }
}

/**
 * Checks whether the current title matches an existing saved recipe and warns without blocking.
 */
function checkDuplicateTitle() {
  const cleanTitle = titleInput.value.trim().toLowerCase();
  if (!cleanTitle) {
    titleWarning.textContent = "";
    return;
  }

  const savedRecipes = safeReadStorage(RECIPES_KEY, []);
  const exists = Array.isArray(savedRecipes) && savedRecipes.some(
    (recipe) => typeof recipe.title === "string" && recipe.title.trim().toLowerCase() === cleanTitle
  );

  titleWarning.textContent = exists
    ? "A recipe with this title already exists. You can still submit it."
    : "";
}

/**
 * Validates the recipe title field.
 * @returns {boolean} True when valid.
 */
function validateTitle() {
  const value = titleInput.value.trim();
  if (!value) {
    setFieldError(titleInput, titleError, "Recipe title required!");
    return false;
  }
  if (value.length < 3) {
    setFieldError(titleInput, titleError, "Title must be at least 3 characters.");
    return false;
  }
  if (value.length > MAX_TITLE_LENGTH) {
    setFieldError(titleInput, titleError, `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`);
    return false;
  }
  setFieldError(titleInput, titleError, "");
  return true;
}

/**
 * Validates the recipe description field.
 * @returns {boolean} True when valid.
 */
function validateDescription() {
  const value = descriptionInput.value.trim();
  if (!value) {
    setFieldError(descriptionInput, descriptionError, "Description required!");
    return false;
  }
  setFieldError(descriptionInput, descriptionError, "");
  return true;
}

/**
 * Validates that at least one non-empty ingredient line is provided.
 * @returns {boolean} True when valid.
 */
function validateIngredients() {
  const lines = parseLines(ingredientsInput.value);
  if (lines.length === 0) {
    setFieldError(ingredientsInput, ingredientsError, "At least 1 ingredient is required!");
    return false;
  }
  setFieldError(ingredientsInput, ingredientsError, "");
  return true;
}

/**
 * Validates that instructions contain non-empty steps.
 * @returns {boolean} True when valid.
 */
function validateInstructions() {
  const lines = parseLines(instructionsInput.value);
  if (lines.length === 0) {
    setFieldError(instructionsInput, instructionsError, "Instructions required!");
    return false;
  }
  setFieldError(instructionsInput, instructionsError, "");
  return true;
}

/**
 * Validates that a cover image has been loaded.
 * @returns {boolean} True when valid.
 */
function validateImage() {
  if (!currentImageData) {
    setFieldError(imagePreviewBox, imageError, "Cover image required!");
    return false;
  }
  setFieldError(imagePreviewBox, imageError, "");
  return true;
}

/**
 * Validates all form fields and focuses the first invalid control.
 * @returns {boolean} True if every field is valid.
 */
function validateForm() {
  const checks = [
    { valid: validateTitle(), focusTarget: titleInput },
    { valid: validateDescription(), focusTarget: descriptionInput },
    { valid: validateIngredients(), focusTarget: ingredientsInput },
    { valid: validateInstructions(), focusTarget: instructionsInput },
    { valid: validateImage(), focusTarget: browseImageBtn }
  ];

  const firstInvalid = checks.find((item) => !item.valid);
  if (firstInvalid) {
    firstInvalid.focusTarget.focus();
    return false;
  }
  return true;
}

/**
 * Saves the current text fields (without the image) as a draft in localStorage.
 */
function saveDraft() {
  const draft = {
    title: titleInput.value,
    description: descriptionInput.value,
    ingredients: ingredientsInput.value,
    instructions: instructionsInput.value
  };
  safeWriteStorage(DRAFT_KEY, draft);
}

/**
 * Restores a previously saved draft from localStorage on page load.
 */
function loadDraft() {
  const draft = safeReadStorage(DRAFT_KEY, null);
  if (!draft || typeof draft !== "object") {
    return;
  }

  titleInput.value = draft.title || "";
  descriptionInput.value = draft.description || "";
  ingredientsInput.value = draft.ingredients || "";
  instructionsInput.value = draft.instructions || "";
  checkDuplicateTitle();
}

/**
 * Removes the saved draft from localStorage.
 */
function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (err) {
    // Ignore if storage is disabled
  }
}

/**
 * Handles file selection, checks file type and 2MB size limit, and previews the image.
 */
function handleImageChange() {
  const file = imageInput.files && imageInput.files[0];
  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    resetImagePreview();
    setFieldError(imagePreviewBox, imageError, "Please select a valid image file (PNG, JPG, WEBP, etc.).");
    return;
  }

  if (file.size > MAX_IMAGE_BYTES) {
    resetImagePreview();
    setFieldError(imagePreviewBox, imageError, "Image must be 2MB or smaller.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    currentImageData = typeof reader.result === "string" ? reader.result : "";
    if (!currentImageData) {
      setFieldError(imagePreviewBox, imageError, "Could not read image file.");
      return;
    }

    imagePreview.src = currentImageData;
    imagePreview.hidden = false;
    imagePlaceholder.hidden = true;
    removeImageBtn.hidden = false;
    setFieldError(imagePreviewBox, imageError, "");
  };
  reader.onerror = () => {
    resetImagePreview();
    setFieldError(imagePreviewBox, imageError, "Failed to load the selected image.");
  };
  reader.readAsDataURL(file);
}

/**
 * Clears the selected image and restores the square placeholder box.
 */
function resetImagePreview() {
  currentImageData = "";
  imageInput.value = "";
  imagePreview.src = "";
  imagePreview.hidden = true;
  imagePlaceholder.hidden = false;
  removeImageBtn.hidden = true;
}

/**
 * Renders the published recipe summary inside the success modal from the saved object.
 * @param {Object} recipe - The newly saved recipe object.
 */
function renderPublishedSummary(recipe) {
  publishedSummary.innerHTML = "";

  const header = document.createElement("div");
  header.className = "summary-header";

  const thumb = document.createElement("img");
  thumb.className = "summary-thumb";
  thumb.src = recipe.image;
  thumb.alt = `Cover image for ${recipe.title}`;

  const meta = document.createElement("div");
  const titleEl = document.createElement("h3");
  titleEl.className = "summary-title";
  titleEl.textContent = recipe.title;

  const dateEl = document.createElement("p");
  dateEl.className = "summary-date";
  dateEl.textContent = `Published: ${new Date(recipe.date).toLocaleDateString()}`;

  meta.append(titleEl, dateEl);
  header.append(thumb, meta);

  const descEl = document.createElement("p");
  descEl.className = "summary-desc";
  descEl.textContent = recipe.description;

  const ingHeading = document.createElement("h4");
  ingHeading.className = "summary-list-title";
  ingHeading.textContent = `Ingredients (${recipe.ingredients.length})`;

  const ingList = document.createElement("ul");
  ingList.className = "summary-list";
  recipe.ingredients.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    ingList.appendChild(li);
  });

  const stepHeading = document.createElement("h4");
  stepHeading.className = "summary-list-title";
  stepHeading.textContent = `Instructions (${recipe.instructions.length} ${recipe.instructions.length === 1 ? "step" : "steps"})`;

  const stepList = document.createElement("ol");
  stepList.className = "summary-list";
  recipe.instructions.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    stepList.appendChild(li);
  });

  publishedSummary.append(header, descEl, ingHeading, ingList, stepHeading, stepList);
}

/**
 * Opens the success modal and shows the published recipe confirmation and summary.
 * @param {Object} recipe - The newly saved recipe object.
 */
function openSuccessModal(recipe) {
  successMessage.textContent = `Your ${recipe.title} is now live!`;
  renderPublishedSummary(recipe);
  successModal.hidden = false;
  modalCloseBtn.focus();
}

/**
 * Closes the success modal and resets the form for a fresh entry.
 */
function closeSuccessModalAndReset() {
  successModal.hidden = true;
  resetFormState();
}

/**
 * Resets all form fields, validation states, warnings, and image preview.
 */
function resetFormState() {
  recipeForm.reset();
  resetImagePreview();

  const errorTargets = [
    [titleInput, titleError],
    [descriptionInput, descriptionError],
    [ingredientsInput, ingredientsError],
    [instructionsInput, instructionsError],
    [imagePreviewBox, imageError]
  ];
  errorTargets.forEach(([target, errorEl]) => setFieldError(target, errorEl, ""));

  titleWarning.textContent = "";
  clearDraft();
}

/**
 * Handles form submission: validates inputs, saves recipe to localStorage, clears draft, and opens modal.
 * @param {SubmitEvent} event - Form submit event.
 */
function handleFormSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const newRecipe = {
    id: Date.now(),
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    ingredients: parseLines(ingredientsInput.value),
    instructions: parseLines(instructionsInput.value),
    image: currentImageData,
    date: new Date().toISOString()
  };

  const recipes = safeReadStorage(RECIPES_KEY, []);
  const recipeList = Array.isArray(recipes) ? recipes : [];
  recipeList.push(newRecipe);

  safeWriteStorage(RECIPES_KEY, recipeList);
  clearDraft();
  openSuccessModal(newRecipe);
}

/**
 * Wires up all event listeners and restores any saved draft when the page is ready.
 */
function initSubmitPage() {
  navToggle.addEventListener("click", toggleMobileMenu);

  const textFields = [
    { input: titleInput, errorEl: titleError, validate: validateTitle, onInput: checkDuplicateTitle },
    { input: descriptionInput, errorEl: descriptionError, validate: validateDescription },
    { input: ingredientsInput, errorEl: ingredientsError, validate: validateIngredients },
    { input: instructionsInput, errorEl: instructionsError, validate: validateInstructions }
  ];

  // Live validation on blur, plus error clearing and draft autosave while typing
  textFields.forEach(({ input, errorEl, validate, onInput }) => {
    input.addEventListener("blur", validate);
    input.addEventListener("input", () => {
      if (onInput) {
        onInput();
      }
      if (errorEl.textContent) {
        validate();
      }
      saveDraft();
    });
  });

  // Image upload & removal
  browseImageBtn.addEventListener("click", () => imageInput.click());
  imageInput.addEventListener("change", handleImageChange);
  removeImageBtn.addEventListener("click", () => {
    resetImagePreview();
    validateImage();
  });

  // Form submission
  recipeForm.addEventListener("submit", handleFormSubmit);

  // Success modal close handlers
  modalCloseBtn.addEventListener("click", closeSuccessModalAndReset);
  modalDoneBtn.addEventListener("click", closeSuccessModalAndReset);
  successModal.addEventListener("click", (event) => {
    if (event.target === successModal) {
      closeSuccessModalAndReset();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !successModal.hidden) {
      closeSuccessModalAndReset();
    }
  });

  loadDraft();
}

document.addEventListener("DOMContentLoaded", initSubmitPage);
