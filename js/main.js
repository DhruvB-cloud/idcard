/* ==========================================================================
   main.js - makes the page come alive:
   1. Reads the content from data.js (the SITE object) and builds the HTML for each section
   2. Runs the interactive bits: theme switch, phone menu, typing effect,
      scroll animations, number counters, filters, copy-email button
   Jargon:
   - "DOM" = the browser's live, editable version of the HTML page
   - "template literal" = a string in `backticks` where ${...} inserts a value
   - "event listener" = code that waits for something to happen (a click, a scroll) and then runs
   ========================================================================== */

// Shortcut helper: $("#id") finds one element on the page (like a mini jQuery)
const $ = (selector) => document.querySelector(selector);

// Checks whether the visitor asked their OS for less animation (accessibility setting)
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Returns the extra CSS class "placeholder" if a piece of text still contains the word PLACEHOLDER,
// so unfinished cards get a dashed yellow outline and are easy to spot
const ph = (...texts) => (texts.join(" ").includes("PLACEHOLDER") ? " placeholder" : "");

// Helper for optional fields: if "value" is filled in, return the HTML built from it; if it's missing or "", return nothing.
// (Without this, a missing field would print the word "undefined" on the card.)
// It sits at the top because "const" helpers must be defined BEFORE the lines that use them.
const opt = (value, html) => (value ? html : "");

// Pull the profile part out of SITE so we can write "p.name" instead of "SITE.profile.name"
const p = SITE.profile;

/* ---------------- 1. Fill in the hero, links and contact info ---------------- */
$("#heroName").textContent = p.name;                       // Your name in the big heading
$("#heroTagline").textContent = p.tagline;                 // The pitch paragraph
$("#statusText").textContent = p.status;                   // Text inside the green "open to work" pill
$("#statusPill").hidden = !p.openToWork;                   // Hide the green pill if openToWork is false
$("#hubStrip").href = p.apphub;                            // "Want to try them?" banner -> AppHub
$("#resumeBtn").href = p.resumePdf;                        // Download button -> your PDF
// A button that leads to a "file not found" page looks careless, so check the PDF exists first.
// fetch() asks the server for the file; method "HEAD" means "just tell me if it exists, don't send it"
fetch(p.resumePdf, { method: "HEAD" })
  .then((res) => { if (!res.ok) $("#resumeBtn").hidden = true; })  // res.ok is false for 404 "not found"
  .catch(() => { $("#resumeBtn").hidden = true; });                 // Network error (or opened as a file) -> hide too
$("#linkedinLink").href = $("#contactLinkedin").href = p.linkedin; // Both LinkedIn links (hero + contact)
$("#githubLink").href = $("#contactGithub").href = p.github;       // Both GitHub links
$("#emailLink").href = $("#contactEmail").href = `mailto:${p.email}`; // "mailto:" opens the visitor's email app
$("#copyEmailText").textContent = p.email;                 // Email shown in the copy button
$("#year").textContent = new Date().getFullYear();         // Current year in the footer, so it never goes stale

// Photo: try to load assets/photo.jpg; if it doesn't exist yet, keep showing the initials
const img = new Image();                                   // Create an <img> in memory (not on the page yet)
img.alt = `Photo of ${p.name}`;                            // Alt text describes the image for screen readers
img.onload = () => $("#heroPhoto").replaceChildren(img);   // Loaded OK -> swap the initials for the photo
img.src = p.photo;                                         // Setting src starts the download
$("#photoInitials").textContent = p.initials;              // Initials stay visible until (unless) the photo loads


/* ---------------- 2. Build each section from data.js ---------------- */

// ABOUT: one <p> per paragraph
$("#aboutText").innerHTML = SITE.about.map((para) => `<p>${para}</p>`).join("");
// .map() turns each item into an HTML string; .join("") glues them into one string

// STATS: counters start at 0; data-target holds the number to count up to
$("#stats").innerHTML = SITE.stats.map((s) => `
  <div class="stat card">
    <span class="stat-num" data-target="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</span>
    <span class="stat-label">${s.label}</span>
  </div>`).join("");

// Small helper that turns a list of words into tag "chips"
const tagsHTML = (tags) => tags.map((t) => `<span class="tag">${t}</span>`).join("");

// EXPERIENCE timeline: one <li> per job
$("#timeline").innerHTML = SITE.experience.map((job) => `
  <li class="tl-item reveal">
    <article class="tl-card card">
      <div class="tl-top"><h3>${job.role}</h3><span class="tl-period mono">${job.period}</span></div>
      <p class="tl-company">${job.company} <span>· ${job.place}</span></p>
      <ul class="tl-points">${job.points.map((pt) => `<li>${pt}</li>`).join("")}</ul>
      <div class="tags">${tagsHTML(job.tags)}</div>
    </article>
  </li>`).join("")
  // ...then EDUCATION is added at the end of the same timeline (it's the oldest entry).
  // [].concat(...) turns a single education object into a list, so data.js can hold one degree OR a list of several
  + [].concat(SITE.education || []).map((edu) => `
  <li class="tl-item tl-edu reveal">
    <article class="tl-card card">
      <span class="tl-label mono">Education</span>
      <div class="tl-top"><h3>${edu.degree}</h3><span class="tl-period mono">${edu.period}</span></div>
      <p class="tl-company">${edu.school}</p>
    </article>
  </li>`).join("");
// "+" here joins the jobs' HTML and the education HTML into one string

// SKILLS: one card per group, one chip per skill (with its logo if an icon is given)
$("#skillsGrid").innerHTML = SITE.skills.map((g) => `
  <div class="skill-card card reveal">
    <h3>${g.group}</h3>
    <div class="skill-list">
      ${g.items.map((s) => `<span class="skill">${s.icon ? `<i class="${s.icon}" aria-hidden="true"></i>` : ""}${s.name}</span>`).join("")}
    </div>
  </div>`).join("");

// PROJECTS: compact cards side by side. Each card shows the picture, name, tagline, one highlight line, tags and links.
// Clicking the card (anywhere except a link) opens a popup with the full "What I built" list.
// The picture is a screenshot if there is one; otherwise the app icon (or an emoji) on a coloured banner.
const projectVisual = (pr) =>
  pr.image ? `<img src="${pr.image}" alt="Screenshot of ${pr.name}" loading="lazy">`
  : pr.icon ? `<div class="project-banner"><img class="project-icon" src="${pr.icon}" alt="${pr.name} app icon"></div>`
  : `<div class="project-banner"><span class="project-emoji" aria-hidden="true">${pr.emoji || "💻"}</span></div>`;
// (a ? b : c ? d : e) is two "ternaries" in a row: if a then b, else if c then d, else e

// The link buttons (and the "code on request" note) - used on the card AND in the popup
const projectLinks = (pr) => `
  <div class="project-links">
    ${pr.links.map((l, j) => `<a class="btn btn-small ${j === 0 ? "btn-primary" : "btn-ghost"}" href="${l.url}" target="_blank" rel="noopener">${l.label} &nearr;</a>`).join("")}
    ${opt(pr.note, `<span class="project-note">🔒 ${pr.note}</span>`)}
  </div>`;
// j === 0 ? "btn-primary" : "btn-ghost" = the first link is a filled button, the rest are outlined

$("#projectList").innerHTML = SITE.projects.map((pr, i) => `
  <article class="project card reveal" data-index="${i}" tabindex="0" role="button" aria-haspopup="dialog"
           aria-label="Show what I built: ${pr.name}">
    <div class="project-visual">${projectVisual(pr)}</div>
    <div class="project-info">
      <span class="project-num mono">0${i + 1}</span>
      <h3>${pr.name}</h3>
      <p class="project-tagline">${pr.tagline}</p>
      ${opt(pr.highlight, `<p class="project-highlight">${pr.highlight}</p>`)}
      <div class="tags">${tagsHTML(pr.tags)}</div>
      ${projectLinks(pr)}
      <span class="project-more mono">What I built &rarr;</span>
    </div>
  </article>`).join("");

// The popup with the full details of one project. It reuses the event popup's look (class "event-dialog").
const projectDialog = document.createElement("dialog");
projectDialog.className = "event-dialog project-dialog";
projectDialog.setAttribute("aria-labelledby", "projectDialogTitle");
document.body.append(projectDialog);

const openProject = (i) => {
  const pr = SITE.projects[i];
  projectDialog.innerHTML = `
    <button class="event-close" aria-label="Close details">&times;</button>
    <div class="project-visual">${projectVisual(pr)}</div>
    <div class="event-body">
      <span class="project-num mono">0${+i + 1}</span>
      <h3 id="projectDialogTitle">${pr.name}</h3>
      <p class="project-tagline">${pr.tagline}</p>
      <p class="built-title mono">What I built</p>
      <ul class="tl-points">${pr.built.map((b) => `<li>${b}</li>`).join("")}</ul>
      <div class="tags">${tagsHTML(pr.tags)}</div>
      ${projectLinks(pr)}
    </div>`;
  // +i turns the text "0" (from data-index) into the number 0, so +i + 1 is 1 rather than "01"
  projectDialog.querySelector(".event-close").addEventListener("click", () => projectDialog.close());
  projectDialog.showModal();
};

// Clicking a card opens its popup - but clicking one of its link buttons should just follow the link
$("#projectList").addEventListener("click", (e) => {
  if (e.target.closest("a")) return;                         // A link was clicked -> let it open normally
  const card = e.target.closest(".project");
  if (card) openProject(card.dataset.index);
});
$("#projectList").addEventListener("keydown", (e) => {       // Keyboard: Enter or Space on a focused card
  if (e.target.closest("a")) return;                         // (Enter on a focused link should open the link)
  const card = e.target.closest(".project");
  if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openProject(card.dataset.index); }
});
projectDialog.addEventListener("click", (e) => { if (e.target === projectDialog) projectDialog.close(); }); // Click outside -> close

// EARLIER WORK: small cards for older college projects
// If ANY card has a picture, the cards without one get a coloured emoji banner instead, so all cards keep the same shape.
// If NO card has a picture, there are no banners at all and the cards stay compact.
const anyEarlierImage = SITE.earlierProjects.some((pr) => pr.image);  // .some() = "is this true for at least one item?"
$("#earlierGrid").innerHTML = SITE.earlierProjects.map((pr) => `
  <article class="earlier card reveal">
    ${pr.image
      ? `<img class="earlier-img" src="${pr.image}" alt="${pr.title}" loading="lazy">`
      : opt(anyEarlierImage, `<div class="earlier-img project-banner-static" aria-hidden="true">${pr.emoji || "🛠️"}</div>`)}
    <div class="earlier-body">
      <h4>${pr.title}</h4>
      <p>${pr.text}</p>
      <div class="tags">${tagsHTML(pr.tags)}</div>
    </div>
  </article>`).join("");
// pr.emoji (optional in data.js) picks the banner's emoji; 🛠️ is used if it's missing

// CERTIFICATIONS: one short line under the skills
$("#certStrip").innerHTML = `<span class="cert-label mono">Certifications:</span>` +
  SITE.certifications.map((c) => `<span class="cert"><span class="cert-medal" aria-hidden="true">★</span>${c.title} <em>· ${c.issuer}</em></span>`).join("");

// IN-PERSON WORK: every field is optional.
// The CARD shows only the image, title and impact. Clicking it opens a popup ("maximized" view) with every detail.
// Cards without a photo show a coloured banner with an icon for their type instead (✨ if the type isn't listed here)
const TYPE_ICONS = { Workshop: "🎨", Events: "🎉", Community: "🤝" };
const events = SITE.inPerson.filter((w) => Object.values(w).some((v) => v)); // Skip completely empty entries so no blank box appears

$("#impactGrid").innerHTML = events.map((w, i) => `
  <article class="impact-card card${opt(w.type, ` type-${w.type}`)}${ph(w.title, w.org, w.text, w.impact)}"
           data-type="${w.type || ""}" data-index="${i}" tabindex="0" role="button" aria-haspopup="dialog"
           aria-label="Show details${opt(w.title, `: ${w.title}`)}">
    ${w.image
      ? `<img class="impact-img" src="${w.image}" alt="" loading="lazy">`
      : `<div class="impact-img impact-fallback" aria-hidden="true">${TYPE_ICONS[w.type] || "✨"}</div>`}
    <div class="impact-body">
      ${opt(w.title,  `<h4>${w.title}</h4>`)}
      ${opt(w.impact, `<p class="impact-highlight">★ ${w.impact}</p>`)}
    </div>
    <span class="expand-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
    </span>
  </article>`).join("");
// data-index = the card's position in the "events" list, so a click knows which event's details to show
// tabindex="0" + role="button" = keyboard users can Tab to the card and press Enter, like a real button
// w.type || "" means "use w.type, or an empty string if it's missing"
// loading="lazy" = the browser only downloads the image when it's about to scroll into view (faster page)

// The popup (<dialog>) that shows ALL details of one event. It's created once and refilled on every click.
const eventDialog = document.createElement("dialog");
eventDialog.className = "event-dialog";
eventDialog.setAttribute("aria-labelledby", "eventDialogTitle"); // Screen readers use the event title as the popup's name
document.body.append(eventDialog);

const openEvent = (w) => {
  eventDialog.innerHTML = `
    <button class="event-close" aria-label="Close details">&times;</button>
    ${opt(w.image, `<img class="event-img" src="${w.image}" alt="${w.title || "Event photo"}">`)}
    <div class="event-body${opt(w.type, ` type-${w.type}`)}">
      ${opt(w.type,   `<span class="type-badge">${w.type}</span>`)}
      <h3 id="eventDialogTitle">${w.title || "Event details"}</h3>
      ${opt(w.org,    `<p class="event-meta">${w.org}</p>`)}
      ${opt(w.text,   `<p class="event-text">${w.text}</p>`)}
      ${opt(w.impact, `<p class="impact-highlight">★ ${w.impact}</p>`)}
    </div>`;
  eventDialog.querySelector(".event-close").addEventListener("click", () => eventDialog.close());
  eventDialog.showModal();                                   // Open as a popup; Esc closes it automatically
};

// One listener on the whole grid handles clicks on ANY card ("event delegation" - fewer listeners, works for every card)
$("#impactGrid").addEventListener("click", (e) => {
  const card = e.target.closest(".impact-card");             // Which card was clicked (if any)
  if (card) openEvent(events[card.dataset.index]);
});
$("#impactGrid").addEventListener("keydown", (e) => {        // Keyboard: Enter or Space on a focused card also opens it
  const card = e.target.closest(".impact-card");
  if (card && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();                                      // Stop Space from scrolling the page
    openEvent(events[card.dataset.index]);
  }
});
eventDialog.addEventListener("click", (e) => { if (e.target === eventDialog) eventDialog.close(); }); // Click the dark area outside -> close

// INTERESTS: a compact row of chips at the bottom of "Beyond code"
$("#interestChips").innerHTML = SITE.interests.map((i) =>
  `<span class="interest-chip"><span aria-hidden="true">${i.emoji}</span> ${i.title}</span>`).join("");

/* ---------------- 3. Dark / light theme switch ---------------- */
$("#themeToggle").addEventListener("click", () => {        // Run this when the button is clicked
  const root = document.documentElement;                    // The <html> element
  const next = root.dataset.theme === "dark" ? "light" : "dark"; // Flip to the other theme
  root.dataset.theme = next;                                // CSS reacts to data-theme and re-colours everything
  try { localStorage.setItem("theme", next); } catch (e) {} // Remember the choice for the next visit (ignore if blocked)
});

/* ---------------- 4. Phone menu (hamburger) ---------------- */
const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");
const setMenu = (open) => {                                 // One function to open OR close the menu
  navLinks.classList.toggle("open", open);                  // Adds the "open" class when open=true, removes it when false
  menuBtn.setAttribute("aria-expanded", open);              // Tells screen readers whether the menu is open
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("open"))); // Toggle on click
navLinks.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); }); // Close after picking a link
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); }); // Esc key closes it too

/* ---------------- 5. Typing animation in the hero ---------------- */
const typedEl = $("#typed");
const articleEl = $("#article");                            // The "a" / "an" word just before the typed role
// English grammar: use "an" before a vowel sound (an Event Organiser), "a" otherwise (a Backend Developer).
// /^[aeiou]/i is a "regular expression" (a text pattern): ^ = at the start, [aeiou] = any vowel, i = ignore capitals
const articleFor = (word) => (/^[aeiou]/i.test(word) ? "an" : "a");
if (reduceMotion) {
  typedEl.textContent = p.roles[0];                         // No animation wanted: just show the first role
  articleEl.textContent = articleFor(p.roles[0]);           // ...with the right "a"/"an" in front
} else {
  let roleIndex = 0, charIndex = 0, deleting = false;       // Which word, which letter, and are we erasing?
  const tick = () => {
    const word = p.roles[roleIndex];                        // The word currently being typed
    charIndex += deleting ? -1 : 1;                         // Add or remove one letter
    typedEl.textContent = word.slice(0, charIndex);         // Show the first charIndex letters
    articleEl.textContent = articleFor(word);               // Switch "a"/"an" to match the word being typed
    let delay = deleting ? 45 : 95;                         // Erasing is faster than typing (milliseconds)
    if (!deleting && charIndex === word.length) { deleting = true; delay = 1800; } // Full word: pause, then erase
    else if (deleting && charIndex === 0) {                 // Fully erased:
      deleting = false;                                     //   switch back to typing
      roleIndex = (roleIndex + 1) % p.roles.length;         //   next word (% wraps back to the first at the end)
      delay = 350;
    }
    setTimeout(tick, delay);                                // Call tick again after "delay" ms -> creates the loop
  };
  tick();                                                   // Start it
}

/* ---------------- 6. Scroll effects ---------------- */
const nav = $("#nav");
const bar = $("#scrollProgress");
const onScroll = () => {
  const y = window.scrollY;                                 // How far down the page we are (pixels)
  nav.classList.toggle("scrolled", y > 20);                 // Frosted nav background once we leave the top
  const max = document.documentElement.scrollHeight - innerHeight; // Total scrollable distance
  bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`; // 0 = empty bar, 1 = full bar
};
addEventListener("scroll", onScroll, { passive: true });    // passive = tells the browser we won't block scrolling (smoother)
onScroll();                                                 // Run once now in case the page loads mid-way down

// Counter animation: counts a stat from 0 up to its target number
const countUp = (el) => {
  const target = +el.dataset.target;                        // The "+" converts the text "90" into the number 90
  const suffix = el.dataset.suffix;
  if (reduceMotion) { el.textContent = target + suffix; return; }
  const start = performance.now();                          // Time the animation started
  const step = (now) => {
    const t = Math.min((now - start) / 1400, 1);            // Progress from 0 to 1 over 1.4 seconds
    const eased = 1 - Math.pow(1 - t, 3);                   // "Ease-out": fast at first, slows down at the end
    el.textContent = Math.round(target * eased) + suffix;
    if (t < 1) requestAnimationFrame(step);                 // Keep going until finished (runs once per screen refresh)
  };
  requestAnimationFrame(step);
};

// IntersectionObserver = a browser feature that tells us when an element scrolls into view
// (much cheaper than checking positions on every scroll event)
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;                      // Not on screen yet -> do nothing
    entry.target.classList.add("visible");                  // Triggers the CSS fade-up
    entry.target.querySelectorAll("[data-target]").forEach(countUp); // Start any counters inside it
    revealObserver.unobserve(entry.target);                 // Only animate once
  });
}, { threshold: 0.15 });                                    // Fire when 15% of the element is visible

// Give items in a grid a small staggered delay so they appear one after another
document.querySelectorAll(".reveal").forEach((el) => {
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 80}ms`; // 0ms, 80ms, 160ms... capped
  revealObserver.observe(el);                               // Start watching it
});

// Highlight the menu link of the section currently on screen
const navAnchors = [...document.querySelectorAll(".nav-links a")];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-45% 0px -50% 0px" });                    // Counts as "current" when the section crosses the middle of the screen
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

/* ---------------- 7. In-person filter buttons ---------------- */
$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");                  // Which button was clicked (ignore clicks on the gaps)
  if (!btn) return;
  document.querySelectorAll(".filter").forEach((b) => b.classList.toggle("active", b === btn)); // Highlight only that button
  const type = btn.dataset.filter;                          // "all", "Workshop", "Events" or "Community"
  document.querySelectorAll(".impact-card").forEach((card) => {
    const show = type === "all" || card.dataset.type === type;
    card.classList.toggle("hidden", !show);                 // Hide cards that don't match
    if (show) { card.style.animation = "none"; card.offsetHeight; card.style.animation = ""; } // Restart the "pop" animation (reading offsetHeight forces the browser to reset it)
  });
});

/* ---------------- 8. Copy email to clipboard ---------------- */
$("#copyEmail").addEventListener("click", async () => {     // async = this function can "await" slow tasks
  const hint = $("#copyHint");
  try {
    await navigator.clipboard.writeText(p.email);           // Put the email on the clipboard
    hint.textContent = "copied!";
  } catch (e) {
    hint.textContent = "press Ctrl+C";                      // Clipboard blocked (e.g. opened as a local file) -> fallback hint
  }
  setTimeout(() => (hint.textContent = "click to copy"), 2000); // Reset the hint after 2 seconds
});
