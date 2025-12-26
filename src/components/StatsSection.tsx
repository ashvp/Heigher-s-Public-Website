import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCountUp } from '@/hooks/useCountUp';

const stats = [
  { value: 150, label: 'Members', suffix: '+' },
  { value: 25, label: 'Events Hosted', suffix: '' },
  { value: 12, label: 'Tournaments Won', suffix: '' },
  { value: 5, label: 'Active Teams', suffix: '' },
];

function StatItem({ value, label, suffix, isVisible, index }: { value: number; label: string; suffix: string; isVisible: boolean; index: number }) {
  const count = useCountUp(value, 2000, isVisible);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.15, type: "spring", stiffness: 100 }}
      className="text-center relative group"
    >
      {/* Background glow */}
      <motion.div 
        className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        whileHover={{ scale: 1.1 }}
      />
      
      <motion.div 
        className="font-heading font-bold text-4xl md:text-6xl text-primary mb-2"
        whileHover={{ scale: 1.1 }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
        >
          {count}{suffix}
        </motion.span>
      </motion.div>
      <motion.div 
        className="text-muted-foreground uppercase tracking-wider text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 + index * 0.1 }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
}

export function StatsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 border-y border-border relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
        animate={{ 
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl"
        animate={{ 
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />
      
      <div className="container px-4 relative z-10">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
