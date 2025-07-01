import { useState, useEffect } from 'react';

interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

const defaultBreakpoints: BreakpointConfig = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  wide: 1536
};

export const useResponsive = (breakpoints: Partial<BreakpointConfig> = {}) => {
  const config = { ...defaultBreakpoints, ...breakpoints };
  
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  });

  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop' | 'wide'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      
      if (width < config.mobile) {
        setDeviceType('mobile');
      } else if (width < config.tablet) {
        setDeviceType('tablet');
      } else if (width < config.desktop) {
        setDeviceType('desktop');
      } else {
        setDeviceType('wide');
      }
    };

    handleResize(); // Set initial values
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [config]);

  return {
    screenSize,
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop' || deviceType === 'wide',
    isWide: deviceType === 'wide',
    breakpoints: config
  };
};

export default useResponsive;