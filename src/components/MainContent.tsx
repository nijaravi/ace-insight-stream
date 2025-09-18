import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSendAlertsPanel } from "./CheckSendAlertsPanel";
import { AISummarizerPanel } from "./AISummarizerPanel";
import { NewEmailSettingsPanel } from "./NewEmailSettingsPanel";
import { NewSentAlertsHistoryPanel } from "./NewSentAlertsHistoryPanel";

import type { KpiData, Alert } from "@/types/kpi";

interface MainContentProps {
  selectedKpi: KpiData | null;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function MainContent({ selectedKpi, activeTab = "alerts", onTabChange }: MainContentProps) {
  const [selectedAlertsForAI, setSelectedAlertsForAI] = useState<Alert[]>([]);
  const [currentActiveTab, setCurrentActiveTab] = useState(activeTab);

  const handleTabChange = (tabId: string) => {
    setCurrentActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const handlePassToAI = (alerts: Alert[]) => {
    setSelectedAlertsForAI(alerts);
    handleTabChange("ai-summarizer");
  };

  if (!selectedKpi) {
    return (
      <div className="flex-1 bg-banking-panel flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <h3 className="text-lg font-medium mb-2">No KPI Selected</h3>
          <p>Please select a KPI from the sidebar to view its details and manage alerts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-banking-panel">
      {/* Header */}
      <div className="border-b border-banking-border bg-banking-header px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-lg">{selectedKpi.icon || "📊"}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{selectedKpi.name}</h1>
            <p className="text-sm text-muted-foreground">{selectedKpi.description}</p>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="p-6">
        <Tabs value={currentActiveTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger 
              value="alerts" 
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              🚨 Check & Send Alerts
            </TabsTrigger>
            <TabsTrigger 
              value="ai-summarizer" 
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              🤖 AI Summarizer
            </TabsTrigger>
            <TabsTrigger 
              value="email-settings" 
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              ✉️ Email Settings
            </TabsTrigger>
            <TabsTrigger 
              value="sent-alerts" 
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              📜 Sent Alerts History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="mt-6">
            <CheckSendAlertsPanel selectedKpi={selectedKpi} onPassToAI={handlePassToAI} />
          </TabsContent>

          <TabsContent value="ai-summarizer" className="mt-6">
            <AISummarizerPanel selectedKpi={selectedKpi} selectedAlerts={selectedAlertsForAI} />
          </TabsContent>

          <TabsContent value="email-settings" className="mt-6">
            <NewEmailSettingsPanel selectedKpi={selectedKpi} />
          </TabsContent>

          <TabsContent value="sent-alerts" className="mt-6">
            <NewSentAlertsHistoryPanel selectedKpi={selectedKpi} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}