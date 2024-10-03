// import localFont from "next/font/local";
import "./globals.css";
import Head from "next/head"; // Import Head for meta tags

// Uncomment these if needed
// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// Export metadata if using static metadata support (optional)
export const metadata = {
  title: "Energia Solar Canarias",
  description: "Energia Solar Canarias ofrece instalación de paneles solares, energía solar fotovoltaica y soluciones de autoconsumo solar en Tenerife, Gran Canaria, Lanzarote, y más.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      {/* Meta tags for SEO */}
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Energia Solar Canarias ofrece instalación de paneles solares, energía solar fotovoltaica y soluciones de autoconsumo solar en Tenerife, Gran Canaria, Lanzarote, y más. Aprovecha la energía renovable y limpia con nuestros sistemas solares."
        />
        <meta
          name="keywords"
          content="energía solar Canarias, instalación de paneles solares Canarias, energía renovable Canarias, energía solar fotovoltaica Canarias, empresas de energía solar Canarias, sistemas solares para hogares en Canarias, energía limpia Canarias, autoconsumo solar Canarias, instaladores de paneles solares en Canarias, paneles solares para empresas en Canarias, energía solar en Tenerife, energía solar en Gran Canaria, energía solar en Las Palmas, instalación de paneles solares en Tenerife, energía renovable en La Palma, paneles solares en Fuerteventura, instalaciones solares en Lanzarote, ahorro con energía solar Canarias, reducción de factura eléctrica con energía solar, subvenciones para energía solar Canarias, mantenimiento de paneles solares Canarias, financiación para energía solar Canarias, beneficios de la energía solar en Canarias, sistemas fotovoltaicos Canarias, energía solar residencial en Canarias, energía solar para empresas en Canarias, instaladores certificados de energía solar, proyectos solares a medida Canarias, energía verde Canarias, sostenibilidad y energía solar Canarias, protección del medio ambiente con energía solar, transición a energía solar Canarias"
        />
        <meta name="author" content="Energia Solar Canarias" />
        <title>Energia Solar Canarias - Instalación de Paneles Solares y Energía Renovable</title>
      </Head>

      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
