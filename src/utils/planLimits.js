// C:\Users\HP\Desktop\TheSpark\thespark-frontend\src\utils\planLimits.js
// ✅ ES Modules - Best for frontend

// ============================================================
// Plan limits — used by deposit forms and validation
// ============================================================
export const PLAN_LIMITS = {
    'Basic': { min: 100, max: 2000 },
    'Premium': { min: 500, max: 10000 },
    'Investor': { min: 1000, max: 20000 }
};

export function getPlanLimits(plan) {
    return PLAN_LIMITS[plan] || PLAN_LIMITS['Basic'];
}

export function validateDepositAmount(amount, plan) {
    const limits = getPlanLimits(plan);
    return amount >= limits.min && amount <= limits.max;
}

// ============================================================
// Shared plan helpers — used by PremiumPlans.jsx, AdminDashboard.jsx
// ============================================================

/**
 * Safe number — returns fallback if value isn't a finite number.
 * Protects against null, undefined, NaN, "abc", {}, etc.
 */
export const safeNum = (v, fallback = 0) =>
    typeof v === 'number' && Number.isFinite(v) ? v : fallback;

/**
 * Format a number as Nigerian Naira with commas.
 * money(1000)       → "₦1,000"
 * money(undefined)  → "₦0"
 */
export const money = (n) => `₦${safeNum(n).toLocaleString()}`;

/**
 * Real % off: how much cheaper is yearly vs paying monthly × 12.
 * Returns integer percent (0-100). Returns 0 if data is missing.
 */
export const computeDiscount = (plan) => {
    const monthly = safeNum(plan?.monthlyFee);
    const yearly = safeNum(plan?.yearlyFee);
    if (monthly <= 0 || yearly <= 0) return 0;
    const fullYear = monthly * 12;
    const saved = fullYear - yearly;
    if (saved <= 0) return 0;
    return Math.round((saved / fullYear) * 100);
};

/**
 * ₦ saved per year by choosing yearly over monthly.
 * computeSavings({ monthlyFee: 1000, yearlyFee: 10000 }) → 2000
 */
export const computeSavings = (plan) => {
    const monthly = safeNum(plan?.monthlyFee);
    const yearly = safeNum(plan?.yearlyFee);
    if (monthly <= 0 || yearly <= 0) return 0;
    return Math.max(0, monthly * 12 - yearly);
};