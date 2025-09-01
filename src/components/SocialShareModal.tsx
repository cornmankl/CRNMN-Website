interface SocialShareModalProps {
  onClose: () => void;
}

export function SocialShareModal({ onClose }: SocialShareModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="card max-w-sm w-full m-4 p-8 text-center relative">
        <button 
          className="absolute top-4 right-4 text-[var(--neutral-400)] hover:text-white"
          onClick={onClose}
        >
          <span className="material-icons">close</span>
        </button>
        <h2 className="text-2xl font-bold neon-text">Share The Vibe</h2>
        <p className="text-[var(--neutral-300)] mt-2">
          You're about to share your latest order on your socials.
        </p>
        <div className="my-6 p-4 border border-[var(--neutral-800)] rounded-xl text-left">
          <p className="text-sm font-semibold">
            Just copped the CORNMAN Classic! 🔥🌽 The hype is real. #THEFMSMKT #CORNMAN
          </p>
        </div>
        <div className="flex gap-4">
          <button className="btn-secondary w-full" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary w-full">
            Share
          </button>
        </div>
      </div>
    </div>
  );
}