# Ephemeral Notes

Simple icon-only notes app. Notes auto-delete 48 hours after creation.

## Run locally

1. In this folder, run:
   ```bash
   python3 -m http.server 8080
   ```
2. Open `http://localhost:8080` in your browser.

## Use

- Type a note.
- Click the `+` icon to save.
- Press `Cmd/Ctrl + Enter` to save quickly.
- Click the trash icon to delete any note.

All notes are stored in browser local storage and are cleaned up automatically every minute.
