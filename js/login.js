/* ==========================================================================
   Recipe Jar — Login & Sign-Up Page Logic (js/login.js)
   NOTE: This is a front-end simulation for a university ICT project.
   Real production websites must NEVER store plain-text passwords in the
   browser's localStorage or sessionStorage.
   ========================================================================== */

(function () {
  "use strict";

  // Storage keys
  const USERS_KEY = "recipeJar_users";
  const CURRENT_USER_KEY = "recipeJar_currentUser";
  const REMEMBERED_EMAIL_KEY = "recipeJar_rememberedEmail";

  // Pre-loaded demo user
  const DEMO_USER = {
    name: "Sam Ali",
    email: "sam@mail.com",
    password: "Recipe@123"
  };

  // DOM References — Layout & Session Status
  const authCard = document.getElementById("authCard");
  const alreadyLoggedInCard = document.getElementById("alreadyLoggedInCard");
  const loggedInName = document.getElementById("loggedInName");
  const logoutBtn = document.getElementById("logoutBtn");

  // Mobile Panels & Switch Buttons
  const loginPanel = document.getElementById("loginPanel");
  const signupPanel = document.getElementById("signupPanel");
  const showSignupBtn = document.getElementById("showSignupBtn");
  const showLoginBtn = document.getElementById("showLoginBtn");

  // Login Form Elements
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const loginEmailError = document.getElementById("loginEmailError");
  const loginPasswordError = document.getElementById("loginPasswordError");
  const rememberMeCheckbox = document.getElementById("rememberMe");
  const loginSubmitBtn = document.getElementById("loginSubmitBtn");
  const loginErrorAlert = document.getElementById("loginErrorAlert");
  const signupSuccessNotice = document.getElementById("signupSuccessNotice");

  // Sign-Up Form Elements
  const signupForm = document.getElementById("signupForm");
  const signupName = document.getElementById("signupName");
  const signupEmail = document.getElementById("signupEmail");
  const signupPassword = document.getElementById("signupPassword");
  const signupConfirm = document.getElementById("signupConfirm");
  const signupNameError = document.getElementById("signupNameError");
  const signupEmailError = document.getElementById("signupEmailError");
  const signupPasswordError = document.getElementById("signupPasswordError");
  const signupConfirmError = document.getElementById("signupConfirmError");
  const signupSubmitBtn = document.getElementById("signupSubmitBtn");

  // Password Strength Meter Elements
  const strengthMeter = document.getElementById("strengthMeter");
  const strengthBar = document.getElementById("strengthBar");
  const strengthLabel = document.getElementById("strengthLabel");

  // Success Overlay (State 4)
  const successOverlay = document.getElementById("successOverlay");
  const redirectCountdownText = document.getElementById("redirectCountdownText");
  const exploreRecipesBtn = document.getElementById("exploreRecipesBtn");

  // Forgot Password Modal Elements
  const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
  const forgotModal = document.getElementById("forgotModal");
  const closeForgotModalBtn = document.getElementById("closeForgotModalBtn");
  const forgotForm = document.getElementById("forgotForm");
  const forgotEmail = document.getElementById("forgotEmail");
  const forgotFeedback = document.getElementById("forgotFeedback");

  let countdownInterval = null;

  /* --------------------------------------------------------------------------
     Safe Storage Helpers (wrapped in try/catch for blocked or corrupt storage)
     -------------------------------------------------------------------------- */
  function readJson(storage, key, fallback) {
    try {
      const raw = storage.getItem(key);
      if (!raw) {
        return fallback;
      }
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(storage, key, value) {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Ignore storage quota / privacy mode errors
    }
  }

  function readString(storage, key) {
    try {
      return storage.getItem(key) || "";
    } catch (error) {
      return "";
    }
  }

  function writeString(storage, key, value) {
    try {
      storage.setItem(key, value);
    } catch (error) {
      // Ignore storage errors
    }
  }

  function removeItemSafe(storage, key) {
    try {
      storage.removeItem(key);
    } catch (error) {
      // Ignore storage errors
    }
  }

  function getUsers() {
    const parsed = readJson(localStorage, USERS_KEY, []);
    return Array.isArray(parsed) ? parsed : [];
  }

  function saveUsers(users) {
    writeJson(localStorage, USERS_KEY, users);
  }

  // Seed demo account on first load if no users exist yet
  function ensureDemoUser() {
    const existing = getUsers();
    if (existing.length === 0) {
      saveUsers([DEMO_USER]);
    }
  }

  function getCurrentUser() {
    const localUser = readJson(localStorage, CURRENT_USER_KEY, null);
    if (localUser && typeof localUser.name === "string") {
      return localUser;
    }
    const sessionUser = readJson(sessionStorage, CURRENT_USER_KEY, null);
    if (sessionUser && typeof sessionUser.name === "string") {
      return sessionUser;
    }
    return null;
  }

  /* --------------------------------------------------------------------------
     Validation Helpers
     -------------------------------------------------------------------------- */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function setFieldError(inputEl, errorEl, message) {
    if (message) {
      inputEl.classList.add("is-invalid");
      inputEl.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
    } else {
      inputEl.classList.remove("is-invalid");
      inputEl.removeAttribute("aria-invalid");
      errorEl.textContent = "";
    }
  }

  function validateLoginEmail() {
    const value = loginEmail.value.trim();
    if (value === "") {
      setFieldError(loginEmail, loginEmailError, "Email address is required.");
      return false;
    }
    if (!isValidEmail(value)) {
      setFieldError(loginEmail, loginEmailError, "Please enter a valid email address.");
      return false;
    }
    setFieldError(loginEmail, loginEmailError, "");
    return true;
  }

  function validateLoginPassword() {
    const value = loginPassword.value.trim();
    if (value === "") {
      setFieldError(loginPassword, loginPasswordError, "Password is required.");
      return false;
    }
    setFieldError(loginPassword, loginPasswordError, "");
    return true;
  }

  function validateSignupName() {
    const value = signupName.value.trim();
    if (value === "") {
      setFieldError(signupName, signupNameError, "Full name is required.");
      return false;
    }
    if (value.length < 3) {
      setFieldError(signupName, signupNameError, "Full name must be at least 3 characters.");
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(value)) {
      setFieldError(signupName, signupNameError, "Full name may contain letters and spaces only.");
      return false;
    }
    setFieldError(signupName, signupNameError, "");
    return true;
  }

  function validateSignupEmail() {
    const value = signupEmail.value.trim().toLowerCase();
    if (value === "") {
      setFieldError(signupEmail, signupEmailError, "Email address is required.");
      return false;
    }
    if (!isValidEmail(value)) {
      setFieldError(signupEmail, signupEmailError, "Please enter a valid email address.");
      return false;
    }
    const alreadyExists = getUsers().some(function (user) {
      return user.email.toLowerCase() === value;
    });
    if (alreadyExists) {
      setFieldError(signupEmail, signupEmailError, "An account with this email already exists.");
      return false;
    }
    setFieldError(signupEmail, signupEmailError, "");
    return true;
  }

  function validateSignupPassword() {
    const value = signupPassword.value.trim();
    if (value === "") {
      setFieldError(signupPassword, signupPasswordError, "Password is required.");
      return false;
    }
    if (value.length < 8) {
      setFieldError(signupPassword, signupPasswordError, "Password needs at least 8 characters.");
      return false;
    }
    if (!/[A-Z]/.test(value)) {
      setFieldError(signupPassword, signupPasswordError, "Password needs at least one uppercase letter.");
      return false;
    }
    if (!/[0-9]/.test(value)) {
      setFieldError(signupPassword, signupPasswordError, "Password needs at least one number.");
      return false;
    }
    if (!/[^A-Za-z0-9\s]/.test(value)) {
      setFieldError(signupPassword, signupPasswordError, "Password needs at least one special character.");
      return false;
    }
    setFieldError(signupPassword, signupPasswordError, "");
    return true;
  }

  function validateSignupConfirm() {
    const passwordValue = signupPassword.value.trim();
    const confirmValue = signupConfirm.value.trim();
    if (confirmValue === "") {
      setFieldError(signupConfirm, signupConfirmError, "Please confirm your password.");
      return false;
    }
    if (confirmValue !== passwordValue) {
      setFieldError(signupConfirm, signupConfirmError, "Passwords do not match.");
      return false;
    }
    setFieldError(signupConfirm, signupConfirmError, "");
    return true;
  }

  /* --------------------------------------------------------------------------
     Password Strength Meter Calculation
     -------------------------------------------------------------------------- */
  function updateStrengthMeter() {
    const value = signupPassword.value;
    if (value === "") {
      strengthMeter.classList.add("hidden");
      strengthBar.className = "strength-bar";
      strengthLabel.className = "strength-label";
      strengthLabel.textContent = "";
      return;
    }

    let score = 0;
    if (value.length >= 8) score += 1;
    if (value.length >= 12) score += 1;
    if (/[a-z]/.test(value)) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9\s]/.test(value)) score += 1;

    let level = "weak";
    let labelText = "Weak";

    if (value.length >= 8 && score >= 5) {
      level = "strong";
      labelText = "Strong";
    } else if (value.length >= 8 && score >= 3) {
      level = "medium";
      labelText = "Medium";
    }

    strengthMeter.classList.remove("hidden");
    strengthBar.className = "strength-bar " + level;
    strengthLabel.className = "strength-label " + level;
    strengthLabel.textContent = labelText;
  }

  /* --------------------------------------------------------------------------
     Live Password Requirements Checklist
     Tests the same four rules as validateSignupPassword() and updates each
     checklist item: ✓ in --primary when met, ✗ in --error when not met.
     -------------------------------------------------------------------------- */
  const pwdChecklistItems = document.querySelectorAll("#pwdChecklist li");

  function updatePwdChecklist(value) {
    // Define the four rules in the same order as validateSignupPassword
    const rules = {
      length:  value.length >= 8,
      upper:   /[A-Z]/.test(value),
      number:  /[0-9]/.test(value),
      special: /[^A-Za-z0-9\s]/.test(value)
    };

    pwdChecklistItems.forEach(function (item) {
      const rule = item.dataset.rule;    // e.g. "length"
      const icon = item.querySelector(".check-icon");
      const met  = rules[rule];

      if (met) {
        item.classList.add("met");       // green colour via CSS
        icon.textContent = "✓";
      } else {
        item.classList.remove("met");    // red colour via CSS
        icon.textContent = "✗";
      }
    });
  }

  /* --------------------------------------------------------------------------
     UI State Helpers (Mobile Switch, Logged-In View, Success Overlay)
     -------------------------------------------------------------------------- */
  function switchMobilePanel(target) {
    if (target === "signup") {
      loginPanel.classList.remove("is-active-mobile");
      signupPanel.classList.add("is-active-mobile");
      signupName.focus();
    } else {
      signupPanel.classList.remove("is-active-mobile");
      loginPanel.classList.add("is-active-mobile");
      loginEmail.focus();
    }
  }

  function showAlreadyLoggedInView(user) {
    loggedInName.textContent = user.name;
    authCard.classList.add("hidden");
    alreadyLoggedInCard.classList.remove("hidden");
  }

  function showAuthFormsView() {
    alreadyLoggedInCard.classList.add("hidden");
    authCard.classList.remove("hidden");
    prefillRememberedEmail();
  }

  function prefillRememberedEmail() {
    const savedEmail = readString(localStorage, REMEMBERED_EMAIL_KEY);
    if (savedEmail) {
      loginEmail.value = savedEmail;
      rememberMeCheckbox.checked = true;
    } else {
      loginEmail.value = "";
      rememberMeCheckbox.checked = false;
    }
  }

  // State 4: Success overlay with 3-second countdown and auto-redirect
  function showSuccessModal() {
    let secondsLeft = 3;
    redirectCountdownText.textContent =
      "Redirecting to Home Page in " + secondsLeft + "...";

    successOverlay.classList.remove("hidden");
    exploreRecipesBtn.focus();

    if (countdownInterval !== null) {
      clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(function () {
      secondsLeft -= 1;
      if (secondsLeft > 0) {
        redirectCountdownText.textContent =
          "Redirecting to Home Page in " + secondsLeft + "...";
      } else {
        clearInterval(countdownInterval);
        countdownInterval = null;
        window.location.href = "../index.html";
      }
    }, 1000);
  }

  /* --------------------------------------------------------------------------
     Live Validation Listeners
     -------------------------------------------------------------------------- */
  function attachLiveValidation(inputEl, errorEl, validatorFn, isLoginField) {
    inputEl.addEventListener("blur", function () {
      validatorFn();
    });

    inputEl.addEventListener("input", function () {
      // Remove red border immediately when the user starts typing again
      if (isLoginField) {
        inputEl.classList.remove("is-invalid");
        inputEl.removeAttribute("aria-invalid");
        errorEl.textContent = "";
        return;
      }

      // For sign-up fields, re-check live once an error has been shown
      if (inputEl.classList.contains("is-invalid")) {
        validatorFn();
      }
    });
  }

  attachLiveValidation(loginEmail, loginEmailError, validateLoginEmail, true);
  attachLiveValidation(loginPassword, loginPasswordError, validateLoginPassword, true);

  attachLiveValidation(signupName, signupNameError, validateSignupName, false);
  attachLiveValidation(signupEmail, signupEmailError, validateSignupEmail, false);
  attachLiveValidation(signupPassword, signupPasswordError, validateSignupPassword, false);
  attachLiveValidation(signupConfirm, signupConfirmError, validateSignupConfirm, false);

  signupPassword.addEventListener("input", function () {
    updateStrengthMeter();
    updatePwdChecklist(signupPassword.value); // update the live checklist on every keystroke
    if (signupConfirm.value !== "" || signupConfirm.classList.contains("is-invalid")) {
      validateSignupConfirm();
    }
  });

  /* --------------------------------------------------------------------------
     Show / Hide Password Toggles
     -------------------------------------------------------------------------- */
  document.querySelectorAll(".toggle-password-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const targetInput = document.getElementById(btn.dataset.target);
      if (!targetInput) {
        return;
      }

      const isHidden = targetInput.type === "password";
      targetInput.type = isHidden ? "text" : "password";

      btn.setAttribute("aria-pressed", String(isHidden));
      btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");

      const openEye = btn.querySelector(".eye-open");
      const closedEye = btn.querySelector(".eye-closed");
      openEye.classList.toggle("hidden", isHidden);
      closedEye.classList.toggle("hidden", !isHidden);
    });
  });

  /* --------------------------------------------------------------------------
     Form Submissions (Login & Sign-Up) with Double-Submit Guard
     -------------------------------------------------------------------------- */
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (loginSubmitBtn.disabled) {
      return;
    }

    signupSuccessNotice.classList.add("hidden");
    loginErrorAlert.classList.add("hidden");

    const emailOk = validateLoginEmail();
    const passwordOk = validateLoginPassword();

    const enteredEmail = loginEmail.value.trim().toLowerCase();
    const enteredPassword = loginPassword.value.trim();

    // Prevent double submission while checking credentials
    loginSubmitBtn.disabled = true;
    loginSubmitBtn.textContent = "Logging in...";

    setTimeout(function () {
      const matchedUser = emailOk && passwordOk
        ? getUsers().find(function (user) {
            return (
              user.email.toLowerCase() === enteredEmail &&
              user.password === enteredPassword
            );
          })
        : null;

      if (!matchedUser) {
        // State 3: Validation / authentication failure
        loginSubmitBtn.disabled = false;
        loginSubmitBtn.textContent = "Login";

        loginEmail.classList.add("is-invalid");
        loginPassword.classList.add("is-invalid");
        loginErrorAlert.classList.remove("hidden");
        loginErrorAlert.focus();
        return;
      }

      // Save current session according to "Remember Me"
      const sessionPayload = {
        name: matchedUser.name,
        email: matchedUser.email
      };

      if (rememberMeCheckbox.checked) {
        writeJson(localStorage, CURRENT_USER_KEY, sessionPayload);
        removeItemSafe(sessionStorage, CURRENT_USER_KEY);
        writeString(localStorage, REMEMBERED_EMAIL_KEY, matchedUser.email);
      } else {
        writeJson(sessionStorage, CURRENT_USER_KEY, sessionPayload);
        removeItemSafe(localStorage, CURRENT_USER_KEY);
        removeItemSafe(localStorage, REMEMBERED_EMAIL_KEY);
      }

      loginSubmitBtn.disabled = false;
      loginSubmitBtn.textContent = "Login";

      // State 4: Success modal + countdown redirect
      showSuccessModal();
    }, 350);
  });

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (signupSubmitBtn.disabled) {
      return;
    }

    const nameOk = validateSignupName();
    const emailOk = validateSignupEmail();
    const passwordOk = validateSignupPassword();
    const confirmOk = validateSignupConfirm();

    if (!nameOk || !emailOk || !passwordOk || !confirmOk) {
      const firstInvalid = signupForm.querySelector(".is-invalid");
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    signupSubmitBtn.disabled = true;
    signupSubmitBtn.textContent = "Creating account...";

    const newUser = {
      name: signupName.value.trim(),
      email: signupEmail.value.trim().toLowerCase(),
      password: signupPassword.value.trim()
    };

    setTimeout(function () {
      const users = getUsers();
      users.push(newUser);
      saveUsers(users);

      // Reset sign-up form, strength meter, and password checklist
      signupForm.reset();
      updateStrengthMeter();
      updatePwdChecklist(""); // reset all checklist items to ✗

      // Prepare login form with new user's email and success notice
      loginErrorAlert.classList.add("hidden");
      setFieldError(loginEmail, loginEmailError, "");
      setFieldError(loginPassword, loginPasswordError, "");
      loginEmail.value = newUser.email;
      loginPassword.value = "";
      signupSuccessNotice.classList.remove("hidden");

      signupSubmitBtn.disabled = false;
      signupSubmitBtn.textContent = "Sign Up";

      // Switch to Sign-In panel on mobile and move focus to password field
      if (window.innerWidth < 768) {
        loginPanel.classList.add("is-active-mobile");
        signupPanel.classList.remove("is-active-mobile");
      }
      loginPassword.focus();
    }, 350);
  });

  /* --------------------------------------------------------------------------
     Mobile Form Switch & Logout Handlers
     -------------------------------------------------------------------------- */
  showSignupBtn.addEventListener("click", function () {
    switchMobilePanel("signup");
  });

  showLoginBtn.addEventListener("click", function () {
    switchMobilePanel("login");
  });

  logoutBtn.addEventListener("click", function () {
    removeItemSafe(localStorage, CURRENT_USER_KEY);
    removeItemSafe(sessionStorage, CURRENT_USER_KEY);
    loginErrorAlert.classList.add("hidden");
    signupSuccessNotice.classList.add("hidden");
    showAuthFormsView();
    loginEmail.focus();
  });

  /* --------------------------------------------------------------------------
     Forgot Password Modal Logic
     -------------------------------------------------------------------------- */
  function openForgotModal() {
    forgotEmail.value = loginEmail.value.trim();
    forgotEmail.classList.remove("is-invalid");
    forgotFeedback.className = "modal-feedback hidden";
    forgotFeedback.textContent = "";
    forgotModal.classList.remove("hidden");
    forgotEmail.focus();
  }

  function closeForgotModal() {
    forgotModal.classList.add("hidden");
    forgotPasswordBtn.focus();
  }

  forgotPasswordBtn.addEventListener("click", openForgotModal);
  closeForgotModalBtn.addEventListener("click", closeForgotModal);

  forgotModal.addEventListener("click", function (event) {
    if (event.target === forgotModal) {
      closeForgotModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !forgotModal.classList.contains("hidden")) {
      closeForgotModal();
    }
  });

  forgotEmail.addEventListener("input", function () {
    forgotEmail.classList.remove("is-invalid");
  });

  forgotForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const enteredEmail = forgotEmail.value.trim().toLowerCase();

    if (enteredEmail === "" || !isValidEmail(enteredEmail)) {
      forgotEmail.classList.add("is-invalid");
      forgotFeedback.className = "modal-feedback is-error";
      forgotFeedback.textContent = "Please enter a valid email address.";
      return;
    }

    const exists = getUsers().some(function (user) {
      return user.email.toLowerCase() === enteredEmail;
    });

    if (exists) {
      forgotEmail.classList.remove("is-invalid");
      forgotFeedback.className = "modal-feedback is-success";
      forgotFeedback.textContent =
        "A reset link has been sent to " + enteredEmail + ".";
    } else {
      forgotEmail.classList.add("is-invalid");
      forgotFeedback.className = "modal-feedback is-error";
      forgotFeedback.textContent = "No account found with this email.";
    }
  });

  /* --------------------------------------------------------------------------
     Initial Page Setup
     -------------------------------------------------------------------------- */
  ensureDemoUser();

  const activeUser = getCurrentUser();
  if (activeUser) {
    showAlreadyLoggedInView(activeUser);
  } else {
    showAuthFormsView();
  }
})();
