-- 1. เปิดใช้งาน Extension สำหรับ UUID (ถ้ายังไม่เคยเปิด)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. สร้างตาราง Users
-- ==========================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR NOT NULL UNIQUE,
  display_name VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. สร้างตาราง Debts (หนี้สิน)
-- ==========================================
CREATE TABLE debts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  lender VARCHAR,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  remaining_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  interest_rate DECIMAL(5,2) DEFAULT 0,
  minimum_payment DECIMAL(10,2) DEFAULT 0,
  due_date_day INT CHECK (due_date_day BETWEEN 1 AND 31),
  status VARCHAR CHECK (status IN ('active', 'paid_off', 'paused')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 4. สร้างตาราง Transactions (บันทึกรายรับ-จ่าย)
-- ==========================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  debt_id UUID REFERENCES debts(id) ON DELETE SET NULL, -- ถ้าลบหนี้ ประวัติการจ่ายยังอยู่แต่ debt_id เป็น null
  
  type VARCHAR NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  note TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 5. สร้างตาราง Debt Histories (ประวัติรายเดือน)
-- ==========================================
CREATE TABLE debt_histories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  debt_id UUID NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
  record_month DATE NOT NULL, -- แนะนำให้เก็บเป็นวันแรกของเดือน เช่น 2024-02-01
  
  balance_start DECIMAL(12,2) NOT NULL,
  total_paid DECIMAL(12,2) DEFAULT 0,
  interest_added DECIMAL(12,2) DEFAULT 0,
  balance_end DECIMAL(12,2) NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 6. (Optional) ตาราง Monthly Budgets
-- ==========================================
CREATE TABLE monthly_budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  category VARCHAR NOT NULL,
  limit_amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 7. (Optional) ตาราง Recurring Transactions
-- ==========================================
CREATE TABLE recurring_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  name VARCHAR,
  day_of_month INT NOT NULL CHECK (day_of_month BETWEEN 1 AND 31),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 8. สร้าง Indexes (เพื่อประสิทธิภาพในการ Query)
-- ==========================================

-- ช่วยให้การค้นหา transaction ตาม user และวันที่เร็วขึ้น (ใช้บ่อยในหน้า Dashboard)
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);

-- ช่วยให้การดึงรายการหนี้ของ user เร็วขึ้น
CREATE INDEX idx_debts_user ON debts(user_id);

-- ช่วยให้การดึงประวัติกราฟหนี้เร็วขึ้น
CREATE INDEX idx_debt_histories_debt_month ON debt_histories(debt_id, record_month);