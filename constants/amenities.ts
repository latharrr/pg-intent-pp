/**
 * Amenities are plain string tags on PG.amenities - no separate Amenity
 * table. This is just a display lookup (label + icon name) used by
 * RequirementsScreen and PGCard.
 */
export interface AmenityMeta {
  id: string;
  label: string;
  icon:
    | "Wifi"
    | "ShowerHead"
    | "Bath"
    | "BookOpen"
    | "Shirt"
    | "Flame"
    | "WashingMachine"
    | "Sparkles"
    | "Snowflake";
}

export const AMENITIES: AmenityMeta[] = [
  { id: "attached_bathroom", label: "Attached Bathroom", icon: "ShowerHead" },
  { id: "common_bathroom_ok", label: "Common Bathroom OK", icon: "Bath" },
  { id: "study_table", label: "Study Table", icon: "BookOpen" },
  { id: "wardrobe", label: "Wardrobe", icon: "Shirt" },
  { id: "geyser", label: "Geyser", icon: "Flame" },
  { id: "wifi", label: "Wi-Fi", icon: "Wifi" },
  { id: "laundry", label: "Laundry", icon: "WashingMachine" },
  { id: "housekeeping", label: "Housekeeping", icon: "Sparkles" },
  { id: "ac", label: "Air Conditioning", icon: "Snowflake" },
];

export function getAmenityMeta(id: string): AmenityMeta | undefined {
  return AMENITIES.find((amenity) => amenity.id === id);
}
