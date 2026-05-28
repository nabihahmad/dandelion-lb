import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { config } from '@/env';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Product not found
            </h1>
            <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // For demo, we'll create multiple images from the same source
  // In production, each product would have an array of images
  const productImages = product.images;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: 'Please select a size',
        description: 'Choose a size before adding to cart',
        variant: 'destructive',
      });
      return;
    }
    addToCart(product, selectedSize);
    toast({
      title: 'Added to cart!',
      description: `${product.name} (${selectedSize}) added to your cart`,
    });
  };

  const whatsappNumber = config.whatsappNumber;
  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in: ${product.name} - $${product.price.toFixed(2)}`
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-6xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Carousel */}
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {productImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                        <img
                          src={`https://cdn.jsdelivr.net/gh/nabihahmad/dandelion-lb-products@master/images/${image}`}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>

              {/* Sizes Guide */}
                <div className="mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowSizeGuide(true)}
                  className="w-full"
                >
                  View Size Guide
                </Button>
                </div>

                {/* Size Guide Overlay */}
                {showSizeGuide && (
                <div
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                  onClick={() => setShowSizeGuide(false)}
                >
                    <div
                    className="bg-background rounded-lg w-fit max-w-[90vw]"
                    onClick={(e) => e.stopPropagation()}
                    >
                    <img
                    src={new URL(
                      `../assets/sizes/${
                      product.category === 'zippers'
                        ? 'zippers-portrait.jpg'
                        : product.sleeve === 'sleeveless'
                        ? 'overall-no-sleeves-portrait.jpg'
                        : product.sleeve === 'short'
                        ? 'overall-short-sleeves-portrait.jpg'
                        : 'overall-long-sleeves-portrait.jpg'
                      }`,
                      import.meta.url
                    ).href}
                    alt="Size Guide"
                    className="block w-auto max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
                    />
                    <Button
                    variant="ghost"
                    onClick={() => setShowSizeGuide(false)}
                    className="w-full mt-4"
                    >
                    Close
                    </Button>
                    </div>
                </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-3 flex items-center gap-2">
                <Badge
                  className="w-fit"
                  variant={product.category === 'onesies' ? 'default' : 'secondary'}
                >
                  {product.category}
                </Badge>

                {product.bestSeller && (
                  <Badge className="w-fit" variant="highlight">
                    best-seller
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-serif mb-2">
                {product.name}
              </h1>

                <div className="mb-3 flex items-center gap-2">
                {product.originalPrice && (
                  <p className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                  </p>
                )}
                <p className="text-lg font-bold text-primary">
                  ${product.price.toFixed(2)}
                </p>
                </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card text-foreground border-border hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <span className="text-sm text-primary font-medium">
                    ✓ In Stock
                  </span>
                ) : (
                  <span className="text-sm text-destructive font-medium">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full text-lg"
                  disabled={!product.inStock}
                >
                  Add to Cart
                </Button>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-2 text-lg"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Ask on WhatsApp
                  </Button>
                </a>
              </div>
            </div>
            {/* Similar Products */}
            {product.similarProducts?.some((id) => products.some((p) => p.id === id)) && (
              <div className="md:col-span-2 mt-12 pt-8 border-t">
              <h2 className="text-2xl font-bold text-foreground mb-6">Similar Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                .filter((p: typeof products[0]) => product.similarProducts?.includes(p.id))
                .map((similarProduct) => (
                  <button
                  key={similarProduct.id}
                  onClick={() => navigate(`/product/${similarProduct.id}`)}
                  className="group text-left"
                  >
                  <div className="aspect-square overflow-hidden rounded-lg bg-muted mb-3">
                    <img
                    src={`https://cdn.jsdelivr.net/gh/nabihahmad/dandelion-lb-products@master/images/${similarProduct.image}`}
                    alt={similarProduct.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {similarProduct.name}
                  </h3>
                    <div className="mb-3 flex items-center gap-2">
                    {similarProduct.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                      ${similarProduct.originalPrice.toFixed(2)}
                      </p>
                    )}
                    <p className="text-sm font-bold text-primary">
                      ${similarProduct.price.toFixed(2)}
                    </p>
                    </div>
                  </button>
                ))}
              </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
