/**
 * Returns a stable random index based on the current hour.
 * The selection changes once per hour, not on every re-render.
 */
export function getStableRandomIndex(arrayLength: number): number {
  const hourSeed = Math.floor(Date.now() / 3600000); // Changes every hour
  return hourSeed % arrayLength;
}
