export const AMENITY_OPTIONS = [
  "WiFi",
  "Pool",
  "Restaurant",
  "Gym",
  "Parking",
  "Pet Friendly",
] as const;

export type AmenityOption = typeof AMENITY_OPTIONS[number];
