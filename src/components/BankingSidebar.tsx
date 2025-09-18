import { Bell, Clock, TrendingUp, DollarSign, Shield, Building2, Zap, BarChart3, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddDepartmentModal } from "./AddDepartmentModal";
import { useState } from "react";
import type { Department } from "@/types/kpi";

interface BankingSidebarProps {
  selectedDepartment: string | null;
  selectedView: "kpi-management" | "alert-curation" | "alerts-dashboard";
  departments: Department[];
  onDepartmentSelect: (departmentId: string) => void;
  onViewSelect: (view: "kpi-management" | "alert-curation" | "alerts-dashboard") => void;
  onAddDepartment: (department: { name: string; description?: string; icon: string }) => void;
}

export function BankingSidebar({ 
  selectedDepartment, 
  selectedView, 
  departments,
  onDepartmentSelect, 
  onViewSelect, 
  onAddDepartment 
}: BankingSidebarProps) {
  const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false);

  const handleAddDepartment = (departmentData: { name: string; description?: string; icon: string }) => {
    onAddDepartment(departmentData);
    setAddDepartmentModalOpen(false);
  };

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
        {/* Check Alerts & Send Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-banking-sidebar-foreground/70 uppercase tracking-wide flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Check Alerts & Send
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

        {/* KPI Management Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-banking-sidebar-foreground/70 uppercase tracking-wide flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            KPI Management
          </h3>
          <div className="space-y-2">
            {departments.map((department) => {
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
                    <span className="text-lg">{department.icon}</span>
                  </div>
                  <span className="font-medium text-sm">{department.name}</span>
                </button>
              );
            })}
            
            {/* Add Department Button */}
            <button
              onClick={() => setAddDepartmentModalOpen(true)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                "hover:bg-banking-sidebar-accent/5 border-2 border-dashed border-banking-sidebar-accent/30",
                "text-banking-sidebar-foreground/70 hover:text-banking-sidebar-foreground"
              )}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-banking-sidebar-accent/10">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">Add Department</span>
            </button>
          </div>
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

      <AddDepartmentModal
        open={addDepartmentModalOpen}
        onOpenChange={setAddDepartmentModalOpen}
        onAddDepartment={handleAddDepartment}
      />
    </div>
  );
}