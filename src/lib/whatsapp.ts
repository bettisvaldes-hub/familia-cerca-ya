// Centraliza URLs de WhatsApp para que FAB + checkout generen el mismo formato.
// TODO: Reemplazar por tu WhatsApp real en formato E.164 (solo dígitos), ej: "584121234567".
export const WHATSAPP_PHONE_E164 = "1234567890";

export function buildWhatsAppHref(message: string, phoneE164: string = WHATSAPP_PHONE_E164) {
  const text = encodeURIComponent(message.trim().slice(0, 2000));
  return `https://wa.me/${phoneE164}?text=${text}`;
}
