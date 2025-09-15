import { useState } from "react";
import { RefreshCw, Mail, Send, Eye, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  date: string;
  entity: string;
  metric: string;
  trend: "up" | "down" | "stable";
  severity: "critical" | "warning" | "info";
  comment: string;
  remark?: string;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    date: "2024-01-15",
    entity: "Downtown Branch",
    metric: "28 mins",
    trend: "up",
    severity: "critical",
    comment: "Exceeds 15min SLA",
  },
  {
    id: "2", 
    date: "2024-01-15",
    entity: "Mall Branch",
    metric: "22 mins",
    trend: "up", 
    severity: "warning",
    comment: "Approaching limit",
  },
  {
    id: "3",
    date: "2024-01-14",
    entity: "Airport Branch", 
    metric: "18 mins",
    trend: "down",
    severity: "warning",
    comment: "Slight improvement",
  },
];

interface AlertsPanelProps {
  selectedKpi: string;
}

export function AlertsPanel({ selectedKpi }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  const [remarks, setRemarks] = useState<Record<string, string>>({});

  const handleAlertSelect = (alertId: string, checked: boolean) => {
    const newSelected = new Set(selectedAlerts);
    if (checked) {
      newSelected.add(alertId);
    } else {
      newSelected.delete(alertId);
    }
    setSelectedAlerts(newSelected);
  };

  const handleRemarkChange = (alertId: string, remark: string) => {
    setRemarks(prev => ({ ...prev, [alertId]: remark }));
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: "bg-destructive text-destructive-foreground",
      warning: "bg-gold text-gold-foreground", 
      info: "bg-accent text-accent-foreground"
    };
    return variants[severity as keyof typeof variants] || variants.info;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return "↗️";
    if (trend === "down") return "↘️";
    return "→";
  };

  const getKpiName = (kpiId: string) => {
    const names = {
      "wait-time": "Branch Wait Time",
      "card-sales": "Card Sales Drop",
      "deposit-balance": "Deposit Balances",
      "customer-satisfaction": "Customer Satisfaction", 
      "transaction-volume": "Transaction Volume",
      "atm-downtime": "ATM Downtime",
      "loan-applications": "Loan Applications"
    };
    return names[kpiId as keyof typeof names] || "Unknown KPI";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">📍 Pending Alerts</h2>
          <p className="text-muted-foreground">{getKpiName(selectedKpi)}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Check Alerts
          </Button>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-card border border-banking-border rounded-lg overflow-hidden shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-12">Select</TableHead>
              <TableHead>Alert Date</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Metric Value</TableHead>
              <TableHead>Trend</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Analyst Remarks</TableHead>
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
                <TableCell className="font-medium">{alert.date}</TableCell>
                <TableCell>{alert.entity}</TableCell>
                <TableCell>
                  <span className="font-mono font-semibold">{alert.metric}</span>
                </TableCell>
                <TableCell>
                  <span className="text-lg">{getTrendIcon(alert.trend)}</span>
                </TableCell>
                <TableCell>
                  <Badge className={getSeverityBadge(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-40 truncate">
                  {alert.comment}
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Add remarks..."
                    value={remarks[alert.id] || ""}
                    onChange={(e) => handleRemarkChange(alert.id, e.target.value)}
                    className="max-w-48"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedAlerts.size} of {alerts.length} alerts selected
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" disabled={selectedAlerts.size === 0}>
            <Eye className="w-4 h-4" />
            Preview Email
          </Button>
          <Button className="gap-2 bg-accent hover:bg-accent/90" disabled={selectedAlerts.size === 0}>
            <Send className="w-4 h-4" />
            Send Selected Alerts
          </Button>
        </div>
      </div>
    </div>
  );
}