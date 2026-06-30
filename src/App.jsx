// import React, { useEffect, useState } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider, useAuth } from './contexts/AuthContext';
// import Layout from './components/Layout/Layout';
// import Home from './pages/Home';
// import HowItWorks from './pages/HowItWorks';
// import The7Rules from './pages/The7Rules';
// import SuccessStories from './pages/SuccessStories';
// import FAQ from './pages/FAQ';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import AdminDashboard from './pages/AdminDashboard';
// import Graduation from './pages/Graduation';
// import PremiumPlans from './pages/PremiumPlans';
// import HybridLending from './pages/HybridLending';
// import PrivateRoute from './components/PrivateRoute';
// import AdminRoute from './components/AdminRoute';
// import AdminManagement from './pages/AdminManagement';
// import NotificationPermission from './components/Dashboard/NotificationPermission';
// import PWAInstall from './components/PWAInstall';
// import Profile from './pages/Profile';
// import Transactions from './pages/Transactions';
// import Referral from './pages/Referral';
// import Privacy from './pages/Privacy';
// import Terms from './pages/Terms';

// function AppContent() {
//     const { user, loading } = useAuth();
    
//     if (loading) {
//         return (
//             <div className="flex-center h-screen">
//                 <div className="spinner"></div>
//             </div>
//         );
//     }
    
//     return (
//         <Layout>
//             <Routes>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/how-it-works" element={<HowItWorks />} />
//                 <Route path="/7-rules" element={<The7Rules />} />
//                 <Route path="/success-stories" element={<SuccessStories />} />  {/* ADD THIS LINE */}
//                 <Route path="/faq" element={<FAQ />} />  {/* ADD THIS LINE */}
//                 <Route path="/referral" element={<Referral />} />
//                 <Route path="/privacy" element={<Privacy />} />
//                 <Route path="/terms" element={<Terms />} />
//                 <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
//                 <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
//                 <Route path="/dashboard" element={
//                     <PrivateRoute>
//                         <Dashboard />
//                     </PrivateRoute>
//                 } />
//                 <Route path="/graduation" element={
//                     <PrivateRoute>
//                         <Graduation />
//                     </PrivateRoute>
//                 } />
//                 <Route path="/premium" element={
//                     <PrivateRoute>
//                         <PremiumPlans />
//                     </PrivateRoute>
//                 } />
//                 <Route path="/admin" element={
//                     <AdminRoute>
//                         <AdminDashboard />
//                     </AdminRoute>
//                 } />
//                 <Route path="/hybrid-lending" element={
//                     <AdminRoute>
//                         <HybridLending />
//                     </AdminRoute>
//                 } />
//                 <Route path="/admin-management" element={
//                     <AdminRoute>
//                         <AdminManagement />
//                     </AdminRoute>
//                 } />
//                 <Route path="/profile" element={
//                     <PrivateRoute>
//                         <Profile />
//                     </PrivateRoute>
//                 } />
//                 <Route path="/transactions" element={
//                     <PrivateRoute>
//                         <Transactions />
//                     </PrivateRoute>
//                 } />
//             </Routes>
//             <Toaster position="top-center" />
//             <NotificationPermission />
//             <PWAInstall />
//         </Layout>
//     );
// }

// function App() {
//     return (
//         <AuthProvider>
//             <AppContent />
//         </AuthProvider>
//     );
// }

// export default App;
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationModalProvider } from './contexts/NotificationModalContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import The7Rules from './pages/The7Rules';
import SuccessStories from './pages/SuccessStories';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Graduation from './pages/Graduation';
import PremiumPlans from './pages/PremiumPlans';
import HybridLending from './pages/HybridLending';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminManagement from './pages/AdminManagement';
import NotificationPermission from './components/Dashboard/NotificationPermission';
import PWAInstall from './components/PWAInstall';
import Profile from './pages/Profile';
import Transactions from './pages/Transactions';
import Referral from './pages/Referral';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import BvnCollection from './components/BvnCollection';
import BankAccountPage from './pages/BankAccountPage';
import Investor from './pages/thesparkprivateinvestment';
import Marketplace from './pages/Marketplace';
import Orders from './pages/Marketplace/Orders';
import SellProduct from './pages/Marketplace/Sell';  // ✅ Import SellProduct
import LogoDesigner from './pages/LogoDesigner';
import AdminStockPhone from './components/Admin/AdminStockPhone';

// BVN Protection Route Component
function BvnProtectedRoute({ children }) {
    const { userData, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="flex-center h-screen">
                <div className="spinner"></div>
            </div>
        );
    }
    
    // If user doesn't have BVN, redirect to BVN collection
    if (!userData?.bvn && userData?.role !== 'admin') {
        return <BvnCollection />;
    }
    
    return children;
}

function AppContent() {
    const { user, loading, userData } = useAuth();
    
    if (loading) {
        return (
            <div className="flex-center h-screen">
                <div className="spinner"></div>
            </div>
        );
    }
    
    return (
        <NotificationModalProvider>
            <Layout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/thespark/private/investor" element={<Investor />} />
                    <Route path="/7-rules" element={<The7Rules />} />
                    <Route path="/success-stories" element={<SuccessStories />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/referral" element={<Referral />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    
                    {/* Marketplace Routes */}
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/marketplace/sell" element={
                        <PrivateRoute>
                            <BvnProtectedRoute>
                                <SellProduct />
                            </BvnProtectedRoute>
                        </PrivateRoute>
                    } />
                    
                    {/* Protected Routes */}
                    <Route path="/orders" element={
                        <PrivateRoute>
                            <BvnProtectedRoute>
                                <Orders />
                            </BvnProtectedRoute>
                        </PrivateRoute>
                    } />
                    
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <BvnProtectedRoute>
                                <Dashboard />
                            </BvnProtectedRoute>
                        </PrivateRoute>
                    } />
                    
                    <Route path="/graduation" element={
                        <PrivateRoute>
                            <BvnProtectedRoute>
                                <Graduation />
                            </BvnProtectedRoute>
                        </PrivateRoute>
                    } />
                    
                    <Route path="/premium" element={
                        <PrivateRoute>
                            <BvnProtectedRoute>
                                <PremiumPlans />
                            </BvnProtectedRoute>
                        </PrivateRoute>
                    } />
                    
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <BvnProtectedRoute>
                                <Profile />
                            </BvnProtectedRoute>
                        </PrivateRoute>
                    } />
                    
                    <Route path="/transactions" element={
                        <PrivateRoute>
                            <BvnProtectedRoute>
                                <Transactions />
                            </BvnProtectedRoute>
                        </PrivateRoute>
                    } />
                    
                    <Route path="/bank-account" element={
                        <PrivateRoute>
                            <BvnProtectedRoute>
                                <BankAccountPage />
                            </BvnProtectedRoute>
                        </PrivateRoute>
                    } />

                        {/* ✅ Logo Designer Route - Protected & BVN Verified */}
                    <Route path="/logo-designer" element={
                        <PrivateRoute>
                            <BvnProtectedRoute>
                                <LogoDesigner />
                            </BvnProtectedRoute>
                        </PrivateRoute>
                    } />

                    <Route 
                        path="/AdminStockPhone" 
                        element={
                            <PrivateRoute>
                                 <BvnProtectedRoute>
                                   <AdminStockPhone />
                                </BvnProtectedRoute>
                          </PrivateRoute>
                        } 
                    />
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
                    <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    } />
                    
                    <Route path="/hybrid-lending" element={
                        <AdminRoute>
                            <HybridLending />
                        </AdminRoute>
                    } />
                    
                    <Route path="/admin-management" element={
                        <AdminRoute>
                            <AdminManagement />
                        </AdminRoute>
                    } />
                </Routes>
                <Toaster position="top-center" />
                <NotificationPermission />
                <PWAInstall />
            </Layout>
        </NotificationModalProvider>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;