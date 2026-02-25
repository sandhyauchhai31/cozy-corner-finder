import { useState } from "react";
import { mockPGs } from "@/data/mockPGs";
import { useDBPGListings, mapPGToDb } from "@/hooks/usePGListings";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PG } from "@/types/pg";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Search, ShieldCheck, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PGListingForm from "@/components/admin/PGListingForm";

const emptyPG: Partial<PG> = {
  name: "", address: "", rent: 0, deposit: 0, gender: "boys", food: "veg",
  description: "", amenities: [], verified: false, rooms: [], images: [], rules: [],
  rating: 0, reviewCount: 0, latitude: 0, longitude: 0, distance: 0,
  ownerPhone: "", ownerWhatsApp: "", roomSharing: 2, bathroomType: "shared" as const,
};

const AdminListings = () => {
  const { data: dbListings = [], isLoading } = useDBPGListings();
  const queryClient = useQueryClient();
  const allListings = [...mockPGs, ...dbListings];

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"list" | "new" | "edit">("list");
  const [current, setCurrent] = useState<Partial<PG>>(emptyPG);
  const { toast } = useToast();

  const filtered = allListings.filter(
    (pg) =>
      pg.name.toLowerCase().includes(search.toLowerCase()) ||
      pg.address.toLowerCase().includes(search.toLowerCase())
  );

  const isMockPG = (id: string) => mockPGs.some((m) => m.id === id);

  const handleEdit = (pg: PG) => {
    if (isMockPG(pg.id)) {
      toast({ title: "Mock PGs cannot be edited", variant: "destructive" });
      return;
    }
    setCurrent({ ...pg });
    setFormMode("edit");
  };

  const handleNew = () => {
    setCurrent({ ...emptyPG });
    setFormMode("new");
  };

  const handleSave = async (data: PG) => {
    if (!data.name || !data.address) {
      toast({ title: "Name and address are required", variant: "destructive" });
      return;
    }

    const dbData = mapPGToDb(data);

    if (formMode === "new") {
      const { error } = await supabase.from("pg_listings").insert(dbData as any);
      if (error) {
        toast({ title: "Failed to create listing", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "PG listing created" });
    } else {
      const { error } = await supabase.from("pg_listings").update(dbData as any).eq("id", data.id);
      if (error) {
        toast({ title: "Failed to update listing", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "PG listing updated" });
    }

    queryClient.invalidateQueries({ queryKey: ["db-pg-listings"] });
    queryClient.invalidateQueries({ queryKey: ["pg-listings"] });
    setFormMode("list");
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    if (isMockPG(deleteId)) {
      toast({ title: "Mock PGs cannot be deleted", variant: "destructive" });
      setDeleteId(null);
      return;
    }
    const { error } = await supabase.from("pg_listings").delete().eq("id", deleteId);
    if (error) {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "PG listing deleted" });
      queryClient.invalidateQueries({ queryKey: ["db-pg-listings"] });
      queryClient.invalidateQueries({ queryKey: ["pg-listings"] });
    }
    setDeleteId(null);
  };

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
        <Input placeholder="Search by name or location…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
                <TableHead className="hidden sm:table-cell">Source</TableHead>
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
                  <TableCell className="hidden md:table-cell text-muted-foreground">{pg.address}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize text-xs">{pg.gender}</Badge>
                  </TableCell>
                  <TableCell className="text-right">₹{pg.rent.toLocaleString()}</TableCell>
                  <TableCell className="hidden sm:table-cell">{pg.rooms?.length || 0}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={isMockPG(pg.id) ? "outline" : "default"} className="text-xs">
                      {isMockPG(pg.id) ? "Mock" : "Database"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(pg)} disabled={isMockPG(pg.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(pg.id)} disabled={isMockPG(pg.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {isLoading ? "Loading…" : "No listings found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
