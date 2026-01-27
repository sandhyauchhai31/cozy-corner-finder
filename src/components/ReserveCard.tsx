import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { PG } from "@/types/pg";
import type { RoomOption } from "@/components/RoomSelector";

interface ReserveCardProps {
  pg: PG;
  selectedRoom?: RoomOption | null;
}

const ReserveCard = ({ pg, selectedRoom }: ReserveCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const displayRent = selectedRoom?.rent ?? pg.rent;
  const displayDeposit = selectedRoom?.deposit ?? pg.deposit;

  const handleReserve = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to make a reservation",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    // Navigate to a checkout flow or open dialog
    toast({
      title: "Reservation initiated",
      description: "Redirecting to complete your booking...",
    });
    navigate("/profile");
  };

  return (
    <div className="bg-card rounded-xl p-5 shadow-card border">
      {/* Price display */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-muted-foreground">From</span>
          <span className="text-2xl font-bold">₹{displayRent.toLocaleString()}</span>
          <span className="text-muted-foreground"> / month</span>
        </div>
        {selectedRoom && (
          <p className="text-sm text-primary mt-1">{selectedRoom.name}</p>
        )}
      </div>

      {/* Deposit info */}
      <div className="bg-muted rounded-lg p-3 mb-4">
        <p className="text-sm text-muted-foreground">Security Deposit</p>
        <p className="font-semibold">₹{displayDeposit.toLocaleString()}</p>
      </div>

      {/* Reserve button */}
      <Button
        onClick={handleReserve}
        className="w-full h-12 text-base font-semibold mb-3"
        size="lg"
        disabled={!selectedRoom}
      >
        {selectedRoom ? "Reserve" : "Select a room first"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        You won't be charged yet
      </p>
    </div>
  );
};

export default ReserveCard;
