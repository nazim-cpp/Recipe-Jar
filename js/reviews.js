/* ==========================================================================
   Reviews & Ratings Hub — Page Logic (js/reviews.js)
   Vanilla JavaScript for:
   - Default 8 reviews + localStorage persistence (try/catch)
   - Overall average rating + 5-to-1 star bar breakdown
   - Live search, star rating filter, and sorting
   - Bootstrap modal form with clickable/keyboard star picker, live char counter,
     inline validation, "Submitting review..." loading state, and success state
   ========================================================================== */

(function () {
  "use strict";

  // Key used to store user-submitted reviews in localStorage.
  const STORAGE_KEY = "recipeJarReviews";
  const MIN_REVIEW_LENGTH = 10;
  const MAX_REVIEW_LENGTH = 300;

  /**
   * Default list of 8 realistic community reviews with mixed ratings and recipes.
   * Dates use YYYY-MM-DD so sorting by newest is straightforward.
   */
  const INITIAL_REVIEWS = [
    {
      id: 1,
      name: "Ahmed K",
      recipe: "Authentic Lamb Biryani",
      rating: 5,
      text: "Amazing Biryani! Great flavour, and the cooking time was spot on.",
      date: "2026-11-24"
    },
    {
      id: 2,
      name: "Ayesha R",
      recipe: "Spicy Shish Tawook",
      rating: 4,
      text: "The garlic and paprika marinade made the chicken super tender on the grill. Served it with warm flatbread and pickles.",
      date: "2026-11-21"
    },
    {
      id: 3,
      name: "Sara M",
      recipe: "Healthy Weeknights collection",
      rating: 3.5,
      text: "Really handy weeknight meal ideas. The salmon and quinoa bowl was a hit, though I added extra lemon for brightness.",
      date: "2026-11-18"
    },
    {
      id: 4,
      name: "Omar H",
      recipe: "Vegetarian Lentil Soup",
      rating: 4.5,
      text: "Hearty, warming, and easy to make from pantry staples. Simmering with cumin gave it wonderful depth.",
      date: "2026-11-15"
    },
    {
      id: 5,
      name: "Nadia F",
      recipe: "Date & Nut Brownies",
      rating: 5,
      text: "Fudgy in the middle with crisp edges and natural sweetness from the dates. My family finished the tray in one evening.",
      date: "2026-11-11"
    },
    {
      id: 6,
      name: "Zainab T",
      recipe: "Homemade Manakish",
      rating: 2.5,
      text: "The za'atar topping tasted great, but my dough turned out a bit dense. Next time I will proof it for 20 extra minutes.",
      date: "2026-11-08"
    },
    {
      id: 7,
      name: "Bilal S",
      recipe: "Persian Love Cake",
      rating: 4.5,
      text: "Fragrant cardamom and rosewater without being overpowering. Crushed pistachios on top made it look bakery-worthy.",
      date: "2026-11-03"
    },
    {
      id: 8,
      name: "Hannah L",
      recipe: "Creamy Garlic Mushroom Risotto",
      rating: 3,
      text: "Nice comfort dish for a cold evening, though stirring took about 10 minutes longer than listed before the rice softened.",
      date: "2026-10-29"
    }
  ];

  // Active in-memory array of all reviews (custom saved reviews + default reviews).
  let allReviews = [];

  // Current star rating selected inside the "Write a Review" modal (0 = none selected).
  let selectedModalRating = 0;

  // Bootstrap Modal instance and timers for the submit flow.
  let writeReviewModalInstance = null;
  let submitTimers = [];
  let isSubmitting = false;

  /* --------------------------------------------------------------------------
     1. localStorage Helpers (State & Memory)
     -------------------------------------------------------------------------- */

  /**
   * Loads custom reviews from localStorage safely inside try/catch.
   * @returns {Array<object>}
   */
  function loadSavedReviews() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Saves custom reviews to localStorage safely inside try/catch.
   * @param {Array<object>} customReviews
   */
  function saveReviewsToStorage(customReviews) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customReviews));
    } catch (error) {
      // Fail quietly if storage is blocked or full; in-memory state stays intact.
    }
  }

  /* --------------------------------------------------------------------------
     2. Shared Formatting & Star SVG Helpers
     -------------------------------------------------------------------------- */

  /**
   * Converts YYYY-MM-DD into a friendly display date like "Nov 24, 2026".
   * @param {string} isoDate
   * @returns {string}
   */
  function formatDisplayDate(isoDate) {
    const parts = String(isoDate).split("-");
    if (parts.length !== 3) {
      return isoDate;
    }
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (Number.isNaN(dateObj.getTime())) {
      return isoDate;
    }
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  /**
   * Builds a single SVG star in "full", "half", or "empty" state.
   * Each half star gets a unique gradient ID so multiple cards never clash.
   * @param {"full"|"half"|"empty"} state
   * @param {string} uniqueKey
   * @returns {SVGSVGElement}
   */
  function createStarSvg(state, uniqueKey) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "star-icon");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");

    const starPoints =
      "M12 2.2l2.92 6.08 6.68.93-4.86 4.68 1.18 6.65L12 17.35l-5.92 3.19 1.18-6.65L2.4 9.21l6.68-.93L12 2.2z";

    if (state === "half") {
      const gradId = "half-star-" + uniqueKey;
      const defs = document.createElementNS(svgNS, "defs");
      const gradient = document.createElementNS(svgNS, "linearGradient");
      gradient.setAttribute("id", gradId);
      gradient.setAttribute("x1", "0%");
      gradient.setAttribute("y1", "0%");
      gradient.setAttribute("x2", "100%");
      gradient.setAttribute("y2", "0%");

      const leftStop = document.createElementNS(svgNS, "stop");
      leftStop.setAttribute("offset", "50%");
      leftStop.setAttribute("stop-color", "#E59819");

      const rightStop = document.createElementNS(svgNS, "stop");
      rightStop.setAttribute("offset", "50%");
      rightStop.setAttribute("stop-color", "#D8D2C7");

      gradient.appendChild(leftStop);
      gradient.appendChild(rightStop);
      defs.appendChild(gradient);
      svg.appendChild(defs);

      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", starPoints);
      path.setAttribute("fill", "url(#" + gradId + ")");
      svg.appendChild(path);
      return svg;
    }

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", starPoints);
    path.setAttribute("fill", state === "full" ? "#E59819" : "#D8D2C7");
    svg.appendChild(path);
    return svg;
  }

  /**
   * Builds a 5-star rating container supporting half stars and optional score label.
   * @param {number} rating
   * @param {string|number} keyPrefix
   * @param {boolean} showScoreText
   * @returns {HTMLDivElement}
   */
  function buildStarRatingElement(rating, keyPrefix, showScoreText) {
    const wrapper = document.createElement("div");
    wrapper.className = "star-rating";
    wrapper.setAttribute("aria-label", "Rated " + rating + " out of 5 stars");

    for (let pos = 1; pos <= 5; pos += 1) {
      let state = "empty";
      if (rating >= pos) {
        state = "full";
      } else if (rating >= pos - 0.5) {
        state = "half";
      }
      wrapper.appendChild(createStarSvg(state, String(keyPrefix) + "-" + pos));
    }

    if (showScoreText) {
      const scoreSpan = document.createElement("span");
      scoreSpan.className = "rating-number";
      scoreSpan.textContent = rating + "/5";
      wrapper.appendChild(scoreSpan);
    }

    return wrapper;
  }

  /* --------------------------------------------------------------------------
     3. Summary & 5-to-1 Star Breakdown (Logic & Calculation)
     -------------------------------------------------------------------------- */

  /**
   * Calculates and renders the overall average rating (1 decimal),
   * total review count, and 5-to-1 star distribution bars from allReviews.
   */
  function renderRatingSummary() {
    const avgEl = document.getElementById("averageRatingValue");
    const avgStarsEl = document.getElementById("averageRatingStars");
    const totalEl = document.getElementById("totalReviewsCount");
    const breakdownEl = document.getElementById("ratingBreakdownList");

    if (!avgEl || !avgStarsEl || !totalEl || !breakdownEl) {
      return;
    }

    const totalCount = allReviews.length;
    const sumRatings = allReviews.reduce(function (sum, item) {
      return sum + Number(item.rating);
    }, 0);
    const average = totalCount > 0 ? sumRatings / totalCount : 0;
    const averageRounded = average.toFixed(1);

    // Round average to nearest 0.5 for the summary star icons.
    const averageHalfSteps = Math.round(average * 2) / 2;

    avgEl.textContent = averageRounded;
    totalEl.textContent =
      totalCount === 1 ? "Based on 1 review" : "Based on " + totalCount + " reviews";

    avgStarsEl.innerHTML = "";
    avgStarsEl.appendChild(buildStarRatingElement(averageHalfSteps, "summary", false));

    // Count reviews per star bucket (5 down to 1). Half-stars like 4.5 map to 4.
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach(function (review) {
      const bucket = Math.min(5, Math.max(1, Math.floor(Number(review.rating))));
      counts[bucket] += 1;
    });

    breakdownEl.innerHTML = "";
    [5, 4, 3, 2, 1].forEach(function (starNum) {
      const count = counts[starNum];
      const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

      const row = document.createElement("div");
      row.className = "breakdown-row";

      const label = document.createElement("span");
      label.className = "breakdown-label";
      label.textContent = starNum === 1 ? "1 star" : starNum + " stars";

      const track = document.createElement("div");
      track.className = "breakdown-track";
      track.setAttribute("role", "progressbar");
      track.setAttribute("aria-label", starNum + " star reviews: " + count);
      track.setAttribute("aria-valuenow", String(percent));
      track.setAttribute("aria-valuemin", "0");
      track.setAttribute("aria-valuemax", "100");

      const fill = document.createElement("div");
      fill.className = "breakdown-fill";
      fill.style.width = percent + "%";
      track.appendChild(fill);

      const countLabel = document.createElement("span");
      countLabel.className = "breakdown-count";
      countLabel.textContent = String(count);

      row.appendChild(label);
      row.appendChild(track);
      row.appendChild(countLabel);
      breakdownEl.appendChild(row);
    });
  }

  /* --------------------------------------------------------------------------
     4. Review Cards Rendering, Search, Filter & Sort (Data & Display)
     -------------------------------------------------------------------------- */

  /**
   * Builds a single review <article> card DOM node.
   * @param {object} review
   * @returns {HTMLElement}
   */
  function buildReviewCard(review) {
    const card = document.createElement("article");
    card.className = "review-card";

    const topRow = document.createElement("div");
    topRow.className = "review-card-top";

    const authorGroup = document.createElement("div");
    authorGroup.className = "review-author-group";

    const nameEl = document.createElement("h2");
    nameEl.className = "reviewer-name";
    nameEl.textContent = review.name;

    const recipeBadge = document.createElement("span");
    recipeBadge.className = "recipe-tag";
    recipeBadge.textContent = review.recipe;

    authorGroup.appendChild(nameEl);
    authorGroup.appendChild(recipeBadge);

    const dateEl = document.createElement("time");
    dateEl.className = "review-date";
    dateEl.setAttribute("datetime", review.date);
    dateEl.textContent = formatDisplayDate(review.date);

    topRow.appendChild(authorGroup);
    topRow.appendChild(dateEl);

    const starsEl = buildStarRatingElement(review.rating, review.id, true);

    const bodyText = document.createElement("p");
    bodyText.className = "review-text";
    bodyText.textContent = review.text;

    card.appendChild(topRow);
    card.appendChild(starsEl);
    card.appendChild(bodyText);

    return card;
  }

  /**
   * Checks whether a review satisfies the star rating filter dropdown.
   * @param {object} review
   * @param {string} filterValue
   * @returns {boolean}
   */
  function matchesRatingFilter(review, filterValue) {
    if (filterValue === "5") {
      return review.rating === 5;
    }
    if (filterValue === "4plus") {
      return review.rating >= 4;
    }
    if (filterValue === "3plus") {
      return review.rating >= 3;
    }
    if (filterValue === "below3") {
      return review.rating < 3;
    }
    return true;
  }

  /**
   * Checks whether a review matches the live search text across name, recipe, or text.
   * @param {object} review
   * @param {string} query
   * @returns {boolean}
   */
  function matchesSearchQuery(review, query) {
    if (!query) {
      return true;
    }
    const lower = query.toLowerCase();
    return (
      review.name.toLowerCase().includes(lower) ||
      review.recipe.toLowerCase().includes(lower) ||
      review.text.toLowerCase().includes(lower)
    );
  }

  /**
   * Returns a sorted copy of the filtered reviews array.
   * @param {Array<object>} reviews
   * @param {string} sortBy
   * @returns {Array<object>}
   */
  function sortReviews(reviews, sortBy) {
    const copy = reviews.slice();

    if (sortBy === "highest") {
      copy.sort(function (a, b) {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return Number(b.id) - Number(a.id);
      });
      return copy;
    }

    if (sortBy === "lowest") {
      copy.sort(function (a, b) {
        if (a.rating !== b.rating) {
          return a.rating - b.rating;
        }
        return Number(b.id) - Number(a.id);
      });
      return copy;
    }

    // Default: "newest" (latest date first, then higher id for same-day posts).
    copy.sort(function (a, b) {
      const dateDiff = b.date.localeCompare(a.date);
      if (dateDiff !== 0) {
        return dateDiff;
      }
      return Number(b.id) - Number(a.id);
    });
    return copy;
  }

  /**
   * Renders the friendly empty state message when 0 reviews match.
   * @param {HTMLElement} container
   * @param {string} searchQuery
   */
  function renderEmptyState(container, searchQuery) {
    const box = document.createElement("div");
    box.className = "empty-reviews-card";

    const title = document.createElement("p");
    title.className = "empty-reviews-title";
    if (searchQuery) {
      title.textContent = "No reviews found for '" + searchQuery + "'";
    } else {
      title.textContent = "No reviews match the selected star rating.";
    }

    const hint = document.createElement("p");
    hint.className = "empty-reviews-hint";
    hint.textContent = "Try a different keyword or reset your filters to view all reviews.";

    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "btn btn-secondary-outline";
    resetBtn.textContent = "Reset Filters";
    resetBtn.addEventListener("click", function () {
      const searchInput = document.getElementById("reviewSearchInput");
      const ratingSelect = document.getElementById("ratingFilterSelect");
      const sortSelect = document.getElementById("sortBySelect");
      if (searchInput) {
        searchInput.value = "";
      }
      if (ratingSelect) {
        ratingSelect.value = "all";
      }
      if (sortSelect) {
        sortSelect.value = "newest";
      }
      renderReviews();
    });

    box.appendChild(title);
    box.appendChild(hint);
    box.appendChild(resetBtn);
    container.appendChild(box);
  }

  /**
   * Filters, sorts, and renders review cards into #reviewsContainer.
   */
  function renderReviews() {
    const container = document.getElementById("reviewsContainer");
    const countText = document.getElementById("resultsCountText");
    const searchInput = document.getElementById("reviewSearchInput");
    const ratingSelect = document.getElementById("ratingFilterSelect");
    const sortSelect = document.getElementById("sortBySelect");

    if (!container) {
      return;
    }

    const searchQuery = searchInput ? searchInput.value.trim() : "";
    const ratingFilter = ratingSelect ? ratingSelect.value : "all";
    const sortBy = sortSelect ? sortSelect.value : "newest";

    const filtered = allReviews.filter(function (review) {
      return (
        matchesRatingFilter(review, ratingFilter) &&
        matchesSearchQuery(review, searchQuery)
      );
    });

    const sorted = sortReviews(filtered, sortBy);
    container.innerHTML = "";

    if (countText) {
      countText.textContent =
        "Showing " + sorted.length + " of " + allReviews.length + " reviews";
    }

    if (sorted.length === 0) {
      renderEmptyState(container, searchQuery);
      return;
    }

    sorted.forEach(function (review) {
      container.appendChild(buildReviewCard(review));
    });
  }

  /* --------------------------------------------------------------------------
     5. Modal Form: Clickable Star Picker, Validation, Counter & Submit Flow
     -------------------------------------------------------------------------- */

  /**
   * Updates the visual highlight and ARIA state of the 5 star picker buttons.
   * @param {number} displayValue - Rating value to highlight (hovered or selected).
   */
  function updateStarPickerUI(displayValue) {
    const buttons = document.querySelectorAll("#starPickerGroup .star-picker-btn");
    const textEl = document.getElementById("starPickerText");

    buttons.forEach(function (btn) {
      const starVal = Number(btn.dataset.value);
      btn.classList.toggle("is-active", starVal <= displayValue);
      btn.setAttribute("aria-checked", String(starVal === selectedModalRating));
    });

    if (textEl) {
      if (selectedModalRating > 0) {
        textEl.textContent =
          selectedModalRating === 1 ? "1 / 5 star" : selectedModalRating + " / 5 stars";
      } else {
        textEl.textContent = "Select a rating";
      }
    }
  }

  /**
   * Wires up click, hover, and Arrow-key navigation on the modal star picker.
   */
  function setupStarPicker() {
    const group = document.getElementById("starPickerGroup");
    if (!group) {
      return;
    }

    const buttons = Array.from(group.querySelectorAll(".star-picker-btn"));

    buttons.forEach(function (btn, index) {
      const value = Number(btn.dataset.value);

      btn.addEventListener("click", function () {
        selectedModalRating = value;
        updateStarPickerUI(selectedModalRating);
        setFieldError("ratingError", null, "");
      });

      btn.addEventListener("mouseenter", function () {
        updateStarPickerUI(value);
      });

      btn.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight" || event.key === "ArrowUp") {
          event.preventDefault();
          const nextBtn = buttons[Math.min(buttons.length - 1, index + 1)];
          selectedModalRating = Number(nextBtn.dataset.value);
          updateStarPickerUI(selectedModalRating);
          setFieldError("ratingError", null, "");
          nextBtn.focus();
        } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
          event.preventDefault();
          const prevBtn = buttons[Math.max(0, index - 1)];
          selectedModalRating = Number(prevBtn.dataset.value);
          updateStarPickerUI(selectedModalRating);
          setFieldError("ratingError", null, "");
          prevBtn.focus();
        }
      });
    });

    group.addEventListener("mouseleave", function () {
      updateStarPickerUI(selectedModalRating);
    });
  }

  /**
   * Updates the live character counter below the review textarea.
   */
  function updateCharacterCounter() {
    const textarea = document.getElementById("reviewTextInput");
    const counter = document.getElementById("charCounterText");
    if (!textarea || !counter) {
      return;
    }

    const length = textarea.value.trim().length;
    counter.textContent = textarea.value.length + " / " + MAX_REVIEW_LENGTH;
    counter.classList.toggle("is-valid", length >= MIN_REVIEW_LENGTH);
  }

  /**
   * Helper to set or clear an inline error message and invalid border on an input.
   * @param {string} errorId
   * @param {HTMLElement|null} fieldEl
   * @param {string} message
   */
  function setFieldError(errorId, fieldEl, message) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
      errorEl.textContent = message;
    }
    if (fieldEl) {
      fieldEl.classList.toggle("is-invalid-field", Boolean(message));
      fieldEl.setAttribute("aria-invalid", message ? "true" : "false");
    }
  }

  /**
   * Validates all modal form fields and displays inline error messages.
   * @returns {boolean} True if all fields are valid.
   */
  function validateReviewForm() {
    const recipeSelect = document.getElementById("recipeSelect");
    const nameInput = document.getElementById("reviewerNameInput");
    const textInput = document.getElementById("reviewTextInput");

    let isValid = true;

    if (!recipeSelect.value.trim()) {
      setFieldError("recipeError", recipeSelect, "Please select a recipe.");
      isValid = false;
    } else {
      setFieldError("recipeError", recipeSelect, "");
    }

    if (selectedModalRating < 1 || selectedModalRating > 5) {
      setFieldError("ratingError", null, "Please select a star rating.");
      isValid = false;
    } else {
      setFieldError("ratingError", null, "");
    }

    if (!nameInput.value.trim()) {
      setFieldError("nameError", nameInput, "Please enter your name.");
      isValid = false;
    } else {
      setFieldError("nameError", nameInput, "");
    }

    const trimmedText = textInput.value.trim();
    if (trimmedText.length < MIN_REVIEW_LENGTH) {
      setFieldError(
        "reviewTextError",
        textInput,
        "Please write at least " + MIN_REVIEW_LENGTH + " characters (" + trimmedText.length + "/" + MIN_REVIEW_LENGTH + ")."
      );
      isValid = false;
    } else if (trimmedText.length > MAX_REVIEW_LENGTH) {
      setFieldError(
        "reviewTextError",
        textInput,
        "Review must be " + MAX_REVIEW_LENGTH + " characters or fewer."
      );
      isValid = false;
    } else {
      setFieldError("reviewTextError", textInput, "");
    }

    return isValid;
  }

  /**
   * Toggles the Submit button between normal and "Submitting review..." loading state.
   * @param {boolean} loading
   */
  function setSubmittingButtonState(loading) {
    const submitBtn = document.getElementById("submitReviewBtn");
    const cancelBtn = document.getElementById("cancelReviewBtn");
    const closeBtn = document.getElementById("modalCloseBtn");
    const spinner = document.getElementById("submitSpinner");
    const btnText = document.getElementById("submitBtnText");

    if (submitBtn) {
      submitBtn.disabled = loading;
    }
    if (cancelBtn) {
      cancelBtn.disabled = loading;
    }
    if (closeBtn) {
      closeBtn.disabled = loading;
    }
    if (spinner) {
      spinner.classList.toggle("d-none", !loading);
    }
    if (btnText) {
      btnText.textContent = loading ? "Submitting review..." : "Submit Review";
    }
  }

  /**
   * Resets the modal form, validation errors, star picker, and view visibility.
   */
  function resetModalState() {
    submitTimers.forEach(function (timerId) {
      window.clearTimeout(timerId);
    });
    submitTimers = [];
    isSubmitting = false;

    const form = document.getElementById("writeReviewForm");
    const successView = document.getElementById("reviewSuccessView");
    const recipeSelect = document.getElementById("recipeSelect");
    const nameInput = document.getElementById("reviewerNameInput");
    const textInput = document.getElementById("reviewTextInput");

    if (form) {
      form.reset();
      form.classList.remove("d-none");
    }
    if (successView) {
      successView.classList.add("d-none");
    }

    selectedModalRating = 0;
    updateStarPickerUI(0);
    updateCharacterCounter();
    setSubmittingButtonState(false);

    setFieldError("recipeError", recipeSelect, "");
    setFieldError("ratingError", null, "");
    setFieldError("nameError", nameInput, "");
    setFieldError("reviewTextError", textInput, "");
  }

  /**
   * Returns today's date in YYYY-MM-DD format.
   * @returns {string}
   */
  function getTodayIsoDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  /**
   * Handles form submission with loading state, success message, storage update,
   * and closing the modal so the new review appears at the top of the list.
   * @param {SubmitEvent} event
   */
  function handleReviewSubmit(event) {
    event.preventDefault();
    if (isSubmitting || !validateReviewForm()) {
      return;
    }

    isSubmitting = true;
    setSubmittingButtonState(true);

    const recipeVal = document.getElementById("recipeSelect").value.trim();
    const nameVal = document.getElementById("reviewerNameInput").value.trim();
    const textVal = document.getElementById("reviewTextInput").value.trim();
    const ratingVal = selectedModalRating;

    // Step 1: Brief "Submitting review..." state.
    const publishTimer = window.setTimeout(function () {
      const newReview = {
        id: Date.now(),
        name: nameVal,
        recipe: recipeVal,
        rating: ratingVal,
        text: textVal,
        date: getTodayIsoDate()
      };

      const savedCustom = loadSavedReviews();
      const updatedCustom = [newReview].concat(savedCustom);
      saveReviewsToStorage(updatedCustom);

      allReviews = updatedCustom.concat(INITIAL_REVIEWS);

      // Reset search/filter/sort so the newly posted review is shown at the top.
      const searchInput = document.getElementById("reviewSearchInput");
      const filterSelect = document.getElementById("ratingFilterSelect");
      const sortSelect = document.getElementById("sortBySelect");
      if (searchInput) {
        searchInput.value = "";
      }
      if (filterSelect) {
        filterSelect.value = "all";
      }
      if (sortSelect) {
        sortSelect.value = "newest";
      }

      renderRatingSummary();
      renderReviews();

      // Step 2: Show the "Review Published!" confirmation inside the modal.
      const form = document.getElementById("writeReviewForm");
      const successView = document.getElementById("reviewSuccessView");
      const closeBtn = document.getElementById("modalCloseBtn");
      if (form) {
        form.classList.add("d-none");
      }
      if (successView) {
        successView.classList.remove("d-none");
      }
      if (closeBtn) {
        closeBtn.disabled = false;
      }

      // Step 3: Close the modal after showing the confirmation message.
      const closeTimer = window.setTimeout(function () {
        if (writeReviewModalInstance) {
          writeReviewModalInstance.hide();
        }
      }, 1400);
      submitTimers.push(closeTimer);
    }, 650);

    submitTimers.push(publishTimer);
  }

  /* --------------------------------------------------------------------------
     6. Page Initialization
     -------------------------------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", function () {
    const savedReviews = loadSavedReviews();
    allReviews = savedReviews.concat(INITIAL_REVIEWS);

    renderRatingSummary();
    renderReviews();
    setupStarPicker();
    updateCharacterCounter();

    const searchInput = document.getElementById("reviewSearchInput");
    const ratingSelect = document.getElementById("ratingFilterSelect");
    const sortSelect = document.getElementById("sortBySelect");

    if (searchInput) {
      searchInput.addEventListener("input", renderReviews);
    }
    if (ratingSelect) {
      ratingSelect.addEventListener("change", renderReviews);
    }
    if (sortSelect) {
      sortSelect.addEventListener("change", renderReviews);
    }

    const recipeSelect = document.getElementById("recipeSelect");
    const nameInput = document.getElementById("reviewerNameInput");
    const textInput = document.getElementById("reviewTextInput");

    if (recipeSelect) {
      recipeSelect.addEventListener("change", function () {
        if (recipeSelect.value.trim()) {
          setFieldError("recipeError", recipeSelect, "");
        }
      });
    }

    if (nameInput) {
      nameInput.addEventListener("input", function () {
        if (nameInput.value.trim()) {
          setFieldError("nameError", nameInput, "");
        }
      });
    }

    if (textInput) {
      textInput.addEventListener("input", function () {
        updateCharacterCounter();
        if (textInput.value.trim().length >= MIN_REVIEW_LENGTH) {
          setFieldError("reviewTextError", textInput, "");
        }
      });
    }

    const modalEl = document.getElementById("writeReviewModal");
    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
      writeReviewModalInstance = new window.bootstrap.Modal(modalEl);
      modalEl.addEventListener("hidden.bs.modal", resetModalState);
    }

    const writeForm = document.getElementById("writeReviewForm");
    if (writeForm) {
      writeForm.addEventListener("submit", handleReviewSubmit);
    }
  });
})();
