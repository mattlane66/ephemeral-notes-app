import { makeId, now } from "./shared/time.js";
import { noteToDeleted } from "./domain/notes-state.js";
import { moveExpiredNotesToRecentlyDeleted } from "./domain/lifecycle.js";
import { loadState, saveState } from "./storage/notes-storage.js";
import { wireComposer } from "./slices/composer/wire-composer.js";
import { renderActiveNotes } from "./slices/active-notes/render-active-notes.js";
import { renderRecentlyDeleted } from "./slices/recently-deleted/render-recently-deleted.js";

const noteInput = document.getElementById("noteInput");
const saveBtn = document.getElementById("saveBtn");
const notesContainer = document.getElementById("notes");
const recentlyDeletedContainer = document.getElementById("recentlyDeleted");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const noteTemplate = document.getElementById("noteTemplate");
const recentlyDeletedTemplate = document.getElementById("recentlyDeletedTemplate");

function getCleanState() {
  const state = moveExpiredNotesToRecentlyDeleted(loadState());
  saveState(state);
  return state;
}

function deleteActiveNote(noteId) {
  const current = getCleanState();
  const target = current.active.find((note) => note.id === noteId);
  if (!target) return;

  const next = {
    active: current.active.filter((note) => note.id !== noteId),
    recentlyDeleted: [noteToDeleted(target, "manual"), ...current.recentlyDeleted],
  };

  saveState(next);
  render();
}

function permanentlyDeleteNote(noteId) {
  const current = getCleanState();
  saveState({
    active: current.active,
    recentlyDeleted: current.recentlyDeleted.filter((note) => note.id !== noteId),
  });
  render();
}

function addNote() {
  const text = noteInput.value.trim();
  if (!text) return;

  const state = getCleanState();
  saveState({
    active: [{ id: makeId(), text, createdAt: now() }, ...state.active],
    recentlyDeleted: state.recentlyDeleted,
  });

  noteInput.value = "";
  render();
}

function clearRecentlyDeleted() {
  const state = getCleanState();
  if (state.recentlyDeleted.length === 0) return;

  saveState({
    active: state.active,
    recentlyDeleted: [],
  });

  render();
}

function render() {
  const state = getCleanState();

  renderActiveNotes({
    container: notesContainer,
    template: noteTemplate,
    state,
    onDelete: deleteActiveNote,
  });

  renderRecentlyDeleted({
    container: recentlyDeletedContainer,
    template: recentlyDeletedTemplate,
    deleteAllBtn,
    state,
    onPermanentDelete: permanentlyDeleteNote,
  });
}

wireComposer({
  noteInput,
  saveBtn,
  onSubmit: addNote,
});

deleteAllBtn.addEventListener("click", clearRecentlyDeleted);

setInterval(render, 60 * 1000);
render();
