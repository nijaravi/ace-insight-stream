import { useState } from "react";
import { BankingSidebar } from "@/components/BankingSidebar";
import { MainContent } from "@/components/MainContent";

const Index = () => {
  const [selectedKpi, setSelectedKpi] = useState("wait-time");
  const [activeTab, setActiveTab] = useState("check-send");

  const handleNavigateToTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <BankingSidebar 
        selectedKpi={selectedKpi} 
        onKpiSelect={setSelectedKpi}
        onNavigateToTab={handleNavigateToTab}
      />
      <MainContent selectedKpi={selectedKpi} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
