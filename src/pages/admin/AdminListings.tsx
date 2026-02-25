import { useState } from "react";
import { mockPGs } from "@/data/mockPGs";
import { PG } from "@/types/pg";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Search, ShieldCheck, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PGListingForm from "@/components/admin/PGListingForm";

const emptyPG: Partial<PG> = {
  name: "",
  address: "",
  rent: 0,
  deposit: 0,
  gender: "boys",
  food: "veg",
  description: "",
  amenities: [],
  verified: false,
  rooms: [],
  images: [],
  rules: [],
  rating: 0,
  reviewCount: 0,
  latitude: 0,
  longitude: 0,
  distance: 0,
  ownerPhone: "",
  ownerWhatsApp: "",
  roomSharing: 2,
  bathroomType: "shared" as const,
};

const AdminListings = () => {
  const [listings, setListings] = useState<PG[]>(mockPGs);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"list" | "new" | "edit">("list");
  const [current, setCurrent] = useState<Partial<PG>>(emptyPG);
  const { toast } = useToast();

  const filtered = listings.filter(
    (pg) =>
      pg.name.toLowerCase().includes(search.toLowerCase()) ||
      pg.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (pg: PG) => {
    setCurrent({ ...pg });
    setFormMode("edit");
  };

  const handleNew = () => {
    setCurrent({ ...emptyPG, id: String(Date.now()) });
    setFormMode("new");
  };

  const handleSave = (data: PG) => {
    if (!data.name || !data.address) {
      toast({ title: "Name and address are required", variant: "destructive" });
      return;
    }
    if (formMode === "new") {
      setListings((prev) => [...prev, data]);
      toast({ title: "PG listing created" });
    } else {
      setListings((prev) => prev.map((p) => (p.id === data.id ? data : p)));
      toast({ title: "PG listing updated" });
    }
    setFormMode("list");
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setListings((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
    toast({ title: "PG listing deleted" });
  };

  // ── Full-page form view ──
  if (formMode !== "list") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setFormMode("list")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h2 className="text-2xl font-bold text-foreground">
            {formMode === "new" ? "Add New PG" : "Edit PG"}
          </h2>
        </div>
        <PGListingForm
          initialData={current}
          isNew={formMode === "new"}
          onSave={handleSave}
          onCancel={() => setFormMode("list")}
        />
      </div>
    );
  }

  // ── Table listing view ──
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-foreground">PG Listings</h2>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-1" /> Add PG
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Rent</TableHead>
                <TableHead className="hidden sm:table-cell">Rooms</TableHead>
                <TableHead className="hidden sm:table-cell">Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((pg) => (
                <TableRow key={pg.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {pg.name}
                      {pg.verified && <ShieldCheck className="h-3.5 w-3.5 text-success" />}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {pg.address}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {pg.gender}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">₹{pg.rent.toLocaleString()}</TableCell>
                  <TableCell className="hidden sm:table-cell">{pg.rooms.length}</TableCell>
                  <TableCell className="hidden sm:table-cell">⭐ {pg.rating}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(pg)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(pg.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No listings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this PG listing?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminListings;
