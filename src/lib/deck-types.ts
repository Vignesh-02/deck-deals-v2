export const DECK_TYPES = [
  "Bicycle",
  "fontaine",
  "Theory11",
  "Ellusionist",
  "NOCs",
  "Dan&Dave",
  "Bocopo",
  "Cartamundi",
  "Mint Playing Cards",
  "Others"
] as const;

export type DeckType = (typeof DECK_TYPES)[number];
