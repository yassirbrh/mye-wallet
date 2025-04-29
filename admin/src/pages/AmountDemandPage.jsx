import '../styles/panels.css'
import Sidebar from '../components/Bars/SideBar';
import MainContent from '../components/MainContent';
import useAdminData from '../hooks/useAdminData';

const AdminPage = () => {
    const adminData = useAdminData();
    return (
        <>
            <div className='op-container'>
                <Sidebar adminData={adminData} activeItem="Amount Demands" />
                <MainContent adminData={adminData} currentPage={'AmountDemandPage'}/>
            </div>
        </>
    )
};

export default AdminPage;