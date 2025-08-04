import Footer from "../../components/common/Footer";
import CategorySection from "../../components/user/CategorySection";
import Header from "../../components/user/Header";
import HomeHeroSection from "../../components/user/HomeHeroSection";

const Home = () => {

  return (
    <>
      <Header />
      <HomeHeroSection />
      <CategorySection />
      <Footer />
    </>
  );
};

export default Home;