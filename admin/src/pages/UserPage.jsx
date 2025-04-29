import '../styles/panels.css'
import Sidebar from '../components/Bars/SideBar';
import MainContent from '../components/MainContent';
import useAdminData from '../hooks/useAdminData';

const UserPage = () => {
    const adminData = useAdminData();
    return (
        <>
            <div className='op-container'>
                <Sidebar adminData={adminData} activeItem="Users" />
                <MainContent adminData={adminData} currentPage={'UserPage'}/>
            </div>
        </>
    )
};

export default UserPage;