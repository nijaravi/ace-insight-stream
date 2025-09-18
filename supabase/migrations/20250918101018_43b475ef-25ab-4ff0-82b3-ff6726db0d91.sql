-- Create departments table
CREATE TABLE public.departments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create KPIs table
CREATE TABLE public.kpis (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    description TEXT,
    alert_table_name TEXT NOT NULL,
    default_email_to TEXT[] NOT NULL DEFAULT '{}',
    default_email_cc TEXT[] NOT NULL DEFAULT '{}',
    default_subject TEXT NOT NULL DEFAULT '',
    default_body TEXT NOT NULL DEFAULT '',
    default_footer TEXT NOT NULL DEFAULT '',
    ai_prompt TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    identifier TEXT,
    severity_tagging BOOLEAN NOT NULL DEFAULT false,
    owner_department_id UUID REFERENCES public.departments(id),
    icon TEXT,
    severity TEXT,
    status TEXT,
    is_automation_enabled BOOLEAN NOT NULL DEFAULT false,
    automation_time TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_id TEXT NOT NULL,
    kpi_id UUID REFERENCES public.kpis(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id),
    alert_detail TEXT NOT NULL,
    alert_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    severity TEXT,
    status TEXT DEFAULT 'pending',
    comment TEXT,
    curated_date TIMESTAMP WITH TIME ZONE,
    sent_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alert recipients table
CREATE TABLE public.alert_recipients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_id UUID REFERENCES public.alerts(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('to', 'cc')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alert history table for tracking sent alerts
CREATE TABLE public.alert_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    kpi_id UUID REFERENCES public.kpis(id) ON DELETE CASCADE,
    alert_id UUID REFERENCES public.alerts(id) ON DELETE CASCADE,
    sent_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    recipient_emails TEXT[] NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now since no auth is implemented)
CREATE POLICY "Allow all operations on departments" ON public.departments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on kpis" ON public.kpis FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on alerts" ON public.alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on alert_recipients" ON public.alert_recipients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on alert_history" ON public.alert_history FOR ALL USING (true) WITH CHECK (true);

-- Insert sample departments
INSERT INTO public.departments (name, description, icon) VALUES
    ('Operations', 'Operational metrics and alerts', '⚙️'),
    ('Sales & Marketing', 'Sales performance and marketing metrics', '📈'),
    ('Financial', 'Financial performance and compliance', '💰'),
    ('Risk & Compliance', 'Risk management and regulatory compliance', '🛡️');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_departments_updated_at
    BEFORE UPDATE ON public.departments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kpis_updated_at
    BEFORE UPDATE ON public.kpis
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_kpis_department_id ON public.kpis(owner_department_id);
CREATE INDEX idx_alerts_kpi_id ON public.alerts(kpi_id);
CREATE INDEX idx_alerts_department_id ON public.alerts(department_id);
CREATE INDEX idx_alerts_alert_date ON public.alerts(alert_date);
CREATE INDEX idx_alert_recipients_alert_id ON public.alert_recipients(alert_id);
CREATE INDEX idx_alert_history_kpi_id ON public.alert_history(kpi_id);
CREATE INDEX idx_alert_history_sent_date ON public.alert_history(sent_date);