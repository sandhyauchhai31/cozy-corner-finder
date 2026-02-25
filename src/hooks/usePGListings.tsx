import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mockPGs } from "@/data/mockPGs";
import { PG, RoomType } from "@/types/pg";

const mapDbToPG = (row: any): PG => ({
  id: row.id,
  name: row.name,
  address: row.address,
  latitude: row.latitude,
  longitude: row.longitude,
  rating: row.rating,
  reviewCount: row.review_count,
  rent: row.rent,
  deposit: row.deposit,
  gender: row.gender,
  food: row.food,
  images: row.images || [],
  amenities: row.amenities || [],
  verified: row.verified,
  distance: row.distance,
  ownerPhone: row.owner_phone,
  ownerWhatsApp: row.owner_whatsapp,
  rules: row.rules || [],
  description: row.description,
  roomSharing: row.room_sharing,
  bathroomType: row.bathroom_type,
  rooms: (row.rooms as RoomType[]) || [],
});

export const mapPGToDb = (pg: PG) => ({
  name: pg.name,
  address: pg.address,
  latitude: pg.latitude,
  longitude: pg.longitude,
  rating: pg.rating,
  review_count: pg.reviewCount,
  rent: pg.rent,
  deposit: pg.deposit,
  gender: pg.gender,
  food: pg.food,
  images: pg.images,
  amenities: pg.amenities,
  verified: pg.verified,
  distance: pg.distance,
  owner_phone: pg.ownerPhone || "",
  owner_whatsapp: pg.ownerWhatsApp || "",
  rules: pg.rules,
  description: pg.description,
  room_sharing: pg.roomSharing,
  bathroom_type: pg.bathroomType,
  rooms: pg.rooms as any,
});

export const usePGListings = () => {
  return useQuery({
    queryKey: ["pg-listings"],
    queryFn: async (): Promise<PG[]> => {
      const { data, error } = await supabase
        .from("pg_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching PG listings:", error);
        return [...mockPGs];
      }

      const dbPGs = (data || []).map(mapDbToPG);
      return [...mockPGs, ...dbPGs];
    },
  });
};

export const useDBPGListings = () => {
  return useQuery({
    queryKey: ["db-pg-listings"],
    queryFn: async (): Promise<PG[]> => {
      const { data, error } = await supabase
        .from("pg_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching PG listings:", error);
        return [];
      }

      return (data || []).map(mapDbToPG);
    },
  });
};
