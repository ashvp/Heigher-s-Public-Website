import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-16 md:py-28 bg-secondary/20">
      <div className="container px-4">
        <div ref={ref} className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="section-heading"
          >
            About Us
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-heading font-bold mt-4 mb-8"
          >
            The <span className="text-primary">Competitive Gaming Hub</span> of <br></br>
            IIT Madras BS
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8"
          >
            Heighers eSports is the official eSports and competitive gaming
            society of IIT Madras BS. We organize large-scale tournaments and
            competitive events that bring together gamers from across the BS
            ecosystem.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8"
          >
            Over the years, we've hosted 17+ events with 11,000+ participants,
            playing a central role in shaping eSports culture at IIT Madras BS.
            From casual gamers to serious competitors, Heighers provides a
            platform to compete, improve, and make their mark.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground text-base leading-relaxed"
          >
            We focus on structured competition, fair play, and long-term growth on and off the screen.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
