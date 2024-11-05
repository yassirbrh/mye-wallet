import '../styles/panels.css';
import Sidebar from '../components/Bars/Sidebar';
import MainContent from '../components/MainContent';
import useUserData from '../hooks/useUserData';

const OverviewPage = () => {
    const userData = useUserData();
    return (
        <>
            <Sidebar activeItem="Overview" />
            <MainContent userData={userData} currentPage={'OverviewPage'}/>
        </>
    )
};

export default OverviewPage;