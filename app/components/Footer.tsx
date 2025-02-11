"use client";

interface FooterProps {
  isFocusMode?: boolean;
}

export default function Footer({ isFocusMode = false }: FooterProps) {
  return (
    <footer
      className={`fixed bottom-0 inset-x-0 z-50 transition-opacity duration-300 ${
        isFocusMode ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-900/80 via-gray-900/50 to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6 pb-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Enzo SERY | Ezles. Tous droits
            réservés.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <a
              href="https://github.com/Ezles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://linkedin.com/in/enzo-sery-9ba4951a5/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="mailto:contact@ezles.dev"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
