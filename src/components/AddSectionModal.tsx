import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, DollarSign, Shield, TrendingUp, Clock } from "lucide-react";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (sectionData: { id: string; name: string; icon: any }) => void;
}

const sectionIcons = {
  building2: Building2,
  dollarSign: DollarSign,
  shield: Shield,
  trendingUp: TrendingUp,
  clock: Clock,
};

export function AddSectionModal({ isOpen, onClose, onAddSection }: AddSectionModalProps) {
  const [sectionName, setSectionName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("building2");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sectionName.trim()) return;
    
    const sectionId = sectionName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    onAddSection({
      id: sectionId,
      name: sectionName.trim(),
      icon: sectionIcons[selectedIcon as keyof typeof sectionIcons]
    });
    
    // Reset form
    setSectionName("");
    setSelectedIcon("building2");
    onClose();
  };

  const handleClose = () => {
    setSectionName("");
    setSelectedIcon("building2");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Section</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sectionName">Section Name</Label>
            <Input
              id="sectionName"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="e.g. Digital Banking, Treasury Ops"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sectionIcon">Icon</Label>
            <Select value={selectedIcon} onValueChange={setSelectedIcon}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="building2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Building</span>
                  </div>
                </SelectItem>
                <SelectItem value="dollarSign">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Financial</span>
                  </div>
                </SelectItem>
                <SelectItem value="shield">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Security</span>
                  </div>
                </SelectItem>
                <SelectItem value="trendingUp">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Analytics</span>
                  </div>
                </SelectItem>
                <SelectItem value="clock">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Operations</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Section
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}