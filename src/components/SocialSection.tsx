import { Instagram, Twitter, Facebook } from 'lucide-react';

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" }
];

export function SocialSection() {
  return (
    <section className="w-full px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Follow Us</h2>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              className="flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors group"
              aria-label={`Follow us on ${social.label}`}
            >
              <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center group-hover:bg-green-700 transition-colors">
                <social.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-sm">{social.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}