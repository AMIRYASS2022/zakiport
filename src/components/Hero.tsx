import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PremiumCTAButton from './PremiumCTAButton';

const Hero = () => {
  const { t, i18n } = useTranslation();

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  // Animation variants for the name - different for Arabic vs Latin text
  const getNameVariants = () => {
    if (i18n.language === 'ar') {
      // Simpler, more elegant animation for Arabic text
      return {
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94] as const
          }
        }
      };
    } else {
      // Complex animation for Latin text
      return {
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
            staggerChildren: 0.1
          }
        }
      };
    }
  };

  const getLetterVariants = () => {
    if (i18n.language === 'ar') {
      // Gentle fade and scale for Arabic
      return {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94] as const
          }
        }
      };
    } else {
      // Complex animation for Latin text
      return {
        hidden: { opacity: 0, y: 20, rotateX: -90 },
        visible: {
          opacity: 1,
          y: 0,
          rotateX: 0,
          transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94] as const
          }
        }
      };
    }
  };

  // Glow effect for the name
  const glowVariants = {
    initial: { opacity: 0.5, scale: 0.8 },
    animate: {
      opacity: [0.5, 0.8, 0.5],
      scale: [0.8, 1.1, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold text-gray-900 mb-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {t('hero.greeting')}
              </motion.h1>
              
              {/* Animated Name Container */}
              <div className="relative inline-block">
                {/* Glow effect behind the name */}
                <motion.div
                  className="absolute inset-0 bg-blue-400 blur-3xl opacity-30 rounded-full"
                  variants={glowVariants}
                  initial="initial"
                  animate="animate"
                />
                
                {/* Main Name */}
                <motion.h2 
                  className="text-3xl md:text-5xl font-black text-blue-600 relative z-10"
                  variants={getNameVariants()}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                >
                  {i18n.language === 'ar' ? (
                    // For Arabic, use simpler animation
                    <motion.span
                      variants={getLetterVariants()}
                      className="inline-block"
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {t('hero.name')}
                    </motion.span>
                  ) : (
                    // For Latin text, use letter-by-letter animation
                    t('hero.name').split('').map((letter, index) => (
                      <motion.span
                        key={index}
                        variants={getLetterVariants()}
                        className="inline-block hover:text-blue-800 transition-colors duration-300 cursor-pointer"
                        whileHover={{ 
                          scale: 1.2, 
                          rotate: [0, -5, 5, 0],
                          transition: { duration: 0.3 }
                        }}
                      >
                        {letter === ' ' ? '\u00A0' : letter}
                      </motion.span>
                    ))
                  )}
                </motion.h2>
              </div>
              
              <motion.h3 
                className="text-2xl md:text-4xl font-bold text-gray-700 mt-2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                {t('hero.role')}
              </motion.h3>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-600 mb-6"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg text-gray-700 mb-8 leading-relaxed"
            >
              {t('hero.intro')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex justify-center lg:justify-start"
            >
              <PremiumCTAButton
                onClick={scrollToContact}
                text={t('hero.cta')}
              />
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <motion.div
              className="relative z-10"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Main Image */}
              <motion.img
                src="/images/zakaria-foto.png"
                alt={t('hero.name')}
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto object-cover"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              />
            </motion.div>

            {/* Background decorative elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"
              animate={{
                x: [0, 20, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"
              animate={{
                x: [0, -20, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;