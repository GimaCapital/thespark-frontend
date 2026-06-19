import React from 'react';

export default function CycleTracker({ currentCycle, currentDay }) {
    const totalCycles = 8;
    const totalDays = 21;
    
    const cycleProgress = (currentCycle - 1) / totalCycles * 100;
    const dayProgress = (currentDay - 1) / totalDays * 100;
    
    const principles = {
        1: 'Pay yourself first',
        2: 'Make your money work',
        3: 'Guard your wealth from loss',
        4: 'Own your own home',
        5: 'Insure your future',
        6: 'Increase your ability to earn',
        7: 'Teach others',
        8: 'Graduate and invest'
    };
    
    const currentPrinciple = principles[currentCycle] || 'Build wealth';
    
    return (
        <div className="card spacer-md">
            <h3 className="heading-3 spacer-sm">Your Journey</h3>
            
            <div className="spacer-md">
                <div className="flex-between text-small spacer-sm">
                    <span>Cycle {currentCycle} of {totalCycles}</span>
                    <span>{Math.round(cycleProgress)}%</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${cycleProgress}%` }}></div>
                </div>
            </div>
            
            <div className="spacer-lg">
                <div className="flex-between text-small spacer-sm">
                    <span>Day {currentDay} of {totalDays}</span>
                    <span>{Math.round(dayProgress)}%</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${dayProgress}%` }}></div>
                </div>
            </div>
            
            <div className="message-card">
                <p className="message-title">📖 Current Lesson</p>
                <p className="message-text">{currentPrinciple}</p>
            </div>
        </div>
    );
}