import React from "react";
import "./globals.css";
import TranslationProvider from "@/locales/TranslationProvider";
import StoreProvider from "@/components/StoreProvider";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import ThemeWrapper from "@/components/ThemeWrapper";
import { Toaster } from "sonner";
import AuthWrapper from "@/components/AuthWrapper";

export const metadata = {
  title:
    "Energia Solar Canarias - Instalación de Paneles Solares y Energía Renovable",
  description:
    "Energia Solar Canarias ofrece instalación de paneles solares, energía solar fotovoltaica y soluciones de autoconsumo solar en Tenerife, Gran Canaria, Lanzarote, y más.",
  authors: [{ name: "Energia Solar Canarias" }],
  icons: {
    icon: "/assets/icons/favicon.ico",
    shortcut: "/assets/icons/maskable-icon.png",
    apple: "/assets/icons/maskable-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta
          name="apple-mobile-web-app-title"
          content="Energia Solar Canarias"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content="Energia Solar Canarias"
        />
        <link rel="apple-touch-icon" href="/assets/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Energia Solar Canarias" />
        <meta
          name="apple-mobile-web-app-title"
          content="Energia Solar Canarias"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-navbutton-color" content="#000000" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="msapplication-starturl" content="/" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </head>
      <body>
        <StoreProvider>
          <ThemeWrapper>
            <TranslationProvider>
              <AuthWrapper>
                {children}
                <Toaster
                  position="top-center"
                  theme="system"
                  richColors
                  closeButton
                  toastOptions={{
                    className: "dark:bg-custom-dark-blue dark:text-white",
                    duration: 3000,
                  }}
                />
              </AuthWrapper>
            </TranslationProvider>
          </ThemeWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
