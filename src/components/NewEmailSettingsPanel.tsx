import { useState } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NewEmailSettingsPanelProps {
  selectedKpi: string;
}

export function NewEmailSettingsPanel({ selectedKpi }: NewEmailSettingsPanelProps) {
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

We have identified critical alerts that require immediate attention.

Please review the alert details below and take necessary action within 2 hours.

Best regards,`);
  const [footerMessage, setFooterMessage] = useState("ADIB Analytics Team");

  // Mock selected alerts for preview
  const selectedAlerts = [
    { id: "1", alertDate: "2024-09-15", alertDetails: "Mall Branch breached wait time SLA (28 mins avg)" },
    { id: "2", alertDate: "2024-09-15", alertDetails: "Downtown Branch has 22 mins avg wait time" }
  ];

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
      <div>
        <h2 className="text-2xl font-bold text-primary">✉️ Email Settings</h2>
        <p className="text-muted-foreground">Customize email recipients, subject, and body for alert notifications</p>
      </div>

      <div className="bg-card border border-banking-border rounded-lg p-6 space-y-6 shadow-card">
        {/* Recipients Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* To Recipients */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">📤 To Recipients</Label>
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
            <Label className="text-sm font-semibold">📤 CC Recipients</Label>
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
          <Label htmlFor="subject" className="text-sm font-semibold">📝 Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="font-medium"
          />
        </div>

        {/* Email Body */}
        <div className="space-y-3">
          <Label htmlFor="body" className="text-sm font-semibold">🧾 Body</Label>
          <Textarea
            id="body"
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            rows={8}
            className="font-sans text-sm"
          />
        </div>

        {/* Footer Message */}
        <div className="space-y-3">
          <Label htmlFor="footer" className="text-sm font-semibold">👣 Footer Message</Label>
          <Textarea
            id="footer"
            value={footerMessage}
            onChange={(e) => setFooterMessage(e.target.value)}
            rows={2}
            className="font-sans text-sm"
            placeholder="Optional closing message like 'Regards, ACE Team'"
          />
        </div>
      </div>

      {/* Preview Area */}
      <div className="bg-card border border-banking-border rounded-lg p-6 space-y-4 shadow-card">
        <h3 className="text-lg font-semibold">📋 Email Preview</h3>
        
        <div className="bg-muted/20 border border-banking-border rounded-md p-4 space-y-4">
          <div className="space-y-2 text-sm">
            <div><strong>To:</strong> {toRecipients.join(', ')}</div>
            <div><strong>CC:</strong> {ccRecipients.join(', ')}</div>
            <div><strong>Subject:</strong> {subject}</div>
          </div>
          
          <div className="border-t border-banking-border pt-4">
            <div className="whitespace-pre-wrap text-sm mb-4">{emailBody}</div>
            
            {selectedAlerts.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Alert Details:</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alert Date</TableHead>
                      <TableHead>Alert Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>{alert.alertDate}</TableCell>
                        <TableCell>{alert.alertDetails}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            <div className="whitespace-pre-wrap text-sm text-muted-foreground">
              {footerMessage}
            </div>
          </div>
        </div>
      </div>

      {/* Send Button */}
      <div className="flex justify-end">
        <Button className="gap-2 bg-accent hover:bg-accent/90">
          <Send className="w-4 h-4" />
          Send Email
        </Button>
      </div>
    </div>
  );
}