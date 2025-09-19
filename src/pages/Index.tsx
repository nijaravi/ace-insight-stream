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
        <div className="text-center max-w-6xl mx-auto px-8">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-accent rounded-3xl mb-8 shadow-lg">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-lg"></div>
              </div>
            </div>
            <h2 className="text-6xl font-bold mb-6 text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Welcome to ACE Alerting Platform
            </h2>
            <p className="text-2xl text-muted-foreground/80 leading-relaxed max-w-3xl mx-auto">
              Your comprehensive solution for monitoring and managing organizational key performance indicators with intelligent alert systems.
            </p>
          </div>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">KPI Management</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Configure departments, define KPIs, and set performance thresholds to monitor your organization's key metrics effectively.
                </p>
              </div>
            </div>
            
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9.757 14.243l7.07-7.071a1 1 0 011.414 0l2.122 2.122a1 1 0 010 1.414l-7.07 7.071L9.757 14.243z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Check Alerts & Send</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Manually curate and review alerts before sending, ensuring accurate and timely notifications to stakeholders.
                </p>
              </div>
            </div>
            
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Alerts Dashboard</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Track and analyze historical alert data to identify trends and optimize your monitoring strategy.
                </p>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="mt-16">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground/60 bg-white/5 rounded-full px-6 py-3 border border-white/10">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Select a section from the sidebar to get started
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
