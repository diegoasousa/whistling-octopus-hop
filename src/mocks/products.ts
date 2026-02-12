import type { Product } from "@/types/api";

function svgDataUri(title: string, hue: number) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
  <rect width="900" height="900" rx="64" fill="hsl(${hue} 55% 12%)"/>
  <circle cx="140" cy="140" r="120" fill="hsl(${(hue + 30) % 360} 85% 60%)" opacity="0.2"/>
  <circle cx="760" cy="760" r="180" fill="hsl(${(hue + 90) % 360} 85% 60%)" opacity="0.15"/>
  <text x="80" y="520" font-size="44" font-family="ui-sans-serif, system-ui" fill="hsl(0 0% 96%)" letter-spacing="1.2">${title}</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function buildProduct(opts: {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  type: Product["type"];
  hue: number;
  createdAt: string;
}): Product {
  return {
    id: opts.id,
    name: opts.name,
    description: opts.description,
    priceCents: opts.priceCents,
    type: opts.type,
    images: [
      svgDataUri(opts.name, opts.hue),
      svgDataUri(`${opts.name} • detalhe`, (opts.hue + 20) % 360),
    ],
    isActive: true,
    createdAt: opts.createdAt,
  };
}

export const MOCK_PRODUCTS: Product[] = [
  buildProduct({
    id: "lightstick-aurora-01",
    name: "Lightstick Aurora Prism",
    description: "Brilho suave com acabamento translúcido e grip antiderrapante.",
    priceCents: 18900,
    type: "LIGHTSTICK",
    hue: 280,
    createdAt: "2025-11-18T10:00:00.000Z",
  }),
  buildProduct({
    id: "lightstick-neon-02",
    name: "Lightstick Neon Pulse",
    description: "Modo neon com ponteira difusora e alça ajustável.",
    priceCents: 21900,
    type: "LIGHTSTICK",
    hue: 315,
    createdAt: "2025-11-15T10:00:00.000Z",
  }),
  buildProduct({
    id: "lightstick-glow-03",
    name: "Lightstick Glow Core",
    description: "Luz potente com acabamento metálico e bateria recarregável.",
    priceCents: 24900,
    type: "LIGHTSTICK",
    hue: 200,
    createdAt: "2025-11-12T10:00:00.000Z",
  }),
  buildProduct({
    id: "lightstick-stellar-04",
    name: "Lightstick Stellar Pop",
    description: "Cápsula de luz com efeito shimmer e pulseira holográfica.",
    priceCents: 19900,
    type: "LIGHTSTICK",
    hue: 260,
    createdAt: "2025-11-08T10:00:00.000Z",
  }),
  buildProduct({
    id: "lightstick-night-05",
    name: "Lightstick Night Bloom",
    description: "Design compacto com luz suave e acabamento fosco.",
    priceCents: 16900,
    type: "LIGHTSTICK",
    hue: 330,
    createdAt: "2025-11-01T10:00:00.000Z",
  }),
  buildProduct({
    id: "photocard-cosmic-01",
    name: "Photocard Cosmic Set",
    description: "Coleção com 5 cards glossy e borda holográfica.",
    priceCents: 3900,
    type: "PHOTOCARD",
    hue: 140,
    createdAt: "2025-10-28T10:00:00.000Z",
  }),
  buildProduct({
    id: "photocard-dream-02",
    name: "Photocard Dream Pop",
    description: "Edição pastel com acabamento soft touch.",
    priceCents: 2900,
    type: "PHOTOCARD",
    hue: 60,
    createdAt: "2025-10-20T10:00:00.000Z",
  }),
  buildProduct({
    id: "photocard-neon-03",
    name: "Photocard Neon Beat",
    description: "Coleção vibrante com efeito neon e textura premium.",
    priceCents: 3400,
    type: "PHOTOCARD",
    hue: 20,
    createdAt: "2025-10-14T10:00:00.000Z",
  }),
  buildProduct({
    id: "photocard-luxe-04",
    name: "Photocard Luxe Frame",
    description: "Kit com frames para exibir seus cards favoritos.",
    priceCents: 4400,
    type: "PHOTOCARD",
    hue: 340,
    createdAt: "2025-10-08T10:00:00.000Z",
  }),
  buildProduct({
    id: "photocard-spark-05",
    name: "Photocard Spark Mix",
    description: "Mix colecionável com acabamento brillante.",
    priceCents: 2400,
    type: "PHOTOCARD",
    hue: 110,
    createdAt: "2025-10-01T10:00:00.000Z",
  }),
  buildProduct({
    id: "merch-fandom-01",
    name: "Merch Fandom Star",
    description: "Botton metálico com acabamento fosco e fecho seguro.",
    priceCents: 1200,
    type: "MERCH",
    hue: 180,
    createdAt: "2025-09-26T10:00:00.000Z",
  }),
  buildProduct({
    id: "merch-neon-02",
    name: "Merch Neon Icon",
    description: "Conjunto com 3 bottons em cores neon.",
    priceCents: 1800,
    type: "MERCH",
    hue: 30,
    createdAt: "2025-09-20T10:00:00.000Z",
  }),
  buildProduct({
    id: "merch-glitter-03",
    name: "Merch Glitter Pop",
    description: "Botton com acabamento glitter e textura premium.",
    priceCents: 1500,
    type: "MERCH",
    hue: 300,
    createdAt: "2025-09-14T10:00:00.000Z",
  }),
  buildProduct({
    id: "merch-collect-04",
    name: "Merch Collect Pack",
    description: "Pack colecionável com 4 itens temáticos.",
    priceCents: 2200,
    type: "MERCH",
    hue: 240,
    createdAt: "2025-09-10T10:00:00.000Z",
  }),
  buildProduct({
    id: "merch-minimal-05",
    name: "Merch Minimal Chic",
    description: "Acessório com visual minimalista e acabamento matte.",
    priceCents: 900,
    type: "MERCH",
    hue: 90,
    createdAt: "2025-09-04T10:00:00.000Z",
  }),
  buildProduct({
    id: "album-deluxe-01",
    name: "Album Deluxe Edition",
    description: "Álbum de luxo com photobook, CD e incluso bônus.",
    priceCents: 4900,
    type: "ALBUM",
    hue: 210,
    createdAt: "2025-08-28T10:00:00.000Z",
  }),
  buildProduct({
    id: "album-standard-02",
    name: "Album Standard",
    description: "Edição padrão com CD e livreto visual.",
    priceCents: 3900,
    type: "ALBUM",
    hue: 270,
    createdAt: "2025-08-22T10:00:00.000Z",
  }),
  buildProduct({
    id: "doll-limited-03",
    name: "Doll Limited Edition",
    description: "Boneco articulado com roupas temáticas.",
    priceCents: 5900,
    type: "DOLL",
    hue: 150,
    createdAt: "2025-08-18T10:00:00.000Z",
  }),
  buildProduct({
    id: "doll-figure-04",
    name: "Doll Figure Collectible",
    description: "Figura colecionável com base de exibição.",
    priceCents: 4200,
    type: "DOLL",
    hue: 10,
    createdAt: "2025-08-12T10:00:00.000Z",
  }),
  buildProduct({
    id: "other-charm-05",
    name: "Charm Mini Collection",
    description: "Pingentes mini para personalizar kits de fã.",
    priceCents: 2900,
    type: "OTHER",
    hue: 120,
    createdAt: "2025-08-05T10:00:00.000Z",
  }),
];
