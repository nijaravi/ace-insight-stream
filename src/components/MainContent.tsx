import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSendAlertsPanel } from "./CheckSendAlertsPanel";
import { NewEmailSettingsPanel } from "./NewEmailSettingsPanel";
import { NewSentAlertsHistoryPanel } from "./NewSentAlertsHistoryPanel";

import { KpiData } from "@/pages/Index";

interface MainContentProps {
  selectedKpi: KpiData | null;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function MainContent({ selectedKpi, activeTab: externalActiveTab, onTabChange }: MainContentProps) {
  const [internalActiveTab, setInternalActiveTab] = useState("check-send");
  
  const activeTab = externalActiveTab || internalActiveTab;
  const setActiveTab = onTabChange || setInternalActiveTab;

  // Map internal tab names to component values
  const tabValue = activeTab === "check-send" ? "alerts" : 
                   activeTab === "email-settings" ? "settings" : 
                   activeTab === "history" ? "history" : "alerts";

  return (
    <div className="flex-1 bg-banking-panel p-8">
      <div className="max-w-7xl mx-auto">
        <Tabs 
          value={tabValue} 
          onValueChange={(value) => {
            const tabId = value === "alerts" ? "check-send" : 
                         value === "settings" ? "email-settings" : 
                         value === "history" ? "history" : "check-send";
            setActiveTab(tabId);
          }}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 bg-card border border-banking-border">
            <TabsTrigger 
              value="alerts" 
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              📤 Check & Send Alerts
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
            <CheckSendAlertsPanel selectedKpi={selectedKpi} />
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