import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

interface MockUser {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  joined: string;
  bookings: number;
  saved: number;
  status: "active" | "inactive";
}

const mockUsers: MockUser[] = [
  { id: "u1", full_name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 98765 43210", joined: "2025-11-15", bookings: 3, saved: 5, status: "active" },
  { id: "u2", full_name: "Priya Patel", email: "priya@example.com", phone: "+91 87654 32109", joined: "2025-12-02", bookings: 1, saved: 8, status: "active" },
  { id: "u3", full_name: "Amit Kumar", email: "amit@example.com", phone: "+91 76543 21098", joined: "2026-01-10", bookings: 2, saved: 3, status: "active" },
  { id: "u4", full_name: "Sneha Reddy", email: "sneha@example.com", phone: "+91 65432 10987", joined: "2026-01-22", bookings: 0, saved: 12, status: "active" },
  { id: "u5", full_name: "Vikram Singh", email: "vikram@example.com", phone: "+91 54321 09876", joined: "2025-10-05", bookings: 5, saved: 2, status: "inactive" },
  { id: "u6", full_name: "Ananya Gupta", email: "ananya@example.com", phone: "+91 43210 98765", joined: "2026-02-01", bookings: 1, saved: 6, status: "active" },
  { id: "u7", full_name: "Karan Mehta", email: "karan@example.com", phone: "+91 32109 87654", joined: "2025-12-18", bookings: 0, saved: 0, status: "inactive" },
];

const AdminUsers = () => {
  const [search, setSearch] = useState("");

  const filtered = mockUsers.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Users</h2>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden sm:table-cell">Joined</TableHead>
                <TableHead className="text-center">Bookings</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Saved</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {u.full_name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{u.full_name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{u.phone}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{u.joined}</TableCell>
                  <TableCell className="text-center">{u.bookings}</TableCell>
                  <TableCell className="text-center hidden sm:table-cell">{u.saved}</TableCell>
                  <TableCell>
                    <Badge variant={u.status === "active" ? "default" : "secondary"} className="text-xs">
                      {u.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found.
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

export default AdminUsers;
