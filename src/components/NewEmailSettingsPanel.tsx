import { useState, useEffect } from "react";
import { Edit, Save, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

import { KpiData } from "@/pages/Index";

interface NewEmailSettingsPanelProps {
  selectedKpi: KpiData | null;
}

export function NewEmailSettingsPanel({ selectedKpi }: NewEmailSettingsPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Current values
  const [toRecipients, setToRecipients] = useState<string[]>(selectedKpi?.defaultEmailTo || []);
  const [ccRecipients, setCcRecipients] = useState<string[]>(selectedKpi?.defaultEmailCC || []);
  const [subject, setSubject] = useState(selectedKpi?.defaultSubject || "");
  const [emailBody, setEmailBody] = useState(selectedKpi?.defaultBody || "");
  const [footerMessage, setFooterMessage] = useState(selectedKpi?.defaultFooter || "");
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(selectedKpi?.isAutomationEnabled || false);
  const [automationTime, setAutomationTime] = useState(selectedKpi?.automationTime || "09:00");
  
  // Draft values for editing
  const [draftToRecipients, setDraftToRecipients] = useState<string[]>([]);
  const [draftCcRecipients, setDraftCcRecipients] = useState<string[]>([]);
  const [draftSubject, setDraftSubject] = useState("");
  const [draftEmailBody, setDraftEmailBody] = useState("");
  const [draftFooterMessage, setDraftFooterMessage] = useState("");
  const [draftIsAutomationEnabled, setDraftIsAutomationEnabled] = useState(false);
  const [draftAutomationTime, setDraftAutomationTime] = useState("09:00");
  const [toInput, setToInput] = useState("");
  const [ccInput, setCcInput] = useState("");

  // Update form fields when selectedKpi changes
  useEffect(() => {
    if (selectedKpi) {
      setToRecipients(selectedKpi.defaultEmailTo || []);
      setCcRecipients(selectedKpi.defaultEmailCC || []);
      setSubject(selectedKpi.defaultSubject || "");
      setEmailBody(selectedKpi.defaultBody || "");
      setFooterMessage(selectedKpi.defaultFooter || "");
      setIsAutomationEnabled(selectedKpi.isAutomationEnabled || false);
      setAutomationTime(selectedKpi.automationTime || "09:00");
    }
  }, [selectedKpi]);

  const handleEdit = () => {
    setIsEditing(true);
    // Initialize draft values with current values
    setDraftToRecipients([...toRecipients]);
    setDraftCcRecipients([...ccRecipients]);
    setDraftSubject(subject);
    setDraftEmailBody(emailBody);
    setDraftFooterMessage(footerMessage);
    setDraftIsAutomationEnabled(isAutomationEnabled);
    setDraftAutomationTime(automationTime);
    setToInput("");
    setCcInput("");
  };

  const handleSave = () => {
    // Save draft values to current values
    setToRecipients([...draftToRecipients]);
    setCcRecipients([...draftCcRecipients]);
    setSubject(draftSubject);
    setEmailBody(draftEmailBody);
    setFooterMessage(draftFooterMessage);
    setIsAutomationEnabled(draftIsAutomationEnabled);
    setAutomationTime(draftAutomationTime);
    setIsEditing(false);
    toast.success("Email settings saved successfully");
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Clear draft values
    setDraftToRecipients([]);
    setDraftCcRecipients([]);
    setDraftSubject("");
    setDraftEmailBody("");
    setDraftFooterMessage("");
    setDraftIsAutomationEnabled(false);
    setDraftAutomationTime("09:00");
    setToInput("");
    setCcInput("");
  };

  const addRecipient = (email: string, type: 'to' | 'cc') => {
    if (!email || !email.includes('@')) return;
    
    if (type === 'to') {
      setDraftToRecipients(prev => [...prev, email]);
      setToInput("");
    } else {
      setDraftCcRecipients(prev => [...prev, email]);
      setCcInput("");
    }
  };

  const removeRecipient = (email: string, type: 'to' | 'cc') => {
    if (type === 'to') {
      setDraftToRecipients(prev => prev.filter(r => r !== email));
    } else {
      setDraftCcRecipients(prev => prev.filter(r => r !== email));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, email: string, type: 'to' | 'cc') => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addRecipient(email, type);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-primary">✉️ Email Settings</h2>
          <p className="text-muted-foreground">Configure default email template for alert notifications</p>
        </div>
        
        {/* Edit/Save/Cancel Buttons */}
        <div className="flex gap-2">
          {!isEditing ? (
            <Button 
              onClick={handleEdit}
              variant="outline"
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleCancel}
                variant="outline"
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-card border border-banking-border rounded-lg p-6 space-y-6 shadow-card">
        {/* Recipients Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* To Recipients */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">📤 To Recipients</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border border-input rounded-md bg-background">
                {(isEditing ? draftToRecipients : toRecipients).map((email) => (
                  <Badge key={email} variant="secondary" className="gap-2">
                    {email}
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeRecipient(email, 'to')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
                {toRecipients.length === 0 && !isEditing && (
                  <span className="text-muted-foreground text-sm">No recipients configured</span>
                )}
              </div>
              {isEditing && (
                <Input
                  placeholder="Enter email and press Enter"
                  value={toInput}
                  onChange={(e) => setToInput(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, toInput, 'to')}
                />
              )}
            </div>
          </div>

          {/* CC Recipients */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">📤 CC Recipients</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border border-input rounded-md bg-background">
                {(isEditing ? draftCcRecipients : ccRecipients).map((email) => (
                  <Badge key={email} variant="outline" className="gap-2">
                    {email}
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeRecipient(email, 'cc')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
                {ccRecipients.length === 0 && !isEditing && (
                  <span className="text-muted-foreground text-sm">No CC recipients configured</span>
                )}
              </div>
              {isEditing && (
                <Input
                  placeholder="Enter email and press Enter"
                  value={ccInput}
                  onChange={(e) => setCcInput(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, ccInput, 'cc')}
                />
              )}
            </div>
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-3">
          <Label htmlFor="subject" className="text-sm font-semibold">📝 Subject</Label>
          {isEditing ? (
            <Input
              id="subject"
              value={draftSubject}
              onChange={(e) => setDraftSubject(e.target.value)}
              className="font-medium"
              placeholder="Enter email subject"
            />
          ) : (
            <div className="p-3 border border-input rounded-md bg-muted/50 font-medium">
              {subject || <span className="text-muted-foreground">No subject configured</span>}
            </div>
          )}
        </div>

        {/* Email Body */}
        <div className="space-y-3">
          <Label htmlFor="body" className="text-sm font-semibold">🧾 Body</Label>
          {isEditing ? (
            <Textarea
              id="body"
              value={draftEmailBody}
              onChange={(e) => setDraftEmailBody(e.target.value)}
              rows={8}
              className="font-sans text-sm"
              placeholder="Enter email body content"
            />
          ) : (
            <div className="p-3 border border-input rounded-md bg-muted/50 min-h-[200px] font-sans text-sm whitespace-pre-wrap">
              {emailBody || <span className="text-muted-foreground">No body content configured</span>}
            </div>
          )}
        </div>

        {/* Footer Message */}
        <div className="space-y-3">
          <Label htmlFor="footer" className="text-sm font-semibold">👣 Footer Message</Label>
          {isEditing ? (
            <Textarea
              id="footer"
              value={draftFooterMessage}
              onChange={(e) => setDraftFooterMessage(e.target.value)}
              rows={2}
              className="font-sans text-sm"
              placeholder="Optional closing message like 'Regards, ACE Team'"
            />
          ) : (
            <div className="p-3 border border-input rounded-md bg-muted/50 font-sans text-sm whitespace-pre-wrap">
              {footerMessage || <span className="text-muted-foreground">No footer message configured</span>}
            </div>
          )}
        </div>

        {/* Automated Alert Trigger Section */}
        <div className="border-t border-dashed border-border pt-6">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors">
              <Clock className="w-5 h-5" />
              🕒 Automated Alert Trigger
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="bg-muted/30 border border-dashed border-muted-foreground/20 rounded-lg p-4 space-y-4">
                {/* Enable Toggle */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Enable daily auto-send for this KPI</Label>
                  {isEditing ? (
                    <Switch
                      checked={draftIsAutomationEnabled}
                      onCheckedChange={setDraftIsAutomationEnabled}
                    />
                  ) : (
                    <Switch
                      checked={isAutomationEnabled}
                      disabled
                    />
                  )}
                </div>

                {/* Time Picker */}
                {(isEditing ? draftIsAutomationEnabled : isAutomationEnabled) && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Trigger Time (24-hour format)</Label>
                    {isEditing ? (
                      <Input
                        type="time"
                        value={draftAutomationTime}
                        onChange={(e) => setDraftAutomationTime(e.target.value)}
                        className="w-32"
                      />
                    ) : (
                      <div className="p-2 border border-input rounded-md bg-muted/50 font-mono text-sm w-32">
                        {automationTime}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}