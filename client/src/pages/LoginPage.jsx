import '../styles/App.css'
import Header from '../components/MainPages/Header'
import Footer from '../components/MainPages/Footer'
import LoginForm from '../components/Forms/LoginForm'

const LoginPage = () => {
    return (
        <>
            <Header />
            <LoginForm />
            <Footer />
        </>
    )
}

export default LoginPage;