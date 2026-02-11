import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarIcon,
  MapPin,
  Users,
  Bath,
  Star,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import type { PG } from "@/types/pg";
import type { RoomOption } from "@/components/RoomSelector";

interface CheckoutState {
  pg: PG;
  room: RoomOption;
}

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const state = location.state as CheckoutState | null;

  const [checkInDate, setCheckInDate] = useState<Date>();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!state?.pg || !state?.room) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">No room selected</h1>
          <p className="text-muted-foreground mb-6">
            Please go back and select a room to continue.
          </p>
          <Link to="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { pg, room } = state;
  const serviceFee = Math.round(room.rent * 0.05);
  const totalAmount = room.rent + room.deposit + serviceFee;

  const handleConfirmBooking = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to complete your booking",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!checkInDate) {
      toast({ title: "Select a move-in date", variant: "destructive" });
      return;
    }
    if (!fullName.trim()) {
      toast({ title: "Enter your full name", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("checkouts").insert({
        user_id: user.id,
        pg_id: pg.id,
        pg_name: pg.name,
        pg_location: pg.address,
        pg_price: room.rent,
        check_in_date: format(checkInDate, "yyyy-MM-dd"),
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Booking confirmed! 🎉",
        description: "Your reservation has been submitted successfully.",
      });
      navigate("/profile");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-5xl py-6">
        {/* Back link */}
        <Link
          to={`/pg/${pg.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {pg.name}
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Confirm and pay
        </h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left column — form */}
          <div className="lg:col-span-3 space-y-8">
            {/* Room summary card */}
            <div className="flex gap-4 p-4 bg-card rounded-xl border">
              <img
                src={room.images[0]}
                alt={room.name}
                className="w-24 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">{room.name}</h3>
                <p className="text-sm text-muted-foreground">{pg.name}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Sleeps {room.sleeps}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5" />
                    {room.bathroomType === "private" ? "Private" : "Shared"} bath
                  </span>
                </div>
              </div>
            </div>

            {/* Move-in date */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Move-in date</h2>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left h-12",
                      !checkInDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 w-4 h-4" />
                    {checkInDate ? format(checkInDate, "EEEE, MMMM dd, yyyy") : "Select move-in date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Separator />

            {/* Guest details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Your details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Policies */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">House rules</h2>
              <ul className="space-y-1.5">
                {pg.rules.map((rule, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="mt-1 w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Confirm button (mobile-visible) */}
            <Button
              onClick={handleConfirmBooking}
              disabled={isSubmitting || !checkInDate || !fullName.trim()}
              className="w-full h-12 text-base font-semibold lg:hidden"
              size="lg"
            >
              {isSubmitting ? "Processing..." : `Confirm & Pay ₹${totalAmount.toLocaleString()}`}
            </Button>
          </div>

          {/* Right column — price card (sticky) */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="bg-card rounded-xl border p-5 space-y-5">
                {/* PG preview */}
                <div className="flex gap-4">
                  <img
                    src={pg.images[0]}
                    alt={pg.name}
                    className="w-28 h-24 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">{pg.gender === "coliving" ? "Co-living" : pg.gender} · {pg.address.split(",")[0]}</p>
                    <h3 className="font-semibold text-foreground leading-tight">{pg.name}</h3>
                    <div className="flex items-center gap-1 mt-1 text-sm">
                      <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                      <span className="font-medium">{pg.rating}</span>
                      <span className="text-muted-foreground">({pg.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Price breakdown */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Price details</h3>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly rent ({room.name})</span>
                    <span className="text-foreground">₹{room.rent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Security deposit</span>
                    <span className="text-foreground">₹{room.deposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service fee</span>
                    <span className="text-foreground">₹{serviceFee.toLocaleString()}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-foreground">
                    <span>Total due today</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting || !checkInDate || !fullName.trim()}
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  {isSubmitting ? "Processing..." : "Confirm & Pay"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  You won't be charged yet
                </p>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure booking · Free cancellation within 24h</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
