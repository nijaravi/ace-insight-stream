import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";

interface SentAlert {
  id: string;
  alertId: string;
  alertDetail: string;
  sentDate: string;
  recipients: string[];
  triggerType: "Manual" | "Auto";
}

interface SentAlertsViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpi: {
    id: string;
    name: string;
  };
}

export function SentAlertsViewerModal({ open, onOpenChange, kpi }: SentAlertsViewerModalProps) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  // Mock data for demonstration
  const mockAlerts: SentAlert[] = [
    {
      id: "1",
      alertId: "ALT-001",
      alertDetail: "Mall Branch breached wait time SLA (28 mins avg)",
      sentDate: "2025-09-16 14:30",
      recipients: ["ops-head@adib.ae", "branch.manager@adib.ae"],
      triggerType: "Manual",
    },
    {
      id: "2",
      alertId: "ALT-002", 
      alertDetail: "Downtown Branch showing elevated wait times (22 mins)",
      sentDate: "2025-09-15 09:15",
      recipients: ["ops-head@adib.ae"],
      triggerType: "Auto",
    },
    {
      id: "3",
      alertId: "ALT-003",
      alertDetail: "Airport Branch wait time approaching threshold (18 mins)",
      sentDate: "2025-09-14 16:45",
      recipients: ["ops-head@adib.ae", "branch.manager@adib.ae", "analytics@adib.ae"],
      triggerType: "Manual",
    },
  ];

  // Filter alerts by date range
  const filteredAlerts = mockAlerts.filter(alert => {
    const alertDate = new Date(alert.sentDate);
    return alertDate >= dateRange.from && alertDate <= dateRange.to;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            👁️ Sent Alerts History
            <Badge variant="outline">{kpi.name}</Badge>
          </DialogTitle>
          <DialogDescription>
            View all alerts that have been sent for this KPI, filtered by date range.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date Filter */}
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <span className="text-sm font-medium">Filter by Date Range:</span>
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
                <Calendar
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
            <Badge variant="secondary">{filteredAlerts.length} alerts found</Badge>
          </div>

          {/* Alerts Table */}
          {filteredAlerts.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert ID</TableHead>
                    <TableHead>Alert Detail</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Trigger Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">
                        {alert.alertId}
                      </TableCell>
                      <TableCell className="max-w-md">
                        {alert.alertDetail}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {alert.sentDate}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {alert.recipients.map((email, idx) => (
                            <div key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                              {email}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={alert.triggerType === "Auto" ? "default" : "secondary"}
                        >
                          {alert.triggerType}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground border rounded-lg">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No alerts found</p>
              <p>No alerts were sent for this KPI in the selected date range</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}