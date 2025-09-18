import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Send, Mail, Edit3 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface CurationAlert {
  id: string;
  alert_id: string;
  departmentName: string;
  kpiName: string;
  alert_detail: string;
  curated_date: string;
  sent_date?: string;
}

export function AlertCurationPanel() {
  const [masterTableName, setMasterTableName] = useState("ace_alerts.master_alerts");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [alerts, setAlerts] = useState<CurationAlert[]>([]);
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingTableName, setIsEditingTableName] = useState(false);
  const [editTableName, setEditTableName] = useState(masterTableName);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockAlerts: CurationAlert[] = [
    {
      id: "1",
      alert_id: "ALT-2025-001",
      departmentName: "Operations",
      kpiName: "Branch Wait Time",
      alert_detail: "Mall Branch breached wait time SLA (28 mins avg)",
      curated_date: format(selectedDate, 'yyyy-MM-dd'),
      sent_date: undefined,
    },
    {
      id: "2", 
      alert_id: "ALT-2025-002",
      departmentName: "Financial",
      kpiName: "Deposit Balances",
      alert_detail: "Significant deposit withdrawals detected in Abu Dhabi region",
      curated_date: format(selectedDate, 'yyyy-MM-dd'),
      sent_date: undefined,
    },
    {
      id: "3",
      alert_id: "ALT-2025-003", 
      departmentName: "Risk & Compliance",
      kpiName: "Fraud Detection",
      alert_detail: "Unusual transaction patterns detected in Dubai Main Branch",
      curated_date: format(selectedDate, 'yyyy-MM-dd'),
      sent_date: undefined,
    },
  ];

  const loadAlerts = async () => {
    setIsLoading(true);
    setSelectedAlerts(new Set());
    
    // Simulate API call
    setTimeout(() => {
      setAlerts(mockAlerts);
      setIsLoading(false);
    }, 800);
  };

  const handleTableNameSave = () => {
    setMasterTableName(editTableName);
    setIsEditingTableName(false);
    loadAlerts(); // Auto-reload when table name changes
  };

  const handleAlertSelect = (alertId: string, checked: boolean) => {
    const newSelected = new Set(selectedAlerts);
    if (checked) {
      newSelected.add(alertId);
    } else {
      newSelected.delete(alertId);
    }
    setSelectedAlerts(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAlerts(new Set(alerts.map(alert => alert.id)));
    } else {
      setSelectedAlerts(new Set());
    }
  };

  const handleSendToMe = () => {
    toast({
      title: "Test Email Sent",
      description: `${selectedAlerts.size} alerts sent to your email for review.`,
    });
  };

  const handleSendAlerts = () => {
    const selectedCount = selectedAlerts.size;
    const recipientCount = 2; // Mock recipient count
    
    // Update sent_date for selected alerts
    setAlerts(prev => prev.map(alert => 
      selectedAlerts.has(alert.id) 
        ? { ...alert, sent_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss') }
        : alert
    ));
    
    setSelectedAlerts(new Set());
    setPreviewDialogOpen(false);
    
    toast({
      title: "Alerts Sent Successfully",
      description: `${selectedCount} alerts have been sent to configured recipients.`,
    });
  };

  // Auto-load alerts when date changes
  useEffect(() => {
    loadAlerts();
  }, [selectedDate]);

  // Initial load
  useEffect(() => {
    loadAlerts();
  }, []);

  const selectedAlertsData = alerts.filter(alert => selectedAlerts.has(alert.id));
  const uniqueRecipients = new Set(['ops-head@adib.ae', 'finance@adib.ae']); // Mock recipients

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary">🔔 Alert Curation & Sending</h2>
        <p className="text-muted-foreground">Review and send curated alerts to relevant stakeholders</p>
      </div>

      {/* Control Panel */}
      <div className="p-4 bg-card border border-banking-border rounded-lg shadow-card space-y-4">
        {/* Master Table Name */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Master Alert Table:</Label>
            <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{masterTableName}</span>
            <Dialog open={isEditingTableName} onOpenChange={setIsEditingTableName}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Edit3 className="w-3 h-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Master Table Name</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-master-table">Master Alert Table Name</Label>
                    <Input
                      id="edit-master-table"
                      value={editTableName}
                      onChange={(e) => setEditTableName(e.target.value)}
                      placeholder="e.g., ace_alerts.master_alerts"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsEditingTableName(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleTableNameSave}>
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Date Picker */}
        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium">Curation Date:</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Alerts Table */}
      {isLoading ? (
        <div className="bg-card border border-banking-border rounded-lg p-8 text-center shadow-card">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">Loading alerts...</p>
        </div>
      ) : alerts.length > 0 ? (
        <div className="bg-card border border-banking-border rounded-lg overflow-hidden shadow-card">          
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-12">
                <Checkbox
                  checked={selectedAlerts.size === alerts.length && alerts.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                </TableHead>
                <TableHead>Alert ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>KPI</TableHead>
                <TableHead>Alert Detail</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id} className="hover:bg-banking-hover/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedAlerts.has(alert.id)}
                      onCheckedChange={(checked) => 
                        handleAlertSelect(alert.id, checked as boolean)
                      }
                      disabled={!!alert.sent_date}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{alert.alert_id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{alert.departmentName}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{alert.kpiName}</TableCell>
                  <TableCell className="max-w-md">{alert.alert_detail}</TableCell>
                  <TableCell>
                    {alert.sent_date ? (
                      <Badge variant="secondary">Sent</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-card border border-banking-border rounded-lg p-8 text-center shadow-card">
          <CalendarIcon className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            No alerts found for {format(selectedDate, "PPP")}
          </p>
        </div>
      )}

      {/* Actions */}
      {alerts.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedAlerts.size} of {alerts.filter(a => !a.sent_date).length} available alerts selected
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2" 
              disabled={selectedAlerts.size === 0}
              onClick={handleSendToMe}
            >
              <Mail className="w-4 h-4" />
              Send to Me
            </Button>
            
            <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="gap-2 bg-accent hover:bg-accent/90" 
                  disabled={selectedAlerts.size === 0}
                >
                  <Send className="w-4 h-4" />
                  Send Alerts
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Confirm Alert Sending</DialogTitle>
                  <DialogDescription>
                    You're about to send {selectedAlerts.size} alerts to {uniqueRecipients.size} recipients.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Selected Alerts:</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {selectedAlertsData.map((alert) => (
                        <div key={alert.id} className="text-sm bg-muted p-2 rounded">
                          {alert.alert_id} - {alert.kpiName}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Recipients:</h4>
                    <div className="space-y-1">
                      {Array.from(uniqueRecipients).map((email) => (
                        <div key={email} className="text-sm bg-muted p-2 rounded font-mono">
                          {email}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendAlerts}>
                    Confirm & Send
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
}