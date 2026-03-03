/**
 * Normalizes search query to prevent duplicate API calls
 * - Converts to lowercase
 * - Trims whitespace
 * - Removes extra spaces
 */
export const normalizeQuery = (query: string): string => {
  return query
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
};
