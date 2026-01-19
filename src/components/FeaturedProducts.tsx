import { products } from '@/data/products';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function FeaturedProducts() {
  const featuredProducts = products.slice(0, 6);

  return (
    <section className="py-16 bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-serif mb-4">
            Featured Collection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our most loved pieces, handpicked for comfort and style
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <div className="container mt-12 flex justify-center">
        <Link to="/shop">
          <Button size="lg" className="text-lg px-8  bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-colors">
            View all Products
          </Button>
        </Link>
      </div>
    </section>
  );
}
