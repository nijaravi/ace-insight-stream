import { useState } from "react";
import { BankingSidebar } from "@/components/BankingSidebar";
import { MainContent } from "@/components/MainContent";
import { SentAlertsDashboard } from "@/components/SentAlertsDashboard";

export interface KpiData {
  id: string;
  name: string;
  domain: string;
  description?: string;
  alertTableName: string;
  defaultEmailTo: string[];
  defaultEmailCC: string[];
  defaultSubject: string;
  defaultBody: string;
  defaultFooter: string;
  isFavorite: boolean;
  identifier?: string;
  severityTagging: boolean;
  ownerDepartment?: string;
  icon?: any;
  severity?: string;
  status?: string;
  isAutomationEnabled?: boolean;
  automationTime?: string;
}

const Index = () => {
  const [selectedKpi, setSelectedKpi] = useState<KpiData | null>(null);
  const [activeTab, setActiveTab] = useState("check-send");
  const [showDashboard, setShowDashboard] = useState(false);

  const handleNavigateToTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleKpiSelect = (kpi: KpiData) => {
    setSelectedKpi(kpi);
    setShowDashboard(false); // Hide dashboard when selecting a KPI
  };

  const handleNavigateToDashboard = () => {
    setShowDashboard(true);
    setSelectedKpi(null); // Clear KPI selection when viewing dashboard
  };

  return (
    <div className="min-h-screen bg-background flex">
      <BankingSidebar 
        selectedKpi={selectedKpi} 
        onKpiSelect={handleKpiSelect}
        onNavigateToTab={handleNavigateToTab}
        onNavigateToDashboard={handleNavigateToDashboard}
      />
      {showDashboard ? (
        <SentAlertsDashboard />
      ) : (
        <MainContent selectedKpi={selectedKpi} activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
};

export default Index;
