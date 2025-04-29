import '../styles/panels.css'
import Sidebar from '../components/Bars/SideBar';
import MainContent from '../components/MainContent';
import useAdminData from '../hooks/useAdminData';

const OverviewPage = () => {
    const adminData = useAdminData();
    return (
        <>
            <div className='op-container'>
                <Sidebar adminData={adminData} activeItem="Overview" />
                <MainContent adminData={adminData} currentPage={'OverviewPage'}/>
            </div>
        </>
    )
};

export default OverviewPage;