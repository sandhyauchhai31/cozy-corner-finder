import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Eye,
  Phone,
  Users,
  BadgeCheck,
  Clock,
  Edit,
  Upload,
  Save,
  Wifi,
  Wind,
  Car,
  Zap,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const Dashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [pgDetails, setPgDetails] = useState({
    name: "Sunshine Boys PG",
    rent: 8500,
    deposit: 17000,
    food: "veg",
    rules: "No smoking, Entry before 10 PM",
    available: true,
  });

  const [amenities, setAmenities] = useState({
    wifi: true,
    ac: true,
    laundry: true,
    parking: false,
    power_backup: true,
  });

  const stats = [
    { label: "Total Views", value: "1,247", icon: Eye, change: "+12%" },
    { label: "Leads", value: "38", icon: Users, change: "+5%" },
    { label: "Calls", value: "24", icon: Phone, change: "+8%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6 md:py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-foreground">
                {pgDetails.name}
              </h1>
              <Badge className="bg-success/10 text-success border-0 gap-1">
                <BadgeCheck className="w-3 h-3" />
                Verified
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last updated 2 days ago
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Availability</span>
              <Switch
                checked={pgDetails.available}
                onCheckedChange={(checked) =>
                  setPgDetails({ ...pgDetails, available: checked })
                }
              />
            </div>
            <Link to="/pg/1">
              <Button variant="outline" size="sm" className="gap-1">
                <Eye className="w-4 h-4" />
                View Listing
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-xl p-4 md:p-5 shadow-card"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-success font-medium">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="bg-card shadow-card p-1">
            <TabsTrigger value="details">PG Details</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="bg-card rounded-xl p-5 md:p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Basic Information
                </h2>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-1"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Edit
                    </>
                  )}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">PG Name</Label>
                  <Input
                    id="name"
                    value={pgDetails.name}
                    onChange={(e) =>
                      setPgDetails({ ...pgDetails, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="rent">Monthly Rent (₹)</Label>
                  <Input
                    id="rent"
                    type="number"
                    value={pgDetails.rent}
                    onChange={(e) =>
                      setPgDetails({
                        ...pgDetails,
                        rent: parseInt(e.target.value),
                      })
                    }
                    disabled={!isEditing}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="deposit">Security Deposit (₹)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    value={pgDetails.deposit}
                    onChange={(e) =>
                      setPgDetails({
                        ...pgDetails,
                        deposit: parseInt(e.target.value),
                      })
                    }
                    disabled={!isEditing}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="food">Food Type</Label>
                  <select
                    id="food"
                    value={pgDetails.food}
                    onChange={(e) =>
                      setPgDetails({ ...pgDetails, food: e.target.value })
                    }
                    disabled={!isEditing}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="nonveg">Non-Vegetarian</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="rules">House Rules</Label>
                  <Textarea
                    id="rules"
                    value={pgDetails.rules}
                    onChange={(e) =>
                      setPgDetails({ ...pgDetails, rules: e.target.value })
                    }
                    disabled={!isEditing}
                    className="mt-1.5"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-card rounded-xl p-5 md:p-6 shadow-card">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: "wifi", label: "WiFi", icon: Wifi },
                  { id: "ac", label: "AC", icon: Wind },
                  { id: "parking", label: "Parking", icon: Car },
                  { id: "power_backup", label: "Power Backup", icon: Zap },
                ].map((amenity) => {
                  const Icon = amenity.icon;
                  return (
                    <div
                      key={amenity.id}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                    >
                      <Checkbox
                        id={amenity.id}
                        checked={amenities[amenity.id as keyof typeof amenities]}
                        onCheckedChange={(checked) =>
                          setAmenities({
                            ...amenities,
                            [amenity.id]: checked,
                          })
                        }
                        disabled={!isEditing}
                      />
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <Label
                        htmlFor={amenity.id}
                        className="text-sm cursor-pointer"
                      >
                        {amenity.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="photos">
            <div className="bg-card rounded-xl p-5 md:p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Photos
                </h2>
                <Button size="sm" className="gap-1">
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      src={`https://images.unsplash.com/photo-152270832359${i}-d24dbb6b0267?w=300&h=300&fit=crop`}
                      alt={`PG Photo ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <button className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:bg-muted transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add Photo</span>
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
