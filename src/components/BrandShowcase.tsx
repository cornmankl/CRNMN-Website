// Using placeholder images instead of figma assets
const showcaseImages = [
  { src: "/placeholder-image-1.jpg", alt: "CRNMN Lifestyle 1" },
  { src: "/placeholder-image-2.jpg", alt: "CRNMN Lifestyle 2" },
  { src: "/placeholder-image-3.jpg", alt: "CRNMN Lifestyle 3" }
];

export function BrandShowcase() {
  return (
    <section className="w-full px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Brand Showcase</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {showcaseImages.map((image, index) => (
            <div 
              key={index}
              className="aspect-[4/3] rounded-lg overflow-hidden group cursor-pointer"
            >
              <div 
                className="w-full h-full bg-cover bg-center transition-transform group-hover:scale-110"
                style={{ backgroundImage: `url('${image.src}')` }}
                role="img"
                aria-label={image.alt}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}