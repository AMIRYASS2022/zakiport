import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const services = [
  {
    title: 'services.graphic_design',
    description: 'services.graphic_design_desc',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20graphic%20design%20workspace%20with%20colorful%20palette%20and%20creative%20tools&image_size=landscape_16_9',
  },
  {
    title: 'services.web_design',
    description: 'services.web_design_desc',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20web%20design%20workspace%20with%20multiple%20screens%20showing%20beautiful%20websites&image_size=landscape_16_9',
  },
  {
    title: 'services.ai_development',
    description: 'services.ai_development_desc',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20AI%20development%20workspace%20with%20holographic%20displays%20and%20neural%20networks&image_size=landscape_16_9',
  },
  {
    title: 'services.branding',
    description: 'services.branding_desc',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20branding%20workspace%20with%20logo%20sketches%20color%20palettes%20and%20brand%20guidelines&image_size=landscape_16_9',
  }
];

const Services = () => {
  const { t } = useTranslation();

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('services.title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('services.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t(service.title)}</h3>
                <p className="text-gray-600 mb-4">{t(service.description)}</p>
                
                <button
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {t('services.contact')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;