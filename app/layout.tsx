import type { Metadata, Viewport } from "next";
import { Cairo, Amiri } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  title: "عطارية فدك | Fadk1",
  description:
    "جميع روابط عطارية فدك — كركوك: واتساب، تيك توك، فيسبوك، انستغرام وموقعنا على الخريطة.",
};

export const viewport: Viewport = {
  themeColor: "#060f0b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}
