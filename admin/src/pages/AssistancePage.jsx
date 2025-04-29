import '../styles/panels.css'
import Sidebar from '../components/Bars/SideBar';
import MainContent from '../components/MainContent';
import useAdminData from '../hooks/useAdminData';

const AssistancePage = () => {
    const adminData = useAdminData();
    return (
        <>
            <div className='op-container'>
                <Sidebar adminData={adminData} activeItem="Assistance" />
                <MainContent adminData={adminData} currentPage={'AssistancePage'}/>
            </div>
        </>
    )
};

export default AssistancePage;