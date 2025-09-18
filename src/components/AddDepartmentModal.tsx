import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AddDepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDepartment: (department: { name: string; description?: string; icon: string }) => void;
}


export function AddDepartmentModal({ open, onOpenChange, onAddDepartment }: AddDepartmentModalProps) {
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🏢");
  const { toast } = useToast();

  // Available emoji icons for departments
  const emojiIcons = [
    "🏢", "⚙️", "📈", "💰", "🛡️", "👥", "📊", "🔧", "💼", "🎯", "📋", "🔍"
  ];

  const handleSave = () => {
    if (!departmentName.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }
    
    onAddDepartment({
      name: departmentName.trim(),
      description: description.trim() || undefined,
      icon: selectedIcon,
    });

    toast({
      title: "Success",
      description: "Department added successfully",
    });

    setDepartmentName("");
    setDescription("");
    setSelectedIcon("🏢");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setDepartmentName("");
    setDescription("");
    setSelectedIcon("🏢");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="department-name">Department Name</Label>
            <Input
              id="department-name"
              placeholder="Enter department name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department-description">Description (Optional)</Label>
            <Input
              id="department-description"
              placeholder="Enter department description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department-icon">Icon</Label>
            <div className="grid grid-cols-6 gap-2">
              {emojiIcons.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedIcon(emoji)}
                  className={`p-2 text-xl border rounded hover:bg-muted transition-colors ${
                    selectedIcon === emoji ? 'border-primary bg-primary/10' : 'border-border'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Department
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}