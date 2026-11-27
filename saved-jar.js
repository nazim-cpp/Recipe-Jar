const SAVED_STORAGE_KEY = "recipeJarSaved";
const FILTER_STORAGE_KEY = "recipeJarFilter";

let activeFilter = "All Saved";
let lastRemovedRecipe = null;
let toastInstance = null;

// Read saved recipe IDs from localStorage, seeding all 12 on first visit only.
function getSavedIds() {
  try {
    const rawValue = localStorage.getItem(SAVED_STORAGE_KEY);

    // First visit: key does not exist yet, so seed with all 12 recipe IDs
    if (rawValue === null) {
      const initialIds = allRecipes.map(function (recipe) {
        return recipe.id;
      });
      saveIds(initialIds);
      return initialIds;
    }

    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch (error) {
    return [];
  }
}

// Write the array of saved recipe IDs to localStorage.
function saveIds(ids) {
  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(ids));
  } catch (error) {
    // Ignore storage errors if quota or privacy mode blocks writing
  }
}

// Return full recipe objects matching saved IDs, safely ignoring unknown IDs.
function getSavedRecipes() {
  const savedIds = getSavedIds();
  const matchedRecipes = [];

  savedIds.forEach(function (id) {
    const recipe = allRecipes.find(function (item) {
      return item.id === id;
    });
    if (recipe) {
      matchedRecipes.push(recipe);
    }
  });

  return matchedRecipes;
}

// Save the selected category filter to localStorage.
function saveActiveFilter(filterName) {
  try {
    localStorage.setItem(FILTER_STORAGE_KEY, filterName);
  } catch (error) {
    // Ignore storage errors
  }
}

// Load the previously selected category filter from localStorage.
function loadActiveFilter() {
  try {
    const storedFilter = localStorage.getItem(FILTER_STORAGE_KEY);
    if (storedFilter && typeof storedFilter === "string") {
      return storedFilter;
    }
  } catch (error) {
    // Fall back to default filter
  }
  return "All Saved";
}

// Announce status updates politely for screen reader users.
function announceStatus(message) {
  const liveRegion = document.getElementById("live-status");
  if (liveRegion) {
    liveRegion.textContent = message;
  }
}

// Update the "Saved (n)" count inside the top navigation bar.
function updateNavBadge() {
  const badge = document.getElementById("nav-saved-count");
  if (!badge) {
    return;
  }
  const count = getSavedRecipes().length;
  badge.textContent = "(" + count + ")";
}

// Build and display category filter pills dynamically from saved recipes.
function renderFilters() {
  const pillsContainer = document.getElementById("filter-pills");
  if (!pillsContainer) {
    return;
  }

  const savedRecipes = getSavedRecipes();
  pillsContainer.innerHTML = "";

  // Hide filter pills when the jar is completely empty
  if (savedRecipes.length === 0) {
    pillsContainer.classList.add("d-none");
    return;
  }
  pillsContainer.classList.remove("d-none");

  // Count how many saved recipes belong to each category
  const categoryCounts = {};
  savedRecipes.forEach(function (recipe) {
    recipe.categories.forEach(function (category) {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
  });

  // Reset to "All Saved" if the current filter no longer has any matches
  if (activeFilter !== "All Saved" && !categoryCounts[activeFilter]) {
    activeFilter = "All Saved";
    saveActiveFilter(activeFilter);
    announceStatus("No saved recipes left in that category. Showing all " + savedRecipes.length + " saved recipes.");
  }

  // Keep Breakfast and Desi near the front, followed by remaining categories
  const preferredOrder = ["Breakfast", "Desi", "Dinner", "Snacks", "Dessert"];
  const categories = Object.keys(categoryCounts).sort(function (a, b) {
    const indexA = preferredOrder.indexOf(a);
    const indexB = preferredOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    if (indexA !== -1) {
      return -1;
    }
    if (indexB !== -1) {
      return 1;
    }
    return a.localeCompare(b);
  });

  const filterList = [{ name: "All Saved", count: savedRecipes.length }];
  categories.forEach(function (category) {
    filterList.push({ name: category, count: categoryCounts[category] });
  });

  filterList.forEach(function (filterItem) {
    const button = document.createElement("button");
    button.type = "button";
    const isActive = activeFilter === filterItem.name;
    button.className = isActive ? "filter-pill active" : "filter-pill";
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
    button.textContent = filterItem.name + " (" + filterItem.count + ")";

    button.addEventListener("click", function () {
      activeFilter = filterItem.name;
      saveActiveFilter(activeFilter);
      renderFilters();
      renderCards();

      if (activeFilter === "All Saved") {
        announceStatus("Showing all " + filterItem.count + " saved recipes.");
      } else {
        announceStatus("Showing " + filterItem.count + " " + filterItem.name + " recipes.");
      }
    });

    pillsContainer.appendChild(button);
  });
}

// Create a neutral placeholder box when a recipe image is missing or fails to load.
function createImagePlaceholder(recipe) {
  const placeholder = document.createElement("div");
  placeholder.className = "img-placeholder";
  placeholder.setAttribute("aria-hidden", "true");

  const letter = document.createElement("span");
  letter.textContent = recipe.name.charAt(0).toUpperCase();

  const label = document.createElement("span");
  label.className = "img-placeholder-sub";
  label.textContent = "Recipe Jar";

  placeholder.appendChild(letter);
  placeholder.appendChild(label);
  return placeholder;
}

// Render the filtered recipe cards or show the empty-jar message.
function renderCards() {
  const grid = document.getElementById("recipe-grid");
  const emptyState = document.getElementById("empty-state");
  const emptyMessage = document.getElementById("empty-state-message");
  const emptyLink = document.getElementById("empty-state-link");

  if (!grid || !emptyState) {
    return;
  }

  grid.innerHTML = "";
  const savedRecipes = getSavedRecipes();

  // Case 1: Empty jar (zero saved recipes)
  if (savedRecipes.length === 0) {
    emptyMessage.textContent = "Your Recipe Jar is empty. Tap the heart on any recipe to save it here.";
    emptyLink.classList.remove("d-none");
    emptyState.classList.remove("d-none");
    return;
  }

  const filteredRecipes = savedRecipes.filter(function (recipe) {
    if (activeFilter === "All Saved") {
      return true;
    }
    return recipe.categories.indexOf(activeFilter) !== -1;
  });

  // Case 2: Active filter has no matching recipes
  if (filteredRecipes.length === 0) {
    emptyMessage.textContent = "No saved recipes in this category yet.";
    emptyLink.classList.add("d-none");
    emptyState.classList.remove("d-none");
    return;
  }

  emptyState.classList.add("d-none");

  filteredRecipes.forEach(function (recipe) {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";

    const card = document.createElement("article");
    card.className = "recipe-card";

    // Top-right filled orange heart button to unsave
    const heartBtn = document.createElement("button");
    heartBtn.type = "button";
    heartBtn.className = "heart-btn";
    heartBtn.setAttribute("aria-label", "Remove " + recipe.name + " from saved recipes");
    heartBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
    heartBtn.addEventListener("click", function () {
      removeRecipe(recipe.id);
    });

    // Recipe image container with small tinted time badge and onerror fallback
    const imgWrap = document.createElement("div");
    imgWrap.className = "recipe-img-wrap";

    const img = document.createElement("img");
    img.className = "recipe-img";
    img.src = recipe.image;
    img.alt = "Plate of " + recipe.name;
    img.loading = "lazy";
    img.onerror = function () {
      img.onerror = null;
      imgWrap.replaceChild(createImagePlaceholder(recipe), img);
    };

    const timeBadge = document.createElement("span");
    timeBadge.className = "time-badge";
    timeBadge.textContent = recipe.time + " min";

    imgWrap.appendChild(img);
    imgWrap.appendChild(timeBadge);

    // Card details
    const body = document.createElement("div");
    body.className = "recipe-body";

    const detailsTop = document.createElement("div");

    const title = document.createElement("h2");
    title.className = "recipe-title";
    title.textContent = recipe.name;

    const meta = document.createElement("p");
    meta.className = "recipe-meta";
    meta.textContent = recipe.time + " min | " + recipe.rating + "\u2605";

    detailsTop.appendChild(title);
    detailsTop.appendChild(meta);

    const viewLink = document.createElement("a");
    viewLink.className = "btn-accent-pill";
    viewLink.href = "recipe-details.html?id=" + encodeURIComponent(recipe.id);
    viewLink.textContent = "View Recipe";

    body.appendChild(detailsTop);
    body.appendChild(viewLink);

    card.appendChild(heartBtn);
    card.appendChild(imgWrap);
    card.appendChild(body);
    col.appendChild(card);
    grid.appendChild(col);
  });
}

// Remove a recipe from localStorage, refresh the UI, and show the Undo toast.
function removeRecipe(recipeId) {
  const currentIds = getSavedIds();
  const updatedIds = currentIds.filter(function (id) {
    return id !== recipeId;
  });

  lastRemovedRecipe = allRecipes.find(function (item) {
    return item.id === recipeId;
  }) || { id: recipeId, name: "Recipe" };

  saveIds(updatedIds);
  updateNavBadge();
  renderFilters();
  renderCards();

  announceStatus("Removed " + lastRemovedRecipe.name + " from Recipe Jar.");

  if (toastInstance) {
    toastInstance.show();
  }
}

// Restore the most recently removed recipe back into localStorage and refresh the UI.
function undoRemove() {
  if (!lastRemovedRecipe) {
    return;
  }

  const currentIds = getSavedIds();
  if (currentIds.indexOf(lastRemovedRecipe.id) === -1) {
    currentIds.push(lastRemovedRecipe.id);
    saveIds(currentIds);
  }

  const restoredName = lastRemovedRecipe.name;
  lastRemovedRecipe = null;

  if (toastInstance) {
    toastInstance.hide();
  }

  updateNavBadge();
  renderFilters();
  renderCards();
  announceStatus("Restored " + restoredName + " to Recipe Jar.");
}

// Initialize the Saved Recipe Jar page after the DOM is ready.
function initSavedJarPage() {
  activeFilter = loadActiveFilter();

  const toastElement = document.getElementById("undo-toast");
  if (toastElement && window.bootstrap) {
    toastInstance = new bootstrap.Toast(toastElement, { delay: 5000 });
  }

  const undoBtn = document.getElementById("undo-btn");
  if (undoBtn) {
    undoBtn.addEventListener("click", undoRemove);
  }

  updateNavBadge();
  renderFilters();
  renderCards();
}

document.addEventListener("DOMContentLoaded", initSavedJarPage);
