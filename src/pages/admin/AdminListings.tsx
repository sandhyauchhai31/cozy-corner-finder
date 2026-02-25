import { useState } from "react";
import { mockPGs } from "@/data/mockPGs";
import { PG } from "@/types/pg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, Pencil, Trash2, Search, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [current, setCurrent] = useState<Partial<PG>>(emptyPG);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  const filtered = listings.filter(
    (pg) =>
      pg.name.toLowerCase().includes(search.toLowerCase()) ||
      pg.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (pg: PG) => {
    setCurrent({ ...pg });
    setIsNew(false);
    setEditOpen(true);
  };

  const handleNew = () => {
    setCurrent({ ...emptyPG, id: String(Date.now()) });
    setIsNew(true);
    setEditOpen(true);
  };

  const handleSave = () => {
    if (!current.name || !current.address) {
      toast({ title: "Name and address are required", variant: "destructive" });
      return;
    }
    if (isNew) {
      setListings((prev) => [...prev, current as PG]);
      toast({ title: "PG listing created" });
    } else {
      setListings((prev) => prev.map((p) => (p.id === current.id ? (current as PG) : p)));
      toast({ title: "PG listing updated" });
    }
    setEditOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setListings((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
    toast({ title: "PG listing deleted" });
  };

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

      {/* Edit / Add Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNew ? "Add New PG" : "Edit PG"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Name</Label>
              <Input value={current.name || ""} onChange={(e) => setCurrent({ ...current, name: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label>Address</Label>
              <Input value={current.address || ""} onChange={(e) => setCurrent({ ...current, address: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Base Rent (₹)</Label>
                <Input type="number" value={current.rent || 0} onChange={(e) => setCurrent({ ...current, rent: Number(e.target.value) })} />
              </div>
              <div className="grid gap-1.5">
                <Label>Deposit (₹)</Label>
                <Input type="number" value={current.deposit || 0} onChange={(e) => setCurrent({ ...current, deposit: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Gender</Label>
                <Select value={current.gender || "boys"} onValueChange={(v) => setCurrent({ ...current, gender: v as PG["gender"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boys">Boys</SelectItem>
                    <SelectItem value="girls">Girls</SelectItem>
                    <SelectItem value="coliving">Co-living</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Food</Label>
                <Select value={current.food || "veg"} onValueChange={(v) => setCurrent({ ...current, food: v as PG["food"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg">Veg</SelectItem>
                    <SelectItem value="nonveg">Non-Veg</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Description</Label>
              <Textarea value={current.description || ""} onChange={(e) => setCurrent({ ...current, description: e.target.value })} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{isNew ? "Create" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
