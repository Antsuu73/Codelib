const sidebar = document.querySelector(".cl-problem-sidebar ul");

const title = document.querySelector(".cl-problem-top h1");

const difficulty = document.querySelector(".easy");

const contentBody = document.querySelector(".cl-problem-body");

const codeSelect = document.querySelector(".cl-code-top select");

const codeEditor = document.querySelector(".cl-code-panel textarea");

const submitButton = document.querySelector(".cl-code-top button");

const topicButtons = document.querySelectorAll(".cl-topic-btn");

const searchInput = document.querySelector(".cl-search input");

let homeworkData = [];

let currentTopic = "Tổng Hợp";

/* =========================
   LOAD JSON
========================= */

fetch("../json/homework.json")
.then(response => response.json())

.then(data => {

  homeworkData = data;

  loadSidebar(homeworkData);

  if (homeworkData.length > 0) {

    loadHomework(homeworkData[0]);

  }

})

.catch(error => {

  console.error(error);

});

/* =========================
   LOAD SIDEBAR
========================= */

function loadSidebar(data) {

  sidebar.innerHTML = "";

  data.forEach((homework, index) => {

    const li = document.createElement("li");

    li.textContent = homework.title;

    if (index === 0) {

      li.classList.add("active");

    }

    li.addEventListener("click", function() {

      document
        .querySelectorAll(".cl-problem-sidebar li")
        .forEach(item => {

          item.classList.remove("active");

        });

      li.classList.add("active");

      loadHomework(homework);

    });

    sidebar.appendChild(li);

  });

}

/* =========================
   LOAD HOMEWORK
========================= */

function loadHomework(homework) {

  title.textContent =
    homework.title || "Homework";

  difficulty.textContent =
    homework.difficulty || "Easy";

  let html = "";

  /* =========================
     IMAGE
  ========================= */

  if (homework.image) {

    html += `
      <div class="cl-problem-image">

        <img
          src="${homework.image}"
          alt="${homework.title}"
        >

      </div>
    `;

  }

  /* =========================
     MULTIPLE IMAGES
  ========================= */

  if (homework.images) {

    homework.images.forEach(image => {

      html += `
        <div class="cl-problem-image">

          <img
            src="${image}"
            alt="Homework Image"
          >

        </div>
      `;

    });

  }

  /* =========================
     NO SECTION
  ========================= */

  if (!homework.sections) {

    contentBody.innerHTML = `
      <p>
        No homework found.
      </p>
    `;

    return;

  }

  /* =========================
     SECTION
  ========================= */

  homework.sections.forEach(section => {

    html += `
      <div class="cl-homework-section">
    `;

    /* SMALL TITLE */

    if (section.smallTitle) {

      html += `
        <span class="cl-small-title">
          ${section.smallTitle}
        </span>
      `;

    }

    /* CONTENT */

    if (section.content) {

      section.content.forEach(text => {

        html += `
          <p>${text}</p>
        `;

      });

    }

    /* HINT */

    if (section.hint) {

      html += `
        <div class="cl-hint-box">
      `;

      section.hint.forEach(text => {

        html += `
          <p>${text}</p>
        `;

      });

      html += `
        </div>
      `;

    }

    html += `
      </div>
    `;

  });

  contentBody.innerHTML = html;

  setEditorTemplate();

}

/* =========================
   TOPIC BUTTONS
========================= */

topicButtons.forEach(button => {

  button.addEventListener("click", function() {

    topicButtons.forEach(btn => {

      btn.classList.remove("active");

    });

    this.classList.add("active");

    currentTopic =
      this.textContent.trim();

    filterHomework();

  });

});

/* =========================
   SEARCH
========================= */

searchInput.addEventListener("input", function() {

  filterHomework();

});

/* =========================
   FILTER
========================= */

function filterHomework() {

  const keyword =
    searchInput.value
      .trim()
      .toLowerCase();

  const filteredData =
    homeworkData.filter(homework => {

      const matchTopic =
        currentTopic === "Tổng Hợp" ||
        homework.topic === currentTopic;

      const matchSearch =
        homework.title
          .toLowerCase()
          .includes(keyword);

      return matchTopic && matchSearch;

    });

  loadSidebar(filteredData);

  if (filteredData.length > 0) {

    loadHomework(filteredData[0]);

  }

  else {

    sidebar.innerHTML = "";

    contentBody.innerHTML = `
      <p>
        No homework found.
      </p>
    `;

  }

}

/* =========================
   EDITOR TEMPLATE
========================= */

function setEditorTemplate() {

  const language =
    codeSelect.value;

  if (language === "Python") {

    codeEditor.value =
`class Solution:
    pass`;

  }

  else if (language === "Pascal") {

    codeEditor.value =
`program Solution;

begin

end.`;

  }

  else {

    codeEditor.value =
`class Solution {
public:

};`;

  }

}

/* =========================
   CHANGE LANGUAGE
========================= */

codeSelect.addEventListener("change", function() {

  setEditorTemplate();

});

/* =========================
   SUBMIT
========================= */

submitButton.addEventListener("click", function() {

  const code =
    codeEditor.value;

  console.log(code);

  alert("Bài đã được nộp");

});

/* =========================
   DEFAULT
========================= */

setEditorTemplate();