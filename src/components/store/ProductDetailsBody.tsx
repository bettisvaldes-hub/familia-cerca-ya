import type { Product } from "@/data/products";
import { formatUsd } from "@/lib/money";
import { Badge } from "@/components/ui/badge";

export function ProductDetailsBody({
  product,
  badgeLabel,
}: {
  product: Product;
  badgeLabel: string;
}) {
  const originalUsd = Math.round((product.priceUsd / 0.95) * 100) / 100;

  return (
    <div className="px-4">
      <div className="relative mx-auto w-full max-w-[500px] aspect-square overflow-hidden rounded-lg border bg-muted p-2">
        <Badge
          variant="secondary"
          className="absolute left-3 top-3 z-10 px-3 py-1 text-sm font-semibold tracking-wide"
        >
          OFERTA -5%
        </Badge>
        <img
          src={product.image}
          alt={`Imagen del ${product.name}`}
          className="h-full w-full object-contain"
          loading="lazy"
          onError={(e) => {
            // En detalle, si la imagen no existe, mostramos placeholder para evitar “cuadro roto”.
            (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{product.shortDescription}</p>

      {product.included?.length ? (
        <div className="mt-4">
          <p className="text-sm font-medium">Incluye</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {product.included.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-sm text-muted-foreground line-through">{formatUsd(originalUsd)}</p>
        <p className="text-lg font-semibold">{formatUsd(product.priceUsd)}</p>
        <p className="text-xs text-muted-foreground">-5%</p>
      </div>
      <p className="sr-only">Categoría: {badgeLabel}</p>
    </div>
  );
}
