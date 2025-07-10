import { useCallback } from 'react';

const useScrollToTop = () => {
  const scrollToTop = useCallback((behavior = 'smooth') => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior
    });
  }, []);

  const scrollToElement = useCallback((elementId, offset = 0, behavior = 'smooth') => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        left: 0,
        behavior
      });
    }
  }, []);

  const scrollToSection = useCallback((sectionId, offset = 80, behavior = 'smooth') => {
    const section = document.getElementById(sectionId);
    if (section) {
      const sectionPosition = section.offsetTop - offset;
      window.scrollTo({
        top: sectionPosition,
        left: 0,
        behavior
      });
    }
  }, []);

  return {
    scrollToTop,
    scrollToElement,
    scrollToSection
  };
};

export default useScrollToTop; 