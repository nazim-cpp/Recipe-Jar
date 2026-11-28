/* ==========================================================================
   Help Center & Guidelines — Page Logic (js/help.js)
   Vanilla JavaScript for:
   - FAQ data array (id, category, question, answer)
   - Dynamic Bootstrap 5 accordion rendering
   - Category chip filtering (All, Cooking Tips, Scaling Recipes, How to Submit)
   - Live search & search form submit filtering
   - Contact Support modal validation and confirmation
   ========================================================================== */

(function () {
  "use strict";

  /**
   * Master array of Frequently Asked Questions.
   * Each item stores id, category, question, and answer.
   */
  const FAQS = [
    {
      id: 1,
      category: "Cooking Tips",
      question: "How do I substitute buttermilk?",
      answer:
        "Measure 1 tablespoon of fresh lemon juice or white vinegar into a liquid measuring cup, then pour in enough milk (whole, 2%, or unsweetened soy milk) to reach 1 cup. Stir and let it rest for 5 minutes until slightly thickened before adding it to your batter."
    },
    {
      id: 2,
      category: "Cooking Tips",
      question: "How can I tell when baked chicken or biryani meat is cooked safely?",
      answer:
        "Use an instant-read thermometer in the thickest part without touching bone: poultry should reach 74°C (165°F). For slow-simmered lamb or beef curries, look for fork-tender meat that pulls apart easily and clear juices."
    },
    {
      id: 3,
      category: "Cooking Tips",
      question: "My soup or sauce tastes too salty — how do I fix it?",
      answer:
        "Dilute the base with unsalted broth, water, or a splash of cream or coconut milk. Adding a squeeze of lemon juice or a pinch of sugar can also help balance sharp saltiness."
    },
    {
      id: 4,
      category: "Scaling Recipes",
      question: "How do I halve a recipe that uses eggs?",
      answer:
        "Beat 1 whole egg lightly in a small bowl and measure half of it — about 2 tablespoons (30 ml) — for the halved recipe. Save the remaining beaten egg in an airtight container in the fridge for up to 2 days."
    },
    {
      id: 5,
      category: "Scaling Recipes",
      question: "Do baking times change when I double a cake or brownie recipe?",
      answer:
        "If you split the doubled batter across two pans of the original size, bake for nearly the same time and check a few minutes early. If you use one deeper or larger pan, lower the oven temperature by 10–15°C (25°F) and allow extra baking time so the center cooks evenly."
    },
    {
      id: 6,
      category: "Scaling Recipes",
      question: "Should I double spices and salt when doubling a recipe?",
      answer:
        "Start by multiplying salt, chilli, and strong spices by 1.5 instead of 2, then taste near the end of cooking and adjust. Aromatics like garlic and onion can usually be doubled safely."
    },
    {
      id: 7,
      category: "How to Submit",
      question: "How do I submit my own recipe?",
      answer:
        "Click Submit in the top navigation bar, fill in your recipe title, category, prep and cook times, ingredient list, and step-by-step instructions, then attach a photo of your finished dish and click Publish Recipe."
    },
    {
      id: 8,
      category: "How to Submit",
      question: "What photo size is allowed?",
      answer:
        "Upload clear JPG, PNG, or WebP photos under 5 MB. Landscape or square images at least 800px wide look sharpest on recipe cards and collection pages."
    },
    {
      id: 9,
      category: "How to Submit",
      question: "Can I edit or update a recipe after I post it?",
      answer:
        "Yes! Double-check measurements before publishing, and if you notice a typo later, open the recipe from your Saved or profile area to update ingredient quantities or clarify a cooking step."
    }
  ];

  // Track the active category filter and search query.
  let activeCategory = "All";
  let currentSearchQuery = "";

  /**
   * Filters FAQS by the selected category chip and search keyword.
   * @returns {Array<object>}
   */
  function getFilteredFaqs() {
    const query = currentSearchQuery.trim().toLowerCase();

    return FAQS.filter(function (faq) {
      const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
      const matchesQuery =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }

  /**
   * Creates one Bootstrap 5 accordion item element from an FAQ object.
   * Opens the first item automatically for quick readability.
   * @param {object} faq
   * @param {number} index
   * @returns {HTMLDivElement}
   */
  function buildFaqAccordionItem(faq, index) {
    const isFirst = index === 0;
    const headingId = "faqHeading-" + faq.id;
    const collapseId = "faqCollapse-" + faq.id;

    const item = document.createElement("div");
    item.className = "accordion-item";

    const header = document.createElement("h3");
    header.className = "accordion-header";
    header.id = headingId;

    const button = document.createElement("button");
    button.type = "button";
    button.className = isFirst ? "accordion-button" : "accordion-button collapsed";
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", "#" + collapseId);
    button.setAttribute("aria-expanded", String(isFirst));
    button.setAttribute("aria-controls", collapseId);

    const questionWrap = document.createElement("span");
    questionWrap.className = "faq-question-wrap";

    const badge = document.createElement("span");
    badge.className = "faq-category-badge";
    badge.textContent = faq.category;

    const questionText = document.createElement("span");
    questionText.textContent = faq.question;

    questionWrap.appendChild(badge);
    questionWrap.appendChild(questionText);
    button.appendChild(questionWrap);
    header.appendChild(button);

    const collapseDiv = document.createElement("div");
    collapseDiv.id = collapseId;
    collapseDiv.className = isFirst ? "accordion-collapse collapse show" : "accordion-collapse collapse";
    collapseDiv.setAttribute("aria-labelledby", headingId);
    collapseDiv.setAttribute("data-bs-parent", "#faqAccordion");

    const body = document.createElement("div");
    body.className = "accordion-body";
    body.textContent = faq.answer;

    collapseDiv.appendChild(body);
    item.appendChild(header);
    item.appendChild(collapseDiv);

    return item;
  }

  /**
   * Renders a friendly empty state inside #faqAccordion when no FAQs match.
   * @param {HTMLElement} container
   */
  function renderEmptyFaqState(container) {
    const emptyBox = document.createElement("div");
    emptyBox.className = "faq-empty-card";

    const title = document.createElement("p");
    title.className = "faq-empty-title";
    title.textContent = currentSearchQuery.trim()
      ? "No help articles found for '" + currentSearchQuery.trim() + "'"
      : "No questions found in this category.";

    const hint = document.createElement("p");
    hint.className = "faq-empty-hint";
    hint.textContent = "Try another keyword or clear your filters to browse all FAQs.";

    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "btn btn-secondary-outline";
    resetBtn.textContent = "Show All FAQs";
    resetBtn.addEventListener("click", function () {
      activeCategory = "All";
      currentSearchQuery = "";
      const searchInput = document.getElementById("faqSearchInput");
      if (searchInput) {
        searchInput.value = "";
      }
      updateCategoryChipUI();
      renderFaqs();
    });

    emptyBox.appendChild(title);
    emptyBox.appendChild(hint);
    emptyBox.appendChild(resetBtn);
    container.appendChild(emptyBox);
  }

  /**
   * Renders the filtered FAQ accordion items and updates the visible count.
   */
  function renderFaqs() {
    const container = document.getElementById("faqAccordion");
    const countText = document.getElementById("faqCountText");
    if (!container) {
      return;
    }

    const filtered = getFilteredFaqs();
    container.innerHTML = "";

    if (countText) {
      countText.textContent =
        filtered.length === 1 ? "1 question" : filtered.length + " questions";
    }

    if (filtered.length === 0) {
      renderEmptyFaqState(container);
      return;
    }

    filtered.forEach(function (faq, index) {
      container.appendChild(buildFaqAccordionItem(faq, index));
    });
  }

  /**
   * Updates active visual state and aria-pressed on all category filter chips.
   */
  function updateCategoryChipUI() {
    const chips = document.querySelectorAll("#categoryChipsGroup .category-chip");
    chips.forEach(function (chip) {
      const isSelected = chip.dataset.category === activeCategory;
      chip.classList.toggle("is-active", isSelected);
      chip.setAttribute("aria-pressed", String(isSelected));
    });
  }

  /**
   * Handles Contact Support modal form validation and shows confirmation message.
   * @param {SubmitEvent} event
   */
  function handleSupportSubmit(event) {
    event.preventDefault();

    const nameInput = document.getElementById("supportNameInput");
    const emailInput = document.getElementById("supportEmailInput");
    const messageInput = document.getElementById("supportMessageInput");

    const nameError = document.getElementById("supportNameError");
    const emailError = document.getElementById("supportEmailError");
    const messageError = document.getElementById("supportMessageError");

    let valid = true;

    if (!nameInput.value.trim()) {
      nameError.textContent = "Please enter your name.";
      valid = false;
    } else {
      nameError.textContent = "";
    }

    const emailVal = emailInput.value.trim();
    if (!emailVal || !emailVal.includes("@") || !emailVal.includes(".")) {
      emailError.textContent = "Please enter a valid email address.";
      valid = false;
    } else {
      emailError.textContent = "";
    }

    if (messageInput.value.trim().length < 10) {
      messageError.textContent = "Please enter at least 10 characters describing your question.";
      valid = false;
    } else {
      messageError.textContent = "";
    }

    if (!valid) {
      return;
    }

    const form = document.getElementById("supportForm");
    const successView = document.getElementById("supportSuccessView");
    if (form) {
      form.classList.add("d-none");
    }
    if (successView) {
      successView.classList.remove("d-none");
    }
  }

  // Initialize Help Center page once the DOM is ready.
  document.addEventListener("DOMContentLoaded", function () {
    renderFaqs();

    // Wire up category chip clicks.
    const chips = document.querySelectorAll("#categoryChipsGroup .category-chip");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeCategory = chip.dataset.category || "All";
        updateCategoryChipUI();
        renderFaqs();
      });
    });

    // Wire up live search input and form submit button.
    const searchInput = document.getElementById("faqSearchInput");
    const searchForm = document.getElementById("faqSearchForm");

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        currentSearchQuery = searchInput.value;
        renderFaqs();
      });
    }

    if (searchForm) {
      searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        currentSearchQuery = searchInput ? searchInput.value : "";
        renderFaqs();
      });
    }

    // Wire up Contact Support modal form and reset when closed.
    const supportForm = document.getElementById("supportForm");
    const supportModalEl = document.getElementById("supportModal");

    if (supportForm) {
      supportForm.addEventListener("submit", handleSupportSubmit);
    }

    if (supportModalEl) {
      supportModalEl.addEventListener("hidden.bs.modal", function () {
        if (supportForm) {
          supportForm.reset();
          supportForm.classList.remove("d-none");
        }
        const successView = document.getElementById("supportSuccessView");
        if (successView) {
          successView.classList.add("d-none");
        }
        ["supportNameError", "supportEmailError", "supportMessageError"].forEach(function (id) {
          const el = document.getElementById(id);
          if (el) {
            el.textContent = "";
          }
        });
      });
    }
  });
})();
