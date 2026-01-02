import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Phone, ArrowRight, MapPin, Search, CheckCircle2 } from "lucide-react";

type Step = "login" | "otp" | "search" | "claim" | "success";

const ListYourPG = () => {
  const [step, setStep] = useState<Step>("login");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPG, setSelectedPG] = useState<string | null>(null);

  const mockSearchResults = [
    {
      id: "search-1",
      name: "Green Living PG",
      address: "Sector 62, Noida",
      googleRating: 4.2,
    },
    {
      id: "search-2",
      name: "Comfort Stay PG",
      address: "Sector 63, Noida",
      googleRating: 3.9,
    },
  ];

  const handleSendOTP = () => {
    if (phone.length === 10) {
      setStep("otp");
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      setStep("search");
    }
  };

  const handleSearch = () => {
    // In real app, would search Google Places
  };

  const handleClaim = (pgId: string) => {
    setSelectedPG(pgId);
    setStep("claim");
  };

  const handleSubmitClaim = () => {
    setStep("success");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 md:py-12">
        <div className="max-w-md mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["login", "search", "claim"].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s || (step === "otp" && s === "login") || step === "success"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                {i < 2 && (
                  <div
                    className={`w-12 h-0.5 ${
                      (step === "search" && i === 0) ||
                      (step === "claim" && i <= 1) ||
                      step === "success"
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-elevated">
            {/* Step 1: Login */}
            {step === "login" && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    List Your PG
                  </h1>
                  <p className="text-muted-foreground">
                    Enter your mobile number to get started
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Mobile Number</Label>
                    <div className="flex gap-2 mt-1.5">
                      <div className="flex items-center px-3 bg-muted rounded-lg text-sm text-muted-foreground">
                        +91
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter 10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSendOTP}
                    disabled={phone.length !== 10}
                    className="w-full h-12"
                  >
                    Send OTP
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 1b: OTP Verification */}
            {step === "otp" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Verify OTP
                  </h1>
                  <p className="text-muted-foreground">
                    Enter the 6-digit code sent to +91 {phone}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="otp">OTP Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="text-center text-xl tracking-widest mt-1.5"
                    />
                  </div>

                  <Button
                    onClick={handleVerifyOTP}
                    disabled={otp.length !== 6}
                    className="w-full h-12"
                  >
                    Verify & Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setStep("login")}
                    className="w-full"
                  >
                    Change Number
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Search PG */}
            {step === "search" && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Find Your PG
                  </h1>
                  <p className="text-muted-foreground">
                    Search for your PG to claim the listing
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="search">Search by name or location</Label>
                    <div className="relative mt-1.5">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="e.g., Green Living PG, Noida"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSearch} className="w-full h-12">
                    Search
                  </Button>
                </div>

                {/* Search Results */}
                {searchQuery && (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Search Results</p>
                    {mockSearchResults.map((pg) => (
                      <div
                        key={pg.id}
                        className="p-4 bg-muted rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <h3 className="font-medium text-foreground">{pg.name}</h3>
                          <p className="text-sm text-muted-foreground">{pg.address}</p>
                          <p className="text-xs text-muted-foreground">
                            Google Rating: {pg.googleRating} ⭐
                          </p>
                        </div>
                        <Button size="sm" onClick={() => handleClaim(pg.id)}>
                          Claim
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Claim Confirmation */}
            {step === "claim" && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Claim This Listing
                  </h1>
                  <p className="text-muted-foreground">
                    Confirm that you own or manage this PG
                  </p>
                </div>

                <div className="bg-muted rounded-xl p-4">
                  <h3 className="font-medium text-foreground">
                    {mockSearchResults.find((p) => p.id === selectedPG)?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {mockSearchResults.find((p) => p.id === selectedPG)?.address}
                  </p>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleSubmitClaim} className="w-full h-12">
                    Submit Claim Request
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setStep("search")}
                    className="w-full"
                  >
                    Search Again
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Our team will verify your ownership within 24-48 hours
                </p>
              </div>
            )}

            {/* Success State */}
            {step === "success" && (
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 rounded-full bg-success/10 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Claim Submitted!
                  </h1>
                  <p className="text-muted-foreground">
                    Your claim request has been submitted. Our team will verify
                    and contact you within 24-48 hours.
                  </p>
                </div>

                <Link to="/dashboard">
                  <Button className="w-full h-12">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListYourPG;
