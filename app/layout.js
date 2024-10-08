import "./globals.css";
import TranslationProvider from "@/components/TranslationProvider";
import StoreProvider from "@/components/StoreProvider";
import Head from "next/head";

export const metadata = {
  title:
    "Energia Solar Canarias - Instalación de Paneles Solares y Energía Renovable",
  description:
    "Energia Solar Canarias ofrece instalación de paneles solares, energía solar fotovoltaica y soluciones de autoconsumo solar en Tenerife, Gran Canaria, Lanzarote, y más.",
  authors: [{ name: "Energia Solar Canarias" }],
  icons: {
    icon: "/assets/icons/favicon.ico",
    shortcut: "/assets/icons/favicon.ico",
    apple: "/assets/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <TranslationProvider>
          <StoreProvider>{children}</StoreProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
