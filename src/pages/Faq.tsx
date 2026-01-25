import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { useSeo } from "@/hooks/use-seo";

export default function Faq() {
  useSeo({
    title: "FAQ | Preguntas frecuentes",
    description: "Respuestas rápidas sobre pagos, entregas, zonas y soporte al cliente.",
    canonicalPath: "/preguntas",
  });

  return (
    <main className="container py-10">
      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl">Preguntas frecuentes</h1>
        <p className="mt-2 text-muted-foreground">
          Queremos que comprar sea claro y sencillo. Aquí están las respuestas más comunes.
        </p>
      </header>

      <Card className="mt-6">
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="pago">
              <AccordionTrigger>Métodos de pago</AccordionTrigger>
              <AccordionContent>
                Aceptamos tarjetas internacionales, pagos digitales y transferencias. Si necesitas ayuda para pagar desde tu país,
                escríbenos por WhatsApp y te guiamos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tiempos">
              <AccordionTrigger>Tiempos de entrega</AccordionTrigger>
              <AccordionContent>
                La entrega es local dentro del país de destino. El tiempo estimado depende de la zona y disponibilidad, pero
                normalmente coordinamos en 24–72 horas.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="zonas">
              <AccordionTrigger>Zonas de entrega</AccordionTrigger>
              <AccordionContent>
                Cubrimos zonas urbanas principales y algunas áreas cercanas. En el checkout podrás indicar la dirección y
                confirmaremos cobertura antes de despachar.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="productos">
              <AccordionTrigger>Tipos de productos</AccordionTrigger>
              <AccordionContent>
                Trabajamos con combos listos de alimentos y esenciales (higiene/limpieza). Los contenidos pueden variar
                levemente según disponibilidad, manteniendo el valor y categoría del combo.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="soporte">
              <AccordionTrigger>Soporte al cliente</AccordionTrigger>
              <AccordionContent>
                Te acompañamos antes, durante y después de la compra. Puedes contactarnos desde el botón de WhatsApp o en la
                página de contacto.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </main>
  );
}
