import axios from 'axios';
import Topbar from './Bars/TopBar';
import ProfileInfo from './ProfilePage/ProfileInfo';
import OverviewDashboard from './OverviewPage/OverviewDashboard';
import OverviewCards from './OverviewPage/OverviewCards'
import AdminOverview from './AdminPage/AdminOverview';
import UserOverview from './UserPage/UserOverview';
import AmountDemandOverview from './AmountDemandPage/AmountDemandOverview';
import ReportOverview from './ReportPage/ReportOverview';
import ManagePendingCreditCards from './CreditCardPage/ManagePendingCreditCards';
import AssistanceRequestManager from './AssistancePage/AssistanceRequestManager';

const MainContent = ({ adminData, currentPage }) => {
    return (
        <>
            <div className='main-content'>
                <Topbar adminData={adminData}/>
                {currentPage === 'OverviewPage' ? (
                    <>
                        <div style={{ padding: "20px" }}>
                            <OverviewDashboard />
                            <OverviewCards />
                        </div>
                    </>
                ): currentPage === 'ProfilePage' ? (
                    <>
                        <ProfileInfo adminData={adminData}/>
                    </>
                ): currentPage === 'AdminPage' ? (
                    <>
                        <AdminOverview />
                    </>
                ): currentPage === 'UserPage' ? (
                    <>
                        <UserOverview />
                    </>
                ): currentPage === 'AmountDemandPage' ? (
                    <>
                        <AmountDemandOverview />
                    </>
                ): currentPage === 'ReportPage' ? (
                    <>
                        <ReportOverview />
                    </>
                ): currentPage === 'CreditCardPage' ? (
                    <>
                        <ManagePendingCreditCards />
                    </>
                ): currentPage === 'AssistancePage' ? (
                    <>
                        <AssistanceRequestManager />
                    </>
                ): null}
            </div>
        </>
    )
};

export default MainContent