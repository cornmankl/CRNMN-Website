export function LoyaltySection() {
  const rewards = [
    {
      id: 1,
      icon: 'local_drink',
      name: 'Free Drink',
      description: 'Any drink on the menu',
      points: 500,
      available: true
    },
    {
      id: 2,
      icon: 'icecream',
      name: 'Free Classic Cup',
      description: 'Our signature CORNMAN cup',
      points: 700,
      available: true
    },
    {
      id: 3,
      icon: 'card_giftcard',
      name: '10% Off Voucher',
      description: 'On your next order',
      points: 1500,
      available: false
    }
  ];

  return (
    <section className="mb-16" id="loyalty">
      <h1 className="text-3xl md:text-4xl font-extrabold neon-text mb-8">Loyalty Program</h1>
      <div className="card p-8 text-center">
        <h2 className="text-2xl font-bold">Your Points Balance</h2>
        <p className="text-5xl font-black neon-text my-4">1,250</p>
        <p className="text-[var(--neutral-400)] max-w-md mx-auto">
          Earn points with every purchase and redeem them for exclusive rewards. 100 points = RM1 off.
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Rewards Catalog</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className={`card p-6 text-center ${!reward.available ? 'opacity-50' : ''}`}>
              <span className="material-icons text-4xl neon-text">{reward.icon}</span>
              <h4 className="font-bold mt-2">{reward.name}</h4>
              <p className="text-sm text-[var(--neutral-400)]">{reward.description}</p>
              <button 
                className="mt-4 btn-primary w-full text-sm py-2"
                disabled={!reward.available}
              >
                Redeem ({reward.points} pts)
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}