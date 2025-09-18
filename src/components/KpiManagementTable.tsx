import { useState } from "react";
import { Edit, Eye, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AISummarizerModal } from "./AISummarizerModal";
import { EmailSettingsModal } from "./EmailSettingsModal";
import { SentAlertsViewerModal } from "./SentAlertsViewerModal";
import { AddKpiModal } from "./AddKpiModal";

import type { KpiTableData } from "@/types/kpi";

interface KpiManagementTableProps {
  departmentId: string;
  departmentName: string;
  kpis: KpiTableData[];
  onKpiUpdate: (kpiId: string, updates: Partial<KpiTableData>) => void;
  onAddKpi: (kpiData: any) => void;
}

export function KpiManagementTable({ 
  departmentId, 
  departmentName, 
  kpis, 
  onKpiUpdate,
  onAddKpi 
}: KpiManagementTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"name" | "lastSent" | "alertCount">("name");
  
  // Modal states
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [alertsViewerOpen, setAlertsViewerOpen] = useState(false);
  const [addKpiModalOpen, setAddKpiModalOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<KpiTableData | null>(null);

  // Filter and sort KPIs
  const filteredKpis = kpis
    .filter(kpi => {
      const matchesSearch = kpi.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "active" && kpi.isActive) || 
        (statusFilter === "inactive" && !kpi.isActive);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "lastSent":
          return (a.lastAlertSent || "").localeCompare(b.lastAlertSent || "");
        case "alertCount":
          return b.alertsThisMonth - a.alertsThisMonth;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleAIModalOpen = (kpi: KpiTableData) => {
    setSelectedKpi(kpi);
    setAiModalOpen(true);
  };

  const handleEmailModalOpen = (kpi: KpiTableData) => {
    setSelectedKpi(kpi);
    setEmailModalOpen(true);
  };

  const handleAlertsViewerOpen = (kpi: KpiTableData) => {
    setSelectedKpi(kpi);
    setAlertsViewerOpen(true);
  };

  const handleActiveToggle = (kpiId: string, isActive: boolean) => {
    onKpiUpdate(kpiId, { isActive });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">🏢 {departmentName}</h2>
          <p className="text-muted-foreground">Manage KPIs and monitoring configurations</p>
        </div>
        <Button onClick={() => setAddKpiModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add KPI
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search KPI names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="lastSent">Last Sent Date</SelectItem>
                <SelectItem value="alertCount">Alert Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KPI Table */}
      <Card>
        <CardHeader>
          <CardTitle>KPIs ({filteredKpis.length} total)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>KPI Name</TableHead>
                  <TableHead>AI Summarizer</TableHead>
                  <TableHead>Email Settings</TableHead>
                  <TableHead>Last Alert Sent</TableHead>
                  <TableHead>Alerts This Month</TableHead>
                  <TableHead>Sent Alerts</TableHead>
                  <TableHead>Active Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKpis.map((kpi) => (
                  <TableRow key={kpi.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{kpi.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {/* Edit KPI name */}}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAIModalOpen(kpi)}
                        className="h-8 px-2 gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Configure
                      </Button>
                    </TableCell>
                    
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEmailModalOpen(kpi)}
                        className="h-8 px-2 gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Configure
                      </Button>
                    </TableCell>
                    
                    <TableCell className="font-mono text-sm">
                      {kpi.lastAlertSent ? kpi.lastAlertSent : "Never"}
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="secondary">{kpi.alertsThisMonth}</Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAlertsViewerOpen(kpi)}
                        className="h-8 px-2 gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={kpi.isActive}
                          onCheckedChange={(checked) => 
                            handleActiveToggle(kpi.id, checked as boolean)
                          }
                        />
                        <span className={cn(
                          "text-sm",
                          kpi.isActive ? "text-green-600" : "text-muted-foreground"
                        )}>
                          {kpi.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedKpi && (
        <>
          <AISummarizerModal
            open={aiModalOpen}
            onOpenChange={setAiModalOpen}
            kpi={selectedKpi}
            onSave={(updates) => {
              onKpiUpdate(selectedKpi.id, updates);
              setAiModalOpen(false);
            }}
          />
          
          <EmailSettingsModal
            open={emailModalOpen}
            onOpenChange={setEmailModalOpen}
            kpi={selectedKpi}
            onSave={(updates) => {
              onKpiUpdate(selectedKpi.id, updates);
              setEmailModalOpen(false);
            }}
          />
          
          <SentAlertsViewerModal
            open={alertsViewerOpen}
            onOpenChange={setAlertsViewerOpen}
            kpi={selectedKpi}
          />
        </>
      )}
      
      <AddKpiModal
        isOpen={addKpiModalOpen}
        onClose={() => setAddKpiModalOpen(false)}
        onAddKpi={(kpiData) => {
          onAddKpi({ ...kpiData, domain: departmentId });
          setAddKpiModalOpen(false);
        }}
        preselectedDomain={departmentId}
      />
    </div>
  );
}