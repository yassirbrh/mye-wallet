import '../styles/panels.css'
import Sidebar from '../components/Bars/SideBar';
import MainContent from '../components/MainContent';
import useAdminData from '../hooks/useAdminData';

const ReportPage = () => {
    const adminData = useAdminData();
    return (
        <>
            <div className='op-container'>
                <Sidebar adminData={adminData} activeItem="Reports" />
                <MainContent adminData={adminData} currentPage={'ReportPage'}/>
            </div>
        </>
    )
};

export default ReportPage;