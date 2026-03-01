export function renderActiveNotes({ container, template, state, onDelete }) {
  container.innerHTML = "";

  for (const note of state.active) {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".note");
    const text = fragment.querySelector(".note-text");
    const deleteBtn = fragment.querySelector(".delete-btn");

    text.textContent = note.text;
    deleteBtn.addEventListener("click", () => onDelete(note.id));

    card.dataset.id = note.id;
    container.appendChild(fragment);
  }
}
