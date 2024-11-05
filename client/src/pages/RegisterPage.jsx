import '../styles/App.css'
import Header from '../components/MainPages/Header'
import Footer from '../components/MainPages/Footer'
import RegisterForm from '../components/Forms/RegisterForm'

const RegisterPage = () => {
    return (
        <>
            <Header />
            <RegisterForm />
            <Footer />
        </>
    )
}

export default RegisterPage;