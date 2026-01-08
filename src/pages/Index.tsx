import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import SearchBar from "@/components/SearchBar";
import PGCard from "@/components/PGCard";
import { mockPGs } from "@/data/mockPGs";
import { Building2, Shield, Clock, Star } from "lucide-react";

const banners = [
  {
    title: "Find Verified PGs Near You",
    subtitle: "Safe, affordable and verified paying guest accommodations",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=600&fit=crop",
  },
  {
    title: "Boys | Girls | Co-living",
    subtitle: "Choose from 1000+ options across the city",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=600&fit=crop",
  },
  {
    title: "Zero Brokerage",
    subtitle: "Book directly with owners and save money",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=600&fit=crop",
  },
];

const features = [
  {
    icon: Shield,
    title: "Verified Listings",
    description: "All PGs are personally verified by our team",
  },
  {
    icon: Building2,
    title: "1000+ Options",
    description: "Wide range of PGs across the city",
  },
  {
    icon: Clock,
    title: "Instant Booking",
    description: "Book your PG in minutes",
  },
  {
    icon: Star,
    title: "Genuine Reviews",
    description: "Real reviews from actual residents",
  },
];

const Index = () => {
  const featuredPGs = mockPGs.filter((pg) => pg.verified).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="container pt-4 pb-6 md:pt-6 md:pb-10">
          <HeroBanner banners={banners} />
        </section>

        {/* Search Section */}
        <section className="container pb-10 md:pb-16 -mt-8 md:-mt-12 relative z-10">
          <SearchBar variant="hero" />
        </section>

        {/* Features */}
        <section className="container pb-12 md:pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card rounded-xl p-4 md:p-6 text-center shadow-card hover:shadow-elevated transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Featured PGs */}
        <section className="container pb-16 md:pb-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Featured PGs
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Top-rated and verified accommodations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredPGs.map((pg) => (
              <PGCard key={pg.id} pg={pg} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-12 md:py-16">
          <div className="container text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Own a PG? List it for free!
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
              Reach thousands of potential tenants and fill your vacancies faster.
            </p>
            <a
              href="/list-your-pg"
              className="inline-flex items-center justify-center h-12 px-8 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-colors"
            >
              List Your PG Now
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">Find a PG</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Find a PG. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
