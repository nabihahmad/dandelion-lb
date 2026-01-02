import { Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  const whatsappNumber = '1234567890'; // Replace with actual WhatsApp number
  
  const generateWhatsAppMessage = () => {
    let message = 'Hi! I would like to order:\n\n';
    items.forEach((item) => {
      message += `• ${item.product.name} (Size: ${item.size}) x${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\nTotal: $${totalPrice.toFixed(2)}`;
    return encodeURIComponent(message);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="text-foreground">Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader>
        <SheetTitle className="text-foreground">Your Cart ({totalItems} items)</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-4">
        {items.map((item) => (
          <div
            key={`${item.product.id}-${item.size}`}
            className="flex gap-4 py-4 border-b border-border"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="h-20 w-20 object-cover rounded-lg bg-muted"
            />
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{item.product.name}</h4>
              <p className="text-sm text-muted-foreground">Size: {item.size}</p>
              <p className="text-sm font-medium text-primary">
                ${item.product.price.toFixed(2)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    updateQuantity(item.product.id, item.size, item.quantity - 1)
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-foreground">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    updateQuantity(item.product.id, item.size, item.quantity + 1)
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removeFromCart(item.product.id, item.size)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 space-y-4">
        <div className="flex justify-between text-lg font-semibold">
          <span className="text-foreground">Total:</span>
          <span className="text-primary">${totalPrice.toFixed(2)}</span>
        </div>

        <div className="grid gap-3">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full gap-2 bg-[hsl(142_70%_45%)] hover:bg-[hsl(142_70%_40%)] text-primary-foreground">
              <MessageCircle className="h-5 w-5" />
              Order via WhatsApp
            </Button>
          </a>
          <Link to="/checkout">
            <Button variant="default" className="w-full">
              Cash on Delivery
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
