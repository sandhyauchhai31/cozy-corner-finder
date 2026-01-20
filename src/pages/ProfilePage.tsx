import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  ShoppingBag, 
  User, 
  LogOut, 
  MapPin, 
  IndianRupee,
  Calendar,
  Loader2,
  Building2,
  Bookmark
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface SavedPG {
  id: string;
  pg_id: string;
  pg_name: string;
  pg_location: string | null;
  pg_price: number | null;
  pg_image: string | null;
  created_at: string;
}

interface Checkout {
  id: string;
  pg_id: string;
  pg_name: string;
  pg_location: string | null;
  pg_price: number | null;
  check_in_date: string | null;
  check_out_date: string | null;
  status: string | null;
  created_at: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [savedPGs, setSavedPGs] = useState<SavedPG[]>([]);
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch saved PGs
      const { data: savedData } = await supabase
        .from("saved_pgs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (savedData) {
        setSavedPGs(savedData);
      }

      // Fetch checkouts
      const { data: checkoutData } = await supabase
        .from("checkouts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (checkoutData) {
        setCheckouts(checkoutData);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/");
  };

  const removeSavedPG = async (id: string) => {
    const { error } = await supabase
      .from("saved_pgs")
      .delete()
      .eq("id", id);
    
    if (!error) {
      setSavedPGs(savedPGs.filter(pg => pg.id !== id));
      toast({
        title: "Removed",
        description: "PG removed from saved list.",
      });
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "confirmed":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user?.email?.[0].toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 space-y-6">
        {/* Profile Header Card */}
        <Card className="overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary to-primary/70" />
          <CardContent className="relative pt-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left pb-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {profile?.full_name || "User"}
                </h1>
                <p className="text-muted-foreground">{profile?.email || user?.email}</p>
              </div>
              <Button variant="outline" className="gap-2" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-accent to-accent/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{savedPGs.length}</p>
                <p className="text-sm text-muted-foreground">Saved PGs</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-accent to-accent/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{checkouts.length}</p>
                <p className="text-sm text-muted-foreground">Checkouts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Saved PGs and Checkouts */}
        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="saved" className="gap-2">
              <Bookmark className="w-4 h-4" />
              Saved PGs
            </TabsTrigger>
            <TabsTrigger value="checkouts" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Checkouts
            </TabsTrigger>
          </TabsList>
          
          {/* Saved PGs Tab */}
          <TabsContent value="saved" className="mt-4">
            {savedPGs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No saved PGs yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring and save your favorite PGs!
                  </p>
                  <Button onClick={() => navigate("/search")}>
                    Explore PGs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {savedPGs.map((pg) => (
                  <Card key={pg.id} className="overflow-hidden">
                    <div className="flex">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                        <img
                          src={pg.pg_image || "/placeholder.svg"}
                          alt={pg.pg_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground line-clamp-1">
                            {pg.pg_name}
                          </h3>
                          {pg.pg_location && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {pg.pg_location}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          {pg.pg_price && (
                            <p className="font-semibold text-primary flex items-center">
                              <IndianRupee className="w-4 h-4" />
                              {pg.pg_price.toLocaleString()}/mo
                            </p>
                          )}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/pg/${pg.pg_id}`)}
                            >
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => removeSavedPG(pg.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Checkouts Tab */}
          <TabsContent value="checkouts" className="mt-4">
            {checkouts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No checkouts yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Book your first PG to see your checkout history!
                  </p>
                  <Button onClick={() => navigate("/search")}>
                    Find a PG
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {checkouts.map((checkout) => (
                  <Card key={checkout.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {checkout.pg_name}
                            </h3>
                            {checkout.pg_location && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {checkout.pg_location}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusColor(checkout.status)}>
                          {checkout.status || "pending"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {checkout.check_in_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Check-in: {new Date(checkout.check_in_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {checkout.pg_price && (
                          <div className="flex items-center gap-1 text-foreground font-medium">
                            <IndianRupee className="w-4 h-4" />
                            <span>{checkout.pg_price.toLocaleString()}/mo</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProfilePage;
