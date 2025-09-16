import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSendAlertsPanel } from "./CheckSendAlertsPanel";
import { AISummarizerPanel } from "./AISummarizerPanel";
import { NewEmailSettingsPanel } from "./NewEmailSettingsPanel";
import { NewSentAlertsHistoryPanel } from "./NewSentAlertsHistoryPanel";

import { KpiData } from "@/pages/Index";

interface Alert {
  id: string;
  alertDate: string;
  alertDetails: string;
  comment?: string;
}

interface MainContentProps {
  selectedKpi: KpiData | null;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function MainContent({ selectedKpi, activeTab: externalActiveTab, onTabChange }: MainContentProps) {
  const [internalActiveTab, setInternalActiveTab] = useState("check-send");
  const [selectedAlertsForAI, setSelectedAlertsForAI] = useState<Alert[]>([]);
  
  const activeTab = externalActiveTab || internalActiveTab;
  const setActiveTab = onTabChange || setInternalActiveTab;

  // Map internal tab names to component values
  const tabValue = activeTab === "check-send" ? "alerts" : 
                   activeTab === "ai-summarizer" ? "ai-summarizer" :
                   activeTab === "email-settings" ? "settings" : 
                   activeTab === "history" ? "history" : "alerts";

  const handlePassToAI = (alerts: Alert[]) => {
    setSelectedAlertsForAI(alerts);
    setActiveTab("ai-summarizer");
  };

  const handleBackToAlerts = () => {
    setActiveTab("check-send");
  };

  const handleSendEmailWithSummary = (summary: string) => {
    // TODO: Implement email sending with AI summary
    console.log("Sending email with summary:", summary);
  };

  return (
    <div className="flex-1 bg-banking-panel p-8">
      <div className="max-w-7xl mx-auto">
        <Tabs 
          value={tabValue} 
          onValueChange={(value) => {
            const tabId = value === "alerts" ? "check-send" : 
                         value === "ai-summarizer" ? "ai-summarizer" :
                         value === "settings" ? "email-settings" : 
                         value === "history" ? "history" : "check-send";
            setActiveTab(tabId);
          }}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-card border border-banking-border">
            <TabsTrigger 
              value="alerts" 
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              📤 Check & Send Alerts
            </TabsTrigger>
            <TabsTrigger 
              value="ai-summarizer"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              🧠 AI Summarizer
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              ✉️ Email Settings
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              📜 Sent Alerts History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="mt-6">
            <CheckSendAlertsPanel selectedKpi={selectedKpi} onPassToAI={handlePassToAI} />
          </TabsContent>

          <TabsContent value="ai-summarizer" className="mt-6">
            <AISummarizerPanel 
              selectedAlerts={selectedAlertsForAI}
              onBackToAlerts={handleBackToAlerts}
              onSendEmail={handleSendEmailWithSummary}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <NewEmailSettingsPanel selectedKpi={selectedKpi} />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <NewSentAlertsHistoryPanel selectedKpi={selectedKpi} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}