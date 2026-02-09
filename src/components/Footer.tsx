import logo from '@/assets/heighers-logo.jpg';

export function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Heighers eSports" className="w-10 h-10 rounded-full" />
            <div>
              <span className="font-heading font-bold text-lg">
                Heighers <span className="text-primary">eSports</span>
              </span>
              <p className="text-muted-foreground text-xs transition-all duration-300 hover:text-primary hover:drop-shadow-[0_0_8px_hsl(var(--primary))] cursor-default">IIT Madras</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-muted-foreground text-sm transition-all duration-300 hover:text-primary hover:drop-shadow-[0_0_8px_hsl(var(--primary))] cursor-default">
              Agility • Precision • Skill
            </p>
            <p className="text-muted-foreground text-xs mt-1 transition-all duration-300 hover:text-primary hover:drop-shadow-[0_0_8px_hsl(var(--primary))] cursor-default">
              © {new Date().getFullYear()} Heighers eSports. All rights reserved.
            </p>
            <p className="text-muted-foreground text-xs mt-1 transition-all duration-300 hover:text-primary hover:drop-shadow-[0_0_8px_hsl(var(--primary))] cursor-default">
              Credits: Ashwin | Ankush | Srivalli
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
