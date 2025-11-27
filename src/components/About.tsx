import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Linkedin, Globe } from 'lucide-react';
import Image3D from './Image3D';

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-blue-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <Image3D
              // Use your actual photo: src="/images/zakaria-photo.jpg"
              src="/images/zakaria-foto.png"
              alt="Zakaria Dahbaoui"
              className="w-full max-w-md mx-auto h-80 object-cover rounded-2xl"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('about.title')}
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('about.description')}
            </p>

            <div className="pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('about.social')}
              </h3>
              
              <div className="flex space-x-4">
                <motion.a
                  href="https://facebook.com/zdahbaoui"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </motion.a>
                
                <motion.a
                  href="https://www.instagram.com/zakariadahbaoui/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </motion.a>
                
                <motion.a
                  href="https://linkedin.com/in/zdahbaoui"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="bg-blue-700 text-white p-3 rounded-full hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
                
                <motion.a
                  href="https://behance.net/zdahbaoui"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <Globe className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;