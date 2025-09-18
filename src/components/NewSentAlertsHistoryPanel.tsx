import { useState } from "react";
import { Calendar, RefreshCw, Download, CalendarIcon } from "lucide-react";
import { format, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HistoryAlert {
  id: string;
  alertDate: string;
  kpiName: string;
  alertMessage: string;
}

import type { KpiData } from "@/types/kpi";

interface NewSentAlertsHistoryPanelProps {
  selectedKpi: KpiData | null;
}

export function NewSentAlertsHistoryPanel({ selectedKpi }: NewSentAlertsHistoryPanelProps) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date()
  });
  const [historyAlerts, setHistoryAlerts] = useState<HistoryAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const mockHistoryAlerts: HistoryAlert[] = [
    {
      id: "1",
      alertDate: "2024-09-15",
      kpiName: "Branch Wait Time",
      alertMessage: "Mall Branch breached SLA"
    },
    {
      id: "2",
      alertDate: "2024-09-14", 
      kpiName: "Card Sales Drop",
      alertMessage: "Visa Platinum sales dropped by 22%"
    },
    {
      id: "3",
      alertDate: "2024-09-13",
      kpiName: "Branch Wait Time", 
      alertMessage: "Downtown Branch exceeded wait time limit"
    },
    {
      id: "4",
      alertDate: "2024-09-12",
      kpiName: "ATM Downtime",
      alertMessage: "Mall ATM offline for 3+ hours"
    }
  ];

  const loadHistory = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setHistoryAlerts(mockHistoryAlerts);
      setIsLoading(false);
    }, 1000);
  };

  const exportHistory = () => {
    // Simulate CSV export
    const csvContent = [
      ['Alert Date', 'KPI Name', 'Alert Message'],
      ...historyAlerts.map(alert => [alert.alertDate, alert.kpiName, alert.alertMessage])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `alert_history_${format(dateRange.from, 'yyyy-MM-dd')}_to_${format(dateRange.to, 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary">📜 Sent Alerts History</h2>
        <p className="text-muted-foreground">Simple filtered view of all sent alerts based on date range</p>
      </div>

      {/* Controls */}
      <div className="bg-card border border-banking-border rounded-lg p-6 space-y-4 shadow-card">
        <h3 className="text-lg font-semibold">📋 Controls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="dateRange">📅 Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
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
          
          <Button 
            onClick={loadHistory}
            disabled={isLoading}
            className="gap-2 bg-accent hover:bg-accent/90"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Load History
          </Button>

          <Button 
            variant="outline"
            onClick={exportHistory}
            disabled={historyAlerts.length === 0}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export History
          </Button>
        </div>
      </div>

      {/* History Table */}
      {historyAlerts.length > 0 && (
        <div className="bg-card border border-banking-border rounded-lg overflow-hidden shadow-card">
          <div className="p-4 border-b border-banking-border">
            <h3 className="text-lg font-semibold">📋 Alert History</h3>
            <p className="text-sm text-muted-foreground">
              Showing {historyAlerts.length} alerts from {format(dateRange.from, "MMM dd")} to {format(dateRange.to, "MMM dd")}
            </p>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Alert Date</TableHead>
                <TableHead>KPI Name</TableHead>
                <TableHead>Alert Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyAlerts.map((alert) => (
                <TableRow key={alert.id} className="hover:bg-banking-hover/50">
                  <TableCell className="font-medium">{alert.alertDate}</TableCell>
                  <TableCell>
                    <span className="font-medium text-primary">{alert.kpiName}</span>
                  </TableCell>
                  <TableCell>{alert.alertMessage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {historyAlerts.length === 0 && !isLoading && (
        <div className="bg-card border border-banking-border rounded-lg p-8 text-center shadow-card">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No History Loaded</h3>
          <p className="text-muted-foreground">
            Click "Load History" to fetch sent alerts for the selected date range.
          </p>
        </div>
      )}
    </div>
  );
}