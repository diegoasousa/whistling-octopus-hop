'use client';

import type { Product } from '@/types/api';
import { getProductTitle, getProductPriceCents, getProductPrimaryImage } from '@/lib/products';

interface ProductJsonLdProps {
  product: Product;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const title = getProductTitle(product);
  const priceCents = getProductPriceCents(product);
  const image = getProductPrimaryImage(product);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoulpulse.com.br';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    image: image ? [image] : undefined,
    description: product.description || `${title} - Produto oficial K-pop`,
    sku: product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Seoul Pulse',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.id}`,
      priceCurrency: 'BRL',
      price: (priceCents / 100).toFixed(2),
      availability: product.isActive
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    },
    category: product.category || product.type || 'K-pop Merchandise',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
