import { STORAGE_KEY } from "../shared/constants.js";
import { normalizeState } from "../domain/notes-state.js";

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { active: [], recentlyDeleted: [] };
    return normalizeState(JSON.parse(raw));
  } catch {
    return { active: [], recentlyDeleted: [] };
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
