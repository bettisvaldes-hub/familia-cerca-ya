import type { Product } from "@/data/products";
import { formatUsd } from "@/lib/money";

export function ProductDetailsBody({
  product,
  badgeLabel,
}: {
  product: Product;
  badgeLabel: string;
}) {
  return (
    <div className="px-4">
      <div className="mx-auto w-full max-w-[500px] aspect-square overflow-hidden rounded-lg border bg-muted">
        <img
          src={product.image}
          alt={`Imagen del ${product.name}`}
          className="h-full w-full object-contain p-2"
          loading="lazy"
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

      <p className="mt-4 text-lg font-semibold">{formatUsd(product.priceUsd)}</p>
      <p className="sr-only">Categoría: {badgeLabel}</p>
    </div>
  );
}
