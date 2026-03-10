import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Pencil, Plus, Trash2, Wheat } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { DailySpecial, MenuItem } from "../backend";
import { backend } from "../backendClient";

const CATEGORIES = [
  "Cakes",
  "Pastries",
  "Cupcakes",
  "Artisan Breads",
  "Cookies & Desserts",
];

type MenuForm = {
  name: string;
  category: string;
  description: string;
  price: string;
  imageUrl: string;
  isActive: boolean;
};

type SpecialForm = {
  name: string;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
};

const EMPTY_MENU_FORM: MenuForm = {
  name: "",
  category: "Cakes",
  description: "",
  price: "",
  imageUrl: "",
  isActive: true,
};

const EMPTY_SPECIAL_FORM: SpecialForm = {
  name: "",
  description: "",
  imageUrl: "",
  isAvailable: true,
};

export default function AdminPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [specials, setSpecials] = useState<DailySpecial[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [loadingSpecials, setLoadingSpecials] = useState(true);

  // Menu modal state
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [menuEditTarget, setMenuEditTarget] = useState<MenuItem | null>(null);
  const [menuForm, setMenuForm] = useState<MenuForm>(EMPTY_MENU_FORM);
  const [menuSaving, setMenuSaving] = useState(false);

  // Special modal state
  const [specialDialogOpen, setSpecialDialogOpen] = useState(false);
  const [specialEditTarget, setSpecialEditTarget] =
    useState<DailySpecial | null>(null);
  const [specialForm, setSpecialForm] =
    useState<SpecialForm>(EMPTY_SPECIAL_FORM);
  const [specialSaving, setSpecialSaving] = useState(false);

  async function loadAll() {
    const [items, dailySpecials] = await Promise.all([
      backend.getMenuItems().catch(() => [] as MenuItem[]),
      backend.getDailySpecials().catch(() => [] as DailySpecial[]),
    ]);
    setMenuItems(items);
    setSpecials(dailySpecials);
    setLoadingMenu(false);
    setLoadingSpecials(false);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: loadAll is stable
  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Menu CRUD
  function openAddMenu() {
    setMenuEditTarget(null);
    setMenuForm(EMPTY_MENU_FORM);
    setMenuDialogOpen(true);
  }

  function openEditMenu(item: MenuItem) {
    setMenuEditTarget(item);
    setMenuForm({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      isActive: item.isActive,
    });
    setMenuDialogOpen(true);
  }

  async function saveMenuItem() {
    if (!menuForm.name || !menuForm.price) {
      toast.error("Name and price are required.");
      return;
    }
    setMenuSaving(true);
    try {
      if (menuEditTarget) {
        await backend.updateMenuItem(
          menuEditTarget.id,
          menuForm.name,
          menuForm.category,
          menuForm.description,
          menuForm.price,
          menuForm.imageUrl,
          menuForm.isActive,
        );
        toast.success("Menu item updated!");
      } else {
        const id = BigInt(Date.now());
        await backend.addMenuItem(
          id,
          menuForm.name,
          menuForm.category,
          menuForm.description,
          menuForm.price,
          menuForm.imageUrl,
          menuForm.isActive,
        );
        toast.success("Menu item added!");
      }
      setMenuDialogOpen(false);
      await loadAll();
    } catch (e) {
      toast.error("Failed to save menu item.");
      console.error(e);
    } finally {
      setMenuSaving(false);
    }
  }

  async function deleteMenuItem(id: bigint) {
    try {
      await backend.removeMenuItem(id);
      toast.success("Menu item removed.");
      setMenuItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      toast.error("Failed to delete item.");
    }
  }

  // Special CRUD
  function openAddSpecial() {
    setSpecialEditTarget(null);
    setSpecialForm(EMPTY_SPECIAL_FORM);
    setSpecialDialogOpen(true);
  }

  function openEditSpecial(s: DailySpecial) {
    setSpecialEditTarget(s);
    setSpecialForm({
      name: s.name,
      description: s.description,
      imageUrl: s.imageUrl,
      isAvailable: s.isAvailable,
    });
    setSpecialDialogOpen(true);
  }

  async function saveSpecial() {
    if (!specialForm.name) {
      toast.error("Name is required.");
      return;
    }
    setSpecialSaving(true);
    try {
      if (specialEditTarget) {
        await backend.updateDailySpecial(
          specialEditTarget.id,
          specialForm.name,
          specialForm.description,
          specialForm.imageUrl,
          specialForm.isAvailable,
        );
        toast.success("Special updated!");
      } else {
        const id = BigInt(Date.now());
        await backend.addDailySpecial(
          id,
          specialForm.name,
          specialForm.description,
          specialForm.imageUrl,
          specialForm.isAvailable,
        );
        toast.success("Special added!");
      }
      setSpecialDialogOpen(false);
      await loadAll();
    } catch (e) {
      toast.error("Failed to save special.");
      console.error(e);
    } finally {
      setSpecialSaving(false);
    }
  }

  async function deleteSpecial(id: bigint) {
    try {
      await backend.removeDailySpecial(id);
      toast.success("Special removed.");
      setSpecials((prev) => prev.filter((s) => s.id !== id));
    } catch {
      toast.error("Failed to delete special.");
    }
  }

  async function toggleSpecialAvailability(s: DailySpecial) {
    try {
      await backend.updateDailySpecial(
        s.id,
        s.name,
        s.description,
        s.imageUrl,
        !s.isAvailable,
      );
      setSpecials((prev) =>
        prev.map((sp) =>
          sp.id === s.id ? { ...sp, isAvailable: !sp.isAvailable } : sp,
        ),
      );
    } catch {
      toast.error("Failed to update availability.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            <div className="flex items-center gap-2">
              <Wheat className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-xl text-foreground">
                Sweet Crumbs Bakery
              </span>
              <Badge variant="outline" className="ml-2 text-xs">
                Admin
              </Badge>
            </div>
            <div className="ml-auto">
              <a href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> View Site
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-14">
        {/* Menu Items Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Menu Items
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {menuItems.length} items total
              </p>
            </div>
            <Button
              onClick={openAddMenu}
              className="gap-2"
              data-ocid="admin.add_menu_button"
            >
              <Plus className="w-4 h-4" /> Add Item
            </Button>
          </div>

          {loadingMenu ? (
            <div
              className="flex items-center gap-2 text-muted-foreground py-8"
              data-ocid="admin.menu.loading_state"
            >
              <Loader2 className="w-5 h-5 animate-spin" /> Loading menu items...
            </div>
          ) : menuItems.length === 0 ? (
            <div
              className="text-center py-16 border-2 border-dashed border-border rounded-xl"
              data-ocid="admin.menu.empty_state"
            >
              <p className="text-muted-foreground">
                No menu items yet. Add your first item!
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/30">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Price</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item, idx) => (
                    <TableRow
                      key={item.id.toString()}
                      data-ocid={`admin.menu_item.${idx + 1}`}
                    >
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-primary font-semibold">
                        ₹{item.price}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            item.isActive
                              ? "bg-green-100 text-green-700 border-none"
                              : "bg-muted text-muted-foreground border-none"
                          }
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditMenu(item)}
                            data-ocid={`admin.menu_edit_button.${idx + 1}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteMenuItem(item.id)}
                            data-ocid={`admin.menu.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>

        {/* Daily Specials Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Daily Specials
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {specials.length} specials total
              </p>
            </div>
            <Button
              onClick={openAddSpecial}
              className="gap-2"
              data-ocid="admin.add_special_button"
            >
              <Plus className="w-4 h-4" /> Add Special
            </Button>
          </div>

          {loadingSpecials ? (
            <div
              className="flex items-center gap-2 text-muted-foreground py-8"
              data-ocid="admin.special.loading_state"
            >
              <Loader2 className="w-5 h-5 animate-spin" /> Loading specials...
            </div>
          ) : specials.length === 0 ? (
            <div
              className="text-center py-16 border-2 border-dashed border-border rounded-xl"
              data-ocid="admin.special.empty_state"
            >
              <p className="text-muted-foreground">
                No specials yet. Add today's fresh items!
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/30">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Available</TableHead>
                    <TableHead className="font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {specials.map((s, idx) => (
                    <TableRow
                      key={s.id.toString()}
                      data-ocid={`admin.special_item.${idx + 1}`}
                    >
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                        {s.description}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={s.isAvailable}
                          onCheckedChange={() => toggleSpecialAvailability(s)}
                          data-ocid={`admin.special_toggle.${idx + 1}`}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditSpecial(s)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteSpecial(s.id)}
                            data-ocid={`admin.special.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </main>

      {/* Menu Item Dialog */}
      <Dialog open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
        <DialogContent className="max-w-lg" data-ocid="admin.menu.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {menuEditTarget ? "Edit Menu Item" : "Add Menu Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Item Name *</Label>
              <Input
                value={menuForm.name}
                onChange={(e) =>
                  setMenuForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Dark Chocolate Gateau"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={menuForm.category}
                  onValueChange={(v) =>
                    setMenuForm((f) => ({ ...f, category: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Price (₹) *</Label>
                <Input
                  value={menuForm.price}
                  onChange={(e) =>
                    setMenuForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="e.g. 650"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={menuForm.description}
                onChange={(e) =>
                  setMenuForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Short description of this item..."
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input
                value={menuForm.imageUrl}
                onChange={(e) =>
                  setMenuForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="menu-active"
                checked={menuForm.isActive}
                onCheckedChange={(v) =>
                  setMenuForm((f) => ({ ...f, isActive: !!v }))
                }
              />
              <Label htmlFor="menu-active" className="cursor-pointer">
                Active (shown on public site)
              </Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setMenuDialogOpen(false)}
              data-ocid="admin.menu.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={saveMenuItem}
              disabled={menuSaving}
              data-ocid="admin.menu.save_button"
            >
              {menuSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {menuEditTarget ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Special Dialog */}
      <Dialog open={specialDialogOpen} onOpenChange={setSpecialDialogOpen}>
        <DialogContent className="max-w-lg" data-ocid="admin.special.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {specialEditTarget ? "Edit Daily Special" : "Add Daily Special"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input
                value={specialForm.name}
                onChange={(e) =>
                  setSpecialForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Almond Croissant"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={specialForm.description}
                onChange={(e) =>
                  setSpecialForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="What makes this special today?"
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input
                value={specialForm.imageUrl}
                onChange={(e) =>
                  setSpecialForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="special-available"
                checked={specialForm.isAvailable}
                onCheckedChange={(v) =>
                  setSpecialForm((f) => ({ ...f, isAvailable: !!v }))
                }
              />
              <Label htmlFor="special-available" className="cursor-pointer">
                Available today
              </Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setSpecialDialogOpen(false)}
              data-ocid="admin.special.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={saveSpecial}
              disabled={specialSaving}
              data-ocid="admin.special.save_button"
            >
              {specialSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {specialEditTarget ? "Save Changes" : "Add Special"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
