import { useState } from "react";
import { Users, Bath, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export interface RoomOption {
  id: string;
  name: string;
  description: string;
  sleeps: number;
  bathroomType: "private" | "shared";
  rent: number;
  deposit: number;
  available: number;
  isPopular?: boolean;
  images: string[];
}

interface RoomSelectorProps {
  rooms: RoomOption[];
  selectedRoom: RoomOption | null;
  onSelectRoom: (room: RoomOption) => void;
}

const RoomImageCarousel = ({ images, name }: { images: string[]; name: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-24 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <span className="text-xs text-muted-foreground">No image</span>
      </div>
    );
  }

  return (
    <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 group">
      <img
        src={images[currentIndex]}
        alt={`${name} - Image ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />
      
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-0.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-3 h-3 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-3 h-3 text-white" />
          </button>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-1 h-1 rounded-full transition-colors",
                  idx === currentIndex ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const RoomSelector = ({ rooms, selectedRoom, onSelectRoom }: RoomSelectorProps) => {
  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-foreground">Choose your room</h2>
      <div className="space-y-3">
        {rooms.map((room) => {
          const isSelected = selectedRoom?.id === room.id;
          
          return (
            <div
              key={room.id}
              className={cn(
                "relative border rounded-xl p-4 cursor-pointer transition-all",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card hover:border-primary/50"
              )}
              onClick={() => onSelectRoom(room)}
            >
              {/* Selection indicator */}
              <div
                className={cn(
                  "absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                )}
              >
                {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>

              {/* Room badges */}
              <div className="flex flex-wrap gap-2 mb-3 pr-8">
                {room.isPopular && (
                  <Badge className="bg-success/10 text-success border-0 text-xs">
                    Popular choice
                  </Badge>
                )}
                {room.available <= 3 && (
                  <Badge variant="destructive" className="text-xs">
                    Only {room.available} left!
                  </Badge>
                )}
              </div>

              {/* Room content with image */}
              <div className="flex gap-4">
                {/* Room Image Carousel */}
                <RoomImageCarousel images={room.images} name={room.name} />

                {/* Room details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">{room.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {room.description}
                  </p>

                  {/* Room features */}
                  <div className="flex flex-wrap gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Sleeps {room.sleeps}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Bath className="w-4 h-4" />
                      <span className="capitalize">{room.bathroomType} bathroom</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xl font-bold text-foreground">
                        ₹{room.rent.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground"> / month</span>
                    </div>
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRoom(room);
                      }}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomSelector;
