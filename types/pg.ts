import type { FoodPolicy, GenderPolicy, RoomType } from "./enums";

/** A PG (paying-guest accommodation). No separate Owner/Room/Amenity tables - 
 * everything a PG card needs to render lives directly on this record. */
export interface PG {
  id: string;
  name: string;
  areaId: string;
  pricePerMonth: number;
  roomTypes: RoomType[];
  foodPolicy: FoodPolicy | null;
  verifiedStatus: boolean;
  lastVerifiedDate: string | null;
  photoUrl: string | null;
  photoTakenDate: string | null;
  distanceToCollegeMin: number | null;
  amenities: string[];
  genderPolicy: GenderPolicy;
  rating: number | null;
}
