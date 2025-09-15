import { useState } from "react";
import { Bell, Activity, Clock, CreditCard, DollarSign, Users, TrendingUp, AlertTriangle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const kpiItems = [
  { id: "wait-time", name: "Branch Wait Time", icon: Clock, severity: "critical" },
  { id: "card-sales", name: "Card Sales Drop", icon: CreditCard, severity: "warning" },
  { id: "deposit-balance", name: "Deposit Balances", icon: DollarSign, severity: "info" },
  { id: "customer-satisfaction", name: "Customer Satisfaction", icon: Users, severity: "warning" },
  { id: "transaction-volume", name: "Transaction Volume", icon: Activity, severity: "info" },
  { id: "atm-downtime", name: "ATM Downtime", icon: AlertTriangle, severity: "critical" },
  { id: "loan-applications", name: "Loan Applications", icon: TrendingUp, severity: "info" },
];

interface BankingSidebarProps {
  selectedKpi: string;
  onKpiSelect: (kpiId: string) => void;
}

export function BankingSidebar({ selectedKpi, onKpiSelect }: BankingSidebarProps) {
  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: "bg-destructive text-destructive-foreground",
      warning: "bg-gold text-gold-foreground",
      info: "bg-accent text-accent-foreground"
    };
    return colors[severity as keyof typeof colors] || colors.info;
  };

  return (
    <div className="w-80 bg-banking-sidebar text-banking-sidebar-foreground border-r border-banking-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-banking-border/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">ACE Alerting Platform</h1>
            <p className="text-sm text-banking-sidebar-foreground/70">Analytics & Monitoring</p>
          </div>
        </div>
      </div>

      {/* KPI Navigation */}
      <div className="flex-1 p-4 space-y-2">
        <h2 className="text-sm font-semibold text-banking-sidebar-foreground/70 mb-4 uppercase tracking-wide">
          KPI Monitoring
        </h2>
        
        <div className="space-y-1">
          {kpiItems.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedKpi === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onKpiSelect(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200",
                  "hover:bg-banking-sidebar-accent/10 group",
                  isSelected && "bg-banking-sidebar-accent text-white shadow-glow"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                  isSelected ? "bg-white/20" : "bg-white/10 group-hover:bg-white/15"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm leading-tight">{item.name}</div>
                </div>
                
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  item.severity === "critical" && "bg-red-400",
                  item.severity === "warning" && "bg-yellow-400", 
                  item.severity === "info" && "bg-green-400"
                )} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Add KPI Button */}
      <div className="p-4 border-t border-banking-border/20">
        <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-banking-sidebar-accent/30 text-banking-sidebar-accent hover:bg-banking-sidebar-accent/10 transition-colors">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add KPI</span>
        </button>
      </div>
    </div>
  );
}