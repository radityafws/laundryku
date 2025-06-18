import { useState, useEffect } from 'react';

interface LandingPageData {
  business: {
    name: string;
    tagline: string;
    description: string;
    logo: string;
  };
  hero: {
    badge: {
      icon: string;
      text: string;
    };
    title: {
      main: string;
      highlight: string;
      subtitle: string;
    };
    features: Array<{
      icon: string;
      text: string;
    }>;
    cta: Array<{
      text: string;
      icon: string;
      type: string;
      link: string;
    }>;
    animation: {
      washingMachine: {
        colors: string[];
        floatingElements: Array<{
          icon: string;
          position: string;
        }>;
      };
    };
  };
  about: {
    title: {
      main: string;
      highlight: string;
    };
    description: string;
    location: {
      icon: string;
      title: string;
      description: string;
    };
    stats: Array<{
      icon: string;
      value: string;
      label: string;
      color: string;
    }>;
  };
  features: {
    title: {
      main: string;
      highlight: string;
    };
    subtitle: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
      gradient: string;
    }>;
    additionalInfo: Array<{
      icon: string;
      title: string;
      subtitle: string;
    }>;
  };
  contact: {
    title: {
      main: string;
      highlight: string;
    };
    subtitle: string;
    info: Array<{
      icon: string;
      title: string;
      content: string;
      gradient: string;
      link?: string;
    }>;
    cta: {
      title: string;
      subtitle: string;
      buttons: Array<{
        text: string;
        icon: string;
        type: string;
        color: string;
        link: string;
      }>;
    };
  };
  footer: {
    brand: {
      name: string;
      logo: string;
      description: string;
    };
    sections: Array<{
      title: string;
      items: Array<string | { text: string; link: string }>;
    }>;
    copyright: string;
  };
  navigation: {
    logo: {
      icon: string;
      text: string;
    };
    menu: Array<{
      text: string;
      link: string;
    }>;
  };
}

export const useLandingPageData = () => {
  const [data, setData] = useState<LandingPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/landing-page.json');
        
        if (!response.ok) {
          throw new Error('Failed to load landing page data');
        }
        
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error loading landing page data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, isLoading, error };
};