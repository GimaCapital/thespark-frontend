import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderMissionCard from '../components/Common/HeaderMissionCard';

export default function About() {
    const [expandedSection, setExpandedSection] = useState(null);
    const [selectedStat, setSelectedStat] = useState(null);
    
    // Interactive Book States
    const [isBookOpen, setIsBookOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFlipping, setIsFlipping] = useState(false);
    const totalPages = 155;
    
  

    const bookPages = [
    // ===== SECTION 1: THE SPARK STORY (Pages 1-15) =====
    {
        number: 1,
        title: "The Spark of an Idea",
        content: "TheSpark was born from a simple observation: Over 140 million Nigerians live in poverty — not because they don't work hard, but because no one taught them how to manage, grow, and preserve their resources.",
        quote: "A part of all you earn is yours to keep.",
        image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=300&fit=crop"
    },
    {
        number: 2,
        title: "The Ancient Wisdom",
        content: "We discovered 'The Richest Man in Babylon' — a book written a century ago that contains timeless wealth principles that have transformed lives across generations.",
        quote: "Wealth grows slowly. Anyone who promises fast wealth is lying to you.",
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=300&fit=crop"
    },
    {
        number: 3,
        title: "Our Mission",
        content: "To reduce poverty in Nigeria by teaching one person at a time the timeless wealth principles that have transformed lives for generations.",
        quote: "Be patient. Be disciplined. You will get there.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
    },
    {
        number: 4,
        title: "The 7 Rules of Wealth",
        content: "Pay Yourself First, Control Your Spending, Make Your Money Work, Protect Your Wealth, Own Your Own Home, Secure Your Future, Increase Your Ability to Earn.",
        quote: "The secret to getting ahead is getting started.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
        number: 5,
        title: "Your Journey Begins",
        content: "Join thousands of Nigerians building consistent financial habits — one day, one cycle at a time. Start with as little as ₦100 daily.",
        quote: "One spark. One fire. One wealthy Nigeria.",
        image: "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=400&h=300&fit=crop"
    },
    {
        number: 6,
        title: "The Problem We Face",
        content: "Poverty in Nigeria rose from 56% in 2023 to 63% in 2025. 140 million Nigerians now struggle to afford basic necessities like food, healthcare, and housing.",
        quote: "Knowledge is the bridge between poverty and prosperity.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"
    },
    {
        number: 7,
        title: "Why Financial Education Matters",
        content: "Schools don't teach money management. Parents often can't. TheSpark fills this gap, providing the financial education every Nigerian deserves.",
        quote: "Financial freedom is a right, not a privilege.",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=300&fit=crop"
    },
    {
        number: 8,
        title: "Why Babylon?",
        content: "Babylon was the wealthiest city in ancient history. Its citizens mastered the art of wealth building using principles that work regardless of income level.",
        quote: "The laws of wealth are as unchanging as the laws of gravity.",
        image: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=400&h=300&fit=crop"
    },
    {
        number: 9,
        title: "Our Promise",
        content: "We don't promise you millions. We promise you the knowledge and accountability to build your own financial freedom. Your consistency creates your wealth.",
        quote: "We provide the spark. You provide the fire.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
    },
    {
        number: 10,
        title: "The Wealth Gap",
        content: "The richest 1% of Nigerians control 4 times more wealth than the bottom 50% combined. TheSpark aims to close this gap through education.",
        quote: "Wealth should not be reserved for the lucky few.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
        number: 11,
        title: "Breaking the Cycle",
        content: "Poverty is passed down through generations when knowledge is absent. TheSpark breaks this cycle by teaching proven principles to every family.",
        quote: "One generation can change everything.",
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop"
    },
    {
        number: 12,
        title: "Small Actions, Big Results",
        content: "Saving ₦100 daily seems small, but over a year that's ₦36,500. Over 5 years with consistency, it becomes a life-changing sum.",
        quote: "Little drops of water make a mighty ocean.",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop"
    },
    {
        number: 13,
        title: "The Power of Habits",
        content: "21 days is scientifically proven to build lasting habits. Our 21-day cycles help you automate wealth-building behaviors.",
        quote: "Discipline is the bridge between goals and accomplishment.",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    },
    {
        number: 14,
        title: "What is Wealth?",
        content: "Wealth is not how much you earn. Wealth is how much you keep. A doctor earning ₦2 million monthly who spends it all is poor. A teacher saving ₦50,000 monthly is building wealth.",
        quote: "Wealth is what you keep, not what you earn.",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=300&fit=crop"
    },
    {
        number: 15,
        title: "Income vs Wealth",
        content: "Income is money coming in. Wealth is accumulated assets. High income without saving creates no wealth. Low income with consistent saving creates wealth over time.",
        quote: "It's not about how much you make, but how much you keep.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"
    },

    // ===== SECTION 2: UNDERSTANDING WEALTH (Pages 16-30) =====
    {
        number: 16,
        title: "Assets vs Liabilities",
        content: "Assets put money in your pocket (rental property, dividend stocks, business). Liabilities take money from your pocket (car loan, credit card debt, mortgage on your home). Buy assets.",
        quote: "Rich people buy assets. Poor people buy liabilities.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop"
    },
    {
        number: 17,
        title: "The Wealth Formula",
        content: "Wealth = (Income - Expenses) + (Assets × Growth Rate) × Time. You control income and expenses. You choose assets. Time does the heavy lifting.",
        quote: "Time is your greatest wealth-building tool.",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop"
    },
    {
        number: 18,
        title: "Financial Freedom Defined",
        content: "Financial freedom means your passive income covers your expenses. You no longer trade time for money. You work because you want to, not because you have to.",
        quote: "Freedom is the real wealth.",
        image: "https://images.unsplash.com/photo-1553729459-9e3e9d1b7c4b?w=400&h=300&fit=crop"
    },
    {
        number: 19,
        title: "The Poverty Mindset",
        content: "Poverty mindset says: 'I can't afford it.' Wealth mindset asks: 'How can I afford it?' One closes doors. The other opens possibilities.",
        quote: "Your mindset determines your financial ceiling.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop"
    },
    {
        number: 20,
        title: "Wealthy People Habits",
        content: "Wealthy people read daily (85% read 2+ books monthly). They wake early. They exercise. They set goals. They avoid debt. They invest consistently.",
        quote: "Success leaves clues.",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    },
    {
        number: 21,
        title: "Your Wealth Number",
        content: "Calculate your FI number: Annual expenses ÷ 0.04. If you spend ₦3,600,000 yearly, you need ₦90,000,000 invested to retire. Now you have a target.",
        quote: "What gets measured gets achieved.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
        number: 22,
        title: "The Wealth Mindset",
        content: "Wealth begins in the mind before it appears in your bank account. Your beliefs about money shape your financial reality. TheSpark helps you rewire those beliefs.",
        quote: "Your mindset determines your financial future.",
        image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=400&h=300&fit=crop"
    },
    {
        number: 23,
        title: "Scarcity vs Abundance",
        content: "A scarcity mindset says 'there's never enough.' An abundance mindset says 'there's always opportunity.' Which one drives your financial decisions?",
        quote: "Abundance attracts abundance.",
        image: "https://images.unsplash.com/photo-1553729459-9e3e9d1b7c4b?w=400&h=300&fit=crop"
    },
    {
        number: 24,
        title: "Money Beliefs",
        content: "What did you learn about money growing up? 'Money is the root of all evil'? 'Rich people are greedy'? These beliefs block your wealth potential.",
        quote: "Examine your money stories.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
    },
    {
        number: 25,
        title: "Wealth Affirmations",
        content: "Start each day with: 'I am a wealth builder. Money flows to me. I create value. My consistency compounds into abundance.'",
        quote: "What you repeat, you become.",
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop"
    },
    {
        number: 26,
        title: "Financial Goals",
        content: "Write down your financial goals. Make them specific, measurable, and time-bound. 'I will save ₦500,000 by December 2026' is a goal.",
        quote: "A goal without a plan is just a wish.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"
    },
    {
        number: 27,
        title: "The Wealth Vision Board",
        content: "Create a vision board of your financial dreams. Your dream home. Your children's education. Your retirement. Visualize daily.",
        quote: "See it before you seize it.",
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop"
    },
    {
        number: 28,
        title: "Overcoming Fear",
        content: "Fear of failure keeps people poor. Fear of success keeps people small. Face your financial fears and take action anyway.",
        quote: "Courage is not the absence of fear.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop"
    },
    {
        number: 29,
        title: "Wealthy Habits",
        content: "Wealthy people read daily. They wake early. They invest in themselves. They surround themselves with successful people.",
        quote: "Your habits create your wealth.",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    },
    {
        number: 30,
        title: "The Psychology of Money",
        content: "Money decisions are emotional, not logical. Understand your money biases. Fear and greed drive bad decisions. Awareness is the first step to control.",
        quote: "Know thyself, know thy money.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
    },

    // ===== SECTION 3: THE SAVING HABIT (Pages 31-50) =====
    {
        number: 31,
        title: "Pay Yourself First",
        content: "Before paying bills or buying anything, save 10% of everything you earn. This is non-negotiable. This money is your future freedom.",
        quote: "A part of all you earn is yours to keep.",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=300&fit=crop"
    },
    {
        number: 32,
        title: "The Power of Small Savings",
        content: "Saving ₦100 daily is ₦36,500 yearly. Invested at 10% for 30 years becomes ₦6.5 million. Small amounts, big results over time.",
        quote: "Little drops of water make a mighty ocean.",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop"
    },
    {
        number: 33,
        title: "The 21-Day Habit Rule",
        content: "Research shows 21 days creates a new habit. Save consistently for 21 days. It becomes automatic. You won't have to think about it anymore.",
        quote: "21 days to a new you.",
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop"
    },
    {
        number: 34,
        title: "Automate Your Savings",
        content: "Set up automatic transfers on payday. When money moves automatically, you never miss it. Automation beats willpower every time.",
        quote: "Out of sight, out of mind.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"
    },
    {
        number: 35,
        title: "Emergency Fund First",
        content: "Before investing, save 3-6 months of expenses. This protects you from debt when emergencies happen. Job loss. Medical bills. Car repairs.",
        quote: "Hope for the best, prepare for the worst.",
        image: "https://images.unsplash.com/photo-1554224154-26032ffc0f07?w=400&h=300&fit=crop"
    },
    {
        number: 36,
        title: "Separate Savings Accounts",
        content: "Use different accounts for different goals: Emergency fund. House down payment. Children's education. Vacation. Retirement. Keep them separate.",
        quote: "Don't mix your money.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
    },
    {
        number: 37,
        title: "Save Before You Spend",
        content: "Most people spend first and save what's left. Do the opposite. Save first. Live on the rest. You'll adapt. Your lifestyle will adjust.",
        quote: "Pay yourself first, always.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop"
    },
    {
        number: 38,
        title: "The 50/30/20 Budget",
        content: "50% for needs (rent, food, utilities). 30% for wants (entertainment, dining out). 20% for savings and debt repayment. Simple. Effective.",
        quote: "Budgeting is telling your money where to go.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
        number: 39,
        title: "Zero-Based Budgeting",
        content: "Give every naira a job. Income minus expenses = zero. Every naira is assigned to savings, bills, or spending. No unallocated money.",
        quote: "Every naira has a purpose.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"
    },
    {
        number: 40,
        title: "The Envelope System",
        content: "Put cash in envelopes for each spending category. When envelope is empty, stop spending. Digital version: use budgeting apps.",
        quote: "Cash is real. Cards are abstract.",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=300&fit=crop"
    },
    {
        number: 41,
        title: "Save Windfalls",
        content: "Tax refund? Bonus? Gift? Save 50% minimum. Spend 50% maximum. Windfalls are opportunities to accelerate wealth building.",
        quote: "Unexpected money should build unexpected wealth.",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop"
    },
    {
        number: 42,
        title: "The Savings Jar",
        content: "Start simple. Get a jar. Put ₦100 daily. After 30 days, you have ₦3,000. After a year, ₦36,500. Small starts lead to big finishes.",
        quote: "Every journey begins with a single step.",
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop"
    },
    {
        number: 43,
        title: "Save Raises Immediately",
        content: "Get a raise? Save the difference immediately. Your lifestyle hasn't adjusted yet. You won't miss money you never saw.",
        quote: "Increases in income should increase savings.",
        image: "https://images.unsplash.com/photo-1553729459-9e3e9d1b7c4b?w=400&h=300&fit=crop"
    },
    {
        number: 44,
        title: "Save Before Tax",
        content: "Use tax-advantaged accounts when available. Money saved before tax grows faster because taxes don't reduce your principal.",
        quote: "The government doesn't need your investment money.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
    },
    {
        number: 45,
        title: "Consistency Over Amount",
        content: "Saving ₦500 daily consistently beats saving ₦5,000 occasionally. Build the habit first. Increase amount later.",
        quote: "Habit beats heroics.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
        number: 46,
        title: "Track Every Expense",
        content: "Write down every naira you spend for 30 days. You'll be shocked where your money goes. That daily snack? ₦500. Monthly? ₦15,000. Yearly? ₦182,500.",
        quote: "What gets tracked gets improved.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
        number: 47,
        title: "Need vs Want",
        content: "Need: Food, shelter, healthcare, transportation to work. Want: The latest phone, expensive coffee, dining out, new clothes. Spend on needs first.",
        quote: "If you can live without it, it's a want.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"
    },
    {
        number: 48,
        title: "The 30-Day Rule",
        content: "When you want to buy something non-essential, wait 30 days. Most urges pass. If you still want it after 30 days, consider buying it.",
        quote: "Delay to decide.",
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop"
    },
    {
        number: 49,
        title: "Lifestyle Inflation",
        content: "When your income rises, don't automatically increase spending. Save the difference. This is how people with high incomes stay poor.",
        quote: "Live like no one else so later you can live like no one else.",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=300&fit=crop"
    },
    {
        number: 50,
        title: "Frugal vs Cheap",
        content: "Frugal people spend wisely on what matters. Cheap people sacrifice quality for price. Buy quality once rather than cheap repeatedly.",
        quote: "Price is what you pay. Value is what you get.",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop"
    },

    // ===== SECTION 4: CONTROLLING SPENDING (Pages 51-70) =====
    {
        number: 51,
        title: "Subscriptions Are Thieves",
        content: "Check your bank statement. How many unused subscriptions? Streaming services. Gym memberships. Apps. Cancel what you don't use. Save thousands yearly.",
        quote: "Small leaks sink great ships.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"
    },
    {
        number: 52,
        title: "Cook at Home",
        content: "Eating out costs 3-5x more than cooking at home. Learn 5 basic meals. Cook in bulk. Your wallet and health will thank you.",
        quote: "Restaurant food is a luxury, not a necessity.",
        image: "https://images.unsplash.com/photo-1556911220-ff3a1f7da8a5?w=400&h=300&fit=crop"
    },
    {
        number: 53,
        title: "Avoid Impulse Buys",
        content: "Stores are designed to make you impulse buy. Make a list. Stick to it. Never shop hungry. Sleep on big purchases.",
        quote: "A budget is telling your money where to go.",
        image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=300&fit=crop"
    },
    {
        number: 54,
        title: "The Latte Effect",
        content: "Save ₦500 daily instead of buying snacks. That's ₦182,500 annually. Over 10 years with growth, it becomes over ₦3 million.",
        quote: "Small leaks sink great ships.",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop"
    },
    {
        number: 55,
        title: "Comparison Spending",
        content: "Social media makes us compare. Comparison leads to unnecessary spending. Your life is unique. Your spending should be too.",
        quote: "Comparison is the thief of joy.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
    },
    {
        number: 56,
        title: "The One-Week Rule",
        content: "For expensive purchases, wait one week. Research alternatives. Check reviews. Find discounts. One week saves thousands.",
        quote: "Patience pays.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
        number: 57,
        title: "Cash Only",
        content: "Use cash for discretionary spending. You spend less when you see money leaving your hands. Cards make spending painless and excessive.",
        quote: "Cash is real. Plastic is pretend.",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=300&fit=crop"
    },
    {
        number: 58,
        title: "No-Spend Challenge",
        content: "Commit to one week of spending only on necessities. No eating out. No shopping. No entertainment. Reset your spending habits.",
        quote: "A week of discipline creates months of awareness.",
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop"
    },
    {
        number: 59,
        title: "Question Every Purchase",
        content: "Before buying, ask: 'Do I need this? Do I already own something similar? Can I borrow it? Will I use it weekly?'",
        quote: "Five questions save thousands.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"
    },
    {
        number: 60,
        title: "Spend on Experiences",
        content: "Research shows experiences bring more happiness than things. Spend on travel, learning, and time with loved ones. Not stuff.",
        quote: "Memories last longer than possessions.",
        image: "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=400&h=300&fit=crop"
    },
    {
        number: 61,
        title: "Rule 1: Pay Yourself First (Deep Dive)",
        content: "Open a separate savings account. Set up automatic transfer of 10% on every income day. Watch your wealth grow without thinking.",
        quote: "Automate your wealth building.",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop"
    },
    {
        number: 62,
        title: "Rule 2: Control Your Spending (Deep Dive)",
        content: "Track every expense for 30 days. Identify three wants you can eliminate. Redirect that money to your savings.",
        quote: "What gets measured gets improved.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
        number: 63,
        title: "Rule 3: Make Your Money Work (Deep Dive)",
        content: "Your money works through consistency. The more consistent you are, the more momentum you build. Start with small daily actions.",
        quote: "Consistency compounds.",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop"
    },
    {
        number: 64,
        title: "Rule 4: Protect Your Wealth (Deep Dive)",
        content: "Research before any financial decision. If someone promises guaranteed returns, walk away. Ask questions. Seek advice.",
        quote: "Trust, but verify.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop"
    },
    {
        number: 65,
        title: "Rule 5: Own Your Own Home (Deep Dive)",
        content: "Start small. Buy land gradually. Join a cooperative. Save specifically for a down payment. Every step counts.",
        quote: "Rome wasn't built in a day.",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
    },
    {
        number: 66,
        title: "Rule 6: Secure Your Future (Deep Dive)",
        content: "Build an emergency fund of 3-6 months of expenses. Start with saving just ₦500 weekly. Increase gradually.",
        quote: "Prepare for the unexpected.",
        image: "https://images.unsplash.com/photo-1554224154-26032ffc0f07?w=400&h=300&fit=crop"
    },
    {
        number: 67,
        title: "Why These Rules Work",
        content: "These 7 rules have transformed lives for over a century. They work regardless of your income, education, or background.",
        quote: "Timeless principles never fail.",
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=300&fit=crop"
    },
    {
        number: 68,
        title: "Set Your Daily Goal",
        content: "Choose your daily savings target between ₦100 - ₦2,000 (Basic) or up to ₦20,000 (Premium). Start small and grow as your habit strengthens.",
        quote: "Start where you are. Use what you have. Do what you can.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"
    },
    {
        number: 69,
        title: "21-Day Cycles",
        content: "Each cycle runs for 21 days — scientifically proven to build lasting habits. Days 1-16 build your momentum. Days 17-21 complete your cycle.",
        quote: "21 days to a new habit.",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop"
    },
    {
        number: 70,
        title: "Track Your Progress",
        content: "Your dashboard shows your consistency, cycle progress, and achievements. Watch your wealth habit grow stronger every day.",
        quote: "What gets tracked gets improved.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },

    // ===== SECTION 5: HOW THESPARK WORKS & EARNING MORE (Pages 71-95) =====
    {
        number: 71,
        title: "Learn Daily Wisdom",
        content: "Each day, you receive an educational message from 'The Richest Man in Babylon'. Master the 7 timeless rules, one cycle at a time.",
        quote: "Learning is a lifelong journey.",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    },
    {
        number: 72,
        title: "Repeat 8 Times",
        content: "Complete 8 cycles (6 months) to graduate. Each cycle builds on the last, strengthening your wealth-building muscles.",
        quote: "Consistency over intensity.",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop"
    },
    {
        number: 73,
        title: "Graduate to More",
        content: "After 8 cycles, you unlock advanced learning opportunities, exclusive benefits, and real-world wealth-building paths.",
        quote: "Graduation is just the beginning.",
        image: "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=400&h=300&fit=crop"
    },
    {
        number: 74,
        title: "Premium Plans",
        content: "Basic Plan (Free): ₦100-₦2,000/day. Premium Plan (₦1,000/month): ₦500-₦10,000/day. Investor Plan (₦2,500/month): ₦1,000-₦20,000/day.",
        quote: "Choose the plan that fits your goals.",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=300&fit=crop"
    },
    {
        number: 75,
        title: "Your Dashboard",
        content: "Your dashboard shows current progress, total saved, cycle and day information, and projected completion. Real-time updates.",
        quote: "See your growth in real time.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
        number: 76,
        title: "Community Support",
        content: "Join thousands of Nigerians on the same wealth-building journey. Share experiences, ask questions, and celebrate wins together.",
        quote: "Alone we go fast. Together we go far.",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop"
    },
    {
        number: 77,
        title: "Dedicated Coach",
        content: "Every member gets a dedicated TheSpark Coach. Contact them via WhatsApp for guidance, motivation, and answers.",
        quote: "You're never alone on this journey.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
    },
    {
        number: 78,
        title: "Referral Rewards",
        content: "Share your unique code. When friends join and complete Cycle 1, you earn recognition rewards. Refer 10+ to become an Ambassador.",
        quote: "Share the spark.",
        image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=300&fit=crop"
    },
    {
        number: 79,
        title: "Your Earning Potential",
        content: "Your income is unlimited. Your time is limited. Find ways to earn more per hour. Learn high-value skills. Start a side business.",
        quote: "The best investment is in yourself.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
    },
    {
        number: 80,
        title: "Learn High-Income Skills",
        content: "Digital marketing, coding, sales, copywriting, video editing. These skills pay ₦500,000+ monthly online. Learn free on YouTube. Practice daily.",
        quote: "Skills pay the bills.",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    },
    {
        number: 81,
        title: "The Side Hustle",
        content: "Start a side business while working your main job. Freelance. Sell products online. Consult. Extra income accelerates wealth building.",
        quote: "Never rely on one income source.",
        image: "https://images.unsplash.com/photo-1553729459-9e3e9d1b7c4b?w=400&h=300&fit=crop"
    },
    {
        number: 82,
        title: "Negotiate Your Salary",
        content: "80% of people don't negotiate. That's millions lost over a career. Research market rates. Prepare your case. Ask confidently.",
        quote: "Closed mouths don't get fed.",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop"
    },
    {
        number: 83,
        title: "Invest in Yourself",
        content: "Spend on courses, books, coaching, certifications. Every naira spent on learning returns multiple naira in future earnings.",
        quote: "Self-education is the highest ROI investment.",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop"
    },
    {
        number: 84,
        title: "Multiple Income Streams",
        content: "Rich people have 7 income streams on average. Job. Side business. Investments. Rental property. Digital products. Affiliate marketing. Royalties.",
        quote: "Don't put all your eggs in one basket.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
    },
    {
        number: 85,
        title: "Turn Passion into Profit",
        content: "What do you love doing? What are you good at? What problems can you solve? Turn answers into income. Passion + skill = profit.",
        quote: "Do what you love, and you'll never work a day.",
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop"
    },
    {
        number: 86,
        title: "The 5-Hour Rule",
        content: "Spend 5 hours weekly learning. Read. Listen to podcasts. Take courses. The wealthy never stop learning. Neither should you.",
        quote: "Learn or earn. Preferably both.",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    },
    {
        number: 87,
        title: "Skill Stacking",
        content: "Combine multiple skills to become uniquely valuable. Marketing + coding + sales = unstoppable. Each skill multiplies your earning potential.",
        quote: "Stack skills, stack income.",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop"
    },
    {
        number: 88,
        title: "Online Business",
        content: "Sell digital products. Start a YouTube channel. Build an online course. Affiliate marketing. E-commerce. Low startup costs.",
        quote: "The internet levels the playing field.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"
    },
    {
        number: 89,
        title: "Networking Power",
        content: "Your network determines your net worth. Attend events. Join communities. Help others. Build genuine relationships.",
        quote: "Your network is your net worth.",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop"
    },
    {
        number: 90,
        title: "Personal Branding",
        content: "Build your reputation online. Share your expertise. Help people for free. Opportunities come to those with visibility.",
        quote: "Be known for something.",
        image: "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=400&h=300&fit=crop"
    },
    {
        number: 91,
        title: "Time Management",
        content: "Time is your most valuable asset. Protect it. Prioritize high-impact activities. Say no to distractions.",
        quote: "Time is non-renewable.",
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop"
    },
    {
        number: 92,
        title: "Passive Income Ideas",
        content: "Create digital products. Write a book. Build an app. Invest in dividend stocks. Rent property. Build once, earn forever.",
        quote: "Work smarter, not harder.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
    },
    {
        number: 93,
        title: "What is Investing?",
        content: "Investing is putting money to work to generate more money. Your money becomes an employee. The more employees, the more wealth.",
        quote: "Make your money work for you.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
        number: 94,
        title: "Compound Interest",
        content: "Interest on interest. Your money earns money. That money earns money. Einstein called it the 8th wonder of the world. Start early.",
        quote: "Compound interest is magic.",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop"
    },
    {
        number: 95,
        title: "Start Early, Stay Long",
        content: "Investing ₦10,000 monthly from age 25 to 65 at 10% = ₦65 million. Start at 35? ₦23 million. Time matters more than amount.",
        quote: "The earlier, the better.",
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop"
    },

    // ===== SECTION 6: INVESTING & DEBT MANAGEMENT (Pages 96-120) =====
    {
        number: 96,
        title: "Risk and Return",
        content: "Higher returns = higher risk. Lower risk = lower returns. Find your balance. Young people can take more risk. Near retirement? Less risk.",
        quote: "Don't risk what you can't afford to lose.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop"
    },
    {
        number: 97,
        title: "Diversification",
        content: "Don't put all money in one investment. Spread across stocks, bonds, real estate, and cash. When one goes down, others stay up.",
        quote: "Don't put all eggs in one basket.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
    },
    {
        number: 98,
        title: "Stocks Explained",
        content: "Buying stock means owning part of a company. When company grows, your shares grow. Long-term investing wins. Patience pays.",
        quote: "Own businesses, not products.",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop"
    },
    {
        number: 99,
        title: "Real Estate Investing",
        content: "Buy property, rent it out. Tenant pays your mortgage. Property appreciates over time. Start with REITs if you can't buy property yet.",
        quote: "Land is the only thing they're not making more of.",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
    },
    {
        number: 100,
        title: "Avoid Investment Scams",
        content: "Guaranteed 50% monthly returns? Scam. Pressure to invest now? Scam. Secret opportunity? Scam. If too good to be true, it is.",
        quote: "If it sounds too good to be true, run.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop"
    },
    {
        number: 101,
        title: "Index Funds",
        content: "Index funds track the market. Low fees. Diversified. Historically return 8-10% annually. Great for beginners.",
        quote: "Simple is often better.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
        number: 102,
        title: "Bonds and Treasury Bills",
        content: "Bonds are loans to governments or companies. Lower risk than stocks. Good for preserving capital while earning interest.",
        quote: "Safety has its place.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"
    },
    {
        number: 103,
        title: "Good Debt vs Bad Debt",
        content: "Good debt buys assets that grow (education, business, real estate). Bad debt buys things that lose value (cars, clothes, electronics).",
        quote: "Not all debt is created equal.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"
    },
    {
        number: 104,
        title: "The Debt Snowball",
        content: "List debts smallest to largest. Pay minimum on all. Throw extra at smallest. When paid off, move to next. Momentum builds.",
        quote: "Small victories create big momentum.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop"
    },
    {
        number: 105,
        title: "The Debt Avalanche",
        content: "List debts by interest rate. Pay highest interest first. Saves more money long-term. Requires more discipline than snowball.",
        quote: "Math over emotion.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"
    },
    {
        number: 106,
        title: "Credit Card Trap",
        content: "Credit cards charge 20-30% interest. Minimum payments keep you in debt forever. Pay full balance monthly. Never carry debt.",
        quote: "Credit cards are snakes in sheep's clothing.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop"
    },
    {
        number: 107,
        title: "Get Out of Debt Fast",
        content: "Stop all investing except retirement. Sell things you don't need. Work extra hours. Cut expenses to bare bones. Live like no one else now.",
        quote: "Intense focus gets fast results.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop"
    },
    {
        number: 108,
        title: "Stay Out of Debt",
        content: "Build emergency fund. Save for purchases. Avoid car loans. Pay cash for everything except house. Debt-free is the only way to build wealth.",
        quote: "Debt steals your future.",
        image: "https://images.unsplash.com/photo-1554224154-26032ffc0f07?w=400&h=300&fit=crop"
    },
    {
        number: 109,
        title: "Generational Wealth",
        content: "Wealth that lasts generations requires education. Teach your children money skills. Leave them knowledge, not just money.",
        quote: "Shirtsleeves to shirtsleeves in three generations.",
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop"
    },
    {
        number: 110,
        title: "Teaching Kids About Money",
        content: "Give children allowance. Teach them to save, spend, and give. Let them make mistakes early. Discuss family finances openly.",
        quote: "Start financial education early.",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop"
    },
    {
        number: 111,
        title: "Estate Planning",
        content: "Write a will. Name beneficiaries. Plan for taxes. Ensure your wealth goes to who you choose, not the government.",
        quote: "Plan for the inevitable.",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop"
    },
    {
        number: 112,
        title: "Life Insurance",
        content: "Protect your family from financial disaster. Term life insurance is affordable. A small premium prevents catastrophe.",
        quote: "Love your family enough to prepare.",
        image: "https://images.unsplash.com/photo-1554224154-26032ffc0f07?w=400&h=300&fit=crop"
    },
    {
        number: 113,
        title: "The Joy of Giving",
        content: "Wealthy people give generously. Donate to causes you care about. Support your community. Giving creates abundance.",
        quote: "The more you give, the more you receive.",
        image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=300&fit=crop"
    },
    {
        number: 114,
        title: "Mentorship",
        content: "Find mentors who are where you want to be. Learn from their mistakes. Later, become a mentor to others.",
        quote: "We rise by lifting others.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
    },
    {
        number: 115,
        title: "Financial Independence",
        content: "FI means having enough wealth to live without working. Save 50% of your income. Invest wisely. Retire early.",
        quote: "Freedom is the ultimate wealth.",
        image: "https://images.unsplash.com/photo-1553729459-9e3e9d1b7c4b?w=400&h=300&fit=crop"
    },
    {
        number: 116,
        title: "The 4% Rule",
        content: "You can withdraw 4% of your investments annually without running out of money. Need ₦50,000 monthly? Save ₦15 million.",
        quote: "Math gives you freedom.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
        number: 117,
        title: "Retirement Planning",
        content: "Start now. The earlier you start, the less you need to save monthly. ₦10,000 monthly from 25 becomes ₦20 million by 65.",
        quote: "Your future self will thank you.",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop"
    },
    {
        number: 118,
        title: "Financial Freedom Number",
        content: "Calculate your number. Annual expenses ÷ 0.04 = FI number. Example: ₦3,600,000 ÷ 0.04 = ₦90,000,000 needed.",
        quote: "Know your number.",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop"
    },
    {
        number: 119,
        title: "Your Wealth Journey",
        content: "This is a marathon, not a sprint. Some months you'll save more. Some months less. Stay consistent. Trust the process.",
        quote: "Consistency beats intensity.",
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop"
    },
    {
        number: 120,
        title: "Mary's Journey",
        content: "Mary started with ₦100 daily. After 6 months, she had saved ₦18,000 and built a consistent habit she never thought possible.",
        quote: "Small steps, big changes.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop"
    },

    // ===== SECTION 7: INSPIRATIONAL STORIES & FINAL INSPIRATION (Pages 121-155) =====
    {
        number: 121,
        title: "John's Transformation",
        content: "John was living paycheck to paycheck. TheSpark taught him to pay himself first. He now saves 20% of his income monthly.",
        quote: "From survival to thriving.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
    },
    {
        number: 122,
        title: "Amina's Business",
        content: "Amina used her savings to start a small business. Today, she employs 3 people and is saving for her second shop.",
        quote: "Dreams become reality.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop"
    },
    {
        number: 123,
        title: "Chidi's Emergency",
        content: "When Chidi lost his job, his emergency savings kept him afloat for 4 months while he found new work. He's forever grateful.",
        quote: "Preparation meets opportunity.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop"
    },
    {
        number: 124,
        title: "Fatima's Home",
        content: "Fatima saved for 3 years using TheSpark principles. She just bought her first plot of land. Next goal: building her home.",
        quote: "Building wealth, building dreams.",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
    },
    {
        number: 125,
        title: "Olu's Education",
        content: "Olu used his savings to pay for professional certification. His salary doubled within a year of completing the program.",
        quote: "Invest in yourself.",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop"
    },
    {
        number: 126,
        title: "Nkechi's Freedom",
        content: "Nkechi paid off all her debt using the debt snowball method she learned from TheSpark. She's now completely debt-free.",
        quote: "Freedom is worth the fight.",
        image: "https://images.unsplash.com/photo-1554224154-26032ffc0f07?w=400&h=300&fit=crop"
    },
    {
        number: 127,
        title: "Emeka's Investment",
        content: "Emeka learned to make his money work. His savings now earn returns that supplement his regular income.",
        quote: "Money working for you.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
        number: 128,
        title: "Your Turn",
        content: "Every wealthy person started with a single decision. Today is your day. Make the choice to build your financial future.",
        quote: "The best time to start was yesterday. The second best time is now.",
        image: "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=400&h=300&fit=crop"
    },
    {
        number: 129,
        title: "The Spark is Within You",
        content: "You have everything you need to build wealth. TheSpark provides the knowledge. Your consistency provides the results.",
        quote: "Be the spark.",
        image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=300&fit=crop"
    },
    {
        number: 130,
        title: "One Million Strong",
        content: "Join the movement. Together, we can create 1 million wealthy Nigerians by 2035. One spark at a time.",
        quote: "Together we rise.",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop"
    },
    {
        number: 131,
        title: "Legacy Building",
        content: "The wealth you build today creates opportunities for your children and grandchildren. Break the cycle of poverty forever.",
        quote: "Build for generations.",
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop"
    },
    {
        number: 132,
        title: "Ready to Begin",
        content: "Your wealth-building journey starts now. Create your free account. Set your daily goal. Take the first step today.",
        quote: "One spark. One fire. One wealthy Nigeria.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
    },
    {
        number: 133,
        title: "Start Today",
        content: "The best time to start building wealth was 10 years ago. The second best time is today. Take action. Save ₦100 today. Start your journey.",
        quote: "One spark. One fire. One wealthy you.",
        image: "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=400&h=300&fit=crop"
    },
    {
        number: 134,
        title: "Give Back",
        content: "Wealthy people give generously. Donate to causes you care about. Support your community. Giving creates abundance and purpose.",
        quote: "The more you give, the more you receive.",
        image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=300&fit=crop"
    },
    {
        number: 135,
        title: "The 7 Rules Recap",
        content: "Rule 1: Pay Yourself First. Rule 2: Control Your Spending. Rule 3: Make Your Money Work. Rule 4: Protect Your Wealth. Rule 5: Own Your Own Home. Rule 6: Secure Your Future. Rule 7: Increase Your Ability to Earn.",
        quote: "7 rules. 1 mission. Your wealth.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
        number: 136,
        title: "The Wealth Mindset Recap",
        content: "Wealth begins in your mind. Your beliefs about money shape your reality. Choose abundance over scarcity. Choose action over fear.",
        quote: "Mindset is everything.",
        image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=400&h=300&fit=crop"
    },
    {
        number: 137,
        title: "The Saving Habit Recap",
        content: "Save first. Spend later. Automate your savings. Build an emergency fund. Be consistent. Small amounts add up to big wealth.",
        quote: "Save consistently, not occasionally.",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop"
    },
    {
        number: 138,
        title: "Investing Recap",
        content: "Start early. Stay long. Diversify. Understand risk. Let compound interest work its magic. Time is your greatest advantage.",
        quote: "Time in the market beats timing the market.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
        number: 139,
        title: "Debt Management Recap",
        content: "Avoid bad debt. Pay off high-interest debt first. Use the debt snowball or avalanche. Stay debt-free to build wealth faster.",
        quote: "Debt steals your future.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop"
    },
    {
        number: 140,
        title: "Earning More Recap",
        content: "Learn high-income skills. Start a side hustle. Negotiate your salary. Create multiple income streams. Invest in yourself.",
        quote: "Your earning potential is unlimited.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
    },
    {
        number: 141,
        title: "Generational Wealth Recap",
        content: "Teach your children about money. Leave knowledge, not just assets. Build a legacy that lasts for generations.",
        quote: "Build for the future.",
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop"
    },
    {
        number: 142,
        title: "Financial Freedom Recap",
        content: "Financial freedom means your passive income covers your expenses. Calculate your FI number. Take action today.",
        quote: "Freedom is the goal.",
        image: "https://images.unsplash.com/photo-1553729459-9e3e9d1b7c4b?w=400&h=300&fit=crop"
    },
    {
        number: 143,
        title: "TheSpark Community",
        content: "You're not alone. Thousands of Nigerians are on this journey with you. Share, learn, and grow together.",
        quote: "Together we rise.",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop"
    },
    {
        number: 144,
        title: "Your Dedicated Coach",
        content: "Every member gets a coach. Reach out anytime. Ask questions. Get guidance. You have support every step of the way.",
        quote: "You're never alone.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
    },
    {
        number: 145,
        title: "The Power of Consistency",
        content: "Small daily actions compound into extraordinary results. Save daily. Learn daily. Grow daily. Consistency is your superpower.",
        quote: "Consistency compounds.",
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop"
    },
    {
        number: 146,
        title: "Celebrate Small Wins",
        content: "Every cycle completed is a victory. Every naira saved is progress. Celebrate your wins. They add up to big success.",
        quote: "Small wins lead to big victories.",
        image: "https://images.unsplash.com/photo-1553729459-9e3e9d1b7c4b?w=400&h=300&fit=crop"
    },
    {
        number: 147,
        title: "Stay Patient",
        content: "Wealth building takes time. Don't compare your journey to others. Stay patient. Stay consistent. Your time will come.",
        quote: "Patience pays.",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop"
    },
    {
        number: 148,
        title: "Avoid Get-Rich-Quick",
        content: "There are no shortcuts to lasting wealth. Anyone promising fast money is lying. Build slowly. Build sustainably.",
        quote: "Slow and steady wins the race.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop"
    },
    {
        number: 149,
        title: "Protect Your Progress",
        content: "Guard your savings. Avoid unnecessary withdrawals. Stay focused on your goals. Protect the wealth you're building.",
        quote: "Protection is as important as accumulation.",
        image: "https://images.unsplash.com/photo-1554224154-26032ffc0f07?w=400&h=300&fit=crop"
    },
    {
        number: 150,
        title: "Share Your Knowledge",
        content: "Teach someone else what you've learned. Sharing knowledge reinforces your own learning and helps others rise.",
        quote: "We rise by lifting others.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
    },
    {
        number: 151,
        title: "Stay Inspired",
        content: "Read success stories. Listen to podcasts. Follow wealthy role models. Keep your motivation high. You can do this.",
        quote: "Inspiration fuels action.",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    },
    {
        number: 152,
        title: "Your Why",
        content: "Why do you want wealth? Freedom for your family? Education for your children? Retirement in comfort? Keep your why front and center.",
        quote: "Find your why, and you'll find your way.",
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop"
    },
    {
        number: 153,
        title: "The Final Page",
        content: "You've reached the end of this book. But your journey is just beginning. Take what you've learned. Take action today.",
        quote: "Knowledge without action is useless.",
        image: "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=400&h=300&fit=crop"
    },
    {
        number: 154,
        title: "Remember This",
        content: "Every wealthy person was once where you are. They started with nothing but a decision. Make your decision today.",
        quote: "Your future self is counting on you.",
        image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=300&fit=crop"
    },
    {
        number: 155,
        title: "Your Journey Starts Now",
        content: "Close this book. Open TheSpark app. Set your daily goal. Make your first save. Your wealthy future begins today.",
        quote: "One spark. One fire. One wealthy you. 🔥",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
    }
];

    const nextPage = () => {
        if (currentPage < totalPages && !isFlipping) {
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentPage(currentPage + 1);
                setIsFlipping(false);
            }, 300);
        }
    };

    const prevPage = () => {
        if (currentPage > 1 && !isFlipping) {
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentPage(currentPage - 1);
                setIsFlipping(false);
            }, 300);
        }
    };

    const openBook = () => {
        setIsBookOpen(true);
    };

    const closeBook = () => {
        setIsBookOpen(false);
        setCurrentPage(1);
    };

    const toggleSection = (section) => {
        if (expandedSection === section) {
            setExpandedSection(null);
        } else {
            setExpandedSection(section);
        }
    };

    const T = {
        charcoal: '#1C1917',
        charcoalMid: '#44403C',
        ink: '#78716C',
        border: '#E7E5E4',
        ivory: '#FAFAF9',
        surface: '#FFFFFF',
        amber: '#B45309',
        amberLight: '#FEF3C7',
        amberMid: '#FCD34D',
        spark: '#EA580C',
        sparkLight: '#FFF7ED',
        sparkMid: '#FB923C',
        green: '#15803D',
        greenLight: '#F0FDF4',
    };
    
    const stories = [
        {
            id: 1,
            title: "The Problem",
            subtitle: "Two Friends in Misery",
            icon: "😢",
            color: "from-amber-500 to-orange-500",
            content: (
                <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed">
                        In the ancient city of Babylon, there lived two childhood friends: <strong className="text-spark-600">Bansir</strong> the chariot builder — the best in all Babylon — and <strong className="text-spark-600">Kobbi</strong> the musician and lyre player.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Despite their skills, both men worked endlessly yet lived paycheck to paycheck. Bansir sat on his wall feeling defeated, his wife looking at him with worried eyes because there was little food left in the house.
                    </p>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border-l-4 border-amber-400">
                        <p className="text-amber-800 italic text-sm">
                            "Why have we, who work so hard, never found any measure of wealth?"
                        </p>
                        <p className="text-amber-700 text-sm mt-1">— Bansir and Kobbi</p>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "The Realization",
            subtitle: "We Never Sought It",
            icon: "💡",
            color: "from-green-500 to-emerald-500",
            content: (
                <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed">
                        Kobbi shared the same struggle. He was a skilled musician, yet could not get ahead financially. Then came the epiphany:
                    </p>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
                        <p className="text-green-800 italic text-sm">
                            "We never sought it."
                        </p>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        Kobbi realized that just as he had decided to become a skilled lyre player and succeeded, they could decide to become wealthy and succeed as well.
                    </p>
                </div>
            )
        },
        {
            id: 3,
            title: "Remembering Their Friend",
            subtitle: "Arkad, the Richest Man in Babylon",
            icon: "👑",
            color: "from-yellow-500 to-amber-500",
            content: (
                <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed">
                        Kobbi remembered their old friend, Arkad, riding in his golden chariot. Unlike others, Arkad did not look over his humble head. Instead, he waved his hand and bestowed his smile of friendship upon Kobbi.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Bansir mused: <em>"He is claimed to be the richest man in all Babylon."</em>
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Kobbi added: <em>"So rich the king is said to seek his golden aid in affairs of the treasury."</em>
                    </p>
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg">
                        <p className="text-amber-800 text-sm">
                            <strong>Bansir joked:</strong> "I fear if I should meet him in the darkness of the night, I should lay my hands upon his fat wallet!"
                        </p>
                        <p className="text-amber-800 text-sm mt-2">
                            <strong>Kobbi wisely replied:</strong> "Nonsense. A man's wealth is not in the purse he carries. A fat purse quickly empties if there be no golden stream to refill it. Arkad has an income that constantly keeps his purse full, no matter how liberally he spends."
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 4,
            title: "The Decision",
            subtitle: "Go to Arkad",
            icon: "🎯",
            color: "from-purple-500 to-indigo-500",
            content: (
                <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed">
                        Bansir's eyes lit up: <em>"Income! That is the thing! I wish an income that will keep flowing into my purse whether I sit upon the wall or travel to far lands. Arkad must know how a man can make an income for himself."</em>
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Kobbi reminded him: <em>"He did teach his knowledge to his son, Nomasir. Did he not go to Nineveh and become, without aid from his father, one of the richest men in that city?"</em>
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        This gave Bansir hope: <em>"Kobbi, thou bringest to me a rare thought. It costs nothing to ask wise advice from a good friend. Arkad was always that. Let us go to Arkad and ask how we, also, may acquire incomes for ourselves."</em>
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Bansir, ever thoughtful of his friends, suggested gathering others who had fared no better, so they too could share in his wisdom.
                    </p>
                </div>
            )
        },
        {
            id: 5,
            title: "The Meeting with Arkad",
            subtitle: "The Secret of Wealth",
            icon: "🤝",
            color: "from-blue-500 to-cyan-500",
            content: (
                <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed">
                        Bansir, Kobbi, and their group of childhood friends went to Arkad's house and asked:
                    </p>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border-l-4 border-amber-400">
                        <p className="text-amber-800 italic text-sm">
                            "Why has fate favored you so much that you have grown rich while we remained poor, even though we've worked harder than you have?"
                        </p>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        Arkad replied that the reason they had failed to accumulate wealth might be because they had failed to observe the laws that govern wealth — or if they knew them, they had failed to follow them.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Arkad then told them his own story. When he was a young scribe, a rich moneylender named <strong>Algamish</strong> came to him needing a copy of a law. Arkad worked hard and delivered it. In return, Algamish gave him the secret to wealth:
                    </p>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
                        <p className="text-green-800 italic text-sm">
                            "I found the road to wealth when I decided that a part of all I earned was mine to keep. And so will you."
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 6,
            title: "The 7 Cures for a Lean Purse",
            subtitle: "Arkad's Timeless Lessons",
            icon: "📜",
            color: "from-red-500 to-rose-500",
            content: (
                <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed mb-3">Arkad then taught the group the same lessons he learned:</p>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { num: 1, title: "Start thy purse to fattening", desc: "Save 10% of everything you earn before spending." },
                            { num: 2, title: "Control thy expenditures", desc: "Budget your expenses. Live on 9/10 of your income." },
                            { num: 3, title: "Make thy gold multiply", desc: "Put your savings to work. Let them earn more for you." },
                            { num: 4, title: "Guard thy treasures from loss", desc: "Seek advice from experienced investors before investing." },
                            { num: 5, title: "Make of thy dwelling a profitable investment", desc: "Own your own home and build assets." },
                            { num: 6, title: "Insure a future income", desc: "Prepare for retirement and protect your family." },
                            { num: 7, title: "Increase thy ability to earn", desc: "Continuously learn and improve your skills." }
                        ].map(rule => (
                            <div key={rule.num} className="flex gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-spark-50 hover:to-spark-100 transition-all duration-300 transform hover:scale-[1.02]">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-spark-500 to-spark-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md">{rule.num}</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{rule.title}</h4>
                                    <p className="text-xs text-gray-500">{rule.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 7,
            title: "The Three Essential Principles",
            subtitle: "The Foundation of Wealth",
            icon: "🏛️",
            color: "from-teal-500 to-green-500",
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-spark-50 to-spark-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            <div className="text-3xl mb-2">💰</div>
                            <h4 className="font-bold text-gray-800 mb-2">Save 10%</h4>
                            <p className="text-xs text-gray-600">A part of all you earn is yours to keep. Save at least one-tenth of everything you earn.</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-spark-50 to-spark-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            <div className="text-3xl mb-2">📊</div>
                            <h4 className="font-bold text-gray-800 mb-2">Control Expenses</h4>
                            <p className="text-xs text-gray-600">Live on 9/10 of your income. Distinguish between needs and wants.</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-spark-50 to-spark-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            <div className="text-3xl mb-2">📈</div>
                            <h4 className="font-bold text-gray-800 mb-2">Make Money Work</h4>
                            <p className="text-xs text-gray-600">Put your savings to work. Let them earn more for you through compound interest.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 8,
            title: "The Result",
            subtitle: "Some Understood, Some Walked Away",
            icon: "⚖️",
            color: "from-indigo-500 to-purple-500",
            content: (
                <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed">
                        Some of the group understood and applied the lessons. Others walked away with no greater understanding.
                    </p>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
                        <p className="text-green-800 text-sm">
                            The difference between those who become wealthy and those who stay poor is not luck. It is the decision to <strong>learn, apply, and persist</strong>.
                        </p>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        Bansir, Kobbi, and those who took action began their journey to financial freedom. They learned that wealth is not about how much you earn — it's about how much you keep and how you make it work for you.
                    </p>
                </div>
            )
        }
    ];

    return (
        <div className="bg-gradient-to-br from-spark-50 via-white to-spark-50 min-h-screen">
            {/* <HeaderMissionCard /> */}
            
            {/* ===== FULL WIDTH MAIN CONTENT ===== */}
            <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 py-8 sm:py-12">
                
                {/* Hero Section */}

             {/* Hero Section - Light Overlay */}
<div className="relative rounded-3xl overflow-hidden mb-16">
    <div className="absolute inset-0">
        <img 
            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Financial Education Background"
            className="w-full h-full object-cover"
        />
        {/* Reduced opacity - image visible, text readable */}
        <div className="absolute inset-0 bg-black/50"></div>
    </div>
    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-20 sm:py-28">
        <div className="inline-block mb-6">
            <div className="text-8xl sm:text-9xl animate-pulse drop-shadow-2xl">🔥</div>
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            About TheSpark
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-4 font-light tracking-wide">
            wealth-building platform
        </p>
        <div className="w-24 h-0.5 bg-spark-500 mx-auto rounded-full mb-6"></div>
        <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6">
            One spark. One fire. One wealthy Nigeria.
        </p>
        <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto">
            Teaching timeless wealth principles to reduce poverty in Nigeria
        </p>
    </div>
</div>

                {/* ===== INTERACTIVE BOOK COMPONENT ===== */}
                <div className="mb-20">
                    <div className="max-w-4xl mx-auto">
                        
                        {!isBookOpen ? (
                            <div 
                                onClick={openBook}
                                className="relative group cursor-pointer mx-auto max-w-md"
                            >
                                <div className="absolute -bottom-4 left-4 right-4 h-8 bg-black/20 blur-lg rounded-full"></div>
                                <div className="relative bg-gradient-to-br from-spark-800 to-spark-900 rounded-lg p-8 shadow-2xl transform transition-all duration-500 group-hover:scale-105">
                                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-spark-950 to-spark-800 rounded-l-lg"></div>
                                    <div className="pl-12 text-center">
                                        <div className="text-7xl mb-4 animate-pulse">📖</div>
                                        <h3 className="text-white font-bold text-2xl mb-2">TheSpark</h3>
                                        <p className="text-white/60 text-sm mb-4">A Wealth-Building Journey</p>
                                        <div className="w-16 h-px bg-white/30 mx-auto mb-4"></div>
                                        <p className="text-white/40 text-xs">Click to open the book →</p>
                                    </div>
                                    <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-500/30 rounded-tr-lg"></div>
                                    <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-500/30 rounded-bl-lg"></div>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-spark-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                                    Click to Read →
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="absolute -bottom-4 left-0 right-0 h-8 bg-black/20 blur-lg rounded-full"></div>
                                <div className="relative bg-amber-50 rounded-lg shadow-2xl overflow-hidden">
                                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-700 via-amber-600 to-amber-700 z-20 hidden md:block"></div>
                                    <button 
                                        onClick={closeBook}
                                        className="absolute top-2 right-2 z-30 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white shadow-md transition"
                                    >
                                        ✕
                                    </button>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[500px]">
                                        {/* LEFT PAGE */}
                                        <div className={`p-6 md:p-8 bg-gradient-to-br from-amber-50 to-white border-r border-amber-200 transition-all duration-300 ${isFlipping ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                                            <div className="text-xs text-amber-500 font-serif italic mb-4">— Page {currentPage} —</div>
                                            <div className="rounded-lg overflow-hidden mb-4 h-40">
                                                <img src={bookPages[currentPage - 1].image} alt={bookPages[currentPage - 1].title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="text-4xl mb-3">📖</div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">{bookPages[currentPage - 1].title}</h3>
                                            <div className="w-12 h-px bg-amber-400 mb-3"></div>
                                            <p className="text-gray-600 text-sm leading-relaxed mb-3">{bookPages[currentPage - 1].content}</p>
                                            <div className="bg-amber-50 rounded-lg p-3 border-l-4 border-amber-400">
                                                <p className="text-amber-800 text-xs italic">"{bookPages[currentPage - 1].quote}"</p>
                                            </div>
                                        </div>
                                        
                                        {/* RIGHT PAGE */}
                                        <div className={`p-6 md:p-8 bg-gradient-to-br from-amber-50 to-white transition-all duration-300 ${isFlipping ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}>
                                            {currentPage < totalPages ? (
                                                <>
                                                    <div className="text-xs text-amber-500 font-serif italic mb-4 text-right">— Page {currentPage + 1} —</div>
                                                    <div className="rounded-lg overflow-hidden mb-4 h-40">
                                                        <img src={bookPages[currentPage].image} alt={bookPages[currentPage].title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="text-4xl mb-3 text-right">✨</div>
                                                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-right">{bookPages[currentPage].title}</h3>
                                                    <div className="w-12 h-px bg-amber-400 mb-3 ml-auto"></div>
                                                    <p className="text-gray-600 text-sm leading-relaxed mb-3 text-right">{bookPages[currentPage].content}</p>
                                                    <div className="bg-amber-50 rounded-lg p-3 border-r-4 border-amber-400 text-right">
                                                        <p className="text-amber-800 text-xs italic">"{bookPages[currentPage].quote}"</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-center">
                                                    <div className="text-6xl mb-4">🔥</div>
                                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to Begin?</h3>
                                                    <p className="text-gray-600 text-sm mb-4">Start your wealth-building journey today</p>
                                                    <Link to="/register" className="px-6 py-2 bg-spark-600 text-white rounded-full text-sm font-semibold hover:bg-spark-700 transition">
                                                        Join TheSpark →
                                                    </Link>
                                                    <p className="text-xs text-gray-400 mt-4">Start with just ₦100 daily</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between p-4 bg-amber-100/50 border-t border-amber-200">
                                        <button onClick={prevPage} disabled={currentPage === 1} className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed text-gray-400' : 'bg-white text-gray-700 hover:bg-amber-50 shadow-sm'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                            Previous Page
                                        </button>
                                        <div className="text-sm text-gray-500 font-serif">Page {currentPage} of {totalPages}</div>
                                        <button onClick={nextPage} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed text-gray-400' : 'bg-white text-gray-700 hover:bg-amber-50 shadow-sm'}`}>
                                            Next Page
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* The Ancient Story */}
                <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
                    <div className="absolute inset-0">
                        <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Ancient Babylon" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/90"></div>
                    </div>
                    <div className="relative p-8 sm:p-12">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="text-7xl">📖</div>
                            <div>
                                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-spark-700 to-spark-500 bg-clip-text text-transparent">The Ancient Story</h2>
                                <p className="text-gray-500 text-base mt-1">The ancient wisdom that inspired TheSpark</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <p className="text-gray-700 leading-relaxed text-lg">Over 4,000 years ago in the ancient city of Babylon, two childhood friends sat on a wall feeling defeated.</p>
                                <div className="bg-gradient-to-r from-spark-50 to-amber-50 p-6 rounded-2xl border-l-8 border-spark-500">
                                    <p className="text-gray-700 leading-relaxed"><strong className="text-spark-600 text-lg">Bansir</strong> was the finest chariot builder in all Babylon. <strong className="text-spark-600 text-lg">Kobbi</strong> was a skilled musician. Both worked tirelessly, yet both struggled to feed their families. They had no gold, no savings, no future.</p>
                                </div>
                                <p className="text-gray-700 leading-relaxed text-lg">Then came the question that changed everything: <strong className="text-spark-600">"Why have we, who work so hard, never found any measure of wealth?"</strong></p>
                                <p className="text-gray-700 leading-relaxed text-lg">The answer was simple: <strong className="text-spark-600">"We never sought it."</strong></p>
                                <p className="text-gray-700 leading-relaxed text-lg">They decided to seek wisdom from <strong className="text-spark-600">Arkad</strong> — the richest man in all Babylon.</p>
                                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-200">
                                    <p className="text-amber-800 text-lg italic">"This moment changed their lives forever. It is the same moment we invite you to take today."</p>
                                </div>
                            </div>
                            <div className="rounded-2xl overflow-hidden shadow-xl h-96">
                                <img src="https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Ancient Babylon city" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive Story Sections */}
                <div className="mb-12">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-spark-800 to-spark-600 bg-clip-text text-transparent">The Journey to Wealth</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-spark-500 to-spark-600 mx-auto rounded-full mt-4"></div>
                    </div>
                    <div className="space-y-4">
                        {stories.map((story) => (
                            <div key={story.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                                <button onClick={() => toggleSection(story.id)} className="w-full flex justify-between items-center p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-spark-50 transition-all duration-300 text-left">
                                    <div className="flex items-center gap-4">
                                        <div className={`text-3xl w-12 h-12 bg-gradient-to-r ${story.color} rounded-full flex items-center justify-center shadow-md`}>{story.icon}</div>
                                        <div>
                                            <div className="text-spark-500 text-sm font-semibold uppercase tracking-wide">{story.subtitle}</div>
                                            <h3 className="font-bold text-gray-800 text-xl">{story.title}</h3>
                                        </div>
                                    </div>
                                    <svg className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${expandedSection === story.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {expandedSection === story.id && (
                                    <div className="px-6 pb-6 border-t border-gray-100 pt-4 bg-gradient-to-b from-white to-gray-50">{story.content}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modern Story */}
                <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
                    <div className="absolute inset-0">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Modern financial education" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-spark-900/95 to-spark-800/90"></div>
                    </div>
                    <div className="relative p-8 sm:p-12 text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="text-5xl">🔥</div>
                            <h2 className="text-4xl sm:text-5xl font-bold">Our Story</h2>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <p className="text-white/90 leading-relaxed text-lg">TheSpark was born from a simple observation: <strong className="text-spark-300">Over 100 million Nigerians live in poverty</strong> — not because they don't work hard, but because no one taught them how to manage, grow, and preserve their resources.</p>
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                    <p className="leading-relaxed text-lg italic">"We discovered 'The Richest Man in Babylon' — a book written <strong className="text-spark-300">a century ago</strong> that contains timeless wealth principles that have transformed lives across generations."</p>
                                </div>
                                <p className="text-white/90 leading-relaxed text-lg">These principles are simple, proven, and accessible to anyone willing to learn. TheSpark was built to bring these principles to every Nigerian.</p>
                            </div>
                            <div className="rounded-2xl overflow-hidden shadow-xl h-80">
                                <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Team working on financial education" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission Section - Vintage Book Style */}
                <div className="py-20 bg-gradient-to-br from-amber-100 to-orange-100">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="relative bg-amber-50 rounded-lg shadow-2xl overflow-hidden border border-amber-200">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-200 to-transparent rounded-bl-3xl"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                <div className="relative p-8 md:p-10 bg-gradient-to-br from-amber-50 to-amber-100 border-r border-amber-200">
                                    <div className="text-amber-400 text-8xl absolute top-4 left-4 opacity-20">“</div>
                                    <div className="relative z-10">
                                        <div className="text-6xl font-serif text-amber-700 float-left mr-3 leading-none">O</div>
                                        <p className="text-gray-700 italic text-sm leading-relaxed">ur mission is not to make promises we cannot keep, but to share wisdom that has stood for centuries.</p>
                                        <div className="clear-both"></div>
                                        <div className="text-center my-6 text-amber-400 text-sm">❧ ❧ ❧</div>
                                        <p className="text-gray-600 text-sm leading-relaxed font-serif">"The Richest Man in Babylon" was written in 1926. For a century, these principles have transformed lives.</p>
                                    </div>
                                </div>
                                <div className="p-8 md:p-10 bg-gradient-to-br from-amber-50 to-white">
                                    <div className="text-xs text-amber-500 font-serif italic mb-2">— Our Sacred Promise —</div>
                                    <div className="text-5xl mb-4">🎯</div>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-2 font-serif">Empowering 1 Million Nigerians</h2>
                                    <p className="text-amber-700 font-medium mb-4">with Timeless Wealth Principles</p>
                                    <div className="w-12 h-px bg-amber-400 mb-5"></div>
                                    <p className="text-gray-600 leading-relaxed mb-3 font-serif">We don't promise you millions. We promise you the <strong className="text-amber-700">knowledge and accountability</strong> to build your own financial freedom.</p>
                                    <p className="text-gray-500 text-sm leading-relaxed">Ensuring 1 million Nigerians have access to the wisdom of "The Richest Man in Babylon" — tools to save, budget, and grow.</p>
                                    <div className="mt-6 pt-4 border-t border-amber-200 text-right">
                                        <p className="text-amber-500 text-xs font-serif italic">— TheSpark Foundation —</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-amber-300 hidden md:block"></div>
                        </div>
                    </div>
                </div>

                {/* What We Believe */}
                <div className="mb-12">
                    <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-10">What We Believe</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <img src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80" alt="Wealth is a Skill" className="w-full h-48 object-cover" />
                            <div className="p-6 text-center">
                                <div className="text-5xl mb-4 inline-block p-3 bg-gradient-to-br from-spark-100 to-spark-200 rounded-full">💰</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Wealth is a Skill</h3>
                                <p className="text-gray-500">Financial freedom isn't luck — it's a learnable skill that anyone can master with the right principles and consistent practice.</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80" alt="Small Actions Matter" className="w-full h-48 object-cover" />
                            <div className="p-6 text-center">
                                <div className="text-5xl mb-4 inline-block p-3 bg-gradient-to-br from-spark-100 to-spark-200 rounded-full">📚</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Small Actions Matter</h3>
                                <p className="text-gray-500">Saving ₦100 daily seems small, but over time it builds momentum and transforms into significant wealth.</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80" alt="Community Lifts All" className="w-full h-48 object-cover" />
                            <div className="p-6 text-center">
                                <div className="text-5xl mb-4 inline-block p-3 bg-gradient-to-br from-spark-100 to-spark-200 rounded-full">🤝</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Community Lifts All</h3>
                                <p className="text-gray-500">When one person rises, they lift others. We're building a community of Nigerians committed to financial freedom.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How We Work */}
                <div className="mb-12">
                    <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-10">How We Work</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-spark-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                            <img src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=250&q=80" alt="21 Day Cycles" className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <div className="text-4xl mb-3">🔄</div>
                                <h3 className="text-2xl font-bold text-spark-600 mb-3">21-Day Cycles</h3>
                                <p className="text-gray-600">Our program is built around 21-day cycles — a scientifically proven timeframe to build lasting habits. Each cycle teaches one of the 7 wealth principles.</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-spark-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=250&q=80" alt="Progress Tracking" className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <div className="text-4xl mb-3">📊</div>
                                <h3 className="text-2xl font-bold text-spark-600 mb-3">Progress Tracking</h3>
                                <p className="text-gray-600">Members track their daily savings, monitor their consistency, and see their progress over time. What gets measured gets improved.</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-spark-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                            <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=250&q=80" alt="Educational Content" className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <div className="text-4xl mb-3">📚</div>
                                <h3 className="text-2xl font-bold text-spark-600 mb-3">Educational Content</h3>
                                <p className="text-gray-600">Each cycle delivers bite-sized lessons based on proven wealth principles. Learn as you save.</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-spark-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                            <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=250&q=80" alt="8 Cycles to Completion" className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <div className="text-4xl mb-3">🎓</div>
                                <h3 className="text-2xl font-bold text-spark-600 mb-3">8 Cycles to Completion</h3>
                                <p className="text-gray-600">Complete all 8 cycles (6 months) and unlock graduate-level opportunities, including advanced learning and real-world wealth-building paths.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Our Principles */}
                <div className="bg-gradient-to-br from-white to-spark-50 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl border border-spark-100">
                    <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-4">Our Principles</h2>
                    <p className="text-center text-gray-500 mb-10 text-lg">Everything we do is guided by the 7 timeless rules from "The Richest Man in Babylon"</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { icon: "💰", text: "Pay Yourself First - Save 10% before spending" },
                            { icon: "🎯", text: "Control Your Spending - Need vs Want" },
                            { icon: "📈", text: "Make Your Money Work - Let consistency compound" },
                            { icon: "🛡️", text: "Protect Your Wealth - Avoid get-rich schemes" },
                            { icon: "🏠", text: "Own Your Own Home - Build assets" },
                            { icon: "🔒", text: "Secure Your Future - Prepare for emergencies" },
                            { icon: "📚", text: "Increase Your Ability to Earn - Learn and grow" }
                        ].map((principle, index) => (
                            <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100">
                                <span className="text-2xl">{principle.icon}</span>
                                <span className="text-sm text-gray-700">{principle.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* The Spark Difference */}
                <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
                    <div className="absolute inset-0">
                        <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Financial growth" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-spark-900/95 to-spark-800/90"></div>
                    </div>
                    <div className="relative p-8 sm:p-12">
                        <h2 className="text-4xl sm:text-5xl font-bold text-center text-white mb-10">How TheSpark Brings This to Life</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3"><span className="text-3xl">💰</span><h3 className="text-xl font-bold text-white">Save 10% First</h3></div>
                                <p className="text-white/80">Just like Arkad taught, we help you save a portion of what you earn before anything else. Start with as little as ₦100 daily.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3"><span className="text-3xl">📊</span><h3 className="text-xl font-bold text-white">Track Every Naira</h3></div>
                                <p className="text-white/80">Control your expenditures by tracking your daily savings. Watch your consistency grow with each 21-day cycle.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3"><span className="text-3xl">📈</span><h3 className="text-xl font-bold text-white">Let Consistency Compound</h3></div>
                                <p className="text-white/80">Your daily actions build momentum. The more consistent you are, the more your progress grows.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3"><span className="text-3xl">🎓</span><h3 className="text-xl font-bold text-white">Graduate to Real Opportunities</h3></div>
                                <p className="text-white/80">After 8 cycles (6 months), you unlock graduate benefits — the same next step Arkad offered to those who learned.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The Problem We Solve */}
                <div className="bg-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl border border-gray-100">
                    <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-10">The Problem We Solve</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                        {[
                            { value: "140M+", label: "Nigerians in Poverty", icon: "😢", trend: "63% of population (2025)", detail: "According to the World Bank's Nigeria Development Update (April 2026), poverty in Nigeria rose from 56% in 2023 to 61% in 2024, reaching 63% in 2025 — affecting approximately 140 million Nigerians.", source: "World Bank NDU (Apr 2026)", sourceLink: "https://www.worldbank.org/en/country/nigeria/publication/nigeria-development-update-ndu" },
                            { value: "52.5%", label: "Extreme Poverty Rate", icon: "📉", trend: "$3.00/day poverty line", detail: "The World Bank reports that more than half of all Nigerians (52.5 percent) are estimated to live in poverty in 2025, based on World Bank projections at the international poverty line of $3.00 per day.", source: "World Bank Poverty Brief (Oct 2025)", sourceLink: "https://documents1.worldbank.org/curated/en/099100825010038474/txt/P513192-b0cb6210-6cdc-423f-b0eb-834a44a28494.txt" },
                            { value: "60%", label: "No Emergency Savings", icon: "💔", trend: "6 in 10 Nigerians", detail: "According to the PiggyVest Savings Report 2025, which surveyed over 26,000 Nigerians across all six geopolitical zones, six in ten Nigerians have no funds set aside for emergencies.", source: "PiggyVest Report 2025", sourceLink: "https://blog.piggyvest.com/save/announcement/piggyvest-savings-report-2025/" },
                            { value: "28M", label: "Unbanked Adults", icon: "🏦", trend: "26% of adults excluded", detail: "According to the Central Bank of Nigeria (CBN) and EFInA Access to Finance surveys, 28 million Nigerian adults (approximately 26% of the adult population) remain financially excluded.", source: "CBN/EFInA 2024", sourceLink: "https://www.cbn.gov.ng/" }
                        ].map((stat, i) => (
                            <div key={i} onClick={() => setSelectedStat(stat)} className="group text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl">
                                <div className="text-4xl mb-3">{stat.icon}</div>
                                <div className="font-bold text-spark-600 text-2xl">{stat.value}</div>
                                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                                <div className="text-xs text-gray-400 mt-1">{stat.trend}</div>
                                <div className="mt-2 opacity-0 group-hover:opacity-100 transition"><svg className="w-4 h-4 text-spark-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gradient-to-r from-spark-600 to-spark-500 p-8 rounded-2xl text-center">
                        <p className="text-white text-xl">We're not here to blame anyone. We're here to teach. Because the knowledge that builds wealth should be available to everyone — not just the lucky few.</p>
                    </div>
                </div>

                {/* Stat Detail Modal */}
                {selectedStat && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedStat(null)}>
                        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
                                <div className="flex items-center gap-3"><span className="text-4xl">{selectedStat.icon}</span><h3 className="text-2xl font-bold text-gray-800">{selectedStat.label}</h3></div>
                                <button onClick={() => setSelectedStat(null)} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                            </div>
                            <div className="mb-6"><div className="text-5xl font-bold text-spark-600 mb-2">{selectedStat.value}</div><div className="text-sm text-gray-500 mb-4">{selectedStat.trend}</div><p className="text-gray-600 leading-relaxed">{selectedStat.detail}</p></div>
                            <div className="bg-spark-50 rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">📖 Source:</p><a href={selectedStat.sourceLink} target="_blank" rel="noopener noreferrer" className="text-sm text-spark-600 hover:underline break-all">{selectedStat.source}</a></div>
                            <button onClick={() => setSelectedStat(null)} className="w-full mt-6 px-5 py-3 bg-spark-600 text-white rounded-xl font-semibold hover:bg-spark-700 transition">Close</button>
                        </div>
                    </div>
                )}

                {/* Who This Is For */}
                <div className="bg-gradient-to-br from-spark-50 via-white to-spark-50 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl">
                    <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-10">Who This Is For</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div><div className="text-center mb-6"><h3 className="text-2xl font-semibold text-spark-600 inline-block border-b-2 border-spark-400 pb-2">By Profile</h3></div>
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-300"><div className="text-4xl mb-3">🌱</div><h4 className="text-xl font-bold text-gray-800 mb-2">Beginners</h4><p className="text-gray-500">No experience needed. Start with ₦100/day and learn as you go.</p></div>
                            <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-300"><div className="text-4xl mb-3">📈</div><h4 className="text-xl font-bold text-gray-800 mb-2">Consistent Savers</h4><p className="text-gray-500">Already saving? Structure your habit and track your progress.</p></div>
                            <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-300"><div className="text-4xl mb-3">🎯</div><h4 className="text-xl font-bold text-gray-800 mb-2">Goal-Oriented</h4><p className="text-gray-500">Working toward a specific financial target? Let us help you get there.</p></div>
                            <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-300"><div className="text-4xl mb-3">👥</div><h4 className="text-xl font-bold text-gray-800 mb-2">Community Builders</h4><p className="text-gray-500">Want to learn and grow alongside others on the same journey.</p></div>
                        </div></div>
                        <div><div className="text-center mb-6"><h3 className="text-2xl font-semibold text-spark-600 inline-block border-b-2 border-spark-400 pb-2">By Mindset</h3></div>
                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-spark-50 to-white rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-300"><div className="text-4xl mb-3">🌱</div><h4 className="text-xl font-bold text-spark-600 mb-2">Bansir & Kobbi</h4><p className="text-gray-500">Hard workers who never learned how to build wealth — until now.</p></div>
                            <div className="bg-gradient-to-br from-spark-50 to-white rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-300"><div className="text-4xl mb-3">🎯</div><h4 className="text-xl font-bold text-spark-600 mb-2">Arkad's Students</h4><p className="text-gray-500">Those ready to learn, apply, and persist until they succeed.</p></div>
                            <div className="bg-gradient-to-br from-spark-50 to-white rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-300"><div className="text-4xl mb-3">📚</div><h4 className="text-xl font-bold text-spark-600 mb-2">Life-Long Learners</h4><p className="text-gray-500">People who understand that wealth is a skill — and skills can be learned.</p></div>
                            <div className="bg-gradient-to-br from-spark-50 to-white rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-300"><div className="text-4xl mb-3">🔥</div><h4 className="text-xl font-bold text-spark-600 mb-2">The Determined</h4><p className="text-gray-500">Those ready to be the spark that changes their family's financial future.</p></div>
                        </div></div>
                    </div>
                </div>

                {/* The Promise */}
                <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
                    <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Commitment" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-spark-900/95 to-charcoal-900/90"></div></div>
                    <div className="relative p-12 text-center text-white"><div className="text-7xl sm:text-8xl mb-6">🤝</div><div className="text-sm uppercase tracking-wider text-white/50 mb-4">Our Commitment</div><h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 max-w-3xl mx-auto">We cannot promise you wealth.</h2><p className="text-spark-300 text-xl sm:text-2xl font-semibold mb-8">Only your consistency can do that.</p><div className="w-20 h-0.5 bg-white/30 mx-auto rounded-full mb-8"></div><p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">But we can provide you the same knowledge that turned Arkad into the richest man in Babylon and transformed Bansir and Kobbi from struggling workers into men on the path to wealth.</p></div>
                </div>

                {/* Call to Action */}
                <div className="relative rounded-3xl overflow-hidden mb-12">
                    <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1532619187608-e5375cab36aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Start your journey" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-spark-600/95 to-spark-500/95"></div></div>
                    <div className="relative p-12 text-center text-white"><h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Ready to Start Your Journey?</h2><p className="text-base sm:text-lg text-white/90 mb-8 max-w-md mx-auto">Join thousands of Nigerians building consistent financial habits one day at a time.</p><Link to="/register" className="inline-block bg-white text-spark-700 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-spark-50">Create Your Free Account 🔥</Link><p className="text-sm text-white/60 mt-6">Start with just ₦100 daily. Every spark matters.</p></div>
                </div>

                {/* Disclaimer */}
                <div className="text-center text-xs text-gray-400 mt-10 pt-6 border-t-2 border-gray-200">
                    <p className="mb-2">TheSpark is a wealth-building platform. We provide financial education and habit-tracking tools based on proven principles from "The Richest Man in Babylon." Individual results depend on personal consistency and commitment.</p>
                    <p>We do not guarantee specific financial outcomes. Wealth-building is a skill that requires time, effort, and discipline. TheSpark is here to guide and support you on your journey, but your success ultimately depends on your actions.</p>
                </div>

                {/* <p style={{ fontSize: 12, color: T.ink, textAlign: 'center', marginTop: 40, lineHeight: 1.7, borderTop: `1px solid ${T.border}`, paddingTop: 24 }}>TheSpark is a wealth-building education platform. Our program is based on proven principles from <em>The Richest Man in Babylon</em>. Individual results depend on personal consistency and commitment. We do not guarantee specific financial outcomes.</p> */}
            </div>
        </div>
    );
}