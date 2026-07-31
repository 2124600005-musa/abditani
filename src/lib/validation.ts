export function isValidId(id: string): boolean {
  return /^\d+$/.test(id);
}
