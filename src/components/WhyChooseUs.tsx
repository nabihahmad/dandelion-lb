import { Heart, Palette, Baby } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Three Times Softer Than Cotton',
    description: 'Bamboo fabric is exceptionally soft, breathable, and gentle—perfect for delicate and sensitive skin.',
  },
  {
    icon: Palette,
    title: 'Color That Lasts',
    description: 'Our prints are designed to stay vibrant, even after frequent washing.',
  },
  {
    icon: Baby,
    title: 'Extra Stretch for Growing Babies',
    description: 'Our fabric is more flexible than cotton and designed to last up to twice as long, giving your little one comfort that grows with them.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground font-serif text-center mb-12">
          Why Parents Love Us
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,280px))] justify-center gap-8">
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
