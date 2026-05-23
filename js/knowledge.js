/* =========================
   SELECTORS
========================= */

const sidebar        = document.querySelector(".cl-sidebar ul");
const title          = document.querySelector(".cl-content-top h1");
const contentBody    = document.querySelector(".cl-content-body");
const languageButtons = document.querySelectorAll(".cl-language-btn");
const sidebarTitle   = document.querySelector(".cl-sidebar h3");
const prevBtn        = document.querySelectorAll(".cl-content-buttons button")[0];
const nextBtn        = document.querySelectorAll(".cl-content-buttons button")[1];

let currentLanguage  = "python";
let currentIndex     = 0;
let currentLessons   = [];

/* =========================
   LOAD JSON
========================= */

fetch("../json/data.json")
  .then(res => res.json())
  .then(data => {

    // Build a normalized key map: "algorithm " → actual key in JSON
    const keyMap = {};
    Object.keys(data).forEach(key => {
      keyMap[key.trim().toLowerCase()] = key;
    });

    function getLanguageData(lang) {
      const actualKey = keyMap[lang.trim().toLowerCase()];
      return actualKey ? data[actualKey] : null;
    }

    // Initial load
    currentLessons = getLanguageData(currentLanguage) || [];
    loadSidebar(currentLessons);
    loadLesson(0);

    // Language button clicks
    languageButtons.forEach(btn => {
      btn.addEventListener("click", function () {

        languageButtons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");

        const label = this.textContent.trim();
        currentLanguage = label.toLowerCase();

        sidebarTitle.textContent = label + " Topics";

        currentLessons = getLanguageData(currentLanguage) || [];
        currentIndex = 0;

        loadSidebar(currentLessons);
        loadLesson(0);
      });
    });

    // Prev / Next buttons
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) loadLesson(currentIndex - 1);
    });

    nextBtn.addEventListener("click", () => {
      if (currentIndex < currentLessons.length - 1) loadLesson(currentIndex + 1);
    });

  })
  .catch(err => {
    console.error("JSON ERROR:", err);
    contentBody.innerHTML = "<p>Failed to load data.json</p>";
  });

/* =========================
   LOAD SIDEBAR
========================= */

function loadSidebar(lessons) {
  sidebar.innerHTML = "";

  if (!lessons.length) {
    sidebar.innerHTML = "<li>No topics found.</li>";
    return;
  }

  lessons.forEach((lesson, index) => {
    const li = document.createElement("li");
    li.textContent = lesson.title;
    if (index === 0) li.classList.add("active");

    li.addEventListener("click", () => loadLesson(index));
    sidebar.appendChild(li);
  });
}

/* =========================
   LOAD LESSON
========================= */

function loadLesson(index) {
  const lesson = currentLessons[index];
  if (!lesson) return;

  currentIndex = index;

  // Update active sidebar item
  document.querySelectorAll(".cl-sidebar li").forEach((li, i) => {
    li.classList.toggle("active", i === index);
  });

  // Update prev/next button state
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === currentLessons.length - 1;

  title.textContent = lesson.title;

  if (!lesson.sections || !lesson.sections.length) {
    contentBody.innerHTML = "<p>No lesson content found.</p>";
    return;
  }

  let html = "";

  lesson.sections.forEach(section => {
    html += `<div class="cl-lesson-section">`;

    if (section.smallTitle) {
      html += `<span class="cl-small-title">${section.smallTitle}</span>`;
    }

    if (section.content) {
      section.content.forEach(text => {
        html += `<p>${text}</p>`;
      });
    }

    if (section.codeTitle && section.example) {
      html += `
        <div class="cl-note-box">
          <h4>${section.codeTitle}</h4>
          <pre><code>${escapeHTML(section.example)}</code></pre>
        </div>`;
    }

    html += `</div>`;
  });

  contentBody.innerHTML = html;
  contentBody.scrollTop = 0;
}

/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}