import type { Combo } from "@/data/combos";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart";
import { toast } from "@/components/ui/use-toast";
import { formatUsd } from "@/lib/money";

export function ComboCard({ combo }: { combo: Combo }) {
  const { add } = useCart();

  return (
    <Card id={combo.id} className="overflow-hidden">
      <div className="aspect-[3/2] overflow-hidden">
        <img
          src={combo.image}
          alt={`Imagen del ${combo.name}`}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="font-serif text-xl">{combo.name}</CardTitle>
          <Badge variant="secondary" className="capitalize">
            {combo.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{combo.shortDescription}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium">Incluye</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {combo.included.slice(0, 6).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <p className="text-lg font-semibold">{formatUsd(combo.priceUsd)}</p>
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          variant="cta"
          className="w-full"
          onClick={() => {
            add(combo, 1);
            toast({
              title: "Agregado al carrito",
              description: `${combo.name} se agregó correctamente.`,
            });
          }}
        >
          Agregar al carrito
        </Button>
      </CardFooter>
    </Card>
  );
}
