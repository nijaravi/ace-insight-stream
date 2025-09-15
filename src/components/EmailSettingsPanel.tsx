import { useState } from "react";
import { Mail, Paperclip, Eye, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface EmailSettingsProps {
  selectedKpi: string;
}

export function EmailSettingsPanel({ selectedKpi }: EmailSettingsProps) {
  const [toRecipients, setToRecipients] = useState<string[]>([
    "branch.manager@adib.ae",
    "operations@adib.ae"
  ]);
  const [ccRecipients, setCcRecipients] = useState<string[]>([
    "analytics@adib.ae"
  ]);
  const [toInput, setToInput] = useState("");
  const [ccInput, setCcInput] = useState("");
  const [subject, setSubject] = useState("Alert: Branch Wait Time Exceeded - Immediate Action Required");
  const [emailBody, setEmailBody] = useState(`Dear Team,

We have identified critical alerts for {KPI_NAME} that require immediate attention.

Alert Summary:
- {ALERT_COUNT} alerts detected
- Severity levels: {SEVERITY_BREAKDOWN}
- Entities affected: {ENTITY_LIST}

Please review the attached details and take necessary action within 2 hours.

Key Metrics:
- Current Performance: {CURRENT_METRIC}
- SLA Target: {SLA_TARGET}
- Deviation: {DEVIATION_PERCENTAGE}

Next Steps:
1. Review individual branch performance
2. Implement corrective measures
3. Report back within 2 hours

Best regards,
ADIB Analytics Team`);
  
  const [attachCsv, setAttachCsv] = useState(true);
  const [embedTable, setEmbedTable] = useState(true);

  const addRecipient = (email: string, type: 'to' | 'cc') => {
    if (!email || !email.includes('@')) return;
    
    if (type === 'to') {
      setToRecipients(prev => [...prev, email]);
      setToInput("");
    } else {
      setCcRecipients(prev => [...prev, email]);
      setCcInput("");
    }
  };

  const removeRecipient = (email: string, type: 'to' | 'cc') => {
    if (type === 'to') {
      setToRecipients(prev => prev.filter(r => r !== email));
    } else {
      setCcRecipients(prev => prev.filter(r => r !== email));
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            📧 Email Settings
          </h2>
          <p className="text-muted-foreground">Customize alert email configuration</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Save className="w-4 h-4" />
            Save as Draft
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </div>
      </div>

      <div className="bg-card border border-banking-border rounded-lg p-6 space-y-6 shadow-card">
        {/* Recipients Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* To Recipients */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">To Recipients</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {toRecipients.map((email) => (
                  <Badge key={email} variant="secondary" className="gap-2">
                    {email}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeRecipient(email, 'to')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Enter email and press Enter"
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, toInput, 'to')}
              />
            </div>
          </div>

          {/* CC Recipients */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">CC Recipients</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {ccRecipients.map((email) => (
                  <Badge key={email} variant="outline" className="gap-2">
                    {email}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeRecipient(email, 'cc')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Enter email and press Enter"
                value={ccInput}
                onChange={(e) => setCcInput(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, ccInput, 'cc')}
              />
            </div>
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-3">
          <Label htmlFor="subject" className="text-sm font-semibold">Email Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="font-medium"
          />
        </div>

        {/* Email Body */}
        <div className="space-y-3">
          <Label htmlFor="body" className="text-sm font-semibold">Email Body</Label>
          <Textarea
            id="body"
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            rows={12}
            className="font-mono text-sm"
            placeholder="Use variables like {KPI_NAME}, {ALERT_COUNT}, {ENTITY_LIST}..."
          />
          <div className="text-xs text-muted-foreground">
            Available variables: {"{KPI_NAME}"}, {"{ALERT_COUNT}"}, {"{SEVERITY_BREAKDOWN}"}, {"{ENTITY_LIST}"}, {"{CURRENT_METRIC}"}, {"{SLA_TARGET}"}, {"{DEVIATION_PERCENTAGE}"}
          </div>
        </div>

        {/* Email Options */}
        <div className="space-y-4 border-t border-banking-border pt-6">
          <h3 className="text-sm font-semibold">Email Options</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm">Attach CSV Export</Label>
              <p className="text-xs text-muted-foreground">Include detailed alert data as CSV attachment</p>
            </div>
            <Switch
              checked={attachCsv}
              onCheckedChange={setAttachCsv}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm">Embed Table in Email</Label>
              <p className="text-xs text-muted-foreground">Include formatted table directly in email body</p>
            </div>
            <Switch
              checked={embedTable}
              onCheckedChange={setEmbedTable}
            />
          </div>
        </div>
      </div>
    </div>
  );
}