// ==========================================================================
// 1. Recipe Data Array (12 Realistic Recipes)
// ==========================================================================
const recipes = [
  {
    id: 1,
    title: "Chicken Karahi",
    cuisine: "Pakistani",
    category: "Dinner",
    prepTime: 45,
    rating: 4.9,
    reviews: 128,
    image: "../images/chicken-karahi.jpg",
    alt: "Chicken Karahi in a serving dish garnished with ginger and coriander"
  },
  {
    id: 2,
    title: "Aloo Paratha",
    cuisine: "Breakfast",
    category: "Breakfast",
    prepTime: 30,
    rating: 4.6,
    reviews: 84,
    image: "../images/aloo-paratha.jpg",
    alt: "Crispy golden Aloo Paratha served with yogurt and pickle"
  },
  {
    id: 3,
    title: "Beef Biryani",
    cuisine: "Pakistani",
    category: "Dinner",
    prepTime: 60,
    rating: 4.8,
    reviews: 152,
    image: "../images/beef-biryani.jpg",
    alt: "Fragrant Beef Biryani topped with fried onions and fresh mint"
  },
  {
    id: 4,
    title: "Palak Paneer",
    cuisine: "Desi",
    category: "Desi",
    prepTime: 35,
    rating: 4.7,
    reviews: 76,
    image: "../images/palak-paneer.jpg",
    alt: "Creamy green Palak Paneer curry in a ceramic bowl"
  },
  {
    id: 5,
    title: "Masala Omelette",
    cuisine: "Breakfast",
    category: "Breakfast",
    prepTime: 15,
    rating: 4.8,
    reviews: 95,
    image: "../images/masala-omelette.jpg",
    alt: "Fluffy Masala Omelette with diced tomatoes, onions, and herbs"
  },
  {
    id: 6,
    title: "Gulab Jamun",
    cuisine: "Dessert",
    category: "Dessert",
    prepTime: 40,
    rating: 4.9,
    reviews: 140,
    image: "../images/gulab-jamun.jpg",
    alt: "Warm Gulab Jamun dumplings soaked in syrup with pistachios"
  },
  {
    id: 7,
    title: "Seekh Kebab",
    cuisine: "Pakistani",
    category: "Dinner",
    prepTime: 35,
    rating: 4.7,
    reviews: 64,
    image: "../images/placeholder.svg",
    alt: "Recipe Jar placeholder illustration for Seekh Kebab"
  },
  {
    id: 8,
    title: "Daal Chawal",
    cuisine: "Desi",
    category: "Desi",
    prepTime: 40,
    rating: 4.6,
    reviews: 110,
    image: "../images/placeholder.svg",
    alt: "Recipe Jar placeholder illustration for Daal Chawal"
  },
  {
    id: 9,
    title: "Halwa Puri",
    cuisine: "Breakfast",
    category: "Breakfast",
    prepTime: 50,
    rating: 4.8,
    reviews: 89,
    image: "../images/placeholder.svg",
    alt: "Recipe Jar placeholder illustration for Halwa Puri"
  },
  {
    id: 10,
    title: "Kheer",
    cuisine: "Dessert",
    category: "Dessert",
    prepTime: 55,
    rating: 4.7,
    reviews: 71,
    image: "../images/placeholder.svg",
    alt: "Recipe Jar placeholder illustration for Kheer"
  },
  {
    id: 11,
    title: "Chicken Pasta",
    cuisine: "Continental",
    category: "Dinner",
    prepTime: 25,
    rating: 4.5,
    reviews: 58,
    image: "../images/placeholder.svg",
    alt: "Recipe Jar placeholder illustration for Chicken Pasta"
  },
  {
    id: 12,
    title: "Chapli Kebab",
    cuisine: "Pakistani",
    category: "Dinner",
    prepTime: 25,
    rating: 4.8,
    reviews: 93,
    image: "../images/placeholder.svg",
    alt: "Recipe Jar placeholder illustration for Chapli Kebab"
  }
];

// ==========================================================================
// 2. DOM Element References & Storage Keys
// ==========================================================================
const SAVED_STORAGE_KEY = "savedRecipes";
const FILTER_STORAGE_KEY = "browseFilters";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const cuisineFilter = document.getElementById("cuisineFilter");
const timeFilter = document.getElementById("timeFilter");
const sortSelect = document.getElementById("sortSelect");
const applyBtn = document.getElementById("applyBtn");
const clearBtn = document.getElementById("clearBtn");
const emptyClearBtn = document.getElementById("emptyClearBtn");
const resultsCount = document.getElementById("resultsCount");
const recipeGrid = document.getElementById("recipeGrid");
const emptyState = document.getElementById("emptyState");
const savedCountBadge = document.getElementById("savedCountBadge");
const chipButtons = document.querySelectorAll(".chip-btn");

// ==========================================================================
// 3. LocalStorage Helper Functions (Safe Read / Write)
// ==========================================================================

// Safely read the list of saved recipe IDs from localStorage
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

// Save the updated list of saved recipe IDs into localStorage
function saveRecipeIds(ids) {
  localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(ids));
}

// Safely read previously remembered filter settings from localStorage
function getSavedFilters() {
  const defaultFilters = {
    search: "",
    cuisine: "All",
    time: "any",
    sort: "rating"
  };

  try {
    const raw = localStorage.getItem(FILTER_STORAGE_KEY);
    if (!raw) {
      return defaultFilters;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return defaultFilters;
    }
    return {
      search: typeof parsed.search === "string" ? parsed.search : "",
      cuisine: typeof parsed.cuisine === "string" ? parsed.cuisine : "All",
      time: typeof parsed.time === "string" ? parsed.time : "any",
      sort: typeof parsed.sort === "string" ? parsed.sort : "rating"
    };
  } catch (error) {
    return defaultFilters;
  }
}

// Save current search, cuisine, prep time, and sort choices to localStorage
function saveCurrentFilters() {
  const currentFilters = {
    search: searchInput.value,
    cuisine: cuisineFilter.value,
    time: timeFilter.value,
    sort: sortSelect.value
  };
  localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(currentFilters));
}

// ==========================================================================
// 4. Filter, Sort & Render Functions
// ==========================================================================

// Remove extra spaces and convert text to lowercase without using regex
function cleanSearchText(text) {
  const parts = text.trim().toLowerCase().split(" ");
  const words = parts.filter(function (word) {
    return word !== "";
  });
  return words.join(" ");
}

// Check if a recipe matches the chosen prep time dropdown option
function matchesPrepTime(prepTime, selectedRange) {
  if (selectedRange === "under30") {
    return prepTime < 30;
  }
  if (selectedRange === "30to45") {
    return prepTime >= 30 && prepTime <= 45;
  }
  if (selectedRange === "over45") {
    return prepTime > 45;
  }
  return true;
}

// Filter the global recipes array using keyword, cuisine, and prep time
function filterRecipes() {
  const keyword = cleanSearchText(searchInput.value);
  const selectedCuisine = cuisineFilter.value;
  const selectedTime = timeFilter.value;

  return recipes.filter(function (recipe) {
    const titleLower = recipe.title.toLowerCase();
    const matchesKeyword = keyword === "" || titleLower.includes(keyword);
    const matchesCuisine = selectedCuisine === "All" || recipe.cuisine === selectedCuisine;
    const matchesTime = matchesPrepTime(recipe.prepTime, selectedTime);

    return matchesKeyword && matchesCuisine && matchesTime;
  });
}

// Return a new sorted array based on the selected sort option
function sortRecipes(recipeList) {
  const sortedList = recipeList.slice();
  const sortBy = sortSelect.value;

  sortedList.sort(function (a, b) {
    if (sortBy === "time") {
      return a.prepTime - b.prepTime;
    }
    if (sortBy === "az") {
      return a.title.localeCompare(b.title);
    }
    // Default: Top Rated (highest rating first, then most reviews)
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    return b.reviews - a.reviews;
  });

  return sortedList;
}

// Highlight the mobile category chip that matches the Cuisine dropdown
function syncMobileChips() {
  const activeCuisine = cuisineFilter.value;
  for (let i = 0; i < chipButtons.length; i++) {
    const chip = chipButtons[i];
    const isMatch = chip.getAttribute("data-category") === activeCuisine;
    if (isMatch) {
      chip.classList.add("active");
      chip.setAttribute("aria-pressed", "true");
    } else {
      chip.classList.remove("active");
      chip.setAttribute("aria-pressed", "false");
    }
  }
}

// Update the Saved counter badge in the site header
function updateSavedBadge() {
  const savedIds = getSavedRecipeIds();
  savedCountBadge.textContent = String(savedIds.length);
}

// Toggle a recipe ID in the savedRecipes list and refresh the UI
function toggleSavedRecipe(recipeId) {
  const savedIds = getSavedRecipeIds();
  const index = savedIds.indexOf(recipeId);

  if (index === -1) {
    savedIds.push(recipeId);
  } else {
    savedIds.splice(index, 1);
  }

  saveRecipeIds(savedIds);
  updateSavedBadge();
  applyFiltersAndRender();
}

// Build and insert the recipe cards into the Bootstrap grid
function renderRecipes(recipeList) {
  const savedIds = getSavedRecipeIds();
  resultsCount.textContent = `Showing ${recipeList.length} of ${recipes.length} recipes`;

  if (recipeList.length === 0) {
    recipeGrid.innerHTML = "";
    emptyState.classList.remove("d-none");
    return;
  }

  emptyState.classList.add("d-none");

  const cardHtmlList = recipeList.map(function (recipe) {
    const isSaved = savedIds.includes(recipe.id);
    const heartSymbol = isSaved ? "♥" : "♡";
    const heartClass = isSaved ? "heart-btn saved" : "heart-btn";
    const heartLabel = isSaved ? `Remove ${recipe.title} from saved` : `Save ${recipe.title}`;
    const detailsUrl = `recipe-details.html?id=${recipe.id}`;

    return `
      <div class="col-12 col-md-6 col-lg-3">
        <article class="recipe-card">
          <div class="card-image-wrap">
            <a href="${detailsUrl}" class="recipe-img-link">
              <img
                src="${recipe.image}"
                alt="${recipe.alt}"
                class="recipe-img"
                onerror="this.onerror=null; this.src='../images/placeholder.svg';"
              >
            </a>
            <button
              type="button"
              class="${heartClass}"
              data-id="${recipe.id}"
              aria-label="${heartLabel}"
              aria-pressed="${isSaved}"
            >${heartSymbol}</button>
          </div>
          <div class="recipe-card-body">
            <h2 class="recipe-title">
              <a href="${detailsUrl}" class="recipe-title-link">${recipe.title}</a>
            </h2>
            <p class="recipe-meta">${recipe.prepTime} min | ${recipe.rating} ★</p>
            <span class="cuisine-badge">${recipe.cuisine}</span>
          </div>
        </article>
      </div>
    `;
  });

  recipeGrid.innerHTML = cardHtmlList.join("");

  // Attach click listeners to each newly created heart button
  const heartButtons = recipeGrid.querySelectorAll(".heart-btn");
  for (let i = 0; i < heartButtons.length; i++) {
    heartButtons[i].addEventListener("click", function () {
      const id = Number(this.getAttribute("data-id"));
      toggleSavedRecipe(id);
    });
  }
}

// Main flow: read inputs -> filter array -> sort array -> draw cards
function applyFiltersAndRender() {
  syncMobileChips();
  saveCurrentFilters();
  const filtered = filterRecipes();
  const sorted = sortRecipes(filtered);
  renderRecipes(sorted);
}

// Reset all search, filter, and sort inputs back to default values
function clearAllFilters() {
  searchInput.value = "";
  cuisineFilter.value = "All";
  timeFilter.value = "any";
  sortSelect.value = "rating";
  applyFiltersAndRender();
}

// ==========================================================================
// 5. Event Listeners & Page Initialization
// ==========================================================================

// Restore saved filters into the form inputs when the page loads
function loadSavedFiltersIntoInputs() {
  const savedFilters = getSavedFilters();
  searchInput.value = savedFilters.search;
  cuisineFilter.value = savedFilters.cuisine;
  timeFilter.value = savedFilters.time;
  sortSelect.value = savedFilters.sort;
}

// Set up all button, keyboard, and mobile chip event listeners
function initBrowsePage() {
  loadSavedFiltersIntoInputs();
  updateSavedBadge();
  applyFiltersAndRender();

  searchBtn.addEventListener("click", applyFiltersAndRender);
  applyBtn.addEventListener("click", applyFiltersAndRender);
  clearBtn.addEventListener("click", clearAllFilters);
  emptyClearBtn.addEventListener("click", clearAllFilters);

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      applyFiltersAndRender();
    }
  });

  for (let i = 0; i < chipButtons.length; i++) {
    chipButtons[i].addEventListener("click", function () {
      const chosenCategory = this.getAttribute("data-category");
      cuisineFilter.value = chosenCategory;
      applyFiltersAndRender();
    });
  }
}

initBrowsePage();
