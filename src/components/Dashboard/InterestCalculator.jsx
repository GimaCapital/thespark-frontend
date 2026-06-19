// import React from 'react';

// export default function InterestCalculator({ currentBalance, lowestBalance, avgBalance, currentDay }) {
//     if (currentDay < 2) {
//         return null;
//     }
    
//     const projectedLowest = lowestBalance > 0 ? lowestBalance : currentBalance;
//     const projectedAvg = avgBalance > 0 ? avgBalance : currentBalance;
//     const projectedInterest = (projectedLowest + projectedAvg) / 2 * 0.05;
    
//     if (projectedInterest <= 0) return null;
    
//     return (
//         <div className="bg-spark-50 rounded-lg p-4 spacer-md">
//             <p className="text-small text-spark-600 font-semibold spacer-sm">📊 Projected Interest</p>
//             <p className="text-2xl font-bold text-spark-600">
//                 ₦{projectedInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </p>
//             <p className="text-xs text-gray-500 mt-1">
//                 Based on your current savings pattern. Earned at end of cycle (Day 22).
//             </p>
//         </div>
//     );
// }

// import React from 'react';

// export default function InterestCalculator({ currentBalance, avgBalance, currentDay }) {
//     if (currentDay < 2) {
//         return null;
//     }
    
//     // Option B: Interest only on NEW deposits this cycle
//     // 5% of average balance for THIS cycle only
//     const projectedInterest = avgBalance > 0 ? avgBalance * 0.05 : currentBalance * 0.05;
//     const projectedSavedThisCycle = avgBalance > 0 ? avgBalance * 21 : 0;
    
//     if (projectedInterest <= 0) return null;
    
//     return (
//         <div className="bg-spark-50 rounded-lg p-4 spacer-md">
//             <p className="text-small text-spark-600 font-semibold spacer-sm">📊 Projected Interest</p>
//             <p className="text-2xl font-bold text-spark-600">
//                 ₦{projectedInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </p>
//             <div className="text-xs text-gray-500 mt-1 space-y-1">
//                 <p>✓ 5% interest on your average balance: ₦{avgBalance?.toLocaleString() || 0}</p>
//                 <p>✓ You saved ₦{projectedSavedThisCycle.toLocaleString()} this cycle</p>
//                 <p>✓ Your previous savings (₦{currentBalance?.toLocaleString() || 0}) remain safe</p>
//                 <p className="text-gray-400 mt-2">Interest is paid only on what you save each cycle. No compounding.</p>
//             </div>
//         </div>
//     );
// }

import React from 'react';

export default function InterestCalculator({ currentBalance, avgDays1to16, currentDay }) {
    if (currentDay < 2) {
        return null;
    }
    
    // Interest on Days 1-16 only (Days 17-21 earn 0%)
    const projectedInterest = avgDays1to16 > 0 ? avgDays1to16 * 0.05 : 0;
    
    if (projectedInterest <= 0) return null;
    
    return (
        <div className="bg-spark-50 rounded-lg p-4 spacer-md">
            <p className="text-small text-spark-600 font-semibold spacer-sm">📊 Projected Interest</p>
            <p className="text-2xl font-bold text-spark-600">
                ₦{projectedInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="text-xs text-gray-500 mt-1 space-y-1">
                <p>✓ 5% interest on your average balance from Days 1-16</p>
                <p>✓ Your average balance so far: ₦{avgDays1to16?.toLocaleString() || 0}</p>
                <p>✓ Days 17-21 deposits earn 0% interest</p>
                <p className="text-gray-400 mt-2">Save early and consistently to maximize your interest!</p>
            </div>
        </div>
    );
}