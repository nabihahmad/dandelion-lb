import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import WhyChooseUs from '@/components/WhyChooseUs';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedProducts />
        <WhyChooseUs />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
