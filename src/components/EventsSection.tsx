import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const events = [
  {
    name: 'Valorant Championship 2024',
    date: 'November 2024',
    description: 'Inter-college Valorant tournament with 32 participating teams.',
  },
  {
    name: 'BGMI Campus League',
    date: 'October 2024',
    description: 'Battle Royale showdown featuring top college teams from South India.',
  },
  {
    name: 'CS2 LAN Party',
    date: 'September 2024',
    description: 'Offline Counter-Strike 2 event with live streaming and prizes.',
  },
  {
    name: 'FIFA Pro Cup',
    date: 'August 2024',
    description: '1v1 FIFA tournament with participants from across IITs.',
  },
];

export function EventsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="events" className="py-24 md:py-32 bg-secondary/20">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {events.map((event, index) => (
            <motion.div
              key={event.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="group p-6 bg-card border border-border rounded-lg card-hover"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span className="text-accent text-xs uppercase tracking-wider">{event.date}</span>
                  <h3 className="font-heading font-bold text-lg mt-1 mb-2">{event.name}</h3>
                  <p className="text-muted-foreground text-sm">{event.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
