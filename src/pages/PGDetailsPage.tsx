import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle, MapPin, Star, Shield, Wifi, Wind, Car, Zap, BadgeCheck, Utensils, Clock, Info, Users, Building } from "lucide-react";
import Header from "@/components/Header";
import ImageGallery from "@/components/ImageGallery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPGById, mockPGs } from "@/data/mockPGs";
import PGCard from "@/components/PGCard";
const amenityDetails: Record<string, { icon: React.ReactNode; label: string }> = {
  wifi: { icon: <Wifi className="w-5 h-5" />, label: "WiFi" },
  ac: { icon: <Wind className="w-5 h-5" />, label: "AC" },
  laundry: { icon: <Building className="w-5 h-5" />, label: "Laundry" },
  parking: { icon: <Car className="w-5 h-5" />, label: "Parking" },
  power_backup: { icon: <Zap className="w-5 h-5" />, label: "Power Backup" },
  gym: { icon: <Users className="w-5 h-5" />, label: "Gym" },
  pool: { icon: <Building className="w-5 h-5" />, label: "Pool" },
};

const PGDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const pg = getPGById(id || "");

  if (!pg) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">PG Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The PG you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCall = () => {
    window.location.href = `tel:${pg.ownerPhone}`;
  };

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in ${pg.name}. Is it available?`;
    window.open(
      `https://wa.me/${pg.ownerWhatsApp.replace("+", "")}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Header />

      <main className="container py-4 md:py-6">
        {/* Back Button */}
        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to search
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side - Price & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <ImageGallery images={pg.images} name={pg.name} />

            {/* Header Info */}
            <div className="bg-card rounded-xl p-5 shadow-card">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {pg.verified && (
                      <Badge className="bg-success/10 text-success border-0 gap-1">
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                      </Badge>
                    )}
                    <Badge variant="secondary" className="capitalize">
                      {pg.gender === "coliving" ? "Co-living" : pg.gender}
                    </Badge>
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">
                    {pg.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{pg.address}</span>
                  </div>
                </div>
                <div className="rating-badge text-base">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{pg.rating}</span>
                </div>
              </div>

              <p className="text-muted-foreground">{pg.description}</p>
            </div>

            {/* Pricing */}
            <div className="bg-card rounded-xl p-5 shadow-card">
              <h2 className="font-semibold text-foreground mb-4">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-accent rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Monthly Rent</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{pg.rent.toLocaleString()}
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Security Deposit</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{pg.deposit.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-card rounded-xl p-5 shadow-card">
              <h2 className="font-semibold text-foreground mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {pg.amenities.map((amenity) => {
                  const detail = amenityDetails[amenity];
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                    >
                      <div className="text-primary">{detail?.icon}</div>
                      <span className="text-sm font-medium">
                        {detail?.label || amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Food */}
            <div className="bg-card rounded-xl p-5 shadow-card">
              <h2 className="font-semibold text-foreground mb-4">Food</h2>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Utensils className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium capitalize">
                  {pg.food === "veg"
                    ? "Vegetarian food available"
                    : pg.food === "nonveg"
                    ? "Non-vegetarian food available"
                    : "Both veg and non-veg available"}
                </span>
              </div>
            </div>

            {/* House Rules */}
            <div className="bg-card rounded-xl p-5 shadow-card">
              <h2 className="font-semibold text-foreground mb-4">House Rules</h2>
              <ul className="space-y-2">
                {pg.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map Placeholder */}
            <div className="bg-card rounded-xl p-5 shadow-card">
              <h2 className="font-semibold text-foreground mb-4">Location</h2>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Map preview would be shown here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pg.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Card - Desktop only, below location */}
            <div className="hidden lg:block bg-card rounded-xl p-5 shadow-card">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                <p className="text-3xl font-bold text-foreground">
                  ₹{pg.rent.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <Button onClick={handleCall} size="lg" className="w-full gap-2">
                  <Phone className="w-4 h-4" />
                  Call Owner
                </Button>
                <Button
                  onClick={handleWhatsApp}
                  variant="outline"
                  size="lg"
                  className="w-full gap-2 border-success text-success hover:bg-success hover:text-success-foreground"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Contact the owner directly for bookings
              </p>
            </div>
          </div>

          {/* Right Sidebar - Similar PGs only */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-card rounded-xl p-5 shadow-card">
              <h2 className="font-semibold text-foreground mb-4">Similar PGs</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                {mockPGs
                  .filter((p) => p.id !== pg.id)
                  .map((featuredPg) => (
                    <PGCard key={featuredPg.id} pg={featuredPg} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden sticky-bottom-bar safe-bottom">
        <div className="flex gap-3">
          <Button
            onClick={handleCall}
            size="lg"
            className="flex-1 gap-2"
          >
            <Phone className="w-4 h-4" />
            Call
          </Button>
          <Button
            onClick={handleWhatsApp}
            variant="outline"
            size="lg"
            className="flex-1 gap-2 border-success text-success"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PGDetailsPage;
