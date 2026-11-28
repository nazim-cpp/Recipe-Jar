// ==========================================================================
// 1. Recipe Details Data (same 12 recipes as the Browse page)
// --------------------------------------------------------------------------
// - prepTime + cookTime = the time shown on the Browse cards
// - Ingredient amounts are for ONE serving. Scaling = amount x servings.
// - nutrition values are also for ONE serving.
// ==========================================================================
const recipes = [
  {
    id: 1, title: "Chicken Karahi", cuisine: "Pakistani", prepTime: 15, cookTime: 30,
    rating: 4.9, reviews: 128, image: "../images/chicken-karahi.jpg",
    ingredients: [
      { name: "Chicken (with bone)", amount: 125, unit: "g" },
      { name: "Tomatoes (medium)", amount: 1, unit: "" },
      { name: "Ginger garlic paste", amount: 0.5, unit: "tbsp" },
      { name: "Green chillies", amount: 1, unit: "" },
      { name: "Cooking oil", amount: 1, unit: "tbsp" },
      { name: "Red chilli powder", amount: 0.25, unit: "tsp" },
      { name: "Salt", amount: 0.5, unit: "tsp" }
    ],
    steps: [
      "Heat the oil in a karahi and fry the ginger garlic paste for one minute.",
      "Add the chicken and cook on high heat until its colour changes.",
      "Add chopped tomatoes, salt and red chilli powder. Cover and cook on low heat.",
      "Stir until the oil separates from the masala and the chicken is tender.",
      "Garnish with green chillies and fresh coriander, then serve hot."
    ],
    nutrition: { calories: 280, protein: 24, carbs: 5, fat: 18 }
  },
  {
    id: 2, title: "Aloo Paratha", cuisine: "Breakfast", prepTime: 15, cookTime: 15,
    rating: 4.6, reviews: 84, image: "../images/aloo-paratha.jpg",
    ingredients: [
      { name: "Whole wheat flour", amount: 60, unit: "g" },
      { name: "Boiled potatoes", amount: 80, unit: "g" },
      { name: "Cumin seeds", amount: 0.25, unit: "tsp" },
      { name: "Salt", amount: 0.25, unit: "tsp" },
      { name: "Water", amount: 40, unit: "ml" },
      { name: "Ghee", amount: 1, unit: "tsp" }
    ],
    steps: [
      "Mash the boiled potatoes with salt and cumin seeds.",
      "Knead the flour and water into a soft dough.",
      "Fill a dough ball with the potato mixture and roll it out flat.",
      "Cook on a hot tawa with ghee until both sides are golden."
    ],
    nutrition: { calories: 250, protein: 6, carbs: 38, fat: 8 }
  },
  {
    id: 3, title: "Beef Biryani", cuisine: "Pakistani", prepTime: 20, cookTime: 40,
    rating: 4.8, reviews: 152, image: "../images/beef-biryani.jpg",
    ingredients: [
      { name: "Basmati rice", amount: 80, unit: "g" },
      { name: "Beef", amount: 125, unit: "g" },
      { name: "Onion, sliced", amount: 50, unit: "g" },
      { name: "Yogurt", amount: 2, unit: "tbsp" },
      { name: "Biryani masala", amount: 1, unit: "tsp" },
      { name: "Cooking oil", amount: 1, unit: "tbsp" },
      { name: "Salt", amount: 0.5, unit: "tsp" }
    ],
    steps: [
      "Marinate the beef with yogurt, biryani masala and salt.",
      "Fry the sliced onions in oil until golden brown.",
      "Add the beef and cook on low heat until it is tender.",
      "Boil the rice until it is 70% cooked, then drain it.",
      "Layer the rice over the beef and steam on low heat for 15 minutes."
    ],
    nutrition: { calories: 420, protein: 26, carbs: 48, fat: 14 }
  },
  {
    id: 4, title: "Palak Paneer", cuisine: "Desi", prepTime: 15, cookTime: 20,
    rating: 4.7, reviews: 76, image: "../images/palak-paneer.jpg",
    ingredients: [
      { name: "Spinach", amount: 100, unit: "g" },
      { name: "Paneer", amount: 50, unit: "g" },
      { name: "Tomato puree", amount: 2, unit: "tbsp" },
      { name: "Garlic cloves", amount: 1, unit: "" },
      { name: "Fresh cream", amount: 1, unit: "tbsp" },
      { name: "Cooking oil", amount: 1, unit: "tbsp" },
      { name: "Salt", amount: 0.25, unit: "tsp" }
    ],
    steps: [
      "Boil the spinach for two minutes, then blend it into a smooth puree.",
      "Fry the garlic in oil, then add the tomato puree and cook for 3 minutes.",
      "Add the spinach puree and salt, then simmer for 5 minutes.",
      "Add the paneer cubes and cream, and cook for 5 more minutes."
    ],
    nutrition: { calories: 230, protein: 10, carbs: 8, fat: 17 }
  },
  {
    id: 5, title: "Masala Omelette", cuisine: "Breakfast", prepTime: 5, cookTime: 10,
    rating: 4.8, reviews: 95, image: "../images/masala-omelette.jpg",
    ingredients: [
      { name: "Eggs", amount: 2, unit: "" },
      { name: "Onion, chopped", amount: 2, unit: "tbsp" },
      { name: "Tomato, chopped", amount: 2, unit: "tbsp" },
      { name: "Green chillies", amount: 1, unit: "" },
      { name: "Fresh coriander", amount: 1, unit: "tbsp" },
      { name: "Salt", amount: 0.25, unit: "tsp" },
      { name: "Cooking oil", amount: 1, unit: "tsp" }
    ],
    steps: [
      "Beat the eggs with salt in a bowl.",
      "Mix in the onion, tomato, green chillies and coriander.",
      "Heat the oil in a pan and pour in the egg mixture.",
      "Cook until the bottom is set, flip it, and cook until golden."
    ],
    nutrition: { calories: 190, protein: 13, carbs: 3, fat: 14 }
  },
  {
    id: 6, title: "Gulab Jamun", cuisine: "Dessert", prepTime: 15, cookTime: 25,
    rating: 4.9, reviews: 140, image: "../images/gulab-jamun.jpg",
    ingredients: [
      { name: "Milk powder", amount: 40, unit: "g" },
      { name: "Plain flour", amount: 10, unit: "g" },
      { name: "Milk", amount: 2, unit: "tbsp" },
      { name: "Sugar", amount: 60, unit: "g" },
      { name: "Water", amount: 100, unit: "ml" },
      { name: "Cardamom pods", amount: 1, unit: "" },
      { name: "Cooking oil (for frying)", amount: 100, unit: "ml" }
    ],
    steps: [
      "Mix the milk powder, flour and milk into a soft dough.",
      "Roll the dough into small smooth balls.",
      "Boil the sugar, water and cardamom for 5 minutes to make syrup.",
      "Fry the balls on low heat until golden brown.",
      "Soak the fried balls in warm syrup for 30 minutes before serving."
    ],
    nutrition: { calories: 320, protein: 5, carbs: 48, fat: 12 }
  },
  {
    id: 7, title: "Seekh Kebab", cuisine: "Pakistani", prepTime: 20, cookTime: 15,
    rating: 4.7, reviews: 64, image: "../images/placeholder.svg",
    ingredients: [
      { name: "Beef mince", amount: 125, unit: "g" },
      { name: "Onion, grated", amount: 30, unit: "g" },
      { name: "Ginger garlic paste", amount: 0.5, unit: "tbsp" },
      { name: "Seekh kebab masala", amount: 1, unit: "tsp" },
      { name: "Green chillies", amount: 1, unit: "" },
      { name: "Fresh coriander", amount: 1, unit: "tbsp" },
      { name: "Salt", amount: 0.25, unit: "tsp" }
    ],
    steps: [
      "Mix the mince with all the other ingredients until sticky.",
      "Rest the mixture in the fridge for 15 minutes.",
      "Shape the mixture around skewers into long kebabs.",
      "Grill or pan fry for 15 minutes, turning until browned all over."
    ],
    nutrition: { calories: 260, protein: 22, carbs: 4, fat: 17 }
  },
  {
    id: 8, title: "Daal Chawal", cuisine: "Desi", prepTime: 10, cookTime: 30,
    rating: 4.6, reviews: 110, image: "../images/placeholder.svg",
    ingredients: [
      { name: "Yellow lentils (masoor)", amount: 50, unit: "g" },
      { name: "Basmati rice", amount: 70, unit: "g" },
      { name: "Water", amount: 250, unit: "ml" },
      { name: "Garlic cloves", amount: 1, unit: "" },
      { name: "Cumin seeds", amount: 0.5, unit: "tsp" },
      { name: "Turmeric powder", amount: 0.25, unit: "tsp" },
      { name: "Cooking oil", amount: 1, unit: "tbsp" },
      { name: "Salt", amount: 0.5, unit: "tsp" }
    ],
    steps: [
      "Wash the lentils and boil them with water, turmeric and salt until soft.",
      "Boil the rice separately until fluffy.",
      "Heat the oil and fry the garlic and cumin seeds until fragrant.",
      "Pour this tarka over the daal and serve with the rice."
    ],
    nutrition: { calories: 380, protein: 14, carbs: 65, fat: 7 }
  },
  {
    id: 9, title: "Halwa Puri", cuisine: "Breakfast", prepTime: 20, cookTime: 30,
    rating: 4.8, reviews: 89, image: "../images/placeholder.svg",
    ingredients: [
      { name: "Plain flour", amount: 60, unit: "g" },
      { name: "Semolina (suji)", amount: 40, unit: "g" },
      { name: "Sugar", amount: 30, unit: "g" },
      { name: "Ghee", amount: 1, unit: "tbsp" },
      { name: "Cardamom powder", amount: 0.25, unit: "tsp" },
      { name: "Water", amount: 150, unit: "ml" },
      { name: "Cooking oil (for frying)", amount: 50, unit: "ml" }
    ],
    steps: [
      "Knead the plain flour with a little water into a firm dough for the puri.",
      "Roast the semolina in ghee until golden, then add water and sugar.",
      "Stir the halwa until thick and add the cardamom powder.",
      "Roll out small puri and fry them in hot oil until puffed and golden."
    ],
    nutrition: { calories: 520, protein: 9, carbs: 70, fat: 22 }
  },
  {
    id: 10, title: "Kheer", cuisine: "Dessert", prepTime: 10, cookTime: 45,
    rating: 4.7, reviews: 71, image: "../images/placeholder.svg",
    ingredients: [
      { name: "Full cream milk", amount: 250, unit: "ml" },
      { name: "Rice", amount: 20, unit: "g" },
      { name: "Sugar", amount: 25, unit: "g" },
      { name: "Cardamom pods", amount: 1, unit: "" },
      { name: "Almonds, chopped", amount: 1, unit: "tbsp" }
    ],
    steps: [
      "Wash the rice and soak it for 10 minutes.",
      "Boil the milk, add the rice and cardamom, and cook on low heat.",
      "Stir often for 40 minutes until the kheer is thick and creamy.",
      "Add the sugar, cook for 5 minutes, and top with almonds."
    ],
    nutrition: { calories: 290, protein: 8, carbs: 42, fat: 10 }
  },
  {
    id: 11, title: "Chicken Pasta", cuisine: "Continental", prepTime: 10, cookTime: 15,
    rating: 4.5, reviews: 58, image: "../images/placeholder.svg",
    ingredients: [
      { name: "Penne pasta", amount: 80, unit: "g" },
      { name: "Chicken breast", amount: 80, unit: "g" },
      { name: "Fresh cream", amount: 3, unit: "tbsp" },
      { name: "Garlic cloves", amount: 1, unit: "" },
      { name: "Olive oil", amount: 1, unit: "tbsp" },
      { name: "Black pepper", amount: 0.25, unit: "tsp" },
      { name: "Salt", amount: 0.25, unit: "tsp" }
    ],
    steps: [
      "Boil the pasta in salted water until soft, then drain it.",
      "Fry the garlic and chicken pieces in olive oil until cooked.",
      "Add the cream, salt and black pepper and simmer for 3 minutes.",
      "Mix in the pasta and serve hot."
    ],
    nutrition: { calories: 450, protein: 25, carbs: 50, fat: 16 }
  },
  {
    id: 12, title: "Chapli Kebab", cuisine: "Pakistani", prepTime: 15, cookTime: 10,
    rating: 4.8, reviews: 93, image: "../images/placeholder.svg",
    ingredients: [
      { name: "Beef mince", amount: 125, unit: "g" },
      { name: "Tomato, chopped", amount: 2, unit: "tbsp" },
      { name: "Onion, chopped", amount: 30, unit: "g" },
      { name: "Crushed coriander seeds", amount: 0.5, unit: "tsp" },
      { name: "Cornflour", amount: 1, unit: "tbsp" },
      { name: "Green chillies", amount: 1, unit: "" },
      { name: "Salt", amount: 0.25, unit: "tsp" },
      { name: "Cooking oil (shallow frying)", amount: 3, unit: "tbsp" }
    ],
    steps: [
      "Mix the mince with the tomato, onion, spices, cornflour and chillies.",
      "Shape the mixture into flat round patties.",
      "Shallow fry in hot oil for 5 minutes on each side until crisp."
    ],
    nutrition: { calories: 310, protein: 21, carbs: 6, fat: 22 }
  }
];

// ==========================================================================
// 2. Settings, Storage Keys, Page Variables & DOM Element References
// ==========================================================================
const SAVED_STORAGE_KEY = "savedRecipes";      // same key as the Browse page
const SERVINGS_STORAGE_KEY = "savedServings";  // remembers servings of saved recipes
const MIN_SERVINGS = 1;
const MAX_SERVINGS = 20;

// These three values change while the user uses the page
let currentRecipe = null;      // the recipe being shown
let currentServings = 1;       // default servings is 1
let currentStepIndex = 0;      // which cooking mode step is showing

const recipeContent = document.getElementById("recipeContent");
const notFound = document.getElementById("notFound");
const recipeImage = document.getElementById("recipeImage");
const recipeTitle = document.getElementById("recipeTitle");
const recipeCuisine = document.getElementById("recipeCuisine");
const recipeRating = document.getElementById("recipeRating");
const prepTimeText = document.getElementById("prepTime");
const cookTimeText = document.getElementById("cookTime");
const totalTimeText = document.getElementById("totalTime");
const saveBtn = document.getElementById("saveBtn");
const savedCountBadge = document.getElementById("savedCountBadge");

const decreaseBtn = document.getElementById("decreaseBtn");
const increaseBtn = document.getElementById("increaseBtn");
const servingsText = document.getElementById("servingsText");
const servingsError = document.getElementById("servingsError");

const ingredientsTab = document.getElementById("ingredientsTab");
const ingredientList = document.getElementById("ingredientList");
const instructionList = document.getElementById("instructionList");
const nutritionBody = document.getElementById("nutritionBody");
const nutritionTotalHeading = document.getElementById("nutritionTotalHeading");
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

const cookingBtn = document.getElementById("cookingBtn");
const saveOverlay = document.getElementById("saveOverlay");
const saveOverlayText = document.getElementById("saveOverlayText");
const backToRecipeBtn = document.getElementById("backToRecipeBtn");
const cookingOverlay = document.getElementById("cookingOverlay");
const cookingProgress = document.getElementById("cookingProgress");
const cookingStepText = document.getElementById("cookingStepText");
const prevStepBtn = document.getElementById("prevStepBtn");
const nextStepBtn = document.getElementById("nextStepBtn");
const exitCookingBtn = document.getElementById("exitCookingBtn");

// ==========================================================================
// 3. LocalStorage Helper Functions (Safe Read / Write)
// ==========================================================================

// Safely read the list of saved recipe IDs (same list the Browse page uses)
function getSavedRecipeIds() {
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    return [];
  }
}

// Save the list of saved recipe IDs into localStorage
function saveRecipeIds(ids) {
  localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(ids));
}

// Safely read the object that remembers servings, for example { "1": 6 }
function getSavedServingsMap() {
  try {
    const raw = localStorage.getItem(SERVINGS_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
    return {};
  } catch (error) {
    return {};
  }
}

// Save the servings object into localStorage
function saveServingsMap(servingsMap) {
  localStorage.setItem(SERVINGS_STORAGE_KEY, JSON.stringify(servingsMap));
}

// Update the Saved counter badge in the site header
function updateSavedBadge() {
  savedCountBadge.textContent = String(getSavedRecipeIds().length);
}

// ==========================================================================
// 4. Small Helper Functions (Find Recipe, Format Text)
// ==========================================================================

// Read the recipe id from the web address, for example recipe_scaler.html?id=3
function getRecipeIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

// Look through the recipes array and return the matching recipe (or null)
function findRecipeById(recipeId) {
  for (let i = 0; i < recipes.length; i++) {
    if (recipes[i].id === recipeId) {
      return recipes[i];
    }
  }
  return null;
}

// Turn minutes into text, for example 45 -> "45 min" and 75 -> "1 hr 15 min"
function formatTime(minutes) {
  if (minutes < 60) {
    return minutes + " min";
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return hours + " hr";
  }
  return hours + " hr " + remainingMinutes + " min";
}

// Round a number to 2 decimals so 0.75 or 1.5 look neat
function formatNumber(value) {
  return String(Math.round(value * 100) / 100);
}

// Return "1 Serving" or "6 Servings"
function getServingsLabel(servings) {
  if (servings === 1) {
    return "1 Serving";
  }
  return servings + " Servings";
}

// Turn a rating like 4.9 into star symbols, for example "★★★★★"
function getStarsText(rating) {
  const fullStars = Math.round(rating);
  return "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
}

// ==========================================================================
// 5. Show Recipe Details (Title, Photo, Rating, Prep / Cook / Total Time)
// ==========================================================================

// Fill the top part of the page using the chosen recipe
function showRecipeDetails() {
  document.title = currentRecipe.title + " | Recipe Jar";
  recipeTitle.textContent = currentRecipe.title;
  recipeCuisine.textContent = currentRecipe.cuisine;
  recipeImage.src = currentRecipe.image;
  recipeImage.alt = "Photo of " + currentRecipe.title;

  recipeRating.innerHTML =
    `<span class="stars" aria-hidden="true">${getStarsText(currentRecipe.rating)}</span> ` +
    `${currentRecipe.rating} (${currentRecipe.reviews} Reviews)`;

  // Total time = prep time + cook time
  const totalMinutes = currentRecipe.prepTime + currentRecipe.cookTime;
  prepTimeText.textContent = formatTime(currentRecipe.prepTime);
  cookTimeText.textContent = formatTime(currentRecipe.cookTime);
  totalTimeText.textContent = formatTime(totalMinutes);
}

// ==========================================================================
// 6. Ingredients, Instructions & Nutrition
// ==========================================================================

// Build the ingredient list. Each amount = amount for 1 serving x servings
function renderIngredients() {
  let listHtml = "";

  for (let i = 0; i < currentRecipe.ingredients.length; i++) {
    const item = currentRecipe.ingredients[i];
    const scaledAmount = item.amount * currentServings;
    const amountText = (formatNumber(scaledAmount) + " " + item.unit).trim();

    listHtml += `
      <li class="ingredient-item">
        <span class="ingredient-name">${item.name}</span>
        <span class="ingredient-amount">${amountText}</span>
      </li>
    `;
  }

  ingredientList.innerHTML = listHtml;
}

// Build the numbered cooking steps (steps do not change with servings)
function renderInstructions() {
  let listHtml = "";

  for (let i = 0; i < currentRecipe.steps.length; i++) {
    listHtml += `<li>${currentRecipe.steps[i]}</li>`;
  }

  instructionList.innerHTML = listHtml;
}

// Build the nutrition table: per serving and total for the chosen servings
function renderNutrition() {
  const nutrition = currentRecipe.nutrition;
  const rows = [
    { label: "Calories", value: nutrition.calories, unit: "kcal" },
    { label: "Protein", value: nutrition.protein, unit: "g" },
    { label: "Carbohydrates", value: nutrition.carbs, unit: "g" },
    { label: "Fat", value: nutrition.fat, unit: "g" }
  ];

  let rowsHtml = "";
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const totalValue = row.value * currentServings;
    rowsHtml += `
      <tr>
        <td>${row.label}</td>
        <td>${formatNumber(row.value)} ${row.unit}</td>
        <td>${formatNumber(totalValue)} ${row.unit}</td>
      </tr>
    `;
  }

  nutritionBody.innerHTML = rowsHtml;
  nutritionTotalHeading.textContent = "For " + getServingsLabel(currentServings);
}

// ==========================================================================
// 7. Serving Scaler (the + and - buttons)
// ==========================================================================

// Show a red error message under the scaler (Error state of the prototype)
function showServingsError(message) {
  servingsError.textContent = "⚠ " + message;
  servingsError.classList.remove("d-none");
}

// Hide the error message
function hideServingsError() {
  servingsError.classList.add("d-none");
}

// Refresh everything that depends on the number of servings
function updateServingsDisplay() {
  servingsText.textContent = getServingsLabel(currentServings);
  ingredientsTab.textContent = "Ingredients (" + getServingsLabel(currentServings) + ")";
  renderIngredients();
  renderNutrition();
}

// Add or remove servings. change is +1 or -1
function changeServings(change) {
  const newServings = currentServings + change;

  if (newServings < MIN_SERVINGS) {
    showServingsError("Error: Minimum " + MIN_SERVINGS + " serving required");
    return;
  }
  if (newServings > MAX_SERVINGS) {
    showServingsError("Error: Maximum " + MAX_SERVINGS + " servings allowed");
    return;
  }

  currentServings = newServings;
  hideServingsError();
  updateServingsDisplay();
}

// ==========================================================================
// 8. Tabs (Ingredients / Instructions / Nutrition)
// ==========================================================================

// Show the chosen tab panel and hide the other two
function showTab(tabName) {
  for (let i = 0; i < tabButtons.length; i++) {
    const isActive = tabButtons[i].getAttribute("data-tab") === tabName;
    tabButtons[i].classList.toggle("active", isActive);
    tabButtons[i].setAttribute("aria-selected", String(isActive));
  }

  for (let i = 0; i < tabPanels.length; i++) {
    const isChosen = tabPanels[i].getAttribute("data-panel") === tabName;
    tabPanels[i].classList.toggle("d-none", !isChosen);
  }
}

// ==========================================================================
// 9. Save Recipe (stores the recipe and the chosen servings)
// ==========================================================================

// Show "Save Recipe" or "Saved" on the button depending on localStorage
function updateSaveButton() {
  const isSaved = getSavedRecipeIds().includes(currentRecipe.id);

  if (isSaved) {
    saveBtn.textContent = "♥ Saved (update servings)";
    saveBtn.classList.add("saved");
  } else {
    saveBtn.textContent = "♡ Save Recipe";
    saveBtn.classList.remove("saved");
  }
}

// Save the recipe id and the chosen servings, then show the confirmation
function saveCurrentRecipe() {
  const savedIds = getSavedRecipeIds();
  if (!savedIds.includes(currentRecipe.id)) {
    savedIds.push(currentRecipe.id);
    saveRecipeIds(savedIds);
  }

  const servingsMap = getSavedServingsMap();
  servingsMap[currentRecipe.id] = currentServings;
  saveServingsMap(servingsMap);

  updateSavedBadge();
  updateSaveButton();

  saveOverlayText.textContent = "Saved " + currentServings + "-serving recipe to Recipe Jar!";
  openOverlay(saveOverlay, backToRecipeBtn);
}

// ==========================================================================
// 10. Pop-ups and Cooking Mode
// ==========================================================================

// Show a pop-up and move the keyboard focus to its main button
function openOverlay(overlay, buttonToFocus) {
  overlay.classList.remove("d-none");
  buttonToFocus.focus();
}

// Hide a pop-up and return the keyboard focus to the page button
function closeOverlay(overlay, buttonToFocus) {
  overlay.classList.add("d-none");
  buttonToFocus.focus();
}

// Show the current cooking step and update the Previous / Next buttons
function showCookingStep() {
  const totalSteps = currentRecipe.steps.length;
  cookingProgress.textContent = "Step " + (currentStepIndex + 1) + " of " + totalSteps;
  cookingStepText.textContent = currentRecipe.steps[currentStepIndex];
  prevStepBtn.disabled = currentStepIndex === 0;

  if (currentStepIndex === totalSteps - 1) {
    nextStepBtn.textContent = "Finish";
  } else {
    nextStepBtn.textContent = "Next";
  }
}

// Open cooking mode at step 1
function startCookingMode() {
  currentStepIndex = 0;
  showCookingStep();
  openOverlay(cookingOverlay, nextStepBtn);
}

// Go to the next step, or close cooking mode after the last step
function goToNextStep() {
  if (currentStepIndex === currentRecipe.steps.length - 1) {
    closeOverlay(cookingOverlay, cookingBtn);
    return;
  }
  currentStepIndex = currentStepIndex + 1;
  showCookingStep();
}

// Go back to the previous step
function goToPreviousStep() {
  if (currentStepIndex > 0) {
    currentStepIndex = currentStepIndex - 1;
    showCookingStep();
  }
}

// ==========================================================================
// 11. Page Initialization & Event Listeners
// ==========================================================================

// Set up the page: find the recipe, draw it and connect all buttons
function initRecipePage() {
  updateSavedBadge();

  currentRecipe = findRecipeById(getRecipeIdFromUrl());

  // If the id is wrong or missing, show the "Recipe not found" message
  if (currentRecipe === null) {
    recipeContent.classList.add("d-none");
    notFound.classList.remove("d-none");
    return;
  }

  // If this recipe was saved before, start with the servings the user saved
  const isSaved = getSavedRecipeIds().includes(currentRecipe.id);
  const rememberedServings = Number(getSavedServingsMap()[currentRecipe.id]);
  if (isSaved && rememberedServings >= MIN_SERVINGS && rememberedServings <= MAX_SERVINGS) {
    currentServings = rememberedServings;
  }

  showRecipeDetails();
  renderInstructions();
  updateServingsDisplay();
  updateSaveButton();

  // Serving scaler buttons
  decreaseBtn.addEventListener("click", function () {
    changeServings(-1);
  });
  increaseBtn.addEventListener("click", function () {
    changeServings(1);
  });

  // Tab buttons
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener("click", function () {
      showTab(this.getAttribute("data-tab"));
    });
  }

  // Save button and its confirmation pop-up
  saveBtn.addEventListener("click", saveCurrentRecipe);
  backToRecipeBtn.addEventListener("click", function () {
    closeOverlay(saveOverlay, saveBtn);
  });

  // Cooking mode buttons
  cookingBtn.addEventListener("click", startCookingMode);
  nextStepBtn.addEventListener("click", goToNextStep);
  prevStepBtn.addEventListener("click", goToPreviousStep);
  exitCookingBtn.addEventListener("click", function () {
    closeOverlay(cookingOverlay, cookingBtn);
  });

  // Pressing Escape closes whichever pop-up is open
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }
    if (!saveOverlay.classList.contains("d-none")) {
      closeOverlay(saveOverlay, saveBtn);
    }
    if (!cookingOverlay.classList.contains("d-none")) {
      closeOverlay(cookingOverlay, cookingBtn);
    }
  });
}

initRecipePage();
