import '../styles/panels.css';
import Sidebar from '../components/Bars/Sidebar';
import MainContent from '../components/MainContent';
import useUserData from '../hooks/useUserData';

const TransactionPage = () => {
    const userData = useUserData();
    return (
        <>
            <Sidebar activeItem="Transactions" />
            <MainContent userData={userData} currentPage={'TransactionPage'}/>
        </>
    )
};

export default TransactionPage;