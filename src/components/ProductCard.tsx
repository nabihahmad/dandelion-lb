import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [outOfStockSizeClicked, setOutOfStockSizeClicked] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const sizeTextClass =
    product.category === 'zippers'
      ? 'text-s md:text-xs'
      : product.category === 'onesies'
      ? 'text-xs md:text-[0.65rem]'
      : 'text-s md:text-xs';

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
    setSelectedSize(null);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link
        to={`/product/${product.id}`}
        className="block"
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={`https://cdn.jsdelivr.net/gh/nabihahmad/dandelion-lb-products@master/images${product.image}`}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge
            className="absolute top-2 left-2"
            variant={product.category === 'onesies' ? 'default' : 'secondary'}
          >
            {product.category}
          </Badge >
          {product.bestSeller && (
          <Badge className='absolute top-2 right-2' variant="highlight">
            best-seller
          </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-1 md:min-h-[3.5rem] md:leading-snug">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {product.description}
        </p>
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

        <div className="space-y-3">
          {product.inStock ? (
          <div>
            <p className={`${sizeTextClass} text-muted-foreground mb-2`}>Select Size:</p>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((size) => {
                const isOutOfStock = product.outOfStockSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => {
                      if (isOutOfStock) {
                        setOutOfStockSizeClicked(size);
                        setTimeout(() => setOutOfStockSizeClicked(null), 2000);
                      } else {
                        setSelectedSize(size);
                        setOutOfStockSizeClicked(null);
                      }
                    }}
                    className={`px-1 py-1 ${sizeTextClass} rounded border transition-colors ${
                      isOutOfStock
                        ? 'bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50 line-through'
                        : selectedSize === size
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-foreground border-border hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {outOfStockSizeClicked && (
              <p className="text-xs text-destructive mt-2">
                Size {outOfStockSizeClicked} is out of stock
              </p>
            )}
          </div>
          ) : (<div></div>)}
          <Button
            onClick={handleAddToCart}
            className="w-full"
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
