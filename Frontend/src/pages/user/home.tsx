import Footer from "../../components/common/Footer";
import CategorySection from "../../components/user/CategorySection";
import { GuideSection } from "../../components/user/GiudeSection";
import Header from "../../components/user/Header";
import HomeHeroSection from "../../components/user/HomeHeroSection";
import PopularProjects from "../../components/user/PopularServices";

const Home = () => {
  return (
    <>
      <Header />
      <HomeHeroSection />
      <CategorySection />
      <PopularProjects />
      <GuideSection />
      <Footer />
    </>
  );
};

export default Home;