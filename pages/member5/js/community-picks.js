/* ==========================================================================
   Community Picks & Collections — Page Logic (js/community-picks.js)
   Vanilla JavaScript for rendering collection cards, persisting saved IDs in
   localStorage, and opening the Bootstrap 5 recipe modal.
   ========================================================================== */

(function () {
  "use strict";

  // Exact localStorage key required for persisting saved collection IDs.
  const STORAGE_KEY = "recipeJarSavedCollections";

  /**
   * Master array of curated collections.
   * Each collection owns its metadata and an array of recipe objects, so the
   * displayed "N Recipes" count is always derived from collection.recipes.length.
   */
  const COLLECTIONS = [
    {
      id: "comfort-foods",
      title: "Comfort Foods",
      description:
        "Warm, soul-soothing classics slow-simmered and shared around the family table.",
      image: "../images/collections/comfort-foods.jpg",
      imageAlt: "Steaming Lamb Biryani, Chicken Karahi, and warm naan on a wooden table",
      recipes: [
        { name: "Lamb Biryani", cookingTime: "1 hr 15 mins" },
        { name: "Chicken Karahi", cookingTime: "45 mins" },
        { name: "Daal Chawal", cookingTime: "35 mins" },
        { name: "Butter Chicken", cookingTime: "50 mins" },
        { name: "Beef Nihari", cookingTime: "2 hrs" },
        { name: "Creamy Mac & Cheese", cookingTime: "35 mins" },
        { name: "Shepherd's Pie", cookingTime: "55 mins" },
        { name: "Garlic Mushroom Risotto", cookingTime: "40 mins" },
        { name: "Baked Ziti with Ricotta", cookingTime: "50 mins" },
        { name: "Roasted Tomato Soup & Grilled Cheese", cookingTime: "30 mins" },
        { name: "Crispy Chicken Pot Pie", cookingTime: "1 hr" },
        { name: "Spiced Lamb Kebabs", cookingTime: "35 mins" }
      ]
    },
    {
      id: "healthy-weeknights",
      title: "Healthy Weeknights",
      description:
        "Fresh, balanced bowls, soups, and sheet-pan dinners ready without weeknight stress.",
      image: "../images/collections/healthy-weeknights.jpg",
      imageAlt: "Golden lentil soup, roasted salmon, and colorful quinoa bowl on linen",
      recipes: [
        { name: "Lentil Soup", cookingTime: "30 mins" },
        { name: "Herb-Crusted Baked Salmon", cookingTime: "22 mins" },
        { name: "Mediterranean Quinoa Salad", cookingTime: "20 mins" },
        { name: "Lemon Garlic Chicken Skewers", cookingTime: "25 mins" },
        { name: "Roasted Chickpea & Spinach Bowl", cookingTime: "25 mins" },
        { name: "Ginger Sesame Tofu Stir-Fry", cookingTime: "20 mins" },
        { name: "Zucchini Noodles with Basil Pesto", cookingTime: "15 mins" },
        { name: "Spiced Sweet Potato & Black Bean Tacos", cookingTime: "28 mins" }
      ]
    },
    {
      id: "desserts",
      title: "Desserts",
      description:
        "Fragrant cakes, chewy brownies, and crowd-pleasing sweets for celebrations or tea time.",
      image: "../images/collections/desserts.jpg",
      imageAlt: "Persian Love Cake with pistachios and rose petals next to Date and Nut Brownies",
      recipes: [
        { name: "Date & Nut Brownies", cookingTime: "35 mins" },
        { name: "Persian Love Cake", cookingTime: "55 mins" },
        { name: "Cardamom Pistachio Kheer", cookingTime: "40 mins" },
        { name: "Classic Tiramisu", cookingTime: "30 mins" },
        { name: "Salted Caramel Apple Crumble", cookingTime: "45 mins" },
        { name: "Lemon Drizzle Loaf", cookingTime: "50 mins" },
        { name: "Baked Saffron Cheesecake", cookingTime: "1 hr 10 mins" },
        { name: "Almond Butter Chocolate Chip Cookies", cookingTime: "22 mins" },
        { name: "Mango Panna Cotta", cookingTime: "20 mins" },
        { name: "Warm Sticky Toffee Pudding", cookingTime: "45 mins" }
      ]
    }
  ];

  // Track saved collection IDs in memory so the page still works if localStorage fails.
  let savedCollectionIds = loadSavedCollectionIds();

  // Track which collection is currently open inside the Bootstrap modal.
  let activeModalCollectionId = null;

  // Hold the Bootstrap Modal instance once initialized.
  let collectionModalInstance = null;

  /**
   * Safely reads saved collection IDs from localStorage.
   * Returns an empty array if localStorage is unavailable or contains invalid JSON.
   * @returns {string[]} Array of saved collection IDs.
   */
  function loadSavedCollectionIds() {
    try {
      const rawValue = window.localStorage.getItem(STORAGE_KEY);
      if (!rawValue) {
        return [];
      }
      const parsed = JSON.parse(rawValue);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      // Gracefully fall back to an empty in-memory array when storage is blocked.
      return [];
    }
  }

  /**
   * Safely writes the current list of saved collection IDs to localStorage.
   * Wrapped in try/catch so private browsing or quota errors never break the UI.
   * @param {string[]} ids - List of saved collection IDs.
   */
  function saveCollectionIdsToStorage(ids) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      // Ignore storage failures silently; in-memory state remains active for this session.
    }
  }

  /**
   * Checks whether a given collection ID is currently saved.
   * @param {string} collectionId
   * @returns {boolean}
   */
  function isCollectionSaved(collectionId) {
    return savedCollectionIds.includes(collectionId);
  }

  /**
   * Finds a collection object in COLLECTIONS by its ID.
   * @param {string} collectionId
   * @returns {object|undefined}
   */
  function findCollectionById(collectionId) {
    return COLLECTIONS.find(function (item) {
      return item.id === collectionId;
    });
  }

  /**
   * Formats the recipe count label dynamically from recipes.length.
   * @param {Array} recipes
   * @returns {string}
   */
  function formatRecipeCount(recipes) {
    const count = Array.isArray(recipes) ? recipes.length : 0;
    return count === 1 ? "1 Recipe" : count + " Recipes";
  }

  /**
   * Returns an accessible SVG heart icon used on both cards and the modal.
   * @returns {SVGSVGElement}
   */
  function createHeartSvg() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "heart-svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("aria-hidden", "true");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute(
      "d",
      "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    );

    svg.appendChild(path);
    return svg;
  }

  /**
   * Updates the visual state and ARIA attributes of any heart save button.
   * @param {HTMLButtonElement} button
   * @param {object} collection
   * @param {boolean} includeText - True for the modal button that displays a text label.
   */
  function applySaveButtonState(button, collection, includeText) {
    const saved = isCollectionSaved(collection.id);
    button.classList.toggle("is-saved", saved);
    button.setAttribute("aria-pressed", String(saved));
    button.setAttribute(
      "aria-label",
      saved
        ? "Remove " + collection.title + " collection from saved"
        : "Save " + collection.title + " collection"
    );

    if (includeText) {
      const labelSpan = document.getElementById("modalSaveText");
      if (labelSpan) {
        labelSpan.textContent = saved ? "Saved" : "Save collection";
      }
    }
  }

  /**
   * Toggles the saved status of a collection, persists to localStorage,
   * and synchronizes both the card heart button and modal heart button.
   * @param {string} collectionId
   */
  function toggleSaveCollection(collectionId) {
    const collection = findCollectionById(collectionId);
    if (!collection) {
      return;
    }

    if (isCollectionSaved(collectionId)) {
      savedCollectionIds = savedCollectionIds.filter(function (id) {
        return id !== collectionId;
      });
    } else {
      savedCollectionIds = savedCollectionIds.concat(collectionId);
    }

    saveCollectionIdsToStorage(savedCollectionIds);

    // Sync the matching card heart button in the grid.
    const cardSaveBtn = document.querySelector(
      '.save-heart-btn[data-collection-id="' + collectionId + '"]'
    );
    if (cardSaveBtn) {
      applySaveButtonState(cardSaveBtn, collection, false);
    }

    // Sync the modal's Save button if this collection is currently open.
    if (activeModalCollectionId === collectionId) {
      const modalSaveBtn = document.getElementById("modalSaveBtn");
      if (modalSaveBtn) {
        applySaveButtonState(modalSaveBtn, collection, true);
      }
    }
  }

  /**
   * Builds and displays a single collection card DOM node from a data object.
   * @param {object} collection
   * @returns {HTMLElement}
   */
  function buildCollectionCard(collection) {
    const card = document.createElement("article");
    card.className = "collection-card";

    // Heart icon button in the top-right corner of the card.
    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "save-heart-btn";
    saveBtn.dataset.collectionId = collection.id;
    saveBtn.appendChild(createHeartSvg());
    applySaveButtonState(saveBtn, collection, false);

    saveBtn.addEventListener("click", function () {
      toggleSaveCollection(collection.id);
    });

    // Top image (or left thumbnail on mobile < 768px).
    const media = document.createElement("div");
    media.className = "collection-card-media";

    const img = document.createElement("img");
    img.className = "collection-card-img";
    img.src = collection.image;
    img.alt = collection.imageAlt;
    media.appendChild(img);

    // Card body containing title, derived recipe count, and View button.
    const body = document.createElement("div");
    body.className = "collection-card-body";

    const title = document.createElement("h3");
    title.className = "collection-card-title";
    title.textContent = collection.title;

    const countText = document.createElement("p");
    countText.className = "collection-recipe-count";
    countText.textContent = formatRecipeCount(collection.recipes);

    const viewBtn = document.createElement("button");
    viewBtn.type = "button";
    viewBtn.className = "btn btn-accent view-collection-btn";
    viewBtn.setAttribute("aria-label", "View " + collection.title + " collection");

    // Full text on desktop; compact "View" label on mobile (< 768px).
    const desktopLabel = document.createElement("span");
    desktopLabel.className = "label-desktop";
    desktopLabel.textContent = "View Collection";

    const mobileLabel = document.createElement("span");
    mobileLabel.className = "label-mobile";
    mobileLabel.textContent = "View";

    viewBtn.appendChild(desktopLabel);
    viewBtn.appendChild(mobileLabel);

    viewBtn.addEventListener("click", function () {
      openCollectionModal(collection.id);
    });

    body.appendChild(title);
    body.appendChild(countText);
    body.appendChild(viewBtn);

    card.appendChild(saveBtn);
    card.appendChild(media);
    card.appendChild(body);

    return card;
  }

  /**
   * Renders all collections into #collectionsContainer, or shows an accessible
   * fallback message if the array is empty or rendering encounters an error.
   */
  function renderCollections() {
    const container = document.getElementById("collectionsContainer");
    if (!container) {
      return;
    }

    container.innerHTML = "";

    try {
      if (!Array.isArray(COLLECTIONS) || COLLECTIONS.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.className = "empty-collections-message";
        emptyMsg.textContent = "No collections available yet. Check back soon!";
        container.appendChild(emptyMsg);
        return;
      }

      COLLECTIONS.forEach(function (collection) {
        const cardElement = buildCollectionCard(collection);
        container.appendChild(cardElement);
      });
    } catch (error) {
      // Edge-case fallback if rendering fails for any reason.
      container.innerHTML = "";
      const fallbackMsg = document.createElement("p");
      fallbackMsg.className = "empty-collections-message";
      fallbackMsg.textContent = "No collections available yet. Check back soon!";
      container.appendChild(fallbackMsg);
    }
  }

  /**
   * Populates and opens the Bootstrap 5 modal for the selected collection.
   * @param {string} collectionId
   */
  function openCollectionModal(collectionId) {
    const collection = findCollectionById(collectionId);
    if (!collection) {
      return;
    }

    activeModalCollectionId = collection.id;

    const modalTitle = document.getElementById("collectionModalTitle");
    const modalCount = document.getElementById("collectionModalCount");
    const modalDescription = document.getElementById("collectionModalDescription");
    const modalRecipesList = document.getElementById("collectionModalRecipes");
    const modalSaveBtn = document.getElementById("modalSaveBtn");

    modalTitle.textContent = collection.title;
    modalCount.textContent = formatRecipeCount(collection.recipes);
    modalDescription.textContent = collection.description;

    // Clear previous recipe items before rendering the new list.
    modalRecipesList.innerHTML = "";

    if (!Array.isArray(collection.recipes) || collection.recipes.length === 0) {
      // Edge case: collection exists with 0 recipes.
      const emptyItem = document.createElement("li");
      emptyItem.className = "collection-empty-recipes";
      emptyItem.textContent = "This collection has no recipes yet.";
      modalRecipesList.appendChild(emptyItem);
    } else {
      collection.recipes.forEach(function (recipe) {
        const li = document.createElement("li");
        li.className = "collection-recipe-item";

        const nameSpan = document.createElement("span");
        nameSpan.className = "recipe-item-name";
        nameSpan.textContent = recipe.name;

        const timeSpan = document.createElement("span");
        timeSpan.className = "recipe-item-time";
        timeSpan.textContent = recipe.cookingTime;

        li.appendChild(nameSpan);
        li.appendChild(timeSpan);
        modalRecipesList.appendChild(li);
      });
    }

    if (modalSaveBtn) {
      applySaveButtonState(modalSaveBtn, collection, true);
    }

    if (collectionModalInstance) {
      collectionModalInstance.show();
    }
  }

  // Initialize page behavior once the DOM is ready.
  document.addEventListener("DOMContentLoaded", function () {
    renderCollections();

    const modalEl = document.getElementById("collectionModal");
    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
      // keyboard: true ensures Esc closes the modal (Bootstrap default, explicit for clarity).
      collectionModalInstance = new window.bootstrap.Modal(modalEl, {
        keyboard: true
      });

      modalEl.addEventListener("hidden.bs.modal", function () {
        activeModalCollectionId = null;
      });
    }

    // Wire up the "Save collection" heart button inside the modal.
    const modalSaveBtn = document.getElementById("modalSaveBtn");
    if (modalSaveBtn) {
      modalSaveBtn.addEventListener("click", function () {
        if (activeModalCollectionId) {
          toggleSaveCollection(activeModalCollectionId);
        }
      });
    }
  });
})();
