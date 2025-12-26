import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Users, Target } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const features = [
  {
    icon: Gamepad2,
    title: 'Competitive Esports',
    description: 'Representing IIT Madras in major esports tournaments across multiple titles.',
  },
  {
    icon: Target,
    title: 'Training & Development',
    description: 'Structured practice sessions, strategy analysis, and skill enhancement programs.',
  },
  {
    icon: Trophy,
    title: 'Tournaments & Events',
    description: 'Organizing intra-college competitions and hosting large-scale gaming events.',
  },
  {
    icon: Users,
    title: 'Community Building',
    description: 'Creating a vibrant gaming community that supports and elevates each player.',
  },
];

export function WhatWeDoSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="what-we-do" className="py-24 md:py-32">
      <div className="container px-4">
        <div ref={ref} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="section-heading"
          >
            What We Do
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-heading font-bold mt-4"
          >
            Our <span className="text-primary">Mission</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="group p-6 bg-card border border-border rounded-lg card-hover"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
