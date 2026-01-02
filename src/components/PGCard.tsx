import { Link } from "react-router-dom";
import { MapPin, Star, Wifi, Wind, Car, Zap, BadgeCheck, Utensils } from "lucide-react";
import { PG } from "@/types/pg";
import { Badge } from "@/components/ui/badge";

interface PGCardProps {
  pg: PG;
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3 h-3" />,
  ac: <Wind className="w-3 h-3" />,
  parking: <Car className="w-3 h-3" />,
  power_backup: <Zap className="w-3 h-3" />,
};

const PGCard = ({ pg }: PGCardProps) => {
  return (
    <Link to={`/pg/${pg.id}`} className="block">
      <article className="card-interactive overflow-hidden group">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={pg.images[0]}
            alt={pg.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 rating-badge">
            <Star className="w-3 h-3 fill-current" />
            <span>{pg.rating}</span>
          </div>
          {/* Verified Badge */}
          {pg.verified && (
            <div className="absolute top-3 left-3 tag-badge tag-verified">
              <BadgeCheck className="w-3 h-3" />
              <span>Verified</span>
            </div>
          )}
          {/* Gender Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge 
              variant="secondary" 
              className="capitalize bg-card/90 backdrop-blur-sm text-foreground"
            >
              {pg.gender === "coliving" ? "Co-living" : pg.gender}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title & Location */}
          <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
            {pg.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{pg.address}</span>
            <span className="text-xs">• {pg.distance} km</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-xl font-bold text-foreground">
              ₹{pg.rent.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {pg.food !== "both" && (
              <span className="tag-badge tag-amenity">
                <Utensils className="w-3 h-3" />
                {pg.food === "veg" ? "Veg" : "Non-veg"}
              </span>
            )}
            {pg.amenities.slice(0, 3).map((amenity) => (
              <span key={amenity} className="tag-badge tag-amenity capitalize">
                {amenityIcons[amenity]}
                {amenity.replace("_", " ")}
              </span>
            ))}
            {pg.amenities.length > 3 && (
              <span className="tag-badge tag-amenity">
                +{pg.amenities.length - 3}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PGCard;
