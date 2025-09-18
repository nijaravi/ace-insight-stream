import { Bell, Clock, TrendingUp, DollarSign, Shield, Building2, Zap, BarChart3, Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddDepartmentModal } from "./AddDepartmentModal";
import { EditDepartmentModal } from "./EditDepartmentModal";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Department } from "@/types/kpi";
import adibLogo from "@/assets/adib-logo.png";

interface BankingSidebarProps {
  selectedDepartment: string | null;
  selectedView: "kpi-management" | "alert-curation" | "alerts-dashboard";
  departments: Department[];
  onDepartmentSelect: (departmentId: string) => void;
  onViewSelect: (view: "kpi-management" | "alert-curation" | "alerts-dashboard") => void;
  onAddDepartment: (department: { name: string; description?: string; icon: string }) => void;
  onUpdateDepartment: (id: string, department: { name: string; description?: string; icon: string }) => void;
  onDeleteDepartment: (id: string) => void;
}

export function BankingSidebar({ 
  selectedDepartment, 
  selectedView, 
  departments,
  onDepartmentSelect, 
  onViewSelect, 
  onAddDepartment,
  onUpdateDepartment,
  onDeleteDepartment
}: BankingSidebarProps) {
  const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false);
  const [editDepartmentModalOpen, setEditDepartmentModalOpen] = useState(false);
  const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);

  const handleAddDepartment = (departmentData: { name: string; description?: string; icon: string }) => {
    onAddDepartment(departmentData);
    setAddDepartmentModalOpen(false);
  };

  const handleEditDepartment = (department: Department) => {
    setDepartmentToEdit(department);
    setEditDepartmentModalOpen(true);
  };

  const handleUpdateDepartment = (id: string, departmentData: { name: string; description?: string; icon: string }) => {
    onUpdateDepartment(id, departmentData);
    setEditDepartmentModalOpen(false);
    setDepartmentToEdit(null);
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
                <div
                  key={department.id}
                  className={cn(
                    "relative w-full flex items-center justify-between gap-3 p-3 rounded-lg transition-all duration-200 group",
                    "hover:bg-banking-sidebar-accent/10",
                    isSelected && "bg-banking-sidebar-accent text-white shadow-glow"
                  )}
                >
                  <button
                    onClick={() => {
                      onDepartmentSelect(department.id);
                      onViewSelect("kpi-management");
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0",
                      isSelected ? "bg-white/20" : "bg-white/10"
                    )}>
                      <span className="text-lg">{department.icon}</span>
                    </div>
                    <span className="font-medium text-sm truncate">{department.name}</span>
                  </button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md flex-shrink-0",
                          "hover:bg-white/10",
                          isSelected && "text-white hover:bg-white/20"
                        )}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-48 bg-background border shadow-md z-50"
                      sideOffset={5}
                    >
                      <DropdownMenuItem onClick={() => handleEditDepartment(department)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Department
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteDepartment(department.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Department
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
          <h3 className="text-sm font-semibold text-banking-sidebar-foreground/70 uppercase tracking-wide flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Alerts Dashboard
          </h3>
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
            <span className="font-medium text-sm">Sent Alerts History</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-banking-border/20">
        <div className="flex items-center gap-3 bg-banking-sidebar-accent/10 rounded-lg px-3 py-2">
          <span className="text-xs text-banking-sidebar-foreground/70">Powered by ACE</span>
          <img 
            src={adibLogo} 
            alt="ADIB Bank Logo" 
            className="h-4 w-auto opacity-80"
          />
        </div>
      </div>

      <AddDepartmentModal
        open={addDepartmentModalOpen}
        onOpenChange={setAddDepartmentModalOpen}
        onAddDepartment={handleAddDepartment}
      />
      
      <EditDepartmentModal
        open={editDepartmentModalOpen}
        onOpenChange={setEditDepartmentModalOpen}
        department={departmentToEdit}
        onUpdateDepartment={handleUpdateDepartment}
      />
    </div>
  );
}