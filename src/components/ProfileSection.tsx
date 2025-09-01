export function ProfileSection() {
  return (
    <section className="mb-16" id="profile">
      <h1 className="text-3xl md:text-4xl font-extrabold neon-text mb-8">User Profile</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 card p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-neutral-700 mb-4 flex items-center justify-center text-4xl font-bold">
            J
          </div>
          <h2 className="text-2xl font-bold">John Doe</h2>
          <p className="text-[var(--neutral-400)]">john.doe@example.com</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="material-icons text-base neon-text">star</span>
            <span className="font-semibold">1,250 Points</span>
          </div>
          <button className="mt-6 btn-secondary w-full">Edit Profile</button>
        </div>

        <div className="md:col-span-2 card p-6">
          <h3 className="text-xl font-bold mb-4">Order History</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-[var(--neutral-800)] rounded-xl">
              <div>
                <p className="font-semibold">Order #12045</p>
                <p className="text-sm text-[var(--neutral-400)]">03 Aug 2024 - Delivered</p>
              </div>
              <span className="font-semibold neon-text">RM 25.80</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-[var(--neutral-800)] rounded-xl">
              <div>
                <p className="font-semibold">Order #11987</p>
                <p className="text-sm text-[var(--neutral-400)]">28 Jul 2024 - Delivered</p>
              </div>
              <span className="font-semibold neon-text">RM 15.80</span>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-8 mb-4">Preferences</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 text-sm rounded-full bg-opacity-20 neon-bg neon-text">
              Vegetarian
            </span>
            <span className="px-3 py-1 text-sm rounded-full bg-opacity-20 neon-bg neon-text">
              Spicy
            </span>
            <span className="px-3 py-1 text-sm rounded-full bg-[var(--neutral-700)] text-[var(--neutral-300)]">
              No Nuts
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}