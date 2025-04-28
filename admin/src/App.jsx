import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OverviewPage from './pages/OverviewPage';
import AuthCheck from './auth/AuthCheck';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import AmountDemandPage from './pages/AmountDemandPage';
import ReportPage from './pages/ReportPage';
import CreditCardPage from './pages/CreditCardPage';
import AssistancePage from './pages/AssistancePage';


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<AuthCheck><LandingPage /></AuthCheck>}/>
          <Route path='/overview' element={<AuthCheck><OverviewPage /></AuthCheck>} />
          <Route path='/profile' element={<AuthCheck><ProfilePage /></AuthCheck>} />
          <Route path='/manage-admins' element={<AuthCheck><AdminPage /></AuthCheck>}/>
          <Route path='/users' element={<AuthCheck><UserPage /></AuthCheck>}/>
          <Route path='/amount-demands' element={<AuthCheck><AmountDemandPage /></AuthCheck>}/>
          <Route path='/reports' element={<AuthCheck><ReportPage /></AuthCheck>}/>
          <Route path='/credit-cards' element={<AuthCheck><CreditCardPage /></AuthCheck>}/>
          <Route path='/assistance' element={<AuthCheck><AssistancePage /></AuthCheck>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
