import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";

interface FilterPanelProps {
  filters: {
    gender: string;
    food: string;
    minRent: number;
    maxRent: number;
    amenities: string[];
  };
  onChange: (filters: any) => void;
  resultCount: number;
}

const amenitiesList = [
  { id: "wifi", label: "WiFi" },
  { id: "ac", label: "AC" },
  { id: "laundry", label: "Laundry" },
  { id: "parking", label: "Parking" },
  { id: "power_backup", label: "Power Backup" },
  { id: "gym", label: "Gym" },
];

const FilterContent = ({ filters, onChange }: Omit<FilterPanelProps, "resultCount">) => {
  const [openSections, setOpenSections] = useState<string[]>(["rent", "gender", "food", "amenities"]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleGenderChange = (value: string) => {
    onChange({ ...filters, gender: filters.gender === value ? "all" : value });
  };

  const handleFoodChange = (value: string) => {
    onChange({ ...filters, food: filters.food === value ? "all" : value });
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onChange({ ...filters, amenities: newAmenities });
  };

  return (
    <div className="space-y-4">
      {/* Rent Range */}
      <Collapsible open={openSections.includes("rent")}>
        <CollapsibleTrigger
          onClick={() => toggleSection("rent")}
          className="flex items-center justify-between w-full py-3 text-sm font-semibold"
        >
          Rent Range
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openSections.includes("rent") ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-4">
          <div className="space-y-4 pt-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹{filters.minRent.toLocaleString()}</span>
              <span>₹{filters.maxRent.toLocaleString()}</span>
            </div>
            <Slider
              value={[filters.minRent, filters.maxRent]}
              onValueChange={([min, max]) => onChange({ ...filters, minRent: min, maxRent: max })}
              min={0}
              max={50000}
              step={500}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="border-t border-border" />

      {/* Gender */}
      <Collapsible open={openSections.includes("gender")}>
        <CollapsibleTrigger
          onClick={() => toggleSection("gender")}
          className="flex items-center justify-between w-full py-3 text-sm font-semibold"
        >
          Gender
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openSections.includes("gender") ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-4">
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { id: "boys", label: "Boys" },
              { id: "girls", label: "Girls" },
              { id: "coliving", label: "Co-living" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => handleGenderChange(option.id)}
                className={`filter-chip ${filters.gender === option.id ? "active" : ""}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="border-t border-border" />

      {/* Food Preference */}
      <Collapsible open={openSections.includes("food")}>
        <CollapsibleTrigger
          onClick={() => toggleSection("food")}
          className="flex items-center justify-between w-full py-3 text-sm font-semibold"
        >
          Food Preference
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openSections.includes("food") ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-4">
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { id: "veg", label: "Veg" },
              { id: "nonveg", label: "Non-veg" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => handleFoodChange(option.id)}
                className={`filter-chip ${filters.food === option.id ? "active" : ""}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="border-t border-border" />

      {/* Amenities */}
      <Collapsible open={openSections.includes("amenities")}>
        <CollapsibleTrigger
          onClick={() => toggleSection("amenities")}
          className="flex items-center justify-between w-full py-3 text-sm font-semibold"
        >
          Amenities
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openSections.includes("amenities") ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-4">
          <div className="space-y-3 pt-2">
            {amenitiesList.map((amenity) => (
              <div key={amenity.id} className="flex items-center gap-3">
                <Checkbox
                  id={amenity.id}
                  checked={filters.amenities.includes(amenity.id)}
                  onCheckedChange={() => handleAmenityToggle(amenity.id)}
                />
                <Label htmlFor={amenity.id} className="text-sm cursor-pointer">
                  {amenity.label}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

const FilterPanel = ({ filters, onChange, resultCount }: FilterPanelProps) => {
  const activeFilterCount =
    (filters.gender !== "all" ? 1 : 0) +
    (filters.food !== "all" ? 1 : 0) +
    filters.amenities.length;

  const clearFilters = () => {
    onChange({
      gender: "all",
      food: "all",
      minRent: 0,
      maxRent: 50000,
      amenities: [],
    });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="bg-card rounded-xl p-5 shadow-card sticky top-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Filters</h2>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-8">
                Clear all
              </Button>
            )}
          </div>
          <FilterContent filters={filters} onChange={onChange} />
        </div>
      </aside>

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 flex gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              className="flex-1 h-12 shadow-elevated gap-2 bg-card"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
            <SheetHeader className="pb-4 border-b border-border">
              <div className="flex items-center justify-between">
                <SheetTitle>Filters</SheetTitle>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                )}
              </div>
            </SheetHeader>
            <div className="py-4 overflow-y-auto h-[calc(100%-8rem)]">
              <FilterContent filters={filters} onChange={onChange} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border safe-bottom">
              <Button className="w-full h-12" onClick={() => {}}>
                Show {resultCount} results
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default FilterPanel;
