/* ==========================================================================
   easter-egg.js - the secret feature.
   Press and HOLD the light/dark toggle for 5 seconds -> a small dropdown opens with a password box.
     Dhruv     -> an easter egg cracks open
     christmas -> red & white theme with falling snow
     Man       -> Halloween theme with bats and pumpkins
     Love      -> pink theme with floating hearts
     Pride     -> rainbow theme with confetti
   Each password UNLOCKS only its own secret. The dropdown then lists Default plus every secret found so far
   (the rest show as "🔒 Locked"), with a password box underneath to find more. After the first find, a small 🎨
   button next to the toggle reopens the list. Refreshing the page locks everything again and resets the theme.
   Passwords are not case-sensitive ("LOVE", "love" and "Love" all work).
   ========================================================================== */

// Wrapping everything in { } with "let/const" inside keeps these variables private to this file,
// so they can't clash with names used in main.js
{
  const HOLD_MS = 5000;                                    // How long (milliseconds) the toggle must be held: 5000 ms = 5 seconds

  // The themes in the dropdown list. "id" is the value put on <html data-fun="..."> (used by easter-egg.css);
  // "particles" float down the screen; "toast" is the little message shown at the bottom
  const THEMES = [
    { id: "default",   label: "Default",   emoji: "✨" },
    { id: "christmas", label: "Christmas", emoji: "🎄", particles: ["❄", "❅", "❆", "🎄"],    toast: "🎄 Merry Christmas!" },
    { id: "halloween", label: "Halloween", emoji: "🎃", particles: ["🦇", "🎃", "👻", "🕸️"], toast: "🎃 Happy Halloween!" },
    { id: "love",      label: "Love",      emoji: "💖", particles: ["💖", "💕", "💗", "🌸"], toast: "💖 Spread the love!" },
    { id: "pride",     label: "Pride",     emoji: "🌈", particles: ["🌈", "✨", "💜", "💛"], toast: "🌈 Love is love!" }
  ];
  // Which password does what: "egg" plays the egg animation, anything else is a theme id from the list above
  const PASSWORDS = { dhruv: "egg", christmas: "christmas", man: "halloween", love: "love", pride: "pride" };

  // The secrets found so far. A "Set" is a list that can't hold duplicates, so entering the same password twice is harmless.
  // It lives only in memory, so a page refresh empties it again.
  const found = new Set();
  const TOTAL_SECRETS = Object.keys(PASSWORDS).length;     // 5: four themes + the egg
  let current = "default";                                 // The theme currently showing

  /* ---------------- 1. Build the dropdown (only once, when the page loads) ---------------- */
  const actions = document.querySelector(".nav-actions");  // The box holding the toggle (and the menu button on phones)
  const toggle = document.querySelector("#themeToggle");   // The light/dark toggle - also the secret's trigger

  const menu = document.createElement("div");              // The dropdown panel
  menu.className = "fun-menu";
  menu.id = "funMenu";
  menu.hidden = true;                                      // Hidden until the secret is triggered
  menu.setAttribute("role", "dialog");                     // Screen readers treat it as a small popup...
  menu.setAttribute("aria-label", "Secret themes");        // ...with this name
  actions.append(menu);

  // A small 🎨 button that appears next to the toggle once the first secret is found
  const funBtn = document.createElement("button");
  funBtn.className = "icon-btn fun-btn";
  funBtn.type = "button";
  funBtn.hidden = true;
  funBtn.textContent = "🎨";
  funBtn.setAttribute("aria-label", "Open secret themes");
  funBtn.setAttribute("aria-controls", "funMenu");
  toggle.before(funBtn);                                   // Put it just left of the toggle

  // The password box. Shown alone at first, then under the theme list until every secret is found.
  const passwordForm = (first) => `
    <form id="pwForm" class="fun-form${first ? "" : " fun-form-more"}">
      ${first ? `<p class="fun-title"><span aria-hidden="true">🔐</span> Password</p>
                 <p class="fun-sub">You found a secret door. Know the magic word?</p>`
              : `<p class="fun-sub">Know another magic word?</p>`}
      <input class="pw-input" id="pwInput" type="password" autocomplete="off" placeholder="••••••" aria-label="Password">
      <p class="pw-error" id="pwError" role="alert"></p>
      <button type="submit" class="btn btn-primary btn-small fun-unlock">Unlock</button>
    </form>`;
  // role="alert" makes screen readers read the error message out loud as soon as it appears

  // One row of the list: a clickable button if found, a greyed-out "Locked" row if not (its name stays a secret)
  const optionRow = (secretFound, attrs, emoji, label) => secretFound
    ? `<button type="button" class="fun-option" ${attrs}><span aria-hidden="true">${emoji}</span> ${label}</button>`
    : `<div class="fun-option fun-locked" aria-label="Locked secret"><span aria-hidden="true">🔒</span> Locked</div>`;

  // Fills the dropdown: just the password box until the first find, then the list + progress + password box
  function renderMenu() {
    if (found.size === 0) {                                // Nothing found yet
      menu.innerHTML = passwordForm(true);
    } else {
      menu.innerHTML = `
        <p class="fun-title"><span aria-hidden="true">🎨</span> Secret themes</p>
        <p class="fun-sub">${found.size} of ${TOTAL_SECRETS} secrets found. Refresh the page to lock them again.</p>
        <div class="fun-options">
          ${THEMES.map((t) => optionRow(t.id === "default" || found.has(t.id),
              `data-theme="${t.id}" aria-pressed="${t.id === current}"`, t.emoji, t.label)).join("")}
          ${optionRow(found.has("egg"), `data-egg="1"`, "🥚", "Replay easter egg")}
        </div>
        ${found.size < TOTAL_SECRETS ? passwordForm(false) : ""}`;
      // aria-pressed="true" marks the theme that's currently on (CSS highlights it with a tick)
    }
    menu.querySelector("#pwForm")?.addEventListener("submit", checkPassword); // "?." = only if the form is there
  }

  function openMenu() {
    renderMenu();
    menu.hidden = false;
    (menu.querySelector("#pwInput") || menu.querySelector(".fun-option")).focus(); // Cursor straight into the box / first option
  }
  const closeMenu = () => { menu.hidden = true; };

  /* ---------------- 2. Press and HOLD the light/dark toggle ---------------- */
  // "Pointer events" work the same for a mouse, a finger on a touchscreen and a pen:
  //   pointerdown = pressed, pointerup = released, pointerleave = moved off the button,
  //   pointercancel = the browser took over (e.g. the visitor started scrolling with their finger)
  let holdTimer = null;                                    // The running 5-second countdown (null = none)
  let heldOpen = false;                                    // true right after a successful hold (see "click" below)

  toggle.addEventListener("pointerdown", () => {
    heldOpen = false;
    clearTimeout(holdTimer);                               // Never run two countdowns at once
    holdTimer = setTimeout(() => { heldOpen = true; openMenu(); }, HOLD_MS); // Still held after 5 s -> open the dropdown
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach((type) =>
    toggle.addEventListener(type, () => clearTimeout(holdTimer))); // Let go too early -> cancel the countdown
  toggle.addEventListener("contextmenu", (e) => e.preventDefault()); // Stop a phone long-press from opening its own menu

  // Letting go after a successful hold also counts as a normal "click", which would flip light/dark.
  // This listener runs FIRST ("true" = capture phase, on the way down to the button) and swallows that one click.
  document.addEventListener("click", (e) => {
    if (heldOpen && e.target.closest("#themeToggle")) {
      e.stopPropagation();                                 // The click never reaches main.js's light/dark code
      heldOpen = false;
    }
  }, true);

  funBtn.addEventListener("click", () => (menu.hidden ? openMenu() : closeMenu())); // 🎨 button opens/closes the list

  // Close the dropdown when clicking anywhere else, or pressing Esc
  document.addEventListener("click", (e) => {
    if (!menu.hidden && !e.target.closest("#funMenu, #themeToggle, .fun-btn")) closeMenu();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { closeMenu(); toggle.focus(); } });

  /* ---------------- 3. Check the password ---------------- */
  function checkPassword(e) {
    e.preventDefault();                                    // Stop the form from reloading the page (a form's default action)
    const input = menu.querySelector("#pwInput");
    const word = input.value.trim().toLowerCase();         // trim() removes stray spaces; toLowerCase() makes it case-insensitive
    const result = PASSWORDS[word];                        // undefined if the word isn't a password

    if (!result) {                                         // Wrong password: show an error and shake the dropdown
      menu.querySelector("#pwError").textContent = "Nope, that's not it. Try again!";
      menu.classList.remove("shake");                      // Remove first so the shake can replay on every wrong try...
      void menu.offsetWidth;                               // ...reading offsetWidth forces the browser to notice the removal...
      menu.classList.add("shake");                         // ...then add it back to restart the animation
      input.select();                                      // Highlight the wrong text so typing replaces it
      return;
    }

    found.add(result);                                     // Unlock ONLY this password's secret
    funBtn.hidden = false;                                 // Show the 🎨 shortcut button (from the first find onwards)
    if (result === "egg") { closeMenu(); openEgg(); }      // "Dhruv": play the egg animation (it's now in the list too)
    else { applyTheme(result); renderMenu(); }             // A theme password: switch to it and re-draw the list
  }

  // Clicks on the theme list (one listener for all buttons = "event delegation")
  menu.addEventListener("click", (e) => {
    const option = e.target.closest("button.fun-option");  // Only real buttons - the "🔒 Locked" rows are not clickable
    if (!option) return;
    if (option.dataset.egg) { closeMenu(); openEgg(); return; }
    applyTheme(option.dataset.theme);
    renderMenu();                                          // Re-draw so the highlighted (current) theme updates
  });

  /* ---------------- 4. Secret themes ---------------- */
  let funLayer = null;                                     // The layer of falling particles (null = none yet)

  function applyTheme(id) {
    const theme = THEMES.find((t) => t.id === id);         // .find() = the first item in the list that matches
    current = id;
    funLayer?.remove();                                    // "?." = only call remove() if a previous layer exists
    funLayer = null;
    if (id === "default") {                                // Default: remove the secret theme completely
      delete document.documentElement.dataset.fun;         // No data-fun on <html> -> the normal colours come back
      showToast("✨ Back to the default theme");
      return;
    }
    document.documentElement.dataset.fun = id;             // <html data-fun="..."> -> easter-egg.css re-colours the site
    funLayer = document.createElement("div");
    funLayer.className = "fun-layer";
    funLayer.setAttribute("aria-hidden", "true");          // Pure decoration, hidden from screen readers
    const count = innerWidth < 600 ? 18 : 32;              // Fewer particles on phones (smaller screen, slower devices)
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.textContent = theme.particles[i % theme.particles.length]; // Cycle through the theme's emojis
      const rand = (min, max) => min + Math.random() * (max - min); // Random number between min and max
      // Each particle gets its own random position, size, speed... via CSS variables that easter-egg.css reads
      s.style.setProperty("--x", `${rand(0, 100)}%`);       // Horizontal start position
      s.style.setProperty("--size", `${rand(14, 30)}px`);   // Size
      s.style.setProperty("--alpha", rand(0.4, 0.9).toFixed(2)); // Transparency
      s.style.setProperty("--dur", `${rand(7, 16)}s`);      // Time to fall the whole screen
      s.style.setProperty("--delay", `${rand(-16, 0)}s`);   // Negative delay = already part-way down at the start
      s.style.setProperty("--drift", `${rand(-80, 80)}px`); // Sideways drift
      s.style.setProperty("--spin", `${rand(-360, 360)}deg`); // Rotation
      funLayer.append(s);
    }
    document.body.append(funLayer);
    showToast(theme.toast);
  }

  function showToast(message) {                            // Small message at the bottom that disappears by itself
    document.querySelector(".fun-toast")?.remove();        // Remove an older toast if one is still showing
    const toast = document.createElement("div");
    toast.className = "fun-toast";
    toast.setAttribute("role", "status");                  // Screen readers read it politely, without interrupting
    toast.textContent = message;
    document.body.append(toast);
    setTimeout(() => toast.remove(), 4000);                // Remove it after its 4-second CSS animation ends
  }

  /* ---------------- 5. The easter egg ---------------- */
  function openEgg() {
    const overlay = document.createElement("div");
    overlay.className = "egg-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Easter egg");
    overlay.innerHTML = `
      <div class="egg" aria-hidden="true">
        <span class="egg-chick">🐣</span>
        <div class="egg-half egg-bottom"></div>
        <div class="egg-half egg-top"></div>
      </div>
      <div class="egg-message">
        <h2>You found the easter egg!</h2>
        <p>Thanks for exploring this closely. That's the kind of curiosity I bring to my work.</p>
        <p class="egg-hint">(click anywhere to close)</p>
      </div>`;

    const colors = ["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa", "#f472b6"]; // Confetti colours
    for (let i = 0; i < 40; i++) {                         // 40 pieces of confetti
      const c = document.createElement("i");
      c.className = "confetti";
      const angle = Math.random() * Math.PI * 2;           // Random direction (in radians: a full circle is 2π)
      const dist = 120 + Math.random() * 260;              // Random distance to fly
      c.style.setProperty("--tx", `${Math.cos(angle) * dist}px`); // cos/sin turn a direction + distance into x and y
      c.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
      c.style.setProperty("--spin", `${Math.random() * 720}deg`);
      c.style.setProperty("--c", colors[i % colors.length]);
      overlay.append(c);
    }

    const close = () => {                                  // Fade out, then remove from the page
      overlay.classList.add("closing");
      setTimeout(() => overlay.remove(), 400);
      document.removeEventListener("keydown", onKey);
    };
    const onKey = (e) => { if (e.key === "Escape") close(); }; // Esc key also closes it
    overlay.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    document.body.append(overlay);
  }
}
