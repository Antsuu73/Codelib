let notes = [];
let currentLang = "All";

const container = document.getElementById("notesContainer");
const searchInput = document.getElementById("search");

fetch("/json/notes.json")
  .then(res => res.json())
  .then(data => {
    notes = data;
    renderNotes();
  });

function renderNotes() {
  const searchText = searchInput.value.toLowerCase();

  container.innerHTML = "";

  notes
    .filter(n => currentLang === "All" || n.lang === currentLang)
    .filter(n => n.title.toLowerCase().includes(searchText))
    .forEach(n => {
      container.innerHTML += `
        <div class="note-card">
          <span class="lang">${n.lang}</span>
          <h3>${n.title}</h3>
          <p>${n.content}</p>
        </div>
      `;
    });
}

function filterLang(lang) {
  currentLang = lang;
  renderNotes();
}

searchInput.addEventListener("input", renderNotes);