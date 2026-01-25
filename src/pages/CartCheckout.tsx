import { useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { useCart } from "@/context/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useSeo } from "@/hooks/use-seo";
import { formatUsd } from "@/lib/money";

const recipientSchema = z.object({
  nombre: z.string().trim().min(2, "Nombre requerido").max(80),
  telefono: z.string().trim().min(6, "Teléfono requerido").max(30),
  direccion: z.string().trim().min(10, "Dirección requerida").max(160),
  ciudad: z.string().trim().min(2, "Ciudad requerida").max(80),
  referencia: z.string().trim().max(160).optional().or(z.literal("")),
});

type RecipientValues = z.infer<typeof recipientSchema>;

type Step = 1 | 2 | 3;
type PayMethod = "tarjeta" | "digital" | "transferencia";

export default function CartCheckout() {
  useSeo({
    title: "Carrito y Checkout | Envío en 3 pasos",
    description: "Revisa tu carrito, ingresa datos del destinatario y elige método de pago.",
    canonicalPath: "/carrito",
  });

  const { items, subtotalUsd, setQty, remove, clear } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [pay, setPay] = useState<PayMethod>("tarjeta");

  const form = useForm<RecipientValues>({
    resolver: zodResolver(recipientSchema),
    defaultValues: { nombre: "", telefono: "", direccion: "", ciudad: "", referencia: "" },
  });

  const estimated = useMemo(() => {
    if (items.length === 0) return "—";
    return "24–72 horas";
  }, [items.length]);

  const goNextFromCart = () => {
    if (items.length === 0) {
      toast({ title: "Tu carrito está vacío", description: "Elige un combo para continuar." });
      return;
    }
    setStep(2);
  };

  const goNextFromRecipient = async () => {
    const ok = await form.trigger();
    if (!ok) return;
    setStep(3);
  };

  const placeOrder = () => {
    const values = form.getValues();
    // Demo: en producción esto iría a backend (Cloud) + procesamiento de pago.
    toast({
      title: "Pedido confirmado (demo)",
      description: `Avisaremos a ${values.nombre} y coordinaremos entrega.`,
    });
    clear();
    setStep(1);
    form.reset();
  };

  return (
    <main className="container py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl">Carrito y Checkout</h1>
          <p className="mt-2 text-muted-foreground">Proceso simple en 3 pasos: Carrito · Destinatario · Pago</p>
        </div>

        <div className="flex gap-2">
          <StepChip active={step === 1} label="1. Carrito" />
          <StepChip active={step === 2} label="2. Destinatario" />
          <StepChip active={step === 3} label="3. Pago" />
        </div>
      </header>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Tu carrito</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.length === 0 ? (
                  <div className="rounded-lg border bg-background p-4">
                    <p className="font-medium">Aún no has agregado combos.</p>
                    <p className="mt-1 text-sm text-muted-foreground">Explora la tienda y elige el mejor para tu familia.</p>
                    <Button asChild variant="cta" className="mt-4">
                      <Link to="/combos">Ver combos</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((it) => (
                      <div key={it.comboId} className="flex gap-3 rounded-lg border bg-background p-3">
                        <img
                          src={it.image}
                          alt={`Imagen del ${it.name}`}
                          className="h-16 w-24 rounded-md object-cover"
                          loading="lazy"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{it.name}</p>
                          <p className="text-sm text-muted-foreground">{formatUsd(it.priceUsd)} USD</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Label htmlFor={`qty-${it.comboId}`} className="text-sm text-muted-foreground">
                              Cantidad
                            </Label>
                            <Input
                              id={`qty-${it.comboId}`}
                              type="number"
                              inputMode="numeric"
                              min={1}
                              max={99}
                              value={it.quantity}
                              onChange={(e) => setQty(it.comboId, Number(e.target.value))}
                              className="h-9 w-20"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => remove(it.comboId)}
                              className="h-9"
                            >
                              Quitar
                            </Button>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-medium">{formatUsd(it.priceUsd * it.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button variant="outline" onClick={() => clear()} disabled={items.length === 0}>
                    Vaciar
                  </Button>
                  <Button variant="cta" onClick={goNextFromCart}>
                    Continuar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Datos del destinatario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Nombre" error={form.formState.errors.nombre?.message}>
                    <Input {...form.register("nombre")} placeholder="Ej: María Pérez" />
                  </Field>
                  <Field label="Teléfono" error={form.formState.errors.telefono?.message}>
                    <Input {...form.register("telefono")} placeholder="Ej: +58 000 000 0000" />
                  </Field>
                </div>
                <Field label="Dirección" error={form.formState.errors.direccion?.message}>
                  <Input {...form.register("direccion")} placeholder="Calle, número, apartamento" />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Ciudad" error={form.formState.errors.ciudad?.message}>
                    <Input {...form.register("ciudad")} placeholder="Ej: Caracas" />
                  </Field>
                  <Field label="Referencia (opcional)" error={form.formState.errors.referencia?.message}>
                    <Input {...form.register("referencia")} placeholder="Ej: Cerca del mercado" />
                  </Field>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Volver
                  </Button>
                  <Button variant="cta" onClick={goNextFromRecipient}>
                    Continuar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-background p-4">
                  <p className="font-medium">Métodos disponibles</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tarjetas internacionales · Pagos digitales · Transferencias
                  </p>
                  <Separator className="my-4" />

                  <RadioGroup value={pay} onValueChange={(v) => setPay(v as PayMethod)} className="grid gap-3">
                    <PayOption value="tarjeta" label="Tarjeta internacional" description="Visa, Mastercard, etc." />
                    <PayOption value="digital" label="Pago digital" description="Proveedores según país." />
                    <PayOption value="transferencia" label="Transferencia" description="Te compartimos los datos al confirmar." />
                  </RadioGroup>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Volver
                  </Button>
                  <Button variant="cta" onClick={placeOrder}>
                    Confirmar pedido
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatUsd(subtotalUsd)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Entrega estimada</span>
                <span className="font-medium">{estimated}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="text-base font-semibold">{formatUsd(subtotalUsd)}</span>
              </div>
              <p className="rounded-lg border bg-background p-3 text-xs text-muted-foreground">
                Nota: este checkout es una demo lista para conectar a pagos reales. El soporte por WhatsApp está siempre visible.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">¿Necesitas ayuda?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Si estás en el extranjero y quieres confirmar cobertura o tiempo de entrega, escríbenos por WhatsApp.
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function StepChip({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={
        active
          ? "rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
          : "rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground"
      }
    >
      {label}
    </span>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function PayOption({
  value,
  label,
  description,
}: {
  value: PayMethod;
  label: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border bg-background p-3">
      <RadioGroupItem value={value} id={value} className="mt-1" />
      <div className="space-y-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </label>
  );
}
