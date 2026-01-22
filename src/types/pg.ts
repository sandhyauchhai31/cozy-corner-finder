export type Gender = "boys" | "girls" | "coliving";
export type FoodType = "veg" | "nonveg" | "both";
export type Amenity = "wifi" | "ac" | "laundry" | "parking" | "power_backup" | "gym" | "pool";

export type BathroomType = "private" | "shared";

export interface PG {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  rent: number;
  deposit: number;
  gender: Gender;
  food: FoodType;
  images: string[];
  amenities: string[];
  verified: boolean;
  distance: number;
  ownerPhone: string;
  ownerWhatsApp: string;
  rules: string[];
  description: string;
  roomSharing: number; // e.g., 2, 3, 4 people per room
  bathroomType: BathroomType;
}

export interface SearchFilters {
  location: string;
  gender: Gender | "all";
  food: FoodType | "all";
  minRent: number;
  maxRent: number;
  amenities: Amenity[];
}
