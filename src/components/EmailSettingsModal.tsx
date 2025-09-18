import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpi: {
    id: string;
    name: string;
    default_email_to: string[];
    default_email_cc: string[];
    default_subject: string;
    default_body: string;
    default_footer: string;
  };
  onSave: (updates: Partial<{
    default_email_to: string[];
    default_email_cc: string[];
    default_subject: string;
    default_body: string;
    default_footer: string;
  }>) => void;
}

export function EmailSettingsModal({ open, onOpenChange, kpi, onSave }: EmailSettingsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    emailTo: kpi.default_email_to,
    emailCC: kpi.default_email_cc,
    subject: kpi.default_subject,
    body: kpi.default_body,
    footer: kpi.default_footer,
  });
  const [newToEmail, setNewToEmail] = useState("");
  const [newCCEmail, setNewCCEmail] = useState("");
  const { toast } = useToast();

  const handleEdit = () => {
    setFormData({
      emailTo: kpi.default_email_to,
      emailCC: kpi.default_email_cc,
      subject: kpi.default_subject,
      body: kpi.default_body,
      footer: kpi.default_footer,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave({
      default_email_to: formData.emailTo,
      default_email_cc: formData.emailCC,
      default_subject: formData.subject,
      default_body: formData.body,
      default_footer: formData.footer,
    });
    setIsEditing(false);
    toast({
      title: "Email Settings Updated",
      description: "Email configuration has been successfully saved.",
    });
  };

  const handleCancel = () => {
    setFormData({
      emailTo: kpi.default_email_to,
      emailCC: kpi.default_email_cc,
      subject: kpi.default_subject,
      body: kpi.default_body,
      footer: kpi.default_footer,
    });
    setIsEditing(false);
  };

  const addToEmail = () => {
    if (newToEmail && !formData.emailTo.includes(newToEmail)) {
      setFormData(prev => ({
        ...prev,
        emailTo: [...prev.emailTo, newToEmail]
      }));
      setNewToEmail("");
    }
  };

  const addCCEmail = () => {
    if (newCCEmail && !formData.emailCC.includes(newCCEmail)) {
      setFormData(prev => ({
        ...prev,
        emailCC: [...prev.emailCC, newCCEmail]
      }));
      setNewCCEmail("");
    }
  };

  const removeToEmail = (email: string) => {
    setFormData(prev => ({
      ...prev,
      emailTo: prev.emailTo.filter(e => e !== email)
    }));
  };

  const removeCCEmail = (email: string) => {
    setFormData(prev => ({
      ...prev,
      emailCC: prev.emailCC.filter(e => e !== email)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ✉️ Email Settings Configuration
            <Badge variant="outline">{kpi.name}</Badge>
          </DialogTitle>
          <DialogDescription>
            Configure email recipients and message templates for this KPI's alerts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Edit Button */}
          {!isEditing && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleEdit} className="gap-1">
                <Edit className="w-3 h-3" />
                Edit Settings
              </Button>
            </div>
          )}

          {/* Email Recipients */}
          <div className="space-y-4">
            {/* TO Recipients */}
            <div className="space-y-2">
              <Label>TO Recipients</Label>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter email address..."
                      value={newToEmail}
                      onChange={(e) => setNewToEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addToEmail()}
                    />
                    <Button onClick={addToEmail} size="sm" className="gap-1">
                      <Plus className="w-3 h-3" />
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.emailTo.map((email) => (
                      <Badge key={email} variant="secondary" className="gap-1">
                        {email}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeToEmail(email)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {kpi.default_email_to.length > 0 ? (
                    kpi.default_email_to.map((email) => (
                      <Badge key={email} variant="outline">{email}</Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">No recipients configured</span>
                  )}
                </div>
              )}
            </div>

            {/* CC Recipients */}
            <div className="space-y-2">
              <Label>CC Recipients</Label>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter email address..."
                      value={newCCEmail}
                      onChange={(e) => setNewCCEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCCEmail()}
                    />
                    <Button onClick={addCCEmail} size="sm" className="gap-1">
                      <Plus className="w-3 h-3" />
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.emailCC.map((email) => (
                      <Badge key={email} variant="secondary" className="gap-1">
                        {email}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeCCEmail(email)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {kpi.default_email_cc.length > 0 ? (
                    kpi.default_email_cc.map((email) => (
                      <Badge key={email} variant="outline">{email}</Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">No CC recipients configured</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Email Template */}
          <div className="space-y-4">
            {/* Subject */}
            <div className="space-y-2">
              <Label>Subject Line</Label>
              {isEditing ? (
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Alert subject line..."
                />
              ) : (
                <div className="bg-muted p-3 rounded">
                  {kpi.default_subject || "No subject configured"}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="space-y-2">
              <Label>Email Body</Label>
              {isEditing ? (
                <Textarea
                  value={formData.body}
                  onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                  className="min-h-[120px]"
                  placeholder="Email body template..."
                />
              ) : (
                <div className="bg-muted p-3 rounded whitespace-pre-wrap">
                  {kpi.default_body || "No body template configured"}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="space-y-2">
              <Label>Email Footer</Label>
              {isEditing ? (
                <Input
                  value={formData.footer}
                  onChange={(e) => setFormData(prev => ({ ...prev, footer: e.target.value }))}
                  placeholder="Email footer..."
                />
              ) : (
                <div className="bg-muted p-3 rounded">
                  {kpi.default_footer || "No footer configured"}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons for Editing */}
          {isEditing && (
            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button onClick={handleCancel} variant="outline" className="gap-1">
                <X className="w-3 h-3" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-1">
                <Save className="w-3 h-3" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}