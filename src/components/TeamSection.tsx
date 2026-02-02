import { motion } from 'framer-motion';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const team = [
  {
    name: 'Pranav R',
    role: 'Secretary',
    image: '/pranav.jpg',
    socials: {
      // insta: 'https://www.instagram.com/',
      linkedin: 'https://www.linkedin.com/in/pranav-r-2689472bb/',
      mail: 'esports.club@study.iitm.ac.in',
    },
  },
  {
    name: 'Mohit Kishore',
    role: 'Deputy Secretary',
    image: '/mohit.jpg',
    socials: {
      // insta: 'https://www.instagram.com/',
      linkedin: 'https://www.linkedin.com/in/mohitkishorr/',
      mail: 'esports.club@study.iitm.ac.in',
    },
  },
  {
    name: 'Rachit Agarwal',
    role: 'Coordinator',
    image: '/rachit.jpg',
    socials: {
      // insta: 'https://www.instagram.com/',
      linkedin: 'https://www.linkedin.com/in/rachit-agarwal-24b271346/',
      mail: 'heighers-core@study.iitm.ac.in',
    },
  },
  {
    name: 'Divyanshu Singh',
    role: 'Coordinator',
    image: '/divyanshu.jpg',
    socials: {
      // insta: 'https://www.instagram.com/',
      linkedin: 'https://www.linkedin.com/in/divyannshusingh/',
      mail: 'heighers-core@study.iitm.ac.in',
    },
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
};

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

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group text-center"
            >
              <motion.div 
                className="relative mb-4"
                whileHover={{ scale: 1.05 }}
              >
                {/* Animated ring */}
                <motion.div 
                  className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-primary/0 group-hover:border-primary"
                  initial={false}
                  animate={isVisible ? { rotate: 360 } : {}}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ 
                    borderStyle: 'dashed',
                    borderWidth: '2px',
                  }}
                />
                
                <div className="w-32 h-32 mx-auto bg-card border-2 border-border rounded-full flex items-center justify-center group-hover:border-primary transition-all duration-500 relative overflow-hidden">
                  {/* Glow effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover relative z-10"
                    onError={(e) => {
                      // Fallback to initial if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.querySelector('.initial-fallback')!.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback Initial */}
                  <span className="initial-fallback hidden font-heading font-bold text-4xl text-muted-foreground group-hover:text-primary transition-colors relative z-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {member.name.charAt(0)}
                  </span>
                </div>
              </motion.div>
              
              <motion.h3 
                className="font-heading font-bold text-lg mb-1"
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {member.name}
              </motion.h3>
              <motion.p 
                className="text-accent text-sm uppercase tracking-wider mb-4"
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                {member.role}
              </motion.p>
              
              <motion.div 
                className="flex justify-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {member.socials && Object.entries(member.socials).map(([platform, url], i) => {
                  let Icon = Mail;
                  if (platform === 'insta') Icon = Instagram;
                  if (platform === 'linkedin') Icon = Linkedin;
                  
                  return (
                    <motion.a 
                      key={i}
                      href={platform === 'mail' ? `mailto:${url}` : url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      whileHover={{ scale: 1.3, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon size={18} />
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
