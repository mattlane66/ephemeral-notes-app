# Vertical Slices and Threading

Use one coding thread per slice while keeping shared concerns in dedicated modules.

## Slice map

| Slice | Scope | Primary files |
|---|---|---|
| Composer | Create note interactions and keyboard shortcut | `src/slices/composer/wire-composer.js`, `src/main.js` |
| Active Notes | Display active notes and move to recently deleted | `src/slices/active-notes/render-active-notes.js`, `src/main.js` |
| Recently Deleted | Display deleted notes, permanent delete, delete-all affordance | `src/slices/recently-deleted/render-recently-deleted.js`, `src/main.js` |
| Domain lifecycle | TTL expiration and state normalization rules | `src/domain/lifecycle.js`, `src/domain/notes-state.js` |
| Storage | localStorage read/write and schema normalization entry | `src/storage/notes-storage.js` |

## Thread plan

1. Thread: `slice/composer`
- Touch only composer UI behavior unless shared contract changes.
- Files: `src/slices/composer/*`, `src/main.js`.

2. Thread: `slice/active-notes`
- Touch active-note card behavior and associated render details.
- Files: `src/slices/active-notes/*`, `src/main.js`.

3. Thread: `slice/recently-deleted`
- Touch recently-deleted list behavior, permanent delete, and delete-all UX.
- Files: `src/slices/recently-deleted/*`, `src/main.js`.

4. Thread: `shared/domain-storage`
- Touch TTL policy, note validity rules, and persistence schema.
- Files: `src/domain/*`, `src/storage/*`, sometimes `src/main.js`.

## Safe change protocol

1. Keep slice contracts stable: render modules should receive state + callbacks.
2. Route cross-slice behavior changes through `src/main.js` first.
3. Change schema only in `src/domain/notes-state.js` and `src/storage/notes-storage.js`.
4. If TTL or lifecycle changes, update only `src/domain/lifecycle.js` and validate slice behavior by rendering from `src/main.js`.
