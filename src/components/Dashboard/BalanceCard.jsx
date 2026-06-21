export default function BalanceCard({ balance, totalSaved, totalInterest }) {
    return (
        <div className="card-primary" style={{ borderRadius: '1rem' }}>
            {/* Current Balance - Centered */}
            <div className="text-center">
                <p className="balance-stat-label spacer-sm">Current Balance</p>
                <p className="balance-amount">₦{balance?.toLocaleString() || 0}</p>
            </div>
          
            <div className="balance-stats">
                <div>
                    <p className="balance-stat-label">Total Saved</p>
                    <p className="balance-stat-value">₦{totalSaved?.toLocaleString() || 0}</p>
                </div>
                <div className="text-right">
                    <p className="balance-stat-label">Interest Earned</p>
                    <p className="balance-stat-value">₦{totalInterest?.toLocaleString() || 0}</p>
                </div>
            </div>
        </div>
    );
}