import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const PHONE_E164 = "1234567890"; // TODO: reemplazar por el WhatsApp real

export function WhatsAppFab() {
  const text = encodeURIComponent(
    "Hola, necesito ayuda para enviar un combo. ¿Me pueden asesorar, por favor?",
  );
  const href = `https://wa.me/${PHONE_E164}?text=${text}`;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button asChild variant="cta" className="shadow-lg">
        <a href={href} target="_blank" rel="noreferrer" aria-label="Soporte por WhatsApp">
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </Button>
    </div>
  );
}
