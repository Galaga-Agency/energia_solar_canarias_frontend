import "./globals.css";
import Head from "next/head";
import TranslationProvider from "@/components/TranslationProvider";

export const metadata = {
  title: "Energia Solar Canarias",
  description:
    "Energia Solar Canarias ofrece instalación de paneles solares, energía solar fotovoltaica y soluciones de autoconsumo solar en Tenerife, Gran Canaria, Lanzarote, y más.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Energia Solar Canarias ofrece instalación de paneles solares, energía solar fotovoltaica y soluciones de autoconsumo solar en Tenerife, Gran Canaria, Lanzarote, y más."
        />
        <meta name="author" content="Energia Solar Canarias" />
        <title>
          Energia Solar Canarias - Instalación de Paneles Solares y Energía
          Renovable
        </title>
        <link rel="icon" href="/icon.png" sizes="any" />
      </Head>

      <body>
        <TranslationProvider>{children}</TranslationProvider>
      </body>
    </html>
  );
}
