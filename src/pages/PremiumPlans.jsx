// TheSpark\thespark-frontend\src\pages\PremiumPlans.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Modal, message } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { api, setAuthToken } from '../services/api';
import { auth } from '../services/firebase';
import { parseDate } from '../utils/dateUtils';
import {
    safeNum,
    money,
    computeDiscount,
    computeSavings,
} from '../utils/planLimits';
import toast from 'react-hot-toast';

export default function PremiumPlans() {
    const { userData, refreshUserData } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState(false);
    const [billingInterval, setBillingInterval] = useState('monthly');
    const [pendingPlan, setPendingPlan] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loadError, setLoadError] = useState(null);

    const isLoggedIn = !!userData;

    useEffect(() => {
        loadPlans();
    }, []);

    useEffect(() => {
        if (userData?.premiumBillingInterval === 'yearly') {
            setBillingInterval('yearly');
        } else if (userData?.premiumBillingInterval === 'monthly') {
            setBillingInterval('monthly');
        }
    }, [userData?.premiumBillingInterval]);

    const loadPlans = async () => {
        setLoading(true);
        setLoadError(null);
        try {
            if (auth.currentUser) {
                const idToken = await auth.currentUser.getIdToken();
                setAuthToken(idToken);
            }
            const { data } = await api.get('/graduation/premium-plans');
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No plans returned');
            }
            setPlans(data);
        } catch (error) {
            console.error('Failed to load plans:', error);
            setLoadError(error.response?.data?.error || 'Failed to load premium plans.');
            toast.error('Failed to load premium plans. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    const currentPlan = userData?.premiumPlan || 'Basic';
    const currentBalance = safeNum(userData?.currentBalance);
    const renewalDate = parseDate(userData?.premiumExpiresAt);
    const currentBillingLabel = userData?.premiumBillingInterval === 'yearly' ? 'yearly' : 'monthly';

    const planMap = useMemo(() => {
        const map = {};
        plans.forEach(p => { map[p.name] = p; });
        return map;
    }, [plans]);

    const premiumPlan = planMap['Premium'];
    const basicPlan = planMap['Basic'];
    const investorPlan = planMap['Investor'];

    const currentLevel = planMap[currentPlan]?.level ?? 1;

    const currentPlanDiscount = computeDiscount(planMap[currentPlan]);
    const featuredDiscount =
        currentPlanDiscount ||
        computeDiscount(premiumPlan) ||
        computeDiscount(investorPlan) ||
        0;

    const getButtonText = (plan) => {
        if (!plan) return '';
        if (currentPlan === plan.name) return 'Current Plan';
        if (plan.level > currentLevel) return `Upgrade to ${plan.name}`;
        if (plan.level < currentLevel) return `Downgrade to ${plan.name}`;
        return `Switch to ${plan.name}`;
    };

    const requestPlanChange = (plan) => {
        if (!isLoggedIn) {
            window.location.href = '/register';
            return;
        }
        setPendingPlan(plan);
        setModalOpen(true);
    };

    const confirmPlanChange = async () => {
        if (!pendingPlan) return;
        setModalOpen(false);
        setUpgrading(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);

            const idempotencyKey = `${pendingPlan.name}-${billingInterval}-${Date.now()}`;

            const { data } = await api.post('/graduation/premium/upgrade', {
                planName: pendingPlan.name,
                billingInterval,
                idempotencyKey,
            });

            message.success(data.message);
            await refreshUserData();
            setPendingPlan(null);
            setTimeout(() => window.location.reload(), 700);
        } catch (error) {
            console.error('Upgrade error:', error);

            if (error.response?.status === 429) {
                const waitFor = error.response.data?.retryAfter;
                toast.error(
                    waitFor
                        ? `Please wait ${waitFor}s before changing plans again.`
                        : 'Please wait a moment before changing plans again.'
                );
            } else {
                toast.error(error.response?.data?.error || 'Failed to update plan');
            }
        } finally {
            setUpgrading(false);
        }
    };

    const cancelPlanChange = () => {
        setModalOpen(false);
        setPendingPlan(null);
    };

    const isUpgrade = pendingPlan && pendingPlan.level > currentLevel;
    const isDowngrade = pendingPlan && pendingPlan.level < currentLevel;
    const isPaidChange = (isUpgrade || isDowngrade) && safeNum(pendingPlan?.monthlyFee) > 0;
    const isFreeDowngrade = isDowngrade && safeNum(pendingPlan?.monthlyFee) === 0;

    const modalFee = pendingPlan
        ? (billingInterval === 'yearly'
            ? safeNum(pendingPlan.yearlyFee)
            : safeNum(pendingPlan.monthlyFee))
        : 0;
    const hasEnoughBalance = pendingPlan ? currentBalance >= modalFee : true;
    const pendingDiscount = computeDiscount(pendingPlan);
    const pendingSavings = computeSavings(pendingPlan);

    // ============================================================
    // MODAL TITLE + OK TEXT — clear and honest about downgrades
    // ============================================================
    const modalTitle =
        isUpgrade ? `Upgrade to ${pendingPlan?.name}?`
        : isDowngrade ? `Downgrade to ${pendingPlan?.name}?`
        : `Switch to ${pendingPlan?.name}?`;

    const modalOkText =
        isDowngrade ? 'Downgrade Anyway'
        : isPaidChange ? `Pay ${money(modalFee)}`
        : 'Confirm';

    // Downgrades show a red OK button (destructive action)
    const okIsDangerous = isDowngrade;

    // Does the user have time left on a paid plan?
    const hasRemainingPaidTime =
        currentPlan !== 'Basic' &&
        renewalDate &&
        renewalDate.getTime() > Date.now();

    const normalizeFeature = (raw) => {
        if (!raw || typeof raw !== 'string') return '';
        return raw
            .replace(/^[✓✔\u2705\u2714]\s*/u, '')
            .replace(/^[^\w]+/u, '')
            .trim();
    };

    const getInheritsFrom = (rawFeature) => {
        const stripped = normalizeFeature(rawFeature).toLowerCase();
        const m = stripped.match(/^everything in\s+(.+)$/);
        if (!m) return null;
        const parent = m[1].trim();
        return parent.charAt(0).toUpperCase() + parent.slice(1);
    };

    const resolveEffectiveFeatures = (planName, seen = new Set()) => {
        if (!planName || seen.has(planName)) return [];
        seen.add(planName);

        const plan = planMap[planName];
        if (!plan) return [];

        const own = [];
        const inheritedSources = [];

        (plan.features || []).forEach((raw) => {
            const parent = getInheritsFrom(raw);
            if (parent) {
                inheritedSources.push(parent);
            } else {
                const display = normalizeFeature(raw);
                if (display) own.push(display);
            }
        });

        const merged = [...own];
        inheritedSources.forEach((parentName) => {
            const parentFeatures = resolveEffectiveFeatures(parentName, seen);
            parentFeatures.forEach((f) => {
                const key = f.toLowerCase();
                if (!merged.some((x) => x.toLowerCase() === key)) {
                    merged.push(f);
                }
            });
        });

        return merged;
    };

    const effectiveFeaturesByPlan = useMemo(() => {
        const result = {};
        ['Basic', 'Premium', 'Investor'].forEach((name) => {
            result[name] = resolveEffectiveFeatures(name);
        });
        return result;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [planMap]);

    const comparisonRows = useMemo(() => {
        const basicMax = safeNum(basicPlan?.dailySaveMax);
        const premiumMax = safeNum(premiumPlan?.dailySaveMax);
        const investorMax = safeNum(investorPlan?.dailySaveMax);

        const rows = [
            {
                name: 'Daily goal limit',
                basic: `₦${basicMax.toLocaleString()}`,
                premium: `₦${premiumMax.toLocaleString()}`,
                investor: `₦${investorMax.toLocaleString()}`,
            },
        ];

        const seenKeys = new Set();
        const ordered = [];

        ['Basic', 'Premium', 'Investor'].forEach((planName) => {
            (effectiveFeaturesByPlan[planName] || []).forEach((display) => {
                const key = display.toLowerCase();
                if (key && !seenKeys.has(key)) {
                    seenKeys.add(key);
                    ordered.push(display);
                }
            });
        });

        const has = (planName, display) => {
            const key = display.toLowerCase();
            return (effectiveFeaturesByPlan[planName] || []).some(
                (f) => f.toLowerCase() === key
            );
        };

        ordered.forEach((display) => {
            rows.push({
                name: display,
                basic: has('Basic', display) ? '✓' : '—',
                premium: has('Premium', display) ? '✓' : '—',
                investor: has('Investor', display) ? '✓' : '—',
            });
        });

        return rows;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [basicPlan, premiumPlan, investorPlan, effectiveFeaturesByPlan]);

    if (loading) {
        return (
            <div className="bg-white min-h-screen">
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="w-12 h-12 border-3 border-spark-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading premium plans...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (loadError || plans.length === 0) {
        return (
            <div className="bg-white min-h-screen">
                <div className="flex justify-center items-center h-96">
                    <div className="text-center max-w-md">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to load plans</h2>
                        <p className="text-gray-500 mb-6">{loadError || 'No plans available right now.'}</p>
                        <button
                            onClick={loadPlans}
                            className="px-6 py-3 bg-spark-500 hover:bg-spark-600 text-white font-semibold rounded-xl transition"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">

                <div className="text-center max-w-3xl mx-auto mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-2">
                        Simple, transparent{' '}
                        <span className="text-spark-600">pricing</span>
                    </h1>
                    <p className="text-base text-gray-500">
                        Choose the plan that fits your goals. Upgrade or downgrade anytime.
                    </p>

                    {isLoggedIn && (
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700">
                            <span>💰</span>
                            <span>
                                Balance:{' '}
                                <strong className="text-gray-900">{money(currentBalance)}</strong>
                            </span>
                        </div>
                    )}

                    {isLoggedIn && currentPlan !== 'Basic' && renewalDate && (
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-spark-50 border border-spark-200 text-xs text-spark-700">
                            <span>💳</span>
                            <span>
                                <strong>{currentPlan}</strong> ({currentBillingLabel}) renews{' '}
                                <strong>{renewalDate.toLocaleDateString()}</strong> for {money(userData?.premiumMonthlyFee)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex justify-center mb-4">
                    <div className="inline-flex items-center bg-gray-100 rounded-full p-1.5 shadow-inner">
                        <button
                            onClick={() => setBillingInterval('monthly')}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                                billingInterval === 'monthly'
                                    ? 'bg-white text-gray-900 shadow-md'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingInterval('yearly')}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                                billingInterval === 'yearly'
                                    ? 'bg-white text-gray-900 shadow-md'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Yearly
                            {featuredDiscount > 0 && (
                                <span className="inline-flex items-center bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    −{featuredDiscount}%
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex justify-center mb-8">
                    <p className={`text-sm font-medium transition-colors ${
                        billingInterval === 'yearly' && featuredDiscount > 0
                            ? 'text-green-600'
                            : 'text-gray-500'
                    }`}>
                        {billingInterval === 'monthly'
                            ? featuredDiscount > 0
                                ? `💡 Switch to yearly and save ${featuredDiscount}%`
                                : 'Switch to yearly for the best value'
                            : featuredDiscount > 0
                                ? `🎉 You’re saving ${featuredDiscount}% with yearly billing`
                                : '🎉 You’re on the smart plan'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => {
                        const isCurrent = isLoggedIn && currentPlan === plan.name;
                        const isPopular = plan.name === 'Premium';

                        const displayFee = billingInterval === 'yearly'
                            ? safeNum(plan.yearlyFee)
                            : safeNum(plan.monthlyFee);

                        const canAfford = displayFee === 0 || currentBalance >= displayFee;
                        const savings = computeSavings(plan);
                        const discount = computeDiscount(plan);
                        const features = plan.features || [];

                        return (
                            <div
                                key={plan.name}
                                className={`relative rounded-lg bg-white border-2 flex flex-col cursor-pointer transition-all duration-300 ease-out group ${
                                    isCurrent
                                        ? 'border-spark-500 ring-2 ring-spark-500 shadow-md'
                                        : 'border-gray-200 hover:border-spark-500 hover:bg-spark-50/40 hover:shadow-2xl hover:ring-4 hover:ring-spark-500/10'
                                }`}
                            >
                                {(isPopular || isCurrent) && (
                                    <span
                                        className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider z-10 ${
                                            isCurrent ? 'bg-spark-500 text-white' : 'bg-gray-900 text-white'
                                        }`}
                                    >
                                        {isCurrent ? 'CURRENT' : 'POPULAR'}
                                    </span>
                                )}

                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="text-sm">{plan.icon || '📦'}</span>
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            {plan.name}
                                        </h3>
                                    </div>

                                    <div className="mb-3">
                                        {safeNum(plan.monthlyFee) === 0 ? (
                                            <span className="text-2xl font-bold text-gray-900 leading-none">
                                                Free
                                            </span>
                                        ) : (
                                            <>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-bold text-gray-900 leading-none">
                                                        {money(displayFee)}
                                                    </span>
                                                    <span className="text-[11px] text-gray-500">
                                                        /{billingInterval === 'monthly' ? 'mo' : 'yr'}
                                                    </span>
                                                </div>

                                                {billingInterval === 'yearly' && safeNum(plan.monthlyFee) > 0 && (
                                                    <div className="text-[10px] text-gray-400 line-through mt-0.5 leading-none">
                                                        {money(safeNum(plan.monthlyFee) * 12)}/yr
                                                    </div>
                                                )}

                                                {billingInterval === 'monthly' && savings > 0 && (
                                                    <div className="text-[10px] text-green-600 font-medium mt-0.5 leading-none">
                                                        Save {discount}% yearly
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-100 mb-3" />

                                    <ul className="space-y-0.5 flex-1 mb-3">
                                        {features.slice(0, 5).map((feature, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-1.5 text-[12px] text-gray-600 leading-tight"
                                            >
                                                <span className="text-spark-500 group-hover:text-spark-600 font-bold leading-tight transition-colors">
                                                    ✓
                                                </span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex justify-center mt-1">
                                        <button
                                            onClick={() => requestPlanChange(plan)}
                                            disabled={
                                                upgrading ||
                                                isCurrent ||
                                                (isLoggedIn && !canAfford && plan.level > currentLevel)
                                            }
                                            className={`min-w-[140px] py-2.5 px-6 rounded-lg text-sm font-semibold transition-all ${
                                                isCurrent
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : (isLoggedIn && !canAfford && plan.level > currentLevel)
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : (!isLoggedIn || plan.level > currentLevel)
                                                            ? 'bg-gradient-to-r from-spark-500 to-orange-500 text-white hover:shadow-md'
                                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {upgrading
                                                ? 'Processing…'
                                                : !isLoggedIn
                                                    ? `Choose ${plan.name}`
                                                    : isCurrent
                                                        ? 'Current'
                                                        : (!canAfford && plan.level > currentLevel)
                                                            ? `Need ${money(displayFee)}`
                                                            : getButtonText(plan)
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-900">Compare all features</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left py-2.5 px-4 font-semibold text-gray-900 text-[11px] uppercase tracking-wide">Feature</th>
                                    <th className="text-center py-2.5 px-4 font-semibold text-gray-900 text-[11px] uppercase tracking-wide">Basic</th>
                                    <th className="text-center py-2.5 px-4 font-semibold text-gray-900 text-[11px] uppercase tracking-wide">Premium</th>
                                    <th className="text-center py-2.5 px-4 font-semibold text-gray-900 text-[11px] uppercase tracking-wide">Investor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonRows.map((feature, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="py-2 px-4 font-medium text-gray-900 text-[12px]">{feature.name}</td>
                                        <td className="text-center py-2 px-4 text-gray-600 text-[12px]">{feature.basic}</td>
                                        <td className="text-center py-2 px-4 text-gray-600 text-[12px]">{feature.premium}</td>
                                        <td className="text-center py-2 px-4 text-gray-600 text-[12px]">{feature.investor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        Questions?{' '}
                        <a href="/faq" className="text-spark-600 font-semibold hover:underline">Visit our FAQ</a>
                    </p>
                </div>

                {isLoggedIn && (
                    <div className="text-center mt-4">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-spark-600 transition-colors group"
                        >
                            <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </Link>
                    </div>
                )}
            </div>

            <Modal
                open={modalOpen}
                title={modalTitle}
                onOk={confirmPlanChange}
                onCancel={cancelPlanChange}
                okText={modalOkText}
                cancelText="Cancel"
                okButtonProps={{
                    disabled: upgrading || (isPaidChange && !hasEnoughBalance),
                    danger: okIsDangerous,
                    style: !okIsDangerous && isPaidChange
                        ? { background: 'linear-gradient(to right, #f97316, #ea580c)', border: 'none' }
                        : undefined,
                }}
                centered
                destroyOnHidden
            >
                {pendingPlan && (
                    <div className="space-y-3 pt-2">
                        {/* ============================================ */}
                        {/* DOWNGRADE — with hard warning                */}
                        {/* ============================================ */}
                        {isDowngrade && (
                            <>
                                <p className="text-gray-700">
                                    You're downgrading from <strong>{currentPlan}</strong> to{' '}
                                    <strong>{pendingPlan.name}</strong>.
                                </p>

                                {hasRemainingPaidTime && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                                        <div className="font-semibold mb-1 flex items-center gap-1.5">
                                            <span>⚠️</span>
                                            <span>You'll lose your remaining {currentPlan} time</span>
                                        </div>
                                        <div>
                                            You're paid through{' '}
                                            <strong>{renewalDate.toLocaleDateString()}</strong>.
                                            Downgrading now forfeits that time.{' '}
                                            <strong>No refund will be issued.</strong>
                                        </div>
                                    </div>
                                )}

                                {isPaidChange && (
                                    <p className="text-sm text-gray-600">
                                        Your new <strong>{pendingPlan.name}</strong> plan starts
                                        immediately and costs{' '}
                                        <strong>{money(modalFee)}</strong> for the first{' '}
                                        {billingInterval} period.
                                    </p>
                                )}

                                {isFreeDowngrade && (
                                    <p className="text-sm text-gray-600">
                                        You'll be moved to the free <strong>Basic</strong> plan
                                        immediately. Your daily save limit will drop to{' '}
                                        <strong>{money(pendingPlan.dailySaveMax)}</strong>.
                                    </p>
                                )}

                                {premiumPlan && currentPlan !== 'Premium' && currentLevel > (planMap['Premium']?.level ?? 0) && (
                                    <div className="bg-spark-50 border border-spark-200 rounded-lg p-3 text-sm text-spark-800">
                                        <div className="font-semibold mb-1">
                                            💡 Before you go — Premium might be a better fit
                                        </div>
                                        <div className="mb-2">
                                            Keep most of what you love on <strong>Premium</strong> for just{' '}
                                            <strong>{money(premiumPlan.monthlyFee)}/month</strong>:
                                        </div>
                                        <ul className="text-xs space-y-1 mb-3 pl-4 list-disc text-spark-700">
                                            <li>Daily goal limit up to {money(premiumPlan.dailySaveMax)}</li>
                                            <li>Priority support within 12 hours</li>
                                            <li>Private Premium WhatsApp community</li>
                                            <li>Weekly live coaching calls</li>
                                        </ul>
                                        <button
                                            type="button"
                                            onClick={() => setPendingPlan(premiumPlan)}
                                            className="text-xs font-semibold text-spark-700 underline hover:text-spark-900"
                                        >
                                            Switch to Premium instead →
                                        </button>
                                    </div>
                                )}

                                <p className="text-xs text-gray-500 font-medium">
                                    This action cannot be undone.
                                </p>
                            </>
                        )}

                        {/* ============================================ */}
                        {/* UPGRADE — normal flow                        */}
                        {/* ============================================ */}
                        {isUpgrade && isPaidChange && (
                            <>
                                <p className="text-gray-700">
                                    You're upgrading from <strong>{currentPlan}</strong> to{' '}
                                    <strong>{pendingPlan.name}</strong> on{' '}
                                    <strong>{billingInterval}</strong> billing.
                                </p>

                                <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            {billingInterval === 'yearly' ? 'Yearly fee' : 'Monthly fee'}
                                        </span>
                                        <span className="font-semibold text-gray-900">{money(modalFee)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Your balance</span>
                                        <span className="font-semibold text-gray-900">{money(currentBalance)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
                                        <span className="text-gray-500">Balance after</span>
                                        <span className={`font-semibold ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`}>
                                            {money(currentBalance - modalFee)}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500">
                                    Your plan renews automatically every{' '}
                                    {billingInterval === 'yearly' ? '12 months' : '30 days'} from
                                    your balance. Cancel anytime.
                                </p>

                                {billingInterval === 'monthly' && pendingDiscount > 0 && pendingSavings > 0 && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                                        <div className="font-semibold mb-1">
                                            💸 Save {money(pendingSavings)} with yearly billing
                                        </div>
                                        <div>
                                            Pay <strong>{money(pendingPlan.yearlyFee)}/year</strong> instead of{' '}
                                            {money(safeNum(pendingPlan.monthlyFee) * 12)} — that's {pendingDiscount}% off.
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setBillingInterval('yearly')}
                                            className="mt-2 text-xs font-semibold text-green-700 underline hover:text-green-900"
                                        >
                                            Switch to yearly billing →
                                        </button>
                                    </div>
                                )}

                                {!hasEnoughBalance && (
                                    <p className="text-sm text-red-500 font-medium">
                                        Insufficient balance. Top up at least{' '}
                                        {money(modalFee - currentBalance)} to continue.
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}