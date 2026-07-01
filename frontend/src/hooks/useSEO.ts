import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export const useSEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonicalUrl,
  noIndex = false,
}: SEOProps) => {
  useEffect(() => {
    // 1. Set Document Title
    const formattedTitle = title ? `${title} | Desa Telukambulu` : 'Desa Telukambulu';
    document.title = formattedTitle;

    // Helper function to create or update meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attributeName = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attributeName}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to create or update link tags
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Core Search Engine Tags
    if (description) {
      setMetaTag('description', description);
    }
    if (keywords) {
      setMetaTag('keywords', keywords);
    }

    // 3. Robots Indexing
    setMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // 4. Canonical URL
    const canonical = canonicalUrl || window.location.href;
    setLinkTag('canonical', canonical);

    // 5. Open Graph Meta Tags
    setMetaTag('og:title', formattedTitle, true);
    if (description) {
      setMetaTag('og:description', description, true);
    }
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:url', canonical, true);
    setMetaTag('og:locale', 'id_ID', true);
    
    // Open Graph Image (default fallback to logo-desa or custom image)
    const fallbackImage = `${window.location.origin}/logo-desa.png`;
    setMetaTag('og:image', ogImage || fallbackImage, true);

    // 6. Twitter Card Meta Tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', formattedTitle);
    if (description) {
      setMetaTag('twitter:description', description);
    }
    setMetaTag('twitter:image', ogImage || fallbackImage);

  }, [title, description, keywords, ogImage, ogType, canonicalUrl, noIndex]);
};

export default useSEO;
