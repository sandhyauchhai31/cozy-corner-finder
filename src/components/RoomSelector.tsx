import { useState } from "react";
import { Users, Bath, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
}

interface RoomSelectorProps {
  rooms: RoomOption[];
  selectedRoom: RoomOption | null;
  onSelectRoom: (room: RoomOption) => void;
}

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
              <div className="flex flex-wrap gap-2 mb-2 pr-8">
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

              {/* Room name & description */}
              <h3 className="font-semibold text-foreground mb-1">{room.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
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
          );
        })}
      </div>
    </div>
  );
};

export default RoomSelector;
