import type { College } from "@/types";

export const COLLEGES: College[] = [
  { id: "hindu-college", name: "Hindu College", areaId: "kamla-nagar", normalizedX: 50, normalizedY: 42 },
  { id: "miranda-house", name: "Miranda House", areaId: "kamla-nagar", normalizedX: 48, normalizedY: 38 },
  { id: "hansraj-college", name: "Hansraj College", areaId: "hudson-lane", normalizedX: 55, normalizedY: 34 },
  { id: "kirori-mal-college", name: "Kirori Mal College", areaId: "hudson-lane", normalizedX: 57, normalizedY: 37 },
  { id: "ramjas-college", name: "Ramjas College", areaId: "kamla-nagar", normalizedX: 53, normalizedY: 44 },
];

export function getCollegeById(id: string): College | undefined {
  return COLLEGES.find((college) => college.id === id);
}
