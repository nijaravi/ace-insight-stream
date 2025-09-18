import { useState } from "react";
import { KpiManagementTable } from "@/components/KpiManagementTable";
import { AlertCurationPanel } from "@/components/AlertCurationPanel"; 
import { SentAlertsDashboard } from "@/components/SentAlertsDashboard";
import { BankingSidebar } from "@/components/BankingSidebar";
import { useDepartments, useAddDepartment, useUpdateDepartment } from "@/hooks/useDepartments";
import { useKpis, useAddKpi, useUpdateKpi } from "@/hooks/useKpis";
import { toast } from "sonner";
import type { KpiData } from "@/types/kpi";
import adibLogo from "@/assets/adib-logo.png";

const Index = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<"kpi-management" | "alert-curation" | "alerts-dashboard">("kpi-management");
  
  // Fetch departments and KPIs from database
  const { data: departments, isLoading: departmentsLoading } = useDepartments();
  const { data: kpis, isLoading: kpisLoading } = useKpis(selectedDepartment || undefined);
  const addDepartmentMutation = useAddDepartment();
  const updateDepartmentMutation = useUpdateDepartment();
  const addKpiMutation = useAddKpi(); 
  const updateKpiMutation = useUpdateKpi();

  const handleKpiUpdate = async (kpiId: string, updates: Partial<KpiData>) => {
    try {
      await updateKpiMutation.mutateAsync({ id: kpiId, ...updates });
      toast.success("KPI updated successfully");
    } catch (error) {
      toast.error("Failed to update KPI");
      console.error("Error updating KPI:", error);
    }
  };

  const handleAddKpi = async (kpiData: Omit<KpiData, "id" | "created_at" | "updated_at">) => {
    try {
      await addKpiMutation.mutateAsync(kpiData);
      toast.success("KPI added successfully");
    } catch (error) {
      toast.error("Failed to add KPI");
      console.error("Error adding KPI:", error);
    }
  };

  const handleAddDepartment = async (department: { name: string; description?: string; icon: string }) => {
    try {
      await addDepartmentMutation.mutateAsync(department);
      toast.success("Department added successfully");
    } catch (error) {
      toast.error("Failed to add department");
      console.error("Error adding department:", error);
    }
  };

  const handleUpdateDepartment = async (id: string, department: { name: string; description?: string; icon: string }) => {
    try {
      await updateDepartmentMutation.mutateAsync({ id, ...department });
      toast.success("Department updated successfully");
    } catch (error) {
      toast.error("Failed to update department");
      console.error("Error updating department:", error);
    }
  };

  const renderMainContent = () => {
    if (selectedView === "alert-curation") {
      return <AlertCurationPanel />;
    }
    
    if (selectedView === "alerts-dashboard") {
      return <SentAlertsDashboard />;
    }
    
    if (selectedView === "kpi-management" && selectedDepartment) {
      const departmentKpis = kpis || [];
      const selectedDept = departments?.find(d => d.id === selectedDepartment);
      
      if (kpisLoading) {
        return (
          <div className="flex-1 bg-banking-panel p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading KPIs...</p>
            </div>
          </div>
        );
      }
      
      return (
        <KpiManagementTable
          departmentId={selectedDepartment}
          departmentName={selectedDept?.name || "Unknown Department"}
          kpis={departmentKpis}
          onKpiUpdate={handleKpiUpdate}
          onAddKpi={handleAddKpi}
        />
      );
    }
    
    // Default welcome view
    return (
      <div className="flex-1 bg-banking-panel p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to ACE Alerting Platform</h2>
          <p className="text-muted-foreground">Select a department to manage KPIs or choose Alert Curation to review alerts.</p>
        </div>
      </div>
    );
  };

  if (departmentsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <BankingSidebar 
        selectedDepartment={selectedDepartment}
        selectedView={selectedView}
        departments={departments || []}
        onDepartmentSelect={setSelectedDepartment}
        onViewSelect={setSelectedView}
        onAddDepartment={handleAddDepartment}
        onUpdateDepartment={handleUpdateDepartment}
      />
      <div className="flex-1 pl-8 pt-6 relative">
        {renderMainContent()}
        
        {/* Footer */}
        <div className="fixed bottom-4 right-4 flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
          <span className="text-sm text-muted-foreground">Powered by ACE</span>
          <img 
            src={adibLogo} 
            alt="ADIB Bank Logo" 
            className="h-6 w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
