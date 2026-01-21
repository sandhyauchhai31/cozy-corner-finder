import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import type { PG } from "@/types/pg";

interface CheckoutDialogProps {
  pg: PG;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CheckoutDialog = ({ pg, open, onOpenChange }: CheckoutDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const totalRent = nights * (pg.rent / 30); // Daily rate from monthly rent
  const serviceFee = Math.round(totalRent * 0.1);
  const totalAmount = Math.round(totalRent + serviceFee);

  const handleReserve = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to make a reservation",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Select dates",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    if (checkOutDate <= checkInDate) {
      toast({
        title: "Invalid dates",
        description: "Check-out date must be after check-in date",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("checkouts").insert({
        user_id: user.id,
        pg_id: pg.id,
        pg_name: pg.name,
        pg_location: pg.address,
        pg_price: totalAmount,
        check_in_date: format(checkInDate, "yyyy-MM-dd"),
        check_out_date: format(checkOutDate, "yyyy-MM-dd"),
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Reservation confirmed!",
        description: "Your booking has been submitted successfully.",
      });

      onOpenChange(false);
      navigate("/profile");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to make reservation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">Reserve your stay</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Price display */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold">₹{Math.round(pg.rent / 30).toLocaleString()}</span>
              <span className="text-muted-foreground"> / night</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-medium">{pg.rating}</span>
              <span className="text-muted-foreground">({pg.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Date selection */}
          <div className="grid grid-cols-2 gap-2 border rounded-xl overflow-hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "h-auto py-3 px-4 justify-start text-left font-normal rounded-none border-r",
                    !checkInDate && "text-muted-foreground"
                  )}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold uppercase">Check-in</span>
                    <span className="text-sm">
                      {checkInDate ? format(checkInDate, "MMM dd, yyyy") : "Add date"}
                    </span>
                  </div>
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

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "h-auto py-3 px-4 justify-start text-left font-normal rounded-none",
                    !checkOutDate && "text-muted-foreground"
                  )}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold uppercase">Checkout</span>
                    <span className="text-sm">
                      {checkOutDate ? format(checkOutDate, "MMM dd, yyyy") : "Add date"}
                    </span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  disabled={(date) => date < (checkInDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guest selection */}
          <div className="border rounded-xl">
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="h-auto py-3 px-4 border-0 focus:ring-0">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold uppercase">Guests</span>
                    <SelectValue placeholder="Select guests" />
                  </div>
                </div>
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "guest" : "guests"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reserve button */}
          <Button
            onClick={handleReserve}
            disabled={isSubmitting || !checkInDate || !checkOutDate}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isSubmitting ? "Processing..." : "Reserve"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            You won't be charged yet
          </p>

          {/* Price breakdown */}
          {nights > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="underline">
                    ₹{Math.round(pg.rent / 30).toLocaleString()} x {nights} nights
                  </span>
                  <span>₹{Math.round(totalRent).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="underline">Service fee</span>
                  <span>₹{serviceFee.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
