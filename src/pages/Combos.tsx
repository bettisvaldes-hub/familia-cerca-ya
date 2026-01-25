import { useMemo, useState } from "react";
import { combos, categoryLabels, type ComboCategory } from "@/data/combos";
import { ComboCard } from "@/components/store/ComboCard";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";

const categories: Array<{ key: ComboCategory | "all"; label: string }> = [
  { key: "all", label: "Todos" },
  { key: "economicos", label: categoryLabels.economicos },
  { key: "familiares", label: categoryLabels.familiares },
  { key: "premium", label: categoryLabels.premium },
];

export default function Combos() {
  useSeo({
    title: "Combos | Catálogo en USD",
    description:
      "Explora combos económicos, familiares y premium. Agrega al carrito y completa el pago en 3 pasos.",
    canonicalPath: "/combos",
  });

  const [filter, setFilter] = useState<ComboCategory | "all">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return combos;
    return combos.filter((c) => c.category === filter);
  }, [filter]);

  return (
    <main className="container py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl">Tienda · Combos listos</h1>
          <p className="mt-2 text-muted-foreground">
            Elige un combo, agrégalo al carrito y envía alimentos hoy.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c.key}
              variant={filter === c.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(c.key)}
              className="whitespace-nowrap"
            >
              {c.label}
            </Button>
          ))}
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((combo) => (
          <ComboCard key={combo.id} combo={combo} />
        ))}
      </section>
    </main>
  );
}
