import { useState } from "react";
import { Bell, Activity, Clock, CreditCard, DollarSign, Users, TrendingUp, AlertTriangle, Plus, Star, Building2, Shield, Headphones, Zap, Calculator, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AddKpiModal } from "./AddKpiModal";
import { AddSectionModal } from "./AddSectionModal";
import { KpiData } from "@/pages/Index";

const initialKpiCategories = [
  {
    id: "operations",
    name: "Operations",
    kpis: [
      { 
        id: "wait-time", 
        name: "Branch Wait Time", 
        domain: "operations",
        description: "Monitor branch wait times",
        alertTableName: "ace_alerts.branch_wait_time_alerts",
        defaultEmailTo: ["branch.manager@adib.ae", "operations@adib.ae"],
        defaultEmailCC: ["analytics@adib.ae"],
        defaultSubject: "Alert: Branch Wait Time Exceeded - Immediate Action Required",
        defaultBody: "Dear Team,\n\nWe have identified critical alerts that require immediate attention.\n\nPlease review the alert details below and take necessary action within 2 hours.\n\nBest regards,",
        defaultFooter: "ADIB Analytics Team",
        icon: Clock, 
        severity: "critical", 
        status: "critical", 
        isFavorite: true,
        identifier: "kpi_branch_wait",
        severityTagging: true,
        ownerDepartment: "Branch Operations"
      },
      { id: "atm-downtime", name: "ATM Downtime", domain: "operations", description: "Track ATM availability", alertTableName: "ace_alerts.atm_downtime_alerts", defaultEmailTo: [], defaultEmailCC: [], defaultSubject: "", defaultBody: "", defaultFooter: "", icon: AlertTriangle, severity: "critical", status: "warning", isFavorite: false, identifier: "kpi_atm_downtime", severityTagging: false, ownerDepartment: "IT Operations" },
      { id: "transaction-volume", name: "Transaction Volume", domain: "operations", description: "Monitor transaction volumes", alertTableName: "ace_alerts.transaction_volume_alerts", defaultEmailTo: [], defaultEmailCC: [], defaultSubject: "", defaultBody: "", defaultFooter: "", icon: Activity, severity: "info", status: "normal", isFavorite: true, identifier: "kpi_transaction_volume", severityTagging: false, ownerDepartment: "Operations" },
      { id: "service-quality", name: "Service Quality", domain: "operations", description: "Track service quality metrics", alertTableName: "ace_alerts.service_quality_alerts", defaultEmailTo: [], defaultEmailCC: [], defaultSubject: "", defaultBody: "", defaultFooter: "", icon: Headphones, severity: "warning", status: "warning", isFavorite: false, identifier: "kpi_service_quality", severityTagging: false, ownerDepartment: "Customer Service" },
      { id: "system-uptime", name: "System Uptime", domain: "operations", description: "Monitor system availability", alertTableName: "ace_alerts.system_uptime_alerts", defaultEmailTo: [], defaultEmailCC: [], defaultSubject: "", defaultBody: "", defaultFooter: "", icon: Zap, severity: "info", status: "normal", isFavorite: false, identifier: "kpi_system_uptime", severityTagging: false, ownerDepartment: "IT Operations" },
    ]
  },
  {
    id: "sales",
    name: "Sales & Marketing",
    kpis: [
      { id: "card-sales", name: "Card Sales Drop", domain: "sales", description: "Monitor card sales performance", alertTableName: "ace_alerts.card_sales_alerts", defaultEmailTo: [], defaultEmailCC: [], defaultSubject: "", defaultBody: "", defaultFooter: "", icon: CreditCard, severity: "warning", status: "warning", isFavorite: true, identifier: "kpi_card_sales", severityTagging: false, ownerDepartment: "Sales" },
      { id: "loan-applications", name: "Loan Applications", domain: "sales", description: "Track loan application volumes", alertTableName: "ace_alerts.loan_applications_alerts", defaultEmailTo: [], defaultEmailCC: [], defaultSubject: "", defaultBody: "", defaultFooter: "", icon: TrendingUp, severity: "info", status: "normal", isFavorite: false, identifier: "kpi_loan_applications", severityTagging: false, ownerDepartment: "Lending" },
      { id: "customer-acquisition", name: "Customer Acquisition", domain: "sales", description: "Monitor new customer acquisition", alertTableName: "ace_alerts.customer_acquisition_alerts", defaultEmailTo: [], defaultEmailCC: [], defaultSubject: "", defaultBody: "", defaultFooter: "", icon: Users, severity: "info", status: "normal", isFavorite: false, identifier: "kpi_customer_acquisition", severityTagging: false, ownerDepartment: "Marketing" },
      { id: "product-adoption", name: "Product Adoption", domain: "sales", description: "Track product adoption rates", alertTableName: "ace_alerts.product_adoption_alerts", defaultEmailTo: [], defaultEmailCC: [], defaultSubject: "", defaultBody: "", defaultFooter: "", icon: FileText, severity: "warning", status: "warning", isFavorite: false, identifier: "kpi_product_adoption", severityTagging: false, ownerDepartment: "Product Marketing" },
    ]
  },
  {
    id: "financial",
    name: "Financial",
    kpis: [
      { id: "deposit-balance", name: "Deposit Balances", domain: "financial", description: "Monitor deposit balances", alertTableName: "ace_alerts.deposit_balance_alerts", defaultEmailTo: [], defaultEmailCC: [], defaultSubject: "", defaultBody: "", defaultFooter: "", icon: DollarSign, severity: "info", status: "normal", isFavorite: true, identifier: "kpi_deposit_balance", severityTagging: false, ownerDepartment: "Treasury" },
      { id: "loan-portfolio", name: "Loan Portfolio", domain: "financial", description: "Monitor loan portfolio health", alertTableName: "ace_alerts.loan_portfolio_alerts", defaultEmailTo: [], defaultEmailCC: [], defaultSubject: "", defaultBody: "", defaultFooter: "", icon: Calculator, severity: "warning", status: "warning", isFavorite: false, identifier: "kpi_loan_portfolio", severityTagging: false, ownerDepartment: "Risk Management" },
      { id: "profit-margins", name: "Profit Margins", domain: "financial", description: "Track profit margin trends", alertTableName: "ace_alerts.profit_margins_alerts", defaultEmailTo: [], defaultEmailCC: [], defaultSubject: "", defaultBody: "", defaultFooter: "", icon: TrendingUp, severity: "info", status: "normal", isFavorite: false, identifier: "kpi_profit_margins", severityTagging: false, ownerDepartment: "Finance" },
      { id: "cost-ratios", name: "Cost Ratios", domain: "financial", description: "Monitor cost efficiency ratios", alertTableName: "ace_alerts.cost_ratios_alerts", defaultEmailTo: [], defaultEmailCC: [], defaultSubject: "", defaultBody: "", defaultFooter: "", icon: Calculator, severity: "warning", status: "critical", isFavorite: false, identifier: "kpi_cost_ratios", severityTagging: false, ownerDepartment: "Finance" },
    ]
  },
  {
    id: "compliance",
    name: "Risk & Compliance",
    kpis: [
      { id: "customer-satisfaction", name: "Customer Satisfaction", domain: "compliance", description: "Monitor customer satisfaction scores", alertTableName: "ace_alerts.customer_satisfaction_alerts", defaultEmailTo: [], defaultEmailCC: [], defaultSubject: "", defaultBody: "", defaultFooter: "", icon: Users, severity: "warning", status: "warning", isFavorite: true, identifier: "kpi_customer_satisfaction", severityTagging: false, ownerDepartment: "Customer Experience" },
      { id: "regulatory-compliance", name: "Regulatory Compliance", domain: "compliance", description: "Track regulatory compliance metrics", alertTableName: "ace_alerts.regulatory_compliance_alerts", defaultEmailTo: [], defaultEmailCC: [], defaultSubject: "", defaultBody: "", defaultFooter: "", icon: Shield, severity: "critical", status: "normal", isFavorite: false, identifier: "kpi_regulatory_compliance", severityTagging: true, ownerDepartment: "Compliance" },
      { id: "fraud-detection", name: "Fraud Detection", domain: "compliance", description: "Monitor fraud detection metrics", alertTableName: "ace_alerts.fraud_detection_alerts", defaultEmailTo: [], defaultEmailCC: [], defaultSubject: "", defaultBody: "", defaultFooter: "", icon: AlertTriangle, severity: "info", status: "normal", isFavorite: false, identifier: "kpi_fraud_detection", severityTagging: true, ownerDepartment: "Security" },
      { id: "audit-findings", name: "Audit Findings", domain: "compliance", description: "Track audit findings and remediation", alertTableName: "ace_alerts.audit_findings_alerts", defaultEmailTo: [], defaultEmailCC: [], defaultSubject: "", defaultBody: "", defaultFooter: "", icon: FileText, severity: "warning", status: "warning", isFavorite: false, identifier: "kpi_audit_findings", severityTagging: true, ownerDepartment: "Internal Audit" },
    ]
  }
];

// Remove unused function since favorites are calculated in component

interface BankingSidebarProps {
  selectedKpi: KpiData | null;
  onKpiSelect: (kpi: KpiData) => void;
  onNavigateToTab?: (tabId: string) => void;
}

export function BankingSidebar({ selectedKpi, onKpiSelect, onNavigateToTab }: BankingSidebarProps) {
  const [toggleFavorites, setToggleFavorites] = useState(false);
  const [categories, setCategories] = useState(initialKpiCategories);
  const [isAddKpiModalOpen, setIsAddKpiModalOpen] = useState(false);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [selectedSectionForKpi, setSelectedSectionForKpi] = useState<string | null>(null);
  const [newlyAddedKpi, setNewlyAddedKpi] = useState<string | null>(null);
  
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

  const handleAddKpi = (kpiData: any) => {
    // Find the appropriate category or create default icons based on domain
    const domainIcons = {
      operations: Clock,
      sales: TrendingUp,
      financial: DollarSign,
      compliance: Shield
    };

    const newKpi = {
      ...kpiData,
      icon: domainIcons[kpiData.domain as keyof typeof domainIcons] || Activity
    };

    // Add KPI to the appropriate category
    setCategories(prev => prev.map(category => {
      if (category.id === kpiData.domain) {
        return {
          ...category,
          kpis: [...category.kpis, newKpi]
        };
      }
      return category;
    }));

    // Track newly added KPI for highlighting
    setNewlyAddedKpi(newKpi.id);
    
    // Auto-select the new KPI
    onKpiSelect(newKpi);
    
    // Navigate to Check & Send Alerts tab if callback is provided
    if (onNavigateToTab) {
      onNavigateToTab("check-send");
    }

    // Clear highlight after animation
    setTimeout(() => setNewlyAddedKpi(null), 3000);
    
    // Reset section selection
    setSelectedSectionForKpi(null);
  };

  const handleAddSection = (sectionData: any) => {
    const newSection = {
      id: sectionData.id,
      name: sectionData.name,
      kpis: []
    };
    
    setCategories(prev => [...prev, newSection]);
  };

  const handleAddKpiToSection = (sectionId: string) => {
    setSelectedSectionForKpi(sectionId);
    setIsAddKpiModalOpen(true);
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
    const isSelected = selectedKpi?.id === kpi.id;
    const isNewlyAdded = newlyAddedKpi === kpi.id;
    
    return (
      <div
        key={kpi.id}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
          "hover:bg-banking-sidebar-accent/10 group",
          isSelected && "bg-banking-sidebar-accent text-white shadow-glow",
          isNewlyAdded && "animate-pulse ring-2 ring-banking-sidebar-accent/50"
        )}
      >
        <button
          onClick={() => onKpiSelect(kpi)}
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
          <div className="flex items-center gap-2">
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
          <button 
            onClick={() => setIsAddSectionModalOpen(true)}
            className="p-1.5 rounded-md text-banking-sidebar-accent hover:bg-banking-sidebar-accent/10 transition-colors"
            title="Add Section"
          >
            <Plus className="w-4 h-4" />
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
                  
                  {/* Add KPI button inside each section */}
                  <button
                    onClick={() => handleAddKpiToSection(category.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-banking-sidebar-foreground/60 hover:text-banking-sidebar-accent hover:bg-banking-sidebar-accent/5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-sm">Add KPI</span>
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <AddKpiModal
        isOpen={isAddKpiModalOpen}
        onClose={() => {
          setIsAddKpiModalOpen(false);
          setSelectedSectionForKpi(null);
        }}
        onAddKpi={handleAddKpi}
        preselectedDomain={selectedSectionForKpi}
      />
      
      <AddSectionModal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        onAddSection={handleAddSection}
      />
    </div>
  );
}