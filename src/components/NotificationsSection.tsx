import { useState } from 'react';

export function NotificationsSection() {
  const [settings, setSettings] = useState({
    orderUpdates: true,
    promos: false,
    loyalty: true
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <section className="mb-16" id="notifications">
      <h1 className="text-3xl md:text-4xl font-extrabold neon-text mb-8">Notifications Settings</h1>
      <div className="card p-8 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">Order Updates</h3>
              <p className="text-sm text-[var(--neutral-400)]">Get notified about your order status.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                checked={settings.orderUpdates}
                className="sr-only peer"
                type="checkbox"
                onChange={() => handleToggle('orderUpdates')}
              />
              <div className="w-11 h-6 bg-[var(--neutral-700)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--neon-green)]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">Promos & Drops</h3>
              <p className="text-sm text-[var(--neutral-400)]">Be the first to know about new items and special offers.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                checked={settings.promos}
                className="sr-only peer"
                type="checkbox"
                onChange={() => handleToggle('promos')}
              />
              <div className="w-11 h-6 bg-[var(--neutral-700)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--neon-green)]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">Loyalty Updates</h3>
              <p className="text-sm text-[var(--neutral-400)]">Receive updates on your points balance and rewards.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                checked={settings.loyalty}
                className="sr-only peer"
                type="checkbox"
                onChange={() => handleToggle('loyalty')}
              />
              <div className="w-11 h-6 bg-[var(--neutral-700)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--neon-green)]"></div>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}