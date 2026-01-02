import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

interface SearchBarProps {
  variant?: "hero" | "compact";
  initialLocation?: string;
  initialGender?: string;
  initialBudget?: [number, number];
  onSearch?: (filters: { location: string; gender: string; budget: [number, number] }) => void;
}

const SearchBar = ({
  variant = "hero",
  initialLocation = "",
  initialGender = "all",
  initialBudget = [0, 25000],
  onSearch,
}: SearchBarProps) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(initialLocation);
  const [gender, setGender] = useState(initialGender);
  const [budget, setBudget] = useState<[number, number]>(initialBudget);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (gender !== "all") params.set("gender", gender);
    params.set("minRent", budget[0].toString());
    params.set("maxRent", budget[1].toString());

    if (onSearch) {
      onSearch({ location, gender, budget });
    } else {
      navigate(`/search?${params.toString()}`);
    }
  }, [location, gender, budget, navigate, onSearch]);

  if (variant === "compact") {
    return (
      <div className="flex flex-col sm:flex-row gap-2 bg-card p-3 rounded-xl shadow-card">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-9 bg-muted/50 border-0 h-10"
          />
        </div>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger className="w-full sm:w-32 bg-muted/50 border-0 h-10">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="boys">Boys</SelectItem>
            <SelectItem value="girls">Girls</SelectItem>
            <SelectItem value="coliving">Co-living</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} size="icon" className="h-10 w-10 sm:w-10">
          <Search className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card rounded-2xl shadow-elevated p-4 md:p-6">
        {/* Location Input */}
        <div className="relative mb-4">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <Input
            placeholder="Enter location, area or landmark..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-12 h-14 text-base bg-muted/50 border-0 rounded-xl"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Gender Select */}
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="flex-1 h-12 bg-muted/50 border-0 rounded-xl">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Select gender" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="boys">Boys Only</SelectItem>
              <SelectItem value="girls">Girls Only</SelectItem>
              <SelectItem value="coliving">Co-living</SelectItem>
            </SelectContent>
          </Select>

          {/* Budget Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="flex-1 h-12 bg-muted/50 border-0 rounded-xl justify-between hover:bg-muted"
              >
                <span className="text-muted-foreground">
                  ₹{budget[0].toLocaleString()} - ₹{budget[1].toLocaleString()}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="start">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget Range</span>
                  <span className="font-medium">
                    ₹{budget[0].toLocaleString()} - ₹{budget[1].toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={budget}
                  onValueChange={(value) => setBudget(value as [number, number])}
                  min={0}
                  max={50000}
                  step={500}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹0</span>
                  <span>₹50,000+</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          size="lg"
          className="w-full h-14 text-base font-semibold rounded-xl gap-2"
        >
          <Search className="w-5 h-5" />
          Search PGs
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
