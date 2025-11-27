import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
}

interface BackendImage {
  filename: string;
  url: string;
  size: number;
  uploadDate: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const ImageGallery = () => {
  const { t } = useTranslation();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const images: GalleryImage[] = [
    {
      id: 1,
      src: '/portfolio/2.jpeg',
      alt: 'Minimalist Brand Identity Design',
      title: 'Minimalist Brand Identity',
      description: 'Sophisticated brand identity featuring clean typography and geometric elements'
    },
    {
      id: 2,
      src: '/portfolio/3.jpeg',
      alt: 'Luxury Brand Visual Identity',
      title: 'Luxury Brand Visual Identity',
      description: 'Elegant visual identity system with premium aesthetics and gold accents'
    },
    {
      id: 3,
      src: '/portfolio/4.jpeg',
      alt: 'Creative Logo Design Collection',
      title: 'Creative Logo Collection',
      description: 'Diverse collection of innovative logo designs demonstrating versatility'
    },
    {
      id: 4,
      src: '/portfolio/5.jpeg',
      alt: 'Modern Typography and Layout Design',
      title: 'Typography & Layout Design',
      description: 'Contemporary typography experiments with bold letterforms'
    },
    {
      id: 5,
      src: '/portfolio/6.jpeg',
      alt: 'Corporate Brand Identity System',
      title: 'Corporate Identity System',
      description: 'Comprehensive brand identity including logo variations and guidelines'
    },
    {
      id: 6,
      src: '/portfolio/7.jpeg',
      alt: 'Creative Packaging Design Concept',
      title: 'Creative Packaging Design',
      description: 'Innovative packaging solutions combining functionality with aesthetic appeal'
    },
    {
      id: 7,
      src: '/portfolio/8.jpeg',
      alt: 'Digital Art and Illustration Work',
      title: 'Digital Art & Illustration',
      description: 'Original digital artwork combining traditional and modern techniques'
    },
    {
      id: 8,
      src: '/portfolio/9.jpeg',
      alt: 'Editorial Design and Layout',
      title: 'Editorial Design',
      description: 'Magazine design featuring sophisticated layouts and visual storytelling'
    },
    {
      id: 9,
      src: '/portfolio/10.jpeg',
      alt: 'Brand Guidelines and Style Guide',
      title: 'Brand Guidelines',
      description: 'Detailed brand manual showcasing logo usage and color specifications'
    }
  ];

  const [displayImages, setDisplayImages] = useState<GalleryImage[]>(images);

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 100
      }
    }
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/gallery/images`);
        const data = await res.json();
        if (data.success && Array.isArray(data.images) && data.images.length > 0) {
          const mapped: GalleryImage[] = data.images.slice(0, 9).map((img: BackendImage, idx: number) => ({
            id: idx + 1,
            src: `${API_BASE_URL}${img.url}`,
            alt: `Work ${idx + 1}`,
            title: 'Work',
            description: ''
          }));
          setDisplayImages(mapped);
        } else {
          setDisplayImages(images);
        }
      } catch {
        setDisplayImages(images);
      }
    };
    load();
  }, []);

  return (
    <section className="py-8 overflow-hidden" style={{ perspective: '2000px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gallery Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 lg:mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {t('gallery.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </motion.div>

        {/* Mobile: 2 columns, Desktop: 3 columns */}
        <div className="perspective-1000">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto"
          >
            {displayImages.map((image, index) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                className="group relative"
                onHoverStart={() => setHoveredId(image.id)}
                onHoverEnd={() => setHoveredId(null)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Image Container - Mobile: h-48, Desktop: h-80 */}
                <motion.div className="relative w-full h-48 lg:h-80 rounded-xl overflow-hidden shadow-xl bg-white">
                  <motion.img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Title - Responsive text size */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-sm lg:text-lg">{image.title}</h3>
                  </div>

                  {/* Border Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-transparent"
                    whileHover={{ 
                      borderColor: "rgba(59, 130, 246, 0.6)",
                      boxShadow: "0 8px 25px -5px rgba(59, 130, 246, 0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Hover Description - Desktop only */}
                <AnimatePresence>
                  {hoveredId === image.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -bottom-16 left-0 right-0 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10 hidden lg:block"
                    >
                      <p className="text-sm text-gray-700">{image.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-3 text-sm">¿Interesado en mi trabajo creativo?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto text-sm"
          >
            Ver Más Proyectos
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ImageGallery;