import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Image3DProps {
  src: string;
  alt: string;
  className?: string;
}

const Image3D = ({ src, alt, className = "" }: Image3DProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const deltaX = (mouseX - centerX) / (rect.width / 2);
    const deltaY = (mouseY - centerY) / (rect.height / 2);
    
    setRotateY(deltaX * 15); // Max rotation 15 degrees
    setRotateX(-deltaY * 15); // Max rotation 15 degrees
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={imageRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
      }}
    >
      <motion.div
        animate={{
          rotateX: rotateX,
          rotateY: rotateY,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: isHovered 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }}
        className="relative rounded-2xl overflow-hidden"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-pink-400/20 rounded-2xl"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-transparent"
          style={{
            background: isHovered 
              ? 'linear-gradient(45deg, #3A86FF, #FF006E) border-box'
              : 'transparent',
            mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Image3D;