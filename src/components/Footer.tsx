import logo from '@/assets/heighers-logo.jpg';

export function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Heighers Esports" className="w-10 h-10 rounded-full" />
            <div>
              <span className="font-heading font-bold text-lg">
                Heighers <span className="text-primary">Esports</span>
              </span>
              <p className="text-muted-foreground text-xs">IIT Madras</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-muted-foreground text-sm">
              Agility • Precision • Skill
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              © {new Date().getFullYear()} Heighers Esports. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
