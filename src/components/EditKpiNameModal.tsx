import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { KpiTableData } from "@/types/kpi";

interface EditKpiNameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpi: KpiTableData | null;
  onSave: (updates: { name: string }) => void;
}

export function EditKpiNameModal({ 
  open, 
  onOpenChange, 
  kpi,
  onSave 
}: EditKpiNameModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (kpi) {
      setName(kpi.name);
    }
  }, [kpi]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ name: name.trim() });
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setName(kpi?.name || "");
    onOpenChange(false);
  };

  if (!kpi) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit KPI Name</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kpi-name">KPI Name</Label>
            <Input
              id="kpi-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter KPI name"
              autoFocus
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || name.trim() === kpi.name}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}