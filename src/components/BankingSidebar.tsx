import { Bell, Clock, TrendingUp, DollarSign, Shield, Building2, Zap, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BankingSidebarProps {
  selectedDepartment: string | null;
  selectedView: "kpi-management" | "alert-curation" | "alerts-dashboard";
  onDepartmentSelect: (departmentId: string) => void;
  onViewSelect: (view: "kpi-management" | "alert-curation" | "alerts-dashboard") => void;
}

export function BankingSidebar({ selectedDepartment, selectedView, onDepartmentSelect, onViewSelect }: BankingSidebarProps) {
  const departments = [
    { id: "operations", name: "Operations", icon: Clock },
    { id: "sales", name: "Sales & Marketing", icon: TrendingUp },
    { id: "financial", name: "Financial", icon: DollarSign },
    { id: "compliance", name: "Risk & Compliance", icon: Shield },
  ];

  return (
    <div className="w-80 bg-banking-sidebar text-banking-sidebar-foreground border-r border-banking-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-banking-border/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">ACE Alerting Platform</h1>
            <p className="text-sm text-banking-sidebar-foreground/70">Analytics & Monitoring</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {/* KPI Management Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-banking-sidebar-foreground/70 uppercase tracking-wide flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            KPI Management
          </h3>
          <div className="space-y-2">
            {departments.map((department) => {
              const Icon = department.icon;
              const isSelected = selectedDepartment === department.id && selectedView === "kpi-management";
              
              return (
                <button
                  key={department.id}
                  onClick={() => {
                    onDepartmentSelect(department.id);
                    onViewSelect("kpi-management");
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                    "hover:bg-banking-sidebar-accent/10",
                    isSelected && "bg-banking-sidebar-accent text-white shadow-glow"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    isSelected ? "bg-white/20" : "bg-white/10"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">{department.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alert Curation & Sending Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-banking-sidebar-foreground/70 uppercase tracking-wide flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Alert Curation & Sending
          </h3>
          <button
            onClick={() => onViewSelect("alert-curation")}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
              "hover:bg-banking-sidebar-accent/10",
              selectedView === "alert-curation" && "bg-banking-sidebar-accent text-white shadow-glow"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              selectedView === "alert-curation" ? "bg-white/20" : "bg-white/10"
            )}>
              <Bell className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">Manual Alert Curation</span>
          </button>
        </div>

        {/* Alerts Dashboard Section */}
        <div className="space-y-3">
          <button
            onClick={() => onViewSelect("alerts-dashboard")}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
              "hover:bg-banking-sidebar-accent/10",
              selectedView === "alerts-dashboard" && "bg-banking-sidebar-accent text-white shadow-glow"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              selectedView === "alerts-dashboard" ? "bg-white/20" : "bg-white/10"
            )}>
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">Alerts Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}