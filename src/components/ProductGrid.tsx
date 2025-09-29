import imgDepth7Frame3 from "figma:asset/777cdee0db1cc5dabd7ce05368700939e3a0d3c9.png";
import imgDepth7Frame4 from "figma:asset/bd10eebfc13103f9f697ae8ad9dd52d1fb4187c4.png";
import imgDepth7Frame5 from "figma:asset/2f0f57562b591e4dcc26844717b124c0d74b90b1.png";
import { Button } from './ui/button';

const products = [
  {
    id: 1,
    name: "CRNMN Classic",
    description: "The original flavor",
    image: imgDepth7Frame3,
    price: "$4.99"
  },
  {
    id: 2,
    name: "CRNMN Spicy",
    description: "A spicy kick",
    image: imgDepth7Frame4,
    price: "$4.99"
  },
  {
    id: 3,
    name: "CRNMN Sweet",
    description: "A sweet treat",
    image: imgDepth7Frame5,
    price: "$4.99"
  }
];

export function ProductGrid() {
  return (
    <section className="w-full px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Products</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product.id}
              className="group cursor-pointer"
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-800">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform group-hover:scale-110"
                  style={{ backgroundImage: `url('${product.image}')` }}
                  role="img"
                  aria-label={product.name}
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-white group-hover:text-green-300 transition-colors">
                  {product.name}
                </h3>
                <p className="text-green-300 text-sm">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{product.price}</span>
                  <Button 
                    size="sm" 
                    className="bg-green-400 hover:bg-green-300 text-black opacity-0 group-hover:opacity-100 transition-all"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}