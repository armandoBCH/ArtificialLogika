import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ChevronRight, Sparkles, Clock } from 'lucide-react';
import { useEditableContent } from '../contexts/EditableContentContext';

const Hero: React.FC = () => {
  const { content } = useEditableContent();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const dynamicTexts = content.hero.dynamicTexts;

  useEffect(() => {
    const currentText = dynamicTexts[currentTextIndex];
    
    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(pauseTimeout);
    }

    const typingSpeed = isDeleting ? 50 : 100;
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayedText.length < currentText.length) {
          setDisplayedText(currentText.slice(0, displayedText.length + 1));
        } else {
          setIsPaused(true);
        }
      } else {
        // Deleting
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % dynamicTexts.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, isPaused, currentTextIndex, dynamicTexts]);

  const openWhatsApp = () => {
    const phoneNumber = content.company.phone.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    const message = "¡Hola! Me interesa saber más sobre tus servicios de desarrollo web y automatización. ¿Podrías contarme cómo puedes ayudarme?";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center mobile-padding pt-16 sm:pt-20 lg:pt-24">
      <div className="max-w-6xl mx-auto text-center">
        {/* Título principal con efecto typewriting */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 mobile-text-balance">
            {content.hero.title}
            <br />
            <span className="text-primary block mt-2 relative min-h-[1.2em]">
              {displayedText}
              <motion.span
                className="inline-block w-0.5 h-[0.8em] bg-primary ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </span>
            <span className="block mt-2">{content.hero.subtitle}</span>
          </h1>
        </motion.div>

        {/* Subtítulo */}
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mobile-text-balance">
            {content.hero.description}
          </p>
        </motion.div>

        {/* CTA Principal */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              onClick={openWhatsApp}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-medium rounded-xl group relative overflow-hidden button-focus-fix"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="sm:hidden">{content.hero.ctaText}</span>
                <span className="hidden sm:inline">{content.hero.ctaTextLong}</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              
              {/* Efecto de brillo en hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </Button>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-3 text-sm sm:text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 sm:w-8 sm:h-8 bg-primary/20 rounded-full border-2 border-background flex items-center justify-center"
                >
                  <span className="text-primary text-sm">✓</span>
                </div>
              ))}
            </div>
            <span className="mobile-text-balance text-center sm:text-left">
              {content.hero.trustText}
            </span>
          </motion.div>
        </motion.div>

        {/* Availability indicator (más natural) */}
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-muted/20 border border-border/50 rounded-full px-4 py-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground text-sm">
              Disponible para nuevos proyectos • <span className="text-primary font-medium">Respuesta en 24h</span>
            </span>
          </div>
        </motion.div>

        {/* Indicadores de valor */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          {content.hero.stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-4 sm:p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 1.0 }}
              whileHover={{ y: -5 }}
            >
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1 sm:mb-2">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm text-white font-medium">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.sublabel}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center"
            animate={{ 
              borderColor: ["rgba(64, 217, 172, 0.3)", "rgba(64, 217, 172, 0.8)", "rgba(64, 217, 172, 0.3)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-primary rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;