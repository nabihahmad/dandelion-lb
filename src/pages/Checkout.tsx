import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Package, MapPin, User } from 'lucide-react';

type Step = 1 | 2 | 3;

export default function Checkout() {
  const [step, setStep] = useState<Step>(1);
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      toast({
        title: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.address.trim() || !formData.city.trim()) {
      toast({
        title: 'Please fill in your delivery address',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate order submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real app, you would send this to your backend
    console.log('Order submitted:', {
      customer: formData,
      items,
      total: totalPrice,
    });

    setOrderComplete(true);
    clearCart();
    setIsSubmitting(false);

    toast({
      title: 'Order Placed Successfully! 🎉',
      description: "We'll contact you soon to confirm your order.",
    });
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Your cart is empty
            </h1>
            <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-8 pb-8">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Order Confirmed!
              </h1>
              <p className="text-muted-foreground mb-6">
                Thank you for your order. We'll contact you shortly via phone to
                confirm your delivery details.
              </p>
              <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Contact', icon: User },
    { number: 2, title: 'Delivery', icon: MapPin },
    { number: 3, title: 'Review', icon: Package },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-2xl">
          <h1 className="text-3xl font-bold text-foreground font-serif text-center mb-8">
            Cash on Delivery
          </h1>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    step >= s.number
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 transition-colors ${
                      step > s.number ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{steps[step - 1].title} Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street name, building, apartment..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions..."
                      rows={2}
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  {/* Customer Info Summary */}
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">
                      Delivery Details
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {formData.fullName}
                      <br />
                      {formData.phone}
                      <br />
                      {formData.address}, {formData.city}
                    </p>
                    {formData.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Notes: {formData.notes}
                      </p>
                    )}
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">
                      Order Items
                    </h4>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={`${item.product.id}-${item.size}`}
                          className="flex justify-between items-center py-2 border-b border-border"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Size: {item.size} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium text-foreground">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center text-lg font-bold pt-4 border-t border-border">
                    <span className="text-foreground">Total (Cash on Delivery):</span>
                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button onClick={handleNext} className="flex-1">
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
