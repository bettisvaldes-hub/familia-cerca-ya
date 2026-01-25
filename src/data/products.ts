import { combos } from "@/data/combos";

export type Product = {
  id: string;
  name: string;
  shortDescription: string;
  priceUsd: number;
  image: string;
  /** id de subcategoría o categoría (según storeCategories) */
  categoryId: string;
  /** Lista opcional (útil para combos) */
  included?: string[];
};

const placeholder = "/placeholder.svg";

const comboCategoryToStoreCategoryId = {
  economicos: "mini-combos-economicos",
  familiares: "combos-familiares",
  premium: "combos-premium",
} as const;

const comboProducts: Product[] = combos.map((c) => ({
  id: `combo-${c.id}`,
  name: c.name,
  shortDescription: c.shortDescription,
  priceUsd: c.priceUsd,
  image: c.image,
  categoryId: comboCategoryToStoreCategoryId[c.category],
  included: c.included,
}));

// Productos demo para poblar TODAS las categorías/subcategorías.
// TODO: Sustituir por inventario real (SKU, unidad, stock, etc.).
export const products: Product[] = [
  ...comboProducts,

  // Cárnicos y embutidos
  { id: "pollo-pechuga", name: "Pechuga de pollo (1 kg)", shortDescription: "Corte magro, ideal para comidas rápidas.", priceUsd: 8.99, image: placeholder, categoryId: "pollo" },
  { id: "cerdo-lomo", name: "Lomo de cerdo (1 kg)", shortDescription: "Excelente para asar u hornear.", priceUsd: 10.5, image: placeholder, categoryId: "cerdo" },
  { id: "res-bistec", name: "Bistec de res (1 kg)", shortDescription: "Corte clásico para plancha.", priceUsd: 12.75, image: placeholder, categoryId: "res" },
  { id: "embutidos-jamon", name: "Jamón cocido (500 g)", shortDescription: "Perfecto para desayunos y sándwiches.", priceUsd: 6.25, image: placeholder, categoryId: "embutidos" },

  // Cereales, pastas y granos
  { id: "arroz-1kg", name: "Arroz (1 kg)", shortDescription: "Grano seleccionado para el día a día.", priceUsd: 2.25, image: placeholder, categoryId: "arroz" },
  { id: "frijoles-negros", name: "Frijoles negros (1 kg)", shortDescription: "Básico de la cocina.", priceUsd: 3.1, image: placeholder, categoryId: "frijoles" },
  { id: "azucar-1kg", name: "Azúcar (1 kg)", shortDescription: "Para café, postres y más.", priceUsd: 1.95, image: placeholder, categoryId: "azucar" },
  { id: "harina-1kg", name: "Harina (1 kg)", shortDescription: "Multiuso para panes y masas.", priceUsd: 2.05, image: placeholder, categoryId: "harinas" },
  { id: "pasta-espagueti", name: "Pasta espagueti (500 g)", shortDescription: "Rinde y se cocina rápido.", priceUsd: 1.75, image: placeholder, categoryId: "pastas" },

  // Lácteos y huevos
  { id: "leche-uht", name: "Leche UHT (1 L)", shortDescription: "Larga duración.", priceUsd: 2.4, image: placeholder, categoryId: "leche" },
  { id: "huevos-30", name: "Huevos (cartón 30)", shortDescription: "Para desayunos y cocina diaria.", priceUsd: 7.99, image: placeholder, categoryId: "huevos" },
  { id: "yogurt-natural", name: "Yogurt natural (1 L)", shortDescription: "Ideal para batidos.", priceUsd: 3.65, image: placeholder, categoryId: "yogurt" },
  { id: "helado-vainilla", name: "Helado de vainilla (1 L)", shortDescription: "Postre familiar.", priceUsd: 5.5, image: placeholder, categoryId: "helados" },

  // Conservas y enlatados
  { id: "pasta-tomate", name: "Pasta de tomate (400 g)", shortDescription: "Base para salsas.", priceUsd: 1.85, image: placeholder, categoryId: "pastas-de-tomate" },
  { id: "mayonesa-390", name: "Mayonesa (390 g)", shortDescription: "Clásica para ensaladas.", priceUsd: 2.95, image: placeholder, categoryId: "mayonesa" },
  { id: "enlatados-mixtos", name: "Enlatados surtidos", shortDescription: "Atún, sardinas y más (según disponibilidad).", priceUsd: 6.9, image: placeholder, categoryId: "enlatados-varios" },

  // Mercado
  { id: "aceite-1l", name: "Aceite vegetal (1 L)", shortDescription: "Cocina diaria.", priceUsd: 3.95, image: placeholder, categoryId: "aceite" },
  { id: "cafe-molido", name: "Café molido (250 g)", shortDescription: "Aroma intenso.", priceUsd: 4.2, image: placeholder, categoryId: "cafe" },
  { id: "chocolate-tableta", name: "Chocolate (tableta)", shortDescription: "Para merienda o repostería.", priceUsd: 2.15, image: placeholder, categoryId: "chocolate" },
  { id: "refresco-2l", name: "Refresco (2 L)", shortDescription: "Para compartir.", priceUsd: 2.75, image: placeholder, categoryId: "refrescos" },
  { id: "condimentos-mixtos", name: "Condimentos surtidos", shortDescription: "Sazón para tus comidas.", priceUsd: 3.6, image: placeholder, categoryId: "condimentos" },

  // Aseo
  { id: "jabon-barra", name: "Jabón de baño (barra)", shortDescription: "Uso diario.", priceUsd: 1.1, image: placeholder, categoryId: "jabon" },
  { id: "detergente-1kg", name: "Detergente (1 kg)", shortDescription: "Limpieza profunda.", priceUsd: 3.25, image: placeholder, categoryId: "detergente" },
  { id: "papel-higienico-4", name: "Papel higiénico (4 rollos)", shortDescription: "Paquete básico.", priceUsd: 2.4, image: placeholder, categoryId: "papel-higienico" },
  { id: "limpieza-desinfectante", name: "Desinfectante multiuso", shortDescription: "Para superficies del hogar.", priceUsd: 2.9, image: placeholder, categoryId: "productos-de-limpieza" },

  // Agro (viandas y vegetales)
  { id: "malanga-1kg", name: "Malanga (1 kg)", shortDescription: "Vianda tradicional.", priceUsd: 2.8, image: placeholder, categoryId: "malanga" },
  { id: "boniato-1kg", name: "Boniato (1 kg)", shortDescription: "Ideal para hervir o freír.", priceUsd: 2.3, image: placeholder, categoryId: "boniato" },
  { id: "ajo-250g", name: "Ajo (250 g)", shortDescription: "Base de la cocina.", priceUsd: 1.6, image: placeholder, categoryId: "ajo" },
  { id: "frescos-surtidos", name: "Productos frescos surtidos", shortDescription: "Según disponibilidad del día.", priceUsd: 6.5, image: placeholder, categoryId: "productos-frescos" },

  // Líquidos
  { id: "cerveza-6pack", name: "Cervezas (6 pack)", shortDescription: "Para celebraciones.", priceUsd: 7.2, image: placeholder, categoryId: "cervezas" },
  { id: "malta-1l", name: "Malta (1 L)", shortDescription: "Bebida clásica.", priceUsd: 2.2, image: placeholder, categoryId: "maltas" },
  { id: "bebida-jugo", name: "Bebida/Jugo (1 L)", shortDescription: "Para toda la familia.", priceUsd: 2.0, image: placeholder, categoryId: "bebidas" },
  { id: "licor-ron", name: "Licor (ron)", shortDescription: "Disponible según inventario.", priceUsd: 12.0, image: placeholder, categoryId: "licores" },

  // Electrodomésticos
  { id: "olla-presion", name: "Olla de presión", shortDescription: "Cocina más rápido.", priceUsd: 29.99, image: placeholder, categoryId: "ollas" },
  { id: "arrocera-basica", name: "Arrocera básica", shortDescription: "Ideal para el día a día.", priceUsd: 34.99, image: placeholder, categoryId: "arroceras" },
  { id: "fogon-electrico", name: "Fogón eléctrico", shortDescription: "Práctico y compacto.", priceUsd: 39.99, image: placeholder, categoryId: "fogones" },
  { id: "lavadora-compacta", name: "Lavadora compacta", shortDescription: "Para espacios reducidos.", priceUsd: 199.0, image: placeholder, categoryId: "lavadoras" },
  { id: "refrigerador-7p", name: "Refrigerador 7 pies", shortDescription: "Capacidad familiar.", priceUsd: 329.0, image: placeholder, categoryId: "refrigeracion" },
  { id: "tv-32", name: "TV 32\"", shortDescription: "Entretenimiento en casa.", priceUsd: 149.0, image: placeholder, categoryId: "tvs-y-pequenos-electrodomesticos" },
];
