import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import BounceCards from './BounceCards';

const events = [
  {
    name: 'Aarambh Series',
    date: 'January',
    description: 'Major gaming event including competitive and fun games during winter.',
    details:'',
  },
  {
    name: 'Ranneeti Series',
    date: 'May',
    description: 'Major offline eSports event exclusive for IITM BS students, during summer.',
    details:'',
  },
  {
    name: 'Spectrum Series',
    date: 'July',
    description: 'Major eSports event for participants across IITM and IITM BS.',
    details:'',
  },
  {
    name: 'Astra Series',
    date: 'September',
    description: 'Major gaming event including competitive and fun games during autumn.',
    details:'',
  },
];

const otherEvents = [
  {
    title: 'REGENCIA 1.0',
    description: 'Heighers x Houses (Fun and competitive gaming event in collaboration with IITM BS houses.)',
  },
  {
    title: 'Heighers x Societies',
    description: 'Fun gaming event in collaboration with IITM BS societies.',
  },
  {
    title: 'Chakravyuh',
    description: 'BGMI Event with participation across IITs and IIMs.',
  },
  {
    title: 'Heighers X Rumble',
    description: 'Special collaborative event series.',
  },
  {
    title: 'ClashoCalypse Cup S1',
    description: 'COC international tournament with participants from across North America and Europe.',
  },
  {
    title: 'Heighers Conquest',
    description: 'Gaming event including competitive and fun games during fall and spring.',
  },
  {
    title: 'Gaming Nights',
    description: 'Fun games once a month to relax away from competitive games and studies, after exams.',
  },
  {
    title: 'Monthly Scrims',
    description: 'Competitive Practice games for our major tournaments every 1-1.5 month.',
  },
  {
    title: 'Gaming Fest',
    description: 'Fun and Competitive games month long event.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5 }
  },
};

export function EventsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="events" className="py-24 md:py-20 bg-secondary/20 overflow-hidden">
      <div className="container px-4">
        <div ref={ref} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="section-heading"
          >
            Past Events
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-heading font-bold mt-4"
          >
            Our <span className="text-primary">Battlegrounds</span>
          </motion.h2>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {events.map((event, index) => (
            <motion.div
              key={event.name}
              variants={cardVariants}
              custom={index}
              className="relative"
            >
              <motion.div
                whileHover={{ 
                  scale: 1.02, 
                  x: 10,
                  transition: { duration: 0.2 }
                }}
                transition={{ duration: 0.2, ease: "easeOut" }} 
                className="group p-6 bg-card border border-border rounded-lg card-hover relative overflow-hidden h-full"
              >
                {/* Animated border glow */}
                <motion.div 
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.1), transparent)',
                  }}
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                />
                
                <div className="flex items-start gap-4 relative z-10">
                  <motion.div 
                    className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors"
                    whileHover={{ rotate: 10 }}
                  >
                    <Calendar className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div>
                    <motion.span 
                      className="text-accent text-xs uppercase tracking-wider"
                      initial={{ opacity: 0 }}
                      animate={isVisible ? { opacity: 1 } : {}}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {event.date}
                    </motion.span>
                    <h3 className="font-heading font-bold text-2xl mt-1 mb-2 group-hover:text-primary transition-colors">{event.name}</h3>
                    <p className="text-muted-foreground text-sm">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* More Events Section with BounceCards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col items-center justify-center pt-0"
        >
          <h3 className="text-2xl font-heading font-bold mb-4 text-center">
            More <span className="text-primary">Community Events</span>
          </h3>
          
          <div className="relative w-full flex justify-center py-10">
            <BounceCards 
              items={otherEvents}
              containerWidth={1000}
              containerHeight={300}
              enableHover={true}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
