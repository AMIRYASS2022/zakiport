import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Eye } from 'lucide-react';

const portfolioItems = [
  {
    id: 1,
    title: 'Trabajo Profesional 1',
    category: 'design',
    image: '/portfolio/2.jpeg',
    description: 'Proyecto de diseño creativo que muestra habilidades profesionales',
    client: 'Cliente Privado',
    year: '2024',
    tools: ['Photoshop', 'Illustrator']
  },
  {
    id: 2,
    title: 'Diseño Creativo',
    category: 'design',
    image: '/portfolio/4.jpeg',
    description: 'Solución de diseño innovadora para branding moderno',
    client: 'Cliente Empresarial',
    year: '2024',
    tools: ['Figma', 'Photoshop']
  },
  {
    id: 3,
    title: 'Composición Visual',
    category: 'design',
    image: '/portfolio/5.jpeg',
    description: 'Composición visual artística con estilo profesional',
    client: 'Agencia Creativa',
    year: '2024',
    tools: ['Illustrator', 'InDesign']
  },
  {
    id: 4,
    title: 'Identidad de Marca',
    category: 'design',
    image: '/portfolio/6.jpeg',
    description: 'Diseño y desarrollo completo de identidad de marca',
    client: 'Empresa Startup',
    year: '2024',
    tools: ['Figma', 'Canva', 'Photoshop']
  },
  {
    id: 5,
    title: 'Arte Digital',
    category: 'design',
    image: '/portfolio/7.jpeg',
    description: 'Arte digital con principios de diseño modernos',
    client: 'Cliente Digital',
    year: '2024',
    tools: ['Procreate', 'Photoshop']
  },
  {
    id: 6,
    title: 'Proyecto Creativo',
    category: 'design',
    image: '/portfolio/9.jpeg',
    description: 'Proyecto creativo con enfoque de diseño innovador',
    client: 'Estudio de Diseño',
    year: '2024',
    tools: ['Illustrator', 'Figma']
  },
  {
    id: 7,
    title: 'Trabajo de Portafolio',
    category: 'design',
    image: '/portfolio/10.jpeg',
    description: 'Pieza de portafolio profesional demostrando experiencia',
    client: 'Cliente Corporativo',
    year: '2024',
    tools: ['Photoshop', 'Illustrator', 'InDesign']
  },
  {
    id: 8,
    title: 'Proyecto Especial',
    category: 'design',
    image: '/portfolio/Sin título.jpeg',
    description: 'Proyecto de diseño especial con elementos creativos únicos',
    client: 'Cliente Premium',
    year: '2024',
    tools: ['Creative Suite', 'Figma']
  }
];

// Personal showcase item
const personalItem = {
  id: 0,
  title: 'Marca Personal',
  category: 'design',
  image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20arab%20designer%20portrait%2C%20black%20cap%20with%20white%20RE%20logo%2C%20white%20t-shirt%2C%20confident%20expression%2C%20studio%20lighting%2C%20gray%20background%2C%20professional%20photography%20style&image_size=landscape_16_9',
  description: 'Retrato profesional mostrando identidad de marca personal',
  client: 'Proyecto Personal',
  year: '2024',
  tools: ['Canon EOS', 'Estudio', 'Lightroom']
};

const categories = ['all', 'design', 'web', 'ai'];

const Portfolio = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const allItems = [personalItem, ...portfolioItems];
  
  const filteredItems = activeCategory === 'all' 
    ? allItems 
    : allItems.filter(item => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('portfolio.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('portfolio.subtitle')}
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                activeCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {t(`portfolio.${category}`)}
            </motion.button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    
                    {/* Overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                      animate={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                    >
                      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: hoveredItem === item.id ? 0 : 20, opacity: hoveredItem === item.id ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                          <p className="text-sm mb-3 opacity-90">{item.description}</p>
                          
                          {/* Project Details */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                              {item.client}
                            </span>
                            <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                              {item.year}
                            </span>
                          </div>
                          
                          {/* Tools */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {item.tools.map((tool, toolIndex) => (
                              <span key={toolIndex} className="text-xs bg-white/10 backdrop-blur-sm px-2 py-1 rounded">
                                {tool}
                              </span>
                            ))}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              onClick={() => {
                                const contactSection = document.getElementById('contact');
                                if (contactSection) {
                                  contactSection.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                            >
                              <Eye className="w-4 h-4" />
                              <span>Ver Detalles</span>
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No se encontraron elementos en esta categoría.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;