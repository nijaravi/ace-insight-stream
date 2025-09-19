import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CalendarIcon, Search, Eye, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";

interface SentAlert {
  id: string;
  date: string;
  department: string;
  kpiName: string;
  alertSummary: string;
  recipients: string[];
  triggeredBy: "Manual" | "Automated";
  comments?: string;
  alertDate: Date;
  fullContent?: string;
}

const mockAlerts: SentAlert[] = [
  {
    id: "1",
    date: "2025-09-16",
    department: "Operations",
    kpiName: "Branch Wait Time",
    alertSummary: "Mall Branch breached SLA (28 mins avg)",
    recipients: ["ops-head@adib.ae", "branch.manager@adib.ae"],
    triggeredBy: "Manual",
    comments: "Breached SLA during peak hours",
    alertDate: new Date("2025-09-16T10:30:00"),
    fullContent: "Critical Alert: Branch Wait Time Exceeded\n\nThe Mall Branch has exceeded the acceptable wait time SLA with an average of 28 minutes during peak hours (10:00-12:00). This represents a 180% increase from the standard 10-minute SLA.\n\nImmediate action required to address staffing levels and queue management."
  },
  {
    id: "2", 
    date: "2025-09-15",
    department: "Risk & Compliance",
    kpiName: "Fraud Detection",
    alertSummary: "Unusual transaction patterns detected",
    recipients: ["security@adib.ae", "risk@adib.ae"],
    triggeredBy: "Automated",
    comments: "",
    alertDate: new Date("2025-09-15T14:22:00"),
    fullContent: "Automated Fraud Alert\n\nOur AI systems have detected unusual transaction patterns in the Dubai Main Branch. Multiple high-value transactions from new accounts within a 2-hour window. Security team has been notified for immediate investigation."
  },
  {
    id: "3",
    date: "2025-09-14",
    department: "Financial", 
    kpiName: "Deposit Balances",
    alertSummary: "Significant deposit withdrawals in Abu Dhabi region",
    recipients: ["treasury@adib.ae", "finance@adib.ae"],
    triggeredBy: "Manual",
    comments: "Large corporate withdrawal",
    alertDate: new Date("2025-09-14T09:15:00"),
    fullContent: "Treasury Alert: Large Deposit Withdrawal\n\nA significant withdrawal of AED 50M has been processed from corporate account AC-789123. This represents 15% of the branch's total deposits. Treasury team should monitor liquidity levels and prepare for potential additional withdrawals."
  },
  {
    id: "4",
    date: "2025-09-13",
    department: "Operations",
    kpiName: "ATM Downtime", 
    alertSummary: "Multiple ATM outages across Sharjah branches",
    recipients: ["it-ops@adib.ae", "branch.ops@adib.ae"],
    triggeredBy: "Automated",
    comments: "Network connectivity issue",
    alertDate: new Date("2025-09-13T16:45:00"),
    fullContent: "Critical System Alert: ATM Network Failure\n\n5 ATMs in Sharjah region are currently offline due to network connectivity issues. Estimated downtime: 2-4 hours. Alternative cash withdrawal options have been communicated to affected branches."
  },
  {
    id: "5",
    date: "2025-09-12",
    department: "Sales & Marketing",
    kpiName: "Card Sales Drop",
    alertSummary: "Credit card applications down 25% this week",
    recipients: ["sales@adib.ae", "marketing@adib.ae"],
    triggeredBy: "Manual", 
    comments: "Market competition impact",
    alertDate: new Date("2025-09-12T11:20:00"),
    fullContent: "Sales Performance Alert\n\nCredit card applications have decreased by 25% compared to last week. Primary factors include increased market competition and promotional campaigns from competitors. Recommend immediate review of current offers and marketing strategy."
  }
];

const departments = ["Operations", "Financial", "Risk & Compliance", "Sales & Marketing"];

export function SentAlertsDashboard() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date()
  });
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedKpi, setSelectedKpi] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlert, setSelectedAlert] = useState<SentAlert | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const alertsPerPage = 10;

  // Filter alerts based on current filters
  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesDateRange = alert.alertDate >= dateRange.from && alert.alertDate <= dateRange.to;
    const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(alert.department);
    const matchesKpi = !selectedKpi || alert.kpiName.toLowerCase().includes(selectedKpi.toLowerCase());

    return matchesDateRange && matchesDepartment && matchesKpi;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage);
  const startIndex = (currentPage - 1) * alertsPerPage;
  const endIndex = startIndex + alertsPerPage;
  const paginatedAlerts = filteredAlerts.slice(startIndex, endIndex);

  const handleDepartmentChange = (department: string, checked: boolean) => {
    if (checked) {
      setSelectedDepartments([...selectedDepartments, department]);
    } else {
      setSelectedDepartments(selectedDepartments.filter(d => d !== department));
    }
  };

  const handleViewAlert = (alert: SentAlert) => {
    setSelectedAlert(alert);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="p-8 space-y-8 bg-background">
      {/* Page Header */}
      <div className="space-y-3 pb-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          📊 Alerts Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          View alerts triggered manually or automatically across the platform.
        </p>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-4 h-4" />
            Filters
            {(selectedDepartments.length > 0 || selectedKpi) && (
              <Badge variant="secondary" className="ml-2">
                {[
                  selectedDepartments.length > 0 ? 1 : 0,
                  selectedKpi ? 1 : 0
                ].reduce((a, b) => a + b, 0)} applied
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {/* Single Row: Date Range, Department, KPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
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
                      if (range?.from) {
                        if (range?.to) {
                          setDateRange({ from: range.from, to: range.to });
                        } else {
                          setDateRange({ from: range.from, to: range.from });
                        }
                      }
                    }}
                    numberOfMonths={2}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Department Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Department</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {selectedDepartments.length === 0 
                      ? "All Departments" 
                      : selectedDepartments.length === 1 
                        ? selectedDepartments[0]
                        : `${selectedDepartments.length} selected`
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-2">
                    {departments.map((dept) => (
                      <div key={dept} className="flex items-center space-x-2">
                        <Checkbox
                          id={dept}
                          checked={selectedDepartments.includes(dept)}
                          onCheckedChange={(checked) => 
                            handleDepartmentChange(dept, checked as boolean)
                          }
                        />
                        <label htmlFor={dept} className="text-sm">{dept}</label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* KPI Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">KPI Name</label>
              <Input
                placeholder="Search KPI name..."
                value={selectedKpi}
                onChange={(e) => setSelectedKpi(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            Alerts ({filteredAlerts.length} results)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No alerts found for selected filters</p>
              <p>Try changing the date range or KPI selection</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>KPI Name</TableHead>
                        <TableHead>Alert Detail</TableHead>
                        <TableHead className="w-20">View</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedAlerts.map((alert) => (
                        <TableRow key={alert.id} className="hover:bg-muted/50">
                           <TableCell className="font-mono text-sm">
                             {format(alert.alertDate, "MMM dd, HH:mm")}
                           </TableCell>
                           <TableCell>
                             <Badge variant="outline">{alert.department}</Badge>
                           </TableCell>
                           <TableCell className="font-medium">{alert.kpiName}</TableCell>
                           <TableCell className="max-w-md">
                             {alert.alertSummary}
                           </TableCell>
                           <TableCell className="text-center">
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => handleViewAlert(alert)}
                               className="h-8 w-8 p-0"
                             >
                               <Eye className="h-4 w-4" />
                             </Button>
                           </TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(currentPage - 1)}
                          />
                        </PaginationItem>
                      )}
                      
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              isActive={pageNum === currentPage}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(currentPage + 1)}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* View Alert Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Alert Details</DialogTitle>
            <DialogDescription>
              {selectedAlert && (
                <>
                  {selectedAlert.kpiName} • {selectedAlert.department} • {format(selectedAlert.alertDate, "PPP 'at' p")}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Alert Summary</h4>
                <p className="text-sm bg-muted p-3 rounded">{selectedAlert.alertSummary}</p>
              </div>
              
              {selectedAlert.fullContent && (
                <div>
                  <h4 className="font-medium mb-2">Full Content</h4>
                  <pre className="text-sm bg-muted p-3 rounded whitespace-pre-wrap">
                    {selectedAlert.fullContent}
                  </pre>
                </div>
              )}
              
              <div>
                <h4 className="font-medium mb-2">Recipients</h4>
                <div className="space-y-1">
                  {selectedAlert.recipients.map((email, idx) => (
                    <div key={idx} className="text-sm font-mono bg-muted/50 p-2 rounded">
                      {email}
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedAlert.comments && (
                <div>
                  <h4 className="font-medium mb-2">Comments</h4>
                  <p className="text-sm bg-muted p-3 rounded">{selectedAlert.comments}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}