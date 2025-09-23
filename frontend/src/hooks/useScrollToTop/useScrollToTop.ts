import { useEffect } from 'react';
import { UseScrollToTopOptions } from './useScrollToTop.types';

export const useScrollToTop = (options: UseScrollToTopOptions = {}) => {
  const { 
    smooth = true, 
    delay = 0, 
    condition = true 
  } = options;

  useEffect(() => {
    if (!condition) return;

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: smooth ? 'smooth' : 'auto'
      });
    };

    if (delay > 0) {
      const timer = setTimeout(scrollToTop, delay);
      return () => clearTimeout(timer);
    } else {
      scrollToTop();
    }
  }, [smooth, delay, condition]);
};

export const scrollToTopInstantly = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto'
  });
};

export const scrollToTopSmoothly = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};
