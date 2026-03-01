const STORAGE_KEY = "ephemeral-notes-v1";
const TTL_MS = 48 * 60 * 60 * 1000;

const noteInput = document.getElementById("noteInput");
const saveBtn = document.getElementById("saveBtn");
const notesContainer = document.getElementById("notes");
const recentlyDeletedContainer = document.getElementById("recentlyDeleted");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const noteTemplate = document.getElementById("noteTemplate");
const recentlyDeletedTemplate = document.getElementById("recentlyDeletedTemplate");

function now() {
  return Date.now();
}

function makeId() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `${now()}-${Math.random().toString(16).slice(2)}`;
}

function isValidActiveNote(note) {
  return typeof note?.id === "string" && typeof note?.text === "string" && typeof note?.createdAt === "number";
}

function isValidDeletedNote(note) {
  return isValidActiveNote(note) && typeof note?.deletedAt === "number";
}

function noteToDeleted(note, reason = "manual") {
  return {
    id: note.id,
    text: note.text,
    createdAt: note.createdAt,
    deletedAt: now(),
    deleteReason: reason,
  };
}

function normalizeState(raw) {
  if (Array.isArray(raw)) {
    return {
      active: raw.filter(isValidActiveNote),
      recentlyDeleted: [],
    };
  }

  if (!raw || typeof raw !== "object") {
    return { active: [], recentlyDeleted: [] };
  }

  const active = Array.isArray(raw.active) ? raw.active.filter(isValidActiveNote) : [];
  const recentlyDeleted = Array.isArray(raw.recentlyDeleted) ? raw.recentlyDeleted.filter(isValidDeletedNote) : [];

  return { active, recentlyDeleted };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { active: [], recentlyDeleted: [] };
    return normalizeState(JSON.parse(raw));
  } catch {
    return { active: [], recentlyDeleted: [] };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function moveExpiredNotesToRecentlyDeleted(state) {
  const cutoff = now() - TTL_MS;
  const nextActive = [];
  const expired = [];

  for (const note of state.active) {
    if (note.createdAt > cutoff) {
      nextActive.push(note);
    } else {
      expired.push(noteToDeleted(note, "expired"));
    }
  }

  return {
    active: nextActive,
    recentlyDeleted: expired.concat(state.recentlyDeleted),
  };
}

function getCleanState() {
  const state = moveExpiredNotesToRecentlyDeleted(loadState());
  saveState(state);
  return state;
}

function renderActiveNotes(state) {
  notesContainer.innerHTML = "";

  for (const note of state.active) {
    const fragment = noteTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".note");
    const text = fragment.querySelector(".note-text");
    const deleteBtn = fragment.querySelector(".delete-btn");

    text.textContent = note.text;
    deleteBtn.addEventListener("click", () => {
      const current = getCleanState();
      const target = current.active.find((n) => n.id === note.id);
      if (!target) return;

      const next = {
        active: current.active.filter((n) => n.id !== note.id),
        recentlyDeleted: [noteToDeleted(target, "manual"), ...current.recentlyDeleted],
      };

      saveState(next);
      render();
    });

    card.dataset.id = note.id;
    notesContainer.appendChild(fragment);
  }
}

function renderRecentlyDeleted(state) {
  recentlyDeletedContainer.innerHTML = "";

  for (const note of state.recentlyDeleted) {
    const fragment = recentlyDeletedTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".note");
    const text = fragment.querySelector(".note-text");
    const deleteBtn = fragment.querySelector(".permanent-delete-btn");

    text.textContent = note.text;
    deleteBtn.addEventListener("click", () => {
      const current = getCleanState();
      const next = {
        active: current.active,
        recentlyDeleted: current.recentlyDeleted.filter((n) => n.id !== note.id),
      };

      saveState(next);
      render();
    });

    card.dataset.id = note.id;
    recentlyDeletedContainer.appendChild(fragment);
  }

  deleteAllBtn.disabled = state.recentlyDeleted.length === 0;
}

function render() {
  const state = getCleanState();
  renderActiveNotes(state);
  renderRecentlyDeleted(state);
}

function addNote() {
  const text = noteInput.value.trim();
  if (!text) return;

  const state = getCleanState();
  const next = {
    active: [
      {
        id: makeId(),
        text,
        createdAt: now(),
      },
      ...state.active,
    ],
    recentlyDeleted: state.recentlyDeleted,
  };

  saveState(next);
  noteInput.value = "";
  render();
}

saveBtn.addEventListener("click", addNote);
noteInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    addNote();
  }
});

deleteAllBtn.addEventListener("click", () => {
  const state = getCleanState();
  if (state.recentlyDeleted.length === 0) return;

  saveState({
    active: state.active,
    recentlyDeleted: [],
  });

  render();
});

setInterval(render, 60 * 1000);
render();
