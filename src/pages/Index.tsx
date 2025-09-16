import { useState } from "react";
import { BankingSidebar } from "@/components/BankingSidebar";
import { MainContent } from "@/components/MainContent";

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

  const handleNavigateToTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleKpiSelect = (kpi: KpiData) => {
    setSelectedKpi(kpi);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <BankingSidebar 
        selectedKpi={selectedKpi} 
        onKpiSelect={handleKpiSelect}
        onNavigateToTab={handleNavigateToTab}
      />
      <MainContent selectedKpi={selectedKpi} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
