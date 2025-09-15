import { useState } from "react";
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
}

export function AddKpiModal({ isOpen, onClose, onAddKpi }: AddKpiModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    description: "",
    alertTableName: "",
    defaultEmailTo: [] as string[],
    defaultEmailCC: [] as string[],
    defaultSubject: "",
    defaultBody: "",
    defaultFooter: "",
    isFavorite: false,
    // Advanced fields
    kpiCode: "",
    severityTagging: true,
    ownerDepartment: ""
  });

  const [emailToInput, setEmailToInput] = useState("");
  const [emailCCInput, setEmailCCInput] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const businessDomains = [
    { value: "operations", label: "Operations" },
    { value: "sales", label: "Sales & Marketing" },
    { value: "financial", label: "Financial" },
    { value: "compliance", label: "Risk & Compliance" }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addEmailTag = (type: 'to' | 'cc', email: string) => {
    if (email.trim() && email.includes('@')) {
      const field = type === 'to' ? 'defaultEmailTo' : 'defaultEmailCC';
      const currentEmails = formData[field];
      if (!currentEmails.includes(email.trim())) {
        handleInputChange(field, [...currentEmails, email.trim()]);
      }
      if (type === 'to') setEmailToInput("");
      else setEmailCCInput("");
    }
  };

  const removeEmailTag = (type: 'to' | 'cc', email: string) => {
    const field = type === 'to' ? 'defaultEmailTo' : 'defaultEmailCC';
    const currentEmails = formData[field];
    handleInputChange(field, currentEmails.filter(e => e !== email));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.domain) {
      return; // Basic validation
    }

    // Generate KPI code if not provided
    const kpiCode = formData.kpiCode || formData.name.toLowerCase().replace(/\s+/g, '-');
    
    const newKpi = {
      id: kpiCode,
      name: formData.name,
      domain: formData.domain,
      description: formData.description,
      alertTableName: formData.alertTableName,
      emailDefaults: {
        to: formData.defaultEmailTo,
        cc: formData.defaultEmailCC,
        subject: formData.defaultSubject,
        body: formData.defaultBody,
        footer: formData.defaultFooter
      },
      isFavorite: formData.isFavorite,
      advanced: {
        kpiCode,
        severityTagging: formData.severityTagging,
        ownerDepartment: formData.ownerDepartment
      },
      // Default properties
      icon: Plus, // Will be updated based on domain
      severity: "info",
      status: "normal"
    };

    onAddKpi(newKpi);
    onClose();
    
    // Reset form
    setFormData({
      name: "",
      domain: "",
      description: "",
      alertTableName: "",
      defaultEmailTo: [],
      defaultEmailCC: [],
      defaultSubject: "",
      defaultBody: "",
      defaultFooter: "",
      isFavorite: false,
      kpiCode: "",
      severityTagging: true,
      ownerDepartment: ""
    });
  };

  const EmailTagInput = ({ 
    type, 
    emails, 
    inputValue, 
    setInputValue, 
    placeholder 
  }: {
    type: 'to' | 'cc';
    emails: string[];
    inputValue: string;
    setInputValue: (value: string) => void;
    placeholder: string;
  }) => (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 mb-2">
        {emails.map((email) => (
          <Badge key={email} variant="secondary" className="text-xs">
            {email}
            <button
              type="button"
              onClick={() => removeEmailTag(type, email)}
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
            addEmailTag(type, inputValue);
          }
        }}
        onBlur={() => {
          if (inputValue.trim()) {
            addEmailTag(type, inputValue);
          }
        }}
        placeholder={placeholder}
        className="text-sm"
      />
      <p className="text-xs text-muted-foreground">Press Enter or comma to add email</p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Plus className="w-5 h-5" />
            Add New KPI
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="business-domain" className="text-sm font-medium">Business Domain *</Label>
                <Select value={formData.domain} onValueChange={(value) => handleInputChange("domain", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessDomains.map((domain) => (
                      <SelectItem key={domain.value} value={domain.value}>
                        {domain.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                value={formData.alertTableName}
                onChange={(e) => handleInputChange("alertTableName", e.target.value)}
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
                  emails={formData.defaultEmailTo}
                  inputValue={emailToInput}
                  setInputValue={setEmailToInput}
                  placeholder="Add email addresses"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Default Email CC</Label>
                <EmailTagInput
                  type="cc"
                  emails={formData.defaultEmailCC}
                  inputValue={emailCCInput}
                  setInputValue={setEmailCCInput}
                  placeholder="Add CC email addresses"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-subject" className="text-sm font-medium">Default Subject</Label>
                <Input
                  id="default-subject"
                  value={formData.defaultSubject}
                  onChange={(e) => handleInputChange("defaultSubject", e.target.value)}
                  placeholder="Optional subject template"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-body" className="text-sm font-medium">Default Body</Label>
                <Textarea
                  id="default-body"
                  value={formData.defaultBody}
                  onChange={(e) => handleInputChange("defaultBody", e.target.value)}
                  placeholder="Optional body text"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-footer" className="text-sm font-medium">Default Footer Message</Label>
                <Textarea
                  id="default-footer"
                  value={formData.defaultFooter}
                  onChange={(e) => handleInputChange("defaultFooter", e.target.value)}
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
              checked={formData.isFavorite}
              onCheckedChange={(checked) => handleInputChange("isFavorite", checked)}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kpi-code" className="text-sm font-medium">KPI Identifier (Code)</Label>
                  <Input
                    id="kpi-code"
                    value={formData.kpiCode}
                    onChange={(e) => handleInputChange("kpiCode", e.target.value)}
                    placeholder="e.g. kpi_branch_wait"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner-dept" className="text-sm font-medium">Owner Department</Label>
                  <Input
                    id="owner-dept"
                    value={formData.ownerDepartment}
                    onChange={(e) => handleInputChange("ownerDepartment", e.target.value)}
                    placeholder="e.g. Branch Ops, Retail Sales"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="space-y-1">
                  <Label htmlFor="severity-toggle" className="text-sm font-medium">Severity Tagging</Label>
                  <p className="text-xs text-muted-foreground">Show severity column in alert table</p>
                </div>
                <Switch
                  id="severity-toggle"
                  checked={formData.severityTagging}
                  onCheckedChange={(checked) => handleInputChange("severityTagging", checked)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-banking-sidebar-accent hover:bg-banking-sidebar-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Add KPI
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}