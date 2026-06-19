import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderMissionCard from '../components/Common/HeaderMissionCard';

const faqs = [
    // SECTION 1: GENERAL QUESTIONS (1-15)
    {
        category: "general",
        question: "❓ What is TheSpark?",
        answer: "TheSpark is a wealth-building platform. We teach the timeless wealth principles from The Richest Man in Babylon through daily habit tracking. You'll learn how to save, grow, and build wealth — breaking the cycle of poverty one day at a time. Be the spark."
    },
    {
        category: "general",
        question: "🔥 Why the name 'TheSpark'?",
        answer: "One spark can start a fire. One small daily action can build massive wealth over time. TheSpark represents that first small step toward financial freedom."
    },
    {
        category: "general",
        question: "🏆 What makes TheSpark different?",
        answer: "We focus on habit-building, not quick fixes. We teach proven principles from ancient wisdom, not get-rich-quick schemes. We're a mission to reduce poverty, not just a business."
    },
    {
        category: "general",
        question: "📅 When was TheSpark founded?",
        answer: "TheSpark was founded in may-2026 with a mission to reduce poverty in Nigeria through financial education and accountability."
    },
    {
        category: "general",
        question: "📍 Where is TheSpark located?",
        answer: "TheSpark is headquartered in Nigeria, serving Nigerians across all 36 states and the FCT."
    },
    {
        category: "general",
        question: "👥 Who can join TheSpark?",
        answer: "Any Nigerian aged 18 or older can join TheSpark. We welcome everyone from students to professionals, entrepreneurs to retirees."
    },
    {
        category: "general",
        question: "💡 Do I need prior financial knowledge?",
        answer: "Not at all! TheSpark is designed for complete beginners. You'll learn everything you need to know as you progress through the cycles."
    },
    {
        category: "general",
        question: "📱 Can I join from anywhere in Nigeria?",
        answer: "Yes! TheSpark is fully online and accessible from anywhere in Nigeria with an internet connection."
    },
    {
        category: "general",
        question: "🌍 Will TheSpark expand to other countries?",
        answer: "We're currently focused on Nigeria. Expansion to other African countries is planned for the future."
    },
    {
        category: "general",
        question: "🤝 Is TheSpark a registered business?",
        answer: "Yes, TheSpark is operated by Gimablockchain, a CAC-registered business name in Nigeria."
    },
    {
        category: "general",
        question: "📜 What is your mission?",
        answer: "Our mission is to reduce poverty in Nigeria by teaching one person at a time the timeless wealth principles that have transformed lives for generations."
    },
    {
        category: "general",
        question: "🎯 What is your goal?",
        answer: "1 Million Wealthy Nigerians by 2030. We believe financial freedom should be accessible to everyone."
    },
    {
        category: "general",
        question: "💪 How is TheSpark different from other platforms?",
        answer: "We're an accountability and education platform that helps you build consistent wealth habits."
    },
    {
        category: "general",
        question: "📚 What book inspired TheSpark?",
        answer: "The Richest Man in Babylon by George S. Clason. This book contains timeless wealth principles that have transformed lives for nearly a century."
    },
    {
        category: "general",
        question: "⏳ How long has TheSpark been operating?",
        answer: "TheSpark launched  may 2026 and is already helping Nigerians build better financial habits."
    },

    // SECTION 2: HOW IT WORKS (16-35)
    {
        category: "how-it-works",
        question: "💰 How does TheSpark work?",
        answer: "Set your daily goal and track your consistency over 21-day cycles. Days 1-16 build your momentum. Days 17-21 complete your cycle. This continues cycle after cycle, building your wealth habit."
    },
    {
        category: "how-it-works",
        question: "🔄 What is a cycle?",
        answer: "A cycle is 21 days of tracking your daily goal. Each cycle teaches one of the 7 Rules of Wealth from The Richest Man in Babylon."
    },
    {
        category: "how-it-works",
        question: "📊 How many cycles do I need to complete?",
        answer: "Complete 8 cycles (6 months) to graduate. But you can continue tracking indefinitely — wealth building is a lifelong journey."
    },
    {
        category: "how-it-works",
        question: "🎓 What happens after 8 cycles?",
        answer: "You become a TheSpark Graduate. You receive a certificate and unlock advanced learning opportunities."
    },
    {
        category: "how-it-works",
        question: "📈 What are the 7 Rules of Wealth?",
        answer: "1. Pay Yourself First\n2. Control Your Spending\n3. Make Your Money Work\n4. Protect Your Wealth\n5. Own Your Own Home\n6. Secure Your Future\n7. Increase Your Ability to Earn"
    },
    {
        category: "how-it-works",
        question: "📅 What is a 21-day cycle?",
        answer: "21 days is scientifically proven to build lasting habits. Each cycle focuses on one wealth principle, giving you time to internalize it."
    },
    {
        category: "how-it-works",
        question: "📊 What happens on Days 1-16?",
        answer: "Days 1-16 are your momentum-building phase. Your consistency during these days determines your cycle progress."
    },
    {
        category: "how-it-works",
        question: "🎯 What happens on Days 17-21?",
        answer: "Days 17-21 complete your cycle. You review your progress and prepare for the next cycle."
    },
    {
        category: "how-it-works",
        question: "🔄 What happens after Day 21?",
        answer: "You automatically start a new cycle. Each cycle teaches a new wealth principle."
    },
    {
        category: "how-it-works",
        question: "📈 How do I track my daily goal?",
        answer: "Log into your dashboard and mark your progress each day. The system tracks your consistency automatically."
    },
    {
        category: "how-it-works",
        question: "📊 Can I see my progress?",
        answer: "Yes! Your dashboard shows your current progress, total tracked, cycle and day information, and projected completion."
    },
    {
        category: "how-it-works",
        question: "❌ What if I miss a day?",
        answer: "No penalty! You can track any day you want. Missing a day just means less progress that cycle. Consistency is encouraged but not required."
    },
    {
        category: "how-it-works",
        question: "💪 How do I stay motivated?",
        answer: "Track your progress, celebrate small wins, connect with the community, and remember why you started."
    },
    {
        category: "how-it-works",
        question: "📊 How is consistency measured?",
        answer: "Consistency is measured by how often you meet your daily goal. The more consistent you are, the better your progress."
    },
    {
        category: "how-it-works",
        question: "🎯 How do I set my daily goal?",
        answer: "During registration, you choose your daily goal. You can adjust it later based on your financial situation."
    },
    {
        category: "how-it-works",
        question: "🔄 Can I change my daily goal?",
        answer: "Yes, you can adjust your daily goal in your dashboard settings. Changes apply to your next cycle."
    },
    {
        category: "how-it-works",
        question: "📊 What if my goal is too high?",
        answer: "You can lower your goal anytime. Start small and increase gradually as you build consistency."
    },
    {
        category: "how-it-works",
        question: "📊 What if my goal is too low?",
        answer: "You can increase your goal anytime. Challenge yourself to grow as your habit strengthens."
    },
    {
        category: "how-it-works",
        question: "📱 Do I need internet access?",
        answer: "Yes, an internet connection is required to access your dashboard and track your progress."
    },
    {
        category: "how-it-works",
        question: "⏰ What time should I track my progress?",
        answer: "Any time that works for you! Consistency matters more than specific timing. Pick a time that fits your routine."
    },

    // SECTION 3: PREMIUM PLANS (36-50)
    {
        category: "premium",
        question: "⭐ What are the Premium plans?",
        answer: "Premium plans let you set higher daily goals:\n\n🔹 BASIC PLAN (Free)\n• Daily goal: ₦100 - ₦2,000\n\n🔹 PREMIUM PLAN (₦1,000/month)\n• Daily goal: ₦500 - ₦10,000\n• Priority support + monthly coaching calls\n\n🔹 INVESTOR PLAN (₦2,500/month)\n• Daily goal: ₦1,000 - ₦20,000\n• Priority support + coaching calls + exclusive learning"
    },
    {
        category: "premium",
        question: "💵 What is the daily goal limit?",
        answer: "BASIC: ₦100-₦2,000 • PREMIUM: ₦500-₦10,000 • INVESTOR: ₦1,000-₦20,000"
    },
    {
        category: "premium",
        question: "📈 Which Premium plan should I choose?",
        answer: "BASIC for goals under ₦2,000/day • PREMIUM for goals ₦2,000-₦10,000/day • INVESTOR for goals over ₦10,000/day"
    },
    {
        category: "premium",
        question: "🔄 Can I upgrade my plan?",
        answer: "Yes! You can upgrade anytime from your dashboard. Your new daily goal limit applies immediately."
    },
    {
        category: "premium",
        question: "🔄 Can I downgrade my plan?",
        answer: "Yes, you can downgrade or cancel your Premium plan anytime. Your progress history remains intact."
    },
    {
        category: "premium",
        question: "💰 How much does Premium cost?",
        answer: "Premium Plan: ₦1,000/month • Investor Plan: ₦2,500/month • Basic Plan: Free forever"
    },
    {
        category: "premium",
        question: "📅 When am I billed?",
        answer: "Premium subscriptions are billed monthly on the day you upgraded. You can cancel anytime."
    },
    {
        category: "premium",
        question: "🎁 Is there a free trial?",
        answer: "Basic Plan is always free. You can upgrade to Premium anytime to access higher daily goals."
    },
    {
        category: "premium",
        question: "💳 What if I can't afford Premium?",
        answer: "Basic Plan is completely free and includes all core features. Only higher daily goals require Premium."
    },
    {
        category: "premium",
        question: "🏆 What are Premium benefits?",
        answer: "Higher daily goals, priority support, monthly coaching calls, and exclusive learning content."
    },
    {
        category: "premium",
        question: "📞 What are coaching calls?",
        answer: "Premium and Investor plan members get monthly group coaching calls to discuss progress and wealth-building strategies."
    },
    {
        category: "premium",
        question: "🎓 What is exclusive learning?",
        answer: "Investor plan members get access to advanced wealth-building educational content not available to Basic members."
    },
    {
        category: "premium",
        question: "⏰ How long do coaching calls last?",
        answer: "Monthly coaching calls typically last 45-60 minutes and include Q&A sessions."
    },
    {
        category: "premium",
        question: "📚 Who leads coaching calls?",
        answer: "Coaching calls are led by experienced financial educators and TheSpark founders."
    },
    {
        category: "premium",
        question: "🎯 Can I switch plans monthly?",
        answer: "Yes, you can upgrade or downgrade between plans each month based on your current goals.",
    },
    {
        category: "referral",
        question: "👥 How do I refer someone?",
        answer: "Share your unique referral code. When someone joins using your code and completes Cycle 1, you earn recognition rewards."
    },
    {
        category: "referral",
        question: "🏆 What is the referral reward?",
        answer: "You earn recognition rewards for every friend who joins using your referral code and completes their first cycle."
    },
    {
        category: "referral",
        question: "👑 What is a TheSpark Ambassador?",
        answer: "An Ambassador is a member who has referred 10+ people. Ambassadors receive additional recognition rewards."
    },
    {
        category: "referral",
        question: "🎁 What are recognition rewards?",
        answer: "Recognition rewards are given for referring friends who complete their first cycle. They celebrate your community building."
    },
    {
        category: "referral",
        question: "📊 How do I find my referral code?",
        answer: "Your referral code is available in your dashboard under the 'Refer Friends' section."
    },
    {
        category: "referral",
        question: "📱 Can I share my code on social media?",
        answer: "Absolutely! Share your code on WhatsApp, Instagram, Twitter, Facebook, or any platform you prefer."
    },
    {
        category: "referral",
        question: "👥 Can I refer unlimited people?",
        answer: "Yes! There's no limit to how many people you can refer. The more you refer, the more recognition you earn."
    },
    {
        category: "referral",
        question: "🎯 What happens when my referral completes Cycle 1?",
        answer: "You receive recognition rewards automatically. The rewards are added to your dashboard."
    },
    {
        category: "referral",
        question: "📊 Can I track my referrals?",
        answer: "Yes! Your dashboard shows how many people have joined using your code and how many have completed Cycle 1."
    },
    {
        category: "referral",
        question: "🏆 What are Ambassador benefits?",
        answer: "Ambassadors receive special recognition, exclusive content, and additional rewards for their community building."
    },
    {
        category: "referral",
        question: "👥 Can I refer someone outside Nigeria?",
        answer: "Currently, TheSpark is only available in Nigeria. Referrals must be Nigerian residents."
    },
    {
        category: "referral",
        question: "📱 Can I refer someone who doesn't have email?",
        answer: "Yes, they can sign up using phone number verification instead of email."
    },
    {
        category: "referral",
        question: "🎁 Do referrals expire?",
        answer: "No, referrals never expire. Your code works forever."
    },
    {
        category: "referral",
        question: "👥 Can I refer my family members?",
        answer: "Absolutely! TheSpark is built for community. Invite family and friends to build wealth together."
    },
    {
        category: "referral",
        question: "🏆 What's the highest referral achievement?",
        answer: "TheSpark Ambassador is the highest recognition level, achieved by referring 10+ people who complete Cycle 1.",
    },
    {
        category: "account",
        question: "📱 How do I create an account?",
        answer: "Click 'Register' on the homepage. You can sign up using Google, email, or phone number verification."
    },
    {
        category: "account",
        question: "🔑 Can I sign up with Google?",
        answer: "Yes! Google authentication is available for quick and secure sign-up."
    },
    {
        category: "account",
        question: "📱 Can I sign up with my phone number?",
        answer: "Yes! You can sign up using phone number with OTP verification."
    },
    {
        category: "account",
        question: "🔒 Is my account secure?",
        answer: "Yes, TheSpark uses bank-level 256-bit SSL encryption and Firebase security to protect your data."
    },
    {
        category: "account",
        question: "🔑 What if I forget my password?",
        answer: "Use the 'Forgot Password' link on the login page to reset your password via email."
    },
    {
        category: "account",
        question: "📱 Can I change my phone number?",
        answer: "Yes, you can update your phone number in account settings."
    },
    {
        category: "account",
        question: "📧 Can I change my email address?",
        answer: "Yes, you can update your email address in account settings."
    },
    {
        category: "account",
        question: "🔒 Can I delete my account?",
        answer: "Yes, you can request account deletion by contacting support@thespark.money"
    },
    {
        category: "account",
        question: "📊 What happens to my progress if I delete my account?",
        answer: "Your progress history is permanently deleted. You would need to start fresh if you rejoin."
    },
    {
        category: "account",
        question: "🔒 Can I have multiple accounts?",
        answer: "No, each user is limited to one account. Multiple accounts violate our terms of service."
    },
    {
        category: "account",
        question: "📱 Do I need a special app?",
        answer: "No, TheSpark works in any web browser on phone, tablet, or computer."
    },
    {
        category: "account",
        question: "🔒 Is my data shared with third parties?",
        answer: "No, we never share your personal information with third parties without your consent."
    },
    {
        category: "account",
        question: "📊 Can I export my progress data?",
        answer: "Yes, you can download your progress history from your dashboard."
    },
    {
        category: "account",
        question: "📱 Can I access TheSpark on multiple devices?",
        answer: "Yes, you can log in from any device. Your progress syncs automatically."
    },
    {
        category: "account",
        question: "🔒 What happens if someone tries to hack my account?",
        answer: "We have security measures in place. Contact support immediately if you notice suspicious activity.",
    },
    {
        category: "support",
        question: "📞 How do I contact support?",
        answer: "Email support@thespark.money or message your dedicated Coach on WhatsApp."
    },
    {
        category: "support",
        question: "⏰ What are support hours?",
        answer: "Support is available Monday-Friday, 9 AM - 6 PM WAT. Priority support for Premium members."
    },
    {
        category: "support",
        question: "📞 How fast is support response?",
        answer: "Basic members receive responses within 24-48 hours. Premium members receive priority responses within 12 hours."
    },
    {
        category: "support",
        question: "📱 Can I call support?",
        answer: "Yes, your dedicated Coach can be reached via phone during support hours."
    },
    {
        category: "support",
        question: "💬 Is there a live chat?",
        answer: "Live chat is coming soon. Currently, support is via email and WhatsApp."
    },
    {
        category: "support",
        question: "📞 Who is my dedicated Coach?",
        answer: "Every TheSpark member is assigned a Coach who provides guidance and answers questions."
    },
    {
        category: "support",
        question: "📱 How do I find my Coach's contact?",
        answer: "Your Coach's WhatsApp number is available in your dashboard."
    },
    {
        category: "support",
        question: "💬 Can I change my Coach?",
        answer: "Yes, contact support to request a Coach change if needed."
    },
    {
        category: "support",
        question: "📞 Do Coaches provide financial advice?",
        answer: "Coaches provide educational guidance based on TheSpark principles, not personalized financial advice."
    },
    {
        category: "support",
        question: "💬 What languages does support speak?",
        answer: "Support is available in English and major Nigerian languages including Yoruba, Igbo, and Hausa."
    },
    {
        category: "support",
        question: "📱 Is there a community forum?",
        answer: "Yes, TheSpark has a community forum where members can share experiences and ask questions."
    },
    {
        category: "support",
        question: "💬 Can I join a WhatsApp group?",
        answer: "Yes, Premium members have access to exclusive WhatsApp groups for community support."
    },
    {
        category: "support",
        question: "📞 How do I report a problem?",
        answer: "Email support@thespark.money with details of the issue. Our team will investigate promptly."
    },
    {
        category: "support",
        question: "💬 Is there a complaint process?",
        answer: "Yes, email complaints to support@thespark.money. All complaints are addressed within 3 business days."
    },
    {
        category: "support",
        question: "📱 Can I suggest new features?",
        answer: "Absolutely! We welcome feedback and suggestions from our community. Email your ideas to support@thespark.money",
    },
    {
        category: "graduation",
        question: "🎓 What happens after I graduate?",
        answer: "After completing 8 cycles (6 months), you become a TheSpark Graduate. You receive a certificate and unlock advanced learning opportunities."
    },
    {
        category: "graduation",
        question: "🎓 What are Graduate benefits?",
        answer: "Graduates get access to advanced wealth-building education, exclusive learning opportunities, and priority support."
    },
    {
        category: "graduation",
        question: "📜 Do I get a certificate?",
        answer: "Yes, graduates receive a digital certificate recognizing their completion of the 8-cycle program."
    },
    {
        category: "graduation",
        question: "🎓 Can I continue after graduation?",
        answer: "Yes! TheSpark is a lifelong journey. You can continue tracking indefinitely and access graduate-only content."
    },
    {
        category: "graduation",
        question: "📚 What advanced learning is available?",
        answer: "Graduates access content on micro-lending education, asset co-ownership training, and skill development."
    },
    {
        category: "graduation",
        question: "🎓 Can I become a Coach?",
        answer: "Outstanding graduates may be invited to become TheSpark Coaches to help new members."
    },
    {
        category: "graduation",
        question: "📜 Is the certificate recognized?",
        answer: "The certificate demonstrates your commitment to financial education and habit-building."
    },
    {
        category: "graduation",
        question: "🎓 How long does graduation take?",
        answer: "8 cycles = 6 months of consistent progress. The exact time depends on your consistency."
    },
    {
        category: "graduation",
        question: "🎓 What if I miss cycles?",
        answer: "Your cycles continue. There's no penalty for missing. Just pick up where you left off."
    },
    {
        category: "graduation",
        question: "🎓 Can I graduate faster?",
        answer: "8 cycles require 8 × 21 days = 168 days minimum. Consistency determines how quickly you complete."
    },
    {
        category: "graduation",
        question: "🎓 What is a Graduate status?",
        answer: "Graduate status unlocks advanced content and opportunities not available to non-graduates."
    },
    {
        category: "graduation",
        question: "📚 Is there advanced content for graduates?",
        answer: "Yes, graduates access exclusive video lessons, articles, and workshops."
    },
    {
        category: "graduation",
        question: "🎓 Can I retake cycles?",
        answer: "Yes, you can repeat any cycle to reinforce the principles at any time."
    },
    {
        category: "graduation",
        question: "📜 Where can I share my certificate?",
        answer: "Share on LinkedIn, WhatsApp, Instagram, or any platform to celebrate your achievement."
    },
    {
        category: "graduation",
        question: "🎓 Is there a graduation ceremony?",
        answer: "Virtual graduation celebrations are held quarterly for new graduates.",
    },
    {
        category: "community",
        question: "👥 Is there a TheSpark community?",
        answer: "Yes! TheSpark has a growing community of wealth builders. Connect with others on the same journey."
    },
    {
        category: "community",
        question: "💬 How do I join the community?",
        answer: "Access the community forum from your dashboard. Premium members also get WhatsApp group access."
    },
    {
        category: "community",
        question: "👥 Can I create my own group?",
        answer: "Yes! You can invite friends to join and create your own accountability group within TheSpark."
    },
    {
        category: "community",
        question: "📊 Can I see others' progress?",
        answer: "TheSpark respects privacy. You can see community-wide metrics without seeing individual member data."
    },
    {
        category: "community",
        question: "💬 Are there challenges?",
        answer: "Yes, regular community challenges help keep members motivated and engaged."
    },
    {
        category: "community",
        question: "🏆 What are the challenges?",
        answer: "Consistency challenges, referral challenges, and cycle completion challenges with recognition rewards."
    },
    {
        category: "community",
        question: "👥 Can I compete with friends?",
        answer: "Yes, you can create friendly competitions within your accountability group."
    },
    {
        category: "community",
        question: "💬 Is there a leaderboard?",
        answer: "Yes, community leaderboards show top consistent members and top referrers."
    },
    {
        category: "community",
        question: "🎉 How are milestones celebrated?",
        answer: "TheSpark celebrates cycle completions, graduation, and referral achievements with recognition."
    },
    {
        category: "community",
        question: "💬 Can I get a shoutout?",
        answer: "Yes, outstanding members are featured in our community highlights and social media."
    },
    {
        category: "community",
        question: "👥 How do I find accountability partners?",
        answer: "Use the community forum to connect with members who have similar goals."
    },
    {
        category: "community",
        question: "💬 Are there meetups?",
        answer: "Virtual meetups are held monthly. Physical meetups are planned for major cities."
    },
    {
        category: "community",
        question: "🎉 What is the Annual Summit?",
        answer: "TheSpark holds an annual wealth-building summit for all members, featuring expert speakers."
    },
    {
        category: "community",
        question: "👥 Can I volunteer to help others?",
        answer: "Yes, graduates can apply to become volunteer mentors for new members."
    },
    {
        category: "community",
        question: "💬 Is there a newsletter?",
        answer: "Yes, subscribe to our weekly newsletter for financial tips and community updates.",
    },
    {
        category: "content",
        question: "📚 What is the daily message?",
        answer: "Each day, you receive an educational message based on the current cycle's wealth principle."
    },
    {
        category: "content",
        question: "📖 What are the 7 cycles about?",
        answer: "Each cycle teaches one rule: Pay Yourself First, Control Spending, Make Money Work, Protect Wealth, Own Home, Secure Future, Increase Earning."
    },
    {
        category: "content",
        question: "📚 Is there a resource library?",
        answer: "Yes, all members have access to our resource library with articles, videos, and worksheets."
    },
    {
        category: "content",
        question: "📖 Are there video lessons?",
        answer: "Yes, Premium and Investor members get access to exclusive video lessons."
    },
    {
        category: "content",
        question: "📚 Can I download resources?",
        answer: "Yes, most resources are available for download in PDF format."
    },
    {
        category: "content",
        question: "📖 What is The Richest Man in Babylon?",
        answer: "It's the classic book that inspired TheSpark. It contains timeless wealth principles through parables."
    },
    {
        category: "content",
        question: "📚 Do I need to read the book?",
        answer: "Not required, but highly recommended. TheSpark teaches the same principles from the book."
    },
    {
        category: "content",
        question: "📖 Where can I get the book?",
        answer: "The Richest Man in Babylon is available online and in bookstores. It's also in our resource library."
    },
    {
        category: "content",
        question: "📚 Are there worksheets?",
        answer: "Yes, each cycle includes worksheets to help you apply the principles to your life."
    },
    {
        category: "content",
        question: "📖 What is Cycle 1 about?",
        answer: "Cycle 1 teaches 'Pay Yourself First' - setting aside a portion before anything else."
    },
    {
        category: "content",
        question: "📚 What is Cycle 2 about?",
        answer: "Cycle 2 teaches 'Control Your Spending' - distinguishing needs from wants."
    },
    {
        category: "content",
        question: "📖 What is Cycle 3 about?",
        answer: "Cycle 3 teaches 'Make Your Money Work' - letting consistency compound over time."
    },
    {
        category: "content",
        question: "📚 What is Cycle 4 about?",
        answer: "Cycle 4 teaches 'Protect Your Wealth' - avoiding get-rich-quick schemes."
    },
    {
        category: "content",
        question: "📖 What is Cycle 5 about?",
        answer: "Cycle 5 teaches 'Own Your Own Home' - building assets, not just renting."
    },
    {
        category: "content",
        question: "📚 What is Cycle 6 about?",
        answer: "Cycle 6 teaches 'Secure Your Future' - preparing for emergencies and retirement.",
    },
    {
        category: "technical",
        question: "🔧 What if the website isn't loading?",
        answer: "Try refreshing the page, clearing your browser cache, or using a different browser."
    },
    {
        category: "technical",
        question: "📱 Is there a mobile app?",
        answer: "Our platform is web-based and mobile-responsive. You can access it from any device with a browser."
    },
    {
        category: "technical",
        question: "🔧 What browsers are supported?",
        answer: "Chrome, Firefox, Safari, Edge - latest versions of all major browsers."
    },
    {
        category: "technical",
        question: "📱 Can I use TheSpark on iPhone?",
        answer: "Yes, TheSpark works perfectly on iPhone, iPad, and all iOS devices."
    },
    {
        category: "technical",
        question: "🔧 Can I use TheSpark on Android?",
        answer: "Yes, TheSpark works perfectly on all Android phones and tablets."
    },
    {
        category: "technical",
        question: "📱 What if I lose my phone?",
        answer: "You can log into your account from any device using your email and password."
    },
    {
        category: "technical",
        question: "🔧 What if I don't receive OTP?",
        answer: "Check your network connection. If the issue persists, contact support for assistance."
    },
    {
        category: "technical",
        question: "📱 What if my dashboard isn't updating?",
        answer: "Try refreshing the page. If the issue continues, clear your browser cache."
    },
    {
        category: "technical",
        question: "🔧 What if I see an error message?",
        answer: "Take a screenshot and send it to support@thespark.money with a description of what happened."
    },
    {
        category: "technical",
        question: "📱 Can I use TheSpark offline?",
        answer: "An internet connection is required to access your dashboard and track progress."
    },
    {
        category: "technical",
        question: "🔧 How much data does TheSpark use?",
        answer: "Very little. TheSpark is lightweight and uses minimal data for daily tracking."
    },
    {
        category: "technical",
        question: "📱 Will TheSpark drain my battery?",
        answer: "No, TheSpark is optimized for low battery usage when accessed via mobile browser."
    },
    {
        category: "technical",
        question: "🔧 What if I get locked out?",
        answer: "Use 'Forgot Password' to reset or contact support for help recovering access."
    },
    {
        category: "technical",
        question: "📱 Can I use multiple browsers?",
        answer: "Yes, you can access your account from any browser. Your progress syncs automatically."
    },
    {
        category: "technical",
        question: "🔧 What if I have a technical issue not listed?",
        answer: "Contact support@thespark.money. Our team will investigate and resolve the issue promptly.",
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Filter FAQs based on search term AND category
    const getFilteredFaqs = () => {
        let filtered = faqs;
        
        // Filter by category
        if (activeCategory !== 'all') {
            filtered = filtered.filter(faq => faq.category === activeCategory);
        }
        
        // Filter by search term
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(faq =>
                faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return filtered;
    };

    const filteredFaqs = getFilteredFaqs();

    // Category button click handler
    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        setSearchTerm(''); // Clear search when changing category
        setOpenIndex(null); // Close all open FAQs
    };

    return (
        <div className="bg-gradient-to-br from-spark-50 via-white to-spark-50 min-h-screen">
            {/* <HeaderMissionCard /> */}
            
            {/* FULL WIDTH HERO SECTION WITH IMAGE */}
            <div className="relative h-[400px] sm:h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        // src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=250&q=80"
                        // src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop" 
                          src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=500&fit=crop"             
                        alt="Frequently Asked Questions"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                        <div className="text-6xl animate-pulse">❓</div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Frequently Asked Questions</h1>
                    <div className="w-24 h-1 bg-spark-500 mx-auto rounded-full mb-6"></div>
                    <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                        Everything you need to know about TheSpark — your wealth-building accountability platform
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
                
                {/* Search Bar Section with Icon */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="text-3xl">🔍</div>
                        <h2 className="text-xl font-bold text-gray-800">Find Your Answer Quickly</h2>
                    </div>
                    <input
                        type="text"
                        placeholder="Search 120+ questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-spark-500 focus:ring-2 focus:ring-spark-200 transition"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                        📚 {filteredFaqs.length} of {faqs.length} questions shown
                    </p>
                </div>
                
                {/* Category Quick Links - NOW WORKING! */}
                <div className="flex flex-wrap gap-2 justify-center mb-10">
                    <button 
                        onClick={() => handleCategoryClick('all')} 
                        className={`px-4 py-2 rounded-full text-sm shadow-sm transition ${activeCategory === 'all' ? 'bg-gradient-to-r from-spark-500 to-spark-600 text-white' : 'bg-white text-gray-600 hover:bg-spark-100'}`}
                    >
                        ✨ All Questions
                    </button>
                    <button 
                        onClick={() => handleCategoryClick('general')} 
                        className={`px-4 py-2 rounded-full text-sm shadow-sm transition ${activeCategory === 'general' ? 'bg-gradient-to-r from-spark-500 to-spark-600 text-white' : 'bg-white text-gray-600 hover:bg-spark-100'}`}
                    >
                        📌 General
                    </button>
                    <button 
                        onClick={() => handleCategoryClick('how-it-works')} 
                        className={`px-4 py-2 rounded-full text-sm shadow-sm transition ${activeCategory === 'how-it-works' ? 'bg-gradient-to-r from-spark-500 to-spark-600 text-white' : 'bg-white text-gray-600 hover:bg-spark-100'}`}
                    >
                        ⚙️ How It Works
                    </button>
                    <button 
                        onClick={() => handleCategoryClick('premium')} 
                        className={`px-4 py-2 rounded-full text-sm shadow-sm transition ${activeCategory === 'premium' ? 'bg-gradient-to-r from-spark-500 to-spark-600 text-white' : 'bg-white text-gray-600 hover:bg-spark-100'}`}
                    >
                        ⭐ Premium Plans
                    </button>
                    <button 
                        onClick={() => handleCategoryClick('referral')} 
                        className={`px-4 py-2 rounded-full text-sm shadow-sm transition ${activeCategory === 'referral' ? 'bg-gradient-to-r from-spark-500 to-spark-600 text-white' : 'bg-white text-gray-600 hover:bg-spark-100'}`}
                    >
                        👥 Referrals
                    </button>
                    <button 
                        onClick={() => handleCategoryClick('account')} 
                        className={`px-4 py-2 rounded-full text-sm shadow-sm transition ${activeCategory === 'account' ? 'bg-gradient-to-r from-spark-500 to-spark-600 text-white' : 'bg-white text-gray-600 hover:bg-spark-100'}`}
                    >
                        🔐 Account
                    </button>
                    <button 
                        onClick={() => handleCategoryClick('support')} 
                        className={`px-4 py-2 rounded-full text-sm shadow-sm transition ${activeCategory === 'support' ? 'bg-gradient-to-r from-spark-500 to-spark-600 text-white' : 'bg-white text-gray-600 hover:bg-spark-100'}`}
                    >
                        📞 Support
                    </button>
                    <button 
                        onClick={() => handleCategoryClick('graduation')} 
                        className={`px-4 py-2 rounded-full text-sm shadow-sm transition ${activeCategory === 'graduation' ? 'bg-gradient-to-r from-spark-500 to-spark-600 text-white' : 'bg-white text-gray-600 hover:bg-spark-100'}`}
                    >
                        🎓 Graduation
                    </button>
                    <button 
                        onClick={() => handleCategoryClick('community')} 
                        className={`px-4 py-2 rounded-full text-sm shadow-sm transition ${activeCategory === 'community' ? 'bg-gradient-to-r from-spark-500 to-spark-600 text-white' : 'bg-white text-gray-600 hover:bg-spark-100'}`}
                    >
                        👥 Community
                    </button>
                    <button 
                        onClick={() => handleCategoryClick('content')} 
                        className={`px-4 py-2 rounded-full text-sm shadow-sm transition ${activeCategory === 'content' ? 'bg-gradient-to-r from-spark-500 to-spark-600 text-white' : 'bg-white text-gray-600 hover:bg-spark-100'}`}
                    >
                        📚 Content
                    </button>
                    <button 
                        onClick={() => handleCategoryClick('technical')} 
                        className={`px-4 py-2 rounded-full text-sm shadow-sm transition ${activeCategory === 'technical' ? 'bg-gradient-to-r from-spark-500 to-spark-600 text-white' : 'bg-white text-gray-600 hover:bg-spark-100'}`}
                    >
                        🔧 Technical
                    </button>
                </div>
                
                {/* Active Category Indicator */}
                <div className="text-center mb-6">
                    <p className="text-sm text-gray-500">
                        {activeCategory === 'all' ? 'Showing all questions' : `Showing ${activeCategory.replace('-', ' ')} questions`}
                        {searchTerm && ` • filtered by "${searchTerm}"`}
                    </p>
                </div>
                
                {/* FAQ Accordion */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {filteredFaqs.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">🔍</div>
                            <p className="text-gray-500 text-lg">No matching questions found.</p>
                            <p className="text-gray-400 text-sm mt-2">Try a different search term or browse categories.</p>
                            <button onClick={() => { setActiveCategory('all'); setSearchTerm(''); }} className="mt-4 px-6 py-2 bg-spark-500 text-white rounded-full text-sm hover:bg-spark-600 transition">
                                Show All Questions
                            </button>
                        </div>
                    ) : (
                        filteredFaqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full text-left py-5 px-6 flex justify-between items-center"
                                >
                                    <span className="font-semibold text-gray-800 text-base">{faq.question}</span>
                                    <span className={`text-spark-500 text-2xl font-bold ml-4 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                                        {openIndex === index ? '−' : '+'}
                                    </span>
                                </button>
                                {openIndex === index && (
                                    <div className="pb-5 px-6 text-gray-600 text-sm leading-relaxed whitespace-pre-line border-t border-gray-100 bg-gray-50">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
                
                {/* Premium Plans CTA - Beautiful Card */}
                <div className="text-center mt-10">
                    <div className="bg-gradient-to-r from-spark-50 to-orange-50 rounded-2xl p-8">
                        <div className="text-4xl mb-3">⭐</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to unlock higher goals?</h3>
                        <p className="text-gray-600 mb-4">Premium plans let you set daily goals up to ₦20,000</p>
                        <Link 
                            to="/premium" 
                            className="inline-block bg-gradient-to-r from-spark-500 to-spark-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                            View Premium Plans →
                        </Link>
                    </div>
                </div>
                
                {/* Still Have Questions - Contact Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <div className="bg-gradient-to-br from-spark-100 to-orange-100 rounded-2xl p-6 text-center">
                        <div className="text-5xl mb-3">📞</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Contact Your Coach</h3>
                        <p className="text-gray-600 text-sm mb-4">Every member has a dedicated Coach on WhatsApp</p>
                        <a href="#" className="inline-block bg-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition">
                            Message Your Coach →
                        </a>
                    </div>
                    <div className="bg-gradient-to-br from-spark-100 to-orange-100 rounded-2xl p-6 text-center">
                        <div className="text-5xl mb-3">📧</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Email Support</h3>
                        <p className="text-gray-600 text-sm mb-4">We respond within 24-48 hours</p>
                        <a href="mailto:support@thespark.money" className="inline-block bg-spark-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-spark-700 transition">
                            support@thespark.money →
                        </a>
                    </div>
                </div>
                
                {/* FAQ Stats Footer */}
                <div className="text-center mt-10 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-400">
                        📚 {faqs.length}+ frequently asked questions • Last updated June 2024
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Categories: General | How It Works | Premium Plans | Referrals | Account | Support | Graduation | Community | Content | Technical
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        🔥 Still can't find your answer? Contact your dedicated TheSpark Coach
                    </p>
                </div>
            </div>
        </div>
    );
}