import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "نظام اختبار الذكاءات المتعددة",
  description: "منصة حديثة لقياس الذكاءات المتعددة وإدارة نتائج الطلاب.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
