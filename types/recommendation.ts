/** Computed output of the matching engine - never seeded, never persisted. */
export interface PgMatch {
  pgId: string;
  pgMatchPercent: number;
  pgMatchReasons: string[];
}

export interface Recommendation {
  areaId: string;
  areaMatchPercent: number;
  areaMatchReasons: string[];
  pgMatches: PgMatch[];
}
