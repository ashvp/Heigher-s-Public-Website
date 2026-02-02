import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Users, Target } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const features = [
  {
    icon: Gamepad2,
    title: 'eSports Events',
    description: 'Hosting structured eSports tournaments and competitive events across multiple gaming titles with large-scale participation.',
  },
  {
    icon: Target,
    title: 'Flagship Competitions',
    description: 'Organizing major pan-BS eSports events that attract hundreds of participants and showcase competitive talent across the ecosystem.',
  },
  {
    icon: Trophy,
    title: 'Community Platform',
    description: 'Providing a space for gamers to connect, collaborate, and engage with the eSports community beyond individual events.',
  },
  {
    icon: Users,
    title: 'Competitive Exposure',
    description: 'Enabling students to experience high-pressure competitive environments through tournaments rather than structured training programs.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    transition: { duration: 0.6 }
  },
};

export function WhatWeDoSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="what-we-do" className="py-16 md:py-28">
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
            What we <span className="text-primary">Enable</span>
          </motion.h2>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="relative"
            >
              <motion.div
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  transition: { duration: 0.1 }
                }}
                transition={{ duration: 0.2, ease: "easeOut" }} 
                className="group p-6 bg-card border border-border rounded-lg card-hover relative overflow-hidden h-full"
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" 
                  style={{ backgroundSize: '200% 100%' }} 
                />
                
                <motion.div 
                  className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors relative z-10"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <feature.icon className="w-7 h-7 text-primary" />
                </motion.div>
                <h3 className="font-heading font-bold text-xl mb-3 relative z-10">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed relative z-10">{feature.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
