import { Building2, CalendarCheck, Users, TrendingUp, IndianRupee, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPGs } from "@/data/mockPGs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const stats = [
  {
    label: "Total PGs",
    value: mockPGs.length,
    icon: Building2,
    change: "+2 this month",
  },
  {
    label: "Total Rooms",
    value: mockPGs.reduce((sum, pg) => sum + pg.rooms.length, 0),
    icon: CalendarCheck,
    change: "Across all properties",
  },
  {
    label: "Avg. Rating",
    value: (mockPGs.reduce((sum, pg) => sum + pg.rating, 0) / mockPGs.length).toFixed(1),
    icon: Star,
    change: `${mockPGs.filter((p) => p.rating >= 4.5).length} with 4.5+`,
  },
  {
    label: "Active Users",
    value: 342,
    icon: Users,
    change: "+18% this week",
  },
  {
    label: "Bookings",
    value: 87,
    icon: TrendingUp,
    change: "12 pending",
  },
  {
    label: "Revenue",
    value: "₹4.2L",
    icon: IndianRupee,
    change: "+22% vs last month",
  },
];

const bookingData = [
  { name: "Mon", bookings: 12 },
  { name: "Tue", bookings: 19 },
  { name: "Wed", bookings: 8 },
  { name: "Thu", bookings: 15 },
  { name: "Fri", bookings: 22 },
  { name: "Sat", bookings: 28 },
  { name: "Sun", bookings: 18 },
];

const genderData = [
  { name: "Boys", value: mockPGs.filter((p) => p.gender === "boys").length },
  { name: "Girls", value: mockPGs.filter((p) => p.gender === "girls").length },
  { name: "Co-living", value: mockPGs.filter((p) => p.gender === "coliving").length },
];
const PIE_COLORS = ["hsl(199, 89%, 48%)", "hsl(330, 80%, 55%)", "hsl(142, 76%, 36%)"];

const AdminDashboard = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>

    {/* Stat cards */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {/* Bookings chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bookingData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="bookings" fill="hsl(15, 90%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gender split pie */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">PG Type Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {genderData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AdminDashboard;
