import { useState } from "react";
import { Bell } from "lucide-react";
import { KpiManagementTable } from "@/components/KpiManagementTable";
import { AlertCurationPanel } from "@/components/AlertCurationPanel"; 
import { SentAlertsDashboard } from "@/components/SentAlertsDashboard";
import { BankingSidebar } from "@/components/BankingSidebar";
import { useDepartments, useAddDepartment, useUpdateDepartment, useDeleteDepartment } from "@/hooks/useDepartments";
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
  const deleteDepartmentMutation = useDeleteDepartment();
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

  const handleDeleteDepartment = async (id: string) => {
    try {
      await deleteDepartmentMutation.mutateAsync(id);
      toast.success("Department deleted successfully");
      
      // Clear selection if the deleted department was selected
      if (selectedDepartment === id) {
        setSelectedDepartment(null);
      }
    } catch (error) {
      toast.error("Failed to delete department");
      console.error("Error deleting department:", error);
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
      <div className="flex-1 bg-banking-panel flex items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl mx-auto px-8">
          <h2 className="text-5xl font-bold mb-8 text-foreground">Welcome to ACE Alerting Platform</h2>
          <div className="text-xl text-muted-foreground leading-relaxed space-y-6">
            <p className="mb-6">
              Your comprehensive solution for monitoring and managing organizational key performance indicators with intelligent alert systems.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-foreground">KPI Management</h3>
                <p className="text-lg text-muted-foreground">
                  Configure departments, define KPIs, and set performance thresholds to monitor your organization's key metrics effectively.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-foreground">Check Alerts & Send</h3>
                <p className="text-lg text-muted-foreground">
                  Manually curate and review alerts before sending, ensuring accurate and timely notifications to stakeholders.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-foreground">Alerts Dashboard</h3>
                <p className="text-lg text-muted-foreground">
                  Track and analyze historical alert data to identify trends and optimize your monitoring strategy.
                </p>
              </div>
            </div>
          </div>
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
        onDeleteDepartment={handleDeleteDepartment}
      />
      <div className="flex-1 pl-8 pt-6">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default Index;
