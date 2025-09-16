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
        {/* KPI Context Header */}
        <div className="mb-8">
          {selectedKpi ? (
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📊</span>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-primary">
                  KPI: {selectedKpi.name}
                </h1>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <span className="text-accent font-medium">{selectedKpi.domain}</span>
                  {selectedKpi.ownerDepartment && (
                    <>
                      <span className="mx-2">→</span>
                      <span>{selectedKpi.ownerDepartment}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📊</span>
              <h1 className="text-2xl font-bold text-muted-foreground">
                Select a KPI to get started
              </h1>
            </div>
          )}
          <div className="border-b border-banking-border mt-4"></div>
        </div>

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