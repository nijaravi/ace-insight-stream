import { useState, useEffect } from "react";
import { Calendar, RefreshCw, Send, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Alert {
  id: string;
  alertDate: string;
  alertDetails: string;
}

import { KpiData } from "@/pages/Index";

interface CheckSendAlertsPanelProps {
  selectedKpi: KpiData | null;
}

export function CheckSendAlertsPanel({ selectedKpi }: CheckSendAlertsPanelProps) {
  const [tableName, setTableName] = useState(selectedKpi?.alertTableName || "ace_alerts.branch_wait_time_alerts");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const mockAlerts: Alert[] = [
    {
      id: "1",
      alertDate: selectedDate,
      alertDetails: "Mall Branch breached wait time SLA (28 mins avg)"
    },
    {
      id: "2", 
      alertDate: selectedDate,
      alertDetails: "Downtown Branch has 22 mins avg wait time"
    },
    {
      id: "3",
      alertDate: selectedDate,
      alertDetails: "Airport Branch showing 18 mins wait time"
    }
  ];

  const loadAlerts = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAlerts(mockAlerts);
      setIsLoading(false);
    }, 1000);
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

  const handleCommentChange = (alertId: string, comment: string) => {
    setComments(prev => ({ ...prev, [alertId]: comment }));
  };

  // Update table name when selectedKpi changes
  useEffect(() => {
    if (selectedKpi?.alertTableName) {
      setTableName(selectedKpi.alertTableName);
    }
  }, [selectedKpi]);

  const getKpiName = (kpi: KpiData | null) => {
    return kpi?.name || "Unknown KPI";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary">📤 Check & Send Alerts</h2>
        <p className="text-muted-foreground">Load alert records for {getKpiName(selectedKpi)} and send notifications</p>
      </div>

      {/* Alert Data Controls */}
      <div className="bg-card border border-banking-border rounded-lg p-6 space-y-4 shadow-card">
        <h3 className="text-lg font-semibold">📋 Alert Data Controls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tableName">📄 Alert Table Name</Label>
            <Input
              id="tableName"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="e.g., ace_alerts.branch_wait_time_alerts"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alertDate">📅 Date Picker</Label>
            <Input
              id="alertDate"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={loadAlerts}
              disabled={isLoading}
              className="gap-2 bg-accent hover:bg-accent/90"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Load Alerts
            </Button>
          </div>
        </div>
      </div>

      {/* Alerts Table Viewer */}
      {alerts.length > 0 && (
        <div className="bg-card border border-banking-border rounded-lg overflow-hidden shadow-card">
          <div className="p-4 border-b border-banking-border">
            <h3 className="text-lg font-semibold">📋 Alerts Table Viewer</h3>
            <p className="text-sm text-muted-foreground">
              Loaded {alerts.length} alerts for {selectedDate}
            </p>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-12">✅</TableHead>
                <TableHead>Alert Date</TableHead>
                <TableHead>Alert Details</TableHead>
                <TableHead>Comments</TableHead>
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
                    />
                  </TableCell>
                  <TableCell className="font-medium">{alert.alertDate}</TableCell>
                  <TableCell>{alert.alertDetails}</TableCell>
                  <TableCell>
                    <Input
                      placeholder="Add optional comment..."
                      value={comments[alert.id] || ""}
                      onChange={(e) => handleCommentChange(alert.id, e.target.value)}
                      className="max-w-60"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Actions */}
      {alerts.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedAlerts.size} of {alerts.length} alerts selected
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2" 
              disabled={selectedAlerts.size === 0}
            >
              <Mail className="w-4 h-4" />
              Send to Me
            </Button>
            <Button 
              className="gap-2 bg-accent hover:bg-accent/90" 
              disabled={selectedAlerts.size === 0}
            >
              <Send className="w-4 h-4" />
              Send Alert
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}