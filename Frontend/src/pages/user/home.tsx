import { lazy, Suspense } from "react";

import Loader from "../../components/common/Loader";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../components/common/ErrorFallback";
const Header = lazy(() => import("../../components/user/Header"));
const HomeHeroSection = lazy(() => import("../../components/user/HomeHeroSection"));
const CategorySection = lazy(() => import("../../components/user/CategorySection"));
const PopularProjects = lazy(() => import("../../components/user/PopularServices"));
const GuideSection = lazy(() => import("../../components/user/GiudeSection").then((module) => ({ default: module.GuideSection })));
const Footer = lazy(() => import("../../components/common/Footer"));

const Home = () => {
  return (
    <>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        <Suspense fallback={<Loader />}>
          <Header />
          <HomeHeroSection />
          <CategorySection />
          <PopularProjects />
          <GuideSection />
          <Footer />
        </Suspense>
      </ErrorBoundary>

    </>
  );
};

export default Home;