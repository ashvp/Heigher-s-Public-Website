import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCountUp } from '@/hooks/useCountUp';

const stats = [
  { value: 150, label: 'Members', suffix: '+' },
  { value: 25, label: 'Events Hosted', suffix: '' },
  { value: 12, label: 'Tournaments Won', suffix: '' },
  { value: 5, label: 'Active Teams', suffix: '' },
];

function StatItem({ value, label, suffix, isVisible, delay }: { value: number; label: string; suffix: string; isVisible: boolean; delay: number }) {
  const count = useCountUp(value, 2000, isVisible);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className="font-heading font-bold text-4xl md:text-6xl text-primary mb-2">
        {count}{suffix}
      </div>
      <div className="text-muted-foreground uppercase tracking-wider text-sm">{label}</div>
    </motion.div>
  );
}

export function StatsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 border-y border-border">
      <div className="container px-4">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              isVisible={isVisible}
              delay={0.1 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
