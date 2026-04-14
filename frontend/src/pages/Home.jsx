import HeroSection      from "../components/HomePage/HeroSection";
import Categories       from "../components/HomePage/Categories";
import BarkatPicks      from "../components/HomePage/BarkatPicks";
import FreshArrivals    from "../components/HomePage/FreshArrivals";
import RecipeSpotlight  from "../components/HomePage/RecipeSpotlight";
import TrustStrip       from "../components/HomePage/TrustStrip";
import FooterCTA        from "../components/HomePage/FooterHome";

const Home = () => {
  return (
    <div className="mt-8 mb-8">
      <HeroSection />
      <Categories />
      <BarkatPicks />       {/* discounted products horizontal scroll */}
      <FreshArrivals />     {/* all products with category tabs */}
      <RecipeSpotlight />   {/* community + mealdb recipes */}
      <TrustStrip />
      <FooterCTA />
    </div>
  );
};

export default Home;