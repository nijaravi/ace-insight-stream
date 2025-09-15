import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSendAlertsPanel } from "./CheckSendAlertsPanel";
import { NewEmailSettingsPanel } from "./NewEmailSettingsPanel";
import { NewSentAlertsHistoryPanel } from "./NewSentAlertsHistoryPanel";

interface MainContentProps {
  selectedKpi: string;
}

export function MainContent({ selectedKpi }: MainContentProps) {
  return (
    <div className="flex-1 bg-banking-panel p-8">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="alerts" className="space-y-6">
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