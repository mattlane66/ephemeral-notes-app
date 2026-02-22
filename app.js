const STORAGE_KEY = "ephemeral-notes-v1";
const TTL_MS = 48 * 60 * 60 * 1000;

const noteInput = document.getElementById("noteInput");
const saveBtn = document.getElementById("saveBtn");
const notesContainer = document.getElementById("notes");
const noteTemplate = document.getElementById("noteTemplate");

function now() {
  return Date.now();
}

function makeId() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `${now()}-${Math.random().toString(16).slice(2)}`;
}

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n) => typeof n?.id === "string" && typeof n?.text === "string" && typeof n?.createdAt === "number");
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function cleanupExpired(notes) {
  const cutoff = now() - TTL_MS;
  return notes.filter((note) => note.createdAt > cutoff);
}

function getCleanNotes() {
  const notes = cleanupExpired(loadNotes());
  saveNotes(notes);
  return notes;
}

function render() {
  const notes = getCleanNotes();
  notesContainer.innerHTML = "";

  for (const note of notes) {
    const fragment = noteTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".note");
    const text = fragment.querySelector(".note-text");
    const deleteBtn = fragment.querySelector(".delete-btn");

    text.textContent = note.text;
    deleteBtn.addEventListener("click", () => {
      const next = getCleanNotes().filter((n) => n.id !== note.id);
      saveNotes(next);
      render();
    });

    card.dataset.id = note.id;
    notesContainer.appendChild(fragment);
  }
}

function addNote() {
  const text = noteInput.value.trim();
  if (!text) return;

  const notes = getCleanNotes();
  notes.unshift({
    id: makeId(),
    text,
    createdAt: now(),
  });

  saveNotes(notes);
  noteInput.value = "";
  render();
}

saveBtn.addEventListener("click", addNote);
noteInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    addNote();
  }
});

setInterval(render, 60 * 1000);
render();
