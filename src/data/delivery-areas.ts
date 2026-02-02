export type ProvinceId = "artemisa" | "habana";

export type Province = {
  id: ProvinceId;
  name: string;
};

export type DeliveryMunicipality = {
  id: number;
  name: string;
  provinceId: ProvinceId;
};

export const provinces: Province[] = [
  { id: "artemisa", name: "Artemisa" },
  { id: "habana", name: "La Habana" },
];

// Artemisa: se reutilizan los IDs existentes (importante porque `availableIn` usa estos IDs).
import { artemisaMunicipalities } from "@/data/municipalities-artemisa";

export const artemisaDeliveryMunicipalities: DeliveryMunicipality[] = artemisaMunicipalities.map((m) => ({
  ...m,
  provinceId: "artemisa",
}));

// La Habana: lista completa de 15 municipios.
// Nota: Estos IDs NO se usan en `availableIn` actualmente; se usan solo para selección.
export const habanaDeliveryMunicipalities: DeliveryMunicipality[] = [
  { id: 101, name: "La Habana, Playa", provinceId: "habana" },
  { id: 102, name: "La Habana, Plaza de la Revolución", provinceId: "habana" },
  { id: 103, name: "La Habana, Centro Habana", provinceId: "habana" },
  { id: 104, name: "La Habana, Habana Vieja", provinceId: "habana" },
  { id: 105, name: "La Habana, Regla", provinceId: "habana" },
  { id: 106, name: "La Habana, Habana del Este", provinceId: "habana" },
  { id: 107, name: "La Habana, Guanabacoa", provinceId: "habana" },
  { id: 108, name: "La Habana, San Miguel del Padrón", provinceId: "habana" },
  { id: 109, name: "La Habana, Diez de Octubre", provinceId: "habana" },
  { id: 110, name: "La Habana, Cerro", provinceId: "habana" },
  { id: 111, name: "La Habana, Marianao", provinceId: "habana" },
  { id: 112, name: "La Habana, La Lisa", provinceId: "habana" },
  { id: 113, name: "La Habana, Boyeros", provinceId: "habana" },
  { id: 114, name: "La Habana, Arroyo Naranjo", provinceId: "habana" },
  { id: 115, name: "La Habana, Cotorro", provinceId: "habana" },
];

export const deliveryMunicipalities: DeliveryMunicipality[] = [
  ...artemisaDeliveryMunicipalities,
  ...habanaDeliveryMunicipalities,
];

export function getMunicipalitiesByProvince(provinceId: ProvinceId) {
  return deliveryMunicipalities.filter((m) => m.provinceId === provinceId);
}

export function findDeliveryMunicipality(provinceId: ProvinceId, municipalityId: number) {
  return (
    deliveryMunicipalities.find((m) => m.provinceId === provinceId && m.id === municipalityId) ?? null
  );
}
