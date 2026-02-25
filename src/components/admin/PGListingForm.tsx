import { useState } from "react";
import { PG, RoomType, BathroomType, Gender, FoodType, Amenity } from "@/types/pg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ImagePlus,
  Plus,
  Trash2,
  MapPin,
  Wifi,
  Wind,
  Car,
  Zap,
  Building,
  Users,
  Utensils,
  X,
  Star,
} from "lucide-react";

const AMENITY_OPTIONS: { value: Amenity; label: string; icon: React.ReactNode }[] = [
  { value: "wifi", label: "WiFi", icon: <Wifi className="w-4 h-4" /> },
  { value: "ac", label: "AC", icon: <Wind className="w-4 h-4" /> },
  { value: "laundry", label: "Laundry", icon: <Building className="w-4 h-4" /> },
  { value: "parking", label: "Parking", icon: <Car className="w-4 h-4" /> },
  { value: "power_backup", label: "Power Backup", icon: <Zap className="w-4 h-4" /> },
  { value: "gym", label: "Gym", icon: <Users className="w-4 h-4" /> },
  { value: "pool", label: "Pool", icon: <Building className="w-4 h-4" /> },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "boys", label: "Boys" },
  { value: "girls", label: "Girls" },
  { value: "coliving", label: "Co-Living" },
];

const FOOD_OPTIONS: { value: FoodType; label: string }[] = [
  { value: "veg", label: "Vegetarian" },
  { value: "nonveg", label: "Non-Vegetarian" },
  { value: "both", label: "Both Veg & Non-Veg" },
];

interface PGListingFormProps {
  initialData: Partial<PG>;
  isNew: boolean;
  onSave: (data: PG) => void;
  onCancel: () => void;
}

const emptyRoom: RoomType = {
  id: "",
  name: "",
  description: "",
  sleeps: 1,
  bathroomType: "shared",
  rent: 0,
  deposit: 0,
  available: 0,
  isPopular: false,
  images: [],
};

const PGListingForm = ({ initialData, isNew, onSave, onCancel }: PGListingFormProps) => {
  const [pg, setPg] = useState<Partial<PG>>({ ...initialData });
  const [newImageUrl, setNewImageUrl] = useState("");
  const [roomImageUrls, setRoomImageUrls] = useState<Record<number, string>>({});

  const updateField = <K extends keyof PG>(key: K, value: PG[K]) => {
    setPg((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity: Amenity) => {
    const current = pg.amenities || [];
    if (current.includes(amenity)) {
      updateField("amenities", current.filter((a) => a !== amenity));
    } else {
      updateField("amenities", [...current, amenity]);
    }
  };

  // PG Images
  const addPGImage = () => {
    if (!newImageUrl.trim()) return;
    updateField("images", [...(pg.images || []), newImageUrl.trim()]);
    setNewImageUrl("");
  };

  const removePGImage = (index: number) => {
    updateField("images", (pg.images || []).filter((_, i) => i !== index));
  };

  // Rooms
  const addRoom = () => {
    const rooms = pg.rooms || [];
    const newRoom: RoomType = {
      ...emptyRoom,
      id: `${pg.id}-room-${Date.now()}`,
    };
    updateField("rooms", [...rooms, newRoom]);
  };

  const updateRoom = (index: number, field: keyof RoomType, value: any) => {
    const rooms = [...(pg.rooms || [])];
    rooms[index] = { ...rooms[index], [field]: value };
    updateField("rooms", rooms);
  };

  const removeRoom = (index: number) => {
    updateField("rooms", (pg.rooms || []).filter((_, i) => i !== index));
  };

  const addRoomImage = (roomIndex: number) => {
    const url = roomImageUrls[roomIndex];
    if (!url?.trim()) return;
    const rooms = [...(pg.rooms || [])];
    rooms[roomIndex] = { ...rooms[roomIndex], images: [...rooms[roomIndex].images, url.trim()] };
    updateField("rooms", rooms);
    setRoomImageUrls((prev) => ({ ...prev, [roomIndex]: "" }));
  };

  const removeRoomImage = (roomIndex: number, imgIndex: number) => {
    const rooms = [...(pg.rooms || [])];
    rooms[roomIndex] = {
      ...rooms[roomIndex],
      images: rooms[roomIndex].images.filter((_, i) => i !== imgIndex),
    };
    updateField("rooms", rooms);
  };

  const handleSubmit = () => {
    onSave(pg as PG);
  };

  return (
    <div className="space-y-8">
      {/* ── Section 1: PG Cover Images ── */}
      <section className="bg-card rounded-xl p-5 shadow-card space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-primary" />
          PG Background Images
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {(pg.images || []).map((img, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden aspect-video bg-muted">
              <img src={img} alt={`PG image ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removePGImage(i)}
                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Paste image URL…"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPGImage()}
          />
          <Button variant="secondary" onClick={addPGImage} size="sm">
            Add
          </Button>
        </div>
      </section>

      {/* ── Section 2: Gender Type ── */}
      <section className="bg-card rounded-xl p-5 shadow-card space-y-4">
        <h3 className="text-lg font-semibold text-foreground">PG Type</h3>
        <div className="flex flex-wrap gap-3">
          {GENDER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateField("gender", opt.value)}
              className={`px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all ${
                pg.gender === opt.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Section 3: Title & Description ── */}
      <section className="bg-card rounded-xl p-5 shadow-card space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Basic Details</h3>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label>PG Title</Label>
            <Input
              value={pg.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Sunshine Boys PG"
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Description</Label>
            <Textarea
              value={pg.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe your PG, its highlights, and nearby landmarks…"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Base Rent (₹)</Label>
              <Input
                type="number"
                value={pg.rent || 0}
                onChange={(e) => updateField("rent", Number(e.target.value))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Deposit (₹)</Label>
              <Input
                type="number"
                value={pg.deposit || 0}
                onChange={(e) => updateField("deposit", Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Rooms ── */}
      <section className="bg-card rounded-xl p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Choose Your Rooms</h3>
          <Button variant="outline" size="sm" onClick={addRoom}>
            <Plus className="w-4 h-4 mr-1" /> Add Room
          </Button>
        </div>

        {(pg.rooms || []).length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No rooms added yet. Click "Add Room" to start.
          </p>
        )}

        {(pg.rooms || []).map((room, ri) => (
          <div key={room.id || ri} className="border border-border rounded-lg p-4 space-y-4 relative">
            <button
              onClick={() => removeRoom(ri)}
              className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-destructive/10 text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <p className="text-sm font-semibold text-muted-foreground">Room {ri + 1}</p>

            {/* Room images */}
            <div>
              <Label className="text-xs mb-1 block">Room Images</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {room.images.map((img, ii) => (
                  <div key={ii} className="relative group w-20 h-14 rounded overflow-hidden bg-muted">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeRoomImage(ri, ii)}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Room image URL…"
                  value={roomImageUrls[ri] || ""}
                  onChange={(e) => setRoomImageUrls((prev) => ({ ...prev, [ri]: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && addRoomImage(ri)}
                  className="text-xs h-8"
                />
                <Button variant="secondary" size="sm" className="h-8 text-xs" onClick={() => addRoomImage(ri)}>
                  Add
                </Button>
              </div>
            </div>

            {/* Room title & description */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs">Room Title</Label>
                <Input
                  value={room.name}
                  onChange={(e) => updateRoom(ri, "name", e.target.value)}
                  placeholder="e.g. Twin Sharing Room"
                  className="h-9"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Sleeps</Label>
                <Input
                  type="number"
                  min={1}
                  value={room.sleeps}
                  onChange={(e) => updateRoom(ri, "sleeps", Number(e.target.value))}
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs">Room Description</Label>
              <Textarea
                value={room.description}
                onChange={(e) => updateRoom(ri, "description", e.target.value)}
                rows={2}
                className="text-sm"
              />
            </div>

            {/* Bathroom, Price, Deposit, Available */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs">Bathroom</Label>
                <Select
                  value={room.bathroomType}
                  onValueChange={(v) => updateRoom(ri, "bathroomType", v as BathroomType)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shared">Shared</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Rent (₹)</Label>
                <Input
                  type="number"
                  value={room.rent}
                  onChange={(e) => updateRoom(ri, "rent", Number(e.target.value))}
                  className="h-9"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Deposit (₹)</Label>
                <Input
                  type="number"
                  value={room.deposit}
                  onChange={(e) => updateRoom(ri, "deposit", Number(e.target.value))}
                  className="h-9"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Available</Label>
                <Input
                  type="number"
                  min={0}
                  value={room.available}
                  onChange={(e) => updateRoom(ri, "available", Number(e.target.value))}
                  className="h-9"
                />
              </div>
            </div>

            {/* Badges: Popular, Availability */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={room.isPopular || false}
                  onCheckedChange={(v) => updateRoom(ri, "isPopular", v)}
                  id={`popular-${ri}`}
                />
                <Label htmlFor={`popular-${ri}`} className="text-xs cursor-pointer">
                  Popular Choice
                </Label>
              </div>
              {room.available > 0 && room.available <= 2 && (
                <Badge variant="destructive" className="text-xs">
                  Only {room.available} left
                </Badge>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* ── Section 5: Amenities ── */}
      <section className="bg-card rounded-xl p-5 shadow-card space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Amenities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {AMENITY_OPTIONS.map((a) => {
            const checked = (pg.amenities || []).includes(a.value);
            return (
              <button
                key={a.value}
                onClick={() => toggleAmenity(a.value)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  checked
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/30"
                }`}
              >
                {a.icon}
                {a.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Section 6: Food ── */}
      <section className="bg-card rounded-xl p-5 shadow-card space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Utensils className="w-5 h-5 text-primary" />
          Food
        </h3>
        <div className="flex flex-wrap gap-3">
          {FOOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateField("food", opt.value)}
              className={`px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all ${
                pg.food === opt.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Section 7: Location ── */}
      <section className="bg-card rounded-xl p-5 shadow-card space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Location
        </h3>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label>Address</Label>
            <Input
              value={pg.address || ""}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="e.g. Koramangala, Bangalore"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Latitude</Label>
              <Input
                type="number"
                step="any"
                value={pg.latitude || 0}
                onChange={(e) => updateField("latitude", Number(e.target.value))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Longitude</Label>
              <Input
                type="number"
                step="any"
                value={pg.longitude || 0}
                onChange={(e) => updateField("longitude", Number(e.target.value))}
              />
            </div>
          </div>
          {/* Map preview */}
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            {pg.latitude && pg.longitude && pg.latitude !== 0 ? (
              <iframe
                title="Location preview"
                width="100%"
                height="100%"
                className="rounded-lg"
                style={{ border: 0 }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${(pg.longitude || 0) - 0.01},${(pg.latitude || 0) - 0.01},${(pg.longitude || 0) + 0.01},${(pg.latitude || 0) + 0.01}&layer=mapnik&marker=${pg.latitude},${pg.longitude}`}
                loading="lazy"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Enter coordinates to preview location</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Section 8: House Rules ── */}
      <section className="bg-card rounded-xl p-5 shadow-card space-y-4">
        <h3 className="text-lg font-semibold text-foreground">House Rules</h3>
        <div className="space-y-2">
          {(pg.rules || []).map((rule, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={rule}
                onChange={(e) => {
                  const rules = [...(pg.rules || [])];
                  rules[i] = e.target.value;
                  updateField("rules", rules);
                }}
                className="h-9"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={() => updateField("rules", (pg.rules || []).filter((_, idx) => idx !== i))}
              >
                <X className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateField("rules", [...(pg.rules || []), ""])}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Rule
          </Button>
        </div>
      </section>

      {/* ── Footer Actions ── */}
      <div className="flex justify-end gap-3 pt-2 pb-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>{isNew ? "Create PG Listing" : "Save Changes"}</Button>
      </div>
    </div>
  );
};

export default PGListingForm;
