import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { combos, type ComboCategory } from "@/data/combos";
import { ComboCard } from "@/components/store/ComboCard";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";
import { flattenStoreCategories, storeCategories } from "@/data/categories";

type StoreCategoryId = ReturnType<typeof flattenStoreCategories>[number]["id"];

function comboToStoreCategory(comboCategory: ComboCategory): StoreCategoryId {
  switch (comboCategory) {
    case "economicos":
      return "mini-combos-economicos";
    case "familiares":
      return "combos-familiares";
    case "premium":
      return "combos-premium";
    default:
      return "combos";
  }
}

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

  const [searchParams, setSearchParams] = useSearchParams();
  const initial = (searchParams.get("cat") || "combos") as StoreCategoryId;
  const [filter, setFilter] = useState<StoreCategoryId>(initial);

  useEffect(() => {
    const cat = (searchParams.get("cat") || "combos") as StoreCategoryId;
    setFilter(cat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filtered = useMemo(() => {
    // “Combos” es solo una categoría más dentro de la tienda.
    if (filter === "combos") return combos;
    // Subcategorías de combos mapeadas desde el dataset actual.
    if (
      filter === "combos-familiares" ||
      filter === "combos-premium" ||
      filter === "mini-combos-economicos"
    ) {
      return combos.filter((c) => comboToStoreCategory(c.category) === filter);
    }
    // Resto de categorías: aún sin productos.
    return [];
  }, [filter]);

  const filterLabel =
    flatCategories.find((c) => c.id === filter)?.label ?? "Tienda";

  return (
    <main className="container py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl">Tienda · {filterLabel}</h1>
          <p className="mt-2 text-muted-foreground">
            Navega por categorías y agrega productos al carrito en segundos.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
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
      </header>

      {filtered.length > 0 ? (
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((combo) => (
            <ComboCard key={combo.id} combo={combo} />
          ))}
        </section>
      ) : (
        <section className="mt-8 rounded-lg border bg-card p-6">
          <p className="font-medium">Aún no hay productos en esta categoría</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Ya dejamos la estructura lista. ¿Quieres que empecemos a cargar el inventario para “{filterLabel}”?
          </p>
        </section>
      )}
    </main>
  );
}
