export function renderRecentlyDeleted({
  container,
  template,
  deleteAllBtn,
  state,
  onPermanentDelete,
}) {
  container.innerHTML = "";

  for (const note of state.recentlyDeleted) {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".note");
    const text = fragment.querySelector(".note-text");
    const deleteBtn = fragment.querySelector(".permanent-delete-btn");

    text.textContent = note.text;
    deleteBtn.addEventListener("click", () => onPermanentDelete(note.id));

    card.dataset.id = note.id;
    container.appendChild(fragment);
  }

  deleteAllBtn.disabled = state.recentlyDeleted.length === 0;
}
