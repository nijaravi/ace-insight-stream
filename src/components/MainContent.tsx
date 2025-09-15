import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertsPanel } from "./AlertsPanel";
import { EmailSettingsPanel } from "./EmailSettingsPanel";
import { SentAlertsPanel } from "./SentAlertsPanel";

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
              📍 Check Alerts
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              📧 Email Settings
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              📜 Sent History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="mt-6">
            <AlertsPanel selectedKpi={selectedKpi} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <EmailSettingsPanel selectedKpi={selectedKpi} />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <SentAlertsPanel selectedKpi={selectedKpi} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}