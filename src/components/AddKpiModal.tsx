import { useState, useEffect } from "react";
import { X, Plus, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface AddKpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddKpi: (kpiData: any) => void;
  departmentId: string;
  departmentName: string;
}

const EmailTagInput = ({ 
  type, 
  emails, 
  inputValue, 
  setInputValue, 
  placeholder,
  onAddTag,
  onRemoveTag
}: {
  type: 'to' | 'cc';
  emails: string[];
  inputValue: string;
  setInputValue: (value: string) => void;
  placeholder: string;
  onAddTag: (type: 'to' | 'cc', email: string) => void;
  onRemoveTag: (type: 'to' | 'cc', email: string) => void;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 mb-2">
        {emails.map((email) => (
          <Badge key={email} variant="secondary" className="text-xs">
            {email}
            <button
              type="button"
              onClick={() => onRemoveTag(type, email)}
              className="ml-1 hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            onAddTag(type, inputValue);
          }
        }}
        onBlur={() => {
          if (inputValue.trim()) {
            onAddTag(type, inputValue);
          }
        }}
        placeholder={placeholder}
        className="text-sm"
      />
      <p className="text-xs text-muted-foreground">Press Enter or comma to add email</p>
    </div>
  );
};

export function AddKpiModal({ isOpen, onClose, onAddKpi, departmentId, departmentName }: AddKpiModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    alert_table_name: "",
    default_email_to: [] as string[],
    default_email_cc: [] as string[],
    default_subject: "",
    default_body: "",
    default_footer: "",
    is_favorite: false,
    // Advanced fields
    identifier: "",
    severity_tagging: true,
  });

  const [emailToInput, setEmailToInput] = useState("");
  const [emailCCInput, setEmailCCInput] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addEmailTag = (type: 'to' | 'cc', email: string) => {
    if (email.trim() && email.includes('@')) {
      const field = type === 'to' ? 'default_email_to' : 'default_email_cc';
      const currentEmails = formData[field];
      if (!currentEmails.includes(email.trim())) {
        handleInputChange(field, [...currentEmails, email.trim()]);
      }
      if (type === 'to') setEmailToInput("");
      else setEmailCCInput("");
    }
  };

  const removeEmailTag = (type: 'to' | 'cc', email: string) => {
    const field = type === 'to' ? 'default_email_to' : 'default_email_cc';
    const currentEmails = formData[field];
    handleInputChange(field, currentEmails.filter(e => e !== email));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return; // Basic validation
    }

    // Generate identifier if not provided
    const identifier = formData.identifier || formData.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    
    const newKpi = {
      name: formData.name.trim(),
      domain: departmentName, // Use department name as domain
      description: formData.description.trim(),
      alert_table_name: formData.alert_table_name.trim(),
      default_email_to: formData.default_email_to,
      default_email_cc: formData.default_email_cc,
      default_subject: formData.default_subject.trim(),
      default_body: formData.default_body.trim(),
      default_footer: formData.default_footer.trim(),
      is_favorite: formData.is_favorite,
      identifier: identifier,
      severity_tagging: formData.severity_tagging,
      owner_department_id: departmentId, // Link to the department
      is_active: true
    };

    onAddKpi(newKpi);
    onClose();
    
    // Reset form
    setFormData({
      name: "",
      description: "",
      alert_table_name: "",
      default_email_to: [],
      default_email_cc: [],
      default_subject: "",
      default_body: "",
      default_footer: "",
      is_favorite: false,
      identifier: "",
      severity_tagging: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Plus className="w-5 h-5" />
            Add New KPI - {departmentName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kpi-name" className="text-sm font-medium">KPI Name *</Label>
              <Input
                id="kpi-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g. Branch Wait Time"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">KPI Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Optional description of what the KPI tracks"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alert-table" className="text-sm font-medium">Alert Table Name</Label>
              <Input
                id="alert-table"
                value={formData.alert_table_name}
                onChange={(e) => handleInputChange("alert_table_name", e.target.value)}
                placeholder="e.g. ace_alerts.branch_wait_time_alerts"
              />
            </div>
          </div>

          {/* Email Defaults */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Email Defaults</h3>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Default Email To</Label>
                <EmailTagInput
                  type="to"
                  emails={formData.default_email_to}
                  inputValue={emailToInput}
                  setInputValue={setEmailToInput}
                  placeholder="Add email addresses"
                  onAddTag={addEmailTag}
                  onRemoveTag={removeEmailTag}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Default Email CC</Label>
                <EmailTagInput
                  type="cc"
                  emails={formData.default_email_cc}
                  inputValue={emailCCInput}
                  setInputValue={setEmailCCInput}
                  placeholder="Add CC email addresses"
                  onAddTag={addEmailTag}
                  onRemoveTag={removeEmailTag}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-subject" className="text-sm font-medium">Default Subject</Label>
                <Input
                  id="default-subject"
                  value={formData.default_subject}
                  onChange={(e) => handleInputChange("default_subject", e.target.value)}
                  placeholder="Optional subject template"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-body" className="text-sm font-medium">Default Body</Label>
                <Textarea
                  id="default-body"
                  value={formData.default_body}
                  onChange={(e) => handleInputChange("default_body", e.target.value)}
                  placeholder="Optional body text"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-footer" className="text-sm font-medium">Default Footer Message</Label>
                <Textarea
                  id="default-footer"
                  value={formData.default_footer}
                  onChange={(e) => handleInputChange("default_footer", e.target.value)}
                  placeholder="e.g. Regards, ACE Alerting Team"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="space-y-1">
              <Label htmlFor="favorite-toggle" className="text-sm font-medium">Mark as Favorite</Label>
              <p className="text-xs text-muted-foreground">Star this KPI for quick access</p>
            </div>
            <Switch
              id="favorite-toggle"
              checked={formData.is_favorite}
              onCheckedChange={(checked) => handleInputChange("is_favorite", checked)}
            />
          </div>

          {/* Advanced Section */}
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Advanced Options</span>
                <Badge variant="outline" className="text-xs">Optional</Badge>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="kpi-identifier" className="text-sm font-medium">KPI Identifier (Code)</Label>
                <Input
                  id="kpi-identifier"
                  value={formData.identifier}
                  onChange={(e) => handleInputChange("identifier", e.target.value)}
                  placeholder="e.g. branch_wait_time (auto-generated if empty)"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="space-y-1">
                  <Label htmlFor="severity-toggle" className="text-sm font-medium">Severity Tagging</Label>
                  <p className="text-xs text-muted-foreground">Show severity column in alert table</p>
                </div>
                <Switch
                  id="severity-toggle"
                  checked={formData.severity_tagging}
                  onCheckedChange={(checked) => handleInputChange("severity_tagging", checked)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add KPI to {departmentName}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}