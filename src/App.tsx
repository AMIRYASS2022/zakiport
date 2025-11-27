import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Portfolio from './components/Portfolio';
import ImageGallery from './components/ImageGallery';
import Gallery3D from './components/Gallery3D';
import Contact from './components/Contact';
import { useRTL } from './hooks/useRTL';

function App() {
  const { isRTL } = useRTL();

  useEffect(() => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }, []);

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <Services />
        <Testimonials />
        <About />
        <Portfolio />
        <Gallery3D />
        <ImageGallery />
        <Contact />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Zakaria Dahbaoui</h3>
            <p className="text-gray-400 mb-6">
              Professional Designer & AI Developer
            </p>
            <div className="flex justify-center space-x-6">
              <a href="https://facebook.com/zdahbaoui" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="https://www.instagram.com/zakariadahbaoui/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                Instagram
              </a>
              <a href="https://linkedin.com/in/zdahbaoui" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="https://behance.net/zdahbaoui" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                Behance
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-400">
                © 2024 Zakaria Dahbaoui. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;