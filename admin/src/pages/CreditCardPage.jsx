import '../styles/panels.css'
import Sidebar from '../components/Bars/SideBar';
import MainContent from '../components/MainContent';
import useAdminData from '../hooks/useAdminData';

const CreditCardPage = () => {
    const adminData = useAdminData();
    return (
        <>
            <div className='op-container'>
                <Sidebar adminData={adminData} activeItem="Credit Cards" />
                <MainContent adminData={adminData} currentPage={'CreditCardPage'}/>
            </div>
        </>
    )
};

export default CreditCardPage;