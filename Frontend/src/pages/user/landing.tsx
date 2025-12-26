import { lazy, Suspense } from "react";
import { GuideSection } from "../../components/user/GiudeSection";
import Header from "../../components/user/Header";
import HeroSection from "../../components/user/LandingHeroSection";
const CategorySection = lazy(() => import("../../components/user/CategorySection"));
const PopularServices = lazy(() => import("../../components/user/PopularServices"));
const Footer = lazy(() => import("../../components/common/Footer"));
import Loader from "../../components/common/Loader";

const LandingPage = () => {
    return (
        <>
            <Suspense fallback={<Loader />}>
                <Header />
                <HeroSection />
                <CategorySection />
                <PopularServices />
                <GuideSection />
                <Footer />
            </Suspense>
        </>
    );
};

export default LandingPage;