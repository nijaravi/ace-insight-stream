export interface Department {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface KpiData {
  id: string;
  name: string;
  domain: string;
  description?: string;
  alert_table_name: string;
  default_email_to: string[];
  default_email_cc: string[];
  default_subject: string;
  default_body: string;
  default_footer: string;
  is_favorite: boolean;
  identifier?: string;
  severity_tagging: boolean;
  owner_department_id?: string;
  icon?: string;
  severity?: string;
  status?: string;
  is_automation_enabled?: boolean;
  automation_time?: string;
  ai_prompt?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface KpiTableData {
  id: string;
  name: string;
  domain: string;
  description: string;
  alert_table_name: string;
  default_email_to: string[];
  default_email_cc: string[];
  default_subject: string;
  default_body: string;
  default_footer: string;
  ai_prompt?: string;
  last_alert_sent?: string;
  alerts_this_month: number;
  is_active: boolean;
  owner_department_id?: string;
  department?: Department;
}

export interface Alert {
  id: string;
  alert_id: string;
  kpi_id?: string;
  department_id?: string;
  alert_detail: string;
  alert_date: string;
  severity?: string;
  status?: string;
  comment?: string;
  curated_date?: string;
  sent_date?: string;
  created_at: string;
}