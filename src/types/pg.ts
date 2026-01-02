export type Gender = "boys" | "girls" | "coliving";
export type FoodType = "veg" | "nonveg" | "both";
export type Amenity = "wifi" | "ac" | "laundry" | "parking" | "power_backup" | "gym" | "pool";

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
}

export interface SearchFilters {
  location: string;
  gender: Gender | "all";
  food: FoodType | "all";
  minRent: number;
  maxRent: number;
  amenities: Amenity[];
}
