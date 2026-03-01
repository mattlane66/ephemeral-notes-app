import { TTL_MS } from "../shared/constants.js";
import { now } from "../shared/time.js";
import { noteToDeleted } from "./notes-state.js";

export function moveExpiredNotesToRecentlyDeleted(state) {
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
