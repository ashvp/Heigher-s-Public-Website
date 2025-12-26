import { motion } from 'framer-motion';
import { Instagram, Youtube, MessageCircle } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const socials = [
  { name: 'Instagram', icon: Instagram, color: 'group-hover:text-primary group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)]' },
  { name: 'Discord', icon: MessageCircle, color: 'group-hover:text-accent group-hover:shadow-[0_0_30px_hsl(var(--accent)/0.4)]' },
  { name: 'YouTube', icon: Youtube, color: 'group-hover:text-primary group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)]' },
];

export function SocialsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 md:py-32">
      <div className="container px-4">
        <div ref={ref} className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="section-heading"
          >
            Follow Us
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-heading font-bold mt-4"
          >
            Stay <span className="text-primary">Connected</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-8"
        >
          {socials.map((social, index) => (
            <motion.a
              key={social.name}
              href="#"
              initial={{ opacity: 0, scale: 0 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: 0.3 + index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.2, 
                rotate: [0, -10, 10, 0],
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.9 }}
              className={`group w-16 h-16 md:w-20 md:h-20 bg-card border border-border rounded-xl flex items-center justify-center text-muted-foreground transition-all duration-300 ${social.color}`}
              aria-label={social.name}
            >
              <social.icon className="w-7 h-7 md:w-8 md:h-8" />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
