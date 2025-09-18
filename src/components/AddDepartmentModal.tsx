import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, TrendingUp, DollarSign, Shield, Building2, Users, BarChart, Cog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddDepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDepartment: (department: { id: string; name: string; icon: any }) => void;
}

const iconOptions = [
  { value: "Clock", label: "Clock", icon: Clock },
  { value: "TrendingUp", label: "Trending Up", icon: TrendingUp },
  { value: "DollarSign", label: "Dollar Sign", icon: DollarSign },
  { value: "Shield", label: "Shield", icon: Shield },
  { value: "Building2", label: "Building", icon: Building2 },
  { value: "Users", label: "Users", icon: Users },
  { value: "BarChart", label: "Bar Chart", icon: BarChart },
  { value: "Cog", label: "Settings", icon: Cog },
];

export function AddDepartmentModal({ open, onOpenChange, onAddDepartment }: AddDepartmentModalProps) {
  const [departmentName, setDepartmentName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Building2");
  const { toast } = useToast();

  const handleSave = () => {
    if (!departmentName.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    const selectedIconData = iconOptions.find(icon => icon.value === selectedIcon);
    const departmentId = departmentName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    onAddDepartment({
      id: departmentId,
      name: departmentName,
      icon: selectedIconData?.icon || Building2,
    });

    toast({
      title: "Success",
      description: "Department added successfully",
    });

    setDepartmentName("");
    setSelectedIcon("Building2");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setDepartmentName("");
    setSelectedIcon("Building2");
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
            <Label htmlFor="department-icon">Icon (Optional)</Label>
            <Select value={selectedIcon} onValueChange={setSelectedIcon}>
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
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