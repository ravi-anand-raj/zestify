-- ZESTIFY Initial Schema Migration
-- Generated: 2026-06-10
-- PostgreSQL 16+

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TRIGGER FUNCTION: auto-update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ENUMS (29 types)
-- ============================================================================

-- User & Auth enums
CREATE TYPE system_role       AS ENUM ('USER', 'SUPER_ADMIN');
CREATE TYPE user_status       AS ENUM ('ACTIVE', 'SUSPENDED', 'DEACTIVATED');

-- Profile enums
CREATE TYPE gender            AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');
CREATE TYPE marital_status    AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- Risk assessment enums
CREATE TYPE risk_tolerance       AS ENUM ('CONSERVATIVE', 'MODERATE_CONSERVATIVE', 'MODERATE', 'MODERATE_AGGRESSIVE', 'AGGRESSIVE');
CREATE TYPE investment_horizon   AS ENUM ('SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM', 'VERY_LONG_TERM');
CREATE TYPE investment_experience AS ENUM ('BEGINNER', 'INTERMEDIATE', 'EXPERIENCED', 'EXPERT');
CREATE TYPE income_stability     AS ENUM ('VERY_STABLE', 'STABLE', 'MODERATE', 'UNSTABLE');
CREATE TYPE risk_category        AS ENUM ('LOW', 'MODERATE_LOW', 'MODERATE', 'MODERATE_HIGH', 'HIGH');

-- Goal enums
CREATE TYPE goal_type     AS ENUM ('RETIREMENT', 'HOME_PURCHASE', 'EDUCATION', 'EMERGENCY_FUND', 'VACATION', 'WEDDING', 'CAR_PURCHASE', 'DEBT_PAYOFF', 'WEALTH_BUILDING', 'CUSTOM');
CREATE TYPE goal_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE goal_status   AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'ABANDONED');

-- Asset & Portfolio enums
CREATE TYPE asset_type     AS ENUM ('STOCK', 'MUTUAL_FUND', 'ETF', 'FIXED_DEPOSIT', 'GOLD', 'REAL_ESTATE', 'CRYPTO', 'PPF', 'NPS', 'EPF', 'BOND', 'CASH', 'SAVINGS_ACCOUNT', 'OTHER');
CREATE TYPE portfolio_type AS ENUM ('INVESTMENT', 'RETIREMENT', 'SAVINGS', 'TAX_SAVING', 'CUSTOM');

-- Transaction enums
CREATE TYPE transaction_type   AS ENUM ('BUY', 'SELL', 'DIVIDEND', 'SIP', 'SWITCH_IN', 'SWITCH_OUT', 'SPLIT', 'BONUS', 'INTEREST', 'DEPOSIT', 'WITHDRAWAL');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- AI enums
CREATE TYPE conversation_type   AS ENUM ('GENERAL', 'PORTFOLIO_ANALYSIS', 'GOAL_PLANNING', 'TAX_OPTIMIZATION', 'MARKET_INSIGHT');
CREATE TYPE conversation_status AS ENUM ('ACTIVE', 'ARCHIVED');
CREATE TYPE ai_message_role     AS ENUM ('USER', 'ASSISTANT', 'SYSTEM', 'TOOL');

-- Notification enums
CREATE TYPE notification_type    AS ENUM ('PRICE_ALERT', 'GOAL_MILESTONE', 'PORTFOLIO_REBALANCE', 'SIP_REMINDER', 'PAYMENT_DUE', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'MARKET_UPDATE', 'AI_INSIGHT', 'SYSTEM', 'SECURITY');
CREATE TYPE notification_channel AS ENUM ('IN_APP', 'EMAIL', 'PUSH', 'SMS');

-- Subscription & Billing enums
CREATE TYPE subscription_status AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED');
CREATE TYPE billing_cycle       AS ENUM ('MONTHLY', 'YEARLY');
CREATE TYPE payment_status      AS ENUM ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED');
CREATE TYPE payment_method      AS ENUM ('CARD', 'UPI', 'NETBANKING', 'WALLET', 'BANK_TRANSFER');

-- Report enums
CREATE TYPE report_type   AS ENUM ('PORTFOLIO_SUMMARY', 'TAX_REPORT', 'CAPITAL_GAINS', 'MONTHLY_STATEMENT', 'ANNUAL_REPORT', 'CUSTOM');
CREATE TYPE report_status AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE report_format AS ENUM ('PDF', 'CSV', 'XLSX');

-- Audit enum
CREATE TYPE audit_action AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'SETTINGS_CHANGE', 'SUBSCRIPTION_CHANGE', 'IMPERSONATE');


-- ============================================================================
-- TABLES (28 tables)
-- ============================================================================

-- --------------------------------------------------------
-- 1. users
-- Core user account table with soft-delete support.
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255)    UNIQUE NOT NULL,
    password_hash   VARCHAR(255),
    email_verified  TIMESTAMPTZ,
    role            system_role     NOT NULL DEFAULT 'USER',
    status          user_status     NOT NULL DEFAULT 'ACTIVE',
    last_login_at   TIMESTAMPTZ,
    last_login_ip   VARCHAR(45),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

-- --------------------------------------------------------
-- 2. accounts (OAuth / third-party provider accounts)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS accounts (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID            NOT NULL,
    type                VARCHAR(50)     NOT NULL,
    provider            VARCHAR(50)     NOT NULL,
    provider_account_id VARCHAR(255)    NOT NULL,
    refresh_token       TEXT,
    access_token        TEXT,
    expires_at          INTEGER,
    token_type          VARCHAR(50),
    scope               VARCHAR(500),
    id_token            TEXT,
    session_state       VARCHAR(255),

    CONSTRAINT uq_accounts_provider UNIQUE (provider, provider_account_id)
);

-- --------------------------------------------------------
-- 3. sessions
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID            NOT NULL,
    session_token   VARCHAR(500)    UNIQUE NOT NULL,
    expires         TIMESTAMPTZ     NOT NULL
);

-- --------------------------------------------------------
-- 4. verification_tokens (composite key, no UUID PK)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier  VARCHAR(255)    NOT NULL,
    token       VARCHAR(500)    UNIQUE NOT NULL,
    expires     TIMESTAMPTZ     NOT NULL,

    CONSTRAINT uq_verification_tokens_identifier_token UNIQUE (identifier, token)
);

-- --------------------------------------------------------
-- 5. profiles
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID            UNIQUE NOT NULL,
    first_name              VARCHAR(100)    NOT NULL,
    last_name               VARCHAR(100)    NOT NULL,
    display_name            VARCHAR(100),
    avatar_url              VARCHAR(500),
    date_of_birth           DATE,
    gender                  gender,
    phone                   VARCHAR(20),
    pan_number              VARCHAR(255),
    aadhaar_last_four       VARCHAR(4),
    address_line_1          VARCHAR(255),
    address_line_2          VARCHAR(255),
    city                    VARCHAR(100),
    state                   VARCHAR(100),
    pincode                 VARCHAR(10),
    country                 VARCHAR(2)      DEFAULT 'IN',
    occupation              VARCHAR(100),
    employer_name           VARCHAR(200),
    annual_income           DECIMAL(15,2),
    income_currency         VARCHAR(3)      DEFAULT 'INR',
    marital_status          marital_status,
    dependents              INTEGER         DEFAULT 0,
    onboarding_completed    BOOLEAN         DEFAULT FALSE,
    onboarding_step         INTEGER         DEFAULT 0,
    timezone                VARCHAR(50)     DEFAULT 'Asia/Kolkata',
    preferred_currency      VARCHAR(3)      DEFAULT 'INR',
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     DEFAULT NOW()
);

-- --------------------------------------------------------
-- 6. risk_profiles
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS risk_profiles (
    id                      UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID                    UNIQUE NOT NULL,
    risk_tolerance          risk_tolerance          NOT NULL,
    investment_horizon      investment_horizon      NOT NULL,
    investment_experience   investment_experience   NOT NULL,
    income_stability        income_stability        NOT NULL,
    risk_score              SMALLINT                NOT NULL,
    risk_category           risk_category           NOT NULL,
    assessment_date         TIMESTAMPTZ             NOT NULL,
    answers                 JSONB                   NOT NULL,
    is_active               BOOLEAN                 DEFAULT TRUE,
    created_at              TIMESTAMPTZ             DEFAULT NOW(),
    updated_at              TIMESTAMPTZ             DEFAULT NOW(),

    CONSTRAINT chk_risk_score_range CHECK (risk_score >= 0 AND risk_score <= 100)
);

-- --------------------------------------------------------
-- 7. goals
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS goals (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID            NOT NULL,
    name                    VARCHAR(200)    NOT NULL,
    type                    goal_type       NOT NULL,
    target_amount           DECIMAL(15,2)   NOT NULL,
    current_amount          DECIMAL(15,2)   DEFAULT 0,
    currency                VARCHAR(3)      DEFAULT 'INR',
    target_date             DATE            NOT NULL,
    start_date              DATE            NOT NULL,
    priority                goal_priority   DEFAULT 'MEDIUM',
    status                  goal_status     DEFAULT 'ACTIVE',
    monthly_contribution    DECIMAL(12,2),
    expected_return_rate    DECIMAL(5,2),
    inflation_rate          DECIMAL(5,2)    DEFAULT 6.00,
    notes                   TEXT,
    icon_name               VARCHAR(50),
    color                   VARCHAR(7),
    metadata                JSONB,
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ,

    CONSTRAINT chk_goals_target_amount  CHECK (target_amount > 0),
    CONSTRAINT chk_goals_current_amount CHECK (current_amount >= 0)
);

-- --------------------------------------------------------
-- 8. asset_classes (reference/lookup table)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS asset_classes (
    id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100)    UNIQUE NOT NULL,
    slug        VARCHAR(100)    UNIQUE NOT NULL,
    description TEXT,
    icon_name   VARCHAR(50),
    color       VARCHAR(7),
    risk_level  SMALLINT        NOT NULL,
    sort_order  SMALLINT        DEFAULT 0,
    created_at  TIMESTAMPTZ     DEFAULT NOW(),

    CONSTRAINT chk_asset_classes_risk_level CHECK (risk_level >= 1 AND risk_level <= 5)
);

-- --------------------------------------------------------
-- 9. assets
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS assets (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(300)    NOT NULL,
    asset_class_id      UUID            NOT NULL,
    type                asset_type      NOT NULL,
    symbol              VARCHAR(30),
    exchange            VARCHAR(20),
    isin                VARCHAR(12),
    current_price       DECIMAL(15,4),
    previous_close      DECIMAL(15,4),
    day_change          DECIMAL(15,4),
    day_change_percent  DECIMAL(8,4),
    currency            VARCHAR(3)      DEFAULT 'INR',
    last_price_update   TIMESTAMPTZ,
    logo_url            VARCHAR(500),
    sector              VARCHAR(100),
    industry            VARCHAR(100),
    metadata            JSONB,
    is_active           BOOLEAN         DEFAULT TRUE,
    created_at          TIMESTAMPTZ     DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     DEFAULT NOW(),

    CONSTRAINT uq_asset_symbol_exchange UNIQUE (symbol, exchange)
);

-- --------------------------------------------------------
-- 10. portfolios
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolios (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID            NOT NULL,
    name                    VARCHAR(200)    NOT NULL,
    description             TEXT,
    type                    portfolio_type  DEFAULT 'INVESTMENT',
    is_default              BOOLEAN         DEFAULT FALSE,
    currency                VARCHAR(3)      DEFAULT 'INR',
    total_invested          DECIMAL(15,2)   DEFAULT 0,
    current_value           DECIMAL(15,2)   DEFAULT 0,
    total_returns           DECIMAL(15,2)   DEFAULT 0,
    returns_percentage      DECIMAL(8,4)    DEFAULT 0,
    day_change              DECIMAL(15,2)   DEFAULT 0,
    day_change_percentage   DECIMAL(8,4)    DEFAULT 0,
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ
);

-- --------------------------------------------------------
-- 11. goal_allocations
-- Links goals to portfolios with allocation percentages.
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS goal_allocations (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id                 UUID            NOT NULL,
    portfolio_id            UUID            NOT NULL,
    allocation_percentage   DECIMAL(5,2)    NOT NULL,
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     DEFAULT NOW(),

    CONSTRAINT uq_goal_allocation UNIQUE (goal_id, portfolio_id),
    CONSTRAINT chk_goal_allocation_pct CHECK (allocation_percentage > 0 AND allocation_percentage <= 100)
);

-- --------------------------------------------------------
-- 12. portfolio_holdings
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolio_holdings (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id            UUID            NOT NULL,
    asset_id                UUID            NOT NULL,
    quantity                DECIMAL(18,6)   NOT NULL,
    avg_buy_price           DECIMAL(15,4)   NOT NULL,
    invested_value          DECIMAL(15,2)   NOT NULL,
    current_value           DECIMAL(15,2)   NOT NULL,
    unrealized_gain         DECIMAL(15,2)   NOT NULL,
    unrealized_gain_percent DECIMAL(8,4)    NOT NULL,
    weight_percentage       DECIMAL(5,2),
    first_buy_date          DATE,
    last_transaction_date   DATE,
    created_at              TIMESTAMPTZ     DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     DEFAULT NOW(),

    CONSTRAINT uq_holding_portfolio_asset UNIQUE (portfolio_id, asset_id),
    CONSTRAINT chk_holdings_quantity      CHECK (quantity > 0),
    CONSTRAINT chk_holdings_avg_price     CHECK (avg_buy_price >= 0)
);

-- --------------------------------------------------------
-- 13. transactions
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
    id                  UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID                NOT NULL,
    portfolio_id        UUID                NOT NULL,
    asset_id            UUID                NOT NULL,
    type                transaction_type    NOT NULL,
    quantity            DECIMAL(18,6)       NOT NULL,
    price               DECIMAL(15,4)       NOT NULL,
    amount              DECIMAL(15,2)       NOT NULL,
    fees                DECIMAL(12,2)       DEFAULT 0,
    tax                 DECIMAL(12,2)       DEFAULT 0,
    total_amount        DECIMAL(15,2)       NOT NULL,
    currency            VARCHAR(3)          DEFAULT 'INR',
    transaction_date    TIMESTAMPTZ         NOT NULL,
    settlement_date     TIMESTAMPTZ,
    notes               TEXT,
    reference_number    VARCHAR(100),
    status              transaction_status  DEFAULT 'COMPLETED',
    sip_id              VARCHAR(100),
    metadata            JSONB,
    created_at          TIMESTAMPTZ         DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         DEFAULT NOW(),

    CONSTRAINT chk_txn_quantity CHECK (quantity > 0),
    CONSTRAINT chk_txn_price    CHECK (price >= 0)
);

-- --------------------------------------------------------
-- 14. watchlists
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS watchlists (
    id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID            NOT NULL,
    name        VARCHAR(200)    NOT NULL,
    description VARCHAR(500),
    is_default  BOOLEAN         DEFAULT FALSE,
    created_at  TIMESTAMPTZ     DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     DEFAULT NOW()
);

-- --------------------------------------------------------
-- 15. watchlist_items
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS watchlist_items (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    watchlist_id        UUID            NOT NULL,
    asset_id            UUID            NOT NULL,
    added_price         DECIMAL(15,4),
    alert_above_price   DECIMAL(15,4),
    alert_below_price   DECIMAL(15,4),
    notes               VARCHAR(500),
    created_at          TIMESTAMPTZ     DEFAULT NOW(),

    CONSTRAINT uq_watchlist_asset UNIQUE (watchlist_id, asset_id)
);

-- --------------------------------------------------------
-- 16. health_scores (financial health snapshots)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS health_scores (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID        NOT NULL,
    overall_score           SMALLINT    NOT NULL,
    savings_score           SMALLINT    NOT NULL,
    debt_score              SMALLINT    NOT NULL,
    investment_score        SMALLINT    NOT NULL,
    insurance_score         SMALLINT    NOT NULL,
    tax_score               SMALLINT    NOT NULL,
    emergency_fund_score    SMALLINT    NOT NULL,
    assessment_date         DATE        NOT NULL,
    recommendations         JSONB       NOT NULL,
    breakdown               JSONB       NOT NULL,
    previous_score          SMALLINT,
    score_change            SMALLINT,
    created_at              TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT chk_hs_overall          CHECK (overall_score >= 0 AND overall_score <= 100),
    CONSTRAINT chk_hs_savings          CHECK (savings_score >= 0 AND savings_score <= 100),
    CONSTRAINT chk_hs_debt             CHECK (debt_score >= 0 AND debt_score <= 100),
    CONSTRAINT chk_hs_investment       CHECK (investment_score >= 0 AND investment_score <= 100),
    CONSTRAINT chk_hs_insurance        CHECK (insurance_score >= 0 AND insurance_score <= 100),
    CONSTRAINT chk_hs_tax              CHECK (tax_score >= 0 AND tax_score <= 100),
    CONSTRAINT chk_hs_emergency_fund   CHECK (emergency_fund_score >= 0 AND emergency_fund_score <= 100)
);

-- --------------------------------------------------------
-- 17. ai_conversations
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_conversations (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID                NOT NULL,
    title           VARCHAR(300),
    type            conversation_type   DEFAULT 'GENERAL',
    status          conversation_status DEFAULT 'ACTIVE',
    total_tokens    INTEGER             DEFAULT 0,
    model_used      VARCHAR(50),
    metadata        JSONB,
    created_at      TIMESTAMPTZ         DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         DEFAULT NOW()
);

-- --------------------------------------------------------
-- 18. ai_messages
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_messages (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID            NOT NULL,
    role            ai_message_role NOT NULL,
    content         TEXT            NOT NULL,
    tool_calls      JSONB,
    tool_results    JSONB,
    metadata        JSONB,
    token_count     INTEGER,
    latency_ms      INTEGER,
    created_at      TIMESTAMPTZ     DEFAULT NOW()
);

-- --------------------------------------------------------
-- 19. notifications
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id          UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID                NOT NULL,
    type        notification_type   NOT NULL,
    channel     notification_channel DEFAULT 'IN_APP',
    title       VARCHAR(300)        NOT NULL,
    body        TEXT                NOT NULL,
    data        JSONB,
    action_url  VARCHAR(500),
    image_url   VARCHAR(500),
    is_read     BOOLEAN             DEFAULT FALSE,
    read_at     TIMESTAMPTZ,
    sent_at     TIMESTAMPTZ,
    expires_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ         DEFAULT NOW()
);

-- --------------------------------------------------------
-- 20. notification_preferences
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS notification_preferences (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID                NOT NULL,
    type            notification_type   NOT NULL,
    email_enabled   BOOLEAN             DEFAULT TRUE,
    push_enabled    BOOLEAN             DEFAULT TRUE,
    in_app_enabled  BOOLEAN             DEFAULT TRUE,
    sms_enabled     BOOLEAN             DEFAULT FALSE,
    updated_at      TIMESTAMPTZ         DEFAULT NOW(),

    CONSTRAINT uq_notification_pref_user_type UNIQUE (user_id, type)
);

-- --------------------------------------------------------
-- 21. plans (subscription tier definitions)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS plans (
    id                          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name                        VARCHAR(100)    NOT NULL,
    slug                        VARCHAR(100)    UNIQUE NOT NULL,
    description                 TEXT,
    monthly_price               DECIMAL(10,2)   NOT NULL,
    yearly_price                DECIMAL(10,2)   NOT NULL,
    currency                    VARCHAR(3)      DEFAULT 'INR',
    features                    JSONB           DEFAULT '[]',
    limits                      JSONB           DEFAULT '{}',
    trial_days                  INTEGER         DEFAULT 0,
    is_active                   BOOLEAN         DEFAULT TRUE,
    is_popular                  BOOLEAN         DEFAULT FALSE,
    sort_order                  SMALLINT        DEFAULT 0,
    razorpay_plan_id_monthly    VARCHAR(100),
    razorpay_plan_id_yearly     VARCHAR(100),
    created_at                  TIMESTAMPTZ     DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ     DEFAULT NOW()
);

-- --------------------------------------------------------
-- 22. subscriptions
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
    id                          UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                     UUID                UNIQUE NOT NULL,
    plan_id                     UUID                NOT NULL,
    status                      subscription_status DEFAULT 'TRIALING',
    billing_cycle               billing_cycle       DEFAULT 'MONTHLY',
    razorpay_subscription_id    VARCHAR(100),
    razorpay_customer_id        VARCHAR(100),
    current_period_start        TIMESTAMPTZ         NOT NULL,
    current_period_end          TIMESTAMPTZ         NOT NULL,
    trial_start                 TIMESTAMPTZ,
    trial_end                   TIMESTAMPTZ,
    cancelled_at                TIMESTAMPTZ,
    cancel_reason               VARCHAR(500),
    metadata                    JSONB,
    created_at                  TIMESTAMPTZ         DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ         DEFAULT NOW()
);

-- --------------------------------------------------------
-- 23. payments
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID            NOT NULL,
    subscription_id     UUID,
    razorpay_payment_id VARCHAR(100)    UNIQUE,
    razorpay_order_id   VARCHAR(100),
    razorpay_signature  VARCHAR(500),
    amount              DECIMAL(10,2)   NOT NULL,
    currency            VARCHAR(3)      DEFAULT 'INR',
    status              payment_status  DEFAULT 'CREATED',
    method              payment_method,
    description         VARCHAR(500),
    receipt_url         VARCHAR(500),
    failure_reason      VARCHAR(500),
    idempotency_key     VARCHAR(100)    UNIQUE,
    metadata            JSONB,
    paid_at             TIMESTAMPTZ,
    refunded_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ     DEFAULT NOW(),

    CONSTRAINT chk_payments_amount CHECK (amount > 0)
);

-- --------------------------------------------------------
-- 24. reports
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID            NOT NULL,
    type            report_type     NOT NULL,
    title           VARCHAR(300)    NOT NULL,
    status          report_status   DEFAULT 'QUEUED',
    file_url        VARCHAR(500),
    file_size       INTEGER,
    format          report_format   DEFAULT 'PDF',
    parameters      JSONB,
    generated_at    TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ,
    error_message   TEXT,
    created_at      TIMESTAMPTZ     DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     DEFAULT NOW()
);

-- --------------------------------------------------------
-- 25. audit_logs (immutable append-only log)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID,
    entity_type     VARCHAR(100)    NOT NULL,
    entity_id       VARCHAR(36)     NOT NULL,
    action          audit_action    NOT NULL,
    old_values      JSONB,
    new_values      JSONB,
    ip_address      VARCHAR(45),
    user_agent      VARCHAR(500),
    session_id      VARCHAR(100),
    created_at      TIMESTAMPTZ     DEFAULT NOW()
);

-- --------------------------------------------------------
-- 26. system_settings (key-value configuration store)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_settings (
    id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    key         VARCHAR(200)    UNIQUE NOT NULL,
    value       JSONB           NOT NULL,
    description TEXT,
    is_public   BOOLEAN         DEFAULT FALSE,
    created_at  TIMESTAMPTZ     DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     DEFAULT NOW()
);

-- --------------------------------------------------------
-- 27. feature_flags
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS feature_flags (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    key                 VARCHAR(200)    UNIQUE NOT NULL,
    description         TEXT,
    is_enabled          BOOLEAN         DEFAULT FALSE,
    rollout_percentage  SMALLINT        DEFAULT 0,
    conditions          JSONB,
    created_at          TIMESTAMPTZ     DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     DEFAULT NOW(),

    CONSTRAINT chk_ff_rollout_pct CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100)
);

-- --------------------------------------------------------
-- 28. admin_notes
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_notes (
    id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id        UUID    NOT NULL,
    target_user_id  UUID    NOT NULL,
    content         TEXT    NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- FOREIGN KEYS
-- Defined separately so table creation order doesn't matter and for clarity.
-- ============================================================================

-- accounts
ALTER TABLE accounts
    ADD CONSTRAINT fk_accounts_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- sessions
ALTER TABLE sessions
    ADD CONSTRAINT fk_sessions_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- profiles
ALTER TABLE profiles
    ADD CONSTRAINT fk_profiles_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- risk_profiles
ALTER TABLE risk_profiles
    ADD CONSTRAINT fk_risk_profiles_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- goals
ALTER TABLE goals
    ADD CONSTRAINT fk_goals_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- goal_allocations
ALTER TABLE goal_allocations
    ADD CONSTRAINT fk_goal_allocations_goal_id
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE;

ALTER TABLE goal_allocations
    ADD CONSTRAINT fk_goal_allocations_portfolio_id
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE;

-- assets
ALTER TABLE assets
    ADD CONSTRAINT fk_assets_asset_class_id
    FOREIGN KEY (asset_class_id) REFERENCES asset_classes(id);

-- portfolios
ALTER TABLE portfolios
    ADD CONSTRAINT fk_portfolios_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- portfolio_holdings
ALTER TABLE portfolio_holdings
    ADD CONSTRAINT fk_portfolio_holdings_portfolio_id
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE;

ALTER TABLE portfolio_holdings
    ADD CONSTRAINT fk_portfolio_holdings_asset_id
    FOREIGN KEY (asset_id) REFERENCES assets(id);

-- transactions
ALTER TABLE transactions
    ADD CONSTRAINT fk_transactions_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE transactions
    ADD CONSTRAINT fk_transactions_portfolio_id
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id);

ALTER TABLE transactions
    ADD CONSTRAINT fk_transactions_asset_id
    FOREIGN KEY (asset_id) REFERENCES assets(id);

-- watchlists
ALTER TABLE watchlists
    ADD CONSTRAINT fk_watchlists_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- watchlist_items
ALTER TABLE watchlist_items
    ADD CONSTRAINT fk_watchlist_items_watchlist_id
    FOREIGN KEY (watchlist_id) REFERENCES watchlists(id) ON DELETE CASCADE;

ALTER TABLE watchlist_items
    ADD CONSTRAINT fk_watchlist_items_asset_id
    FOREIGN KEY (asset_id) REFERENCES assets(id);

-- health_scores
ALTER TABLE health_scores
    ADD CONSTRAINT fk_health_scores_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ai_conversations
ALTER TABLE ai_conversations
    ADD CONSTRAINT fk_ai_conversations_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ai_messages
ALTER TABLE ai_messages
    ADD CONSTRAINT fk_ai_messages_conversation_id
    FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE;

-- notifications
ALTER TABLE notifications
    ADD CONSTRAINT fk_notifications_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- notification_preferences
ALTER TABLE notification_preferences
    ADD CONSTRAINT fk_notification_preferences_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- subscriptions
ALTER TABLE subscriptions
    ADD CONSTRAINT fk_subscriptions_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE subscriptions
    ADD CONSTRAINT fk_subscriptions_plan_id
    FOREIGN KEY (plan_id) REFERENCES plans(id);

-- payments
ALTER TABLE payments
    ADD CONSTRAINT fk_payments_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE payments
    ADD CONSTRAINT fk_payments_subscription_id
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id);

-- reports
ALTER TABLE reports
    ADD CONSTRAINT fk_reports_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- audit_logs (SET NULL — preserve log rows when user is deleted)
ALTER TABLE audit_logs
    ADD CONSTRAINT fk_audit_logs_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- admin_notes
ALTER TABLE admin_notes
    ADD CONSTRAINT fk_admin_notes_admin_id
    FOREIGN KEY (admin_id) REFERENCES users(id);

ALTER TABLE admin_notes
    ADD CONSTRAINT fk_admin_notes_target_user_id
    FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE;


-- ============================================================================
-- INDEXES — B-tree (48 indexes)
-- ============================================================================

-- users (email index omitted — already covered by UNIQUE constraint)
CREATE INDEX idx_users_status     ON users (status);
CREATE INDEX idx_users_role       ON users (role);
CREATE INDEX idx_users_created_at ON users (created_at);

-- accounts
CREATE INDEX idx_accounts_user_id ON accounts (user_id);

-- sessions
CREATE INDEX idx_sessions_user_id ON sessions (user_id);

-- profiles
CREATE INDEX idx_profiles_phone ON profiles (phone);

-- risk_profiles
CREATE INDEX idx_risk_profiles_risk_category ON risk_profiles (risk_category);

-- goals
CREATE INDEX idx_goals_user_id_status ON goals (user_id, status);
CREATE INDEX idx_goals_user_id_type   ON goals (user_id, type);
CREATE INDEX idx_goals_target_date    ON goals (target_date);

-- assets
CREATE INDEX idx_assets_type           ON assets (type);
CREATE INDEX idx_assets_asset_class_id ON assets (asset_class_id);
CREATE INDEX idx_assets_isin           ON assets (isin);
CREATE INDEX idx_assets_active_type    ON assets (is_active, type);

-- portfolios
CREATE INDEX idx_portfolios_user_id_type       ON portfolios (user_id, type);
CREATE INDEX idx_portfolios_user_id_is_default ON portfolios (user_id, is_default);

-- portfolio_holdings
CREATE INDEX idx_portfolio_holdings_asset_id ON portfolio_holdings (asset_id);

-- transactions
CREATE INDEX idx_txn_user_date      ON transactions (user_id, transaction_date DESC);
CREATE INDEX idx_txn_portfolio_date ON transactions (portfolio_id, transaction_date DESC);
CREATE INDEX idx_txn_asset_date     ON transactions (asset_id, transaction_date DESC);
CREATE INDEX idx_txn_user_type      ON transactions (user_id, type);
CREATE INDEX idx_txn_status         ON transactions (status);

-- watchlists
CREATE INDEX idx_watchlists_user_id ON watchlists (user_id);

-- watchlist_items
CREATE INDEX idx_watchlist_items_asset_id ON watchlist_items (asset_id);

-- health_scores
CREATE INDEX idx_health_scores_user_assessment ON health_scores (user_id, assessment_date DESC);
CREATE INDEX idx_health_scores_user_created    ON health_scores (user_id, created_at DESC);

-- ai_conversations
CREATE INDEX idx_ai_conv_user_updated ON ai_conversations (user_id, updated_at DESC);
CREATE INDEX idx_ai_conv_user_type    ON ai_conversations (user_id, type);

-- ai_messages
CREATE INDEX idx_ai_msg_conv_created ON ai_messages (conversation_id, created_at);

-- notifications
CREATE INDEX idx_notif_user_read_created ON notifications (user_id, is_read, created_at DESC);
CREATE INDEX idx_notif_user_type         ON notifications (user_id, type);

-- subscriptions
CREATE INDEX idx_subscriptions_status             ON subscriptions (status);
CREATE INDEX idx_subscriptions_period_end         ON subscriptions (current_period_end);
CREATE INDEX idx_subscriptions_razorpay_sub_id    ON subscriptions (razorpay_subscription_id);

-- payments
CREATE INDEX idx_payments_user_created   ON payments (user_id, created_at DESC);
CREATE INDEX idx_payments_status         ON payments (status);
CREATE INDEX idx_payments_razorpay_order ON payments (razorpay_order_id);

-- reports
CREATE INDEX idx_reports_user_created ON reports (user_id, created_at DESC);
CREATE INDEX idx_reports_status       ON reports (status);

-- audit_logs
CREATE INDEX idx_audit_user_created  ON audit_logs (user_id, created_at DESC);
CREATE INDEX idx_audit_entity        ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_action        ON audit_logs (action);
CREATE INDEX idx_audit_created       ON audit_logs (created_at DESC);

-- admin_notes
CREATE INDEX idx_admin_notes_target_created ON admin_notes (target_user_id, created_at DESC);
CREATE INDEX idx_admin_notes_admin_id       ON admin_notes (admin_id);


-- ============================================================================
-- PARTIAL INDEXES — for sparse / nullable columns
-- ============================================================================

-- Only index rows where sip_id is populated (most transactions won't have one)
CREATE INDEX idx_txn_sip_id
    ON transactions (sip_id)
    WHERE sip_id IS NOT NULL;

-- Fast lookup of notifications nearing expiry
CREATE INDEX idx_notif_expires
    ON notifications (expires_at)
    WHERE expires_at IS NOT NULL;

-- Soft-delete: quickly find active (non-deleted) users
CREATE INDEX idx_users_active
    ON users (id)
    WHERE deleted_at IS NULL;

-- Soft-delete: quickly find active (non-deleted) goals
CREATE INDEX idx_goals_active
    ON goals (user_id, status)
    WHERE deleted_at IS NULL;

-- Soft-delete: quickly find active (non-deleted) portfolios
CREATE INDEX idx_portfolios_active
    ON portfolios (user_id)
    WHERE deleted_at IS NULL;


-- ============================================================================
-- GIN INDEXES — for JSONB containment / key-exists queries
-- ============================================================================

CREATE INDEX idx_assets_metadata_gin             ON assets             USING gin (metadata)            WHERE metadata IS NOT NULL;
CREATE INDEX idx_notifications_data_gin          ON notifications      USING gin (data)                WHERE data IS NOT NULL;
CREATE INDEX idx_health_scores_recommendations_gin ON health_scores    USING gin (recommendations);
CREATE INDEX idx_plans_features_gin              ON plans              USING gin (features);
CREATE INDEX idx_plans_limits_gin                ON plans              USING gin (limits);
CREATE INDEX idx_audit_logs_old_values_gin       ON audit_logs         USING gin (old_values)          WHERE old_values IS NOT NULL;
CREATE INDEX idx_audit_logs_new_values_gin       ON audit_logs         USING gin (new_values)          WHERE new_values IS NOT NULL;


-- ============================================================================
-- TRIGGERS — auto-update updated_at on row modification
-- Applied to all 17 tables that carry an updated_at column.
-- ============================================================================

CREATE TRIGGER set_updated_at_users
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_risk_profiles
    BEFORE UPDATE ON risk_profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_goals
    BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_goal_allocations
    BEFORE UPDATE ON goal_allocations
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_assets
    BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_portfolios
    BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_portfolio_holdings
    BEFORE UPDATE ON portfolio_holdings
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_transactions
    BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_watchlists
    BEFORE UPDATE ON watchlists
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_ai_conversations
    BEFORE UPDATE ON ai_conversations
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_notification_preferences
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_plans
    BEFORE UPDATE ON plans
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_subscriptions
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_reports
    BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_system_settings
    BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_feature_flags
    BEFORE UPDATE ON feature_flags
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ============================================================================
-- PRISMA MIGRATION METADATA
-- CreateTable for _prisma_migrations is handled by Prisma itself
-- ============================================================================


-- Migration complete: 28 tables, 29 enums, 55 indexes created
