import { useState, useEffect } from "react";
import { Calendar, RefreshCw, Send, Mail, Edit3, CalendarIcon, Brain } from "lucide-react";
import { format, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAlerts, useBulkUpdateAlerts } from "@/hooks/useAlerts";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { KpiData, Alert } from "@/types/kpi";

interface CheckSendAlertsPanelProps {
  selectedKpi: KpiData | null;
  onPassToAI: (alerts: Alert[]) => void;
}

export function CheckSendAlertsPanel({ selectedKpi, onPassToAI }: CheckSendAlertsPanelProps) {
  const [tableName, setTableName] = useState(selectedKpi?.alert_table_name || "ace_alerts.branch_wait_time_alerts");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date()
  });
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, string>>({});
  const [isEditingTableName, setIsEditingTableName] = useState(false);
  const [editTableName, setEditTableName] = useState(tableName);

  // Fetch alerts from database
  const { data: alerts = [], isLoading, refetch } = useAlerts({
    startDate: dateRange.from.toISOString(),
    endDate: dateRange.to.toISOString(),
    kpiId: selectedKpi?.id
  });

  const bulkUpdateMutation = useBulkUpdateAlerts();

  const handleTableNameSave = () => {
    setTableName(editTableName);
    setIsEditingTableName(false);
    refetch(); // Reload alerts when table name changes
  };

  const handleSendAlerts = async () => {
    try {
      const alertIds = Array.from(selectedAlerts);
      await bulkUpdateMutation.mutateAsync({
        ids: alertIds,
        data: { sent_date: new Date().toISOString() }
      });
      toast.success(`${alertIds.length} alerts sent successfully`);
      setSelectedAlerts(new Set()); // Clear selections
    } catch (error) {
      toast.error("Failed to send alerts");
      console.error("Error sending alerts:", error);
    }
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
    if (selectedKpi?.alert_table_name) {
      setTableName(selectedKpi.alert_table_name);
      setEditTableName(selectedKpi.alert_table_name);
    }
  }, [selectedKpi]);

  // Clear selections when alerts change
  useEffect(() => {
    setSelectedAlerts(new Set());
  }, [alerts]);

  const getKpiName = (kpi: KpiData | null) => {
    return kpi?.name || "Unknown KPI";
  };

  const handlePassToAI = () => {
    const selectedAlertsList = alerts
      .filter(alert => selectedAlerts.has(alert.id))
      .map(alert => ({
        ...alert,
        comment: comments[alert.id]
      }));
    onPassToAI(selectedAlertsList);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary">📤 Check & Send Alerts</h2>
        <p className="text-muted-foreground">Load alert records for {getKpiName(selectedKpi)} and send notifications</p>
      </div>

      {/* Top Bar - Table Name and Date Picker */}
      <div className="flex items-center justify-between p-4 bg-card border border-banking-border rounded-lg shadow-card">
        <div className="flex items-center gap-4">
          {/* Table Name Display with Edit */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">📄 Table:</span>
            <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{tableName}</span>
            <Dialog open={isEditingTableName} onOpenChange={setIsEditingTableName}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Edit3 className="w-3 h-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Alert Table Name</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-table-name">Alert Table Name</Label>
                    <Input
                      id="edit-table-name"
                      value={editTableName}
                      onChange={(e) => setEditTableName(e.target.value)}
                      placeholder="e.g., ace_alerts.branch_wait_time_alerts"
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

        {/* Date Range Picker */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">📅 Date Range:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                  }
                }}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Alerts Table */}
      {isLoading ? (
        <div className="bg-card border border-banking-border rounded-lg p-8 text-center shadow-card">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading alerts...</p>
        </div>
      ) : alerts.length > 0 ? (
        <div className="bg-card border border-banking-border rounded-lg overflow-hidden shadow-card">          
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
                  <TableCell className="font-medium">{format(new Date(alert.alert_date), 'yyyy-MM-dd')}</TableCell>
                  <TableCell>{alert.alert_detail}</TableCell>
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
      ) : (
        <div className="bg-card border border-banking-border rounded-lg p-8 text-center shadow-card">
          <Calendar className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            No alerts found for {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
          </p>
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
              onClick={handleSendAlerts}
            >
              <Mail className="w-4 h-4" />
              Send Alerts ({selectedAlerts.size})
            </Button>
            <Button 
              className="gap-2 bg-accent hover:bg-accent/90" 
              disabled={selectedAlerts.size === 0}
              onClick={handlePassToAI}
            >
              <Brain className="w-4 h-4" />
              Pass to AI Summarizer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}