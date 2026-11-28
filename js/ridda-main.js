/* ==========================================================================
   Recipe Jar — Shared Navigation Script (js/ridda-main.js)
   Handles ONLY the responsive mobile hamburger menu toggle across pages.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // Locate the hamburger toggle button and the collapsible navigation element.
  const menuToggle = document.getElementById("menuToggle");
  const primaryNav = document.getElementById("primaryNav");

  // Guard check so this shared script never throws on pages missing these IDs.
  if (!menuToggle || !primaryNav) {
    return;
  }

  /**
   * Opens or closes the mobile navigation drawer and keeps aria-expanded
   * synchronized for screen readers and keyboard users.
   * @param {boolean} shouldOpen - True to show the menu, false to hide it.
   */
  function setMenuState(shouldOpen) {
    primaryNav.classList.toggle("is-open", shouldOpen);
    menuToggle.setAttribute("aria-expanded", String(shouldOpen));
  }

  // Toggle the mobile menu when the hamburger button is clicked.
  menuToggle.addEventListener("click", function () {
    const isCurrentlyOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isCurrentlyOpen);
  });

  // Allow keyboard users to close the open mobile menu with the Escape key.
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
      setMenuState(false);
      menuToggle.focus();
    }
  });

  // Close the mobile menu automatically if the viewport grows to desktop width.
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768 && primaryNav.classList.contains("is-open")) {
      setMenuState(false);
    }
  });
});
