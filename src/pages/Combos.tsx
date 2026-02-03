import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "@/data/products";
import { ProductCard } from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSeo } from "@/hooks/use-seo";
import { flattenStoreCategories, storeCategories } from "@/data/categories";
import { normalizeCategoryId } from "@/data/legacy-catalog";
import { useMunicipality } from "@/context/municipality";
import { filterAndSortByQuery } from "@/lib/search";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import {
  findDeliveryMunicipality,
  getMunicipalitiesByProvince,
  provinces,
  type ProvinceId,
} from "@/data/delivery-areas";

type StoreCategoryId = ReturnType<typeof flattenStoreCategories>[number]["id"];

const flatCategories = flattenStoreCategories(storeCategories);
const topLevelFilters: Array<{ id: StoreCategoryId; label: string }> = storeCategories.map(
  (c) => ({ id: c.id as StoreCategoryId, label: c.label }),
);

export default function Combos() {
  useSeo({
    title: "Tienda | Catálogo en USD",
    description:
      "Explora productos por categorías y compra en USD con entrega local. Agrega al carrito y completa el pago en 3 pasos.",
    canonicalPath: "/tienda",
  });

  const { municipality, setMunicipality } = useMunicipality();
  const [provinceDraftId, setProvinceDraftId] = useState<ProvinceId>(municipality?.provinceId ?? "artemisa");
  const [municipalityDraftId, setMunicipalityDraftId] = useState<string>(municipality ? String(municipality.id) : "");

  const [query, setQuery] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const initial = normalizeCategoryId(searchParams.get("cat") || "combos") as StoreCategoryId;
  const [filter, setFilter] = useState<StoreCategoryId>(initial);

  useEffect(() => {
    const cat = normalizeCategoryId(searchParams.get("cat") || "combos") as StoreCategoryId;
    setFilter(cat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filtered = useMemo(() => {
    const parentById = new Map(flatCategories.map((c) => [c.id, c.parentId] as const));
    const isTopLevel = storeCategories.some((c) => c.id === filter);
    const byCategory = products.filter((p) => {
      if (p.categoryId === filter) return true;
      if (!isTopLevel) return false;
      const parent = parentById.get(p.categoryId);
      return parent === filter;
    });

    // Filtrado por grupo (según selección):
    // Grupo 1 -> San Cristóbal (1) + Candelaria (2)
    // Grupo 2 -> resto de Artemisa + todos los municipios de La Habana
    //
    // Regla por disponibilidad (recomendado):
    // - availableIn === undefined -> disponible para ambos grupos
    // - availableIn: []           -> NO disponible
    // - Grupo 1: debe incluir 1 o 2
    // - Grupo 2: debe incluir algún municipio distinto de 1 o 2
    if (!municipality) return byCategory;

    const isGroup1 = municipality.provinceId === "artemisa" && (municipality.id === 1 || municipality.id === 2);

    return byCategory.filter((p) => {
      if (p.availableIn === undefined) return true;
      if (!p.availableIn.length) return false;

      if (isGroup1) return p.availableIn.some((id) => id === 1 || id === 2);
      return p.availableIn.some((id) => id !== 1 && id !== 2);
    });
  }, [filter, municipality]);

  const filteredAndSearched = useMemo(() => {
    // Si hay búsqueda, NO la limitamos a la categoría seleccionada.
    // Mantiene el filtro por municipio (disponibilidad).
    if (query.trim()) {
      const base = !municipality
        ? products
        : products.filter((p) => {
            const isGroup1 =
              municipality.provinceId === "artemisa" && (municipality.id === 1 || municipality.id === 2);
            if (p.availableIn === undefined) return true;
            if (!p.availableIn.length) return false;
            if (isGroup1) return p.availableIn.some((id) => id === 1 || id === 2);
            return p.availableIn.some((id) => id !== 1 && id !== 2);
          });
      return filterAndSortByQuery(base, query, (p) => p.name);
    }

    // Sin búsqueda: respetamos categoría + municipio.
    return filtered;
  }, [filtered, query, municipality]);

  const filterLabel =
    flatCategories.find((c) => c.id === filter)?.label ?? "Tienda";

  return (
    <main className="container py-10">
      <Dialog open={!municipality}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="font-serif">Selecciona tu municipio</DialogTitle>
            <DialogDescription>
              Selecciona primero la provincia y luego tu municipio para mostrar solo lo disponible.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div className="grid gap-2">
              <Select
                value={provinceDraftId}
                onValueChange={(v) => {
                  setProvinceDraftId(v as ProvinceId);
                  setMunicipalityDraftId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Provincia" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={municipalityDraftId} onValueChange={setMunicipalityDraftId}>
                <SelectTrigger>
                  <SelectValue placeholder="Municipio" />
                </SelectTrigger>
                <SelectContent>
                  {getMunicipalitiesByProvince(provinceDraftId).map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Puedes cambiar el municipio después desde la tienda.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="cta"
              disabled={!municipalityDraftId}
              onClick={() => {
                const next = findDeliveryMunicipality(provinceDraftId, Number(municipalityDraftId));
                setMunicipality(next);
              }}
            >
              Ver productos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl">Tienda · {filterLabel}</h1>
          <p className="mt-2 text-muted-foreground">
            Entregamos en Artemisa y La Habana (Cuba).{municipality ? ` Municipio: ${municipality.name}.` : ""}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
          <div className="relative w-full sm:w-[320px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos (por nombre)…"
              className="h-9 pl-9 pr-9"
              aria-label="Buscar productos"
            />
            {query ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                onClick={() => setQuery("")}
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
          <Select
            value={municipality ? municipality.provinceId : ""}
            onValueChange={(v) => {
              const nextProvince = v as ProvinceId;
              setProvinceDraftId(nextProvince);
              setMunicipality(null);
              setMunicipalityDraftId("");
            }}
          >
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Provincia" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={municipality ? String(municipality.id) : ""}
            onValueChange={(v) => {
              const activeProvince = municipality?.provinceId ?? provinceDraftId;
              const next = findDeliveryMunicipality(activeProvince, Number(v));
              setMunicipality(next);
              setMunicipalityDraftId(v);
            }}
          >
            <SelectTrigger className="h-9 w-[260px]">
              <SelectValue placeholder="Municipio" />
            </SelectTrigger>
            <SelectContent>
              {getMunicipalitiesByProvince(municipality?.provinceId ?? provinceDraftId).map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {topLevelFilters.map((c) => (
            <Button
              key={c.id}
              variant={filter === c.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFilter(c.id);
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.set("cat", c.id);
                  return next;
                });
              }}
              className="whitespace-nowrap"
            >
              {c.label}
            </Button>
          ))}
          </div>
        </div>
      </header>

      <section className="mt-4 rounded-lg border bg-card p-4">
        <p className="font-medium">
          OFERTA -5% <span className="text-muted-foreground">(ya aplicada)</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Verás el precio original tachado y el precio final con el descuento en cada producto.
        </p>
      </section>

      {filteredAndSearched.length > 0 ? (
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {filteredAndSearched.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <section className="mt-8 rounded-lg border bg-card p-6">
          {query ? (
            <>
              <p className="font-medium">No encontramos resultados</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Prueba con menos palabras o un nombre similar (ej: “pollo”, “arroz”, “aceite”).
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">Aún no hay productos en esta categoría</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Ya dejamos la estructura lista. ¿Quieres que empecemos a cargar el inventario para “{filterLabel}”?
              </p>
            </>
          )}
        </section>
      )}
    </main>
  );
}

