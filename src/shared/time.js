export function now() {
  return Date.now();
}

export function makeId() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `${now()}-${Math.random().toString(16).slice(2)}`;
}
