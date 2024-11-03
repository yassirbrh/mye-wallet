import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import TransactionPage from './pages/TransactionPage';
import BeneficiariePage from './pages/BeneficiariePage';
import CreditCardPage from './pages/CreditCardPage';
import AmountDemandPage from './pages/AmountDemandPage';
import ReportPage from './pages/ReportPage';
import MessagePage from './pages/MessagePage';
import AssistancePage from './pages/AssistancePage';
import ProfilePage from './pages/ProfilePage';
import AuthCheck from './auth/AuthCheck';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

const App = () => {
  return (
    <Router>
      <Routes>
        {/*
          Main Pages
        */}
        <Route path="/" element={<MainLayout><AuthCheck><LandingPage /></AuthCheck></MainLayout>} />
        <Route path="/register" element={<MainLayout><AuthCheck><RegisterPage /></AuthCheck></MainLayout>} />
        <Route path="/login" element={<MainLayout><AuthCheck><LoginPage /></AuthCheck></MainLayout>} />
        {/*
          Client Pages
        */}
        <Route path='/overview' element={<DashboardLayout><AuthCheck><OverviewPage/></AuthCheck></DashboardLayout>}/>
        <Route path='/transactions' element={<DashboardLayout><AuthCheck><TransactionPage/></AuthCheck></DashboardLayout>}/>
        <Route path='/beneficiaries' element={<DashboardLayout><AuthCheck><BeneficiariePage/></AuthCheck></DashboardLayout>}/>
        <Route path='/amount-demands' element={<DashboardLayout><AuthCheck><AmountDemandPage/></AuthCheck></DashboardLayout>}/>
        <Route path='/reports' element={<DashboardLayout><AuthCheck><ReportPage/></AuthCheck></DashboardLayout>}/>
        <Route path='/credit-cards' element={<DashboardLayout><AuthCheck><CreditCardPage/></AuthCheck></DashboardLayout>}/>
        <Route path='/messages' element={<DashboardLayout><AuthCheck><MessagePage/></AuthCheck></DashboardLayout>}/>
        <Route path='/assistance' element={<DashboardLayout><AuthCheck><AssistancePage/></AuthCheck></DashboardLayout>}/>
        <Route path='/profile' element={<DashboardLayout><AuthCheck><ProfilePage/></AuthCheck></DashboardLayout>}/>
      </Routes>
    </Router>
  );
};

export default App
