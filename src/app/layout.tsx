import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dara Portal",
  description: "Dara News Portal and Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="font-ibm min-h-full bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
