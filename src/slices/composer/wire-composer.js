export function wireComposer({ noteInput, saveBtn, onSubmit }) {
  saveBtn.addEventListener("click", onSubmit);
  noteInput.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      onSubmit();
    }
  });
}
