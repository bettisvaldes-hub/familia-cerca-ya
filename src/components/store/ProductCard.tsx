import * as React from "react";
import type { Product } from "@/data/products";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart";
import { toast } from "@/components/ui/use-toast";
import { formatUsd } from "@/lib/money";
import { flattenStoreCategories, storeCategories } from "@/data/categories";
import { useIsMobile } from "@/hooks/use-mobile";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductDetailsBody } from "@/components/store/ProductDetailsBody";

const categoryLabelById = new Map(
  flattenStoreCategories(storeCategories).map((c) => [c.id, c.label] as const),
);

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const [qty, setQty] = React.useState(1);
  const [imageFailed, setImageFailed] = React.useState(false);

  const originalUsd = Math.round((product.priceUsd / 0.95) * 100) / 100;

  const badgeLabel = categoryLabelById.get(product.categoryId) ?? "Producto";

  // Si la imagen falla (404 / ruta incorrecta), lo tratamos como “sin foto” y no mostramos el producto.
  if (imageFailed) return null;

  return (
    <>
      <Card
        id={product.id}
        className="overflow-hidden"
        onClick={(e) => {
          if ((e.target as HTMLElement | null)?.closest("button,a")) return;
          setOpen(true);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.target as HTMLElement | null)?.closest("button,a")) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <div className="relative mx-auto w-full max-w-[500px] aspect-square overflow-hidden bg-muted p-2">
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
            onError={() => {
              // Evita productos con imagen rota en el catálogo (especialmente visible en móvil).
              setImageFailed(true);
              // eslint-disable-next-line no-console
              console.warn("Imagen no encontrada para producto:", product.name, product.image);
            }}
          />
        </div>

        {isMobile ? (
          <>
            <CardContent className="space-y-1 p-4">
              <CardTitle className="font-serif text-base leading-snug line-clamp-2">{product.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{badgeLabel}</p>
              <div className="pt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <p className="text-xs text-muted-foreground line-through">{formatUsd(originalUsd)}</p>
                <p className="text-base font-semibold">{formatUsd(product.priceUsd)}</p>
                <p className="text-[10px] text-muted-foreground">-5%</p>
              </div>
            </CardContent>

            <CardFooter className="gap-2 p-4 pt-0">
              <div className="flex flex-1 items-center overflow-hidden rounded-md border bg-background">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 w-9 rounded-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQty((q) => Math.max(1, q - 1));
                  }}
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex h-9 flex-1 items-center justify-center text-sm font-medium tabular-nums">
                  {qty}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 w-9 rounded-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQty((q) => Math.min(99, q + 1));
                  }}
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                type="button"
                variant="cta"
                size="icon"
                className="h-9 w-9"
                onClick={(e) => {
                  e.stopPropagation();
                  add(product, qty);
                  toast({
                    title: "Agregado al carrito",
                    description: `${product.name} se agregó correctamente.`,
                  });
                }}
                aria-label="Agregar al carrito"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="font-serif text-xl">{product.name}</CardTitle>
                <Badge variant="secondary" className="capitalize">
                  {badgeLabel}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
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
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="text-sm text-muted-foreground line-through">{formatUsd(originalUsd)}</p>
                <p className="text-lg font-semibold">{formatUsd(product.priceUsd)}</p>
                <p className="text-xs text-muted-foreground">-5%</p>
              </div>
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
          </>
        )}
      </Card>

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="font-serif">{product.name}</DrawerTitle>
              <DrawerDescription>{badgeLabel}</DrawerDescription>
            </DrawerHeader>

            <ProductDetailsBody product={product} badgeLabel={badgeLabel} />

            <DrawerFooter>
              <Button
                variant="cta"
                onClick={() => {
                  add(product, 1);
                  toast({
                    title: "Agregado al carrito",
                    description: `${product.name} se agregó correctamente.`,
                  });
                  setOpen(false);
                }}
              >
                Agregar al carrito
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cerrar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif">{product.name}</DialogTitle>
              <DialogDescription>{badgeLabel}</DialogDescription>
            </DialogHeader>

            <ProductDetailsBody product={product} badgeLabel={badgeLabel} />

            <DialogFooter>
              <Button
                variant="cta"
                onClick={() => {
                  add(product, 1);
                  toast({
                    title: "Agregado al carrito",
                    description: `${product.name} se agregó correctamente.`,
                  });
                  setOpen(false);
                }}
              >
                Agregar al carrito
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cerrar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

