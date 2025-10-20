import Footer from "../../components/common/Footer";
import CategorySection from "../../components/user/CategorySection";
import { GuideSection } from "../../components/user/GiudeSection";
import Header from "../../components/user/Header";
import HeroSection from "../../components/user/LandingHeroSection";
import PopularServices from "../../components/user/PopularServices";

const LandingPage = () => {
    return (
        <>
            <Header />
            <HeroSection />
            <CategorySection />
            <PopularServices />
            <GuideSection />
            <Footer />
        </>
    );
};

export default LandingPage;