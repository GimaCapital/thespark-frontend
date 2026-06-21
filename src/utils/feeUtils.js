// src/utils/feeUtils.js

// ✅ Fee constants - NOT exported (used internally only)
const FLUTTERWAVE_PROCESSING_FEE = 0.02; // 2%
const CBN_VAT = 0.075; // 7.5%

// Calculate total with 4.6% markup (covers Flutterwave fee + VAT + profit)
export const calculateTotal = (amount) => {
    return Math.ceil(amount * 1.046 / 10) * 10;
};

// Calculate fee breakdown
export const calculateFeeBreakdown = (totalWithFee, intendedAmount) => {
    // ✅ These constants are used HERE
    const flutterwaveFee = totalWithFee * FLUTTERWAVE_PROCESSING_FEE;
    const vat = flutterwaveFee * CBN_VAT;
    const platformFee = totalWithFee - intendedAmount - flutterwaveFee - vat;
    
    return {
        flutterwaveFee,
        vat,
        platformFee,
        totalFees: totalWithFee - intendedAmount,
        netAmount: intendedAmount
    };
};

// Calculate total fees
export const calculateTotalFees = (amount) => {
    const total = calculateTotal(amount);
    return total - amount;
};

// Get fee summary for display
export const getFeeSummary = (amount) => {
    const totalWithFee = calculateTotal(amount);
    const fees = calculateFeeBreakdown(totalWithFee, amount);
    
    return {
        amount,
        totalWithFee,
        ...fees,
        effectiveRate: ((totalWithFee - amount) / amount * 100).toFixed(2)
    };
};