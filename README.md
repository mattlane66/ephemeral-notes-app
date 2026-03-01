# Ephemeral Notes

Simple icon-only notes app with a Recently Deleted area.

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
- Active notes stay in the Active Notes section for 48 hours after creation.
- Clicking the active-note trash icon moves the note to Recently Deleted.
- Notes that hit the 48-hour TTL are also moved to Recently Deleted.
- In Recently Deleted, click a note's trash icon to permanently delete that note.
- Use `Delete All` to permanently clear all recently deleted notes.

The active list excludes notes in Recently Deleted. All notes are stored in browser local storage and lifecycle cleanup runs every minute.
