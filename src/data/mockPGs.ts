import { PG } from "@/types/pg";

export const mockPGs: PG[] = [
  {
    id: "1",
    name: "Sunshine Boys PG",
    address: "Koramangala, Bangalore",
    latitude: 12.9352,
    longitude: 77.6245,
    rating: 4.5,
    reviewCount: 128,
    rent: 8500,
    deposit: 17000,
    gender: "boys",
    food: "veg",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    ],
    amenities: ["wifi", "ac", "laundry", "power_backup"],
    verified: true,
    distance: 1.2,
    ownerPhone: "+919876543210",
    ownerWhatsApp: "+919876543210",
    rules: ["No smoking", "Entry before 10 PM", "No loud music after 11 PM"],
    description: "Comfortable and well-maintained PG with all modern amenities. Perfect for working professionals and students.",
  },
  {
    id: "2",
    name: "Green Valley Girls Hostel",
    address: "HSR Layout, Bangalore",
    latitude: 12.9116,
    longitude: 77.6389,
    rating: 4.8,
    reviewCount: 256,
    rent: 12000,
    deposit: 24000,
    gender: "girls",
    food: "both",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop",
    ],
    amenities: ["wifi", "ac", "laundry", "parking", "power_backup"],
    verified: true,
    distance: 2.5,
    ownerPhone: "+919876543211",
    ownerWhatsApp: "+919876543211",
    rules: ["No male visitors after 8 PM", "Entry before 9:30 PM", "Maintain cleanliness"],
    description: "Premium girls hostel with 24/7 security, homely food, and spacious rooms. Ideal for working women.",
  },
  {
    id: "3",
    name: "Urban Co-Living Space",
    address: "Indiranagar, Bangalore",
    latitude: 12.9784,
    longitude: 77.6408,
    rating: 4.3,
    reviewCount: 89,
    rent: 15000,
    deposit: 30000,
    gender: "coliving",
    food: "veg",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    ],
    amenities: ["wifi", "ac", "laundry", "parking", "power_backup", "gym"],
    verified: true,
    distance: 0.8,
    ownerPhone: "+919876543212",
    ownerWhatsApp: "+919876543212",
    rules: ["No smoking inside", "Respect quiet hours", "Clean common areas after use"],
    description: "Modern co-living space with community events, coworking area, and premium amenities.",
  },
  {
    id: "4",
    name: "Budget Boys Stay",
    address: "BTM Layout, Bangalore",
    latitude: 12.9166,
    longitude: 77.6101,
    rating: 3.9,
    reviewCount: 45,
    rent: 6000,
    deposit: 12000,
    gender: "boys",
    food: "nonveg",
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1523192193543-6e7296d960e4?w=600&h=400&fit=crop",
    ],
    amenities: ["wifi", "power_backup"],
    verified: false,
    distance: 3.2,
    ownerPhone: "+919876543213",
    ownerWhatsApp: "+919876543213",
    rules: ["No alcohol", "Maintain silence after 11 PM"],
    description: "Affordable accommodation for students and freshers. Basic amenities at a budget price.",
  },
  {
    id: "5",
    name: "Lakshmi Ladies PG",
    address: "Marathahalli, Bangalore",
    latitude: 12.9591,
    longitude: 77.6974,
    rating: 4.6,
    reviewCount: 178,
    rent: 9500,
    deposit: 19000,
    gender: "girls",
    food: "veg",
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1598928506311-c55ez89a2cc8?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
    ],
    amenities: ["wifi", "laundry", "power_backup"],
    verified: true,
    distance: 4.1,
    ownerPhone: "+919876543214",
    ownerWhatsApp: "+919876543214",
    rules: ["Strict 9 PM curfew", "No overnight guests", "Weekly room inspection"],
    description: "Safe and secure ladies PG with homely atmosphere and delicious vegetarian food.",
  },
  {
    id: "6",
    name: "Elite Co-Living Hub",
    address: "Whitefield, Bangalore",
    latitude: 12.9698,
    longitude: 77.7500,
    rating: 4.7,
    reviewCount: 312,
    rent: 18000,
    deposit: 36000,
    gender: "coliving",
    food: "both",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop",
    ],
    amenities: ["wifi", "ac", "laundry", "parking", "power_backup", "gym", "pool"],
    verified: true,
    distance: 5.5,
    ownerPhone: "+919876543215",
    ownerWhatsApp: "+919876543215",
    rules: ["Noise curfew after 10 PM", "Guests allowed with prior notice", "No pets"],
    description: "Luxury co-living with swimming pool, gym, and community lounge. All-inclusive rent.",
  },
];

export const getPGById = (id: string): PG | undefined => {
  return mockPGs.find((pg) => pg.id === id);
};

export const filterPGs = (filters: {
  gender?: string;
  food?: string;
  minRent?: number;
  maxRent?: number;
  amenities?: string[];
}): PG[] => {
  return mockPGs.filter((pg) => {
    if (filters.gender && filters.gender !== "all" && pg.gender !== filters.gender) {
      return false;
    }
    if (filters.food && filters.food !== "all" && pg.food !== filters.food && pg.food !== "both") {
      return false;
    }
    if (filters.minRent && pg.rent < filters.minRent) {
      return false;
    }
    if (filters.maxRent && pg.rent > filters.maxRent) {
      return false;
    }
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((a) => pg.amenities.includes(a));
      if (!hasAllAmenities) return false;
    }
    return true;
  });
};
