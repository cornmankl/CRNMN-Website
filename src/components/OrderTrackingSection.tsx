export function OrderTrackingSection() {
  const trackingSteps = [
    { id: 1, label: 'Order\nPlaced', icon: 'check', completed: true, active: false },
    { id: 2, label: 'Preparing\nFood', icon: 'check', completed: true, active: false },
    { id: 3, label: 'Out for\nDelivery', icon: 'delivery_dining', completed: false, active: true },
    { id: 4, label: 'Delivered', icon: 'flag', completed: false, active: false }
  ];

  return (
    <section className="mb-16" id="tracking">
      <h1 className="text-3xl md:text-4xl font-extrabold neon-text mb-8">Order Tracking</h1>
      <div className="card p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Order #12046</h2>
            <p className="text-sm text-[var(--neutral-400)]">Estimated Arrival: 8:15 PM</p>
          </div>
          <p className="text-lg font-semibold neon-text mt-2 md:mt-0">RM 18.80</p>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-[var(--neutral-700)]"></div>
          <div className="absolute left-0 top-1/2 w-2/3 h-0.5 neon-bg"></div>
          <div className="flex justify-between items-center text-center">
            {trackingSteps.map((step, index) => (
              <div key={step.id} className="z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                  step.completed || step.active 
                    ? 'neon-bg text-black' 
                    : 'bg-[var(--neutral-700)]'
                } ${step.active ? 'ring-4 ring-black' : ''}`}>
                  <span className={`material-icons text-base ${
                    !step.completed && !step.active ? 'text-[var(--neutral-400)]' : ''
                  }`}>
                    {step.icon}
                  </span>
                </div>
                <p className={`text-xs mt-2 font-semibold whitespace-pre-line ${
                  step.active ? 'neon-text' : step.completed ? '' : 'text-[var(--neutral-400)]'
                }`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--neutral-800)] pt-6">
          <h3 className="font-bold">Your Rider</h3>
          <div className="flex items-center gap-4 mt-4">
            <div className="w-12 h-12 rounded-full bg-[var(--neutral-700)]"></div>
            <div>
              <p className="font-semibold">Aiman</p>
              <p className="text-sm text-[var(--neutral-400)]">Honda Vario - BCD 1234</p>
            </div>
            <button className="ml-auto btn-secondary text-sm py-2 px-4">Contact</button>
          </div>
        </div>
      </div>
    </section>
  );
}