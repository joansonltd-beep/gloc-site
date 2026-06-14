"use client";

import { createContext, useContext } from "react";
import { buildWhatsAppLink } from "@/config/site";

// Carries Sanity-sourced settings the client CTAs need (the WhatsApp number),
// so no component hardcodes or imports the number directly.
type ClientSettings = { whatsappNumber: string };

const SettingsContext = createContext<ClientSettings>({
  whatsappNumber: "1868XXXXXXX",
});

export function SiteSettingsProvider({
  whatsappNumber,
  children,
}: {
  whatsappNumber: string;
  children: React.ReactNode;
}) {
  return (
    <SettingsContext.Provider value={{ whatsappNumber }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Returns a builder that turns a message into a WhatsApp deep link.
export function useWhatsAppLink(): (message: string) => string {
  const { whatsappNumber } = useContext(SettingsContext);
  return (message: string) => buildWhatsAppLink(whatsappNumber, message);
}
