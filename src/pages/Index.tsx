import { useState } from "react";
import { BankingSidebar } from "@/components/BankingSidebar";
import { MainContent } from "@/components/MainContent";

const Index = () => {
  const [selectedKpi, setSelectedKpi] = useState("wait-time");

  return (
    <div className="min-h-screen bg-background flex">
      <BankingSidebar 
        selectedKpi={selectedKpi} 
        onKpiSelect={setSelectedKpi}
      />
      <MainContent selectedKpi={selectedKpi} />
    </div>
  );
};

export default Index;
