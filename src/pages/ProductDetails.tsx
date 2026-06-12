import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { CartItem } from '@/types/product';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { ArrowLeft, MessageCircle, ShoppingCart, X } from 'lucide-react';
import { config } from '@/env';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, addToCart } = useCart();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [outOfStockSizeClicked, setOutOfStockSizeClicked] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: '50%', y: '50%' });
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsModalOpen(false); };
    if (isModalOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModalOpen]);

  const openModal = (index = 0, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setModalIndex(index);
    setIsModalOpen(true);
    setIsZoomed(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsZoomed(false);
  };

  const onMove = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLDivElement;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100 * 6;
    setOrigin({ x: `${x}%`, y: `${y}%` });
  };

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
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const whatsappNumber = config.whatsappNumber;

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
                      <div className="aspect-square overflow-hidden rounded-xl bg-muted cursor-zoom-in" onClick={(e) => openModal(index, e)}>
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

            {/* Image Modal */}
            {isModalOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                onClick={closeModal}
                role="dialog"
                aria-modal="true"
              >
                <div
                  className="max-w-[95vw] max-h-[95vh] bg-black relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    onClick={closeModal}
                    className="absolute top-2 right-2 z-50 rounded-full h-10 w-10 flex items-center justify-center bg-black/20 hover:bg-black/30 text-black"
                    aria-label="Close"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                  <div
                    className="relative w-full h-full overflow-hidden"
                    onMouseMove={onMove}
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onClick={() => setIsZoomed((s) => !s)}
                  >
                    <img
                      ref={imgRef}
                      src={`https://cdn.jsdelivr.net/gh/nabihahmad/dandelion-lb-products@master/images/${productImages[modalIndex]}`}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        transformOrigin: `${origin.x} ${origin.y}`,
                        transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                        transition: 'transform 200ms ease',
                        cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                      }}
                    />
                  </div>
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
                        className={`px-2 py-2 rounded-lg border-2 font-medium transition-all ${
                          isOutOfStock
                            ? 'bg-muted text-muted-foreground border-border opacity-50 cursor-not-allowed line-through'
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

              {/* Sizes Guide */}
                <div className="mt-0">
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

              {/* Stock Status */}
              <div className="mb-6 mt-6">
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
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
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
                  size="lg"
                  className="w-full gap-2 bg-[hsl(142_70%_45%)] hover:bg-[hsl(142_70%_40%)] text-primary-foreground text-lg"
                  disabled={!product.inStock}
                >
                  <MessageCircle className="h-5 w-5" />
                  Order via WhatsApp
                </Button>
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

      <Footer />
    </div>
  );
}
