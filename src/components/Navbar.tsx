import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import logo from '@/assets/heighers-logo.jpg';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'What We Do', href: '#what-we-do' },
  { name: 'Team', href: '#team' },
  { name: 'Events', href: '#events' },
  { name: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <img src={logo} alt="Heighers Esports" className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
            <span className="font-heading font-bold text-lg md:text-xl uppercase tracking-wide">
              Heighers<span className="text-primary"> Esports</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-heading font-medium text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
            <Button variant="outline" size="sm" asChild>
              <a href="#join">Join Us</a>
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
                <a
                  key={link.name}
                  href={link.href}
                  className="font-heading font-medium text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <Button variant="outline" size="sm" asChild>
                <a href="#join" onClick={() => setIsOpen(false)}>Join Us</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
