import imgDepth7Frame0 from "figma:asset/af9d70c888955533fb7b950acf29507776094c1a.png";
import imgDepth7Frame1 from "figma:asset/e4a4e6d169e6c1e281b41dd04be79aabdd6c39d9.png";
import imgDepth7Frame2 from "figma:asset/2eb24312b67e2c2efd0f142c63cdb4c3790a46fa.png";

const showcaseImages = [
  { src: imgDepth7Frame0, alt: "CRNMN Lifestyle 1" },
  { src: imgDepth7Frame1, alt: "CRNMN Lifestyle 2" },
  { src: imgDepth7Frame2, alt: "CRNMN Lifestyle 3" }
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