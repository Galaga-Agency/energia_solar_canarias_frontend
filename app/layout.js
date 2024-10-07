import "./globals.css";
import Head from "next/head";
import TranslationProvider from "@/components/TranslationProvider";
import StoreProvider from "@/components/StoreProvider";

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
        <link
          rel="icon"
          type="image/png"
          href="/favicon-48x48.png"
          sizes="48x48"
        />
        <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <meta
          name="apple-mobile-web-app-title"
          content="Energia Solar Canarias"
        />
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
