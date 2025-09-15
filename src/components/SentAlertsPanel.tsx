import { useState } from "react";
import { Calendar, Download, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SentAlert {
  id: string;
  sentDate: string;
  recipients: string[];
  alertCount: number;
  sentBy: string;
  severity: "critical" | "warning" | "info";
  subject: string;
}

const mockSentAlerts: SentAlert[] = [
  {
    id: "1",
    sentDate: "2024-01-15 14:30",
    recipients: ["branch.manager@adib.ae", "operations@adib.ae"],
    alertCount: 3,
    sentBy: "Ahmad Al-Mansoori",
    severity: "critical",
    subject: "Alert: Branch Wait Time Exceeded"
  },
  {
    id: "2", 
    sentDate: "2024-01-14 09:15",
    recipients: ["operations@adib.ae"],
    alertCount: 1,
    sentBy: "Sarah Al-Zahra",
    severity: "warning", 
    subject: "Alert: Card Sales Performance"
  },
  {
    id: "3",
    sentDate: "2024-01-13 16:45",
    recipients: ["branch.manager@adib.ae", "regional@adib.ae", "analytics@adib.ae"],
    alertCount: 5,
    sentBy: "Mohammed Hassan",
    severity: "critical",
    subject: "Alert: Multiple KPI Breaches"
  },
  {
    id: "4",
    sentDate: "2024-01-12 11:20",
    recipients: ["operations@adib.ae"],
    alertCount: 2,
    sentBy: "Fatima Al-Rashid",
    severity: "info",
    subject: "Alert: Deposit Balance Update"
  }
];

interface SentAlertsPanelProps {
  selectedKpi: string;
}

export function SentAlertsPanel({ selectedKpi }: SentAlertsPanelProps) {
  const [sentAlerts] = useState<SentAlert[]>(mockSentAlerts);
  const [dateRange, setDateRange] = useState("7");
  const [severityFilter, setSeverityFilter] = useState("all");

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: "bg-destructive text-destructive-foreground",
      warning: "bg-gold text-gold-foreground",
      info: "bg-accent text-accent-foreground"
    };
    return variants[severity as keyof typeof variants] || variants.info;
  };

  const formatRecipients = (recipients: string[]) => {
    if (recipients.length <= 2) {
      return recipients.join(", ");
    }
    return `${recipients.slice(0, 2).join(", ")} +${recipients.length - 2} more`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            📜 Sent Alerts History
          </h2>
          <p className="text-muted-foreground">View and manage previously sent alerts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-banking-border rounded-lg p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last 24 hours</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="sm" className="gap-2 ml-auto">
            <Download className="w-4 h-4" />
            Export History
          </Button>
        </div>
      </div>

      {/* Sent Alerts Table */}
      <div className="bg-card border border-banking-border rounded-lg overflow-hidden shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Sent Date</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead># Alerts</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Sent By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sentAlerts.map((alert) => (
              <TableRow key={alert.id} className="hover:bg-banking-hover/50">
                <TableCell className="font-medium">
                  <div className="text-sm">
                    <div>{alert.sentDate.split(' ')[0]}</div>
                    <div className="text-muted-foreground text-xs">{alert.sentDate.split(' ')[1]}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm max-w-60 truncate" title={alert.recipients.join(', ')}>
                    {formatRecipients(alert.recipients)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-sm max-w-80 truncate" title={alert.subject}>
                    {alert.subject}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {alert.alertCount}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getSeverityBadge(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{alert.sentBy}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Timeline Visual (Optional Enhancement) */}
      <div className="bg-card border border-banking-border rounded-lg p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4 text-primary">Alert Timeline</h3>
        <div className="space-y-4">
          {sentAlerts.slice(0, 3).map((alert, index) => (
            <div key={alert.id} className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${
                alert.severity === 'critical' ? 'bg-destructive' :
                alert.severity === 'warning' ? 'bg-gold' : 'bg-accent'
              }`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{alert.subject}</span>
                  <span className="text-xs text-muted-foreground">{alert.sentDate}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {alert.alertCount} alerts sent to {alert.recipients.length} recipient(s)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}