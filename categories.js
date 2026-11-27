/* ==========================================================================
   Recipe Jar — Cuisine & Category Explorer Logic (js/categories.js)
   Handles tabs (By Category / By Cuisine), dynamic recipe counts and stats,
   filter chips, tile grid, time & sort filters, URL query parameters,
   and shared localStorage favourites.
   ========================================================================== */

(function () {
  "use strict";

  const SAVED_KEY = "recipeJar_saved";
  const TAB_STORAGE_KEY = "recipeJar_explorerTab";

  // DOM References
  const tabCategory = document.getElementById("tabCategory");
  const tabCuisine = document.getElementById("tabCuisine");
  const explorerPanel = document.getElementById("explorerPanel");
  const urlNotice = document.getElementById("urlNotice");
  const urlNoticeText = document.getElementById("urlNoticeText");
  const dismissNoticeBtn = document.getElementById("dismissNoticeBtn");
  const filterChips = document.getElementById("filterChips");
  const tileGrid = document.getElementById("tileGrid");
  const resultsSection = document.getElementById("resultsSection");
  const resultsHeading = document.getElementById("resultsHeading");
  const resultsStats = document.getElementById("resultsStats");
  const backToAllBtn = document.getElementById("backToAllBtn");
  const resultsAnnouncer = document.getElementById("resultsAnnouncer");
  const timeFilter = document.getElementById("timeFilter");
  const sortSelect = document.getElementById("sortSelect");
  const recipeGrid = document.getElementById("recipeGrid");
  const toastEl = document.getElementById("toast");

  // Application State
  let activeTab = "category";     // "category" | "cuisine"
  let selectedItem = "All";       // "All" or a specific category / cuisine name
  let maxTime = "all";            // "all" | "15" | "30" | "60"
  let sortBy = "top-rated";       // "top-rated" | "quickest" | "name-az"
  let savedIds = loadSavedIds();
  let toastTimer = null;

  /* --------------------------------------------------------------------------
     Safe LocalStorage Helpers
     -------------------------------------------------------------------------- */
  function loadSavedIds() {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
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
      localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
    } catch (error) {
      // Ignore storage errors (blocked or quota exceeded)
    }
  }

  function loadStoredTab() {
    try {
      const saved = localStorage.getItem(TAB_STORAGE_KEY);
      return saved === "cuisine" ? "cuisine" : "category";
    } catch (error) {
      return "category";
    }
  }

  function saveStoredTab(tabName) {
    try {
      localStorage.setItem(TAB_STORAGE_KEY, tabName);
    } catch (error) {
      // Ignore storage errors
    }
  }

  /* --------------------------------------------------------------------------
     Formatting & Calculation Helpers
     -------------------------------------------------------------------------- */
  function resolveImagePath(path) {
    if (!path) {
      return "";
    }
    return path.indexOf("../") === 0 ? path : "../" + path;
  }

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

  function formatCountLabel(count) {
    if (count === 0) {
      return "No recipes yet";
    }
    return count + (count === 1 ? " Recipe" : " Recipes");
  }

  function getActiveGroupList() {
    return activeTab === "cuisine" ? cuisines : categories;
  }

  function getRecipesForItem(tabName, itemName) {
    return recipes.filter(function (recipe) {
      if (tabName === "cuisine") {
        return recipe.cuisine.toLowerCase() === itemName.toLowerCase();
      }
      return recipe.category.toLowerCase() === itemName.toLowerCase();
    });
  }

  function findGroupCaseInsensitive(tabName, rawName) {
    const list = tabName === "cuisine" ? cuisines : categories;
    const target = rawName.trim().toLowerCase();
    return list.find(function (entry) {
      return entry.name.toLowerCase() === target;
    }) || null;
  }

  function calculateStats(items) {
    if (items.length === 0) {
      return { avgRating: null, avgTime: null };
    }
    let totalRating = 0;
    let totalTime = 0;
    items.forEach(function (recipe) {
      totalRating += recipe.rating;
      totalTime += recipe.time;
    });
    return {
      avgRating: (totalRating / items.length).toFixed(1),
      avgTime: Math.round(totalTime / items.length)
    };
  }

  /* --------------------------------------------------------------------------
     URL Sync (history.replaceState)
     -------------------------------------------------------------------------- */
  function syncUrlState() {
    if (!window.history || typeof window.history.replaceState !== "function") {
      return;
    }

    const params = new URLSearchParams();
    if (selectedItem !== "All") {
      params.set(activeTab, selectedItem);
    } else if (activeTab === "cuisine") {
      params.set("tab", "cuisine");
    }

    if (maxTime !== "all") {
      params.set("time", maxTime);
    }
    if (sortBy !== "top-rated") {
      params.set("sort", sortBy);
    }

    const queryString = params.toString();
    const newUrl = window.location.pathname + (queryString ? "?" + queryString : "");
    window.history.replaceState(null, "", newUrl);
  }

  function initStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    const cuisineParam = params.get("cuisine");
    const tabParam = params.get("tab");
    const timeParam = params.get("time");
    const sortParam = params.get("sort");

    if (timeParam === "15" || timeParam === "30" || timeParam === "60") {
      maxTime = timeParam;
      timeFilter.value = timeParam;
    }

    if (sortParam === "top-rated" || sortParam === "quickest" || sortParam === "name-az") {
      sortBy = sortParam;
      sortSelect.value = sortParam;
    }

    if (categoryParam !== null) {
      activeTab = "category";
      saveStoredTab("category");
      const matched = findGroupCaseInsensitive("category", categoryParam);
      if (matched) {
        selectedItem = matched.name;
      } else {
        selectedItem = "All";
        showUrlNotice("Category not found, showing all categories.");
      }
      return;
    }

    if (cuisineParam !== null) {
      activeTab = "cuisine";
      saveStoredTab("cuisine");
      const matched = findGroupCaseInsensitive("cuisine", cuisineParam);
      if (matched) {
        selectedItem = matched.name;
      } else {
        selectedItem = "All";
        showUrlNotice("Cuisine not found, showing all cuisines.");
      }
      return;
    }

    if (tabParam === "cuisine" || tabParam === "category") {
      activeTab = tabParam;
      saveStoredTab(tabParam);
      return;
    }

    activeTab = loadStoredTab();
  }

  function showUrlNotice(message) {
    urlNoticeText.textContent = message;
    urlNotice.classList.remove("hidden");
  }

  /* --------------------------------------------------------------------------
     Toast Notification Helper (matches home.js)
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
     Rendering: Tabs, Chips, Tiles
     -------------------------------------------------------------------------- */
  function renderTabs() {
    const isCategory = activeTab === "category";

    tabCategory.classList.toggle("active", isCategory);
    tabCategory.setAttribute("aria-selected", String(isCategory));
    tabCategory.setAttribute("tabindex", isCategory ? "0" : "-1");

    tabCuisine.classList.toggle("active", !isCategory);
    tabCuisine.setAttribute("aria-selected", String(!isCategory));
    tabCuisine.setAttribute("tabindex", !isCategory ? "0" : "-1");

    explorerPanel.setAttribute(
      "aria-labelledby",
      isCategory ? "tabCategory" : "tabCuisine"
    );
  }

  function renderChips() {
    const groups = getActiveGroupList();
    filterChips.innerHTML = "";

    const fragment = document.createDocumentFragment();

    // "All" chip first
    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = selectedItem === "All" ? "chip active" : "chip";
    allBtn.dataset.item = "All";
    allBtn.setAttribute("aria-pressed", String(selectedItem === "All"));
    allBtn.textContent = "All";
    fragment.appendChild(allBtn);

    groups.forEach(function (group) {
      const isActive = selectedItem === group.name;
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = isActive ? "chip active" : "chip";
      chip.dataset.item = group.name;
      chip.setAttribute("aria-pressed", String(isActive));
      chip.textContent = group.name;
      fragment.appendChild(chip);
    });

    filterChips.appendChild(fragment);
  }

  function renderTiles() {
    const groups = getActiveGroupList();
    tileGrid.innerHTML = "";

    const fragment = document.createDocumentFragment();

    groups.forEach(function (group) {
      const matchingRecipes = getRecipesForItem(activeTab, group.name);
      const count = matchingRecipes.length;
      const isSelected = selectedItem === group.name;

      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = isSelected ? "category-tile is-selected" : "category-tile";
      tile.dataset.item = group.name;
      tile.setAttribute("aria-pressed", String(isSelected));

      const imgWrap = document.createElement("div");
      imgWrap.className = "tile-img-wrap";

      const img = document.createElement("img");
      img.className = "tile-img";
      img.src = resolveImagePath(group.image);
      img.alt = group.alt;
      img.loading = "lazy";
      img.onerror = function () {
        img.style.display = "none";
        imgWrap.classList.add("img-fallback");
      };

      const placeholder = document.createElement("div");
      placeholder.className = "tile-img-placeholder";
      placeholder.setAttribute("aria-hidden", "true");
      placeholder.textContent = group.name;

      imgWrap.appendChild(img);
      imgWrap.appendChild(placeholder);

      const body = document.createElement("div");
      body.className = "tile-body";

      const headerRow = document.createElement("div");
      headerRow.className = "tile-header-row";

      const title = document.createElement("h3");
      title.className = "tile-title";
      title.textContent = group.name;

      const countBadge = document.createElement("span");
      countBadge.className = "tile-count-badge";
      countBadge.textContent = formatCountLabel(count);

      headerRow.appendChild(title);
      headerRow.appendChild(countBadge);

      const desc = document.createElement("p");
      desc.className = "tile-desc";
      desc.textContent = group.description;

      body.appendChild(headerRow);
      body.appendChild(desc);

      tile.appendChild(imgWrap);
      tile.appendChild(body);
      fragment.appendChild(tile);
    });

    tileGrid.appendChild(fragment);
  }

  /* --------------------------------------------------------------------------
     Rendering: Results Section & Recipe Cards (matching home.js pattern)
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

    // Image wrapper
    const imgWrap = document.createElement("div");
    imgWrap.className = "recipe-img-wrap";

    const img = document.createElement("img");
    img.className = "recipe-img";
    img.src = resolveImagePath(recipe.image);
    img.alt = recipe.alt;
    img.loading = "lazy";
    img.onerror = function () {
      img.style.display = "none";
      imgWrap.classList.add("img-fallback");
    };

    const placeholder = document.createElement("div");
    placeholder.className = "recipe-img-placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    placeholder.textContent = recipe.name;

    // Heart button (top-left)
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

    // Time badge (top-right)
    const timeBadge = document.createElement("span");
    timeBadge.className = "time-badge";
    timeBadge.textContent = formatTime(recipe.time);

    imgWrap.appendChild(img);
    imgWrap.appendChild(placeholder);
    imgWrap.appendChild(favBtn);
    imgWrap.appendChild(timeBadge);

    // Card body
    const body = document.createElement("div");
    body.className = "recipe-body";

    const meta = document.createElement("div");
    meta.className = "recipe-meta";

    const rating = document.createElement("span");
    rating.className = "recipe-rating";
    rating.textContent = recipe.rating.toFixed(1) + " ★";

    const tags = document.createElement("div");
    tags.className = "recipe-tags";

    const cuisineTag = document.createElement("span");
    cuisineTag.className = "recipe-tag";
    cuisineTag.textContent = recipe.cuisine;

    const categoryTag = document.createElement("span");
    categoryTag.className = "recipe-tag";
    categoryTag.textContent = recipe.category;

    tags.appendChild(cuisineTag);
    tags.appendChild(categoryTag);

    meta.appendChild(rating);
    meta.appendChild(tags);

    const title = document.createElement("h3");
    title.className = "recipe-title";
    title.textContent = recipe.name;

    const viewLink = document.createElement("a");
    viewLink.className = "view-recipe-btn";
    viewLink.href = "recipe.html?id=" + encodeURIComponent(recipe.id);
    viewLink.textContent = "View Recipe";

    body.appendChild(meta);
    body.appendChild(title);
    body.appendChild(viewLink);

    card.appendChild(imgWrap);
    card.appendChild(body);

    return card;
  }

  function createEmptyCategoryState() {
    const box = document.createElement("div");
    box.className = "empty-state";

    const msg = document.createElement("p");
    msg.className = "empty-state-message";
    msg.textContent =
      "No recipes in this category yet. Be the first to submit one!";

    const submitLink = document.createElement("a");
    submitLink.className = "empty-action-btn";
    submitLink.href = "submit.html";
    submitLink.textContent = "Submit a Recipe";

    box.appendChild(msg);
    box.appendChild(submitLink);
    return box;
  }

  function createEmptyTimeFilterState(limitMinutes) {
    const box = document.createElement("div");
    box.className = "empty-state";

    const msg = document.createElement("p");
    msg.className = "empty-state-message";
    msg.textContent =
      "No recipes under " +
      limitMinutes +
      " min in " +
      selectedItem +
      ". Try a longer cook time.";

    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "empty-action-btn reset-filters-btn";
    resetBtn.textContent = "Reset filters";

    box.appendChild(msg);
    box.appendChild(resetBtn);
    return box;
  }

  function renderResults() {
    if (selectedItem === "All") {
      resultsSection.classList.add("hidden");
      recipeGrid.innerHTML = "";
      resultsAnnouncer.textContent = "";
      return;
    }

    resultsSection.classList.remove("hidden");
    backToAllBtn.textContent =
      activeTab === "cuisine"
        ? "Back to all cuisines"
        : "Back to all categories";

    const groupRecipes = getRecipesForItem(activeTab, selectedItem);
    resultsHeading.textContent =
      selectedItem + " Recipes (" + groupRecipes.length + ")";

    const stats = calculateStats(groupRecipes);
    if (groupRecipes.length > 0) {
      resultsStats.textContent =
        "Avg rating " +
        stats.avgRating +
        " ★ · Avg time " +
        formatTime(stats.avgTime);
    } else {
      resultsStats.textContent = "No recipes in this group yet";
    }

    // Apply max cook time filter
    let filtered = groupRecipes;
    if (maxTime !== "all") {
      const limit = Number(maxTime);
      filtered = groupRecipes.filter(function (recipe) {
        return recipe.time <= limit;
      });
    }

    // Apply sort
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

    resultsAnnouncer.textContent =
      "Showing " +
      sorted.length +
      (sorted.length === 1 ? " recipe" : " recipes");

    recipeGrid.innerHTML = "";

    if (groupRecipes.length === 0) {
      recipeGrid.appendChild(createEmptyCategoryState());
      return;
    }

    if (sorted.length === 0) {
      recipeGrid.appendChild(createEmptyTimeFilterState(maxTime));
      return;
    }

    const fragment = document.createDocumentFragment();
    sorted.forEach(function (recipe) {
      fragment.appendChild(createRecipeCard(recipe));
    });
    recipeGrid.appendChild(fragment);
  }

  function renderAll() {
    renderTabs();
    renderChips();
    renderTiles();
    renderResults();
    syncUrlState();
  }

  function openItemResults(itemName, shouldScroll) {
    selectedItem = itemName;
    renderChips();
    renderTiles();
    renderResults();
    syncUrlState();

    if (shouldScroll && itemName !== "All") {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      resultsHeading.focus({ preventScroll: true });
    }
  }

  function switchTab(newTab) {
    if (activeTab === newTab) {
      return;
    }
    activeTab = newTab;
    selectedItem = "All";
    saveStoredTab(newTab);
    renderAll();
  }

  /* --------------------------------------------------------------------------
     Event Listeners
     -------------------------------------------------------------------------- */
  tabCategory.addEventListener("click", function () {
    switchTab("category");
  });

  tabCuisine.addEventListener("click", function () {
    switchTab("cuisine");
  });

  // Keyboard arrow navigation between tabs
  [tabCategory, tabCuisine].forEach(function (tabEl) {
    tabEl.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const nextTab = activeTab === "category" ? "cuisine" : "category";
        switchTab(nextTab);
        (nextTab === "category" ? tabCategory : tabCuisine).focus();
      } else if (event.key === "Home") {
        event.preventDefault();
        switchTab("category");
        tabCategory.focus();
      } else if (event.key === "End") {
        event.preventDefault();
        switchTab("cuisine");
        tabCuisine.focus();
      }
    });
  });

  // Dismiss URL notice
  dismissNoticeBtn.addEventListener("click", function () {
    urlNotice.classList.add("hidden");
  });

  // Filter chips click
  filterChips.addEventListener("click", function (event) {
    const clickedChip = event.target.closest(".chip");
    if (!clickedChip) {
      return;
    }
    const chosen = clickedChip.dataset.item;
    openItemResults(chosen, chosen !== "All");
  });

  // Tile grid click
  tileGrid.addEventListener("click", function (event) {
    const clickedTile = event.target.closest(".category-tile");
    if (!clickedTile) {
      return;
    }
    openItemResults(clickedTile.dataset.item, true);
  });

  // Back to all categories / cuisines button
  backToAllBtn.addEventListener("click", function () {
    openItemResults("All", false);
    const activeChip = filterChips.querySelector('.chip[data-item="All"]');
    if (activeChip) {
      activeChip.focus();
    }
  });

  // Max cook time & sort dropdowns
  timeFilter.addEventListener("change", function () {
    maxTime = timeFilter.value;
    renderResults();
    syncUrlState();
  });

  sortSelect.addEventListener("change", function () {
    sortBy = sortSelect.value;
    renderResults();
    syncUrlState();
  });

  // Heart buttons & "Reset filters" button inside results grid
  recipeGrid.addEventListener("click", function (event) {
    const resetBtn = event.target.closest(".reset-filters-btn");
    if (resetBtn) {
      maxTime = "all";
      sortBy = "top-rated";
      timeFilter.value = "all";
      sortSelect.value = "top-rated";
      renderResults();
      syncUrlState();
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

  /* --------------------------------------------------------------------------
     Initial Setup
     -------------------------------------------------------------------------- */
  initStateFromUrl();
  renderAll();
})();
