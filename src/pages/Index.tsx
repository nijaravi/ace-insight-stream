import { useState } from "react";
import { KpiManagementTable } from "@/components/KpiManagementTable";
import { AlertCurationPanel } from "@/components/AlertCurationPanel"; 
import { SentAlertsDashboard } from "@/components/SentAlertsDashboard";
import { BankingSidebar } from "@/components/BankingSidebar";

const Index = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<"kpi-management" | "alert-curation" | "alerts-dashboard">("kpi-management");
  
  // Mock KPI data - this would come from your backend
  const [kpiData, setKpiData] = useState({
    operations: [
      { id: "branch-wait", name: "Branch Wait Time", domain: "operations", alertsThisMonth: 12, isActive: true, lastAlertSent: "2025-09-16" },
      { id: "atm-downtime", name: "ATM Downtime", domain: "operations", alertsThisMonth: 5, isActive: true, lastAlertSent: "2025-09-15" }
    ],
    sales: [
      { id: "card-sales", name: "Card Sales Drop", domain: "sales", alertsThisMonth: 8, isActive: false, lastAlertSent: "2025-09-12" }
    ],
    financial: [
      { id: "deposits", name: "Deposit Balances", domain: "financial", alertsThisMonth: 3, isActive: true, lastAlertSent: "2025-09-14" }
    ],
    compliance: [
      { id: "fraud-detection", name: "Fraud Detection", domain: "compliance", alertsThisMonth: 15, isActive: true, lastAlertSent: "2025-09-16" }
    ]
  });

  const handleKpiUpdate = (kpiId: string, updates: any) => {
    // Update KPI logic here
    console.log("Updating KPI:", kpiId, updates);
  };

  const handleAddKpi = (kpiData: any) => {
    // Add new KPI logic here
    console.log("Adding KPI:", kpiData);
  };

  const renderMainContent = () => {
    if (selectedView === "alert-curation") {
      return <AlertCurationPanel />;
    }
    
    if (selectedView === "alerts-dashboard") {
      return <SentAlertsDashboard />;
    }
    
    if (selectedView === "kpi-management" && selectedDepartment) {
      const departmentKpis = kpiData[selectedDepartment as keyof typeof kpiData] || [];
      const departmentNames = {
        operations: "Operations",
        sales: "Sales & Marketing", 
        financial: "Financial",
        compliance: "Risk & Compliance"
      };
      
      return (
        <KpiManagementTable
          departmentId={selectedDepartment}
          departmentName={departmentNames[selectedDepartment as keyof typeof departmentNames]}
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

  return (
    <div className="min-h-screen bg-background flex">
      <BankingSidebar 
        selectedDepartment={selectedDepartment}
        selectedView={selectedView}
        onDepartmentSelect={setSelectedDepartment}
        onViewSelect={setSelectedView}
      />
      {renderMainContent()}
    </div>
  );
};

export default Index;

export default Index;
