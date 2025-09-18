import { useState } from "react";
import { Bell, Activity, Clock, CreditCard, DollarSign, Users, TrendingUp, AlertTriangle, Plus, Star, Building2, Shield, Headphones, Zap, Calculator, FileText, ChevronDown, Search, MoreHorizontal, Trash2, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  selectedDepartment: string | null;
  selectedView: "kpi-management" | "alert-curation" | "alerts-dashboard";
  onDepartmentSelect: (departmentId: string) => void;
  onViewSelect: (view: "kpi-management" | "alert-curation" | "alerts-dashboard") => void;
}

export function BankingSidebar({ selectedDepartment, selectedView, onDepartmentSelect, onViewSelect }: BankingSidebarProps) {
  const departments = [
    { id: "operations", name: "Operations", icon: Clock },
    { id: "sales", name: "Sales & Marketing", icon: TrendingUp },
    { id: "financial", name: "Financial", icon: DollarSign },
    { id: "compliance", name: "Risk & Compliance", icon: Shield },
  ];

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

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {/* KPI Management Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-banking-sidebar-foreground/70 uppercase tracking-wide flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            KPI Management
          </h3>
          <div className="space-y-2">
            {departments.map((department) => {
              const Icon = department.icon;
              const isSelected = selectedDepartment === department.id && selectedView === "kpi-management";
              
              return (
                <button
                  key={department.id}
                  onClick={() => {
                    onDepartmentSelect(department.id);
                    onViewSelect("kpi-management");
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                    "hover:bg-banking-sidebar-accent/10",
                    isSelected && "bg-banking-sidebar-accent text-white shadow-glow"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    isSelected ? "bg-white/20" : "bg-white/10"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">{department.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alert Curation & Sending Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-banking-sidebar-foreground/70 uppercase tracking-wide flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Alert Curation & Sending
          </h3>
          <button
            onClick={() => onViewSelect("alert-curation")}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
              "hover:bg-banking-sidebar-accent/10",
              selectedView === "alert-curation" && "bg-banking-sidebar-accent text-white shadow-glow"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              selectedView === "alert-curation" ? "bg-white/20" : "bg-white/10"
            )}>
              <Bell className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">Manual Alert Curation</span>
          </button>
        </div>

        {/* Alerts Dashboard Section */}
        <div className="space-y-3">
          <button
            onClick={() => onViewSelect("alerts-dashboard")}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
              "hover:bg-banking-sidebar-accent/10",
              selectedView === "alerts-dashboard" && "bg-banking-sidebar-accent text-white shadow-glow"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              selectedView === "alerts-dashboard" ? "bg-white/20" : "bg-white/10"
            )}>
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">Alerts Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
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

        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-banking-sidebar-accent" />
              <h3 className="text-sm font-medium text-banking-sidebar-foreground/80">
                Search Results ({searchResults.length})
              </h3>
            </div>
            <div className="space-y-1">
              {searchResults.map(kpi => (
                <div key={kpi.id} className="ml-6">
                  {renderKpiItem(kpi)}
                  <div className="text-xs text-banking-sidebar-foreground/50 ml-11 mb-2">
                    in {categories.find(cat => cat.kpis.some(k => k.id === kpi.id))?.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Search Results */}
        {searchQuery && searchResults.length === 0 && (
          <div className="mb-6 text-center py-8">
            <Search className="w-8 h-8 text-banking-sidebar-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-banking-sidebar-foreground/60">No KPIs found matching "{searchQuery}"</p>
          </div>
        )}

        {/* Categories */}
        {!searchQuery && (
          <Accordion type="multiple" defaultValue={["operations", "sales"]} className="space-y-2">
          {filteredCategories.map((category) => (
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
        )}

        {/* Alerts Dashboard - Same level as KPI Monitoring */}
        {!searchQuery && (
          <div className="mt-6">
            <button
              onClick={onNavigateToDashboard}
              className="w-full text-left mb-4"
            >
              <h2 className="text-sm font-semibold text-banking-sidebar-foreground/70 uppercase tracking-wide">
                📊 Alerts Dashboard
              </h2>
            </button>
          </div>
        )}
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

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete KPI</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete this KPI?<br />
              This action will hide the KPI from the platform but won't delete any associated alerts or history.
            </DialogDescription>
          </DialogHeader>
          {kpiToDelete && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  {kpiToDelete.icon && <kpiToDelete.icon className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-medium text-sm">{kpiToDelete.name}</div>
                  <div className="text-xs text-muted-foreground">{kpiToDelete.ownerDepartment}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteKpi}
            >
              Delete KPI
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}