export interface Area {
  id: string;
  name: string;
  /** e.g. "buzzing", "social", "exam-focused", "dense, budget-friendly" */
  vibeTag: string;
  avgRentPerMonth: number;
  walkTimeToCampusMin: number;
  nearestCollegeId: string | null;
  nearestMetroName: string | null;
  normalizedX: number;
  normalizedY: number;
  description: string;
  safetyTag: string | null;
}
