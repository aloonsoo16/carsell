import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Provider from "@/context/provider";

export const metadata = {
  title: "Carsell - Alonso Mangas",
  description: "Proyecto de Alonso Mangas Alfayate",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-screen">
        <Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
           {children}
            <Toaster className={GeistSans.className} />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}


