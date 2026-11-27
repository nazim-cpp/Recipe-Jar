/* ==========================================================================
   Recipe Jar — Home Page Logic (js/home.js)
   Handles dynamic rendering of recipe cards, live search, category filtering,
   sorting, favourite toggling with localStorage persistence, and toast notices.
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "recipeJar_saved";

  // DOM element references
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const categoryChips = document.getElementById("categoryChips");
  const sortSelect = document.getElementById("sortSelect");
  const recipeGrid = document.getElementById("recipeGrid");
  const recipeCount = document.getElementById("recipeCount");
  const toastEl = document.getElementById("toast");

  // Application state
  let selectedCategory = "All";
  let searchQuery = "";
  let sortBy = "top-rated";
  let savedIds = loadSavedIds();
  let toastTimer = null;

  /* --------------------------------------------------------------------------
     LocalStorage Helpers (wrapped in try/catch for safety)
     -------------------------------------------------------------------------- */
  function loadSavedIds() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function persistSavedIds(ids) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      // Ignore storage errors (e.g., private browsing or blocked storage)
    }
  }

  /* --------------------------------------------------------------------------
     Formatting & Normalization Helpers
     -------------------------------------------------------------------------- */
  function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;

    if (hours === 0) {
      return remainingMins + " min";
    }
    if (remainingMins === 0) {
      return hours + " hr";
    }
    return hours + " hr " + remainingMins + " min";
  }

  function normalizeText(text) {
    return text.trim().toLowerCase().replace(/\s+/g, " ");
  }

  /* --------------------------------------------------------------------------
     Toast Notification Helper
     -------------------------------------------------------------------------- */
  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");

    if (toastTimer !== null) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
      toastTimer = null;
    }, 2000);
  }

  /* --------------------------------------------------------------------------
     Filter + Sort Logic
     -------------------------------------------------------------------------- */
  function getVisibleRecipes() {
    const cleanQuery = normalizeText(searchQuery);

    const filtered = recipes.filter(function (recipe) {
      // 1. Check category match
      const matchesCategory =
        selectedCategory === "All" || recipe.category === selectedCategory;

      if (!matchesCategory) {
        return false;
      }

      // 2. Check search query match (name or ingredients)
      if (cleanQuery === "") {
        return true;
      }

      const nameMatches = recipe.name.toLowerCase().includes(cleanQuery);
      const ingredientMatches = recipe.ingredients.some(function (ingredient) {
        return ingredient.toLowerCase().includes(cleanQuery);
      });

      return nameMatches || ingredientMatches;
    });

    // 3. Sort a copy of the filtered array
    const sorted = filtered.slice();

    if (sortBy === "top-rated") {
      sorted.sort(function (a, b) {
        return b.rating - a.rating || a.time - b.time;
      });
    } else if (sortBy === "quickest") {
      sorted.sort(function (a, b) {
        return a.time - b.time || b.rating - a.rating;
      });
    } else if (sortBy === "name-az") {
      sorted.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }

    return sorted;
  }

  /* --------------------------------------------------------------------------
     DOM Creation for Cards and Empty State
     -------------------------------------------------------------------------- */
  function createHeartIcon() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute(
      "d",
      "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
    );

    svg.appendChild(path);
    return svg;
  }

  function createRecipeCard(recipe) {
    const isSaved = savedIds.includes(recipe.id);

    const card = document.createElement("article");
    card.className = "recipe-card";

    // Image wrapper (contains image, placeholder fallback, heart button, time badge)
    const imgWrap = document.createElement("div");
    imgWrap.className = "recipe-img-wrap";

    const img = document.createElement("img");
    img.className = "recipe-img";
    img.src = recipe.image;
    img.alt = recipe.alt;
    img.loading = "lazy";

    // Show neutral placeholder background if image is missing or fails to load
    img.onerror = function () {
      img.style.display = "none";
      imgWrap.classList.add("img-fallback");
    };

    const placeholder = document.createElement("div");
    placeholder.className = "recipe-img-placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    placeholder.textContent = recipe.name;

    // Favourite heart button (top-left)
    const favBtn = document.createElement("button");
    favBtn.type = "button";
    favBtn.className = isSaved ? "fav-btn is-saved" : "fav-btn";
    favBtn.dataset.recipeId = String(recipe.id);
    favBtn.setAttribute("aria-pressed", String(isSaved));
    favBtn.setAttribute(
      "aria-label",
      isSaved ? "Remove " + recipe.name + " from Saved" : "Save " + recipe.name
    );
    favBtn.appendChild(createHeartIcon());

    // Cook-time badge (top-right)
    const timeBadge = document.createElement("span");
    timeBadge.className = "time-badge";
    timeBadge.textContent = formatTime(recipe.time);

    imgWrap.appendChild(img);
    imgWrap.appendChild(placeholder);
    imgWrap.appendChild(favBtn);
    imgWrap.appendChild(timeBadge);

    // Card body (rating, category tag, recipe name, View Recipe button)
    const body = document.createElement("div");
    body.className = "recipe-body";

    const meta = document.createElement("div");
    meta.className = "recipe-meta";

    const rating = document.createElement("span");
    rating.className = "recipe-rating";
    rating.textContent = recipe.rating.toFixed(1) + " ★";

    const categoryTag = document.createElement("span");
    categoryTag.className = "recipe-category";
    categoryTag.textContent = recipe.category;

    meta.appendChild(rating);
    meta.appendChild(categoryTag);

    const title = document.createElement("h3");
    title.className = "recipe-title";
    title.textContent = recipe.name;

    const viewLink = document.createElement("a");
    viewLink.className = "view-recipe-btn";
    viewLink.href = "pages/recipe.html?id=" + encodeURIComponent(recipe.id);
    viewLink.textContent = "View Recipe";

    body.appendChild(meta);
    body.appendChild(title);
    body.appendChild(viewLink);

    card.appendChild(imgWrap);
    card.appendChild(body);

    return card;
  }

  function createEmptyState() {
    const box = document.createElement("div");
    box.className = "empty-state";

    const message = document.createElement("p");
    message.className = "empty-state-message";

    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery !== "") {
      message.textContent =
        "No recipes found for '" +
        trimmedQuery +
        "'. Try another dish or ingredient.";
    } else {
      message.textContent =
        "No recipes found in this category. Try another filter.";
    }

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "clear-search-btn";
    clearBtn.textContent = "Clear search";

    box.appendChild(message);
    box.appendChild(clearBtn);

    return box;
  }

  /* --------------------------------------------------------------------------
     Main Render Function
     -------------------------------------------------------------------------- */
  function renderRecipes() {
    const visibleRecipes = getVisibleRecipes();
    const count = visibleRecipes.length;

    recipeCount.textContent =
      "Showing " + count + (count === 1 ? " recipe" : " recipes");

    // Clear existing grid contents
    recipeGrid.innerHTML = "";

    if (count === 0) {
      recipeGrid.appendChild(createEmptyState());
      return;
    }

    const fragment = document.createDocumentFragment();
    visibleRecipes.forEach(function (recipe) {
      fragment.appendChild(createRecipeCard(recipe));
    });
    recipeGrid.appendChild(fragment);
  }

  /* --------------------------------------------------------------------------
     Reset Search & Category Helper
     -------------------------------------------------------------------------- */
  function resetFilters() {
    searchQuery = "";
    searchInput.value = "";
    selectedCategory = "All";

    const chips = categoryChips.querySelectorAll(".chip");
    chips.forEach(function (chip) {
      const isAll = chip.dataset.category === "All";
      chip.classList.toggle("active", isAll);
      chip.setAttribute("aria-pressed", String(isAll));
    });

    renderRecipes();
  }

  /* --------------------------------------------------------------------------
     Event Listeners
     -------------------------------------------------------------------------- */

  // Live search as user types
  searchInput.addEventListener("input", function () {
    searchQuery = searchInput.value;
    renderRecipes();
  });

  // Search form submit (Enter key or search button click)
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchQuery = searchInput.value;
    renderRecipes();
  });

  // Category chip selection
  categoryChips.addEventListener("click", function (event) {
    const clickedChip = event.target.closest(".chip");
    if (!clickedChip) {
      return;
    }

    selectedCategory = clickedChip.dataset.category;

    const chips = categoryChips.querySelectorAll(".chip");
    chips.forEach(function (chip) {
      const isActive = chip === clickedChip;
      chip.classList.toggle("active", isActive);
      chip.setAttribute("aria-pressed", String(isActive));
    });

    renderRecipes();
  });

  // Sort dropdown change
  sortSelect.addEventListener("change", function () {
    sortBy = sortSelect.value;
    renderRecipes();
  });

  // Event delegation for heart buttons and "Clear search" button inside grid
  recipeGrid.addEventListener("click", function (event) {
    const clearBtn = event.target.closest(".clear-search-btn");
    if (clearBtn) {
      resetFilters();
      return;
    }

    const favBtn = event.target.closest(".fav-btn");
    if (!favBtn) {
      return;
    }

    const recipeId = Number(favBtn.dataset.recipeId);
    const recipe = recipes.find(function (item) {
      return item.id === recipeId;
    });

    if (!recipe) {
      return;
    }

    const existingIndex = savedIds.indexOf(recipeId);
    let nowSaved = false;

    if (existingIndex === -1) {
      savedIds.push(recipeId);
      nowSaved = true;
      showToast("Added to Saved");
    } else {
      savedIds.splice(existingIndex, 1);
      nowSaved = false;
      showToast("Removed from Saved");
    }

    persistSavedIds(savedIds);

    favBtn.classList.toggle("is-saved", nowSaved);
    favBtn.setAttribute("aria-pressed", String(nowSaved));
    favBtn.setAttribute(
      "aria-label",
      nowSaved ? "Remove " + recipe.name + " from Saved" : "Save " + recipe.name
    );
  });

  // Initial render when page loads
  renderRecipes();
})();
