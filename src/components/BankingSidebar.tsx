import { useState } from "react";
import { Bell, Activity, Clock, CreditCard, DollarSign, Users, TrendingUp, AlertTriangle, Plus, Star, Building2, Shield, Headphones, Zap, Calculator, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const kpiCategories = [
  {
    id: "operations",
    name: "Operations",
    kpis: [
      { id: "wait-time", name: "Branch Wait Time", icon: Clock, severity: "critical", status: "critical", isFavorite: true },
      { id: "atm-downtime", name: "ATM Downtime", icon: AlertTriangle, severity: "critical", status: "warning", isFavorite: false },
      { id: "transaction-volume", name: "Transaction Volume", icon: Activity, severity: "info", status: "normal", isFavorite: true },
      { id: "service-quality", name: "Service Quality", icon: Headphones, severity: "warning", status: "warning", isFavorite: false },
      { id: "system-uptime", name: "System Uptime", icon: Zap, severity: "info", status: "normal", isFavorite: false },
    ]
  },
  {
    id: "sales",
    name: "Sales & Marketing",
    kpis: [
      { id: "card-sales", name: "Card Sales Drop", icon: CreditCard, severity: "warning", status: "warning", isFavorite: true },
      { id: "loan-applications", name: "Loan Applications", icon: TrendingUp, severity: "info", status: "normal", isFavorite: false },
      { id: "customer-acquisition", name: "Customer Acquisition", icon: Users, severity: "info", status: "normal", isFavorite: false },
      { id: "product-adoption", name: "Product Adoption", icon: FileText, severity: "warning", status: "warning", isFavorite: false },
    ]
  },
  {
    id: "financial",
    name: "Financial",
    kpis: [
      { id: "deposit-balance", name: "Deposit Balances", icon: DollarSign, severity: "info", status: "normal", isFavorite: true },
      { id: "loan-portfolio", name: "Loan Portfolio", icon: Calculator, severity: "warning", status: "warning", isFavorite: false },
      { id: "profit-margins", name: "Profit Margins", icon: TrendingUp, severity: "info", status: "normal", isFavorite: false },
      { id: "cost-ratios", name: "Cost Ratios", icon: Calculator, severity: "warning", status: "critical", isFavorite: false },
    ]
  },
  {
    id: "compliance",
    name: "Risk & Compliance",
    kpis: [
      { id: "customer-satisfaction", name: "Customer Satisfaction", icon: Users, severity: "warning", status: "warning", isFavorite: true },
      { id: "regulatory-compliance", name: "Regulatory Compliance", icon: Shield, severity: "critical", status: "normal", isFavorite: false },
      { id: "fraud-detection", name: "Fraud Detection", icon: AlertTriangle, severity: "info", status: "normal", isFavorite: false },
      { id: "audit-findings", name: "Audit Findings", icon: FileText, severity: "warning", status: "warning", isFavorite: false },
    ]
  }
];

// Get all favorite KPIs across categories
const getFavoriteKpis = () => {
  return kpiCategories.flatMap(category => 
    category.kpis.filter(kpi => kpi.isFavorite)
  );
};

interface BankingSidebarProps {
  selectedKpi: string;
  onKpiSelect: (kpiId: string) => void;
}

export function BankingSidebar({ selectedKpi, onKpiSelect }: BankingSidebarProps) {
  const [toggleFavorites, setToggleFavorites] = useState(false);
  const [categories, setCategories] = useState(kpiCategories);
  
  const favoriteKpis = categories.flatMap(category => 
    category.kpis.filter(kpi => kpi.isFavorite)
  );

  const toggleFavorite = (kpiId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent KPI selection when clicking star
    
    setCategories(prev => prev.map(category => ({
      ...category,
      kpis: category.kpis.map(kpi => 
        kpi.id === kpiId ? { ...kpi, isFavorite: !kpi.isFavorite } : kpi
      )
    })));
  };
  
  const getStatusDot = (status: string) => {
    const colors = {
      critical: "bg-red-400",
      warning: "bg-yellow-400", 
      normal: "bg-green-400"
    };
    return colors[status as keyof typeof colors] || colors.normal;
  };

  const renderKpiItem = (kpi: any) => {
    const Icon = kpi.icon;
    const isSelected = selectedKpi === kpi.id;
    
    return (
      <div
        key={kpi.id}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
          "hover:bg-banking-sidebar-accent/10 group",
          isSelected && "bg-banking-sidebar-accent text-white shadow-glow"
        )}
      >
        <button
          onClick={() => onKpiSelect(kpi.id)}
          className="flex items-center gap-3 flex-1 text-left"
        >
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            isSelected ? "bg-white/20" : "bg-white/10 group-hover:bg-white/15"
          )}>
            <Icon className="w-4 h-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm leading-tight">{kpi.name}</div>
          </div>
        </button>

        <button
          onClick={(e) => toggleFavorite(kpi.id, e)}
          className="p-1 rounded-md hover:bg-white/10 transition-colors"
        >
          <Star 
            className={cn(
              "w-3 h-3 transition-colors",
              kpi.isFavorite 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-banking-sidebar-foreground/40 hover:text-yellow-400"
            )} 
          />
        </button>
        
        <div className={cn(
          "w-2 h-2 rounded-full",
          getStatusDot(kpi.status)
        )} />
      </div>
    );
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
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-banking-sidebar-foreground/70 uppercase tracking-wide">
            KPI Monitoring
          </h2>
          <button 
            onClick={() => setToggleFavorites(!toggleFavorites)}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              toggleFavorites ? "bg-yellow-400/20 text-yellow-400" : "text-banking-sidebar-foreground/50 hover:text-banking-sidebar-foreground/70"
            )}
          >
            <Star className="w-4 h-4" />
          </button>
        </div>

        {/* Favorites Section */}
        {toggleFavorites && favoriteKpis.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <h3 className="text-sm font-medium text-banking-sidebar-foreground/80">Favorites</h3>
            </div>
            <div className="space-y-1">
              {favoriteKpis.map(renderKpiItem)}
            </div>
          </div>
        )}

        {/* Categories */}
        <Accordion type="multiple" defaultValue={["operations", "sales"]} className="space-y-2">
          {categories.map((category) => (
            <AccordionItem key={category.id} value={category.id} className="border-none">
              <AccordionTrigger className="py-2 px-3 rounded-lg hover:bg-banking-sidebar-accent/5 transition-colors [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-xs bg-banking-sidebar-accent/10 text-banking-sidebar-accent px-2 py-0.5 rounded-full">
                    {category.kpis.length}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="space-y-1 ml-6">
                  {category.kpis.map(renderKpiItem)}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Add KPI Button */}
      <div className="p-4 border-t border-banking-border/20">
        <button 
          onClick={() => console.log("Add KPI clicked")}
          className="w-full flex items-center gap-3 p-3 rounded-lg border border-banking-sidebar-accent/30 text-banking-sidebar-accent hover:bg-banking-sidebar-accent/10 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add KPI</span>
        </button>
      </div>
    </div>
  );
}