import Footer from "../../components/common/Footer";
import CategorySection from "../../components/user/CategorySection";
import Header from "../../components/user/Header";
import HeroSection from "../../components/user/LandingHeroSection";

const LandingPage = () => {
    return (
        <>
            <Header />
            <HeroSection />
            <CategorySection />
            <Footer />
        </>
    );
};

export default LandingPage;