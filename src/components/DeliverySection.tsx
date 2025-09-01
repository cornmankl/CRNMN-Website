import { Button } from './ui/button';
import { MapPin, Clock, Truck } from 'lucide-react';
import deliveryBike from 'figma:asset/38b2d6559fb5817e6bfffb1dfff40bc6202cfbe3.png';

export function DeliverySection() {
  return (
    <section className="w-full px-4 py-16 bg-gray-900/30">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">
                Fresh & Fast 
                <span className="block text-green-400">Delivery</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our eco-friendly delivery bikes bring hot, fresh gourmet corn directly to your door. 
                Each order is prepared fresh and delivered within 30 minutes.
              </p>
            </div>

            {/* Delivery Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">15-30 Minute Delivery</h3>
                  <p className="text-gray-400 text-sm">Hot and fresh to your location</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Citywide Coverage</h3>
                  <p className="text-gray-400 text-sm">We deliver across the entire city</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Eco-Friendly</h3>
                  <p className="text-gray-400 text-sm">Zero-emission bike delivery</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                className="bg-green-400 hover:bg-green-300 text-black font-bold px-6 py-3"
                size="lg"
              >
                Track Your Order
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                size="lg"
              >
                Delivery Areas
              </Button>
            </div>
          </div>

          {/* Delivery Bike Image */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-green-400/10 to-transparent rounded-2xl p-8 flex items-center justify-center">
              <img 
                src={deliveryBike} 
                alt="CRNMN delivery bike"
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}