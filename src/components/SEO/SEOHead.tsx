import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  canonical?: string;
}

export function SEOHead({
  title = "CRNMN - Premium Corn Restaurant | Fresh Corn Dishes & More",
  description = "Discover the finest corn dishes at CRNMN. From sweet corn delights to spicy fritters, we serve fresh, delicious corn-based meals. Order online for delivery or dine-in. Premium quality, authentic flavors.",
  keywords = "corn restaurant, corn dishes, sweet corn, corn fritters, corn soup, vegetarian food, Malaysian corn, fresh corn, corn delivery, corn menu",
  image = "/og-image.jpg",
  url = "https://crnmn-website.vercel.app",
  type = "website",
  author = "CRNMN Restaurant",
  publishedTime,
  modifiedTime,
  section,
  tags = ["corn", "restaurant", "food", "delivery", "vegetarian"],
  noindex = false,
  canonical
}: SEOHeadProps) {
  const fullTitle = title.includes("CRNMN") ? title : `${title} | CRNMN`;
  const fullUrl = canonical || url;
  const fullImage = image.startsWith('http') ? image : `${url}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="CRNMN Restaurant" />
      <meta property="og:locale" content="en_MY" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />
      <meta property="twitter:site" content="@CRNMNRestaurant" />
      <meta property="twitter:creator" content="@CRNMNRestaurant" />

      {/* Article specific */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Additional SEO */}
      <meta name="theme-color" content="#00ff88" />
      <meta name="msapplication-TileColor" content="#00ff88" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "name": "CRNMN Restaurant",
          "description": description,
          "url": fullUrl,
          "logo": `${url}/logo.png`,
          "image": fullImage,
          "telephone": "+601121112919",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Corn Street",
            "addressLocality": "Kuala Lumpur",
            "addressRegion": "Kuala Lumpur",
            "postalCode": "50000",
            "addressCountry": "MY"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "3.1390",
            "longitude": "101.6869"
          },
          "openingHours": [
            "Mo-Su 10:00-22:00"
          ],
          "servesCuisine": "Corn-based dishes",
          "priceRange": "$$",
          "acceptsReservations": true,
          "hasMenu": `${url}/menu`,
          "paymentAccepted": ["Cash", "Credit Card", "Touch 'n Go", "GrabPay"],
          "currenciesAccepted": "MYR",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "124"
          },
          "sameAs": [
            "https://www.facebook.com/CRNMNRestaurant",
            "https://www.instagram.com/CRNMNRestaurant",
            "https://www.twitter.com/CRNMNRestaurant"
          ]
        })}
      </script>

      {/* Menu Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Menu",
          "name": "CRNMN Menu",
          "description": "Our premium corn-based dishes menu",
          "url": `${url}/menu`,
          "hasMenuSection": [
            {
              "@type": "MenuSection",
              "name": "Appetizers",
              "description": "Start your meal with our delicious corn appetizers",
              "hasMenuItem": [
                {
                  "@type": "MenuItem",
                  "name": "Sweet Corn Delight",
                  "description": "Fresh sweet corn kernels with butter and herbs",
                  "offers": {
                    "@type": "Offer",
                    "price": "8.50",
                    "priceCurrency": "MYR"
                  }
                }
              ]
            }
          ]
        })}
      </script>
    </Helmet>
  );
}
