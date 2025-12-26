import { motion } from 'framer-motion';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const team = [
  {
    name: 'Arjun Sharma',
    role: 'President',
    initial: 'AS',
  },
  {
    name: 'Priya Nair',
    role: 'Vice President',
    initial: 'PN',
  },
  {
    name: 'Karthik Reddy',
    role: 'Team Captain',
    initial: 'KR',
  },
  {
    name: 'Sneha Gupta',
    role: 'Events Head',
    initial: 'SG',
  },
];

export function TeamSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="team" className="py-24 md:py-32 bg-secondary/20">
      <div className="container px-4">
        <div ref={ref} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="section-heading"
          >
            Core Team
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-heading font-bold mt-4"
          >
            The <span className="text-primary">Leaders</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="group text-center"
            >
              <div className="relative mb-4">
                <div className="w-32 h-32 mx-auto bg-card border-2 border-border rounded-full flex items-center justify-center group-hover:border-primary transition-colors duration-300">
                  <span className="font-heading font-bold text-3xl text-muted-foreground group-hover:text-primary transition-colors">
                    {member.initial}
                  </span>
                </div>
                <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
              </div>
              
              <h3 className="font-heading font-bold text-lg mb-1">{member.name}</h3>
              <p className="text-accent text-sm uppercase tracking-wider mb-4">{member.role}</p>
              
              <div className="flex justify-center gap-3">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
