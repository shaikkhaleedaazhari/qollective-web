import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  weight: ["100", "500", "400"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Qollective",
  description: "Qollective is a collaborative web-based question bank platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryProvider>
        <body className={`${inter.className} ${poppins.variable}`}>
          {children}
        </body>
      </QueryProvider>
    </html>
  );
}
