import { useState } from "react";
import { KpiManagementTable } from "@/components/KpiManagementTable";
import { AlertCurationPanel } from "@/components/AlertCurationPanel"; 
import { SentAlertsDashboard } from "@/components/SentAlertsDashboard";
import { BankingSidebar } from "@/components/BankingSidebar";
import type { KpiTableData } from "@/types/kpi";

const Index = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<"kpi-management" | "alert-curation" | "alerts-dashboard">("kpi-management");
  
  // Mock KPI data - this would come from your backend
  const [kpiData, setKpiData] = useState<Record<string, KpiTableData[]>>({
    operations: [
      { 
        id: "branch-wait", 
        name: "Branch Wait Time", 
        domain: "operations", 
        description: "Monitor branch wait times",
        alertTableName: "ace_alerts.branch_wait_time_alerts",
        defaultEmailTo: ["ops@adib.ae"],
        defaultEmailCC: [],
        defaultSubject: "Branch Wait Time Alert",
        defaultBody: "Alert details...",
        defaultFooter: "ADIB Team",
        alertsThisMonth: 12, 
        isActive: true, 
        lastAlertSent: "2025-09-16",
        ownerDepartment: "Operations"
      },
      { 
        id: "atm-downtime", 
        name: "ATM Downtime", 
        domain: "operations", 
        description: "Track ATM availability",
        alertTableName: "ace_alerts.atm_downtime_alerts",
        defaultEmailTo: ["it@adib.ae"],
        defaultEmailCC: [],
        defaultSubject: "ATM Downtime Alert",
        defaultBody: "ATM Alert details...",
        defaultFooter: "ADIB Team",
        alertsThisMonth: 5, 
        isActive: true, 
        lastAlertSent: "2025-09-15",
        ownerDepartment: "IT Operations"
      }
    ],
    sales: [
      { 
        id: "card-sales", 
        name: "Card Sales Drop", 
        domain: "sales", 
        description: "Monitor card sales performance",
        alertTableName: "ace_alerts.card_sales_alerts",
        defaultEmailTo: ["sales@adib.ae"],
        defaultEmailCC: [],
        defaultSubject: "Card Sales Alert",
        defaultBody: "Sales Alert details...",
        defaultFooter: "ADIB Team",
        alertsThisMonth: 8, 
        isActive: false, 
        lastAlertSent: "2025-09-12",
        ownerDepartment: "Sales"
      }
    ],
    financial: [
      { 
        id: "deposits", 
        name: "Deposit Balances", 
        domain: "financial", 
        description: "Monitor deposit balances",
        alertTableName: "ace_alerts.deposit_balance_alerts",
        defaultEmailTo: ["finance@adib.ae"],
        defaultEmailCC: [],
        defaultSubject: "Deposit Balance Alert",
        defaultBody: "Finance Alert details...",
        defaultFooter: "ADIB Team",
        alertsThisMonth: 3, 
        isActive: true, 
        lastAlertSent: "2025-09-14",
        ownerDepartment: "Treasury"
      }
    ],
    compliance: [
      { 
        id: "fraud-detection", 
        name: "Fraud Detection", 
        domain: "compliance", 
        description: "Monitor fraud detection metrics",
        alertTableName: "ace_alerts.fraud_detection_alerts",
        defaultEmailTo: ["security@adib.ae"],
        defaultEmailCC: [],
        defaultSubject: "Fraud Detection Alert",
        defaultBody: "Security Alert details...",
        defaultFooter: "ADIB Team",
        alertsThisMonth: 15, 
        isActive: true, 
        lastAlertSent: "2025-09-16",
        ownerDepartment: "Security"
      }
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
      const departmentKpis = kpiData[selectedDepartment] || [];
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
