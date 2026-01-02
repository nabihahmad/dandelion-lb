import { Truck, Shield, Heart, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Each piece is carefully selected for quality and comfort',
  },
  {
    icon: Truck,
    title: 'Cash on Delivery',
    description: 'Pay when you receive - no hassle, no worries',
  },
  {
    icon: Shield,
    title: 'Safe Materials',
    description: 'All fabrics are child-safe and hypoallergenic',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: 'Not satisfied? Return within 7 days',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground font-serif text-center mb-12">
          Why Parents Love Us
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-xl bg-card border border-border hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent mb-4">
                <feature.icon className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
