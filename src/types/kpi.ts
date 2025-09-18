export interface KpiData {
  id: string;
  name: string;
  domain: string;
  description?: string;
  alertTableName: string;
  defaultEmailTo: string[];
  defaultEmailCC: string[];
  defaultSubject: string;
  defaultBody: string;
  defaultFooter: string;
  isFavorite: boolean;
  identifier?: string;
  severityTagging: boolean;
  ownerDepartment?: string;
  icon?: any;
  severity?: string;
  status?: string;
  isAutomationEnabled?: boolean;
  automationTime?: string;
}

export interface KpiTableData {
  id: string;
  name: string;
  domain: string;
  description: string;
  alertTableName: string;
  defaultEmailTo: string[];
  defaultEmailCC: string[];
  defaultSubject: string;
  defaultBody: string;
  defaultFooter: string;
  aiPrompt?: string;
  lastAlertSent?: string;
  alertsThisMonth: number;
  isActive: boolean;
  ownerDepartment?: string;
}