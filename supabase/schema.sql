-- Supabase Database Schema for API Monitor
-- Author: Yíng Yíng (盈盈)
-- Date: 2026-02-08

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================
-- USERS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    plan VARCHAR(50) DEFAULT 'free',
    plan_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index on plan
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);

-- ===============================
-- ENDPOINTS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS endpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    method VARCHAR(10) DEFAULT 'GET',
    headers JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active',
    response_time INTEGER,
    uptime DECIMAL(5, 2) DEFAULT 100.00,
    downtime_count INTEGER DEFAULT 0,
    last_checked TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on user_id
CREATE INDEX IF NOT EXISTS idx_endpoints_user_id ON endpoints(user_id);

-- Index on status
CREATE INDEX IF NOT EXISTS idx_endpoints_status ON endpoints(status);

-- ===============================
-- MONITORING_HISTORY TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS monitoring_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endpoint_id UUID NOT NULL REFERENCES endpoints(id) ON DELETE CASCADE,
    status_code INTEGER,
    response_time INTEGER,
    is_up BOOLEAN NOT NULL,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on endpoint_id
CREATE INDEX IF NOT EXISTS idx_monitoring_history_endpoint_id ON monitoring_history(endpoint_id);

-- Index on checked_at
CREATE INDEX IF NOT EXISTS idx_monitoring_history_checked_at ON monitoring_history(checked_at);

-- ===============================
-- ALERTS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    endpoint_id UUID REFERENCES endpoints(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- response_time, status_code, uptime
    threshold INTEGER NOT NULL,
    enabled BOOLEAN DEFAULT true,
    notification_method VARCHAR(20) DEFAULT 'email', -- email, slack, webhook
    notification_target TEXT,
    triggered_count INTEGER DEFAULT 0,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on user_id
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);

-- Index on endpoint_id
CREATE INDEX IF NOT EXISTS idx_alerts_endpoint_id ON alerts(endpoint_id);

-- Index on enabled
CREATE INDEX IF NOT EXISTS idx_alerts_enabled ON alerts(enabled);

-- ===============================
-- WEBHOOK_LOGS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID REFERENCES alerts(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    payload JSONB,
    status_code INTEGER,
    response_body TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on alert_id
CREATE INDEX IF NOT EXISTS idx_webhook_logs_alert_id ON webhook_logs(alert_id);

-- Index on sent_at
CREATE INDEX IF NOT EXISTS idx_webhook_logs_sent_at ON webhook_logs(sent_at);

-- ===============================
-- SUBSCRIPTIONS TABLE (for future Stripe integration)
-- ===============================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    plan VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on user_id
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Index on stripe_customer_id
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);

-- Index on status
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ===============================
-- NOTIFICATIONS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- alert, system, billing
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on user_id
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Index on read
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Index on created_at
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- ===============================
-- ROW LEVEL SECURITY POLICIES
-- ===============================

-- Users policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id::TEXT);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id::TEXT);

CREATE POLICY "Public insert for signup"
    ON users FOR INSERT
    WITH CHECK (true);

-- Endpoints policies
ALTER TABLE endpoints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own endpoints"
    ON endpoints FOR SELECT
    USING (auth.uid() = user_id::TEXT);

CREATE POLICY "Users can insert own endpoints"
    ON endpoints FOR INSERT
    WITH CHECK (auth.uid() = user_id::TEXT);

CREATE POLICY "Users can update own endpoints"
    ON endpoints FOR UPDATE
    USING (auth.uid() = user_id::TEXT);

CREATE POLICY "Users can delete own endpoints"
    ON endpoints FOR DELETE
    USING (auth.uid() = user_id::TEXT);

-- Alerts policies
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own alerts"
    ON alerts FOR SELECT
    USING (auth.uid() = user_id::TEXT);

CREATE POLICY "Users can insert own alerts"
    ON alerts FOR INSERT
    WITH CHECK (auth.uid() = user_id::TEXT);

CREATE POLICY "Users can update own alerts"
    ON alerts FOR UPDATE
    USING (auth.uid() = user_id::TEXT);

CREATE POLICY "Users can delete own alerts"
    ON alerts FOR DELETE
    USING (auth.uid() = user_id::TEXT);

-- Monitoring history policies
ALTER TABLE monitoring_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own endpoint history"
    ON monitoring_history FOR SELECT
    USING (auth.uid() = (SELECT user_id FROM endpoints WHERE endpoints.id = monitoring_history.endpoint_id)::TEXT);

-- Notifications policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id::TEXT);

CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id::TEXT);

-- ===============================
-- TRIGGERS FOR UPDATED_AT
-- ===============================

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger on endpoints
CREATE TRIGGER update_endpoints_updated_at
    BEFORE UPDATE ON endpoints
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger on alerts
CREATE TRIGGER update_alerts_updated_at
    BEFORE UPDATE ON alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===============================
-- FUNCTIONS
-- ===============================

-- Function to get user's active endpoints count
CREATE OR REPLACE FUNCTION get_active_endpoints_count(user_id_param UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM endpoints
        WHERE user_id = user_id_param
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's average response time
CREATE OR REPLACE FUNCTION get_average_response_time(user_id_param UUID)
RETURNS DECIMAL AS $$
BEGIN
    RETURN (
        SELECT COALESCE(AVG(response_time), 0)
        FROM endpoints
        WHERE user_id = user_id_param
        AND response_time IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's overall uptime
CREATE OR REPLACE FUNCTION get_overall_uptime(user_id_param UUID)
RETURNS DECIMAL AS $$
BEGIN
    RETURN (
        SELECT COALESCE(AVG(uptime), 100)
        FROM endpoints
        WHERE user_id = user_id_param
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
