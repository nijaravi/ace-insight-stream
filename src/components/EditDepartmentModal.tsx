import { useState, useEffect } from "react";
import { Edit, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Department } from "@/types/kpi";

interface EditDepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onUpdateDepartment: (id: string, departmentData: { name: string; description?: string; icon: string }) => void;
}

const EMOJI_OPTIONS = [
  "💰", "🏦", "📊", "🔒", "🛡️", "⚙️", "📈", "🎯", "💼", "🏢",
  "📋", "💳", "🔧", "📱", "🌟", "🚀", "⭐", "🎪", "🎨", "🔥"
];

export function EditDepartmentModal({ 
  open, 
  onOpenChange, 
  department, 
  onUpdateDepartment 
}: EditDepartmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "💰"
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        description: department.description || "",
        icon: department.icon || "💰"
      });
    }
  }, [department]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !department) {
      return;
    }

    onUpdateDepartment(department.id, {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      icon: formData.icon
    });
    
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (department) {
      setFormData({
        name: department.name,
        description: department.description || "",
        icon: department.icon || "💰"
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Edit className="w-5 h-5" />
            Edit Department
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Department Name */}
          <div className="space-y-2">
            <Label htmlFor="dept-name" className="text-sm font-medium">Department Name</Label>
            <Input
              id="dept-name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g. Financial Services"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of the department"
              rows={2}
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Department Icon</Label>
            <div className="grid grid-cols-10 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleInputChange("icon", emoji)}
                  className={`
                    w-8 h-8 rounded-md border-2 flex items-center justify-center text-lg
                    hover:border-primary transition-colors
                    ${formData.icon === emoji 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <Edit className="w-4 h-4 mr-2" />
              Update Department
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}