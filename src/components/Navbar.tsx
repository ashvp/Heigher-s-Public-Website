import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Link, useLocation } from 'react-router-dom';
import logo from '@/assets/heighers-logo.jpg';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'About', href: isHome ? '#about' : '/#about', isRoute: false },
    { name: 'What We Do', href: isHome ? '#what-we-do' : '/#what-we-do', isRoute: false },
    { name: 'Team', href: isHome ? '#team' : '/#team', isRoute: false },
    { name: 'Events', href: isHome ? '#events' : '/#events', isRoute: false },
    { name: 'Contact', href: isHome ? '#contact' : '/#contact', isRoute: false },
    { name: 'Verify Cert', href: '/certificate-verify', isRoute: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Heighers eSports" className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
            <span className="font-heading font-bold text-lg md:text-xl uppercase tracking-wide">
              Heighers<span className="text-primary"> eSports</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="font-heading font-medium text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-heading font-medium text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </a>
              )
            ))}
            <Button variant="outline" size="sm" disabled className="opacity-50 cursor-not-allowed">
              Join Us (Closed)
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="font-heading font-medium text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="font-heading font-medium text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                )
              ))}
              <Button variant="outline" size="sm" disabled className="opacity-50 cursor-not-allowed w-full">
                Join Us (Closed)
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
