export function Footer() {
  return (
    <footer className="border-t border-[var(--neutral-900)]">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs text-[var(--neutral-500)]">
          © 2024 THEFMSMKT · CMNTYPLX · CORNMAN
        </p>
        <div className="flex gap-6 text-xs">
          <a className="hover:text-[var(--neutral-300)]" href="#">
            Privacy
          </a>
          <a className="hover:text-[var(--neutral-300)]" href="#">
            Terms
          </a>
          <a className="hover:text-[var(--neutral-300)]" href="#">
            Cookies
          </a>
        </div>
      </div>
    </footer>
  );
}