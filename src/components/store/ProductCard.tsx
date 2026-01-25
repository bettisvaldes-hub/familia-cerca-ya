import type { Product } from "@/data/products";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart";
import { toast } from "@/components/ui/use-toast";
import { formatUsd } from "@/lib/money";
import { flattenStoreCategories, storeCategories } from "@/data/categories";

const categoryLabelById = new Map(
  flattenStoreCategories(storeCategories).map((c) => [c.id, c.label] as const),
);

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  const badgeLabel = categoryLabelById.get(product.categoryId) ?? "Producto";

  return (
    <Card id={product.id} className="overflow-hidden">
      <div className="aspect-[3/2] overflow-hidden">
        <img
          src={product.image}
          alt={`Imagen del ${product.name}`}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="font-serif text-xl">{product.name}</CardTitle>
          <Badge variant="secondary" className="capitalize">
            {badgeLabel}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        {product.included?.length ? (
          <div>
            <p className="text-sm font-medium">Incluye</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {product.included.slice(0, 6).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="text-lg font-semibold">{formatUsd(product.priceUsd)}</p>
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          variant="cta"
          className="w-full"
          onClick={() => {
            add(product, 1);
            toast({
              title: "Agregado al carrito",
              description: `${product.name} se agregó correctamente.`,
            });
          }}
        >
          Agregar al carrito
        </Button>
      </CardFooter>
    </Card>
  );
}

