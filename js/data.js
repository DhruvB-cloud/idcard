/* ==========================================================================
   data.js - ALL the text content of the website lives in this one file.
   To update the site you (almost) never need to touch the HTML or CSS:
   just edit the values below, save, and refresh the browser.

   Anything marked  "PLACEHOLDER"  is sample text - replace it with your real details.
   ========================================================================== */

// "const" creates a variable that will not be re-assigned. SITE holds every piece of content.
const SITE = {

  // ---------- Basic profile info (used in the hero banner, contact section and footer) ----------
  profile: {
    name: "Dhruv Bisht",                                   // Your full name, shown in big letters at the top
    initials: "DB",                                        // Shown inside the photo circle if photo.jpg is missing
    photo: "assets/photo.jpg",                             // Your photo: square, cropped tight to the face/shoulders (original kept in F:\Projects\Resume-Files)
    location: "Hyderabad, India",                          // Shown under your name
    email: "dhruvbisht101@gmail.com",                      // Used by the "Email me" button (opens the visitor's mail app)
    linkedin: "https://www.linkedin.com/in/dhruvbisht",    // Your LinkedIn profile link
    github: "https://github.com/DhruvB-cloud",             // Your GitHub profile link
    apphub: "https://app-hub.dhruvdoit.workers.dev",       // Your AppHub site, where friends download your apps
    resumePdf: "assets/Dhruv_Resume.pdf",                  // The PDF that the "Resume" button gives out (button hides itself if the file is missing)
    // ONE target role, used everywhere. Recruiters must know in 5 seconds what job to put you up for.
    role: "Full Stack Developer",
    status: "Open to Full Stack Developer roles",          // Text in the green pill at the top
    openToWork: true,                                      // true = shows the green pill; false hides it
    // Words that the hero banner "types" one after another - all say the same thing from different angles
    roles: ["Full Stack Developer", "Python & Java Developer", "Product-minded Engineer"],
    // The pitch under your name: what you were, what you are now, and the proof (4 apps)
    tagline: "3+ years as a Product Manager at a startup taught me what to build. Now I build it myself: " +
             "I've built and shipped four apps end to end, three of them full stack with APIs and databases in the cloud."
  },

  // ---------- "About me" paragraphs + the number counters beside them ----------
  about: [
    "I'm a Computer Science graduate (VIT Vellore, 2023) who started on the product side of tech. As an " +
    "<strong>Associate Product Manager at Mooments</strong>, I wrote API specifications, mapped system workflows and " +
    "worked daily with engineers to take features from idea to production.",
    "Working that close to engineering made me want to build, not just plan. Since then I've designed, coded and " +
    "shipped <strong>four apps of my own</strong> in Python, Java and JavaScript, each with its own database, three of " +
    "them with cloud backends. My product background is my edge: I think about the user, the requirement and the " +
    "edge cases before I write the first line of code."
  ],
  // Each counter animates from 0 up to "value" when it scrolls into view. Only numbers you can back up!
  stats: [
    { value: 3,  suffix: "+", label: "Years in product at a tech startup" },   // "+" is added after the number
    { value: 4,  suffix: "",  label: "Apps designed, built and shipped end to end" },
    { value: 43, suffix: "",  label: "Automated tests in FridgeChef" }
  ],

  // ---------- Featured projects (the most important section for a career switcher) ----------
  // Each project: what it is, what YOU built (bullets), the tech, and links a recruiter can click.
  // The CARD shows the picture, tagline, "highlight" (one line with your strongest facts), tags and links.
  // The "built" bullets appear in a popup when the card is clicked.
  // "image" = a screenshot (best). If there's no screenshot, "icon" (an app icon file) or "emoji" is shown on a coloured banner.
  // "links" = buttons; leave the list empty [] if there's nothing public to link to.
  projects: [
    {
      name: "FridgeChef",
      tagline: "Tells you what you can cook from what's already in your fridge.",
      highlight: "Flask API on Google Cloud Run · 43 automated tests · auto-built APK",
      image: "assets/FridgeChef.jpg",
      built: [
        "Android app in <b>Python + Kivy</b>: fridge inventory with expiry dates, recipe matching for what you own, a cooking calendar and streaks.",
        "<b>Flask REST API</b>, packaged with <b>Docker</b> and deployed on <b>Google Cloud Run</b>; the app falls back to an offline copy when the server can't be reached.",
        "<b>GitHub Actions</b> pipeline that builds the Android APK and publishes releases automatically.",
        "<b>43 automated tests</b> covering the recipe engine, database upgrades, streaks and the API."
      ],
      tags: ["Python", "Kivy", "Flask", "Docker", "Cloud Run", "GitHub Actions"],
      links: [
        { label: "View code", url: "https://github.com/DhruvB-cloud/FridgeChef" },
        { label: "Download the app", url: "https://app-hub.dhruvdoit.workers.dev" }
      ]
    },
    {
      name: "QR Painter",
      tagline: "Turns any link into a QR code you can colour in, with a live view counter powered by my own Java API.",
      highlight: "Spring Boot API on Cloud Run · PostgreSQL · auto-deployed on every push",
      image: "assets/qr-painter.jpg",                       // Screenshot: dark mode with paint on the dark squares
      built: [
        "Web app in plain <b>JavaScript</b>: live QR generation, a paint layer clipped to the QR's dark squares with a hidden <b>canvas mask</b>, undo, and PNG/JPEG export.",
        "<b>Java Spring Boot REST API</b> (HitCounter) that counts page views: a single atomic <b>SQL</b> update, so simultaneous visits are never lost, plus a CORS allow-list and per-IP rate limiting.",
        "<b>PostgreSQL</b> in production (H2 locally), packaged with <b>Docker</b> and deployed to <b>Google Cloud Run</b>, rebuilt automatically by Cloud Build on every push.",
        "<b>8 JUnit tests</b>, including 50 simultaneous requests that prove no count is lost."
      ],
      tags: ["JavaScript", "Java", "Spring Boot", "PostgreSQL", "Docker", "Cloud Run"],
      links: [
        { label: "Open live site", url: "https://dhruvb-cloud.github.io/qr-painter/" },
        { label: "View code", url: "https://github.com/DhruvB-cloud/qr-painter" }  // The website's code; the Java API repo is private
      ]
    },
    {
      name: "AppHub",
      tagline: "My own mini app store: friends download my apps and send feedback with screenshots.",
      highlight: "Serverless backend · secure private-repo downloads · SQL database",
      image: "assets/apphub.png",
      built: [
        "Serverless backend on <b>Cloudflare Workers</b> that reads my GitHub repos through the <b>GitHub API</b>; tagging a repo is all it takes to publish an app.",
        "Secure downloads from <b>private repos</b>: the access token stays on the server and visitors get short-lived download links.",
        "<b>D1 (SQL) database</b> for feedback and <b>KV storage</b> for screenshot uploads, plus a password-protected admin page.",
      ],
      tags: ["JavaScript", "Cloudflare Workers", "D1 / SQL", "KV", "GitHub API"],
      links: [
        { label: "Open live site", url: "https://app-hub.dhruvdoit.workers.dev" }
      ]
    },
    {
      name: "BookBuds",
      tagline: "An audiobook player for Android, built natively in Java.",
      highlight: "Native Java · Room database with migrations · background playback",
      image: "assets/bookbuds.jpg",
     // emoji: "🎧",
      built: [
        "Native <b>Android app in Java</b> with a <b>Room (SQLite) database</b> and versioned schema migrations.",
        "Background playback service with notification, lock-screen and <b>Bluetooth earbud</b> controls; progress saved every 5 seconds.",
        "Bookmarks with notes, per-book speed, a home-screen widget, listening history with <b>CSV export</b> and search across free audiobook libraries."
      ],
      tags: ["Java", "Android", "Room / SQLite", "Media playback"],
      links: [],                                            // Private repo - add a link here if you make it public
      note: "Source code available on request"             // Small grey line shown when there are no links
    }
  ],
  // Older, smaller projects shown as a compact list under the featured ones.
  // "image" is optional: put a photo in the assets folder and write its path, e.g. "assets/gas-detector.jpg".
  // Leave it as "" and the card simply has no picture.
  earlierProjects: [
    {
      title: "Early Warning & Poison Gas Detection (IoT)",
      text: "Arduino and NodeMCU read gas and temperature sensors and trigger alarms and motors when levels turn dangerous.",
      tags: ["Arduino", "NodeMCU", "C++"],
      image: "assets/gas-detector.jpg",                                            // Optional photo, e.g. "assets/gas-detector.jpg"
      emoji: "🚨"                                           // Shown on a banner if this card has no photo but another card does
    },
    {
      title: "Malicious Website Detection",
      text: "A script that checks a URL and flags dangerous destinations before the user opens them, with a Node.js backend and web front end.",
      tags: ["Node.js", "HTML", "CSS"],
      image: "",                                            // Optional screenshot, e.g. "assets/malicious-site.png"
      emoji: "🛡️"                                           // Shown on a banner if this card has no photo but another card does
    }
  ],

  // ---------- Work experience timeline (newest first) ----------
  // Bullets say what YOU did, in words you can defend in an interview.
  experience: [
    {
      role: "Associate Product Manager",                   // Job title
      company: "Mooments",                                 // Company name
      place: "Hyderabad, India",                           // Where
      period: "Aug 2023 - Present",                        // When
      points: [                                            // Bullet points: what you did and the result
        "<b>Performance:</b> found the slowest step in the dashboard's data pipeline and drove a Redis caching rollout with the engineering team, from requirements to production release.",
        "<b>API specifications:</b> rewrote the platform's API documentation with a focus on security and reliable communication between services.",
        "<b>Client delivery:</b> coordinated brand clients and cross-functional engineering teams through a full website infrastructure revamp, from scoping to launch."
      ],
      tags: ["Redis", "REST APIs", "Requirements", "Agile"]  // Small chips under the bullets
    },
    {
      role: "Trainee Intern",
      company: "Mooments",
      place: "Hyderabad, India",
      period: "May 2023 - Aug 2023",
      points: [
        "<b>Test automation:</b> built automated API test workflows in Postman, replacing repetitive manual testing."
      ],
      tags: ["Postman", "API Testing"]
    }
  ],

  // ---------- Education (added to the end of the Experience timeline) ----------
  education: {
    degree: "B.Tech, Computer Science & Engineering (Specialisation in IoT)",
    school: "Vellore Institute of Technology, Vellore",
    period: "2019 - 2023"
  },

  // ---------- Skills: ONLY things a project on this page proves ----------
  // "icon" is a Devicon class name (free icon set) - browse names at https://devicon.dev
  // Leave icon as "" to show just the text.
  skills: [
    {
      group: "Languages",
      items: [
        { name: "Python",     icon: "devicon-python-plain" },
        { name: "Java",       icon: "devicon-java-plain" },
        { name: "JavaScript", icon: "devicon-javascript-plain" },
        { name: "SQL",        icon: "devicon-azuresqldatabase-plain" },
        { name: "HTML & CSS", icon: "devicon-html5-plain" }
      ]
    },
    {
      group: "Backend & Cloud",
      items: [
        { name: "Spring Boot",        icon: "devicon-spring-plain" },
        { name: "Flask",              icon: "devicon-flask-original" },
        { name: "REST APIs",          icon: "" },
        { name: "Docker",             icon: "devicon-docker-plain" },
        { name: "Google Cloud Run",   icon: "devicon-googlecloud-plain" },
        { name: "Cloudflare Workers", icon: "devicon-cloudflare-plain" },
        { name: "PostgreSQL",         icon: "devicon-postgresql-plain" },
        { name: "SQLite / D1",        icon: "devicon-sqlite-plain" }
      ]
    },
    {
      group: "Mobile & Tools",
      items: [
        { name: "Android",        icon: "devicon-android-plain" },
        { name: "Kivy",           icon: "" },
        { name: "Git & GitHub",   icon: "devicon-git-plain" },
        { name: "GitHub Actions", icon: "devicon-githubactions-plain" },
        { name: "Postman",        icon: "devicon-postman-plain" },
        { name: "Linux",          icon: "devicon-linux-plain" }
      ]
    },
    {
      group: "Practices",
      items: [
        { name: "Object-Oriented Programming",  icon: "" },
        { name: "Data Structures & Algorithms", icon: "" },
        { name: "Automated Testing",            icon: "" },
        { name: "API Design",                   icon: "" },
        { name: "Agile / Scrum",                icon: "" }
      ]
    }
  ],
  // Certifications: shown as a short strip under the skills
  certifications: [
    { title: "Java (Gold)", issuer: "HackerRank" },
    { title: "SQL (Gold)",  issuer: "HackerRank" }
  ],

  // ---------- Beyond code: workshops, events, community (the filter buttons use "type") ----------
  // "type" must be one of: "Workshop", "Events", "Community"  (it decides the filter + colour).
  // It must match a filter button's data-filter in index.html AND a .type-... colour rule in style.css, spelled exactly the same.
  // EVERY field is optional: leave it as "" or delete the line, and that part is simply not shown.
  // (A card with no "type" has no badge and only appears under the "All" filter.)
  inPerson: [
    {
      type: "Workshop",
      title: "Art Workshops",
      org: "Communintie",
      text: "Taught glass painting, clay modelling and other art techniques to beginners.",
      impact: "60+ attendees and more connections made",             // A short highlight shown in bold (leave "" to hide)
      image: "assets/glass-painting.jpg"                      // Stock photo from Unsplash (free licence)
    },
    {
      type: "Events",
      title: "Book Donation Drive",
      org: "",
      text: "Conducted a book donation drive for children and adults in Hyderabad.",
      impact: "250+ books donated",
      image: "assets/BookDonation.jpg"
    },
    {
      type: "Events",
      title: "Book Discussions",
      org: "Readers Of Hyderabad",
      text: "Host monthly book discussions for the Readers Of Hyderabad community.",
      impact: "Connected 100+ readers",
      image: "assets/BookDiscussion.jpg"
    },
    {
      type: "Community",
      title: "Media & Technical Lead",
      org: "Uddeshya NGO",
      text: "Conducted media campaigns for the chapter and helped run its technical events.",
      impact: "Organised 10+ events and workshops",
      image: "assets/ngo.png"
    },
    {
      type: "Community",
      title: "Core Committee Member",
      org: "VIT Linux User's Group",
      text: "Helped organise events that introduced students to Linux and open-source software.",
      impact: "Learned about Linux and open-source software while helping others",
      image: "assets/linux.png"
    }
  ],

  // ---------- Interests: a short row of chips under "Beyond code" ----------
  interests: [
    { emoji: "📚", title: "Reading & book clubs" },
    { emoji: "🎨", title: "Art & crafts" },
    { emoji: "📱", title: "Building apps for friends" },
    { emoji: "🔌", title: "IoT tinkering" }
  ]
};
