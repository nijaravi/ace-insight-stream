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
        alert_table_name: "ace_alerts.branch_wait_time_alerts",
        default_email_to: ["ops@adib.ae"],
        default_email_cc: [],
        default_subject: "Branch Wait Time Alert",
        default_body: "Alert details...",
        default_footer: "ADIB Team",
        alerts_this_month: 12, 
        is_active: true, 
        last_alert_sent: "2025-09-16",
        owner_department_id: "operations"
      },
      { 
        id: "atm-downtime", 
        name: "ATM Downtime", 
        domain: "operations", 
        description: "Track ATM availability",
        alert_table_name: "ace_alerts.atm_downtime_alerts",
        default_email_to: ["it@adib.ae"],
        default_email_cc: [],
        default_subject: "ATM Downtime Alert",
        default_body: "ATM Alert details...",
        default_footer: "ADIB Team",
        alerts_this_month: 5, 
        is_active: true, 
        last_alert_sent: "2025-09-15",
        owner_department_id: "it-operations"
      }
    ],
    sales: [
      { 
        id: "card-sales", 
        name: "Card Sales Drop", 
        domain: "sales", 
        description: "Monitor card sales performance",
        alert_table_name: "ace_alerts.card_sales_alerts",
        default_email_to: ["sales@adib.ae"],
        default_email_cc: [],
        default_subject: "Card Sales Alert",
        default_body: "Sales Alert details...",
        default_footer: "ADIB Team",
        alerts_this_month: 8, 
        is_active: false, 
        last_alert_sent: "2025-09-12",
        owner_department_id: "sales"
      }
    ],
    financial: [
      { 
        id: "deposits", 
        name: "Deposit Balances", 
        domain: "financial", 
        description: "Monitor deposit balances",
        alert_table_name: "ace_alerts.deposit_balance_alerts",
        default_email_to: ["finance@adib.ae"],
        default_email_cc: [],
        default_subject: "Deposit Balance Alert",
        default_body: "Finance Alert details...",
        default_footer: "ADIB Team",
        alerts_this_month: 3, 
        is_active: true, 
        last_alert_sent: "2025-09-14",
        owner_department_id: "treasury"
      }
    ],
    compliance: [
      { 
        id: "fraud-detection", 
        name: "Fraud Detection", 
        domain: "compliance", 
        description: "Monitor fraud detection metrics",
        alert_table_name: "ace_alerts.fraud_detection_alerts",
        default_email_to: ["security@adib.ae"],
        default_email_cc: [],
        default_subject: "Fraud Detection Alert",
        default_body: "Security Alert details...",
        default_footer: "ADIB Team",
        alerts_this_month: 15, 
        is_active: true, 
        last_alert_sent: "2025-09-16",
        owner_department_id: "security"
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

  const handleAddDepartment = (department: { id: string; name: string; icon: any }) => {
    // Add new department logic here
    console.log("Adding department:", department);
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
        onAddDepartment={handleAddDepartment}
      />
      <div className="flex-1 pl-8 pt-6">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default Index;
