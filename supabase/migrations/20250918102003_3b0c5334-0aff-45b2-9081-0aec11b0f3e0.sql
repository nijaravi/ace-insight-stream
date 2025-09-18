-- Insert sample KPIs for each department
INSERT INTO public.kpis (
    name, domain, description, alert_table_name, 
    default_email_to, default_email_cc, default_subject, 
    default_body, default_footer, owner_department_id, is_active
) VALUES 
    -- Operations KPIs
    ('Branch Wait Time', 'Operations', 'Monitor branch wait times and customer service efficiency', 'ace_alerts.branch_wait_time_alerts',
     ARRAY['ops@adib.ae'], ARRAY['mgmt@adib.ae'], 'Branch Wait Time Alert - Action Required',
     'Alert regarding branch wait time metrics. Please review and take appropriate action.',
     'Best regards, Operations Team', 
     (SELECT id FROM public.departments WHERE name = 'Operations'), true),
     
    ('ATM Downtime', 'Operations', 'Track ATM availability and downtime incidents', 'ace_alerts.atm_downtime_alerts',
     ARRAY['it@adib.ae', 'ops@adib.ae'], ARRAY['mgmt@adib.ae'], 'ATM Network Alert - Immediate Attention Required',
     'ATM downtime detected. Please investigate and resolve immediately.',
     'Best regards, IT Operations Team',
     (SELECT id FROM public.departments WHERE name = 'Operations'), true),

    -- Sales & Marketing KPIs  
    ('Card Sales Performance', 'Sales & Marketing', 'Monitor credit card sales and performance metrics', 'ace_alerts.card_sales_alerts',
     ARRAY['sales@adib.ae'], ARRAY['marketing@adib.ae'], 'Card Sales Performance Alert',
     'Card sales performance metrics require attention. Please review the attached data.',
     'Best regards, Sales Team',
     (SELECT id FROM public.departments WHERE name = 'Sales & Marketing'), true),
     
    ('Digital Channel Usage', 'Sales & Marketing', 'Track digital channel adoption and usage patterns', 'ace_alerts.digital_usage_alerts',
     ARRAY['digital@adib.ae'], ARRAY['marketing@adib.ae'], 'Digital Channel Usage Alert',
     'Digital channel usage patterns show concerning trends. Please review.',
     'Best regards, Digital Banking Team',
     (SELECT id FROM public.departments WHERE name = 'Sales & Marketing'), false),

    -- Financial KPIs
    ('Deposit Balances', 'Financial', 'Monitor deposit balance fluctuations and trends', 'ace_alerts.deposit_balance_alerts',
     ARRAY['finance@adib.ae'], ARRAY['treasury@adib.ae'], 'Deposit Balance Alert - Review Required',
     'Significant changes in deposit balances detected. Please review immediately.',
     'Best regards, Treasury Team',
     (SELECT id FROM public.departments WHERE name = 'Financial'), true),
     
    ('Loan Portfolio Health', 'Financial', 'Monitor loan portfolio performance and risk indicators', 'ace_alerts.loan_portfolio_alerts',
     ARRAY['lending@adib.ae'], ARRAY['risk@adib.ae'], 'Loan Portfolio Health Alert',
     'Loan portfolio metrics require attention. Please review risk indicators.',
     'Best regards, Lending Team',
     (SELECT id FROM public.departments WHERE name = 'Financial'), true),

    -- Risk & Compliance KPIs
    ('Fraud Detection', 'Risk & Compliance', 'Monitor fraud detection effectiveness and false positive rates', 'ace_alerts.fraud_detection_alerts',
     ARRAY['security@adib.ae'], ARRAY['compliance@adib.ae'], 'Fraud Detection Alert - High Priority',
     'Fraud detection system has identified suspicious patterns. Immediate review required.',
     'Best regards, Security Team',
     (SELECT id FROM public.departments WHERE name = 'Risk & Compliance'), true),
     
    ('Regulatory Compliance', 'Risk & Compliance', 'Track regulatory compliance metrics and violations', 'ace_alerts.compliance_alerts',
     ARRAY['compliance@adib.ae'], ARRAY['legal@adib.ae'], 'Regulatory Compliance Alert',
     'Compliance metrics show potential regulatory issues. Please review urgently.',
     'Best regards, Compliance Team',
     (SELECT id FROM public.departments WHERE name = 'Risk & Compliance'), true);

-- Insert sample alerts for demonstration
INSERT INTO public.alerts (
    alert_id, kpi_id, department_id, alert_detail, alert_date, severity, status
) VALUES 
    ('ALT-001', 
     (SELECT id FROM public.kpis WHERE name = 'Branch Wait Time' LIMIT 1),
     (SELECT id FROM public.departments WHERE name = 'Operations'),
     'Mall Branch exceeded wait time SLA with 28 minutes average wait time',
     NOW() - INTERVAL '2 hours', 'HIGH', 'pending'),
     
    ('ALT-002',
     (SELECT id FROM public.kpis WHERE name = 'Branch Wait Time' LIMIT 1), 
     (SELECT id FROM public.departments WHERE name = 'Operations'),
     'Downtown Branch showing 22 minutes average wait time',
     NOW() - INTERVAL '1 day', 'MEDIUM', 'pending'),
     
    ('ALT-003',
     (SELECT id FROM public.kpis WHERE name = 'Fraud Detection' LIMIT 1),
     (SELECT id FROM public.departments WHERE name = 'Risk & Compliance'),
     'Unusual transaction patterns detected in card payments system',
     NOW() - INTERVAL '30 minutes', 'CRITICAL', 'pending'),
     
    ('ALT-004',
     (SELECT id FROM public.kpis WHERE name = 'ATM Downtime' LIMIT 1),
     (SELECT id FROM public.departments WHERE name = 'Operations'), 
     'Airport Branch ATM offline for 45 minutes',
     NOW() - INTERVAL '3 hours', 'HIGH', 'pending'),
     
    ('ALT-005',
     (SELECT id FROM public.kpis WHERE name = 'Deposit Balances' LIMIT 1),
     (SELECT id FROM public.departments WHERE name = 'Financial'),
     'Significant outflow in corporate deposits detected',
     NOW() - INTERVAL '6 hours', 'MEDIUM', 'pending');

-- Insert some sample alert history
INSERT INTO public.alert_history (
    kpi_id, alert_id, sent_date, recipient_emails, subject, body, status
) VALUES 
    ((SELECT id FROM public.kpis WHERE name = 'Branch Wait Time' LIMIT 1),
     (SELECT id FROM public.alerts WHERE alert_id = 'ALT-002'),
     NOW() - INTERVAL '12 hours',
     ARRAY['ops@adib.ae', 'mgmt@adib.ae'],
     'Branch Wait Time Alert - Action Required',
     'Alert regarding branch wait time metrics. Please review and take appropriate action.',
     'sent'),
     
    ((SELECT id FROM public.kpis WHERE name = 'Fraud Detection' LIMIT 1), 
     (SELECT id FROM public.alerts WHERE alert_id = 'ALT-003'),
     NOW() - INTERVAL '2 hours',
     ARRAY['security@adib.ae', 'compliance@adib.ae'],
     'Fraud Detection Alert - High Priority', 
     'Fraud detection system has identified suspicious patterns. Immediate review required.',
     'sent');