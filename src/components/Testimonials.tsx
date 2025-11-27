import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    position: 'CEO, TechStart',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20businesswoman%20headshot%2C%20confident%20smile%2C%20modern%20office%20background&image_size=square',
    rating: 5,
    text: 'Zakaria exceeded our expectations with his creative design solutions. His attention to detail and professional approach made our project a huge success.'
  },
  {
    name: 'Mohamed Al-Rashid',
    position: 'Marketing Director',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20arab%20businessman%20headshot%2C%20confident%20expression%2C%20corporate%20setting&image_size=square',
    rating: 5,
    text: 'Working with Zakaria was an absolute pleasure. His AI development skills are exceptional, and he delivered our project ahead of schedule with outstanding quality.'
  },
  {
    name: 'Lisa Chen',
    position: 'Founder, Creative Studio',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20asian%20woman%20headshot%2C%20creative%20professional%2C%20studio%20background&image_size=square',
    rating: 4,
    text: 'Zakaria\'s photography skills are incredible. He captured our brand essence perfectly and the photos have significantly improved our marketing campaigns.'
  }
];

const Testimonials = () => {
  const { t } = useTranslation();

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.position}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-700 italic">"{testimonial.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;