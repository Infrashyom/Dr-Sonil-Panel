import React, { useEffect } from 'react';

export const useSchema = (schema: any, id: string) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById(id);
      if (existing) {
        document.head.removeChild(existing);
      }
    };
  }, [schema, id]);
};

export const GlobalSchemas = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Life Spring",
    "alternateName": "Dr. Sonil Srivastava",
    "url": "https://lifespringbhopal.com/",
    "logo": "https://res.cloudinary.com/dng76zpsa/image/upload/v1768086484/dr_sonil/config/i4aqqybgbjmzzlrw3zoj.jpg",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91 9897576976",
      "contactType": "customer service",
      "contactOption": "TollFree",
      "areaServed": "IN",
      "availableLanguage": "en"
    },
    "sameAs": [
      "https://www.instagram.com/dr.sonil.srivastava",
      "https://www.facebook.com/sonil.srivastava/",
      "https://www.youtube.com/channel/UCSMNsQZNUGuwAq61AHlYn7w"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "Gynecologic",
    "name": "Life Spring",
    "image": "https://res.cloudinary.com/dng76zpsa/image/upload/v1768086484/dr_sonil/config/i4aqqybgbjmzzlrw3zoj.jpg",
    "@id": "",
    "url": "https://lifespringbhopal.com/",
    "telephone": "+91 9897576976",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "E-3/148, 10 Number Stop, Near Agarwal Hospital, E-3, Arera Colony.",
      "addressLocality": "Bhopal",
      "postalCode": "462016",
      "addressCountry": "IN"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "10:00",
      "closes": "08:00"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": "Life Spring",
    "url": "https://lifespringbhopal.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org/", 
    "@type": "BreadcrumbList", 
    "itemListElement": [{
      "@type": "ListItem", 
      "position": 1, 
      "name": "Home",
      "item": "https://lifespringbhopal.com/"  
    },{
      "@type": "ListItem", 
      "position": 2, 
      "name": "Contact",
      "item": "https://lifespringbhopal.com/contact"  
    },{
      "@type": "ListItem", 
      "position": 3, 
      "name": "About",
      "item": "https://lifespringbhopal.com/about"  
    },{
      "@type": "ListItem", 
      "position": 4, 
      "name": "Services",
      "item": "https://lifespringbhopal.com/services"  
    },{
      "@type": "ListItem", 
      "position": 5, 
      "name": "Gallery",
      "item": "https://lifespringbhopal.com/gallery"  
    },{
      "@type": "ListItem", 
      "position": 6, 
      "name": "Doctors",
      "item": "https://lifespringbhopal.com/doctors"  
    },{
      "@type": "ListItem", 
      "position": 7, 
      "name": "Blogs",
      "item": "https://lifespringbhopal.com/blogs"  
    }]
  };

  useSchema(organizationSchema, 'organization-schema');
  useSchema(localBusinessSchema, 'local-business-schema');
  useSchema(websiteSchema, 'website-schema');
  useSchema(breadcrumbSchema, 'breadcrumb-schema');

  return null;
};

export const BlogSchema = ({ blogId, headline, description, image, datePublished, dateModified }: any) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://lifespringbhopal.com/blogs/${blogId}`
    },
    "headline": headline,
    "description": description,
    "image": image || "https://res.cloudinary.com/dng76zpsa/image/upload/v1768086484/dr_sonil/config/i4aqqybgbjmzzlrw3zoj.jpg",
    "author": {
      "@type": "Person",
      "name": "Dr. Sonil Srivastava"
    },  
    "publisher": {
      "@type": "Organization",
      "name": "Life Spring",
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/dng76zpsa/image/upload/v1768086484/dr_sonil/config/i4aqqybgbjmzzlrw3zoj.jpg"
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished
  };

  useSchema(schema, `blog-schema-${blogId}`);

  return null;
};
