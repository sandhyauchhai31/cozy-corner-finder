import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PG } from "@/types/pg";

export const useWishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedPGIds, setSavedPGIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch saved PG IDs on mount or when user changes
  useEffect(() => {
    if (user) {
      fetchSavedPGs();
    } else {
      setSavedPGIds(new Set());
    }
  }, [user]);

  const fetchSavedPGs = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("saved_pgs")
      .select("pg_id")
      .eq("user_id", user.id);
    
    if (data) {
      setSavedPGIds(new Set(data.map(item => item.pg_id)));
    }
  };

  const toggleWishlist = useCallback(async (pg: PG) => {
    // If not logged in, redirect to auth
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to save PGs to your wishlist.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setLoading(true);
    const isCurrentlySaved = savedPGIds.has(pg.id);

    try {
      if (isCurrentlySaved) {
        // Remove from wishlist
        const { error } = await supabase
          .from("saved_pgs")
          .delete()
          .eq("user_id", user.id)
          .eq("pg_id", pg.id);

        if (error) throw error;

        setSavedPGIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(pg.id);
          return newSet;
        });

        toast({
          title: "Removed from wishlist",
          description: `${pg.name} has been removed from your wishlist.`,
        });
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from("saved_pgs")
          .insert({
            user_id: user.id,
            pg_id: pg.id,
            pg_name: pg.name,
            pg_location: pg.address,
            pg_price: pg.rent,
            pg_image: pg.images[0] || null,
          });

        if (error) throw error;

        setSavedPGIds(prev => new Set(prev).add(pg.id));

        toast({
          title: "Added to wishlist",
          description: `${pg.name} has been saved to your wishlist.`,
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, savedPGIds, navigate, toast]);

  const isInWishlist = useCallback((pgId: string) => {
    return savedPGIds.has(pgId);
  }, [savedPGIds]);

  return {
    toggleWishlist,
    isInWishlist,
    loading,
    isLoggedIn: !!user,
  };
};
