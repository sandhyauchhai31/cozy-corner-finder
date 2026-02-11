import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Booking {
  id: string;
  user_id: string;
  pg_name: string;
  pg_location: string | null;
  pg_price: number | null;
  status: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/30",
  confirmed: "bg-success/10 text-success border-success/30",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

// Mock bookings for demo (since RLS prevents admin read of all rows)
const mockBookings: Booking[] = [
  { id: "b1", user_id: "u1", pg_name: "Sunshine Boys PG", pg_location: "Koramangala", pg_price: 8500, status: "confirmed", check_in_date: "2026-02-15", check_out_date: "2026-03-15", created_at: "2026-02-01T10:00:00Z" },
  { id: "b2", user_id: "u2", pg_name: "Green Valley Girls Hostel", pg_location: "HSR Layout", pg_price: 12000, status: "pending", check_in_date: "2026-02-20", check_out_date: null, created_at: "2026-02-05T14:30:00Z" },
  { id: "b3", user_id: "u3", pg_name: "Urban Co-Living Space", pg_location: "Indiranagar", pg_price: 15000, status: "pending", check_in_date: "2026-03-01", check_out_date: null, created_at: "2026-02-08T09:15:00Z" },
  { id: "b4", user_id: "u4", pg_name: "Budget Boys Stay", pg_location: "BTM Layout", pg_price: 5000, status: "cancelled", check_in_date: "2026-02-10", check_out_date: "2026-03-10", created_at: "2026-01-28T16:45:00Z" },
  { id: "b5", user_id: "u5", pg_name: "Elite Co-Living Hub", pg_location: "Whitefield", pg_price: 18000, status: "confirmed", check_in_date: "2026-02-12", check_out_date: "2026-05-12", created_at: "2026-02-02T11:20:00Z" },
  { id: "b6", user_id: "u6", pg_name: "Lakshmi Ladies PG", pg_location: "Marathahalli", pg_price: 9500, status: "pending", check_in_date: "2026-02-25", check_out_date: null, created_at: "2026-02-10T08:00:00Z" },
];

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const filtered = bookings.filter((b) => {
    const matchesSearch = b.pg_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: string, status: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    toast({ title: `Booking ${status}` });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Bookings</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by PG name…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PG Name</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="text-right">Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Check-in</TableHead>
                <TableHead className="hidden lg:table-cell">Booked On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.pg_name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{b.pg_location}</TableCell>
                  <TableCell className="text-right">₹{b.pg_price?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[b.status || "pending"]}>
                      {b.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">
                    {b.check_in_date ? format(new Date(b.check_in_date), "dd MMM yyyy") : "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {format(new Date(b.created_at), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    {b.status === "pending" && (
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "confirmed")}>
                          Approve
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => updateStatus(b.id, "cancelled")}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;
