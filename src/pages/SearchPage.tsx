import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import PGCard from "@/components/PGCard";
import PGCardSkeleton from "@/components/PGCardSkeleton";
import { filterPGs } from "@/data/mockPGs";
import { PG } from "@/types/pg";
import { Search, MapPin } from "lucide-react";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<PG[]>([]);
  
  const [filters, setFilters] = useState({
    gender: searchParams.get("gender") || "all",
    food: "all",
    minRent: parseInt(searchParams.get("minRent") || "0"),
    maxRent: parseInt(searchParams.get("maxRent") || "50000"),
    amenities: [] as string[],
  });

  const location = searchParams.get("location") || "";

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      const filtered = filterPGs({
        gender: filters.gender,
        food: filters.food,
        minRent: filters.minRent,
        maxRent: filters.maxRent,
        amenities: filters.amenities,
      });
      setResults(filtered);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Search Bar */}
      <div className="bg-card border-b border-border py-3">
        <div className="container">
          <SearchBar
            variant="compact"
            initialLocation={location}
            initialGender={filters.gender}
            initialBudget={[filters.minRent, filters.maxRent]}
          />
        </div>
      </div>

      <main className="container py-6 pb-24 lg:pb-6">
        {/* Location Header */}
        {location && (
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Showing PGs near <span className="font-medium text-foreground">{location}</span>
            </span>
          </div>
        )}

        <div className="flex gap-6">
          {/* Filters */}
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            resultCount={results.length}
          />

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold text-foreground">
                {isLoading ? (
                  "Searching..."
                ) : (
                  <>
                    {results.length} PG{results.length !== 1 ? "s" : ""} found
                  </>
                )}
              </h1>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <PGCardSkeleton key={i} />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((pg) => (
                  <PGCard key={pg.id} pg={pg} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  No PGs found
                </h2>
                <p className="text-muted-foreground max-w-sm">
                  Try adjusting your filters or search in a different location
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
