import Footer from "../../components/common/Footer";
import Header from "../../components/user/Header";
import HeroSection from "../../components/user/LandingHeroSection";

const LandingPage = () => {
    return (
        <>
            <Header isLogged={false} />
            <HeroSection />
            <Footer />
        </>
    );
};

export default LandingPage;