import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { CartItem, Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { config } from '@/env';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [outOfStockSizeClicked, setOutOfStockSizeClicked] = useState<string | null>(null);
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const { items, addToCart } = useCart();
  const { toast } = useToast();
  const whatsappNumber = config.whatsappNumber;
  const sizeTextClass =
    product.category === 'zippers'
      ? 'text-s md:text-xs'
      : product.category === 'onesies'
      ? 'text-xs md:text-[0.65rem]'
      : 'text-s md:text-xs';

  const nextCartItems: CartItem[] = selectedSize
    ? (() => {
        const existingItem = items.find(
          (item) => item.product.id === product.id && item.size === selectedSize
        );

        if (existingItem) {
          return items.map((item) =>
            item.product.id === product.id && item.size === selectedSize
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...items, { product, size: selectedSize, quantity: 1 }];
      })()
    : items;

  const nextCartTotal = nextCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const buildWhatsAppMessage = (cartItems: CartItem[]) => {
    let message = 'Hi! I would like to order:\n\n';

    cartItems.forEach((item) => {
      message += `• ${item.product.name} (Size: ${item.size}) x${item.quantity} - $${(
        item.product.price * item.quantity
      ).toFixed(2)}\n`;
    });

    message += `\nTotal: $${cartItems
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      .toFixed(2)}`;

    return encodeURIComponent(message);
  };

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

  const handleAddToCartAndKeepShopping = () => {
    if (!selectedSize) {
      toast({
        title: 'Please select a size',
        description: 'Choose a size before ordering via WhatsApp',
        variant: 'destructive',
      });
      return;
    }

    addToCart(product, selectedSize);
    toast({
      title: 'Added to cart!',
      description: `${product.name} (${selectedSize}) added to your cart`,
    });
    setWhatsappDialogOpen(false);
    setSelectedSize(null);
  };

  const handleOrderViaWhatsApp = () => {
    if (!selectedSize) {
      toast({
        title: 'Please select a size',
        description: 'Choose a size before ordering via WhatsApp',
        variant: 'destructive',
      });
      return;
    }

    addToCart(product, selectedSize);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage(nextCartItems)}`;
    setWhatsappDialogOpen(false);
    setSelectedSize(null);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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
            <ShoppingCart className="h-4 w-4" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          <Button
            onClick={() => {
              if (!selectedSize) {
                toast({
                  title: 'Please select a size',
                  description: 'Choose a size before ordering via WhatsApp',
                  variant: 'destructive',
                });
                return;
              }

              setWhatsappDialogOpen(true);
            }}
            className="w-full gap-2 bg-[hsl(142_70%_45%)] hover:bg-[hsl(142_70%_40%)] text-primary-foreground"
            disabled={!product.inStock}
          >
            <MessageCircle className="h-4 w-4" />
            Order via WhatsApp
          </Button>
        </div>
      </CardContent>

      <Dialog open={whatsappDialogOpen} onOpenChange={setWhatsappDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Order via WhatsApp</DialogTitle>
            <DialogDescription>
              Review the cart below. You can keep shopping, or send the updated cart to WhatsApp now.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h4 className="font-medium text-foreground">Cart preview</h4>
                <span className="text-sm text-muted-foreground">
                  {nextCartItems.length} item{nextCartItems.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
                {nextCartItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Your cart is empty.</p>
                ) : (
                  nextCartItems.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="flex items-center justify-between gap-3 rounded-md bg-background px-3 py-2"
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-foreground">x{item.quantity}</p>
                        <p className="text-sm font-medium text-primary">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-semibold text-primary">${nextCartTotal.toFixed(2)}</span>
              </div>
            </div>

            {selectedSize && (
              <div className="rounded-lg border border-dashed border-border p-4">
                <p className="text-sm font-medium text-foreground">Selected item</p>
                <p className="text-sm text-muted-foreground">
                  {product.name} - Size {selectedSize}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleAddToCartAndKeepShopping}>
              <ShoppingCart className="h-4 w-4" />
              Add to cart and keep shopping
            </Button>
            <Button
              onClick={handleOrderViaWhatsApp}
              className="gap-2 bg-[hsl(142_70%_45%)] hover:bg-[hsl(142_70%_40%)] text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              Order now on WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
