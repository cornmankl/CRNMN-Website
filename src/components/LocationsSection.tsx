import { useState } from 'react';

export function LocationsSection() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const locations = [
    {
      id: 1,
      name: 'KLCC',
      address: 'Suria KLCC, Kuala Lumpur City Centre',
      hours: '10:00 AM - 10:00 PM',
      phone: '+60 3-2382-2828',
      deliveryTime: '10-15 min',
      status: 'Open'
    },
    {
      id: 2,
      name: 'Pavilion KL',
      address: 'Pavilion Kuala Lumpur, Bukit Bintang',
      hours: '10:00 AM - 10:00 PM',
      phone: '+60 3-2118-8833',
      deliveryTime: '15-20 min',
      status: 'Open'
    },
    {
      id: 3,
      name: 'Mid Valley',
      address: 'Mid Valley Megamall, Kuala Lumpur',
      hours: '10:00 AM - 10:00 PM',
      phone: '+60 3-2938-3333',
      deliveryTime: '20-25 min',
      status: 'Busy'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold neon-text mb-4">Our Locations</h1>
        <p className="text-[var(--neutral-400)] text-lg">Find the nearest CORNMAN location or check delivery areas</p>
      </div>

      {/* Location Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4">Find Delivery Near You</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter your address or postcode"
              className="flex-1 bg-[var(--neutral-800)] border border-[var(--neutral-700)] rounded-lg p-3 focus:ring-[var(--neon-green)] focus:border-[var(--neon-green)]"
            />
            <button className="btn-primary px-6">
              <span className="material-icons">search</span>
            </button>
          </div>
          <p className="text-sm text-[var(--neutral-400)] mt-2">
            We deliver within a 5km radius of our locations
          </p>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <div key={location.id} className="card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-xl">{location.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                location.status === 'Open' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {location.status}
              </span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="material-icons text-base text-[var(--neutral-400)]">location_on</span>
                <span className="text-[var(--neutral-300)]">{location.address}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="material-icons text-base text-[var(--neutral-400)]">schedule</span>
                <span className="text-[var(--neutral-300)]">{location.hours}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="material-icons text-base text-[var(--neutral-400)]">phone</span>
                <span className="text-[var(--neutral-300)]">{location.phone}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="material-icons text-base text-[var(--neutral-400)]">delivery_dining</span>
                <span className="neon-text font-semibold">{location.deliveryTime}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button className="btn-primary flex-1 text-sm py-2">
                Order Now
              </button>
              <button className="btn-secondary px-4 text-sm py-2">
                <span className="material-icons text-base">directions</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Areas */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold neon-text mb-6 text-center">Delivery Areas</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Zone 1 (10-15 min delivery)</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-[var(--neutral-300)]">
              <span>• KLCC</span>
              <span>• Bukit Bintang</span>
              <span>• Ampang Park</span>
              <span>• Chow Kit</span>
              <span>• Masjid Jamek</span>
              <span>• Dang Wangi</span>
            </div>
          </div>
          
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Zone 2 (15-25 min delivery)</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-[var(--neutral-300)]">
              <span>• Mid Valley</span>
              <span>• Bangsar</span>
              <span>• Mont Kiara</span>
              <span>• Sentul</span>
              <span>• Wangsa Maju</span>
              <span>• Taman Tun</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}