export type Municipality = {
  id: number;
  name: string;
};

// Zonas de entrega (Artemisa) — 10 zonas actuales.
// IMPORTANT: `availableIn` usa estos IDs.
export const artemisaMunicipalities: Municipality[] = [
  { id: 1, name: "Artemisa, San Cristóbal" },
  { id: 2, name: "Artemisa, Candelaria" },
  { id: 4, name: "Artemisa, Mariel" },
  { id: 5, name: "Artemisa, Guanajay" },
  { id: 6, name: "Artemisa, Caimito" },
  { id: 7, name: "Artemisa, Bauta" },
  { id: 8, name: "Artemisa, Artemisa" },
  { id: 9, name: "Artemisa, Alquízar" },
  { id: 10, name: "Artemisa, Güira de Melena" },
  { id: 11, name: "Artemisa, San Antonio de los Baños" },
];
