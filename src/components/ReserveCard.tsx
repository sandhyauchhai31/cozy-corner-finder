import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { PG } from "@/types/pg";

interface ReserveCardProps {
  pg: PG;
}

const ReserveCard = ({ pg }: ReserveCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
      <div className="mb-6">
        <span className="text-2xl font-bold">₹{pg.rent.toLocaleString()}</span>
        <span className="text-muted-foreground"> / month</span>
      </div>

      {/* Reserve button */}
      <Button
        onClick={handleReserve}
        className="w-full h-12 text-base font-semibold mb-3"
        size="lg"
      >
        Reserve
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        You won't be charged yet
      </p>
    </div>
  );
};

export default ReserveCard;
