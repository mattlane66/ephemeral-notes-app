import { now } from "../shared/time.js";

export function isValidActiveNote(note) {
  return (
    typeof note?.id === "string" &&
    typeof note?.text === "string" &&
    typeof note?.createdAt === "number"
  );
}

export function isValidDeletedNote(note) {
  return isValidActiveNote(note) && typeof note?.deletedAt === "number";
}

export function noteToDeleted(note, reason = "manual") {
  return {
    id: note.id,
    text: note.text,
    createdAt: note.createdAt,
    deletedAt: now(),
    deleteReason: reason,
  };
}

export function normalizeState(raw) {
  if (Array.isArray(raw)) {
    return {
      active: raw.filter(isValidActiveNote),
      recentlyDeleted: [],
    };
  }

  if (!raw || typeof raw !== "object") {
    return { active: [], recentlyDeleted: [] };
  }

  const active = Array.isArray(raw.active)
    ? raw.active.filter(isValidActiveNote)
    : [];
  const recentlyDeleted = Array.isArray(raw.recentlyDeleted)
    ? raw.recentlyDeleted.filter(isValidDeletedNote)
    : [];

  return { active, recentlyDeleted };
}
