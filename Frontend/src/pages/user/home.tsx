import Footer from "../../components/common/Footer";
import Header from "../../components/user/Header";
import HomeHeroSection from "../../components/user/HomeHeroSection";

const Home = () => {

  return (
    <>
      <Header isLogged={true} />
      <HomeHeroSection />
      <Footer />
    </>
  );
};

export default Home;