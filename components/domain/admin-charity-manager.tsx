"use client";

import { useState } from "react";
import { addCharity, updateCharity, deleteCharity } from "@/app/actions/admin-charity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PencilIcon, Trash2Icon, StarIcon, PlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Charity = { id: string; name: string; description: string; image_url: string | null; featured: boolean };

export function AdminCharityManager({ charities, username }: { charities: Charity[]; username: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setEditingId(null);
    setName("");
    setDescription("");
    setImageUrl("");
    setFeatured(false);
    setError(null);
  }

  function openCreate() {
    resetForm();
    setIsOpen(true);
  }

  function handleEdit(c: Charity) {
    setEditingId(c.id);
    setName(c.name);
    setDescription(c.description);
    setImageUrl(c.image_url || "");
    setFeatured(c.featured);
    setError(null);
    setIsOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { name, description, image_url: imageUrl || undefined, featured };

    try {
      let res;
      if (editingId) {
        res = await updateCharity(editingId, payload, username);
      } else {
        res = await addCharity(payload, username);
      }

      if (res?.error) throw new Error(res.error);
      setIsOpen(false);
      resetForm();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this charity?")) return;
    setLoading(true);
    try {
      const res = await deleteCharity(id, username);
      if (res?.error) setError(res.error);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
    setLoading(false);
  }

  async function toggleFeatured(c: Charity) {
    setLoading(true);
    try {
      await updateCharity(c.id, { name: c.name, description: c.description, featured: !c.featured }, username);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold tracking-tight">All Charities ({charities.length})</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" onClick={openCreate}>
            <PlusIcon className="h-4 w-4 mr-2" /> Add Charity
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Charity" : "Add New Charity"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input id="imageUrl" type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="featured" checked={featured} onChange={e => setFeatured(e.target.checked)} className="h-4 w-4" />
                <Label htmlFor="featured">Featured (Shows first on public pages)</Label>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              
              <div className="flex gap-2 mt-4">
                <Button type="submit" disabled={loading}>
                  {editingId ? "Save Changes" : "Add Charity"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {charities.map(c => (
          <Card key={c.id} className="flex flex-col overflow-hidden">
            {c.image_url ? (
              <div className="w-full h-40 bg-muted relative">
                <img src={c.image_url} alt={c.name} className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className="w-full h-2 bg-muted" />
            )}
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg leading-tight">{c.name}</CardTitle>
                {c.featured && <Badge variant="secondary" className="shrink-0"><StarIcon className="h-3 w-3 mr-1 fill-current" /> Featured</Badge>}
              </div>
            </CardHeader>
            <CardContent className="pb-4 flex-1">
              <p className="text-sm text-muted-foreground line-clamp-3">{c.description}</p>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2 border-t p-4 mt-auto">
              <Button variant="outline" size="sm" onClick={() => handleEdit(c)} className="flex-1">
                <PencilIcon className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => toggleFeatured(c)} className="flex-1">
                <StarIcon className={`h-4 w-4 mr-2 ${c.featured ? 'fill-current' : ''}`} /> {c.featured ? "Unfeature" : "Feature"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(c.id)} className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
        {charities.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No charities found. Add one above.</p>}
      </div>
    </div>
  );
}
