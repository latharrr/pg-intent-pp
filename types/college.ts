export interface College {
  id: string;
  name: string;
  areaId: string | null;
  /** 0-100 position on the illustrated SVG campus map. */
  normalizedX: number;
  normalizedY: number;
}
