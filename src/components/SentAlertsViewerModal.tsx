import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CalendarIcon, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";

interface SentMail {
  id: string;
  subject: string;
  body: string;
  sentDate: string;
  alertsIncluded: number;
  alertsList: string[];
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

  const [expandedMails, setExpandedMails] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const mailsPerPage = 5;

  // Mock data for demonstration - representing sent mails from alert_history
  const mockMails: SentMail[] = [
    {
      id: "mail-1",
      subject: "ATM Downtime Alert - Critical Issues Detected",
      sentDate: "2025-09-16 14:30",
      alertsIncluded: 2,
      alertsList: [
        "ALT-001: Mall Branch breached wait time SLA (28 mins avg)",
        "ALT-004: City Center Branch system degradation detected"
      ],
      body: `Dear Operations Team,

This is an automated alert regarding critical issues detected in the ATM Downtime monitoring system.

**ALERTS INCLUDED (2):**
• ALT-001: Mall Branch breached wait time SLA (28 mins avg)
• ALT-004: City Center Branch system degradation detected

**RECOMMENDATIONS:**
1. Immediate investigation required for Mall Branch
2. Deploy additional support staff to affected locations
3. Monitor system performance for next 2 hours

**IMPACT:**
- Customer Experience: High
- Service Level: Critical

Please take immediate action to resolve these issues.

Best regards,
ACE Alerting Platform`
    },
    {
      id: "mail-2",
      subject: "ATM Downtime Alert - Performance Issues",
      sentDate: "2025-09-15 09:15",
      alertsIncluded: 1,
      alertsList: [
        "ALT-002: Downtown Branch showing elevated wait times (22 mins)"
      ],
      body: `Dear Operations Team,

This is an automated alert regarding performance issues detected in the ATM Downtime monitoring system.

**ALERTS INCLUDED (1):**
• ALT-002: Downtown Branch showing elevated wait times (22 mins)

**RECOMMENDATIONS:**
1. Review branch staffing levels
2. Check for any system bottlenecks
3. Consider implementing queue management improvements

**IMPACT:**
- Customer Experience: Medium
- Service Level: Warning

Please review and take appropriate action.

Best regards,
ACE Alerting Platform`
    },
    {
      id: "mail-3",
      subject: "ATM Downtime Alert - Threshold Warning",
      sentDate: "2025-09-14 16:45",
      alertsIncluded: 3,
      alertsList: [
        "ALT-003: Airport Branch wait time approaching threshold (18 mins)",
        "ALT-005: Marina Branch peak hour congestion",
        "ALT-006: Business Bay Branch service delay"
      ],
      body: `Dear Operations Team,

This is an automated alert regarding threshold warnings detected in the ATM Downtime monitoring system.

**ALERTS INCLUDED (3):**
• ALT-003: Airport Branch wait time approaching threshold (18 mins)
• ALT-005: Marina Branch peak hour congestion
• ALT-006: Business Bay Branch service delay

**RECOMMENDATIONS:**
1. Monitor branches closely during peak hours
2. Prepare contingency plans if thresholds are exceeded
3. Review historical patterns for better resource allocation

**IMPACT:**
- Customer Experience: Low to Medium
- Service Level: Monitoring Required

Please keep these branches under observation.

Best regards,
ACE Alerting Platform`
    },
  ];

  // Filter mails by date range
  const filteredMails = mockMails.filter(mail => {
    const mailDate = new Date(mail.sentDate);
    return mailDate >= dateRange.from && mailDate <= dateRange.to;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMails.length / mailsPerPage);
  const startIndex = (currentPage - 1) * mailsPerPage;
  const paginatedMails = filteredMails.slice(startIndex, startIndex + mailsPerPage);

  const toggleMailExpanded = (mailId: string) => {
    setExpandedMails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(mailId)) {
        newSet.delete(mailId);
      } else {
        newSet.add(mailId);
      }
      return newSet;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📧 Sent Mails History – {kpi.name}
          </DialogTitle>
          <DialogDescription>
            View all mails that have been sent for this KPI, filtered by date range.
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
            <Badge variant="secondary">{filteredMails.length} mails found</Badge>
          </div>

          {/* Mails Feed */}
          {paginatedMails.length > 0 ? (
            <div className="space-y-3">
              {paginatedMails.map((mail) => {
                const isExpanded = expandedMails.has(mail.id);
                return (
                  <Collapsible
                    key={mail.id}
                    open={isExpanded}
                    onOpenChange={() => toggleMailExpanded(mail.id)}
                  >
                    <div className="border rounded-lg overflow-hidden bg-card">
                      <CollapsibleTrigger asChild>
                        <button className="w-full p-4 hover:bg-muted/50 transition-colors text-left">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <Mail className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-semibold text-sm">{mail.subject}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    Alerts Included: {mail.alertsIncluded}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {format(new Date(mail.sentDate), "MMM dd, yyyy 'at' HH:mm")}
                                </p>
                              </div>
                            </div>
                            <div className="shrink-0">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="border-t bg-muted/30 p-4 space-y-4">
                          {/* Alerts List */}
                          <div>
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                              Included Alerts
                            </h5>
                            <ul className="space-y-1">
                              {mail.alertsList.map((alert, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-2">
                                  <span className="text-muted-foreground">•</span>
                                  <span>{alert}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Mail Body */}
                          <div>
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                              Full Mail Content
                            </h5>
                            <div className="bg-background border rounded-lg p-4">
                              <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                                {mail.body}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground border rounded-lg">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No mails found</p>
              <p>No mails were sent for this KPI in the selected date range</p>
            </div>
          )}

          {/* Pagination */}
          {filteredMails.length > mailsPerPage && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ← Previous
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next →
              </Button>
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